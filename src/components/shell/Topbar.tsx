"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, Bell, ChevronDown, UserCircle2, Settings, LogOut } from "lucide-react";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { Avatar } from "@/components/ui/misc";
import { landingPathForRole, permissionsFor } from "@/lib/permissions";
import type { Role } from "@/lib/types";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const locale = useApp((s) => s.locale);
  const setLocale = useApp((s) => s.setLocale);
  const role = useApp((s) => s.role);
  const setRole = useApp((s) => s.setRole);
  const patients = useApp((s) => s.patients);
  const utilisateurs = useApp((s) => s.utilisateurs);

  const [q, setQ] = useState("");
  const [openResults, setOpenResults] = useState(false);
  const searchRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => { if (!searchRootRef.current?.contains(e.target as Node)) setOpenResults(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const results = q.trim().length >= 2
    ? patients
        .filter((p) => `${p.nom} ${p.prenom} ${p.code} ${p.telephone}`.toLowerCase().includes(q.toLowerCase()))
        .slice(0, 6)
    : [];

  const currentUser = useMemo(() => utilisateurs.find((u) => u.id === "u1"), [utilisateurs]);
  const displayName = currentUser ? `Dr. ${currentUser.prenom} ${currentUser.nom}` : "Dr. Amine Belkacem";
  const displayEmail = currentUser?.email ?? "a.belkacem@ibnsina.dz";

  return (
    <header className="sticky top-0 z-30 glass border-b border-line">
      <div className="w-full px-3 sm:px-6 lg:px-8 h-14 sm:h-15 flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenMobileNav}
          aria-label={t(locale, "open_menu")}
          className="lg:hidden h-9 w-9 shrink-0 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div ref={searchRootRef} className="flex-1 min-w-0 relative max-w-[440px]">
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
                <div className="px-3 py-3 text-[13px] text-ink-500">{t(locale, "no_patient_found")}</div>
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
          <div className="inline-flex items-center h-8 rounded-md border border-line bg-white p-0.5">
            <button
              onClick={() => setLocale("fr")}
              aria-label="Français"
              aria-pressed={locale === "fr"}
              className={
                "h-7 px-2 sm:px-2.5 rounded-[4px] text-[11px] font-semibold cursor-pointer transition-colors " +
                (locale === "fr" ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-800")
              }
            >FR</button>
            <button
              onClick={() => setLocale("ar")}
              aria-label="العربية"
              aria-pressed={locale === "ar"}
              className={
                "h-7 px-2 sm:px-2.5 rounded-[4px] text-[11px] font-semibold cursor-pointer transition-colors " +
                (locale === "ar" ? "bg-ink-900 text-white" : "text-ink-500 hover:text-ink-800")
              }
            >AR</button>
          </div>

          <Link
            href="/dashboard"
            aria-label={t(locale, "notifications")}
            className="h-9 w-9 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer relative transition-colors"
          >
            <Bell className="text-ink-700" style={{ height: 18, width: 18 }} />
            <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-danger ring-2 ring-white/90" />
          </Link>

          <div className="hidden sm:block w-px h-6 bg-line mx-1" />

          <ProfileMenu
            role={role}
            setRole={setRole}
            displayName={displayName}
            displayEmail={displayEmail}
            locale={locale}
          />
        </div>
      </div>
    </header>
  );
}

interface ProfileMenuProps {
  role: Role;
  setRole: (r: Role) => void;
  displayName: string;
  displayEmail: string;
  locale: "fr" | "ar";
}

function ProfileMenu({ role, setRole, displayName, displayEmail, locale }: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const perms = permissionsFor(role);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (sheetRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    if (window.matchMedia("(max-width: 1023px)").matches) {
      document.body.style.overflow = "hidden";
    }
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const roleLabel = t(locale, role === "MEDECIN" ? "role_medecin" : role === "SECRETAIRE" ? "role_secretaire" : "role_admin");

  function switchRole(r: Role) {
    if (r === role) { setOpen(false); return; }
    setRole(r);
    setOpen(false);
    router.push(landingPathForRole(r));
  }

  function goto(path: string) {
    setOpen(false);
    router.push(path);
  }

  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={displayName}
        className="h-9 pl-1 pr-1.5 md:pr-2 rounded-md hover:bg-ink-100 flex items-center gap-1.5 md:gap-2 cursor-pointer transition-colors"
      >
        <Avatar name={displayName.replace(/^Dr\.\s*/, "")} size={28} />
        <div className="hidden md:flex flex-col items-start leading-tight">
          <span className="text-[12px] font-semibold text-ink-900">{shortName(displayName)}</span>
          <span className="text-2xs text-ink-500">{roleLabel}</span>
        </div>
        <ChevronDown className={"h-3.5 w-3.5 text-ink-400 transition-transform " + (open ? "rotate-180" : "")} />
      </button>

      {open && (
        <div
          role="menu"
          className="hidden lg:block absolute end-0 mt-1.5 w-[296px] rounded-lg bg-white border border-line shadow-overlay z-40 animate-popIn overflow-hidden"
        >
          <ProfilePanelContent
            role={role}
            displayName={displayName}
            displayEmail={displayEmail}
            locale={locale}
            perms={perms}
            onSwitchRole={switchRole}
            onGoto={goto}
            variant="dropdown"
          />
        </div>
      )}

      {open && mounted && createPortal(
        <div className="lg:hidden">
          <div
            onClick={close}
            className="fixed inset-0 z-[80] bg-ink-900/40 backdrop-blur-[2px] animate-fadeIn"
          />
          <div
            ref={sheetRef}
            role="menu"
            className="fixed inset-x-0 bottom-0 z-[81] rounded-t-2xl bg-white shadow-overlay animate-slideUp pb-[max(env(safe-area-inset-bottom),16px)]"
          >
            <div className="h-1 w-10 rounded-full bg-ink-200 mx-auto mt-2 mb-1" />
            <ProfilePanelContent
              role={role}
              displayName={displayName}
              displayEmail={displayEmail}
              locale={locale}
              perms={perms}
              onSwitchRole={switchRole}
              onGoto={goto}
              variant="sheet"
            />
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

interface PanelProps {
  role: Role;
  displayName: string;
  displayEmail: string;
  locale: "fr" | "ar";
  perms: ReturnType<typeof permissionsFor>;
  onSwitchRole: (r: Role) => void;
  onGoto: (path: string) => void;
  variant: "sheet" | "dropdown";
}

function ProfilePanelContent({
  role, displayName, displayEmail, locale, perms, onSwitchRole, onGoto, variant,
}: PanelProps) {
  const roles: { value: Role; labelKey: string; short: string }[] = [
    { value: "MEDECIN", labelKey: "role_medecin", short: "Médecin" },
    { value: "SECRETAIRE", labelKey: "role_secretaire", short: "Assist." },
    { value: "ADMIN", labelKey: "role_admin", short: "Admin" },
  ];
  const shortRoles: Record<Role, string> = {
    MEDECIN: locale === "ar" ? t(locale, "role_medecin") : "Médecin",
    SECRETAIRE: locale === "ar" ? t(locale, "role_secretaire") : "Assistante",
    ADMIN: locale === "ar" ? t(locale, "role_admin") : "Admin",
  };

  return (
    <div className={variant === "sheet" ? "px-1 pb-1" : ""}>
      <div className="px-4 py-3 flex items-center gap-3">
        <Avatar name={displayName.replace(/^Dr\.\s*/, "")} size={40} />
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-ink-900 truncate">{displayName}</div>
          <div className="text-[12px] text-ink-500 truncate">{displayEmail}</div>
        </div>
      </div>

      <div className="h-px bg-line" />

      <div className="px-3 pt-3 pb-2">
        <div className="eyebrow px-1 pb-2">{t(locale, "role_active")}</div>
        <div className="inline-flex w-full items-center rounded-md border border-line bg-surface-muted p-0.5">
          {roles.map((r) => {
            const active = role === r.value;
            return (
              <button
                key={r.value}
                type="button"
                onClick={() => onSwitchRole(r.value)}
                aria-pressed={active}
                className={
                  "flex-1 h-8 rounded-[5px] text-[12px] font-semibold cursor-pointer transition-all " +
                  (active
                    ? "bg-ink-900 text-white shadow-xs"
                    : "text-ink-600 hover:text-ink-900 hover:bg-white")
                }
              >
                {locale === "ar" ? t(locale, r.labelKey) : shortRoles[r.value]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-line mt-2" />

      <div className="py-1">
        <MenuItem
          icon={<UserCircle2 className="h-4 w-4" />}
          onClick={() => onGoto("/administration")}
          label={t(locale, "profile")}
        />
        <MenuItem
          icon={<Bell className="h-4 w-4" />}
          onClick={() => onGoto("/dashboard")}
          label={t(locale, "notifications")}
          trailing={<span className="inline-flex items-center h-5 min-w-5 px-1.5 rounded-full bg-danger text-white text-[10px] font-semibold tabular">3</span>}
        />
      </div>

      {perms.canSeeAdministration && (
        <>
          <div className="h-px bg-line" />
          <div className="py-1">
            <MenuItem
              icon={<Settings className="h-4 w-4" />}
              onClick={() => onGoto("/administration")}
              label={t(locale, "settings")}
            />
          </div>
        </>
      )}

      <div className="h-px bg-line" />
      <div className="py-1">
        <MenuItem
          icon={<LogOut className="h-4 w-4" />}
          onClick={() => onGoto("/dashboard")}
          label={t(locale, "logout")}
          destructive
        />
      </div>
    </div>
  );
}

function MenuItem({
  icon, label, onClick, destructive, trailing,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  destructive?: boolean;
  trailing?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={
        "w-full flex items-center gap-2.5 px-4 py-2 text-[13px] cursor-pointer transition-colors " +
        (destructive
          ? "text-danger hover:bg-danger-soft"
          : "text-ink-800 hover:bg-ink-100")
      }
    >
      <span className={"shrink-0 " + (destructive ? "text-danger" : "text-ink-500")}>{icon}</span>
      <span className="flex-1 min-w-0 truncate text-start">{label}</span>
      {trailing && <span className="shrink-0">{trailing}</span>}
    </button>
  );
}

function shortName(name: string): string {
  const parts = name.replace(/^Dr\.\s*/, "").trim().split(/\s+/);
  if (parts.length < 2) return name;
  return `Dr. ${parts[parts.length - 1]}`;
}
