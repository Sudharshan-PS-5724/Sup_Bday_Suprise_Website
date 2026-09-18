import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Bow({ className, size = 120 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.72}
      viewBox="0 0 200 144"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M96 60C74 22 34 16 20 34 4 54 22 84 62 74c14-3 24-8 34-14Z"
        fill="var(--rose)"
        stroke="var(--chocolate)"
        strokeWidth="2.2"
      />
      <path
        d="M104 60c22-38 62-44 76-26 16 20-2 50-42 40-14-3-24-8-34-14Z"
        fill="var(--rose)"
        stroke="var(--chocolate)"
        strokeWidth="2.2"
      />
      <path
        d="M92 66c-14 22-24 46-30 72 16-10 28-24 38-40Z"
        fill="var(--blush)"
        stroke="var(--chocolate)"
        strokeWidth="2"
      />
      <path
        d="M108 66c14 22 24 46 30 72-16-10-28-24-38-40Z"
        fill="var(--blush)"
        stroke="var(--chocolate)"
        strokeWidth="2"
      />
      <ellipse
        cx="100"
        cy="63"
        rx="16"
        ry="14"
        fill="var(--cherry)"
        stroke="var(--chocolate)"
        strokeWidth="2.2"
      />
      <path d="M60 44c10-6 22-8 30-4" stroke="var(--cream)" strokeWidth="2" opacity=".7" />
      <path d="M140 44c-10-6-22-8-30-4" stroke="var(--cream)" strokeWidth="2" opacity=".7" />
    </svg>
  );
}

export function Sparkle({ className, size = 18 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={cn("twinkle", className)}
    >
      <path d="M12 0c1.4 7.2 3.4 9.4 12 12-8.6 2.6-10.6 4.8-12 12-1.4-7.2-3.4-9.4-12-12C8.6 9.4 10.6 7.2 12 0Z" fill="var(--gold)" />
    </svg>
  );
}

export function Pearl({ className, size = 10 }: { className?: string; size?: number }) {
  return (
    <span
      className={cn("inline-block rounded-full", className)}
      style={{
        width: size,
        height: size,
        background:
          "radial-gradient(circle at 32% 28%, #fff, var(--rosebeige) 55%, var(--milk))",
        boxShadow: "0 1px 2px rgba(98,72,63,.35)",
      }}
      aria-hidden="true"
    />
  );
}

export function PearlString({ count = 9, className }: { count?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)} aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <Pearl key={i} size={i % 3 === 0 ? 9 : 6} />
      ))}
    </span>
  );
}

export function Sticker({
  children,
  tone = "blush",
  rotate = -4,
  className,
}: {
  children: ReactNode;
  tone?: "blush" | "sage" | "gold" | "cocoa" | "peach" | "cherry";
  rotate?: number;
  className?: string;
}) {
  const tones: Record<string, { bg: string; fg: string; br: string }> = {
    blush: { bg: "var(--blush)", fg: "var(--chocolate)", br: "var(--cocoa)" },
    sage: { bg: "var(--sage)", fg: "var(--chocolate)", br: "var(--olive)" },
    gold: { bg: "var(--butter)", fg: "var(--chocolate)", br: "var(--gold)" },
    cocoa: { bg: "var(--milk)", fg: "var(--cream)", br: "var(--chocolate)" },
    peach: { bg: "var(--peach)", fg: "var(--chocolate)", br: "var(--cocoa)" },
    cherry: { bg: "var(--cherry)", fg: "var(--cream)", br: "var(--burgundy)" },
  };
  const t = tones[tone] ?? tones["blush"]!;
  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-[0.72rem] tracking-[0.12em] uppercase",
        className,
      )}
      style={{
        background: t.bg,
        color: t.fg,
        border: `1px dashed ${t.br}`,
        borderRadius: "999px",
        transform: `rotate(${rotate}deg)`,
        boxShadow: "0 6px 12px -9px rgba(98,72,63,.8)",
      }}
    >
      {children}
    </span>
  );
}

