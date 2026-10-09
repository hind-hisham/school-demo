"use client";

import { useState } from "react";
import { AlertTriangle, Banknote, CheckCircle2, Clock, CreditCard, FilePlus2 } from "lucide-react";
import { Badge, Button, Card, DataTable, Field, Modal, PageHeader, StatCard, Tabs, cx, inputCls, statusTone } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { allClasses, currency, fees as seedFees, invoices as seed, money, students, type Invoice } from "@/lib/data";

export default function FinancePage() {
  const toast = useToast();
  const [tab, setTab] = useState("invoices");
  const [rows, setRows] = useState<Invoice[]>(seed);
  const [status, setStatus] = useState("الكل");
  const [fees, setFees] = useState(seedFees);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ target: "class", className: allClasses[5], studentId: students[0].id, title: "رسوم الفصل الدراسي الثاني", amount: 3750 });

  const sum = (s: Invoice["status"]) => rows.filter((r) => r.status === s).reduce((a, b) => a + b.amount, 0);
  const paid = rows.filter((r) => r.status === "مدفوعة");

  const create = () => {
    const targets = form.target === "class" ? students.filter((s) => s.className === form.className && s.status === "نشط") : students.filter((s) => s.id === form.studentId);
    const created: Invoice[] = targets.map((s, i) => ({ id: `INV-${3000 + rows.length + i}`, studentId: s.id, studentName: s.name, parentId: s.parentId, title: form.title, amount: Number(form.amount), due: "1448/07/15", status: "معلقة", method: "—", paidOn: "—" }));
    setRows([...created, ...rows]);
    setOpen(false);
    toast(`تم إنشاء ${created.length} فاتورة وإشعار أولياء الأمور`);
  };

  return (
    <>
      <PageHeader title="الرسوم والمدفوعات" subtitle="الفواتير، تحديد الرسوم حسب المرحلة، وسجل المدفوعات مع تكامل بوابات الدفع" actions={<Button icon={FilePlus2} onClick={() => setOpen(true)}>إنشاء فواتير</Button>} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="إجمالي المحصّل" value={money(sum("مدفوعة"))} icon={Banknote} tone="green" />
        <StatCard label="فواتير معلقة" value={money(sum("معلقة"))} icon={Clock} tone="amber" />
        <StatCard label="فواتير متأخرة" value={money(sum("متأخرة"))} icon={AlertTriangle} tone="red" />
        <StatCard label="عدد المدفوعات" value={paid.length} icon={CheckCircle2} />
      </div>

      <Tabs tabs={[{ key: "invoices", label: "الفواتير" }, { key: "fees", label: "جدول الرسوم" }, { key: "payments", label: "سجل المدفوعات" }, { key: "gateway", label: "بوابات الدفع" }]} value={tab} onChange={setTab} />

      {tab === "invoices" && (
        <Card padded={false}>
          <DataTable
            rows={rows.filter((r) => status === "الكل" || r.status === status)}
            searchKeys={["studentName", "id", "title"]}
            toolbar={<select value={status} onChange={(e) => setStatus(e.target.value)} className={cx(inputCls, "w-auto")}><option>الكل</option><option>مدفوعة</option><option>معلقة</option><option>متأخرة</option></select>}
            columns={[
              { key: "id", header: "رقم الفاتورة" },
              { key: "studentName", header: "الطالب" },
              { key: "title", header: "البند" },
              { key: "amount", header: "المبلغ", render: (r) => <b>{money(r.amount)}</b> },
              { key: "due", header: "الاستحقاق" },
              { key: "status", header: "الحالة", render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
            ]}
          />
        </Card>
      )}

      {tab === "fees" && (
        <Card title="الرسوم الدراسية حسب المرحلة" action={<Button size="sm" onClick={() => toast("تم حفظ جدول الرسوم (تجريبي)")}>حفظ</Button>} padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-4 py-3 text-start">المرحلة</th><th className="px-4 py-3 text-start">الرسوم السنوية ({currency})</th><th className="px-4 py-3 text-start">النقل ({currency})</th><th className="px-4 py-3 text-start">الأنشطة ({currency})</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((f, i) => (
                  <tr key={f.stage}>
                    <td className="px-4 py-3 font-bold">{f.stage}</td>
                    {(["tuition", "transport", "activities"] as const).map((k) => (
                      <td key={k} className="px-4 py-3"><input type="number" className={cx(inputCls, "w-32")} value={f[k]} onChange={(e) => setFees(fees.map((x, j) => (j === i ? { ...x, [k]: Number(e.target.value) } : x)))} /></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {tab === "payments" && (
        <Card padded={false}>
          <DataTable
            rows={paid}
            searchKeys={["studentName", "id"]}
            columns={[
              { key: "id", header: "المرجع" },
              { key: "studentName", header: "الطالب" },
              { key: "title", header: "البند" },
              { key: "amount", header: "المبلغ", render: (r) => <b>{money(r.amount)}</b> },
              { key: "method", header: "الطريقة", render: (r) => <Badge tone="blue">{r.method}</Badge> },
              { key: "paidOn", header: "تاريخ الدفع" },
            ]}
          />
        </Card>
      )}

      {tab === "gateway" && (
        <div className="grid gap-5 md:grid-cols-2">
          <Card title={<span className="flex items-center gap-2"><CreditCard size={18} className="text-brand" /> وسائل الدفع المفعّلة</span>}>
            <ul className="space-y-3 text-sm">
              {["بطاقات مدى", "فيزا / ماستركارد", "Apple Pay", "تحويل بنكي"].map((m) => (
                <li key={m} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><span className="font-bold">{m}</span><Badge tone="green">مفعّلة</Badge></li>
              ))}
            </ul>
          </Card>
          <Card title="ملاحظة التكامل">
            <p className="text-sm leading-7 text-slate-600">يُربط النظام ببوابة الدفع التي تتعاقد معها المدرسة مباشرة عبر مفاتيح API خاصة بها، فتصل المبالغ إلى حساب المدرسة دون وسيط. في هذه النسخة التجريبية يتم تنفيذ الدفع بشكل محاكى فقط.</p>
          </Card>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="إنشاء فواتير" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={create}>إنشاء</Button></>}>
        <div className="space-y-4">
          <Field label="إنشاء لـ">
            <select className={inputCls} value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}><option value="class">فصل كامل</option><option value="student">طالب واحد</option></select>
          </Field>
          {form.target === "class" ? (
            <Field label="الفصل"><select className={inputCls} value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>{allClasses.slice(3).map((c) => <option key={c}>{c}</option>)}</select></Field>
          ) : (
            <Field label="الطالب"><select className={inputCls} value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })}>{students.filter((s) => s.status === "نشط").map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          )}
          <Field label="بند الفاتورة"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label={`المبلغ (${currency})`}><input type="number" className={inputCls} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} /></Field>
        </div>
      </Modal>
    </>
  );
}
