import{c as je,g as Kn,j as L}from"./index-DSUsi7tG.js";import{C as Jn}from"./check-Bi3I9ULQ.js";/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Vn=[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]],un=je("arrow-right",Vn);/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Qn=[["path",{d:"M7 7h10v10",key:"1tivn9"}],["path",{d:"M7 17 17 7",key:"1vkiza"}]],Bi=je("arrow-up-right",Qn);/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $n=[["path",{d:"M2 10v3",key:"1fnikh"}],["path",{d:"M6 6v11",key:"11sgs0"}],["path",{d:"M10 3v18",key:"yhl04a"}],["path",{d:"M14 8v7",key:"3a1oy3"}],["path",{d:"M18 5v13",key:"123xd1"}],["path",{d:"M22 10v3",key:"154ddg"}]],Xn=je("audio-lines",$n);/**
 * @license lucide-react v0.541.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Zn=[["path",{d:"M10.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v8.4",key:"1d3kfm"}],["path",{d:"M8 18v-7.7L16 9v7",key:"1oie6o"}],["circle",{cx:"14",cy:"16",r:"2",key:"1bzzi3"}],["circle",{cx:"6",cy:"18",r:"2",key:"1fncim"}]],ei=je("file-music",Zn),ni=`---
title: CCG Auto PPTX Generator
date: 2024-01-03
tags: [python, flask, python-pptx]
description: A Flask app that helps church coworkers generate weekly worship PowerPoint slides from structured service content, Bible passages, and song lyrics.
---

CCG Auto PPTX Generator is a tool I built for the weekly worship slide workflow at **Chinese Church Bremen**. Preparing church slides is repetitive work: names, announcements, Bible passages, responsive readings, sermon information, songs, and formatting all need to be arranged carefully every week. The goal of this project is to let coworkers focus on the content instead of spending time adjusting fonts, line spacing, slide layouts, and repeated PowerPoint formatting.

The app is built with **Flask** and **python-pptx**. It provides a web form where users can enter the service information once, then generate a ready-to-use \`.pptx\` file with consistent styling.

Source code: [github.com/handeesome/ccg-bremen-auto-pptx](https://github.com/handeesome/ccg-bremen-auto-pptx)

[Try the frontend-only demo](/demos/auto-pptx/index.html). It previews the form; generating files requires the Python backend.

![A simple form](/images/projects/auto-pptx/simple-form.png)

## What It Does

The main workflow collects the content needed for a Sunday worship service, including service roles, Scripture readings, sermon details, songs, announcements, offering response, monthly memory verse, and prayer items. After submission, the backend assembles everything into a PowerPoint deck using predefined slide templates.

A key part of the project is Bible passage handling. Users select the book, chapter, and verse range from dropdowns instead of manually copying text. The app then looks up the passage, formats the verse numbers, wraps long lines for slide readability, and inserts the result into the correct section of the deck.

![bible verses](/images/projects/auto-pptx/verses.png)

The project uses the 2010 **Revised Chinese Union Version** / 《和合本修订版》 text, sourced from the Hong Kong Bible Society site. I also added logic to support verse ranges that appear as a single text entry, such as \`路1:1-3\`, so generated slides preserve the correct verse labels instead of renumbering them incorrectly.

## Song Slide Tools

The app now has three entry points: a complete worship deck, a single song made from lyrics, and a batch converter for existing song decks. The lyric editor generates a pagination draft that coworkers can rearrange before export.

The DIY lyric tool helps split lyrics into pages, preview the result, and export a new PowerPoint file with the church's slide style. This makes it easier to create consistent song slides without manually duplicating and formatting PowerPoint pages.

The earlier Google Drive integration is disabled in the current source. Existing song decks can instead be uploaded for lyric extraction and regeneration with the current template.

![DIY-lyrics](/images/projects/auto-pptx/DIY-lyrics.png)

## Reusing Old Song Decks

Changing a church slide template should not require manually rebuilding an entire song library. The batch workflow uploads old \`.pptx\` files in chunks, extracts their lyric pages, and regenerates each deck through the same \`python-pptx\` template generator used by the single-song editor. When first-slide audio is available, the importer attempts to carry it into the new deck.

Flask keeps each batch's working files and generated outputs in separate temporary directories. Each chunk returns successful and failed files separately, duplicate output names receive numbered suffixes, and the final step returns either one PowerPoint file or a ZIP archive. This makes partial failures visible while preserving the files that converted successfully.

The worship form can also import lyric pages and available audio from existing song decks into its song slots. Structured service information and reusable song content meet at the deck generator, rather than requiring coworkers to merge separate presentations by hand.

## Runtime and Current Scope

The frontend uses plain HTML, CSS, and JavaScript; Flask handles form data, uploads, extraction, and downloads. \`requests\` and BeautifulSoup support external content lookups. This needs a Python service with writable temporary storage, so a static frontend host alone cannot generate the files.

The README documents running \`python application.py\` after installing the Python dependencies. Generated audio may still need its cross-slide playback settings adjusted in PowerPoint. The source includes cleanup after downloads, while production operation also needs upload limits, disk-space management, and cleanup for abandoned temporary work. The batch behavior described here was checked against the current README and routes; it is not a claim that every legacy deck or audio format has been exercised.

## Why I Built It

This project came from a real weekly need. Before this tool, preparing slides required many small manual steps, and small formatting mistakes were easy to introduce under time pressure. By turning the repeated parts into a structured app, the process became faster, more consistent, and easier for different coworkers to share.

It is a practical project, but I enjoyed it because it sits at the intersection of software, design, and service. The most satisfying part was not just generating a PowerPoint file, but making a workflow that respects the people who have to use it every week.
`,ii=`---
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
`,ri=`---
title: Xiangcaoshan Christian Reading Library
date: 2025-01-21
tags: [hugo, javascript, netlify, markdown]
description: A Hugo reading and listening library with saved reading progress, adjustable typography, paragraph audio highlighting, music, and children's resources.
---

Xiangcaoshan is a Christian reading and listening library built with **Hugo**, custom JavaScript, and a modified \`my-book\` theme. The site gathers spiritual writings from authors such as Watchman Nee, Andrew Murray, T. Austin-Sparks, Jessie Penn-Lewis, John Nelson Darby, Thomas a Kempis, and others, then presents them in a quiet, book-like browsing experience.

The heart of the project is a structured bookshelf: books are organized by author and chapter, long-form text is stored in Markdown, and supported chapters include playable audio so readers can either read slowly or listen along. Beyond the bookshelf, the site also includes Christian music and children's learning resources, making it a small but complete media library for reading, listening, and discovery.

## Links

- **Source code:** [GitHub repository](https://github.com/handeesome/xiang-cao-shan-HUGO)
- **Live site:** [xiangcaoshan.netlify.app](https://xiangcaoshan.netlify.app/)

## What It Includes

The reading experience is built around a browsable Christian bookshelf. Each book has its own chapter pages, making the content feel closer to a digital library than a flat collection of files. For books with available recordings, chapters can be played directly on the page, and a **play all** feature lets visitors continue listening without manually opening every chapter.

The music section extends the same idea to worship media. It supports folders, sorting, pagination, thumbnails, and a remote media index, so the library can grow without forcing every item into hand-written pages. A separate children's section keeps family-friendly learning material easy to find.

## Technical Shape

The site uses **Hugo** as the static site generator, with content stored primarily under \`content/books\`, \`content/music\`, and \`content/children\`. Markdown keeps the book chapters easy to maintain, while custom JavaScript handles bookshelf filtering, audio playback controls, and the interactive music index.

Two Netlify serverless functions support the parts that need dynamic behavior. One validates the requested book and audio path, then redirects to Alibaba Cloud OSS. Another reads a remote music manifest, groups folders, sorts entries, and returns paginated JSON with short-lived server and HTTP caching. Large audio and video files stay outside Git.

## Returning to a Long Book

I added browser-local reading history for the 30 most recently visited reading pages. It saves the chapter, paragraph position, and paused audio progress. Opening the homepage directly can return to the latest chapter; explicit homepage links, reloads, browser back navigation, and chapter fragments retain their intended destinations. Audio resumes from its saved time only after the reader presses play. No reading history is sent to a server.

Typography is part of the same problem. Readers can preview sans-serif or serif text and choose a body size from 14 to 26 pixels, with preferences saved locally. Changing the font keeps the current paragraph in view. On mobile, reading controls return progressively when scrolling upward and hide when scrolling down, while the table of contents reveals the current section. Navigation dialogs also handle keyboard focus.

## Connecting Paragraphs to Audio

Supported recordings can highlight the paragraph currently being read. A local Python tool uses **faster-whisper**, or existing word-timed transcripts, to align the chapter text and produce timing JSON. The website fetches that JSON on demand and connects each cue to the rendered paragraph using its target index and normalized text. Headings remain in the page's element indexing but are excluded from alignment and highlighting, avoiding shifted paragraph targets.

The difficult part is accepting the timing. Repeated phrases, introductory quotations, omitted passages, and edited recordings can all create plausible but wrong matches. The workflow checks paragraph identity and its opening and closing phrases, compares targets against Hugo's actual HTML, and calls for listening at boundaries and ambiguous sections. Unverified generated candidates stay local by default. Partial repair changes only boundaries with evidence and retains unresolved timings and warnings.

I chose paragraph-level highlighting because it can be reviewed and maintained alongside the chapters. The recognized transcript locates the text; the public page still shows the edited source text. Published timing JSON belongs in Git, while recordings, models, transcripts, and temporary reports remain separate.

## Preparing Books and Audio

The material goes through a preparation workflow before Hugo builds the public site. Source text may begin as a PDF or Word document, and scanned pages may need OCR. I remove headers, footers, page numbers, and extraction noise; repair unwanted line breaks and paragraph boundaries; preserve headings, quotations, and notes; then split the cleaned text into chapter-based Markdown with Hugo front matter. The final chapters are proofread against the source before publication.

Audio is prepared separately with **FFmpeg** when recordings need to be resized, re-encoded, or joined in chapter order. Filenames and chapter boundaries are checked against the Markdown, and the finished duration, playback, format, and output size are verified before the files are uploaded to object storage.

These preparation steps are deliberately separate from the Hugo build and Netlify functions. The repository documents the workflow, but it does not pretend that source extraction and audio cleanup happen automatically inside the website.

## Featured Collection

The bookshelf includes works such as:

- \`人的破碎与灵的出来\` by Watchman Nee
- \`倪柝声全集\` by Watchman Nee
- \`得胜的生命\` by Watchman Nee
- \`效法基督\` by Thomas a Kempis
- \`基督是我们的满足\` by John Nelson Darby
- \`神的心意\` by Andrew Murray
- \`圣灵全备的祝福\` by Andrew Murray
- \`十字架与生命之路\` by T. Austin-Sparks
- \`魂与灵\` by Jessie Penn-Lewis

## Offline Behavior and Verification

The installable PWA uses runtime caching for successfully visited same-origin pages and assets. An uncached page that cannot load shows an offline message. External audio and video still need a connection, so installing the site does not download the media library.

The repository includes Node regression tests for reading progress, typography, mobile controls, lazy audio synchronization, and service-worker navigation, plus Python alignment regressions. Its documented acceptance process combines those checks with a Hugo build, representative mobile and desktop pages, rendered paragraph targets, and audio boundary checks. A successful build alone does not establish that a recording is aligned correctly.

## Why I Built It

I built Xiangcaoshan to make Christian writings and music easier to access, especially for people who want a calm place to read, listen, and return to meaningful resources over time. The project is intentionally simple on the surface, but underneath it solves practical problems around content organization, audio access, media indexing, and long-term maintainability.

What I like most about this project is that it treats static-site architecture as a strength. Hugo keeps the pages fast and durable, Markdown keeps the library editable, and the small serverless layer handles only the pieces that truly need to be dynamic.
`,ti=`---
title: Learning Guide Live & Private Meeting Room
date: 2026-09-10
tags: [nextjs, typescript, livekit, prisma, sqlite, netlify]
description: From a moderated study room with chat and AI summaries to 见面, a simple password-protected video room for two people across their devices.
---

Learning Guide Live is a study room platform I built for small-group discussions. It brings room invitations, host approval, video calls, written chat, and a record of the discussion into one place. I later built **见面 (Private Meeting Room)** on top of this project, simplifying the experience for two people who want a familiar place to call each other.

The two projects share a starting point: a room needs to manage who can enter, what each person can do, and what happens when the conversation ends.

## Learning Guide Live

Participants sign in, open an invitation, and request entry to a topic-based room. The host reviews requests in a waiting room, with a limit of eight seats. Host, Moderator, and Participant roles determine who can approve entry, manage speakers, remove participants, or end the room.

Inside the room, **LiveKit** handles camera, microphone, and screen sharing. Participants can exchange written messages and raise a hand, while moderators can focus a speaker. Screen sharing takes priority on the main stage. Chat and collaboration state are saved by the application, so refreshing the page can recover the discussion context.

![Learning Guide Live room details for a sample philosophy discussion, showing host approval and an eight-person limit](/images/projects/learning-guide-live/study-room.png)

After a room ends, **DeepSeek** can generate a summary from its saved written chat. The summary uses that text as its source; it does not transcribe the call or receive the audio and video.

Source code: [Learning Guide Live on GitHub](https://github.com/handeesome/learning-guide-live)

## 见面 · Private Meeting Room

For 见面, I narrowed the workflow to entering a shared password and joining a call. It is intended for two regular users, with up to four simultaneous device connections so a phone, computer, or extra browser tab can join the same room. Each connection occupies one place, and the media server rejects additional connections when the room is full.

The microphone and camera start off, and each person switches them on when ready. Desktop browsers can share a screen; mobile users can view it, with sharing from the phone depending on browser support. Hanging up leaves the call on that device.

This version uses **React and LiveKit**, with **Netlify** hosting the frontend and server functions. It has no database, user accounts, written chat, recordings, transcription, or call history. The password is checked on the server, and a signed HttpOnly cookie remembers access. LiveKit credentials stay on the server, while participant tokens stay in memory.

Source repository: [Private Meeting Room on GitHub — private, access required](https://github.com/handeesome/private-meeting-room)

The smaller scope makes the difference between the two projects useful to me. Learning Guide Live organizes a group discussion and preserves its written context; 见面 keeps the steps for a recurring private call short. Both use LiveKit, but they need different room rules and different amounts of application state.

## Technical Architecture

Learning Guide Live uses **Next.js and TypeScript** for the custom React interface, authenticated route handlers, and business services. **Better Auth** handles sign-in and sessions; **Prisma and SQLite** store users, rooms, invitations, memberships, join requests, chat messages, and summaries.

The application and media follow separate paths. Browser commands go through the Next.js server and are checked against the database. Audio, video, and screen sharing travel directly between browsers and **LiveKit Cloud**, without passing through the Next.js server. Only server code holds LiveKit management credentials and the DeepSeek API key.

### Admission Under Concurrency

I separated approval, seat reservation, and media-token issuance into distinct steps. Approval makes a member eligible to join; a seat reserves scarce capacity; a short-lived token gives one opaque identity access to LiveKit.

The capacity check and seat claim run inside a SQLite write transaction, acquiring the write lock before reading mutable room state. This prevents concurrent requests from both claiming the final seat in the current single-instance setup. Invitations store a hash of the code and an expiry time, while membership and join-request records have unique room/user pairs.

Connection generations also matter. When the same account takes over from another page, the server revokes the old media identity and checks the reservation generation before applying asynchronous results. A delayed request from the old page cannot release the replacement page's seat.

### Durable Collaboration and Failure Recovery

Chat, hand raising, and speaker focus are saved to SQLite before the server sends a LiveKit notification. The notification tells clients to reload authoritative state. Visible-page polling provides a recovery path if a real-time packet is missed.

External service calls stay outside database transactions. Operations that cross that boundary use explicit intermediate states: ending a room moves through \`OPEN → ENDING → ENDED\`, with \`ENDED\` written only after media cleanup succeeds. Removing a participant records \`KICKED\` before revoking their media access. Partial failures remain visible and retryable instead of being reported as completed.

Summary generation follows the same pattern. A saved generation attempt ID prevents a delayed DeepSeek response from overwriting a newer attempt. The input is bounded written chat and room metadata; provider token counts and the result state are retained with the summary.

### A Smaller Architecture for 见面

见面 keeps a **React** frontend but replaces the account and database layer with **Netlify Functions** and a shared-password check. A signed **HttpOnly cookie** remembers access for 14 days. The server issues LiveKit tokens with a 60-second initial connection window; token expiry does not itself end an established call.

Capacity is enforced by LiveKit's four-connection room configuration, rather than SQL seat reservations. Issuing a token does not reserve a place: the media server makes the admission decision when the device connects. That matches the smaller product, which needs calls across a few devices without durable memberships or discussion history.

Changing the password or session secret invalidates old access cookies after redeployment, but does not immediately terminate existing calls. Those can be ended through LiveKit. Keeping these boundaries explicit avoids treating a website login change as proof that media access has already stopped.

## Verification and Deployment Scope

Learning Guide Live includes isolated SQLite integration tests, concurrency checks, and a complete workflow test with simulated external services. Its current deployment target is a local, single-instance application; moving to several application instances would require revisiting the database and coordination design.

见面 deploys its static frontend and server functions to Netlify and uses a dedicated LiveKit Cloud project for media. Its tests use synthetic credentials and injected service adapters. Actual microphone, camera, screen sharing, device limits, and sustained call quality still need checks on the intended devices and networks. Hosting the page does not change the media route.
`,ai=`---
title: Notion Widgets
date: 2026-09-03
tags: [javascript, notion, supabase, open-meteo]
description: Self-hosted Notion widgets for a cloud gallery, two-city weather, and a shared question box with synchronized progress.
---

Notion Widgets is a collection of small web components that I can host myself and embed into Notion with \`/embed\`. I started it because I wanted widgets that felt visually quiet, stayed under my control, and did not add someone else's branding or tracking to the page.

The repository currently contains three widgets: a configurable image gallery, a weather card for Xiamen and Ningbo, and a question box called 留一个问题. Each widget is a standalone static page, so it can be previewed locally, deployed independently, and embedded without a framework or build step.

## Links

- **Source code:** [GitHub repository](https://github.com/handeesome/notion-widgets)
- **Gallery configuration:** [Open the configuration page](https://handeesome.github.io/notion-widgets/gallery/configure.html) and add your private gallery ID as the \`?id=\` URL parameter
- **Weather widget:** [Open the live widget](https://handeesome.github.io/notion-widgets/weather/)
- **Question box:** [Open the local-storage version](https://handeesome.github.io/notion-widgets/questions/?mode=box); cross-device use requires the full private deck link generated during setup

## Gallery Widget

The gallery stores its images and settings in **Supabase**. A private random gallery ID connects the public display page to its configuration page, where images can be uploaded, replaced, deleted, and reordered. The same page controls layout, image sizing, autoplay speed, transitions, colors, card radius, arrows, dots, and counters.

![Gallery Widget showing cats and dogs in the visual board layout](/images/projects/notion-widgets/gallery-widget.png)

I wanted the gallery to feel good inside a narrow Notion embed rather than behave like a full website. It supports Carousel, Accordion, Fan stack, and Vertical board layouts, along with keyboard controls, touch gestures, hover interactions, autoplay pausing, and links to the original images.

Uploads are prepared in the browser, with the longest edge capped at 1,800 pixels. I prefer WebP, but some browsers return PNG from the same canvas encoding request. The upload path and Content-Type follow the actual output, preserving PNG transparency and avoiding a file labeled as the wrong format. Images above the 8 MB limit are reduced further, and temporary image and canvas memory is released between files. HEIC still depends on the browser's native decoder; an unreadable photo gets a prompt to export a JPEG or PNG copy.

This compatibility change also reaches the backend rules. Existing Supabase installations need the supplied image-format migration so the Storage MIME allowlist, upload paths, and gallery-save validation all accept PNG as well as WebP. The migration preserves existing gallery IDs and photos.

The Vertical board layout keeps the current image in front while nearby cards remain visible above and below as navigation context.

![Gallery Widget showing cats and dogs in the vertical board layout](/images/projects/notion-widgets/gallery-vertical-widget.png)

The configuration page supports mouse and touch reordering. A dragged card lifts out of the list, neighboring cards move aside as it crosses their midpoints, and dropping saves the new order. Long lists scroll near the viewport edge. Esc restores the previous order, and focused cards can also move with Alt + ↑ / ↓. A movement threshold separates a drag from the click used to replace an image, while reduced-motion preferences skip the shifting animation.

The repository contains only a Supabase publishable key. The random gallery ID is deliberately kept out of Git because anyone who knows it can view and edit that gallery. The full embed or configuration URL therefore acts as a shared editing credential, rather than a read-only public link. Opening the page without an ID shows an empty prompt and does not load another gallery.

## Weather Widget

The weather widget shows current conditions for Xiamen and Ningbo in a compact two-card layout. It uses **Open-Meteo**, refreshes every ten minutes, and does not need an API key. The page can follow the system theme or be pinned to light or dark mode through a URL parameter.

![Xiamen and Ningbo Weather Widget](/images/projects/notion-widgets/weather-widget.png)

Both the typography and the animated weather icons were designed for a small Notion frame. The recommended embed size is only 442 × 300 pixels, so the widget keeps the information hierarchy simple: city, condition, temperature, and one animated visual cue.

## 留一个问题: A Shared Question Box

![Question box cover in local mode, using example content](/images/projects/notion-widgets/question-box-cover.png)

The question widget gives a conversation one prompt at a time. Clicking the center opens a box or flips a card to reveal a question; clicking again prepares the next cover. A round does not repeat questions, and a new round avoids immediately repeating the previous question when the deck has more than one entry. Refreshing restores the current question and whether it was revealed. Keyboard operation and reduced-motion preferences are supported.

![Question box after opening, showing a sample question in local mode](/images/projects/notion-widgets/question-box-revealed.png)

The separate Dashboard opens in a new tab. Its editable preview shares the widget's rendering and animations, but uses a fixed example question and never advances the real deck. I can edit six pieces of text in place, choose the default box or card appearance, and manage questions on a note wall. Text edits save after a short pause or on leaving the field. Individual questions stay covered until I choose to view them; viewing is separate from editing, and each entry retains its original added time.

### Keeping Devices on the Same Question

In cloud mode, Supabase stores the questions, presentation settings, remaining question indices, current question, reveal state, and revision number. Database RPCs lock the deck row and check the revision before changing it. If two devices act on the same old state, the stale action receives the current deck instead of drawing another question or overwriting newer progress.

Realtime broadcasts carry a revision hint. Clients then read authoritative state through RPC rather than trusting question content in the broadcast. Visible pages also check every five seconds to recover missed notifications. Devices already watching can animate the new state in their own box or card style; a late arrival restores the latest state without replaying an old animation. Network latency means the animations are not frame-synchronized.

Dashboard saves read the latest deck and can merge edits to different questions or settings, with up to three attempts. A conflicting edit to the same field keeps my unsaved input and requires an explicit retry. Changing the question list starts a new round; changing presentation settings preserves progress. A failed shared operation does not silently fall back to a separate local deck or automatically retry a draw that may already have succeeded.

### Storage and Access Boundaries

Without an \`id\`, the widget uses \`localStorage\` and does not synchronize between devices. Notion embeds and ordinary browser tabs may have separate storage. With an ID, the full deck link grants both viewing and editing access: there is no account login or read-only sharing role. The eye buttons hide spoilers, not data from someone who holds that link.

The supplied schema enables RLS and revokes direct table access from browser roles. Limited RPCs check that the requested random deck ID matches the request header before accessing a deck. This keeps table enumeration out of the browser API while retaining the deliberate shared-link access model. Existing installations need the presentation migration for shared text and default appearance; it preserves their questions and progress.

## Technical Shape and Verification

All three widgets use plain **HTML, CSS, and JavaScript**. Static hosting serves their interfaces; Open-Meteo supplies weather, while Supabase supplies gallery storage and shared question state. The question widget uses native fetch for RPCs and the official Supabase JavaScript client from a CDN for Realtime. Periodic reads still work if that client cannot load.

The source documents frontend regression coverage for question selection, refresh recovery, cross-device updates, revision conflicts, failed connections, and preview isolation, together with rollback-based SQL checks on synthetic decks. Gallery tests simulate WebP/PNG encoding and HEIC failures; they do not establish iPhone compatibility. These are source-documented checks, not database or device tests performed for this article update.

What I like about this project is its small scope. Each widget solves one visible problem, remains understandable without a large toolchain, and can keep evolving independently as I notice small interaction details while using it in Notion.
`,oi=`---
title: Personal Website and Reading Archive
date: 2024-02-08
tags: [react, vite, firebase, recharts, markdown]
description: A personal digital garden that combines a reading library, time visualizations, project essays, small demos, and a shared bookshelf layer.
---

This website is my long-running corner of the internet. It began as a personal homepage, then gradually became part reading archive, part project notebook, and part playground for the small tools and experiments I wanted to keep in one place.

I do not treat it as a finished portfolio. The structure changes as my interests change, and that is part of the project: the site has to remain useful for recording real activity rather than only presenting a polished snapshot of me.

## Links

- **Live site:** [www.ducenhan.com](https://www.ducenhan.com/)
- **Source code:** [GitHub repository](https://github.com/handeesome/handeesome.github.io)

## The Reading Library

The Library is the part I use most. It records books I have finished, books I am currently reading, and books I want to read next, together with dates, ratings, tags, notes, quotes, and cover images.

A reading timeline groups finished books by month, which makes the archive feel more like a history than a database. I also import Toggl reading sessions and visualize how reading time was distributed across a day. Books in the time tracker connect back to their underlying sessions, so the chart is not just decorative: it remains a route into the source data.

The main shelf reflects my own reading. A small Firebase-backed layer also lets a few other users maintain public or private shelves without turning the site into a general social platform.

## Projects as Markdown

Project essays live as Markdown files with front matter. Vite discovers them automatically, the Projects page builds its index from their metadata, and each slug is rendered as an article route. This keeps a project update close to its source material: adding an article does not require editing a hard-coded list or creating a new React page.

Some projects also include static interactive demos under \`public/demos\`. Those demos stay independent from the main React application, but the surrounding article gives them context, explains the original problem, and links back to the source repository.

The Projects section now has a dedicated presentation: selected projects introduce the collection, followed by a chronological list. Detail pages put the summary and source or demo links first, reuse the article's first image as a wide preview, and keep the main text at a narrower reading width. A desktop table of contents becomes collapsible on small screens, and images open in a keyboard-accessible dialog. Illustrations are labeled separately from screenshots.

I kept the shared navigation and theme palette while giving only Projects a compact header. The Library, games, and homepage retain their own layouts. A shared \`projectData.js\` loader supplies front matter, links, preview images, and presentation categories to both the list and article pages, keeping those views consistent.

## Keeping Project Essays Current

The repository includes a reusable article-maintenance workflow and source registry. \`npm run projects:audit\` compares mapped local repositories, selected documentation hashes, article hashes, and Git state with the last reviewed snapshots. It makes no network requests and does not rewrite articles.

The rest of the workflow is an evidence review: read current source documentation, check upstream revisions, compare meaningful behavior and implementation changes, then update the public article. Only completed comparisons establish review baselines. Remote-only or inaccessible sources stay explicitly unverified until checked, and article-maintenance changes are distinguished from changes to this website's product behavior.

## Technical Shape

The site is built with **React**, **Vite**, and **React Router**. Firebase provides the shared bookshelf layer, Bootstrap handles much of the responsive layout, Recharts powers reading visualizations, and Markdown keeps long-form project content maintainable.

Routes and heavier pages are loaded lazily so the library does not force every visitor to download every part of the site. Light and dark themes apply across the reading pages and project articles. Outside Projects, the full page header includes a randomly selected quote from public bookshelves; Projects uses the compact navigation to give the collection and article more room.

## Why I Keep Building It

Most software projects have a clear point when they are done. This one is different. Its purpose is to make room for things that accumulate: books, small ideas, useful experiments, project histories, and evidence of how my interests move over time.

The value is not that every part follows one perfect taxonomy. It is that the site gives those parts a durable home, and that I can improve the structure whenever the collection outgrows it.
`,si=`---
title: PNYL Fellowship Interactive Pages
date: 2026-01-21
tags: [javascript, cloudflare-workers, d1, netlify]
description: A collection of lightweight web tools for fellowship discussions, group activities, anonymous participation, and live facilitation.
---

PNYL Fellowship Interactive Pages is a collection of small web tools I built for real group activities. Instead of asking a facilitator to manage paper notes, spreadsheets, random grouping, scores, QR codes, and projected results separately, each page turns one activity into a focused browser-based flow.

The tools are intentionally lightweight. Most can run as static pages, while the activities that need live multi-device participation use a small Cloudflare Worker and D1 database. This keeps the setup understandable and makes it possible to preserve a read-only demo after a one-time event has ended.

## Links

- **Source code:** [GitHub repository](https://github.com/handeesome/pnyl)
- **Project home:** [pnyl.netlify.app](https://pnyl.netlify.app/)
- **Between Two Sides:** [debate.ducenhan.com](https://debate.ducenhan.com/)
- **Love Languages quiz:** [Open the quiz](https://pnyl.netlify.app/5lovelanguages/)
- **Fellowship Monopoly:** [Open the game](https://pnyl.netlify.app/monopoly/)
- **Fellowship Jeopardy:** [Open the activity](https://pnyl.netlify.app/jeopardy/)
- **Church Untold demo:** [Open the archived host view](https://pnyl.netlify.app/church-untold/public/host/)

## Five Small Tools

The **Love Languages quiz** turns a familiar questionnaire into a self-contained browser experience with a result chart. Its assets and dependencies are stored locally, so the activity does not depend on another quiz platform.

**Fellowship Monopoly** combines player registration, host controls, participant submissions, prompts, and event cards. The public version stores progress in \`localStorage\`; temporary groups can opt into their own LeanCloud configuration when multi-device synchronization is needed.

**Fellowship Jeopardy** is an icebreaker built around M&M questions, random seating, team assignment, a revealable question board, scoring, and a timer. Content, styling, and application logic are separated so a facilitator can replace the questions without rebuilding the interface.

**Church Untold** was made for an anonymous discussion night. Participants submitted five answers on their phones while a projected host screen showed response counts and revealed the results one question at a time. The live version used Cloudflare Workers, D1, scheduled deletion, input limits, and a host passcode. After the event, I retired the service and kept a read-only demo with sample responses instead of leaving a broken form online.

**Between Two Sides** supports a more structured debate night. Participants first vote anonymously on possible topics, then choose a side only after the topic is selected. The host can run timed response rounds and reveal private tasks at the right moment, while the projected view shows only the information the room needs. Room data expires automatically after six hours.

## Designing for a Room, Not Just a Screen

These pages are used while people are talking, moving, looking at a projector, and switching between phones and a shared screen. That changes the design priorities. A host needs clear progress and control, participants need short flows that work without explanation, and the projected page needs to remain readable from across the room.

The project also treats privacy as part of the interaction design. Anonymous tools avoid collecting identity fields, short-lived event data is deleted automatically, secrets stay in deployment configuration, and inactive services are turned into explicit demos rather than quietly failing.

## Keeping the Debate's Stages Separate

Between Two Sides separates anonymous topic interest from later participation. The first stage accepts no nickname and stores votes separately from named side selections, without a link between the two tables. After the host chooses a topic, participants enter a nickname and choose a side once. Only after the host distributes tasks does each phone receive its private task, hidden until tapped; the host API does not return those tasks.

The host and phone pages poll the Worker every 2.2 seconds for stage changes. D1 holds durable room state, while each browser keeps its own room credential in \`localStorage\`. Rooms expire after six hours and an hourly cleanup removes expired data. Host recovery invalidates the previous host credential. Starting another round clears the votes, participants, sides, and tasks while keeping the same room code and QR code.

This structure supports a particular kind of discussion. Private tasks invite people to acknowledge their own side's weaknesses, ask sincere questions, summarize the other side, or encourage a teammate. A browser-only demo supplies fictional votes and participants without writing them to D1, so the facilitator can rehearse the stages before involving the room.

The debate subproject includes topic, QR-code, and validation tests. Those checks support the application logic; projection readability and a real phone's connection still need checking in the activity's environment. Other tools retain their own storage choices: a local Monopoly session is not automatically shared across participants, and the archived Church Untold demo accepts no new answers.

## Why I Built It

I built these tools because many good group activities have awkward operational edges. The idea itself may be simple, but the person leading it still has to collect answers, keep time, split teams, protect anonymity, and keep the room focused. Small purpose-built pages remove those distractions and let the technology stay in the background of the conversation.
`,li=`---
title: 谱间 · Pujian
date: 2026-10-29
tags: [react, typescript, python, fastapi, ffmpeg, audio]
description: A local Windows app for marking lyrics on sheet music, syncing them with audio, and exporting karaoke videos with the original soundtrack.
---

Pujian (谱间) is a desktop tool I built for turning PDF or image sheet music into a video that follows the singing. It keeps the original score on screen, highlights the lyrics as the audio plays, and scrolls to the current phrase. The interface is in Chinese, with large text and controls for the work of marking and checking each line.

The workflow is straightforward: import a score and a recording, mark the lyric regions, arrange them in singing order, tap along to set their timing, then preview and export a video.

- **Source code:** [View the GitHub repository](https://github.com/handeesome/score-karaoke-studio)
- **Windows app:** [Download from GitHub Releases](https://github.com/handeesome/score-karaoke-studio/releases)

![Pujian editor with an original sample score and synthesized audio, showing lyric regions and the phrase timeline](/images/projects/score-karaoke-studio/pujian-editor-sample.png)

## From Sheet Music to Timed Lyrics

The app accepts a PDF or a set of score images, together with an audio file. I can draw boxes around the lyrics or divide the page with horizontal and vertical lines, then number the regions in the order they are sung. Repeated phrases can reuse the same region without drawing another box. For scores with several verses, automatic numbering offers a verse-by-verse order to review before applying it.

In v0.1.12, the top score picker starts a new project from one PDF or image, then asks for audio. Dropping score files also starts a new project, but carries over the current audio unless a new recording is dropped with them. Only “更多歌谱” appends pages while preserving the existing recording, regions, and timing. Multi-page scores expose previous/next controls and a confirmed, undoable page deletion that removes the affected annotations while retaining other pages and the audio.

While the recording plays, clicking the timing button or pressing Enter marks the first phrase, each following phrase, and the final ending. A zoomable timeline shows a locally separated vocal waveform as a reference. Phrase bars and their edges can be dragged to adjust the timing after the initial pass.

Automatic region detection and alignment can suggest boxes and times using OCR, audio transcription, and waveform information. These are starting points to check: scan quality, repeated lyrics, and accompaniment can all affect the result.

## Preview and Export

There are two highlight modes: a sweep from left to right, or a whole region that stays highlighted until the next phrase begins. The highlight color is configurable, and black-and-white inversion helps prepare scores with a dark background. The same settings carry through to the video preview and export.

The app exports H.264 MP4 video in landscape, portrait, square, or custom dimensions. It copies the original audio track directly; the separated vocals are only a timing aid. If the audio codec cannot be placed in an MP4 container, the app reports that limitation so the user can prepare a compatible file.

## Technical Architecture

I split the application into an interactive editor, a local processing service, and a desktop shell:

- **React and TypeScript:** score regions, page partitions, singing order, waveform navigation, timing edits, undo/redo, and export controls.
- **Python and FastAPI:** file import, project persistence, OCR, audio analysis, preview frames, and video rendering.
- **pywebview and PyInstaller:** a Windows desktop window and packaged runtime, so the finished app does not require a separate Python or Node.js installation.

The desktop entry point starts the service on the loopback interface and loads the built frontend. Media processing stays on the computer. Project records, imported files, and analysis caches live in the app's data directory, while the user chooses where to save exported videos.

### Keeping Score Regions and Timing Consistent

The editor's typed project model records page dimensions, region coordinates, ordered segments, timing assignments, highlight settings, and export settings. A region's place on the page is distinct from its timing assignment: removing a phrase from the timeline can keep its score box available for another pass.

The two highlight modes need different editing rules. Whole-region mode connects adjacent phrases through shared boundaries, so moving one boundary updates both phrases. Sweep mode allows independent intervals, including gaps or overlaps. Timing edits enforce a minimum phrase length of 0.1 seconds and stay within the audio duration.

Merging regions also needs care. I preserve the existing time slots, rebind them in singing order, and retain surplus slots for later assignment. This avoids throwing away the timing work when the score layout changes. The partition and timing logic is covered by focused frontend tests.

The v0.1.12 import flow treats replacement as a project transition. It imports and validates the new score and saves the previous project before activating a fresh project model. A canceled selection, failed import, or failed save leaves the current editor content in place. Page deletion filters page-linked regions, partitions, and timing flags, then reconnects timing according to the highlight mode. This keeps page editing within the same project model and undo history instead of changing only the visible page list.

### Local Recognition and Audio Analysis

PDF pages are rasterized with **PyMuPDF at 240 DPI**. Automatic alignment combines **Tesseract** OCR with **faster-whisper** transcription and vocal waveform information to propose phrase times. Suggestions remain reviewable instead of replacing existing manual timing.

For vocal analysis, the app can use a fast **Spleeter ONNX model through ONNX Runtime**, with **Demucs** used when the fast model is unavailable. Since v0.1.11, the fast result also provides an early usable waveform while **HTDemucs** processes the same recording in a separate background queue. On success, the app replaces the waveform and updates its cache; on failure, the fast result remains usable without interrupting editing.

The background worker runs at lower priority on Windows and defaults to two CPU compute threads. Cached fast waveforms can still be refined, while completed HTDemucs results are reused. The frontend keeps polling while refinement is active and stops accepting results after the audio changes, so one song's result cannot replace another song's waveform. This gives an initial timing reference sooner while leaving the original soundtrack untouched.

Progress reflects processing stages and completed audio segments, so a long-running analysis does not show a percentage based only on elapsed time. Progress and retry controls remain in the timeline's visible area when it is zoomed or scrolled horizontally.

### Rendering and Audio Preservation

The Python renderer produces RGB frames from the project at each output timestamp and streams them into **FFmpeg** through a pipe. FFmpeg encodes H.264 video with \`libx264\`, while \`-c:a copy\` preserves the original audio stream. The separated vocal track never replaces the original recording.

This makes audio compatibility an explicit export constraint: an unsupported MP4 audio codec stops the export rather than silently triggering lossy conversion. Backend tests cover audio passthrough, timeline validation, scrolling, export destinations, model handling, and desktop updates.

## Packaging and Current Scope

The app works on one song at a time and saves the session so it can be continued after reopening. An offline package includes models and OCR tools; the standard package needs those prepared before the related features can be used. Windows packages need WebView2 Runtime and .NET Framework 4.8.

Cumulative updates reuse the existing runtime and model caches. Keeping installed program files separate from user data allows upgrades without replacing the imported scores, recordings, or saved timing work.

The desktop app checks GitHub Releases at startup and every six hours, and also has a persistent manual check. Each check or retry creates a fresh network opener so a proxy enabled after startup can take effect. Installation checks local task readiness, verifies the package's SHA256 and compatibility, and blocks background editor actions while downloading and installing. A versioned frontend URL and cache revalidation prevent the updated executable from reopening an old cached interface while preserving the same origin for saved preferences.

The article was checked against the v0.1.12 source and published GitHub Release. The repository includes tests for waveform refinement, stale-result isolation, import behavior, project actions, update networking, and frontend cache handling. Those tests were inspected as evidence; source application tests and media processing were not rerun for this article update.

The useful part for me is keeping the score, singing order, and timing together. I can work directly with an existing score, correct individual phrases while listening, and check the synchronized result before exporting it.
`,ci=`---
title: Obsidian Second Brain
date: 2026-06-02
tags: [obsidian, markdown, python, ai, personal-knowledge-management]
description: A local-first Markdown vault where Codex maintains reading conversations, evidence links, and evolving thought without turning AI inference into personal memory.
---

Obsidian Second Brain is a local-first knowledge system I am building around reading, conversations, and learning. I want to recover what I read, understand why something caught my attention, and compare how I understood a question at different times.

**Obsidian Markdown is the durable source of truth; Codex is the current conversation and maintenance interface.** Books, highlights, source conversations, topics, formal stances, and system rules remain human-readable files. The interface can change without making the notes dependent on a particular AI product.

The source repository is private. This article describes its system design rather than publishing personal notes or conversations.

## From Conversation to Connected Notes

The project has two parallel uses: deepening selected books I have already read, and discussing topics or learning something new. Book work gets more attention at present, but it is not a prerequisite for a useful discussion.

A book session starts from existing notes, highlights, prior conversations, and a confidently matched ebook's structure or short context. The ebook library stays outside the vault and serves as auxiliary source material. Highlights are memory cues; questions follow the book's arguments, scenes, and tensions rather than requiring a response to every highlighted sentence.

Each completed reading unit is saved incrementally as a source conversation. At a natural session boundary, Codex integrates relevant book and topic notes, source links, stance signals, and necessary profile changes. Ordinary note maintenance does not need a separate approval for every file. Topic and learning conversations are captured when they contain durable thought or understanding; routine tool questions and maintenance chatter are excluded.

## Evidence Boundaries

Automatic maintenance makes attribution more important. The system distinguishes source text (\`原文\`), highlights (\`我的高亮\`), original user wording (\`用户原话\`), explicit expressions in context (\`用户明确表达\`), faithful AI organization (\`AI整理\`), uncertain inference (\`AI推测\`), external material (\`外部资料\`), and a revisable current synthesis (\`当前综合\`).

These are evidence categories, not an approval ladder. There is no routine waiting queue for me to clear. Uncertain interpretations remain AI inference. A highlight does not establish agreement, a past view does not automatically describe my current view, and one emotional or exploratory statement cannot become a stable profile fact.

Topic notes connect sources and unresolved questions over time. Formal stances are reserved for views that are important, repeated, and stable enough to benefit from independent retrieval. Stance signals are an AI-owned observation layer, not automatically accepted beliefs. New understanding preserves earlier evidence and its date instead of rewriting the past into apparent consistency.

## Example Interaction

This illustrative exchange shows the intended attribution and saving behavior; it is not an excerpt from the private vault.

\`\`\`chat
Me:
I keep thinking about Fromm's idea that love is a practice.
I do not know whether I agree yet.

AI:
Let's keep that distinction: the idea belongs to the book,
and your response is an open question. What would treating
love as a practice explain, and what might it leave out?

Me:
It explains why attention matters. But I do not want to
reduce love to discipline.

AI:
I saved this unit as a source conversation and connected it
to the topic note on love. Your question and wording remain
separate from my synthesis. Any possible connection to other
themes stays labeled AI推测, without becoming a formal stance.

Me:
Let's continue with that tension next time.
\`\`\`

## Technical Architecture

Global instructions route work to task-specific workflows for book deepening, conversation capture, topic/stance/profile maintenance, intake, and imports. Templates and deterministic scripts support those workflows. Ordinary discussion can update Markdown directly; repeated imports, migrations, and validation use scripts.

The Python standard-library helper \`vault_recall.py\` builds a lightweight recall index and dashboards. It excludes raw exports, logs, backups, raw chat and Notion imports, attachments, and the separate ebook library from routine retrieval. The index provides an evidence map; the source note supplies the wording and context needed to attribute a claim.

Personal recall starts with vault evidence. Learning and open discussion can also draw on external sources, with their contribution kept separate from my own expressions. This prevents outside research from silently becoming autobiographical memory.

## Validation, Recovery, and Privacy

Validation follows the scale of the change. Incremental conversation saves do not trigger a full scan. Natural session checkpoints use changed-file validation when links or front matter changed; book completion, bulk imports, system changes, and moves call for broader checks. Indexes and dashboards refresh when their underlying decision data is materially stale.

Git tracks core Markdown, rules, scripts, and lightweight indexes. Raw exports, attachments, ebooks, local backups, application state, and reports need their own backup strategy because Git excludes them. Credentials and third-party secrets do not belong in the vault.

Local-first describes where the durable files live. Codex may read selected material while assisting, and external research introduces additional sources; this is not a promise of fully offline AI processing. The system's evidence rules guide that assistance, but they still require careful source handling. Its most useful property is that I can inspect and correct the memory in ordinary Markdown.
`,di=`---
title: TCG Card Manager
date: 2026-06-20
tags: [python, dashboard, data-collection, tcg]
description: A local TCG portfolio dashboard with three-source price evidence, grade-aware sale targets, daily refreshes, and recoverable edits.
---

TCG Card Manager is a local-first dashboard I built for managing trading card holdings, starting with **Pokémon** cards. A card collection is not just a list of names and prices: every card has a language, set, number, grade, purchase cost, market context, and a price that can vary widely between Chinese, Japanese, and US trading channels.

The goal of this project is to keep that messy information in one place. It lets me record what I own, what I paid, how each card is graded, which price sources were checked, and whether a card is currently above or below cost. The app runs locally, so private portfolio data, API tokens, market-check notes, and collector outputs can stay off GitHub.

Source code: [github.com/handeesome/tcg-card-manager](https://github.com/handeesome/tcg-card-manager)

[Try the frontend-only demo](/demos/tcg-card-manager/index.html). It is a static sample; saving changes and collecting new prices require the local Python service.

## What It Does

The main dashboard reads a local \`portfolio.json\` file and turns it into a portfolio view. At the top, it summarizes total current value, total buy cost, unrealized profit or loss, and the latest update time. Below that, the card grid can be filtered by game, language, grading company, holding status, and whether the card still needs a usable price.

Each card keeps the practical information I need while deciding what to hold or sell: Chinese, English, and Japanese names, set name, card number, rarity, image, grading label, buy date, buy price, current estimate, and market notes. Clicking a card opens a detail view with source-level price rows, confidence labels, recent sale information, trend points, and manual verification links.

One small but useful part is local editing. The dashboard can update purchase information through a tiny local Python server, which writes back to \`data/portfolio.json\`. That keeps the workflow simple: open the page, correct a buy price or date, save it locally, and immediately see the portfolio totals update.

## Price Collection Workflow

The current collection workflow is organized around three sources: **JiHuanShe (集换社), BiaoKa (镖卡), and eBay**. Each produces normalized source rows under \`current_prices.collector_sources\`, retaining the observed price, currency, grade, timestamp, identity evidence, and status. Ambiguous matches and permission failures stay visible instead of becoming a fabricated estimate.

The practical JiHuanShe route reads the Android app through ADB and UI XML. It opens a result only when the name, number, game, and language identify a unique card, then captures the visible price, grading label, sampled listings, and optional trend points. Uncertain matches stop at the search stage. The capture script does not change the portfolio; a separate normalization step imports reviewed runs, backs up the destination, and checks that card identity, transactions, and purchase information remain unchanged.

BiaoKa uses an authorized account token for search, details, trends, and grade-specific sales. eBay uses SerpAPI sold-result searches and keeps the original USD observations and matching context. Missing credentials return an explicit source status. An unsuccessful refresh must preserve the previous usable value with its original timestamp and a stale label.

Direct JiHuanShe API work remains a separate research track. The local research document reports a functioning public-ranking client, while arbitrary card search and price queries are not yet working end to end. A successful HTTP response is not sufficient when the response contains a business permission error, and ranking heat or percentage change is not a card price.

## Targets and Daily Refreshes

Each holding can have a sale target in CNY. The alert evaluator accepts only a usable current observation fetched within 36 hours and compatible with the holding's grade. Reference values, proxy grades, stale observations, and mismatched grades do not trigger a reached-target alert. The dashboard highlights reached cards and offers a target-first sort. A partial run reevaluates only the selected cards, preserving the check times of untouched holdings.

While \`server.py\` is running, a local scheduler attempts a daily refresh at 09:00, or catches up when started later that day. It makes one automatic attempt per day; the page provides manual retry. Completion is checked using a run-specific commit receipt and fresh-price coverage, so a subprocess exiting successfully cannot by itself make a partially refreshed portfolio appear fully current.

Editing and deletion use validated, backed-up, atomic writes and recompute the portfolio totals. Deleting a holding removes its main record while retaining historical collection records and backups. The separate watchlist is read-only and cannot be edited, deleted, or assigned sale targets.

## Technical Shape

The app is intentionally small. The main pieces are:

- \`server.py\`, a local Python HTTP server for the dashboard, card edits, targets, deletion, and scheduled or manual refreshes.
- \`web/index.html\`, a single-page dashboard with the portfolio grid, filters, detail modal, source table, inline editing, and theme support.
- \`scripts/collect_card_prices.py\`, the unified collector that updates current prices, run logs, price history, and backups.
- The ADB capture and source-normalization scripts, which separate observed app data from reviewed portfolio updates.
- \`scripts/price_alerts.py\`, which selects fresh, grade-compatible prices and evaluates targets.
- \`data/portfolio.example.json\`, a public sample portfolio used as the fallback when no private portfolio exists.

Collector runs generate a few different files: updated portfolio data, daily price history snapshots, detailed run records, and pre-run backups. Secrets are loaded from environment variables or \`data/api_tokens.json\`, both of which are kept out of source control.

## Public Samples and Verification Scope

A clean checkout can use the sample portfolio and a published 22-card watchlist snapshot. The watchlist is dated demonstration data, not live pricing. Its exporter rejects credentials, private holding IDs, transactions, and local machine paths before producing public fixtures.

The local research notes document tests for ranking-response parsing, distinguishing percentages from prices, rejecting malformed results, and detecting expired-login errors inside HTTP 200 responses. Those checks do not establish that core JiHuanShe price queries work. The workflow also depends on the Android app's current layout and authorized sessions. This article review inspected documentation and focused source code; it did not run live collectors or read private holdings or credentials.

## Why I Built It

I built this because card collecting becomes hard to reason about once the collection is spread across languages, grading companies, platforms, and currencies. A single "current price" is rarely enough. I wanted a tool that could keep the collection personal and local while still showing the evidence behind each estimate.

What I like most about this project is that it treats uncertain data honestly. Some cards have strong recent-sale prices, some only have reference links, and some sources are blocked by permissions or unresolved response formats. The dashboard keeps those differences visible, which makes it more useful for personal collection decisions than a clean-looking number with no context.
`;var _e={exports:{}},O={},ie={},X={},pn;function re(){if(pn)return X;pn=1;function d(c){return typeof c>"u"||c===null}function b(c){return typeof c=="object"&&c!==null}function I(c){return Array.isArray(c)?c:d(c)?[]:[c]}function C(c,p){var r,i,o,A;if(p)for(A=Object.keys(p),r=0,i=A.length;r<i;r+=1)o=A[r],c[o]=p[o];return c}function y(c,p){var r="",i;for(i=0;i<p;i+=1)r+=c;return r}function u(c){return c===0&&Number.NEGATIVE_INFINITY===1/c}return X.isNothing=d,X.isObject=b,X.toArray=I,X.repeat=y,X.isNegativeZero=u,X.extend=C,X}var De,fn;function ce(){if(fn)return De;fn=1;function d(b,I){Error.call(this),this.name="YAMLException",this.reason=b,this.mark=I,this.message=(this.reason||"(unknown reason)")+(this.mark?" "+this.mark.toString():""),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=new Error().stack||""}return d.prototype=Object.create(Error.prototype),d.prototype.constructor=d,d.prototype.toString=function(I){var C=this.name+": ";return C+=this.reason||"(unknown reason)",!I&&this.mark&&(C+=" "+this.mark.toString()),C},De=d,De}var Me,gn;function hi(){if(gn)return Me;gn=1;var d=re();function b(I,C,y,u,c){this.name=I,this.buffer=C,this.position=y,this.line=u,this.column=c}return b.prototype.getSnippet=function(C,y){var u,c,p,r,i;if(!this.buffer)return null;for(C=C||4,y=y||75,u="",c=this.position;c>0&&`\0\r
\u2028\u2029`.indexOf(this.buffer.charAt(c-1))===-1;)if(c-=1,this.position-c>y/2-1){u=" ... ",c+=5;break}for(p="",r=this.position;r<this.buffer.length&&`\0\r
\u2028\u2029`.indexOf(this.buffer.charAt(r))===-1;)if(r+=1,r-this.position>y/2-1){p=" ... ",r-=5;break}return i=this.buffer.slice(c,r),d.repeat(" ",C)+u+i+p+`
`+d.repeat(" ",C+this.position-c+u.length)+"^"},b.prototype.toString=function(C){var y,u="";return this.name&&(u+='in "'+this.name+'" '),u+="at line "+(this.line+1)+", column "+(this.column+1),C||(y=this.getSnippet(),y&&(u+=`:
`+y)),u},Me=b,Me}var Be,mn;function D(){if(mn)return Be;mn=1;var d=ce(),b=["kind","resolve","construct","instanceOf","predicate","represent","defaultStyle","styleAliases"],I=["scalar","sequence","mapping"];function C(u){var c={};return u!==null&&Object.keys(u).forEach(function(p){u[p].forEach(function(r){c[String(r)]=p})}),c}function y(u,c){if(c=c||{},Object.keys(c).forEach(function(p){if(b.indexOf(p)===-1)throw new d('Unknown option "'+p+'" is met in definition of "'+u+'" YAML type.')}),this.tag=u,this.kind=c.kind||null,this.resolve=c.resolve||function(){return!0},this.construct=c.construct||function(p){return p},this.instanceOf=c.instanceOf||null,this.predicate=c.predicate||null,this.represent=c.represent||null,this.defaultStyle=c.defaultStyle||null,this.styleAliases=C(c.styleAliases||null),I.indexOf(this.kind)===-1)throw new d('Unknown kind "'+this.kind+'" is specified for "'+u+'" YAML type.')}return Be=y,Be}var He,vn;function te(){if(vn)return He;vn=1;var d=re(),b=ce(),I=D();function C(c,p,r){var i=[];return c.include.forEach(function(o){r=C(o,p,r)}),c[p].forEach(function(o){r.forEach(function(A,T){A.tag===o.tag&&A.kind===o.kind&&i.push(T)}),r.push(o)}),r.filter(function(o,A){return i.indexOf(A)===-1})}function y(){var c={scalar:{},sequence:{},mapping:{},fallback:{}},p,r;function i(o){c[o.kind][o.tag]=c.fallback[o.tag]=o}for(p=0,r=arguments.length;p<r;p+=1)arguments[p].forEach(i);return c}function u(c){this.include=c.include||[],this.implicit=c.implicit||[],this.explicit=c.explicit||[],this.implicit.forEach(function(p){if(p.loadKind&&p.loadKind!=="scalar")throw new b("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.")}),this.compiledImplicit=C(this,"implicit",[]),this.compiledExplicit=C(this,"explicit",[]),this.compiledTypeMap=y(this.compiledImplicit,this.compiledExplicit)}return u.DEFAULT=null,u.create=function(){var p,r;switch(arguments.length){case 1:p=u.DEFAULT,r=arguments[0];break;case 2:p=arguments[0],r=arguments[1];break;default:throw new b("Wrong number of arguments for Schema.create function")}if(p=d.toArray(p),r=d.toArray(r),!p.every(function(i){return i instanceof u}))throw new b("Specified list of super schemas (or a single Schema object) contains a non-Schema object.");if(!r.every(function(i){return i instanceof I}))throw new b("Specified list of YAML types (or a single Type object) contains a non-Type object.");return new u({include:p,explicit:r})},He=u,He}var Ge,yn;function ui(){if(yn)return Ge;yn=1;var d=D();return Ge=new d("tag:yaml.org,2002:str",{kind:"scalar",construct:function(b){return b!==null?b:""}}),Ge}var We,wn;function pi(){if(wn)return We;wn=1;var d=D();return We=new d("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(b){return b!==null?b:[]}}),We}var Ue,bn;function fi(){if(bn)return Ue;bn=1;var d=D();return Ue=new d("tag:yaml.org,2002:map",{kind:"mapping",construct:function(b){return b!==null?b:{}}}),Ue}var Ye,xn;function hn(){if(xn)return Ye;xn=1;var d=te();return Ye=new d({explicit:[ui(),pi(),fi()]}),Ye}var ze,kn;function gi(){if(kn)return ze;kn=1;var d=D();function b(y){if(y===null)return!0;var u=y.length;return u===1&&y==="~"||u===4&&(y==="null"||y==="Null"||y==="NULL")}function I(){return null}function C(y){return y===null}return ze=new d("tag:yaml.org,2002:null",{kind:"scalar",resolve:b,construct:I,predicate:C,represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"}},defaultStyle:"lowercase"}),ze}var Ke,An;function mi(){if(An)return Ke;An=1;var d=D();function b(y){if(y===null)return!1;var u=y.length;return u===4&&(y==="true"||y==="True"||y==="TRUE")||u===5&&(y==="false"||y==="False"||y==="FALSE")}function I(y){return y==="true"||y==="True"||y==="TRUE"}function C(y){return Object.prototype.toString.call(y)==="[object Boolean]"}return Ke=new d("tag:yaml.org,2002:bool",{kind:"scalar",resolve:b,construct:I,predicate:C,represent:{lowercase:function(y){return y?"true":"false"},uppercase:function(y){return y?"TRUE":"FALSE"},camelcase:function(y){return y?"True":"False"}},defaultStyle:"lowercase"}),Ke}var Je,Tn;function vi(){if(Tn)return Je;Tn=1;var d=re(),b=D();function I(r){return 48<=r&&r<=57||65<=r&&r<=70||97<=r&&r<=102}function C(r){return 48<=r&&r<=55}function y(r){return 48<=r&&r<=57}function u(r){if(r===null)return!1;var i=r.length,o=0,A=!1,T;if(!i)return!1;if(T=r[o],(T==="-"||T==="+")&&(T=r[++o]),T==="0"){if(o+1===i)return!0;if(T=r[++o],T==="b"){for(o++;o<i;o++)if(T=r[o],T!=="_"){if(T!=="0"&&T!=="1")return!1;A=!0}return A&&T!=="_"}if(T==="x"){for(o++;o<i;o++)if(T=r[o],T!=="_"){if(!I(r.charCodeAt(o)))return!1;A=!0}return A&&T!=="_"}for(;o<i;o++)if(T=r[o],T!=="_"){if(!C(r.charCodeAt(o)))return!1;A=!0}return A&&T!=="_"}if(T==="_")return!1;for(;o<i;o++)if(T=r[o],T!=="_"){if(T===":")break;if(!y(r.charCodeAt(o)))return!1;A=!0}return!A||T==="_"?!1:T!==":"?!0:/^(:[0-5]?[0-9])+$/.test(r.slice(o))}function c(r){var i=r,o=1,A,T,R=[];return i.indexOf("_")!==-1&&(i=i.replace(/_/g,"")),A=i[0],(A==="-"||A==="+")&&(A==="-"&&(o=-1),i=i.slice(1),A=i[0]),i==="0"?0:A==="0"?i[1]==="b"?o*parseInt(i.slice(2),2):i[1]==="x"?o*parseInt(i,16):o*parseInt(i,8):i.indexOf(":")!==-1?(i.split(":").forEach(function(E){R.unshift(parseInt(E,10))}),i=0,T=1,R.forEach(function(E){i+=E*T,T*=60}),o*i):o*parseInt(i,10)}function p(r){return Object.prototype.toString.call(r)==="[object Number]"&&r%1===0&&!d.isNegativeZero(r)}return Je=new b("tag:yaml.org,2002:int",{kind:"scalar",resolve:u,construct:c,predicate:p,represent:{binary:function(r){return r>=0?"0b"+r.toString(2):"-0b"+r.toString(2).slice(1)},octal:function(r){return r>=0?"0"+r.toString(8):"-0"+r.toString(8).slice(1)},decimal:function(r){return r.toString(10)},hexadecimal:function(r){return r>=0?"0x"+r.toString(16).toUpperCase():"-0x"+r.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),Je}var Ve,Sn;function yi(){if(Sn)return Ve;Sn=1;var d=re(),b=D(),I=new RegExp("^(?:[-+]?(?:0|[1-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");function C(r){return!(r===null||!I.test(r)||r[r.length-1]==="_")}function y(r){var i,o,A,T;return i=r.replace(/_/g,"").toLowerCase(),o=i[0]==="-"?-1:1,T=[],"+-".indexOf(i[0])>=0&&(i=i.slice(1)),i===".inf"?o===1?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:i===".nan"?NaN:i.indexOf(":")>=0?(i.split(":").forEach(function(R){T.unshift(parseFloat(R,10))}),i=0,A=1,T.forEach(function(R){i+=R*A,A*=60}),o*i):o*parseFloat(i,10)}var u=/^[-+]?[0-9]+e/;function c(r,i){var o;if(isNaN(r))switch(i){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===r)switch(i){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===r)switch(i){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(d.isNegativeZero(r))return"-0.0";return o=r.toString(10),u.test(o)?o.replace("e",".e"):o}function p(r){return Object.prototype.toString.call(r)==="[object Number]"&&(r%1!==0||d.isNegativeZero(r))}return Ve=new b("tag:yaml.org,2002:float",{kind:"scalar",resolve:C,construct:y,predicate:p,represent:c,defaultStyle:"lowercase"}),Ve}var Qe,Cn;function Un(){if(Cn)return Qe;Cn=1;var d=te();return Qe=new d({include:[hn()],implicit:[gi(),mi(),vi(),yi()]}),Qe}var $e,In;function Yn(){if(In)return $e;In=1;var d=te();return $e=new d({include:[Un()]}),$e}var Xe,_n;function wi(){if(_n)return Xe;_n=1;var d=D(),b=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),I=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");function C(c){return c===null?!1:b.exec(c)!==null||I.exec(c)!==null}function y(c){var p,r,i,o,A,T,R,E=0,P=null,z,V,K;if(p=b.exec(c),p===null&&(p=I.exec(c)),p===null)throw new Error("Date resolve error");if(r=+p[1],i=+p[2]-1,o=+p[3],!p[4])return new Date(Date.UTC(r,i,o));if(A=+p[4],T=+p[5],R=+p[6],p[7]){for(E=p[7].slice(0,3);E.length<3;)E+="0";E=+E}return p[9]&&(z=+p[10],V=+(p[11]||0),P=(z*60+V)*6e4,p[9]==="-"&&(P=-P)),K=new Date(Date.UTC(r,i,o,A,T,R,E)),P&&K.setTime(K.getTime()-P),K}function u(c){return c.toISOString()}return Xe=new d("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:C,construct:y,instanceOf:Date,represent:u}),Xe}var Ze,Fn;function bi(){if(Fn)return Ze;Fn=1;var d=D();function b(I){return I==="<<"||I===null}return Ze=new d("tag:yaml.org,2002:merge",{kind:"scalar",resolve:b}),Ze}function zn(d){throw new Error('Could not dynamically require "'+d+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var en,En;function xi(){if(En)return en;En=1;var d;try{var b=zn;d=b("buffer").Buffer}catch{}var I=D(),C=`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;function y(r){if(r===null)return!1;var i,o,A=0,T=r.length,R=C;for(o=0;o<T;o++)if(i=R.indexOf(r.charAt(o)),!(i>64)){if(i<0)return!1;A+=6}return A%8===0}function u(r){var i,o,A=r.replace(/[\r\n=]/g,""),T=A.length,R=C,E=0,P=[];for(i=0;i<T;i++)i%4===0&&i&&(P.push(E>>16&255),P.push(E>>8&255),P.push(E&255)),E=E<<6|R.indexOf(A.charAt(i));return o=T%4*6,o===0?(P.push(E>>16&255),P.push(E>>8&255),P.push(E&255)):o===18?(P.push(E>>10&255),P.push(E>>2&255)):o===12&&P.push(E>>4&255),d?d.from?d.from(P):new d(P):P}function c(r){var i="",o=0,A,T,R=r.length,E=C;for(A=0;A<R;A++)A%3===0&&A&&(i+=E[o>>18&63],i+=E[o>>12&63],i+=E[o>>6&63],i+=E[o&63]),o=(o<<8)+r[A];return T=R%3,T===0?(i+=E[o>>18&63],i+=E[o>>12&63],i+=E[o>>6&63],i+=E[o&63]):T===2?(i+=E[o>>10&63],i+=E[o>>4&63],i+=E[o<<2&63],i+=E[64]):T===1&&(i+=E[o>>2&63],i+=E[o<<4&63],i+=E[64],i+=E[64]),i}function p(r){return d&&d.isBuffer(r)}return en=new I("tag:yaml.org,2002:binary",{kind:"scalar",resolve:y,construct:u,predicate:p,represent:c}),en}var nn,jn;function ki(){if(jn)return nn;jn=1;var d=D(),b=Object.prototype.hasOwnProperty,I=Object.prototype.toString;function C(u){if(u===null)return!0;var c=[],p,r,i,o,A,T=u;for(p=0,r=T.length;p<r;p+=1){if(i=T[p],A=!1,I.call(i)!=="[object Object]")return!1;for(o in i)if(b.call(i,o))if(!A)A=!0;else return!1;if(!A)return!1;if(c.indexOf(o)===-1)c.push(o);else return!1}return!0}function y(u){return u!==null?u:[]}return nn=new d("tag:yaml.org,2002:omap",{kind:"sequence",resolve:C,construct:y}),nn}var rn,Ln;function Ai(){if(Ln)return rn;Ln=1;var d=D(),b=Object.prototype.toString;function I(y){if(y===null)return!0;var u,c,p,r,i,o=y;for(i=new Array(o.length),u=0,c=o.length;u<c;u+=1){if(p=o[u],b.call(p)!=="[object Object]"||(r=Object.keys(p),r.length!==1))return!1;i[u]=[r[0],p[r[0]]]}return!0}function C(y){if(y===null)return[];var u,c,p,r,i,o=y;for(i=new Array(o.length),u=0,c=o.length;u<c;u+=1)p=o[u],r=Object.keys(p),i[u]=[r[0],p[r[0]]];return i}return rn=new d("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:I,construct:C}),rn}var tn,Rn;function Ti(){if(Rn)return tn;Rn=1;var d=D(),b=Object.prototype.hasOwnProperty;function I(y){if(y===null)return!0;var u,c=y;for(u in c)if(b.call(c,u)&&c[u]!==null)return!1;return!0}function C(y){return y!==null?y:{}}return tn=new d("tag:yaml.org,2002:set",{kind:"mapping",resolve:I,construct:C}),tn}var an,Pn;function le(){if(Pn)return an;Pn=1;var d=te();return an=new d({include:[Yn()],implicit:[wi(),bi()],explicit:[xi(),ki(),Ai(),Ti()]}),an}var on,Nn;function Si(){if(Nn)return on;Nn=1;var d=D();function b(){return!0}function I(){}function C(){return""}function y(u){return typeof u>"u"}return on=new d("tag:yaml.org,2002:js/undefined",{kind:"scalar",resolve:b,construct:I,predicate:y,represent:C}),on}var sn,On;function Ci(){if(On)return sn;On=1;var d=D();function b(u){if(u===null||u.length===0)return!1;var c=u,p=/\/([gim]*)$/.exec(u),r="";return!(c[0]==="/"&&(p&&(r=p[1]),r.length>3||c[c.length-r.length-1]!=="/"))}function I(u){var c=u,p=/\/([gim]*)$/.exec(u),r="";return c[0]==="/"&&(p&&(r=p[1]),c=c.slice(1,c.length-r.length-1)),new RegExp(c,r)}function C(u){var c="/"+u.source+"/";return u.global&&(c+="g"),u.multiline&&(c+="m"),u.ignoreCase&&(c+="i"),c}function y(u){return Object.prototype.toString.call(u)==="[object RegExp]"}return sn=new d("tag:yaml.org,2002:js/regexp",{kind:"scalar",resolve:b,construct:I,predicate:y,represent:C}),sn}var ln,qn;function Ii(){if(qn)return ln;qn=1;var d;try{var b=zn;d=b("esprima")}catch{typeof window<"u"&&(d=window.esprima)}var I=D();function C(p){if(p===null)return!1;try{var r="("+p+")",i=d.parse(r,{range:!0});return!(i.type!=="Program"||i.body.length!==1||i.body[0].type!=="ExpressionStatement"||i.body[0].expression.type!=="ArrowFunctionExpression"&&i.body[0].expression.type!=="FunctionExpression")}catch{return!1}}function y(p){var r="("+p+")",i=d.parse(r,{range:!0}),o=[],A;if(i.type!=="Program"||i.body.length!==1||i.body[0].type!=="ExpressionStatement"||i.body[0].expression.type!=="ArrowFunctionExpression"&&i.body[0].expression.type!=="FunctionExpression")throw new Error("Failed to resolve function");return i.body[0].expression.params.forEach(function(T){o.push(T.name)}),A=i.body[0].expression.body.range,i.body[0].expression.body.type==="BlockStatement"?new Function(o,r.slice(A[0]+1,A[1]-1)):new Function(o,"return "+r.slice(A[0],A[1]))}function u(p){return p.toString()}function c(p){return Object.prototype.toString.call(p)==="[object Function]"}return ln=new I("tag:yaml.org,2002:js/function",{kind:"scalar",resolve:C,construct:y,predicate:c,represent:u}),ln}var cn,Dn;function Ee(){if(Dn)return cn;Dn=1;var d=te();return cn=d.DEFAULT=new d({include:[le()],explicit:[Si(),Ci(),Ii()]}),cn}var Mn;function _i(){if(Mn)return ie;Mn=1;var d=re(),b=ce(),I=hi(),C=le(),y=Ee(),u=Object.prototype.hasOwnProperty,c=1,p=2,r=3,i=4,o=1,A=2,T=3,R=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,E=/[\x85\u2028\u2029]/,P=/[,\[\]\{\}]/,z=/^(?:!|!!|![a-z\-]+!)$/i,V=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function K(e){return Object.prototype.toString.call(e)}function H(e){return e===10||e===13}function J(e){return e===9||e===32}function M(e){return e===9||e===32||e===10||e===13}function Q(e){return e===44||e===91||e===93||e===123||e===125}function Le(e){var t;return 48<=e&&e<=57?e-48:(t=e|32,97<=t&&t<=102?t-97+10:-1)}function de(e){return e===120?2:e===117?4:e===85?8:0}function he(e){return 48<=e&&e<=57?e-48:-1}function ue(e){return e===48?"\0":e===97?"\x07":e===98?"\b":e===116||e===9?"	":e===110?`
`:e===118?"\v":e===102?"\f":e===114?"\r":e===101?"\x1B":e===32?" ":e===34?'"':e===47?"/":e===92?"\\":e===78?"":e===95?" ":e===76?"\u2028":e===80?"\u2029":""}function pe(e){return e<=65535?String.fromCharCode(e):String.fromCharCode((e-65536>>10)+55296,(e-65536&1023)+56320)}for(var fe=new Array(256),ae=new Array(256),N=0;N<256;N++)fe[N]=ue(N)?1:0,ae[N]=ue(N);function Re(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||y,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.documents=[]}function ge(e,t){return new b(t,new I(e.filename,e.input,e.position,e.line,e.position-e.lineStart))}function _(e,t){throw ge(e,t)}function ne(e,t){e.onWarning&&e.onWarning.call(null,ge(e,t))}var oe={YAML:function(t,h,x){var f,k,n;t.version!==null&&_(t,"duplication of %YAML directive"),x.length!==1&&_(t,"YAML directive accepts exactly one argument"),f=/^([0-9]+)\.([0-9]+)$/.exec(x[0]),f===null&&_(t,"ill-formed argument of the YAML directive"),k=parseInt(f[1],10),n=parseInt(f[2],10),k!==1&&_(t,"unacceptable YAML version of the document"),t.version=x[0],t.checkLineBreaks=n<2,n!==1&&n!==2&&ne(t,"unsupported YAML version of the document")},TAG:function(t,h,x){var f,k;x.length!==2&&_(t,"TAG directive accepts exactly two arguments"),f=x[0],k=x[1],z.test(f)||_(t,"ill-formed tag handle (first argument) of the TAG directive"),u.call(t.tagMap,f)&&_(t,'there is a previously declared suffix for "'+f+'" tag handle'),V.test(k)||_(t,"ill-formed tag prefix (second argument) of the TAG directive"),t.tagMap[f]=k}};function G(e,t,h,x){var f,k,n,a;if(t<h){if(a=e.input.slice(t,h),x)for(f=0,k=a.length;f<k;f+=1)n=a.charCodeAt(f),n===9||32<=n&&n<=1114111||_(e,"expected valid JSON character");else R.test(a)&&_(e,"the stream contains non-printable characters");e.result+=a}}function me(e,t,h,x){var f,k,n,a;for(d.isObject(h)||_(e,"cannot merge mappings; the provided source object is unacceptable"),f=Object.keys(h),n=0,a=f.length;n<a;n+=1)k=f[n],u.call(t,k)||(t[k]=h[k],x[k]=!0)}function W(e,t,h,x,f,k,n,a){var s,v;if(Array.isArray(f))for(f=Array.prototype.slice.call(f),s=0,v=f.length;s<v;s+=1)Array.isArray(f[s])&&_(e,"nested arrays are not supported inside keys"),typeof f=="object"&&K(f[s])==="[object Object]"&&(f[s]="[object Object]");if(typeof f=="object"&&K(f)==="[object Object]"&&(f="[object Object]"),f=String(f),t===null&&(t={}),x==="tag:yaml.org,2002:merge")if(Array.isArray(k))for(s=0,v=k.length;s<v;s+=1)me(e,t,k[s],h);else me(e,t,k,h);else!e.json&&!u.call(h,f)&&u.call(t,f)&&(e.line=n||e.line,e.position=a||e.position,_(e,"duplicated mapping key")),t[f]=k,delete h[f];return t}function U(e){var t;t=e.input.charCodeAt(e.position),t===10?e.position++:t===13?(e.position++,e.input.charCodeAt(e.position)===10&&e.position++):_(e,"a line break is expected"),e.line+=1,e.lineStart=e.position}function q(e,t,h){for(var x=0,f=e.input.charCodeAt(e.position);f!==0;){for(;J(f);)f=e.input.charCodeAt(++e.position);if(t&&f===35)do f=e.input.charCodeAt(++e.position);while(f!==10&&f!==13&&f!==0);if(H(f))for(U(e),f=e.input.charCodeAt(e.position),x++,e.lineIndent=0;f===32;)e.lineIndent++,f=e.input.charCodeAt(++e.position);else break}return h!==-1&&x!==0&&e.lineIndent<h&&ne(e,"deficient indentation"),x}function Z(e){var t=e.position,h;return h=e.input.charCodeAt(t),!!((h===45||h===46)&&h===e.input.charCodeAt(t+1)&&h===e.input.charCodeAt(t+2)&&(t+=3,h=e.input.charCodeAt(t),h===0||M(h)))}function se(e,t){t===1?e.result+=" ":t>1&&(e.result+=d.repeat(`
`,t-1))}function ve(e,t,h){var x,f,k,n,a,s,v,m,l=e.kind,w=e.result,g;if(g=e.input.charCodeAt(e.position),M(g)||Q(g)||g===35||g===38||g===42||g===33||g===124||g===62||g===39||g===34||g===37||g===64||g===96||(g===63||g===45)&&(f=e.input.charCodeAt(e.position+1),M(f)||h&&Q(f)))return!1;for(e.kind="scalar",e.result="",k=n=e.position,a=!1;g!==0;){if(g===58){if(f=e.input.charCodeAt(e.position+1),M(f)||h&&Q(f))break}else if(g===35){if(x=e.input.charCodeAt(e.position-1),M(x))break}else{if(e.position===e.lineStart&&Z(e)||h&&Q(g))break;if(H(g))if(s=e.line,v=e.lineStart,m=e.lineIndent,q(e,!1,-1),e.lineIndent>=t){a=!0,g=e.input.charCodeAt(e.position);continue}else{e.position=n,e.line=s,e.lineStart=v,e.lineIndent=m;break}}a&&(G(e,k,n,!1),se(e,e.line-s),k=n=e.position,a=!1),J(g)||(n=e.position+1),g=e.input.charCodeAt(++e.position)}return G(e,k,n,!1),e.result?!0:(e.kind=l,e.result=w,!1)}function ye(e,t){var h,x,f;if(h=e.input.charCodeAt(e.position),h!==39)return!1;for(e.kind="scalar",e.result="",e.position++,x=f=e.position;(h=e.input.charCodeAt(e.position))!==0;)if(h===39)if(G(e,x,e.position,!0),h=e.input.charCodeAt(++e.position),h===39)x=e.position,e.position++,f=e.position;else return!0;else H(h)?(G(e,x,f,!0),se(e,q(e,!1,t)),x=f=e.position):e.position===e.lineStart&&Z(e)?_(e,"unexpected end of the document within a single quoted scalar"):(e.position++,f=e.position);_(e,"unexpected end of the stream within a single quoted scalar")}function we(e,t){var h,x,f,k,n,a;if(a=e.input.charCodeAt(e.position),a!==34)return!1;for(e.kind="scalar",e.result="",e.position++,h=x=e.position;(a=e.input.charCodeAt(e.position))!==0;){if(a===34)return G(e,h,e.position,!0),e.position++,!0;if(a===92){if(G(e,h,e.position,!0),a=e.input.charCodeAt(++e.position),H(a))q(e,!1,t);else if(a<256&&fe[a])e.result+=ae[a],e.position++;else if((n=de(a))>0){for(f=n,k=0;f>0;f--)a=e.input.charCodeAt(++e.position),(n=Le(a))>=0?k=(k<<4)+n:_(e,"expected hexadecimal character");e.result+=pe(k),e.position++}else _(e,"unknown escape sequence");h=x=e.position}else H(a)?(G(e,h,x,!0),se(e,q(e,!1,t)),h=x=e.position):e.position===e.lineStart&&Z(e)?_(e,"unexpected end of the document within a double quoted scalar"):(e.position++,x=e.position)}_(e,"unexpected end of the stream within a double quoted scalar")}function be(e,t){var h=!0,x,f=e.tag,k,n=e.anchor,a,s,v,m,l,w={},g,S,j,F;if(F=e.input.charCodeAt(e.position),F===91)s=93,l=!1,k=[];else if(F===123)s=125,l=!0,k={};else return!1;for(e.anchor!==null&&(e.anchorMap[e.anchor]=k),F=e.input.charCodeAt(++e.position);F!==0;){if(q(e,!0,t),F=e.input.charCodeAt(e.position),F===s)return e.position++,e.tag=f,e.anchor=n,e.kind=l?"mapping":"sequence",e.result=k,!0;h||_(e,"missed comma between flow collection entries"),S=g=j=null,v=m=!1,F===63&&(a=e.input.charCodeAt(e.position+1),M(a)&&(v=m=!0,e.position++,q(e,!0,t))),x=e.line,$(e,t,c,!1,!0),S=e.tag,g=e.result,q(e,!0,t),F=e.input.charCodeAt(e.position),(m||e.line===x)&&F===58&&(v=!0,F=e.input.charCodeAt(++e.position),q(e,!0,t),$(e,t,c,!1,!0),j=e.result),l?W(e,k,w,S,g,j):v?k.push(W(e,null,w,S,g,j)):k.push(g),q(e,!0,t),F=e.input.charCodeAt(e.position),F===44?(h=!0,F=e.input.charCodeAt(++e.position)):h=!1}_(e,"unexpected end of the stream within a flow collection")}function xe(e,t){var h,x,f=o,k=!1,n=!1,a=t,s=0,v=!1,m,l;if(l=e.input.charCodeAt(e.position),l===124)x=!1;else if(l===62)x=!0;else return!1;for(e.kind="scalar",e.result="";l!==0;)if(l=e.input.charCodeAt(++e.position),l===43||l===45)o===f?f=l===43?T:A:_(e,"repeat of a chomping mode identifier");else if((m=he(l))>=0)m===0?_(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):n?_(e,"repeat of an indentation width identifier"):(a=t+m-1,n=!0);else break;if(J(l)){do l=e.input.charCodeAt(++e.position);while(J(l));if(l===35)do l=e.input.charCodeAt(++e.position);while(!H(l)&&l!==0)}for(;l!==0;){for(U(e),e.lineIndent=0,l=e.input.charCodeAt(e.position);(!n||e.lineIndent<a)&&l===32;)e.lineIndent++,l=e.input.charCodeAt(++e.position);if(!n&&e.lineIndent>a&&(a=e.lineIndent),H(l)){s++;continue}if(e.lineIndent<a){f===T?e.result+=d.repeat(`
`,k?1+s:s):f===o&&k&&(e.result+=`
`);break}for(x?J(l)?(v=!0,e.result+=d.repeat(`
`,k?1+s:s)):v?(v=!1,e.result+=d.repeat(`
`,s+1)):s===0?k&&(e.result+=" "):e.result+=d.repeat(`
`,s):e.result+=d.repeat(`
`,k?1+s:s),k=!0,n=!0,s=0,h=e.position;!H(l)&&l!==0;)l=e.input.charCodeAt(++e.position);G(e,h,e.position,!1)}return!0}function ee(e,t){var h,x=e.tag,f=e.anchor,k=[],n,a=!1,s;for(e.anchor!==null&&(e.anchorMap[e.anchor]=k),s=e.input.charCodeAt(e.position);s!==0&&!(s!==45||(n=e.input.charCodeAt(e.position+1),!M(n)));){if(a=!0,e.position++,q(e,!0,-1)&&e.lineIndent<=t){k.push(null),s=e.input.charCodeAt(e.position);continue}if(h=e.line,$(e,t,r,!1,!0),k.push(e.result),q(e,!0,-1),s=e.input.charCodeAt(e.position),(e.line===h||e.lineIndent>t)&&s!==0)_(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break}return a?(e.tag=x,e.anchor=f,e.kind="sequence",e.result=k,!0):!1}function Pe(e,t,h){var x,f,k,n,a=e.tag,s=e.anchor,v={},m={},l=null,w=null,g=null,S=!1,j=!1,F;for(e.anchor!==null&&(e.anchorMap[e.anchor]=v),F=e.input.charCodeAt(e.position);F!==0;){if(x=e.input.charCodeAt(e.position+1),k=e.line,n=e.position,(F===63||F===58)&&M(x))F===63?(S&&(W(e,v,m,l,w,null),l=w=g=null),j=!0,S=!0,f=!0):S?(S=!1,f=!0):_(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,F=x;else if($(e,h,p,!1,!0))if(e.line===k){for(F=e.input.charCodeAt(e.position);J(F);)F=e.input.charCodeAt(++e.position);if(F===58)F=e.input.charCodeAt(++e.position),M(F)||_(e,"a whitespace character is expected after the key-value separator within a block mapping"),S&&(W(e,v,m,l,w,null),l=w=g=null),j=!0,S=!1,f=!1,l=e.tag,w=e.result;else if(j)_(e,"can not read an implicit mapping pair; a colon is missed");else return e.tag=a,e.anchor=s,!0}else if(j)_(e,"can not read a block mapping entry; a multiline key may not be an implicit key");else return e.tag=a,e.anchor=s,!0;else break;if((e.line===k||e.lineIndent>t)&&($(e,t,i,!0,f)&&(S?w=e.result:g=e.result),S||(W(e,v,m,l,w,g,k,n),l=w=g=null),q(e,!0,-1),F=e.input.charCodeAt(e.position)),e.lineIndent>t&&F!==0)_(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return S&&W(e,v,m,l,w,null),j&&(e.tag=a,e.anchor=s,e.kind="mapping",e.result=v),j}function Ne(e){var t,h=!1,x=!1,f,k,n;if(n=e.input.charCodeAt(e.position),n!==33)return!1;if(e.tag!==null&&_(e,"duplication of a tag property"),n=e.input.charCodeAt(++e.position),n===60?(h=!0,n=e.input.charCodeAt(++e.position)):n===33?(x=!0,f="!!",n=e.input.charCodeAt(++e.position)):f="!",t=e.position,h){do n=e.input.charCodeAt(++e.position);while(n!==0&&n!==62);e.position<e.length?(k=e.input.slice(t,e.position),n=e.input.charCodeAt(++e.position)):_(e,"unexpected end of the stream within a verbatim tag")}else{for(;n!==0&&!M(n);)n===33&&(x?_(e,"tag suffix cannot contain exclamation marks"):(f=e.input.slice(t-1,e.position+1),z.test(f)||_(e,"named tag handle cannot contain such characters"),x=!0,t=e.position+1)),n=e.input.charCodeAt(++e.position);k=e.input.slice(t,e.position),P.test(k)&&_(e,"tag suffix cannot contain flow indicator characters")}return k&&!V.test(k)&&_(e,"tag name cannot contain such characters: "+k),h?e.tag=k:u.call(e.tagMap,f)?e.tag=e.tagMap[f]+k:f==="!"?e.tag="!"+k:f==="!!"?e.tag="tag:yaml.org,2002:"+k:_(e,'undeclared tag handle "'+f+'"'),!0}function ke(e){var t,h;if(h=e.input.charCodeAt(e.position),h!==38)return!1;for(e.anchor!==null&&_(e,"duplication of an anchor property"),h=e.input.charCodeAt(++e.position),t=e.position;h!==0&&!M(h)&&!Q(h);)h=e.input.charCodeAt(++e.position);return e.position===t&&_(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function Ae(e){var t,h,x;if(x=e.input.charCodeAt(e.position),x!==42)return!1;for(x=e.input.charCodeAt(++e.position),t=e.position;x!==0&&!M(x)&&!Q(x);)x=e.input.charCodeAt(++e.position);return e.position===t&&_(e,"name of an alias node must contain at least one character"),h=e.input.slice(t,e.position),u.call(e.anchorMap,h)||_(e,'unidentified alias "'+h+'"'),e.result=e.anchorMap[h],q(e,!0,-1),!0}function $(e,t,h,x,f){var k,n,a,s=1,v=!1,m=!1,l,w,g,S,j;if(e.listener!==null&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,k=n=a=i===h||r===h,x&&q(e,!0,-1)&&(v=!0,e.lineIndent>t?s=1:e.lineIndent===t?s=0:e.lineIndent<t&&(s=-1)),s===1)for(;Ne(e)||ke(e);)q(e,!0,-1)?(v=!0,a=k,e.lineIndent>t?s=1:e.lineIndent===t?s=0:e.lineIndent<t&&(s=-1)):a=!1;if(a&&(a=v||f),(s===1||i===h)&&(c===h||p===h?S=t:S=t+1,j=e.position-e.lineStart,s===1?a&&(ee(e,j)||Pe(e,j,S))||be(e,S)?m=!0:(n&&xe(e,S)||ye(e,S)||we(e,S)?m=!0:Ae(e)?(m=!0,(e.tag!==null||e.anchor!==null)&&_(e,"alias node should not have any properties")):ve(e,S,c===h)&&(m=!0,e.tag===null&&(e.tag="?")),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):s===0&&(m=a&&ee(e,j))),e.tag!==null&&e.tag!=="!")if(e.tag==="?"){for(e.result!==null&&e.kind!=="scalar"&&_(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),l=0,w=e.implicitTypes.length;l<w;l+=1)if(g=e.implicitTypes[l],g.resolve(e.result)){e.result=g.construct(e.result),e.tag=g.tag,e.anchor!==null&&(e.anchorMap[e.anchor]=e.result);break}}else u.call(e.typeMap[e.kind||"fallback"],e.tag)?(g=e.typeMap[e.kind||"fallback"][e.tag],e.result!==null&&g.kind!==e.kind&&_(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+g.kind+'", not "'+e.kind+'"'),g.resolve(e.result)?(e.result=g.construct(e.result),e.anchor!==null&&(e.anchorMap[e.anchor]=e.result)):_(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")):_(e,"unknown tag !<"+e.tag+">");return e.listener!==null&&e.listener("close",e),e.tag!==null||e.anchor!==null||m}function Te(e){var t=e.position,h,x,f,k=!1,n;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap={},e.anchorMap={};(n=e.input.charCodeAt(e.position))!==0&&(q(e,!0,-1),n=e.input.charCodeAt(e.position),!(e.lineIndent>0||n!==37));){for(k=!0,n=e.input.charCodeAt(++e.position),h=e.position;n!==0&&!M(n);)n=e.input.charCodeAt(++e.position);for(x=e.input.slice(h,e.position),f=[],x.length<1&&_(e,"directive name must not be less than one character in length");n!==0;){for(;J(n);)n=e.input.charCodeAt(++e.position);if(n===35){do n=e.input.charCodeAt(++e.position);while(n!==0&&!H(n));break}if(H(n))break;for(h=e.position;n!==0&&!M(n);)n=e.input.charCodeAt(++e.position);f.push(e.input.slice(h,e.position))}n!==0&&U(e),u.call(oe,x)?oe[x](e,x,f):ne(e,'unknown document directive "'+x+'"')}if(q(e,!0,-1),e.lineIndent===0&&e.input.charCodeAt(e.position)===45&&e.input.charCodeAt(e.position+1)===45&&e.input.charCodeAt(e.position+2)===45?(e.position+=3,q(e,!0,-1)):k&&_(e,"directives end mark is expected"),$(e,e.lineIndent-1,i,!1,!0),q(e,!0,-1),e.checkLineBreaks&&E.test(e.input.slice(t,e.position))&&ne(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&Z(e)){e.input.charCodeAt(e.position)===46&&(e.position+=3,q(e,!0,-1));return}if(e.position<e.length-1)_(e,"end of the stream or a document separator is expected");else return}function Se(e,t){e=String(e),t=t||{},e.length!==0&&(e.charCodeAt(e.length-1)!==10&&e.charCodeAt(e.length-1)!==13&&(e+=`
`),e.charCodeAt(0)===65279&&(e=e.slice(1)));var h=new Re(e,t),x=e.indexOf("\0");for(x!==-1&&(h.position=x,_(h,"null byte is not allowed in input")),h.input+="\0";h.input.charCodeAt(h.position)===32;)h.lineIndent+=1,h.position+=1;for(;h.position<h.length-1;)Te(h);return h.documents}function Ce(e,t,h){t!==null&&typeof t=="object"&&typeof h>"u"&&(h=t,t=null);var x=Se(e,h);if(typeof t!="function")return x;for(var f=0,k=x.length;f<k;f+=1)t(x[f])}function Ie(e,t){var h=Se(e,t);if(h.length!==0){if(h.length===1)return h[0];throw new b("expected a single document in the stream, but found more")}}function Oe(e,t,h){return typeof t=="object"&&t!==null&&typeof h>"u"&&(h=t,t=null),Ce(e,t,d.extend({schema:C},h))}function qe(e,t){return Ie(e,d.extend({schema:C},t))}return ie.loadAll=Ce,ie.load=Ie,ie.safeLoadAll=Oe,ie.safeLoad=qe,ie}var Fe={},Bn;function Fi(){if(Bn)return Fe;Bn=1;var d=re(),b=ce(),I=Ee(),C=le(),y=Object.prototype.toString,u=Object.prototype.hasOwnProperty,c=9,p=10,r=13,i=32,o=33,A=34,T=35,R=37,E=38,P=39,z=42,V=44,K=45,H=58,J=61,M=62,Q=63,Le=64,de=91,he=93,ue=96,pe=123,fe=124,ae=125,N={};N[0]="\\0",N[7]="\\a",N[8]="\\b",N[9]="\\t",N[10]="\\n",N[11]="\\v",N[12]="\\f",N[13]="\\r",N[27]="\\e",N[34]='\\"',N[92]="\\\\",N[133]="\\N",N[160]="\\_",N[8232]="\\L",N[8233]="\\P";var Re=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"];function ge(n,a){var s,v,m,l,w,g,S;if(a===null)return{};for(s={},v=Object.keys(a),m=0,l=v.length;m<l;m+=1)w=v[m],g=String(a[w]),w.slice(0,2)==="!!"&&(w="tag:yaml.org,2002:"+w.slice(2)),S=n.compiledTypeMap.fallback[w],S&&u.call(S.styleAliases,g)&&(g=S.styleAliases[g]),s[w]=g;return s}function _(n){var a,s,v;if(a=n.toString(16).toUpperCase(),n<=255)s="x",v=2;else if(n<=65535)s="u",v=4;else if(n<=4294967295)s="U",v=8;else throw new b("code point within a string may not be greater than 0xFFFFFFFF");return"\\"+s+d.repeat("0",v-a.length)+a}function ne(n){this.schema=n.schema||I,this.indent=Math.max(1,n.indent||2),this.noArrayIndent=n.noArrayIndent||!1,this.skipInvalid=n.skipInvalid||!1,this.flowLevel=d.isNothing(n.flowLevel)?-1:n.flowLevel,this.styleMap=ge(this.schema,n.styles||null),this.sortKeys=n.sortKeys||!1,this.lineWidth=n.lineWidth||80,this.noRefs=n.noRefs||!1,this.noCompatMode=n.noCompatMode||!1,this.condenseFlow=n.condenseFlow||!1,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function oe(n,a){for(var s=d.repeat(" ",a),v=0,m=-1,l="",w,g=n.length;v<g;)m=n.indexOf(`
`,v),m===-1?(w=n.slice(v),v=g):(w=n.slice(v,m+1),v=m+1),w.length&&w!==`
`&&(l+=s),l+=w;return l}function G(n,a){return`
`+d.repeat(" ",n.indent*a)}function me(n,a){var s,v,m;for(s=0,v=n.implicitTypes.length;s<v;s+=1)if(m=n.implicitTypes[s],m.resolve(a))return!0;return!1}function W(n){return n===i||n===c}function U(n){return 32<=n&&n<=126||161<=n&&n<=55295&&n!==8232&&n!==8233||57344<=n&&n<=65533&&n!==65279||65536<=n&&n<=1114111}function q(n){return U(n)&&!W(n)&&n!==65279&&n!==r&&n!==p}function Z(n,a){return U(n)&&n!==65279&&n!==V&&n!==de&&n!==he&&n!==pe&&n!==ae&&n!==H&&(n!==T||a&&q(a))}function se(n){return U(n)&&n!==65279&&!W(n)&&n!==K&&n!==Q&&n!==H&&n!==V&&n!==de&&n!==he&&n!==pe&&n!==ae&&n!==T&&n!==E&&n!==z&&n!==o&&n!==fe&&n!==J&&n!==M&&n!==P&&n!==A&&n!==R&&n!==Le&&n!==ue}function ve(n){var a=/^\n* /;return a.test(n)}var ye=1,we=2,be=3,xe=4,ee=5;function Pe(n,a,s,v,m){var l,w,g,S=!1,j=!1,F=v!==-1,Y=-1,B=se(n.charCodeAt(0))&&!W(n.charCodeAt(n.length-1));if(a)for(l=0;l<n.length;l++){if(w=n.charCodeAt(l),!U(w))return ee;g=l>0?n.charCodeAt(l-1):null,B=B&&Z(w,g)}else{for(l=0;l<n.length;l++){if(w=n.charCodeAt(l),w===p)S=!0,F&&(j=j||l-Y-1>v&&n[Y+1]!==" ",Y=l);else if(!U(w))return ee;g=l>0?n.charCodeAt(l-1):null,B=B&&Z(w,g)}j=j||F&&l-Y-1>v&&n[Y+1]!==" "}return!S&&!j?B&&!m(n)?ye:we:s>9&&ve(n)?ee:j?xe:be}function Ne(n,a,s,v){n.dump=(function(){if(a.length===0)return"''";if(!n.noCompatMode&&Re.indexOf(a)!==-1)return"'"+a+"'";var m=n.indent*Math.max(1,s),l=n.lineWidth===-1?-1:Math.max(Math.min(n.lineWidth,40),n.lineWidth-m),w=v||n.flowLevel>-1&&s>=n.flowLevel;function g(S){return me(n,S)}switch(Pe(a,w,n.indent,l,g)){case ye:return a;case we:return"'"+a.replace(/'/g,"''")+"'";case be:return"|"+ke(a,n.indent)+Ae(oe(a,m));case xe:return">"+ke(a,n.indent)+Ae(oe($(a,l),m));case ee:return'"'+Se(a)+'"';default:throw new b("impossible error: invalid scalar style")}})()}function ke(n,a){var s=ve(n)?String(a):"",v=n[n.length-1]===`
`,m=v&&(n[n.length-2]===`
`||n===`
`),l=m?"+":v?"":"-";return s+l+`
`}function Ae(n){return n[n.length-1]===`
`?n.slice(0,-1):n}function $(n,a){for(var s=/(\n+)([^\n]*)/g,v=(function(){var j=n.indexOf(`
`);return j=j!==-1?j:n.length,s.lastIndex=j,Te(n.slice(0,j),a)})(),m=n[0]===`
`||n[0]===" ",l,w;w=s.exec(n);){var g=w[1],S=w[2];l=S[0]===" ",v+=g+(!m&&!l&&S!==""?`
`:"")+Te(S,a),m=l}return v}function Te(n,a){if(n===""||n[0]===" ")return n;for(var s=/ [^ ]/g,v,m=0,l,w=0,g=0,S="";v=s.exec(n);)g=v.index,g-m>a&&(l=w>m?w:g,S+=`
`+n.slice(m,l),m=l+1),w=g;return S+=`
`,n.length-m>a&&w>m?S+=n.slice(m,w)+`
`+n.slice(w+1):S+=n.slice(m),S.slice(1)}function Se(n){for(var a="",s,v,m,l=0;l<n.length;l++){if(s=n.charCodeAt(l),s>=55296&&s<=56319&&(v=n.charCodeAt(l+1),v>=56320&&v<=57343)){a+=_((s-55296)*1024+v-56320+65536),l++;continue}m=N[s],a+=!m&&U(s)?n[l]:m||_(s)}return a}function Ce(n,a,s){var v="",m=n.tag,l,w;for(l=0,w=s.length;l<w;l+=1)t(n,a,s[l],!1,!1)&&(l!==0&&(v+=","+(n.condenseFlow?"":" ")),v+=n.dump);n.tag=m,n.dump="["+v+"]"}function Ie(n,a,s,v){var m="",l=n.tag,w,g;for(w=0,g=s.length;w<g;w+=1)t(n,a+1,s[w],!0,!0)&&((!v||w!==0)&&(m+=G(n,a)),n.dump&&p===n.dump.charCodeAt(0)?m+="-":m+="- ",m+=n.dump);n.tag=l,n.dump=m||"[]"}function Oe(n,a,s){var v="",m=n.tag,l=Object.keys(s),w,g,S,j,F;for(w=0,g=l.length;w<g;w+=1)F="",w!==0&&(F+=", "),n.condenseFlow&&(F+='"'),S=l[w],j=s[S],t(n,a,S,!1,!1)&&(n.dump.length>1024&&(F+="? "),F+=n.dump+(n.condenseFlow?'"':"")+":"+(n.condenseFlow?"":" "),t(n,a,j,!1,!1)&&(F+=n.dump,v+=F));n.tag=m,n.dump="{"+v+"}"}function qe(n,a,s,v){var m="",l=n.tag,w=Object.keys(s),g,S,j,F,Y,B;if(n.sortKeys===!0)w.sort();else if(typeof n.sortKeys=="function")w.sort(n.sortKeys);else if(n.sortKeys)throw new b("sortKeys must be a boolean or a function");for(g=0,S=w.length;g<S;g+=1)B="",(!v||g!==0)&&(B+=G(n,a)),j=w[g],F=s[j],t(n,a+1,j,!0,!0,!0)&&(Y=n.tag!==null&&n.tag!=="?"||n.dump&&n.dump.length>1024,Y&&(n.dump&&p===n.dump.charCodeAt(0)?B+="?":B+="? "),B+=n.dump,Y&&(B+=G(n,a)),t(n,a+1,F,!0,Y)&&(n.dump&&p===n.dump.charCodeAt(0)?B+=":":B+=": ",B+=n.dump,m+=B));n.tag=l,n.dump=m||"{}"}function e(n,a,s){var v,m,l,w,g,S;for(m=s?n.explicitTypes:n.implicitTypes,l=0,w=m.length;l<w;l+=1)if(g=m[l],(g.instanceOf||g.predicate)&&(!g.instanceOf||typeof a=="object"&&a instanceof g.instanceOf)&&(!g.predicate||g.predicate(a))){if(n.tag=s?g.tag:"?",g.represent){if(S=n.styleMap[g.tag]||g.defaultStyle,y.call(g.represent)==="[object Function]")v=g.represent(a,S);else if(u.call(g.represent,S))v=g.represent[S](a,S);else throw new b("!<"+g.tag+'> tag resolver accepts not "'+S+'" style');n.dump=v}return!0}return!1}function t(n,a,s,v,m,l){n.tag=null,n.dump=s,e(n,s,!1)||e(n,s,!0);var w=y.call(n.dump);v&&(v=n.flowLevel<0||n.flowLevel>a);var g=w==="[object Object]"||w==="[object Array]",S,j;if(g&&(S=n.duplicates.indexOf(s),j=S!==-1),(n.tag!==null&&n.tag!=="?"||j||n.indent!==2&&a>0)&&(m=!1),j&&n.usedDuplicates[S])n.dump="*ref_"+S;else{if(g&&j&&!n.usedDuplicates[S]&&(n.usedDuplicates[S]=!0),w==="[object Object]")v&&Object.keys(n.dump).length!==0?(qe(n,a,n.dump,m),j&&(n.dump="&ref_"+S+n.dump)):(Oe(n,a,n.dump),j&&(n.dump="&ref_"+S+" "+n.dump));else if(w==="[object Array]"){var F=n.noArrayIndent&&a>0?a-1:a;v&&n.dump.length!==0?(Ie(n,F,n.dump,m),j&&(n.dump="&ref_"+S+n.dump)):(Ce(n,F,n.dump),j&&(n.dump="&ref_"+S+" "+n.dump))}else if(w==="[object String]")n.tag!=="?"&&Ne(n,n.dump,a,l);else{if(n.skipInvalid)return!1;throw new b("unacceptable kind of an object to dump "+w)}n.tag!==null&&n.tag!=="?"&&(n.dump="!<"+n.tag+"> "+n.dump)}return!0}function h(n,a){var s=[],v=[],m,l;for(x(n,s,v),m=0,l=v.length;m<l;m+=1)a.duplicates.push(s[v[m]]);a.usedDuplicates=new Array(l)}function x(n,a,s){var v,m,l;if(n!==null&&typeof n=="object")if(m=a.indexOf(n),m!==-1)s.indexOf(m)===-1&&s.push(m);else if(a.push(n),Array.isArray(n))for(m=0,l=n.length;m<l;m+=1)x(n[m],a,s);else for(v=Object.keys(n),m=0,l=v.length;m<l;m+=1)x(n[v[m]],a,s)}function f(n,a){a=a||{};var s=new ne(a);return s.noRefs||h(n,s),t(s,0,n,!0,!0)?s.dump+`
`:""}function k(n,a){return f(n,d.extend({schema:C},a))}return Fe.dump=f,Fe.safeDump=k,Fe}var Hn;function Ei(){if(Hn)return O;Hn=1;var d=_i(),b=Fi();function I(C){return function(){throw new Error("Function "+C+" is deprecated and cannot be used.")}}return O.Type=D(),O.Schema=te(),O.FAILSAFE_SCHEMA=hn(),O.JSON_SCHEMA=Un(),O.CORE_SCHEMA=Yn(),O.DEFAULT_SAFE_SCHEMA=le(),O.DEFAULT_FULL_SCHEMA=Ee(),O.load=d.load,O.loadAll=d.loadAll,O.safeLoad=d.safeLoad,O.safeLoadAll=d.safeLoadAll,O.dump=b.dump,O.safeDump=b.safeDump,O.YAMLException=ce(),O.MINIMAL_SCHEMA=hn(),O.SAFE_SCHEMA=le(),O.DEFAULT_SCHEMA=Ee(),O.scan=I("scan"),O.parse=I("parse"),O.compose=I("compose"),O.addConstructor=I("addConstructor"),O}var dn,Gn;function ji(){if(Gn)return dn;Gn=1;var d=Ei();return dn=d,dn}var Wn;function Li(){if(Wn)return _e.exports;Wn=1;var d=ji(),b="\\ufeff?",I=typeof process<"u"?process.platform:"",C="^("+b+"(= yaml =|---)$([\\s\\S]*?)^(?:\\2|\\.\\.\\.)\\s*$"+(I==="win32"?"\\r?":"")+"(?:\\n)?)",y=new RegExp(C,"m");_e.exports=u,_e.exports.test=r;function u(i,o){i=i||"";var A={allowUnsafe:!1};o=o instanceof Object?{...A,...o}:A,o.allowUnsafe=!!o.allowUnsafe;var T=i.split(/(\r?\n)/);return T[0]&&/= yaml =|---/.test(T[0])?p(i,o.allowUnsafe):{attributes:{},body:i,bodyBegin:1}}function c(i,o){for(var A=1,T=o.indexOf(`
`),R=i.index+i[0].length;T!==-1;){if(T>=R)return A;A++,T=o.indexOf(`
`,T+1)}return A}function p(i,o){var A=y.exec(i);if(!A)return{attributes:{},body:i,bodyBegin:1};var T=o?d.load:d.safeLoad,R=A[A.length-1].replace(/^\s+|\s+$/g,""),E=T(R)||{},P=i.replace(A[0],""),z=c(A,i);return{attributes:E,body:P,bodyBegin:z,frontmatter:R}}function r(i){return i=i||"",y.test(i)}return _e.exports}var Ri=Li();const Pi=Kn(Ri),Ni={"score-karaoke-studio":{category:"Windows app",featured:1},"learning-guide-live":{category:"Real-time collaboration",featured:2,displayTitle:"Learning Guide Live & 见面"},"notion-widgets":{category:"Web widgets",featured:3},"tcg-card-manager":{category:"Collection tools"},"second-brain":{category:"Knowledge & reading"},"google-scholar":{category:"Browser extension"},pnyl:{category:"Games & activities"},"hugo-book":{category:"Reading & listening"},"personal-website":{category:"Personal website"},"auto-pptx":{category:"Workflow tools"}},Oi=Object.assign({"../../content/projects/auto-pptx.md":ni,"../../content/projects/google-scholar.md":ii,"../../content/projects/hugo-book.md":ri,"../../content/projects/learning-guide-live.md":ti,"../../content/projects/notion-widgets.md":ai,"../../content/projects/personal-website.md":oi,"../../content/projects/pnyl.md":si,"../../content/projects/score-karaoke-studio.md":li,"../../content/projects/second-brain.md":ci,"../../content/projects/tcg-card-manager.md":di}),Hi=Object.entries(Oi).map(([d,b])=>{const{attributes:I,body:C}=Pi(b),y=d.split("/").pop().replace(/\.md$/,""),u=C.match(/!\[([^\]]*)\]\(([^\s)]+)\)/),c=I.date?new Date(I.date):null,p=c&&Number.isFinite(c.getTime())?c:null,r=Ni[y]||{category:"Personal project"},i=C.match(/\[[^\]]*\]\((https:\/\/github\.com\/handeesome\/[^\s)]+)\)/)?.[1],o=C.match(/\[[^\]]*\]\((\/demos\/[^\s)]+)\)/)?.[1],A=C.match(/\*\*Live site:\*\*\s*\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/)?.[1],T=C.match(/\[[^\]]*\]\((https:\/\/github\.com\/handeesome\/score-karaoke-studio\/releases)\)/)?.[1];return{...r,slug:y,title:I.title||y,displayTitle:r.displayTitle||I.title||y,description:I.description||"",tags:I.tags||[],dateTime:p?.getTime()||0,isoDate:p?.toISOString().slice(0,10),date:p?.toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"})||"",year:p?.getFullYear(),body:C,image:u?{src:u[2],alt:u[1],markdown:u[0]}:null,links:[o&&{label:"Try the demo",href:o},A&&{label:"Visit the site",href:A},T&&{label:"Download for Windows",href:T},i&&{label:"View source",href:i}].filter(Boolean)}}).sort((d,b)=>b.dateTime-d.dateTime);function Gi(d){let b=null;return d.split(/\r?\n/).flatMap((I,C)=>{const y=I.match(/^\s*(`{3,}|~{3,})/);if(y)return b?y[1][0]===b[0]&&y[1].length>=b.length&&(b=null):b=y[1],[];const u=!b&&I.match(/^##\s+(.+?)\s*#*$/);return u?[{id:`section-${C+1}`,text:u[1].replace(/\[([^\]]+)\]\([^)]+\)/g,"$1").replace(/[*_`]/g,"")}]:[]})}function qi(){return L.jsxs("div",{className:"project-score-illustration",role:"img","aria-label":"Workflow illustration: mark lyric regions on a score, align phrases with audio, and export a video.",children:[L.jsxs("div",{className:"project-score-toolbar",children:[L.jsxs("span",{children:[L.jsx(ei,{size:16,"aria-hidden":"true"})," 谱间 · Pujian"]}),L.jsx("span",{children:"Score → video"})]}),L.jsxs("div",{className:"project-score-paper","aria-hidden":"true",children:[L.jsxs("div",{className:"project-score-staff",children:[L.jsx("span",{children:"♪"}),L.jsx("span",{children:"♩"}),L.jsx("span",{children:"♫"}),L.jsx("span",{children:"♩"}),L.jsx("span",{children:"♪"})]}),L.jsxs("div",{className:"project-score-regions",children:[L.jsxs("span",{children:[L.jsx("small",{children:"1"}),"Mark the lyrics"]}),L.jsxs("span",{children:[L.jsx("small",{children:"2"}),"Follow the song"]})]})]}),L.jsxs("div",{className:"project-score-audio","aria-hidden":"true",children:[L.jsx(Xn,{size:22}),L.jsx("div",{className:"project-score-wave",children:[20,36,24,46,30,56,38,20,48,32,60,42,24,36,52,28,44,22,38,56,32,48,24,40,18,32,54,28].map((d,b)=>L.jsx("i",{style:{height:`${d}%`}},b))})]}),L.jsxs("div",{className:"project-score-steps","aria-hidden":"true",children:[L.jsxs("span",{children:[L.jsx(Jn,{size:13})," Mark"]}),L.jsx(un,{size:12}),L.jsx("span",{children:"Sync"}),L.jsx(un,{size:12}),L.jsx("span",{children:"Export"})]}),L.jsx("span",{className:"project-preview-note",children:"Workflow illustration"})]})}function Wi({project:d}){return d.illustration==="score"?L.jsx(qi,{}):d.image?L.jsx("div",{className:`project-preview-image project-preview-image--${d.slug}`,children:L.jsx("img",{src:d.image.src,alt:d.image.alt,loading:"lazy"})}):null}export{Bi as A,Wi as P,qi as S,un as a,Gi as g,Hi as p};
