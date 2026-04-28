export default function Topnav() {
  return (
    <header className="sticky top-0 z-40 bg-[#0c0e11]/60 backdrop-blur-xl flex justify-between items-center w-full px-8 py-4">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <img className="relative w-10 h-10 rounded-full border-2 border-surface-container-high object-cover" alt="User profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDQ6dC-Fc50HcL5Egmtif1QTHioAVFfHQYHad6XeZlum4FTOnWfMhAmXmapl-aeCbWRqnMz6MTmeSmjL-CCvAVqGAZCNzxeE4wL64Ar7M6yzjAabLyGofr0EnpGO0NxFaZdkQmVlwXXQbp2NAd61RUDRY3HzUZ_xBDWQ7HEUgrpeMO1g95U-jbeoWwCwQpicCl9sxcabGjDezJtTW2hNV8_4v2KZ5wqbR28UzH6ZT5i-01xw0VMZluNoYy4mWhQkqq12BagG7D7iwfO"/>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary rounded-full border-2 border-surface"></div>
        </div>
        <div className="hidden sm:block">
          <h2 className="text-[#f9f9fd] font-headline font-bold text-lg leading-tight">Focus Reset</h2>
          <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-[0.2em]">Monday, Oct 23</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 text-[#aaabaf] hover:bg-[#292c31]/50 transition-colors rounded-full active:scale-95">
          <span className="material-symbols-outlined" data-icon="notifications">notifications</span>
        </button>
        <button className="p-2 text-[#aaabaf] hover:bg-[#292c31]/50 transition-colors rounded-full active:scale-95">
          <span className="material-symbols-outlined" data-icon="settings">settings</span>
        </button>
      </div>
    </header>
  );
}
