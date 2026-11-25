"""The session-start update check tells the user about a newer plugin once a day, and stays quiet otherwise."""
import json
import os
import subprocess
import tempfile
from pathlib import Path

PLUGIN = Path(__file__).resolve().parent.parent / "plugins/alchemist"
# The command exactly as Claude Code runs it, from the plugin's hook config.
COMMAND = json.loads((PLUGIN / "hooks/claude-code.json").read_text())["hooks"]["SessionStart"][0]["hooks"][0]["command"]
MINE = json.loads((PLUGIN / ".claude-plugin/plugin.json").read_text())["version"]


def run(tmp, latest=None, url=None, fresh=True, **env):
    """The hook's systemMessage, or None. latest: the version the fake marketplace.json lists."""
    cache = Path(tmp) / "cache"
    if fresh and cache.exists():
        for f in cache.rglob("*"):
            if f.is_file():
                f.unlink()
    market = Path(tmp) / "marketplace.json"
    if latest is not None:
        market.write_text(json.dumps({"name": "alchemist", "metadata": {"version": latest},
                                      "plugins": [{"name": "alchemist", "version": latest}]}, indent=2))
    out = subprocess.run(["bash", "-c", COMMAND], capture_output=True, check=True, timeout=10, env={
        **os.environ, "CLAUDE_PLUGIN_ROOT": str(PLUGIN), "XDG_CACHE_HOME": str(cache),
        "ALCHEMIST_UPDATE_URL": url or market.as_uri(), **env})
    return json.loads(out.stdout)["systemMessage"] if out.stdout.strip() else None


def bump(version, at):
    parts = [int(p) for p in version.split(".")]
    parts[at] += 1
    return ".".join(map(str, parts[:at + 1] + [0] * (len(parts) - at - 1)))


def main():
    with tempfile.TemporaryDirectory() as tmp:
        newer = bump(MINE, 2)
        said = run(tmp, newer)
        assert said == (f"A newer Alchemist plugin is out: {newer} (you have {MINE}). To update, run `claude plugin "
                        f"update alchemist@alchemist` in a terminal, then /reload-plugins. To get new versions "
                        f"automatically: open /plugin, Marketplaces, alchemist, and turn on auto-update."), said
        assert run(tmp, bump(MINE, 0))  # a new major version too
        assert run(tmp, MINE) is None  # up to date
        assert run(tmp, "0.0.1") is None  # GitHub behind the install (a local build)
        # Once a day: a second session the same day doesn't look again.
        assert run(tmp, newer) and run(tmp, newer, fresh=False) is None
        # Offline, a bad file, or turned off: quiet, and session start never fails.
        assert run(tmp, url="http://127.0.0.1:9/none.json") is None
        (Path(tmp) / "garbage.json").write_text('{"version": "latest"}')
        assert run(tmp, url=(Path(tmp) / "garbage.json").as_uri()) is None
        assert run(tmp, newer, ALCHEMIST_NO_UPDATE_CHECK="1") is None
    # Numbers, not text: 0.9.10 is newer than 0.9.9.
    script = PLUGIN / "hooks/update-check.sh"
    older = 'eval "$(sed -n \'/^older()/,/^}/p\' "$0")"; older "$1" "$2"'
    for a, b, want in [("0.9.9", "0.9.10", 0), ("0.9.10", "0.9.9", 1), ("0.9.23", "0.9.23", 1), ("1.0", "1.0.1", 0)]:
        got = subprocess.run(["bash", "-c", older, str(script), a, b]).returncode
        assert got == want, (a, b, got)
    print("update check ok")


if __name__ == "__main__":
    main()
