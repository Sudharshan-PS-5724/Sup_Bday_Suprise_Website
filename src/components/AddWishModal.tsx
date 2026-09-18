import { useState, useEffect } from "react";
import { Plus, Trash2, Volume2, X, Download, Copy, Check, Music } from "lucide-react";
import { Bow, PearlString, Rose, Sparkle, Sticker } from "@/components/decorations";
import { type Wish } from "@/lib/content";

const CUSTOM_WISHES_KEY = "custom_birthday_wishes_v1";

export function getCustomWishes(): Wish[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CUSTOM_WISHES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomWishes(wishes: Wish[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CUSTOM_WISHES_KEY, JSON.stringify(wishes));
  } catch (err) {
    console.error("Failed to save custom wishes:", err);
  }
}

export function AddWishModal({
  isOpen,
  onClose,
  onWishesUpdated,
}: {
  isOpen: boolean;
  onClose: () => void;
  onWishesUpdated: () => void;
}) {
  const [customList, setCustomList] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [aliases, setAliases] = useState("");
  const [wishText, setWishText] = useState("");
  const [visualStyle, setVisualStyle] = useState("letter");
  const [revealNote, setRevealNote] = useState("");
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCustomList(getCustomWishes());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleAudioUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert("Audio file is too large (max 15MB).");
      return;
    }

    setAudioFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAudioBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !wishText.trim()) {
      alert("Please fill in both the Wisher Name and Wish Text.");
      return;
    }

    const newWish: Wish = {
      id: Date.now(),
      name: name.trim(),
      aliases: aliases ? aliases.split(",").map((a) => a.trim()).filter(Boolean) : [],
      wish: wishText.trim(),
      visualStyle,
      revealNote: revealNote.trim() || undefined,
      audio: audioBase64 || undefined,
    };

    const updated = [...customList, newWish];
    setCustomList(updated);
    saveCustomWishes(updated);
    onWishesUpdated();

    // Reset form
    setName("");
    setAliases("");
    setWishText("");
    setRevealNote("");
    setAudioBase64(null);
    setAudioFileName("");
  }

  function handleDelete(id: number) {
    const updated = customList.filter((w) => w.id !== id);
    setCustomList(updated);
    saveCustomWishes(updated);
    onWishesUpdated();
  }

  function copyJSON() {
    const jsonStr = JSON.stringify(customList, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-chocolate/60 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="paper paper-grain relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-md p-6 sm:p-8 shadow-2xl border-4 border-cream my-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-cherry text-cream hover:opacity-80 cursor-pointer shadow-md"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Sticker tone="gold" rotate={-2}>Website Provision</Sticker>
          <Sparkle size={16} />
        </div>

        <h2 className="text-3xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}>
          Add Wish & Voice Note
        </h2>
        <p className="mt-1 text-sm text-cocoa">
          Add new birthday wishes and audio clips directly from the live website without editing code!
        </p>

        <form onSubmit={handleAdd} className="mt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-caps block text-xs font-bold text-chocolate mb-1">
                Wisher Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul"
                className="w-full bg-cream/70 px-3 py-2 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
                required
              />
            </div>

            <div>
              <label className="label-caps block text-xs font-bold text-chocolate mb-1">
                Aliases / Nicknames (comma separated)
              </label>
              <input
                type="text"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                placeholder="e.g. Rahu, Rahuley"
                className="w-full bg-cream/70 px-3 py-2 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
              />
            </div>
          </div>

          <div>
            <label className="label-caps block text-xs font-bold text-chocolate mb-1">
              Wish Message *
            </label>
            <textarea
              value={wishText}
              onChange={(e) => setWishText(e.target.value)}
              placeholder="Write the birthday message..."
              rows={4}
              className="w-full bg-cream/70 px-3 py-2 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label-caps block text-xs font-bold text-chocolate mb-1">
                Visual Card Style
              </label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full bg-cream/70 px-3 py-2 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
              >
                <option value="letter">Letter</option>
                <option value="postcard">Postcard</option>
                <option value="polaroid">Polaroid</option>
                <option value="diary">Diary</option>
                <option value="note">Note</option>
                <option value="clipping">Clipping</option>
                <option value="sticker">Sticker</option>
                <option value="invitation">Invitation</option>
              </select>
            </div>

            <div>
              <label className="label-caps block text-xs font-bold text-chocolate mb-1">
                Reveal Note (One-liner)
              </label>
              <input
                type="text"
                value={revealNote}
                onChange={(e) => setRevealNote(e.target.value)}
                placeholder="e.g. High school best friend"
                className="w-full bg-cream/70 px-3 py-2 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
              />
            </div>
          </div>

          <div>
            <label className="label-caps block text-xs font-bold text-chocolate mb-1">
              Voice Note Audio Clip (Optional)
            </label>
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 bg-burgundy text-cream text-xs font-semibold rounded-sm cursor-pointer hover:bg-cherry transition-colors shadow-sm">
                <Music size={14} />
                Upload Audio (.mp3, .m4a)
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioUpload}
                  className="hidden"
                />
              </label>
              {audioFileName ? (
                <span className="text-xs text-olive font-semibold flex items-center gap-1">
                  ✓ {audioFileName}
                </span>
              ) : (
                <span className="text-xs text-taupe">No audio selected</span>
              )}
            </div>

            {audioBase64 ? (
              <div className="mt-3 flex items-center gap-3 bg-amber-50 p-2.5 rounded border border-gold/50">
                <audio controls src={audioBase64} className="h-8 w-full max-w-md" />
              </div>
            ) : null}
          </div>

          <button
            type="submit"
            className="btn-wax w-full py-3 flex items-center justify-center gap-2 cursor-pointer shadow-md text-base"
          >
            <Plus size={18} /> Add Wish to Live Website
          </button>
        </form>

        {/* List of Custom Added Wishes */}
        {customList.length > 0 ? (
          <div className="mt-8 border-t border-cocoa/20 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-chocolate" style={{ fontFamily: "var(--font-display)" }}>
                Added Custom Wishes ({customList.length})
              </h3>
              <button
                onClick={copyJSON}
                className="btn-ghost-ink text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check size={14} className="text-olive" /> : <Copy size={14} />}
                {copied ? "Copied JSON!" : "Copy JSON Data"}
              </button>
            </div>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {customList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 bg-cream/80 p-3 rounded border border-cocoa/20 text-xs"
                >
                  <div>
                    <span className="font-bold text-burgundy">{item.name}</span>
                    {item.audio ? <span className="ml-2 text-olive font-semibold">🎙️ Audio attached</span> : null}
                    <p className="text-cocoa line-clamp-1 mt-0.5">{item.wish}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-cherry hover:text-burgundy p-1 cursor-pointer"
                    title="Delete Wish"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
