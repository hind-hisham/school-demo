"use client";

import { PageHeader } from "@/components/ui";
import { OnlineView } from "@/components/views";
import { demo, studentById } from "@/lib/data";

export default function ParentOnline() {
  const classes = Array.from(new Set(demo.parent.children.map((id) => studentById(id)!.className)));
  return (
    <>
      <PageHeader title="الحصص الأونلاين" subtitle="حصص فصول أبنائك مع روابط مباشرة وتنبيهات قبل البدء" />
      <OnlineView mode="parent" classes={classes} />
    </>
  );
}
