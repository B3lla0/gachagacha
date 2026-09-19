import type { GachaCapsule, Rarity } from "../types/capsule";

const WEIGHTS: Record<Rarity, number> = {
  common: 70,
  rare: 25,
  legendary: 5,
};

export function drawGacha(items: GachaCapsule[]): GachaCapsule {
  const totalWeight = items.reduce(
    (sum, item) => sum + WEIGHTS[item.rarity],
    0
  );

  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= WEIGHTS[item.rarity];
    if (random <= 0) {
      return item;
    }
  }

  return items[items.length - 1];
}
