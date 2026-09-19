import { useState } from "react";
import { motion } from "motion/react";
import { Sparkle, Sticker } from "@/components/decorations";

function shuffled<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex]!, result[index]!];
  }
  return result;
}

export function BirthdayPhotoGallery({ photos }: { photos: string[] }) {
  // Keep one random order for the current play-through; a reset/reload reshuffles it.
  const [orderedPhotos] = useState(() => shuffled(photos));

  if (orderedPhotos.length === 0) return null;

  return (
    <section className="mt-14 w-full" aria-labelledby="birthday-photos-title">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Sparkle size={14} />
        <p className="label-caps text-center">the full evidence archive</p>
        <Sparkle size={14} />
      </div>

      <h3
        id="birthday-photos-title"
        className="mt-3 text-center text-3xl sm:text-5xl font-bold"
        style={{ fontFamily: "var(--font-display)", color: "var(--chocolate)" }}
      >
        Favourite Birthday Memories 📸✨
      </h3>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {orderedPhotos.map((photo, index) => (
          <motion.figure
            key={photo}
            initial={{ opacity: 0, y: 14, rotate: index % 2 ? 2 : -2 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: Math.min(index * 0.04, 0.4) }}
            className="paper paper-grain overflow-hidden p-2 rounded-sm shadow-md transition-all hover:scale-105 hover:z-10 hover:shadow-2xl cursor-pointer"
          >
            <img
              src={photo}
              alt="A birthday memory"
              loading="eager"
              className="aspect-square w-full object-cover rounded-xs"
            />
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
