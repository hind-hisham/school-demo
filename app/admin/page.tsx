"use client";

import Link from "next/link";
import { AlertTriangle, Banknote, CalendarCheck, GraduationCap, Presentation, UsersRound, Video } from "lucide-react";
import { BarsChart, DonutChart, TrendChart } from "@/components/charts";
import { Avatar, Badge, Card, PageHeader, Progress, StatCard, statusTone } from "@/components/ui";
import { attendanceTrend, exams, invoices, money, parents, performanceByStage, revenueTrend, sessions, students, teachers, topStudents } from "@/lib/data";

export default function AdminDashboard() {
  const active = students.filter((s) => s.status === "نشط");
  const collected = invoices.filter((i) => i.status === "مدفوعة").reduce((a, b) => a + b.amount, 0);
  const total = invoices.reduce((a, b) => a + b.amount, 0);
  const overdue = invoices.filter((i) => i.status === "متأخرة");
  const stageDist = performanceByStage.map((p) => ({ name: p.stage, value: p.count })).filter((x) => x.value > 0);
  const avgAtt = Math.round(active.reduce((a, b) => a + b.attendance, 0) / active.length);

  return (
    <>
      <PageHeader title="لوحة القيادة" subtitle="نظرة شاملة على أداء المدرسة اليوم — العام الدراسي 1448 هـ" />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard label="الطلاب النشطون" value={active.length} icon={GraduationCap} hint="+4 هذا الشهر" />
        <StatCard label="المعلمون" value={teachers.length} icon={Presentation} tone="blue" hint={`${teachers.filter((t) => t.status === "إجازة").length} في إجازة`} />
        <StatCard label="أولياء الأمور" value={parents.length} icon={UsersRound} tone="violet" hint="حسابات مفعّلة" />
        <StatCard label="نسبة الحضور" value={`${avgAtt}%`} icon={CalendarCheck} tone="green" hint="متوسط الفصل الحالي" />
        <StatCard label="المحصّل من الرسوم" value={money(collected)} icon={Banknote} tone="amber" hint={`من أصل ${money(total)}`} />
        <StatCard label="فواتير متأخرة" value={overdue.length} icon={AlertTriangle} tone="red" hint="تحتاج متابعة" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card title="اتجاه الحضور (%)" className="lg:col-span-2">
          <TrendChart data={attendanceTrend} xKey="month" series={[{ key: "rate", name: "نسبة الحضور" }]} unit="%" />
        </Card>
        <Card title="توزيع الطلاب حسب المرحلة">
          <DonutChart data={stageDist} />
        </Card>
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card title="التحصيل المالي الشهري" className="lg:col-span-2">
          <BarsChart data={revenueTrend} xKey="month" series={[{ key: "collected", name: "المحصّل" }, { key: "expected", name: "المتوقع" }]} />
        </Card>
        <Card title="متوسط الأداء الأكاديمي">
          <div className="space-y-4">
            {performanceByStage.filter((p) => p.count > 0).map((p) => (
              <div key={p.stage}>
                <div className="mb-1 flex justify-between text-sm"><span className="font-semibold">{p.stage}</span><span className="text-slate-500">{p.avg}%</span></div>
                <Progress value={p.avg} tone={p.avg >= 85 ? "green" : p.avg >= 70 ? "brand" : "amber"} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card title="الحصص الأونلاين" action={<Link href="/admin/online" className="text-xs font-semibold text-brand">عرض الكل</Link>}>
          <ul className="space-y-3">
            {sessions.filter((s) => s.status !== "منتهية").slice(0, 4).map((s) => (
              <li key={s.id} className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand/10 text-brand"><Video size={18} /></div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{s.title}</p><p className="text-xs text-slate-500">{s.className} • {s.time}</p></div>
                <Badge tone={statusTone(s.status)}>{s.status}</Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="الامتحانات القادمة" action={<Link href="/admin/exams" className="text-xs font-semibold text-brand">عرض الكل</Link>}>
          <ul className="space-y-3">
            {exams.slice(0, 4).map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0"><p className="truncate font-bold">{e.title}</p><p className="text-xs text-slate-500">{e.className}</p></div>
                <span className="shrink-0 text-xs text-slate-500">{e.day} {e.date}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="الطلاب المتميزون" action={<Link href="/top-students" className="text-xs font-semibold text-brand">في الموقع</Link>}>
          <ul className="space-y-3">
            {topStudents.slice(0, 4).map((s) => (
              <li key={s.name} className="flex items-center gap-3">
                <Avatar name={s.name} />
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{s.name}</p><p className="text-xs text-slate-500">{s.cls}</p></div>
                <Badge tone="green">{s.avg}%</Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}
