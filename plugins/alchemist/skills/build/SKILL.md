---
name: build
description: Start building an Olbrain agent with Alchemist from a description.
argument-hint: <what the agent should do>
disable-model-invocation: true
---

Build an Olbrain agent with Alchemist, following the alchemist skill: check `whoami`
first, then pass this request to the `alchemist` tool in the user's words.

Request: $ARGUMENTS

If the request is empty, ask the user what the agent should do before calling any tool.
