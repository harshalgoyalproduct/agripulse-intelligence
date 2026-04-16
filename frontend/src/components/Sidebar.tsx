'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Cloud,
  Satellite,
  TrendingUp,
  AlertCircle,
  Bug,
  Sprout,
  Map,
  Menu,
  X,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Command Center', icon: LayoutDashboard },
    { href: '/weather', label: 'Weather Intel', icon: Cloud },
    { href: '/satellite', label: 'Satellite Data', icon: Satellite },
    { href: '/market', label: 'Mandi Prices', icon: TrendingUp },
    { href: '/forecast', label: 'Demand Forecast', icon: TrendingUp },
    { href: '/alerts', label: 'Pest Intelligence', icon: AlertCircle },
    { href: '/crop-yield', label: 'Crop Yield', icon: Sprout },
    { href: '/map', label: 'District Map', icon: Map },
  ];

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-agri-primary text-white p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar-gradient text-white p-6 shadow-lg transition-transform duration-300 ease-in-out z-40 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:static md:translate-x-0`}
      >
        {/* Logo */}
        <div className="mb-8 pt-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-agri-accent rounded-lg p-2">
              <Sprout size={24} className="text-agri-dark" />
            </div>
            <div>
              <h1 className="text-xl font-bold">AgriPulse</h1>
              <p className="text-xs text-gray-300">Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(href)
                  ? 'bg-agri-accent text-agri-dark font-semibold'
                  : 'text-gray-100 hover:bg-white hover:bg-opacity-10'
              }`}
            >
              <Icon size={20} />
              <span className="text-sm">{label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer info */}
        <div className="absolute bottom-6 left-6 right-6 text-xs text-gray-300">
          <p className="mb-2 font-semibold">Vidarbha Region</p>
          <p>Real-time crop intelligence for cotton belt</p>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
