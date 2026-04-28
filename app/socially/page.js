export const metadata = {
  title: "Socially - Focus Reset",
};

export default function SociallyPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Mobile Header Title */}
        <div className="lg:hidden col-span-1">
           <h2 className="text-3xl font-bold tracking-tighter text-[#f9f9fd] font-headline">Socially</h2>
        </div>

        {/* Left Side: AI Companion Interface */}
        <section className="lg:col-span-5 flex flex-col h-[calc(100vh-12rem)] md:h-[600px]">
          <div className="bg-surface-container-high rounded-[2rem] p-6 flex flex-col h-full overflow-hidden relative border-b-2 border-outline-variant/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-surface-container-high"></div>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-on-surface">AI Companion</h2>
                  <p className="text-xs text-secondary-dim font-medium uppercase tracking-widest">Active Suggestion Mode</p>
                </div>
              </div>
              <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface">more_vert</button>
            </div>
            
            {/* Chat Feed */}
            <div className="flex-grow overflow-y-auto space-y-6 pr-2 mb-4">
              <div className="flex gap-3">
                <div className="flex-grow bg-surface-container rounded-r-xl rounded-bl-xl p-4">
                  <p className="font-body text-lg leading-relaxed text-on-surface">Good afternoon. I noticed your social meter is dipping. You haven't seen Sarah in 12 days. Would you like me to draft a quick catch-up text?</p>
                  <span className="text-[10px] text-on-surface-variant mt-2 block uppercase tracking-tighter">12:04 PM</span>
                </div>
              </div>
              <div className="flex gap-3 flex-row-reverse">
                <div className="flex-grow bg-primary/10 border-l-2 border-primary rounded-l-xl rounded-br-xl p-4">
                  <p className="font-body text-lg leading-relaxed text-on-surface">That sounds good. Maybe suggest that new coffee spot on 5th?</p>
                  <span className="text-[10px] text-primary mt-2 block text-right uppercase tracking-tighter">12:05 PM</span>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-grow bg-surface-container rounded-r-xl rounded-bl-xl p-4">
                  <p className="font-body text-lg leading-relaxed text-on-surface">Drafted: "Hey Sarah! Thinking of you. Want to grab a brew at 'The Roasted Bean' this Saturday morning?" Shall I send?</p>
                  <div className="mt-3 flex gap-2">
                    <button className="px-4 py-2 bg-primary/20 text-primary text-xs rounded-full font-bold hover:bg-primary/30 transition-colors">Send Now</button>
                    <button className="px-4 py-2 bg-surface-bright text-on-surface-variant text-xs rounded-full font-bold hover:bg-surface-variant transition-colors">Edit</button>
                  </div>
                </div>
              </div>
              
              {/* Insight Card */}
              <div className="bg-surface-container-low rounded-[1rem] border border-outline-variant/10 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-tertiary text-sm">lightbulb</span>
                  <span className="text-xs font-bold text-tertiary uppercase">Proactive Suggestion</span>
                </div>
                <p className="text-sm font-body italic text-on-surface-variant">"Your mental health data shows higher anxiety after long periods of isolation. Booking one social outing this weekend could reduce next week's stress by 15%."</p>
              </div>
            </div>
            
            {/* Input Area */}
            <div className="mt-auto">
              <div className="relative">
                <input className="w-full bg-surface-container-low border-none border-b-2 border-outline-variant py-4 px-6 rounded-t-xl focus:ring-0 focus:border-primary transition-all font-body text-lg placeholder:text-on-surface-variant/40" placeholder="Tell me what's on your mind..." type="text" />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>send</button>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Metrics & Content */}
        <section className="lg:col-span-7 space-y-8">
          {/* Social Activities Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-surface-container-high p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center group hover:bg-surface-bright transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl">family_history</span>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Family</p>
              <p className="font-headline text-xl text-on-surface">85%</p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center group hover:bg-surface-bright transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-secondary mb-2 text-3xl">groups</span>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Friends</p>
              <p className="font-headline text-xl text-on-surface">42%</p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center group hover:bg-surface-bright transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-tertiary mb-2 text-3xl">celebration</span>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Parties</p>
              <p className="font-headline text-xl text-on-surface">12%</p>
            </div>
            <div className="bg-surface-container-high p-4 rounded-[1.5rem] flex flex-col items-center justify-center text-center group hover:bg-surface-bright transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-error mb-2 text-3xl">hiking</span>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Outings</p>
              <p className="font-headline text-xl text-on-surface">60%</p>
            </div>
          </div>

          {/* Mood Tracker & Mental Health Trends */}
          <div className="bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary shadow-[0_0_15px_rgba(129,236,255,0.5)]"></div>
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="font-headline text-3xl font-bold text-on-surface tracking-tight">Emotional Flow</h3>
                <p className="font-body text-on-surface-variant italic">Reflecting on the last 7 days</p>
              </div>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded-full border border-primary/20">DEPRESSION: LOW</span>
                <span className="px-3 py-1 bg-tertiary/10 text-tertiary text-[10px] font-bold rounded-full border border-tertiary/20">ANXIETY: MODERATE</span>
              </div>
            </div>
            
            <div className="h-48 w-full flex items-end justify-between gap-1">
              {/* Simulated Chart Bars */}
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[30%] relative group">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-surface-bright px-2 py-1 rounded text-[8px] opacity-0 group-hover:opacity-100 transition-opacity">Mon</div>
              </div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[45%]"></div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[60%]"></div>
              <div className="flex-grow bg-primary/40 rounded-t-full h-[85%] border-t-4 border-primary"></div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[55%]"></div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[40%]"></div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[25%]"></div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[35%]"></div>
              <div className="flex-grow bg-tertiary/40 rounded-t-full h-[90%] border-t-4 border-tertiary"></div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[50%]"></div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[45%]"></div>
              <div className="flex-grow bg-surface-container-high rounded-t-full h-[40%]"></div>
            </div>
            <div className="mt-6 flex items-center justify-between text-[10px] text-on-surface-variant font-bold tracking-widest uppercase">
              <span>Previous Week</span>
              <div className="flex gap-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Mood Peak</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tertiary"></span> Social Peak</span>
              </div>
              <span>Current</span>
            </div>
          </div>

          {/* Travel & Tours Bucket List (Editorial Asymmetry) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div>
              <h3 className="font-headline text-5xl font-bold text-on-surface-variant/20 mb-4 leading-none select-none uppercase">Wanderlust</h3>
              <div className="space-y-4">
                <div className="group relative overflow-hidden rounded-[2rem]">
                  <img alt="Maldives lagoon" className="w-full h-40 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEkTut901jIdgQMTqH9Rz_Wlk3pfxRoLtoz0NCBsHqtmuqNsEchx6FkMqWimIHW0lXGnvjwIgbt82_4OD9LIdPFUP2kHvMVgmBQ0fKrE-_WuWGsTeeMcp5RXUvhSXv7We5acrS_hNiLvqb9HYZ7f8Ll_j10aPZKyq3DKz2DqJkQwp88Iv67Mk3UNEbjs5KqPgpf0HfDvtgVu6rDEAubJzu8qdtN0bqI72PWnB11DE74_f9T0KRgYZ9OwThx5Jt71luDvKrPrKcjTBY" />
                  <div className="absolute inset-0 bg-surface/60 group-hover:bg-surface/20 transition-all flex flex-col justify-end p-6">
                    <h4 className="font-headline text-xl text-on-surface font-bold">Maldives Retreat</h4>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Q4 2024 • Solo Trip</p>
                  </div>
                </div>
                <div className="group relative overflow-hidden rounded-[2rem]">
                  <img alt="Icelandic landscape" className="w-full h-32 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN3Th3yV1zVT_9pJah6Qob_CDLm72uZPZeEHZp8sQDq5KerF59eWSo-KoxtqqQcYCC9qbjdl8aGqYqOS_1XNDH3SEuB_RlIBXgd6kpZXg5-svMo_LvM7gKEill1x4OVFl6jm_jcK1VchCyoh4mqpwK9JvWMu2NNjmfTaisHW6OQ56KYJrnA8ig8diHXLwljx0b0-RyUv8WTh6j2JThfkIkHcr12bQP4I4CAkBQa7XdQ73dlphcaQoQh6BFZCG0VUC6kXX64dVGZNUl" />
                  <div className="absolute inset-0 bg-surface/60 group-hover:bg-surface/20 transition-all flex flex-col justify-end p-6">
                    <h4 className="font-headline text-xl text-on-surface font-bold">Icelandic Fjords</h4>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Planned • With Friends</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-surface-container-high rounded-[2rem] p-8 border border-outline-variant/10 self-stretch">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-headline text-2xl font-bold">Bucket List</h3>
                <button className="material-symbols-outlined text-primary">add_circle</button>
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
                <li className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-outline-variant"></div>
                  <div className="flex-grow">
                    <p className="font-body text-lg text-on-surface group-hover:text-primary transition-colors">Digital Detox in Tuscany</p>
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-tighter">Next Milestone: Research Accommodations</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant">spa</span>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-outline-variant/15 text-center">
                <p className="font-body italic text-on-surface-variant text-sm">"Adventure is the soul's primary nourishment."</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Spacer for mobile nav */}
      <div className="h-24 md:hidden"></div>
      
      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel flex justify-around items-center px-4 py-3 md:hidden z-50 bg-[#0c0e11]/80 backdrop-blur-xl">
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/">
          <span className="material-symbols-outlined text-2xl" data-icon="dashboard">dashboard</span>
          <span className="text-[10px] font-label">Home</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/mentally">
          <span className="material-symbols-outlined text-2xl" data-icon="psychology">psychology</span>
          <span className="text-[10px] font-label">Mind</span>
        </a>
        <div className="relative -top-6">
          <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dim rounded-full shadow-lg flex items-center justify-center text-on-primary">
            <span className="material-symbols-outlined text-3xl" data-icon="payments">payments</span>
          </button>
        </div>
        <a className="flex flex-col items-center gap-1 text-primary" href="/socially">
          <span className="material-symbols-outlined text-2xl" data-icon="smart_toy">smart_toy</span>
          <span className="text-[10px] font-label">Social</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/goals">
          <span className="material-symbols-outlined text-2xl" data-icon="target">target</span>
          <span className="text-[10px] font-label">Goals</span>
        </a>
      </nav>
    </>
  );
}
