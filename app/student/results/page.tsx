"use client";

import { BarsChart } from "@/components/charts";
import { Badge, Card, PageHeader, gradeLabelTone } from "@/components/ui";
import { classAverage, demo, gradeLabel, gradesFor } from "@/lib/data";

export default function StudentResults() {
  const s = demo.student;
  const grades = gradesFor(s.id);
  const avg = Math.round(grades.reduce((a, b) => a + b.total, 0) / grades.length);
  const chart = grades.map((g) => ({ subject: g.subject.replace("اللغة ", "").replace("الدراسات ", "د. "), me: g.total, avg: classAverage(s.className, g.subject) }));

  return (
    <>
      <PageHeader title="نتائجي" subtitle={`المعدل العام ${avg}% — ${gradeLabel(avg)}`} />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card title="الدرجات" padded={false} className="lg:col-span-3">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-4 py-3 text-start">المادة</th><th className="px-4 py-3 text-start">أعمال</th><th className="px-4 py-3 text-start">نصفي</th><th className="px-4 py-3 text-start">نهائي</th><th className="px-4 py-3 text-start">المجموع</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => (
                <tr key={g.subject}><td className="px-4 py-3 font-semibold">{g.subject}</td><td className="px-4 py-3">{g.activities}</td><td className="px-4 py-3">{g.midterm}</td><td className="px-4 py-3">{g.final}</td><td className="px-4 py-3"><Badge tone={gradeLabelTone(g.total)}>{g.total} — {gradeLabel(g.total)}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="أنا مقابل متوسط الفصل" className="lg:col-span-2"><BarsChart data={chart} xKey="subject" series={[{ key: "me", name: "درجتي" }, { key: "avg", name: "متوسط الفصل", color: "#94a3b8" }]} height={320} domain={[0, 100]} /></Card>
      </div>
    </>
  );
}
