const e=`---
title: Obsidian Second Brain
date: 2026-06-02
tags: [obsidian, markdown, python, ai, personal-knowledge-management]
description: A local-first Obsidian vault that turns reading records, highlights, conversations, and AI-assisted reflection into a long-term memory and thought-evolution system.
---

Obsidian Second Brain is a local-first knowledge system I am building around my own reading, notes, conversations, and learning process. It is not meant to be a polished SaaS app or a generic note-taking template. The goal is more personal: to help me remember what I have read, notice what has caught my attention, recover past thinking, and see how my views change over time.

The project uses **Obsidian Markdown** as the source of truth. Books, highlights, topics, conversations, stance drafts, profile notes, learning notes, dashboards, and system rules all live as readable files in the vault. AI can help organize and question the material, but it has to preserve a strict boundary between original sources, my highlights, my confirmed thoughts, and AI inference.

This is the main design rule of the project: a highlight is not automatically agreement. A book I read is not automatically my worldview. AI analysis is useful only when it clearly marks \`AI推测\` (AI inference), \`待确认\` (to be confirmed), and \`用户确认\` (user-confirmed thought).

## What It Does

The first layer is reading memory. The vault stores book notes, Goodreads-derived reading records, and highlight notes, then connects them through topic notes and recall indexes. That makes it possible to ask questions like where I may have read an idea before, which books or quotes relate to a topic, or how a certain theme has appeared across my reading.

The second layer is thought evolution. Instead of replacing older views with newer summaries, the system keeps a trail of how ideas develop. Topic notes and stance notes can record source evidence, open questions, AI observations, and user-confirmed updates. This matters because a second brain should not only store conclusions; it should also preserve the path that led there.

The third layer is guided AI intake. I do not want to fill out a rigid template every time I finish a book, notice a quote, or have a messy thought. The intended workflow is conversational: I can say something casually, the AI asks a few short follow-up questions, proposes where the material should go, shows a draft, and only writes to the vault after the boundary is clear.

## AI Boundaries

A major part of the project is deciding what AI is allowed to do. The vault supports different modes: strict vault-only recall for personal memory questions, web-assisted mode for learning or external research, Socratic mode for confusion, and book-deepening mode for recovering the structure of books I have already read.

The system is intentionally careful with personal memory. AI may summarize, connect, and challenge, but it should not invent my beliefs, quietly turn speculation into identity, or treat external sources as my own thoughts. Chinese, English, and mixed-language notes are preserved in their natural form, so the project does not become cleaner by becoming less true.

## Example Interaction

A typical exchange is closer to guided reflection than to filling out a form. The AI can ask questions, recover related notes, and draft a clean entry, but the final memory still depends on my confirmation.

\`\`\`chat
Me:
I keep thinking about Fromm's idea that love is not mainly a feeling,
but a practice. I do not know if I agree, but it keeps coming back
when I think about discipline and attention.

AI:
Before I write this into the vault, I need to separate a few things:

1. Is this your current belief, an open question, or just a line that
   caught your attention?
2. Should I connect it to the topic note on love, the stance note on
   self-discipline, or create a new waiting note?
3. Do you want me to search only your vault, or can I use external
   context about Fromm?

Me:
Treat it as an open question. Use vault-only mode first. Connect it to
love and self-discipline, but do not mark it as my confirmed view yet.

AI:
I found related notes from The Art of Loving, a prior conversation about
attention, and your topic note on self-discipline. Here is the draft:

- Source evidence: Fromm quote and previous highlight references.
- 待确认: whether love should be understood as a practice.
- AI推测: this may connect to your recurring interest in attention.
- 用户确认: you want this preserved as an open question, not a belief.

Proposed destination:
04_主题_Topics/Love.md
06_立场_Stances/Self-discipline and attention.md

Should I write this draft to the vault?

Me:
Yes, but keep the AI推测 label visible.
\`\`\`

## Technical Shape

The technical side is deliberately simple. The vault is a folder of Markdown files with clear top-level areas for books, highlights, topics, conversations, stances, learning notes, personal notes, attachments, and system files. A Python standard-library script, \`vault_recall.py\`, builds the lightweight recall index, dashboard notes, and candidate path lists for future RAG workflows.

The current index tracks hundreds of ordinary vault notes while skipping raw-like materials, logs, backups, chat exports, and the separate ebook source library from routine retrieval scope. The dashboard layer gives a quick overview of books, highlights, topics, stances, evidence levels, and recall readiness without turning raw private material into the default search surface.

Git acts as the recovery layer for normal edits, and the project favors small safe scripts over a large app. That keeps the system understandable: if a tool changes later, the Markdown vault still remains readable, portable, and useful.

## Why I Built It

I built this project because reading and thinking are temporal. I often care less about a final polished note than about the question underneath it: why did this sentence catch me, what was I wrestling with then, and how has that changed?

What I like most about this project is the restraint in its architecture. AI is invited into the workflow, but not as the owner of memory. The vault stays local, the evidence boundaries stay visible, and the system grows from real use rather than from a perfect abstract taxonomy. It is a personal knowledge project, but at its best it feels like a long-term reading partner: one that helps me remember, asks better questions, and keeps the thread of my thinking from disappearing.
`;export{e as default};
