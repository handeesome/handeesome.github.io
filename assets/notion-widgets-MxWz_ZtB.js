const e=`---
title: Notion Widgets
date: 2026-09-03
tags: [javascript, notion, supabase, open-meteo]
description: A small collection of self-hosted Notion widgets, including a configurable cloud gallery and a live two-city weather card.
---

Notion Widgets is a collection of small web components that I can host myself and embed into Notion with \`/embed\`. I started it because I wanted widgets that felt visually quiet, stayed under my control, and did not add someone else's branding or tracking to the page.

The repository currently contains two widgets: a configurable image gallery and a weather card for Xiamen and Ningbo. Each widget is a standalone static page, so it can be previewed locally, deployed independently, and embedded without a framework or build step.

## Links

- **Source code:** [GitHub repository](https://github.com/handeesome/notion-widgets)
- **Weather widget:** [Open the live widget](https://handeesome.github.io/notion-widgets/weather/)

## Gallery Widget

The gallery stores its images and settings in **Supabase**. A private random gallery ID connects the public display page to its configuration page, where images can be uploaded, replaced, deleted, and reordered. The same page controls layout, image sizing, autoplay speed, transitions, colors, card radius, arrows, dots, and counters.

![Gallery Widget showing the visual board layout](/images/projects/notion-widgets/gallery-widget.png)

I wanted the gallery to feel good inside a narrow Notion embed rather than behave like a full website. It supports Carousel, Accordion, Fan stack, and Vertical board layouts, along with keyboard controls, touch gestures, hover interactions, autoplay pausing, and links to the original images. Uploads are resized in the browser and converted to WebP before being sent to storage.

The repository contains only a Supabase publishable key. The gallery ID is deliberately kept out of Git because it also acts as the editing credential for that particular gallery.

## Weather Widget

The weather widget shows current conditions for Xiamen and Ningbo in a compact two-card layout. It uses **Open-Meteo**, refreshes every ten minutes, and does not need an API key. The page can follow the system theme or be pinned to light or dark mode through a URL parameter.

![Xiamen and Ningbo Weather Widget](/images/projects/notion-widgets/weather-widget.png)

Both the typography and the animated weather icons were designed for a small Notion frame. The recommended embed size is only 442 × 300 pixels, so the widget keeps the information hierarchy simple: city, condition, temperature, and one animated visual cue.

## Technical Shape

Both widgets use plain **HTML, CSS, and JavaScript**. That makes the repository easy to deploy on GitHub Pages, Cloudflare Pages, or any other static host. The weather component calls Open-Meteo directly, while the gallery adds Supabase for persistent configuration and image storage.

What I like about this project is its small scope. Each widget solves one visible problem, remains understandable without a large toolchain, and can keep evolving independently as I notice small interaction details while using it in Notion.
`;export{e as default};
