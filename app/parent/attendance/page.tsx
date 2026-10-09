"use client";

import { useState } from "react";
import { Badge, Card, PageHeader, StatCard, cx } from "@/components/ui";
import { ChildPicker } from "@/components/views";
import { CalendarCheck, Clock, UserX, FileCheck2 } from "lucide-react";
import { attendanceLog, days, demo, studentById, type AttendanceStatus } from "@/lib/data";

const cell: Record<AttendanceStatus, string> = {
  حاضر: "bg-emerald-50 text-emerald-700",
  غائب: "bg-rose-100 text-rose-700",
  متأخر: "bg-amber-100 text-amber-700",
  بعذر: "bg-sky-100 text-sky-700",
};

export default function ParentAttendance() {
  const kids = demo.parent.children.map((id) => studentById(id)!);
  const [kidId, setKidId] = useState(kids[0].id);
  const kid = kids.find((k) => k.id === kidId)!;
  const log = attendanceLog(kid.id);
  const n = (s: AttendanceStatus) => log.filter((l) => l.status === s).length;

  return (
    <>
      <PageHeader title="الحضور والغياب" subtitle="آخر 4 أسابيع دراسية" />
      <ChildPicker kids={kids.map((k) => ({ id: k.id, name: k.name, className: `${k.className} (${k.section})` }))} value={kidId} onChange={setKidId} />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="أيام الحضور" value={n("حاضر")} icon={CalendarCheck} tone="green" />
        <StatCard label="أيام الغياب" value={n("غائب")} icon={UserX} tone="red" />
        <StatCard label="التأخر" value={n("متأخر")} icon={Clock} tone="amber" />
        <StatCard label="غياب بعذر" value={n("بعذر")} icon={FileCheck2} tone="blue" />
      </div>
      <Card title="سجل الأسابيع" padded={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-4 py-3 text-start">الأسبوع</th>{days.map((d) => <th key={d} className="px-4 py-3 text-start">{d}</th>)}</tr></thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3, 4].map((w) => (
                <tr key={w}>
                  <td className="px-4 py-3 font-bold">الأسبوع {w}</td>
                  {log.filter((l) => l.week === w).map((l) => (
                    <td key={l.day} className="px-2 py-2"><span className={cx("block rounded-lg px-3 py-2 text-center text-xs font-bold", cell[l.status])}>{l.status}</span></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 border-t border-slate-100 p-4 text-xs">{(Object.keys(cell) as AttendanceStatus[]).map((k) => <Badge key={k} tone={k === "حاضر" ? "green" : k === "غائب" ? "red" : k === "متأخر" ? "amber" : "blue"}>{k}</Badge>)}</div>
      </Card>
    </>
  );
}
