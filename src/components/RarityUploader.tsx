import type { Rarity } from "../types/capsule";
import { ImageUploader } from "./ImageUploader";

interface Props {
  rarity: Rarity;
  label: string;
  urls: string[];
  onFilesSelected: (rarity: Rarity, files: File[]) => void;
  onRemove: (rarity: Rarity, index: number) => void;
}

export function RarityUploader({
  rarity,
  label,
  urls,
  onFilesSelected,
  onRemove,
}: Props) {
  return (
    <div className="upload-card" data-rarity={rarity}>
      <div className="upload-card-header">
        <span className="upload-card-dot" />
        <span className="upload-card-label">{label}</span>
        {urls.length > 0 && (
          <span className="upload-card-count">{urls.length}장</span>
        )}
      </div>

      <ul className="upload-card-thumbs">
        <li className="upload-card-thumb-item">
          <ImageUploader
            onFilesSelected={(files) => onFilesSelected(rarity, files)}
          />
        </li>

        {urls.map((url, i) => (
          <li key={url} className="upload-card-thumb-item">
            <img src={url} alt="" className="upload-card-thumb" />
            <button
              type="button"
              className="upload-card-thumb-remove"
              onClick={() => onRemove(rarity, i)}
              aria-label={`${label} ${i + 1}번째 이미지 삭제`}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
