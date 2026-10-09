"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";
import { Badge, Button, Card, Field, PageHeader, Tabs, Toggle, inputCls } from "@/components/ui";
import { NoticesList } from "@/components/views";
import { useToast } from "@/components/Toast";
import { notificationRules, notices as seed, type Notice } from "@/lib/data";

export default function NotificationsPage() {
  const toast = useToast();
  const [tab, setTab] = useState("log");
  const [log, setLog] = useState<Notice[]>(seed);
  const [rules, setRules] = useState(notificationRules);
  const [form, setForm] = useState({ audience: "جميع أولياء الأمور", channel: "الاثنان", title: "", body: "" });

  const send = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    setLog([{ id: `N-${log.length + 1}`, title: form.title, body: form.body, type: "عام", channel: form.channel as Notice["channel"], time: "الآن", read: true }, ...log]);
    setForm({ ...form, title: "", body: "" });
    toast("تم إرسال الإشعار (تجريبي)");
    setTab("log");
  };

  const toggle = (id: string, key: "internal" | "whatsapp") => setRules(rules.map((r) => (r.id === id ? { ...r, [key]: !r[key] } : r)));

  return (
    <>
      <PageHeader title="نظام الإشعارات" subtitle="إشعارات داخلية وتنبيهات واتساب قابلة للتخصيص حسب الحدث والمستخدم" />
      <Tabs tabs={[{ key: "log", label: "سجل الإشعارات" }, { key: "rules", label: "قواعد الإرسال التلقائي" }, { key: "send", label: "إرسال إشعار" }]} value={tab} onChange={setTab} />

      {tab === "log" && <NoticesList items={log} />}

      {tab === "rules" && (
        <Card padded={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-4 py-3 text-start">الحدث</th><th className="px-4 py-3 text-start">المستلمون</th><th className="px-4 py-3 text-center">داخلي</th><th className="px-4 py-3 text-center">واتساب</th></tr></thead>
              <tbody className="divide-y divide-slate-100">
                {rules.map((r) => (
                  <tr key={r.id}>
                    <td className="px-4 py-3 font-semibold">{r.event}</td>
                    <td className="px-4 py-3"><Badge>{r.audience}</Badge></td>
                    <td className="px-4 py-3"><div className="flex justify-center"><Toggle checked={r.internal} onChange={() => toggle(r.id, "internal")} /></div></td>
                    <td className="px-4 py-3"><div className="flex justify-center"><Toggle checked={r.whatsapp} onChange={() => toggle(r.id, "whatsapp")} /></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end border-t border-slate-100 p-4"><Button onClick={() => toast("تم حفظ القواعد (تجريبي)")}>حفظ</Button></div>
        </Card>
      )}

      {tab === "send" && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="إشعار جديد">
            <div className="space-y-4">
              <Field label="المستلمون"><select className={inputCls} value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}><option>جميع أولياء الأمور</option><option>جميع المعلمين</option><option>طلاب الثانوي</option><option>الخامس الابتدائي (أ)</option></select></Field>
              <Field label="القناة"><select className={inputCls} value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })}><option value="داخلي">داخلي فقط</option><option value="واتساب">واتساب فقط</option><option value="الاثنان">داخلي + واتساب</option></select></Field>
              <Field label="العنوان"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
              <Field label="نص الرسالة"><textarea rows={4} className={inputCls} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
              <Button icon={Send} onClick={send}>إرسال</Button>
            </div>
          </Card>
          <Card title={<span className="flex items-center gap-2"><MessageCircle size={18} className="text-emerald-600" /> معاينة واتساب</span>}>
            <div className="rounded-2xl bg-[#e7ded3] p-4">
              <div className="max-w-[85%] rounded-xl rounded-ss-sm bg-white p-3 text-sm shadow">
                <p className="font-bold text-slate-800">{form.title || "عنوان الإشعار"}</p>
                <p className="mt-1 whitespace-pre-line text-slate-600">{form.body || "نص الرسالة سيظهر هنا بنفس الشكل الذي يصل به إلى أولياء الأمور."}</p>
                <p className="mt-2 text-end text-[10px] text-slate-400">مدارس النور النموذجية • الآن</p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
