"use client";

import { useState } from "react";
import { Check, Lock, Upload } from "lucide-react";
import { Button, Card, Field, PageHeader, Tabs, Toggle, cx, inputCls } from "@/components/ui";
import { palettes, useTheme } from "@/components/ThemeProvider";
import { useToast } from "@/components/Toast";
import { school } from "@/lib/data";

export default function SettingsPage() {
  const toast = useToast();
  const { brand, setBrand, schoolName, setSchoolName } = useTheme();
  const [tab, setTab] = useState("general");
  const [hijri, setHijri] = useState(true);
  const [security, setSecurity] = useState({ twoFactor: true, audit: true, backup: true });

  return (
    <>
      <PageHeader title="الإعدادات والهوية" subtitle="خصّص النظام ليناسب هوية مدرستك: الاسم، الشعار، الألوان، والتقويم" />
      <Tabs tabs={[{ key: "general", label: "عام" }, { key: "brand", label: "الهوية البصرية" }, { key: "security", label: "الأمان والخصوصية" }]} value={tab} onChange={setTab} />

      {tab === "general" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="بيانات المدرسة">
            <div className="space-y-4">
              <Field label="اسم المدرسة"><input className={inputCls} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} /></Field>
              <Field label="البريد الإلكتروني"><input className={inputCls} dir="ltr" defaultValue={school.email} /></Field>
              <Field label="رقم التواصل"><input className={inputCls} dir="ltr" defaultValue={school.phone} /></Field>
              <Field label="العنوان"><input className={inputCls} defaultValue={school.address} /></Field>
              <Button onClick={() => toast("تم حفظ الإعدادات (تجريبي)")}>حفظ</Button>
            </div>
          </Card>
          <Card title="اللغة والتقويم">
            <div className="space-y-4">
              <Field label="لغة الواجهة"><select className={inputCls}><option>العربية (RTL)</option><option>English (LTR) — متاحة في النسخة الفعلية</option></select></Field>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3"><div><p className="text-sm font-bold">التقويم الهجري كأساس</p><p className="text-xs text-slate-500">مع إمكانية عرض الميلادي بجانبه</p></div><Toggle checked={hijri} onChange={setHijri} /></div>
              <Field label="العام الدراسي الحالي"><select className={inputCls}><option>1448 هـ</option><option>1447 هـ (مؤرشف)</option></select></Field>
            </div>
          </Card>
        </div>
      )}

      {tab === "brand" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="اللون الأساسي">
            <p className="mb-4 text-sm text-slate-500">اختر لونًا وسيتغير النظام بالكامل فورًا — جرّب بنفسك.</p>
            <div className="grid grid-cols-3 gap-3">
              {palettes.map((p) => (
                <button key={p.hex} onClick={() => setBrand(p.hex)} className={cx("flex items-center gap-2 rounded-xl border p-3 text-sm font-semibold transition", brand === p.hex ? "border-brand bg-brand/10" : "border-slate-200 hover:bg-slate-50")}>
                  <span className="grid h-7 w-7 place-items-center rounded-full text-white" style={{ background: p.hex }}>{brand === p.hex && <Check size={16} />}</span>
                  {p.name}
                </button>
              ))}
            </div>
            <div className="mt-5"><Field label="أو لون مخصص"><input type="color" value={brand} onChange={(e) => setBrand(e.target.value)} className="h-10 w-20 cursor-pointer rounded-lg border border-slate-200" /></Field></div>
          </Card>
          <Card title="الشعار والمعاينة">
            <div className="mb-5 rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-400"><Upload className="mx-auto mb-2" size={24} />رفع شعار المدرسة (PNG / SVG)</div>
            <div className="rounded-2xl border border-slate-100 p-4">
              <div className="mb-3 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-lg font-extrabold text-white">{schoolName.charAt(0)}</div><p className="font-extrabold">{schoolName}</p></div>
              <div className="flex flex-wrap gap-2"><Button size="sm">زر رئيسي</Button><Button size="sm" variant="secondary">زر ثانوي</Button><span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">شارة</span></div>
            </div>
          </Card>
        </div>
      )}

      {tab === "security" && (
        <Card title={<span className="flex items-center gap-2"><Lock size={18} className="text-brand" /> إعدادات الأمان</span>}>
          <ul className="divide-y divide-slate-100">
            {([["twoFactor", "التحقق بخطوتين للإدارة والمعلمين", "رمز إضافي عند تسجيل الدخول"], ["audit", "سجل التدقيق", "تسجيل من اطّلع على بيانات الطلاب وماذا عدّل"], ["backup", "نسخ احتياطي يومي", "نسخة مشفّرة من كل البيانات"]] as const).map(([k, t, d]) => (
              <li key={k} className="flex items-center justify-between py-4"><div><p className="font-bold">{t}</p><p className="text-xs text-slate-500">{d}</p></div><Toggle checked={security[k]} onChange={(v) => setSecurity({ ...security, [k]: v })} /></li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
