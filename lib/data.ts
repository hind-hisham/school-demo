// =====================================================================
// بيانات وهمية لنسخة العرض (Demo). كلها تُولَّد بشكل ثابت (deterministic)
// حتى تظهر نفس الأرقام عند كل تشغيل. عند بناء النظام الحقيقي تُستبدل
// هذه الملفات باستدعاءات API لقاعدة البيانات.
// =====================================================================

export const currency = "ر.س";
export const money = (n: number) => `${n.toLocaleString("en-US")} ${currency}`;

export const school = {
  name: "مدارس النور النموذجية",
  tagline: "نبني جيلًا متميزًا بالعلم والقيم",
  year: "1448 هـ",
  phone: "800 000 0000",
  email: "info@alnoor-demo.example",
  address: "المدينة — الحي الأول (بيانات تجريبية)",
};

// ---------- مولّد أرقام عشوائية ثابت ----------
export function mulberry(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const r = mulberry(1448);
function pick<T>(a: T[]): T {
  return a[Math.floor(r() * a.length)];
}
function int(min: number, max: number) {
  return Math.floor(r() * (max - min + 1)) + min;
}

// ---------- المراحل والفصول ----------
export const stages = [
  { id: "kg", name: "روضة", classes: ["روضة أولى", "روضة ثانية"] },
  { id: "pre", name: "تمهيدي", classes: ["تمهيدي"] },
  {
    id: "pri",
    name: "ابتدائي",
    classes: ["الأول الابتدائي", "الثاني الابتدائي", "الثالث الابتدائي", "الرابع الابتدائي", "الخامس الابتدائي", "السادس الابتدائي"],
  },
  { id: "mid", name: "متوسط", classes: ["الأول المتوسط", "الثاني المتوسط", "الثالث المتوسط"] },
  { id: "sec", name: "ثانوي", classes: ["الأول الثانوي", "الثاني الثانوي", "الثالث الثانوي"] },
];
export const allClasses = stages.flatMap((s) => s.classes);
export const upperClasses = allClasses.slice(3); // من الأول الابتدائي فما فوق
export const stageOfClass = (c: string) => stages.find((s) => s.classes.includes(c))?.name ?? "";
export const sections = ["أ", "ب", "ج"];

export const subjects = [
  "الرياضيات",
  "اللغة العربية",
  "العلوم",
  "اللغة الإنجليزية",
  "القرآن الكريم",
  "التربية الإسلامية",
  "الدراسات الاجتماعية",
  "الحاسب الآلي",
];

// ---------- الأسماء ----------
const maleNames = ["محمد", "أحمد", "عبدالله", "يوسف", "خالد", "سلمان", "فهد", "عمر", "ياسر", "إبراهيم", "سامي", "ماجد", "زياد", "طارق", "هاني", "بدر"];
const femaleNames = ["سارة", "نورة", "ريم", "لينا", "جود", "مها", "هند", "لمى", "رهف", "دانة", "غدير", "أسيل", "تالا", "شهد", "ليان", "جنى"];
const families = ["السالم", "الخالد", "المنصور", "الرشيد", "الحسن", "العمر", "الفهد", "الناصر", "البكر", "القاسم", "الجابر", "الهاشم"];

// ---------- أولياء الأمور ----------
export type Parent = {
  id: string;
  name: string;
  first: string;
  family: string;
  relation: string;
  phone: string;
  email: string;
  children: string[];
};

export const parents: Parent[] = Array.from({ length: 32 }, (_, i) => {
  const first = pick(maleNames);
  const family = pick(families);
  return {
    id: `P-${201 + i}`,
    name: `${first} ${family}`,
    first,
    family,
    relation: "الأب",
    phone: `05${int(10000000, 99999999)}`,
    email: `parent${i + 1}@example.com`,
    children: [],
  };
});
parents[0] = { ...parents[0], first: "خالد", family: "السالم", name: "خالد السالم" };

// ---------- الطلاب ----------
export type Student = {
  id: string;
  name: string;
  first: string;
  family: string;
  gender: "ذكر" | "أنثى";
  className: string;
  stage: string;
  section: string;
  parentId: string;
  attendance: number;
  avg: number;
  status: "نشط" | "مؤرشف";
  year: string;
};

const kgClasses = ["روضة أولى", "روضة ثانية", "تمهيدي"];

export const students: Student[] = Array.from({ length: 48 }, (_, i) => {
  const p = parents[i % 32];
  const gender: "ذكر" | "أنثى" = r() > 0.5 ? "ذكر" : "أنثى";
  const first = pick(gender === "ذكر" ? maleNames : femaleNames);
  const className = i % 8 === 7 ? kgClasses[Math.floor(i / 8) % 3] : upperClasses[i % upperClasses.length];
  const archived = i % 17 === 16;
  return {
    id: `S-${1001 + i}`,
    name: `${first} ${p.first} ${p.family}`,
    first,
    family: p.family,
    gender,
    className,
    stage: stageOfClass(className),
    section: sections[(i * 2) % 3],
    parentId: p.id,
    attendance: int(82, 100),
    avg: int(58, 99),
    status: archived ? "مؤرشف" : "نشط",
    year: archived ? "1447 هـ" : "1448 هـ",
  };
});

// طالبان تجريبيان بارزان (للبوابة الأبوية والطالب)
Object.assign(students[0], {
  first: "يوسف",
  name: "يوسف خالد السالم",
  gender: "ذكر",
  className: "الخامس الابتدائي",
  stage: "ابتدائي",
  section: "أ",
  attendance: 97,
  avg: 92,
  status: "نشط",
  year: "1448 هـ",
});
Object.assign(students[32], {
  first: "ريم",
  name: "ريم خالد السالم",
  gender: "أنثى",
  className: "الثالث الابتدائي",
  stage: "ابتدائي",
  section: "ب",
  attendance: 94,
  avg: 88,
  status: "نشط",
  year: "1448 هـ",
});

students.forEach((s) => parents.find((p) => p.id === s.parentId)?.children.push(s.id));

export const studentById = (id: string) => students.find((s) => s.id === id);
export const parentById = (id: string) => parents.find((p) => p.id === id);
export const studentsOfClass = (c: string) => students.filter((s) => s.className === c && s.status === "نشط");

// ---------- المعلمون ----------
export type Teacher = {
  id: string;
  name: string;
  subject: string;
  classes: string[];
  phone: string;
  email: string;
  status: "نشط" | "إجازة";
  experience: number;
};

const teacherNames = [
  "أ. عبدالرحمن الفهد", "أ. منى الرشيد", "أ. صالح الجابر", "أ. هدى القاسم", "أ. إبراهيم البكر",
  "أ. ليلى الناصر", "أ. ناصر الهاشم", "أ. أمل الحسن", "أ. بدر العمر", "أ. شيماء الخالد",
  "أ. رائد المنصور", "أ. وفاء السالم", "أ. حمد الرشيد", "أ. جميلة الفهد",
];

export const teachers: Teacher[] = teacherNames.map((name, i) => ({
  id: `T-${101 + i}`,
  name,
  subject: subjects[i % subjects.length],
  classes: [upperClasses[(i * 2) % 12], upperClasses[(i * 2 + 3) % 12], upperClasses[(i * 2 + 5) % 12]],
  phone: `05${int(10000000, 99999999)}`,
  email: `teacher${i + 1}@alnoor-demo.example`,
  status: i === 11 ? "إجازة" : "نشط",
  experience: int(2, 18),
}));
teachers[0].classes = ["الخامس الابتدائي", "الثالث الابتدائي", "الرابع الابتدائي"];

export const teacherOfSubject = (s: string) => teachers.find((t) => t.subject === s)?.name ?? "—";

// ---------- هويات العرض التجريبي ----------
export const demo = {
  admin: { name: "أ. سعد المنصور", title: "مدير المدرسة" },
  teacher: teachers[0],
  parent: parents[0],
  student: students[0],
};

// ---------- الدرجات ----------
export const gradeLabel = (n: number) => (n >= 90 ? "ممتاز" : n >= 80 ? "جيد جدًا" : n >= 70 ? "جيد" : n >= 60 ? "مقبول" : "ضعيف");
export const gradeTone = (n: number): "green" | "blue" | "amber" | "red" => (n >= 90 ? "green" : n >= 80 ? "blue" : n >= 60 ? "amber" : "red");

export type GradeRow = { subject: string; activities: number; midterm: number; final: number; total: number };

export function gradesFor(studentId: string): GradeRow[] {
  const seed = Number(studentId.replace(/\D/g, ""));
  const g = mulberry(seed * 7919);
  const base = studentById(studentId)?.avg ?? 75;
  return subjects.map((subject) => {
    const pct = Math.max(42, Math.min(100, base + Math.round((g() - 0.5) * 16)));
    const activities = Math.round(pct * 0.2);
    const midterm = Math.round(pct * 0.3);
    const final = Math.round(pct * 0.5);
    return { subject, activities, midterm, final, total: activities + midterm + final };
  });
}

export function classAverage(className: string, subject: string) {
  const list = studentsOfClass(className);
  if (!list.length) return 0;
  const sum = list.reduce((acc, s) => acc + (gradesFor(s.id).find((g) => g.subject === subject)?.total ?? 0), 0);
  return Math.round(sum / list.length);
}

// ---------- الحضور ----------
export type AttendanceStatus = "حاضر" | "غائب" | "متأخر" | "بعذر";
export function attendanceLog(studentId: string, weeks = 4) {
  const seed = Number(studentId.replace(/\D/g, ""));
  const g = mulberry(seed * 31);
  const dayNames = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
  const out: { week: number; day: string; status: AttendanceStatus }[] = [];
  for (let w = 0; w < weeks; w++) {
    dayNames.forEach((day) => {
      const x = g();
      const status: AttendanceStatus = x > 0.93 ? "غائب" : x > 0.87 ? "متأخر" : x > 0.84 ? "بعذر" : "حاضر";
      out.push({ week: w + 1, day, status });
    });
  }
  return out;
}

// ---------- الجداول ----------
export const days = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];
export const periods = [
  { n: 1, time: "07:30 - 08:15" },
  { n: 2, time: "08:15 - 09:00" },
  { n: 3, time: "09:00 - 09:45" },
  { n: 4, time: "10:15 - 11:00" },
  { n: 5, time: "11:00 - 11:45" },
  { n: 6, time: "11:45 - 12:30" },
  { n: 7, time: "12:30 - 13:15" },
];
export type Cell = { title: string; sub?: string } | null;

