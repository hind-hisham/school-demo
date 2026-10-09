"use client";

import { useState } from "react";
import { Link2, Plus } from "lucide-react";
import { Avatar, Badge, Button, Card, DataTable, Field, Modal, PageHeader, inputCls, statusTone } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { allClasses, subjects, teachers as seed, type Teacher } from "@/lib/data";

export default function TeachersPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Teacher[]>(seed);
  const [open, setOpen] = useState(false);
  const [assign, setAssign] = useState<Teacher | null>(null);
  const [picked, setPicked] = useState<string[]>([]);
  const [form, setForm] = useState({ name: "", subject: subjects[0], phone: "" });

  const add = () => {
    if (!form.name.trim()) return;
    setRows([{ id: `T-${200 + rows.length}`, name: `أ. ${form.name}`, subject: form.subject, classes: [], phone: form.phone || "0500000000", email: "new.teacher@alnoor-demo.example", status: "نشط", experience: 0 }, ...rows]);
    setOpen(false);
    setForm({ name: "", subject: subjects[0], phone: "" });
    toast("تمت إضافة المعلم وإرسال بيانات الدخول (تجريبي)");
  };

  const openAssign = (t: Teacher) => { setAssign(t); setPicked(t.classes); };
  const saveAssign = () => {
    if (!assign) return;
    setRows(rows.map((r) => (r.id === assign.id ? { ...r, classes: picked } : r)));
    setAssign(null);
    toast("تم ربط المعلم بالفصول المحددة");
  };

  return (
    <>
      <PageHeader title="إدارة المعلمين" subtitle="ربط المعلم بالمواد والفصول وتحديد صلاحيات رفع النتائج والحضور" actions={<Button icon={Plus} onClick={() => setOpen(true)}>إضافة معلم</Button>} />
      <Card padded={false}>
        <DataTable
          rows={rows}
          searchKeys={["name", "subject"]}
          columns={[
            { key: "name", header: "المعلم", render: (r) => <div className="flex items-center gap-3"><Avatar name={r.name} /><div><p className="font-bold">{r.name}</p><p className="text-xs text-slate-400">{r.email}</p></div></div> },
            { key: "subject", header: "المادة", render: (r) => <Badge tone="blue">{r.subject}</Badge> },
            { key: "classes", header: "الفصول المكلّف بها", render: (r) => <div className="flex flex-wrap gap-1">{r.classes.length ? r.classes.map((c) => <Badge key={c}>{c}</Badge>) : <span className="text-xs text-slate-400">لم تُحدد</span>}</div> },
            { key: "experience", header: "الخبرة", render: (r) => `${r.experience} سنة` },
            { key: "status", header: "الحالة", render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
            { key: "act", header: "", render: (r) => <Button size="sm" variant="secondary" icon={Link2} onClick={() => openAssign(r)}>ربط بالفصول</Button> },
          ]}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة معلم" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={add}>حفظ</Button></>}>
        <div className="space-y-4">
          <Field label="اسم المعلم"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="المادة"><select className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{subjects.map((s) => <option key={s}>{s}</option>)}</select></Field>
          <Field label="رقم الجوال"><input className={inputCls} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
        </div>
      </Modal>

      <Modal open={!!assign} onClose={() => setAssign(null)} title={`ربط ${assign?.name ?? ""} بالفصول`} wide footer={<><Button variant="secondary" onClick={() => setAssign(null)}>إلغاء</Button><Button onClick={saveAssign}>حفظ</Button></>}>
        <p className="mb-3 text-sm text-slate-500">اختر الفصول التي يدرّس فيها المعلم مادة {assign?.subject}. سيحصل المعلم تلقائيًا على صلاحية تسجيل الحضور ورصد الدرجات لهذه الفصول فقط.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {allClasses.slice(3).map((c) => (
            <label key={c} className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 p-2.5 text-sm hover:bg-slate-50">
              <input type="checkbox" checked={picked.includes(c)} onChange={() => setPicked(picked.includes(c) ? picked.filter((x) => x !== c) : [...picked, c])} className="accent-[rgb(var(--brand))]" />
              {c}
            </label>
          ))}
        </div>
      </Modal>
    </>
  );
}
