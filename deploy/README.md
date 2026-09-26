# Deploying Scapedle

Scapedle is built and published by a Docker container run from a host scheduler. GitHub Actions is not used.

- `Dockerfile`: toolchain only (Node, pnpm 11.1.2, git). Each run clones a fresh copy of the source.
- `scripts/deploy.sh`: clone → `pnpm install` → `pnpm run build` → force-push `build/` to `gh-pages` → Discord notifications.
- GitHub Pages serves the `gh-pages` branch at scapedle.com.

The daily word is baked in at build time from the **Australia/Sydney** date, so the site must be rebuilt just after midnight Sydney time.

| Command                                      | What it does                                                                  |
| -------------------------------------------- | ----------------------------------------------------------------------------- |
| `docker compose run --rm builder daily`      | Always rebuilds and posts the "new daily Scapedle" announcement               |
| `docker compose run --rm builder if-changed` | Rebuilds only if `main` moved since the last deploy (replaces on-push builds) |

Runs are serialised with a lock. A poll that starts during a deploy is skipped, and the daily build waits for the running deploy to finish.

## One-time setup

### 1. GitHub

1. **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, then pick `gh-pages` / `/ (root)`. Do this after the first deploy has created the branch. Confirm the custom domain is still `scapedle.com`.
2. Create a **fine-grained personal access token** limited to this repository, with **Contents: Read and write**.
3. **Settings → Webhooks → Add webhook** for the issue, PR and commit notices in Discord:
   - Payload URL: your Discord webhook URL with `/github` appended
   - Content type: `application/json`
   - Events: _Issues_, _Pull requests_, _Pushes_

   Discord formats these messages itself.

### 2. Host (Linux with Docker + systemd)

```sh
sudo git clone https://github.com/asbedb/Scapedle.git /opt/scapedle
cd /opt/scapedle
sudo cp .env.example .env && sudo chmod 600 .env   # fill in GH_TOKEN and the webhooks
sudo docker compose build

# First deploy (creates the gh-pages branch)
sudo docker compose run --rm builder daily
sudo cp deploy/systemd/scapedle-* /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now scapedle-daily.timer scapedle-poll.timer
systemctl list-timers 'scapedle-*'
```

To pick up changes to the `Dockerfile` or `scripts/deploy.sh`, run `git pull && docker compose build` in `/opt/scapedle`. Site code changes need no action on the host, because every run clones `main`.

### Without systemd (cron)

Requires a cron that supports `CRON_TZ`, such as cronie:

```cron
CRON_TZ=Australia/Sydney
1 0 * * *   cd /opt/scapedle && docker compose run --rm builder daily      >> /var/log/scapedle.log 2>&1
*/5 * * * * cd /opt/scapedle && docker compose run --rm builder if-changed >> /var/log/scapedle.log 2>&1
```

## Testing against a scratch branch

Set `DEPLOY_BRANCH=gh-pages-test` in `.env`, run `docker compose run --rm builder daily`, and check that the branch contains `index.html`, `_app/`, `CNAME` and `.nojekyll`. Remove the override when you're done.

## Logs

`journalctl -u scapedle-daily -u scapedle-poll`
