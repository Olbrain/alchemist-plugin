#!/usr/bin/env bash
# At session start, at most once a day: tell the user when a newer Alchemist plugin is on GitHub. Claude Code never
# auto-updates a plugin from a GitHub marketplace unless the user turns it on, and the plugin's MCP entry can't carry
# its version: Claude Code keys the saved sign-in by that entry, so changing it signs users out (seen Nov 25, 0.9.22).
# Quiet when up to date, offline, on any failure, or with ALCHEMIST_NO_UPDATE_CHECK=1. Bash 3.2 and curl only.
[ -n "${ALCHEMIST_NO_UPDATE_CHECK:-}" ] && exit 0
stamp="${XDG_CACHE_HOME:-$HOME/.cache}/alchemist-plugin/update-checked"
[ -n "$(find "$stamp" -mmin -1440 2>/dev/null)" ] && exit 0
mkdir -p "$(dirname "$stamp")" 2>/dev/null && touch "$stamp" 2>/dev/null || exit 0

version() { sed -n 's/.*"version" *: *"\([0-9][0-9]*\(\.[0-9][0-9]*\)*\)".*/\1/p' | head -n 1; }
# marketplace.json's first version is its metadata's, which scripts/check_manifests.py keeps equal to the plugin's.
latest=$(curl -fsS --max-time 3 \
  "${ALCHEMIST_UPDATE_URL:-https://raw.githubusercontent.com/Olbrain/alchemist-plugin/main/.claude-plugin/marketplace.json}" \
  2>/dev/null | version)
mine=$(version < "${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json" 2>/dev/null)
[ -n "$latest" ] && [ -n "$mine" ] || exit 0

older() {  # whether dotted version $1 is older than $2, number by number
  local a b i
  IFS=. read -r -a a <<< "$1"
  IFS=. read -r -a b <<< "$2"
  for i in 0 1 2 3; do
    [ "${a[i]:-0}" -lt "${b[i]:-0}" ] && return 0
    [ "${a[i]:-0}" -gt "${b[i]:-0}" ] && return 1
  done
  return 1
}
older "$mine" "$latest" || exit 0
# Both versions are digits and dots only (the sed above), so the JSON needs no escaping.
printf '{"systemMessage": "A newer Alchemist plugin is out: %s (you have %s). To update, run `claude plugin update alchemist@alchemist` in a terminal, then /reload-plugins. To get new versions automatically: open /plugin, Marketplaces, alchemist, and turn on auto-update."}\n' "$latest" "$mine"
