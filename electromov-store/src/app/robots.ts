import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

/**
 * Los buscadores tradicionales y los buscadores de IA se tratan distinto a propósito:
 * queremos aparecer en las respuestas de ChatGPT, Perplexity, Gemini y Claude, así que
 * sus crawlers tienen acceso explícito al catálogo y a las guías.
 */
export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/admin/*", "/api/", "/checkout", "/checkout/*"];

  const aiCrawlers = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "Perplexity-User",
    "ClaudeBot",
    "Claude-User",
    "Claude-SearchBot",
    "Google-Extended",
    "Applebot-Extended",
    "Bingbot",
    "meta-externalagent",
    "Amazonbot",
    "cohere-ai",
    "YouBot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: ["/", "/llms.txt", "/api/catalog"], disallow })),
    ],
    sitemap: abs("/sitemap.xml"),
    host: abs("/").replace(/\/$/, ""),
  };
}
