"use client";

import { useState } from "react";
import { Plus, ShieldCheck } from "lucide-react";
import { Avatar, Badge, Button, Card, DataTable, Field, Modal, PageHeader, Tabs, Toggle, cx, inputCls, statusTone } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { accounts as seed, defaultPerms, permissionModules, permissionRoles, type Account } from "@/lib/data";

export default function UsersPage() {
  const toast = useToast();
  const [tab, setTab] = useState("accounts");
  const [rows, setRows] = useState<Account[]>(seed);
  const [role, setRole] = useState("الكل");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "معلم" });
  const [perms, setPerms] = useState(defaultPerms);

  const filtered = rows.filter((r) => role === "الكل" || r.role === role);

  const toggleStatus = (id: string) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, status: r.status === "مفعّل" ? "معطّل" : "مفعّل" } : r)));
    toast("تم تحديث حالة الحساب");
  };

  const add = () => {
    if (!form.name.trim()) return;
    setRows([{ id: `U-${rows.length + 100}`, name: form.name, role: form.role as Account["role"], email: form.email || "new@alnoor-demo.example", status: "قيد التفعيل", lastLogin: "—" }, ...rows]);
    setOpen(false);
    setForm({ name: "", email: "", role: "معلم" });
    toast("تم إنشاء الحساب وإرسال رابط التفعيل (تجريبي)");
  };

  const setPerm = (mod: string, idx: number) => {
    if (idx === 0) return; // صلاحيات الإدارة ثابتة
    setPerms({ ...perms, [mod]: perms[mod].map((v, i) => (i === idx ? !v : v)) });
  };

  return (
    <>
      <PageHeader title="المستخدمون والصلاحيات" subtitle="إدارة الحسابات وتحديد ما يراه كل دور داخل النظام" actions={<Button icon={Plus} onClick={() => setOpen(true)}>مستخدم جديد</Button>} />
      <Tabs tabs={[{ key: "accounts", label: "الحسابات" }, { key: "perms", label: "مصفوفة الصلاحيات" }]} value={tab} onChange={setTab} />

      {tab === "accounts" ? (
        <Card padded={false}>
          <DataTable
            rows={filtered}
            searchKeys={["name", "email"]}
            toolbar={
              <select value={role} onChange={(e) => setRole(e.target.value)} className={cx(inputCls, "w-auto")}>
                <option>الكل</option>
                {permissionRoles.map((r) => <option key={r}>{r}</option>)}
              </select>
            }
            columns={[
              { key: "name", header: "المستخدم", render: (r) => <div className="flex items-center gap-3"><Avatar name={r.name} /><div><p className="font-bold">{r.name}</p><p className="text-xs text-slate-400">{r.email}</p></div></div> },
              { key: "role", header: "الدور", render: (r) => <Badge tone="brand">{r.role}</Badge> },
              { key: "status", header: "الحالة", render: (r) => <Badge tone={statusTone(r.status)}>{r.status}</Badge> },
              { key: "lastLogin", header: "آخر دخول" },
              { key: "act", header: "تفعيل", render: (r) => <Toggle checked={r.status === "مفعّل"} onChange={() => toggleStatus(r.id)} label="تفعيل الحساب" /> },
            ]}
          />
        </Card>
      ) : (
        <Card title={<span className="flex items-center gap-2"><ShieldCheck size={18} className="text-brand" /> الصلاحيات حسب الدور</span>} padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs text-slate-500">
                  <th className="px-4 py-3 text-start">القسم</th>
                  {permissionRoles.map((r) => <th key={r} className="px-4 py-3 text-center">{r}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionModules.map((m) => (
                  <tr key={m}>
                    <td className="px-4 py-3 font-semibold">{m}</td>
                    {perms[m].map((v, i) => (
                      <td key={i} className="px-4 py-3 text-center">
                        <input type="checkbox" checked={v} disabled={i === 0} onChange={() => setPerm(m, i)} className="h-4 w-4 accent-[rgb(var(--brand))]" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-slate-100 p-4">
            <p className="text-xs text-slate-500">صلاحيات الإدارة ثابتة. يمكن إنشاء أدوار مخصصة (مثل: محاسب، مشرف) في النسخة الفعلية.</p>
            <Button onClick={() => toast("تم حفظ الصلاحيات (تجريبي)")}>حفظ التغييرات</Button>
          </div>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="إضافة مستخدم" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={add}>إنشاء الحساب</Button></>}>
        <div className="space-y-4">
          <Field label="الاسم الكامل"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
          <Field label="البريد الإلكتروني"><input className={inputCls} dir="ltr" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="name@school.com" /></Field>
          <Field label="الدور"><select className={inputCls} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>{permissionRoles.map((r) => <option key={r}>{r}</option>)}</select></Field>
        </div>
      </Modal>
    </>
  );
}
