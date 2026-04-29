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
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = await res.text();

    // Extract ytInitialData JSON from the page
    const match = html.match(/var\s+ytInitialData\s*=\s*({.+?})\s*;\s*<\/script>/s);
    if (!match) {
      return Response.json({ error: "Could not parse playlist page" }, { status: 500 });
    }

    const data = JSON.parse(match[1]);

    // Navigate the JSON structure to find playlist video items
    const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs;
    const tab = tabs?.[0]?.tabRenderer;
    const sectionContents = tab?.content?.sectionListRenderer?.contents;
    const itemSection = sectionContents?.[0]?.itemSectionRenderer?.contents?.[0];
    const playlistRenderer = itemSection?.playlistVideoListRenderer;
    const contents = playlistRenderer?.contents;

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
          thumbnail: v.thumbnail?.thumbnails?.slice(-1)?.[0]?.url || "",
        };
      });

    // Extract playlist title
    const playlistTitle =
      data?.metadata?.playlistMetadataRenderer?.title ||
      data?.header?.playlistHeaderRenderer?.title?.simpleText ||
      "";

    return Response.json({ videos, playlistTitle });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
