# VIA Provisiones — frontend

Tienda y panel construidos con Next.js y React. Las pantallas conservan el diseño existente; la tienda consulta los productos publicados del backend con TanStack Query.

## Desarrollo local

1. Configura PostgreSQL, `DATABASE_URL` y los campos `BOOTSTRAP_*` del `.env` del backend. El bootstrap crea la empresa, un rol administrador y su usuario.
2. Aplica la migración y prepara la cuenta inicial. Copia el UUID que imprime a `EMPRESA_ID` en el `.env` del backend y reinicia el servidor:

   ```powershell
   cd ..\viaprovisiones-backend
   pnpm db:migrate:dev
   pnpm db:bootstrap
   pnpm start:dev
   ```

3. Copia `.env.example` a `.env.local` en esta carpeta. La URL por defecto es `http://localhost:3002/api/v1`.
4. Inicia la interfaz:

   ```powershell
   pnpm dev
   ```

La API de salud está en `/api/v1/salud` y el catálogo está en `/api/v1/tienda/productos`. El catálogo filtra por empresa y solo devuelve productos publicados y visibles en tienda. Categorías y búsqueda usan el mismo catálogo; muestran estados de carga y error.

Las marcas se administran en Almacén → Marcas. En cada producto guardado se puede escanear un código con la cámara, generar una etiqueta Code 128 y descargar el QR de su ficha. Configura `NEXT_PUBLIC_STOREFRONT_URL` con la dirección pública de la tienda antes de generar QR para compartir; sin esa variable se usa el origen actual. El producto debe estar publicado y visible para que su ficha se abra al público. La cámara requiere HTTPS o localhost y permiso del navegador.

En la ficha de producto se pueden definir hasta tres atributos de variantes y sus valores, con un máximo de 100 combinaciones. Cada combinación puede tener un precio público propio o heredar el precio general. Al ingresar un lote de un producto con variantes se selecciona la variante; los lotes anteriores sin variante siguen vinculados al producto. Una variante con stock físico no se puede quitar. La ficha pública muestra la disponibilidad y el precio de la variante seleccionada; el carrito y el proceso de compra todavía no están conectados a esa selección.

El ingreso al panel usa una cookie HttpOnly: 8 horas por defecto o 30 días al marcar “Mantener sesión iniciada”. Las páginas protegidas comprueban la sesión y redirigen al ingreso cuando vence. Los enlaces de “Cerrar sesión” revocan la sesión en el backend y limpian las consultas del panel. Clientes, productos, pedidos y el resumen consultan endpoints protegidos por permisos y filtrados por empresa. La recuperación por correo aún requiere configurar un proveedor de correo; el formulario informa que se solicite el restablecimiento al administrador. Otras pantallas administrativas todavía requieren conectar sus consultas y acciones. Las vistas y recursos están en `app/design-views/` y `public/storefront/img/`.
