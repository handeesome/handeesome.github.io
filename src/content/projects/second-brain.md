---
title: Obsidian Second Brain
date: 2026-06-02
tags: [obsidian, markdown, python, ai, personal-knowledge-management]
description: A local-first Markdown vault where Codex maintains reading conversations, evidence links, and evolving thought without turning AI inference into personal memory.
---

Obsidian Second Brain is a local-first knowledge system I am building around reading, conversations, and learning. I want to recover what I read, understand why something caught my attention, and compare how I understood a question at different times.

**Obsidian Markdown is the durable source of truth; Codex is the current conversation and maintenance interface.** Books, highlights, source conversations, topics, formal stances, and system rules remain human-readable files. The interface can change without making the notes dependent on a particular AI product.

The source repository is private. This article describes its system design rather than publishing personal notes or conversations.

## From Conversation to Connected Notes

The project has two parallel uses: deepening selected books I have already read, and discussing topics or learning something new. Book work gets more attention at present, but it is not a prerequisite for a useful discussion.

A book session starts from existing notes, highlights, prior conversations, and a confidently matched ebook's structure or short context. The ebook library stays outside the vault and serves as auxiliary source material. Highlights are memory cues; questions follow the book's arguments, scenes, and tensions rather than requiring a response to every highlighted sentence.

Each completed reading unit is saved incrementally as a source conversation. At a natural session boundary, Codex integrates relevant book and topic notes, source links, stance signals, and necessary profile changes. Ordinary note maintenance does not need a separate approval for every file. Topic and learning conversations are captured when they contain durable thought or understanding; routine tool questions and maintenance chatter are excluded.

## Evidence Boundaries

Automatic maintenance makes attribution more important. The system distinguishes source text (`原文`), highlights (`我的高亮`), original user wording (`用户原话`), explicit expressions in context (`用户明确表达`), faithful AI organization (`AI整理`), uncertain inference (`AI推测`), external material (`外部资料`), and a revisable current synthesis (`当前综合`).

These are evidence categories, not an approval ladder. There is no routine waiting queue for me to clear. Uncertain interpretations remain AI inference. A highlight does not establish agreement, a past view does not automatically describe my current view, and one emotional or exploratory statement cannot become a stable profile fact.

Topic notes connect sources and unresolved questions over time. Formal stances are reserved for views that are important, repeated, and stable enough to benefit from independent retrieval. Stance signals are an AI-owned observation layer, not automatically accepted beliefs. New understanding preserves earlier evidence and its date instead of rewriting the past into apparent consistency.

## Example Interaction

This illustrative exchange shows the intended attribution and saving behavior; it is not an excerpt from the private vault.

```chat
Me:
I keep thinking about Fromm's idea that love is a practice.
I do not know whether I agree yet.

AI:
Let's keep that distinction: the idea belongs to the book,
and your response is an open question. What would treating
love as a practice explain, and what might it leave out?

Me:
It explains why attention matters. But I do not want to
reduce love to discipline.

AI:
I saved this unit as a source conversation and connected it
to the topic note on love. Your question and wording remain
separate from my synthesis. Any possible connection to other
themes stays labeled AI推测, without becoming a formal stance.

Me:
Let's continue with that tension next time.
```

## Technical Architecture

Global instructions route work to task-specific workflows for book deepening, conversation capture, topic/stance/profile maintenance, intake, and imports. Templates and deterministic scripts support those workflows. Ordinary discussion can update Markdown directly; repeated imports, migrations, and validation use scripts.

The Python standard-library helper `vault_recall.py` builds a lightweight recall index and dashboards. It excludes raw exports, logs, backups, raw chat and Notion imports, attachments, and the separate ebook library from routine retrieval. The index provides an evidence map; the source note supplies the wording and context needed to attribute a claim.

Personal recall starts with vault evidence. Learning and open discussion can also draw on external sources, with their contribution kept separate from my own expressions. This prevents outside research from silently becoming autobiographical memory.

## Validation, Recovery, and Privacy

Validation follows the scale of the change. Incremental conversation saves do not trigger a full scan. Natural session checkpoints use changed-file validation when links or front matter changed; book completion, bulk imports, system changes, and moves call for broader checks. Indexes and dashboards refresh when their underlying decision data is materially stale.

Git tracks core Markdown, rules, scripts, and lightweight indexes. Raw exports, attachments, ebooks, local backups, application state, and reports need their own backup strategy because Git excludes them. Credentials and third-party secrets do not belong in the vault.

Local-first describes where the durable files live. Codex may read selected material while assisting, and external research introduces additional sources; this is not a promise of fully offline AI processing. The system's evidence rules guide that assistance, but they still require careful source handling. Its most useful property is that I can inspect and correct the memory in ordinary Markdown.
