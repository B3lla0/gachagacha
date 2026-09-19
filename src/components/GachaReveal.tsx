import { motion } from "framer-motion";
import type { GachaCapsule } from "../types/capsule";

interface Props {
  item: GachaCapsule;
  drawId: number;
}

export function GachaReveal({ item, drawId }: Props) {
  return (
    <motion.div
      key={`${item.id}-${drawId}`}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <img src={item.imageUrl} alt="gacha result" width={200} />
      <p>{item.rarity}</p>
    </motion.div>
  );
}
