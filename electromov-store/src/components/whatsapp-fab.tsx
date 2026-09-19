"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { waLink } from "@/lib/site";
import { track } from "@/lib/analytics";

export function WhatsAppFab() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waLink("Hola ElectroMov, estoy viendo la web y tengo una consulta.")}
      target="_blank"
      rel="noopener"
      onClick={() => track("contact_whatsapp", { location: "fab" })}
      aria-label="Consultar por WhatsApp"
      className={`fixed bottom-5 right-5 z-[75] grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-[#052e16] shadow-[0_10px_30px_-8px_rgba(37,211,102,0.8)] transition-all duration-300 hover:scale-105 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
