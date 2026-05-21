import { NextResponse } from 'next/server';

const isDBConfigured = process.env.MONGODB_URI &&
  !process.env.MONGODB_URI.includes('<username>');

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

// ─── GET /api/social/activities?date=YYYY-MM-DD ───────────────────────────────
// Returns the activity log for a specific day.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const SocialMetrics = await loadDB();
  if (!SocialMetrics) {
    return NextResponse.json({ source: 'localStorage', activities: [] });
  }

  try {
    const doc = await SocialMetrics.findOne({ sessionKey: 'default', date });
    return NextResponse.json({
      source: 'db',
      date,
      activities: doc?.activities || [],
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ─── POST /api/social/activities ──────────────────────────────────────────────
// Appends a new activity log to today's document AND bumps the relevant metric.
// Body: { type, label, duration, notes }
export async function POST(request) {
  const body = await request.json();
  const { type, label, duration = 0, notes = '' } = body;

  if (!type || !label) {
    return NextResponse.json({ error: 'type and label are required' }, { status: 400 });
  }

  const date = new Date().toISOString().split('T')[0];
  const newActivity = { type, label, duration, notes, loggedAt: new Date() };

  // Calculate metric bump: 5 base + 1 per 10 minutes (capped at +20)
  const bump = Math.min(20, 5 + Math.floor(duration / 10));

  const SocialMetrics = await loadDB();
  if (!SocialMetrics) {
    // No DB — return the bump value so client can update localStorage
    return NextResponse.json({
      source: 'localStorage',
      saved: false,
      activity: newActivity,
      bump,
    });
  }

  try {
    const doc = await SocialMetrics.findOneAndUpdate(
      { sessionKey: 'default', date },
      {
        $push: { activities: newActivity },
        $inc: { [`metrics.${type}`]: bump },
        $setOnInsert: { metrics: { family: 0, friends: 0, parties: 0, outings: 0 } },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Cap metrics at 100
    const capped = {};
    let needsCap = false;
    for (const [k, v] of Object.entries(doc.metrics.toObject())) {
      if (v > 100) { capped[`metrics.${k}`] = 100; needsCap = true; }
    }
    if (needsCap) {
      await SocialMetrics.updateOne({ _id: doc._id }, { $set: capped });
    }

    return NextResponse.json({
      source: 'db',
      saved: true,
      activity: newActivity,
      bump,
      metrics: doc.metrics,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
