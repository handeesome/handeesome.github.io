# Project Article Sync Workflow

Use this workflow whenever project articles on the personal website are added, refreshed, or reviewed. `AGENTS.md` routes future project-article tasks here. The registry below is canonical; do not scan drives or every Codex workspace to rediscover projects.

The default scope is the requested project plus a review of the existing registered collection for meaningful additions, corrections, and retired features. Follow an explicit user limit such as "only update this article". Run on invocation; this workflow does not create a schedule, a background agent, or a new chat.

For a Projects-only visual/layout request, run the inventory but keep source synchronization out of scope unless requested. Follow the visual standard from the template, preserve article content and source review dates, and verify that other website routes retain their existing appearance. A layout check does not establish source freshness or a new review baseline.

## Quick start

1. Read this workflow and [the article standard](project-article-template.md).
2. Run `git status --short` and `npm run projects:audit`.
3. Review requested projects and collection entries flagged for inspection, including remote entries. Update articles when current evidence warrants a change.
4. Validate affected articles, then record only the source snapshots actually reviewed.

Useful prompts:

> 按 Projects workflow 添加这个项目：<local path or repository URL>，并检查已有项目有没有值得补充的更新。

> 按 Projects workflow 检查并更新已有文章，保留原来的项目日期和技术深度。

> 按 Projects workflow 只检查更新，先给我差异清单，不修改文章。

## Source of truth

The source project's current README and explicitly linked component READMEs are authoritative for features, setup, architecture, links, privacy behavior, and project status. Use linked design documents and focused source files to substantiate technical details. The article is a public-facing derivative with the technical depth of a useful README and the flow of a project write-up; do not copy the source README line by line.

Do not change a source project while updating the personal website unless the user explicitly asks for that too. Preserve uncommitted changes in every source repository.

## Project registry

