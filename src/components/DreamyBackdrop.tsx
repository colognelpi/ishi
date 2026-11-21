import React from 'react';
import { PixelCloud, PixelHeart } from './PixelArt';

const STAR_POSITIONS = [
  { top: '8%', left: '12%', delay: '0s', size: 3 },
  { top: '14%', left: '78%', delay: '1.1s', size: 4 },
  { top: '24%', left: '28%', delay: '0.6s', size: 3 },
  { top: '18%', left: '54%', delay: '1.8s', size: 2 },
  { top: '34%', left: '88%', delay: '0.4s', size: 3 },
  { top: '42%', left: '9%', delay: '2.1s', size: 4 },
  { top: '58%', left: '82%', delay: '1.4s', size: 3 },
  { top: '67%', left: '16%', delay: '0.9s', size: 2 },
  { top: '76%', left: '66%', delay: '1.9s', size: 4 },
  { top: '85%', left: '34%', delay: '0.3s', size: 3 },
  { top: '29%', left: '68%', delay: '2.4s', size: 2 },
  { top: '51%', left: '46%', delay: '1.6s', size: 3 },
];

export function DreamyBackdrop({
  intensity = 'normal',
}: {
  intensity?: 'normal' | 'deep';
}) {
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Dreamy gradient atmosphere */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          intensity === 'deep'
            ? 'bg-[radial-gradient(ellipse_at_top,_#1D4ED8_0%,_#0F2342_48%,_#060E1F_100%)]'
            : 'bg-[radial-gradient(ellipse_at_top,_#2563EB_0%,_#112A52_52%,_#081428_100%)]'
        }`}
      />

      {/* Soft ambient light pools */}
      <div className="absolute -top-28 left-1/4 w-[420px] h-[420px] rounded-full bg-[#60B5FF]/15 blur-3xl" />
      <div className="absolute bottom-0 right-1/5 w-[380px] h-[380px] rounded-full bg-[#93C5FD]/10 blur-3xl" />

      {/* Subtle pixel grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #DBEAFE 1px, transparent 1px), linear-gradient(to bottom, #DBEAFE 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }}
      />

      {/* Twinkling stars */}
      {STAR_POSITIONS.map((star, idx) => (
        <span
          key={idx}
          className="absolute rounded-xs bg-[#EFF6FF] animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
          }}
        />
      ))}

      {/* Cute drifting pixel clouds */}
      <div className="absolute top-[11%] left-[4%] opacity-20 animate-float-slow">
        <PixelCloud width={118} />
      </div>
      <div
        className="absolute top-[20%] right-[6%] opacity-15 animate-float-slow"
        style={{ animationDelay: '1.8s' }}
      >
        <PixelCloud width={94} />
      </div>
      <div
        className="absolute bottom-[14%] left-[10%] opacity-15 animate-float-slow hidden md:block"
        style={{ animationDelay: '2.6s' }}
      >
        <PixelCloud width={105} />
      </div>

      {/* Floating pixel hearts */}
      <div className="absolute top-[22%] left-[14%] opacity-35 animate-float-gentle">
        <PixelHeart size={22} color="#93C5FD" highlight="#FFFFFF" outline="#1E3A8A" />
      </div>
      <div
        className="absolute top-[36%] right-[12%] opacity-30 animate-float-gentle"
        style={{ animationDelay: '1.3s' }}
      >
        <PixelHeart size={26} color="#60B5FF" highlight="#EFF6FF" outline="#0F2342" />
      </div>
      <div
        className="absolute bottom-[22%] right-[18%] opacity-25 animate-float-gentle hidden sm:block"
        style={{ animationDelay: '2.2s' }}
      >
        <PixelHeart size={20} color="#DBEAFE" highlight="#FFFFFF" outline="#1E3A8A" />
      </div>
      <div
        className="absolute bottom-[28%] left-[8%] opacity-25 animate-float-gentle hidden sm:block"
        style={{ animationDelay: '0.8s' }}
      >
        <PixelHeart size={18} color="#60B5FF" highlight="#FFFFFF" outline="#0F2342" />
      </div>
    </div>
  );
}
