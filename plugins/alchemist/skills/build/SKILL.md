---
name: build
description: Start building an Olbrain agent with Alchemist from a description.
argument-hint: <what the agent should do>
disable-model-invocation: true
allowed-tools:
  - mcp__plugin_alchemist_alchemist__whoami
  - mcp__plugin_alchemist_alchemist__alchemist_builds
  - mcp__plugin_alchemist_alchemist__alchemist_build
  - mcp__plugin_alchemist_alchemist__alchemist_capabilities
---

Build an Olbrain agent with Alchemist, following the alchemist skill: check `whoami`
first, then pass this request to the `alchemist` tool in the user's words.

Request: $ARGUMENTS

If the request is empty, ask the user what the agent should do before calling any tool.