| Article slug | Website article | Source workspace | Read first | Website assets |
| --- | --- | --- | --- | --- |
| `auto-pptx` | `src/content/projects/auto-pptx.md` | Local source path is currently missing; former path: `C:\Users\ducenhan\Desktop\ppt转pptx` | Article plus [GitHub repository](https://github.com/handeesome/ccg-bremen-auto-pptx) | `public/images/projects/auto-pptx/` and `public/demos/auto-pptx/` |
| `google-scholar` | `src/content/projects/google-scholar.md` | `C:\Users\ducenhan\Desktop\google-scholar-extension` | `README.md` | `public/images/projects/google-scholar/` and `public/demos/google-scholar/` |
| `hugo-book` | `src/content/projects/hugo-book.md` | `D:\my-projects\香草山\xiangcaoshan` | `README.md` | Add future images under `public/images/projects/hugo-book/` |
| `second-brain` | `src/content/projects/second-brain.md` | `D:\my-projects\obsidian\secondBrain\第二大脑` | `README.md` | Add future images under `public/images/projects/second-brain/` |
| `tcg-card-manager` | `src/content/projects/tcg-card-manager.md` | `D:\my-projects\卡牌交易助手` | `README.md` | `public/demos/tcg-card-manager/`; add images under `public/images/projects/tcg-card-manager/` |
| `notion-widgets` | `src/content/projects/notion-widgets.md` | `C:\Users\ducenhan\Desktop\Notion_Widgets` | `AGENTS.md`, root `README.md`, then the README of each changed widget | `public/images/projects/notion-widgets/` |
| `pnyl` | `src/content/projects/pnyl.md` | `C:\Users\ducenhan\Desktop\信仰大富翁` | Root `README.md`; read a subproject README only when that subproject changed | Add future images under `public/images/projects/pnyl/` |
| `score-karaoke-studio` | `src/content/projects/score-karaoke-studio.md` | `C:\Users\ducenhan\Desktop\歌谱文字滚动` | Root `README.md` and [GitHub repository](https://github.com/handeesome/score-karaoke-studio) | Add future images under `public/images/projects/score-karaoke-studio/` |
| `learning-guide-live` | `src/content/projects/learning-guide-live.md` | Local source path not yet registered; covers Learning Guide Live and its Private Meeting Room derivative | [Learning Guide Live README](https://github.com/handeesome/learning-guide-live) and the authorized [Private Meeting Room repository](https://github.com/handeesome/private-meeting-room) | `public/images/projects/learning-guide-live/` |
| `personal-website` | `src/content/projects/personal-website.md` | This repository: `D:\my-projects\personal website\my-website\vite-app` | Root `README.md` and relevant files named in the requested update | Add future images under `public/images/projects/personal-website/` |

## Update procedure

### 1. Inventory and source access

Run the audit before editing. It reads the registry and local source metadata, compares recorded source/article fingerprints, and reports one status per article. It makes no network requests, reads no credentials, and does not change source repositories.

| Audit status | Required next step |
| --- | --- |
| `no-baseline` | Compare the current README and article before establishing a baseline. This means unverified, not newly changed. |
| `changed` | Compare the source commits, selected source-file hashes, and article with the last reviewed snapshot. |
| `working-tree-review` | Inspect relevant uncommitted source changes as well as the README; preserve all source work. |
| `unchanged` | Local HEAD, selected files, and article match the recorded baseline. Skip repetitive local rereads, then check the upstream revision or relevant releases through authorized read-only access. |
| `remote-check-required` | Read the current remote README and relevant commits/releases through authorized access. |
| `source-unavailable`, `readme-unavailable`, `git-status-unavailable`, `article-missing` | Resolve with the known source/URL or report the exact gap. Continue unaffected work. |

The audit fingerprints root `README.md`, `AGENTS.md`, `docs/DESIGN.md`, `docs/ARCHITECTURE_DECISIONS.md`, local HEAD, and the website article. Git working-tree checks also flag non-ignored untracked work. It does not prove feature parity, inspect all component READMEs, or verify remote deployment state. Agent review supplies those checks. For this website's own article, distinguish changes to the product from article-maintenance changes to avoid a self-update loop.

Check only mapped local paths. If a source root contains `AGENTS.md`, read it before using that source. Then follow **Read first** and relevant linked documents. For a missing local path, use its known repository URL; do not search unrelated drives. Prefer an existing authorized connector or CLI for private sources. A 404 or lack of access means unverified, not deleted or unchanged. Never extract credentials merely to satisfy this workflow; use existing authorization and the environment's approval rules. Do not request secrets in chat or record them in review files.

The registry is the scope boundary. Add a row for a newly supplied project. Related projects may share one article when requested, with every source listed in **Read first**. Remote combined articles require every listed repository to be checked separately.

For a registered Git source with an origin, check its current upstream revision and relevant release/README changes through authorized read-only tools, even if the local fingerprint is unchanged. Do not fetch, reset, or update the source checkout to do this. If upstream differs, inspect that difference alongside the current local work before deciding which claims are current. If network access is unavailable, report "local source checked; upstream unverified" instead of claiming the project is fully current. Projects with no upstream can be reviewed from their mapped local source alone.

### 2. Compare the existing collection

For each entry needing inspection, compare its current article with source evidence. Use the previous ledger date, known commit, and relevant `git log`/`git diff` history to narrow the read; an arbitrary recent commit count is not proof that all changes since review were covered. On the first run, old ledger dates are context, not exact fingerprints.

Look for:

- capabilities added, removed, renamed, or moved out of scope;
- architecture, data model, persistence, external-service, privacy, or deployment changes;
- implementation challenges now solved and worth explaining;
- changed setup, packaging, supported platforms, live links, downloads, and demo limitations;
- old claims contradicted by the current implementation;
- source-documented verification evidence and its limits.

Create a compact internal disposition for each inspected article: update needed, reviewed/no article change, or blocked/unverified. A commit or version bump alone does not require a paragraph. For normal add/update requests, integrate supported, relevant changes in available existing articles as part of the task. For an explicit audit-only request, return the difference list without editing articles or recording them as synchronized.

Do not run applications, source test suites, paid media/LLM calls, or production workflows merely to find article updates. Read documented evidence and distinguish it from checks performed in this task. If a README and implementation disagree, resolve the affected claim with focused evidence or state the uncertainty.

### 3. Write to one standard

Use [project-article-template.md](project-article-template.md) for the required substance and outline. The expanded `score-karaoke-studio.md` and `learning-guide-live.md` articles are current examples of technical depth, not text to duplicate.

Explain the purpose, main workflow, component responsibilities, data flows, concrete implementation challenges, design tradeoffs, and relevant verification/deployment scope. Attribute libraries and services accurately. Keep the first-person voice, preserve existing project dates, and integrate updates into the article instead of appending a changelog. Omit irrelevant outline sections. Do not pad a small project to match a larger system.

New Markdown files under `src/content/projects/<slug>.md` are discovered automatically by `Projects.jsx` and `ProjectPage.jsx`; ordinary additions do not need route or component changes. Check the front matter's title, date, description, and tags. Keep source and demo links accurate, label private repositories as requiring access, and do not publish private operational details.

### 4. Maintain images only when useful

Prefer a maintained current source screenshot. Otherwise render the real UI using the applicable browser skill. Keep unchanged images when the UI has not changed. Save final assets under `public/images/projects/<slug>/` with descriptive lowercase filenames, open each new image at original detail, and inspect it before linking. Never include credentials, private notes, actual invitation codes, gallery editing IDs, personal records, or production data.

### 5. Validate and record

When articles/assets changed, run `npm run build` once for the completed batch and preview affected list/detail routes. Verify headings, inline code, images, external links, light/dark themes, and narrow layouts. Use the browser skill for browser verification. Reuse passing checks when nothing relevant changed; documentation or audit-tool-only work needs focused syntax/CLI/diff checks rather than another application build.

Finish with `git diff --check` and `git status --short`. Source projects remain read-only; do not deploy or push without authorization.

After actually comparing a local source and its final article, record its fingerprint:

```powershell
npm run projects:audit -- --record-reviewed score-karaoke-studio --note "Compared README and timing/rendering implementation with the final article."
```

Do not run the record command for every detected entry or just to make the audit green. Recheck if the source changed during review. Recording is appropriate for a completed review with no article change as well as for an updated article. Store only metadata and short evidence notes in `docs/project-source-reviews.json`, not source contents or credentials. Remote-only sources stay manual checks in this local tool; record the exact repository/commit or README evidence in the human ledger below and never mark them locally unchanged.

Update the human ledger for every completed source/article comparison; preserve the previous date for blocked entries. In the final response report: articles added/updated and the substantive additions, entries reviewed with no change, unavailable/unverified sources, and validation performed. Keep it concise and separate source-documented tests from tests run here.

## Current review ledger

| Article | Last reviewed | Source snapshot used |
| --- | --- | --- |
| `auto-pptx` | 2026-10-29 | Remote HEAD `39af549203088c81b656d3887e4a46733b8d0020`, actual `README.MD` (blob `0c103abd5da6640edad2e87078683036458282c7`) and focused application.py routes. Added batch template conversion, first-slide audio reuse and runtime scope; removed disabled Google Drive claim/image. Local source remains unavailable. |
| `google-scholar` | 2026-10-29 | Local README and focused background.js sync/storage checks; remote HEAD matches local `98a19d97d42304fb285a63636c663d63e29a4185`. No article change needed. |
| `hugo-book` | 2026-10-29 | AGENTS, root README, complete scripts/README-audio-sync.md, reading progress/preferences and audio-text-sync source checks. Remote HEAD matches local `8c72d869083982003b99e7eee10e2260fc506e66`. Added reading state, typography, paragraph synchronization, offline scope and documented test layers. |
| `second-brain` | 2026-10-29 | Local AGENTS, README, Vision v2, user guide and focused validator source. Upstream `ddfeb757d2a2916ba0df54dba4d2df8d6fd43c69` checked via normal Git access and existing remote objects; no differences from local HEAD in reviewed system docs/workflows/scripts. Replaced obsolete confirmation queues with automatic evidence-aware maintenance. Private note contents were not used. |
| `tcg-card-manager` | 2026-10-29 | Local README, COLLECTOR_README.md, JIHUANSHE_API.md, server.py and scripts/price_alerts.py; includes uncommitted local documentation/research. Remote HEAD matches committed local `b1dc5e2fe60cd821d71c5c9a63c947ebd3183b9e`. Corrected source list, distinguished ADB collection from incomplete direct API, and added targets, scheduler receipts and recoverable mutations. No holdings, credentials or live collectors read/run. |
| `notion-widgets` | 2026-10-29 | AGENTS, root/Gallery/Weather READMEs and focused gallery/configure.js. Remote HEAD matches local `e30f1b1c1398fcb5eae79a5a5ced1ac939537e12`. Added pointer/keyboard reordering and clarified shared gallery-ID editing access. Existing synthetic screenshots retained. |
| `pnyl` | 2026-10-29 | Local root and debate READMEs; remote root/debate READMEs, recent task clarification patch, and existing Git-object differences against upstream `88931d754fb85666f70af7d0e64fd2a6fcb4949b`. Local branch has additional debate-flow work; reviewed docs agree across both versions. Added shared stage/data/privacy architecture and rehearsal behavior without presenting local-only additions as deployed. |
| `personal-website` | 2026-10-29 | Current README, Projects loader/header/article implementation and maintenance workflow. Upstream dev `02a8be06db13e41d227e0a7c33ef60f052ab7cd7` differs from local committed HEAD only in generated Toggl data. Added the current uncommitted Projects presentation and source-review workflow; no deployment claimed. |
| `score-karaoke-studio` | 2026-10-29 | Existing reviewed local fingerprint unchanged; remote HEAD matches `3246773df77e18fd3459b48cd16e3cf859eed357`. Prior detailed README/timing/rendering comparison remains valid; no article change needed. |
| `learning-guide-live` | 2026-10-29 | Public README rechecked at HEAD `c040d9d2f1f6ff3f46db3de8396fcdb99ecfac50`; authorized Private Meeting Room README rechecked through GitHub API (blob `6183ce6ac772e7c6011d92d5c08d8834cf217e8d`). Both agree with the existing combined article; prior public design/ADR comparison remains valid. Private repository requires access. No article change needed. |

2026-10-29 collection run: updated seven existing articles and retained three after source comparison. All ten front-matter records and local article asset/demo links passed validation; original dates were preserved. The production build passed with the existing large-chunk warning. The seven affected detail routes passed desktop and 390px light/dark rendering, contents-target checks, image loading and overflow checks; the Second Brain example renders five dialogue messages. The initial offscreen-frame image check was inconclusive because of lazy loading; explicit loading confirmed every referenced image. Source application tests, media services and price collectors were not run. Auto PPTX's missing local checkout was resolved with its public source; the two remote-only entries intentionally remain `remote-check-required` in the local CLI. Dirty source worktrees intentionally remain `working-tree-review` after recording, rather than being marked clean.

When a future sync changes an article, update its ledger row in the same edit. Add a row when another registered article is reviewed.

## Prompt for future use

> Follow `docs/project-article-sync-workflow.md` to add/update `<project names>`. Run the source audit, review the registered collection for meaningful changes, apply `docs/project-article-template.md`, update supported article content, validate the affected pages, and record only reviews actually completed. Keep source projects read-only and report unavailable sources without treating them as unchanged.
