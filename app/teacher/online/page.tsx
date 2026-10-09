"use client";

import { PageHeader } from "@/components/ui";
import { OnlineView } from "@/components/views";
import { demo } from "@/lib/data";

export default function TeacherOnline() {
  return (
    <>
      <PageHeader title="الحصص الأونلاين" subtitle="أنشئ حصصك وشارك الرابط، وراجع سجل الحصص والتسجيلات" />
      <OnlineView mode="teacher" classes={demo.teacher.classes} />
    </>
  );
}
