"use client";

import { useState } from "react";
import { CheckCircle2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Button, Field, inputCls } from "@/components/ui";
import { school } from "@/lib/data";

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 lg:px-8">
      <h1 className="mb-2 text-4xl font-extrabold">تواصل معنا</h1>
      <p className="mb-10 text-slate-500">يسعدنا استقبال استفساراتكم وطلبات التسجيل.</p>
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          {[
            { i: Phone, t: "الهاتف", v: school.phone },
            { i: Mail, t: "البريد الإلكتروني", v: school.email },
            { i: MapPin, t: "العنوان", v: school.address },
          ].map((x) => (
            <div key={x.t} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand"><x.i size={22} /></div>
              <div><p className="text-xs text-slate-500">{x.t}</p><p className="font-bold">{x.v}</p></div>
            </div>
          ))}
          <div className="grid h-56 place-items-center rounded-2xl border border-slate-100 bg-gradient-to-br from-slate-100 to-slate-200 text-sm text-slate-500">
            <div className="text-center"><MapPin className="mx-auto mb-2 text-brand" size={32} />خريطة الموقع (تُدمج خريطة Google في النسخة الفعلية)</div>
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card lg:col-span-3">
          {sent ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 text-center">
              <CheckCircle2 size={48} className="text-emerald-500" />
              <h2 className="text-xl font-extrabold">وصلت رسالتك</h2>
              <p className="text-sm text-slate-500">(محاكاة) سيتواصل معك فريق المدرسة خلال يوم عمل.</p>
              <Button variant="secondary" onClick={() => setSent(false)}>إرسال رسالة أخرى</Button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="الاسم"><input required className={inputCls} /></Field>
                <Field label="رقم الجوال"><input required dir="ltr" className={inputCls} /></Field>
              </div>
              <Field label="البريد الإلكتروني"><input type="email" dir="ltr" className={inputCls} /></Field>
              <Field label="الموضوع"><select className={inputCls}><option>استفسار عام</option><option>التسجيل في المدرسة</option><option>الكورسات الصيفية</option><option>الحصول على النظام الإلكتروني</option></select></Field>
              <Field label="الرسالة"><textarea required rows={5} className={inputCls} /></Field>
              <Button type="submit" icon={Send}>إرسال</Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
