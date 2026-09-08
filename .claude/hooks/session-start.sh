#!/bin/bash
# Gleea — SessionStart hook for Claude Code on the web.
# Installs npm dependencies so build/lint can run during web sessions.
set -euo pipefail

# Only run in the remote (web) environment; local setups manage their own deps.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-.}"

# Idempotent and cache-friendly: npm install (not ci) so cached containers reuse
# node_modules across sessions.
npm install --no-audit --no-fund
