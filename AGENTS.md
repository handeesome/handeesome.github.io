# Project article work

When the user asks to add, update, improve, or check the website's Projects articles, use `docs/project-article-sync-workflow.md` as the task workflow and `docs/project-article-template.md` as the editorial standard.

- Start with `npm run projects:audit`. Check the whole registered collection even when the user names only one project, unless the user explicitly limits the scope.
- The audit is a read-only local change detector, not an article updater. Complete the source comparisons and remote checks described in the workflow before claiming that an article is current.
- Keep source projects read-only. Change this website's articles, assets, and review records within the authorized task.
- Preserve the technical depth requested by the user: explain architecture, implementation challenges, design choices, and verification, using source evidence.
- Treat sources without a review baseline or access as unverified. Report them and continue with available sources.
- Do not rewrite unchanged articles, publish, push, or create scheduled checks merely because this workflow is being used.
