"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── Voice Waveform (animated bars shown while mic is active) ─────────────────
function VoiceWaveform() {
  return (
    <div className="flex items-center gap-[3px] h-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="w-[3px] bg-red-400 rounded-full"
          style={{
            animation: `wave 0.8s ease-in-out ${i * 0.1}s infinite alternate`,
            height: `${8 + i * 4}px`,
          }}
        />
      ))}
      <style>{`@keyframes wave { from { transform: scaleY(0.4); } to { transform: scaleY(1.2); } }`}</style>
    </div>
  );
}

// ─── Activity Log Modal ───────────────────────────────────────────────────────
function ActivityModal({ item, onClose, onSubmit, isLoading }) {
  const [label, setLabel] = useState("");
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState("");

  const presets = {
    family: ["Called Mom/Dad", "Family dinner", "Video call", "Visited home", "Helped a sibling"],
    friends: ["Hangout", "Coffee meetup", "Gaming session", "Group call", "Long catch-up"],
    parties: ["Birthday party", "House party", "Work event", "College reunion", "Celebration dinner"],
    outings: ["Solo walk", "Cafe visit", "Movie night", "Museum trip", "Nature hike"],
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!label.trim()) return;
    onSubmit({ type: item.key, label: label.trim(), duration: Number(duration), notes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1a1d22] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${item.bg}`}>
            <span className={`material-symbols-outlined ${item.color} text-2xl`}
              style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-white">Log {item.label} Activity</h3>
            <p className="text-xs text-white/40 uppercase tracking-widest">Current score: {item.value}%</p>
          </div>
          <button onClick={onClose} className="ml-auto material-symbols-outlined text-white/40 hover:text-white transition-colors">close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Quick presets */}
          <div>
            <p className="text-xs text-white/40 uppercase tracking-widest mb-2">Quick Select</p>
            <div className="flex flex-wrap gap-2">
              {presets[item.key].map((p) => (
                <button type="button" key={p}
                  onClick={() => setLabel(p)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${label === p
                    ? `${item.bg} ${item.color} border-transparent`
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                    }`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Name */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Activity Name *</label>
            <input
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Sunday dinner with family"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              required
            />
          </div>

          {/* Duration Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-white/40 uppercase tracking-widest">Duration</label>
              <span className={`text-sm font-bold ${item.color}`}>{duration} min</span>
            </div>
            <input type="range" min="5" max="240" step="5"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full accent-current"
              style={{ accentColor: 'var(--color-primary)' }}
            />
            <div className="flex justify-between text-[10px] text-white/25 mt-1">
              <span>5 min</span><span>1 hr</span><span>2 hr</span><span>4 hr</span>
            </div>
          </div>

          {/* Metric bump preview */}
          <div className={`rounded-xl px-4 py-3 ${item.bg} flex items-center gap-3`}>
            <span className="material-symbols-outlined text-white/70 text-lg">trending_up</span>
            <div>
              <p className="text-xs text-white/60">Score boost from this activity</p>
              <p className={`font-bold text-lg ${item.color}`}>
                +{Math.min(20, 5 + Math.floor(duration / 10))}%
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it feel? Any memorable moments?"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors resize-none h-20 text-sm"
            />
          </div>

          <button type="submit" disabled={isLoading || !label.trim()}
            className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all ${isLoading || !label.trim()
              ? 'bg-white/10 text-white/30 cursor-not-allowed'
              : `${item.bg} ${item.color} hover:scale-[1.02] hover:shadow-lg`
              }`}>
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : 'Log Activity'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Travel Goal Modal ────────────────────────────────────────────────────────
function TravelGoalModal({ onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Solo Trip");
  const [status, setStatus] = useState("Planned");
  const [statusDetail, setStatusDetail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalDetail = statusDetail.trim();
    if (!finalDetail) {
      if (status === "Planned") finalDetail = "Planned";
      else if (status === "Completed") finalDetail = "Completed";
      else if (status === "Budgeting") finalDetail = "Budgeting";
    }

    onSubmit({
      id: Date.now().toString(),
      title: title.trim(),
      type,
      status,
      statusDetail: finalDetail
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#1a1d22] border border-white/10 rounded-[2rem] p-8 w-full max-w-md shadow-2xl animate-in">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full flex items-center justify-center bg-primary/10">
            <span className="material-symbols-outlined text-primary text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}>flight_takeoff</span>
          </div>
          <div>
            <h3 className="font-headline text-xl font-bold text-white">Add Travel Goal</h3>
            <p className="text-xs text-white/40 uppercase tracking-widest">Pin your next adventure</p>
          </div>
          <button onClick={onClose} className="ml-auto material-symbols-outlined text-white/40 hover:text-white transition-colors">close</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Destination */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Destination / Goal Name *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Swiss Alps Skiing"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Trip Type */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Trip Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-white/30 transition-colors [&>option]:bg-[#1a1d22]"
              >
                <option value="Solo Trip">Solo Trip</option>
                <option value="With Friends">With Friends</option>
                <option value="With Family">With Family</option>
                <option value="Business Trip">Business Trip</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none focus:border-white/30 transition-colors [&>option]:bg-[#1a1d22]"
              >
                <option value="Planned">Planned</option>
                <option value="Budgeting">Budgeting</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Status Detail */}
          <div>
            <label className="text-xs text-white/40 uppercase tracking-widest block mb-1">
              Timing / Details (optional)
            </label>
            <input
              value={statusDetail}
              onChange={(e) => setStatusDetail(e.target.value)}
              placeholder="e.g. Q4 2024 or Summer 2025"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/25 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>

          <button type="submit" disabled={!title.trim()}
            className={`w-full py-4 rounded-xl font-bold tracking-wide transition-all mt-2 ${!title.trim()
              ? 'bg-white/10 text-white/30 cursor-not-allowed'
              : 'bg-primary text-on-primary hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20'
              }`}>
            Add Goal
          </button>
        </form>
      </div>
    </div>
  );
}


// ─── Typing Dots ──────────────────────────────────────────────────────────────
function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      {[0, 1, 2].map((i) => (
        <span key={i} className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.15}s` }} />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SociallyPage() {
  const [socialMetrics, setSocialMetrics] = useState({
    family: 0, friends: 0, parties: 0, outings: 0,
  });
  const [activities, setActivities] = useState([]); // today's activity log
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to Socially! Tap a metric card to log a real activity — I'll track your social balance and give you personalised insights.", sender: "ai", time: "JUST NOW" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [isLoggingActivity, setIsLoggingActivity] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");

  // ── Emotional Flow history ────────────────────────────────────────────────────
  // Each entry: { date, label, avg, family, friends, parties, outings, hasData }
  const [flowHistory, setFlowHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  // ── Voice state ────────────────────────────────────────────────────────────
  const [voiceEnabled, setVoiceEnabled] = useState(false);  // TTS on/off
  const [isListening, setIsListening] = useState(false);  // STT active
  const [speakingMsgId, setSpeakingMsgId] = useState(null); // which msg is being spoken
  const [voiceSupport, setVoiceSupport] = useState({ tts: false, stt: false });
  const recognitionRef = useRef(null); // SpeechRecognition instance
  const synthRef = useRef(null); // SpeechSynthesis ref

  const [travelGoals, setTravelGoals] = useState([]);
  const [travelModalActive, setTravelModalActive] = useState(false);

  const toggleGoalStatus = (id) => {
    setTravelGoals((prev) => {
      const updated = prev.map((goal) => {
        if (goal.id === id) {
          const nextStatus = goal.status === "Completed" ? "Planned" : "Completed";
          let nextDetail = goal.statusDetail;
          if (nextStatus === "Completed") {
            nextDetail = `Completed ${new Date().toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}`;
          } else if (goal.statusDetail.startsWith("Completed")) {
            nextDetail = "Planned Trip";
          }
          return { ...goal, status: nextStatus, statusDetail: nextDetail };
        }
        return goal;
      });
      localStorage.setItem("soc_travel_goals", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteGoal = (id) => {
    setTravelGoals((prev) => {
      const updated = prev.filter((goal) => goal.id !== id);
      localStorage.setItem("soc_travel_goals", JSON.stringify(updated));
      return updated;
    });
  };

  const addGoal = async (newGoal) => {
    let imageUrl = "";
    try {
      const res = await fetch(`/api/social/goal-image?q=${encodeURIComponent(newGoal.title)}`);
      if (res.ok) {
        const data = await res.json();
        imageUrl = data.url;
      }
    } catch {
      // Fallback handled below
    }

    if (!imageUrl) {
      imageUrl = `https://images.unsplash.com/featured/800x600/?${encodeURIComponent(newGoal.title)}`;
    }

    const goalWithImage = { ...newGoal, imageUrl };

    setTravelGoals((prev) => {
      const updated = [...prev, goalWithImage];
      localStorage.setItem("soc_travel_goals", JSON.stringify(updated));
      return updated;
    });
    setTravelModalActive(false);
  };

  const chatEndRef = useRef(null);

  const METRIC_CONFIG = [
    { key: "family", label: "Family", icon: "family_history", color: "text-violet-400", bg: "bg-violet-400/10" },
    { key: "friends", label: "Friends", icon: "groups", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { key: "parties", label: "Parties", icon: "celebration", color: "text-amber-400", bg: "bg-amber-400/10" },
    { key: "outings", label: "Outings", icon: "hiking", color: "text-sky-400", bg: "bg-sky-400/10" },
  ];

  // ── Load everything on mount ───────────────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true);
    const today = new Date().toISOString().split("T")[0];

    // ─ Seed Demo Data if empty and not explicitly reset to blank ──────────
    const hasInitialized = localStorage.getItem("soc_initialized");
    if (!hasInitialized) {
      const defaultMetrics = { family: 60, friends: 75, parties: 40, outings: 50 };
      const defaultActivities = [
        { type: "family", label: "Sunday dinner with parents", duration: 90, notes: "Had a great home-cooked meal and caught up on life.", loggedAt: new Date().toISOString() },
        { type: "friends", label: "Coffee meetup with Sarah", duration: 45, notes: "Nice chat about our upcoming travel plans.", loggedAt: new Date().toISOString() },
        { type: "outings", label: "Solo sunset walk in the park", duration: 30, notes: "Felt very peaceful and refreshing.", loggedAt: new Date().toISOString() }
      ];
      const defaultMessages = [
        { id: 1, text: "Welcome to Socially! Tap a metric card to log a real activity — I'll track your social balance and give you personalised insights.", sender: "ai", time: "JUST NOW" },
        { id: 2, text: "Hey! I'm feeling a bit socially drained after the weekend, but I also feel like I haven't seen my family in a while.", sender: "user", time: "10 MINS AGO" },
        { id: 3, text: "It's completely normal to feel drained, especially after busy weekend events. Balancing high-energy parties with low-energy family time or solo outings is key. Maybe you could call a family member for a quick catch-up? That way, you're maintaining the connection without exhausting yourself.", sender: "ai", time: "9 MINS AGO" },
        { id: 4, text: "Good idea, I'll call my mom for a bit.", sender: "user", time: "5 MINS AGO" },
        { id: 5, text: "Perfect! Let me know how it goes. I'll be here to track your progress and chat anytime.", sender: "ai", time: "4 MINS AGO" }
      ];
      localStorage.setItem("soc_metrics", JSON.stringify(defaultMetrics));
      localStorage.setItem("soc_activities", JSON.stringify(defaultActivities));
      localStorage.setItem("soc_messages", JSON.stringify(defaultMessages));

      const defaultTravelGoals = [
        {
          id: "1",
          title: "Maldives Retreat",
          type: "Solo Trip",
          status: "Completed",
          statusDetail: "Q4 2024"
        },
        {
          id: "2",
          title: "Icelandic Fjords",
          type: "With Friends",
          status: "Planned",
          statusDetail: "Planned"
        },
        {
          id: "3",
          title: "Kyoto Cherry Blossom Tour",
          type: "Solo Trip",
          status: "Completed",
          statusDetail: "Completed April '23"
        },
        {
          id: "4",
          title: "Northern Lights Expedition",
          type: "With Friends",
          status: "Budgeting",
          statusDetail: "Winter 2025"
        }
      ];
      localStorage.setItem("soc_travel_goals", JSON.stringify(defaultTravelGoals));
      localStorage.setItem("soc_initialized", "true");
    }

    // ─ Travel Goals ──────────────────────────────────────────────────────
    function loadTravelGoals() {
      const saved = localStorage.getItem("soc_travel_goals");
      if (saved) {
        let parsed = JSON.parse(saved);

        // Handle Maldives Retreat
        const maldivesIndex = parsed.findIndex(
          (g) => g.title && g.title.toLowerCase().includes("maldives")
        );
        if (maldivesIndex > -1) {
          parsed[maldivesIndex] = {
            ...parsed[maldivesIndex],
            title: "Maldives Retreat",
            type: "Solo Trip",
            status: "Completed",
            statusDetail: "Q4 2024"
          };
        } else {
          parsed.unshift({
            id: "1",
            title: "Maldives Retreat",
            type: "Solo Trip",
            status: "Completed",
            statusDetail: "Q4 2024"
          });
        }

        // Handle Icelandic Fjords
        const icelandIndex = parsed.findIndex(
          (g) => g.title && g.title.toLowerCase().includes("iceland")
        );
        if (icelandIndex > -1) {
          parsed[icelandIndex] = {
            ...parsed[icelandIndex],
            title: "Icelandic Fjords",
            type: "With Friends",
            status: "Planned",
            statusDetail: "Planned"
          };
        } else {
          parsed.splice(1, 0, {
            id: "2",
            title: "Icelandic Fjords",
            type: "With Friends",
            status: "Planned",
            statusDetail: "Planned"
          });
        }

        // Handle Kyoto Cherry Blossom Tour
        const kyotoIndex = parsed.findIndex(
          (g) => g.title && g.title.toLowerCase().includes("kyoto")
        );
        if (kyotoIndex > -1) {
          parsed[kyotoIndex] = {
            ...parsed[kyotoIndex],
            title: "Kyoto Cherry Blossom Tour",
            type: "Solo Trip",
            status: "Completed",
            statusDetail: "Completed April '23"
          };
        } else {
          parsed.splice(2, 0, {
            id: "3",
            title: "Kyoto Cherry Blossom Tour",
            type: "Solo Trip",
            status: "Completed",
            statusDetail: "Completed April '23"
          });
        }

        // Handle Northern Lights Expedition
        const northernIndex = parsed.findIndex(
          (g) => g.title && g.title.toLowerCase().includes("northern")
        );
        if (northernIndex > -1) {
          parsed[northernIndex] = {
            ...parsed[northernIndex],
            title: "Northern Lights Expedition",
            type: "With Friends",
            status: "Budgeting",
            statusDetail: "Winter 2025"
          };
        } else {
          parsed.splice(3, 0, {
            id: "4",
            title: "Northern Lights Expedition",
            type: "With Friends",
            status: "Budgeting",
            statusDetail: "Winter 2025"
          });
        }

        localStorage.setItem("soc_travel_goals", JSON.stringify(parsed));
        setTravelGoals(parsed);
      } else {
        const defaultTravelGoals = [
          {
            id: "1",
            title: "Maldives Retreat",
            type: "Solo Trip",
            status: "Completed",
            statusDetail: "Q4 2024"
          },
          {
            id: "2",
            title: "Icelandic Fjords",
            type: "With Friends",
            status: "Planned",
            statusDetail: "Planned"
          },
          {
            id: "3",
            title: "Kyoto Cherry Blossom Tour",
            type: "Solo Trip",
            status: "Completed",
            statusDetail: "Completed April '23"
          },
          {
            id: "4",
            title: "Northern Lights Expedition",
            type: "With Friends",
            status: "Budgeting",
            statusDetail: "Winter 2025"
          }
        ];
        setTravelGoals(defaultTravelGoals);
        localStorage.setItem("soc_travel_goals", JSON.stringify(defaultTravelGoals));
      }
    }

    // ─ Today's metrics + activities ──────────────────────────────────────
    async function loadMetrics() {
      try {
        const res = await fetch(`/api/social/metrics?date=${today}`);
        const data = await res.json();
        if (data.source === "db" && data.metrics) {
          setSocialMetrics(data.metrics);
          setActivities(data.activities || []);
          return;
        }
      } catch { /* fall through */ }
      const savedMetrics = localStorage.getItem("soc_metrics");
      const savedActivities = localStorage.getItem("soc_activities");
      if (savedMetrics) setSocialMetrics(JSON.parse(savedMetrics));
      if (savedActivities) setActivities(JSON.parse(savedActivities));
    }

    // ─ Chat messages ──────────────────────────────────────────────────────
    async function loadMessages() {
      const saved = localStorage.getItem("soc_messages");
      if (saved) setMessages(JSON.parse(saved));
    }

    // ─ 12-day Emotional Flow history ─────────────────────────────────────
    async function loadHistory() {
      setHistoryLoading(true);
      try {
        const res = await fetch("/api/social/history?days=12");
        const data = await res.json();

        if (data.source === "db") {
          // DB connected — use server data directly
          setFlowHistory(data.days);
          setHistoryLoading(false);
          return;
        }

        // DB not connected — reconstruct from localStorage
        // We only have today's snapshot; fill in nulls for older days
        const todayMetrics = (() => {
          const m = localStorage.getItem("soc_metrics");
          return m ? JSON.parse(m) : null;
        })();

        const rebuilt = data.days.map((entry) => {
          if (entry.date === today && todayMetrics) {
            const { family = 0, friends = 0, parties = 0, outings = 0 } = todayMetrics;
            const avg = Math.round((family + friends + parties + outings) / 4);
            return { ...entry, avg, family, friends, parties, outings, hasData: true };
          }
          return entry; // hasData: false for older days
        });

        setFlowHistory(rebuilt);
      } catch {
        // Silently fail — chart stays empty
        setFlowHistory([]);
      }
      setHistoryLoading(false);
    }

    loadMetrics();
    loadMessages();
    loadHistory();
    loadTravelGoals();
  }, []);

  // Re-update today's bar in flowHistory whenever metrics change live
  useEffect(() => {
    if (!isMounted || flowHistory.length === 0) return;
    const today = new Date().toISOString().split("T")[0];
    const { family, friends, parties, outings } = socialMetrics;
    const avg = Math.round((family + friends + parties + outings) / 4);
    setFlowHistory((prev) =>
      prev.map((entry) =>
        entry.date === today
          ? { ...entry, avg, family, friends, parties, outings, hasData: true }
          : entry
      )
    );
  }, [socialMetrics]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Detect voice API support ────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;
    const tts = "speechSynthesis" in window;
    const stt = "SpeechRecognition" in window || "webkitSpeechRecognition" in window;
    setVoiceSupport({ tts, stt });
    if (tts) synthRef.current = window.speechSynthesis;
  }, []);

  // ── Text-to-Speech helper ──────────────────────────────────────────────────
  // msgId is optional — when provided it lights up that message's replay button
  const speakText = useCallback((text, msgId = null) => {
    if (!voiceSupport.tts) return;
    // Allow replay even when global voice is off
    if (!voiceEnabled && msgId === null) return;
    // Cancel any ongoing speech first
    window.speechSynthesis.cancel();
    setSpeakingMsgId(msgId);
    const utter = new SpeechSynthesisUtterance(text);
    // Pick a pleasant voice if available
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Female") || v.name.includes("Google") || v.name.includes("Samantha"))
    ) || voices.find((v) => v.lang.startsWith("en"));
    if (preferred) utter.voice = preferred;
    utter.rate = 1.05;
    utter.pitch = 1.1;
    utter.volume = 1;
    utter.onend = () => setSpeakingMsgId(null);
    utter.onerror = () => setSpeakingMsgId(null);
    window.speechSynthesis.speak(utter);
  }, [voiceEnabled, voiceSupport.tts]);

  // ── Speech-to-Text helpers ─────────────────────────────────────────────────
  const startListening = useCallback(() => {
    if (!voiceSupport.stt || isListening) return;
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (e) => {
      const transcript = Array.from(e.results)
        .map((r) => r[0].transcript)
        .join("");
      setInputText(transcript);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceSupport.stt, isListening]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  // ── Persist metrics (write-through: API + localStorage) ───────────────────
  const persistMetrics = useCallback(async (newMetrics) => {
    // Always save to localStorage immediately
    localStorage.setItem("soc_metrics", JSON.stringify(newMetrics));
    setSaveStatus("saving");
    try {
      const res = await fetch("/api/social/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metrics: newMetrics }),
      });
      const data = await res.json();
      setSaveStatus(data.source === "db" ? "saved" : "local");
    } catch {
      setSaveStatus("local");
    }
    setTimeout(() => setSaveStatus("idle"), 2000);
  }, []);

  // ── Persist messages to localStorage ──────────────────────────────────────
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("soc_messages", JSON.stringify(messages));
    }
  }, [messages, isMounted]);

  // ── Persist activities to localStorage ────────────────────────────────────
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("soc_activities", JSON.stringify(activities));
    }
  }, [activities, isMounted]);

  // ── Auto-scroll chat ───────────────────────────────────────────────────────
  useEffect(() => {
    if (isMounted) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTyping, isMounted]);

  if (!isMounted) return null;

  // ── Open the activity modal for a metric ──────────────────────────────────
  const openModal = (cfg) => {
    setActiveModal({ ...cfg, value: socialMetrics[cfg.key] });
  };

  // ── Submit activity from modal ────────────────────────────────────────────
  const handleActivitySubmit = async ({ type, label, duration, notes }) => {
    setIsLoggingActivity(true);
    const bump = Math.min(20, 5 + Math.floor(duration / 10));

    let finalMetrics = socialMetrics;

    try {
      const res = await fetch("/api/social/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, label, duration, notes }),
      });
      const data = await res.json();

      // If DB saved, it already bumped metrics server-side; else bump locally
      if (data.source === "db" && data.metrics) {
        // Merge: cap at 100
        finalMetrics = {
          family: Math.min(100, data.metrics.family ?? socialMetrics.family),
          friends: Math.min(100, data.metrics.friends ?? socialMetrics.friends),
          parties: Math.min(100, data.metrics.parties ?? socialMetrics.parties),
          outings: Math.min(100, data.metrics.outings ?? socialMetrics.outings),
        };
      } else {
        finalMetrics = {
          ...socialMetrics,
          [type]: Math.min(100, socialMetrics[type] + bump),
        };
      }

      const newActivity = { type, label, duration, notes, loggedAt: new Date().toISOString() };
      setActivities((prev) => [newActivity, ...prev]);
    } catch {
      // Pure localStorage fallback
      finalMetrics = { ...socialMetrics, [type]: Math.min(100, socialMetrics[type] + bump) };
      const newActivity = { type, label, duration, notes, loggedAt: new Date().toISOString() };
      setActivities((prev) => [newActivity, ...prev]);
    }

    setSocialMetrics(finalMetrics);
    await persistMetrics(finalMetrics);

    // AI reaction to activity
    const cfg = METRIC_CONFIG.find((c) => c.key === type);
    setIsAiTyping(true);
    setIsLoggingActivity(false);
    setActiveModal(null);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/ai-companion", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `I just logged: ${label} (${duration} min) under ${type}. My current ${type} score is now ${finalMetrics[type]}%.`,
            metrics: finalMetrics,
            history: messages.slice(-4),
          }),
        });
        const data = await res.json();
        const aiText = data.text || `Great job! That ${type} activity just bumped your score by ${bump}%.`;
        setMessages((m) => [...m, {
          id: Date.now(),
          text: aiText,
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
        speakText(aiText);
      } catch {
        const fallbackText = `Logged! +${bump}% on your ${cfg?.label} score. Keep it up!`;
        setMessages((m) => [...m, {
          id: Date.now(),
          text: fallbackText,
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
        speakText(fallbackText);
      }
      setIsAiTyping(false);
    }, 800);
  };

  // ── Send chat message ──────────────────────────────────────────────────────
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isAiTyping) return;

    const userMsg = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");
    setIsAiTyping(true);

    try {
      const res = await fetch("/api/ai-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          metrics: socialMetrics,
          history: messages.slice(-6),
        }),
      });
      const data = await res.json();
      const aiReply = data.text || data.error || "I'm having trouble connecting right now.";
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: aiReply,
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
      speakText(aiReply);
    } catch {
      const errText = "Couldn't connect to AI. Is GEMINI_API_KEY set in .env.local?";
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        text: errText,
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
    setIsAiTyping(false);
  };

  // ── Derived chart values from real history ─────────────────────────────────
  const avgScore = Math.round(
    (socialMetrics.family + socialMetrics.friends + socialMetrics.parties + socialMetrics.outings) / 4
  );
  // Find the highest bar index so we can highlight it as the social peak
  const peakIndex = flowHistory.reduce(
    (best, entry, i) =>
      (entry.avg ?? -1) > (flowHistory[best]?.avg ?? -1) ? i : best,
    0
  );

  // ── Save indicator label ───────────────────────────────────────────────────
  const saveLabel = {
    idle: "",
    saving: "Saving…",
    saved: "✓ Saved to cloud",
    local: "Saved locally",
  }[saveStatus];

  return (
    <>
      {/* Activity Modal */}
      {activeModal && (
        <ActivityModal
          item={activeModal}
          onClose={() => setActiveModal(null)}
          onSubmit={handleActivitySubmit}
          isLoading={isLoggingActivity}
        />
      )}

      {/* Travel Goal Modal */}
      {travelModalActive && (
        <TravelGoalModal
          onClose={() => setTravelModalActive(false)}
          onSubmit={addGoal}
        />
      )}

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 pb-12">

        {/* Mobile Header */}
        <div className="lg:hidden col-span-1 flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tighter text-[#f9f9fd] font-headline">Socially</h2>
          {saveStatus !== "idle" && (
            <span className={`text-xs font-medium uppercase tracking-wider ${saveStatus === "saved" ? "text-emerald-400" : "text-white/40"}`}>
              {saveLabel}
            </span>
          )}
        </div>

        {/* ── LEFT: AI Companion ─────────────────────────────────────────── */}
        <section className="lg:col-span-5 flex flex-col h-[calc(100vh-12rem)] md:h-[650px]">
          <div className="bg-surface-container-high rounded-[2rem] p-6 flex flex-col h-full overflow-hidden relative border-b-2 border-outline-variant/10 shadow-2xl shadow-primary/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  {/* AI avatar — pulses while speaking */}
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center transition-all ${voiceEnabled && isAiTyping ? "ring-2 ring-primary ring-offset-2 ring-offset-surface-container-high animate-pulse" : ""
                    }`}>
                    <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-surface-container-high" />
                </div>
                <div>
                  <h2 className="font-headline font-bold text-on-surface">AI Companion</h2>
                  <p className="text-xs text-secondary-dim font-medium uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-secondary animate-ping" />
                    Analyzing Social Flow
                  </p>
                </div>
              </div>

              {/* Right controls: save indicator + voice toggle */}
              <div className="flex items-center gap-2">
                {saveStatus !== "idle" && (
                  <span className={`text-xs font-medium uppercase tracking-wider hidden lg:block ${saveStatus === "saved" ? "text-emerald-400" : "text-white/30"}`}>
                    {saveLabel}
                  </span>
                )}
                {/* TTS toggle — only show if browser supports it */}
                {voiceSupport.tts && (
                  <button
                    id="voice-toggle-btn"
                    onClick={() => {
                      if (voiceEnabled) window.speechSynthesis.cancel();
                      setVoiceEnabled((v) => !v);
                    }}
                    title={voiceEnabled ? "Mute AI voice" : "Unmute AI voice"}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${voiceEnabled
                      ? "bg-primary text-on-primary shadow-[0_0_12px_rgba(129,236,255,0.4)]"
                      : "bg-white/5 text-white/40 hover:text-white hover:bg-white/10"
                      }`}
                  >
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {voiceEnabled ? "volume_up" : "volume_off"}
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* Chat Feed */}
            <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-4 scrollbar-thin scrollbar-thumb-outline-variant/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 group ${msg.sender === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex-grow p-4 shadow-sm relative ${msg.sender === "ai"
                    ? "bg-surface-container rounded-r-xl rounded-bl-xl"
                    : "bg-primary/10 border-l-2 border-primary rounded-l-xl rounded-br-xl"
                    }`}>
                    <p className="font-body text-base leading-relaxed text-on-surface pr-6">{msg.text}</p>
                    <div className={`flex items-center mt-2 ${msg.sender === "user" ? "justify-end" : "justify-between"}`}>
                      <span className={`text-[10px] uppercase tracking-tighter ${msg.sender === "user" ? "text-primary" : "text-on-surface-variant"}`}>
                        {msg.time}
                      </span>

                      {/* Replay button — only on AI messages, only if TTS supported */}
                      {msg.sender === "ai" && voiceSupport.tts && (
                        <button
                          type="button"
                          onClick={() => speakText(msg.text, msg.id)}
                          title="Replay this message"
                          className={`ml-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${speakingMsgId === msg.id
                            ? "bg-primary text-on-primary shadow-[0_0_8px_rgba(129,236,255,0.5)]"
                            : "opacity-0 group-hover:opacity-100 bg-white/10 text-white/50 hover:text-white hover:bg-white/20"
                            }`}
                        >
                          <span
                            className="material-symbols-outlined text-sm"
                            style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}
                          >
                            {speakingMsgId === msg.id ? "graphic_eq" : "replay"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isAiTyping && (
                <div className="flex gap-3">
                  <div className="bg-surface-container rounded-r-xl rounded-bl-xl">
                    <TypingDots />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="mt-auto">
              <div className="relative">
                <input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isAiTyping || isListening}
                  className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant py-4 pl-6 pr-24 rounded-t-xl focus:ring-0 focus:border-primary transition-all font-body text-lg placeholder:text-on-surface-variant/40 disabled:opacity-60"
                  placeholder={
                    isListening ? "" :
                      isAiTyping ? "AI is thinking…" :
                        "Ask for social advice…"
                  }
                  type="text"
                />

                {/* Mic active: show waveform inside input */}
                {isListening && (
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <VoiceWaveform />
                    <span className="text-red-400 text-xs font-bold uppercase tracking-wider animate-pulse">Listening…</span>
                  </div>
                )}

                {/* Right-side buttons */}
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {/* Mic button — only if browser supports STT */}
                  {voiceSupport.stt && (
                    <button
                      id="mic-btn"
                      type="button"
                      onClick={isListening ? stopListening : startListening}
                      disabled={isAiTyping}
                      title={isListening ? "Stop listening" : "Speak your message"}
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${isListening
                        ? "bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.5)] animate-pulse"
                        : "text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-30"
                        }`}
                    >
                      <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isListening ? "mic_off" : "mic"}
                      </span>
                    </button>
                  )}

                  {/* Send button */}
                  <button
                    type="submit"
                    disabled={isAiTyping || !inputText.trim()}
                    className="w-9 h-9 rounded-full flex items-center justify-center material-symbols-outlined text-primary hover:bg-primary/10 transition-all disabled:opacity-30"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >send</button>
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* ── RIGHT: Metrics & Content ───────────────────────────────────── */}
        <section className="lg:col-span-7 flex flex-col gap-4 h-[calc(100vh-12rem)] md:h-[650px]">

          {/* Metric Cards — now open modal on click */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-shrink-0">
            {METRIC_CONFIG.map((item) => (
              <button
                key={item.key}
                onClick={() => openModal(item)}
                className="bg-surface-container-high p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center group hover:bg-surface-bright hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer border border-transparent hover:border-outline-variant/10 relative"
              >
                {/* Pulse ring on hover */}
                <div className={`absolute inset-0 rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity ${item.bg}`} />
                <span className={`material-symbols-outlined ${item.color} mb-2 text-3xl group-hover:scale-110 transition-transform relative z-10`}
                  style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold relative z-10">{item.label}</p>
                <p className={`font-headline text-2xl font-bold ${item.color} relative z-10`}>{socialMetrics[item.key]}%</p>
                <div className="w-full h-1 bg-surface-container rounded-full mt-2 overflow-hidden relative z-10">
                  <div className={`h-full transition-all duration-1000 ${item.bg.replace('/10', '')}`}
                    style={{ width: `${socialMetrics[item.key]}%` }} />
                </div>
                {/* Tap hint */}
                <p className="text-[9px] text-on-surface-variant/40 mt-1.5 uppercase tracking-wider relative z-10">
                  Tap to log
                </p>
              </button>
            ))}
          </div>

          {/* Today's Activity Log */}
          {activities.length > 0 && (
            <div className="bg-surface-container-low rounded-[2rem] p-5 shadow-xl flex-grow overflow-hidden flex flex-col max-h-[160px] flex-shrink-0">
              <h3 className="font-headline text-base font-bold text-on-surface mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>today</span>
                Today's Activities
                <span className="ml-auto text-xs text-on-surface-variant font-normal">{activities.length} logged</span>
              </h3>
              <div className="space-y-2 overflow-y-auto pr-1 flex-grow scrollbar-thin">
                {activities.slice(0, 8).map((act, i) => {
                  const cfg = METRIC_CONFIG.find((c) => c.key === act.type);
                  return (
                    <div key={i} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0 text-sm">
                      <span className={`material-symbols-outlined text-base ${cfg?.color}`}
                        style={{ fontVariationSettings: "'FILL' 1" }}>{cfg?.icon}</span>
                      <div className="flex-grow min-w-0">
                        <p className="text-sm text-on-surface font-medium truncate">{act.label}</p>
                        <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">{cfg?.label} · {act.duration} min</p>
                      </div>
                      <span className={`text-xs font-bold ${cfg?.color}`}>
                        +{Math.min(20, 5 + Math.floor(act.duration / 10))}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Emotional Flow Chart — Real History ───────────────────── */}
          <div className="bg-surface-container-low rounded-[2rem] p-6 relative overflow-hidden shadow-xl flex-grow flex flex-col justify-between min-h-[220px]">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(129,236,255,0.5)]" />

            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Emotional Flow</h3>
                <p className="font-body text-on-surface-variant italic mt-1">
                  {historyLoading
                    ? "Loading history…"
                    : `Social average today: ${avgScore}%`}
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-colors ${socialMetrics.outings > 50
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-error/10 text-error border-error/20"
                  }`}>
                  {socialMetrics.outings > 50 ? "DEPRESSION: LOW" : "DEPRESSION: AT RISK"}
                </span>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-colors ${socialMetrics.friends > 40
                  ? "bg-tertiary/10 text-tertiary border-tertiary/20"
                  : "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                  }`}>
                  {socialMetrics.friends > 40 ? "ANXIETY: STABLE" : "ANXIETY: ELEVATED"}
                </span>
              </div>
            </div>

            {/* Bars */}
            {historyLoading ? (
              /* Skeleton loader */
              <div className="flex-grow h-32 min-h-[80px] w-full flex items-end justify-between gap-1 animate-pulse">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i}
                    className="flex-grow rounded-t-full bg-surface-container-high"
                    style={{ height: `${20 + Math.random() * 40}%` }}
                  />
                ))}
              </div>
            ) : (
              <div className="flex-grow h-32 min-h-[80px] w-full flex items-end justify-between gap-1 mt-4">
                {flowHistory.map((entry, i) => {
                  const isToday = i === flowHistory.length - 1;
                  const isPeak = i === peakIndex && entry.hasData;
                  const height = entry.hasData ? Math.max(6, entry.avg) : 6;

                  const barColor = !entry.hasData
                    ? "bg-surface-container-high/40"
                    : isToday
                      ? "bg-gradient-to-t from-tertiary/30 to-tertiary border-t-2 border-tertiary shadow-[0_0_12px_rgba(255,197,99,0.25)]"
                      : isPeak
                        ? "bg-gradient-to-t from-primary/30 to-primary border-t-2 border-primary shadow-[0_0_12px_rgba(129,236,255,0.25)]"
                        : entry.avg >= 70
                          ? "bg-emerald-400/60 hover:bg-emerald-400/80"
                          : entry.avg >= 40
                            ? "bg-surface-container-high hover:bg-surface-bright"
                            : "bg-red-400/40 hover:bg-red-400/60";

                  return (
                    <div
                      key={entry.date}
                      style={{ height: `${height}%` }}
                      className={`flex-grow rounded-t-sm transition-all duration-700 relative group cursor-help ${barColor}`}
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 -translate-y-full bg-[#1a1d22] border border-white/10 px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 whitespace-nowrap shadow-2xl z-20 pointer-events-none">
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest mb-1">{entry.label}</p>
                        {entry.hasData ? (
                          <>
                            <p className="text-sm font-bold text-white">Avg: <span className="text-primary">{entry.avg}%</span></p>
                            <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1.5">
                              <span className="text-[10px] text-violet-400">Family {entry.family}%</span>
                              <span className="text-[10px] text-emerald-400">Friends {entry.friends}%</span>
                              <span className="text-[10px] text-amber-400">Parties {entry.parties}%</span>
                              <span className="text-[10px] text-sky-400">Outings {entry.outings}%</span>
                            </div>
                          </>
                        ) : (
                          <p className="text-[10px] text-white/30 italic">No data logged</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer legend */}
            <div className="mt-5 flex items-center justify-between text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              <span>{flowHistory[0]?.label || "11 Days Ago"}</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> High ≥70%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary" /> Peak Day</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary" /> Today</span>
              </div>
              <span>Today</span>
            </div>
          </div>
        </section>

        {/* ── FULL WIDTH BOTTOM: Travel Bucket List ───────────────────────── */}
        <section className="lg:col-span-12 mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-8">
            <div className="lg:col-span-8">
              <h3 className="font-headline text-5xl font-bold text-on-surface-variant/20 mb-4 leading-none select-none uppercase tracking-tighter">Wanderlust</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[30rem] overflow-y-auto pr-1 scrollbar-thin">
                {travelGoals.map((goal, i) => {
                  const getGoalImage = (title) => {
                    const t = title.toLowerCase();
                    if (t.includes("maldives")) return "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800";
                    if (t.includes("iceland")) return "https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?auto=format&fit=crop&q=80&w=800";
                    if (t.includes("kyoto") || t.includes("cherry")) return "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800";
                    if (t.includes("northern") || t.includes("aurora") || t.includes("lights")) return "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?auto=format&fit=crop&q=80&w=800";
                    return `https://images.unsplash.com/featured/800x600/?${encodeURIComponent(title)}`;
                  };

                  return (
                    <div key={`wander-${goal.id}-${i}`} className="group relative overflow-hidden rounded-[2.5rem] shadow-xl h-36">
                      <img
                        alt={goal.title}
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                        src={goal.imageUrl || getGoalImage(goal.title)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent group-hover:from-surface/40 transition-all flex flex-col justify-end p-6">
                        <h4 className="font-headline text-lg text-on-surface font-bold truncate">{goal.title}</h4>
                        <p className="text-xs text-on-surface-variant uppercase tracking-widest truncate">
                          {goal.statusDetail} {goal.type ? `· ${goal.type}` : ""}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-4 bg-surface-container-high rounded-[2rem] p-8 border border-outline-variant/10 self-stretch shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-headline text-2xl font-bold">Travel Goals</h3>
                  <button
                    onClick={() => setTravelModalActive(true)}
                    className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all"
                  >
                    <span className="material-symbols-outlined">add</span>
                  </button>
                </div>

                {travelGoals.length === 0 ? (
                  <p className="text-sm text-on-surface-variant/50 italic py-4 text-center">No travel goals set. Click '+' to add one!</p>
                ) : (
                  <ul className="space-y-6 max-h-[18rem] overflow-y-auto pr-1 scrollbar-thin">
                    {travelGoals.map((goal, idx) => (
                      <li key={`goal-${goal.id}-${idx}`} className="flex items-center gap-4 group">
                        <div className={`w-2 h-2 rounded-full transition-all ${goal.status === "Completed"
                          ? "bg-secondary shadow-[0_0_8px_#9df197]"
                          : "bg-outline-variant"
                          }`} />

                        <div className="flex-grow min-w-0">
                          <p className={`font-body text-lg text-on-surface transition-colors truncate ${goal.status === "Completed" ? "line-through decoration-primary/50 text-on-surface-variant/60" : "group-hover:text-primary"
                            }`}>{goal.title}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter truncate">
                            {goal.statusDetail} {goal.type ? `· ${goal.type}` : ''}
                          </p>
                        </div>

                        {/* Default visible status icon (hidden on hover) */}
                        <div className="group-hover:hidden flex items-center">
                          <span className={`material-symbols-outlined text-lg ${goal.status === "Completed" ? "text-secondary" : "text-on-surface-variant"
                            }`} style={goal.status === "Completed" ? { fontVariationSettings: "'FILL' 1" } : {}}>
                            {goal.status === "Completed" ? "check_circle" : "flight_takeoff"}
                          </span>
                        </div>

                        {/* Interactive actions appearing on hover */}
                        <div className="hidden group-hover:flex items-center gap-3 transition-opacity">
                          <button
                            onClick={() => toggleGoalStatus(goal.id)}
                            className="text-on-surface-variant hover:text-white transition-colors"
                            title={goal.status === "Completed" ? "Mark as Planned" : "Mark as Completed"}
                          >
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: `'FILL' ${goal.status === "Completed" ? 1 : 0}` }}>
                              check_circle
                            </span>
                          </button>

                          <button
                            onClick={() => deleteGoal(goal.id)}
                            className="text-error/70 hover:text-error transition-colors"
                            title="Delete goal"
                          >
                            <span className="material-symbols-outlined text-lg">delete</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="mt-8 pt-6 border-t border-outline-variant/15 text-center">
                <p className="font-body italic text-on-surface-variant text-sm">"Travel is the only thing you buy that makes you richer."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reset & Seed Buttons */}
        <div className="lg:col-span-12 text-center pt-8 border-t border-outline-variant/10 flex flex-wrap justify-center gap-6">
          <button
            onClick={() => {
              if (confirm("Seed demo data for testing? This will populate metrics, activities, and chat history.")) {
                const defaultMetrics = { family: 60, friends: 75, parties: 40, outings: 50 };
                const defaultActivities = [
                  { type: "family", label: "Sunday dinner with parents", duration: 90, notes: "Had a great home-cooked meal and caught up on life.", loggedAt: new Date().toISOString() },
                  { type: "friends", label: "Coffee meetup with Sarah", duration: 45, notes: "Nice chat about our upcoming travel plans.", loggedAt: new Date().toISOString() },
                  { type: "outings", label: "Solo sunset walk in the park", duration: 30, notes: "Felt very peaceful and refreshing.", loggedAt: new Date().toISOString() }
                ];
                const defaultMessages = [
                  { id: 1, text: "Welcome to Socially! Tap a metric card to log a real activity — I'll track your social balance and give you personalised insights.", sender: "ai", time: "JUST NOW" },
                  { id: 2, text: "Hey! I'm feeling a bit socially drained after the weekend, but I also feel like I haven't seen my family in a while.", sender: "user", time: "10 MINS AGO" },
                  { id: 3, text: "It's completely normal to feel drained, especially after busy weekend events. Balancing high-energy parties with low-energy family time or solo outings is key. Maybe you could call a family member for a quick catch-up? That way, you're maintaining the connection without exhausting yourself.", sender: "ai", time: "9 MINS AGO" },
                  { id: 4, text: "Good idea, I'll call my mom for a bit.", sender: "user", time: "5 MINS AGO" },
                  { id: 5, text: "Perfect! Let me know how it goes. I'll be here to track your progress and chat anytime.", sender: "ai", time: "4 MINS AGO" }
                ];
                const defaultTravelGoals = [
                  {
                    id: "1",
                    title: "Maldives Retreat",
                    type: "Solo Trip",
                    status: "Completed",
                    statusDetail: "Q4 2024"
                  },
                  {
                    id: "2",
                    title: "Icelandic Fjords",
                    type: "With Friends",
                    status: "Planned",
                    statusDetail: "Planned"
                  },
                  {
                    id: "3",
                    title: "Kyoto Cherry Blossom Tour",
                    type: "Solo Trip",
                    status: "Completed",
                    statusDetail: "Completed April '23"
                  },
                  {
                    id: "4",
                    title: "Northern Lights Expedition",
                    type: "With Friends",
                    status: "Budgeting",
                    statusDetail: "Winter 2025"
                  }
                ];
                localStorage.setItem("soc_metrics", JSON.stringify(defaultMetrics));
                localStorage.setItem("soc_activities", JSON.stringify(defaultActivities));
                localStorage.setItem("soc_messages", JSON.stringify(defaultMessages));
                localStorage.setItem("soc_travel_goals", JSON.stringify(defaultTravelGoals));
                localStorage.setItem("soc_initialized", "true");
                window.location.reload();
              }
            }}
            className="text-primary/70 hover:text-primary text-xs uppercase tracking-widest font-label transition-colors"
          >
            Seed Demo Data
          </button>

          <span className="text-white/10 hidden sm:inline">|</span>

          <button
            onClick={() => {
              if (confirm("Reset all social metrics, activities, and chat history to blank?")) {
                localStorage.removeItem("soc_metrics");
                localStorage.removeItem("soc_messages");
                localStorage.removeItem("soc_activities");
                localStorage.removeItem("soc_travel_goals");
                localStorage.setItem("soc_initialized", "blank");
                window.location.reload();
              }
            }}
            className="text-error/70 hover:text-error text-xs uppercase tracking-widest font-label transition-colors"
          >
            Reset to Blank
          </button>
        </div>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-24 md:hidden" />

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel flex justify-around items-center px-4 py-3 md:hidden z-50 bg-[#0c0e11]/80 backdrop-blur-xl border-t border-outline-variant/10">
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/"><span className="material-symbols-outlined text-2xl">dashboard</span><span className="text-[10px] font-label">Home</span></a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/mentally"><span className="material-symbols-outlined text-2xl">psychology</span><span className="text-[10px] font-label">Mind</span></a>
        <div className="relative -top-6">
          <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dim rounded-full shadow-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-3xl">bolt</span>
          </button>
        </div>
        <a className="flex flex-col items-center gap-1 text-primary" href="/socially">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          <span className="text-[10px] font-label">Social</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/goals"><span className="material-symbols-outlined text-2xl">target</span><span className="text-[10px] font-label">Goals</span></a>
      </nav>
    </>
  );
}
