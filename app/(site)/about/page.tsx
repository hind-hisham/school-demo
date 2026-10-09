"use client";

import { Eye, Flag, Heart } from "lucide-react";
import { achievements, school } from "@/lib/data";
import { useTheme } from "@/components/ThemeProvider";

export default function About() {
  const { schoolName } = useTheme();
  return (
    <div className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
      <h1 className="mb-3 text-4xl font-extrabold">عن {schoolName}</h1>
      <p className="mb-10 max-w-3xl text-lg leading-8 text-slate-600">مدرسة أهلية تأسست لتقدّم تعليمًا متميزًا يرتكز على القيم ويواكب التقنية الحديثة، وتخدم طلابها من الروضة حتى الثانوية. العام الدراسي الحالي {school.year}.</p>

      <div className="mb-14 grid gap-5 md:grid-cols-3">
        {[
          { i: Eye, t: "رؤيتنا", d: "أن نكون مدرسة رائدة تخرّج جيلًا متعلمًا مبدعًا ومتمسكًا بقيمه." },
          { i: Flag, t: "رسالتنا", d: "توفير بيئة تعليمية آمنة ومحفّزة تنمّي المهارات وتبني الشخصية المتوازنة." },
          { i: Heart, t: "قيمنا", d: "الأمانة، التعاون، الإتقان، الاحترام، وحب التعلّم المستمر." },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-card">
            <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-brand/10 text-brand"><x.i size={22} /></div>
            <h2 className="mb-2 text-lg font-bold">{x.t}</h2>
            <p className="text-sm leading-7 text-slate-500">{x.d}</p>
          </div>
        ))}
      </div>

      <h2 className="mb-6 text-2xl font-extrabold">محطات وإنجازات</h2>
      <ol className="relative border-s-2 border-brand/20 ps-8">
        {achievements.map((a) => (
          <li key={a.year} className="mb-8">
            <span className="absolute -start-[9px] mt-1.5 h-4 w-4 rounded-full border-4 border-white bg-brand" />
            <p className="text-sm font-bold text-brand">{a.year} هـ</p>
            <p className="text-slate-700">{a.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
