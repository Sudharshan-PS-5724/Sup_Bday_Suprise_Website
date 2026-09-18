import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Trash2, Copy, Check, Music, ArrowLeft, Download, RefreshCw } from "lucide-react";
import { Bow, PearlString, Rose, Sparkle, Sticker } from "@/components/decorations";
import { getCustomWishes, saveCustomWishes } from "@/components/AddWishModal";
import { staticWishes, type Wish } from "@/lib/content";

export const Route = createFileRoute("/admin")({
  ssr: false,
  component: AdminPage,
});

function AdminPage() {
  const [customList, setCustomList] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [aliases, setAliases] = useState("");
  const [wishText, setWishText] = useState("");
  const [visualStyle, setVisualStyle] = useState("letter");
  const [revealNote, setRevealNote] = useState("");
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setCustomList(getCustomWishes());
  }, []);

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
      alert("Please fill in both Wisher Name and Wish Text.");
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
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

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
  }

  function copyJSON() {
    const jsonStr = JSON.stringify(customList, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <main className="app-shell min-h-[100svh] py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Link to="/" className="btn-ghost-ink flex items-center gap-2 text-sm font-semibold">
            <ArrowLeft size={16} /> Back to Live Birthday Site
          </Link>
          <div className="flex items-center gap-2">
            <Sticker tone="cherry" rotate={-3}>🔒 SECRET ADMIN PORTAL</Sticker>
            <Sparkle size={16} />
          </div>
        </div>

        <div className="paper paper-grain p-6 sm:p-10 shadow-2xl rounded-sm border-2 border-gold/60">
          <h1 className="text-4xl font-bold" style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}>
            Live Wish & Voice Note Management
          </h1>
          <p className="mt-2 text-cocoa text-base">
            Add incoming birthday wishes and upload audio voice notes directly on the live website anytime!
          </p>

          {savedSuccess ? (
            <div className="mt-4 bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-3 rounded text-sm font-semibold flex items-center gap-2">
              <Check size={18} /> Wish & Voice Note saved successfully! It is now active on the live website.
            </div>
          ) : null}

          {/* Add Form */}
          <form onSubmit={handleAdd} className="mt-8 space-y-5 border-t border-cocoa/20 pt-6">
            <h2 className="text-2xl font-bold text-burgundy" style={{ fontFamily: "var(--font-display)" }}>
              Add New Wish & Audio Clip
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-caps block text-xs font-bold text-chocolate mb-1.5">
                  Wisher Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanshu"
                  className="w-full bg-cream/70 px-3.5 py-2.5 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
                  required
                />
              </div>

              <div>
                <label className="label-caps block text-xs font-bold text-chocolate mb-1.5">
                  Aliases / Nicknames (comma separated)
                </label>
                <input
                  type="text"
                  value={aliases}
                  onChange={(e) => setAliases(e.target.value)}
                  placeholder="e.g. Priyan, Pri"
                  className="w-full bg-cream/70 px-3.5 py-2.5 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="label-caps block text-xs font-bold text-chocolate mb-1.5">
                Wish Message Text *
              </label>
              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Paste the birthday wish text here..."
                rows={5}
                className="w-full bg-cream/70 px-3.5 py-2.5 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label-caps block text-xs font-bold text-chocolate mb-1.5">
                  Visual Card Theme
                </label>
                <select
                  value={visualStyle}
                  onChange={(e) => setVisualStyle(e.target.value)}
                  className="w-full bg-cream/70 px-3.5 py-2.5 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
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
                <label className="label-caps block text-xs font-bold text-chocolate mb-1.5">
                  Reveal Note (One-liner)
                </label>
                <input
                  type="text"
                  value={revealNote}
                  onChange={(e) => setRevealNote(e.target.value)}
                  placeholder="e.g. School friend since 2018"
                  className="w-full bg-cream/70 px-3.5 py-2.5 text-sm border border-cocoa/40 rounded-sm outline-none focus:border-burgundy"
                />
              </div>
            </div>

            <div>
              <label className="label-caps block text-xs font-bold text-chocolate mb-1.5">
                Voice Note Audio Clip (Optional)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 px-4 py-2.5 bg-burgundy text-cream text-xs font-semibold rounded-sm cursor-pointer hover:bg-cherry transition-colors shadow-sm">
                  <Music size={16} />
                  Select Audio File (.mp3, .m4a)
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
                  <span className="text-xs text-taupe">No file chosen</span>
                )}
              </div>

              {audioBase64 ? (
                <div className="mt-3 flex items-center gap-3 bg-amber-50/80 p-3 rounded border border-gold/60">
                  <audio controls src={audioBase64} className="h-8 w-full max-w-md" />
                </div>
              ) : null}
            </div>

            <button
              type="submit"
              className="btn-wax w-full py-3.5 flex items-center justify-center gap-2 cursor-pointer shadow-lg text-base hover:scale-102 transition-transform"
            >
              <Plus size={18} /> Save Wish & Voice Note to Live Site
            </button>
          </form>

          {/* List of Live Custom Wishes */}
          <div className="mt-10 border-t border-cocoa/20 pt-6">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h3 className="text-2xl font-bold text-chocolate" style={{ fontFamily: "var(--font-display)" }}>
                Custom Added Wishes ({customList.length})
              </h3>
              {customList.length > 0 ? (
                <button
                  onClick={copyJSON}
                  className="btn-ghost-ink text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check size={14} className="text-olive" /> : <Copy size={14} />}
                  {copied ? "Copied JSON!" : "Copy Raw JSON"}
                </button>
              ) : null}
            </div>

            {customList.length === 0 ? (
              <p className="text-sm text-cocoa italic bg-cream/50 p-4 rounded text-center border border-dashed border-cocoa/30">
                No custom wishes added via endpoint yet. Fill out the form above to add one anytime!
              </p>
            ) : (
              <div className="space-y-3">
                {customList.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 bg-cream/90 p-4 rounded border border-cocoa/30 text-sm shadow-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-burgundy text-base">{item.name}</span>
                        {item.audio ? (
                          <span className="text-xs bg-olive/20 text-olive font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Music size={11} /> Voice Note
                          </span>
                        ) : null}
                      </div>
                      <p className="text-cocoa line-clamp-2 mt-1 text-xs">{item.wish}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-cherry hover:text-burgundy p-2 cursor-pointer transition-colors shrink-0"
                      title="Delete Wish"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 text-center pt-6 border-t border-cocoa/20">
            <Link to="/" className="btn-wax px-8 py-3 cursor-pointer text-base inline-flex items-center gap-2">
              Go to Birthday Mystery Game →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
