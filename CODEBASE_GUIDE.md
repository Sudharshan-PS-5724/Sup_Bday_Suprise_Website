# Birthday Mystery - maintainer guide

This is a one-page, client-led birthday game built with TanStack Start, React 19,
TypeScript, Vite, Tailwind CSS 4, Motion, and a small Three.js cake scene. The
site has no database, API, authentication, or required environment variables.
All birthday content is version-controlled JSON and all media is static content
served from `public/`.

## What the visitor experiences

1. An invitation/opening screen with single-line title styling and scattered birthday-person photo frames.
2. A playful political choice ("Pick a side: Left vs Right") with image feedback.
3. A centered group wish card framed with warm decorations and photo memories.
4. An interactive cake piece allocation office with 3D cake, communist check (1 piece), and Kaththi communism meme scene.
5. Anonymous wish rounds in `src/data/wishes.json`. Each round auto-plays wisher audio (where available) and displays the wisher's name after 10 seconds of audio/elapsed time regardless of guesses.
6. Scattered photo frames of the birthday person throughout every act for a continuous flow.
7. Intermissions after every two wish rounds using `interactions.json`.
8. A finale with summary stats, wisher reveal cards, photo gallery, and multilingual closing.

Progress and sound preferences are saved in local storage under `birthday-mystery-state-v1`.

## Architecture and file map

| Area | Main files | Responsibility |
| --- | --- | --- |
| Route shell | `src/routes/__root.tsx`, `src/routes/index.tsx` | HTML metadata, ordered game flow, step routing |
| Game state | `src/lib/useGame.ts` | local persistence, guesses, selections, timers, reset |
| Content contract | `src/lib/content.ts` | TypeScript types and JSON imports |
| Wishes | `src/data/wishes.json` | anonymous messages, audio links, and wisher metadata |
| Group/finale | `src/data/interactions.json`, `languages.json`, `banter.json` | supporting copy and reactions |
| Audio | `src/data/media.json`, `src/lib/media.ts`, `src/lib/mediaSetup.ts` | triggered ambient audio & wisher voice notes |
| Birthday photos | `src/data/photos.json`, `src/components/BirthdayPhotoGallery.tsx` | photo registry and finale gallery |
| Acts | `src/components/acts/` | individual page screens (Opening, PoliticalChoice, CommonWish, CakeGame, MysteryRound, Intermission, Transition, Finale) |
| Visual design | `src/styles.css`, `src/components/decorations.tsx` | visual system, paper textures, stamps, stickers, and photo frames |
| 3D cake | `src/components/ChocolateCake3D.tsx` | interactive Three.js 3D cake scene with candles & toppings |

## UI Elements and Design System

The application uses an art direction inspired by warm vintage stationery, noir editorial scrapbooks, and interactive paper cards:

- **Paper Styles**: `paper`, `paper-grain`, `deckle`, `tape`, `rule-lines`, `torn-bottom`.
- **Typography**:
  - Display: `DM Serif Display` for headings and titles.
  - Body: `Fira Sans` for UI copy and input fields.
  - Handwriting: `Caveat` for notes, signoffs, and informal annotations.
- **Decorative System (`src/components/decorations.tsx`)**:
  - `Bow`, `Sparkle`, `Pearl`, `PearlString`, `Sticker` (with tones `blush`, `sage`, `gold`, `cocoa`, `peach`, `cherry`), `Ribbon`, `Rose`, `Stamp`.
  - **Photo Frames**: `PolaroidFrame`, `TapeFrame`, `StampFrame` used to scatter photos gracefully.

## Syncing Wishes, Audio, and Birthday Photos

### 1. Wishes & Audio Synchronization
Each wish entry in `src/data/wishes.json` connects text, audio, and visual elements:

```json
{
  "id": 1,
  "name": "Sreekar",
  "aliases": ["Sree"],
  "wish": "Happy birthday Supreethaaaa!! ...",
  "visualStyle": "letter",
  "revealNote": "German class, ventures, and elite conversations.",
  "audio": "/audio/Sreekar.mp3"
}
```

- **Audio File Location**: Audio files are located in `public/audio/<WisherName>.mp3`.
- **Playback & Name Reveal Flow**:
  1. **Guessing Phase**: The wish text is presented anonymously. The visitor gets up to 5 guess attempts (`guessesUsed`).
  2. **Surprise Audio Phase (10s)**: Once guessing finishes, the wisher's audio voice note starts playing while the name remains HIDDEN for 10 seconds ("Voice Note Surprise! Guess who this voice belongs to...").
  3. **Wisher Name Reveal**: After 10 seconds of audio playback (or countdown completion / skip), the wisher's name, reveal note, and meme reaction are revealed.

### 2. Birthday Photos Scattering (Full Flow)
Rather than accumulating all birthday-person images exclusively in the finale, photos from `src/data/photos.json` (`public/photos/birthday-person/`) are scattered across every act:

- **Act 1 (Opening)**: Styled polaroid photo frames of Supreethaa on the main editorial spread.
- **Act 2 (Political Choice)**: Photo frame accents alongside political choice cards.
- **Act 3 (Common Wish)**: Centered paper card flanked by floating memory photo frames.
- **Act 4 (Cake Game)**: Birthday photo frames around the 3D cake canvas.
- **Act 5+ (Mystery Rounds)**: Each wish round features a unique photo frame of Supreethaa paired with that round's stationery.
- **Intermissions & Finale**: Intermissions include photo clips, leading into the complete finale gallery.

## Run locally

```powershell
bun install
bun run dev
```

Or with npm:

```powershell
npm install
npm run dev
```

