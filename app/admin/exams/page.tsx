"use client";

import { useState } from "react";
import { Plus, Printer } from "lucide-react";
import { BarsChart, DonutChart } from "@/components/charts";
import { Badge, Button, Card, DataTable, Field, Modal, PageHeader, Tabs, cx, gradeLabelTone, inputCls } from "@/components/ui";
import { useToast } from "@/components/Toast";
import { allClasses, classAverage, exams as seed, gradeLabel, gradesFor, parentById, students, subjects, studentsOfClass, type Exam } from "@/lib/data";

export default function ExamsPage() {
  const toast = useToast();
  const [tab, setTab] = useState("schedule");
  const [rows, setRows] = useState<Exam[]>(seed);
  const [cls, setCls] = useState("الكل");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", className: "الخامس الابتدائي", subject: subjects[0], date: "1448/05/12", time: "08:00 - 09:30", hall: "قاعة 2" });

  // تحليل النتائج
  const [analysisClass, setAnalysisClass] = useState("الخامس الابتدائي");
  const subjAvg = subjects.map((s) => ({ subject: s.replace("اللغة ", "").replace("الدراسات ", "د. "), avg: classAverage(analysisClass, s) }));
  const dist = (() => {
    const totals = studentsOfClass(analysisClass).flatMap((s) => gradesFor(s.id).map((g) => g.total));
    const bucket = (lo: number, hi: number) => totals.filter((t) => t >= lo && t < hi).length;
    return [
      { name: "ممتاز (90+)", value: bucket(90, 101) },
      { name: "جيد جدًا", value: bucket(80, 90) },
      { name: "جيد", value: bucket(70, 80) },
      { name: "أقل من 70", value: bucket(0, 70) },
    ].filter((d) => d.value > 0);
  })();

  // تقرير الطالب
  const [studentId, setStudentId] = useState(students[0].id);
  const rep = students.find((s) => s.id === studentId)!;
  const repGrades = gradesFor(studentId);
  const repTotal = Math.round(repGrades.reduce((a, b) => a + b.total, 0) / repGrades.length);

  const add = () => {
    if (!form.title.trim()) return;
    setRows([{ id: `E-${rows.length + 1}`, title: form.title, type: "نصفي", className: form.className, subject: form.subject, day: "الأحد", date: form.date, time: form.time, hall: form.hall }, ...rows]);
    setOpen(false);
    setForm({ ...form, title: "" });
    toast("تمت إضافة الاختبار وجدولة الإشعارات التلقائية");
  };

  return (
    <>
      <PageHeader title="الامتحانات والنتائج" subtitle="جداول الامتحانات، إدخال الدرجات، وتحليل الأداء" actions={<Button icon={Plus} onClick={() => setOpen(true)}>اختبار جديد</Button>} />
      <Tabs tabs={[{ key: "schedule", label: "جدول الامتحانات" }, { key: "analysis", label: "تحليل الأداء" }, { key: "report", label: "تقرير الطالب" }]} value={tab} onChange={setTab} />

      {tab === "schedule" && (
        <Card padded={false}>
          <DataTable
            rows={rows.filter((r) => cls === "الكل" || r.className === cls)}
            searchKeys={["title", "subject"]}
            toolbar={<select value={cls} onChange={(e) => setCls(e.target.value)} className={cx(inputCls, "w-auto")}><option>الكل</option>{allClasses.slice(3).map((c) => <option key={c}>{c}</option>)}</select>}
            columns={[
              { key: "title", header: "الاختبار", render: (r) => <span className="font-bold">{r.title}</span> },
              { key: "className", header: "الفصل" },
              { key: "type", header: "النوع", render: (r) => <Badge tone={r.type === "نهائي" ? "red" : r.type === "نصفي" ? "violet" : "blue"}>{r.type}</Badge> },
              { key: "date", header: "الموعد", render: (r) => `${r.day} ${r.date}` },
              { key: "time", header: "الوقت" },
              { key: "hall", header: "القاعة" },
            ]}
          />
        </Card>
      )}

      {tab === "analysis" && (
        <>
          <div className="mb-4 max-w-xs"><select value={analysisClass} onChange={(e) => setAnalysisClass(e.target.value)} className={inputCls}>{allClasses.slice(3).map((c) => <option key={c}>{c}</option>)}</select></div>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card title={`متوسط الدرجات حسب المادة — ${analysisClass}`} className="lg:col-span-2"><BarsChart data={subjAvg} xKey="subject" series={[{ key: "avg", name: "المتوسط" }]} domain={[0, 100]} /></Card>
            <Card title="توزيع التقديرات"><DonutChart data={dist} /></Card>
          </div>
        </>
      )}

      {tab === "report" && (
        <Card
          title="تقرير الطالب التفصيلي"
          action={<Button size="sm" variant="secondary" icon={Printer} onClick={() => window.print()}>طباعة</Button>}
        >
          <div className="mb-5 max-w-sm"><select value={studentId} onChange={(e) => setStudentId(e.target.value)} className={inputCls}>{students.filter((s) => s.status === "نشط" && s.stage !== "روضة" && s.stage !== "تمهيدي").map((s) => <option key={s.id} value={s.id}>{s.name} — {s.className}</option>)}</select></div>
          <div className="mb-5 grid gap-3 sm:grid-cols-4">
            {[["الطالب", rep.name], ["الفصل", `${rep.className} (${rep.section})`], ["ولي الأمر", parentById(rep.parentId)?.name ?? ""], ["المعدل العام", `${repTotal}% — ${gradeLabel(repTotal)}`]].map(([k, v]) => (
              <div key={k} className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">{k}</p><p className="font-bold">{v}</p></div>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead><tr className="bg-slate-50 text-xs text-slate-500"><th className="px-3 py-2 text-start">المادة</th><th className="px-3 py-2 text-start">أعمال (20)</th><th className="px-3 py-2 text-start">نصفي (30)</th><th className="px-3 py-2 text-start">نهائي (50)</th><th className="px-3 py-2 text-start">المجموع</th><th className="px-3 py-2 text-start">التقدير</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {repGrades.map((g) => (
                <tr key={g.subject}><td className="px-3 py-2 font-semibold">{g.subject}</td><td className="px-3 py-2">{g.activities}</td><td className="px-3 py-2">{g.midterm}</td><td className="px-3 py-2">{g.final}</td><td className="px-3 py-2 font-bold">{g.total}</td><td className="px-3 py-2"><Badge tone={gradeLabelTone(g.total)}>{gradeLabel(g.total)}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="جدولة اختبار" footer={<><Button variant="secondary" onClick={() => setOpen(false)}>إلغاء</Button><Button onClick={add}>حفظ</Button></>}>
        <div className="space-y-4">
          <Field label="عنوان الاختبار"><input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="مثال: اختبار الوحدة الثالثة" /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="الفصل"><select className={inputCls} value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}>{allClasses.slice(3).map((c) => <option key={c}>{c}</option>)}</select></Field>
            <Field label="المادة"><select className={inputCls} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}>{subjects.map((s) => <option key={s}>{s}</option>)}</select></Field>
            <Field label="التاريخ"><input className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="القاعة"><input className={inputCls} value={form.hall} onChange={(e) => setForm({ ...form, hall: e.target.value })} /></Field>
          </div>
        </div>
      </Modal>
    </>
  );
}
