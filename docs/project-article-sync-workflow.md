# Project Article Sync Workflow

Use this file as the starting point whenever a project article on the personal website needs to be added or refreshed. The mappings below are canonical; do not begin by scanning drives or every Codex workspace.

## Source of truth

The source project's current README and explicitly linked component READMEs are authoritative for features, setup, architecture, links, privacy behavior, and project status. The article in this repository is a public-facing derivative: it should explain the project clearly without copying the README line by line.

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
| `personal-website` | `src/content/projects/personal-website.md` | This repository: `D:\my-projects\personal website\my-website\vite-app` | Root `README.md` and relevant files named in the requested update | Add future images under `public/images/projects/personal-website/` |

## Update procedure

1. Read this workflow and select only the registry rows named by the user.
2. Check the exact source path with `Test-Path`. Do not search other drives when a mapped path exists.
3. If the source root contains `AGENTS.md`, read it before using that source. Then read the files in **Read first**. Follow links from those READMEs only when the changed feature needs more detail.
4. Read the current website article and compare its claims with the source README. Pay particular attention to:
   - newly added or retired features;
   - current live and source links;
   - architecture, storage, and external services;
   - privacy, credentials, and data-retention behavior;
   - setup steps that materially explain the project;
   - wording that implies an old feature is still live.
5. Update the article as an essay, not as a changelog. Keep the existing first-person voice, preserve the original project date unless the article describes a new project, and use the README's language only as factual grounding.
6. For screenshots:
   - prefer a current screenshot already maintained by the source project;
   - otherwise render the real local or deployed UI with `browser-act`;
   - never expose gallery IDs, API secrets, private notes, personal records, or production credentials;
   - store final images under `public/images/projects/<slug>/` with descriptive lowercase filenames;
   - open each image at original detail and visually check it before linking it from Markdown.
7. Run `npm run build` in this repository.
8. Preview the affected `/projects/<slug>` routes and verify headings, images, links, light theme, dark theme, and narrow-screen layout. Use `browser-act` when browser verification is required.
9. Finish with `git diff --check` and `git status --short`. Report changed articles, source files consulted, screenshots added, and any source path that was unavailable.

## Current review ledger

| Article | Last reviewed | Source snapshot used |
| --- | --- | --- |
| `hugo-book` | 2026-09-04 | Xiangcaoshan working-tree `README.md`, including the documented text/audio preparation workflow |
| `notion-widgets` | 2026-09-04 | Root, Gallery, and Weather READMEs; Gallery and Weather UIs rendered for screenshots; Visual Board and Vertical Board examples use local cat/dog training images rather than personal book covers |
| `pnyl` | 2026-09-04 | Root README and the current descriptions of its five activity tools |
| `personal-website` | 2026-09-04 | Current repository README and project-loading implementation |

When a future sync changes an article, update its ledger row in the same edit. Add a row when another registered article is reviewed.

## Prompt for future use

> Read `docs/project-article-sync-workflow.md`, then update the website project articles for `<project names>` from their mapped source READMEs. Do not scan all workspaces. Update screenshots only when the source UI changed, run the documented checks, and update the review ledger.
