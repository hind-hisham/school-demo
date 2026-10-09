"use client";

import { useState } from "react";
import { Clock, User, Users } from "lucide-react";
import { Badge, Button, Field, Modal, inputCls } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { money, summerCourses } from "@/lib/data";

export default function SummerCourses() {
  const toast = useToast();
  const [course, setCourse] = useState<(typeof summerCourses)[number] | null>(null);
  const [level, setLevel] = useState("الكل");
  const list = summerCourses.filter((c) => level === "الكل" || c.level === level);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div><h1 className="text-4xl font-extrabold">الكورسات الصيفية</h1><p className="mt-2 text-slate-500">دورات ممتعة ومفيدة لاستثمار إجازة الصيف.</p></div>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className={`${inputCls} w-auto`}><option>الكل</option><option>ابتدائي</option><option>متوسط</option><option>ثانوي</option></select>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((c) => (
          <div key={c.id} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="mb-3 flex items-center justify-between"><Badge tone="brand">{c.level}</Badge><span className="text-lg font-extrabold text-brand">{money(c.price)}</span></div>
            <h2 className="text-lg font-bold">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-7 text-slate-500">{c.desc}</p>
            <ul className="my-4 space-y-1.5 text-xs text-slate-500">
              <li className="flex items-center gap-2"><User size={14} /> {c.instructor}</li>
              <li className="flex items-center gap-2"><Clock size={14} /> {c.duration}</li>
              <li className="flex items-center gap-2"><Users size={14} /> {c.seats} مقعدًا متاحًا</li>
            </ul>
            <Button onClick={() => setCourse(c)}>سجّل الآن</Button>
          </div>
        ))}
      </div>

      <Modal open={!!course} onClose={() => setCourse(null)} title={`التسجيل في: ${course?.title ?? ""}`} footer={<><Button variant="secondary" onClick={() => setCourse(null)}>إلغاء</Button><Button onClick={() => { setCourse(null); toast("تم تسجيل طلبك (محاكاة) — سنتواصل معك للتأكيد"); }}>تأكيد التسجيل</Button></>}>
        <div className="space-y-4">
          <Field label="اسم الطالب"><input className={inputCls} /></Field>
          <Field label="الصف"><input className={inputCls} /></Field>
          <Field label="جوال ولي الأمر"><input dir="ltr" className={inputCls} /></Field>
        </div>
      </Modal>
    </div>
  );
}
