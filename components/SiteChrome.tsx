"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogIn, Mail, MapPin, Menu, Phone, School, X } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cx } from "./ui";
import { school } from "@/lib/data";

const links = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن المدرسة" },
  { href: "/top-students", label: "الطلاب المتميزون" },
  { href: "/summer-courses", label: "الكورسات الصيفية" },
  { href: "/contact", label: "تواصل معنا" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { schoolName } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[100] border-b border-slate-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-white"><School size={22} /></div>
          <div className="leading-tight"><p className="font-extrabold text-slate-900">{schoolName}</p><p className="text-xs text-slate-500">{school.tagline}</p></div>
        </Link>
        <nav className="ms-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={cx("rounded-lg px-3 py-2 text-sm font-semibold transition", pathname === l.href ? "bg-brand/10 text-brand" : "text-slate-600 hover:bg-slate-100")}>{l.label}</Link>
          ))}
        </nav>
        <Link href="/login" className="ms-auto hidden items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-dark lg:flex"><LogIn size={16} /> دخول النظام</Link>
        <button onClick={() => setOpen(!open)} className="ms-auto rounded-lg p-2 text-slate-600 lg:hidden" aria-label="القائمة">{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <div className="border-t border-slate-100 bg-white px-4 py-3 lg:hidden">
          {links.map((l) => (<Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">{l.label}</Link>))}
          <Link href="/login" onClick={() => setOpen(false)} className="mt-2 block rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-bold text-white">دخول النظام</Link>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { schoolName } = useTheme();
  return (
    <footer className="mt-20 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 lg:px-8">
        <div>
          <p className="mb-2 text-lg font-extrabold text-white">{schoolName}</p>
          <p className="text-sm leading-7 text-slate-400">{school.tagline}. نوفّر بيئة تعليمية متكاملة تجمع بين التميز الأكاديمي والقيم والتقنية الحديثة.</p>
        </div>
        <div>
          <p className="mb-3 font-bold text-white">روابط سريعة</p>
          <ul className="space-y-2 text-sm">{links.map((l) => <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>)}</ul>
        </div>
        <div>
          <p className="mb-3 font-bold text-white">تواصل معنا</p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2"><Phone size={16} /> {school.phone}</li>
            <li className="flex items-center gap-2"><Mail size={16} /> {school.email}</li>
            <li className="flex items-center gap-2"><MapPin size={16} /> {school.address}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">نسخة تجريبية لنظام إدارة المدرسة الذكي — جميع البيانات المعروضة وهمية.</div>
    </footer>
  );
}