// جدول فصل: [الحصة][اليوم]
export function timetableFor(className: string): Cell[][] {
  const seed = allClasses.indexOf(className) + 1;
  return periods.map((_, p) =>
    days.map((_, d) => {
      const subject = subjects[(p * 3 + d * 2 + seed) % subjects.length];
      return { title: subject, sub: teacherOfSubject(subject) };
    })
  );
}

// جدول معلم: [الحصة][اليوم]
export function teacherScheduleFor(t: Teacher): Cell[][] {
  const idx = teachers.findIndex((x) => x.id === t.id);
  return periods.map((_, p) =>
    days.map((_, d) => ((d * 7 + p + idx) % 3 === 0 ? { title: t.subject, sub: t.classes[(d + p) % t.classes.length] } : null))
  );
}

// ---------- الامتحانات ----------
export type Exam = { id: string; title: string; type: "نصفي" | "نهائي" | "قصير"; className: string; subject: string; day: string; date: string; time: string; hall: string };
export const exams: Exam[] = [
  { id: "E-1", title: "اختبار الرياضيات", type: "نصفي", className: "الخامس الابتدائي", subject: "الرياضيات", day: "الأحد", date: "1448/05/02", time: "08:00 - 09:30", hall: "قاعة 3" },
  { id: "E-2", title: "اختبار العلوم", type: "نصفي", className: "الخامس الابتدائي", subject: "العلوم", day: "الاثنين", date: "1448/05/03", time: "08:00 - 09:30", hall: "قاعة 3" },
  { id: "E-3", title: "اختبار اللغة العربية", type: "نصفي", className: "الخامس الابتدائي", subject: "اللغة العربية", day: "الثلاثاء", date: "1448/05/04", time: "08:00 - 09:30", hall: "قاعة 3" },
  { id: "E-4", title: "اختبار الرياضيات", type: "نصفي", className: "الثالث الابتدائي", subject: "الرياضيات", day: "الأحد", date: "1448/05/02", time: "10:00 - 11:00", hall: "قاعة 1" },
  { id: "E-5", title: "اختبار القرآن الكريم", type: "قصير", className: "الثالث الابتدائي", subject: "القرآن الكريم", day: "الأربعاء", date: "1448/05/05", time: "09:00 - 09:30", hall: "قاعة 1" },
  { id: "E-6", title: "اختبار اللغة الإنجليزية", type: "نصفي", className: "الأول المتوسط", subject: "اللغة الإنجليزية", day: "الاثنين", date: "1448/05/03", time: "08:00 - 09:30", hall: "قاعة 6" },
  { id: "E-7", title: "اختبار الفيزياء الأولية", type: "نصفي", className: "الثاني المتوسط", subject: "العلوم", day: "الثلاثاء", date: "1448/05/04", time: "10:00 - 11:30", hall: "مختبر العلوم" },
  { id: "E-8", title: "اختبار الحاسب الآلي", type: "قصير", className: "الأول الثانوي", subject: "الحاسب الآلي", day: "الخميس", date: "1448/05/06", time: "09:00 - 10:00", hall: "معمل الحاسب" },
  { id: "E-9", title: "اختبار الدراسات الاجتماعية", type: "نصفي", className: "الثاني الثانوي", subject: "الدراسات الاجتماعية", day: "الأحد", date: "1448/05/09", time: "08:00 - 10:00", hall: "قاعة 9" },
  { id: "E-10", title: "اختبار الرياضيات النهائي", type: "نهائي", className: "الثالث الثانوي", subject: "الرياضيات", day: "الاثنين", date: "1448/05/10", time: "08:00 - 10:30", hall: "القاعة الكبرى" },
];

