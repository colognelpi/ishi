import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { PERSONALIZATION } from '../config/personalization';

export type ConfessionAnswer = 'YES' | 'NO';

export interface ConfessionResponseRecord {
  id: string;
  invitationId: string;
  creatorName: string;
  recipientName: string;
  answer: ConfessionAnswer;
  status: 'answered';
  submittedAt: Date | null;
  createdAt: Date | null;
}

export interface InvitationOpenRecord {
  id: string;
  invitationId: string;
  recipientName: string;
  eventType: 'OPENED';
  openedAt: Date | null;
}

function toDateSafe(value: unknown): Date | null {
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
}

function mapResponseRow(row: Record<string, unknown>): ConfessionResponseRecord {
  const createdAt = toDateSafe(row.created_at);
  return {
    id: String(row.id ?? ''),
    invitationId: String(row.invitation_id ?? PERSONALIZATION.invitationId),
    creatorName: String(row.creator_name ?? PERSONALIZATION.creatorName),
    recipientName: String(row.recipient_name ?? PERSONALIZATION.recipientName),
    answer: row.answer === 'NO' ? 'NO' : 'YES',
    status: 'answered',
    submittedAt: toDateSafe(row.submitted_at) ?? createdAt,
    createdAt,
  };
}

function mapOpenRow(row: Record<string, unknown>): InvitationOpenRecord {
  return {
    id: String(row.id ?? ''),
    invitationId: String(row.invitation_id ?? PERSONALIZATION.invitationId),
    recipientName: String(row.recipient_name ?? PERSONALIZATION.recipientName),
    eventType: 'OPENED',
    openedAt: toDateSafe(row.opened_at),
  };
}

export function clearLegacyLocalReceipt(invitationId: string): void {
  try {
    localStorage.removeItem(`alsfy_supabase_receipt_${invitationId}`);
  } catch {
    // Ignore storage unavailability
  }
}

export async function recordInvitationOpen(
  invitationId: string,
  recipientName: string
): Promise<void> {
  // Optional open-event tracking: only logs if the optional invitation_opens table exists
  if (!isSupabaseConfigured || !supabase) return;

  const sessionKey = `alsfy_opened_${invitationId}`;
  try {
    if (sessionStorage.getItem(sessionKey)) {
      return;
    }
  } catch {
    // Proceed if sessionStorage is restricted
  }

  try {
    const { error } = await supabase.from('invitation_opens').insert({
      invitation_id: invitationId.slice(0, 100),
      recipient_name: recipientName.trim().slice(0, 60) || 'Recipient',
      event_type: 'OPENED',
      opened_at: new Date().toISOString(),
    });

    if (!error) {
      try {
        sessionStorage.setItem(sessionKey, '1');
      } catch {
        // Ignore storage errors
      }
    }
  } catch {
    // Non-blocking optional telemetry
  }
}

export async function submitConfessionResponse(params: {
  invitationId: string;
  creatorName: string;
  recipientName: string;
  answer: ConfessionAnswer;
}): Promise<
  | { ok: true; answer: ConfessionAnswer; submittedAtIso: string }
  | { ok: false; error: string }
