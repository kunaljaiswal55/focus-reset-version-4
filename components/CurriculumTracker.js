"use client";
import { useState, useEffect, useCallback } from "react";

export default function CurriculumTracker() {
  const [playlists, setPlaylists] = useState([]);
  const [curriculum, setCurriculum] = useState([]);
  const [activePlaylist, setActivePlaylist] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Add topic modal
  const [isAddTopic, setIsAddTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");

  // Add subtopic
  const [addingSubTo, setAddingSubTo] = useState(null);
  const [fetchingChapters, setFetchingChapters] = useState({});
  const [newSubTitle, setNewSubTitle] = useState("");

  // Load playlists from shared localStorage
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem("yt_playlists");
      const savedCurr = localStorage.getItem("yt_curriculum");
      if (saved) {
        const parsed = JSON.parse(saved);
        setPlaylists(parsed);
        if (parsed.length > 0 && !activePlaylist) setActivePlaylist(parsed[0].id);
      }
      if (savedCurr) setCurriculum(JSON.parse(savedCurr));
      setIsLoaded(true);
    };
    load();

    // Listen for storage changes (when YouTubeTracker updates playlists)
    const handler = (e) => {
      if (e.key === "yt_playlists") load();
    };
    window.addEventListener("storage", handler);

    // Also poll for same-tab changes
    const interval = setInterval(() => {
      const current = localStorage.getItem("yt_playlists");
      if (current) {
        const parsed = JSON.parse(current);
        setPlaylists(parsed);
      }
    }, 2000);

    return () => { window.removeEventListener("storage", handler); clearInterval(interval); };
  }, []);

  // Save curriculum
  useEffect(() => {
    if (isLoaded) localStorage.setItem("yt_curriculum", JSON.stringify(curriculum));
  }, [curriculum, isLoaded]);

  const active = playlists.find(p => p.id === activePlaylist);

  // Fetch timestamps/chapters from a YouTube video and add as subtopics
  const fetchChapters = useCallback(async (topicId, videoId) => {
    if (!videoId) return;
    setFetchingChapters(prev => ({ ...prev, [topicId]: true }));
    try {
      const res = await fetch(`/api/youtube-chapters?id=${videoId}`);
      const data = await res.json();
      if (data.chapters && data.chapters.length > 0) {
        setCurriculum(prev => prev.map(c => {
          if (c.playlistId !== activePlaylist) return c;
          return {
            ...c,
            topics: c.topics.map(t => {
              if (t.id !== topicId) return t;
              // Only add chapters that don't already exist as subtopics
              const existingTitles = new Set(t.subtopics.map(s => s.title));
              const newSubs = data.chapters
                .filter(ch => !existingTitles.has(`${ch.time} ${ch.title}`))
                .map((ch, i) => ({
                  id: Date.now() + i + 100,
                  title: `${ch.time} ${ch.title}`,
                  checked: false,
                }));
              return { ...t, subtopics: [...t.subtopics, ...newSubs], chaptersLoaded: true };
            }),
          };
        }));
      }
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
    }
    setFetchingChapters(prev => ({ ...prev, [topicId]: false }));
  }, [activePlaylist]);

  // Get curriculum for active playlist, auto-generate from lectures if none exists
  const getPlaylistCurriculum = () => {
    const existing = curriculum.find(c => c.playlistId === activePlaylist);
    if (existing) return existing;
    // Auto-generate from lectures
    if (active?.lectures?.length > 0) {
      const topics = active.lectures.map((lec, i) => ({
        id: Date.now() + i,
        title: lec.title,
        videoId: lec.videoId,
        checked: lec.completed || false,
        subtopics: [],
        isCustom: false,
        chaptersLoaded: false,
      }));
      const newCurr = { playlistId: activePlaylist, topics };
      setCurriculum(prev => [...prev, newCurr]);
      // Auto-fetch chapters for each topic
      topics.forEach(t => { if (t.videoId) fetchChapters(t.id, t.videoId); });
      return newCurr;
    }
    return null;
  };

  const curr = activePlaylist ? getPlaylistCurriculum() : null;
  const topics = curr?.topics || [];

  const updateTopics = (newTopics) => {
    setCurriculum(prev => {
      const exists = prev.find(c => c.playlistId === activePlaylist);
      if (exists) {
        return prev.map(c => c.playlistId === activePlaylist ? { ...c, topics: newTopics } : c);
      }
      return [...prev, { playlistId: activePlaylist, topics: newTopics }];
    });
  };

  const toggleTopic = (topicId) => {
    updateTopics(topics.map(t => {
      if (t.id === topicId) {
        const newChecked = !t.checked;
        return {
          ...t,
          checked: newChecked,
          subtopics: t.subtopics.map(s => ({ ...s, checked: newChecked }))
        };
      }
      return t;
    }));
  };

  const toggleSub = (topicId, subId) => {
    updateTopics(topics.map(t => {
      if (t.id === topicId) {
        const newSubs = t.subtopics.map(s => s.id === subId ? { ...s, checked: !s.checked } : s);
        const allChecked = newSubs.length > 0 && newSubs.every(s => s.checked);
        return { ...t, subtopics: newSubs, checked: allChecked };
      }
      return t;
    }));
  };

  const deleteTopic = (topicId) => {
    updateTopics(topics.filter(t => t.id !== topicId));
  };

  const deleteSub = (topicId, subId) => {
    updateTopics(topics.map(t =>
      t.id === topicId ? { ...t, subtopics: t.subtopics.filter(s => s.id !== subId) } : t
    ));
  };

  const addTopic = () => {
    if (!newTopicTitle.trim()) return;
    updateTopics([...topics, { id: Date.now(), title: newTopicTitle.trim(), checked: false, subtopics: [], isCustom: true }]);
    setNewTopicTitle("");
    setIsAddTopic(false);
  };

  const addSubtopic = (topicId) => {
    if (!newSubTitle.trim()) return;
    updateTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, subtopics: [...t.subtopics, { id: Date.now(), title: newSubTitle.trim(), checked: false }] }
        : t
    ));
    setNewSubTitle("");
    setAddingSubTo(null);
  };

  // Sync: re-add deleted topics from playlist lectures
  const syncFromPlaylist = () => {
    if (!active) return;
    const existingTitles = new Set(topics.map(t => t.title));
    const missing = active.lectures.filter(l => !existingTitles.has(l.title));
    if (missing.length === 0) return;
    const newTopics = missing.map((l, i) => ({
      id: Date.now() + i + 800,
      title: l.title,
      videoId: l.videoId,
      checked: false,
      subtopics: [],
      isCustom: false,
      chaptersLoaded: false,
    }));
    updateTopics([...topics, ...newTopics]);
    newTopics.forEach(t => { if (t.videoId) fetchChapters(t.id, t.videoId); });
  };

  const missingCount = active ? active.lectures.filter(l => !new Set(topics.map(t => t.title)).has(l.title)).length : 0;

  // Sync: regenerate curriculum when playlist lectures change
  useEffect(() => {
    if (!active || !isLoaded) return;
    const existing = curriculum.find(c => c.playlistId === activePlaylist);
    if (!existing) return;

    // Check for new lectures not in curriculum
    const existingTitles = new Set(existing.topics.filter(t => !t.isCustom).map(t => t.title));
    const newLectures = active.lectures.filter(l => !existingTitles.has(l.title));
    if (newLectures.length > 0) {
      const newTopics = newLectures.map((l, i) => ({
        id: Date.now() + i + 500,
        title: l.title,
        videoId: l.videoId,
        checked: l.completed || false,
        subtopics: [],
        isCustom: false,
        chaptersLoaded: false,
      }));
      updateTopics([...existing.topics, ...newTopics]);
      // Auto-fetch chapters for new topics
      newTopics.forEach(t => { if (t.videoId) fetchChapters(t.id, t.videoId); });
    }

    // Remove auto-generated topics whose lectures were deleted (keep custom ones)
    const lectureTitles = new Set(active.lectures.map(l => l.title));
    const filtered = existing.topics.filter(t => t.isCustom || lectureTitles.has(t.title));
    if (filtered.length !== existing.topics.length) {
      updateTopics(filtered);
    }
  }, [active?.lectures?.length, activePlaylist, isLoaded]);

  // Progress
  const totalItems = topics.length + topics.reduce((s, t) => s + t.subtopics.length, 0);
  const checkedItems = topics.filter(t => t.checked).length + topics.reduce((s, t) => s + t.subtopics.filter(st => st.checked).length, 0);
  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;
  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (progressPercent / 100) * circumference;

  return (
    <>
      <div className="bg-surface-container p-8 rounded-[2rem] border border-outline-variant/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface">Curriculum Tracker</h2>
            <p className="text-sm text-on-surface-variant font-label">
              {active ? active.title : "Select a playlist"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={syncFromPlaylist} disabled={missingCount === 0 || !active}
              className={`flex items-center gap-1 px-4 py-2 rounded-full text-xs font-label font-bold transition-colors ${
                missingCount > 0 
                  ? "bg-primary/20 text-primary hover:bg-primary/30 shadow-sm" 
                  : "bg-surface-container-highest text-on-surface-variant opacity-50"
              }`}
              title={missingCount > 0 ? `Sync ${missingCount} missing topic(s) from playlist` : "Curriculum is synced with playlist"}>
              <span className="material-symbols-outlined text-[16px]">sync</span>
              {missingCount > 0 ? `Sync (${missingCount})` : "Synced"}
            </button>
            <div className="h-16 w-16 relative shrink-0">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" fill="transparent" r="28" stroke="#1d2024" strokeWidth="6" />
              <circle cx="32" cy="32" fill="transparent" r="28" stroke="#9df197" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeWidth="6" strokeLinecap="round" className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{progressPercent}%</div>
          </div>
          </div>
        </div>

        {/* Playlist tabs */}
        {playlists.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-4 mb-4">
            {playlists.map(p => (
              <button key={p.id} onClick={() => setActivePlaylist(p.id)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-label font-bold whitespace-nowrap transition-all ${
                  activePlaylist === p.id ? "bg-primary/15 text-primary" : "bg-surface-container-low text-on-surface-variant hover:text-on-surface"
                }`}>
                {p.title}
              </button>
            ))}
          </div>
        )}

        {/* Topics */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
          {topics.map((topic, idx) => {
            const allSubsChecked = topic.subtopics.length > 0 && topic.subtopics.every(s => s.checked);
            const isFullyDone = topic.checked && (topic.subtopics.length === 0 || allSubsChecked);
            return (
              <div key={topic.id} className="group/topic">
                <div className="flex items-start gap-3">
                  <button onClick={() => toggleTopic(topic.id)}
                    className={`mt-0.5 flex items-center justify-center w-5 h-5 rounded shrink-0 transition-colors ${
                      topic.checked
                        ? "bg-secondary/20 text-secondary"
                        : "border-2 border-primary hover:bg-primary/10"
                    }`}>
                    {topic.checked && <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                  </button>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-sm font-bold ${isFullyDone ? "line-through text-on-surface-variant opacity-50" : "text-on-surface"}`}>
                        <span className="text-[10px] opacity-40 mr-1">{String(idx + 1).padStart(2, "0")}</span>
                        {topic.title}
                      </p>
                      <div className="flex items-center gap-1 opacity-0 group-hover/topic:opacity-100 transition-opacity shrink-0">
                        {topic.videoId && !topic.chaptersLoaded && (
                          <button onClick={() => fetchChapters(topic.id, topic.videoId)} disabled={fetchingChapters[topic.id]}
                            className="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" title="Fetch timestamps">
                            <span className={`material-symbols-outlined text-[14px] ${fetchingChapters[topic.id] ? 'animate-spin' : ''}`}>
                              {fetchingChapters[topic.id] ? 'progress_activity' : 'schedule'}
                            </span>
                          </button>
                        )}
                        <button onClick={() => { setAddingSubTo(topic.id); setNewSubTitle(""); }}
                          className="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors" title="Add subtopic">
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                        <button onClick={() => deleteTopic(topic.id)}
                          className="w-5 h-5 rounded flex items-center justify-center text-on-surface-variant hover:text-error transition-colors" title="Delete">
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    </div>

                    {/* Subtopics */}
                    {topic.subtopics.length > 0 && (
                      <div className="mt-2 space-y-1.5 pl-2 border-l border-outline-variant/20">
                        {topic.subtopics.map(sub => (
                          <div key={sub.id} className="flex items-center gap-2 py-0.5 group/sub">
                            <button onClick={() => toggleSub(topic.id, sub.id)}
                              className={`w-3.5 h-3.5 rounded flex items-center justify-center shrink-0 transition-colors ${
                                sub.checked ? "bg-secondary/20 border border-secondary" : "border border-outline-variant hover:border-primary"
                              }`}>
                              {sub.checked && <span className="material-symbols-outlined text-[10px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>}
                            </button>
                            <span className={`text-xs flex-grow ${sub.checked ? "line-through text-on-surface-variant opacity-50" : "text-on-surface-variant"}`}>{sub.title}</span>
                            <button onClick={() => deleteSub(topic.id, sub.id)}
                              className="w-4 h-4 rounded flex items-center justify-center text-on-surface-variant hover:text-error opacity-0 group-hover/sub:opacity-100 transition-all" title="Delete">
                              <span className="material-symbols-outlined text-[12px]">close</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Inline add subtopic */}
                    {addingSubTo === topic.id && (
                      <div className="mt-2 flex items-center gap-2 pl-2">
                        <input type="text" value={newSubTitle} onChange={e => setNewSubTitle(e.target.value)} autoFocus
                          onKeyDown={e => { if (e.key === "Enter") addSubtopic(topic.id); if (e.key === "Escape") setAddingSubTo(null); }}
                          className="flex-grow bg-surface-container-low rounded-lg px-3 py-1.5 text-xs text-on-surface border border-outline-variant/10 focus:outline-none focus:border-primary/50"
                          placeholder="Subtopic name..." />
                        <button onClick={() => addSubtopic(topic.id)} className="text-primary">
                          <span className="material-symbols-outlined text-[16px]">check</span>
                        </button>
                        <button onClick={() => setAddingSubTo(null)} className="text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {topics.length === 0 && !active && (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl text-primary/20 mb-2 block">school</span>
              <p className="text-xs font-label">Add a playlist to auto-generate your curriculum.</p>
            </div>
          )}

          {topics.length === 0 && active && (
            <div className="text-center py-8 text-on-surface-variant">
              <span className="material-symbols-outlined text-3xl text-primary/20 mb-2 block">checklist</span>
              <p className="text-xs font-label">No topics yet. Add lectures or custom topics.</p>
            </div>
          )}

          {/* Inline add topic */}
          {isAddTopic ? (
            <div className="flex items-center gap-2 mt-4 p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
              <input type="text" value={newTopicTitle} onChange={e => setNewTopicTitle(e.target.value)} autoFocus
                onKeyDown={e => { if (e.key === "Enter") addTopic(); if (e.key === "Escape") setIsAddTopic(false); }}
                className="flex-grow bg-transparent text-sm text-on-surface font-body focus:outline-none"
                placeholder="Topic name..." />
              <button onClick={addTopic} className="text-primary"><span className="material-symbols-outlined text-[18px]">check</span></button>
              <button onClick={() => setIsAddTopic(false)} className="text-on-surface-variant"><span className="material-symbols-outlined text-[18px]">close</span></button>
            </div>
          ) : (
            <button onClick={() => setIsAddTopic(true)}
              className="w-full mt-4 py-3 border border-dashed border-outline-variant/20 rounded-xl text-xs font-label text-on-surface-variant hover:text-primary hover:border-primary/30 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add Custom Topic
            </button>
          )}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="bg-gradient-to-br from-surface-container-high to-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mb-1">Completion</p>
          <p className="text-3xl font-headline font-bold text-primary">{checkedItems}<span className="text-sm font-light opacity-60 ml-1">/ {totalItems} done</span></p>
        </div>
        <div className="flex items-center gap-2">
          {progressPercent >= 100 && (
            <span className="material-symbols-outlined text-secondary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>emoji_events</span>
          )}
          <span className={`text-xs font-label font-bold px-3 py-1 rounded-full ${
            progressPercent >= 100 ? "bg-secondary/15 text-secondary" :
            progressPercent > 50 ? "bg-primary/15 text-primary" :
            "bg-surface-container-highest text-on-surface-variant"
          }`}>
            {progressPercent >= 100 ? "Complete!" : progressPercent > 50 ? "On Track" : "In Progress"}
          </span>
        </div>
      </div>
    </>
  );
}
