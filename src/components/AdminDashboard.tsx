import React from 'react';
import type { User } from '@supabase/supabase-js';
import {
  AlertCircle,
  BellRing,
  BookOpen,
  CheckCircle2,
  Clock,
  Eye,
  Heart,
  Loader2,
  LogIn,
  LogOut,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { PERSONALIZATION } from '../config/personalization';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import {
  fetchAdminDashboardData,
  resetInvitationResponse,
  subscribeToAdminRealtime,
  type ConfessionResponseRecord,
  type InvitationOpenRecord,
} from '../services/confessionService';
import { soundEngine } from '../utils/soundFx';
import { DreamyBackdrop } from './DreamyBackdrop';
import { PixelHeart } from './PixelArt';

function formatTimestamp(date: Date | null): string {
  if (!date) return 'Pending timestamp';
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'medium',
  }).format(date);
}

export function AdminDashboard() {
  const [user, setUser] = React.useState<User | null>(null);
  const [authReady, setAuthReady] = React.useState(false);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isSigningIn, setIsSigningIn] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const [responses, setResponses] = React.useState<ConfessionResponseRecord[]>(
    []
  );
  const [opens, setOpens] = React.useState<InvitationOpenRecord[]>([]);
  const [dataLoading, setDataLoading] = React.useState(false);
  const [dataError, setDataError] = React.useState<string | null>(null);
  const [realtimeStatus, setRealtimeStatus] = React.useState<string>('');
  const [newResponseBanner, setNewResponseBanner] = React.useState<
    string | null
  >(null);
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);
  const [showSetupGuide, setShowSetupGuide] = React.useState(false);

  React.useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setAuthReady(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setAuthReady(true);
        setAuthError(null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  React.useEffect(() => {
    if (!user || !supabase) return;

    let isMounted = true;
    setDataLoading(true);
    setDataError(null);

    fetchAdminDashboardData().then((result) => {
      if (!isMounted) return;
      setDataLoading(false);
      if (result.error) {
        setDataError(result.error);
        return;
      }
      setResponses(result.responses);
      setOpens(result.opens);
    });

    const unsubRealtime = subscribeToAdminRealtime({
      onResponseInsert: (record) => {
        setResponses((prev) => {
          if (prev.some((r) => r.id === record.id)) return prev;
          soundEngine.playPairMatch();
          setNewResponseBanner(
            record.answer === 'YES'
              ? 'Someone just said YES! Your little story might be beginning.'
              : 'Your invitation has received a response. They chose NO.'
          );
          return [record, ...prev];
        });
      },
      onResponseDelete: (deletedId) => {
        setResponses((prev) => prev.filter((r) => r.id !== deletedId));
      },
      onOpenInsert: (record) => {
        setOpens((prev) => {
          if (prev.some((o) => o.id === record.id)) return prev;
          return [record, ...prev];
        });
      },
      onOpenDelete: (deletedId) => {
        setOpens((prev) => prev.filter((o) => o.id !== deletedId));
      },
      onStatusChange: (status) => {
        setRealtimeStatus(status);
      },
    });

    return () => {
      isMounted = false;
      unsubRealtime();
    };
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setAuthError(null);
    setIsSigningIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        setAuthError(error.message);
      } else {
        setPassword('');
      }
    } catch {
      setAuthError('Unable to sign in right now. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setResponses([]);
    setOpens([]);
    setNewResponseBanner(null);
  };

  const activeResponse = responses[0] ?? null;

  const handleConfirmReset = async () => {
    if (!activeResponse) return;
    setIsResetting(true);
    setResetError(null);
    const res = await resetInvitationResponse(
      activeResponse.id,
      PERSONALIZATION.invitationId
    );
    setIsResetting(false);
    if (!res.ok) {
      setResetError(res.error);
      return;
    }
    setResponses((prev) => prev.filter((r) => r.id !== activeResponse.id));
    setShowResetConfirm(false);
    setNewResponseBanner(null);
  };

  const invitationOpens = opens.filter(
    (o) => o.invitationId === PERSONALIZATION.invitationId
  );
  const latestOpen = invitationOpens[0] ?? null;

  return (
    <div className="relative min-h-screen text-white">
      <DreamyBackdrop intensity="deep" />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        {/* Top Bar */}
        <header className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#93C5FD]/20">
          <div className="flex items-center gap-3">
            <PixelHeart size={30} color="#60B5FF" highlight="#FFFFFF" />
            <div>
              <h1 className="font-display text-2xl font-semibold text-white">
                Owner Response Dashboard
              </h1>
              <p className="text-xs text-[#93C5FD] font-mono">
                {PERSONALIZATION.creatorName} &rarr;{' '}
                {PERSONALIZATION.recipientName} ·{' '}
                {PERSONALIZATION.invitationId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSetupGuide((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0F2342] border border-[#93C5FD]/25 text-xs font-medium text-[#DBEAFE] hover:bg-[#17335E] transition-colors cursor-pointer whitespace-nowrap"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{showSetupGuide ? 'Hide Setup Guide' : 'Setup Guide'}</span>
            </button>

            {user && (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#081428] border border-[#93C5FD]/25 text-xs font-medium text-[#DBEAFE] hover:bg-[#17335E] transition-colors cursor-pointer whitespace-nowrap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </header>

        {/* Supabase Missing Warning */}
        {!isSupabaseConfigured && (
          <div className="rounded-2xl bg-[#7F1D1D]/40 border border-[#FCA5A5]/40 p-6 mb-8">
            <h2 className="font-display text-xl text-white mb-2">
              Supabase Configuration Required
            </h2>
            <p className="text-sm text-[#FECACA] leading-relaxed">
              <code>VITE_SUPABASE_URL</code> or{' '}
              <code>VITE_SUPABASE_PUBLISHABLE_KEY</code> is missing. Please set
              both environment variables and restart the app.
            </p>
          </div>
        )}

        {/* Loading Auth */}
        {!authReady && (
          <div className="rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/25 p-10 text-center">
            <p className="text-sm text-[#DBEAFE]">Checking session...</p>
          </div>
        )}

        {/* Supabase Auth Sign-In Screen */}
        {authReady && isSupabaseConfigured && !user && (
          <form
            onSubmit={handleSignIn}
            className="max-w-md mx-auto rounded-3xl bg-[#0F2342]/88 backdrop-blur-md border border-[#60B5FF]/35 p-8 sm:p-10 shadow-2xl"
          >
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-2xl bg-[#17335E] border border-[#60B5FF]/40 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-[#60B5FF]" />
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl text-white text-center mb-2">
              Private Owner Access
            </h2>
            <p className="text-sm text-[#DBEAFE]/85 text-center leading-relaxed mb-7">
              Sign in with your Supabase Auth admin account to view live
              confession responses and activity history.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs font-mono text-[#93C5FD] mb-1.5"
                >
                  Admin Email
                </label>
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl bg-[#081428] border border-[#60B5FF]/30 px-4 py-3 text-sm text-white placeholder:text-[#93C5FD]/40 focus:outline-none focus:ring-2 focus:ring-[#60B5FF]"
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs font-mono text-[#93C5FD] mb-1.5"
                >
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full rounded-xl bg-[#081428] border border-[#60B5FF]/30 px-4 py-3 text-sm text-white placeholder:text-[#93C5FD]/40 focus:outline-none focus:ring-2 focus:ring-[#60B5FF]"
                />
              </div>
            </div>

            {authError && (
              <div
                role="alert"
                className="mb-5 rounded-xl bg-[#7F1D1D]/45 border border-[#FCA5A5]/40 p-3 text-xs text-[#FECACA] flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#60B5FF] text-[#081428] font-semibold text-sm hover:bg-[#93C5FD] transition-colors cursor-pointer disabled:opacity-60 whitespace-nowrap"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Authorized Live Dashboard */}
        {authReady && user && (
          <div className="space-y-8">
            {dataError && (
              <div
                role="alert"
                className="rounded-2xl bg-[#7F1D1D]/45 border border-[#FCA5A5]/40 p-5 text-sm text-[#FECACA] flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-white mb-1">
                    Could not load Supabase tables
                  </p>
                  <p className="text-xs leading-relaxed">
                    {dataError} — Run <code>supabase/schema.sql</code> in your
                    Supabase SQL Editor if you have not created{' '}
                    <code>confession_responses</code> and{' '}
                    <code>invitation_opens</code> yet.
                  </p>
                </div>
              </div>
            )}

            {newResponseBanner && (
              <div className="rounded-2xl bg-[#1D4ED8]/45 border border-[#93C5FD]/50 px-5 py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <BellRing className="w-5 h-5 text-[#DBEAFE] shrink-0" />
                  <span className="text-sm font-medium text-white">
                    {newResponseBanner}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setNewResponseBanner(null)}
                  className="text-xs text-[#DBEAFE] hover:text-white underline cursor-pointer whitespace-nowrap"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Primary Status Hero Card */}
            <div className="rounded-3xl bg-[#0F2342]/88 backdrop-blur-md border border-[#60B5FF]/35 p-7 sm:p-9 shadow-2xl">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="font-mono text-xs text-[#93C5FD] uppercase tracking-wider mb-2">
                    Live Confession Status ·{' '}
                    {realtimeStatus === 'SUBSCRIBED'
                      ? 'Realtime Connected'
                      : 'Supabase Sync'}
                  </p>
                  <h2 className="font-display text-2xl sm:text-4xl font-semibold text-white leading-tight mb-3">
                    {dataLoading && 'Loading latest response...'}
                    {!dataLoading &&
                      !activeResponse &&
                      'Still waiting for a little answer...'}
                    {!dataLoading &&
                      activeResponse?.answer === 'YES' &&
                      'Someone just said YES! Your little story might be beginning.'}
                    {!dataLoading &&
                      activeResponse?.answer === 'NO' &&
                      'Your invitation has received a response. They chose NO.'}
                  </h2>
                  <p className="text-sm text-[#DBEAFE]/80">
                    {activeResponse
                      ? `Recorded on ${formatTimestamp(activeResponse.submittedAt)}`
                      : `Listening via Supabase Realtime for ${PERSONALIZATION.recipientName}'s response on ${PERSONALIZATION.invitationId}.`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <PixelHeart
                    size={52}
                    color={
                      activeResponse?.answer === 'YES' ? '#60B5FF' : '#93C5FD'
                    }
                    highlight="#FFFFFF"
                  />
                </div>
              </div>

              {activeResponse && (
                <div className="mt-6 pt-5 border-t border-[#93C5FD]/15 flex flex-wrap items-center justify-between gap-4">
                  <span className="text-xs text-[#93C5FD]/80 font-mono">
                    Status: {activeResponse.status} · Answer:{' '}
                    <strong className="text-white">
                      {activeResponse.answer}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setResetError(null);
                      setShowResetConfirm(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#081428] border border-[#93C5FD]/25 text-xs font-medium text-[#DBEAFE] hover:bg-[#17335E] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Test Submission</span>
                  </button>
                </div>
              )}
            </div>

            {/* 3 Clean Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/25 p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#93C5FD] mb-2">
                  <Eye className="w-4 h-4" />
                  <span>Invitation Opened</span>
                </div>
                <p className="text-2xl font-semibold text-white tabular-nums mb-1">
                  {invitationOpens.length > 0 ? 'Opened' : 'Not Opened Yet'}
                </p>
                <p className="text-xs text-[#DBEAFE]/75 tabular-nums">
                  {latestOpen
                    ? `Latest: ${formatTimestamp(latestOpen.openedAt)} (${invitationOpens.length}x)`
                    : 'Waiting for first visit'}
                </p>
              </div>

              <div className="rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/25 p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#93C5FD] mb-2">
                  <Heart className="w-4 h-4" />
                  <span>Selected Answer</span>
                </div>
                <p className="text-2xl font-semibold text-white tabular-nums mb-1">
                  {activeResponse ? activeResponse.answer : 'Waiting'}
                </p>
                <p className="text-xs text-[#DBEAFE]/75">
                  {activeResponse
                    ? `${responses.length} submission${responses.length === 1 ? '' : 's'} · Latest by ${activeResponse.recipientName}`
                    : 'No submission recorded yet'}
                </p>
              </div>

              <div className="rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/25 p-6">
                <div className="flex items-center gap-2 text-xs font-mono text-[#93C5FD] mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Invitation ID</span>
                </div>
                <p className="text-lg font-mono font-semibold text-white truncate mb-1">
                  {PERSONALIZATION.invitationId}
                </p>
                <p className="text-xs text-[#DBEAFE]/75 tabular-nums">
                  {activeResponse
                    ? formatTimestamp(activeResponse.submittedAt)
                    : 'Awaiting submission'}
                </p>
              </div>
            </div>

            {/* Response History */}
            <div className="rounded-2xl bg-[#0F2342]/80 border border-[#60B5FF]/25 p-6 sm:p-7">
              <h3 className="font-display text-xl text-white mb-4">
                Response &amp; Activity History
              </h3>

              {responses.length === 0 && opens.length === 0 ? (
                <p className="text-sm text-[#DBEAFE]/70">
                  No events recorded in Supabase yet.
                </p>
              ) : (
                <div className="divide-y divide-[#93C5FD]/15">
                  {responses.map((resp) => (
                    <div
                      key={resp.id}
                      className="py-3.5 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#60B5FF] shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-white">
                            Confession Answer: {resp.answer}
                          </p>
                          <p className="text-xs font-mono text-[#93C5FD]/80">
                            {resp.invitationId} · {resp.recipientName} &rarr;{' '}
                            {resp.creatorName}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#DBEAFE]/80">
                        {formatTimestamp(resp.submittedAt)}
                      </span>
                    </div>
                  ))}

                  {opens.map((openEvt) => (
                    <div
                      key={openEvt.id}
                      className="py-3.5 flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <Eye className="w-4 h-4 text-[#93C5FD] shrink-0" />
                        <div>
                          <p className="text-sm text-[#DBEAFE]">
                            Invitation opened by {openEvt.recipientName}
                          </p>
                          <p className="text-xs font-mono text-[#93C5FD]/70">
                            {openEvt.invitationId}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono tabular-nums text-[#DBEAFE]/70">
                        {formatTimestamp(openEvt.openedAt)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Collapsible Setup Guide */}
        {showSetupGuide && (
          <div className="mt-8 rounded-2xl bg-[#0F2342]/92 border border-[#60B5FF]/35 p-6 sm:p-8 space-y-4 text-sm text-[#DBEAFE]/90 leading-relaxed">
            <h3 className="font-display text-2xl text-white">
              Supabase Schema, Auth, RLS &amp; Realtime Reference
            </h3>
            <p>
              Full step-by-step instructions are saved in{' '}
              <code className="text-[#60B5FF]">SUPABASE_SETUP_GUIDE.md</code> and
              the SQL setup script is in{' '}
              <code className="text-[#60B5FF]">supabase/schema.sql</code>.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm">
              <li>
                <strong>Tables &amp; RLS:</strong> Run{' '}
                <code>supabase/schema.sql</code> in Supabase SQL Editor to
                create <code>confession_responses</code> and{' '}
                <code>invitation_opens</code> with insert-only visitor RLS and
                authenticated-only admin reads.
              </li>
              <li>
                <strong>Admin Account:</strong> Create Ishaac&apos;s user in
                Supabase Dashboard &rarr; Authentication &rarr; Users, and disable
                public signups so only your account can access <code>/admin</code>.
              </li>
              <li>
                <strong>Before Sharing with Irish:</strong> Test clicking YES or
                NO, verify it appears live via Realtime here, then click{' '}
                <em>Reset Test Submission</em> before sending her the link.
              </li>
            </ul>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div
            className="fixed inset-0 z-50 bg-[#050D1C]/85 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm test reset"
          >
            <div className="max-w-md w-full rounded-2xl bg-[#0F2342] border border-[#60B5FF]/40 p-6 shadow-2xl">
              <h3 className="font-display text-xl text-white mb-2">
                Reset Test Submission?
              </h3>
              <p className="text-sm text-[#DBEAFE]/85 mb-4 leading-relaxed">
                This deletes the saved test response and open logs for{' '}
                <code className="text-[#60B5FF]">
                  {PERSONALIZATION.invitationId}
                </code>{' '}
                so the invitation returns to waiting status before you share it.
              </p>

              {resetError && (
                <p className="text-xs text-[#FCA5A5] mb-4">{resetError}</p>
              )}

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-xl bg-[#081428] text-xs font-medium text-[#DBEAFE] hover:bg-[#17335E] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isResetting}
                  onClick={handleConfirmReset}
                  className="px-5 py-2 rounded-xl bg-[#60B5FF] text-[#081428] text-xs font-semibold hover:bg-[#93C5FD] cursor-pointer disabled:opacity-60"
                >
                  {isResetting ? 'Resetting...' : 'Yes, Reset'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
