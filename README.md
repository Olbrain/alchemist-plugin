# Alchemist

Build, test and publish [Olbrain](https://olbrain.com) AI agents from Claude Code,
Codex or claude.ai. You describe the agent; Alchemist, Olbrain's agent builder, plans
it, builds it, tests it and asks you before anything goes live.

## Install

### Claude Code

```
/plugin marketplace add Olbrain/alchemist-plugin
/plugin install alchemist@alchemist
```

Then run `/mcp`, pick **alchemist** and sign in with your Olbrain account. New to
Olbrain? Choose **Create account** on the sign-in page.

### Codex

```
codex mcp add alchemist --url https://alchemist.olbrain.com/mcp/
codex mcp login alchemist
```

Optional: copy `plugins/alchemist/skills/alchemist` to `~/.agents/skills/alchemist` so
Codex follows the same workflow as Claude.

### claude.ai and Claude Code on the web

Add a custom connector with the URL `https://alchemist.olbrain.com/mcp/`
(Customize → Connectors → Add custom connector; on Team and Enterprise plans an owner
adds it under Organization settings → Connectors). Then click **Connect** and sign in.

## Use it

- Ask in plain words: "Use Alchemist to build an agent that answers questions about
  our pricing and hands refunds to a person."
- `/alchemist:build <what the agent should do>` starts a build.
- "Put my support agent on my website" or "call my intake job when our signup form is
  sent": Claude adds the chat snippet, or a server route that calls the agent, to your
  project. It never puts your API key in browser code.
- `/alchemist:status` shows your account, organisation, builds and any cards waiting
  on you.

Before Alchemist publishes an agent, makes it live, merges agents or changes how one
behaves, it stops with an approval card. Claude shows you the card and waits for your
choice, and Claude Code asks your permission before sending it.

## Tools

| Tool               | What it does                                                   |
| ------------------ | -------------------------------------------------------------- |
| `whoami`           | Who you are signed in as, and your organisations               |
| `create_org`       | Create an organisation and make it active                      |
| `select_org`       | Switch your active organisation (everywhere you are signed in) |
| `list_members`     | Who is in your organisation                                    |
| `alchemist`        | One builder turn: describe or continue a build                 |
| `alchemist_answer` | Send your choice on an approval card                           |
| `alchemist_builds` | List your builds                                               |
| `alchemist_build`  | One build: its plan, agents and waiting cards                  |
| `alchemist_stop`   | Stop the turn a build is running                               |
| `alchemist_connect` | Put a live agent on your website or call it from your code    |

Inviting people and joining an organisation happen in
[Noesis](https://noesis.olbrain.com). Every build can also be opened there.

## Privacy

Every tool call goes to `https://alchemist.olbrain.com`, which acts as you in Olbrain. It
keeps your Olbrain sign-in encrypted so you stay signed in, and you can end that at any
time by removing the connection.

Once an agent is live, its go-live steps call Olbrain's agent API at
`https://webhook.olbrain.com` with your organisation's API key: to test it, upload a
file for a job, start a job, or from the server route Claude adds to your app. You run
those commands yourself, and the key stays in your own environment.

Olbrain's privacy policy: [olbrain.com/privacy.html](https://olbrain.com/privacy.html).

## Licence

Copyright Olbrain. All rights reserved.
