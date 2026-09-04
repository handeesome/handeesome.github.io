const e=`---
title: PNYL Fellowship Interactive Pages
date: 2026-01-21
tags: [javascript, cloudflare-workers, d1, netlify]
description: A collection of lightweight web tools for fellowship discussions, group activities, anonymous participation, and live facilitation.
---

PNYL Fellowship Interactive Pages is a collection of small web tools I built for real group activities. Instead of asking a facilitator to manage paper notes, spreadsheets, random grouping, scores, QR codes, and projected results separately, each page turns one activity into a focused browser-based flow.

The tools are intentionally lightweight. Most can run as static pages, while the activities that need live multi-device participation use a small Cloudflare Worker and D1 database. This keeps the setup understandable and makes it possible to preserve a read-only demo after a one-time event has ended.

## Links

- **Source code:** [GitHub repository](https://github.com/handeesome/pnyl)
- **Project home:** [pnyl.netlify.app](https://pnyl.netlify.app/)
- **Between Two Sides:** [debate.ducenhan.com](https://debate.ducenhan.com/)
- **Love Languages quiz:** [Open the quiz](https://pnyl.netlify.app/5lovelanguages/)
- **Fellowship Monopoly:** [Open the game](https://pnyl.netlify.app/monopoly/)
- **Fellowship Jeopardy:** [Open the activity](https://pnyl.netlify.app/jeopardy/)
- **Church Untold demo:** [Open the archived host view](https://pnyl.netlify.app/church-untold/public/host/)

## Five Small Tools

The **Love Languages quiz** turns a familiar questionnaire into a self-contained browser experience with a result chart. Its assets and dependencies are stored locally, so the activity does not depend on another quiz platform.

**Fellowship Monopoly** combines player registration, host controls, participant submissions, prompts, and event cards. The public version stores progress in \`localStorage\`; temporary groups can opt into their own LeanCloud configuration when multi-device synchronization is needed.

**Fellowship Jeopardy** is an icebreaker built around M&M questions, random seating, team assignment, a revealable question board, scoring, and a timer. Content, styling, and application logic are separated so a facilitator can replace the questions without rebuilding the interface.

**Church Untold** was made for an anonymous discussion night. Participants submitted five answers on their phones while a projected host screen showed response counts and revealed the results one question at a time. The live version used Cloudflare Workers, D1, scheduled deletion, input limits, and a host passcode. After the event, I retired the service and kept a read-only demo with sample responses instead of leaving a broken form online.

**Between Two Sides** supports a more structured debate night. Participants first vote anonymously on possible topics, then choose a side only after the topic is selected. The host can run timed response rounds and reveal private tasks at the right moment, while the projected view shows only the information the room needs. Room data expires automatically after six hours.

## Designing for a Room, Not Just a Screen

These pages are used while people are talking, moving, looking at a projector, and switching between phones and a shared screen. That changes the design priorities. A host needs clear progress and control, participants need short flows that work without explanation, and the projected page needs to remain readable from across the room.

The project also treats privacy as part of the interaction design. Anonymous tools avoid collecting identity fields, short-lived event data is deleted automatically, secrets stay in deployment configuration, and inactive services are turned into explicit demos rather than quietly failing.

## Why I Built It

I built these tools because many good group activities have awkward operational edges. The idea itself may be simple, but the person leading it still has to collect answers, keep time, split teams, protect anonymity, and keep the room focused. Small purpose-built pages remove those distractions and let the technology stay in the background of the conversation.
`;export{e as default};
