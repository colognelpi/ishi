import React from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowRight,
  Check,
  Gamepad2,
  Heart,
  Images,
  Sparkles,
} from 'lucide-react';
import { PERSONALIZATION } from './config/personalization';
import { testSupabaseConnection } from './lib/supabase';
import { recordInvitationOpen } from './services/confessionService';
import { soundEngine } from './utils/soundFx';
import { AdminDashboard } from './components/AdminDashboard';
import { CatchMyHeartGame } from './components/CatchMyHeartGame';
import { ConfessionScene } from './components/ConfessionScene';
import { DreamyBackdrop } from './components/DreamyBackdrop';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoveLetterScene } from './components/LoveLetterScene';
import { MemoryLaneGame } from './components/MemoryLaneGame';
import { OpeningScreen } from './components/OpeningScreen';
import { OurLittleGallery } from './components/OurLittleGallery';
import { PixelCharacter, PixelHeart } from './components/PixelArt';

type JourneyStage =
  | 'OPENING'
  | 'ARCADE_HUB'
  | 'CATCH_HEART'
  | 'MEMORY_LANE'
  | 'GALLERY'
  | 'CONFESSION'
  | 'LOVE_LETTER';

function useRoutePath(): string {
  const [pathname, setPathname] = React.useState(() => window.location.pathname);

  React.useEffect(() => {
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return pathname;
}

function RecipientExperience() {
  const [stage, setStage] = React.useState<JourneyStage>('OPENING');
  const [hasStartedMusic, setHasStartedMusic] = React.useState(false);
  const youtubeIframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const [completedStages, setCompletedStages] = React.useState<{
    catchHeart: boolean;
    memoryLane: boolean;
    gallery: boolean;
  }>({
    catchHeart: false,
    memoryLane: false,
    gallery: false,
  });

  React.useEffect(() => {
    testSupabaseConnection();
  }, []);

  const navigateStage = (next: JourneyStage) => {
    setStage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartJourney = () => {
    soundEngine.playClick();
    setHasStartedMusic(true);
    recordInvitationOpen(
      PERSONALIZATION.invitationId,
      PERSONALIZATION.recipientName
    );
    navigateStage('ARCADE_HUB');
  };

  const isInnerArcadeStage =
    stage === 'ARCADE_HUB' ||
    stage === 'CATCH_HEART' ||
    stage === 'MEMORY_LANE' ||
    stage === 'GALLERY';

  const navItems: { id: JourneyStage; label: string }[] = [
    { id: 'ARCADE_HUB', label: 'Arcade Room' },
    { id: 'CATCH_HEART', label: 'Catch Hearts' },
    { id: 'MEMORY_LANE', label: 'Memory Lane' },
    { id: 'GALLERY', label: 'Gallery' },
  ];

  return (
    <div className="relative min-h-screen text-white pb-20">
      <DreamyBackdrop
        intensity={stage === 'CONFESSION' || stage === 'LOVE_LETTER' ? 'deep' : 'normal'}
      />

      {/* Clean 3-Zone Top Bar for Arcade Exploration Stages (Never shows /admin!) */}
      {isInnerArcadeStage && (
        <header className="relative z-20 max-w-6xl mx-auto px-5 sm:px-8 py-5 flex items-center justify-between gap-6 border-b border-[#93C5FD]/15">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              navigateStage('ARCADE_HUB');
            }}
            className="font-display text-lg font-semibold text-white whitespace-nowrap shrink-0 cursor-pointer hover:text-[#93C5FD] transition-colors"
          >
            {PERSONALIZATION.websiteTitle}
          </button>

          <nav
            className="hidden md:flex items-center gap-6 text-sm font-medium text-[#DBEAFE]/80"
            aria-label="Arcade stages"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundEngine.playClick();
                  if (stage === 'GALLERY') {
                    setCompletedStages((s) => ({ ...s, gallery: true }));
                  }
                  navigateStage(item.id);
                }}
                className={`whitespace-nowrap shrink-0 transition-colors cursor-pointer pb-0.5 ${
                  stage === item.id
                    ? 'text-white border-b-2 border-[#60B5FF]'
                    : 'hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              navigateStage('CONFESSION');
            }}
            className="px-4 py-2 rounded-xl bg-[#60B5FF] text-[#081428] text-xs font-semibold hover:bg-[#93C5FD] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Final Note
          </button>
        </header>
      )}

      {/* Stage Content with Smooth Transitions */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {stage === 'OPENING' && (
            <motion.div
              key="OPENING"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
            >
              <OpeningScreen onStart={handleStartJourney} />
            </motion.div>
          )}

          {stage === 'ARCADE_HUB' && (
            <motion.section
              key="ARCADE_HUB"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="max-w-5xl mx-auto px-5 sm:px-8 py-10 sm:py-14"
            >
              {/* Welcome Hero */}
              <div className="rounded-3xl bg-[#0F2342]/78 backdrop-blur-md border border-[#60B5FF]/30 p-7 sm:p-10 mb-9 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="max-w-xl text-center md:text-left">
                  <p className="font-mono text-xs text-[#93C5FD] tracking-wider uppercase mb-2">
                    Player: {PERSONALIZATION.recipientName} · Blue Arcade
                  </p>
                  <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight mb-4">
                    {PERSONALIZATION.copy.arcadeWelcome}
                  </h1>
                  <p className="text-sm sm:text-base text-[#DBEAFE]/85 leading-relaxed mb-6">
                    Play through each little corner I put together for you—catch falling hearts, match our favorite memories, and browse the album before opening the final page.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      soundEngine.playClick();
                      navigateStage('CATCH_HEART');
                    }}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#60B5FF] text-[#081428] font-semibold text-sm hover:bg-[#93C5FD] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <span>Start with Catch My Heart</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex flex-col items-center gap-2 shrink-0">
                  <div className="animate-float-gentle">
                    <PixelCharacter size={104} mood="happy" />
                  </div>
                  <span className="font-mono text-xs text-[#93C5FD]">
                    Made by {PERSONALIZATION.creatorName}
                  </span>
                </div>
              </div>

              {/* Three Playable Arcade Stations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    navigateStage('CATCH_HEART');
                  }}
                  className="group text-left rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/25 hover:border-[#60B5FF] p-6 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Gamepad2 className="w-6 h-6 text-[#60B5FF]" />
                      {completedStages.catchHeart && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-[#93C5FD]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl font-semibold text-white mb-2">
                      01. Catch My Heart
                    </h2>
                    <p className="text-sm text-[#DBEAFE]/80 leading-relaxed mb-5">
                      Catch 10 falling pixel hearts before they drift past the arcade screen.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60B5FF] group-hover:text-white transition-colors">
                    <span>Play Game</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    navigateStage('MEMORY_LANE');
                  }}
                  className="group text-left rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/25 hover:border-[#60B5FF] p-6 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Sparkles className="w-6 h-6 text-[#60B5FF]" />
                      {completedStages.memoryLane && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-[#93C5FD]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl font-semibold text-white mb-2">
                      02. Memory Lane
                    </h2>
                    <p className="text-sm text-[#DBEAFE]/80 leading-relaxed mb-5">
                      Flip and pair all 6 keepsake photographs hidden beneath pixel hearts.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60B5FF] group-hover:text-white transition-colors">
                    <span>Play Memory Game</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    setCompletedStages((s) => ({ ...s, gallery: true }));
                    navigateStage('GALLERY');
                  }}
                  className="group text-left rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/25 hover:border-[#60B5FF] p-6 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Images className="w-6 h-6 text-[#60B5FF]" />
                      {completedStages.gallery && (
                        <span className="inline-flex items-center gap-1 text-xs font-mono text-[#93C5FD]">
                          <Check className="w-3.5 h-3.5" />
                          <span>Visited</span>
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-xl font-semibold text-white mb-2">
                      03. Our Little Gallery
                    </h2>
                    <p className="text-sm text-[#DBEAFE]/80 leading-relaxed mb-5">
                      Ten Polaroid moments, little captions, and floating hearts when opened.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60B5FF] group-hover:text-white transition-colors">
                    <span>Open Gallery</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </button>
              </div>

              {/* Confession Doorway */}
              <div className="mt-8 rounded-2xl bg-[#0B1B38]/85 border border-[#93C5FD]/25 p-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <PixelHeart size={32} color="#60B5FF" highlight="#FFFFFF" />
                  <div>
                    <p className="font-display text-lg text-white">
                      Ready for the final page?
                    </p>
                    <p className="text-xs text-[#DBEAFE]/75">
                      Recommended after playing Catch My Heart, Memory Lane, and browsing Our Little Gallery.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playClick();
                    navigateStage('CONFESSION');
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1E3A8A] border border-[#60B5FF]/40 text-white text-xs font-semibold hover:bg-[#2563EB] transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Heart className="w-3.5 h-3.5" />
                  <span>Open Final Page</span>
                </button>
              </div>
            </motion.section>
          )}

          {stage === 'CATCH_HEART' && (
            <motion.section
              key="CATCH_HEART"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="px-5 sm:px-8 py-8 sm:py-12"
            >
              <CatchMyHeartGame
                alreadyWon={completedStages.catchHeart}
                onWin={() =>
                  setCompletedStages((s) => ({ ...s, catchHeart: true }))
                }
                onContinue={() => navigateStage('MEMORY_LANE')}
              />
            </motion.section>
          )}

          {stage === 'MEMORY_LANE' && (
            <motion.section
              key="MEMORY_LANE"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="px-5 sm:px-8 py-8 sm:py-12"
            >
              <MemoryLaneGame
                alreadyWon={completedStages.memoryLane}
                onWin={() =>
                  setCompletedStages((s) => ({ ...s, memoryLane: true }))
                }
                onContinue={() => {
                  setCompletedStages((s) => ({ ...s, gallery: true }));
                  navigateStage('GALLERY');
                }}
              />
            </motion.section>
          )}

          {stage === 'GALLERY' && (
            <motion.section
              key="GALLERY"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="px-5 sm:px-8 py-8 sm:py-12"
            >
              <OurLittleGallery
                onContinue={() => navigateStage('CONFESSION')}
              />
            </motion.section>
          )}

          {stage === 'CONFESSION' && (
            <motion.div
              key="CONFESSION"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <ConfessionScene
                onOpenLetter={() => navigateStage('LOVE_LETTER')}
              />
            </motion.div>
          )}

          {stage === 'LOVE_LETTER' && (
            <motion.div
              key="LOVE_LETTER"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <LoveLetterScene
                onBackToArcade={() => navigateStage('ARCADE_HUB')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Hidden Continuous YouTube Background Music Embed */}
      {hasStartedMusic && (
        <div
          className="fixed -left-[9999px] -top-[9999px] w-[240px] h-[135px] opacity-0 pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <iframe
            ref={youtubeIframeRef}
            key="youtube-background-music"
            title="Background Music"
            src="https://www.youtube.com/embed/HEAn4FqXFY4?autoplay=1&loop=1&playlist=HEAn4FqXFY4&playsinline=1&enablejsapi=1&rel=0"
            allow="autoplay; encrypted-media"
            tabIndex={-1}
            onLoad={() => {
              youtubeIframeRef.current?.contentWindow?.postMessage(
                JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
                '*'
              );
            }}
            className="w-full h-full border-0"
          />
        </div>
      )}
    </div>
  );
}

export default function App() {
  const pathname = useRoutePath();
  const isAdminRoute =
    pathname === '/admin' || pathname.startsWith('/admin/');

  return (
    <ErrorBoundary>
      {isAdminRoute ? <AdminDashboard /> : <RecipientExperience />}
    </ErrorBoundary>
  );
}
