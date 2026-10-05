import confetti from "canvas-confetti";
import type { Rarity } from "../types/capsule";

const COLORS: Record<Rarity, string[]> = {
  common: ["#6fa8dc", "#ffffff", "#b7d3ee"],
  rare: ["#b388ff", "#ffffff", "#d9c7ff"],
  legendary: ["#ffc145", "#fff3b0", "#ff9f1c", "#ffffff"],
};

export function fireConfetti(rarity: Rarity) {
  const colors = COLORS[rarity];
  const base = { colors, disableForReducedMotion: true };

  if (rarity === "common") {
    confetti({ ...base, particleCount: 40, spread: 60, origin: { y: 0.6 } });
    return;
  }

  if (rarity === "rare") {
    confetti({ ...base, particleCount: 90, spread: 80, origin: { y: 0.6 } });
    return;
  }

  const end = Date.now() + 900;
  (function frame() {
    confetti({
      ...base,
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.7 },
    });
    confetti({
      ...base,
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.7 },
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();

  confetti({
    ...base,
    particleCount: 120,
    spread: 100,
    origin: { y: 0.55 },
    shapes: ["star"],
    scalar: 1.2,
  });
}
