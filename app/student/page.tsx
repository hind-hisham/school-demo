"use client";

import Link from "next/link";
import { Award, CalendarCheck, ClipboardList, TrendingUp, Video } from "lucide-react";
import { Badge, Card, PageHeader, Progress, StatCard, gradeLabelTone, statusTone } from "@/components/ui";
import { demo, exams, gradeLabel, gradesFor, periods, sessions, timetableFor } from "@/lib/data";

export default function StudentHome() {
  const s = demo.student;
  const grades = gradesFor(s.id);
  const avg = Math.round(grades.reduce((a, b) => a + b.total, 0) / grades.length);
  const best = [...grades].sort((a, b) => b.total - a.total)[0];
  const today = timetableFor(s.className).map((row, p) => ({ p, cell: row[3] })); // الأربعاء
  const mySessions = sessions.filter((x) => x.className === s.className && x.status !== "منتهية");
  const myExams = exams.filter((e) => e.className === s.className);

  return (
    <>
      <PageHeader title={`أهلًا ${s.first} 👋`} subtitle={`${s.className} — قسم ${s.section}`} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="معدلي" value={`${avg}%`} icon={TrendingUp} tone="green" hint={gradeLabel(avg)} />
        <StatCard label="حضوري" value={`${s.attendance}%`} icon={CalendarCheck} tone="blue" />
        <StatCard label="أفضل مادة" value={best.subject} icon={Award} tone="amber" hint={`${best.total} درجة`} />
        <StatCard label="اختبارات قادمة" value={myExams.length} icon={ClipboardList} tone="violet" />
      </div>

      {avg >= 90 && (
        <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-l from-amber-100 to-amber-50 p-4">
          <Award className="text-amber-500" size={28} />
          <div><p className="font-extrabold text-amber-800">أنت من الطلاب المتميزين! 🌟</p><p className="text-sm text-amber-700">معدلك يضعك ضمن لوحة التميز في موقع المدرسة.</p></div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="حصص اليوم (الأربعاء)" className="lg:col-span-2" action={<Link href="/student/schedule" className="text-xs font-semibold text-brand">الجدول كامل</Link>}>
          <ul className="divide-y divide-slate-100">
            {today.map(({ p, cell }) => (
              <li key={p} className="flex items-center gap-4 py-2.5">
                <span className="w-28 shrink-0 text-xs text-slate-500">{periods[p].time}</span>
                <span className="flex-1 font-bold">{cell!.title}</span>
                <span className="text-xs text-slate-500">{cell!.sub}</span>
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-6">
          <Card title="الحصص الأونلاين">
            <ul className="space-y-3">
              {mySessions.slice(0, 3).map((x) => (
                <li key={x.id} className="flex items-center gap-3"><div className="grid h-9 w-9 place-items-center rounded-xl bg-brand/10 text-brand"><Video size={16} /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{x.title}</p><p className="text-xs text-slate-500">{x.time}</p></div><Badge tone={statusTone(x.status)}>{x.status}</Badge></li>
              ))}
            </ul>
          </Card>
          <Card title="تقدّمي في المواد">
            <ul className="space-y-3">
              {grades.slice(0, 4).map((g) => (
                <li key={g.subject}><div className="mb-1 flex justify-between text-xs"><span className="font-semibold">{g.subject}</span><span>{g.total}</span></div><Progress value={g.total} tone={gradeLabelTone(g.total)} /></li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}
