export type ProductoTienda = {
  id: string;
  sku: string;
  nombre: string;
  descripcion: string | null;
  categoria: string | null;
  categoriasRuta: string[];
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
export type DetalleTienda = { id: string; nombre: string; sku: string; marca: string | null; descripcion: string | null; categoria: { nombre: string } | null; imagenes: { url: string; textoAlternativo: string | null; esPrincipal: boolean }[]; precios: { precioUnitario: number; cantidadMinima: number }[]; variantes: Variante[] };
export function obtenerProductoTienda(id: string, signal?: AbortSignal) { return request<{ datos: DetalleTienda }>(`/tienda/productos/${encodeURIComponent(id)}`, { signal }); }

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

export type DetallesProducto = { peso: string; medidas: string; garantia: string; tipoEnvio: string; etiquetas: string[]; colores: string[]; capacidades: string[]; atributosVariantes?: { nombre:string; valores:string[] }[] };
export type Variante = { id:string; sku:string; atributos:Record<string,string>; precioPublico:number | null; stock:number };
export type ProductoAdmin = { id: string; sku: string; nombre: string; descripcion: string | null; marca: string | null; codigoBarras: string | null; estado: string; categoria: string | null; categoriaId: string | null; precio: number; precios: Record<string, number>; datosAdicionales: Partial<DetallesProducto>; variantes: Variante[]; historial: { accion: string; creadoEn: string }[]; imagen: string | null; archivos: ArchivoProducto[]; stockDisponible: number; stockMinimo: number; visibleEnTienda: boolean; destacado: boolean; permiteDelivery: boolean; permiteAgencia: boolean; permiteRecojo: boolean; lotes: { id: string; codigo: string; varianteId: string | null; costoUnitario: number; fechaIngreso: string; garantiaHasta: string | null; estado: string; proveedor: { nombre: string } | null; existencias: { cantidadFisica: number; cantidadReservada: number; almacen: { id: string; nombre: string; codigo: string } }[] }[] };
export type CategoriaAdmin = { id: string; nombre: string; descripcion: string | null; activa: boolean; categoriaPadreId: string | null; _count: { productos: number } };
export function listarCategorias(signal?: AbortSignal) { return request<{ datos: CategoriaAdmin[] }>('/categorias', { signal }); }
export type MarcaAdmin = { id: string; nombre: string; activa: boolean };
export function listarMarcas(signal?: AbortSignal) { return request<{ datos: MarcaAdmin[] }>('/marcas', { signal }); }
export function guardarMarca(id: string | null, datos: { nombre?: string; activa?: boolean }) { return request(`/marcas${id ? '/' + encodeURIComponent(id) : ''}`, { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(datos) }); }
export function guardarCategoria(id: string | null, datos: { nombre?: string; descripcion?: string; activa?: boolean; categoriaPadreId?: string | null }) { return request(`/categorias${id ? '/' + encodeURIComponent(id) : ''}`, { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos) }); }
export type ArchivoProducto = { id: string; tipo: 'imagen' | 'video'; mime: string; tamano: number; url: string; principal: boolean };
export function subirArchivoProducto(id: string, archivo: File) {
  const body = new FormData(); body.append('archivo', archivo);
  return request<{ datos: ArchivoProducto }>(`/productos/${encodeURIComponent(id)}/archivos`, { method: 'POST', body });
}
export function elegirImagenPrincipal(productoId: string, id: string) {
  return request(`/productos/${encodeURIComponent(productoId)}/archivos/${encodeURIComponent(id)}/principal`, { method: 'POST' });
}
export type ProductoGuardar = { nombre: string; sku: string; descripcion: string; marca: string; codigoBarras: string; estado: string; categoriaId: string | null; datosAdicionales: DetallesProducto; preciosVariantes?: Record<string, number | null>; visibleEnTienda: boolean; destacado: boolean; permiteDelivery: boolean; permiteAgencia: boolean; permiteRecojo: boolean; stockMinimo: number; precios: Record<string, number> };
export function guardarProducto(id: string | null, datos: ProductoGuardar) {
  return request<{ datos: { id: string } }>(id ? `/productos/${encodeURIComponent(id)}` : '/productos', { method: id ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(datos) });
}
export type Sucursal = { id:string; codigo:string; nombre:string; direccion:string|null; activa:boolean };
export type Almacen = { id:string; codigo:string; nombre:string; direccion:string|null; tipo:'tienda'|'almacen'; activo:boolean; sucursalId:string|null; sucursal?:{id:string;nombre:string}|null };
export type MovimientoStock = { id:string; tipo:string; sentido:'entrada'|'salida'; cantidad:number; motivo:string|null; creadoEn:string; producto:{nombre:string;sku:string}; lote:{codigo:string;variante:{atributos:Record<string,string>}|null}; almacen:{nombre:string}; traslado:{numero:string}|null };
export type TrasladoStock = { id:string; numero:string; estado:'preparando'|'en_camino'|'recibido'|'cancelado'; creadoEn:string; observaciones:string|null; motivoDiferencia:string|null; movimientos:{id:string;loteId:string;cantidad:number;creadoEn:string;usuarioId:string|null}[]; almacenOrigen:{id:string;nombre:string}; almacenDestino:{id:string;nombre:string}; lineas:{id:string;loteId:string;cantidadEnviada:number;cantidadRecibida:number;producto:{nombre:string;sku:string};lote:{codigo:string;variante:{atributos:Record<string,string>;sku:string}|null}}[] };
export function listarSucursales(signal?:AbortSignal) { return request<{datos:Sucursal[]}>('/inventario/sucursales',{signal}); }
export function listarAlmacenes(signal?:AbortSignal) { return request<{datos:Almacen[]}>('/inventario/almacenes',{signal}); }
export function guardarUbicacion(tipo:'sucursales'|'almacenes',id:string|null,datos:Record<string,unknown>) { return request(`/inventario/${tipo}${id?'/'+encodeURIComponent(id):''}`,{method:id?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)}); }
export function listarMovimientos(signal?:AbortSignal) { return request<{datos:MovimientoStock[]}>('/inventario/movimientos',{signal}); }
export function listarTraslados(signal?:AbortSignal) { return request<{datos:TrasladoStock[]}>('/inventario/traslados',{signal}); }
export function crearTraslado(datos:{origenId:string;destinoId:string;lineas:{loteId:string;cantidad:number}[];observaciones:string}) { return request<{datos:{id:string;numero:string}} >('/inventario/traslados',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)}); }
export function accionarTraslado(id:string,accion:'enviar'|'recibir'|'cancelar'|'cerrar-con-diferencia',datos?:{lineas?:{lineaId:string;cantidad:number}[];motivo?:string}) { return request(`/inventario/traslados/${encodeURIComponent(id)}/${accion}`,{method:'POST',...(datos?{headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)}:{})}); }
export type LoteGuardar = { productoId: string; varianteId?: string | null; almacenId:string; proveedor: string; cantidad: number; costoUnitario: number; fechaIngreso: string; garantiaHasta: string; revisar: boolean };
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

