import { useEffect, useRef } from "react";

interface DummyCapsule {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
}

const RARITY_COLORS = {
  common: "#6fa8dc",
  rare: "#b388ff",
  legendary: "#ffc145",
};

const DUMMY_RADIUS = 20;

const WINDOW_RECT = { x: 24, y: 24, width: 220 - 48, height: 260 * 0.55 };

const DUMMY_CAPSULES: DummyCapsule[] = [
  {
    x: WINDOW_RECT.x + 20,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 20,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.common,
    angle: 0.4,
  },
  {
    x: WINDOW_RECT.x + 58,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 24,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.rare,
    angle: 2.1,
  },
  {
    x: WINDOW_RECT.x + 91,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 20,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.common,
    angle: 4.0,
  },
  {
    x: WINDOW_RECT.x + 126,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 20,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.legendary,
    angle: 5.3,
  },
  {
    x: WINDOW_RECT.x + 152,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 20,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.common,
    angle: 0.4,
  },
  {
    x: WINDOW_RECT.x + 10,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 55,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.legendary,
    angle: 5.1,
  },
  {
    x: WINDOW_RECT.x + 47,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 55,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.legendary,
    angle: 3.0,
  },
  {
    x: WINDOW_RECT.x + 100,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 50,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.rare,
    angle: 3.0,
  },
  {
    x: WINDOW_RECT.x + 152,
    y: WINDOW_RECT.y + WINDOW_RECT.height - 55,
    radius: DUMMY_RADIUS,
    color: RARITY_COLORS.rare,
    angle: 1.2,
  },
];

interface Props {
  isShaking: boolean;
}

export function GachaMachineCanvas({ isShaking }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isShakingRef = useRef(isShaking);

  useEffect(() => {
    isShakingRef.current = isShaking;
  }, [isShaking]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    let frameId: number;

    function drawMachine() {
      if (!ctx) return;
      ctx.fillStyle = "#9cd7d1";
      roundRect(ctx, 4, 4, width - 8, height - 8, 20);
      ctx.fill();

      ctx.fillStyle = "#BADFDB";
      roundRect(
        ctx,
        WINDOW_RECT.x,
        WINDOW_RECT.y,
        WINDOW_RECT.width,
        WINDOW_RECT.height,
        12
      );
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#BADFDB";
      roundRect(ctx, width / 2 - 40, height - 56, 80, 32, 8);
      ctx.fill();
    }

    function drawDummyCapsule(
      capsule: DummyCapsule,
      offsetX: number,
      offsetY: number
    ) {
      if (!ctx) return;
      const x = capsule.x + offsetX;
      const y = capsule.y + offsetY;

      ctx.beginPath();
      ctx.arc(x, y, capsule.radius, 0, Math.PI * 2);
      ctx.fillStyle = capsule.color;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, capsule.radius, capsule.angle, capsule.angle + Math.PI);
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();
    }

    function step(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      drawMachine();

      ctx.save();
      roundRect(
        ctx,
        WINDOW_RECT.x,
        WINDOW_RECT.y,
        WINDOW_RECT.width,
        WINDOW_RECT.height,
        12
      );
      ctx.clip();

      // 흔들리는 동안엔 캡슐마다 살짝 다른 위상으로 들썩이게 함
      DUMMY_CAPSULES.forEach((capsule, i) => {
        let offsetX = 0;
        let offsetY = 0;
        if (isShakingRef.current) {
          const phase = time * 0.03 + i * 1.3;
          offsetX = Math.sin(phase) * 4;
          offsetY = Math.cos(phase * 1.4) * 3;
        }
        drawDummyCapsule(capsule, offsetX, offsetY);
      });

      ctx.restore();

      frameId = requestAnimationFrame(step);
    }

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={260}
      className="machine-canvas"
    />
  );
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}
