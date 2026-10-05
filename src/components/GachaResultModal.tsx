import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GachaCapsule } from "../types/capsule";
import { GachaReveal } from "./GachaReveal";

interface Props {
  result: GachaCapsule | null;
  drawId: number;
  onClose: () => void;
}

export function GachaResultModal({ result, drawId, onClose }: Props) {
  useEffect(() => {
    if (!result) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [result, onClose]);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          className="modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label="뽑기 결과"
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
          >
            <button className="modal-close" onClick={onClose} aria-label="닫기">
              ×
            </button>
            <GachaReveal item={result} drawId={drawId} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
