import {
  BarChart3, Bell, BookOpen, CalendarDays, CheckSquare, ClipboardList, GraduationCap, HeartHandshake,
  LayoutDashboard, Layers, Library, Receipt, Settings, Trophy, Users, UsersRound, Video, Presentation, Wallet,
  type LucideIcon,
} from "lucide-react";

export type Role = "admin" | "teacher" | "parent" | "student";
export type NavItem = { href: string; label: string; icon: LucideIcon };

export const roles: Role[] = ["admin", "teacher", "parent", "student"];

export const roleMeta: Record<Role, { label: string; base: string; desc: string }> = {
  admin: { label: "الإدارة", base: "/admin", desc: "لوحة التحكم المركزية للمدرسة" },
  teacher: { label: "المعلم", base: "/teacher", desc: "الحضور ورصد الدرجات والحصص" },
  parent: { label: "ولي الأمر", base: "/parent", desc: "متابعة الأبناء وسداد الرسوم" },
  student: { label: "الطالب", base: "/student", desc: "النتائج والجدول والمكتبة" },
};

export const navByRole: Record<Role, NavItem[]> = {
  admin: [
    { href: "/admin", label: "لوحة القيادة", icon: LayoutDashboard },
    { href: "/admin/users", label: "المستخدمون والصلاحيات", icon: UsersRound },
    { href: "/admin/structure", label: "المراحل والفصول", icon: Layers },
    { href: "/admin/students", label: "الطلاب", icon: GraduationCap },
    { href: "/admin/teachers", label: "المعلمون", icon: Presentation },
    { href: "/admin/parents", label: "أولياء الأمور", icon: HeartHandshake },
    { href: "/admin/exams", label: "الامتحانات والنتائج", icon: ClipboardList },
    { href: "/admin/timetable", label: "جداول الحصص", icon: CalendarDays },
    { href: "/admin/library", label: "المكتبة الرقمية", icon: Library },
    { href: "/admin/online", label: "الحصص الأونلاين", icon: Video },
    { href: "/admin/finance", label: "الرسوم والمدفوعات", icon: Wallet },
    { href: "/admin/notifications", label: "الإشعارات", icon: Bell },
    { href: "/admin/reports", label: "التقارير والتحليلات", icon: BarChart3 },
    { href: "/admin/settings", label: "الإعدادات والهوية", icon: Settings },
  ],
  teacher: [
    { href: "/teacher", label: "لوحة المعلم", icon: LayoutDashboard },
    { href: "/teacher/attendance", label: "تسجيل الحضور", icon: CheckSquare },
    { href: "/teacher/grades", label: "رصد الدرجات", icon: ClipboardList },
    { href: "/teacher/schedule", label: "جدولي الأسبوعي", icon: CalendarDays },
    { href: "/teacher/online", label: "الحصص الأونلاين", icon: Video },
    { href: "/teacher/library", label: "المكتبة الرقمية", icon: Library },
  ],
  parent: [
    { href: "/parent", label: "نظرة عامة", icon: LayoutDashboard },
    { href: "/parent/results", label: "النتائج", icon: ClipboardList },
    { href: "/parent/attendance", label: "الحضور والغياب", icon: CheckSquare },
    { href: "/parent/fees", label: "الرسوم والفواتير", icon: Receipt },
    { href: "/parent/schedule", label: "جدول الحصص", icon: CalendarDays },
    { href: "/parent/online", label: "الحصص الأونلاين", icon: Video },
    { href: "/parent/notifications", label: "الإشعارات", icon: Bell },
  ],
  student: [
    { href: "/student", label: "لوحتي", icon: LayoutDashboard },
    { href: "/student/results", label: "نتائجي", icon: Trophy },
    { href: "/student/schedule", label: "جدول الحصص", icon: CalendarDays },
    { href: "/student/library", label: "المكتبة الرقمية", icon: BookOpen },
    { href: "/student/online", label: "الحصص الأونلاين", icon: Video },
    { href: "/student/notifications", label: "الإشعارات", icon: Bell },
  ],
};

// أيقونة احتياطية للمستخدم
export { Users };
