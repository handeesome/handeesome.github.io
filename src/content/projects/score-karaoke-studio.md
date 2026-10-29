---
title: 谱间 · Pujian
date: 2026-10-29
tags: [react, typescript, python, fastapi, ffmpeg, audio]
description: A local Windows app for marking lyrics on sheet music, syncing them with audio, and exporting karaoke videos with the original soundtrack.
---

Pujian (谱间) is a desktop tool I built for turning PDF or image sheet music into a video that follows the singing. It keeps the original score on screen, highlights the lyrics as the audio plays, and scrolls to the current phrase. The interface is in Chinese, with large text and controls for the work of marking and checking each line.

The workflow is straightforward: import a score and a recording, mark the lyric regions, arrange them in singing order, tap along to set their timing, then preview and export a video.

- **Source code:** [View the GitHub repository](https://github.com/handeesome/score-karaoke-studio)
- **Windows app:** [Download from GitHub Releases](https://github.com/handeesome/score-karaoke-studio/releases)

## From Sheet Music to Timed Lyrics

The app accepts a PDF or a set of score images, together with an audio file. I can draw boxes around the lyrics or divide the page with horizontal and vertical lines, then number the regions in the order they are sung. Repeated phrases can reuse the same region without drawing another box. For scores with several verses, automatic numbering offers a verse-by-verse order to review before applying it.

While the recording plays, clicking the timing button or pressing Enter marks the first phrase, each following phrase, and the final ending. A zoomable timeline shows a locally separated vocal waveform as a reference. Phrase bars and their edges can be dragged to adjust the timing after the initial pass.

Automatic region detection and alignment can suggest boxes and times using OCR, audio transcription, and waveform information. These are starting points to check: scan quality, repeated lyrics, and accompaniment can all affect the result.

## Preview and Export

There are two highlight modes: a sweep from left to right, or a whole region that stays highlighted until the next phrase begins. The highlight color is configurable, and black-and-white inversion helps prepare scores with a dark background. The same settings carry through to the video preview and export.

The app exports H.264 MP4 video in landscape, portrait, square, or custom dimensions. It copies the original audio track directly; the separated vocals are only a timing aid. If the audio codec cannot be placed in an MP4 container, the app reports that limitation so the user can prepare a compatible file.

## Technical Architecture

I split the application into an interactive editor, a local processing service, and a desktop shell:

- **React and TypeScript:** score regions, page partitions, singing order, waveform navigation, timing edits, undo/redo, and export controls.
- **Python and FastAPI:** file import, project persistence, OCR, audio analysis, preview frames, and video rendering.
- **pywebview and PyInstaller:** a Windows desktop window and packaged runtime, so the finished app does not require a separate Python or Node.js installation.

The desktop entry point starts the service on the loopback interface and loads the built frontend. Media processing stays on the computer. Project records, imported files, and analysis caches live in the app's data directory, while the user chooses where to save exported videos.

### Keeping Score Regions and Timing Consistent

The editor's typed project model records page dimensions, region coordinates, ordered segments, timing assignments, highlight settings, and export settings. A region's place on the page is distinct from its timing assignment: removing a phrase from the timeline can keep its score box available for another pass.

The two highlight modes need different editing rules. Whole-region mode connects adjacent phrases through shared boundaries, so moving one boundary updates both phrases. Sweep mode allows independent intervals, including gaps or overlaps. Timing edits enforce a minimum phrase length of 0.1 seconds and stay within the audio duration.

Merging regions also needs care. I preserve the existing time slots, rebind them in singing order, and retain surplus slots for later assignment. This avoids throwing away the timing work when the score layout changes. The partition and timing logic is covered by focused frontend tests.

### Local Recognition and Audio Analysis

PDF pages are rasterized with **PyMuPDF at 240 DPI**. Automatic alignment combines **Tesseract** OCR with **faster-whisper** transcription and vocal waveform information to propose phrase times. Suggestions remain reviewable instead of replacing existing manual timing.

For vocal analysis, the app can use a fast **Spleeter ONNX model through ONNX Runtime**, with **Demucs** used when the fast model is unavailable. Completed analysis is cached for reuse. Progress reflects processing stages and completed audio segments, so a long-running analysis does not show a percentage based only on elapsed time.

### Rendering and Audio Preservation

The Python renderer produces RGB frames from the project at each output timestamp and streams them into **FFmpeg** through a pipe. FFmpeg encodes H.264 video with `libx264`, while `-c:a copy` preserves the original audio stream. The separated vocal track never replaces the original recording.

This makes audio compatibility an explicit export constraint: an unsupported MP4 audio codec stops the export rather than silently triggering lossy conversion. Backend tests cover audio passthrough, timeline validation, scrolling, export destinations, model handling, and desktop updates.

## Packaging and Current Scope

The app works on one song at a time and saves the session so it can be continued after reopening. An offline package includes models and OCR tools; the standard package needs those prepared before the related features can be used. Windows packages need WebView2 Runtime and .NET Framework 4.8.

Cumulative updates reuse the existing runtime and model caches. Keeping installed program files separate from user data allows upgrades without replacing the imported scores, recordings, or saved timing work.

The useful part for me is keeping the score, singing order, and timing together. I can work directly with an existing score, correct individual phrases while listening, and check the synchronized result before exporting it.
