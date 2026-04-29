"use client";
import { useState, useEffect } from "react";

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

  // Get curriculum for active playlist, auto-generate from lectures if none exists
  const getPlaylistCurriculum = () => {
    const existing = curriculum.find(c => c.playlistId === activePlaylist);
    if (existing) return existing;
    // Auto-generate from lectures
    if (active?.lectures?.length > 0) {
      const topics = active.lectures.map((lec, i) => ({
        id: Date.now() + i,
        title: lec.title,
        checked: lec.completed || false,
        subtopics: [],
        isCustom: false,
      }));
      const newCurr = { playlistId: activePlaylist, topics };
      setCurriculum(prev => [...prev, newCurr]);
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
    updateTopics(topics.map(t => t.id === topicId ? { ...t, checked: !t.checked } : t));
  };

  const toggleSub = (topicId, subId) => {
    updateTopics(topics.map(t =>
      t.id === topicId
        ? { ...t, subtopics: t.subtopics.map(s => s.id === subId ? { ...s, checked: !s.checked } : s) }
        : t
    ));
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
        checked: l.completed || false,
        subtopics: [],
        isCustom: false,
      }));
      updateTopics([...existing.topics, ...newTopics]);
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
      <div className="bg-surface-container p-8 rounded-[2rem] border border-outline-variant/5 flex-grow">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-headline font-bold text-on-surface">Curriculum Tracker</h2>
            <p className="text-sm text-on-surface-variant font-label">
              {active ? active.title : "Select a playlist"}
            </p>
          </div>
          <div className="h-16 w-16 relative">
            <svg className="h-full w-full transform -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" fill="transparent" r="28" stroke="#1d2024" strokeWidth="6" />
              <circle cx="32" cy="32" fill="transparent" r="28" stroke="#9df197" strokeDasharray={circumference} strokeDashoffset={dashOffset} strokeWidth="6" strokeLinecap="round" className="transition-all duration-700" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">{progressPercent}%</div>
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
