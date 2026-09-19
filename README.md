# 🎂 Supreethaa's Birthday Mystery Web Application

A handmade interactive birthday experience of anonymous wishes, audio voice notes, mini-games, dynamic photo galleries, and a secret admin portal.

---

## 🎂 Features Overview

* **Act 1: The Envelope & Opening**:
  - Interactive minion title & vintage postcard styling.
* **Act 2: Ideology / Political Choice**:
  - Left vs Right humorous choice with pinned photo stamp reactions.
* **Act 3: A Collective Blessing**:
  - Centered collective wish note with photo frames.
* **Act 4: The 3D Chocolate Cake Allocation**:
  - Interactive 3D Lit Cake with candles, dual-flame effects, and Communist / Kaththi Vijay meme reactions based on piece selection!
* **Act 5: Mystery Wishes & Voice Note Surprises**:
  - 2-Phase reveal: Guess the wisher in 5 attempts -> Voice note automatically plays with hidden name -> Name & meme revealed after voice note finishes!
  - Replayable audio controls with real-time waveform equalizer animation.
* **Act 6 & 7: Transition & Grand Finale**:
  - Scattered birthday photo memory gallery, note for next year, and replayable memory recap.
* **🔒 Secret In-App Admin Endpoint (`/admin`)**:
  - Add new wishes and upload `.mp3`/`.m4a` voice notes directly on the live website without touching code!
  - Accessible at `/admin` or via key shortcut `Ctrl + Shift + A`.

---

## 📂 Project Structure

```
├── public/
│   ├── audio/                     # Voice note MP3 files
│   ├── photos/birthday-person/    # Web-safe birthday girl photo gallery
│   ├── left-right/                # Political choice artwork
│   └── kaththi-communism.jpg      # Cake allocation meme scene
├── src/
│   ├── components/
│   │   ├── acts/                  # Act 1 through Act 7 components
│   │   ├── ChocolateCake3D.tsx    # Interactive 3DLit Cake
│   │   ├── AddWishModal.tsx       # Live Wish & Audio Creator
│   │   └── decorations.tsx        # Bows, PushPins, Stamps, Polaroid frames
│   ├── data/
│   │   ├── wishes.json            # Wisher messages, names & audio paths
│   │   ├── photos.json            # Birthday photo paths list
│   │   └── banter.json            # Game reactions & funny hints
│   ├── routes/
│   │   ├── index.tsx              # Main mystery app
│   │   └── admin.tsx              # Secret Admin Portal (/admin)
│   └── styles.css                 # Core CSS design system
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build
```

---

## 🎁 Adding New Wishes & Voice Notes Live

Visit `https://your-site-url.com/admin` (or press `Ctrl + Shift + A`) to open the hidden live admin portal. You can type new messages and upload voice notes directly from your device!
