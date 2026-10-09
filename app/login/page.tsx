"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, KeyRound, School } from "lucide-react";
import { Button, Field, cx, inputCls } from "@/components/ui";
import { useTheme } from "@/components/ThemeProvider";
import { roleMeta, roles, type Role } from "@/lib/nav";

const creds: Record<Role, { user: string; pass: string }> = {
  admin: { user: "admin@alnoor-demo.example", pass: "demo1234" },
  teacher: { user: "teacher1@alnoor-demo.example", pass: "demo1234" },
  parent: { user: "parent1@example.com", pass: "demo1234" },
  student: { user: "s-1001@student.alnoor-demo.example", pass: "demo1234" },
};

export default function Login() {
  const router = useRouter();
  const { schoolName } = useTheme();
  const [role, setRole] = useState<Role>("admin");

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden bg-gradient-to-bl from-brand to-brand-dark p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3"><div className="grid h-12 w-12 place-items-center rounded-xl bg-white/15"><School size={24} /></div><p className="text-xl font-extrabold">{schoolName}</p></div>
        <div>
          <h1 className="text-4xl font-extrabold leading-tight">نظام إدارة المدرسة الذكي</h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-white/85">إدارة الطلاب والمعلمين والنتائج والرسوم والحصص الأونلاين من منصة واحدة، بواجهة عربية كاملة.</p>
        </div>
        <p className="text-sm text-white/60">نسخة تجريبية — جميع البيانات وهمية</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800"><ArrowLeft size={14} className="rotate-180" /> العودة للموقع</Link>
          <h2 className="mb-1 text-3xl font-extrabold">تسجيل الدخول</h2>
          <p className="mb-6 text-sm text-slate-500">اختر نوع الحساب وسنعبّئ بيانات الدخول التجريبية لك.</p>

          <div className="mb-6 grid grid-cols-4 gap-2">
            {roles.map((r) => (
              <button key={r} onClick={() => setRole(r)} className={cx("rounded-xl border px-2 py-3 text-sm font-bold transition", role === r ? "border-brand bg-brand/10 text-brand" : "border-slate-200 text-slate-600 hover:bg-slate-50")}>{roleMeta[r].label}</button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); router.push(roleMeta[role].base); }} className="space-y-4">
            <Field label="البريد الإلكتروني"><input dir="ltr" className={inputCls} value={creds[role].user} readOnly /></Field>
            <Field label="كلمة المرور"><input dir="ltr" type="password" className={inputCls} value={creds[role].pass} readOnly /></Field>
            <Button type="submit" icon={KeyRound} className="w-full">دخول</Button>
          </form>
          <p className="mt-6 rounded-xl bg-amber-50 p-3 text-xs leading-6 text-amber-800">هذه نسخة عرض: لا يوجد تحقق فعلي من الحسابات. في النسخة الحقيقية يتم تسجيل الدخول بحسابات مشفّرة مع تحقق بخطوتين.</p>
        </div>
      </div>
    </div>
  );
}
