"""Fail when a manifest isn't valid JSON or a plugin's version differs between its manifests."""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Every file that states a plugin's version, besides its entry in the Claude marketplace.
MANIFESTS = {
    "alchemist": [
        "server.json",
        "plugins/alchemist/plugin.json",
        "plugins/alchemist/.claude-plugin/plugin.json",
        "plugins/alchemist/.codex-plugin/plugin.json",
        "plugins/alchemist/.cursor-plugin/plugin.json",
        "plugins/alchemist/.antigravity-plugin/plugin.json",
    ],
    "alchemist-canvas": ["plugins/alchemist-canvas/.claude-plugin/plugin.json"],
}


def main() -> int:
    errors, docs = [], {}
    tracked = subprocess.run(["git", "ls-files", "*.json"], cwd=ROOT, capture_output=True, text=True, check=True)
    for path in tracked.stdout.split():
        try:
            docs[path] = json.loads((ROOT / path).read_text())
        except ValueError as e:
            errors.append(f"{path}: not valid JSON ({e})")
    if errors:
        print("\n".join(errors))
        return 1

    market = docs[".claude-plugin/marketplace.json"]
    listed = {p["name"]: p["version"] for p in market["plugins"]}
    versions = {"alchemist": {".claude-plugin/marketplace.json (metadata)": market["metadata"]["version"]}}
    for name, paths in MANIFESTS.items():
        found = versions.setdefault(name, {})
        found[".claude-plugin/marketplace.json (plugins)"] = listed[name]
        found.update({p: docs[p]["version"] for p in paths})
        if len(set(found.values())) > 1:
            errors.append(f"{name}: versions differ\n" + "\n".join(f"  {v}  {p}" for p, v in found.items()))
    print("\n".join(errors) or "manifests agree: " + ", ".join(f"{n} {next(iter(v.values()))}" for n, v in versions.items()))
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
