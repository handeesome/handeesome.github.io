# Project article editorial standard

Use this standard for new articles and substantive updates. Articles remain English, first-person project write-ups unless the user requests another language or voice. Product names can stay in Chinese. The workflow and source registry live in [project-article-sync-workflow.md](project-article-sync-workflow.md).

## Required substance

Every article should let a reader answer these questions:

1. What problem does this project solve, and who uses it?
2. What does the actual workflow look like?
3. What did the author implement, and which capabilities come from libraries or services?
4. How do the main components and data flows fit together?
5. What are the meaningful implementation challenges and design tradeoffs?
6. Where is state stored, which services receive data, and what persists?
7. How is it packaged or deployed, what is verified, and what remains limited?

Use a maintained README for product facts, linked architecture documents for reasoning, and focused source files for implementation details. A technology list alone does not satisfy the technical standard. Do not invent motivations, usage numbers, performance gains, security guarantees, authorship, or test results.

## Article skeleton

The following is a writing outline, not text to leave in a published article. Adapt section titles to the project. Omit irrelevant sections rather than filling them with generic prose. A small tool may need only a few paragraphs; a system with concurrency or media processing needs more explanation.

```markdown
---
title: Project name
date: YYYY-MM-DD
tags: [technology, domain]
description: One concise sentence explaining the concrete purpose.
---

Introduce the problem, intended user, and result in one or two paragraphs.
Use first person for supported implementation decisions.

Provide source, live app, download, or demo links that actually exist.
Label repositories requiring access. Do not invent a deployment URL.

## What It Does

Explain the main user journey with one concrete example or scenario.
Include a representative real screenshot for a project with a visible interface.
Add focused interaction states beside the workflow they explain when useful.

## Technical Architecture

Explain each main component's responsibility and the data flow.
Identify both the application logic and the external dependencies.

### A Key Implementation Challenge

Describe the problem, the mechanism implemented, and its consequence.
Examples include concurrent admission, timing/geometry consistency,
external-service failure recovery, or preserving an original audio stream.
Use one to three substantive subsections rather than a feature inventory.

## Data, Packaging, and Deployment

Describe storage, data sent to services, runtime dependencies, and the
meaningful deployment or update choices. Include setup commands only
when they help someone run the project and have been source-checked.

## Verification and Current Scope

Separate source-documented checks from checks performed in this task.
Distinguish simulated integrations from real-service and device evidence.
State relevant limitations in proportion to the project.
```

## Visual presentation

- Projects has its own list and article layout. Preserve the shared navigation, site palette, light/dark themes, and other pages. `ProjectsHeader.jsx` selects a compact header only for `/projects` routes.
- `projectData.js` reads article front matter and supplies presentation metadata. Register selected projects and categories there; a new article otherwise appears automatically in the chronological list. Use real maintained images when available, or clearly label an illustration. Never present a drawn interface as a screenshot.
- The first Markdown image is reused as a detail-page hero and removed from its old position at render time without changing the article file. Give it meaningful alt text; that text is also used as its caption. All article images support enlargement.
- Interface projects should have at least one clear, current screenshot. Prefer an overview for the first image and one or two additional views for meaningful new components or interaction states. Preserve accurate existing images. Capture the real UI with isolated example data, identify demonstration content in captions, and verify that presentation metadata actually displays the screenshot instead of an older illustration. Report unavailable captures; do not fabricate an interface. Projects without a visual interface may use a relevant real result instead.
- Put the project name and summary first, followed by real source/demo/download links, then the preview and article. Keep prose around 680px wide, with wider media and a desktop table of contents. Use the collapsible contents list on narrow screens.
- Keep implementation details in the article. Use purpose, outcome, and a small number of technologies in list previews. Preserve original dates and source access labels.
- Scope all new presentation styles to Projects. Verify 320px/390px, desktop, both themes, image viewer keyboard behavior, contents links, missing slugs, and a non-Projects page when changing the shared header selector.

## Editorial checks

- Explain mechanisms and their purpose: what is stored or checked, where, when, and why it matters.
- Prefer precise claims over promotional adjectives and dense lists of technologies.
- Preserve the original project date on updates; record review dates in the ledger.
- Keep linked or derivative projects in one article when requested, with clear differences in scope and architecture.
- Correct outdated claims as well as adding new capabilities. Integrate changes into the article rather than appending release notes.
- Retain readable paragraphs for general readers, then provide enough technical detail for an engineer to assess the work.
- Never copy credentials, invitation codes, private user records, production URLs from configuration, or private test artifacts into the article.
- Use headings, lists, links, images, and inline code supported by `ProjectPage.jsx`. It currently does not enable GFM tables or Mermaid; use prose/lists or a checked image instead. Fenced code blocks have a custom presentation, so verify their rendered appearance before adding one.
- Leave no placeholders, unsupported claims, broken local asset links, or empty sections.
