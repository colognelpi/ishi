import React from 'react';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';
import { PERSONALIZATION } from '../config/personalization';
import { soundEngine } from '../utils/soundFx';
import { PixelCharacter, PixelHeart } from './PixelArt';

type GamePhase = 'READY' | 'PLAYING' | 'WON';

interface FallingHeart {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  color: string;
  swayOffset: number;
}

interface BurstParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

const TARGET_HEARTS = 10;
const CANVAS_W = 640;
const CANVAS_H = 420;
const PLAYER_W = 68;
const PLAYER_H = 54;

function drawPixelHeartOnCanvas(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  const unit = size / 8;
  const x0 = cx - size / 2;
  const y0 = cy - size / 2;
  // Crisp pixel heart bitmap (8x7)
  const rows = [
    '01100110',
    '11111111',
    '11111111',
    '11111111',
    '01111110',
    '00111100',
    '00011000',
  ];
  ctx.fillStyle = color;
  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      if (rows[r][c] === '1') {
        ctx.fillRect(
          Math.round(x0 + c * unit),
          Math.round(y0 + r * unit),
          Math.ceil(unit),
          Math.ceil(unit)
        );
      }
    }
  }
  // Tiny white shine pixel
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(
    Math.round(x0 + unit),
    Math.round(y0 + unit),
    Math.ceil(unit),
    Math.ceil(unit)
  );
}

function drawCatcherSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) {
  // Basket in front
  ctx.fillStyle = '#DBEAFE';
  ctx.fillRect(x + 8, y + 6, PLAYER_W - 16, 14);
  ctx.fillStyle = '#60B5FF';
  ctx.fillRect(x + 12, y + 10, PLAYER_W - 24, 6);
  // Cute pixel head/hat below basket
  ctx.fillStyle = '#3B82F6';
  ctx.fillRect(x + 18, y + 20, 32, 10);
  ctx.fillStyle = '#FFFDF9';
  ctx.fillRect(x + 20, y + 28, 28, 16);
  // Eyes
  ctx.fillStyle = '#0F2342';
  ctx.fillRect(x + 25, y + 33, 4, 5);
  ctx.fillRect(x + 39, y + 33, 4, 5);
  // Blush
  ctx.fillStyle = '#93C5FD';
  ctx.fillRect(x + 21, y + 38, 4, 3);
  ctx.fillRect(x + 43, y + 38, 4, 3);
  // Sweater
  ctx.fillStyle = '#1D4ED8';
  ctx.fillRect(x + 22, y + 44, 24, 10);
}

