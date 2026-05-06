---
title: CCG Auto PPTX Generator
date: 2025-03-22
tags: [python, flask, python-pptx]
description: A Flask app that helps church coworkers generate weekly worship PowerPoint slides from structured service content, Bible passages, and song lyrics.
---

CCG Auto PPTX Generator is a tool I built for the weekly worship slide workflow at **Chinese Church Bremen**. Preparing church slides is repetitive work: names, announcements, Bible passages, responsive readings, sermon information, songs, and formatting all need to be arranged carefully every week. The goal of this project is to let coworkers focus on the content instead of spending time adjusting fonts, line spacing, slide layouts, and repeated PowerPoint formatting.

The app is built with **Flask** and **python-pptx**. It provides a web form where users can enter the service information once, then generate a ready-to-use `.pptx` file with consistent styling.

Source code: [github.com/handeesome/ccg-bremen-auto-pptx](https://github.com/handeesome/ccg-bremen-auto-pptx)

[Try the frontend-only demo](/demos/auto-pptx/index.html)

![A simple form](/images/projects/auto-pptx/simple-form.png)

## What It Does

The main workflow collects the content needed for a Sunday worship service, including service roles, Scripture readings, sermon details, songs, announcements, offering response, monthly memory verse, and prayer items. After submission, the backend assembles everything into a PowerPoint deck using predefined slide templates.

A key part of the project is Bible passage handling. Users select the book, chapter, and verse range from dropdowns instead of manually copying text. The app then looks up the passage, formats the verse numbers, wraps long lines for slide readability, and inserts the result into the correct section of the deck.

![bible verses](/images/projects/auto-pptx/verses.png)

The project uses the 2010 **Revised Chinese Union Version** / 《和合本修订版》 text, sourced from the Hong Kong Bible Society site. I also added logic to support verse ranges that appear as a single text entry, such as `路1:1-3`, so generated slides preserve the correct verse labels instead of renumbering them incorrectly.

## Song Slide Tools

Another important part of the app is song slide generation. Coworkers can either download existing song PowerPoints from the church Google Drive workflow or create new song slides directly from lyrics.

The DIY lyric tool helps split lyrics into pages, preview the result, and export a new PowerPoint file with the church's slide style. This makes it easier to create consistent song slides without manually duplicating and formatting PowerPoint pages.

![google drive](/images/projects/auto-pptx/google-drive.png)
![DIY-lyrics](/images/projects/auto-pptx/DIY-lyrics.png)

## Why I Built It

This project came from a real weekly need. Before this tool, preparing slides required many small manual steps, and small formatting mistakes were easy to introduce under time pressure. By turning the repeated parts into a structured app, the process became faster, more consistent, and easier for different coworkers to share.

It is a practical project, but I enjoyed it because it sits at the intersection of software, design, and service. The most satisfying part was not just generating a PowerPoint file, but making a workflow that respects the people who have to use it every week.

