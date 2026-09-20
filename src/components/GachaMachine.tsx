import { useState } from "react";
import { drawGacha } from "../utils/gacha";
import type { GachaCapsule, Rarity } from "../types/capsule";
import { RarityUploader } from "./RarityUploader";
import { useObjectUrls } from "../hooks/useObjectUrls";
import { GachaReveal } from "./GachaReveal";
import { GachaMachineCanvas } from "./GachaMachineCanvas";
import "../styles/gacha.css";

const RARITIES: { rarity: Rarity; label: string }[] = [
  { rarity: "common", label: "커먼" },
  { rarity: "rare", label: "레어" },
  { rarity: "legendary", label: "레전더리" },
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

  const handleFiles = (rarity: Rarity, files: File[]) => {
    setFilesByRarity((prev) => ({ ...prev, [rarity]: files }));
  };

  const handleDraw = () => {
    setIsShaking(true);
    setTimeout(() => {
      setResult(drawGacha(items));
      setDrawId((prev) => prev + 1);
      setIsShaking(false);
    }, 600);
  };

  return (
    <div className="machine-page">
      <header className="machine-header">
        <h1 className="machine-title">캡슐 가챠</h1>
        <p className="machine-subtitle">
          이미지를 등급별로 넣고 캡슐을 뽑아보세요
        </p>
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
            <span className="machine-knob-icon">🎲</span>
            돌리기
          </button>
        </section>
      </div>

      {result && <GachaReveal item={result} drawId={drawId} />}
    </div>
  );
}
