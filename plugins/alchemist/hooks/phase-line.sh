#!/usr/bin/env bash
# Claude Code PostToolUse hook on Alchemist's step tools. When a step's result says the build moved to a new
# phase, show the user that sentence ("Now in phase 2 of 5, Build. ..."). Claude itself won't relay it: it reads
# "tell the user" inside a tool result as data, and kept it to its thinking in every live test (Nov 25).
# Prints nothing for any other result. Bash only, so it runs wherever Claude Code runs hooks.
in=$(cat)
case "$in" in *"The build has moved to a new phase."*"will do:"*"Read the build"*) ;; *) exit 0 ;; esac
p=${in#*The build has moved to a new phase.}
p=${p#*will do:}
p=${p%%Read the build*}
# The result reaches the hook as a JSON string inside JSON: undo the outer escaping, which leaves the sentence as
# JSON string content, then put the line breaks between agents' sentences on one line.
p=${p//'\\'/$'\001'}
p=${p//'\"'/'"'}
p=${p//$'\001'/'\'}
p=${p//'\n'/ }
p="${p#"${p%%[! ]*}"}"
p="${p%"${p##*[! ]}"}"
[ -n "$p" ] && printf '{"systemMessage": "%s"}\n' "$p"
exit 0
