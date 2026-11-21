import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PERSONALIZATION } from '../config/personalization';
import { PixelHeart } from './PixelArt';

export function OpeningScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full flex flex-col items-center"
      >
        <div className="relative mb-8 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-[#60B5FF]/30 blur-2xl scale-150"
            aria-hidden="true"
          />
          <div className="relative animate-heartbeat-soft drop-shadow-[0_10px_28px_rgba(96,181,255,0.45)]">
            <PixelHeart
              size={112}
              color="#60B5FF"
              highlight="#FFFFFF"
              outline="#0F2342"
            />
          </div>
        </div>

        <p className="font-mono text-xs tracking-[0.18em] text-[#93C5FD] mb-4 uppercase">
          For {PERSONALIZATION.recipientName} · From {PERSONALIZATION.creatorName}
        </p>

        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-5">
          {PERSONALIZATION.websiteTitle}
        </h1>

        <p className="text-base sm:text-lg text-[#DBEAFE]/90 max-w-md leading-relaxed mb-10">
          {PERSONALIZATION.copy.openingSubtitle}
        </p>

        <button
          type="button"
          onClick={onStart}
          className="group inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-[#60B5FF] text-[#081428] font-semibold text-base shadow-[0_0_32px_rgba(96,181,255,0.45)] hover:bg-[#93C5FD] hover:shadow-[0_0_40px_rgba(147,197,253,0.65)] active:scale-[0.98] transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white whitespace-nowrap"
        >
          <span>Start</span>
          <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
        </button>

        <p className="mt-6 text-xs text-[#93C5FD]/65">
          Sound &amp; gentle arcade chimes turn on when you press Start
        </p>
      </motion.div>
    </section>
  );
}
