const e=`---
title: TCG Card Manager
date: 2026-06-20
tags: [python, dashboard, data-collection, tcg]
description: A local-first TCG portfolio dashboard that tracks card holdings, purchase cost, grading details, multi-market price references, and collector run history.
---

TCG Card Manager is a local-first dashboard I built for managing trading card holdings, starting with **Pokémon** cards. A card collection is not just a list of names and prices: every card has a language, set, number, grade, purchase cost, market context, and a price that can vary widely between Chinese, Japanese, and US trading channels.

The goal of this project is to keep that messy information in one place. It lets me record what I own, what I paid, how each card is graded, which price sources were checked, and whether a card is currently above or below cost. The app runs locally, so private portfolio data, API tokens, market-check notes, and collector outputs can stay off GitHub.

Source code: [github.com/handeesome/tcg-card-manager](https://github.com/handeesome/tcg-card-manager)

[Try the frontend-only demo](/demos/tcg-card-manager/index.html)

## What It Does

The main dashboard reads a local \`portfolio.json\` file and turns it into a portfolio view. At the top, it summarizes total current value, total buy cost, unrealized profit or loss, and the latest update time. Below that, the card grid can be filtered by game, language, grading company, holding status, and whether the card still needs a usable price.

Each card keeps the practical information I need while deciding what to hold or sell: Chinese, English, and Japanese names, set name, card number, rarity, image, grading label, buy date, buy price, current estimate, and market notes. Clicking a card opens a detail view with source-level price rows, confidence labels, recent sale information, trend points, and manual verification links.

One small but useful part is local editing. The dashboard can update purchase information through a tiny local Python server, which writes back to \`data/portfolio.json\`. That keeps the workflow simple: open the page, correct a buy price or date, save it locally, and immediately see the portfolio totals update.

## Price Collection Workflow

The collector is a Python script that updates cards from multiple sources and writes the results back into the local data model. It uses direct API clients first, then falls back to reference sources only when the primary route does not return a usable price. Every source result is stored with a status such as \`ok\`, \`auth_required\`, \`no_match\`, \`no_price\`, \`reference_only\`, or \`raw_data_unresolved\`, so the dashboard can show uncertainty instead of hiding it.

For Chinese and US-facing references, the project can use BiaoKa, CardHobby, TCGPriceLookup, PokemonPriceTracker, SerpAPI/eBay, and related data. For Japanese cards, the collector keeps Japanese-market verification links such as Aucfan, Mercari JP, Yahoo! Auctions, magi, SNKRDUNK, CardRush, and PriceCharting, so uncertain estimates can still be checked manually.

Some platform-specific routes are intentionally treated as authorized research and audit routes rather than production dependencies. The project records source status, permission responses, and unresolved samples when a route is not ready, but it does not hide that uncertainty behind a clean-looking number. That makes the collector useful for learning what is available without turning the dashboard into a fragile scraping dependency.

## Technical Shape

The app is intentionally small. The main pieces are:

- \`server.py\`, a local Python HTTP server that serves the dashboard and accepts \`POST /api/save-portfolio\`.
- \`web/index.html\`, a single-page dashboard with the portfolio grid, filters, detail modal, source table, inline editing, and theme support.
- \`scripts/collect_card_prices.py\`, the unified collector that updates current prices, run logs, price history, and backups.
- \`scripts/chinese_platform_api.py\`, which contains the platform client wrappers.
- \`data/portfolio.example.json\`, a public sample portfolio used as the fallback when no private portfolio exists.

Collector runs generate a few different files: updated portfolio data, daily price history snapshots, detailed run records, and pre-run backups. Secrets are loaded from environment variables or \`data/api_tokens.json\`, both of which are kept out of source control.

## Why I Built It

I built this because card collecting becomes hard to reason about once the collection is spread across languages, grading companies, platforms, and currencies. A single "current price" is rarely enough. I wanted a tool that could keep the collection personal and local while still showing the evidence behind each estimate.

What I like most about this project is that it treats uncertain data honestly. Some cards have strong recent-sale prices, some only have reference links, and some sources are blocked by permissions or unresolved response formats. The dashboard keeps those differences visible, which makes it more useful for personal collection decisions than a clean-looking number with no context.
`;export{e as default};
