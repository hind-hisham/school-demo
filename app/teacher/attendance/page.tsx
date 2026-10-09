"use client";

import { useState } from "react";
import { CheckCheck, Save } from "lucide-react";
import { Avatar, Badge, Button, Card, EmptyState, PageHeader, cx, inputCls } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { demo, studentsOfClass, type AttendanceStatus } from "@/lib/data";

const options: { v: AttendanceStatus; cls: string }[] = [
  { v: "حاضر", cls: "bg-emerald-500 text-white" },
  { v: "متأخر", cls: "bg-amber-500 text-white" },
  { v: "بعذر", cls: "bg-sky-500 text-white" },
  { v: "غائب", cls: "bg-rose-500 text-white" },
];

export default function AttendancePage() {
  const toast = useToast();
  const classes = demo.teacher.classes;
  const [cls, setCls] = useState(classes[0]);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const list = studentsOfClass(cls);
  const get = (id: string): AttendanceStatus => marks[id] ?? "حاضر";
  const count = (s: AttendanceStatus) => list.filter((x) => get(x.id) === s).length;

  const markAll = () => {
    const next = { ...marks };
    list.forEach((s) => (next[s.id] = "حاضر"));
    setMarks(next);
  };

  const save = () => toast(`تم حفظ الحضور. أُرسل إشعار غياب إلى ${count("غائب")} من أولياء الأمور (تجريبي)`);

  return (
    <>
      <PageHeader title="تسجيل الحضور" subtitle="الأربعاء 1448/04/25 — الحصة الأولى" actions={<Button variant="secondary" icon={CheckCheck} onClick={markAll}>تحضير الجميع</Button>} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select value={cls} onChange={(e) => setCls(e.target.value)} className={cx(inputCls, "w-auto")}>{classes.map((c) => <option key={c}>{c}</option>)}</select>
        <Badge tone="green">حاضر {count("حاضر")}</Badge>
        <Badge tone="amber">متأخر {count("متأخر")}</Badge>
        <Badge tone="blue">بعذر {count("بعذر")}</Badge>
        <Badge tone="red">غائب {count("غائب")}</Badge>
      </div>
      <Card padded={false}>
        {list.length === 0 ? (
          <EmptyState text="لا يوجد طلاب في هذا الفصل" />
        ) : (
          <ul className="divide-y divide-slate-100">
            {list.map((s, i) => (
              <li key={s.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
                <span className="w-6 text-sm text-slate-400">{i + 1}</span>
                <Avatar name={s.name} />
                <div className="min-w-0 flex-1"><p className="font-bold">{s.name}</p><p className="text-xs text-slate-400">{s.id} • قسم {s.section}</p></div>
                <div className="flex gap-1.5">
                  {options.map((o) => (
                    <button key={o.v} onClick={() => setMarks({ ...marks, [s.id]: o.v })} className={cx("rounded-lg px-3 py-1.5 text-xs font-bold transition", get(s.id) === o.v ? o.cls : "bg-slate-100 text-slate-500 hover:bg-slate-200")}>{o.v}</button>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end border-t border-slate-100 p-4"><Button icon={Save} onClick={save}>حفظ الحضور</Button></div>
      </Card>
    </>
  );
}
