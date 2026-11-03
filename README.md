# Cenhan's Site

> My corner of the internet for keeping track of what I read and building small tools.

[Visit the site](https://www.ducenhan.com)

This is a personal website that I keep adding to over time. It is part reading log, part playground, and part home for the small tools and experiments I make along the way. I wanted one place that could hold all of those things without turning them into a polished portfolio or scattering them across different platforms.

## What's inside

### A place for my reading

The Library is the part I use the most. It keeps track of books I have read, what I am reading now, and what I want to read next, along with notes, quotes, ratings, tags, and reading dates.

The reading timeline gives me a more visual way to look back at that history. Instead of seeing the library as one long list, I can see when different books were finished and how much reading time went into each month.

![Reading timeline showing books grouped by month](docs/readme-assets/reading-timeline.png)

I also bring in my Toggl reading sessions to see how my reading was spread across a day. The tracker below shows the busiest reading day in the current data, broken down by book and time of day.

![Reading time tracker showing the busiest day in the current data](docs/readme-assets/reading-time-tracker.png)

The Library is mainly built around my own reading habits. There is also a small shared database that lets a few other people keep their own public or private shelves, but that is more of an extra than the main idea.

### Small things I build

I use the rest of the site as a home for projects, little web tools, demos, games, and experiments. Some of them come from everyday problems I wanted to make less annoying; others are simply things I built while learning or following an idea that seemed interesting.

The site also has a light and dark theme, and every page opens with a randomly selected quote from the public bookshelves.

## Built with

React · Vite · React Router · Firebase · Bootstrap · Recharts · Markdown

---

© 2026 Cenhan. All rights reserved.

## Notion widgets

The widgets at https://www.ducenhan.com/widgets/questions/, /widgets/gallery/ and /widgets/weather/ are now served by the independent Cloudflare Worker notion-widgets. Its /widgets/* routes take precedence over this website's ducenhan-website Custom Domains, while all other website paths stay on the personal-site Worker. Existing shared links and their query parameters (especially id) are unchanged.

Cloudflare Git integration builds and deploys handeesome/notion-widgets main directly. Widget releases no longer require this website to build or deploy. The personal website build has no prebuild widget fetch and does not depend on the widget source repository being available.

Checked-in public/widgets files remain as a rollback snapshot only. scripts/sync-notion-widgets.mjs is retained as an explicit maintenance tool, available via npm run widgets:snapshot; it is not part of the website build. Set NOTION_WIDGETS_SOURCE to a local widget repository path when refreshing that snapshot manually. If the independent widget routes are removed, the existing snapshot can serve as a fallback. Do not remove the personal-site Custom Domains or DNS when rolling back.
The question widget uses one compact card drawer with single/multiple draw modes. Multiple draws retain a collapsible, height-limited history; there are no participant-count or turn controls. Its batch question editor uses one continuous editable bullet list, opens at the end for additions, and dims the background with an 85% black overlay.

Question themes can be chosen or created when adding a question and edited per card in the dashboard. The add-panel theme dropdown sits at its top right; the shared drawing UI uses inline theme choices with totals below the card deck and no extra label beside the draw-mode toggle. Custom themes are limited to six (excluding All and Uncategorized). The question wall supports theme filtering and full theme dropdowns (including creation), with explicit dark-mode option colors and no focus outline or shadow on any question dashboard dropdown. Theme choices below the deck use three equal-width columns, including narrow Notion embeds; bulk entry stays a plain question list.
