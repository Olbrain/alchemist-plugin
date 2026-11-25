# Claude Code PostToolUse hook on Alchemist's step tools. When a step's result says the build moved to a new
# phase, show the user that sentence ("Now in phase 2 of 5, Build. ..."). Claude itself won't relay it: it reads
# "tell the user" inside a tool result as data, and kept it to its thinking in every live test (Nov 25).
# Prints nothing for any other result. POSIX awk: fast on large results, and on macOS, Linux and Git for Windows.
BEGIN { RS = "\001" }
{ s = s $0 }
END {
  # Only the tool's result counts, never the arguments Claude sent (tool_input). A key inside a JSON string has
  # its quotes escaped, so a bare "tool_response": or "tool_input": can only be the event's own key; the result is
  # after the last "tool_response":.
  k = "\"tool_response\":"; at = 0; t = s
  while ((i = index(t, k)) > 0) { at += i + length(k) - 1; t = substr(t, i + length(k)) }
  if (!at) exit
  r = substr(s, at + 1)
  if ((i = index(r, "\"tool_input\":")) > 0) r = substr(r, 1, i - 1)
  # The result is JSON text inside the event, so its own fields look like \"next\": \"...\". Outside text
  # (customers, emails, test replies) is always {"untrusted": text} there, never a bare string after "next":.
  start = "\\\"next\\\": \\\"The build has moved to a new phase. "
  if (!(i = index(r, start))) exit
  r = substr(r, i + length(start))
  if (!(i = index(r, "will do:\\\\n"))) exit
  r = substr(r, i + length("will do:\\\\n"))
  if (!(i = index(r, "\\\\nRead the build"))) exit
  r = substr(r, 1, i - 1)
  # Undo the outer escaping, leaving the sentence as the result's own JSON string content.
  q = ""
  for (i = 1; i <= length(r); i++) {
    c = substr(r, i, 1)
    if (c == "\\") { d = substr(r, i + 1, 1); q = q (d == "\\" || d == "\"" ? d : c d); i++ } else q = q c
  }
  # Write it out again from scratch: line breaks as "; ", double quotes as ', \uXXXX kept (accents), every other
  # escape and control character dropped. Nothing in it can end the message string.
  out = ""
  for (i = 1; i <= length(q); i++) {
    c = substr(q, i, 1)
    if (c == "\\") {
      d = substr(q, i + 1, 1); h = substr(q, i + 2, 4)
      if (d == "n") out = out "; "
      else if (d == "\"") out = out "'"
      else if (d == "u" && h ~ /^[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]$/) { out = out "\\u" h; i += 4 }
      i++
    } else if (c == "\"") out = out "'"
    else if (c !~ /[[:cntrl:]]/) out = out c
  }
  if (out != "") printf "{\"systemMessage\": \"%s\"}\n", out
}
