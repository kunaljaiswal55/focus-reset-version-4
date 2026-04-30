export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoId = searchParams.get("id");

  if (!videoId) {
    return Response.json({ error: "Missing video ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await res.text();

    // Try to extract chapters from ytInitialPlayerResponse
    let chapters = [];

    // Method 1: Extract from engagementPanels (structured chapters)
    const playerMatch = html.match(/var\s+ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*var/s);
    if (playerMatch) {
      try {
        const playerData = JSON.parse(playerMatch[1]);
        const panels = playerData?.engagementPanels || [];
        for (const panel of panels) {
          const macroRenderer = panel?.engagementPanelSectionListRenderer?.content?.macroMarkersListRenderer;
          if (macroRenderer?.contents) {
            chapters = macroRenderer.contents
              .filter(c => c.macroMarkersListItemRenderer)
              .map(c => {
                const item = c.macroMarkersListItemRenderer;
                const title = item.title?.simpleText || "";
                const timeStr = item.timeDescription?.simpleText || "";
                // Parse time string like "5:20" or "1:05:30" to seconds
                const parts = timeStr.split(":").map(Number);
                let seconds = 0;
                if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
                else if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
                return { title, time: timeStr, seconds };
              });
            break;
          }
        }
      } catch (e) {
        // JSON parse failed, try method 2
      }
    }

    // Method 2: Parse timestamps from description
    if (chapters.length === 0) {
      const descMatch = html.match(/"shortDescription"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (descMatch) {
        const desc = descMatch[1].replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/\\\\/g, "\\");
        // Match lines like "0:00 Introduction" or "01:23:45 - Topic Name"
        const lines = desc.split("\n");
        for (const line of lines) {
          const m = line.match(/(\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]?\s*(.+)/);
          if (m) {
            const timeStr = m[1].trim();
            const title = m[2].trim();
            const parts = timeStr.split(":").map(Number);
            let seconds = 0;
            if (parts.length === 3) seconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
            else if (parts.length === 2) seconds = parts[0] * 60 + parts[1];
            if (title.length > 0) {
              chapters.push({ title, time: timeStr, seconds });
            }
          }
        }
      }
    }

    return Response.json({ chapters, videoId });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
