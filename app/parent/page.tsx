"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarCheck, GraduationCap, Receipt, ClipboardList } from "lucide-react";
import { Badge, Card, PageHeader, Progress, StatCard, gradeLabelTone } from "@/components/ui";
import { ChildPicker } from "@/components/views";
import { demo, exams, gradeLabel, gradesFor, invoicesOfParent, money, notices, studentById } from "@/lib/data";

export default function ParentHome() {
  const kids = demo.parent.children.map((id) => studentById(id)!);
  const [kidId, setKidId] = useState(kids[0].id);
  const kid = kids.find((k) => k.id === kidId)!;
  const grades = gradesFor(kid.id);
  const avg = Math.round(grades.reduce((a, b) => a + b.total, 0) / grades.length);
  const due = invoicesOfParent(demo.parent.id).filter((i) => i.studentId === kid.id && i.status !== "مدفوعة").reduce((a, b) => a + b.amount, 0);
  const nextExam = exams.find((e) => e.className === kid.className);

  return (
    <>
      <PageHeader title={`مرحبًا ${demo.parent.name}`} subtitle="تابع أداء أبنائك وسدّد الرسوم من مكان واحد" />
      <ChildPicker kids={kids.map((k) => ({ id: k.id, name: k.name, className: `${k.className} (${k.section})` }))} value={kidId} onChange={setKidId} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="المعدل العام" value={`${avg}%`} icon={GraduationCap} tone="green" hint={gradeLabel(avg)} />
        <StatCard label="نسبة الحضور" value={`${kid.attendance}%`} icon={CalendarCheck} tone="blue" />
        <StatCard label="مستحق السداد" value={due ? money(due) : "لا يوجد"} icon={Receipt} tone={due ? "red" : "green"} />
        <StatCard label="الاختبار القادم" value={nextExam ? nextExam.subject : "—"} icon={ClipboardList} tone="amber" hint={nextExam ? `${nextExam.day} ${nextExam.date}` : ""} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="آخر الدرجات" className="lg:col-span-2" action={<Link href="/parent/results" className="text-xs font-semibold text-brand">التفاصيل</Link>}>
          <ul className="space-y-4">
            {grades.slice(0, 5).map((g) => (
              <li key={g.subject}>
                <div className="mb-1 flex items-center justify-between text-sm"><span className="font-semibold">{g.subject}</span><Badge tone={gradeLabelTone(g.total)}>{g.total} — {gradeLabel(g.total)}</Badge></div>
                <Progress value={g.total} tone={gradeLabelTone(g.total)} />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="آخر الإشعارات" action={<Link href="/parent/notifications" className="text-xs font-semibold text-brand">الكل</Link>}>
          <ul className="space-y-3">
            {notices.slice(0, 4).map((n) => (
              <li key={n.id} className="text-sm"><p className="font-bold">{n.title}</p><p className="text-xs text-slate-500">{n.time}</p></li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
