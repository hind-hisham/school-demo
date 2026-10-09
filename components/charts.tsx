"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "./ThemeProvider";

export const chartColors = ["#0f766e", "#f59e0b", "#6366f1", "#e11d48", "#0ea5e9", "#84cc16"];

const tooltipStyle = {
  contentStyle: { direction: "rtl" as const, fontFamily: "inherit", borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 12 },
};
const axisTick = { fontSize: 12, fill: "#64748b" };

type Series = { key: string; name: string; color?: string };

export function TrendChart({ data, xKey, series, height = 260, unit = "" }: { data: any[]; xKey: string; series: Series[]; height?: number; unit?: string }) {
  const { brand } = useTheme();
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={xKey} tick={axisTick} reversed tickLine={false} axisLine={false} />
          <YAxis tick={axisTick} orientation="right" tickLine={false} axisLine={false} unit={unit} width={44} />
          <Tooltip {...tooltipStyle} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color ?? (i === 0 ? brand : chartColors[i % chartColors.length])} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BarsChart({ data, xKey, series, height = 260, unit = "", domain }: { data: any[]; xKey: string; series: Series[]; height?: number; unit?: string; domain?: [number, number] }) {
  const { brand } = useTheme();
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey={xKey} tick={axisTick} reversed tickLine={false} axisLine={false} interval={0} />
          <YAxis tick={axisTick} orientation="right" tickLine={false} axisLine={false} unit={unit} width={48} domain={domain} />
          <Tooltip {...tooltipStyle} cursor={{ fill: "rgba(148,163,184,.12)" }} />
          {series.length > 1 && <Legend wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color ?? (i === 0 ? brand : chartColors[i % chartColors.length])} radius={[6, 6, 0, 0]} maxBarSize={36} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DonutChart({ data, height = 240 }: { data: { name: string; value: number }[]; height?: number }) {
  const { brand } = useTheme();
  const colors = [brand, ...chartColors.slice(1)];
  return (
    <div style={{ height }} className="w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="58%" outerRadius="85%" paddingAngle={3} stroke="none">
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip {...tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
