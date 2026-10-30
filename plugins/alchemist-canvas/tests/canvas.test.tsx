import { expect, test } from 'claude-code/testing'

const PANE = {
  plugin: 'alchemist-canvas',
  component: 'Pane',
  requestId: 'alchemist-canvas',
  props: {
    title: 'Agent',
    isFocused: false,
    bodyColumns: 48,
    placement: 'dock',
    scroll: { offset: 0, bodyRows: 40 },
    view: {},
  },
} as const

const CHAT = {
  agent_id: 'a1', name: 'Kettle Support', supported: true, live_version: 7, draft_dirty: true,
  core: { role: 'Customer support', company: 'Kettle & Co', tone: 'Friendly' },
  channels: [{ channel: 'whatsapp', label: 'WhatsApp', live: true }],
  guardrails: [{ label: 'No delivery promises', change: null }],
  knowledge: [{ name: 'Returns FAQ', change: null }],
  tools: [{ group: 'Shopify', name: 'Issue refund', writes: true, change: 'added' }],
  skills: [], datastore: [], handoffs: [{ when: 'Refund over ₹5,000', to: 'Support team', change: null }],
  removed: [{ section: 'guardrails', label: 'Old rule' }], unavailable: [],
  view_url: 'https://alchemist.olbrain.com/connect/agent/x',
}

const JOB = {
  agent_id: 'j1', name: 'Weekly Social Report Job', kind: 'workflow', supported: true, live_version: 2,
  draft_dirty: true, removed: [], unavailable: [],
  graph: {
    nodes: [{ id: 'w', label: 'Last week window' }, { id: 'x', label: 'X user lookup', change: 'changed' },
            { id: 'e', label: 'Email report', writes: true }],
    edges: [{ from: 'w', to: 'x' }, { from: 'x', to: 'e', label: 'found' }],
  },
}

test('a shown agent is drawn beside the chat', async ($, on) => {
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('tool.call', () => ({ result: { content: [{ type: 'text', text: 'Kettle Support (live v7)' }], structuredContent: CHAT } }))

  await $.tool.call({ tool: 'mcp__plugin_alchemist_alchemist__alchemist_show_agent', agent_id: 'a1' })

  for (const surface of ['terminal', 'desktop'] as const) {
    const ui = await $.ui.mount({ ...PANE, surface })
    expect((await ui.find({ type: 'Text', text: /^Kettle Support$/ }))?.text).toBe('Kettle Support')
    expect((await ui.find({ type: 'Text', text: /live v7/ }))?.text).toBe('live v7 · unpublished changes')
    expect((await ui.find({ type: 'Text', text: /Issue refund/ }))?.text).toBe('• Issue refund Shopify +new writes')
    expect((await ui.find({ type: 'Text', text: /Removed since/ }))?.text).toBe('Removed since v7: Old rule (guardrails)')
    await ui.unmount()
  }
})

test('a publish card draws its agent once, however often the build is read', async ($, on) => {
  const fetched: unknown[] = []
  on('ui.open', () => ({ value: { isPlaced: true } }))
  on('mcp.call', (_, e) => {
    fetched.push(e)
    return { value: { content: [{ type: 'text', text: 'Weekly Social Report Job' }], isError: false, structuredContent: JOB } }
  })
  const build = { id: 'b1', open_cards: [{ approval_id: 'p1', kind: 'publish_workflow', agent_id: 'j1', title: 'Publish v3' }] }
  on('tool.call', () => ({ result: [{ type: 'text', text: JSON.stringify(build) }] }))

  await $.tool.call({ tool: 'mcp__plugin_alchemist_alchemist__alchemist_build', build_id: 'b1' })
  await $.tool.call({ tool: 'mcp__plugin_alchemist_alchemist__alchemist_build', build_id: 'b1' })
  expect(fetched.length).toBe(1)

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect((await ui.find({ type: 'Text', text: /^Card:/ }))?.text).toBe('Card: Publish v3')
  expect((await ui.find({ type: 'Text', text: /job ·/ }))?.text).toBe('job · live v2 · unpublished changes')
  expect((await ui.find({ type: 'Text', text: /X user lookup/ }))?.text).toBe('X user lookup ~changed')
  expect((await ui.find({ type: 'Text', text: /→ Email report/ }))?.text).toBe('  → Email report (found)')
  await ui.unmount()
})

test('other tools and other cards leave the pane alone', async ($, on) => {
  on('tool.call', () => ({ result: [{ type: 'text', text: JSON.stringify({ card: { kind: 'plan', agent_id: 'a1' } }) }] }))
  await $.tool.call({ tool: 'mcp__plugin_alchemist_alchemist__alchemist_answer', build_id: 'b1' })
  await $.tool.call({ tool: 'Bash', command: 'ls' })

  const ui = await $.ui.mount({ ...PANE, surface: 'terminal' })
  expect((await ui.find({ type: 'Text' }))?.text).toMatch(/^No agent yet/)
  await ui.unmount()
})
