import Link from "next/link";
import { LayoutDashboard, LogOut, Package, Settings, ShoppingCart, ExternalLink } from "lucide-react";
import { isAuthenticated } from "@/lib/auth";
import { logoutAction } from "@/app/(admin)/admin/actions";
import { demoMode } from "@/lib/repo";
import { Logo } from "@/components/logo";

const LINKS = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/admin/configuracion", label: "Configuración", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authed = await isAuthenticated();

  if (!authed) return <div className="min-h-dvh bg-sand-50">{children}</div>;

  return (
    <div className="min-h-dvh bg-sand-50">
      <header className="border-b border-sand-200 bg-white">
        <div className="container-page flex h-16 items-center gap-6">
          <Link href="/admin" className="flex items-center gap-2">
            <Logo />
            <span className="hidden rounded-full bg-ink-800 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-volt-300 sm:inline">
              Panel
            </span>
          </Link>

          <nav className="no-scrollbar ml-auto flex items-center gap-1 overflow-x-auto">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-[14px] font-medium text-sand-600 transition-colors hover:bg-sand-100 hover:text-ink-800"
              >
                <Icon className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            ))}
            <Link
              href="/"
              target="_blank"
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-sand-500 hover:text-ink-800"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              <span className="hidden lg:inline">Ver tienda</span>
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-full px-3 py-2 text-[14px] font-medium text-sand-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden lg:inline">Salir</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      {demoMode ? (
        <div className="border-b border-amber-200 bg-amber-50">
          <div className="container-page py-2.5 text-[13.5px] text-amber-900">
            <strong>Modo demo:</strong> no hay base de datos conectada. Podés editar y ver el resultado, pero los
            cambios se pierden al reiniciar el servidor. Conectá Postgres con la variable <code>DATABASE_URL</code> para
            que todo quede guardado.
          </div>
        </div>
      ) : null}

      <main className="container-page py-8">{children}</main>
    </div>
  );
}
