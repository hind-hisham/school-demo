"use client";

import { useState } from "react";
import { Archive, Eye, Plus } from "lucide-react";
import { Avatar, Badge, Button, Card, DataTable, Field, Modal, PageHeader, Progress, cx, gradeLabelTone, inputCls, statusTone } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { allClasses, gradeLabel, gradesFor, parentById, parents, sections, stageOfClass, students as seed, type Student } from "@/lib/data";

export default function StudentsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Student[]>(seed);
  const [cls, setCls] = useState("الكل");
  const [status, setStatus] = useState("الكل");
  const [view, setView] = useState<Student | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", className: allClasses[5], section: "أ", parentId: parents[0].id });

  const filtered = rows.filter((r) => (cls === "الكل" || r.className === cls) && (status === "الكل" || r.status === status));

  const archive = (id: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status: r.status === "نشط" ? "مؤرشف" : "نشط" } : r)));
    toast("تم تحديث حالة الطالب في الأرشيف");
  };

  const add = () => {
    if (!form.name.trim()) return;
    const p = parentById(form.parentId)!;
    setRows([
      { id: `S-${1100 + rows.length}`, name: `${form.name} ${p.first} ${p.family}`, first: form.name, family: p.family, gender: "ذكر", className: form.className, stage: stageOfClass(form.className), section: form.section, parentId: p.id, attendance: 100, avg: 0, status: "نشط", year: "1448 هـ" },
      ...rows,
    ]);
    setOpen(false);
    setForm({ ...form, name: "" });
    toast("تمت إضافة الطالب وربطه بولي الأمر");
  };

  return (
    <>
      <PageHeader title="إدارة الطلاب" subtitle={`${rows.filter((r) => r.status === "نشط").length} طالب نشط • ${rows.filter((r) => r.status === "مؤرشف").length} مؤرشف`} actions={<Button icon={Plus} onClick={() => setOpen(true)}>إضافة طالب</Button>} />
      <Card padded={false}>
        <DataTable
          rows={filtered}
          searchKeys={["name", "id"]}
          placeholder="ابحث بالاسم أو رقم الطالب..."
          toolbar={
            <>
              <select value={cls} onChange={(e) => setCls(e.target.value)} className={cx(inputCls, "w-auto")}><option>الكل</option>{allClasses.map((c) => <option key={c}>{c}</option>)}</select>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className={cx(inputCls, "w-auto")}><option>الكل</option><option>نشط</option><option>مؤرشف</option></select>
            </>
          }
          columns={[
            { key: "name", header: "الطالب", render: (r) => <div className="flex items-center gap-3"><Avatar name={r.name} /><div><p className="font-bold">{r.name}</p><p className="text-xs text-slate-400">{r.id}</p></div></div> },
            { key: "className", header: "الفصل", render: (r) => <span>{r.className} <span className="text-slate-400">({r.section})</span></span> },
            { key: "parent", header: "ولي الأمر", render: (r) => parentById(r.parentId)?.name },
            { key: "attendance", header: "الحضور", render: (r) => <div className="w-24"><p className="mb-1 text-xs text-slate-500">{r.attendance}%</p><Progress value={r.attendance} tone={r.attendance >= 90 ? "green" : "amber"} /></div> },
            { key: "avg", header: "المعدل", render: (r) => (r.avg ? <Badge tone={gradeLabelTone(r.avg)}>{r.avg}%</Badge> : "—") },
            { key: "status", header: "الحالة", render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
            { key: "act", header: "", render: (r) => (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" icon={Eye} onClick={() => setView(r)}>الملف</Button>
                <Button size="sm" variant="ghost" icon={Archive} onClick={() => archive(r.id)}>{r.status === "نشط" ? "أرشفة" : "استعادة"}</Button>
              </div>
            ) },
          ]}
        />
      </Card>

      <Modal open={!!view} onClose={() => setView(null)} title="ملف الطالب" wide footer={<Button variant="secondary" onClick={() => setView(null)}>إغلاق</Button>}>
        {view && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Avatar name={view.name} size={56} />
              <div>
                <h4 className="text-lg font-extrabold">{view.name}</h4>
                <p className="text-sm text-slate-500">{view.id} • {view.className} ({view.section}) • العام {view.year}</p>
                <p className="text-sm text-slate-500">ولي الأمر: {parentById(view.parentId)?.name} — {parentById(view.parentId)?.phone}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[["الحضور", `${view.attendance}%`], ["المعدل", `${view.avg}%`], ["التقدير", gradeLabel(view.avg)], ["الحالة", view.status]].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-slate-50 p-3 text-center"><p className="text-xs text-slate-500">{k}</p><p className="text-lg font-extrabold">{v}</p></div>
              ))}
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-3 py-2 text-start">المادة</th><th className="px-3 py-2 text-start">أعمال</th><th className="px-3 py-2 text-start">نصفي</th><th className="px-3 py-2 text-start">نهائي</th><th className="px-3 py-2 text-start">المجموع</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {gradesFor(view.id).map((g) => (
                  <tr key={g.subject}><td className="px-3 py-2 font-semibold">{g.subject}</td><td className="px-3 py-2">{g.activities}</td><td className="px-3 py-2">{g.midterm}</td><td className="px-3 py-2">{g.final}</td><td className="px-3 py-2"><Badge tone={gradeLabelTone(g.total)}>{g.total}</Badge></td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة طالب جديد" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={add}>حفظ</Button></>}>
        <div className="space-y-4">
          <Field label="اسم الطالب (الاسم الأول)"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="الفصل"><select className={inputCls} value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>{allClasses.map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="القسم"><select className={inputCls} value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })}>{sections.map((c) => <option key={c}>{c}</option>)}</select></Field>
          </div>
          <Field label="ولي الأمر"><select className={inputCls} value={form.parentId} onChange={(e) => setForm({ ...form, parentId: e.target.value })}>{parents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></Field>
        </div>
      </Modal>
    </>
  );
}
