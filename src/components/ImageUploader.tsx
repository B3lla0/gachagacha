interface Props {
  onFilesSelected: (files: File[]) => void;
}

export function ImageUploader({ onFilesSelected }: Props) {
  return (
    <label className="file-input" title="이미지 추가">
      <input
        type="file"
        accept="image/*"
        multiple
        aria-label="이미지 추가"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length > 0) onFilesSelected(files);
        }}
      />
    </label>
  );
}
