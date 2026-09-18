/** Answer matching for the mystery game. Aliases stay hidden from the player. */

export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function isMatch(guess: string, name: string, aliases: string[] = []): boolean {
  const g = normalize(guess);
  if (!g) return false;
  return [name, ...aliases].some((candidate) => normalize(candidate) === g);
}
