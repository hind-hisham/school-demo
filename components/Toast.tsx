"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";

const ToastCtx = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; msg: string }[]>([]);

  const push = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, msg }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="no-print fixed bottom-4 start-4 z-[100] flex flex-col gap-2">
        {items.map((i) => (
          <div key={i.id} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-lg">
            <CheckCircle2 size={18} className="text-emerald-400" />
            {i.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export const useToast = () => useContext(ToastCtx);
