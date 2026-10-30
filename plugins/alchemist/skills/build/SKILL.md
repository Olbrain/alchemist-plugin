---
name: build
description: Start building an Olbrain agent with Alchemist from a description. Use only when the user asks to start a build.
argument-hint: <what the agent should do>
disable-model-invocation: true
allowed-tools:
  - mcp__plugin_alchemist_alchemist__whoami
  - mcp__plugin_alchemist_alchemist__alchemist_builds
  - mcp__plugin_alchemist_alchemist__alchemist_build
  - mcp__plugin_alchemist_alchemist__alchemist_capabilities
  - mcp__plugin_alchemist_alchemist__alchemist_state
---

Build an Olbrain agent with Alchemist, following the alchemist skill: check `whoami` first,
then find or start the build with the `alchemist` tool, passing the request in the user's
words. If `alchemist_state` is in your tool list, call it and follow it; otherwise follow the
`alchemist` tool's turns.

Request: $ARGUMENTS

If the request above is empty, or still reads `$ARGUMENTS`, use what the user asked for in
their message. If there is nothing, ask the user what the agent should do before calling any tool.
