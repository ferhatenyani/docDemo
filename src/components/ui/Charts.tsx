"use client";

import type { ReactNode } from "react";
import clsx from "clsx";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

// ---------- ChartCard shell ----------------------------------

interface ChartCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  height?: number;
}

export function ChartCard({ title, subtitle, actions, children, className, height = 240 }: ChartCardProps) {
  return (
    <div className={clsx("bg-white rounded-lg border border-line shadow-xs", className)}>
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-line">
        <div className="min-w-0">
          <div className="text-[14px] font-semibold text-ink-900 tracking-crisp truncate">{title}</div>
          {subtitle && <div className="text-[11px] text-ink-500 mt-0.5">{subtitle}</div>}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="p-3" style={{ height }}>{children}</div>
    </div>
  );
}

// ---------- Recharts tooltip skin ---------------------------

export const chartTooltipStyle = {
  borderRadius: 6,
  border: "1px solid #e4e7ec",
  boxShadow: "0 10px 25px -12px rgba(15,23,42,0.18), 0 4px 8px -4px rgba(15,23,42,0.06)",
  padding: "8px 10px",
  fontSize: 12,
  fontFeatureSettings: '"tnum"',
};

export const chartAxisTick = { fontSize: 11, fill: "#7d8797", fontWeight: 500 };
export const chartGridStroke = "#eef1f5";

// ---------- Sparkline ---------------------------------------

interface SparklineProps {
  data: { v: number }[];
  color?: string;
  className?: string;
  fill?: boolean;
}

export function Sparkline({ data, color = "#0071e3", className, fill = true }: SparklineProps) {
  return (
    <div className={clsx("w-full h-full", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
          <defs>
            <linearGradient id={`spark-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            fill={fill ? `url(#spark-${color.replace("#", "")})` : "transparent"}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ---------- Refined bar chart --------------------------------

interface RefinedBarChartProps {
  data: any[];
  bars: { key: string; name: string; color: string }[];
  xKey: string;
  yFormatter?: (v: number) => string;
  tooltipFormatter?: (v: number) => string;
  height?: number;
}

export function RefinedBarChart({ data, bars, xKey, yFormatter, tooltipFormatter, height = 240 }: RefinedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }} barCategoryGap="30%">
        <CartesianGrid stroke={chartGridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={chartAxisTick} tickLine={false} axisLine={false} dy={4} />
        <YAxis
          tick={chartAxisTick}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={yFormatter}
        />
        <Tooltip
          cursor={{ fill: "rgba(15,23,42,0.04)" }}
          formatter={tooltipFormatter ? (v: number) => tooltipFormatter(v) : undefined}
          contentStyle={chartTooltipStyle}
        />
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[3, 3, 0, 0]} maxBarSize={28} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// ---------- Refined area chart -------------------------------

interface RefinedAreaChartProps {
  data: any[];
  areas: { key: string; name: string; color: string }[];
  xKey: string;
  yFormatter?: (v: number) => string;
  tooltipFormatter?: (v: number) => string;
  height?: number;
}

export function RefinedAreaChart({ data, areas, xKey, yFormatter, tooltipFormatter, height = 240 }: RefinedAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
        <defs>
          {areas.map((a) => (
            <linearGradient key={a.key} id={`grad-${a.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={a.color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={a.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke={chartGridStroke} vertical={false} />
        <XAxis dataKey={xKey} tick={chartAxisTick} tickLine={false} axisLine={false} dy={4} />
        <YAxis tick={chartAxisTick} tickLine={false} axisLine={false} width={48} tickFormatter={yFormatter} />
        <Tooltip
          cursor={{ stroke: "#d0d5dd", strokeDasharray: "3 3" }}
          formatter={tooltipFormatter ? (v: number) => tooltipFormatter(v) : undefined}
          contentStyle={chartTooltipStyle}
        />
        {areas.map((a) => (
          <Area
            key={a.key}
            type="monotone"
            dataKey={a.key}
            name={a.name}
            stroke={a.color}
            strokeWidth={2}
            fill={`url(#grad-${a.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

// ---------- ChartLegend --------------------------------------

export function ChartLegend({ items }: { items: { name: string; color: string; value?: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {items.map((it) => (
        <div key={it.name} className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-sm" style={{ background: it.color }} />
          <span className="text-[11px] text-ink-600 font-medium">{it.name}</span>
          {it.value && <span className="text-[11px] text-ink-900 tabular font-semibold">{it.value}</span>}
        </div>
      ))}
    </div>
  );
}
