export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlistId = searchParams.get("id");

  if (!playlistId) {
    return Response.json({ error: "Missing playlist ID" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const html = await res.text();

    // Try multiple regex patterns to extract ytInitialData
    let data = null;
    const patterns = [
      /var\s+ytInitialData\s*=\s*({.+?})\s*;\s*<\/script>/s,
      /var\s+ytInitialData\s*=\s*({.+?});\s*$/m,
      /window\["ytInitialData"\]\s*=\s*({.+?})\s*;/s,
      /ytInitialData\s*=\s*'({.+?})'/s,
    ];

    for (const pattern of patterns) {
      const match = html.match(pattern);
      if (match) {
        try {
          data = JSON.parse(match[1]);
          break;
        } catch (e) {
          continue;
        }
      }
    }

    if (!data) {
      // Last resort: find any large JSON object containing playlistVideoRenderer
      const bigMatch = html.match(/ytInitialData[^{]*({.*playlistVideoRenderer.*?})\s*;/s);
      if (bigMatch) {
        try { data = JSON.parse(bigMatch[1]); } catch(e) {}
      }
    }

    if (!data) {
      return Response.json({ error: "Could not parse playlist page" }, { status: 500 });
    }

    // Try multiple navigation paths to find video list
    let contents = null;

    // Path 1: Standard two-column layout
    const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs;
    if (tabs) {
      for (const tab of tabs) {
        const sections = tab?.tabRenderer?.content?.sectionListRenderer?.contents;
        if (sections) {
          for (const section of sections) {
            const items = section?.itemSectionRenderer?.contents;
            if (items) {
              for (const item of items) {
                if (item?.playlistVideoListRenderer?.contents) {
                  contents = item.playlistVideoListRenderer.contents;
                  break;
                }
              }
            }
            if (contents) break;
          }
        }
        if (contents) break;
      }
    }

    // Path 2: Direct content path
    if (!contents) {
      contents = data?.contents?.twoColumnBrowseResultsRenderer?.tabs?.[0]
        ?.tabRenderer?.content?.richGridRenderer?.contents;
    }

    // Path 3: Search deeper in the entire data structure
    if (!contents) {
      const jsonStr = JSON.stringify(data);
      const videoIds = [];
      const titleRegex = /"playlistVideoRenderer":\s*\{[^}]*"videoId":\s*"([^"]+)"[^}]*"title":\s*\{[^}]*"runs":\s*\[\s*\{[^}]*"text":\s*"([^"]+)"/g;
      let m;
      while ((m = titleRegex.exec(jsonStr)) !== null) {
        videoIds.push({ videoId: m[1], title: m[2] });
      }

      if (videoIds.length > 0) {
        // Extract playlist title
        let playlistTitle = "";
        const titleMatch = jsonStr.match(/"playlistMetadataRenderer":\s*\{[^}]*"title":\s*"([^"]+)"/);
        if (titleMatch) playlistTitle = titleMatch[1];

        return Response.json({
          videos: videoIds.map((v, i) => ({
            videoId: v.videoId,
            title: v.title.replace(/\\u0026/g, "&").replace(/\\"/g, '"'),
            index: i,
            duration: "",
          })),
          playlistTitle: playlistTitle.replace(/\\u0026/g, "&"),
        });
      }
    }

    // Path 4: Extract videoIds directly from HTML as fallback
    if (!contents) {
      const videoMatches = [...html.matchAll(/\"videoId\":\"([a-zA-Z0-9_-]{11})\"/g)];
      const titleMatches = [...html.matchAll(/\"title\":\{\"runs\":\[\{\"text\":\"((?:[^"\\]|\\.)*)\"}/g)];

      if (videoMatches.length > 0) {
        const seen = new Set();
        const videos = [];
        videoMatches.forEach((m, i) => {
          if (!seen.has(m[1])) {
            seen.add(m[1]);
            videos.push({
              videoId: m[1],
              title: titleMatches[i]
                ? titleMatches[i][1].replace(/\\u0026/g, "&").replace(/\\"/g, '"')
                : `Video ${videos.length + 1}`,
              index: videos.length,
              duration: "",
            });
          }
        });

        let playlistTitle = "";
        const ptMatch = html.match(/<title>(.*?)\s*-\s*YouTube<\/title>/);
        if (ptMatch) playlistTitle = ptMatch[1];

        if (videos.length > 0) {
          return Response.json({ videos, playlistTitle });
        }
      }
    }

    if (!contents || contents.length === 0) {
      return Response.json({ error: "No videos found in playlist" }, { status: 404 });
    }

    const videos = contents
      .filter((c) => c.playlistVideoRenderer)
      .map((c) => {
        const v = c.playlistVideoRenderer;
        return {
          videoId: v.videoId,
          title: v.title?.runs?.[0]?.text || v.title?.simpleText || "Untitled",
          index: parseInt(v.index?.simpleText || "0"),
          duration: v.lengthText?.simpleText || "",
        };
      });

    let playlistTitle =
      data?.metadata?.playlistMetadataRenderer?.title ||
      data?.header?.playlistHeaderRenderer?.title?.simpleText ||
      "";

    return Response.json({ videos, playlistTitle });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
