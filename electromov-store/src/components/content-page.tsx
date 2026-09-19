import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export function ContentPage({
  section,
  sectionHref,
  title,
  intro,
  children,
  updatedAt,
}: {
  section: string;
  sectionHref: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  updatedAt?: string;
}) {
  return (
    <div className="container-page py-10 sm:py-14">
      <nav aria-label="Migas de pan" className="mb-6 flex flex-wrap items-center gap-1.5 text-[13px] text-sand-500">
        <Link href="/" className="hover:text-ink-800">
          Inicio
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <Link href={sectionHref} className="hover:text-ink-800">
          {section}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" aria-hidden />
        <span className="text-ink-800">{title}</span>
      </nav>

      <header className="max-w-3xl">
        <h1 className="text-balance-title text-[34px] font-semibold leading-[1.1] tracking-[-0.035em] text-ink-800 sm:text-[40px]">
          {title}
        </h1>
        {intro ? <p className="mt-4 text-[17px] leading-relaxed text-sand-600">{intro}</p> : null}
        {updatedAt ? <p className="mt-3 text-[13px] text-sand-500">Última actualización: {updatedAt}</p> : null}
      </header>

      <div className="prose-em mt-10 max-w-3xl text-[16px] text-sand-700">{children}</div>

      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Inicio", url: "/" },
          { name: section, url: sectionHref },
          { name: title, url: sectionHref },
        ])}
      />
    </div>
  );
}
