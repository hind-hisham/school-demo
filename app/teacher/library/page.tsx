"use client";

import { PageHeader } from "@/components/ui";
import { LibraryView } from "@/components/views";

export default function TeacherLibrary() {
  return (
    <>
      <PageHeader title="المكتبة الرقمية" subtitle="ارفع موادك التعليمية لتصل إلى طلاب المرحلة والمادة المعنية" />
      <LibraryView canUpload />
    </>
  );
}
