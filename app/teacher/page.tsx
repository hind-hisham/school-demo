"use client";

import Link from "next/link";
import { CheckSquare, ClipboardList, GraduationCap, Video } from "lucide-react";
import { Badge, Card, PageHeader, StatCard, statusTone } from "@/components/ui";
import { demo, exams, periods, sessions, studentsOfClass, teacherScheduleFor } from "@/lib/data";

export default function TeacherDashboard() {
  const t = demo.teacher;
  const totalStudents = t.classes.reduce((a, c) => a + studentsOfClass(c).length, 0);
  const today = teacherScheduleFor(t).map((row, p) => ({ p, cell: row[3] })).filter((x) => x.cell); // الأربعاء
  const mySessions = sessions.filter((s) => t.classes.includes(s.className) && s.status !== "منتهية");
  const myExams = exams.filter((e) => t.classes.includes(e.className));

  return (
    <>
      <PageHeader title={`أهلًا ${t.name}`} subtitle={`معلم ${t.subject} • ${t.classes.join("، ")}`} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="طلابي" value={totalStudents} icon={GraduationCap} />
        <StatCard label="حصص اليوم" value={today.length} icon={CheckSquare} tone="blue" />
        <StatCard label="حصص أونلاين قادمة" value={mySessions.length} icon={Video} tone="violet" />
        <StatCard label="اختبارات قادمة" value={myExams.length} icon={ClipboardList} tone="amber" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="حصص اليوم (الأربعاء)" className="lg:col-span-2">
          {today.length === 0 ? (
            <p className="text-sm text-slate-500">لا توجد حصص اليوم.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {today.map(({ p, cell }) => (
                <li key={p} className="flex items-center gap-4 py-3">
                  <div className="w-24 shrink-0 text-xs text-slate-500"><b className="block text-sm text-slate-800">الحصة {periods[p].n}</b>{periods[p].time}</div>
                  <div className="flex-1"><p className="font-bold">{cell!.title}</p><p className="text-xs text-slate-500">{cell!.sub}</p></div>
                  <Link href="/teacher/attendance" className="rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">تسجيل الحضور</Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
        <Card title="الحصص الأونلاين القادمة">
          <ul className="space-y-3">
            {mySessions.map((s) => (
              <li key={s.id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-center justify-between gap-2"><p className="text-sm font-bold">{s.title}</p><Badge tone={statusTone(s.status)}>{s.status}</Badge></div>
                <p className="mt-1 text-xs text-slate-500">{s.className} • {s.platform} • {s.date} {s.time}</p>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
