import React from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  PERSONALIZATION,
  type MemoryPhotoItem,
} from '../config/personalization';
import { soundEngine } from '../utils/soundFx';
import { KeepsakeArtwork, PixelHeart } from './PixelArt';

const POLAROID_TILTS = [
  '-rotate-1',
  'rotate-1',
  '-rotate-2',
  'rotate-1',
  'rotate-2',
  '-rotate-1',
  'rotate-1',
  '-rotate-2',
  'rotate-1',
  '-rotate-1',
];

export function OurLittleGallery({
  onContinue,
}: {
  onContinue: () => void;
}) {
  const photos = PERSONALIZATION.galleryPhotos;
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);
  const [spotlightIndex, setSpotlightIndex] = React.useState(0);
  const [heartBurstKey, setHeartBurstKey] = React.useState(0);

  const openLightbox = (index: number) => {
    soundEngine.playClick();
    setActiveIndex(index);
    setSpotlightIndex(index);
    setHeartBurstKey((k) => k + 1);
  };

  const closeLightbox = () => {
    soundEngine.playClick();
    setActiveIndex(null);
  };

  const showPrev = React.useCallback(() => {
    soundEngine.playCardFlip();
    setHeartBurstKey((k) => k + 1);
    setActiveIndex((prev) =>
      prev === null ? 0 : (prev - 1 + photos.length) % photos.length
    );
  }, [photos.length]);

  const showNext = React.useCallback(() => {
    soundEngine.playCardFlip();
    setHeartBurstKey((k) => k + 1);
    setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % photos.length));
  }, [photos.length]);

  React.useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, showPrev, showNext]);

  const renderSlotVisual = (
    item: MemoryPhotoItem,
    mode: 'natural' | 'spotlight' | 'lightbox'
  ) => {
    if (item.imageUrl) {
      const sizeClass =
        mode === 'natural'
          ? 'w-full h-auto block transition-transform duration-500 group-hover:scale-[1.03]'
          : mode === 'spotlight'
            ? 'max-w-full max-h-full w-auto h-auto object-contain block transition-transform duration-500 group-hover:scale-[1.03]'
            : 'max-w-full max-h-[68vh] w-auto h-auto object-contain block';

      return (
        <img
          src={item.imageUrl}
          alt={item.caption}
          referrerPolicy="no-referrer"
          className={sizeClass}
        />
      );
    }
    return (
      <KeepsakeArtwork variant={item.keepsakeArt || 'late-call'} />
    );
  };

  const spotlightItem = photos[spotlightIndex];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <p className="font-mono text-xs text-[#93C5FD] tracking-wider uppercase mb-1">
          Memory Album · 10 Moments
        </p>
        <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white">
          Our Little Gallery
        </h2>
        <p className="text-sm sm:text-base text-[#DBEAFE]/85 mt-1">
          {PERSONALIZATION.copy.galleryIntro}
        </p>
      </div>

      {/* Featured Slideshow Strip with Next & Previous */}
      <div className="mb-10 rounded-2xl bg-[#0F2342]/75 border border-[#60B5FF]/25 p-5 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] gap-6 items-center">
          <button
            type="button"
            onClick={() => openLightbox(spotlightIndex)}
            className="group relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden bg-[#081428] flex items-center justify-center cursor-pointer text-left"
          >
            {renderSlotVisual(spotlightItem, 'spotlight')}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#060E1F]/80 via-[#060E1F]/25 to-transparent p-4 flex items-end justify-between">
              <span className="text-xs text-[#DBEAFE]/90 font-mono">
                Click to enlarge
              </span>
              <span className="text-xs text-[#93C5FD] font-mono tabular-nums">
                {spotlightIndex + 1} / {photos.length}
              </span>
            </div>
          </button>

          <div className="flex flex-col justify-between gap-5">
            <div>
              <p className="font-mono text-xs text-[#93C5FD] mb-2">
                {spotlightItem.dateLabel}
              </p>
              <p className="font-display italic text-2xl sm:text-3xl text-white leading-snug">
                “{spotlightItem.caption}”
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  soundEngine.playCardFlip();
                  setSpotlightIndex(
                    (i) => (i - 1 + photos.length) % photos.length
                  );
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081428] border border-[#93C5FD]/25 text-xs font-medium text-[#DBEAFE] hover:bg-[#17335E] transition-colors cursor-pointer whitespace-nowrap"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  soundEngine.playCardFlip();
                  setSpotlightIndex((i) => (i + 1) % photos.length);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#081428] border border-[#93C5FD]/25 text-xs font-medium text-[#DBEAFE] hover:bg-[#17335E] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrapbook Polaroid Grid (10 Moments, Original Aspect Ratio Preserved) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 items-start mb-10">
        {photos.map((item, idx) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4, rotate: 0 }}
            transition={{ duration: 0.2 }}
            className={`group rounded-xl bg-[#F8FBFF] p-3.5 pb-5 shadow-[0_14px_34px_rgba(6,14,31,0.45)] transition-transform ${
              POLAROID_TILTS[idx % POLAROID_TILTS.length]
            }`}
          >
            <div className="relative w-full rounded-lg overflow-hidden bg-[#DBEAFE] mb-3.5">
              <button
                type="button"
                onClick={() => openLightbox(idx)}
                className="w-full block cursor-pointer focus-visible:outline-2 focus-visible:outline-[#2563EB]"
                aria-label={`Open ${item.caption}`}
              >
                {renderSlotVisual(item, 'natural')}
              </button>
            </div>

            <div className="px-1">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#3B82F6] mb-1">
                <span>{item.dateLabel}</span>
                <span>{String(idx + 1).padStart(2, '0')} / 10</span>
              </div>

              <p className="font-display italic text-base text-[#0F2342] leading-snug">
                {item.caption}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Continue to Confession CTA */}
      <div className="rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/30 p-7 text-center">
        <p className="text-sm text-[#DBEAFE]/85 mb-4">
          When you’re done looking through our little gallery, there’s one more place I want to show you.
        </p>
        <button
          type="button"
          onClick={() => {
            soundEngine.playClick();
            onContinue();
          }}
          className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#60B5FF] text-[#081428] font-semibold text-sm hover:bg-[#93C5FD] shadow-[0_0_24px_rgba(96,181,255,0.4)] transition-all cursor-pointer whitespace-nowrap"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Enlarged Polaroid Lightbox with Floating Hearts */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-[#050D1C]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Enlarged memory photo"
        >
          {/* Floating pixel hearts burst on open / slide */}
          <div
            key={heartBurstKey}
            className="pointer-events-none fixed inset-0 overflow-hidden z-10"
            aria-hidden="true"
          >
            {[15, 32, 50, 68, 84].map((leftPct, i) => (
              <div
                key={leftPct}
                className="absolute bottom-[18%] animate-rise-heart"
                style={{
                  left: `${leftPct}%`,
                  animationDelay: `${i * 140}ms`,
                }}
              >
                <PixelHeart
                  size={24 + (i % 2) * 8}
                  color={i % 2 === 0 ? '#60B5FF' : '#DBEAFE'}
                  highlight="#FFFFFF"
                />
              </div>
            ))}
          </div>

          <div className="relative z-20 max-w-2xl w-full rounded-2xl bg-[#F8FBFF] p-4 sm:p-6 shadow-2xl">
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-[#0F2342]/15 text-[#0F2342] hover:bg-[#0F2342]/25 flex items-center justify-center cursor-pointer transition-colors backdrop-blur-xs"
              aria-label="Close photo"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-full max-h-[68vh] rounded-xl overflow-hidden bg-[#081428] mb-4 flex items-center justify-center">
              {renderSlotVisual(photos[activeIndex], 'lightbox')}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-[#3B82F6] mb-1">
                  {photos[activeIndex].dateLabel} · {activeIndex + 1} of{' '}
                  {photos.length}
                </p>
                <p className="font-display italic text-xl text-[#0F2342]">
                  {photos[activeIndex].caption}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={showPrev}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#0F2342] text-white text-xs font-medium hover:bg-[#1E3A8A] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  className="inline-flex items-center gap-1 px-4 py-2.5 rounded-xl bg-[#0F2342] text-white text-xs font-medium hover:bg-[#1E3A8A] transition-colors cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
