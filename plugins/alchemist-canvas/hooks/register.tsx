import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderChildren } from 'claude-code'

import type { Canvas, GraphNode, Item, View } from '../types'

const PANE = 'alchemist-canvas'
// Change a tag when its value's fields change: it declines what an earlier version stored.
const canvas = atom({ plugin: 'alchemist-canvas', key: 'canvas' } as const, null as Canvas | null, { shape: 'canvas-1' })
// The last card drawn, so the build reads that repeat a waiting card fetch its view once.
const shown = atom({ plugin: 'alchemist-canvas', key: 'shown' } as const, null as string | null, { shape: 'shown-1' })

// The plugin's server (mcp__plugin_alchemist_alchemist__…) or the claude.ai connector's (mcp__claude_ai_Alchemist__…).
const TOOL = /^mcp__(.+)__(alchemist|alchemist_answer|alchemist_build|alchemist_do|alchemist_state|alchemist_show_agent)$/
// Results that list the build's waiting cards; the others carry the one card their call raised.
const LISTS = new Set(['alchemist_build', 'alchemist_state'])
const DECIDES = new Set(['publish', 'activate', 'publish_workflow', 'publish_team', 'publish_research'])
const KINDS: Record<string, string> = { workflow: 'job', team: 'team of agents', research: 'research agent' }

type Obj = Record<string, unknown>
const isObj = (v: unknown): v is Obj => typeof v === 'object' && v !== null && !Array.isArray(v)

/** A tool result's data: its structured content, else its first text block read as JSON. */
function data(result: unknown): Obj | null {
  if (isObj(result) && isObj(result.structuredContent)) return result.structuredContent
  const blocks = Array.isArray(result) ? result : isObj(result) && Array.isArray(result.content) ? result.content : []
  const text = typeof result === 'string' ? result : blocks.find(b => isObj(b) && b.type === 'text')?.text
  if (typeof text !== 'string') return null
  try {
    const parsed: unknown = JSON.parse(text)
    return isObj(parsed) ? parsed : null
  } catch {
    return null
  }
}

const isView = (v: Obj | null): v is View => !!v && typeof v.agent_id === 'string' && 'supported' in v