// ---------- المكتبة الرقمية ----------
export type LibItem = { id: string; title: string; type: "PDF" | "فيديو" | "رابط"; stage: string; subject: string; size: string; author: string; downloads: number };
export const library: LibItem[] = [
  { id: "L-1", title: "كتاب الرياضيات — الصف الخامس", type: "PDF", stage: "ابتدائي", subject: "الرياضيات", size: "12.4 MB", author: "وزارة التعليم (نموذج)", downloads: 214 },
  { id: "L-2", title: "شرح الكسور العادية", type: "فيديو", stage: "ابتدائي", subject: "الرياضيات", size: "48 MB", author: "أ. عبدالرحمن الفهد", downloads: 167 },
  { id: "L-3", title: "قواعد اللغة العربية المبسطة", type: "PDF", stage: "ابتدائي", subject: "اللغة العربية", size: "6.1 MB", author: "أ. منى الرشيد", downloads: 131 },
  { id: "L-4", title: "تجارب علمية منزلية", type: "فيديو", stage: "متوسط", subject: "العلوم", size: "92 MB", author: "أ. صالح الجابر", downloads: 98 },
  { id: "L-5", title: "منصة تدريب اللغة الإنجليزية", type: "رابط", stage: "متوسط", subject: "اللغة الإنجليزية", size: "—", author: "أ. هدى القاسم", downloads: 76 },
  { id: "L-6", title: "مراجعة الفيزياء — الأول الثانوي", type: "PDF", stage: "ثانوي", subject: "العلوم", size: "9.8 MB", author: "أ. ناصر الهاشم", downloads: 112 },
  { id: "L-7", title: "تلاوة وتجويد — جزء عمّ", type: "فيديو", stage: "ابتدائي", subject: "القرآن الكريم", size: "130 MB", author: "أ. إبراهيم البكر", downloads: 305 },
  { id: "L-8", title: "مقدمة في البرمجة بلغة Python", type: "PDF", stage: "ثانوي", subject: "الحاسب الآلي", size: "5.3 MB", author: "أ. جميلة الفهد", downloads: 89 },
  { id: "L-9", title: "ملخص الدراسات الاجتماعية", type: "PDF", stage: "متوسط", subject: "الدراسات الاجتماعية", size: "3.7 MB", author: "أ. بدر العمر", downloads: 64 },
  { id: "L-10", title: "حلول نماذج اختبارات الثانوية", type: "رابط", stage: "ثانوي", subject: "الرياضيات", size: "—", author: "أ. رائد المنصور", downloads: 241 },
  { id: "L-11", title: "قصص تعليمية للأطفال", type: "فيديو", stage: "روضة", subject: "اللغة العربية", size: "64 MB", author: "قسم الروضة", downloads: 177 },
  { id: "L-12", title: "أساسيات الفقه الميسّر", type: "PDF", stage: "متوسط", subject: "التربية الإسلامية", size: "4.2 MB", author: "أ. أمل الحسن", downloads: 58 },
];

