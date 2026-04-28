'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: 'dashboard', label: 'Dashboard' },
    { href: '/mentally', icon: 'psychology', label: 'Mentally' },
    { href: '/financially', icon: 'payments', label: 'Financially' },
    { href: '/socially', icon: 'smart_toy', label: 'Socially' },
    { href: '/physically', icon: 'fitness_center', label: 'Physically' },
    { href: '/goals', icon: 'target', label: 'Goals' },
  ];

  return (
    <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-[#111417] border-r border-[#46484b]/15 z-50">
      <div className="px-6 py-8">
        <h1 className="text-xl font-bold text-[#f9f9fd] font-headline tracking-tighter">Focus Reset</h1>
        <p className="text-xs text-on-surface-variant font-label mt-1">Digital Sanctuary</p>
      </div>
      <nav className="flex-1 px-3 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link 
              key={link.href}
              href={link.href} 
              className={
                isActive 
                  ? "flex items-center gap-3 bg-[#1d2024] text-[#81ecff] border-l-4 border-[#9df197] px-4 py-3 rounded-r-xl transition-all translate-x-1 duration-200"
                  : "flex items-center gap-3 text-[#aaabaf] px-4 py-3 hover:text-[#f9f9fd] hover:bg-[#1d2024] rounded-r-xl transition-all"
              }
            >
              <span className="material-symbols-outlined">{link.icon}</span>
              <span className={`font-label text-sm ${isActive ? 'font-medium' : ''}`}>{link.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="px-6 py-6 mt-auto border-t border-[#46484b]/15">
        <button className="w-full py-3 bg-gradient-to-br from-primary to-primary-dim text-on-primary rounded-xl font-label text-xs font-bold uppercase tracking-wider active:scale-95 transition-transform">
          Start Focus Session
        </button>
        <div className="mt-6 flex flex-col gap-3">
          <a href="#" className="flex items-center gap-3 text-[#aaabaf] text-xs font-label hover:text-[#f9f9fd]">
            <span className="material-symbols-outlined text-sm" data-icon="help">help</span> Support
          </a>
          <a href="#" className="flex items-center gap-3 text-[#aaabaf] text-xs font-label hover:text-[#f9f9fd]">
            <span className="material-symbols-outlined text-sm" data-icon="inventory_2">inventory_2</span> Archive
          </a>
        </div>
      </div>
    </aside>
  );
}
