# @halonicjs/studio-feature-runs

The Studio Runs: the runs list, the run page with its receipt and what each run ran, Home's Recent runs and Ctrl K's run rows. It reads the open workspace's runs from `RunsSourceService`, which the app provides, and says about each run what `halonic runs` says: where a run stands and what it waits for come from `runStanding` and `runWait` in `@halonicjs/app`, and money from `moneyAmount`.

- **Layer:** studio
- **Owner:** elena
- **Public API:** `@halonicjs/studio-feature-runs` (the feature) and `@halonicjs/studio-feature-runs/api`

## Example

```ts
import { RunsSourceService, runRow } from "@halonicjs/studio-feature-runs/api";

const source = context.services.get(RunsSourceService);
const rows = (await source.list()).map((run) =>
  runRow(run, {
    workflow: source.workflow(run.summary.hubId, run.summary.workflowId),
    currency: source.currency(),
    now: new Date(),
  }),
);
rows[0]; // { shortId: "01jd8q", chip: { word: "Needs you", tone: "warning", dot: true }, line: "Waiting for 2 approvals", … }
```

A row's line is never empty and says what the What column of `halonic runs` says (requirement `runs.row`). A finished run shows its cost with the calls that had no price, and never "€0.00".

The run page says under its title what the run ran, from the version its run.started records:

```tsx
import { RunVersionLine } from "./run-view/run-version-line.tsx";

<RunVersionLine version={started.version} now={new Date()} />;
// "Ran the live version from 10:42." (commit in the tooltip), "Ran the saved files."
// or, for a run from before the log recorded it, "Version not recorded."
```

The line says when the version was made, never when a file changed, and never suggests that saved changes don't run (requirement `runs.run-view.live-or-saved`).

## Blocked sites

Each site a step's sandbox refused is named once, with its tries (requirement `runs.run-view.blocked-sites`), from `blockedSites` in `@halonicjs/events`:

```tsx
import { blockedSites } from "@halonicjs/events";
import { BlockedSitesLine, BlockedSitesPanel, entrySiteLimit } from "./run-view/blocked-sites.tsx";

const [install] = blockedSites(events, { limit: entrySiteLimit });
// Under the step's meta line: "Blocked 2 sites", which opens the step's entry.
<BlockedSitesLine step={install} expanded={open} onOpen={openEntry} />;
// In the open entry: the sites, the hint and "Open Writer's allowed sites".
<BlockedSitesPanel step={install} agent="Writer" noConnectionProven place="desktop" onOpenAllowedSites={openHarness} />;
```

`BlockedSitesLogLines` writes the run log view's "Blocked: registry.npmjs.org (12 tries)" lines (`logSiteLimit`, 20 per step), and `BlockedSitesBannerText` the failed banner's several-sites sentence. Every sentence comes from `blocked-sites-words.ts` by key; the words are placeholders until the board approves the sandbox screens (HAL-1784).

- Site names are plain text, never links, with the registrable domain in bold (`SiteNameText`, from `siteName` in `@halonicjs/std`).
- Studio never adds a site: the action opens the agent's allowed sites, and the person adds it.
- Pass `noConnectionProven={false}` for a run on Windows until the blocked-site suite runs green there (HAL-6219): on Windows a blocked name may still be looked up outside the sandbox, so the hint leaves out "No connection was made."
- Only traffic through the sandbox's proxy has a site name. A block without one gets no row in 0.1.
