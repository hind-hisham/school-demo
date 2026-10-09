"use client";

import { PageHeader } from "@/components/ui";
import { NoticesList } from "@/components/views";
import { notices } from "@/lib/data";

export default function StudentNotifications() {
  return (
    <>
      <PageHeader title="الإشعارات" subtitle="تنبيهات الحصص والاختبارات والنتائج" />
      <NoticesList items={notices.filter((n) => n.type !== "فاتورة")} />
    </>
  );
}
