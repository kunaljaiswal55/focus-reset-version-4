import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for user stats until Database is integrated in Phase 4
  const stats = {
    streak: 12,
    totalFocusHours: 42.5,
    quadrants: {
      mentally: 82,
      financially: 45,
      socially: 68,
      physically: 91
    },
    activeGoals: 3,
    goalCompletionLevel: 75
  };

  return NextResponse.json({ success: true, stats });
}

export async function PUT(request) {
  try {
    const updates = await request.json();
    
    // In Phase 4, we would update the User model
    // await User.updateStats(userId, updates);

    return NextResponse.json({ 
      success: true, 
      message: "Stats successfully updated",
      updatedFields: Object.keys(updates)
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error updating stats" },
      { status: 500 }
    );
  }
}
