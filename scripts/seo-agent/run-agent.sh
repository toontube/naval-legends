#!/bin/bash
# Run the Bravo Zulu SEO agent via Claude Code CLI
# Designed for crontab: 17 9 * * * /Users/max/MOZUMA/naval-legends/scripts/seo-agent/run-agent.sh

cd /Users/max/MOZUMA/naval-legends

# cron has a bare PATH; claude lives under nvm
export PATH="/Users/max/.nvm/versions/node/v22.17.1/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"

# Log output
LOG="/Users/max/MOZUMA/naval-legends/scripts/seo-agent/agent-runs.log"
echo "=== Agent run: $(date) ===" >> "$LOG"

# Run Claude with the SEO agent prompt
claude -p "You are the Bravo Zulu SEO agent for brvzulu.com. Read and follow scripts/seo-agent/daily-seo.md exactly. Execute all 6 tasks. Be autonomous. Commit and push your changes when done. Stage only the files you created or edited, by explicit path. Never use git add -A, git add . or git commit -a, and never commit api/, src/components/, src/layouts/, package.json or .gitignore." --allowedTools "Bash,Read,Write,Edit,Glob,Grep,WebSearch,WebFetch" 2>&1 | tee -a "$LOG"

echo "=== Agent done: $(date) ===" >> "$LOG"
