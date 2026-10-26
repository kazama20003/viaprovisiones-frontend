export type DesignView = { path: string; file: string; label: string };

export const designViews: DesignView[] = [
  { path: "/tienda", file: "Main.dc.html", label: "Inicio de tienda" },
  { path: "/categoria", file: "Categoria.dc.html", label: "Catálogo por categoría" },
  { path: "/producto", file: "Producto.dc.html", label: "Ficha de producto" },
  { path: "/carrito", file: "Carrito.dc.html", label: "Carrito" },
  { path: "/checkout", file: "Checkout.dc.html", label: "Pago y checkout" },
  { path: "/seguimiento", file: "Seguimiento.dc.html", label: "Seguimiento de pedido" },
  { path: "/mi-cuenta", file: "MiCuenta.dc.html", label: "Mi cuenta" },
  { path: "/busqueda", file: "Busqueda.dc.html", label: "Resultados de búsqueda" },
  { path: "/no-encontrado", file: "Error404.dc.html", label: "Página no encontrada" },
  { path: "/empresas", file: "Empresas.dc.html", label: "Empresas" },
  { path: "/admin", file: "Admin.dc.html", label: "Administración" },
  { path: "/admin/login", file: "AdminLogin.dc.html", label: "Acceso de administración" },
  { path: "/admin/movil", file: "AdminMovil.dc.html", label: "Administración móvil" },
  { path: "/dashboard", file: "Dashboard.dc.html", label: "Dashboard" },
  { path: "/inventario", file: "Inventario.dc.html", label: "Inventario" },
  { path: "/pedidos", file: "Pedidos.dc.html", label: "Pedidos" },
  { path: "/cotizaciones", file: "Cotizaciones.dc.html", label: "Cotizaciones" },
  { path: "/clientes", file: "Clientes.dc.html", label: "Clientes" },
  { path: "/compras", file: "Compras.dc.html", label: "Compras y proveedores" },
  { path: "/reportes", file: "Reportes.dc.html", label: "Reportes" },
  { path: "/ajustes", file: "Ajustes.dc.html", label: "Ajustes" },
  { path: "/admin/menu", file: "MenuPanel.dc.html", label: "Menú del panel" },
  { path: "/admin/menu-abierto", file: "PanelMenuAbierto.dc.html", label: "Menú abierto" },
  { path: "/caja", file: "Caja.dc.html", label: "Caja del día" },
  { path: "/gastos", file: "Gastos.dc.html", label: "Gastos" },
  { path: "/comprobantes", file: "Comprobantes.dc.html", label: "Comprobantes SUNAT" },
  { path: "/punto-de-venta", file: "PuntoVenta.dc.html", label: "Punto de venta" },
  { path: "/producto/editar", file: "ProductoEditar.dc.html", label: "Crear o editar producto" },
  { path: "/pedido/detalle", file: "PedidoDetalle.dc.html", label: "Detalle de pedido" },
  { path: "/kardex", file: "Kardex.dc.html", label: "Kardex del producto" },
  { path: "/devoluciones", file: "Devoluciones.dc.html", label: "Devoluciones y garantías" },
  { path: "/traslados", file: "Traslados.dc.html", label: "Traslados" },
  { path: "/ofertas", file: "Ofertas.dc.html", label: "Ofertas y cupones" },
  { path: "/banners", file: "Banners.dc.html", label: "Banners y portada" },
  { path: "/notificaciones", file: "Notificaciones.dc.html", label: "Notificaciones y perfil" },
  { path: "/enlaces", file: "Enlaces.dc.html", label: "Enlaces y QR" },
  { path: "/movil/tienda", file: "TiendaMovil.dc.html", label: "Tienda en el celular" },
  { path: "/movil/admin", file: "AdminMovil.dc.html", label: "Panel móvil" },
  { path: "/movil/finanzas", file: "MovilFinanzas.dc.html", label: "Finanzas en móvil" },
  { path: "/movil/almacen", file: "MovilAlmacen.dc.html", label: "Almacén en móvil" },
  { path: "/movil/marketing", file: "MovilMarketing.dc.html", label: "Marketing en móvil" },
  { path: "/cartel-qr", file: "CartelQR.dc.html", label: "Cartel QR para tienda" },
  { path: "/cabecera", file: "Header.dc.html", label: "Cabecera compartida" },
  { path: "/pie", file: "Footer.dc.html", label: "Pie de página compartido" },
  { path: "/dashboard/productos/nuevo", file: "ProductoEditar.dc.html", label: "Nuevo producto" },
];

const byPath = new Map(designViews.map((view) => [view.path, view]));
const byFile = new Map(designViews.map((view) => [view.file, view]));

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

export function viewForFile(file: string): DesignView | undefined {
  return byFile.get(file);
}
