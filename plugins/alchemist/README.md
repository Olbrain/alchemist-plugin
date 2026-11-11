# Olbrain Alchemist

Build, test and publish [Olbrain](https://olbrain.com) AI agents from your coding agent.
You describe the agent in plain words. Your coding agent plans it from your words and your
project, with Alchemist's step-by-step guidance; Alchemist builds it in your Olbrain
organisation, tests it on real inputs, checks every step in order and publishes it. It asks
you, with an approval card, before anything goes live, unless you let your coding agent
decide.

## What it builds

- **Chat agents** that people talk to on website chat, WhatsApp, Shopify storefront chat,
  your phone number or Microsoft Teams.
- **Automatic jobs** started by a schedule, a webhook, an email or a new file in a watched
  folder.
- **Teams of agents** behind one front door, and **research agents** that email reports.

Agents use tools from Olbrain's connector catalog, any REST API or your own MCP server, and
answer from their knowledge files. Every agent runs on Olbrain and stays visible in
[Noesis](https://noesis.olbrain.com), Olbrain's console.

## Get started

Sign in with your Olbrain account when asked (new to Olbrain? choose **Create account**).
Then try:

- *Use Alchemist to build an agent that answers questions about our pricing and hands
  refunds to a person*
- *What can Alchemist do?*
- *Put my support agent on my website*

`/alchemist:build <what the agent should do>` starts a build; `/alchemist:status` shows
your builds and any cards waiting on you.

Read the [best practices](https://docs.olbrain.com/alchemist#best-practices) before your
first build, and the [error codes](https://docs.olbrain.com/alchemist#errors) if a call fails.

## Privacy

Tool calls go to `https://alchemist.olbrain.com`, which acts as you in Olbrain. Keys and
passwords never pass through the chat: approval cards collect them into your organisation's
vault. [Privacy policy](https://olbrain.com/privacy.html) ·
[Terms](https://olbrain.com/terms.html) · [Docs](https://docs.olbrain.com) ·
[Support](https://olbrain.com/contact/)
