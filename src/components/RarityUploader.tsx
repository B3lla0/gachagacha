import type { Rarity } from "../types/capsule";
import { ImageUploader } from "./ImageUploader";

interface Props {
  rarity: Rarity;
  label: string;
  onFilesSelected: (Rarity: Rarity, files: File[]) => void;
}

export function RarityUploader({ rarity, label, onFilesSelected }: Props) {
  return (
    <div>
      <label>{label}</label>
      <ImageUploader
        onFilesSelected={(files) => onFilesSelected(rarity, files)}
      />
    </div>
  );
}
