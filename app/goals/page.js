export const metadata = {
  title: "Goals - Focus Reset",
};

export default function GoalsPage() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tighter text-on-surface mb-2">Intentional Mapping.</h1>
            <p className="font-body text-2xl text-on-surface-variant max-w-2xl leading-relaxed">
              Structure your future across the four essential quadrants of a resilient life.
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-surface-container-high p-4 rounded-xl flex items-center gap-4 border-l-4 border-primary">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Active Objectives</p>
                <p className="text-3xl font-bold font-headline text-primary">12</p>
              </div>
            </div>
            <div className="bg-surface-container-high p-4 rounded-xl flex items-center gap-4 border-l-4 border-secondary">
              <div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Completed</p>
                <p className="text-3xl font-bold font-headline text-secondary">84%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Four Quadrants Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Mentally Quadrant */}
          <section className="bg-surface-container rounded-3xl overflow-hidden shadow-2xl transition-all hover:bg-surface-container-high group">
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-4xl">psychology</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-headline text-on-surface">Mentally</h3>
                    <p className="text-sm text-on-surface-variant">Clarity & Cognitive Growth</p>
                  </div>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-outline-variant/20" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                    <circle className="text-primary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175" strokeDashoffset="40" strokeWidth="4"></circle>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-headline">75%</span>
                </div>
              </div>
              <div className="space-y-6 flex-grow">
                {/* Focus Objective */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Focus Objective (Short-Term)</span>
                    <span className="text-xs text-primary font-bold italic">Due in 4 days</span>
                  </div>
                  <div className="bg-surface-container-lowest/40 rounded-xl p-5 border-l-2 border-primary">
                    <p className="font-body text-xl text-on-surface mb-2 italic">"Complete the first 10 modules of the System Architecture course."</p>
                    <div className="w-full h-1 bg-outline-variant/20 rounded-full mt-4">
                      <div className="h-full bg-primary rounded-full" style={{ width: "60%" }}></div>
                    </div>
                  </div>
                </div>
                {/* Life Vision */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">Life Vision (Long-Term)</span>
                  <div className="bg-surface-container-lowest/40 rounded-xl p-5 border-l-2 border-outline-variant/30">
                    <p className="font-body text-xl text-on-surface">"To achieve a state of flow that allows for deep polymathic expertise in both arts and logic."</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 text-sm font-bold text-primary flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Edit Quadrant <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Financially Quadrant */}
          <section className="bg-surface-container rounded-3xl overflow-hidden shadow-2xl transition-all hover:bg-surface-container-high group">
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-4xl">payments</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-headline text-on-surface">Financially</h3>
                    <p className="text-sm text-on-surface-variant">Autonomy & Resource Depth</p>
                  </div>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-outline-variant/20" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                    <circle className="text-tertiary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175" strokeDashoffset="120" strokeWidth="4"></circle>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-headline">32%</span>
                </div>
              </div>
              <div className="space-y-6 flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Focus Objective (Short-Term)</span>
                    <span className="text-xs text-tertiary font-bold italic">Due in 12 days</span>
                  </div>
                  <div className="bg-surface-container-lowest/40 rounded-xl p-5 border-l-2 border-tertiary">
                    <p className="font-body text-xl text-on-surface mb-2 italic">"Allocate $2,500 to the diversified index portfolio."</p>
                    <div className="w-full h-1 bg-outline-variant/20 rounded-full mt-4">
                      <div className="h-full bg-tertiary rounded-full" style={{ width: "33%" }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">Life Vision (Long-Term)</span>
                  <div className="bg-surface-container-lowest/40 rounded-xl p-5 border-l-2 border-outline-variant/30">
                    <p className="font-body text-xl text-on-surface">"Zero debt by age 40 with a passive income stream that covers all baseline biological needs."</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 text-sm font-bold text-tertiary flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Edit Quadrant <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Socially Quadrant */}
          <section className="bg-surface-container rounded-3xl overflow-hidden shadow-2xl transition-all hover:bg-surface-container-high group">
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined text-4xl">smart_toy</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-headline text-on-surface">Socially</h3>
                    <p className="text-sm text-on-surface-variant">Community & Intentional Presence</p>
                  </div>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-outline-variant/20" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                    <circle className="text-secondary" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175" strokeDashoffset="80" strokeWidth="4"></circle>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-headline">54%</span>
                </div>
              </div>
              <div className="space-y-6 flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Focus Objective (Short-Term)</span>
                    <span className="text-xs text-secondary font-bold italic">This Week</span>
                  </div>
                  <div className="bg-surface-container-lowest/40 rounded-xl p-5 border-l-2 border-secondary">
                    <p className="font-body text-xl text-on-surface mb-2 italic">"Host an analog dinner with four friends—no digital devices allowed."</p>
                    <div className="w-full h-1 bg-outline-variant/20 rounded-full mt-4">
                      <div className="h-full bg-secondary rounded-full" style={{ width: "50%" }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">Life Vision (Long-Term)</span>
                  <div className="bg-surface-container-lowest/40 rounded-xl p-5 border-l-2 border-outline-variant/30">
                    <p className="font-body text-xl text-on-surface">"To be a pillar in a high-trust local community, fostering environments of genuine dialogue."</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 text-sm font-bold text-secondary flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Edit Quadrant <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </section>

          {/* Physically Quadrant */}
          <section className="bg-surface-container rounded-3xl overflow-hidden shadow-2xl transition-all hover:bg-surface-container-high group">
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-error/10 flex items-center justify-center text-error">
                    <span className="material-symbols-outlined text-4xl">fitness_center</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-headline text-on-surface">Physically</h3>
                    <p className="text-sm text-on-surface-variant">Vitality & Sensory Resilience</p>
                  </div>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-outline-variant/20" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeWidth="4"></circle>
                    <circle className="text-error" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" strokeDasharray="175" strokeDashoffset="20" strokeWidth="4"></circle>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold font-headline">88%</span>
                </div>
              </div>
              <div className="space-y-6 flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">Focus Objective (Short-Term)</span>
                    <span className="text-xs text-error font-bold italic">Ongoing</span>
                  </div>
                  <div className="bg-surface-container-lowest/40 rounded-xl p-5 border-l-2 border-error">
                    <p className="font-body text-xl text-on-surface mb-2 italic">"Complete the 30-day mobility challenge."</p>
                    <div className="w-full h-1 bg-outline-variant/20 rounded-full mt-4">
                      <div className="h-full bg-error rounded-full" style={{ width: "88%" }}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-3 block">Life Vision (Long-Term)</span>
                  <div className="bg-surface-container-lowest/40 rounded-xl p-5 border-l-2 border-outline-variant/30">
                    <p className="font-body text-xl text-on-surface">"To maintain a body capable of spontaneous athletic adventure into my late 70s."</p>
                  </div>
                </div>
              </div>
              <button className="mt-8 text-sm font-bold text-error flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                Edit Quadrant <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </section>
        </div>

        {/* Focus Reflection Sheet (Bento Pattern) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-surface-container-high rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <span className="material-symbols-outlined text-[12rem]">format_quote</span>
            </div>
            <div className="relative z-10">
              <h4 className="text-xs font-bold uppercase tracking-widest text-primary mb-6">Reflection Note</h4>
              <p className="font-body text-3xl leading-snug text-on-surface mb-8">
                "The Financial quadrant currently feels the most misaligned. I need to pivot my short-term focus toward resource preservation rather than expansion."
              </p>
              <div className="flex items-center gap-4">
                <button className="bg-surface-bright px-6 py-3 rounded-full text-sm font-bold hover:bg-surface-variant transition-colors border border-outline-variant/20">
                  Update Reflection
                </button>
                <span className="text-on-surface-variant text-sm italic">Last updated: 3 hours ago</span>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-surface-container-high to-surface-container-lowest rounded-3xl p-8 flex flex-col justify-between border border-outline-variant/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4">Alignment Score</h4>
            <div className="flex flex-col items-center">
              <div className="text-7xl font-extrabold font-headline text-secondary mb-2 tracking-tighter">92%</div>
              <p className="text-center text-on-surface-variant font-body italic px-4">Your actions this week are highly congruent with your long-term visions.</p>
            </div>
            <button className="w-full mt-6 py-3 text-primary border border-primary/20 rounded-xl hover:bg-primary/5 transition-colors font-bold text-sm">
              View Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dim shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center text-on-primary group hover:scale-110 transition-transform md:hidden z-50">
        <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
      </button>
      
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
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/socially">
          <span className="material-symbols-outlined text-2xl" data-icon="smart_toy">smart_toy</span>
          <span className="text-[10px] font-label">Social</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-primary" href="/goals">
          <span className="material-symbols-outlined text-2xl" data-icon="target" style={{ fontVariationSettings: "'FILL' 1" }}>target</span>
          <span className="text-[10px] font-label font-bold">Goals</span>
        </a>
      </nav>
    </>
  );
}
