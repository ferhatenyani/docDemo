"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, UserCircle2, Settings } from "lucide-react";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Avatar } from "@/components/ui/misc";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/Dropdown";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const locale = useApp((s) => s.locale);
  const setLocale = useApp((s) => s.setLocale);
  const role = useApp((s) => s.role);
  const setRole = useApp((s) => s.setRole);
  const patients = useApp((s) => s.patients);
  const router = useRouter();

  const [q, setQ] = useState("");
  const [openResults, setOpenResults] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) setOpenResults(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const results = q.trim().length >= 2
    ? patients
        .filter((p) => `${p.nom} ${p.prenom} ${p.code} ${p.telephone}`.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6)
    : [];

  const roleLabel = t(locale, role === "MEDECIN" ? "role_medecin" : role === "SECRETAIRE" ? "role_secretaire" : "role_admin");

  return (
    <header className="sticky top-0 z-30 glass border-b border-line">
      <div className="w-full px-3 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenMobileNav}
          aria-label="Ouvrir le menu"
          className="lg:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div ref={rootRef} className="flex-1 relative max-w-[440px]">
          <div className="flex items-center gap-2 bg-white/70 border border-line rounded-md h-9 px-2.5 focus-within:border-brand-500 focus-within:bg-white focus-within:shadow-ring transition-all">
            <Search className="h-4 w-4 text-ink-400 shrink-0" />
            <input
              value={q}
              onChange={(e) => { setQ(e.target.value); setOpenResults(true); }}
              onFocus={() => setOpenResults(true)}
              placeholder={t(locale, "search")}
              className="flex-1 bg-transparent outline-none text-[13px] min-w-0"
            />
            <kbd className="hidden sm:inline-flex items-center h-5 px-1.5 rounded-sm bg-ink-100 text-ink-500 text-[10px] font-medium">⌘K</kbd>
          </div>
          {openResults && q.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg border border-line shadow-overlay py-1 max-h-80 overflow-auto z-40 animate-popIn">
              {results.length === 0 && (
                <div className="px-3 py-3 text-[13px] text-ink-500">Aucun patient trouvé</div>
              )}
              {results.map((p) => (
                <Link
                  key={p.id}
                  href={`/patients/${p.id}`}
                  onClick={() => { setOpenResults(false); setQ(""); }}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-ink-50 cursor-pointer"
                >
                  <Avatar name={`${p.prenom} ${p.nom}`} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-ink-900 truncate">{p.prenom} {p.nom}</div>
                    <div className="text-2xs text-ink-500 truncate">{p.code} • {p.telephone}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="ms-auto flex items-center gap-1 shrink-0">
          {/* Locale toggle - segmented style */}
          <div className="hidden sm:inline-flex items-center h-8 rounded-md border border-line bg-white p-0.5">
            <button
              onClick={() => setLocale("fr")}
              className={
                "h-7 px-2.5 rounded-[4px] text-[11px] font-semibold cursor-pointer transition-colors " +
                (locale === "fr" ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-800")
              }
            >FR</button>
            <button
              onClick={() => setLocale("ar")}
              className={
                "h-7 px-2.5 rounded-[4px] text-[11px] font-semibold cursor-pointer transition-colors " +
                (locale === "ar" ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-800")
              }
            >AR</button>
          </div>

          <Link
            href="/dashboard"
            aria-label="Notifications"
            className="h-9 w-9 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer relative transition-colors"
          >
            <Bell className="h-4.5 w-4.5 text-ink-700" style={{ height: 18, width: 18 }} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-white/90" />
          </Link>

          <div className="hidden sm:block w-px h-6 bg-line mx-1" />

          <Dropdown
            align="end"
            trigger={
              <button className="h-9 pl-1 pr-2 rounded-md hover:bg-ink-100 flex items-center gap-2 cursor-pointer transition-colors">
                <Avatar name="Amine Belkacem" size={28} />
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-[12px] font-semibold text-ink-900">Dr. Belkacem</span>
                  <span className="text-2xs text-ink-500">{roleLabel}</span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
              </button>
            }
          >
            {(close) => (
              <>
                <div className="px-3 py-2 eyebrow">Rôle actif</div>
                <DropdownItem icon={<UserCircle2 />} onClick={() => { setRole("MEDECIN"); close(); }}>
                  Médecin {role === "MEDECIN" && <span className="ms-1 text-brand-600">•</span>}
                </DropdownItem>
                <DropdownItem icon={<UserCircle2 />} onClick={() => { setRole("SECRETAIRE"); close(); }}>
                  Secrétaire {role === "SECRETAIRE" && <span className="ms-1 text-brand-600">•</span>}
                </DropdownItem>
                <DropdownItem icon={<UserCircle2 />} onClick={() => { setRole("ADMIN"); close(); }}>
                  Administrateur {role === "ADMIN" && <span className="ms-1 text-brand-600">•</span>}
                </DropdownItem>
                <DropdownSeparator />
                <DropdownItem icon={<Settings />} onClick={() => { router.push("/administration"); close(); }}>
                  Paramètres
                </DropdownItem>
              </>
            )}
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
