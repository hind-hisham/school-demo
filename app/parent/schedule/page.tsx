"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui";
import { ChildPicker, TimetableGrid } from "@/components/views";
import { demo, studentById, timetableFor } from "@/lib/data";

export default function ParentSchedule() {
  const kids = demo.parent.children.map((id) => studentById(id)!);
  const [kidId, setKidId] = useState(kids[0].id);
  const kid = kids.find((k) => k.id === kidId)!;
  return (
    <>
      <PageHeader title="جدول الحصص" subtitle="الجدول الأسبوعي لأبنائك" />
      <ChildPicker kids={kids.map((k) => ({ id: k.id, name: k.name, className: `${k.className} (${k.section})` }))} value={kidId} onChange={setKidId} />
      <TimetableGrid grid={timetableFor(kid.className)} caption={`جدول ${kid.className}`} />
    </>
  );
}
