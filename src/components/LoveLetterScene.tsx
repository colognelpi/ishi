import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MailOpen } from 'lucide-react';
import { PERSONALIZATION } from '../config/personalization';
import { soundEngine } from '../utils/soundFx';
import { PixelHeart } from './PixelArt';

export function LoveLetterScene({
  onBackToArcade,
}: {
  onBackToArcade: () => void;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenEnvelope = () => {
    soundEngine.playEnvelopeOpen();
    setIsOpen(true);
  };

  return (
    <section className="relative z-10 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6 py-14">
      {!isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full text-center"
        >
          <p className="font-mono text-xs text-[#93C5FD] tracking-wider uppercase mb-3">
            A Final Keepsake
          </p>
          <h2 className="font-display text-3xl text-white mb-8">
            For {PERSONALIZATION.recipientName}
          </h2>

          {/* Sealed Blue Envelope */}
          <div className="relative mx-auto max-w-sm rounded-2xl bg-gradient-to-b from-[#DBEAFE] to-[#BFDBFE] p-8 pt-16 pb-10 shadow-[0_24px_60px_rgba(6,14,31,0.65)] border border-white/70">
            {/* Envelope top flap illusion */}
            <div
              className="absolute inset-x-0 top-0 h-20 bg-[#EFF6FF] border-b border-[#93C5FD]/50 rounded-t-2xl"
              style={{
                clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#0F2342] flex items-center justify-center shadow-lg mb-5 animate-heartbeat-soft">
                <PixelHeart size={32} color="#60B5FF" highlight="#FFFFFF" />
              </div>

              <p className="font-display italic text-lg text-[#0F2342] mb-6">
                Sealed with a little piece of my heart
              </p>

              <button
                type="button"
                onClick={handleOpenEnvelope}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#0F2342] text-white text-sm font-semibold hover:bg-[#1E3A8A] transition-colors cursor-pointer shadow-lg whitespace-nowrap"
              >
                <MailOpen className="w-4 h-4" />
                <span>Open Envelope</span>
              </button>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative max-w-2xl w-full"
        >
          {/* Gentle rising floating pixel hearts */}
          <div
            className="pointer-events-none fixed inset-0 overflow-hidden z-0"
            aria-hidden="true"
          >
            {[12, 28, 72, 88].map((leftPct, idx) => (
              <div
                key={leftPct}
                className="absolute bottom-12 animate-rise-heart"
                style={{
                  left: `${leftPct}%`,
                  animationDelay: `${idx * 350}ms`,
                  animationIterationCount: 'infinite',
                }}
              >
                <PixelHeart size={20} color="#93C5FD" highlight="#FFFFFF" />
              </div>
            ))}
          </div>

          <article className="relative z-10 letter-paper-texture rounded-2xl p-8 sm:p-12 md:p-14 shadow-[0_28px_80px_rgba(6,14,31,0.7)] border border-white/80 text-[#0F2342]">
            <div className="flex items-center justify-between border-b border-[#93C5FD]/40 pb-4 mb-8">
              <span className="font-mono text-xs text-[#2563EB] tracking-wider uppercase">
                {PERSONALIZATION.copy.loveLetterTitle}
              </span>
              <PixelHeart size={22} color="#3B82F6" highlight="#EFF6FF" />
            </div>

            <div className="font-display italic text-lg sm:text-xl leading-[1.85] text-[#0F2342] whitespace-pre-line">
              {PERSONALIZATION.copy.loveLetterBody}
            </div>

            <div className="mt-9 pt-6 border-t border-[#93C5FD]/30 flex flex-wrap items-center justify-between gap-4">
              <p className="font-display italic text-xl sm:text-2xl font-medium text-[#1E3A8A]">
                {PERSONALIZATION.copy.loveLetterSignature}
              </p>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  onBackToArcade();
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#DBEAFE] text-[#0F2342] text-xs font-semibold hover:bg-[#BFDBFE] transition-colors cursor-pointer whitespace-nowrap"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Arcade</span>
              </button>
            </div>
          </article>
        </motion.div>
      )}
    </section>
  );
}
