"""The phase hook shows the user a new phase from an Alchemist step's result, and stays quiet otherwise."""
import json
import subprocess
from pathlib import Path

HOOK = Path(__file__).resolve().parent.parent / "plugins/alchemist/hooks/phase-line.sh"
NUDGE = ("The build has moved to a new phase. Tell the user where it stands in these words, then say in a sentence "
         "or two what this phase will do:\n{}\nRead the build's state (alchemist_state) for what comes next.")


def shown(next_text, ascii_only=True):
    inner = json.dumps({"op_id": "o1", "status": "done", "next": next_text}, ensure_ascii=ascii_only)
    event = json.dumps({"hook_event_name": "PostToolUse", "tool_name": "mcp__plugin_alchemist_alchemist__alchemist_do",
                        "tool_response": [{"type": "text", "text": inner}]}, ensure_ascii=ascii_only)
    out = subprocess.run(["bash", str(HOOK)], input=event, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)["systemMessage"] if out.stdout.strip() else None


def main():
    one = "Now in phase 2 of 5, Build. The plan is done; next come the review, the tests and going live."
    assert shown(NUDGE.format(one)) == one
    two = '"Café Crème" desk is in phase 3 of 5, Review.\nDaily report has done all 4 phases: it is published.'
    want = '"Café Crème" desk is in phase 3 of 5, Review. Daily report has done all 4 phases: it is published.'
    assert shown(NUDGE.format(two)) == want
    assert shown(NUDGE.format(two), ascii_only=False) == want
    assert shown("Read the build's state (alchemist_state) for what comes next.") is None
    print("phase hook ok")


if __name__ == "__main__":
    main()
