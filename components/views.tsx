"use client";

// مكوّنات عرض مشتركة بين أكثر من بوابة (المكتبة، الحصص الأونلاين، الجداول، الإشعارات)

import { Fragment, useMemo, useState } from "react";
import { Bell, BellRing, CheckCircle2, Download, ExternalLink, FileText, Link2, MessageCircle, PlayCircle, Plus, Upload, Video } from "lucide-react";
import { Badge, Button, Card, EmptyState, Field, Modal, Tabs, cx, inputCls, statusTone } from "./ui";
import { useToast } from "./Toast";
import {
  allClasses, library, periods, days, sessions, stages, subjects, teachers,
  type Cell, type LibItem, type Notice, type Session,
} from "@/lib/data";

// ---------------------------------------------------------------- الجدول
export function TimetableGrid({ grid, caption }: { grid: Cell[][]; caption?: string }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-card">
      <table className="w-full min-w-[720px] text-sm">
        {caption && <caption className="p-4 text-start text-sm font-bold text-slate-700">{caption}</caption>}
        <thead>
          <tr className="bg-slate-50 text-xs text-slate-500">
            <th className="w-28 px-3 py-3 text-start">الحصة</th>
            {days.map((d) => (
              <th key={d} className="px-3 py-3 text-start">{d}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grid.map((row, p) => (
            <Fragment key={p}>
              <tr className="border-t border-slate-100">
                <td className="px-3 py-3">
                  <p className="font-bold text-slate-800">الحصة {periods[p].n}</p>
                  <p className="text-xs text-slate-400">{periods[p].time}</p>
                </td>
                {row.map((cell, d) => (
                  <td key={d} className="px-2 py-2">
                    {cell ? (
                      <div className="rounded-lg bg-brand/10 px-3 py-2">
                        <p className="font-bold text-brand">{cell.title}</p>
                        {cell.sub && <p className="text-xs text-slate-500">{cell.sub}</p>}
                      </div>
                    ) : (
                      <div className="px-3 py-2 text-xs text-slate-300">—</div>
                    )}
                  </td>
                ))}
              </tr>
              {p === 2 && (
                <tr className="bg-amber-50/60">
                  <td colSpan={6} className="px-3 py-1.5 text-center text-xs font-semibold text-amber-700">استراحة (09:45 - 10:15)</td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---------------------------------------------------------------- المكتبة
const typeIcon = { PDF: FileText, فيديو: Video, رابط: Link2 } as const;

export function LibraryView({ canUpload = false, lockStage }: { canUpload?: boolean; lockStage?: string }) {
  const toast = useToast();
  const [items, setItems] = useState<LibItem[]>(library);
  const [stage, setStage] = useState(lockStage ?? "الكل");
  const [subject, setSubject] = useState("الكل");
  const [type, setType] = useState("الكل");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", stage: "ابتدائي", subject: subjects[0], type: "PDF" });

  const filtered = useMemo(
    () => items.filter((i) => (stage === "الكل" || i.stage === stage) && (subject === "الكل" || i.subject === subject) && (type === "الكل" || i.type === type)),
    [items, stage, subject, type]
  );

  const add = () => {
    if (!form.title.trim()) return;
    setItems([{ id: `L-${items.length + 1}`, title: form.title, type: form.type as LibItem["type"], stage: form.stage, subject: form.subject, size: form.type === "رابط" ? "—" : "2.0 MB", author: "أنت (تجريبي)", downloads: 0 }, ...items]);
    setOpen(false);
    setForm({ ...form, title: "" });
    toast("تمت إضافة المادة إلى المكتبة (تجريبي)");
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {!lockStage && (
          <select value={stage} onChange={(e) => setStage(e.target.value)} className={cx(inputCls, "w-auto")}>
            <option>الكل</option>
            {stages.map((s) => <option key={s.id}>{s.name}</option>)}
          </select>
        )}
        <select value={subject} onChange={(e) => setSubject(e.target.value)} className={cx(inputCls, "w-auto")}>
          <option>الكل</option>
          {subjects.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)} className={cx(inputCls, "w-auto")}>
          <option>الكل</option>
          <option>PDF</option>
          <option>فيديو</option>
          <option>رابط</option>
        </select>
        {canUpload && <Button icon={Upload} onClick={() => setOpen(true)} className="ms-auto">رفع مادة جديدة</Button>}
      </div>

      {filtered.length === 0 ? (
        <Card><EmptyState text="لا توجد مواد مطابقة" /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((i) => {
            const Icon = typeIcon[i.type];
            return (
              <div key={i.id} className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
                <div className="mb-3 flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><Icon size={22} /></div>
                  <div className="min-w-0">
                    <h4 className="font-bold leading-snug text-slate-800">{i.title}</h4>
                    <p className="mt-0.5 text-xs text-slate-500">{i.author}</p>
                  </div>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  <Badge tone="brand">{i.stage}</Badge>
                  <Badge tone="blue">{i.subject}</Badge>
                  <Badge>{i.type} • {i.size}</Badge>
                </div>
                <div className="mt-auto flex items-center gap-2">
                  <Button size="sm" icon={i.type === "فيديو" ? PlayCircle : ExternalLink} onClick={() => toast("فتح المادة للقراءة المباشرة (تجريبي)")}>
                    {i.type === "فيديو" ? "مشاهدة" : "قراءة"}
                  </Button>
                  {i.type !== "رابط" && <Button size="sm" variant="secondary" icon={Download} onClick={() => toast("بدأ التحميل (تجريبي)")}>تحميل</Button>}
                  <span className="ms-auto text-xs text-slate-400">{i.downloads} مشاهدة</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="رفع مادة إلى المكتبة" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={add}>إضافة</Button></>}>
        <div className="space-y-4">
          <Field label="عنوان المادة"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: ملخص الوحدة الثالثة" /></Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="المرحلة"><select className={inputCls} value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>{stages.map((s) => <option key={s.id}>{s.name}</option>)}</select></Field>
            <Field label="المادة"><select className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{subjects.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="النوع"><select className={inputCls} value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}><option>PDF</option><option>فيديو</option><option>رابط</option></select></Field>
          </div>
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
            <Upload className="mx-auto mb-2" size={24} />
            اسحب الملف هنا أو اضغط للاختيار (محاكاة)
          </div>
        </div>
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------- الحصص الأونلاين
export function OnlineView({ mode, classes }: { mode: "admin" | "teacher" | "student" | "parent"; classes?: string[] }) {
  const toast = useToast();
  const [list, setList] = useState<Session[]>(sessions);
  const [tab, setTab] = useState("upcoming");
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ title: "", className: classes?.[0] ?? allClasses[5], subject: subjects[0], platform: "Zoom", date: "1448/04/28", time: "05:00 م" });

  const visible = list.filter((s) => !classes || classes.includes(s.className));
  const upcoming = visible.filter((s) => s.status !== "منتهية");
  const past = visible.filter((s) => s.status === "منتهية");
  const canCreate = mode === "admin" || mode === "teacher";

  const create = () => {
    if (!form.title.trim()) return;
    setList([
      { id: `O-${list.length + 1}`, title: form.title, teacher: teachers[0].name, subject: form.subject, className: form.className, platform: form.platform as Session["platform"], date: form.date, time: form.time, status: "قادمة", recorded: false },
      ...list,
    ]);
    setOpen(false);
    setForm({ ...form, title: "" });
    toast("تم إنشاء الحصة وإرسال التنبيهات (تجريبي)");
  };

  const card = (s: Session) => (
    <div key={s.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-card">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-slate-800">{s.title}</h4>
          <p className="mt-0.5 text-xs text-slate-500">{s.subject} • {s.teacher}</p>
        </div>
        <Badge tone={statusTone(s.status)}>{s.status === "مباشرة الآن" && <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />}{s.status}</Badge>
      </div>
      <div className="mb-4 flex flex-wrap gap-2 text-xs">
        <Badge tone="brand">{s.className}</Badge>
        <Badge tone={s.platform === "Zoom" ? "blue" : "green"}>{s.platform}</Badge>
        <Badge>{s.date} • {s.time}</Badge>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {s.status === "مباشرة الآن" && <Button size="sm" icon={Video} onClick={() => toast(`الانضمام إلى ${s.platform} (تجريبي)`)}>{mode === "teacher" || mode === "admin" ? "بدء/متابعة الحصة" : "انضم الآن"}</Button>}
        {s.status === "قادمة" && (
          <>
            <Button size="sm" variant="secondary" icon={Link2} onClick={() => toast("تم نسخ رابط الحصة (تجريبي)")}>نسخ الرابط</Button>
            <Button size="sm" variant={reminders[s.id] ? "primary" : "ghost"} icon={reminders[s.id] ? BellRing : Bell} onClick={() => { setReminders({ ...reminders, [s.id]: !reminders[s.id] }); toast(reminders[s.id] ? "تم إلغاء التنبيه" : "سيصلك تنبيه قبل البدء بـ 15 دقيقة"); }}>
              {reminders[s.id] ? "التنبيه مفعّل" : "ذكّرني"}
            </Button>
          </>
        )}
        {s.status === "منتهية" && (s.recorded ? <Button size="sm" variant="secondary" icon={PlayCircle} onClick={() => toast("تشغيل التسجيل (تجريبي)")}>مشاهدة التسجيل</Button> : <span className="text-xs text-slate-400">لا يوجد تسجيل</span>)}
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-2 flex flex-wrap items-center gap-3">
        <div className="min-w-0 flex-1"><Tabs tabs={[{ key: "upcoming", label: `الحصص القادمة (${upcoming.length})` }, { key: "past", label: `سجل الحصص السابقة (${past.length})` }]} value={tab} onChange={setTab} /></div>
        {canCreate && <Button icon={Plus} onClick={() => setOpen(true)} className="mb-5">إنشاء حصة</Button>}
      </div>
      {(tab === "upcoming" ? upcoming : past).length === 0 ? (
        <Card><EmptyState text="لا توجد حصص" /></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{(tab === "upcoming" ? upcoming : past).map(card)}</div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="إنشاء حصة أونلاين" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={create}>إنشاء وإرسال التنبيه</Button></>}>
        <div className="space-y-4">
          <Field label="عنوان الحصة"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: مراجعة الوحدة الرابعة" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="الفصل"><select className={inputCls} value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>{(classes ?? allClasses.slice(3)).map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="المادة"><select className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{subjects.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="المنصة"><select className={inputCls} value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}><option>Zoom</option><option>Google Meet</option></select></Field>
            <Field label="الوقت"><input className={inputCls} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} /></Field>
          </div>
          <p className="rounded-lg bg-slate-50 p-3 text-xs text-slate-500">في النظام الفعلي يتم إنشاء الرابط تلقائيًا عبر حساب {form.platform} المربوط بالمدرسة.</p>
        </div>
      </Modal>
    </>
  );
}

// ---------------------------------------------------------------- الإشعارات
const noticeTone: Record<Notice["type"], "blue" | "green" | "amber" | "violet" | "red" | "gray"> = {
  نتيجة: "green", حضور: "red", فاتورة: "amber", حصة: "blue", امتحان: "violet", عام: "gray",
};

export function NoticesList({ items }: { items: Notice[] }) {
  const [read, setRead] = useState<Record<string, boolean>>({});
  return (
    <div className="space-y-3">
      {items.map((n) => {
        const isRead = n.read || read[n.id];
        return (
          <button key={n.id} onClick={() => setRead({ ...read, [n.id]: true })} className={cx("flex w-full items-start gap-4 rounded-2xl border p-4 text-start shadow-card transition", isRead ? "border-slate-100 bg-white" : "border-brand/30 bg-brand/5")}>
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-brand shadow-sm">
              {n.channel === "واتساب" ? <MessageCircle size={20} /> : isRead ? <CheckCircle2 size={20} /> : <Bell size={20} />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="font-bold text-slate-800">{n.title}</h4>
                <Badge tone={noticeTone[n.type]}>{n.type}</Badge>
                <Badge>{n.channel === "الاثنان" ? "داخلي + واتساب" : n.channel}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-600">{n.body}</p>
              <p className="mt-1 text-xs text-slate-400">{n.time}</p>
            </div>
            {!isRead && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-brand" />}
          </button>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------- اختيار الابن
export function ChildPicker({ kids, value, onChange }: { kids: { id: string; name: string; className: string }[]; value: string; onChange: (id: string) => void }) {
  return (
    <div className="mb-6 flex flex-wrap gap-3">
      {kids.map((c) => (
        <button key={c.id} onClick={() => onChange(c.id)} className={cx("rounded-2xl border px-4 py-3 text-start transition", value === c.id ? "border-brand bg-brand/10 shadow-sm" : "border-slate-200 bg-white hover:bg-slate-50")}>
          <p className="font-bold text-slate-800">{c.name}</p>
          <p className="text-xs text-slate-500">{c.className}</p>
        </button>
      ))}
    </div>
  );
}
