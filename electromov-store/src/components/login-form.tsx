"use client";

import { useActionState } from "react";
import { Lock } from "lucide-react";
import { loginAction } from "@/app/(admin)/admin/actions";
import { Logo } from "@/components/logo";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <form action={formAction} className="w-full max-w-sm rounded-2xl border border-sand-200 bg-white p-8 shadow-[var(--shadow-card)]">
      <Logo />
      <h1 className="mt-6 text-[22px] font-semibold tracking-tight text-ink-800">Panel de administración</h1>
      <p className="mt-2 text-[14.5px] leading-relaxed text-sand-600">
        Desde acá administrás productos, precios, stock y pedidos de la tienda.
      </p>

      <label className="mt-6 block">
        <span className="text-[13px] font-semibold text-ink-800">Contraseña</span>
        <input
          type="password"
          name="password"
          required
          autoFocus
          autoComplete="current-password"
          className="mt-1.5 h-11 w-full rounded-xl border border-sand-200 px-3 text-[15px] outline-none focus:border-ink-800"
        />
      </label>

      {state?.error ? <p className="mt-3 text-[13.5px] font-medium text-red-600">{state.error}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink-800 text-[15px] font-semibold text-white hover:bg-ink-700 disabled:opacity-60"
      >
        <Lock className="h-4 w-4" /> {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
