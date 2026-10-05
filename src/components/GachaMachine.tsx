import { useRef, useState } from "react";
import { drawGacha } from "../utils/gacha";
import type { GachaCapsule, Rarity } from "../types/capsule";
import { RarityUploader } from "./RarityUploader";
import { useObjectUrls } from "../hooks/useObjectUrls";
import { GachaResultModal } from "./GachaResultModal";
import { GachaMachineCanvas } from "./GachaMachineCanvas";
import "../styles/gacha.css";

const RARITIES: { rarity: Rarity; label: string }[] = [
  { rarity: "common", label: "일반" },
  { rarity: "rare", label: "희귀" },
  { rarity: "legendary", label: "전설" },
];

export function GachaMachine() {
  const [filesByRarity, setFilesByRarity] = useState<Record<Rarity, File[]>>({
    common: [],
    rare: [],
    legendary: [],
  });

  const commonUrls = useObjectUrls(filesByRarity.common);
  const rareUrls = useObjectUrls(filesByRarity.rare);
  const legendaryUrls = useObjectUrls(filesByRarity.legendary);

  const urlsByRarity: Record<Rarity, string[]> = {
    common: commonUrls,
    rare: rareUrls,
    legendary: legendaryUrls,
  };

  const items: GachaCapsule[] = [
    ...commonUrls.map((url, i) => ({
      id: `common-${i}`,
      imageUrl: url,
      rarity: "common" as Rarity,
    })),
    ...rareUrls.map((url, i) => ({
      id: `rare-${i}`,
      imageUrl: url,
      rarity: "rare" as Rarity,
    })),
    ...legendaryUrls.map((url, i) => ({
      id: `legendary-${i}`,
      imageUrl: url,
      rarity: "legendary" as Rarity,
    })),
  ];

  const [result, setResult] = useState<GachaCapsule | null>(null);
  const [drawId, setDrawId] = useState(0);
  const [isShaking, setIsShaking] = useState(false);

  // const handleFiles = (rarity: Rarity, files: File[]) => {
  //   setFilesByRarity((prev) => ({ ...prev, [rarity]: files }));
  // };

  const handleFiles = (rarity: Rarity, files: File[]) => {
    setFilesByRarity((prev) => ({
      ...prev,
      [rarity]: [...prev[rarity], ...files], // 교체가 아니라 뒤에 추가
    }));
  };

  const handleRemove = (rarity: Rarity, index: number) => {
    setFilesByRarity((prev) => ({
      ...prev,
      [rarity]: prev[rarity].filter((_, i) => i !== index),
    }));
  };

  const isDrawingRef = useRef(false);

  const handleDraw = () => {
    if (isDrawingRef.current || items.length === 0) return;
    isDrawingRef.current = true;

    setResult(null);
    setIsShaking(true);

    setTimeout(() => {
      setResult(drawGacha(items));
      setDrawId((prev) => prev + 1);
      setIsShaking(false);
      isDrawingRef.current = false;
    }, 600);
  };

  return (
    <div className="machine-page">
      <header className="machine-header">
        <div className="logo">
          <i></i>
          <h1 className="machine-title">GachaGacha</h1>
        </div>
        <p className="machine-subtitle">
          이미지를 등급별로 넣고 캡슐을 뽑아보세요.
        </p>
        <span>이미지를 여러장 등록할 수 있어요!</span>
      </header>

      <div className="machine-layout">
        <section className="upload-panel">
          {RARITIES.map(({ rarity, label }) => (
            <RarityUploader
              key={rarity}
              rarity={rarity}
              label={label}
              urls={urlsByRarity[rarity]}
              onFilesSelected={handleFiles}
              onRemove={handleRemove}
            />
          ))}
        </section>

        <section className="machine-panel">
          <div
            className={`machine-canvas-wrap rarity-${
              result?.rarity ?? "idle"
            } ${isShaking ? "shaking" : ""}`}
          >
            <GachaMachineCanvas isShaking={isShaking} />
          </div>
          <div className="machine-shadow" />
          <button
            className="machine-knob"
            disabled={items.length === 0}
            onClick={handleDraw}
          >
            뽑기
          </button>
        </section>
      </div>

      <GachaResultModal
        result={result}
        drawId={drawId}
        onClose={() => setResult(null)}
        onRedraw={handleDraw}
      />
    </div>
  );
}
