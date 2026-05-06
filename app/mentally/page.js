"use client";
import { useState, useEffect } from "react";
import YouTubeTracker from "@/components/YouTubeTracker";
import CurriculumTracker from "@/components/CurriculumTracker";
import ActiveReflections from "@/components/ActiveReflections";

export default function MentallyPage() {
  const [mentallyScore, setMentallyScore] = useState(0);

  useEffect(() => {
    // Calculate Mentally score dynamically from Curriculum Tracker
    const savedCurr = localStorage.getItem('yt_curriculum');
    if (savedCurr) {
      try {
        const curriculum = JSON.parse(savedCurr);
        let totalItems = 0;
        let checkedItems = 0;
        
        curriculum.forEach(playlist => {
          playlist.topics.forEach(t => {
            totalItems++;
            if (t.checked) checkedItems++;
            (t.subtopics || []).forEach(s => {
              totalItems++;
              if (s.checked) checkedItems++;
            });
          });
        });
        
        if (totalItems > 0) {
          setMentallyScore(Math.round((checkedItems / totalItems) * 100));
        }
      } catch (err) {}
    }
    
    // Listen for custom events if curriculum updates
    const handleStorageChange = () => {
       const curr = localStorage.getItem('yt_curriculum');
       if (curr) {
          try {
            const curriculum = JSON.parse(curr);
            let total = 0, checked = 0;
            curriculum.forEach(p => p.topics.forEach(t => {
              total++; if(t.checked) checked++;
              (t.subtopics || []).forEach(s => { total++; if(s.checked) checked++; });
            }));
            if(total > 0) setMentallyScore(Math.round((checked/total)*100));
          } catch(e){}
       }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('curriculumUpdated', handleStorageChange);
    // Poll every 500ms to keep it fresh without reloading
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('curriculumUpdated', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
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
            <div className="flex gap-8">
              <div className="flex flex-col items-end">
                <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Curriculum</span>
                <span className="text-2xl font-headline font-bold text-primary">{mentallyScore}% <span className="text-sm font-label text-on-surface-variant">Done</span></span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs text-on-surface-variant font-label uppercase tracking-widest">Focus Level</span>
                <span className={`text-2xl font-headline font-bold ${mentallyScore >= 80 ? 'text-secondary' : mentallyScore >= 40 ? 'text-tertiary' : 'text-error'}`}>
                  {mentallyScore >= 80 ? "Optimal" : mentallyScore >= 40 ? "Moderate" : "Scattered"}
                </span>
              </div>
            </div>
          </div>
          <p className="font-body text-2xl text-on-surface-variant max-w-2xl leading-relaxed italic">
            {[
              "Rest the mind to sharpen the blade. Intellectual growth requires profound stillness.",
              "Deepen your concentration. Track your learning progress through the curated academy.",
              "The quality of your focus dictates the quality of your reality. Master your attention.",
              "Curiosity is the engine of intellect. Maintain your digital sanctuary for constant growth.",
              "True learning isn't just absorption, it's the active restructuring of your mental models.",
              "Clarity emerges when the noise fades. Protect your cognitive bandwidth fiercely.",
              "Knowledge compounds over time. Today's deep work is tomorrow's effortless insight."
            ][new Date().getDay()]}
          </p>
        </section>

        {/* Bento Layout Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* YouTube Study Lecture Section (Left Column) */}
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <YouTubeTracker />
          </div>

          {/* Academy Progress Tracker (Right Column) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            <CurriculumTracker />
            <ActiveReflections />
          </div>
        </div>
        
        {/* Reset Data Button */}
        <div className="text-center pt-8">
          <button 
            onClick={() => {
              if(confirm("Are you sure you want to completely reset all your curriculum data? This cannot be undone.")) {
                localStorage.removeItem("yt_curriculum");
                localStorage.removeItem("yt_playlists");
                window.location.reload();
              }
            }}
            className="text-error/70 hover:text-error text-xs uppercase tracking-widest font-label transition-colors"
          >
            Reset All Curriculum Data
          </button>
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
