"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar, MobileNavDrawer } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Toaster } from "@/components/ui/Toaster";
import { useApp } from "@/lib/store";

export function AppShell({ children }: { children: React.ReactNode }) {
  const locale = useApp((s) => s.locale);
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <div className="min-h-dvh bg-surface-muted text-ink-900">
      <div className="flex">
        <aside className="hidden lg:block w-[248px] xl:w-[260px] shrink-0 h-dvh sticky top-0">
          <Sidebar />
        </aside>
        <MobileNavDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />

        <main className="flex-1 min-w-0 flex flex-col">
          <Topbar onOpenMobileNav={() => setMobileOpen(true)} />
          <div className="flex-1 min-w-0">
            <div className="w-full px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-8">
              {children}
            </div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
}
