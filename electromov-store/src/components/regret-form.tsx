"use client";

import { useState } from "react";
import { Mail, MessageCircle } from "lucide-react";

export function RegretForm({ email, whatsapp }: { email: string; whatsapp: string }) {
  const [order, setOrder] = useState("");
  const [name, setName] = useState("");
  const [reason, setReason] = useState("");

  const subject = `Arrepentimiento de compra — Pedido ${order || "(sin número)"}`;
  const bodyText = `Solicito ejercer el derecho de arrepentimiento previsto en el artículo 34 de la Ley 24.240.

Nombre: ${name}
Número de pedido: ${order}
Motivo (opcional): ${reason}

Quedo a la espera de la confirmación y de las instrucciones para la devolución del producto.`;

  const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
  const wa = `https://wa.me/${whatsapp}?text=${encodeURIComponent(bodyText)}`;

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-[13px] font-semibold text-ink-800">Nombre y apellido</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 px-3 text-[15px] outline-none focus:border-ink-800"
          />
        </label>
        <label className="block">
          <span className="text-[13px] font-semibold text-ink-800">Número de pedido</span>
          <input
            value={order}
            onChange={(e) => setOrder(e.target.value)}
            placeholder="EM-XXXXXX"
            className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 px-3 text-[15px] outline-none focus:border-ink-800"
          />
        </label>
        <label className="block sm:col-span-2">
          <span className="text-[13px] font-semibold text-ink-800">Motivo (opcional)</span>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            className="mt-1.5 w-full rounded-xl border border-sand-200 p-3 text-[15px] outline-none focus:border-ink-800"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={mailto}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-ink-800 px-6 text-[15px] font-semibold text-white hover:bg-ink-700"
        >
          <Mail className="h-4 w-4" /> Enviar por email
        </a>
        <a
          href={wa}
          target="_blank"
          rel="noopener"
          className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-6 text-[15px] font-semibold text-[#052e16]"
        >
          <MessageCircle className="h-4 w-4" /> Enviar por WhatsApp
        </a>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-sand-500">
        Al enviarlo queda registrada la fecha de tu solicitud, que es la que cuenta a los efectos del plazo legal.
      </p>
    </div>
  );
}