// ---------- الحصص الأونلاين ----------
export type Session = {
  id: string;
  title: string;
  teacher: string;
  subject: string;
  className: string;
  platform: "Zoom" | "Google Meet";
  date: string;
  time: string;
  status: "قادمة" | "مباشرة الآن" | "منتهية";
  recorded: boolean;
};
export const sessions: Session[] = [
  { id: "O-1", title: "مراجعة الكسور", teacher: "أ. عبدالرحمن الفهد", subject: "الرياضيات", className: "الخامس الابتدائي", platform: "Zoom", date: "1448/04/25", time: "05:00 م", status: "مباشرة الآن", recorded: false },
  { id: "O-2", title: "درس الدورة المائية", teacher: "أ. صالح الجابر", subject: "العلوم", className: "الخامس الابتدائي", platform: "Google Meet", date: "1448/04/26", time: "04:30 م", status: "قادمة", recorded: false },
  { id: "O-3", title: "الجمع والطرح — تمارين", teacher: "أ. عبدالرحمن الفهد", subject: "الرياضيات", className: "الثالث الابتدائي", platform: "Zoom", date: "1448/04/27", time: "04:00 م", status: "قادمة", recorded: false },
  { id: "O-4", title: "محادثة باللغة الإنجليزية", teacher: "أ. هدى القاسم", subject: "اللغة الإنجليزية", className: "الأول المتوسط", platform: "Google Meet", date: "1448/04/27", time: "06:00 م", status: "قادمة", recorded: false },
  { id: "O-5", title: "مراجعة النحو", teacher: "أ. منى الرشيد", subject: "اللغة العربية", className: "الخامس الابتدائي", platform: "Zoom", date: "1448/04/23", time: "05:00 م", status: "منتهية", recorded: true },
  { id: "O-6", title: "ضرب الأعداد", teacher: "أ. عبدالرحمن الفهد", subject: "الرياضيات", className: "الرابع الابتدائي", platform: "Zoom", date: "1448/04/22", time: "04:30 م", status: "منتهية", recorded: true },
  { id: "O-7", title: "أساسيات البرمجة", teacher: "أ. جميلة الفهد", subject: "الحاسب الآلي", className: "الأول الثانوي", platform: "Google Meet", date: "1448/04/21", time: "07:00 م", status: "منتهية", recorded: true },
  { id: "O-8", title: "تجويد سورة النبأ", teacher: "أ. إبراهيم البكر", subject: "القرآن الكريم", className: "الثالث الابتدائي", platform: "Zoom", date: "1448/04/20", time: "05:00 م", status: "منتهية", recorded: false },
];

