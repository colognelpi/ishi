import React from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowRight,
  Heart,
  Loader2,
  RotateCcw,
} from 'lucide-react';
import { PERSONALIZATION } from '../config/personalization';
import {
  clearLegacyLocalReceipt,
  submitConfessionResponse,
  type ConfessionAnswer,
} from '../services/confessionService';
import { soundEngine } from '../utils/soundFx';
import { PixelCharacter, PixelHeart } from './PixelArt';

function formatResponseTimestamp(dateOrIso: Date | string | null): string {
  if (!dateOrIso) return 'Just now';
  const parsed =
    dateOrIso instanceof Date ? dateOrIso : new Date(dateOrIso);
  if (Number.isNaN(parsed.getTime())) return 'Just now';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(parsed);
}

export function ConfessionScene({
  onOpenLetter,
}: {
  onOpenLetter: () => void;
}) {
  // Question State is ALWAYS accessible on load/refresh; latestSubmission only tracks the just-submitted view
  const [latestSubmission, setLatestSubmission] = React.useState<{
    answer: ConfessionAnswer;
    submittedAtIso: string;
  } | null>(null);

  const [submittingAnswer, setSubmittingAnswer] =
    React.useState<ConfessionAnswer | null>(null);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  // Playful NO button state (genuine answer remains selectable!)
  const [dodgeCount, setDodgeCount] = React.useState(0);
  const [noOffset, setNoOffset] = React.useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [teaseMessage, setTeaseMessage] = React.useState<string | null>(null);
  const [showHeartRain, setShowHeartRain] = React.useState(false);

  const MAX_PLAYFUL_DODGES = 3;

  React.useEffect(() => {
    clearLegacyLocalReceipt(PERSONALIZATION.invitationId);
  }, []);

  const fireYesCelebration = React.useCallback(() => {
    setShowHeartRain(true);
    const blueWhite = ['#FFFFFF', '#EFF6FF', '#DBEAFE', '#60B5FF', '#3B82F6'];
    confetti({
      particleCount: 85,
      spread: 75,
      origin: { y: 0.6 },
      colors: blueWhite,
    });
    setTimeout(() => {
      confetti({
        particleCount: 55,
        angle: 60,
        spread: 55,
        origin: { x: 0.15, y: 0.65 },
        colors: blueWhite,
      });
      confetti({
        particleCount: 55,
        angle: 120,
        spread: 55,
        origin: { x: 0.85, y: 0.65 },
        colors: blueWhite,
      });
    }, 280);
  }, []);

  const triggerPlayfulDodge = () => {
    if (dodgeCount >= MAX_PLAYFUL_DODGES || submittingAnswer) return;
    soundEngine.playNoDodge();
    const nextCount = dodgeCount + 1;
    setDodgeCount(nextCount);
    const teases = PERSONALIZATION.noButtonTeases;
    setTeaseMessage(teases[(nextCount - 1) % teases.length]);

    if (nextCount >= MAX_PLAYFUL_DODGES) {
      setNoOffset({ x: 0, y: 0 });
      return;
    }

    const candidates = [
      { x: 90, y: -36 },
      { x: -95, y: -28 },
      { x: 75, y: 34 },
      { x: -80, y: 30 },
    ];
    const pick = candidates[nextCount % candidates.length];
    setNoOffset(pick);
  };

  const handleConfirmChoice = async (answer: ConfessionAnswer) => {
    if (submittingAnswer !== null || latestSubmission !== null) return;

    // On touch devices where hover didn't fire, allow up to 2 playful taps before genuine submission
    if (answer === 'NO' && dodgeCount < 2) {
      triggerPlayfulDodge();
      return;
    }

    soundEngine.playClick();
    setSubmitError(null);
    setSubmittingAnswer(answer);

    const result = await submitConfessionResponse({
      invitationId: PERSONALIZATION.invitationId,
      creatorName: PERSONALIZATION.creatorName,
      recipientName: PERSONALIZATION.recipientName,
      answer,
    });

    setSubmittingAnswer(null);

    if (result.ok) {
      setLatestSubmission({
        answer,
        submittedAtIso: result.submittedAtIso,
      });
      if (answer === 'YES') {
        soundEngine.playYesCelebration();
        fireYesCelebration();
      } else {
        soundEngine.playNoGentle();
      }
      return;
    }

    setSubmitError(result.error);
  };

  const handleAnswerAgain = () => {
    soundEngine.playClick();
    setLatestSubmission(null);
    setSubmitError(null);
    setDodgeCount(0);
    setNoOffset({ x: 0, y: 0 });
    setTeaseMessage(null);
    setShowHeartRain(false);
  };

  // YES Confirmed Screen
  if (latestSubmission?.answer === 'YES') {
    return (
      <section className="relative z-10 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6 py-14 text-center overflow-hidden">
        {showHeartRain && (
          <div
            className="pointer-events-none fixed inset-0 overflow-hidden z-0"
            aria-hidden="true"
          >
            {[8, 20, 34, 48, 62, 76, 89].map((leftPct, i) => (
              <div
                key={leftPct}
                className="absolute bottom-8 animate-rise-heart"
                style={{
                  left: `${leftPct}%`,
                  animationDelay: `${i * 220}ms`,
                  animationIterationCount: 'infinite',
                }}
              >
                <PixelHeart
                  size={22 + (i % 3) * 6}
                  color={i % 2 === 0 ? '#60B5FF' : '#DBEAFE'}
                  highlight="#FFFFFF"
                />
              </div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-2xl w-full rounded-3xl bg-[#0F2342]/85 backdrop-blur-md border border-[#93C5FD]/35 p-8 sm:p-12 shadow-[0_24px_70px_rgba(37,99,235,0.35)]"
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <PixelHeart size={40} color="#93C5FD" highlight="#FFFFFF" />
            <div className="animate-float-gentle">
              <PixelCharacter size={84} mood="celebrating" />
            </div>
            <PixelHeart size={40} color="#60B5FF" highlight="#FFFFFF" />
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight mb-4">
            {PERSONALIZATION.copy.yesConfirmationTitle}
          </h2>

          <p className="text-base sm:text-lg text-[#DBEAFE]/90 leading-relaxed max-w-xl mx-auto mb-4">
            {PERSONALIZATION.copy.yesConfirmationBody}
          </p>

          <p className="text-xs font-mono text-[#93C5FD]/85 mb-8">
            Response saved ·{' '}
            {formatResponseTimestamp(latestSubmission.submittedAtIso)}
          </p>

          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={() => {
                soundEngine.playClick();
                onOpenLetter();
              }}
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#60B5FF] text-[#081428] font-semibold text-base hover:bg-[#93C5FD] shadow-[0_0_28px_rgba(96,181,255,0.45)] transition-all cursor-pointer whitespace-nowrap"
            >
              <span>{PERSONALIZATION.copy.yesNextButton}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={handleAnswerAgain}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#081428]/90 border border-[#93C5FD]/30 text-xs sm:text-sm font-medium text-[#DBEAFE] hover:bg-[#17335E] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Answer Again</span>
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  // NO Confirmed Screen (Gentle & Respectful)
  if (latestSubmission?.answer === 'NO') {
    return (
      <section className="relative z-10 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6 py-14 text-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xl w-full rounded-3xl bg-[#0F2342]/85 backdrop-blur-md border border-[#93C5FD]/25 p-8 sm:p-12 shadow-2xl"
        >
          <div className="flex justify-center mb-6 opacity-90">
            <PixelHeart size={52} color="#93C5FD" highlight="#EFF6FF" />
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-4">
            Thank you, {PERSONALIZATION.recipientName}
          </h2>

          <p className="text-base text-[#DBEAFE]/90 leading-relaxed mb-4">
            {PERSONALIZATION.copy.noConfirmationBody}
          </p>

          <p className="text-xs font-mono text-[#93C5FD]/80 mb-7">
            Response saved ·{' '}
            {formatResponseTimestamp(latestSubmission.submittedAtIso)}
          </p>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAnswerAgain}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#60B5FF] text-[#081428] text-xs sm:text-sm font-semibold hover:bg-[#93C5FD] transition-colors cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Answer Again</span>
            </button>
          </div>
        </motion.div>
      </section>
    );
  }

  // Main Confession Prompt (Always Accessible)
  return (
    <section className="relative z-10 min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-6 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-2xl w-full rounded-3xl bg-[#0F2342]/80 backdrop-blur-md border border-[#60B5FF]/35 p-8 sm:p-12 shadow-[0_24px_80px_rgba(6,14,31,0.75)]"
      >
        <div className="relative flex justify-center mb-7">
          <div
            className="absolute w-32 h-32 rounded-full bg-[#60B5FF]/25 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative animate-heartbeat-soft">
            <PixelHeart
              size={88}
              color="#60B5FF"
              highlight="#FFFFFF"
              outline="#081428"
            />
          </div>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#DBEAFE] mb-3">
          {PERSONALIZATION.copy.confessionIntro}
        </h2>

        <p className="text-sm sm:text-base text-[#93C5FD]/85 mb-8">
          {PERSONALIZATION.copy.confessionSubtitle}
        </p>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight mb-9">
          {PERSONALIZATION.copy.confessionQuestion}
        </h1>

        {teaseMessage && (
          <p className="mb-5 text-sm font-medium text-[#BCE3FF] min-h-[20px]">
            {teaseMessage}
            {dodgeCount >= MAX_PLAYFUL_DODGES && (
              <span className="block text-xs text-[#93C5FD]/75 mt-1">
                (I’ll stay right here — your honest answer matters most.)
              </span>
            )}
          </p>
        )}

        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 min-h-[84px]">
          <button
            type="button"
            disabled={submittingAnswer !== null}
            onClick={() => handleConfirmChoice('YES')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-[#60B5FF] text-[#081428] font-semibold text-sm sm:text-base shadow-[0_0_30px_rgba(96,181,255,0.45)] hover:bg-[#93C5FD] active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            {submittingAnswer === 'YES' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving your answer...</span>
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 fill-current" />
                <span>{PERSONALIZATION.copy.yesButtonLabel}</span>
              </>
            )}
          </button>

          <button
            type="button"
            disabled={submittingAnswer !== null}
            onMouseEnter={triggerPlayfulDodge}
            onClick={() => handleConfirmChoice('NO')}
            style={{
              transform: `translate3d(${noOffset.x}px, ${noOffset.y}px, 0)`,
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-[#081428]/90 border border-[#93C5FD]/30 text-[#DBEAFE] font-medium text-sm sm:text-base hover:bg-[#17335E] transition-transform duration-200 cursor-pointer disabled:opacity-60 whitespace-nowrap"
          >
            {submittingAnswer === 'NO' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>{PERSONALIZATION.copy.noButtonLabel}</span>
            )}
          </button>
        </div>

        {submitError && (
          <div
            role="alert"
            className="mt-6 rounded-xl bg-[#7F1D1D]/40 border border-[#FCA5A5]/40 p-4 text-sm text-[#FECACA] flex items-start gap-2.5 text-left"
          >
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}
      </motion.div>
    </section>
  );
}
