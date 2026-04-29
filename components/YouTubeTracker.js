"use client";
import { useState, useEffect, useRef, useCallback } from "react";

function extractPlaylistId(url) {
  const m = url.match(/[?&]list=([a-zA-Z0-9_-]+)/);
  return m ? m[1] : null;
}
function extractVideoId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

export default function YouTubeTracker() {
  const [playlists, setPlaylists] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals
  const [isAddModal, setIsAddModal] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Manual add lecture
  const [isAddLecture, setIsAddLecture] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");

  // Playing
  const [playingLecture, setPlayingLecture] = useState(null);
  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const saveIntervalRef = useRef(null);
  const apiLoadedRef = useRef(false);

  // Load data
  useEffect(() => {
    const saved = localStorage.getItem("yt_playlists");
    if (saved) {
      const parsed = JSON.parse(saved);
      setPlaylists(parsed);
      if (parsed.length > 0) setActivePlaylist(parsed[0].id);
    }
    setIsLoaded(true);
  }, []);

  // Save data
  useEffect(() => {
    if (isLoaded) localStorage.setItem("yt_playlists", JSON.stringify(playlists));
  }, [playlists, isLoaded]);

  // Load YouTube IFrame API
  useEffect(() => {
    if (apiLoadedRef.current) return;
    if (typeof window !== "undefined" && !window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => { apiLoadedRef.current = true; };
    } else if (window.YT) {
      apiLoadedRef.current = true;
    }
  }, []);

  const active = playlists.find(p => p.id === activePlaylist);
  const playingData = active?.lectures.find(l => l.id === playingLecture);

  // Save current time periodically
  const saveCurrentTime = useCallback(() => {
    if (playerRef.current?.getCurrentTime && playingLecture && activePlaylist) {
      const t = Math.floor(playerRef.current.getCurrentTime());
      setPlaylists(prev => prev.map(p =>
        p.id === activePlaylist
          ? { ...p, lectures: p.lectures.map(l => l.id === playingLecture ? { ...l, currentTime: t } : l) }
          : p
      ));
    }
  }, [playingLecture, activePlaylist]);

  // Create/update YouTube player
  useEffect(() => {
    if (!playingData) {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
      if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null; }
      return;
    }

    const initPlayer = () => {
      if (playerRef.current) { playerRef.current.destroy(); playerRef.current = null; }
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);

      playerRef.current = new window.YT.Player("yt-player-embed", {
        videoId: playingData.videoId,
        playerVars: {
          autoplay: 1,
          start: Math.floor(playingData.currentTime || 0),
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (e) => {
            // When playing, start saving interval
            if (e.data === window.YT.PlayerState.PLAYING) {
              if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
              saveIntervalRef.current = setInterval(saveCurrentTime, 5000);
            }
            // When paused or ended, save immediately
            if (e.data === window.YT.PlayerState.PAUSED || e.data === window.YT.PlayerState.ENDED) {
              saveCurrentTime();
              if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
            }
          },
        },
      });
    };

    // Wait for YT API to be ready
    const waitForApi = () => {
      if (window.YT?.Player) {
        initPlayer();
      } else {
        setTimeout(waitForApi, 200);
      }
    };
    waitForApi();

    return () => {
      if (saveIntervalRef.current) clearInterval(saveIntervalRef.current);
    };
  }, [playingLecture, playingData?.videoId]);

  // Add playlist or single video
  const addPlaylist = async () => {
    if (!newTitle.trim() && !newUrl.trim()) return;
    const playlistId = extractPlaylistId(newUrl);
    const videoId = extractVideoId(newUrl);

    let lectures = [];
    let title = newTitle.trim();

    if (playlistId) {
      // Playlist URL — auto-fetch all videos
      setFetchLoading(true);
      setFetchError("");
      try {
        const res = await fetch(`/api/youtube-playlist?id=${playlistId}`);
        const data = await res.json();
        if (data.error) { setFetchError(data.error); setFetchLoading(false); return; }

        if (!title && data.playlistTitle) title = data.playlistTitle;
        lectures = data.videos.map((v, i) => ({
          id: Date.now() + i,
          title: v.title,
          videoId: v.videoId,
          duration: v.duration,
          currentTime: 0,
          completed: false,
        }));
      } catch (err) {
        setFetchError("Failed to fetch playlist. Try again.");
        setFetchLoading(false);
        return;
      }
      setFetchLoading(false);
    } else if (videoId) {
      // Single video or shorts URL
      lectures = [{
        id: Date.now(),
        title: title || "Video",
        videoId,
        currentTime: 0,
        completed: false,
      }];
      if (!title) title = "Single Video";
    }

    if (!title) title = "Untitled";

    const pl = {
      id: Date.now() + 999,
      title,
      url: newUrl.trim(),
      playlistId,
      lectures,
      createdAt: new Date().toISOString(),
    };
    setPlaylists(prev => [...prev, pl]);
    setActivePlaylist(pl.id);
    setNewTitle(""); setNewUrl(""); setFetchError("");
    setIsAddModal(false);
  };

  // Add single lecture manually
  const addLecture = () => {
    if (!lectureTitle.trim() || !lectureUrl.trim() || !active) return;
    const videoId = extractVideoId(lectureUrl);
    if (!videoId) return;
    const lecture = { id: Date.now(), title: lectureTitle.trim(), videoId, url: lectureUrl.trim(), currentTime: 0, completed: false };
    setPlaylists(prev => prev.map(p =>
      p.id === active.id ? { ...p, lectures: [...p.lectures, lecture] } : p
    ));
    setLectureTitle(""); setLectureUrl(""); setIsAddLecture(false);
  };

  const toggleComplete = (lectureId) => {
    setPlaylists(prev => prev.map(p =>
      p.id === active?.id
        ? { ...p, lectures: p.lectures.map(l => l.id === lectureId ? { ...l, completed: !l.completed } : l) }
        : p
    ));
  };

  const deleteLecture = (lectureId) => {
    setPlaylists(prev => prev.map(p =>
      p.id === active?.id ? { ...p, lectures: p.lectures.filter(l => l.id !== lectureId) } : p
    ));
    if (playingLecture === lectureId) setPlayingLecture(null);
  };

  const deletePlaylist = (plId) => {
    setPlaylists(prev => prev.filter(p => p.id !== plId));
    if (activePlaylist === plId) {
      const remaining = playlists.filter(p => p.id !== plId);
      setActivePlaylist(remaining.length > 0 ? remaining[0].id : null);
    }
    setPlayingLecture(null);
  };

  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
  const completedCount = active?.lectures.filter(l => l.completed).length || 0;
  const totalCount = active?.lectures.length || 0;
  const resumeLecture = active?.lectures.find(l => !l.completed && l.currentTime > 0) || active?.lectures.find(l => !l.completed);

  return (
    <>
      {/* Player Section */}
      <div className="bg-surface-container rounded-[2rem] overflow-hidden border border-outline-variant/5 shadow-2xl">
        <div className="relative aspect-video w-full bg-surface-container-lowest" ref={playerContainerRef}>
          {playingData ? (
            <div id="yt-player-embed" className="w-full h-full" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant gap-4">
              <span className="material-symbols-outlined text-6xl text-primary/30">play_circle</span>
              <p className="font-label text-sm">{active ? "Select a lecture to play" : "Add a playlist to get started"}</p>
            </div>
          )}
        </div>

        {/* Now Playing / Resume Bar */}
        <div className="p-6 flex items-center justify-between bg-surface-container-high/50">
          <div className="flex items-center gap-4 min-w-0">
            <span className="material-symbols-outlined text-secondary">{playingData ? "play_circle" : "history"}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-on-surface truncate">
                {playingData ? playingData.title : (resumeLecture ? "Pick up where you left off" : "No lectures yet")}
              </p>
              <p className="text-xs text-on-surface-variant truncate">
                {playingData ? `Auto-saving progress` : resumeLecture ? `${resumeLecture.title} • ${fmtTime(resumeLecture.currentTime)}` : "Add a playlist URL to auto-import lectures"}
              </p>
            </div>
          </div>
          {resumeLecture && !playingData && (
            <button onClick={() => setPlayingLecture(resumeLecture.id)}
              className="px-5 py-2 bg-surface-container-highest rounded-full text-sm font-bold text-primary hover:bg-surface-bright transition-colors border border-outline-variant/20 shrink-0">
              Resume
            </button>
          )}
        </div>
      </div>

      {/* Playlist Manager */}
      <div className="bg-surface-container-high p-6 rounded-[2rem] border border-outline-variant/5">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-headline font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">queue_music</span>
            My Playlists
          </h3>
          <button onClick={() => setIsAddModal(true)}
            className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors" title="Add Playlist">
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        {/* Playlist pills */}
        {playlists.length > 0 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4 mb-4">
            {playlists.map(p => (
              <button key={p.id} onClick={() => { setActivePlaylist(p.id); setPlayingLecture(null); }}
                className={`px-4 py-2 rounded-full text-xs font-label font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  activePlaylist === p.id ? "bg-primary/15 text-primary shadow-sm" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                }`}>
                {p.title}
                <span className="text-[10px] opacity-60">{p.lectures.length}</span>
              </button>
            ))}
          </div>
        )}

        {/* Lectures List */}
        {active ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">{completedCount}/{totalCount} Lectures</p>
                {totalCount > 0 && (
                  <div className="w-20 h-1.5 bg-surface-container-lowest rounded-full overflow-hidden">
                    <div className="h-full bg-secondary transition-all" style={{ width: `${(completedCount / totalCount) * 100}%` }} />
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setIsAddLecture(true)} className="text-xs font-label font-bold text-on-surface-variant flex items-center gap-1 hover:text-primary transition-colors" title="Add single video">
                  <span className="material-symbols-outlined text-sm">add</span> Video
                </button>
                <button onClick={() => { if (confirm("Delete this playlist?")) deletePlaylist(active.id); }}
                  className="text-on-surface-variant hover:text-error transition-colors ml-1" title="Delete Playlist">
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>

            <div className="space-y-1 max-h-[350px] overflow-y-auto scrollbar-none">
              {active.lectures.map((lec, idx) => (
                <div key={lec.id}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer group ${
                    playingLecture === lec.id ? "bg-primary/10 border border-primary/20" : "hover:bg-surface-bright/30"
                  } ${lec.completed ? "opacity-50" : ""}`}>
                  <button onClick={() => setPlayingLecture(lec.id)}
                    className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center shrink-0 hover:bg-primary hover:text-on-primary transition-colors">
                    {playingLecture === lec.id
                      ? <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>equalizer</span>
                      : <span className="text-xs font-bold text-on-surface-variant">{idx + 1}</span>}
                  </button>
                  <div className="flex-grow min-w-0" onClick={() => setPlayingLecture(lec.id)}>
                    <p className={`text-sm font-bold truncate ${lec.completed ? "line-through text-on-surface-variant" : "text-on-surface"}`}>{lec.title}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-on-surface-variant font-label">
                        {lec.currentTime > 0 ? fmtTime(lec.currentTime) : "0:00"}
                        {lec.duration ? ` / ${lec.duration}` : ""}
                      </p>
                      {lec.currentTime > 0 && !lec.completed && (
                        <div className="w-12 h-1 bg-surface-container-lowest rounded-full overflow-hidden">
                          <div className="h-full bg-error rounded-full" style={{ width: "50%" }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); toggleComplete(lec.id); }}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${lec.completed ? "text-secondary" : "text-on-surface-variant hover:text-secondary"}`}
                      title={lec.completed ? "Mark incomplete" : "Mark complete"}>
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: lec.completed ? "'FILL' 1" : "'FILL' 0" }}>check_circle</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteLecture(lec.id); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-on-surface-variant hover:text-error transition-colors" title="Delete">
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                </div>
              ))}
              {active.lectures.length === 0 && (
                <div className="text-center py-10 text-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl text-primary/20 mb-2 block">video_library</span>
                  <p className="text-sm font-label">No lectures yet.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-on-surface-variant">
            <span className="material-symbols-outlined text-4xl text-primary/20 mb-2 block">playlist_add</span>
            <p className="text-sm font-label">Create a playlist to start tracking lectures.</p>
          </div>
        )}
      </div>

      {isAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md">
          <div className="bg-surface-container-high w-full max-w-md rounded-3xl p-8 border border-outline-variant/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span> Add Content
              </h3>
              <button onClick={() => { setIsAddModal(false); setFetchError(""); }} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">YouTube URL</label>
                <input type="text" value={newUrl} onChange={e => setNewUrl(e.target.value)} autoFocus
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50"
                  placeholder="Paste any YouTube link — playlist, video, or short" />
                {newUrl && extractPlaylistId(newUrl) && (
                  <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">queue_music</span>
                    Playlist detected — all videos will be imported
                  </p>
                )}
                {newUrl && !extractPlaylistId(newUrl) && extractVideoId(newUrl) && (
                  <p className="text-xs text-secondary mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">play_circle</span>
                    Single video detected
                  </p>
                )}
                {newUrl && newUrl.length > 10 && !extractPlaylistId(newUrl) && !extractVideoId(newUrl) && (
                  <p className="text-xs text-error mt-1">Could not detect a valid YouTube URL</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Name (optional)</label>
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50"
                  placeholder="Auto-detected for playlists" />
              </div>
              {fetchError && (
                <p className="text-xs text-error bg-error/10 rounded-xl p-3">{fetchError}</p>
              )}
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => { setIsAddModal(false); setFetchError(""); }} className="px-6 py-3 rounded-full font-label text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
              <button onClick={addPlaylist} disabled={fetchLoading || (!newUrl.trim() && !newTitle.trim())}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-full font-label text-sm font-bold shadow-lg active:scale-95 transition-all disabled:opacity-40 flex items-center gap-2">
                {fetchLoading && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                {fetchLoading ? "Importing..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Single Lecture Modal */}
      {isAddLecture && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md">
          <div className="bg-surface-container-high w-full max-w-md rounded-3xl p-8 border border-outline-variant/20 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">video_library</span> Add Video
              </h3>
              <button onClick={() => setIsAddLecture(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Video Title</label>
                <input type="text" value={lectureTitle} onChange={e => setLectureTitle(e.target.value)} autoFocus
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50"
                  placeholder="e.g., Lecture 5 - Binary Trees" />
              </div>
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">YouTube Video URL</label>
                <input type="text" value={lectureUrl} onChange={e => setLectureUrl(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50"
                  placeholder="https://youtube.com/watch?v=..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsAddLecture(false)} className="px-6 py-3 rounded-full font-label text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors">Cancel</button>
              <button onClick={addLecture} disabled={!lectureUrl || !extractVideoId(lectureUrl)}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-full font-label text-sm font-bold shadow-lg active:scale-95 transition-all disabled:opacity-40">Add</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
