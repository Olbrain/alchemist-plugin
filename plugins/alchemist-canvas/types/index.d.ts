/** One row of a section: a channel, guardrail, document, tool, skill, table, hand-off or removed item. */
export type Item = {
  label?: string
  name?: string
  group?: string
  channel?: string
  live?: boolean
  change?: string | null
  writes?: boolean
  when?: string
  to?: string | null
  fields?: string[]
  section?: string
}

/** A job's, team's or research agent's step, member or source. */
export type GraphNode = {
  id?: string
  label?: string
  lines?: string[]
  change?: string | null
  writes?: boolean
  live?: boolean | null
}

export type GraphEdge = { from?: string; to?: string; label?: string }

/** alchemist_show_agent's structured view (the gateway's agent_view). */
export type View = {
  agent_id?: string
  name?: string
  kind?: string
  supported?: boolean
  unsupported_reason?: string | null
  live_version?: number | null
  version?: number | null
  draft_dirty?: boolean | null
  core?: { role?: string; company?: string; tone?: string }
  channels?: Item[]
  guardrails?: Item[]
  knowledge?: Item[]
  tools?: Item[]
  skills?: Item[]
  datastore?: Item[]
  handoffs?: Item[]
  graph?: { nodes?: GraphNode[]; edges?: GraphEdge[] }
  removed?: Item[]
  unavailable?: string[]
  view_url?: string
}

/** What the pane draws: the view, and the card that asked for it. */
export type Canvas = { view: View; card?: string }

declare module 'claude-code' {
  interface PluginState {
    'alchemist-canvas': { canvas: Shaped<Canvas | null>; shown: Shaped<string | null> }
  }
}