export function CatchMyHeartGame({
  alreadyWon,
  onWin,
  onContinue,
}: {
  alreadyWon: boolean;
  onWin: () => void;
  onContinue: () => void;
}) {
  const [phase, setPhase] = React.useState<GamePhase>('READY');
  const [score, setScore] = React.useState(0);

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const playerXRef = React.useRef(CANVAS_W / 2 - PLAYER_W / 2);
  const keysRef = React.useRef<{ left: boolean; right: boolean }>({
    left: false,
    right: false,
  });
  const heartsRef = React.useRef<FallingHeart[]>([]);
  const particlesRef = React.useRef<BurstParticle[]>([]);
  const scoreRef = React.useRef(0);
  const spawnTimerRef = React.useRef(0);
  const nextIdRef = React.useRef(1);
  const phaseRef = React.useRef<GamePhase>('READY');

  const startGame = React.useCallback(() => {
    soundEngine.playClick();
    playerXRef.current = CANVAS_W / 2 - PLAYER_W / 2;
    heartsRef.current = [];
    particlesRef.current = [];
    scoreRef.current = 0;
    spawnTimerRef.current = 0.2;
    setScore(0);
    phaseRef.current = 'PLAYING';
    setPhase('PLAYING');
  }, []);

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = true;
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        keysRef.current.left = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        keysRef.current.right = false;
      }
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);

  React.useEffect(() => {
    if (phase !== 'PLAYING') return;
    let rafId = 0;
    let lastTime = performance.now();

    const colors = ['#60B5FF', '#93C5FD', '#DBEAFE', '#FFFFFF'];

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;

      // Update player position
      const speed = 380;
      if (keysRef.current.left) {
        playerXRef.current -= speed * dt;
      }
      if (keysRef.current.right) {
        playerXRef.current += speed * dt;
      }
      playerXRef.current = Math.max(
        10,
        Math.min(CANVAS_W - PLAYER_W - 10, playerXRef.current)
      );

      // Spawn falling hearts
      spawnTimerRef.current -= dt;
      if (spawnTimerRef.current <= 0) {
        heartsRef.current.push({
          id: nextIdRef.current++,
          x: 34 + Math.random() * (CANVAS_W - 68),
          y: -22,
          speed: 135 + Math.random() * 85,
          size: 26 + Math.random() * 6,
          color: colors[Math.floor(Math.random() * colors.length)],
          swayOffset: Math.random() * Math.PI * 2,
        });
        spawnTimerRef.current = 0.65 + Math.random() * 0.45;
      }

      // Move hearts & check collisions
      const playerY = CANVAS_H - PLAYER_H - 14;
      const nextHearts: FallingHeart[] = [];

      for (const h of heartsRef.current) {
        h.y += h.speed * dt;
        const swayX = h.x + Math.sin(now * 0.004 + h.swayOffset) * 14;

        const caught =
          swayX + h.size * 0.4 >= playerXRef.current + 4 &&
          swayX - h.size * 0.4 <= playerXRef.current + PLAYER_W - 4 &&
          h.y + h.size * 0.4 >= playerY &&
          h.y - h.size * 0.4 <= playerY + 34;

        if (caught) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          soundEngine.playHeartCatch();
          for (let i = 0; i < 10; i++) {
            const angle = (Math.PI * 2 * i) / 10;
            particlesRef.current.push({
              x: swayX,
              y: playerY + 8,
              vx: Math.cos(angle) * (65 + Math.random() * 60),
              vy: Math.sin(angle) * (65 + Math.random() * 60) - 35,
              life: 0.45,
              color: i % 2 === 0 ? '#FFFFFF' : '#93C5FD',
            });
          }

          if (scoreRef.current >= TARGET_HEARTS && phaseRef.current === 'PLAYING') {
            phaseRef.current = 'WON';
            setPhase('WON');
            soundEngine.playGameWin();
            onWin();
            break;
          }
          continue;
        }

        if (h.y < CANVAS_H + 30) {
          nextHearts.push(h);
        }
      }
      heartsRef.current = nextHearts;

      // Update particles
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          life: p.life - dt,
        }))
        .filter((p) => p.life > 0);

      // Draw frame
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (ctx) {
        const grad = ctx.createLinearGradient(0, 0, 0, CANVAS_H);
        grad.addColorStop(0, '#0B1B38');
        grad.addColorStop(1, '#163466');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Subtle pixel stars
        ctx.fillStyle = 'rgba(219, 234, 254, 0.35)';
        for (let i = 0; i < 16; i++) {
          const sx = ((i * 97) % (CANVAS_W - 20)) + 10;
          const sy = ((i * 53) % (CANVAS_H - 90)) + 14;
          ctx.fillRect(sx, sy, 3, 3);
        }

        // Falling hearts
        for (const h of heartsRef.current) {
          const swayX = h.x + Math.sin(now * 0.004 + h.swayOffset) * 14;
          drawPixelHeartOnCanvas(ctx, swayX, h.y, h.size, h.color);
        }

        // Particles
        for (const p of particlesRef.current) {
          ctx.globalAlpha = Math.max(0, p.life / 0.45);
          ctx.fillStyle = p.color;
          ctx.fillRect(Math.round(p.x), Math.round(p.y), 4, 4);
        }
        ctx.globalAlpha = 1;

        // Ground glow
        ctx.fillStyle = 'rgba(96, 181, 255, 0.16)';
        ctx.fillRect(0, CANVAS_H - 14, CANVAS_W, 14);

        // Player sprite
        drawCatcherSprite(ctx, Math.round(playerXRef.current), playerY);
      }

      if (phaseRef.current === 'PLAYING') {
        rafId = requestAnimationFrame(loop);
      }
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [phase, onWin]);

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== 'PLAYING' || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / rect.width) * CANVAS_W;
    playerXRef.current = Math.max(
      10,
      Math.min(CANVAS_W - PLAYER_W - 10, relX - PLAYER_W / 2)
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <p className="font-mono text-xs text-[#93C5FD] tracking-wider uppercase mb-1">
            Mini-Game 01
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Catch My Heart
          </h2>
        </div>

        <div className="flex items-center gap-4 font-mono tabular-nums text-sm text-[#DBEAFE]">
          <span>
            Hearts: <strong className="text-[#60B5FF]">{score}</strong> / {TARGET_HEARTS}
          </span>
          {alreadyWon && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onContinue();
              }}
              className="text-xs font-sans font-semibold text-[#93C5FD] hover:text-white underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              Skip to next
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 rounded-full bg-[#0F2342] border border-[#60B5FF]/25 overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-[#60B5FF] to-[#DBEAFE] transition-all duration-200"
          style={{ width: `${Math.min(100, (score / TARGET_HEARTS) * 100)}%` }}
        />
      </div>

      {/* Arcade Cabinet Viewport */}
      <div className="relative rounded-2xl bg-[#0B1B38] border border-[#60B5FF]/35 shadow-[0_18px_50px_rgba(6,14,31,0.75)] overflow-hidden">
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerMove}
          className="w-full h-auto block touch-none select-none"
        />

        {phase === 'READY' && (
          <div className="absolute inset-0 bg-[#081428]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-4 animate-float-gentle">
              <PixelCharacter size={72} mood="happy" />
            </div>
            <h3 className="font-display text-2xl text-white mb-2">
              Catch {TARGET_HEARTS} Falling Hearts
            </h3>
            <p className="text-sm text-[#DBEAFE]/85 max-w-md mb-6 leading-relaxed">
              Move left or right using your keyboard arrows, finger drag, or the touch buttons below.
            </p>
            <button
              type="button"
              onClick={startGame}
              className="px-7 py-3 rounded-xl bg-[#60B5FF] text-[#081428] font-semibold text-sm hover:bg-[#93C5FD] transition-colors cursor-pointer whitespace-nowrap"
            >
              Start Game
            </button>
          </div>
        )}

        {phase === 'WON' && (
          <div className="absolute inset-0 bg-[#081428]/88 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="flex items-center gap-3 mb-4">
              <PixelHeart size={36} color="#93C5FD" highlight="#FFFFFF" />
              <PixelCharacter size={72} mood="celebrating" />
              <PixelHeart size={36} color="#60B5FF" highlight="#FFFFFF" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-white mb-2">
              {PERSONALIZATION.copy.catchHeartWin}
            </h3>
            <p className="text-sm text-[#DBEAFE]/85 mb-6">
              10 / 10 pixel hearts safely collected.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={startGame}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#0F2342] border border-[#93C5FD]/30 text-[#DBEAFE] text-sm font-medium hover:bg-[#17335E] transition-colors cursor-pointer whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Play Again</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onContinue();
                }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#60B5FF] text-[#081428] text-sm font-semibold hover:bg-[#93C5FD] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Touch-friendly mobile controls */}
      <div className="mt-4 flex items-center justify-between gap-4 sm:hidden">
        <button
          type="button"
          onPointerDown={() => {
            keysRef.current.left = true;
          }}
          onPointerUp={() => {
            keysRef.current.left = false;
          }}
          onPointerLeave={() => {
            keysRef.current.left = false;
          }}
          onPointerCancel={() => {
            keysRef.current.left = false;
          }}
          className="flex-1 min-h-[52px] rounded-xl bg-[#0F2342] border border-[#60B5FF]/35 text-[#EFF6FF] font-semibold flex items-center justify-center gap-2 active:bg-[#1E3A8A] select-none touch-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Move Left</span>
        </button>
        <button
          type="button"
          onPointerDown={() => {
            keysRef.current.right = true;
          }}
          onPointerUp={() => {
            keysRef.current.right = false;
          }}
          onPointerLeave={() => {
            keysRef.current.right = false;
          }}
          onPointerCancel={() => {
            keysRef.current.right = false;
          }}
          className="flex-1 min-h-[52px] rounded-xl bg-[#0F2342] border border-[#60B5FF]/35 text-[#EFF6FF] font-semibold flex items-center justify-center gap-2 active:bg-[#1E3A8A] select-none touch-none"
        >
          <span>Move Right</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      <p className="hidden sm:block mt-3 text-center text-xs text-[#93C5FD]/75">
        Tip: Use Left / Right arrow keys, A / D keys, or drag directly inside the arcade screen.
      </p>
    </div>
  );
}