// ---------- الفواتير والرسوم ----------
export const fees = [
  { stage: "روضة", tuition: 4500, transport: 1200, activities: 300 },
  { stage: "تمهيدي", tuition: 5000, transport: 1200, activities: 300 },
  { stage: "ابتدائي", tuition: 7500, transport: 1200, activities: 400 },
  { stage: "متوسط", tuition: 9000, transport: 1300, activities: 400 },
  { stage: "ثانوي", tuition: 11000, transport: 1300, activities: 500 },
];

export type Invoice = {
  id: string;
  studentId: string;
  studentName: string;
  parentId: string;
  title: string;
  amount: number;
  due: string;
  status: "مدفوعة" | "معلقة" | "متأخرة";
  method: string;
  paidOn: string;
};
const methods = ["مدى", "فيزا", "Apple Pay", "تحويل بنكي"];

export const invoices: Invoice[] = [];
students
  .filter((s) => s.status === "نشط")
  .forEach((s, idx) => {
    const fee = fees.find((f) => f.stage === s.stage)!;
    const items = [
      { title: "رسوم الفصل الدراسي الأول", amount: Math.round(fee.tuition / 2) },
      idx % 2 === 0 ? { title: "خدمة النقل المدرسي", amount: Math.round(fee.transport / 2) } : { title: "الأنشطة والمرافق", amount: fee.activities },
    ];
    items.forEach((it, k) => {
      const x = r();
      const status: Invoice["status"] = x > 0.45 ? "مدفوعة" : x > 0.15 ? "معلقة" : "متأخرة";
      invoices.push({
        id: `INV-${2000 + invoices.length + 1}`,
        studentId: s.id,
        studentName: s.name,
        parentId: s.parentId,
        title: it.title,
        amount: it.amount,
        due: k === 0 ? "1448/04/15" : "1448/05/15",
        status,
        method: status === "مدفوعة" ? pick(methods) : "—",
        paidOn: status === "مدفوعة" ? `1448/04/${String(int(1, 14)).padStart(2, "0")}` : "—",
      });
    });
  });
