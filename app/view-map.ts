export type DesignView = { path: string; name: string; label: string };

export const designViews: DesignView[] = [
  { path: "/tienda", name: "Main", label: "Inicio de tienda" },
  { path: "/categoria", name: "Categoria", label: "Catálogo por categoría" },
  { path: "/producto", name: "Producto", label: "Ficha de producto" },
  { path: "/carrito", name: "Carrito", label: "Carrito" },
  { path: "/checkout", name: "Checkout", label: "Pago y checkout" },
  { path: "/seguimiento", name: "Seguimiento", label: "Seguimiento de pedido" },
  { path: "/mi-cuenta", name: "MiCuenta", label: "Mi cuenta" },
  { path: "/busqueda", name: "Busqueda", label: "Resultados de búsqueda" },
  { path: "/no-encontrado", name: "Error404", label: "Página no encontrada" },
  { path: "/empresas", name: "Empresas", label: "Empresas" },
  { path: "/admin", name: "Admin", label: "Administración" },
  { path: "/admin/login", name: "AdminLogin", label: "Acceso de administración" },
  { path: "/admin/movil", name: "AdminMovil", label: "Administración móvil" },
  { path: "/dashboard", name: "Dashboard", label: "Dashboard" },
  { path: "/inventario", name: "Inventario", label: "Inventario" },
  { path: "/categorias", name: "CategoriasAdmin", label: "Administrar categorías" },
  { path: "/marcas", name: "MarcasAdmin", label: "Administrar marcas" },
  { path: "/pedidos", name: "Pedidos", label: "Pedidos" },
  { path: "/cotizaciones", name: "Cotizaciones", label: "Cotizaciones" },
  { path: "/clientes", name: "Clientes", label: "Clientes" },
  { path: "/compras", name: "Compras", label: "Compras y proveedores" },
  { path: "/reportes", name: "Reportes", label: "Reportes" },
  { path: "/ajustes", name: "Ajustes", label: "Ajustes" },
  { path: "/admin/menu", name: "MenuPanel", label: "Menú del panel" },
  { path: "/admin/menu-abierto", name: "PanelMenuAbierto", label: "Menú abierto" },
  { path: "/caja", name: "Caja", label: "Caja del día" },
  { path: "/gastos", name: "Gastos", label: "Gastos" },
  { path: "/comprobantes", name: "Comprobantes", label: "Comprobantes SUNAT" },
  { path: "/punto-de-venta", name: "PuntoVenta", label: "Punto de venta" },
  { path: "/producto/editar", name: "ProductoEditar", label: "Crear o editar producto" },
  { path: "/pedido/detalle", name: "PedidoDetalle", label: "Detalle de pedido" },
  { path: "/kardex", name: "Kardex", label: "Kardex del producto" },
  { path: "/devoluciones", name: "Devoluciones", label: "Devoluciones y garantías" },
  { path: "/traslados", name: "Traslados", label: "Traslados" },
  { path: "/ofertas", name: "Ofertas", label: "Ofertas y cupones" },
  { path: "/banners", name: "Banners", label: "Banners y portada" },
  { path: "/notificaciones", name: "Notificaciones", label: "Notificaciones y perfil" },
  { path: "/enlaces", name: "Enlaces", label: "Enlaces y QR" },
  { path: "/movil/tienda", name: "TiendaMovil", label: "Tienda en el celular" },
  { path: "/movil/admin", name: "AdminMovil", label: "Panel móvil" },
  { path: "/movil/finanzas", name: "MovilFinanzas", label: "Finanzas en móvil" },
  { path: "/movil/almacen", name: "MovilAlmacen", label: "Almacén en móvil" },
  { path: "/movil/marketing", name: "MovilMarketing", label: "Marketing en móvil" },
  { path: "/cartel-qr", name: "CartelQR", label: "Cartel QR para tienda" },
  { path: "/cabecera", name: "Header", label: "Cabecera compartida" },
  { path: "/pie", name: "Footer", label: "Pie de página compartido" },
  { path: "/dashboard/productos/nuevo", name: "ProductoEditar", label: "Nuevo producto" },
];

const byPath = new Map(designViews.map((view) => [view.path, view]));

export function viewForPath(path: string): DesignView | undefined {
  const normalized = `/${path.split("?")[0].split("#")[0].split("/").filter(Boolean).join("/")}`;
  const exact = byPath.get(normalized);
  if (exact) return exact;
  const parts = normalized.split("/").filter(Boolean);
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    const suffix = `/${parts.slice(index).join("/")}`;
    const match = byPath.get(suffix);
    if (match) return match;
  }
  return undefined;
}

