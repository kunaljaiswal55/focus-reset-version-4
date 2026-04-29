"use client";
import { useState, useEffect } from "react";

export default function FinanciallyPage() {
  const [transactions, setTransactions] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [settledDebt, setSettledDebt] = useState(0);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Add Transaction Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("earning");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [sector, setSector] = useState("Stocks");
  const [creditor, setCreditor] = useState("");
  const [isWithdrawal, setIsWithdrawal] = useState(false);

  // Add Purchase Modal
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseTitle, setPurchaseTitle] = useState("");
  const [purchaseCategory, setPurchaseCategory] = useState("Utility");
  const [purchaseTarget, setPurchaseTarget] = useState("");

  const colorMap = {
    primary: { text: "text-primary", bg: "bg-primary" },
    secondary: { text: "text-secondary", bg: "bg-secondary" },
    tertiary: { text: "text-tertiary", bg: "bg-tertiary" },
  };

  const sectors = ["Stocks", "Crypto", "Real Estate", "Bonds", "Cash", "Commodities"];
  const sectorColors = ["primary", "secondary", "tertiary", "primary-dim", "surface-container-highest", "secondary-dim"];

  const typeConfig = {
    earning: { icon: "call_received", color: "secondary", label: "Earning" },
    spending: { icon: "call_made", color: "error", label: "Spending" },
    investment: { icon: "trending_up", color: "primary", label: "Investment" },
    withdrawal: { icon: "trending_down", color: "error", label: "Withdrawal" },
    debt: { icon: "credit_card", color: "tertiary", label: "Debt" },
  };

  useEffect(() => {
    const savedTx = localStorage.getItem("fin_transactions");
    const savedPurchases = localStorage.getItem("futurePurchases");
    const savedSettledDebt = localStorage.getItem("fin_settled_debt");

    if (savedTx) {
      setTransactions(JSON.parse(savedTx));
    } else {
      setTransactions([]);
    }

    if (savedPurchases) {
      setPurchases(JSON.parse(savedPurchases));
    } else {
      setPurchases([]);
    }

    if (savedSettledDebt) {
      setSettledDebt(parseFloat(savedSettledDebt));
    }

    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem("fin_transactions", JSON.stringify(transactions));
      localStorage.setItem("futurePurchases", JSON.stringify(purchases));
      localStorage.setItem("fin_settled_debt", settledDebt.toString());
    }
  }, [transactions, purchases, settledDebt, isDataLoaded]);

  // Drag to scroll logic
  const handleDragScroll = (e) => {
    const slider = e.currentTarget;
    let isDown = false;
    let startX;
    let startY;
    let scrollLeft;
    let scrollTop;

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

    // Attach listeners once
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

  // Computed financials
  const earnings = transactions.filter(t => t.type === "earning").reduce((s, t) => s + t.amount, 0);
  const spending = transactions.filter(t => t.type === "spending").reduce((s, t) => s + t.amount, 0);
  const totalInvestedIn = transactions.filter(t => t.type === "investment").reduce((s, t) => s + t.amount, 0);
  const totalWithdrawn = transactions.filter(t => t.type === "withdrawal").reduce((s, t) => s + t.amount, 0);
  const totalInvested = Math.max(0, totalInvestedIn - totalWithdrawn);
  const rawDebt = transactions.filter(t => t.type === "debt").reduce((s, t) => s + t.amount, 0);
  // Subtract ALL repayments: partial payments on active goals + fully settled (deleted) debts
  const activeRepaidDebt = purchases
    .filter(p => p.category === "Debt")
    .reduce((s, p) => s + Math.min(p.saved, p.target), 0);
  const totalDebt = Math.max(0, rawDebt - (activeRepaidDebt + settledDebt));
  const liquidAssets = Math.max(0, earnings - spending);
  const netWorth = liquidAssets + totalInvested - totalDebt;
  const savingsRate = earnings > 0 ? (((earnings - spending) / earnings) * 100).toFixed(1) : 0;

  // Investment by sector
  const investmentBySector = sectors.map(s => {
    const invested = transactions.filter(t => t.type === "investment" && t.sector === s).reduce((sum, t) => sum + t.amount, 0);
    const withdrawn = transactions.filter(t => t.type === "withdrawal" && t.sector === s).reduce((sum, t) => sum + t.amount, 0);
    return { name: s, amount: Math.max(0, invested - withdrawn) };
  });
  const maxSector = Math.max(...investmentBySector.map(s => s.amount), 1);

  const adjustFund = (id, delta) => {
    setPurchases(purchases.map(p =>
      p.id === id ? { ...p, saved: Math.max(0, Math.min(p.target, p.saved + delta)) } : p
    ));
  };

  const handleAddTransaction = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();

    // If investment tab with withdrawal toggled, the actual type is "withdrawal"
    const effectiveType = (modalType === "investment" && isWithdrawal) ? "withdrawal" : modalType;

    const newTx = {
      id: Date.now(),
      type: effectiveType,
      amount: amt,
      description: description.trim() ||
        (effectiveType === "debt" ? `Debt from ${creditor}` :
          effectiveType === "investment" ? `${sector} Investment` :
            effectiveType === "withdrawal" ? `${sector} Withdrawal` :
              typeConfig[effectiveType].label),
      source: (effectiveType === "investment" || effectiveType === "withdrawal") ? sector : (effectiveType === "debt" ? creditor : description.trim()),
      sector: (effectiveType === "investment" || effectiveType === "withdrawal") ? sector : null,
      creditor: effectiveType === "debt" ? creditor : null,
      date: dateStr,
    };

    setTransactions(prev => [newTx, ...prev]);

    if (effectiveType === "debt" && creditor.trim()) {
      const colorArr = ["primary", "secondary", "tertiary"];
      setPurchases(prev => [...prev, {
        id: Date.now() + 1,
        title: `Repay ${creditor.trim()}`,
        category: "Debt",
        target: amt,
        saved: 0,
        color: colorArr[Math.floor(Math.random() * colorArr.length)],
      }]);
    }

    setAmount(""); setDescription(""); setCreditor(""); setSector("Stocks"); setIsWithdrawal(false);
    setIsModalOpen(false);
  };

  const fmt = (n) => n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      <div className="p-6 lg:p-10 space-y-10 max-w-7xl mx-auto">

        {/* Mobile Header */}
        <div className="mx-2 mb-2 lg:mb-10 lg:hidden">
          <h2 className="text-3xl font-bold tracking-tighter text-[#f9f9fd] font-headline">Financially</h2>
        </div>

        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Net Worth Card */}
          <div className="lg:col-span-2 bg-surface-container-high rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-between min-h-[320px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>
            <div>
              <span className="text-sm font-label text-on-surface-variant tracking-widest uppercase">Total Net Worth</span>
              <h3 className="text-6xl font-headline font-bold mt-4 text-on-surface">
                &#8377;{Math.floor(netWorth).toLocaleString("en-IN")}.<span className="text-primary-dim">{String(Math.round((netWorth % 1) * 100)).padStart(2, "0")}</span>
              </h3>
              <div className="flex items-center gap-2 mt-4 text-secondary">
                <span className="material-symbols-outlined">trending_up</span>
                <span className="font-label font-bold">Savings Rate: {savingsRate}%</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="space-y-1">
                <p className="text-xs text-on-surface-variant font-label">Liquid Assets</p>
                <p className="text-xl font-headline font-bold">&#8377;{liquidAssets.toLocaleString("en-IN")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-on-surface-variant font-label">Invested</p>
                <p className="text-xl font-headline font-bold">&#8377;{totalInvested.toLocaleString("en-IN")}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-on-surface-variant font-label">Debt</p>
                <p className="text-xl font-headline font-bold text-error-dim">&#8377;{totalDebt.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Monthly Flow */}
          <div className="bg-surface-container-low rounded-[2rem] p-8 flex flex-col justify-between border-b-2 border-outline-variant/10 relative">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-headline text-xl font-bold">Monthly Flow</h4>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors focus:outline-none shadow-sm"
                title="Add Transaction"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary-container/30 flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">call_received</span>
                  </div>
                  <span className="font-label text-sm">Earnings</span>
                </div>
                <span className="font-headline font-bold text-lg">+&#8377;{fmt(earnings)}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center text-error">
                    <span className="material-symbols-outlined">call_made</span>
                  </div>
                  <span className="font-label text-sm">Spending</span>
                </div>
                <span className="font-headline font-bold text-lg text-error">-&#8377;{fmt(spending)}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-outline-variant/15">
              <p className="text-xs text-on-surface-variant mb-2">Savings Rate</p>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-1000 ease-in-out" style={{ width: `${Math.max(0, Math.min(100, savingsRate))}%` }}></div>
              </div>
              <p className="text-right text-xs font-bold text-primary mt-2">{savingsRate}%</p>
            </div>
          </div>
        </section>

        {/* Main Dashboard */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">

            {/* Asset Allocation Chart */}
            <div className="flex items-center justify-between">
              <h4 className="font-headline text-2xl font-bold italic tracking-tight text-on-surface">Asset Allocation</h4>
              <span className="px-3 py-1 bg-surface-container-high rounded-full text-xs font-label text-primary">Investments</span>
            </div>
            <div className="bg-surface-container-low rounded-[2rem] p-8 h-80 flex items-end gap-2 relative">
              {investmentBySector.map((s, i) => {
                const outerH = maxSector > 0 ? Math.max((s.amount / maxSector) * 88, 8) : 8;
                const innerH = outerH * 0.65;
                const c = sectorColors[i];
                return (
                  <div
                    key={s.name}
                    className={`flex-1 rounded-t-xl transition-all cursor-pointer relative group/bar`}
                    style={{ height: `${outerH}%`, backgroundColor: `var(--color-${c}, #ffffff18)`, opacity: s.amount > 0 ? 1 : 0.3 }}
                    title={`${s.name}: ₹${s.amount.toLocaleString("en-IN")}`}
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t-xl transition-all"
                      style={{ height: `${innerH}%`, backgroundColor: `var(--color-${c}, #ffffff40)` }}
                    ></div>
                  </div>
                );
              })}
              <div className="absolute bottom-4 left-8 right-8 flex justify-between text-[10px] text-on-surface-variant font-label uppercase tracking-tighter opacity-50">
                {sectors.map(s => <span key={s}>{s}</span>)}
              </div>
            </div>

            {/* Activity History */}
            <div className="bg-surface-container-high rounded-[2rem] overflow-hidden">
              <div className="px-8 py-6 border-b border-outline-variant/15 flex justify-between items-center">
                <h5 className="font-headline font-bold text-lg">Activity History</h5>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="text-primary text-sm font-label flex items-center gap-1 hover:gap-2 transition-all"
                >
                  Add Entry <span className="material-symbols-outlined text-sm">add_circle</span>
                </button>
              </div>
              <div
                className="p-4 max-h-[320px] overflow-y-auto scrollbar-none"
                onMouseEnter={handleDragScroll}
              >
                <div className="space-y-1">
                  {transactions.length === 0 && (
                    <div className="text-center py-10 text-on-surface-variant text-sm font-label">
                      No transactions yet — click + in Monthly Flow to add one.
                    </div>
                  )}
                  {transactions.map(tx => {
                    const cfg = typeConfig[tx.type] || typeConfig.earning;
                    const isNegative = tx.type === "spending" || tx.type === "debt" || tx.type === "withdrawal";
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-surface-bright/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-${cfg.color}`}>
                            <span className="material-symbols-outlined">{cfg.icon}</span>
                          </div>
                          <div>
                            <p className="font-label font-bold text-on-surface">{tx.description}</p>
                            <p className="text-xs text-on-surface-variant font-body italic">{tx.source || cfg.label}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-headline font-bold ${isNegative ? "text-error" : "text-" + cfg.color}`}>
                            {isNegative ? "-" : "+"}&#8377;{tx.amount.toLocaleString("en-IN")}
                          </p>
                          <p className="text-[10px] text-on-surface-variant font-label">{tx.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">

            {/* Future Purchases */}
            <div className="bg-surface-container-low rounded-[2rem] p-8">
              <div className="flex items-center justify-between mb-8">
                <h4 className="font-headline text-xl font-bold tracking-tight">Future Purchases</h4>
                <button onClick={() => setIsPurchaseModalOpen(true)} className="focus:outline-none">
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors">add_circle</span>
                </button>
              </div>

              <div
                className="space-y-8 max-h-[400px] overflow-y-auto scrollbar-none pr-1"
                onMouseEnter={handleDragScroll}
              >
                {[...purchases]
                  .sort((a, b) => (a.saved >= a.target ? 1 : 0) - (b.saved >= b.target ? 1 : 0))
                  .map(purchase => {
                    const percent = Math.min(100, Math.round((purchase.saved / purchase.target) * 100));
                    const left = purchase.target - purchase.saved;
                    const colors = colorMap[purchase.color] || colorMap.primary;
                    const isDone = purchase.saved >= purchase.target;
                    return (
                      <div key={purchase.id} className={`group relative transition-opacity ${isDone ? "opacity-60" : ""}`}>
                        <div className="flex justify-between items-end mb-3">
                          <div>
                            <p className="text-xs text-on-surface-variant font-label uppercase tracking-widest">{purchase.category}</p>
                            <p className={`font-body text-lg ${isDone ? "line-through text-on-surface-variant" : "text-on-surface"}`}>{purchase.title}</p>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className={`font-headline font-bold ${colors.text}`}>&#8377;{purchase.target.toLocaleString("en-IN")}</p>
                            <p className="text-xs text-on-surface-variant font-label mt-1">Saved: &#8377;{purchase.saved.toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden mb-3">
                          <div className={`h-full ${colors.bg} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-label text-on-surface-variant">
                          <span>{isDone ? "Goal Reached!" : `${percent}% Saved`}</span>
                          <div className="flex items-center gap-3">
                            {!isDone && <span>&#8377;{left.toLocaleString("en-IN")} to go</span>}
                            <div className="flex items-center gap-1.5 bg-surface-container-high rounded-full px-2 py-1">
                              <button
                                onClick={() => adjustFund(purchase.id, -100)}
                                disabled={isDone || purchase.saved === 0}
                                className="w-6 h-6 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container disabled:opacity-30 transition-colors"
                                title="Remove ₹100"
                              >
                                <span className="material-symbols-outlined text-[14px]">remove</span>
                              </button>
                              <button
                                onClick={() => adjustFund(purchase.id, 100)}
                                disabled={isDone}
                                className={`w-6 h-6 flex items-center justify-center rounded-full ${colors.text} hover:bg-surface-container disabled:opacity-30 transition-colors`}
                                title="Add ₹100"
                              >
                                <span className="material-symbols-outlined text-[14px]">add</span>
                              </button>
                              <div className="w-px h-4 bg-outline-variant/30 mx-1"></div>
                              <button
                                onClick={() => {
                                  if (purchase.category === "Debt") {
                                    // Always settle whatever has been paid so far (partial or full)
                                    const paidSoFar = Math.min(purchase.saved, purchase.target);
                                    if (paidSoFar > 0) {
                                      setSettledDebt(prev => prev + paidSoFar);
                                    }
                                    // If debt goal is deleted without ANY payment, the raw debt
                                    // transaction still exists. We settle the full target so
                                    // the debt disappears from net-worth entirely.
                                    if (paidSoFar === 0) {
                                      setSettledDebt(prev => prev + purchase.target);
                                    }
                                  }
                                  setPurchases(purchases.filter(p => p.id !== purchase.id));
                                }}
                                className="w-6 h-6 flex items-center justify-center rounded-full text-error hover:bg-error/10 transition-colors"
                                title="Delete Goal"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                {purchases.length === 0 && (
                  <div className="text-center py-8 bg-surface-container-high rounded-2xl border border-outline-variant/10 border-dashed">
                    <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest mb-2">No Goals Yet</p>
                    <p className="text-xs text-on-surface-variant/70 font-body">Click + to add a future purchase or add a debt.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Wealth Tip */}
            <div className="bg-gradient-to-br from-surface-container-high to-surface-container-low p-8 rounded-[2rem] border-b-2 border-primary/20 relative overflow-hidden group">
              <img
                alt="Financial wisdom visual"
                className="absolute inset-0 w-full h-full object-cover opacity-20 transition-transform duration-700 group-hover:scale-110"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz0oXT9sgWMg8acaU5nQ8tyZsVrbOk6n4Mc-lG7dAyJx9yZzRqXFFP--A-2de6K_xEzHLqeLV1dSx6VzrKVB3HMtksc2hNvKB5D4EDjLjNYrfrK-MHwtjmv-UuyVrF3ix7ZMAic56boNKzORq9g2ySUJ4eEvaauPnNRiCQLr5ic0NEuwOSo6MDOojrYv5oH__ZU6eqMEVN-Whfrpb5fvCdpqQFkWtMEeBLD58ywqTCzdLWr_O0NGoRl9pQfwWFf0LIDA7lb0LBPk0t"
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4 text-primary">
                  <span className="material-symbols-outlined">lightbulb</span>
                  <h5 className="font-headline font-bold">Focus Strategy</h5>
                </div>
                <p className="font-body text-on-surface-variant leading-relaxed">
                  Track every rupee — earnings, spending, investments and debts — to build a clear picture of your financial health.
                </p>
                <button onClick={() => setIsModalOpen(true)} className="mt-6 text-xs font-label font-bold text-primary hover:tracking-widest transition-all">
                  ADD TRANSACTION →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile spacer */}
      <div className="h-24 md:hidden"></div>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel flex justify-around items-center px-4 py-3 md:hidden z-50">
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
            <span className="material-symbols-outlined text-3xl">payments</span>
          </button>
        </div>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/socially">
          <span className="material-symbols-outlined text-2xl">smart_toy</span>
          <span className="text-[10px] font-label">Social</span>
        </a>
        <a className="flex flex-col items-center gap-1 text-on-surface-variant" href="/goals">
          <span className="material-symbols-outlined text-2xl">target</span>
          <span className="text-[10px] font-label">Goals</span>
        </a>
      </nav>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md">
          <div className="bg-surface-container-high w-full max-w-md rounded-3xl p-8 border border-outline-variant/20 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_circle</span>
                Add Transaction
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Type Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-surface-container-low rounded-xl p-1 mb-6">
              {["earning", "spending", "investment", "debt"].map(t => (
                <button
                  key={t}
                  onClick={() => { setModalType(t); if (t !== "investment") setIsWithdrawal(false); }}
                  className={`py-2 rounded-lg text-xs font-label font-bold capitalize transition-all ${modalType === t
                    ? "bg-surface-container-high text-on-surface shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface"
                    }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Amount (&#8377;)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all text-xl"
                  placeholder="0.00"
                  min="1"
                  autoFocus
                />
              </div>

              {/* Invest / Withdraw toggle + Sector (investment tab) */}
              {modalType === "investment" && (
                <>
                  <div className="flex items-center gap-2 bg-surface-container-low rounded-xl p-1">
                    <button
                      onClick={() => setIsWithdrawal(false)}
                      className={`flex-1 py-2 rounded-lg text-xs font-label font-bold transition-all flex items-center justify-center gap-1.5 ${
                        !isWithdrawal
                          ? "bg-primary/15 text-primary shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">trending_up</span>
                      Invest
                    </button>
                    <button
                      onClick={() => setIsWithdrawal(true)}
                      className={`flex-1 py-2 rounded-lg text-xs font-label font-bold transition-all flex items-center justify-center gap-1.5 ${
                        isWithdrawal
                          ? "bg-error/15 text-error shadow-sm"
                          : "text-on-surface-variant hover:text-on-surface"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">trending_down</span>
                      Withdraw
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Sector</label>
                    <select
                      value={sector}
                      onChange={e => setSector(e.target.value)}
                      className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all appearance-none"
                    >
                      {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </>
              )}

              {/* Creditor (debt only) */}
              {modalType === "debt" && (
                <div>
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">From Whom</label>
                  <input
                    type="text"
                    value={creditor}
                    onChange={e => setCreditor(e.target.value)}
                    className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="e.g., HDFC Bank, Friend Name"
                  />
                </div>
              )}

              {/* Description */}
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">
                  {modalType === "earning" ? "Source" : modalType === "spending" ? "Category / Description" : modalType === "investment" ? "Note (optional)" : "Purpose"}
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                  placeholder={
                    modalType === "earning" ? "e.g., Freelance, Salary" :
                      modalType === "spending" ? "e.g., Groceries, Rent" :
                        modalType === "investment" ? (isWithdrawal ? "e.g., Emergency, Profit booking" : "e.g., SIP, Lump sum") :
                          "e.g., Home loan, Personal loan"
                  }
                />
              </div>

              {/* Debt info */}
              {modalType === "debt" && creditor.trim() && (
                <p className="text-xs text-on-surface-variant bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
                  <span className="material-symbols-outlined text-[14px] align-middle mr-1 text-tertiary">info</span>
                  A goal <strong>"Repay {creditor}"</strong> will be auto-added to Future Purchases.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 rounded-full font-label text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTransaction}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-full font-label text-sm font-bold shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
              >
                {modalType === "investment" && isWithdrawal ? "Withdraw" : `Add ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Purchase Modal */}
      {isPurchaseModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0c0e11]/80 backdrop-blur-md">
          <div className="bg-surface-container-high w-full max-w-md rounded-3xl p-8 border border-outline-variant/20 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">add_shopping_cart</span>
                New Goal
              </h3>
              <button onClick={() => setIsPurchaseModalOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Goal Title</label>
                <input
                  type="text"
                  value={purchaseTitle}
                  onChange={e => setPurchaseTitle(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                  placeholder="e.g., Kyoto Retreat 2024"
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Category</label>
                  <select
                    value={purchaseCategory}
                    onChange={e => setPurchaseCategory(e.target.value)}
                    className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all appearance-none"
                  >
                    <option value="Technological">Technological</option>
                    <option value="Experiences">Experiences</option>
                    <option value="Utility">Utility</option>
                    <option value="Investment">Investment</option>
                    <option value="Education">Education</option>
                    <option value="Debt">Debt</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-2">Target (&#8377;)</label>
                  <input
                    type="number"
                    value={purchaseTarget}
                    onChange={e => setPurchaseTarget(e.target.value)}
                    className="w-full bg-surface-container-lowest/50 rounded-xl p-3 text-on-surface font-body border border-outline-variant/10 focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="0"
                    min="1"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setIsPurchaseModalOpen(false)}
                className="px-6 py-3 rounded-full font-label text-sm font-bold text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const amt = parseInt(purchaseTarget);
                  if (purchaseTitle.trim() && !isNaN(amt) && amt > 0) {
                    const colorArr = ["primary", "secondary", "tertiary"];
                    setPurchases([...purchases, {
                      id: Date.now(),
                      title: purchaseTitle,
                      category: purchaseCategory,
                      target: amt,
                      saved: 0,
                      color: colorArr[Math.floor(Math.random() * colorArr.length)],
                    }]);
                    setPurchaseTitle("");
                    setPurchaseTarget("");
                    setIsPurchaseModalOpen(false);
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-primary to-primary-dim text-on-primary rounded-full font-label text-sm font-bold shadow-lg hover:shadow-primary/30 active:scale-95 transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
