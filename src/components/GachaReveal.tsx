import { motion } from "framer-motion";
import type { GachaCapsule } from "../types/capsule";

export function GachaReveal({ item }: { item: GachaCapsule }) {
  return (
    <motion.div
      key={item.id}
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <img src={item.imageUrl} alt="gacha result" width={200} />
      <p>{item.rarity}</p>
    </motion.div>
  );
}
