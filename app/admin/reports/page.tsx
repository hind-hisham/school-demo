"use client";

import { Download, Lightbulb } from "lucide-react";
import { BarsChart, DonutChart, TrendChart } from "@/components/charts";
import { Button, Card, PageHeader } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { activityParticipation, attendanceByClass, attendanceTrend, invoices, money, performanceByStage, revenueTrend, students } from "@/lib/data";

export default function ReportsPage() {
  const toast = useToast();
  const lowest = [...attendanceByClass].filter((a) => a.rate > 0).sort((a, b) => a.rate - b.rate)[0];
  const bestStage = [...performanceByStage].filter((p) => p.count > 0).sort((a, b) => b.avg - a.avg)[0];
  const overdue = invoices.filter((i) => i.status === "متأخرة");
  const risk = students.filter((s) => s.status === "نشط" && s.attendance < 88).length;

  return (
    <>
      <PageHeader
        title="التقارير والتحليلات"
        subtitle="بيانات تدعم قرارات الإدارة: الحضور، الأداء، المدفوعات، والأنشطة"
        actions={<><Button variant="secondary" icon={Download} onClick={() => toast("تم تجهيز ملف PDF (تجريبي)")}>PDF</Button><Button variant="secondary" icon={Download} onClick={() => toast("تم تجهيز ملف Excel (تجريبي)")}>Excel</Button></>}
      />

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          { t: "أقل الفصول حضورًا", v: `${lowest.className} (${lowest.rate}%)`, d: "يُنصح بالتواصل مع أولياء الأمور" },
          { t: "أفضل مرحلة أداءً", v: `${bestStage.stage} (${bestStage.avg}%)`, d: "متوسط المعدلات للعام الحالي" },
          { t: "طلاب بحاجة متابعة", v: `${risk} طلاب`, d: `حضورهم أقل من 88% • ${overdue.length} فاتورة متأخرة (${money(overdue.reduce((a, b) => a + b.amount, 0))})` },
        ].map((x) => (
          <div key={x.t} className="flex gap-3 rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <Lightbulb className="mt-0.5 shrink-0 text-amber-500" size={20} />
            <div><p className="text-xs font-semibold text-amber-700">{x.t}</p><p className="text-lg font-extrabold text-slate-800">{x.v}</p><p className="text-xs text-slate-500">{x.d}</p></div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="الحضور حسب الفصل (%)"><BarsChart data={attendanceByClass} xKey="className" series={[{ key: "rate", name: "نسبة الحضور" }]} domain={[70, 100]} unit="%" /></Card>
        <Card title="الأداء الأكاديمي حسب المرحلة"><BarsChart data={performanceByStage.filter((p) => p.count > 0)} xKey="stage" series={[{ key: "avg", name: "متوسط المعدل" }]} domain={[0, 100]} /></Card>
        <Card title="المحصّل مقابل المتوقع"><TrendChart data={revenueTrend} xKey="month" series={[{ key: "collected", name: "المحصّل" }, { key: "expected", name: "المتوقع" }]} /></Card>
        <Card title="المشاركة في الأنشطة"><DonutChart data={activityParticipation} /></Card>
        <Card title="اتجاه الغياب (%)" className="lg:col-span-2"><TrendChart data={attendanceTrend} xKey="month" series={[{ key: "absence", name: "نسبة الغياب", color: "#e11d48" }]} unit="%" height={220} /></Card>
      </div>
    </>
  );
}
