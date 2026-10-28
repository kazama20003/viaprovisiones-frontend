export type ProductoTienda = {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  precio: number;
  imagen: string | null;
  textoAlternativo: string;
  destacado: boolean;
  stockDisponible: number;
};

export type ListaProductos = { datos: ProductoTienda[] };
export type Credenciales = { correo: string; clave: string; recordarSesion: boolean };
export type UsuarioSesion = { id: string; nombre: string; correo: string; roles: string[]; permisos: string[] };
export type ClientePanel = { id: string; nombre: string; tipoCliente: string; razonSocial: string | null; correo: string | null; telefono: string | null; limiteCredito: number; condicionPagoDias: number; tipoDocumento: string; numeroDocumento: string | null };
export type PedidoPanel = { id: string; numero: string; estado: string; estadoPago: string; canal: string; creadoEn: string; total: number; cliente: { nombre: string; tipoCliente: string }; lineas: { id: string; sku: string; descripcion: string; cantidad: number; precioUnitario: number; totalLinea: number }[] };
export type ResumenPanel = { productos: number; clientes: number; pedidos: number; pedidosHoy: number; ventasHoy: number };

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3002/api/v1").replace(/\/$/, "");

export class ErrorApi extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

async function request<T>(ruta: string, init: RequestInit = {}): Promise<T> {
  let respuesta: Response;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      credentials: "include",
      ...init,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw error;
    throw new Error("No se pudo conectar con el servidor. Comprueba que el backend esté iniciado y permita el acceso desde esta página.");
  }

  if (!respuesta.ok) {
    const error = await respuesta.json().catch(() => null);
    const mensaje = typeof error?.message === "string" ? error.message : "El servidor no pudo completar la solicitud.";
    throw new ErrorApi(mensaje, respuesta.status);
  }

  return (await respuesta.json()) as T;
}

export function listarProductos(signal?: AbortSignal) {
  return request<ListaProductos>("/tienda/productos", { signal });
}

export function iniciarSesion(credenciales: Credenciales) {
  return request<{ datos: UsuarioSesion }>("/sesion/iniciar", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(credenciales),
  });
}

export function obtenerSesion(signal?: AbortSignal) {
  return request<{ datos: UsuarioSesion }>("/sesion/actual", { signal });
}

export function cerrarSesion() {
  return request<{ datos: { cerrada: boolean } }>("/sesion/cerrar", { method: "POST" });
}

export function listarClientes(signal?: AbortSignal) {
  return request<{ datos: ClientePanel[] }>("/clientes", { signal });
}

export function listarProductosAdministracion(signal?: AbortSignal) {
  return request<{ datos: ProductoAdmin[] }>("/productos", { signal });
}

export type DetallesProducto = { peso: string; medidas: string; garantia: string; tipoEnvio: string; etiquetas: string[]; colores: string[]; capacidades: string[] };
export type ProductoAdmin = { id: string; sku: string; nombre: string; descripcion: string | null; marca: string | null; codigoBarras: string | null; estado: string; categoria: string | null; categoriaId: string | null; precio: number; precios: Record<string, number>; datosAdicionales: Partial<DetallesProducto>; variantes: { sku: string; atributos: { color?: string; capacidad?: string }; stock: number }[]; historial: { accion: string; creadoEn: string }[]; imagen: string | null; archivos: ArchivoProducto[]; stockDisponible: number; stockMinimo: number; visibleEnTienda: boolean; destacado: boolean; permiteDelivery: boolean; permiteAgencia: boolean; permiteRecojo: boolean; lotes: { id: string; codigo: string; costoUnitario: number; fechaIngreso: string; garantiaHasta: string | null; estado: string; proveedor: { nombre: string } | null; existencias: { cantidadFisica: number; cantidadReservada: number; almacen: { id: string; nombre: string; codigo: string } }[] }[] };
export type CategoriaAdmin = { id: string; nombre: string; descripcion: string | null; activa: boolean; _count: { productos: number } };
export function listarCategorias(signal?: AbortSignal) { return request<{ datos: CategoriaAdmin[] }>('/categorias', { signal }); }
export function guardarCategoria(id: string | null, datos: { nombre?: string; descripcion?: string; activa?: boolean }) { return request(`/categorias${id ? '/' + encodeURIComponent(id) : ''}`, { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos) }); }
export type ArchivoProducto = { id: string; tipo: 'imagen' | 'video'; mime: string; tamano: number; url: string; principal: boolean };
export function subirArchivoProducto(id: string, archivo: File) {
  const body = new FormData(); body.append('archivo', archivo);
  return request<{ datos: ArchivoProducto }>(`/productos/${encodeURIComponent(id)}/archivos`, { method: 'POST', body });
}
export function elegirImagenPrincipal(productoId: string, id: string) {
  return request(`/productos/${encodeURIComponent(productoId)}/archivos/${encodeURIComponent(id)}/principal`, { method: 'POST' });
}
export type ProductoGuardar = { nombre: string; sku: string; descripcion: string; marca: string; codigoBarras: string; estado: string; categoriaId: string | null; datosAdicionales: DetallesProducto; visibleEnTienda: boolean; destacado: boolean; permiteDelivery: boolean; permiteAgencia: boolean; permiteRecojo: boolean; stockMinimo: number; precios: Record<string, number> };
export function guardarProducto(id: string | null, datos: ProductoGuardar) {
  return request<{ datos: { id: string } }>(id ? `/productos/${encodeURIComponent(id)}` : '/productos', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos) });
}
export type LoteGuardar = { productoId: string; proveedor: string; cantidad: number; costoUnitario: number; fechaIngreso: string; garantiaHasta: string; ubicacion: string; revisar: boolean };
export function registrarLote(datos: LoteGuardar) {
  return request<{ datos: { id: string; codigo: string; estado: string } }>('/inventario/lotes', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos) });
}
export function operarLote(id: string, accion: 'aprobar' | 'ajustar' | 'trasladar', datos: Record<string, unknown> = {}) {
  return request(`/inventario/lotes/${encodeURIComponent(id)}/${accion}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos) });
}

export function listarPedidos(signal?: AbortSignal) {
  return request<{ datos: PedidoPanel[] }>("/pedidos", { signal });
}

export function obtenerResumenPanel(signal?: AbortSignal) {
  return request<{ datos: ResumenPanel }>("/panel/resumen", { signal });
}

export function avanzarPedido(id: string, estado: string) {
  return request<{ datos: PedidoPanel }>(`/pedidos/${encodeURIComponent(id)}/transiciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ estado }),
  });
}
