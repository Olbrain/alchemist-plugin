{
 "build_id": "b_7",
 "label": "Kettle support agent",
 "state": "needs_you",
 "turn_running": false,
 "agents": [
  {
   "agent_id": "a_1",
   "name": "Kettle Support",
   "kind": "chat",
   "live_version": 2
  }
 ],
 "open_cards": [
  {
   "approval_id": "ap_31",
   "kind": "publish",
   "agent_id": "a_1",
   "title": "Publish Kettle Support v3",
   "action_summary": "Publishes the tested draft as version 3. Customers on website chat and WhatsApp get it at once.",
   "body": "12 of 12 tests passed. Changed since v2: one new guardrail (no delivery-date promises).",
   "question": "Publish Kettle Support v3 to your customers now?",
   "responses": [
    {
     "response": "approve",
     "label": "Publish",
     "means": "Version 3 goes live for customers now."
    },
    {
     "response": "reject",
     "label": "Not yet",
     "means": "The draft is kept; nothing changes for customers."
    },
    {
     "response": "change",
     "label": "Change something",
     "means": "Say what to change in a note."
    }
   ]
  }
 ],
 "next_step": "Answer the card.",
 "recent": [
  {
   "role": "assistant",
   "text": "The draft answers pricing and delivery questions. Tell me what to change, or ask me to test it."
  }
 ],
 "noesis_url": "https://noesis.olbrain.com/alchemist/b_7"
}
