---
title: Notion Widgets
date: 2026-09-03
tags: [javascript, notion, supabase, open-meteo]
description: Self-hosted Notion widgets for a cloud gallery, two-city weather, and a shared question box with synchronized progress.
---

Notion Widgets is a collection of small web components that I can host myself and embed into Notion with `/embed`. I started it because I wanted widgets that felt visually quiet, stayed under my control, and did not add someone else's branding or tracking to the page.

The repository currently contains three widgets: a configurable image gallery, a weather card for Xiamen and Ningbo, and a question box called 留一个问题. Each widget is a standalone static page, so it can be previewed locally, deployed independently, and embedded without a framework or build step.

## Links

- **Source code:** [GitHub repository](https://github.com/handeesome/notion-widgets)
- **Gallery configuration:** [Open the configuration page](https://handeesome.github.io/notion-widgets/gallery/configure.html) and add your private gallery ID as the `?id=` URL parameter
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

Without an `id`, the widget uses `localStorage` and does not synchronize between devices. Notion embeds and ordinary browser tabs may have separate storage. With an ID, the full deck link grants both viewing and editing access: there is no account login or read-only sharing role. The eye buttons hide spoilers, not data from someone who holds that link.

The supplied schema enables RLS and revokes direct table access from browser roles. Limited RPCs check that the requested random deck ID matches the request header before accessing a deck. This keeps table enumeration out of the browser API while retaining the deliberate shared-link access model. Existing installations need the presentation migration for shared text and default appearance; it preserves their questions and progress.

## Technical Shape and Verification

All three widgets use plain **HTML, CSS, and JavaScript**. Static hosting serves their interfaces; Open-Meteo supplies weather, while Supabase supplies gallery storage and shared question state. The question widget uses native fetch for RPCs and the official Supabase JavaScript client from a CDN for Realtime. Periodic reads still work if that client cannot load.

The source documents frontend regression coverage for question selection, refresh recovery, cross-device updates, revision conflicts, failed connections, and preview isolation, together with rollback-based SQL checks on synthetic decks. Gallery tests simulate WebP/PNG encoding and HEIC failures; they do not establish iPhone compatibility. These are source-documented checks, not database or device tests performed for this article update.

What I like about this project is its small scope. Each widget solves one visible problem, remains understandable without a large toolchain, and can keep evolving independently as I notice small interaction details while using it in Notion.
