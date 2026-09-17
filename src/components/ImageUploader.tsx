interface Props {
  onFilesSelected: (files: File[]) => void;
}

export function ImageUploader({ onFilesSelected }: Props) {
  return (
    <input
      type="file"
      accept="image/*"
      // multiple
      onChange={(e) => {
        if (e.target.files) {
          onFilesSelected(Array.from(e.target.files));
        }
      }}
    />
  );
}
