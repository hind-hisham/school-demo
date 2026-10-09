"use client";

import { PageHeader } from "@/components/ui";
import { TimetableGrid } from "@/components/views";
import { demo, timetableFor } from "@/lib/data";

export default function StudentSchedule() {
  return (
    <>
      <PageHeader title="جدول الحصص" subtitle={demo.student.className} />
      <TimetableGrid grid={timetableFor(demo.student.className)} />
    </>
  );
}
