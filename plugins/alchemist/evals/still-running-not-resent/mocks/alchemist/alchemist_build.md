{
 "build_id": "b_9",
 "label": "Opening hours agent",
 "state": "needs_you",
 "turn_running": false,
 "next_step": "Answer the card.",
 "recent": [
  {
   "role": "assistant",
   "text": "Here is the brief for you to check."
  }
 ],
 "open_cards": [
  {
   "approval_id": "ap_40",
   "kind": "brief",
   "title": "Brief: Opening hours agent",
   "action_summary": "A chat agent that answers opening-hours questions: 9am to 6pm, Monday to Saturday.",
   "body": "Serves: website visitors. Must not: promise anything outside opening hours.",
   "question": "Is this brief right?",
   "responses": [
    {
     "response": "approve",
     "label": "Yes, plan it",
     "means": "Alchemist drafts the plan."
    },
    {
     "response": "change",
     "label": "Change it",
     "means": "Say what to change in a note."
    }
   ]
  }
 ]
}
