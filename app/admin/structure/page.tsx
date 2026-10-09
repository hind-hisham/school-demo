"use client";

import { useState } from "react";
import { CalendarRange, Plus } from "lucide-react";
import { Badge, Button, Card, Field, Modal, PageHeader, Tabs, Toggle, inputCls } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { sections, stages, studentsOfClass } from "@/lib/data";

export default function StructurePage() {
  const toast = useToast();
  const [tab, setTab] = useState("stages");
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [hijri, setHijri] = useState(true);

  return (
    <>
      <PageHeader title="المراحل والفصول الدراسية" subtitle="عرّف المراحل، اربط الفصول بها، وقسّم كل فصل إلى أقسام" actions={<Button icon={Plus} onClick={() => setOpen(true)}>فصل جديد</Button>} />
      <Tabs tabs={[{ key: "stages", label: "المراحل والفصول" }, { key: "year", label: "السنة الدراسية" }]} value={tab} onChange={setTab} />

      {tab === "stages" ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {stages.map((s) => (
            <Card key={s.id} title={<span className="flex items-center gap-2">{s.name} <Badge tone="brand">{s.classes.length} فصول</Badge></span>}>
              <ul className="divide-y divide-slate-100">
                {s.classes.map((c) => (
                  <li key={c} className="flex flex-wrap items-center justify-between gap-2 py-3">
                    <div>
                      <p className="font-bold text-slate-800">{c}</p>
                      <p className="text-xs text-slate-500">{studentsOfClass(c).length} طالب</p>
                    </div>
                    <div className="flex gap-1.5">
                      {sections.map((x) => <span key={x} className="grid h-7 w-7 place-items-center rounded-lg bg-slate-100 text-xs font-bold text-slate-600">{x}</span>)}
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Card title={<span className="flex items-center gap-2"><CalendarRange size={18} className="text-brand" /> العام الدراسي الحالي</span>}>
            <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-3">
              <span className="text-sm font-semibold">عرض التواريخ بالتقويم الهجري</span>
              <Toggle checked={hijri} onChange={setHijri} label="التقويم الهجري" />
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ["العام الدراسي", hijri ? "1448 هـ" : "2026 - 2027 م"],
                ["بداية العام", hijri ? "1448/02/05" : "2026/08/18"],
                ["نهاية الفصل الأول", hijri ? "1448/06/10" : "2026/12/20"],
                ["بداية الفصل الثاني", hijri ? "1448/06/24" : "2027/01/03"],
                ["نهاية العام", hijri ? "1449/01/12" : "2027/06/30"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between border-b border-slate-100 pb-2"><dt className="text-slate-500">{k}</dt><dd className="font-bold">{v}</dd></div>
              ))}
            </dl>
          </Card>
          <Card title="أرشفة الأعوام">
            <ul className="space-y-3 text-sm">
              {[["1448 هـ", "العام الحالي", "green"], ["1447 هـ", "مؤرشف — 6 طلاب", "gray"], ["1446 هـ", "مؤرشف", "gray"]].map(([y, d, t]) => (
                <li key={y} className="flex items-center justify-between rounded-xl border border-slate-100 p-3">
                  <span className="font-bold">{y}</span>
                  <Badge tone={t as "green" | "gray"}>{d}</Badge>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-slate-500">عند إغلاق العام تُؤرشف بيانات الطلاب والدرجات تلقائيًا مع بقائها متاحة للرجوع إليها.</p>
          </Card>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة فصل" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={() => { setOpen(false); setName(""); toast("تمت إضافة الفصل (تجريبي)"); }}>إضافة</Button></>}>
        <div className="space-y-4">
          <Field label="اسم الفصل"><input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="مثال: الرابع الابتدائي" /></Field>
          <Field label="المرحلة"><select className={inputCls}>{stages.map((s) => <option key={s.id}>{s.name}</option>)}</select></Field>
          <Field label="عدد الأقسام"><select className={inputCls}><option>2</option><option>3</option><option>4</option></select></Field>
        </div>
      </Modal>
    </>
  );
}
