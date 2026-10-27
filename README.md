<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/olbrain-mark-light.png">
    <img src="assets/olbrain-mark-dark.png" alt="Olbrain" width="64">
  </picture>
</p>

<h1 align="center">Alchemist</h1>

<p align="center"><code>OLBRAIN · AGENT BUILDER</code></p>

<p align="center">
  Build, test and publish <a href="https://olbrain.com">Olbrain</a> AI agents from Claude Code, Codex or claude.ai.<br>
  You describe the agent. Alchemist plans it, builds it, tests it — and asks you before anything goes live, unless you let Claude decide.
</p>

<p align="center">
  <a href="#install"><img alt="Claude Code plugin" src="https://img.shields.io/badge/Claude_Code-plugin-000000?style=flat-square"></a>
  <a href="#codex"><img alt="Codex" src="https://img.shields.io/badge/Codex-MCP-000000?style=flat-square"></a>
  <a href="#claudeai-and-claude-code-on-the-web"><img alt="claude.ai connector" src="https://img.shields.io/badge/claude.ai-connector-000000?style=flat-square"></a>
  <a href="https://alchemist.olbrain.com/mcp/"><img alt="MCP: streamable HTTP" src="https://img.shields.io/badge/MCP-streamable_HTTP-000000?style=flat-square"></a>
</p>

<p align="center">
  <a href="#install">Install</a> ·
  <a href="#how-a-build-works">How a build works</a> ·
  <a href="#capabilities">Capabilities</a> ·
  <a href="#commands-and-tools">Tools</a> ·
  <a href="#privacy-and-security">Privacy</a> ·
  <a href="https://docs.olbrain.com">Docs</a>
</p>

---

## What it is

Alchemist is Olbrain's agent builder, available as an MCP server and a Claude Code plugin.
You tell Claude what the agent should do, in plain words. Alchemist's own model works out
what kind of agent it is, plans it, builds it in your Olbrain organisation, tests it on real
inputs and publishes it. Claude carries your decisions back and forth.