/** The agent's view, read with the same tool on the same server. */
async function fetchView($: EngineInterface, server: string, args: Obj): Promise<View | null> {
  const got = await $.mcp.call(server, 'alchemist_show_agent', args)
  const view = got.isError ? null : data(got)
  return isView(view) ? view : null
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({ name: 'agent-canvas', description: 'Show the last Olbrain agent Alchemist drew, beside the chat' })
    return next(e)
  })

  on('command.run', { command: 'agent-canvas' }, async $ => {
    await $.ui.open({ id: PANE, title: 'Agent' })
    const has = await read($, canvas)
    return { text: has ? 'Agent pane opened.' : 'Agent pane opened. Ask Claude to show an agent, or wait for a publish card.' }
  })

  on('tool.call', async ($, e, next) => {
    const ran = await next(e)
    const m = TOOL.exec(e.tool)
    if (!m || ran.deny !== undefined || ran.isError) return ran
    const [, server = '', name = ''] = m
    const args = e as unknown as Obj
    const out = data(ran.result)
    let next_: Canvas | null = null
    if (name === 'alchemist_show_agent') {
      const view = isView(out) ? out : await fetchView($, server, { agent_id: args.agent_id, ...(args.version ? { version: args.version } : {}) })
      if (view) next_ = { view }
    } else if (out) {
      const cards = LISTS.has(name) ? out.open_cards : [out.card]
      const card = (Array.isArray(cards) ? cards : []).find(
        (c): c is Obj => isObj(c) && DECIDES.has(String(c.kind)) && typeof c.agent_id === 'string')
      const key = card && String(card.approval_id ?? `${card.kind}:${card.agent_id}`)
      if (card && key !== (await read($, shown))) {
        await update($, shown, () => key)
        const view = await fetchView($, server, { agent_id: card.agent_id })
        if (view) next_ = { view, card: typeof card.title === 'string' ? card.title : undefined }
      }
    }
    if (next_) {
      const drawn = next_
      await update($, canvas, () => drawn)
      void $.ui.open({ id: PANE, title: 'Agent' })
    }
    return ran
  }).catch(($, e, next) => next(e)) // a failed drawing never costs the tool its result

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Link } = $.ui.resolve(e)
    const shot = await read($, canvas)
    if (!shot) return <Text dimColor>No agent yet. Ask Claude to show one, or wait for a publish card.</Text>
    const v = shot.view
    const name = v.name || v.agent_id || 'Agent'

    const marks = (i: { change?: string | null; writes?: boolean }) => [
      i.change === 'added' && <Text color="success"> +new</Text>,
      i.change === 'changed' && <Text color="warning"> ~changed</Text>,
      i.writes === true && <Text color="error"> writes</Text>,
    ]
    const row = (label: string, i: Item | GraphNode = {}, dim?: string) => (
      <Text>• {label}{dim ? <Text dimColor> {dim}</Text> : ''}{marks(i)}</Text>
    )
    const section = (title: string, rows: RenderChildren[]) => (
      <Box flexDirection="column" borderStyle="round" borderDimColor paddingX={1}>
        <Text weight="bold">{title}</Text>
        {rows.length ? rows : <Text dimColor>none</Text>}
      </Box>
    )
    const down = <Text dimColor>  ↓</Text>

    let state = v.live_version != null ? `live v${v.live_version}` : 'not published'
    if (v.version != null) state = `v${v.version}` + (v.version === v.live_version ? ', live' : '')
    if (v.draft_dirty) state += ' · unpublished changes'
    if (v.kind && KINDS[v.kind]) state = `${KINDS[v.kind]} · ${state}`

    let body: RenderChildren[]
    if (v.supported === false) {
      body = [<Text dimColor>{v.unsupported_reason || 'There is no diagram for this kind of agent yet.'}</Text>]
    } else if (v.graph) {
      const nodes = v.graph.nodes ?? []
      const names = new Map(nodes.map(n => [n.id, n.label || n.id || '?']))
      body = nodes.flatMap((n, i) => {
        const outs = (v.graph?.edges ?? []).filter(x => x.from === n.id && names.has(x.to))
        const only = outs.length === 1 ? outs[0] : undefined
        const straight = !!only && !only.label && only.to === nodes[i + 1]?.id
        const live = n.live == null ? [] : [n.live ? 'live' : 'not live']
        return [
          <Box flexDirection="column" borderStyle="round" borderDimColor paddingX={1}>
            <Text weight="bold">{n.label || n.id}{marks(n)}</Text>
            {[...live, ...(n.lines ?? [])].map(l => <Text dimColor>{l}</Text>)}
          </Box>,
          ...(straight ? [down] : outs.map(x => <Text dimColor>  → {names.get(x.to)}{x.label ? ` (${x.label})` : ''}</Text>)),
        ]
      })
    } else {
      const groups = new Map<string, Item[]>()
      for (const t of v.tools ?? []) groups.set(t.group || 'Tools', [...(groups.get(t.group || 'Tools') ?? []), t])
      const core = v.core ?? {}
      body = [
        section('Hears from', (v.channels ?? []).map(c => row(c.label || c.channel || '?', c, c.live ? 'live' : 'not live'))),
        down,
        section('Checks', (v.guardrails ?? []).map(g => row(g.label || '?', g))),
        down,
        section('Thinks', [core.role, core.company, core.tone].filter(Boolean).map(t => <Text>{t}</Text>)),
        down,
        section('Consults', [
          ...(v.knowledge ?? []).map(k => row(k.name || '?', k, 'knowledge')),
          ...[...groups].flatMap(([g, ts]) => ts.map(t => row(t.name || '?', t, g))),
          ...(v.skills ?? []).map(s => row(s.name || '?', s, 'skill')),
        ]),
        down,
        section('Ends with', [
          row('Replies'),
          ...(v.datastore ?? []).map(d => row(`Saves to ${d.name}`, d, (d.fields ?? []).join(', '))),
          ...(v.handoffs ?? []).map(h => row(`Hands off when ${h.when}`, h, h.to ? `→ ${h.to}` : '')),
        ]),
      ]
    }

    const since = v.version == null ? v.live_version : v.version - 1
    return (
      <Box flexDirection="column" width={e.props.bodyColumns}>
        <Text weight="bold">{name}</Text>
        <Text dimColor>{state}</Text>
        {shot.card && <Text color="claude">Card: {shot.card}</Text>}
        <Text> </Text>
        {body}
        {v.removed?.length ? (
          <Text color="error">Removed since v{since}: {v.removed.map(r => `${r.label} (${r.section})`).join(', ')}</Text>
        ) : null}
        {v.unavailable?.length ? <Text dimColor>Couldn't load: {v.unavailable.join(', ')}</Text> : null}
        <Text> </Text>
        <Text dimColor><Text color="success">+new</Text> <Text color="warning">~changed</Text> <Text color="error">writes</Text>  since the live version</Text>
        {v.view_url && <Link href={v.view_url} label="Open the full diagram in a browser" />}
      </Box>
    )
  })
}
