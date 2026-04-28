import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for focus sessions until Database is integrated in Phase 4
  const sessions = [
    { id: 1, duration: 25, target: "Deep Focus", date: new Date().toISOString() }
  ];
  return NextResponse.json({ success: true, sessions });
}

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Validate request data here
    if (!data.duration || !data.target) {
      return NextResponse.json(
        { success: false, message: "Missing duration or target" },
        { status: 400 }
      );
    }

    // In the future: const newSession = await FocusSession.create(data);
    
    return NextResponse.json({ 
      success: true, 
      message: "Focus session successfully logged",
      data: {
        id: Math.floor(Math.random() * 1000),
        ...data,
        createdAt: new Date().toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error logging session" },
      { status: 500 }
    );
  }
}
