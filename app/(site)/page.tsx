"use client";

import Link from "next/link";
import { ArrowLeft, Award, BookOpen, CalendarDays, CreditCard, GraduationCap, Library, MessageCircle, ShieldCheck, Sparkles, Users, Video } from "lucide-react";
import { Avatar, Badge } from "@/components/ui";
import { useTheme } from "@/components/ThemeProvider";
import { news, school, summerCourses, topStudents, money } from "@/lib/data";
import { roleMeta, roles } from "@/lib/nav";

const features = [
  { icon: Users, t: "إدارة مركزية", d: "طلاب ومعلمون وأولياء أمور وفصول في لوحة تحكم واحدة بصلاحيات دقيقة." },
  { icon: GraduationCap, t: "الدرجات والنتائج", d: "رصد الدرجات وتحليلها وعرضها لأولياء الأمور فور اعتمادها." },
  { icon: CalendarDays, t: "الحضور والجداول", d: "تحضير رقمي سريع، وجداول أسبوعية تُحدَّث تلقائيًا للجميع." },
  { icon: Video, t: "حصص أونلاين", d: "تكامل مع Zoom وGoogle Meet وروابط مباشرة وتنبيهات قبل البدء." },
  { icon: CreditCard, t: "رسوم ومدفوعات", d: "فواتير إلكترونية وبوابات دفع وسجل مدفوعات لكل طالب." },
  { icon: MessageCircle, t: "إشعارات واتساب", d: "تنبيهات فورية بالغياب والنتائج والفواتير وموعد الاختبارات." },
  { icon: Library, t: "مكتبة رقمية", d: "كتب وفيديوهات وروابط مصنّفة حسب المرحلة والمادة." },
  { icon: ShieldCheck, t: "أمان وخصوصية", d: "تشفير للبيانات وسجل تدقيق ونسخ احتياطي دوري." },
];

export default function Home() {
  const { schoolName } = useTheme();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-bl from-brand to-brand-dark text-white">
        <div className="pointer-events-none absolute -start-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <span className="mb-5 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white"><Sparkles size={14} /> العام الدراسي {school.year}</span>
            <h1 className="text-4xl font-extrabold leading-tight lg:text-5xl">{schoolName}</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/85">{school.tagline}. بيئة تعليمية متكاملة تجمع بين التميز الأكاديمي والتقنية الحديثة، مع بوابة إلكترونية تربط المدرسة بأولياء الأمور لحظة بلحظة.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="rounded-xl bg-white px-6 py-3 font-bold text-brand shadow-lg hover:bg-slate-50">دخول البوابة الإلكترونية</Link>
              <Link href="/summer-courses" className="rounded-xl border border-white/40 px-6 py-3 font-bold text-white hover:bg-white/10">الكورسات الصيفية</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[["+1,200", "طالب وطالبة"], ["+80", "معلم ومعلمة"], ["13", "مرحلة وصف"], ["98%", "رضا أولياء الأمور"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl bg-white/10 p-6 backdrop-blur"><p className="text-3xl font-extrabold">{n}</p><p className="mt-1 text-sm text-white/80">{l}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* جرّب النظام */}
      <section className="mx-auto -mt-10 max-w-7xl px-4 lg:px-8 z-50 relative">
        <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-card lg:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-xl font-extrabold">جرّب النظام بنفسك</h2><p className="text-sm text-slate-500">اختر بوابة لتتصفح النظام ببيانات تجريبية — بدون تسجيل.</p></div>
            <Badge tone="amber">نسخة تجريبية</Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {roles.map((r) => (
              <Link key={r} href={roleMeta[r].base} className="group flex items-center justify-between rounded-2xl border border-slate-200 p-4 transition hover:border-brand hover:bg-brand/5">
                <div><p className="font-bold text-slate-800">{roleMeta[r].label}</p><p className="text-xs text-slate-500">{roleMeta[r].desc}</p></div>
                <ArrowLeft className="text-slate-300 transition group-hover:-translate-x-1 group-hover:text-brand" size={18} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* المميزات */}
      <section className="mx-auto max-w-7xl px-4 pt-20 lg:px-8">
        <div className="mb-10 text-center"><h2 className="text-3xl font-extrabold">منصة واحدة لكل ما تحتاجه المدرسة</h2><p className="mt-2 text-slate-500">من التسجيل وحتى النتائج والرسوم، كل شيء رقمي ومترابط.</p></div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.t} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand"><f.icon size={22} /></div>
              <h3 className="mb-1.5 font-bold">{f.t}</h3>
              <p className="text-sm leading-7 text-slate-500">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* الأخبار */}
      <section className="mx-auto max-w-7xl px-4 pt-20 lg:px-8">
        <h2 className="mb-6 text-2xl font-extrabold">آخر الأخبار</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {news.map((n) => (
            <article key={n.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <p className="mb-2 text-xs font-semibold text-brand">{n.date} هـ</p>
              <h3 className="mb-2 font-bold leading-snug">{n.title}</h3>
              <p className="text-sm leading-7 text-slate-500">{n.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      {/* المتميزون */}
      <section className="mx-auto max-w-7xl px-4 pt-20 lg:px-8">
        <div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-extrabold">نفخر بطلابنا المتميزين</h2><Link href="/top-students" className="text-sm font-bold text-brand">عرض الكل</Link></div>
        <div className="grid gap-5 md:grid-cols-3">
          {topStudents.slice(0, 3).map((s, i) => (
            <div key={s.name} className="relative rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-card">
              <span className="absolute end-4 top-4 text-amber-400"><Award size={22} /></span>
              <div className="mx-auto mb-3 w-fit"><Avatar name={s.name} size={72} /></div>
              <h3 className="font-bold">{s.name}</h3>
              <p className="text-sm text-slate-500">{s.cls}</p>
              <Badge tone="green" className="mt-3">المعدل {s.avg}%</Badge>
              <p className="mt-3 text-xs leading-6 text-slate-500">المركز {i + 1} — {s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* الكورسات */}
      <section className="mx-auto max-w-7xl px-4 pt-20 lg:px-8">
        <div className="mb-6 flex items-end justify-between"><h2 className="text-2xl font-extrabold">الكورسات الصيفية</h2><Link href="/summer-courses" className="text-sm font-bold text-brand">كل الكورسات</Link></div>
        <div className="grid gap-5 md:grid-cols-3">
          {summerCourses.slice(0, 3).map((c) => (
            <div key={c.id} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
              <div className="mb-3 flex items-center gap-2"><BookOpen size={18} className="text-brand" /><Badge tone="brand">{c.level}</Badge></div>
              <h3 className="font-bold">{c.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-500">{c.desc}</p>
              <p className="mt-4 text-sm font-bold text-brand">{money(c.price)} • {c.duration}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
