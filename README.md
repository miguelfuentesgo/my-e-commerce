# My E-Commerce construido con Nuxt

Prerequisitos:
Instalar y tener en el path Node

## Clona este repositorio

Muevete a la carpeta que acabas de clonar y asegurate de instalar las dependencias.


```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Servidor en local en modo desarrollo

El servidor de desarrollo lo encuentras en `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```


## Arquitectura

```
my-e-commerce/
├── server/
│   └── api/
│       └── products/
│           └── index.get.ts   # Proxy hacia fakestoreapi (patrón BFF)
├── app/
│   ├── assets/css/            # Variables CSS globales (temas claro/oscuro)
│   ├── components/            # Componentes reutilizables (ProductCard, AppBanner)
│   ├── composables/           # useProducts — lógica de fetching reactivo
│   ├── layouts/               # Layout global con header, nav y carrito
│   ├── pages/                 # Rutas: /, /products/[id], /orders
│   └── stores/                # Pinia: products, cart, orders
├── app.config.ts              # Tema de Nuxt UI (colores, variantes)
└── nuxt.config.ts             # Módulos y configuración global
```

**Flujo de datos:** `página` → `composable (useProducts)` → `server/api` → `fakestoreapi` → `Pinia store` → `componentes`

## Decisiones técnicas

Se implementan las siguientes herramientas con Nuxt:

- **Tailwind:** Permite cambiar y ajustar diseños rápidamente. Además, facilita implementar la estrategia mobile first, construyendo siempre desde dispositivos pequeños hacia los más grandes.

- **Pinia:** Manejador de estado estándar para Vue y Nuxt. Permite gestionar de forma global los productos, órdenes y el carrito de compras.

- **Nuxt UI:** Librería de componentes que se integra de forma nativa con Vue y Nuxt. Ofrece componentes modernos con customización rápida, ideal para un e-commerce.

- **IBM Plex Sans:** Elegida luego de investigar las fuentes que mejor se adaptan a la experiencia de un e-commerce.

- **Temas:** Se definen un tema claro y uno oscuro, manejando los colores mediante variables CSS globales en `main.css`.

- **Colores:** Se usaron amarillos y naranjas, colores que dominan el mercado en plataformas como Mercado Libre, Temu y Amazon.

- **API con patrón BFF:** El consumo de productos se realiza a través de `server/api`, que actúa como proxy hacia `fakestoreapi`. Esto permite ocultar API keys, mantener anónimos los recursos externos y centralizar la transformación de datos.

- **Carga lazy con skeleton:** Se usa `useAsyncData` con `server: false` para que el fetch ocurra en el cliente, mostrando un skeleton animado mientras los productos cargan, mejorando la percepción de velocidad.

- **Inglés en código:** Todo el código, variables, funciones y comentarios están escritos en inglés. El código es el único artefacto del proyecto que no debería tener idioma: cualquier desarrollador del mundo, independientemente de su lengua materna, espera leer inglés al abrir un repositorio. Mezclar idiomas en el código genera fricción innecesaria, dificulta el onboarding de nuevos miembros, rompe la coherencia con las librerías y documentación técnica (que también están en inglés) y puede convertirse en deuda técnica si el proyecto escala o se abre a colaboradores externos. Usar inglés desde el inicio no es una preferencia estética, es una decisión de mantenibilidad.
