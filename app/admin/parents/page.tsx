"use client";

import { useState } from "react";
import { BellRing, Plus } from "lucide-react";
import { Avatar, Badge, Button, Card, DataTable, Field, Modal, PageHeader, inputCls } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { invoicesOfParent, money, parents as seed, studentById, students, type Parent } from "@/lib/data";

export default function ParentsPage() {
  const toast = useToast();
  const [rows, setRows] = useState<Parent[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", child: students[1].id });

  const due = (p: Parent) => invoicesOfParent(p.id).filter((i) => i.status !== "مدفوعة").reduce((a, b) => a + b.amount, 0);

  const add = () => {
    if (!form.name.trim()) return;
    setRows([{ id: `P-${300 + rows.length}`, name: form.name, first: form.name.split(" ")[0], family: form.name.split(" ")[1] ?? "", relation: "الأب", phone: form.phone || "0500000000", email: "new.parent@example.com", children: [form.child] }, ...rows]);
    setOpen(false);
    setForm({ ...form, name: "", phone: "" });
    toast("تم إنشاء حساب ولي الأمر وربطه بالطالب");
  };

  return (
    <>
      <PageHeader title="أولياء الأمور" subtitle="حساب خاص لكل ولي أمر مرتبط بأبنائه لمتابعة النتائج والحضور والفواتير" actions={<Button icon={Plus} onClick={() => setOpen(true)}>حساب جديد</Button>} />
      <Card padded={false}>
        <DataTable
          rows={rows}
          searchKeys={["name", "phone"]}
          columns={[
            { key: "name", header: "ولي الأمر", render: (r) => <div className="flex items-center gap-3"><Avatar name={r.name} /><div><p className="font-bold">{r.name}</p><p className="text-xs text-slate-400">{r.phone}</p></div></div> },
            { key: "children", header: "الأبناء", render: (r) => <div className="flex flex-wrap gap-1">{r.children.map((id) => <Badge key={id} tone="brand">{studentById(id)?.first ?? id} — {studentById(id)?.className}</Badge>)}</div> },
            { key: "due", header: "المبالغ المستحقة", render: (r) => { const d = due(r); return d ? <span className="font-bold text-rose-600">{money(d)}</span> : <Badge tone="green">مسدّد</Badge>; } },
            { key: "act", header: "", render: (r) => due(r) > 0 ? <Button size="sm" variant="secondary" icon={BellRing} onClick={() => toast(`أُرسل تذكير بالسداد إلى ${r.name} عبر واتساب (تجريبي)`)}>تذكير</Button> : null },
          ]}
        />
      </Card>

      <Modal open={open} onClose={() => setOpen(false)} title="إنشاء حساب ولي أمر" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={add}>إنشاء</Button></>}>
        <div className="space-y-4">
          <Field label="اسم ولي الأمر"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="رقم الجوال"><input className={inputCls} dir="ltr" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
          <Field label="ربط بطالب"><select className={inputCls} value={form.child} onChange={(e) => setForm({ ...form, child: e.target.value })}>{students.filter((s) => s.status === "نشط").map((s) => <option key={s.id} value={s.id}>{s.name} — {s.className}</option>)}</select></Field>
        </div>
      </Modal>
    </>
  );
}
