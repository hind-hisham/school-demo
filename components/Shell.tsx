"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Bell, ChevronDown, Globe, LogOut, Menu, School, X } from "lucide-react";
import { navByRole, roleMeta, roles, type Role } from "@/lib/nav";
import { demo, notices } from "@/lib/data";
import { useTheme } from "./ThemeProvider";
import { Avatar, cx } from "./ui";

const userOf: Record<Role, { name: string; title: string }> = {
  admin: { name: demo.admin.name, title: demo.admin.title },
  teacher: { name: demo.teacher.name, title: `معلم ${demo.teacher.subject}` },
  parent: { name: `${demo.parent.name}`, title: "ولي أمر" },
  student: { name: demo.student.name, title: demo.student.className },
};

export function Shell({ role, children }: { role: Role; children: ReactNode }) {
  const pathname = usePathname();
  const { schoolName } = useTheme();
  const [open, setOpen] = useState(false);
  const [switcher, setSwitcher] = useState(false);
  const nav = navByRole[role];
  const user = userOf[role];
  const unread = notices.filter((n) => !n.read).length;
  const notifHref = nav.find((n) => n.href.endsWith("notifications"))?.href;

  const isActive = (href: string) => (href === roleMeta[role].base ? pathname === href : pathname.startsWith(href));

  const sidebar = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-5">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white">
          <School size={22} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-extrabold text-slate-900">{schoolName}</p>
          <p className="text-xs text-slate-500">بوابة {roleMeta[role].label}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cx(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
                active ? "bg-brand text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <Link href="/login" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100">
          <LogOut size={18} />
          تسجيل الخروج
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* شريط النسخة التجريبية */}
      <div className="no-print bg-slate-900 px-4 py-2 text-center text-xs text-slate-200">
        أنت تتصفح <b className="text-amber-300">نسخة تجريبية</b> ببيانات وهمية — التعديلات لا تُحفظ.{" "}
        <Link href="/contact" className="font-bold text-white underline underline-offset-2">
          تواصل معنا للحصول على النظام
        </Link>
      </div>

      {/* القائمة الجانبية (سطح المكتب) */}
      <aside className="no-print fixed bottom-0 start-0 top-[34px] z-30 hidden w-64 border-e border-slate-100 lg:block">{sidebar}</aside>

      {/* القائمة الجانبية (جوال) */}
      {open && <div className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden" onClick={() => setOpen(false)} />}
      <div
        className={cx(
          "no-print fixed bottom-0 end-0 top-0 z-50 w-72 transition-transform lg:hidden",
          open ? "translate-x-0 " : "translate-x-[-100%]"
        )}
      >
        <button onClick={() => setOpen(false)} className="absolute start-3 top-4 z-10 rounded-lg p-1 text-slate-400" aria-label="إغلاق">
          <X size={20} />
        </button>
        {sidebar}
      </div>

      <div className="lg:ms-64">
        <header className="no-print sticky top-0 z-20 flex items-center gap-3 border-b border-slate-100 bg-white/80 px-4 py-3 backdrop-blur lg:px-8">
          <button onClick={() => setOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="القائمة">
            <Menu size={22} />
          </button>

          {/* مبدّل البوابات */}
          <div className="relative">
            <button
              onClick={() => setSwitcher(!switcher)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              تبديل البوابة: <span className="text-brand">{roleMeta[role].label}</span>
              <ChevronDown size={16} />
            </button>
            {switcher && (
              <div className="absolute start-0 top-full z-30 mt-2 w-64 rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
                {roles.map((r) => (
                  <Link
                    key={r}
                    href={roleMeta[r].base}
                    onClick={() => setSwitcher(false)}
                    className={cx("block rounded-lg px-3 py-2 text-sm hover:bg-slate-50", r === role && "bg-brand/10")}
                  >
                    <p className="font-bold text-slate-800">{roleMeta[r].label}</p>
                    <p className="text-xs text-slate-500">{roleMeta[r].desc}</p>
                  </Link>
                ))}
                <Link href="/" onClick={() => setSwitcher(false)} className="mt-1 flex items-center gap-2 rounded-lg border-t border-slate-100 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                  <Globe size={16} /> الموقع التعريفي للمدرسة
                </Link>
              </div>
            )}
          </div>

          <div className="ms-auto flex items-center gap-3">
            {notifHref && (
              <Link href={notifHref} className="relative rounded-xl p-2 text-slate-600 hover:bg-slate-100" aria-label="الإشعارات">
                <Bell size={20} />
                {unread > 0 && <span className="absolute end-1 top-1 grid h-4 w-4 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">{unread}</span>}
              </Link>
            )}
            <div className="flex items-center gap-2">
              <Avatar name={user.name} />
              <div className="hidden text-start sm:block">
                <p className="text-sm font-bold leading-tight text-slate-800">{user.name}</p>
                <p className="text-xs text-slate-500">{user.title}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-7xl p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
