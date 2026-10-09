"use client";

import { PageHeader } from "@/components/ui";
import { LibraryView } from "@/components/views";
import { demo } from "@/lib/data";

export default function StudentLibrary() {
  return (
    <>
      <PageHeader title="المكتبة الرقمية" subtitle={`مواد مرحلة ${demo.student.stage}`} />
      <LibraryView lockStage={demo.student.stage} />
    </>
  );
}