// ضبط فواتير الطالبين التجريبيين ليظهرا حالات مختلفة
function forceStatus(studentId: string, statuses: Invoice["status"][]) {
  invoices
    .filter((i) => i.studentId === studentId)
    .forEach((i, k) => {
      i.status = statuses[k] ?? i.status;
      i.method = i.status === "مدفوعة" ? "مدى" : "—";
      i.paidOn = i.status === "مدفوعة" ? "1448/04/08" : "—";
    });
}
forceStatus(students[0].id, ["مدفوعة", "معلقة"]);
forceStatus(students[32].id, ["مدفوعة", "متأخرة"]);

export const invoicesOfParent = (parentId: string) => invoices.filter((i) => i.parentId === parentId);

// ---------- الإشعارات ----------
export type Notice = { id: string; title: string; body: string; type: "نتيجة" | "حضور" | "فاتورة" | "حصة" | "امتحان" | "عام"; channel: "داخلي" | "واتساب" | "الاثنان"; time: string; read: boolean };
export const notices: Notice[] = [
  { id: "N-1", title: "بدأت الحصة المباشرة", body: "حصة الرياضيات (مراجعة الكسور) تعمل الآن على Zoom.", type: "حصة", channel: "الاثنان", time: "منذ 5 دقائق", read: false },
  { id: "N-2", title: "تم رصد نتائج اختبار العلوم", body: "يمكنك الاطلاع على درجات الاختبار القصير من صفحة النتائج.", type: "نتيجة", channel: "داخلي", time: "منذ ساعتين", read: false },
  { id: "N-3", title: "فاتورة مستحقة", body: "فاتورة خدمة النقل المدرسي تستحق السداد قبل 1448/05/15.", type: "فاتورة", channel: "واتساب", time: "أمس", read: false },
  { id: "N-4", title: "تنبيه غياب", body: "تم تسجيل غياب الطالب اليوم، يرجى التواصل مع شؤون الطلاب عند وجود عذر.", type: "حضور", channel: "واتساب", time: "أمس", read: true },
  { id: "N-5", title: "موعد الاختبارات النصفية", body: "تبدأ الاختبارات النصفية الأحد 1448/05/02. جداول الامتحانات متاحة الآن.", type: "امتحان", channel: "الاثنان", time: "قبل يومين", read: true },
  { id: "N-6", title: "اجتماع أولياء الأمور", body: "ندعوكم لحضور اللقاء الدوري يوم الثلاثاء الساعة 6 مساءً.", type: "عام", channel: "الاثنان", time: "قبل 3 أيام", read: true },
  { id: "N-7", title: "تكريم الطلاب المتميزين", body: "تم إدراج طلاب الفصل الأول في لوحة التميز على الموقع.", type: "عام", channel: "داخلي", time: "قبل أسبوع", read: true },
];

export const notificationRules = [
  { id: "R-1", event: "رصد نتيجة جديدة", audience: "ولي الأمر + الطالب", internal: true, whatsapp: false },
  { id: "R-2", event: "غياب الطالب", audience: "ولي الأمر", internal: true, whatsapp: true },
  { id: "R-3", event: "إصدار فاتورة", audience: "ولي الأمر", internal: true, whatsapp: true },
  { id: "R-4", event: "اقتراب موعد سداد", audience: "ولي الأمر", internal: true, whatsapp: true },
  { id: "R-5", event: "قبل بدء الحصة الأونلاين بـ 15 دقيقة", audience: "الطالب + المعلم", internal: true, whatsapp: false },
  { id: "R-6", event: "قبل الاختبار بيوم", audience: "الطالب + ولي الأمر", internal: true, whatsapp: true },
  { id: "R-7", event: "إعلان عام من الإدارة", audience: "الجميع", internal: true, whatsapp: false },
];