export type ExistenciaConteo = { id:string; loteId:string; almacenId:string; cantidadFisica:number; cantidadReservada:number; almacen:{id:string;nombre:string;activo:boolean}; lote:{id:string;codigo:string;varianteId:string|null;producto:{id:string;nombre:string;sku:string};variante:{atributos:Record<string,string>;sku:string}|null} };
export type FiltrosKardex = {productoId?:string;varianteId?:string;loteId?:string;almacenId?:string;tipo?:string;pagina?:number};
export function consultarKardex(f:FiltrosKardex,signal?:AbortSignal) { const q=new URLSearchParams(); Object.entries(f).forEach(([k,v])=>{if(v)q.set(k,String(v));});return request<{datos:(MovimientoStock & {productoId:string;loteId:string;almacenId:string;lote:MovimientoStock['lote'] & {varianteId:string|null}})[];total:number;pagina:number}>(`/inventario/kardex?${q}`,{signal}); }
export function buscarExistencias(buscar:string,signal?:AbortSignal) {return request<{datos:ExistenciaConteo[];hayMas:boolean}>(`/inventario/existencias?buscar=${encodeURIComponent(buscar)}`,{signal});}
export function listarConteos(signal?:AbortSignal) {return request<{datos:{id:string;loteId:string;almacenId:string;stockAnterior:number;stockReservado:number;stockContado:number;diferencia:number;motivo:string|null;creadoEn:string;lote:{codigo:string;producto:{nombre:string};variante:{atributos:Record<string,string>}|null};almacen:{nombre:string};usuario:{nombre:string}}[]}>(`/inventario/conteos`,{signal});}
export function registrarConteo(datos:{loteId:string;almacenId:string;stockEsperado:number;reservadoEsperado:number;contado:number;motivo:string}) {return request<{datos:{id:string;diferencia:number}}>(`/inventario/conteos`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
