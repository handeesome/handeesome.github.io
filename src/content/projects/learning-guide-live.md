---
title: Learning Guide Live & Private Meeting Room
date: 2026-09-10
tags: [nextjs, typescript, livekit, prisma, sqlite, netlify]
description: From a moderated study room with chat and AI summaries to 见面, a simple password-protected video room for two people across their devices.
---

Learning Guide Live is a study room platform I built for small-group discussions. It brings room invitations, host approval, video calls, written chat, and a record of the discussion into one place. I later built **见面 (Private Meeting Room)** on top of this project, simplifying the experience for two people who want a familiar place to call each other.

The two projects share a starting point: a room needs to manage who can enter, what each person can do, and what happens when the conversation ends.

## Learning Guide Live

Participants sign in, open an invitation, and request entry to a topic-based room. The host reviews requests in a waiting room, with a limit of eight seats. Host, Moderator, and Participant roles determine who can approve entry, manage speakers, remove participants, or end the room.

Inside the room, **LiveKit** handles camera, microphone, and screen sharing. Participants can exchange written messages and raise a hand, while moderators can focus a speaker. Screen sharing takes priority on the main stage. Chat and collaboration state are saved by the application, so refreshing the page can recover the discussion context.

![Learning Guide Live room details for a sample philosophy discussion, showing host approval and an eight-person limit](/images/projects/learning-guide-live/study-room.png)

After a room ends, **DeepSeek** can generate a summary from its saved written chat. The summary uses that text as its source; it does not transcribe the call or receive the audio and video.

Source code: [Learning Guide Live on GitHub](https://github.com/handeesome/learning-guide-live)

## 见面 · Private Meeting Room

For 见面, I narrowed the workflow to entering a shared password and joining a call. It is intended for two regular users, with up to four simultaneous device connections so a phone, computer, or extra browser tab can join the same room. Each connection occupies one place, and the media server rejects additional connections when the room is full.

The microphone and camera start off, and each person switches them on when ready. Desktop browsers can share a screen; mobile users can view it, with sharing from the phone depending on browser support. Hanging up leaves the call on that device.

This version uses **React and LiveKit**, with **Netlify** hosting the frontend and server functions. It has no database, user accounts, written chat, recordings, transcription, or call history. The password is checked on the server, and a signed HttpOnly cookie remembers access. LiveKit credentials stay on the server, while participant tokens stay in memory.

Source repository: [Private Meeting Room on GitHub — private, access required](https://github.com/handeesome/private-meeting-room)

The smaller scope makes the difference between the two projects useful to me. Learning Guide Live organizes a group discussion and preserves its written context; 见面 keeps the steps for a recurring private call short. Both use LiveKit, but they need different room rules and different amounts of application state.

## Technical Architecture

Learning Guide Live uses **Next.js and TypeScript** for the custom React interface, authenticated route handlers, and business services. **Better Auth** handles sign-in and sessions; **Prisma and SQLite** store users, rooms, invitations, memberships, join requests, chat messages, and summaries.

The application and media follow separate paths. Browser commands go through the Next.js server and are checked against the database. Audio, video, and screen sharing travel directly between browsers and **LiveKit Cloud**, without passing through the Next.js server. Only server code holds LiveKit management credentials and the DeepSeek API key.

### Admission Under Concurrency

I separated approval, seat reservation, and media-token issuance into distinct steps. Approval makes a member eligible to join; a seat reserves scarce capacity; a short-lived token gives one opaque identity access to LiveKit.

The capacity check and seat claim run inside a SQLite write transaction, acquiring the write lock before reading mutable room state. This prevents concurrent requests from both claiming the final seat in the current single-instance setup. Invitations store a hash of the code and an expiry time, while membership and join-request records have unique room/user pairs.

Connection generations also matter. When the same account takes over from another page, the server revokes the old media identity and checks the reservation generation before applying asynchronous results. A delayed request from the old page cannot release the replacement page's seat.

### Durable Collaboration and Failure Recovery

Chat, hand raising, and speaker focus are saved to SQLite before the server sends a LiveKit notification. The notification tells clients to reload authoritative state. Visible-page polling provides a recovery path if a real-time packet is missed.

External service calls stay outside database transactions. Operations that cross that boundary use explicit intermediate states: ending a room moves through `OPEN → ENDING → ENDED`, with `ENDED` written only after media cleanup succeeds. Removing a participant records `KICKED` before revoking their media access. Partial failures remain visible and retryable instead of being reported as completed.

Summary generation follows the same pattern. A saved generation attempt ID prevents a delayed DeepSeek response from overwriting a newer attempt. The input is bounded written chat and room metadata; provider token counts and the result state are retained with the summary.

### A Smaller Architecture for 见面

见面 keeps a **React** frontend but replaces the account and database layer with **Netlify Functions** and a shared-password check. A signed **HttpOnly cookie** remembers access for 14 days. The server issues LiveKit tokens with a 60-second initial connection window; token expiry does not itself end an established call.

Capacity is enforced by LiveKit's four-connection room configuration, rather than SQL seat reservations. Issuing a token does not reserve a place: the media server makes the admission decision when the device connects. That matches the smaller product, which needs calls across a few devices without durable memberships or discussion history.

Changing the password or session secret invalidates old access cookies after redeployment, but does not immediately terminate existing calls. Those can be ended through LiveKit. Keeping these boundaries explicit avoids treating a website login change as proof that media access has already stopped.

## Verification and Deployment Scope

Learning Guide Live includes isolated SQLite integration tests, concurrency checks, and a complete workflow test with simulated external services. Its current deployment target is a local, single-instance application; moving to several application instances would require revisiting the database and coordination design.

见面 deploys its static frontend and server functions to Netlify and uses a dedicated LiveKit Cloud project for media. Its tests use synthetic credentials and injected service adapters. Actual microphone, camera, screen sharing, device limits, and sustained call quality still need checks on the intended devices and networks. Hosting the page does not change the media route.
