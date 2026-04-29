"use client";
import YouTubeTracker from "@/components/YouTubeTracker";
import CurriculumTracker from "@/components/CurriculumTracker";

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
            <YouTubeTracker />

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
            <CurriculumTracker />
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
