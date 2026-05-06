"use client";
import { useState, useEffect, useRef } from "react";

export default function SociallyPage() {
  const [socialMetrics, setSocialMetrics] = useState({
    family: 0,
    friends: 0,
    parties: 0,
    outings: 0
  });

  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome to Socially. I'll be monitoring your social flow to help maintain your mental wellbeing. Log an activity to get started!", sender: "ai", time: "JUST NOW" },
  ]);
  
  const [inputText, setInputText] = useState("");
  const chatEndRef = useRef(null);

  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    setIsMounted(true);
    const savedMetrics = localStorage.getItem("soc_metrics");
    const savedMessages = localStorage.getItem("soc_messages");
    if (savedMetrics) setSocialMetrics(JSON.parse(savedMetrics));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("soc_metrics", JSON.stringify(socialMetrics));
      localStorage.setItem("soc_messages", JSON.stringify(messages));
    }
  }, [socialMetrics, messages, isMounted]);

  // Scroll to bottom
  useEffect(() => {
    if (isMounted) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isMounted]);

  if (!isMounted) return null;

  const updateMetric = (key) => {
    setSocialMetrics(prev => ({
      ...prev,
      [key]: Math.min(100, prev[key] + 5)
    }));
    
    // Add AI response occasionally
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const aiMsg = {
          id: Date.now(),
          text: `Great job focusing on your ${key} connections! Balance is key to emotional stability.`,
          sender: "ai",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(m => [...m, aiMsg]);
      }, 1000);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText("");

    try {
      const response = await fetch("/api/ai-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: inputText,
          metrics: socialMetrics,
          history: messages.slice(-5) // Send last 5 messages for context
        })
      });

      const data = await response.json();
      
      const aiMsg = {
        id: Date.now() + 1,
        text: data.text || data.error || "I'm having trouble connecting right now.",
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = {
        id: Date.now() + 1,
        text: "Sorry, I couldn't connect to my brain. Is the API key set up?",
        sender: "ai",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  // Generate "Emotional Flow" bars based on social metrics
  const generateFlow = () => {
    const base = (socialMetrics.family + socialMetrics.friends + socialMetrics.parties + socialMetrics.outings) / 4;
    return Array.from({ length: 12 }).map((_, i) => {
      // Add some noise to make it look like a chart
      const noise = Math.sin(i * 0.8) * 15;
      const height = Math.max(15, Math.min(95, base + noise + (i === 11 ? 10 : 0)));
      return height;
    });
  };

  const flowBars = generateFlow();

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 pb-12">
        
        {/* Mobile Header Title */}
        <div className="lg:hidden col-span-1">
           <h2 className="text-3xl font-bold tracking-tighter text-[#f9f9fd] font-headline">Socially</h2>
        </div>

        {/* Left Side: AI Companion Interface */}
        <section className="lg:col-span-5 flex flex-col h-[calc(100vh-12rem)] md:h-[650px]">
          <div className="bg-surface-container-high rounded-[2rem] p-6 flex flex-col h-full overflow-hidden relative border-b-2 border-outline-variant/10 shadow-2xl shadow-primary/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-surface-container-high"></div>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-on-surface">AI Companion</h2>
                  <p className="text-xs text-secondary-dim font-medium uppercase tracking-widest flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-secondary animate-ping"></span>
                    Analyzing Social Flow
                  </p>
                </div>
              </div>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">settings</button>
            </div>
            
            {/* Chat Feed */}
            <div className="flex-grow overflow-y-auto space-y-6 pr-2 mb-4 scrollbar-thin scrollbar-thumb-outline-variant/20">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-grow p-4 shadow-sm ${
                    msg.sender === 'ai' 
                      ? 'bg-surface-container rounded-r-xl rounded-bl-xl' 
                      : 'bg-primary/10 border-l-2 border-primary rounded-l-xl rounded-br-xl'
                  }`}>
                    <p className="font-body text-base leading-relaxed text-on-surface">{msg.text}</p>
                    <span className={`text-[10px] mt-2 block uppercase tracking-tighter ${msg.sender === 'user' ? 'text-primary text-right' : 'text-on-surface-variant'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
              

            </div>
            
            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="mt-auto">
              <div className="relative">
                <input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant py-4 px-6 rounded-t-xl focus:ring-0 focus:border-primary transition-all font-body text-lg placeholder:text-on-surface-variant/40" 
                  placeholder="Ask for social advice..." 
                  type="text" 
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary hover:scale-110 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>send</button>
              </div>
            </form>
          </div>
        </section>

        {/* Right Side: Metrics & Content */}
        <section className="lg:col-span-7 space-y-8">
          {/* Social Activities Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { key: 'family', label: 'Family', icon: 'family_history', color: 'text-primary' },
              { key: 'friends', label: 'Friends', icon: 'groups', color: 'text-secondary' },
              { key: 'parties', label: 'Parties', icon: 'celebration', color: 'text-tertiary' },
              { key: 'outings', label: 'Outings', icon: 'hiking', color: 'text-error' }
            ].map((item) => (
              <div 
                key={item.key}
                onClick={() => updateMetric(item.key)}
                className="bg-surface-container-high p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center group hover:bg-surface-bright hover:shadow-lg hover:shadow-primary/5 transition-all cursor-pointer border border-transparent hover:border-outline-variant/10"
              >
                <span className={`material-symbols-outlined ${item.color} mb-2 text-3xl group-hover:scale-110 transition-transform`}>{item.icon}</span>
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">{item.label}</p>
                <p className="font-headline text-2xl font-bold text-on-surface">{socialMetrics[item.key]}%</p>
                <div className="w-full h-1 bg-surface-container rounded-full mt-2 overflow-hidden">
                  <div className={`h-full transition-all duration-1000 ${item.color.replace('text-', 'bg-')}`} style={{ width: `${socialMetrics[item.key]}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Mood Tracker & Mental Health Trends */}
          <div className="bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(129,236,255,0.5)]"></div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Emotional Flow</h3>
                <p className="font-body text-on-surface-variant italic">Reflected by your social balance</p>
              </div>
              <div className="flex gap-2">
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-colors ${socialMetrics.outings > 50 ? 'bg-primary/10 text-primary border-primary/20' : 'bg-error/10 text-error border-error/20'}`}>
                  {socialMetrics.outings > 50 ? 'DEPRESSION: LOW' : 'DEPRESSION: AT RISK'}
                </span>
                <span className={`px-3 py-1 text-[10px] font-bold rounded-full border transition-colors ${socialMetrics.friends > 40 ? 'bg-tertiary/10 text-tertiary border-tertiary/20' : 'bg-warning/10 text-warning border-warning/20'}`}>
                  {socialMetrics.friends > 40 ? 'ANXIETY: STABLE' : 'ANXIETY: ELEVATED'}
                </span>
              </div>
            </div>
            
            <div className="h-48 w-full flex items-end justify-between gap-1 mt-10">
              {flowBars.map((height, i) => (
                <div 
                  key={i} 
                  style={{ height: `${height}%` }}
                  className={`flex-grow rounded-t-full transition-all duration-1000 relative group cursor-help ${
                    i === 11 ? 'bg-gradient-to-t from-tertiary/20 to-tertiary border-t-4 border-tertiary shadow-[0_0_15px_rgba(255,197,99,0.2)]' : 
                    i === 3 ? 'bg-gradient-to-t from-primary/20 to-primary border-t-4 border-primary shadow-[0_0_15px_rgba(129,236,255,0.2)]' : 'bg-surface-container-high hover:bg-surface-bright'
                  }`}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface-bright px-3 py-1.5 rounded-xl text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap shadow-2xl border border-outline-variant/10 z-20">
                    <span className="text-primary">{Math.round(height)}%</span> {i === 11 ? 'Today' : `Day ${i+1}`}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-between text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              <span>7 Days Ago</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Mood Trend</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Social Peak</span>
              </div>
              <span>Today</span>
            </div>
          </div>

          {/* Travel & Tours Bucket List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start pb-8">
            <div>
              <h3 className="font-headline text-5xl font-bold text-on-surface-variant/20 mb-4 leading-none select-none uppercase tracking-tighter">Wanderlust</h3>
              <div className="space-y-4">
                <div className="group relative overflow-hidden rounded-[2.5rem] shadow-xl">
                  <img alt="Maldives lagoon" className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" src="https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent group-hover:from-surface/40 transition-all flex flex-col justify-end p-6">
                    <h4 className="font-headline text-xl text-on-surface font-bold">Maldives Retreat</h4>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Q4 2024 • Solo Trip</p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-[2.5rem] shadow-xl">
                  <img alt="Icelandic landscape" className="w-full h-32 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" src="https://images.unsplash.com/photo-1504109586057-7a2ae83d1338?auto=format&fit=crop&q=80&w=800" />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-transparent group-hover:from-surface/40 transition-all flex flex-col justify-end p-6">
                    <h4 className="font-headline text-xl text-on-surface font-bold">Icelandic Fjords</h4>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Planned • With Friends</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-[2rem] p-8 border border-outline-variant/10 self-stretch shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-2xl font-bold">Travel Goals</h3>
                <button className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all">
                  <span className="material-symbols-outlined">add</span>
                </button>
              </div>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-secondary shadow-[0_0_8px_#9df197]"></div>
                  <div className="flex-grow">
                    <p className="font-body text-lg text-on-surface line-through decoration-primary/50">Kyoto Cherry Blossom Tour</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Completed April '23</p>
                  </div>
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </li>
                <li className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                  <div className="flex-grow">
                    <p className="font-body text-lg text-on-surface group-hover:text-primary transition-colors">Northern Lights Expedition</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Budgeting Stage: $1,200/4,000</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">flight_takeoff</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-outline-variant/15 text-center">
                <p className="font-body italic text-on-surface-variant text-sm">"Travel is the only thing you buy that makes you richer."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reset Data Button */}
        <div className="lg:col-span-12 text-center pt-8 border-t border-outline-variant/10">
          <button 
            onClick={() => {
              if(confirm("Are you sure you want to reset all social metrics and chat history?")) {
                localStorage.removeItem("soc_metrics");
                localStorage.removeItem("soc_messages");
                window.location.reload();
              }
            }}
            className="text-error/70 hover:text-error text-xs uppercase tracking-widest font-label transition-colors"
          >
            Reset Socially Data
          </button>
        </div>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-24 md:hidden"></div>
      
      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel flex justify-around items-center px-4 py-3 md:hidden z-50 bg-[#0c0e11]/80 backdrop-blur-xl border-t border-outline-variant/10">
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/">
          <span className="material-symbols-outlined text-2xl">dashboard</span>
          <span className="text-[10px] font-label">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/mentally">
          <span className="material-symbols-outlined text-2xl">psychology</span>
          <span className="text-[10px] font-label">Mind</span>
        </a>
        <div className="relative -top-6">
          <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dim rounded-full shadow-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-3xl">bolt</span>
          </button>
        </div>
        <a className="flex flex-col items-center gap-1 text-primary" href="/socially">
          <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
          <span className="text-[10px] font-label">Social</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/goals">
          <span className="material-symbols-outlined text-2xl">target</span>
          <span className="text-[10px] font-label">Goals</span>
        </a>
      </nav>
    </>
  );
}
