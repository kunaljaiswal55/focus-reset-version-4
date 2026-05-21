import { NextResponse } from 'next/server';

// Safe DB import — won't crash if MONGODB_URI is not configured
let dbConnect, SocialMetrics;
const isDBConfigured = process.env.MONGODB_URI &&
  !process.env.MONGODB_URI.includes('<username>');

async function loadDB() {
  if (!isDBConfigured) return false;
  try {
    const [dbMod, modelMod] = await Promise.all([
      import('@/lib/mongodb'),
      import('@/models/SocialMetrics'),
    ]);
    dbConnect = dbMod.default;
    SocialMetrics = modelMod.default;
    await dbConnect();
    return true;
  } catch {
    return false;
  }
}

function todayString() {
  return new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
}

// ─── GET /api/social/metrics?date=YYYY-MM-DD ─────────────────────────────────
// Returns the metric snapshot for a given date (defaults to today).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || todayString();

  const dbOk = await loadDB();
  if (!dbOk) {
    // DB not configured — tell the client to use localStorage
    return NextResponse.json({ source: 'localStorage', date });
  }

  try {
    const doc = await SocialMetrics.findOne({ sessionKey: 'default', date });
    if (!doc) {
      return NextResponse.json({
        source: 'db',
        date,
        metrics: { family: 0, friends: 0, parties: 0, outings: 0 },
        activities: [],
      });
    }
    return NextResponse.json({
      source: 'db',
      date,
      metrics: doc.metrics,
      activities: doc.activities,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── POST /api/social/metrics ─────────────────────────────────────────────────
// Upserts today's metric snapshot.
// Body: { metrics: { family, friends, parties, outings } }
export async function POST(request) {
  const body = await request.json();
  const { metrics } = body;
  const date = todayString();

  const dbOk = await loadDB();
  if (!dbOk) {
    // No DB — just confirm we received it (client keeps localStorage)
    return NextResponse.json({ source: 'localStorage', saved: false, date, metrics });
  }

  try {
    const doc = await SocialMetrics.findOneAndUpdate(
      { sessionKey: 'default', date },
      { $set: { metrics } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ source: 'db', saved: true, date, metrics: doc.metrics });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
