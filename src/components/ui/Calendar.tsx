"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  value?: string;
  onChange: (d: string) => void;
  className?: string;
  minDate?: string;
  markers?: Record<string, number>;
  locale?: "fr" | "ar";
}

const MONTHS_FR = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","ماي","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
const DAYS_FR = ["Lu","Ma","Me","Je","Ve","Sa","Di"];
const DAYS_AR = ["إث","ثل","أر","خم","جم","سب","أح"];

function iso(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function Calendar({ value, onChange, className, minDate, markers, locale = "fr" }: Props) {
  const initial = value ? new Date(value + "T00:00:00") : new Date();
  const [cursor, setCursor] = useState<{ y: number; m: number }>({
    y: initial.getFullYear(),
    m: initial.getMonth(),
  });

  const today = iso(new Date());
  const MONTHS = locale === "ar" ? MONTHS_AR : MONTHS_FR;
  const DAYS = locale === "ar" ? DAYS_AR : DAYS_FR;

  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const startWeekday = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const arr: (string | null)[] = [];
    for (let i = 0; i < startWeekday; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      arr.push(iso(new Date(cursor.y, cursor.m, d)));
    }
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [cursor]);

  function shift(delta: number) {
    let m = cursor.m + delta;
    let y = cursor.y;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCursor({ y, m });
  }

  return (
    <div className={clsx("rounded-md bg-white border border-line p-3 select-none w-[280px]", className)}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[13px] font-semibold text-ink-900 tracking-crisp">
          {MONTHS[cursor.m]} {cursor.y}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={() => shift(-1)}
            className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer text-ink-600"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => shift(1)}
            className="h-7 w-7 grid place-items-center rounded-md hover:bg-ink-100 cursor-pointer text-ink-600"
            aria-label="Mois suivant"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-[10px] font-medium text-ink-400 mb-1">
        {DAYS.map((d) => (<div key={d} className="py-1">{d}</div>))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((c, i) => {
          if (!c) return <div key={i} className="h-8" />;
          const isToday = c === today;
          const isSelected = c === value;
          const disabled = minDate ? c < minDate : false;
          const count = markers?.[c];
          return (
            <button
              type="button"
              key={c}
              disabled={disabled}
              onClick={() => onChange(c)}
              className={clsx(
                "relative h-8 rounded-md text-[12px] transition-all cursor-pointer tabular",
                "flex items-center justify-center",
                isSelected
                  ? "bg-ink-900 text-white font-semibold"
                  : isToday
                    ? "bg-brand-50 text-brand-700 font-semibold"
                    : "text-ink-800 hover:bg-ink-100",
                disabled && "opacity-30 pointer-events-none",
              )}
            >
              {Number(c.split("-")[2])}
              {count ? (
                <span
                  className={clsx(
                    "absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full",
                    isSelected ? "bg-white" : "bg-brand-500",
                  )}
                />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}
