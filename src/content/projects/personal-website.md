---
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

Some projects also include static interactive demos under `public/demos`. Those demos stay independent from the main React application, but the surrounding article gives them context, explains the original problem, and links back to the source repository.

## Technical Shape

The site is built with **React**, **Vite**, and **React Router**. Firebase provides the shared bookshelf layer, Bootstrap handles much of the responsive layout, Recharts powers reading visualizations, and Markdown keeps long-form project content maintainable.

Routes and heavier pages are loaded lazily so the library does not force every visitor to download every part of the site. Light and dark themes apply across the reading pages and project articles, and each page begins with a randomly selected quote from the public bookshelves.

## Why I Keep Building It

Most software projects have a clear point when they are done. This one is different. Its purpose is to make room for things that accumulate: books, small ideas, useful experiments, project histories, and evidence of how my interests move over time.

The value is not that every part follows one perfect taxonomy. It is that the site gives those parts a durable home, and that I can improve the structure whenever the collection outgrows it.
