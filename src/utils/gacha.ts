import type { GachaCapsule, Rarity } from "../types/capsule";

const WEIGHTS: Record<Rarity, number> = {
  common: 70,
  rare: 25,
  legendary: 5,
};

export function drawGacha(items: GachaCapsule[]): GachaCapsule {
  const weighted = items.flatMap((item) =>
    Array(WEIGHTS[item.rarity]).fill(item)
  );
  const index = Math.floor(Math.random() * weighted.length);
  return weighted[index];
}
