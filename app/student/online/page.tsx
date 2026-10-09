"use client";

import { PageHeader } from "@/components/ui";
import { OnlineView } from "@/components/views";
import { demo } from "@/lib/data";

export default function StudentOnline() {
  return (
    <>
      <PageHeader title="الحصص الأونلاين" subtitle="انضم لحصصك بضغطة واحدة وراجع التسجيلات السابقة" />
      <OnlineView mode="student" classes={[demo.student.className]} />
    </>
  );
}
