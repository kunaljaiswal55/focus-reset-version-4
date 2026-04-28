export const metadata = {
  title: "Mentally Tracker - Focus Reset",
};

export default function MentallyPage() {
  return (
    <>
      <div className="px-10 py-8 max-w-7xl mx-auto">
        {/* Hero Header Section */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-2">
            <div>
              <span className="text-primary font-headline text-sm tracking-widest uppercase mb-2 block">Cognitive Center</span>
              <h1 className="text-5xl font-headline font-bold text-on-surface tracking-tighter">Mentally</h1>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-end">
                <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Focus Level</span>
                <span className="text-2xl font-headline font-bold text-secondary">Optimal</span>
              </div>
            </div>
          </div>
          <p className="font-body text-2xl text-on-surface-variant max-w-2xl leading-relaxed italic">
            Deepen your concentration. Track your learning progress through the curated academy and maintain your digital sanctuary for intellectual growth.
          </p>
        </section>

        {/* Bento Layout Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* YouTube Study Lecture Section (Left Column) */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <div className="bg-surface-container rounded-[2rem] overflow-hidden border border-outline-variant/5 group shadow-2xl">
              <div className="relative aspect-video w-full">
                <img className="w-full h-full object-cover" alt="cinematic wide shot of a futuristic dark abstract architecture with glowing cyan geometric lines and atmospheric mist" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1YUni65dHtEw4_Ns2xsGjFngMpM2c4xbSpTZu5fZZle-jompLt21KaOWBbX-6mLRCDZpSbIFWO9fQF7oCueuDctssbdjETYs83P6Ap051q34PN3iYxOOg-Ww258BXYp0Ee4fZaIjH94f69soU-KrBd-JAgDXNmfhODiK-9_ewPZ5gSC9yQfKXMk6yMv0GE6yA4JwDZKgmEGPGAGCHXyl4u6DjDY8xCn0XrmjXzRqCuDPBDMtalgAHYnN_obtm0jNIfe6JFOsNWupo" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent opacity-80"></div>
                <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-error px-2 py-0.5 rounded text-[10px] font-bold text-on-error uppercase tracking-tighter">Live Session</span>
                      <span className="text-on-surface-variant text-xs font-label">24:18 / 1:45:00</span>
                    </div>
                    <h3 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Advanced Cognitive Psychology: Neural Plasticity</h3>
                    <p className="text-on-surface-variant text-sm font-label mt-1">Academy Series • Dr. Aris Thorne</p>
                  </div>
                  <button className="bg-primary text-on-primary-container h-16 w-16 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl group-hover:shadow-primary/20">
                    <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </button>
                </div>
                {/* Progress Indicator */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-surface-container-highest">
                  <div className="h-full bg-primary" style={{ width: "28%" }}></div>
                </div>
              </div>
              <div className="p-8 flex items-center justify-between bg-surface-container-high/50">
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-secondary">history</span>
                  <div>
                    <p className="text-sm font-bold text-on-surface">Pick up where you left off</p>
                    <p className="text-xs text-on-surface-variant">Section: Synaptic Pruning Mechanics</p>
                  </div>
                </div>
                <button className="px-6 py-2.5 bg-surface-container-highest rounded-full text-sm font-bold text-primary hover:bg-surface-bright transition-colors border border-outline-variant/20">
                  Resume Lecture
                </button>
              </div>
            </div>

            {/* Academic Notes Section */}
            <div className="bg-surface-container-high p-8 rounded-[2rem] border border-outline-variant/5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                  <span className="material-symbols-outlined text-tertiary">edit_note</span>
                  Active Reflections
                </h3>
                <button className="text-xs font-label uppercase tracking-widest text-primary font-bold">New Entry</button>
              </div>
              <div className="space-y-4">
                <div className="bg-surface-container-low p-6 rounded-2xl border-b-2 border-outline-variant/20">
                  <p className="font-body text-xl text-on-surface-variant leading-relaxed italic">
                    "The brain is not just a hard drive for data; it's a dynamic landscape. Focus sessions allow for intentional landscaping of neural pathways..."
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-label text-outline uppercase tracking-widest">Added in Chapter 2</span>
                    <span className="material-symbols-outlined text-sm text-outline">more_horiz</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Academy Progress Tracker (Right Column) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container p-8 rounded-[2rem] border border-outline-variant/5 flex-grow">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-headline font-bold text-on-surface">Curriculum Tracker</h2>
                  <p className="text-sm text-on-surface-variant font-label">Mastering the Mental Reset</p>
                </div>
                <div className="h-16 w-16 relative">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" fill="transparent" r="28" stroke="#1d2024" strokeWidth="6"></circle>
                    <circle cx="32" cy="32" fill="transparent" r="28" stroke="#9df197" strokeDasharray="176" strokeDashoffset="100" strokeWidth="6"></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">42%</div>
                </div>
              </div>

              {/* Chapter Structure */}
              <div className="space-y-10 overflow-y-auto max-h-[600px] pr-4 custom-scrollbar">
                {/* Chapter 1 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-headline font-bold text-lg text-primary flex items-center gap-2">
                      <span className="text-xs opacity-50">01</span> Foundations of Focus
                    </h4>
                    <span className="text-[10px] font-bold text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">Completed</span>
                  </div>
                  <div className="space-y-3 pl-4 border-l-2 border-outline-variant/20">
                    <div className="group">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center w-5 h-5 rounded bg-secondary/20 text-secondary">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                        </div>
                        <div className="flex-grow">
                          <p className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors cursor-pointer">Understanding Attention Residuals</p>
                          <div className="mt-2 space-y-2">
                            <div className="flex items-center gap-2 pl-4 py-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              <span className="text-xs text-on-surface-variant">The Cost of Context Switching</span>
                            </div>
                            <div className="flex items-center gap-2 pl-4 py-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                              <span className="text-xs text-on-surface-variant">Digital Overload Syndrome</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter 2 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                      <span className="text-xs opacity-50">02</span> The Reset Mechanics
                    </h4>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase bg-surface-container-highest px-2 py-0.5 rounded">In Progress</span>
                  </div>
                  <div className="space-y-6 pl-4 border-l-2 border-primary/40">
                    <div className="group">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 flex items-center justify-center w-5 h-5 border-2 border-primary rounded cursor-pointer hover:bg-primary/10"></div>
                        <div className="flex-grow">
                          <p className="text-sm font-bold text-on-surface">Environmental Priming</p>
                          <div className="mt-3 space-y-3">
                            <div className="flex items-center justify-between pl-4 group/sub">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border border-outline-variant rounded flex items-center justify-center cursor-pointer">
                                  <span className="material-symbols-outlined text-[10px] hidden group-hover/sub:block">check</span>
                                </div>
                                <span className="text-sm text-on-surface-variant">Lighting & Circadian Rythyms</span>
                              </div>
                              <span className="material-symbols-outlined text-outline text-lg cursor-pointer hover:text-primary">notes</span>
                            </div>
                            <div className="pl-4">
                              <div className="bg-surface-container-low rounded-xl p-3 border-l-2 border-tertiary">
                                <textarea className="w-full bg-transparent border-none focus:ring-0 text-xs font-body text-on-surface-variant p-0 resize-none" placeholder="Draft your notes for this subtopic..." rows="2"></textarea>
                              </div>
                            </div>
                            <div className="flex items-center justify-between pl-4 group/sub">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 border-2 border-secondary rounded flex items-center justify-center bg-secondary/10">
                                  <span className="material-symbols-outlined text-[10px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                                </div>
                                <span className="text-sm text-on-surface-variant line-through opacity-50">Soundscapes and Flow States</span>
                              </div>
                              <span className="material-symbols-outlined text-secondary text-lg">notes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 opacity-50">
                      <div className="mt-1 flex items-center justify-center w-5 h-5 border-2 border-outline-variant rounded"></div>
                      <div className="flex-grow">
                        <p className="text-sm font-medium text-on-surface">The 90-Minute Mastery Cycle</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Chapter 3 */}
                <div className="opacity-30">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-headline font-bold text-lg text-on-surface flex items-center gap-2">
                      <span className="text-xs opacity-50">03</span> Cognitive Performance
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Summary Stat */}
            <div className="bg-gradient-to-br from-surface-container-high to-surface-container-lowest p-6 rounded-[2rem] border border-outline-variant/10 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-label uppercase tracking-[0.2em] text-on-surface-variant mb-1">Knowledge Retained</p>
                <p className="text-3xl font-headline font-bold text-primary">84<span className="text-sm font-light opacity-60 ml-1">Percent</span></p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary/20 flex items-center justify-center text-[10px] font-bold">PT</div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-secondary/20 flex items-center justify-center text-[10px] font-bold">CH</div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold">+4</div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Bottom Nav (Visible only on mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-nav h-20 flex items-center justify-around px-6 z-50">
        <button className="flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] mt-1 font-label">Home</span>
        </button>
        <button className="flex flex-col items-center text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>psychology</span>
          <span className="text-[10px] mt-1 font-label">Mentally</span>
        </button>
        <div className="w-12 h-12 bg-primary rounded-full -mt-10 shadow-lg flex items-center justify-center text-on-primary">
          <span className="material-symbols-outlined">bolt</span>
        </div>
        <button className="flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined">fitness_center</span>
          <span className="text-[10px] mt-1 font-label">Physical</span>
        </button>
        <button className="flex flex-col items-center text-on-surface-variant">
          <span className="material-symbols-outlined">target</span>
          <span className="text-[10px] mt-1 font-label">Goals</span>
        </button>
      </nav>
    </>
  );
}
