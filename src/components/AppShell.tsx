"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Home, BookOpen, PenLine, Users, ArrowLeftRight, Library } from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/books", label: "Books Management", icon: BookOpen },
  { href: "/authors", label: "Author Management", icon: PenLine },
  { href: "/members", label: "Reader Management", icon: Users },
  { href: "/borrow", label: "Borrow / Return", icon: ArrowLeftRight },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

const isBareLayout = pathname === "/login" || pathname === "/register" || pathname.startsWith("/portal");
if (isBareLayout) {
  return <>{children}</>;
}

  return (
    <div className="min-h-screen bg-slate-100">
      <aside
        className={
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-slate-900 text-slate-200 transition-transform duration-200 lg:translate-x-0 " +
          (sidebarOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-5">
          <Library size={22} className="text-sky-400" />
          <span className="font-display text-lg font-bold text-white">Library Manager</span>
        </div>
        <nav className="py-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={
                  "flex items-center gap-3 px-5 py-3 text-sm transition-colors " +
                  (active
                    ? "bg-sky-600 text-white font-medium"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white")
                }
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-sky-600 px-4 shadow-md">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded p-2 text-white hover:bg-sky-700 lg:hidden"
          >
            <Menu size={22} />
          </button>
        </header>

        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}