import { NextResponse } from 'next/server';

const isDBConfigured =
  process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('<username>');

async function loadDB() {
  if (!isDBConfigured) return false;
  try {
    const [dbMod, modelMod] = await Promise.all([
      import('@/lib/mongodb'),
      import('@/models/SocialMetrics'),
    ]);
    await dbMod.default();
    return modelMod.default;
  } catch {
    return false;
  }
}

// Helper: build the last N date strings (YYYY-MM-DD), oldest first
function lastNDays(n) {
  const days = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  return days;
}

// Helper: human-readable short label for a date string
function dayLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((today - d) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// ─── GET /api/social/history?days=12 ─────────────────────────────────────────
// Returns the last N days of social metric averages.
// Each entry: { date, label, avg, family, friends, parties, outings, hasData }
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(30, parseInt(searchParams.get('days') || '12', 10));
  const dates = lastNDays(days);

  const SocialMetrics = await loadDB();

  // ── No DB: return skeleton so client fills from localStorage ──────────────
  if (!SocialMetrics) {
    return NextResponse.json({
      source: 'localStorage',
      days: dates.map((date) => ({
        date,
        label: dayLabel(date),
        avg: null,
        family: null,
        friends: null,
        parties: null,
        outings: null,
        hasData: false,
      })),
    });
  }

  // ── DB available: fetch all docs in date range ────────────────────────────
  try {
    const docs = await SocialMetrics.find({
      sessionKey: 'default',
      date: { $in: dates },
    }).lean();

    // Index docs by date for O(1) lookup
    const byDate = {};
    docs.forEach((doc) => {
      byDate[doc.date] = doc;
    });

    const result = dates.map((date) => {
      const doc = byDate[date];
      if (!doc) {
        return { date, label: dayLabel(date), avg: null, family: null, friends: null, parties: null, outings: null, hasData: false };
      }
      const { family = 0, friends = 0, parties = 0, outings = 0 } = doc.metrics || {};
      const avg = Math.round((family + friends + parties + outings) / 4);
      return { date, label: dayLabel(date), avg, family, friends, parties, outings, hasData: true };
    });

    return NextResponse.json({ source: 'db', days: result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
