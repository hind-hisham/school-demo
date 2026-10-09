"use client";

import { useMemo, useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronLeft, ChevronRight, Inbox, Search, X } from "lucide-react";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export const inputCls =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20";

// ---------- ألوان الحالات ----------
const tones = {
  brand: "bg-brand/10 text-brand",
  green: "bg-emerald-50 text-emerald-700",
  red: "bg-rose-50 text-rose-700",
  amber: "bg-amber-50 text-amber-700",
  blue: "bg-sky-50 text-sky-700",
  violet: "bg-violet-50 text-violet-700",
  gray: "bg-slate-100 text-slate-600",
};
export type Tone = keyof typeof tones;

export function statusTone(s: string): Tone {
  if (["نشط", "مدفوعة", "حاضر", "مباشرة الآن", "مفعّل"].includes(s)) return "green";
  if (["معلقة", "قادمة", "قيد التفعيل", "متأخر", "إجازة", "بعذر"].includes(s)) return "amber";
  if (["متأخرة", "غائب", "معطّل"].includes(s)) return "red";
  return "gray";
}

export function gradeLabelTone(n: number): Tone {
  return n >= 90 ? "green" : n >= 80 ? "blue" : n >= 60 ? "amber" : "red";
}

export function Badge({ tone = "gray", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={cx("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-semibold", tones[tone], className)}>{children}</span>;
}

// ---------- الأزرار ----------
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  icon?: LucideIcon;
};
export function Button({ variant = "primary", size = "md", icon: Icon, className, children, ...rest }: BtnProps) {
  const v = {
    primary: "bg-brand text-white hover:bg-brand-dark shadow-sm",
    secondary: "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50",
    ghost: "text-slate-600 hover:bg-slate-100",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  }[variant];
  const s = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  return (
    <button
      {...rest}
      className={cx("inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-50", v, s, className)}
    >
      {Icon && <Icon size={size === "sm" ? 14 : 16} />}
      {children}
    </button>
  );
}

// ---------- بطاقات ----------
export function Card({ title, action, children, className, padded = true }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string; padded?: boolean }) {
  return (
    <section className={cx("rounded-2xl border border-slate-100 bg-white shadow-card", className)}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <h3 className="text-base font-bold text-slate-800">{title}</h3>
          {action}
        </header>
      )}
      <div className={padded ? "p-5" : ""}>{children}</div>
    </section>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({ label, value, icon: Icon, hint, tone = "brand" }: { label: string; value: ReactNode; icon: LucideIcon; hint?: string; tone?: Tone }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <div className={cx("grid h-12 w-12 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-extrabold text-slate-900">{value}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </div>
  );
}

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  const initials = name.replace(/^أ\.\s*/, "").split(" ").slice(0, 2).map((w) => w[0]).join("");
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-brand/10 font-bold text-brand" style={{ width: size, height: size, fontSize: size * 0.38 }}>
      {initials}
    </span>
  );
}

export function Progress({ value, tone = "brand" }: { value: number; tone?: Tone }) {
  const bar = { brand: "bg-brand", green: "bg-emerald-500", red: "bg-rose-500", amber: "bg-amber-500", blue: "bg-sky-500", violet: "bg-violet-500", gray: "bg-slate-400" }[tone];
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
      <div className={cx("h-full rounded-full transition-all", bar)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

export function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-slate-700">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-slate-400">{hint}</span>}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx("relative h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-brand" : "bg-slate-300")}
    >
      <span className={cx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "start-[22px]" : "start-0.5")} />
    </button>
  );
}

export function EmptyState({ text = "لا توجد بيانات لعرضها" }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-12 text-slate-400">
      <Inbox size={32} />
      <p className="text-sm">{text}</p>
    </div>
  );
}

export function Tabs({ tabs, value, onChange }: { tabs: { key: string; label: string }[]; value: string; onChange: (k: string) => void }) {
  return (
    <div className="mb-5 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cx("whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition", value === t.key ? "bg-white text-brand shadow-sm" : "text-slate-500 hover:text-slate-800")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div className="no-print fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4" onClick={onClose}>
      <div className={cx("max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl", wide ? "max-w-3xl" : "max-w-lg")} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100" aria-label="إغلاق">
            <X size={20} />
          </button>
        </div>
        <div className="p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- جدول بيانات مع بحث وترقيم ----------
export type Column<T> = { key: string; header: string; render?: (row: T) => ReactNode; className?: string };

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  searchKeys = [],
  pageSize = 8,
  toolbar,
  placeholder = "ابحث هنا...",
}: {
  columns: Column<T>[];
  rows: T[];
  searchKeys?: string[];
  pageSize?: number;
  toolbar?: ReactNode;
  placeholder?: string;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const term = q.trim();
    if (!term) return rows;
    return rows.filter((row) => searchKeys.some((k) => String(row[k] ?? "").includes(term)));
  }, [q, rows, searchKeys]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);

  return (
    <div>
      {(searchKeys.length > 0 || toolbar) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          {searchKeys.length > 0 && (
            <div className="relative min-w-[200px] flex-1">
              <Search size={16} className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder={placeholder} className={cx(inputCls, "ps-9")} />
            </div>
          )}
          {toolbar}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-xs text-slate-500">
              {columns.map((c) => (
                <th key={c.key} className={cx("px-4 py-3 text-start font-semibold", c.className)}>{c.header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slice.map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/60">
                {columns.map((c) => (
                  <td key={c.key} className={cx("px-4 py-3", c.className)}>{c.render ? c.render(row) : String(row[c.key] ?? "")}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {slice.length === 0 && <EmptyState text="لا توجد نتائج مطابقة" />}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
        <span>
          {filtered.length === 0 ? 0 : safePage * pageSize + 1}–{Math.min((safePage + 1) * pageSize, filtered.length)} من {filtered.length}
        </span>
        <div className="flex items-center gap-1">
          <button disabled={safePage === 0} onClick={() => setPage(safePage - 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-30" aria-label="السابق">
            <ChevronRight size={16} />
          </button>
          <span className="px-2">{safePage + 1} / {pages}</span>
          <button disabled={safePage >= pages - 1} onClick={() => setPage(safePage + 1)} className="rounded-lg p-1.5 hover:bg-slate-100 disabled:opacity-30" aria-label="التالي">
            <ChevronLeft size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