// ---------- الحسابات والصلاحيات ----------
export type Account = { id: string; name: string; role: "إدارة" | "معلم" | "ولي أمر" | "طالب"; email: string; status: "مفعّل" | "معطّل" | "قيد التفعيل"; lastLogin: string };
export const accounts: Account[] = [
  { id: "U-1", name: "أ. سعد المنصور", role: "إدارة", email: "admin@alnoor-demo.example", status: "مفعّل", lastLogin: "اليوم 08:12" },
  { id: "U-2", name: "أ. نوال الحسن", role: "إدارة", email: "registrar@alnoor-demo.example", status: "مفعّل", lastLogin: "أمس 14:40" },
  ...teachers.slice(0, 6).map((t, i): Account => ({ id: `U-${10 + i}`, name: t.name, role: "معلم", email: t.email, status: t.status === "نشط" ? "مفعّل" : "معطّل", lastLogin: i % 2 ? "أمس 10:05" : "اليوم 07:45" })),
  ...parents.slice(0, 6).map((p, i): Account => ({ id: `U-${30 + i}`, name: p.name, role: "ولي أمر", email: p.email, status: i === 5 ? "قيد التفعيل" : "مفعّل", lastLogin: i === 5 ? "—" : "قبل يومين" })),
  ...students.slice(0, 6).map((s, i): Account => ({ id: `U-${50 + i}`, name: s.name, role: "طالب", email: `${s.id.toLowerCase()}@student.alnoor-demo.example`, status: "مفعّل", lastLogin: "اليوم 16:20" })),
];

export const permissionModules = ["المستخدمون", "الطلاب", "المعلمون", "الحضور", "الدرجات", "الجداول", "المكتبة", "الحصص الأونلاين", "المالية", "الإشعارات", "التقارير", "الإعدادات"];
export const permissionRoles = ["إدارة", "معلم", "ولي أمر", "طالب"];
export const defaultPerms: Record<string, boolean[]> = {
  المستخدمون: [true, false, false, false],
  الطلاب: [true, true, true, false],
  المعلمون: [true, false, false, false],
  الحضور: [true, true, true, true],
  الدرجات: [true, true, true, true],
  الجداول: [true, true, true, true],
  المكتبة: [true, true, false, true],
  "الحصص الأونلاين": [true, true, true, true],
  المالية: [true, false, true, false],
  الإشعارات: [true, true, true, true],
  التقارير: [true, true, false, false],
  الإعدادات: [true, false, false, false],
};

// ---------- بيانات الرسوم البيانية ----------
export const months = ["محرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة"];
export const attendanceTrend = months.map((m, i) => ({ month: m, rate: [94, 95, 93, 96, 95, 97][i], absence: [6, 5, 7, 4, 5, 3][i] }));
export const revenueTrend = months.map((m, i) => ({ month: m, collected: [182, 140, 96, 164, 120, 88][i] * 1000, expected: [210, 160, 130, 180, 150, 120][i] * 1000 }));
export const performanceByStage = stages.map((s) => {
  const list = students.filter((x) => x.stage === s.name && x.status === "نشط");
  return { stage: s.name, avg: list.length ? Math.round(list.reduce((a, b) => a + b.avg, 0) / list.length) : 0, count: list.length };
});
export const attendanceByClass = upperClasses.map((c) => {
  const list = studentsOfClass(c);
  return { className: c.replace("الابتدائي", "ابت.").replace("المتوسط", "متو.").replace("الثانوي", "ثان."), rate: list.length ? Math.round(list.reduce((a, b) => a + b.attendance, 0) / list.length) : 0 };
});
export const activityParticipation = [
  { name: "الأنشطة الرياضية", value: 38 },
  { name: "الأنشطة العلمية", value: 27 },
  { name: "الأنشطة الثقافية", value: 21 },
  { name: "الأنشطة الفنية", value: 14 },
];

