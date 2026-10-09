"use client";

import { PageHeader } from "@/components/ui";
import { TimetableGrid } from "@/components/views";
import { demo, teacherScheduleFor } from "@/lib/data";

export default function TeacherSchedule() {
  return (
    <>
      <PageHeader title="جدولي الأسبوعي" subtitle="يُحدَّث تلقائيًا عند أي تعديل من الإدارة" />
      <TimetableGrid grid={teacherScheduleFor(demo.teacher)} />
    </>
  );
}
