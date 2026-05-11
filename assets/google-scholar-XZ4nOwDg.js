const e=`---
title: Google Scholar Paper Tracker
date: 2026-03-27
tags: [chrome-extension, javascript, google-scholar, notion]
description: A Chrome extension that tracks papers opened from Google Scholar, highlights repeat visits in search results, and syncs the reading history into a Notion database.
---

Google Scholar Paper Tracker is a Chrome extension I built to make literature review work easier to remember. When reading papers from Google Scholar, it is surprisingly easy to open the same article again without noticing, especially when searches happen across many days, tabs, and related keywords. This extension turns that browsing history into something visible: papers I have already opened are highlighted directly inside Google Scholar results, with visit count and last visited time shown beside the title.

The project also connects the local browser history to **Notion**, so the papers I click can become a lightweight research database instead of disappearing into Chrome history. It keeps track of the paper title, source or author line, normalized URL, first visit, latest visit, and total visit count.

Source code: [github.com/handeesome/google-scholar-extension](https://github.com/handeesome/google-scholar-extension)

[Try the frontend-only demo](/demos/google-scholar/index.html)

![Notion database setup](/images/projects/google-scholar/tutorial-1.png)

## What It Does

The extension runs on Google Scholar result pages and watches each paper result card. When I click a paper, the content script extracts the title, author/source text, and target URL, then stores the record in Chrome local storage. The URL is normalized first, so Scholar redirect links and noisy tracking parameters do not create duplicate records for the same paper.

After a paper has been visited, later Scholar searches show it with a colored highlight and an inline badge such as the number of visits and the last visited timestamp. This makes the extension useful while searching, not only after the fact in a separate dashboard.

The popup gives a quick summary of the reading history: total papers visited and the most recently opened paper. From there, I can open the full history page, review all stored papers, revisit a paper, delete selected entries, clear local history, or sync everything with Notion.

## Notion Sync

A major part of the project is the Notion integration. The extension uses the Chrome Identity API to start a Notion OAuth flow, then exchanges the authorization code through a Cloudflare Worker so the Notion client secret is not exposed inside the browser extension.

After login, the extension searches for the database the user granted access to and saves that database ID locally. It also checks the database schema and creates missing properties such as \`URL\`, \`Author / Source\`, \`Visit Count\`, \`First Visited\`, and \`Last Visited\`. This means the Notion setup is mostly automatic instead of requiring the user to manually create every column.

![Notion authorization](/images/projects/google-scholar/tutorial-3.png)
![Select database access](/images/projects/google-scholar/tutorial-4.png)

The sync is designed to work in two directions. Local papers can be exported into Notion, and papers already present in Notion can be imported back into the extension's local history. When a clicked paper has already been synced, the extension updates the existing Notion page rather than creating a duplicate. If a stored Notion page ID becomes stale, the extension can recreate the page and repair the local reference.

## Technical Shape

The extension is built as a **Manifest V3** Chrome extension with plain JavaScript. The main pieces are:

- \`content.js\`, which reads Google Scholar result cards, normalizes paper URLs, highlights visited papers, and records clicks.
- \`background.js\`, which handles OAuth, Notion API calls, schema setup, queue-based auto-sync, imports, exports, and remote deletion.
- \`popup.html\` and \`popup.js\`, which show quick stats and link to the full history view.
- \`history.html\` and \`history.js\`, which provide the main management screen for login, sync, deletion, and browsing saved papers.

One detail I like in the implementation is the sync queue. Paper clicks can happen quickly while browsing, so the background service worker queues auto-sync jobs and processes them with a short delay. That keeps Notion requests orderly and avoids making the browsing experience depend on a network request finishing immediately.

## Why I Built It

I built this because research reading is not just about finding papers, but remembering the path I have already taken. Google Scholar is good at discovery, but it does not tell me which results I have opened before, how many times I returned to them, or when I last looked at them.

This project makes that memory visible at the exact moment it matters: while scanning search results. The Notion sync then gives the history a longer-term home, so a messy sequence of clicks can become a small research log. It is a practical extension, but the part I enjoyed most was connecting tiny browser interactions to a larger personal knowledge workflow.
`;export{e as default};
