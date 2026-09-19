import { Plus } from "lucide-react";
import type { Faq } from "@/lib/types";

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="divide-y divide-sand-200 border-y border-sand-200">
      {faqs.map((faq) => (
        <details key={faq.q} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
            <h3 className="text-[16.5px] font-medium leading-snug text-ink-800">{faq.q}</h3>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-sand-200 transition-transform duration-300 group-open:rotate-45">
              <Plus className="h-4 w-4 text-ink-800" aria-hidden />
            </span>
          </summary>
          <p className="pb-5 pr-12 text-[15px] leading-relaxed text-sand-600">{faq.a}</p>
        </details>
      ))}
    </div>
  );
}
