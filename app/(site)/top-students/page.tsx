"use client";

import { Award, Trophy } from "lucide-react";
import { Avatar, Badge } from "@/components/ui";
import { topStudents } from "@/lib/data";

export default function TopStudents() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="mb-10 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600"><Trophy size={28} /></div>
        <h1 className="text-4xl font-extrabold">لوحة الطلاب المتميزين</h1>
        <p className="mt-2 text-slate-500">نكرّم طلابنا المتفوقين رقميًا ونفخر بإنجازاتهم</p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topStudents.map((s, i) => (
          <div key={s.name} className="relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 text-center shadow-card">
            {i < 3 && <div className="absolute start-0 top-0 h-1.5 w-full bg-gradient-to-l from-amber-300 to-amber-500" />}
            <div className="mx-auto mb-4 w-fit"><Avatar name={s.name} size={88} /></div>
            <h2 className="text-lg font-extrabold">{s.name}</h2>
            <p className="text-sm text-slate-500">{s.cls}</p>
            <div className="my-3 flex justify-center gap-2"><Badge tone="green">المعدل {s.avg}%</Badge><Badge tone="amber"><Award size={12} /> المركز {i + 1}</Badge></div>
            <p className="text-sm leading-7 text-slate-600">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
