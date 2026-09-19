import { useEffect, useRef } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

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

const BALL_RADIUS = 20;
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
  // 2번째 줄
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

export function GachaMachineCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const balls: Ball[] = [
      {
        x: WINDOW_RECT.x + 40,
        y: WINDOW_RECT.y + 30,
        vx: 1.6,
        vy: 1.1,
        radius: BALL_RADIUS,
        color: RARITY_COLORS.common,
      },
      {
        x: WINDOW_RECT.x + 100,
        y: WINDOW_RECT.y + 60,
        vx: -1.3,
        vy: 1.4,
        radius: BALL_RADIUS,
        color: RARITY_COLORS.rare,
      },
      {
        x: WINDOW_RECT.x + 70,
        y: WINDOW_RECT.y + 90,
        vx: 1.1,
        vy: -1.6,
        radius: BALL_RADIUS,
        color: RARITY_COLORS.legendary,
      },
    ];

    let frameId: number;

    function drawMachine() {
      if (!ctx) return;
      // 기계 본체
      ctx.fillStyle = "#9cd7d1";
      roundRect(ctx, 4, 4, width - 8, height - 8, 20);
      ctx.fill();

      // 유리창
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

      // 캡슐 배출구
      ctx.fillStyle = "#BADFDB";
      roundRect(ctx, width / 2 - 40, height - 56, 80, 32, 8);
      ctx.fill();
    }

    // function drawBall(ball: Ball) {
    //   if (!ctx) return;
    //   ctx.beginPath();
    //   ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    //   ctx.fillStyle = ball.color;
    //   ctx.fill();
    // }

    function drawDummyCapsule(capsule: DummyCapsule) {
      if (!ctx) return;
      // 원래 색으로 전체 채우기
      ctx.beginPath();
      ctx.arc(capsule.x, capsule.y, capsule.radius, 0, Math.PI * 2);
      ctx.fillStyle = capsule.color;
      ctx.fill();

      // 절반만 흰색으로 덮기
      ctx.beginPath();
      ctx.moveTo(capsule.x, capsule.y);
      ctx.arc(
        capsule.x,
        capsule.y,
        capsule.radius,
        capsule.angle,
        capsule.angle + Math.PI
      );
      ctx.closePath();
      ctx.fillStyle = "white";
      ctx.fill();
    }

    function step() {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      drawMachine();

      // 유리창 영역 밖은 그려도 안 보이게 클리핑
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

      // 움직이는 공을 먼저 그림 (위치 갱신 + 벽 충돌 처리 포함)
      //   balls.forEach((ball) => {
      //     ball.x += ball.vx;
      //     ball.y += ball.vy;

      //     if (
      //       ball.x - ball.radius < WINDOW_RECT.x ||
      //       ball.x + ball.radius > WINDOW_RECT.x + WINDOW_RECT.width
      //     ) {
      //       ball.vx *= -1;
      //     }
      //     if (
      //       ball.y - ball.radius < WINDOW_RECT.y ||
      //       ball.y + ball.radius > WINDOW_RECT.y + WINDOW_RECT.height
      //     ) {
      //       ball.vy *= -1;
      //     }

      //     drawBall(ball);
      //   });

      // 바닥에 쌓인 더미 캡슐을 나중에 그려서 위로 보이게 함
      DUMMY_CAPSULES.forEach(drawDummyCapsule);

      ctx.restore(); // 클리핑 해제

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
