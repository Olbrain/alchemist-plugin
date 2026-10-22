---
name: status
description: Show your Olbrain account, active organisation and Alchemist builds, with any cards waiting on you.
disable-model-invocation: true
allowed-tools:
  - mcp__plugin_alchemist_alchemist__whoami
  - mcp__plugin_alchemist_alchemist__alchemist_builds
  - mcp__plugin_alchemist_alchemist__alchemist_build
---

Show the user where things stand in Alchemist:

1. Call `whoami`: who they are signed in as and the active organisation.
2. Call `alchemist_builds`: list the builds, newest first, with title and status.
3. For the newest build that is running or waiting, call `alchemist_build` and show
   any open cards with their title and `responses`.

Do not answer any card. If one is waiting, ask the user what they want to do, and
follow the alchemist skill.
