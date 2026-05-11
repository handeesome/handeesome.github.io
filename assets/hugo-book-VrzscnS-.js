const e=`---
title: Xiangcaoshan Christian Reading Library
date: 2025-01-21
tags: [hugo, javascript, netlify, markdown]
description: A Hugo-powered Christian reading and listening site that collects spiritual books, playable chapter audio, Christian music, and children's learning resources.
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

Two Netlify serverless functions support the parts that need dynamic behavior. One function validates audio requests and redirects them to object storage, keeping the public pages lightweight while still supporting protected media delivery. Another function reads a remote music manifest, groups folders, sorts entries, and returns paginated JSON for the frontend.

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

## Why I Built It

I built Xiangcaoshan to make Christian writings and music easier to access, especially for people who want a calm place to read, listen, and return to meaningful resources over time. The project is intentionally simple on the surface, but underneath it solves practical problems around content organization, audio access, media indexing, and long-term maintainability.

What I like most about this project is that it treats static-site architecture as a strength. Hugo keeps the pages fast and durable, Markdown keeps the library editable, and the small serverless layer handles only the pieces that truly need to be dynamic.
`;export{e as default};
