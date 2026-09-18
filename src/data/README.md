# Editing the birthday game

Everything the game says lives in this folder. Nothing here needs code changes.

## wishes.json - the eight anonymous wishes

Each entry:

| field         | what it does                                                                 |
| ------------- | ---------------------------------------------------------------------------- |
| `id`          | keep unique; used to remember progress                                        |
| `name`        | the real answer, shown only at the reveal                                     |
| `aliases`     | other spellings/nicknames accepted as correct (never shown)                   |
| `wish`        | the message, kept exactly as written                                          |
| `visualStyle` | `letter`, `postcard`, `polaroid`, `diary`, `note`, `clipping`, `sticker`, `invitation` |
| `revealNote`  | one line shown under their name at the reveal                                 |
| `photo`       | optional wisher photo, e.g. `/photos/wishers/name.jpg`; shown on their final reveal |
| `meme`        | optional picture shown once that wish is finished (`public/memes/`)           |
| `audio`       | optional voice note, playable at the reveal (`public/audio/`)                 |

Add or remove wishes freely - the round count, intermission spacing and reveal
grid all follow this file.

## banter.json - the game's reactions

Lists of lines picked at random. Add as many as you like per category.

## interactions.json - recipient name, group wish, intermissions, finale text

## languages.json - the closing "We'll meet you soon." in every language

## media.json - overall game sound

Overall sound effects are intentionally disabled for this birthday site. Leave
this file as it is. Individual voice notes can still be added with the optional
`audio` field on a wish in `wishes.json`.

## photos.json - birthday-person gallery

This is separate from a wisher's `photo`. Put the birthday person's pictures in
`public/photos/birthday-person/`, then list each public URL in `photos.json`:

```json
[
  "/photos/birthday-person/photo-01.jpg",
  "/photos/birthday-person/photo-02.jpg"
]
```

All listed photos appear in the finale in a random order. That order stays stable
until the page is reloaded or the game is restarted. The file starts empty so no
gallery is shown until you add real paths; a path to a missing file displays as a
broken image.
