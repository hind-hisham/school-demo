"use client";

import { PageHeader } from "@/components/ui";
import { LibraryView } from "@/components/views";

export default function LibraryPage() {
  return (
    <>
      <PageHeader title="المكتبة الرقمية" subtitle="كتب ومراجع وفيديوهات وروابط مصنّفة حسب المرحلة والمادة" />
      <LibraryView canUpload />
    </>
  );
}