Every agent it builds runs on Olbrain and stays visible in
[Noesis](https://noesis.olbrain.com), Olbrain's console, where your team can open, review
and change it.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/diagram-team-dark.png">
    <img src="assets/diagram-team-light.png" alt="Diagram of Olbrain's First Agent team: WhatsApp and website chat reach one front door, which asks four specialist agents: Pre-Sales, Investor Relations, Media Relations and Technical Support" width="880">
  </picture>
  <br>
  <sub>Olbrain's own front door, built with Alchemist: one team of agents on WhatsApp and website chat.</sub>
</p>

## Install

### Claude Code

```
/plugin marketplace add Olbrain/alchemist-plugin
/plugin install alchemist@alchemist
```

Then run `/mcp`, pick **alchemist** and sign in with your Olbrain account. New to Olbrain?
Choose **Create account** on the sign-in page.

### Codex

```
codex mcp add alchemist --url https://alchemist.olbrain.com/mcp/
codex mcp login alchemist
```

Optional: copy `plugins/alchemist/skills/alchemist` to `~/.agents/skills/alchemist` so Codex
follows the same workflow as Claude.

### claude.ai and Claude Code on the web

Add a custom connector with the URL `https://alchemist.olbrain.com/mcp/`
(Customize → Connectors → Add custom connector; on Team and Enterprise plans an owner adds it
under Organization settings → Connectors). Then click **Connect** and sign in.

## How a build works

| Stage | What happens | Your call |
| --- | --- | --- |
| `01`&nbsp;Brief | Alchemist restates what you asked for: who the agent serves, what it does, what it must not do. | Approve or change it |
| `02`&nbsp;Plan | The agents, steps, channels and tools it will build. | Approve or change it |
| `03`&nbsp;Build | It writes the agent, connects its tools and knowledge, and reviews the setup for gaps and contradictions. | Sign in to tools or add keys when a card asks |
| `04`&nbsp;Test | It writes tests and runs them on the draft. A job gets a live run on a real input first. | Run the live test, or not yet |
| `05`&nbsp;Publish | The tested version is published, with a 30-day free trial for a new agent. | Publish, or not yet |
| `06`&nbsp;Go&nbsp;live | Embed code, API and SDK steps, or the channel it answers on. | You run the commands |

Before Alchemist publishes an agent, makes it live, merges agents or changes how one behaves,
it stops with an **approval card**. You decide how many of these Claude answers for you:
tell it in the chat, or put it in your `CLAUDE.md` or `AGENTS.md`, for example *"Approve
plans and tests yourself; ask me before publishing."* If you haven't said, Claude answers
every card itself in auto mode (Codex: running without approvals) and asks you otherwise.
It still asks for what only you can do, like sharing a Drive folder or a browser step.

## Use it

- Ask in plain words: *"Use Alchemist to build an agent that answers questions about our
  pricing and hands refunds to a person."*
- `/alchemist:build <what the agent should do>` starts a build.
- `/alchemist:status` shows your account, organisation, builds and any cards waiting on you.
- *"Put my support agent on my website"* or *"call my intake job when our signup form is
  sent"*: Claude adds the chat snippet, or a server route that calls the agent, to your
  project. It never puts your API key in browser code.
- *"Show me my support agent"*: Claude draws it as a read-only diagram (example below).
- *"What can Alchemist do?"* or *"Can it answer calls on our phone number?"*: Claude checks
  the live capability list before saying yes or no.
- *"Where is my ticket TKT-…?"* or *"Raise a ticket: our webhook job didn't run"*: Alchemist
  handles your Olbrain support tickets in the same session.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/diagram-chat-dark.png">
    <img src="assets/diagram-chat-light.png" alt="Diagram of the Myra chat agent: it hears from website chat, WhatsApp and Slack, checks its guardrails, consults its knowledge file and replies" width="880">
  </picture>
  <br>
  <sub>A chat agent's diagram: where it hears from, what it checks, what it consults and how it ends.</sub>
</p>

## Capabilities

A snapshot of what Alchemist builds today. The live list is always one question away: ask
Claude *"What can Alchemist do?"* and it reads `alchemist_capabilities`.

### Agents

You don't pick a type. Describe the work; Alchemist decides.

| Agent | What it is |
| --- | --- |
| **Chat agent** | One person talks to it, turn by turn, in chat or by voice. |
| **Automatic job** | Runs by itself with nobody talking to it. Steps can wait hours or days, stop for a named person's approval (with reminders), call APIs and tools, and notify people. |
| **Team of agents** | One front door hands each question to the specialist that owns it, and can start automatic jobs. Customers reach it on website chat or WhatsApp. |
| **Research agent** | A person asks for a report in Noesis; it researches the sources and emails the report. A scheduled job can run it too. |

### What starts a job

| Trigger | Detail |
| --- | --- |
| **Schedule** | In your words and your time zone. Runs can be moved, added, paused, resumed or removed later. |
| **Webhook** | Another system calls it. See the signed senders below. |
| **Email** | An email to the job's own address, from 1 to 50 allowed senders (addresses or company domains). |
| **A team** | The team's front door, when a conversation calls for it, with a daily run limit. |
| **A new file** | In a Google Drive folder shared with Olbrain, a Google Cloud Storage or Amazon S3 bucket folder Olbrain can read, or a Dropbox folder your organisation connects. OneDrive is coming. |

**Webhook senders**, each with its signature checked: Stripe, Shopify, GitHub, Razorpay,
Typeform, any [Standard Webhooks](https://www.standardwebhooks.com) sender (Svix-based, such
as Clerk or Resend), Olbrain's shared secret, or a system holding your organisation's
access key.

### Channels

| Channel | Connected by |
| --- | --- |
| **Website chat** | Alchemist — an embed code for your site, with signed-in visitors supported |
| **WhatsApp** | Alchemist — an existing number, or a new one added through Meta's own window |
| **Shopify storefront chat** | Alchemist — a theme app embed |
| **Phone** | Alchemist — inbound calls to your own Exotel number |
| **Microsoft Teams** | Alchemist — your organisation's Teams, linked once with a code |
| **Email, Instagram, Slack, other stores** | You, in Noesis |

### Connectors and tools

Connectors from Olbrain's catalog. *Sign-in* means your organisation signs in once; *key*
means a key entered on a card, never in the chat.

| Connector | Connect with | What the agent can do |
| --- | --- | --- |
| Google Workspace | Sign-in | Sheets, Drive, Docs and Calendar |
| Google Drive folder | Nothing | Read one folder you share with Olbrain |
| Notion | Sign-in, or key | Search and read pages and databases; editing stays off unless you turn it on |
| Linear | Sign-in | Search and read issues and projects; editing stays off unless you turn it on |
| Calendly | Sign-in | Events, event types and users |
| Shopify | Sign-in | Products, orders, customers, prices, stock, discounts and refunds |
| WooCommerce | Sign-in | Products, orders and customers |
| Cratio CRM | Key | Read and search leads, record qualifying answers, classify outcomes, write handoff summaries |
| Microsoft Dynamics 365 F&O | Key | Find data entities, read fields and query records |
| SAP HANA | Key | Read-only SQL queries and schema browsing |
| Browser automation (India) | Key | Open pages, click, fill in forms, read what's shown; TDS certificate checks on TRACES |
| Browser recorder | Nothing | Record a person's browser steps for a job to repeat (also from India) |

Beyond the catalog:

- **Any REST API** as a tool — no key, bearer token, basic auth, or an API key in a header
  or the URL. Keys go to your organisation's vault through a card.
- **Your own MCP server** on a public https address — no key, bearer token or API key.
- **A Shopify store's own data** as read-only tools, one store per agent.

### Handing off to a person

A chat agent hands a conversation to a person when its handoff rules match, or when it
judges one is needed. Your team is told in Slack, by email, or with a ticket in your
**Zendesk** or **Freshdesk**: public replies on the ticket reach the customer on their
channel, and the customer's messages are added to the ticket.

### Knowledge

Documents dropped in the chat, or your organisation's files, attached per agent — with a
check that the agent answers from the right file.

### Quality

- **Setup review** — finds contradictions, gaps, conflicts with knowledge files, broken
  references and risks, then fixes them.
- **Tests** — written for the agent, run on the draft and through fix rounds; a fix card
  shows each failing case.
- **Tool proof** — each connected tool is called before publishing, to show it really answers.
- **Live review** — reads a published agent's real conversations (last 1, 7 or 30 days),
  turns its failures into tests and proves a fix before it goes live.

### Publishing and change

- Publish, and make a new version live after its tests. Owners and admins approve.
- A 30-day free trial for each new agent.
- Go-live steps: embed code, API, and SDK pointers for JavaScript and Python.
- Change a live agent, its email signature and its style.
- Find two agents doing the same work and merge them.
- Archive or delete an agent; both can be restored.

### Planning

Not sure what you need? **Cortex**, Olbrain's business analyst, asks about the business,
suggests agents and writes a requirements document for each. To change an agent you already
have, name it.

### Support tickets

Raise, list, check, update, close, reopen, escalate and rate your own Olbrain support
tickets — the same ones Noesis shows.

### Not yet

- Jobs started by a file in SharePoint or a Teams channel library, a Google shared drive, or
  a bucket other than Google Cloud Storage or Amazon S3.
- Webhooks signed any other way than the senders listed above.
- A job inside a team started by an email or a Drive file — it runs beside the team as its
  own job.
- MCP servers reachable only inside a company network.
- In automatic jobs, connectors that need the end customer's own login.

Anything else Alchemist can't build goes to the Olbrain team as a request, with an id you
can follow up on.

## Commands and tools

| Command | What it does |
| --- | --- |
| `/alchemist:build <description>` | Start a build |
| `/alchemist:status` | Your account, organisation, builds and waiting cards |

| Tool | What it does |
| --- | --- |
| `whoami` | Who you are signed in as, and your organisations |
| `create_org` | Create an organisation and make it active |
| `select_org` | Switch your active organisation (everywhere you are signed in) |
| `list_members` | Who is in your organisation |
| `alchemist` | One builder turn: describe or continue a build |
| `alchemist_answer` | Send your choice on an approval card |
| `alchemist_builds` | List your builds |
| `alchemist_build` | One build: its plan, agents and waiting cards |
| `alchemist_stop` | Stop the turn a build is running |
| `alchemist_connect` | Put a live agent on your website or call it from your code |
| `alchemist_capabilities` | What Alchemist can build and do, read live |
| `alchemist_show_agent` | One agent as a read-only diagram |

Inviting people and joining an organisation happen in [Noesis](https://noesis.olbrain.com).
Every build can also be opened there.

## Privacy and security

- Every tool call goes to `https://alchemist.olbrain.com`, which acts as you in Olbrain. It
  keeps your Olbrain sign-in encrypted so you stay signed in; remove the connection to end it.
- Keys and passwords for tools never pass through the chat. Approval cards collect them into
  your organisation's vault.
- Nothing goes live, merges or changes behaviour without an approval card you answered.
  Claude Code also asks your permission before sending each answer.
- Once an agent is live, its go-live steps call Olbrain's agent API at
  `https://webhook.olbrain.com` with your organisation's API key — to test it, upload a file
  for a job, start a job, or from the server route Claude adds to your app. You run those
  commands yourself, and the key stays in your own environment.

Olbrain's [privacy policy](https://olbrain.com/privacy.html) and
[terms](https://olbrain.com/terms.html).

## Links

[olbrain.com](https://olbrain.com) · [Noesis](https://noesis.olbrain.com) ·
[Docs](https://docs.olbrain.com) · [Developers](https://olbrain.com/developers/) ·
[Support](https://olbrain.com/contact/)

## Licence

Copyright Olbrain. All rights reserved.
