'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [timerMode, setTimerMode] = useState('Deep Focus');
  const [cycleCount, setCycleCount] = useState(0);
  const [stats, setStats] = useState(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [journalText, setJournalText] = useState("");
  const [journalEntries, setJournalEntries] = useState({});
  const [tasks, setTasks] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    // Hydrate journal entries from local storage
    const savedJournal = localStorage.getItem('journalEntries');
    if (savedJournal) {
      setJournalEntries(JSON.parse(savedJournal));
    } else {
      const tzOffset = (new Date()).getTimezoneOffset() * 60000;
      const getLocalISODate = (d) => new Date(d - tzOffset).toISOString().split('T')[0];
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      setJournalEntries({
        [getLocalISODate(today)]: { text: "Taking time to plan out the architecture course modules so I don't get sidetracked." },
        [getLocalISODate(yesterday)]: { text: "Feeling accomplished after that morning deep focus session." }
      });
    }

    // Hydrate tasks from local storage
    const savedTasks = localStorage.getItem('priorityObjectives');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const tzOffset = (new Date()).getTimezoneOffset() * 60000;
      const todayStr = new Date(new Date() - tzOffset).toISOString().split('T')[0];
      setTasks([
        { id: 1, text: "Structure quarterly financial roadmap", context: "Financially", dueDate: todayStr, completed: false },
        { id: 2, text: "30-minute mindfulness meditation", context: "Mentally", dueDate: todayStr, completed: false },
        { id: 3, text: "Evening strength conditioning", context: "Physically", dueDate: todayStr, completed: false },
      ]);
    }
    
    const savedCycle = localStorage.getItem('cycleCount');
    if (savedCycle) {
      setCycleCount(parseInt(savedCycle));
    }

    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    }
  }, [journalEntries, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('priorityObjectives', JSON.stringify(tasks));
    }
  }, [tasks, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('cycleCount', cycleCount.toString());
    }
  }, [cycleCount, isDataLoaded]);

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedHistoryDate, setSelectedHistoryDate] = useState(null);
  const [historyEditText, setHistoryEditText] = useState("");

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("");
  const [newTaskContext, setNewTaskContext] = useState("General");

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const [goal, setGoal] = useState({
    title: "Overall Reset Progress",
    description: "Average score across all four quadrants",
  });
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editGoalTitle, setEditGoalTitle] = useState("");
  const [editGoalDesc, setEditGoalDesc] = useState("");

  const getLocalISODate = (d) => {
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d - tzOffset).toISOString().split('T')[0];
  };

  const calculateStreak = () => {
    let streakCount = 0;
    let checkDate = new Date();
    
    const todayStr = getLocalISODate(checkDate);
    let tempDate = new Date(checkDate);
    tempDate.setDate(tempDate.getDate() - 1);
    const yesterdayStr = getLocalISODate(tempDate);
    
    if (!journalEntries[todayStr] && !journalEntries[yesterdayStr]) {
      return 0; 
    }
    
    if (!journalEntries[todayStr] && journalEntries[yesterdayStr]) {
       checkDate.setDate(checkDate.getDate() - 1); 
    }
    
    while (true) {
      const dateStr = getLocalISODate(checkDate);
      if (journalEntries[dateStr]) {
        streakCount++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streakCount;
  };

  useEffect(() => {
    fetch('/api/user-stats')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
        }
      })
      .catch(err => console.error("Error fetching stats:", err));
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      
      if (timerMode === 'Deep Focus') {
        setCycleCount(c => c + 1);
        fetch('/api/focus-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ duration: 25, target: "Deep Focus" })
        })
        .then(res => res.json())
        .then(data => console.log('Session logged:', data))
        .catch(console.error);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, timerMode]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const switchMode = (mode, minutes) => {
    setTimerMode(mode);
    setTimeLeft(minutes * 60);
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (timerMode === 'Deep Focus') setTimeLeft(25 * 60);
    else if (timerMode === 'Short Rest') setTimeLeft(5 * 60);
    else if (timerMode === 'Long Rest') setTimeLeft(15 * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  const avgQuadrantScore = Math.round(
    ((stats?.quadrants?.mentally || 0) +
    (stats?.quadrants?.financially || 0) +
    (stats?.quadrants?.socially || 0) +
    (stats?.quadrants?.physically || 0)) / 4
  ) || 0;

  return (
    <>
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Hero Bento Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Pomodoro Timer */}
          <div className="lg:col-span-8 bg-surface-container-low rounded-[2rem] p-8 relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
            <div className="mb-2">
              <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] border border-primary/20">
                {isActive ? "Tracking..." : "Active Session"}
              </span>
            </div>
            <div className="relative py-12">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
              <h1 className="text-[12rem] leading-none font-headline font-light tracking-tighter text-on-surface relative transition-colors duration-500" style={{ color: (timerMode === 'Short Rest' || timerMode === 'Long Rest') ? 'var(--secondary)' : '' }}>
                {minutes}<span className={timerMode === 'Deep Focus' ? 'text-primary' : 'text-secondary'}>:</span>{seconds}
              </h1>
              <div className="flex items-center justify-center gap-8 mt-4 relative">
                <div className="text-left">
                  <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">Cycles Completed</p>
                  <p className="text-2xl font-headline font-bold text-on-surface">{cycleCount.toString().padStart(2, '0')}</p>
                </div>
                <div className="h-8 w-px bg-outline-variant/30"></div>
                <div className="text-left">
                  <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">Target</p>
                  <p className="text-2xl font-headline font-bold text-on-surface">{timerMode}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mb-2 relative z-10 bg-surface-container-high p-1.5 rounded-full border border-outline-variant/10">
               <button onClick={() => switchMode('Deep Focus', 25)} className={`px-5 py-2 rounded-full font-label text-[10px] font-bold uppercase tracking-widest transition-colors ${timerMode === 'Deep Focus' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}>Focus (25m)</button>
               <button onClick={() => switchMode('Short Rest', 5)} className={`px-5 py-2 rounded-full font-label text-[10px] font-bold uppercase tracking-widest transition-colors ${timerMode === 'Short Rest' ? 'bg-secondary text-surface-container-lowest shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}>Rest (5m)</button>
               <button onClick={() => switchMode('Long Rest', 15)} className={`px-5 py-2 rounded-full font-label text-[10px] font-bold uppercase tracking-widest transition-colors ${timerMode === 'Long Rest' ? 'bg-secondary text-surface-container-lowest shadow-md' : 'text-on-surface-variant hover:text-on-surface'}`}>Long Rest (15m)</button>
            </div>

            <div className="flex gap-4 mt-6 relative z-10">
              <button 
                onClick={toggleTimer}
                className={`px-12 py-5 rounded-full font-label font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all active:scale-95 group ${timerMode === 'Deep Focus' ? 'bg-gradient-to-r from-primary to-primary-dim text-on-primary hover:shadow-primary/20' : 'bg-gradient-to-r from-secondary to-secondary-dim text-surface-container-lowest hover:shadow-secondary/20'}`}
              >
                {isActive ? "Pause" : (timerMode === 'Deep Focus' ? "Start Focus" : "Start Rest")}
              </button>
              <button 
                onClick={resetTimer}
                className="p-5 bg-surface-container-high text-on-surface-variant rounded-full hover:text-on-surface transition-colors active:scale-95 border border-outline-variant/15"
              >
                <span className="material-symbols-outlined" data-icon="refresh">refresh</span>
              </button>
            </div>
            {/* Ambient Decoration */}
            <div className="absolute bottom-[-10%] right-[-5%] w-64 h-64 border border-outline-variant/10 rounded-full z-0"></div>
            <div className="absolute bottom-[-5%] right-[-2%] w-48 h-48 border border-outline-variant/5 rounded-full z-0"></div>
          </div>
          {/* Daily Insight / Reflection */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-high rounded-[2rem] p-8 h-full border border-outline-variant/10 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <span className="material-symbols-outlined text-tertiary text-4xl" data-icon="auto_awesome">auto_awesome</span>
                <div className="text-right">
                  <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-widest">Streak</p>
                  <p className="text-xl font-headline font-bold">{calculateStreak()} Days</p>
                </div>
              </div>
              <h3 className="text-3xl font-body italic text-on-surface leading-tight mb-4">"The focus of the mind is the only true reset for the soul."</h3>
              <p className="text-on-surface-variant font-label text-sm leading-relaxed mb-8">Take 5 minutes to journal your intentions before starting the next cycle.</p>
              <div className="mt-auto space-y-3">
                <button 
                  onClick={() => setIsJournalOpen(true)}
                  className="w-full py-4 bg-surface-container-lowest rounded-xl font-label text-xs font-bold text-primary flex items-center justify-center gap-2 border border-outline-variant/20 hover:bg-surface-container transition-colors"
                >
                  Write Journal <span className="material-symbols-outlined text-sm" data-icon="edit_note">edit_note</span>
                </button>
                <button 
                  onClick={() => setIsHistoryOpen(true)}
                  className="w-full py-4 bg-transparent rounded-xl font-label text-xs font-bold text-on-surface-variant flex items-center justify-center gap-2 hover:bg-surface-container-lowest transition-colors"
                >
                  Past Records <span className="material-symbols-outlined text-sm" data-icon="history">history</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* The Four Quadrants Overview */}
        <section className="space-y-6">
          <div className="flex items-end justify-between px-2">
            <div>
              <p className="text-primary font-label text-[10px] font-bold uppercase tracking-[0.2em] mb-1">State Analysis</p>
              <h2 className="text-4xl font-headline font-bold text-on-surface">The Quadrants</h2>
            </div>
            <button className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 font-label text-xs uppercase tracking-widest">
              View Detailed Report <span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Mentally */}
            <Link href="/mentally" className="bg-surface-container-low rounded-[2rem] p-6 hover:bg-surface-container-high transition-all duration-300 group cursor-pointer block">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" data-icon="psychology">psychology</span>
                </div>
                <span className="text-2xl font-headline font-bold text-primary">{stats?.quadrants?.mentally || 0}%</span>
              </div>
              <h4 className="font-headline font-bold text-lg mb-1">Mentally</h4>
              <p className="text-on-surface-variant font-body italic text-sm mb-6">Cognitive load is low</p>
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(129,236,255,0.4)]" style={{ width: `${stats?.quadrants?.mentally || 0}%` }}></div>
              </div>
            </Link>
            {/* Financially */}
            <Link href="/financially" className="bg-surface-container-low rounded-[2rem] p-6 hover:bg-surface-container-high transition-all duration-300 group cursor-pointer block">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" data-icon="payments">payments</span>
                </div>
                <span className="text-2xl font-headline font-bold text-tertiary">{stats?.quadrants?.financially || 0}%</span>
              </div>
              <h4 className="font-headline font-bold text-lg mb-1">Financially</h4>
              <p className="text-on-surface-variant font-body italic text-sm mb-6">Review budget needed</p>
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-tertiary rounded-full shadow-[0_0_8px_rgba(255,197,99,0.4)]" style={{ width: `${stats?.quadrants?.financially || 0}%` }}></div>
              </div>
            </Link>
            {/* Socially */}
            <Link href="/socially" className="bg-surface-container-low rounded-[2rem] p-6 hover:bg-surface-container-high transition-all duration-300 group cursor-pointer block">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
                </div>
                <span className="text-2xl font-headline font-bold text-secondary">{stats?.quadrants?.socially || 0}%</span>
              </div>
              <h4 className="font-headline font-bold text-lg mb-1">Socially</h4>
              <p className="text-on-surface-variant font-body italic text-sm mb-6">Connection balance good</p>
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary rounded-full shadow-[0_0_8px_rgba(157,241,151,0.4)]" style={{ width: `${stats?.quadrants?.socially || 0}%` }}></div>
              </div>
            </Link>
            {/* Physically */}
            <Link href="/physically" className="bg-surface-container-low rounded-[2rem] p-6 hover:bg-surface-container-high transition-all duration-300 group cursor-pointer block">
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-error/10 rounded-2xl flex items-center justify-center text-error group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" data-icon="fitness_center">fitness_center</span>
                </div>
                <span className="text-2xl font-headline font-bold text-error">{stats?.quadrants?.physically || 0}%</span>
              </div>
              <h4 className="font-headline font-bold text-lg mb-1">Physically</h4>
              <p className="text-on-surface-variant font-body italic text-sm mb-6">Peak physical state</p>
              <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-error rounded-full shadow-[0_0_8px_rgba(255,113,108,0.4)]" style={{ width: `${stats?.quadrants?.physically || 0}%` }}></div>
              </div>
            </Link>
          </div>
        </section>

        {/* Secondary Bento Grid: Tasks & Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Focus Tasks */}
          <div className="lg:col-span-2 bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-headline font-bold">Priority Objectives</h3>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest bg-surface-container-high px-3 py-1 rounded-full">{activeTasks.length} Active</span>
                <button 
                  onClick={() => setIsTaskModalOpen(true)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-sm" data-icon="add">add</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {activeTasks.map(task => (
                <div key={task.id} className="group flex items-center justify-between p-5 bg-surface-container-high rounded-2xl hover:translate-x-2 transition-transform cursor-pointer" onClick={() => toggleTask(task.id)}>
                  <div className="flex items-center gap-4">
                    <div className="w-6 h-6 border-2 border-primary rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-[14px] text-primary opacity-0 group-hover:opacity-100" data-icon="check">check</span>
                    </div>
                    <div>
                      <p className="font-headline font-medium">{task.text}</p>
                      <p className="text-xs text-on-surface-variant font-label">{task.context} • {task.dueDate ? `Due ${task.dueDate}` : 'No date'}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors" data-icon="more_vert">more_vert</span>
                </div>
              ))}

              {completedTasks.length > 0 && (
                <>
                  <div className="w-full h-px bg-outline-variant/20 my-6 relative">
                    <span className="absolute left-1/2 -translate-x-1/2 -top-2 bg-surface-container-low px-2 text-[10px] font-label uppercase tracking-widest text-on-surface-variant">Completed</span>
                  </div>
                  {completedTasks.map(task => (
                    <div key={task.id} className="group flex items-center justify-between p-5 bg-surface-container-high/50 rounded-2xl transition-transform cursor-pointer opacity-60 hover:opacity-100" onClick={() => toggleTask(task.id)}>
                      <div className="flex items-center gap-4">
                        <div className="w-6 h-6 border-2 border-primary bg-primary rounded-full flex items-center justify-center transition-colors">
                          <span className="material-symbols-outlined text-[14px] text-on-primary" data-icon="check">check</span>
                        </div>
                        <div>
                          <p className="font-headline font-medium line-through text-on-surface-variant">{task.text}</p>
                          <p className="text-xs text-on-surface-variant font-label">{task.context} • {task.dueDate ? `Due ${task.dueDate}` : 'No date'} • Done</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors" data-icon="delete" onClick={(e) => {
                        e.stopPropagation();
                        setTasks(tasks.filter(t => t.id !== task.id));
                      }}>delete</span>
                    </div>
                  ))}
                </>
              )}
              {tasks.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-on-surface-variant font-body italic">No tasks added yet. Time to focus!</p>
                </div>
              )}
            </div>
          </div>
          {/* Goals Breakdown */}
          <div className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 overflow-hidden relative group">
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-2xl font-headline font-bold">Quarterly Goal</h3>
              <button 
                onClick={() => {
                  setEditGoalTitle(goal.title);
                  setEditGoalDesc(goal.description);
                  setIsGoalModalOpen(true);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-primary/20 text-on-surface-variant hover:text-primary transition-colors"
                title="Edit Goal"
              >
                <span className="material-symbols-outlined text-sm" data-icon="edit">edit</span>
              </button>
            </div>
            
            <div className="relative w-48 h-48 mx-auto mb-8">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle className="text-surface-container-high" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                <circle className="text-primary transition-all duration-1000 ease-in-out" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (avgQuadrantScore / 100))} strokeLinecap="round" strokeWidth="8"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-headline font-bold">{avgQuadrantScore}%</span>
                <span className="text-[10px] font-label text-on-surface-variant uppercase tracking-widest mt-1">Complete</span>
              </div>
            </div>
            
            <div className="text-center flex flex-col items-center space-y-3 relative z-10">
              <div>
                <p className="font-headline font-bold text-lg">{goal.title}</p>
                <p className="text-sm font-body text-on-surface-variant italic mb-2">{goal.description}</p>
              </div>
              <div className="inline-flex items-center px-4 py-2 bg-surface-container-high rounded-full border border-outline-variant/10">
                <span className="font-label font-bold text-[10px] uppercase tracking-widest text-primary">Calculated Automatically</span>
              </div>
            </div>
            {/* Background texture/pattern */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* FAB for Quick Focus */}
      <button className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-full shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex items-center justify-center group active:scale-90 transition-all z-50 md:hidden">
        <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-180" data-icon="add">add</span>
      </button>

      {/* Journal Modal */}
      {isJournalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md transition-opacity">
          <div className="bg-surface-container-high w-full max-w-lg rounded-3xl p-8 border border-outline-variant/20 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
                <h3 className="text-2xl font-headline font-bold text-on-surface">Daily Journal</h3>
              </div>
              <button onClick={() => setIsJournalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors bg-surface p-2 rounded-full border border-outline-variant/10">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <textarea 
              className="w-full h-48 bg-surface-container-lowest/50 rounded-xl p-5 text-on-surface font-body text-lg border border-outline-variant/10 focus:outline-none focus:border-primary/50 focus:bg-surface-container-lowest transition-all resize-none placeholder-on-surface-variant relative z-10"
              placeholder="What are your intentions for this cycle? What's on your mind?"
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              autoFocus
            ></textarea>
            
            <div className="flex justify-end gap-3 mt-8 relative z-10">
              <button 
                onClick={() => setIsJournalOpen(false)}
                className="px-6 py-3 rounded-full font-label text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (journalText.trim() !== "") {
                    const todayStr = getLocalISODate(new Date());
                    setJournalEntries(prev => ({
                      ...prev,
                      [todayStr]: { text: prev[todayStr] ? prev[todayStr].text + "\n\n" + journalText : journalText }
                    }));
                    setJournalText("");
                  }
                  setIsJournalOpen(false);
                }}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-full font-label text-sm font-bold shadow-[0_10px_20px_rgba(129,236,255,0.2)] hover:shadow-primary/30 active:scale-95 transition-all"
              >
                Save Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md transition-opacity">
          <div className="bg-surface-container-high w-full max-w-md rounded-3xl p-8 border border-outline-variant/20 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-headline font-bold text-on-surface">Add Objective</h3>
              <button onClick={() => setIsTaskModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Task Description</label>
                <input 
                  type="text" 
                  value={newTaskText} 
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="What needs to be done?"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Due Date</label>
                  <input 
                    type="date" 
                    value={newTaskDate} 
                    onChange={(e) => setNewTaskDate(e.target.value)}
                    className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Quadrant</label>
                  <select 
                    value={newTaskContext}
                    onChange={(e) => setNewTaskContext(e.target.value)}
                    className="w-full bg-surface-container-lowest/50 rounded-xl p-3 h-[50px] text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                  >
                    <option value="Mentally">Mentally</option>
                    <option value="Physically">Physically</option>
                    <option value="Financially">Financially</option>
                    <option value="Socially">Socially</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 relative z-10">
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="px-6 py-3 rounded-full font-label text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (newTaskText.trim()) {
                    setTasks([...tasks, {
                      id: Date.now(),
                      text: newTaskText,
                      dueDate: newTaskDate,
                      context: newTaskContext,
                      completed: false
                    }]);
                    setNewTaskText("");
                    setNewTaskDate("");
                    setIsTaskModalOpen(false);
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-full font-label text-sm font-bold shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
              >
                Add Option
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md transition-opacity">
          <div className="bg-surface-container-high w-full max-w-md rounded-3xl p-8 border border-outline-variant/20 shadow-2xl relative overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6 relative z-10">
              <h3 className="text-2xl font-headline font-bold text-on-surface">Edit Goal</h3>
              <button onClick={() => setIsGoalModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Goal Title</label>
                <input 
                  type="text" 
                  value={editGoalTitle} 
                  onChange={(e) => setEditGoalTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="e.g. Master React in 90 days"
                />
              </div>
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Description / Metric</label>
                <input 
                  type="text" 
                  value={editGoalDesc} 
                  onChange={(e) => setEditGoalDesc(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="e.g. Complete 5 courses"
                />
              </div>
              <div className="p-4 mt-2 bg-primary/10 rounded-xl border border-primary/20">
                 <p className="text-xs text-primary font-body flex items-start gap-2">
                   <span className="material-symbols-outlined text-[16px]" data-icon="info">info</span>
                   The progress percentage is automatically calculated as the average of your four Quadrant scores.
                 </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-8 relative z-10">
              <button 
                onClick={() => setIsGoalModalOpen(false)}
                className="px-6 py-3 rounded-full font-label text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (editGoalTitle.trim()) {
                    setGoal({
                      ...goal,
                      title: editGoalTitle,
                      description: editGoalDesc
                    });
                    setIsGoalModalOpen(false);
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-full font-label text-sm font-bold shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md transition-opacity">
          <div className="bg-surface-container-high w-full max-w-lg rounded-3xl p-8 border border-outline-variant/20 shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary/10 rounded-full blur-3xl z-0"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-2xl">history</span>
                <h3 className="text-2xl font-headline font-bold text-on-surface">Past Records</h3>
              </div>
              <button 
                onClick={() => {
                  setIsHistoryOpen(false);
                  setSelectedHistoryDate(null);
                }} 
                className="text-on-surface-variant hover:text-secondary transition-colors bg-surface p-2 rounded-full border border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto space-y-4 pr-2 relative z-10 flex-1 scrollbar-hide">
              {!selectedHistoryDate ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} className="text-on-surface-variant hover:text-on-surface">
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <h4 className="font-headline font-bold text-lg">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h4>
                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="text-on-surface-variant hover:text-on-surface">
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-label text-on-surface-variant mb-2">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {(() => {
                      const year = currentMonth.getFullYear();
                      const month = currentMonth.getMonth();
                      const firstDay = new Date(year, month, 1).getDay();
                      const daysInMonth = new Date(year, month + 1, 0).getDate();
                      
                      const days = [];
                      for(let i=0; i<firstDay; i++) days.push(<div key={`empty-${i}`} className="h-10"></div>);
                      
                      for(let i=1; i<=daysInMonth; i++) {
                        const d = new Date(year, month, i);
                        const dateStr = getLocalISODate(d);
                        const hasEntry = !!journalEntries[dateStr];
                        const isToday = dateStr === getLocalISODate(new Date());
                        
                        days.push(
                          <button 
                            key={i}
                            onClick={() => {
                              setSelectedHistoryDate(dateStr);
                              setHistoryEditText(journalEntries[dateStr]?.text || "");
                            }}
                            className={`h-10 rounded-lg flex items-center justify-center font-body text-sm relative transition-all ${hasEntry ? 'bg-secondary/20 text-secondary font-bold hover:bg-secondary/30' : 'hover:bg-surface-container text-on-surface-variant'} ${isToday && !hasEntry ? 'border border-secondary/50 text-on-surface' : ''}`}
                          >
                            {i}
                            {hasEntry && <span className="absolute bottom-1 w-1 h-1 bg-secondary rounded-full"></span>}
                          </button>
                        );
                      }
                      return days;
                    })()}
                  </div>
                </>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setSelectedHistoryDate(null)} className="text-on-surface-variant hover:text-on-surface flex items-center text-sm font-label uppercase tracking-widest">
                      <span className="material-symbols-outlined mr-1 text-sm">arrow_back</span> Back
                    </button>
                    <span className="text-secondary font-label uppercase tracking-widest text-[10px] ml-auto">{selectedHistoryDate}</span>
                  </div>
                  <textarea 
                    className="w-full flex-1 min-h-[200px] bg-surface-container-lowest/50 rounded-xl p-5 text-on-surface font-body text-lg border border-outline-variant/10 focus:outline-none focus:border-secondary/50 transition-all resize-none placeholder-on-surface-variant"
                    placeholder="Write an entry for this day..."
                    value={historyEditText}
                    onChange={(e) => setHistoryEditText(e.target.value)}
                    autoFocus
                  ></textarea>
                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      onClick={() => {
                        if (historyEditText.trim() !== "") {
                          setJournalEntries(prev => ({
                            ...prev,
                            [selectedHistoryDate]: { text: historyEditText }
                          }));
                        } else {
                          // if empty, remove it
                          const newEntries = {...journalEntries};
                          delete newEntries[selectedHistoryDate];
                          setJournalEntries(newEntries);
                        }
                        setSelectedHistoryDate(null);
                      }}
                      className="px-6 py-2.5 bg-secondary text-surface-container-lowest rounded-full font-label text-sm font-bold shadow-lg hover:shadow-secondary/30 active:scale-95 transition-all"
                    >
                      Save Entry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
