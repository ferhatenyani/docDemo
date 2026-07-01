"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  LayoutDashboard, Users, CalendarClock, Stethoscope, PillBottle,
  FlaskConical, FileBadge, ReceiptText, Wallet, PackageOpen,
  HeartPulse, Calculator, Settings, X, Activity,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { ALLOWED_NAV_KEYS } from "@/lib/permissions";

interface NavGroup {
  label: string;
  items: readonly { href: string; key: string; icon: any }[];
}

const NAV: readonly NavGroup[] = [
  {
    label: "Général",
    items: [
      { href: "/dashboard", key: "nav_dashboard", icon: LayoutDashboard },
      { href: "/patients", key: "nav_patients", icon: Users },
      { href: "/rendez-vous", key: "nav_rdv", icon: CalendarClock },
    ],
  },
  {
    label: "Cliniques",
    items: [
      { href: "/consultations", key: "nav_consultations", icon: Stethoscope },
      { href: "/ordonnances", key: "nav_ordonnances", icon: PillBottle },
      { href: "/examens", key: "nav_examens", icon: FlaskConical },
      { href: "/certificats", key: "nav_certificats", icon: FileBadge },
      { href: "/chroniques", key: "nav_chroniques", icon: HeartPulse },
    ],
  },
  {
    label: "Gestion",
    items: [
      { href: "/facturation", key: "nav_facturation", icon: ReceiptText },
      { href: "/caisse", key: "nav_caisse", icon: Wallet },
      { href: "/stock", key: "nav_stock", icon: PackageOpen },
      { href: "/comptabilite", key: "nav_comptabilite", icon: Calculator },
      { href: "/administration", key: "nav_administration", icon: Settings },
    ],
  },
] as const;

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const locale = useApp((s) => s.locale);
  const role = useApp((s) => s.role);
  const allowed = ALLOWED_NAV_KEYS[role];

  return (
    <nav className="flex-1 min-h-0 overflow-auto px-3 pb-3">
      {NAV.map((group) => {
        const items = group.items.filter((it) => allowed.has(it.key));
        if (items.length === 0) return null;
        return (
          <div key={group.label} className="pt-4 first:pt-2">
            <div className="eyebrow px-2 pb-1.5">{group.label}</div>
            <div className="space-y-0.5">
              {items.map(({ href, key, icon: Icon }) => {
                const active = pathname === href || pathname?.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onNavigate}
                    className={clsx(
                      "group flex items-center gap-2.5 px-2 py-1.5 rounded-md text-[13px] font-medium transition-colors duration-150",
                      active
                        ? "bg-ink-900 text-white"
                        : "text-ink-600 hover:bg-ink-100 hover:text-ink-900",
                    )}
                  >
                    <Icon className={clsx("h-4 w-4 shrink-0", active ? "text-white" : "text-ink-400 group-hover:text-ink-700")} />
                    <span className="truncate">{t(locale, key)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const locale = useApp((s) => s.locale);
  const clinique = useApp((s) => s.clinique);

  return (
    <div className="flex flex-col h-full bg-white border-e border-line">
      <div className="px-4 pt-5 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-md bg-ink-900 grid place-items-center text-white">
            <Activity className="h-4 w-4" strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <div className="text-[14px] font-semibold text-ink-900 truncate tracking-crisp">{t(locale, "app_name")}</div>
            <div className="text-2xs text-ink-500 truncate">{clinique.raison_sociale}</div>
          </div>
        </div>
      </div>
      <div className="mx-3 divider" />
      <NavList />
      <div className="px-4 py-3 border-t border-line">
        <div className="text-2xs text-ink-400 flex items-center justify-between">
          <span>v1.0</span>
          <span>{clinique.wilaya}</span>
        </div>
      </div>
    </div>
  );
}

export function MobileNavDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const locale = useApp((s) => s.locale);
  const clinique = useApp((s) => s.clinique);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] lg:hidden">
      <div
        className="absolute inset-0 bg-ink-900/40 backdrop-blur-[2px] animate-fadeIn"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 start-0 w-[272px] max-w-[85vw] bg-white shadow-overlay flex flex-col animate-slideUp">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-md bg-ink-900 grid place-items-center text-white">
              <Activity className="h-4 w-4" strokeWidth={2.4} />
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-semibold text-ink-900 truncate">{t(locale, "app_name")}</div>
              <div className="text-2xs text-ink-500 truncate">{clinique.raison_sociale}</div>
            </div>
          </div>
          <button
            aria-label="Fermer le menu"
            onClick={onClose}
            className="h-9 w-9 rounded-md grid place-items-center text-ink-500 hover:bg-ink-100 cursor-pointer transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mx-3 divider" />
        <NavList onNavigate={onClose} />
      </div>
    </div>
  );
}
