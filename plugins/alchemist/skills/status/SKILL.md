---
name: status
description: Show your Olbrain account, active organisation and Alchemist builds, with any cards waiting on you.
disable-model-invocation: true
allowed-tools:
  - mcp__plugin_alchemist_alchemist__whoami
  - mcp__plugin_alchemist_alchemist__alchemist_builds
  - mcp__plugin_alchemist_alchemist__alchemist_build
  - mcp__plugin_alchemist_alchemist__alchemist_state
---

Show the user where things stand in Alchemist:

1. Call `whoami`: who they are signed in as and the active organisation.
2. Call `alchemist_builds`: list the builds by `label`, in the order returned (waiting
   and running first; say how long a `stale` one has waited). Group `idle` builds (no agent yet) on one line each at the end. They can hold an
   unfinished interview, so never call them empty.
3. For each build with a card waiting or a turn running, call `alchemist_build` and
   show any open cards with their title and `responses`. If `alchemist_state` is in your
   tool list, also call it for that build and give its next step in one line; if it replies
   that the build uses `alchemist`, skip that line.

For a waiting card, follow the alchemist skill: it says when you may answer it and
when to ask the user.
