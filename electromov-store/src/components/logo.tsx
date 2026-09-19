import { Zap } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink-800">
        <Zap className="h-4 w-4 fill-volt-400 text-volt-400" aria-hidden />
      </span>
      <span className="text-[19px] font-bold tracking-[-0.04em] text-ink-800">
        Electro<span className="text-volt-600">Mov</span>
      </span>
    </span>
  );
}
