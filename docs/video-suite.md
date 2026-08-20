# Mizant silent, subtitled video suite

The public Learning Centre contains ten 16:9, 1920×1080 guides built from the real Mizant interface and fictional demonstration records.

## Editorial rules

- No narration, music or other audio is used.
- Every explanation appears as large, burned-in on-screen text.
- A timed English WebVTT subtitle track is supplied and enabled by default in the platform player.
- Claims and workflows must match the current platform.
- The demonstration disclaimer remains visible throughout each guide.

## Source and output

- Editorial content: `scripts/video-suite-content.json`
- Renderer: `scripts/render-video-suite.py`
- Real interface captures: `.tmp/video-suite-stills/` (local render input)
- Published media: `apps/web/public/videos/`

The renderer creates title cards, alternating explanation panels, posters and timed subtitle files. It then encodes web-optimised, video-only H.264 MP4 files with fast-start metadata.

## Render command

Run the following from the repository root, substituting the local Python and FFmpeg paths where necessary:

```powershell
python scripts/render-video-suite.py `
  --ffmpeg .tmp/video-tools/bin/ffmpeg.exe `
  --manifest scripts/video-suite-content.json `
  --stills .tmp/video-suite-stills `
  --output apps/web/public/videos `
  --work .tmp/video-suite-render-subtitled `
  --logo apps/web/public/brand/mizant-logo-light.png
```

After rendering, verify at least one frame from the introduction, walkthrough and SME submission guide. Confirm the duration and resolution of all ten outputs, confirm that no audio stream is present, and verify each matching WebVTT subtitle file before publishing.