// ---------- الموقع التعريفي ----------
export const topStudents = [
  { name: "يوسف خالد السالم", cls: "الخامس الابتدائي", avg: 98.5, note: "المركز الأول على المدرسة في الفصل الدراسي الأول" },
  { name: "لينا ماجد الرشيد", cls: "الثالث المتوسط", avg: 97.8, note: "فازت بمسابقة الرياضيات على مستوى المنطقة" },
  { name: "عمر فهد الناصر", cls: "الثاني الثانوي", avg: 97.2, note: "ممثل المدرسة في أولمبياد العلوم" },
  { name: "سارة بدر الحسن", cls: "السادس الابتدائي", avg: 96.9, note: "حافظة لجزأين من القرآن الكريم" },
  { name: "ياسر طارق العمر", cls: "الأول المتوسط", avg: 96.4, note: "بطل المدرسة في الخطابة والإلقاء" },
  { name: "جود زياد القاسم", cls: "الرابع الابتدائي", avg: 96.1, note: "قارئة متميزة في مسابقة القراءة السنوية" },
];

export const summerCourses = [
  { id: "C-1", title: "برمجة الألعاب للمبتدئين", level: "متوسط", duration: "4 أسابيع", price: 600, seats: 20, instructor: "أ. جميلة الفهد", desc: "تعلّم أساسيات البرمجة عبر بناء ألعاب بسيطة خطوة بخطوة." },
  { id: "C-2", title: "اللغة الإنجليزية — المحادثة", level: "ابتدائي", duration: "6 أسابيع", price: 450, seats: 25, instructor: "أ. هدى القاسم", desc: "أنشطة تفاعلية لتعزيز الثقة في المحادثة اليومية." },
  { id: "C-3", title: "الروبوت والتفكير الهندسي", level: "ثانوي", duration: "5 أسابيع", price: 800, seats: 15, instructor: "أ. ناصر الهاشم", desc: "بناء روبوتات صغيرة وبرمجتها مع فريق عمل." },
  { id: "C-4", title: "تحفيظ ومراجعة القرآن", level: "ابتدائي", duration: "8 أسابيع", price: 300, seats: 30, instructor: "أ. إبراهيم البكر", desc: "حلقات صباحية لتثبيت الحفظ وتحسين التلاوة." },
  { id: "C-5", title: "الرياضيات الممتعة", level: "ابتدائي", duration: "4 أسابيع", price: 350, seats: 25, instructor: "أ. عبدالرحمن الفهد", desc: "ألغاز وألعاب رياضية تبني الفهم وتكسر الرهبة." },
  { id: "C-6", title: "الكتابة الإبداعية", level: "متوسط", duration: "4 أسابيع", price: 400, seats: 18, instructor: "أ. منى الرشيد", desc: "ورش لكتابة القصة والمقال وتطوير الأسلوب الشخصي." },
];

export const news = [
  { id: "W-1", title: "انطلاق العام الدراسي الجديد 1448 هـ", date: "1448/02/05", excerpt: "استقبلت المدرسة طلابها بفعاليات ترحيبية وبرامج تهيئة لجميع المراحل." },
  { id: "W-2", title: "فوز فريق المدرسة في مسابقة الروبوت", date: "1448/03/12", excerpt: "حقق فريق المرحلة الثانوية المركز الأول على مستوى المنطقة." },
  { id: "W-3", title: "إطلاق البوابة الإلكترونية لأولياء الأمور", date: "1448/03/20", excerpt: "متابعة النتائج والحضور وسداد الرسوم إلكترونيًا في مكان واحد." },
  { id: "W-4", title: "فتح التسجيل في الدورات الصيفية", date: "1448/04/02", excerpt: "دورات متنوعة في البرمجة واللغات والعلوم لجميع المراحل." },
];

export const achievements = [
  { year: "1440", text: "افتتاح المدرسة بمرحلتي الروضة والابتدائية" },
  { year: "1442", text: "إضافة المرحلة المتوسطة واعتماد الجودة التعليمية" },
  { year: "1444", text: "افتتاح المرحلة الثانوية ومعامل العلوم والحاسب" },
  { year: "1446", text: "تحول رقمي كامل لعمليات الحضور والنتائج والرسوم" },
  { year: "1448", text: "إطلاق منصة التعلم عن بُعد والمكتبة الرقمية" },
];
