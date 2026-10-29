---
title: Xiangcaoshan Christian Reading Library
date: 2025-01-21
tags: [hugo, javascript, netlify, markdown]
description: A Hugo reading and listening library with saved reading progress, adjustable typography, paragraph audio highlighting, music, and children's resources.
---

Xiangcaoshan is a Christian reading and listening library built with **Hugo**, custom JavaScript, and a modified `my-book` theme. The site gathers spiritual writings from authors such as Watchman Nee, Andrew Murray, T. Austin-Sparks, Jessie Penn-Lewis, John Nelson Darby, Thomas a Kempis, and others, then presents them in a quiet, book-like browsing experience.

The heart of the project is a structured bookshelf: books are organized by author and chapter, long-form text is stored in Markdown, and supported chapters include playable audio so readers can either read slowly or listen along. Beyond the bookshelf, the site also includes Christian music and children's learning resources, making it a small but complete media library for reading, listening, and discovery.

## Links

- **Source code:** [GitHub repository](https://github.com/handeesome/xiang-cao-shan-HUGO)
- **Live site:** [xiangcaoshan.netlify.app](https://xiangcaoshan.netlify.app/)

## What It Includes

The reading experience is built around a browsable Christian bookshelf. Each book has its own chapter pages, making the content feel closer to a digital library than a flat collection of files. For books with available recordings, chapters can be played directly on the page, and a **play all** feature lets visitors continue listening without manually opening every chapter.

The music section extends the same idea to worship media. It supports folders, sorting, pagination, thumbnails, and a remote media index, so the library can grow without forcing every item into hand-written pages. A separate children's section keeps family-friendly learning material easy to find.

## Technical Shape

The site uses **Hugo** as the static site generator, with content stored primarily under `content/books`, `content/music`, and `content/children`. Markdown keeps the book chapters easy to maintain, while custom JavaScript handles bookshelf filtering, audio playback controls, and the interactive music index.

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

- `人的破碎与灵的出来` by Watchman Nee
- `倪柝声全集` by Watchman Nee
- `得胜的生命` by Watchman Nee
- `效法基督` by Thomas a Kempis
- `基督是我们的满足` by John Nelson Darby
- `神的心意` by Andrew Murray
- `圣灵全备的祝福` by Andrew Murray
- `十字架与生命之路` by T. Austin-Sparks
- `魂与灵` by Jessie Penn-Lewis

## Offline Behavior and Verification

The installable PWA uses runtime caching for successfully visited same-origin pages and assets. An uncached page that cannot load shows an offline message. External audio and video still need a connection, so installing the site does not download the media library.

The repository includes Node regression tests for reading progress, typography, mobile controls, lazy audio synchronization, and service-worker navigation, plus Python alignment regressions. Its documented acceptance process combines those checks with a Hugo build, representative mobile and desktop pages, rendered paragraph targets, and audio boundary checks. A successful build alone does not establish that a recording is aligned correctly.

## Why I Built It

I built Xiangcaoshan to make Christian writings and music easier to access, especially for people who want a calm place to read, listen, and return to meaningful resources over time. The project is intentionally simple on the surface, but underneath it solves practical problems around content organization, audio access, media indexing, and long-term maintainability.

What I like most about this project is that it treats static-site architecture as a strength. Hugo keeps the pages fast and durable, Markdown keeps the library editable, and the small serverless layer handles only the pieces that truly need to be dynamic.
