# ElectroMov Store

Storefront de comercio electrónico para **electromov.com.ar**: catálogo de carga para vehículos eléctricos, checkout con Mercado Pago, panel de administración propio y una capa completa de SEO, SEM y optimización para buscadores de IA.

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Drizzle ORM · Mercado Pago SDK v2.

---

## Puesta en marcha en Vercel (10 minutos)

### 1. Importar el proyecto

1. Entrá a [vercel.com/new](https://vercel.com/new) y elegí **Import Git Repository**.
2. Seleccioná este repositorio. Vercel detecta Next.js solo: no hay que tocar ningún ajuste de build.
3. **Deploy**. En un par de minutos el sitio está online en una URL `*.vercel.app` y ya funciona completo en modo demo.

### 2. Conectar la base de datos

Sin base de datos el sitio funciona, pero los cambios del panel no se guardan.

1. En el proyecto de Vercel: **Storage → Create Database → Neon** (plan gratuito alcanza y sobra para arrancar).
2. Vercel inyecta `DATABASE_URL` automáticamente.
3. Desde tu máquina, con el repo clonado:
   ```bash
   npm install
   echo "DATABASE_URL=<la connection string>" > .env.local
   npm run db:push     # crea las tablas
   npm run db:seed     # carga los 5 productos y la configuración
   ```
   O, más simple: entrá a `/admin/configuracion` y tocá **Cargar catálogo inicial**.

### 3. Definir la contraseña del panel

En **Settings → Environment Variables**:

| Variable | Valor |
|---|---|
| `ADMIN_PASSWORD` | La contraseña con la que vas a entrar a `/admin` |
| `AUTH_SECRET` | Una clave aleatoria: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | `https://electromov.com.ar` |

Redeploy y listo: entrás a `https://electromov.com.ar/admin`.

### 4. Apuntar el dominio

En **Settings → Domains**, agregá `electromov.com.ar` y `www.electromov.com.ar`. Vercel te indica qué registros cambiar en tu proveedor de DNS (un `A` a `76.76.21.21` y un `CNAME` para `www`). El certificado SSL se emite solo.

### 5. Activar Mercado Pago

Ver la sección [Mercado Pago](#mercado-pago) más abajo.

---

## Qué incluye

### Tienda

- **Home** con hero, categorías, destacados, herramientas, proceso, bloque B2B y FAQ.
- **Catálogo** con filtros por categoría y ordenamiento, y páginas propias por categoría.
- **Ficha de producto** con galería, descripción larga, características, ficha técnica, FAQ propia, simulador de carga y venta cruzada.
- **Carrito** persistente (sobrevive al refresh) con barra de progreso hacia el envío gratis.
- **Checkout** en un solo paso con validación de precios del lado del servidor.
- **Buscador** con atajo `⌘K` y página de resultados indexable.

### Herramientas de conversión

| Ruta | Qué hace |
|---|---|
| `/asesor` | Cuatro preguntas → recomendación del equipo correcto con justificación técnica y venta cruzada. |
| `/calculadora` | Ahorro eléctrico vs nafta con los números del usuario, y repago del wallbox. |
| `/compatibilidad` | Tabla de compatibilidad + una página por vehículo (12 páginas de SEO programático). |
| `/guias/instalar-wallbox` | Guía técnica de instalación con marcado `HowTo`. |

### Panel de administración (`/admin`)

- Resumen con facturación, pedidos, alertas de stock bajo, precios sin confirmar y estado de las integraciones.
- ABM completo de productos: precios, stock, contenido de la ficha, imágenes, SEO y datos técnicos.
- Pedidos con cambio de estado y acceso directo al WhatsApp del cliente.
- Configuración: tipo de cambio, cuotas, umbral de envío gratis, tarifa eléctrica, precio de la nafta y barra de anuncios.

### SEO técnico

- Metadata completa por página, canonical, Open Graph y Twitter Card.
- Imagen Open Graph generada dinámicamente (`/opengraph-image`).
- JSON-LD: `Organization`, `Store`, `WebSite` con `SearchAction`, `Product` con `Offer`, `shippingDetails` y `MerchantReturnPolicy`, `BreadcrumbList`, `FAQPage`, `ItemList` y `HowTo`.
- `sitemap.xml` dinámico con imágenes y `robots.txt` generado.
- Renderizado estático con revalidación (ISR): First Load JS ~102 kB compartido.

### SEM

- `/feed/google` — feed RSS 2.0 para Google Merchant Center (Shopping y Performance Max).
- `/feed/meta` — catálogo CSV para Instagram Shopping y campañas Advantage+.
- GA4, Google Ads (con conversiones mejoradas) y Meta Pixel detrás de variables de entorno.
- Eventos de e-commerce completos: `view_item`, `add_to_cart`, `begin_checkout`, `add_payment_info`, `purchase`, `search`, `generate_lead`.
- **Consent Mode v2** con banner de cookies: arranca denegado y se actualiza al aceptar.
- Protección contra doble conteo de conversiones al recargar la página de gracias.

### Búsquedas de IA (AEO / GEO)

Esto es lo que hace que ChatGPT, Perplexity, Gemini y Claude puedan responder con datos correctos de ElectroMov:

- `/llms.txt` — índice del sitio en el formato que ya leen los crawlers de IA.
- `/llms-full.txt` — catálogo completo en texto plano: precios, specs, tiempos de carga por vehículo, condiciones comerciales y FAQ.
- `/api/catalog` — JSON estructurado con CORS abierto, para agentes e integraciones.
- `robots.txt` con permiso explícito para `GPTBot`, `OAI-SearchBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended` y compañía.
- Contenido escrito en formato "pregunta → respuesta directa", que es lo que los modelos citan.

---

## Mercado Pago

### Modo actual

Sin `MP_ACCESS_TOKEN`, el checkout **registra el pedido igual** y muestra una pantalla para coordinar el pago por WhatsApp o transferencia. Nada se rompe: se puede vender desde el día uno.

### Activarlo

1. Entrá a [mercadopago.com.ar/developers/panel/app](https://www.mercadopago.com.ar/developers/panel/app) y creá una aplicación de tipo **Pagos online → Checkout Pro**.
2. Copiá las credenciales **de prueba** primero:
   ```
   MP_ACCESS_TOKEN=TEST-...
   NEXT_PUBLIC_MP_PUBLIC_KEY=TEST-...
   ```
   El checkout muestra un cartel de "modo de prueba" mientras estén activas.
3. Configurá el webhook en **Tus integraciones → Webhooks → Configurar notificaciones**:
   - URL: `https://electromov.com.ar/api/webhooks/mercadopago`
   - Evento: **Pagos**
   - Copiá la clave secreta que te da MP a `MP_WEBHOOK_SECRET`.
4. Probá una compra completa con las [tarjetas de prueba](https://www.mercadopago.com.ar/developers/es/docs/checkout-pro/additional-content/test-cards).
5. Cuando funcione, reemplazá las credenciales por las de producción (`APP_USR-...`) y volvé a configurar el webhook con la clave de producción.

El pago se muestra embebido con **Wallet Brick**, sin salir del sitio, y el webhook actualiza el estado del pedido (`pending` → `paid` / `rejected`) validando la firma `x-signature`.

---

## Desarrollo local

```bash
npm install
cp .env.example .env.local     # completá lo que necesites
npm run dev                    # http://localhost:3000
```

Scripts:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run db:push` | Crea o actualiza las tablas según el schema |
| `npm run db:seed` | Carga el catálogo inicial |

---

## Estructura

```
src/
  app/
    (store)/            Tienda pública (layout con header, footer y carrito)
      page.tsx          Home
      productos/        Catálogo y ficha de producto
      categoria/        Páginas por categoría
      asesor/           Asesor de carga
      calculadora/      Calculadora de ahorro
      compatibilidad/   Tabla + página por vehículo
      checkout/         Checkout y página de resultado
      b2b/ ayuda/ legales/ guias/ buscar/
    (admin)/admin/      Panel (layout propio, sin chrome de la tienda)
    api/                checkout, webhook de MP, catálogo JSON
    feed/               Google Merchant y Meta
    llms.txt/ llms-full.txt/ sitemap.ts robots.ts opengraph-image.tsx
  components/           UI y componentes de cliente
  data/catalog.ts       Catálogo semilla: productos, categorías, vehículos, FAQ
  lib/
    repo.ts             Capa de datos (Postgres con fallback a memoria)
    db/                 Schema y conexión Drizzle
    mercadopago.ts      Preferencias, pagos y validación de webhook
    seo.tsx             Generadores de JSON-LD
    money.ts            Conversión USD → ARS, redondeo comercial, cuotas
    auth.ts             Sesión del panel (JWT en cookie httpOnly)
```

---

## Pendientes antes de salir a producción

- [ ] **Fotos reales de producto.** Las ilustraciones SVG actuales son placeholders; Google Merchant Center no acepta SVG, necesita JPG o PNG.
- [ ] **Confirmar los precios** de los cuatro productos marcados como "revisar" en el panel. Solo el Wallbox tiene precio confirmado (USD 540).
- [ ] **Revisar el umbral de envío gratis** ($80.000): con los precios actuales todos los productos superan ese monto, así que el envío sale gratis siempre.
- [ ] Cargar `NEXT_PUBLIC_GA_ID` y `NEXT_PUBLIC_GOOGLE_ADS_ID` para empezar a medir.
- [ ] Dar de alta el feed en Merchant Center y en Meta Commerce Manager.
- [ ] Verificar la propiedad del dominio en Google Search Console y enviar el sitemap.
- [ ] Definir la razón social y el CUIT que se muestran en los legales.
- [ ] Integrar facturación automática (ARCA / TusFacturas) y cotización de envíos (Andreani / OCA) cuando el volumen lo justifique.
