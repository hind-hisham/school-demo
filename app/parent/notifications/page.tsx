"use client";

import { PageHeader } from "@/components/ui";
import { NoticesList } from "@/components/views";
import { notices } from "@/lib/data";

export default function ParentNotifications() {
  return (
    <>
      <PageHeader title="الإشعارات" subtitle="تصلك أيضًا عبر واتساب حسب إعدادات المدرسة" />
      <NoticesList items={notices} />
    </>
  );
}
