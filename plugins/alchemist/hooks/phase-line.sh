#!/usr/bin/env bash
# Claude Code PostToolUse hook on Alchemist's step tools. When a step's result says the build moved to a new
# phase, show the user that sentence ("Now in phase 2 of 5, Build. ..."). Claude itself won't relay it: it reads
# "tell the user" inside a tool result as data, and kept it to its thinking in every live test (Nov 25).
# Prints nothing for any other result. Bash only, so it runs wherever Claude Code runs hooks.
#
# The result arrives as JSON text inside the event's JSON, so its own fields look like \"next\": \"...\". Only the
# result's `next` field is read: text from outside (customers, emails, test replies) sits inside a string there,
# its quotes escaped once more (\\\"), so it can never match the start below and can't fake a phase.
in=$(cat)
start='\"next\": \"The build has moved to a new phase. '
case "$in" in *"$start"*'will do:\\n'*'\\nRead the build'*) ;; *) exit 0 ;; esac
p=${in#*"$start"}
p=${p#*'will do:\\n'}
p=${p%%'\\nRead the build'*}
# Undo the outer escaping: what is left is the sentence as JSON string content (escaped quotes, accents and the
# line break between two agents' sentences kept), so it goes into the message as it is.
p=${p//'\\'/$'\001'}
p=${p//'\"'/'"'}
p=${p//$'\001'/'\'}
[ -n "$p" ] && printf '{"systemMessage": "%s"}\n' "$p"
exit 0