export function Ribbon({ className }: { className?: string }) {
  return (
    <div
      className={cn("h-px w-full", className)}
      style={{
        background:
          "repeating-linear-gradient(90deg, var(--cocoa) 0 14px, transparent 14px 22px)",
      }}
      aria-hidden="true"
    />
  );
}

export function Rose({ className, size = 46 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className={className}>
      <circle cx="24" cy="20" r="13" fill="var(--blush)" stroke="var(--cocoa)" strokeWidth="1.4" />
      <path
        d="M24 10c5 2 7 6 6 10-1 4-5 6-9 5s-6-5-4-9"
        fill="none"
        stroke="var(--cherry)"
        strokeWidth="1.6"
      />
      <path d="M24 33v11" stroke="var(--olive)" strokeWidth="1.6" />
      <path d="M24 38c-5-4-9-3-10-1 2 3 7 4 10 1Z" fill="var(--sage)" stroke="var(--olive)" strokeWidth="1.2" />
    </svg>
  );
}

export function Stamp({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn("px-3 py-2 text-center", className)}
      style={{
        border: "2px dashed var(--cocoa)",
        background: "var(--parchment)",
        transform: "rotate(6deg)",
      }}
      aria-hidden="true"
    >
      <span className="label-caps" style={{ color: "var(--burgundy)" }}>
        {label}
      </span>
    </div>
  );
}

export function PolaroidFrame({
  src,
  alt = "Birthday memory",
  caption,
  rotate = -3,
  className,
  size = "md",
}: {
  src: string;
  alt?: string;
  caption?: string;
  rotate?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "w-36 p-2 pb-5",
    md: "w-48 p-2.5 pb-6",
    lg: "w-64 p-3 pb-8",
  };

  return (
    <div
      className={cn(
        "paper paper-grain tape relative inline-block transition-transform hover:scale-105 hover:z-20",
        sizeClasses[size],
        className,
      )}
      style={{
        transform: `rotate(${rotate}deg)`,
        borderColor: "var(--parchment)",
        boxShadow: "var(--paper-shadow-lift)",
      }}
    >
      <div className="overflow-hidden rounded-sm bg-chocolate">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      {caption ? (
        <p className="hand mt-2 text-center text-sm font-semibold tracking-wide text-cocoa">
          {caption}
        </p>
      ) : null}
    </div>
  );
}

export function TapeFrame({
  src,
  alt = "Birthday picture",
  rotate = 2,
  className,
}: {
  src: string;
  alt?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("tape relative inline-block overflow-hidden rounded-sm bg-cream p-1.5 shadow-lg", className)}
      style={{
        transform: `rotate(${rotate}deg)`,
        border: "3px solid var(--parchment)",
      }}
    >
      <img src={src} alt={alt} loading="lazy" className="h-28 w-28 object-cover rounded-sm" />
    </div>
  );
}

export function StampFrame({
  src,
  alt = "Stamp photo",
  rotate = -5,
  className,
}: {
  src: string;
  alt?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("deckle relative inline-block bg-parchment p-2 shadow-md", className)}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <img src={src} alt={alt} loading="lazy" className="h-24 w-24 object-cover rounded-sm border border-cocoa/30" />
      <div className="mt-1 text-center font-sans text-[0.55rem] uppercase tracking-widest text-burgundy">
        SUPREETHAA ★ 23
      </div>
    </div>
  );
}

export function PushPin({ className, color = "var(--cherry)" }: { className?: string; color?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("drop-shadow-md", className)}
      aria-hidden="true"
    >
      <path
        d="M12 2C10.34 2 9 3.34 9 5c0 .73.26 1.4.7 1.92L8 14h3v8l1 1 1-1v-8h3l-1.7-7.08C14.74 6.4 15 5.73 15 5c0-1.66-1.34-3-3-3z"
        fill={color}
        stroke="var(--chocolate)"
        strokeWidth="1.2"
      />
      <circle cx="12" cy="4.5" r="1.5" fill="#fff" opacity="0.6" />
    </svg>
  );
}
