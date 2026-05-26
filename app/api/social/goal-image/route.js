import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";
  
  try {
    const res = await fetch(`https://loremflickr.com/800/600/${encodeURIComponent(query)}`, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
      }
    });
    if (res.ok && res.url) {
      return NextResponse.json({ url: res.url });
    }
  } catch (error) {
    console.error("Error fetching goal image:", error);
  }

  return NextResponse.json({
    url: `https://loremflickr.com/800/600/${encodeURIComponent(query)}`
  });
}
