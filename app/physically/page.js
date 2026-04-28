"use client";
import { useState, useEffect } from "react";

export default function PhysicallyPage() {
  const [stats, setStats] = useState({
    calories: 742,
    hydration: 2.4,
    rest: 8,
    steps: 9100,
  });

  const [workouts, setWorkouts] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: [
        { id: 1, name: "Incline Dumbbell Press", target: "Upper Body", weight: 32, reps: 12, sets: 3, icon: "fitness_center", color: "primary" },
        { id: 2, name: "Weighted Pull-ups", target: "Upper Body", weight: 15, reps: 8, sets: 4, icon: "reorder", color: "secondary" },
        { id: 3, name: "Lateral Raises", target: "Upper Body", weight: 10, reps: 15, sets: 3, icon: "expand", color: "tertiary" },
      ]
    };
  });

  const [supplements, setSupplements] = useState([
    { id: 1, name: "Protein", amount: "25g", taken: true },
    { id: 2, name: "Creatine", amount: "5g", taken: true },
    { id: 3, name: "Omega-3", amount: "1000mg", taken: false },
    { id: 4, name: "Multivitamin", amount: "1 Cap", taken: false },
  ]);

  const [meals, setMeals] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      [today]: [
        { 
          id: 1, 
          name: "Morning Fuel", 
          desc: "Overnight oats, blueberries, walnuts", 
          kcal: 420, 
          p: 25, c: 55, f: 12,
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvhkF2aj9sn0H6Lqq5kMIdL9rhxgHAbReNC3QDOR-7WCDd7LiOi3gql2-N3zBMIRKycC6tjt-0J__w__De44JDpF3v_dwpfhAyMCrOZIPYnSYTEQpn558RF5AzD5Ydt6vI65w4Go0NiTO_lGZErAHB1M4_udcwIhx-unOqI13zJ6lOSBjV0Xgk6SZeUlkj_wpstK-B2U4TTkurUhRIvq06bdRrboQHBKzWeQVIrPUv3xW8Rfx_v8kyufQtULzVz5H01pw3LdU2q9Gs"
        },
        { 
          id: 2, 
          name: "Mental Sharpness Lunch", 
          desc: "Quinoa salad, chickpeas, leafy greens", 
          kcal: 580, 
          p: 35, c: 80, f: 18,
          img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAdlzZGEg_gJ8BNaJZb_Ubyt46aDGqGfd-c2wzI72uUdiHTvAPsCZ0FKQBaL4l5876Of4Dc01xq6YkFRMb3dRj7OsAmV14KqK7mcoEYVO7lHCRjI0V9lt8OzyqEbjse8rm2jNipDrnp6XMFgJwHWG2k-uv4GoeWj8nxhvFOkHQhQDA3YbErfL8G_Wj6IF4HldLBdLuBnw6nK4pjLJlK79PbF5_DYHuMQl48F6p6a1InJViErzcqwySd-A1ItukIllQmUk5hnLugQFez"
        }
      ]
    };
  });

  const [skinCare, setSkinCare] = useState({
    morning: [
      { id: 1, name: "Gentle Cleanser", done: true },
      { id: 2, name: "Vitamin C Serum", done: true },
      { id: 3, name: "SPF 50 Protection", done: false },
    ],
    night: [
      { id: 1, name: "Double Cleanse", done: false },
      { id: 2, name: "Hyaluronic Acid", done: false },
      { id: 3, name: "Retinol 0.5%", done: false },
    ]
  });

  const HR_PROFILES = {
    "Infant (0-6m)": 0,
    "Infant (7-12m)": 0.8,
    "Child (1-3y)": 1.3,
    "Child (4-8y)": 1.7,
    "Adult Woman": 2.7,
    "Elderly (65+)": 3.0,
    "Adult Man": 3.7
  };

  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [hydrationProfile, setHydrationProfile] = useState("Adult Man");

  useEffect(() => {
    const saved = localStorage.getItem("phy_data");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.stats) {
        let st = parsed.stats;
        if (st.rest > 24) st.rest = Math.round(st.rest / 11) || 8; // Migrate from % to Hr
        setStats(st);
      }
      if (parsed.workouts) {
        if (Array.isArray(parsed.workouts)) {
          const today = new Date().toISOString().split('T')[0];
          setWorkouts({ [today]: parsed.workouts });
        } else {
          setWorkouts(parsed.workouts);
        }
      }
      if (parsed.supplements) setSupplements(parsed.supplements);
      if (parsed.meals) {
        if (Array.isArray(parsed.meals)) {
          const today = new Date().toISOString().split('T')[0];
          setMeals({ [today]: parsed.meals });
        } else {
          setMeals(parsed.meals);
        }
      }
      if (parsed.skinCare) setSkinCare(parsed.skinCare);
      if (parsed.hydrationProfile) setHydrationProfile(parsed.hydrationProfile);
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("phy_data", JSON.stringify({ stats, workouts, supplements, meals, skinCare, hydrationProfile }));
    }
  }, [stats, workouts, supplements, meals, skinCare, hydrationProfile, isDataLoaded]);

  // Drag to scroll logic (reused from financial)
  const handleDragScroll = (e) => {
    const slider = e.currentTarget;
    let isDown = false;
    let startX, startY, scrollLeft, scrollTop;

    const start = (e) => {
      isDown = true;
      startX = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
      startY = (e.pageY || e.touches[0].pageY) - slider.offsetTop;
      scrollLeft = slider.scrollLeft;
      scrollTop = slider.scrollTop;
      slider.style.cursor = 'grabbing';
      slider.style.userSelect = 'none';
    };

    const stop = () => {
      isDown = false;
      slider.style.cursor = 'grab';
      slider.style.removeProperty('user-select');
    };

    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = (e.pageX || e.touches[0].pageX) - slider.offsetLeft;
      const y = (e.pageY || e.touches[0].pageY) - slider.offsetTop;
      const walkX = (x - startX) * 2;
      const walkY = (y - startY) * 2;
      slider.scrollLeft = scrollLeft - walkX;
      slider.scrollTop = scrollTop - walkY;
    };

    if (!slider.dataset.dragAttached) {
      slider.addEventListener('mousedown', start);
      slider.addEventListener('touchstart', start, { passive: false });
      slider.addEventListener('mouseleave', stop);
      slider.addEventListener('mouseup', stop);
      slider.addEventListener('touchend', stop);
      slider.addEventListener('mousemove', move);
      slider.addEventListener('touchmove', move, { passive: false });
      slider.dataset.dragAttached = "true";
      slider.style.cursor = 'grab';
    }
  };

  const toggleSupplement = (id) => {
    setSupplements(supplements.map(s => s.id === id ? { ...s, taken: !s.taken } : s));
  };

  const deleteSupplement = (id) => {
    setSupplements(supplements.filter(s => s.id !== id));
  };

  const toggleSkin = (type, id) => {
    setSkinCare({
      ...skinCare,
      [type]: skinCare[type].map(s => s.id === id ? { ...s, done: !s.done } : s)
    });
  };

  const deleteSkin = (type, id) => {
    setSkinCare({
      ...skinCare,
      [type]: skinCare[type].filter(s => s.id !== id)
    });
  };

  const [modal, setModal] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [gymInput, setGymInput] = useState({ type: "strength", name: "", weight: "", reps: "", sets: "", duration: "", distance: "" });
  const [foodInput, setFoodInput] = useState({ name: "", desc: "", kcal: "", p: "", c: "", f: "" });
  const [skinInput, setSkinInput] = useState({ type: "morning", name: "" });
  const [suppInput, setSuppInput] = useState({ name: "", amount: "" });
  const [foodDate, setFoodDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [gymDate, setGymDate] = useState(() => new Date().toISOString().split('T')[0]);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyContext, setHistoryContext] = useState("food");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const activeMeals = meals[foodDate] || [];
  const activeWorkouts = workouts[gymDate] || [];

  const totalMacros = activeMeals.reduce((acc, m) => ({
    p: acc.p + m.p,
    c: acc.c + m.c,
    f: acc.f + m.f,
    kcal: acc.kcal + m.kcal
  }), { p: 0, c: 0, f: 0, kcal: 0 });

  const burnedCalories = Math.round((stats.steps * 0.04) + activeWorkouts.reduce((s, w) => {
    if (w.type === 'cardio') return s + ((w.duration || 0) * 10);
    return s + ((w.sets || 0) * (w.reps || 0) * 0.5);
  }, 0));



  const getLocalISODate = (d) => {
    const tzOffset = d.getTimezoneOffset() * 60000;
    return new Date(d - tzOffset).toISOString().split('T')[0];
  };

  const handleSaveModal = () => {
    if (modal === 'gym' && gymInput.name) {
      const currentDayWorkouts = workouts[gymDate] || [];
      const newWorkout = { 
        id: Date.now(), 
        name: gymInput.name, 
        type: gymInput.type || "strength",
        weight: gymInput.weight||0, 
        reps: gymInput.reps||0, 
        sets: gymInput.sets||0, 
        duration: gymInput.duration||0,
        distance: gymInput.distance||0,
        icon: gymInput.type === 'cardio' ? "directions_run" : "fitness_center", 
        color: gymInput.type === 'cardio' ? "tertiary" : "primary" 
      };
      setWorkouts({
        ...workouts,
        [gymDate]: [...currentDayWorkouts, newWorkout]
      });
    } else if (modal === 'food' && foodInput.name) {
      const currentDayMeals = meals[foodDate] || [];
      setMeals({
        ...meals,
        [foodDate]: [...currentDayMeals, { id: Date.now(), name: foodInput.name, desc: foodInput.desc||"Custom Meal", kcal: parseInt(foodInput.kcal||0), p: parseInt(foodInput.p||0), c: parseInt(foodInput.c||0), f: parseInt(foodInput.f||0), img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBvhkF2aj9sn0H6Lqq5kMIdL9rhxgHAbReNC3QDOR-7WCDd7LiOi3gql2-N3zBMIRKycC6tjt-0J__w__De44JDpF3v_dwpfhAyMCrOZIPYnSYTEQpn558RF5AzD5Ydt6vI65w4Go0NiTO_lGZErAHB1M4_udcwIhx-unOqI13zJ6lOSBjV0Xgk6SZeUlkj_wpstK-B2U4TTkurUhRIvq06bdRrboQHBKzWeQVIrPUv3xW8Rfx_v8kyufQtULzVz5H01pw3LdU2q9Gs" }]
      });
    } else if (modal === 'skin' && skinInput.name) {
      setSkinCare({ ...skinCare, [skinInput.type]: [...skinCare[skinInput.type], { id: Date.now(), name: skinInput.name, done: false }] });
    } else if (modal === 'supplement' && suppInput.name) {
      setSupplements([...supplements, { id: Date.now(), name: suppInput.name, amount: suppInput.amount || "", taken: false }]);
    } else if (modal && modal !== 'gym' && modal !== 'food' && modal !== 'skin' && modal !== 'supplement' && inputValue) {
      setStats({ ...stats, [modal]: parseFloat(inputValue) });
    }
    setModal(null);
  };


  const totalSkinSteps = skinCare.morning.length + skinCare.night.length;
  const skinScore = totalSkinSteps > 0 ? Math.round(((skinCare.morning.filter(i => i.done).length + skinCare.night.filter(i => i.done).length) / totalSkinSteps) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 px-6 pt-6 pb-12">
      {/* Mobile Header Title */}
      <div className="lg:hidden">
        <h2 className="text-3xl font-bold tracking-tighter text-[#f9f9fd] font-headline">Physically</h2>
      </div>

      {/* Hero Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: "Active Calories", val: totalMacros.kcal, subVal: `Burned: ${burnedCalories} kcal`, unit: "kcal (Eaten)", color: "text-primary", key: 'calories', noBtn: true },
          { label: "Hydration", val: stats.hydration, subVal: `Target / Rec: ${HR_PROFILES[hydrationProfile]}L`, unit: "Liters", color: "text-secondary", key: 'hydration', step: 0.1 },
          { label: "Sleep Quality", val: stats.rest, unit: "Hrs", color: "text-tertiary", key: 'rest', step: 1 },
          { label: "Step Goal", val: stats.steps, display: (stats.steps/1000).toFixed(1) + "k", unit: "/ 10k", color: "text-primary", key: 'steps', step: 500 }
        ].map(stat => (
          <div key={stat.label} className="bg-surface-container-low p-6 rounded-[1.5rem] border-b-2 border-outline-variant/15 flex flex-col justify-between group">
            <div className="flex justify-between items-center">
              <span className="text-on-surface-variant text-xs font-label uppercase tracking-widest">{stat.label}</span>
              {!stat.noBtn && (
                <button onClick={() => { setModal(stat.key); setInputValue(stat.val); }} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="material-symbols-outlined text-sm">edit</span>
                </button>
              )}
            </div>
            <div className="mt-2 flex items-baseline justify-between gap-2">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-headline font-bold ${stat.color}`}>{stat.display || stat.val}</span>
                  <span className="text-on-surface-variant text-sm">{stat.unit}</span>
                </div>
                {stat.subVal && <span className="text-xs text-on-surface-variant font-label mt-1">{stat.subVal}</span>}
                
                
                {stat.key === 'hydration' && (
                  <div className="flex flex-wrap gap-1 mt-3 max-w-[150px]">
                    {Array.from({ length: Math.ceil((HR_PROFILES[hydrationProfile] === 0 ? Math.max(0.25, stat.val) : Math.max((HR_PROFILES[hydrationProfile] || 3.7), stat.val)) / 0.25) }).map((_, i) => {
                      const active = i < Math.floor(stat.val / 0.25);
                      let dotColor = active ? "bg-[#71b1ff]" : "bg-outline-variant/30";
                      return <div key={i} title={`~0.25L`} className={`w-2 h-2 rounded-full transition-colors ${dotColor}`}></div>
                    })}
                  </div>
                )}
                
                {stat.key === 'rest' && (
                  <div className="flex flex-wrap gap-1.5 mt-3 max-w-[150px]">
                    {Array.from({ length: Math.max(8, stat.val) }).map((_, i) => {
                      const active = i < stat.val;
                      let dotColor = "bg-outline-variant/30";
                      if (active) {
                        if (i < 5) dotColor = "bg-error";
                        else if (i < 7) dotColor = "bg-tertiary";
                        else dotColor = "bg-secondary";
                      }
                      return <div key={i} className={`w-2.5 h-2.5 rounded-full transition-colors ${dotColor}`}></div>
                    })}
                  </div>
                )}
              </div>
              {!stat.noBtn && (
                <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => setStats({...stats, [stat.key]: stat.key === 'steps' ? Math.min(25000, stats.steps + stat.step) : (stat.key === 'rest' ? Math.min(24, stats.rest + stat.step) : Math.round((stats[stat.key] + stat.step)*10)/10)})} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-sm">keyboard_arrow_up</span></button>
                  <button onClick={() => setStats({...stats, [stat.key]: Math.max(0, Math.round((stats[stat.key] - stat.step)*10)/10)})} className="text-on-surface-variant hover:text-primary"><span className="material-symbols-outlined text-sm">keyboard_arrow_down</span></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Gym Tracking (Bento Large) */}
        <section className="lg:col-span-8 bg-surface-container-high rounded-[2rem] p-8 relative flex flex-col gap-6">
          <div className="flex justify-between items-end relative z-10">
            <div>
              <h2 className="text-3xl font-headline font-bold text-on-surface flex items-center gap-3">
                Gym tracking
                <button 
                  onClick={() => { setHistoryContext('gym'); setIsHistoryOpen(true); }}
                  className="bg-surface-container-highest text-sm font-label text-on-surface-variant px-3 py-1.5 rounded-lg hover:text-primary hover:border-primary border border-transparent cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  {gymDate}
                </button>
              </h2>
              <p className="font-body text-xl text-on-surface-variant italic mt-1">Upper Body Focus - Hypertrophy Phase</p>
            </div>
            <button onClick={() => { setModal('gym'); setGymInput({ type: "strength", name: "", weight: "", reps: "", sets: "", duration: "", distance: "" }); }} className="bg-surface-container-highest px-6 py-2 rounded-full text-primary font-bold text-sm hover:bg-surface-bright transition-colors">
              Log Workout
            </button>
          </div>

          <div 
            className="space-y-4 relative z-10 max-h-[400px] overflow-y-auto scrollbar-none"
            onMouseEnter={handleDragScroll}
          >
            {activeWorkouts.length === 0 ? (
              <p className="text-center text-sm font-label text-on-surface-variant italic py-8">No workouts logged for this day.</p>
            ) : (
              activeWorkouts.map(ex => (
              <div key={ex.id} className="group flex items-center justify-between p-4 rounded-xl hover:bg-surface-container-low transition-colors">
                <div className="flex items-center gap-6">
                  <div className={`w-12 h-12 rounded-lg bg-${ex.color}/10 flex items-center justify-center text-${ex.color}`}>
                    <span className="material-symbols-outlined">{ex.icon || 'fitness_center'}</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-semibold text-lg">{ex.name}</h4>
                    {ex.type === 'cardio' ? (
                      <p className="text-sm text-on-surface-variant font-label">{ex.distance ? `${ex.distance} km` : 'Cardio'}</p>
                    ) : (
                      <p className="text-sm text-on-surface-variant font-label">Weight: {ex.weight}kg</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-4">
                  {ex.type === 'cardio' ? (
                    <span className="bg-surface-container-lowest px-4 py-2 rounded-lg font-headline font-bold text-tertiary">{ex.duration} Min</span>
                  ) : (
                    <>
                      <span className="bg-surface-container-lowest px-4 py-2 rounded-lg font-headline font-bold">{ex.reps} Reps</span>
                      <span className="bg-surface-container-lowest px-4 py-2 rounded-lg font-headline font-bold">{ex.sets} Sets</span>
                    </>
                  )}
                </div>
              </div>
            )))}
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl"></div>
        </section>

        {/* Supplements Checklist */}
        <section className="lg:col-span-4 bg-surface-container-low rounded-[2rem] p-8 border-b-2 border-outline-variant/15 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-headline font-bold text-on-surface">Supplements</h2>
            <button onClick={() => { setModal('supplement'); setSuppInput({ name: "", amount: "" }); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container-highest text-primary hover:bg-surface-bright transition-colors">
              <span className="material-symbols-outlined text-sm">add</span>
            </button>
          </div>
          <div 
            className="flex-1 space-y-3 max-h-[350px] overflow-y-auto scrollbar-none"
            onMouseEnter={handleDragScroll}
          >
            {supplements.map(s => (
              <label key={s.id} className="flex items-center gap-4 p-4 bg-surface rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors group relative overflow-hidden">
                <input 
                  type="checkbox" 
                  checked={s.taken} 
                  onChange={() => toggleSupplement(s.id)}
                  className="w-5 h-5 rounded border-outline-variant bg-surface-container-high text-secondary focus:ring-secondary" 
                />
                <span className={`font-label transition-colors ${s.taken ? 'text-on-surface-variant line-through decoration-on-surface-variant/30' : 'text-on-surface group-hover:text-primary'}`}>{s.name}</span>
                <span className="ml-auto text-xs text-on-surface-variant font-mono group-hover:opacity-0 transition-opacity">{s.amount}</span>
                
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteSupplement(s.id); }}
                  className="absolute right-2 opacity-0 group-hover:opacity-100 bg-surface-container-highest text-on-surface-variant hover:text-error w-8 h-8 flex items-center justify-center rounded-full shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </label>
            ))}
          </div>
          <p className="mt-6 text-xs text-on-surface-variant italic font-body text-center">Optimizing micronutrients for peak focus.</p>
        </section>

        {/* Food Diary */}
        <section className="lg:col-span-6 bg-surface-container-low rounded-[2rem] p-8 border-b-2 border-outline-variant/15 flex flex-col gap-6 h-full">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-headline font-bold text-on-surface flex items-center gap-3">
                Food diary
                <button 
                  onClick={() => { setHistoryContext('food'); setIsHistoryOpen(true); }}
                  className="bg-surface-container-highest text-sm font-label text-on-surface-variant px-3 py-1.5 rounded-lg hover:text-primary hover:border-primary border border-transparent cursor-pointer flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  {foodDate}
                </button>
              </h2>
              <p className="text-xs font-label text-on-surface-variant bg-surface px-3 py-1 rounded-full uppercase tracking-widest mt-2 inline-block">Daily Total: {totalMacros.kcal} kcal</p>
            </div>
            <button onClick={() => { setModal('food'); setFoodInput({ name: "", desc: "", kcal: "", p: "", c: "", f: "" }); }} className="bg-surface-container-highest px-6 py-2 rounded-full text-primary font-bold text-sm hover:bg-surface-bright transition-colors">
              Add Meal
            </button>
          </div>
          <div 
            className="space-y-6 max-h-[175px] overflow-y-auto scrollbar-none"
            onMouseEnter={handleDragScroll}
          >
            {activeMeals.length === 0 ? (
              <p className="text-center text-sm font-label text-on-surface-variant italic py-8">No meals tracked for this day.</p>
            ) : (
              activeMeals.map(m => (
                <div key={m.id} className="flex items-center gap-4 group">
                  <img alt={m.name} className="w-16 h-16 rounded-xl object-cover" src={m.img} />
                  <div className="flex-1">
                    <h4 className="font-headline font-semibold">{m.name}</h4>
                    <p className="text-sm font-body text-on-surface-variant italic">{m.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-headline font-bold text-primary">{m.kcal}</p>
                    <p className="text-[10px] text-on-surface-variant font-label uppercase">Kcal</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-auto pt-6 border-t border-outline-variant/15 flex justify-between">
            {[{l:"Protein", v:totalMacros.p+"g"}, {l:"Carbs", v:totalMacros.c+"g"}, {l:"Fats", v:totalMacros.f+"g"}].map(m => (
              <div key={m.l} className="text-center">
                <p className="text-xs font-label text-on-surface-variant">{m.l}</p>
                <p className="font-headline font-bold">{m.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skin Care */}
        <section className="lg:col-span-6 bg-surface-container-high rounded-[2rem] p-8 relative flex flex-col gap-8 h-full">
          <h2 className="text-2xl font-headline font-bold text-on-surface">Skin Care</h2>
          <div className="grid grid-cols-2 gap-8">
            {['morning', 'night'].map(type => (
              <div key={type} className="space-y-4">
                <div className={`flex items-center justify-between ${type==='morning'?'text-primary':'text-tertiary'}`}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">{type==='morning'?'light_mode':'dark_mode'}</span>
                    <span className="text-xs font-label uppercase tracking-widest font-bold">{type} Routine</span>
                  </div>
                  <button onClick={() => { setModal('skin'); setSkinInput({ type, name: "" }); }} className="opacity-50 hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-[14px]">add</span>
                  </button>
                </div>
                <div className="space-y-3">
                  {skinCare[type].map(step => (
                    <div key={step.id} onClick={() => toggleSkin(type, step.id)} className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-2 h-2 rounded-full transition-all flex-shrink-0 ${step.done ? (type==='morning'?'bg-primary':'bg-tertiary') : 'bg-outline-variant'}`}></div>
                      <span className={`text-sm font-body transition-colors ${step.done ? 'text-on-surface line-through decoration-on-surface-variant/30' : 'text-on-surface-variant group-hover:text-on-surface'}`}>{step.name}</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteSkin(type, step.id); }} className="ml-auto opacity-0 group-hover:opacity-100 text-error hover:text-error-dim transition-opacity">
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto bg-surface p-4 rounded-xl flex items-center gap-4 border border-outline-variant/10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${skinScore === 100 ? 'border-primary' : (skinScore > 50 ? 'border-secondary' : 'border-error')} relative`}>
               <span className="text-[10px] font-bold font-mono">{skinScore}%</span>
            </div>
            <div>
              <p className="text-xs font-label text-on-surface-variant uppercase tracking-tighter">Consistency Score</p>
              <p className="font-headline font-bold text-lg">{skinScore === 100 ? "Radiant & Clear" : (skinScore > 0 ? "Improving..." : "Start Today")}</p>
            </div>
            <button className="ml-auto text-primary text-sm font-bold hover:tracking-widest transition-all">LOG DETAILS</button>
          </div>
        </section>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dim text-on-primary shadow-2xl flex items-center justify-center active:scale-95 transition-transform md:hidden z-50">
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Spacer for mobile nav */}
      <div className="h-24 md:hidden"></div>

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 py-3 md:hidden z-50 bg-[#0c0e11]/80 backdrop-blur-xl border-t border-outline-variant/10 flex justify-around">
        {[
          { l: "Home", i: "dashboard", h: "/" },
          { l: "Mind", i: "psychology", h: "/mentally" },
          { l: "Center", i: "add", h: "#", main: true },
          { l: "Social", i: "smart_toy", h: "/socially" },
          { l: "Physical", i: "fitness_center", h: "/physically", active: true }
        ].map(item => (
          item.main ? (
            <div key="main" className="relative -top-6">
              <button className="w-14 h-14 bg-gradient-to-br from-primary to-primary-dim rounded-full shadow-lg flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined text-3xl">{item.i}</span>
              </button>
            </div>
          ) : (
            <a key={item.l} className={`flex flex-col items-center gap-1 ${item.active ? 'text-primary' : 'text-on-surface-variant'}`} href={item.h}>
              <span className={`material-symbols-outlined text-2xl ${item.active ? 'filled-icon' : ''}`}>{item.i}</span>
              <span className="text-[10px] font-label">{item.l}</span>
            </a>
          )
        ))}
      </nav>

      {/* Universal Modal */}
      {modal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-surface-container-high w-full max-w-sm rounded-[2rem] p-6 shadow-2xl border border-outline-variant/15 relative">
            <h3 className="font-headline font-bold text-xl mb-4 text-on-surface capitalize">
              {modal === 'gym' ? 'Log Gym Workout' : `Update ${modal}`}
            </h3>
            
            {modal === 'gym' ? (
              <div className="space-y-3">
                <div className="flex gap-2 p-1 bg-surface rounded-xl">
                   <button onClick={() => setGymInput({...gymInput, type: 'strength'})} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${gymInput.type === 'strength' || !gymInput.type ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>Strength</button>
                   <button onClick={() => setGymInput({...gymInput, type: 'cardio'})} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${gymInput.type === 'cardio' ? 'bg-tertiary text-on-primary shadow-sm' : 'text-on-surface-variant hover:bg-surface-container'}`}>Cardio</button>
                </div>
                <input className="w-full bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder={gymInput.type === 'cardio' ? "Activity (e.g. Running, HIIT)" : "Exercise Name"} value={gymInput.name} onChange={e => setGymInput({...gymInput, name: e.target.value})} autoFocus />
                
                {(!gymInput.type || gymInput.type === 'strength') ? (
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Weight" value={gymInput.weight} onChange={e => setGymInput({...gymInput, weight: e.target.value})} />
                    <input type="number" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Reps" value={gymInput.reps} onChange={e => setGymInput({...gymInput, reps: e.target.value})} />
                    <input type="number" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Sets" value={gymInput.sets} onChange={e => setGymInput({...gymInput, sets: e.target.value})} />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-tertiary text-on-surface" placeholder="Duration (min)" value={gymInput.duration} onChange={e => setGymInput({...gymInput, duration: e.target.value})} />
                    <input type="number" step="0.1" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-tertiary text-on-surface" placeholder="Distance (km)" value={gymInput.distance} onChange={e => setGymInput({...gymInput, distance: e.target.value})} />
                  </div>
                )}
              </div>
            ) : modal === 'food' ? (
              <div className="space-y-3">
                <input className="w-full bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Meal Name" value={foodInput.name} onChange={e => setFoodInput({...foodInput, name: e.target.value})} />
                <input className="w-full bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Description / Ingredients" value={foodInput.desc} onChange={e => setFoodInput({...foodInput, desc: e.target.value})} />
                <div className="grid grid-cols-4 gap-2">
                  <input type="number" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface text-primary font-bold" placeholder="Kcal" value={foodInput.kcal} onChange={e => setFoodInput({...foodInput, kcal: e.target.value})} />
                  <input type="number" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="P(g)" value={foodInput.p} onChange={e => setFoodInput({...foodInput, p: e.target.value})} />
                  <input type="number" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="C(g)" value={foodInput.c} onChange={e => setFoodInput({...foodInput, c: e.target.value})} />
                  <input type="number" className="bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="F(g)" value={foodInput.f} onChange={e => setFoodInput({...foodInput, f: e.target.value})} />
                </div>
              </div>
            ) : modal === 'skin' ? (
              <input className="w-full bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Product / Step Name (e.g. Toner)" value={skinInput.name} onChange={e => setSkinInput({...skinInput, name: e.target.value})} autoFocus />
            ) : modal === 'supplement' ? (
              <div className="space-y-3">
                <input className="w-full bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Supplement Name" value={suppInput.name} onChange={e => setSuppInput({...suppInput, name: e.target.value})} autoFocus />
                <input className="w-full bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" placeholder="Amount (e.g. 5g, 1 Capsule)" value={suppInput.amount} onChange={e => setSuppInput({...suppInput, amount: e.target.value})} />
              </div>
            ) : modal === 'hydration' ? (
              <div className="space-y-3">
                <select className="w-full bg-surface p-3 rounded-xl border border-outline-variant/20 text-sm focus:outline-none focus:border-primary text-on-surface" value={hydrationProfile} onChange={e => setHydrationProfile(e.target.value)}>
                  {Object.keys(HR_PROFILES).map(p => <option key={p} value={p}>{p} ({HR_PROFILES[p]}L)</option>)}
                </select>
                <input type="number" step="0.1" autoFocus className="w-full bg-surface p-4 rounded-xl border border-outline-variant/20 text-lg font-bold text-center focus:outline-none focus:border-primary text-on-surface" value={inputValue} onChange={e => setInputValue(e.target.value)} />
              </div>
            ) : (
              <input type="number" autoFocus className="w-full bg-surface p-4 rounded-xl border border-outline-variant/20 text-lg font-bold text-center focus:outline-none focus:border-primary text-on-surface" value={inputValue} onChange={e => setInputValue(e.target.value)} />
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-xl font-bold text-sm bg-surface-container hover:bg-surface-bright transition-colors text-on-surface-variant">Cancel</button>
              <button onClick={handleSaveModal} className="flex-1 py-3 rounded-xl font-bold text-sm bg-primary text-on-primary hover:opacity-90 transition-opacity">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* History Calendar Modal */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md transition-opacity">
          <div className="bg-surface-container-high w-full max-w-lg rounded-3xl p-8 border border-outline-variant/20 shadow-2xl relative overflow-hidden flex flex-col max-h-[80vh]">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl z-0"></div>
            
            <div className="flex justify-between items-center mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-2xl">history</span>
                <h3 className="text-2xl font-headline font-bold text-on-surface">Select Date</h3>
              </div>
              <button 
                onClick={() => setIsHistoryOpen(false)} 
                className="text-on-surface-variant hover:text-primary transition-colors bg-surface p-2 rounded-full border border-outline-variant/10"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto space-y-4 pr-2 relative z-10 flex-1 scrollbar-hide">
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
                    const isSelected = dateStr === (historyContext === 'food' ? foodDate : gymDate);
                    const isToday = dateStr === getLocalISODate(new Date());
                    
                    days.push(
                      <button 
                        key={i}
                        onClick={() => {
                          if (historyContext === 'food') setFoodDate(dateStr);
                          else setGymDate(dateStr);
                          setIsHistoryOpen(false);
                        }}
                        className={`h-10 rounded-lg flex items-center justify-center font-body text-sm relative transition-all ${isSelected ? 'bg-primary/20 text-primary font-bold hover:bg-primary/30' : 'hover:bg-surface-container text-on-surface-variant'} ${isToday && !isSelected ? 'border border-primary/50 text-on-surface' : ''}`}
                      >
                        {i}
                      </button>
                    );
                  }
                  return days;
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .filled-icon { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
      `}</style>
    </div>
  );
}
