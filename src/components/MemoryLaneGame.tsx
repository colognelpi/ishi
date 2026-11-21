import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, RotateCcw } from 'lucide-react';
import {
  PERSONALIZATION,
  type MemoryPhotoItem,
} from '../config/personalization';
import { soundEngine } from '../utils/soundFx';
import { PixelHeart } from './PixelArt';

interface DeckCard {
  uid: string;
  pairId: string;
  imageUrl: string;
  caption: string;
}

function buildShuffledDeck(pairs: MemoryPhotoItem[]): DeckCard[] {
  const doubled: DeckCard[] = pairs.flatMap((pair) => [
    {
      uid: `${pair.id}-a`,
      pairId: pair.id,
      imageUrl: pair.imageUrl,
      caption: pair.caption,
    },
    {
      uid: `${pair.id}-b`,
      pairId: pair.id,
      imageUrl: pair.imageUrl,
      caption: pair.caption,
    },
  ]);

  for (let i = doubled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [doubled[i], doubled[j]] = [doubled[j], doubled[i]];
  }
  return doubled;
}

export function MemoryLaneGame({
  alreadyWon,
  onWin,
  onContinue,
}: {
  alreadyWon: boolean;
  onWin: () => void;
  onContinue: () => void;
}) {
  const pairs = PERSONALIZATION.memoryPairs;
  const [deck, setDeck] = React.useState<DeckCard[]>(() =>
    buildShuffledDeck(pairs)
  );
  const [flippedIndices, setFlippedIndices] = React.useState<number[]>([]);
  const [matchedPairIds, setMatchedPairIds] = React.useState<string[]>([]);
  const [moves, setMoves] = React.useState(0);
  const [isLocked, setIsLocked] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);

  React.useEffect(() => {
    try {
      localStorage.removeItem('alsfy_custom_memory_pairs_v1');
    } catch {
      // Ignore storage unavailability
    }
  }, []);

  const resetGame = React.useCallback(() => {
    soundEngine.playClick();
    setDeck(buildShuffledDeck(pairs));
    setFlippedIndices([]);
    setMatchedPairIds([]);
    setMoves(0);
    setIsLocked(false);
    setIsCompleted(false);
  }, [pairs]);

  const handleCardClick = (index: number) => {
    if (isLocked || isCompleted) return;
    const card = deck[index];
    if (flippedIndices.includes(index) || matchedPairIds.includes(card.pairId)) {
      return;
    }

    soundEngine.playCardFlip();
    const nextFlipped = [...flippedIndices, index];
    setFlippedIndices(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = deck[nextFlipped[0]];
      const secondCard = deck[nextFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        const nextMatched = [...matchedPairIds, firstCard.pairId];
        setMatchedPairIds(nextMatched);
        setFlippedIndices([]);
        soundEngine.playPairMatch();

        if (nextMatched.length === pairs.length) {
          setTimeout(() => {
            setIsCompleted(true);
            soundEngine.playGameWin();
            onWin();
          }, 450);
        }
      } else {
        setIsLocked(true);
        setTimeout(() => {
          setFlippedIndices([]);
          setIsLocked(false);
        }, 760);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <p className="font-mono text-xs text-[#93C5FD] tracking-wider uppercase mb-1">
            Mini-Game 02
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            Memory Lane
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-[#DBEAFE]">
          <span className="font-mono tabular-nums">
            Pairs: <strong className="text-[#60B5FF]">{matchedPairIds.length}</strong> / {pairs.length}
          </span>
          <span aria-hidden="true" className="text-[#60B5FF]/40">
            ·
          </span>
          <span className="font-mono tabular-nums">
            Moves: <strong className="text-white">{moves}</strong>
          </span>

          {alreadyWon && !isCompleted && (
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onContinue();
              }}
              className="text-xs font-semibold text-[#93C5FD] hover:text-white underline underline-offset-4 cursor-pointer whitespace-nowrap"
            >
              Skip to next
            </button>
          )}
        </div>
      </div>

      {/* 12-card Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
        {deck.map((card, index) => {
          const isFlipped =
            flippedIndices.includes(index) ||
            matchedPairIds.includes(card.pairId);
          const isMatched = matchedPairIds.includes(card.pairId);

          return (
            <button
              key={card.uid}
              type="button"
              onClick={() => handleCardClick(index)}
              disabled={isFlipped || isLocked}
              aria-label={
                isFlipped ? card.caption : `Face-down memory card ${index + 1}`
              }
              className="perspective-1000 aspect-[4/4.6] w-full cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60B5FF] disabled:cursor-default"
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 preserve-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >
                {/* Card Back (Pixel Heart) */}
                <div className="absolute inset-0 backface-hidden rounded-2xl bg-gradient-to-br from-[#16366B] to-[#0B1B38] border border-[#60B5FF]/40 shadow-lg flex flex-col items-center justify-center p-3 hover:border-[#93C5FD] transition-colors">
                  <div className="w-full h-full rounded-xl border border-[#93C5FD]/20 flex items-center justify-center">
                    <PixelHeart
                      size={40}
                      color="#60B5FF"
                      highlight="#EFF6FF"
                      outline="#081428"
                    />
                  </div>
                </div>

                {/* Card Front (Memory Photo) */}
                <div
                  className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden bg-[#F8FBFF] p-1.5 sm:p-2 shadow-xl flex flex-col transition-all ${
                    isMatched
                      ? 'ring-2 ring-[#60B5FF] shadow-[0_0_24px_rgba(96,181,255,0.4)]'
                      : ''
                  }`}
                >
                  <div className="relative flex-1 w-full rounded-xl overflow-hidden bg-[#DBEAFE]">
                    <img
                      src={card.imageUrl}
                      alt={card.caption}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="pt-1.5 px-1 text-[10px] sm:text-xs font-display italic text-[#0F2342] truncate text-center">
                    {card.caption}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Completion Card */}
      {isCompleted && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-7 rounded-2xl bg-[#0F2342]/92 border border-[#60B5FF]/40 p-6 sm:p-8 text-center shadow-2xl"
        >
          <div className="flex justify-center mb-3">
            <PixelHeart size={44} color="#60B5FF" highlight="#FFFFFF" />
          </div>
          <h3 className="font-display text-2xl sm:text-3xl text-white mb-2">
            {PERSONALIZATION.copy.memoryLaneWin}
          </h3>
          <p className="text-sm text-[#DBEAFE]/85 mb-6 font-mono tabular-nums">
            Completed in {moves} moves
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={resetGame}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#081428] border border-[#93C5FD]/30 text-[#DBEAFE] text-sm font-medium hover:bg-[#17335E] transition-colors cursor-pointer whitespace-nowrap"
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
              <span>Continue to Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
