"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { BarsChart } from "@/components/charts";
import { Badge, Button, Card, PageHeader, gradeLabelTone } from "@/components/ui";
import { ChildPicker } from "@/components/views";
import { classAverage, demo, gradeLabel, gradesFor, studentById } from "@/lib/data";

export default function ParentResults() {
  const kids = demo.parent.children.map((id) => studentById(id)!);
  const [kidId, setKidId] = useState(kids[0].id);
  const kid = kids.find((k) => k.id === kidId)!;
  const grades = gradesFor(kid.id);
  const chart = grades.map((g) => ({ subject: g.subject.replace("اللغة ", "").replace("الدراسات ", "د. "), child: g.total, avg: classAverage(kid.className, g.subject) }));

  return (
    <>
      <PageHeader title="النتائج" subtitle="درجات الطالب مقارنة بمتوسط الفصل" actions={<Button variant="secondary" icon={Printer} onClick={() => window.print()}>طباعة الشهادة</Button>} />
      <ChildPicker kids={kids.map((k) => ({ id: k.id, name: k.name, className: `${k.className} (${k.section})` }))} value={kidId} onChange={setKidId} />
      <div className="grid gap-6 lg:grid-cols-5">
        <Card title="الدرجات التفصيلية" padded={false} className="lg:col-span-3">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-4 py-3 text-start">المادة</th><th className="px-4 py-3 text-start">أعمال</th><th className="px-4 py-3 text-start">نصفي</th><th className="px-4 py-3 text-start">نهائي</th><th className="px-4 py-3 text-start">المجموع</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {grades.map((g) => (
                <tr key={g.subject}><td className="px-4 py-3 font-semibold">{g.subject}</td><td className="px-4 py-3">{g.activities}</td><td className="px-4 py-3">{g.midterm}</td><td className="px-4 py-3">{g.final}</td><td className="px-4 py-3"><Badge tone={gradeLabelTone(g.total)}>{g.total} — {gradeLabel(g.total)}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="مقارنة بمتوسط الفصل" className="lg:col-span-2">
          <BarsChart data={chart} xKey="subject" series={[{ key: "child", name: kid.first }, { key: "avg", name: "متوسط الفصل", color: "#94a3b8" }]} height={320} domain={[0, 100]} />
        </Card>
      </div>
    </>
  );
}
