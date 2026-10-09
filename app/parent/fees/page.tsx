"use client";

import { useState } from "react";
import { CreditCard, Lock, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, DataTable, Field, Modal, PageHeader, StatCard, statusTone, inputCls } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { demo, invoicesOfParent, money, type Invoice } from "@/lib/data";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export default function ParentFees() {
  const toast = useToast();
  const [rows, setRows] = useState<Invoice[]>(invoicesOfParent(demo.parent.id));
  const [pay, setPay] = useState<Invoice | null>(null);
  const [method, setMethod] = useState("مدى");
  const [busy, setBusy] = useState(false);

  const sum = (s: Invoice["status"]) => rows.filter((r) => r.status === s).reduce((a, b) => a + b.amount, 0);

  const confirm = () => {
    if (!pay) return;
    setBusy(true);
    setTimeout(() => {
      setRows((rs) => rs.map((r) => (r.id === pay.id ? { ...r, status: "مدفوعة", method, paidOn: "1448/04/25" } : r)));
      setBusy(false);
      setPay(null);
      toast("تمت عملية الدفع بنجاح وتم إصدار الإيصال (محاكاة)");
    }, 900);
  };

  return (
    <>
      <PageHeader title="الرسوم والفواتير" subtitle="سدّد الرسوم إلكترونيًا واطّلع على سجل مدفوعاتك" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="مدفوع" value={money(sum("مدفوعة"))} icon={CheckCircle2} tone="green" />
        <StatCard label="معلّق" value={money(sum("معلقة"))} icon={Clock} tone="amber" />
        <StatCard label="متأخر" value={money(sum("متأخرة"))} icon={AlertTriangle} tone="red" />
      </div>
      <Card padded={false}>
        <DataTable
          rows={rows}
          pageSize={10}
          columns={[
            { key: "id", header: "رقم الفاتورة" },
            { key: "studentName", header: "الطالب", render: (r) => r.studentName.split(" ")[0] },
            { key: "title", header: "البند" },
            { key: "amount", header: "المبلغ", render: (r) => <b>{money(r.amount)}</b> },
            { key: "due", header: "الاستحقاق" },
            { key: "status", header: "الحالة", render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
            { key: "act", header: "", render: (r) => (r.status === "مدفوعة" ? <span className="text-xs text-slate-400">{r.method} • {r.paidOn}</span> : <Button size="sm" icon={CreditCard} onClick={() => setPay(r)}>ادفع الآن</Button>) },
          ]}
        />
      </Card>

      <Modal open={!!pay} onClose={() => !busy && setPay(null)} title="الدفع الإلكتروني (محاكاة)" footer={<><Button variant="secondary" disabled={busy} onClick={() => setPay(null)}>إلغاء</Button><Button disabled={busy} onClick={confirm} icon={Lock}>{busy ? "جارٍ المعالجة..." : `ادفع ${pay ? money(pay.amount) : ""}`}</Button></>}>
        {pay && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 p-3 text-sm"><p className="font-bold">{pay.title}</p><p className="text-slate-500">{pay.studentName} • {pay.id}</p></div>
            <Field label="طريقة الدفع"><select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}><option>مدى</option><option>فيزا</option><option>Apple Pay</option></select></Field>
            <Field label="رقم البطاقة"><input className={inputCls} dir="ltr" defaultValue="4242 4242 4242 4242" /></Field>
            <div className="grid grid-cols-2 gap-3"><Field label="تاريخ الانتهاء"><input className={inputCls} dir="ltr" defaultValue="12/28" /></Field><Field label="CVV"><input className={inputCls} dir="ltr" defaultValue="123" /></Field></div>
            <p className="flex items-center gap-2 text-xs text-slate-500"><ShieldCheck size={16} className="text-emerald-600" /> بيانات تجريبية — لن يتم خصم أي مبلغ فعلي.</p>
          </div>
        )}
      </Modal>
    </>
  );
}
