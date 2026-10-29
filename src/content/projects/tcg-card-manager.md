---
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

The main dashboard reads a local `portfolio.json` file and turns it into a portfolio view. At the top, it summarizes total current value, total buy cost, unrealized profit or loss, and the latest update time. Below that, the card grid can be filtered by game, language, grading company, holding status, and whether the card still needs a usable price.

Each card keeps the practical information I need while deciding what to hold or sell: Chinese, English, and Japanese names, set name, card number, rarity, image, grading label, buy date, buy price, current estimate, and market notes. Clicking a card opens a detail view with source-level price rows, confidence labels, recent sale information, trend points, and manual verification links.

One small but useful part is local editing. The dashboard can update purchase information through a tiny local Python server, which writes back to `data/portfolio.json`. That keeps the workflow simple: open the page, correct a buy price or date, save it locally, and immediately see the portfolio totals update.

## Price Collection Workflow

The current collection workflow is organized around three sources: **JiHuanShe (集换社), BiaoKa (镖卡), and eBay**. Each produces normalized source rows under `current_prices.collector_sources`, retaining the observed price, currency, grade, timestamp, identity evidence, and status. Ambiguous matches and permission failures stay visible instead of becoming a fabricated estimate.

The practical JiHuanShe route reads the Android app through ADB and UI XML. It opens a result only when the name, number, game, and language identify a unique card, then captures the visible price, grading label, sampled listings, and optional trend points. Uncertain matches stop at the search stage. The capture script does not change the portfolio; a separate normalization step imports reviewed runs, backs up the destination, and checks that card identity, transactions, and purchase information remain unchanged.

BiaoKa uses an authorized account token for search, details, trends, and grade-specific sales. eBay uses SerpAPI sold-result searches and keeps the original USD observations and matching context. Missing credentials return an explicit source status. An unsuccessful refresh must preserve the previous usable value with its original timestamp and a stale label.

Direct JiHuanShe API work remains a separate research track. The local research document reports a functioning public-ranking client, while arbitrary card search and price queries are not yet working end to end. A successful HTTP response is not sufficient when the response contains a business permission error, and ranking heat or percentage change is not a card price.

## Targets and Daily Refreshes

Each holding can have a sale target in CNY. The alert evaluator accepts only a usable current observation fetched within 36 hours and compatible with the holding's grade. Reference values, proxy grades, stale observations, and mismatched grades do not trigger a reached-target alert. The dashboard highlights reached cards and offers a target-first sort. A partial run reevaluates only the selected cards, preserving the check times of untouched holdings.

While `server.py` is running, a local scheduler attempts a daily refresh at 09:00, or catches up when started later that day. It makes one automatic attempt per day; the page provides manual retry. Completion is checked using a run-specific commit receipt and fresh-price coverage, so a subprocess exiting successfully cannot by itself make a partially refreshed portfolio appear fully current.

Editing and deletion use validated, backed-up, atomic writes and recompute the portfolio totals. Deleting a holding removes its main record while retaining historical collection records and backups. The separate watchlist is read-only and cannot be edited, deleted, or assigned sale targets.

## Technical Shape

The app is intentionally small. The main pieces are:

- `server.py`, a local Python HTTP server for the dashboard, card edits, targets, deletion, and scheduled or manual refreshes.
- `web/index.html`, a single-page dashboard with the portfolio grid, filters, detail modal, source table, inline editing, and theme support.
- `scripts/collect_card_prices.py`, the unified collector that updates current prices, run logs, price history, and backups.
- The ADB capture and source-normalization scripts, which separate observed app data from reviewed portfolio updates.
- `scripts/price_alerts.py`, which selects fresh, grade-compatible prices and evaluates targets.
- `data/portfolio.example.json`, a public sample portfolio used as the fallback when no private portfolio exists.

Collector runs generate a few different files: updated portfolio data, daily price history snapshots, detailed run records, and pre-run backups. Secrets are loaded from environment variables or `data/api_tokens.json`, both of which are kept out of source control.

## Public Samples and Verification Scope

A clean checkout can use the sample portfolio and a published 22-card watchlist snapshot. The watchlist is dated demonstration data, not live pricing. Its exporter rejects credentials, private holding IDs, transactions, and local machine paths before producing public fixtures.

The local research notes document tests for ranking-response parsing, distinguishing percentages from prices, rejecting malformed results, and detecting expired-login errors inside HTTP 200 responses. Those checks do not establish that core JiHuanShe price queries work. The workflow also depends on the Android app's current layout and authorized sessions. This article review inspected documentation and focused source code; it did not run live collectors or read private holdings or credentials.

## Why I Built It

I built this because card collecting becomes hard to reason about once the collection is spread across languages, grading companies, platforms, and currencies. A single "current price" is rarely enough. I wanted a tool that could keep the collection personal and local while still showing the evidence behind each estimate.

What I like most about this project is that it treats uncertain data honestly. Some cards have strong recent-sale prices, some only have reference links, and some sources are blocked by permissions or unresolved response formats. The dashboard keeps those differences visible, which makes it more useful for personal collection decisions than a clean-looking number with no context.
