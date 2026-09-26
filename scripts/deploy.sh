#!/usr/bin/env bash
# Builds Scapedle from a fresh clone and publishes the static output to the GitHub Pages branch.
#
# Usage: deploy [daily|if-changed]
#   daily       always rebuild (the daily word is baked in at build time) and announce it
#   if-changed  rebuild only when the source branch has moved since the last deploy
set -Eeuo pipefail

MODE="${1:-daily}"
case "$MODE" in
	daily | if-changed) ;;
	*)
		echo "usage: deploy [daily|if-changed]" >&2
		exit 2
		;;
esac

: "${GH_TOKEN:?GH_TOKEN is required}"
: "${GH_REPO:?GH_REPO is required (owner/name)}"
SOURCE_BRANCH="${SOURCE_BRANCH:-main}"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-gh-pages}"
SITE_URL="${SITE_URL:-https://scapedle.com}"
STATE_DIR="${STATE_DIR:-/state}"
WORK_DIR="${WORK_DIR:-/work}"
PNPM_STORE="${PNPM_STORE:-/pnpm-store}"
REMOTE="https://github.com/${GH_REPO}.git"

step="startup"

log() { printf '[%s] %s\n' "$(date '+%F %T %Z')" "$*"; }

# notify <webhook-url> <content> [username] — never fails the deploy.
notify() {
	local url="$1"
	shift
	[[ -n "$url" ]] || return 0
	node -e 'const [c, u] = process.argv.slice(1); process.stdout.write(JSON.stringify(u ? { content: c, username: u } : { content: c }))' "$@" |
		curl -fsS -m 15 -H 'Content-Type: application/json' -d @- "$url" >/dev/null ||
		log "warning: Discord notification failed"
}

on_error() {
	local code=$?
	log "FAILED during: ${step} (exit ${code})"
	notify "${DISCORD_WEBHOOK:-}" "🙈Scapedle build failed (step: ${step})"
	exit "$code"
}
trap on_error ERR

# Serialise runs: the poller skips if a deploy is in flight, the daily build waits for it.
mkdir -p "$STATE_DIR" "$WORK_DIR"
exec 9>"$STATE_DIR/deploy.lock"
if [[ "$MODE" == "if-changed" ]]; then
	flock -n 9 || {
		log "another deploy is running; skipping"
		exit 0
	}
else
	flock 9
fi

# Supply the token through a credential helper so it never appears in URLs or git output.
step="configure git"
git config --global credential.helper '!f() { echo username=x-access-token; echo "password=${GH_TOKEN}"; }; f'
git config --global user.name "${GIT_AUTHOR_NAME:-Scapedle Deploy}"
git config --global user.email "${GIT_AUTHOR_EMAIL:-deploy@scapedle.com}"
git config --global init.defaultBranch main

step="resolve ${SOURCE_BRANCH}"
remote_sha="$(git ls-remote "$REMOTE" "refs/heads/${SOURCE_BRANCH}" | cut -f1)"
[[ -n "$remote_sha" ]] || {
	log "branch ${SOURCE_BRANCH} not found on ${GH_REPO}"
	false
}
last_sha="$(cat "$STATE_DIR/last-sha" 2>/dev/null || true)"
if [[ "$MODE" == "if-changed" && "$remote_sha" == "$last_sha" ]]; then
	log "no change on ${SOURCE_BRANCH} (${remote_sha:0:7}); nothing to do"
	exit 0
fi
log "mode=${MODE} building ${GH_REPO}@${SOURCE_BRANCH} (${remote_sha:0:7})"

step="clone"
rm -rf "$WORK_DIR/src"
git clone -q --depth 1 --branch "$SOURCE_BRANCH" "$REMOTE" "$WORK_DIR/src"
cd "$WORK_DIR/src"
sha="$(git rev-parse HEAD)"

step="install dependencies"
pnpm install --frozen-lockfile --store-dir "$PNPM_STORE"

step="build"
NODE_ENV=production pnpm run build

step="publish to ${DEPLOY_BRANCH}"
cd build
# Without this, GitHub Pages runs Jekyll, which drops SvelteKit's _app/ directory.
touch .nojekyll
[[ -f CNAME ]] || log "warning: build/CNAME missing; the custom domain may be reset"
git init -q
git checkout -q -b "$DEPLOY_BRANCH"
git add -A
git commit -q -m "deploy: ${sha:0:7} ($(TZ=Australia/Sydney date +%F))"
git push -q --force "$REMOTE" "HEAD:refs/heads/${DEPLOY_BRANCH}"

echo "$sha" >"$STATE_DIR/last-sha"
step="notify"
log "deployed ${sha:0:7} to ${DEPLOY_BRANCH}"

notify "${DISCORD_WEBHOOK:-}" "✅Scapedle build completed successfully"
if [[ "$MODE" == "daily" ]]; then
	notify "${DAILY_WEBHOOK:-}" $'🗓️ **A new daily Scapedle is live!** \nCheck it out here: '"$SITE_URL" "Scapedle Announcer"
fi