> {
  const { creatorName, answer } = params;

  if (!isSupabaseConfigured || !supabase) {
    return {
      ok: false,
      error:
        'Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    };
  }

  const cleanCreator = creatorName.trim().slice(0, 60);

  if (!cleanCreator) {
    return {
      ok: false,
      error: 'Creator name is required.',
    };
  }

  const nowIso = new Date().toISOString();

  try {
    // Always INSERT a new record using verified columns: id (default), creator_name, answer, created_at
    const { error } = await supabase.from('confession_responses').insert({
      creator_name: cleanCreator,
      answer,
      created_at: nowIso,
    });

    if (error) {
      if (
        error.code === '23505' ||
        error.message.toLowerCase().includes('duplicate key')
      ) {
        return {
          ok: false,
          error:
            'Your Supabase table currently has a unique constraint blocking multiple responses. Remove the unique constraint on confession_responses to allow repeatable answers.',
        };
      }

      if (error.code === '42501') {
        return {
          ok: false,
          error:
            'Submission blocked by Row Level Security policy. Please verify the insert policy on confession_responses.',
        };
      }

      if (error.code === 'PGRST204') {
        return {
          ok: false,
          error: `Schema cache mismatch: ${error.message}. Run "NOTIFY pgrst, 'reload schema';" in Supabase SQL Editor.`,
        };
      }

      return {
        ok: false,
        error: `Could not save your response: ${error.message}`,
      };
    }

    return { ok: true, answer, submittedAtIso: nowIso };
  } catch {
    return {
      ok: false,
      error:
        'Network error while saving your response. Please check your connection and try again.',
    };
  }
}

export async function fetchConfessionResponses(limit = 50): Promise<{
  responses: ConfessionResponseRecord[];
  error?: string;
}> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      responses: [],
      error:
        'Supabase is not configured yet. Please set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('confession_responses')
      .select('id, creator_name, answer, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      if (error.code === '42501') {
        return {
          responses: [],
          error:
            'Reading previous responses is blocked by Row Level Security. Please allow SELECT on confession_responses in Supabase.',
        };
      }

      return {
        responses: [],
        error: `Could not load previous responses: ${error.message}`,
      };
    }

    const responses = (data ?? []).map((row) =>
      mapResponseRow(row as Record<string, unknown>)
    );

    return { responses };
  } catch {
    return {
      responses: [],
      error:
        'Network error while loading previous responses. Please check your connection and try again.',
    };
  }
}

export async function fetchAdminDashboardData(): Promise<{
  responses: ConfessionResponseRecord[];
  opens: InvitationOpenRecord[];
  error?: string;
}> {
  if (!supabase) {
    return {
      responses: [],
      opens: [],
      error: 'Supabase is not configured.',
    };
  }

  const respRes = await supabase
    .from('confession_responses')
    .select('id, creator_name, answer, created_at')
    .order('created_at', { ascending: false });

  if (respRes.error) {
    return {
      responses: [],
      opens: [],
      error: respRes.error.message,
    };
  }

  const responses = (respRes.data ?? []).map((row) =>
    mapResponseRow(row as Record<string, unknown>)
  );

  let opens: InvitationOpenRecord[] = [];
  const openRes = await supabase
    .from('invitation_opens')
    .select('id, invitation_id, recipient_name, event_type, opened_at')
    .order('opened_at', { ascending: false });

  if (!openRes.error && openRes.data) {
    opens = openRes.data.map((row) =>
      mapOpenRow(row as Record<string, unknown>)
    );
  }

  return { responses, opens };
}

export function subscribeToAdminRealtime(handlers: {
  onResponseInsert: (record: ConfessionResponseRecord) => void;
  onResponseDelete: (deletedId: string) => void;
  onOpenInsert: (record: InvitationOpenRecord) => void;
  onOpenDelete: (deletedId: string) => void;
  onStatusChange?: (status: string) => void;
}): () => void {
  const client = supabase;
  if (!client) return () => {};

  const channel = client
    .channel('admin-confession-realtime')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'confession_responses',
      },
      (payload) => {
        if (payload.new) {
          handlers.onResponseInsert(
            mapResponseRow(payload.new as Record<string, unknown>)
          );
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'confession_responses',
      },
      (payload) => {
        const oldRow = payload.old as Record<string, unknown> | undefined;
        if (oldRow?.id) {
          handlers.onResponseDelete(String(oldRow.id));
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'invitation_opens',
      },
      (payload) => {
        if (payload.new) {
          handlers.onOpenInsert(
            mapOpenRow(payload.new as Record<string, unknown>)
          );
        }
      }
    )
    .on(
      'postgres_changes',
      {
        event: 'DELETE',
        schema: 'public',
        table: 'invitation_opens',
      },
      (payload) => {
        const oldRow = payload.old as Record<string, unknown> | undefined;
        if (oldRow?.id) {
          handlers.onOpenDelete(String(oldRow.id));
        }
      }
    )
    .subscribe((status) => {
      if (handlers.onStatusChange) {
        handlers.onStatusChange(status);
      }
    });

  return () => {
    client.removeChannel(channel);
  };
}

export async function resetInvitationResponse(
  responseId: string,
  invitationId: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!supabase) {
    return { ok: false, error: 'Supabase is not configured.' };
  }

  const { error: respErr } = await supabase
    .from('confession_responses')
    .delete()
    .eq('id', responseId);

  if (respErr) {
    return { ok: false, error: respErr.message };
  }

  clearLegacyLocalReceipt(invitationId);
  return { ok: true };
}
