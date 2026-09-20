import type { Rarity } from "../types/capsule";
import { ImageUploader } from "./ImageUploader";

interface Props {
  rarity: Rarity;
  label: string;
  urls: string[];
  onFilesSelected: (rarity: Rarity, files: File[]) => void;
}

export function RarityUploader({
  rarity,
  label,
  urls,
  onFilesSelected,
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

      <ImageUploader
        onFilesSelected={(files) => onFilesSelected(rarity, files)}
      />

      {urls.length > 0 && (
        <div className="upload-card-thumbs">
          {urls.slice(0, 4).map((url, i) => (
            <img key={i} src={url} alt="" className="upload-card-thumb" />
          ))}
          {urls.length > 4 && (
            <span className="upload-card-more">+{urls.length - 4}</span>
          )}
        </div>
      )}
    </div>
  );
}
