/**
 * Carga el catálogo inicial en la base de datos.
 *
 *   1. npm run db:push    (crea las tablas a partir del schema)
 *   2. npm run db:seed    (carga los productos y la configuración)
 *
 * Requiere DATABASE_URL en el entorno. También se puede hacer desde
 * el panel: /admin/configuracion > "Cargar catálogo inicial".
 */
import { seedDatabase } from "../src/lib/repo";
import { hasDatabase } from "../src/lib/db";

async function main() {
  if (!hasDatabase) {
    console.error("✗ Falta DATABASE_URL. Definila antes de correr el seed.");
    process.exit(1);
  }

  const count = await seedDatabase();
  console.log(`✓ Se cargaron ${count} productos y la configuración inicial.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("✗ Error cargando el catálogo:", error);
  process.exit(1);
});
