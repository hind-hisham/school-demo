"use client";

import { Link2 } from "lucide-react";
import { Badge, Card, PageHeader } from "@/components/ui";
import { OnlineView } from "@/components/views";

export default function OnlinePage() {
  return (
    <>
      <PageHeader title="الحصص الأونلاين" subtitle="تكامل مع Zoom وGoogle Meet، وروابط مباشرة ضمن الجدول مع تنبيهات قبل البدء" />
      <Card className="mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-700"><Link2 size={18} className="text-brand" /> حالة الربط</div>
          <Badge tone="green">Zoom — متصل</Badge>
          <Badge tone="green">Google Meet — متصل</Badge>
          <span className="text-xs text-slate-500">يتم إنشاء روابط الحصص وتسجيلها تلقائيًا من حسابات المدرسة المربوطة.</span>
        </div>
      </Card>
      <OnlineView mode="admin" />
    </>
  );
}
