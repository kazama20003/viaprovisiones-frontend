# VIA Provisiones — Frontend

Aplicación de tienda y panel de administración creada con Next.js y React. Las vistas del diseño están implementadas como componentes JSX; las imágenes se sirven desde `public/storefront/img` y el logo está integrado en los componentes.

## Ejecutar el proyecto

```bash
pnpm install
pnpm dev
```

Abre `http://localhost:3000` o el puerto que indique Next.js. Para verificar la compilación de producción, ejecuta `pnpm build`.

## Estructura

- `app/design-views/`: componentes React de las vistas de tienda, administración y móvil.
- `app/native-view.jsx`: registro y carga de componentes compartidos.
- `app/design-runtime.jsx`: estado e interacciones conservados del diseño de referencia.
- `app/view-map.ts`: relación entre rutas y vistas.
- `app/enlaces/`: página de enlaces responsive.
- `public/storefront/img/`: imágenes y recursos gráficos.

La portada está en `/tienda`, el panel en `/dashboard` y la página de enlaces en `/enlaces`. Las rutas de inventario, pedidos, caja y las demás secciones se encuentran en `app/view-map.ts`.

Los productos, pedidos, importes y usuarios incluidos son datos de ejemplo del diseño. Para operar con datos reales es necesario conectar las vistas a un backend y configurar autenticación, pagos y persistencia.

