# CV-MAKER launch film

The 30-second, 1920×1080 film shown after the home page hero, built with [Remotion](https://www.remotion.dev).
It is silent by design (browsers only autoplay muted video), so every message is on screen.

No generated imagery: the person is shown with an initials avatar, and project previews are drawn in code (`ProjectArt` in `src/theme.tsx`).
Type is Geist, the website's typeface.

| Time | Scene | Message |
| --- | --- | --- |
| 0:00 | Intro | Logo, "Your career is bigger than a resume." |
| 0:03 | Problem | A PDF is a snapshot: resend every update, a version per role, work that doesn't fit |
| 0:08 | Identity | The PDF becomes a living profile |
| 0:13 | Different | One always-current link · show your work · AI tailoring and views |
| 0:23 | How it works | Start your story → Make it yours → Share one link → Keep evolving |
| 0:26 | Outro | "Don't just send your CV. Let people experience it." → Create your resume |

## Render

```bash
npm install
npm run render   # writes out/livecv-launch.mp4
npm run poster   # writes out/livecv-launch-poster.jpg
```

Copy both files into `../dist/assets/`. Rendering needs a few GB of temporary space; point `TEMP`/`TMP` at a roomy drive if needed.
