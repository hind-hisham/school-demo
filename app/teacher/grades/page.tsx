"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader, cx, gradeLabelTone, inputCls } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { demo, gradeLabel, gradesFor, studentsOfClass } from "@/lib/data";

type Entry = { activities: number; midterm: number; final: number };

export default function GradesPage() {
  const toast = useToast();
  const t = demo.teacher;
  const [cls, setCls] = useState(t.classes[0]);
  const [edits, setEdits] = useState<Record<string, Entry>>({});
  const list = studentsOfClass(cls);

  const entry = (id: string): Entry => {
    if (edits[id]) return edits[id];
    const g = gradesFor(id).find((x) => x.subject === t.subject)!;
    return { activities: g.activities, midterm: g.midterm, final: g.final };
  };

  const set = (id: string, key: keyof Entry, max: number, v: string) => {
    const n = Math.max(0, Math.min(max, Number(v) || 0));
    setEdits({ ...edits, [id]: { ...entry(id), [key]: n } });
  };

  const avg = list.length ? Math.round(list.reduce((a, s) => { const e = entry(s.id); return a + e.activities + e.midterm + e.final; }, 0) / list.length) : 0;

  return (
    <>
      <PageHeader title="رصد الدرجات" subtitle={`مادة ${t.subject} — الدرجة من 100 (أعمال 20 + نصفي 30 + نهائي 50)`} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select value={cls} onChange={(e) => setCls(e.target.value)} className={cx(inputCls, "w-auto")}>{t.classes.map((c) => <option key={c}>{c}</option>)}</select>
        <Badge tone="brand">متوسط الفصل: {avg}</Badge>
      </div>
      <Card padded={false}>
        {list.length === 0 ? (
          <EmptyState text="لا يوجد طلاب في هذا الفصل" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-4 py-3 text-start">الطالب</th><th className="px-4 py-3 text-start">أعمال (20)</th><th className="px-4 py-3 text-start">نصفي (30)</th><th className="px-4 py-3 text-start">نهائي (50)</th><th className="px-4 py-3 text-start">المجموع</th><th className="px-4 py-3 text-start">التقدير</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {list.map((s) => {
                  const e = entry(s.id);
                  const total = e.activities + e.midterm + e.final;
                  return (
                    <tr key={s.id}>
                      <td className="px-4 py-2 font-bold">{s.name}</td>
                      {([["activities", 20], ["midterm", 30], ["final", 50]] as const).map(([k, max]) => (
                        <td key={k} className="px-4 py-2"><input type="number" min={0} max={max} value={e[k]} onChange={(ev) => set(s.id, k, max, ev.target.value)} className={cx(inputCls, "w-20 text-center")} /></td>
                      ))}
                      <td className="px-4 py-2 text-base font-extrabold">{total}</td>
                      <td className="px-4 py-2"><Badge tone={gradeLabelTone(total)}>{gradeLabel(total)}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="flex items-center justify-between border-t border-slate-100 p-4">
          <p className="text-xs text-slate-500">عند الاعتماد تصل النتائج لأولياء الأمور والطلاب مع إشعار تلقائي.</p>
          <Button icon={Send} onClick={() => toast("تم اعتماد الدرجات وإشعار أولياء الأمور (تجريبي)")}>اعتماد ونشر النتائج</Button>
        </div>
      </Card>
    </>
  );
}
