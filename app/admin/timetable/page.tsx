"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import { Button, PageHeader, Tabs, inputCls } from "@/components/ui";
import { TimetableGrid } from "@/components/views";
import { allClasses, teacherScheduleFor, teachers, timetableFor } from "@/lib/data";

export default function TimetablePage() {
  const [mode, setMode] = useState("class");
  const [cls, setCls] = useState("الخامس الابتدائي");
  const [teacherId, setTeacherId] = useState(teachers[0].id);
  const teacher = teachers.find((t) => t.id === teacherId)!;

  return (
    <>
      <PageHeader title="جداول الحصص" subtitle="جدول أسبوعي لكل فصل ولكل معلم، يظهر تلقائيًا للطلاب والمعلمين وأولياء الأمور" actions={<Button variant="secondary" icon={Printer} onClick={() => window.print()}>طباعة</Button>} />
      <Tabs tabs={[{ key: "class", label: "حسب الفصل" }, { key: "teacher", label: "حسب المعلم" }]} value={mode} onChange={setMode} />
      <div className="no-print mb-4 max-w-xs">
        {mode === "class" ? (
          <select value={cls} onChange={(e) => setCls(e.target.value)} className={inputCls}>{allClasses.slice(3).map((c) => <option key={c}>{c}</option>)}</select>
        ) : (
          <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className={inputCls}>{teachers.map((t) => <option key={t.id} value={t.id}>{t.name} — {t.subject}</option>)}</select>
        )}
      </div>
      <TimetableGrid grid={mode === "class" ? timetableFor(cls) : teacherScheduleFor(teacher)} caption={mode === "class" ? `جدول ${cls}` : `جدول ${teacher.name} (${teacher.subject})`} />
    </>
  );
}
