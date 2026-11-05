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
export type TrasladoStock = { id:string; numero:string; estado:'preparando'|'en_camino'|'recibido'|'cancelado'; creadoEn:string; observaciones:string|null; motivoDiferencia:string|null; movimientos:{id:string;loteId:string;almacenId:string;cantidad:number;creadoEn:string;usuarioId:string|null}[]; almacenOrigen:{id:string;nombre:string}; almacenDestino:{id:string;nombre:string}; lineas:{id:string;loteId:string;cantidadEnviada:number;cantidadRecibida:number;resoluciones:{id:string;tipo:'destino'|'origen'|'perdida'|'dano';cantidad:number;motivo:string;creadaEn:string;usuario:{nombre:string}}[];producto:{nombre:string;sku:string};lote:{codigo:string;variante:{atributos:Record<string,string>;sku:string}|null}}[] };
export function listarSucursales(signal?:AbortSignal) { return request<{datos:Sucursal[]}>('/inventario/sucursales',{signal}); }
export function listarAlmacenes(signal?:AbortSignal) { return request<{datos:Almacen[]}>('/inventario/almacenes',{signal}); }
export function guardarUbicacion(tipo:'sucursales'|'almacenes',id:string|null,datos:Record<string,unknown>) { return request(`/inventario/${tipo}${id?'/'+encodeURIComponent(id):''}`,{method:id?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)}); }
export function listarMovimientos(signal?:AbortSignal) { return request<{datos:MovimientoStock[]}>('/inventario/movimientos',{signal}); }
export function listarTraslados(signal?:AbortSignal) { return request<{datos:TrasladoStock[]}>('/inventario/traslados',{signal}); }
export function crearTraslado(datos:{origenId:string;destinoId:string;lineas:{loteId:string;cantidad:number}[];observaciones:string}) { return request<{datos:{id:string;numero:string}} >('/inventario/traslados',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)}); }
export function accionarTraslado(id:string,accion:'enviar'|'recibir'|'cancelar'|'cerrar-con-diferencia'|'resolver-diferencia',datos?:{lineas?:{lineaId:string;cantidad:number}[];motivo?:string;lineaId?:string;tipo?:string;cantidad?:number;claveIdempotencia?:string}) { return request(`/inventario/traslados/${encodeURIComponent(id)}/${accion}`,{method:'POST',...(datos?{headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)}:{})}); }
export type LoteGuardar = { productoId: string; varianteId?: string | null; almacenId:string; proveedorId?: string | null; cantidad: number; costoUnitario: number; fechaIngreso: string; garantiaHasta: string; revisar: boolean };
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

export type ProveedorCompra={id:string;nombre:string;numeroDocumento:string|null;correo:string|null;telefono:string|null;direccion:string|null;activo:boolean};
export type LineaCompra={id:string;productoId:string;varianteId:string|null;cantidadPedida:string;cantidadRecibida:string;costoUnitario:string;producto:{nombre:string;sku:string};variante:{atributos:Record<string,string>;sku:string}|null};
export type OrdenCompra={id:string;numero:string;estado:string;creadaEn:string;fechaEntregaPrevista:string|null;condicionPago:string|null;subtotal:string;impuesto:string;total:string;proveedor:ProveedorCompra;lineas:LineaCompra[];recepciones:{id:string;numero:string;recibidaEn:string;detalles:{id:string;codigoLote:string;cantidad:string;almacen:{id:string;nombre:string};lineaOrdenCompra:{producto:{nombre:string;sku:string};variante:{atributos:Record<string,string>;sku:string}|null};lote:{id:string;existencias:{cantidadFisica:string;cantidadReservada:string;almacen:{id:string;nombre:string;activo:boolean}}[]}|null;devolucionesProveedor:{id:string;numero:string;cantidad:string;motivo:string;creadoEn:string;almacen:{nombre:string}}[]}[]}[]};
export function listarProveedoresCompra(signal?:AbortSignal){return request<{datos:ProveedorCompra[]}>(`/compras/proveedores`,{signal});}
export function guardarProveedorCompra(id:string|null,datos:Record<string,unknown>){return request(`/compras/proveedores${id?'/'+encodeURIComponent(id):''}`,{method:id?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
export function listarOrdenesCompra(signal?:AbortSignal){return request<{datos:OrdenCompra[]}>(`/compras/ordenes`,{signal});}
export function crearOrdenCompra(datos:Record<string,unknown>){return request<{datos:{id:string;numero:string}}>(`/compras/ordenes`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
export function accionarOrdenCompra(id:string,accion:'enviar'|'cancelar'|'recibir'|'devoluciones',datos?:Record<string,unknown>){return request<{datos:{id:string;numero?:string;estado?:string}}>(`/compras/ordenes/${encodeURIComponent(id)}/${accion}`,{method:'POST',...(datos?{headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)}:{})});}

export function listarProductosCompra(signal?:AbortSignal){return request<{datos:{id:string;nombre:string;sku:string;variantes:{id:string;sku:string;atributos:Record<string,string>}[]}[]}>(`/compras/productos`,{signal});}

export type CuentaProveedor={id:string;ordenCompraId:string;proveedorId:string;montoOriginal:number;saldo:number;fechaEmision:string;fechaVencimiento:string;estado:string;proveedor:{nombre:string};ordenCompra:{numero:string;moneda:string};pagos:{id:string;monto:number;medioPago:string;referencia:string|null;pagadoEn:string}[];notasCredito:{id:string;numero:string;monto:number;fechaEmision:string;devolucion:{numero:string}}[]};
export function listarCuentasProveedor(signal?:AbortSignal){return request<{datos:CuentaProveedor[]}>(`/finanzas/cuentas-por-pagar`,{signal});}
export function crearCuentaProveedor(datos:Record<string,unknown>){return request(`/finanzas/cuentas-por-pagar`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
export function registrarOperacionProveedor(id:string,tipo:'pagos'|'notas-credito',datos:Record<string,unknown>){return request(`/finanzas/cuentas-por-pagar/${encodeURIComponent(id)}/${tipo}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
export type CatalogoMostrador = { datos: {productoId:string; varianteId:string|null; nombre:string; sku:string; skuProducto:string; codigoBarras:string|null; estadoProducto:'borrador'|'publicado'|'oculto'; categoria:string; imagen:string|null; precio:number|null; tasaIgv:number; stock:number; primerLote:string|null}[]; preciosIncluyenIgv:boolean; tasaIgv:number };
export type CajaMostrador = {id:string; almacenId:string; nombreCaja:string; montoApertura:number; almacen:{nombre:string}};
export type VentaMostrador = {id:string; numero:string; estado:string; monto:number; reembolsado:number; medioPago:string; recibidoEn:string};
export function listarCajasMostrador(signal?:AbortSignal){return request<{datos:CajaMostrador[]}>('/ventas/mostrador/cajas',{signal});}
export function catalogoMostrador(id:string,signal?:AbortSignal){return request<CatalogoMostrador>('/ventas/mostrador/catalogo?almacenId='+encodeURIComponent(id),{signal});}
export function ventasMostrador(id:string,signal?:AbortSignal){return request<{datos:VentaMostrador[]}>('/ventas/mostrador/ventas?cajaId='+encodeURIComponent(id),{signal});}
export function abrirCajaMostrador(almacenId:string,montoApertura:number,nombreCaja?:string){return request('/ventas/mostrador/cajas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({almacenId,montoApertura,nombreCaja})});}
export function cerrarCajaMostrador(id:string,montoContado:number){return request<{datos:{esperado:number;contado:number;diferencia:number}}>('/ventas/mostrador/cajas/'+encodeURIComponent(id)+'/cerrar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({montoContado})});}
export function venderMostrador(datos:{cajaId:string;claveIdempotencia:string;lineas:{productoId:string;varianteId:string|null;cantidad:number;precioEsperado:number}[];medioPago:string;referencia:string;recibido:number}){return request<{datos:{id:string;numero:string;total:number;repetida:boolean}}>('/ventas/mostrador/ventas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
export type UbicacionTrabajo = {id:string;nombre:string;tipo:string;sucursal:{id:string;nombre:string}|null};
export function obtenerUbicacionTrabajo(signal?:AbortSignal){return request<{datos:UbicacionTrabajo|null}>('/inventario/ubicacion-trabajo',{signal});}
export function seleccionarUbicacionTrabajo(almacenId:string|null){return request<{datos:UbicacionTrabajo|null}>('/inventario/ubicacion-trabajo',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({almacenId})});}
export type CajaHistorial = CajaMostrador & {estado:'abierta'|'cerrada';abiertaEn:string;cerradaEn:string|null;montoEsperado:number|null;montoContado:number|null;diferencia:number|null;usuarioApertura:{nombre:string};usuarioCierre:{nombre:string}|null;almacen:{nombre:string;sucursal:{nombre:string}|null};movimientos:{id:string;tipo:string;sentido:'entrada'|'salida';medioPago:string;monto:number;descripcion:string;creadoEn:string;registradoPor:{nombre:string}}[]};
export type DetalleVentaMostrador = {id:string;numero:string;estado:string;total:number;cobros:{medioPago:string;monto:number;sesionCaja:{almacenId:string;nombreCaja:string}|null}[];lineas:{id:string;descripcion:string;sku:string;cantidad:number;devuelto:number;total:number}[];devoluciones:{id:string;numero:string;motivo:string;fecha:string;lineas:{lineaPedidoId:string;cantidad:number;monto:number;estadoProducto:string}[]}[]};
export function historialCajas(almacenId:string,signal?:AbortSignal){return request<{datos:CajaHistorial[]}>('/ventas/mostrador/cajas/historial'+(almacenId?'?almacenId='+encodeURIComponent(almacenId):''),{signal});}
export function registrarMovimientoCaja(id:string,datos:{sentido:'entrada'|'salida';monto:number;motivo:string;claveIdempotencia:string}){return request<{datos:{id:string;repetida:boolean}}>('/ventas/mostrador/cajas/'+encodeURIComponent(id)+'/movimientos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
export function detalleVentaMostrador(id:string,signal?:AbortSignal){return request<{datos:DetalleVentaMostrador}>('/ventas/mostrador/ventas/'+encodeURIComponent(id),{signal});}
export function devolverVentaMostrador(id:string,datos:{cajaId:string;claveIdempotencia:string;tipo:'anulacion'|'devolucion';motivo:string;referencia:string;lineas:{lineaId:string;cantidad:number;estadoProducto:'apto_para_venta'|'en_revision'}[]}){return request<{datos:{id:string;numero:string;monto?:number;repetida:boolean}}>('/ventas/mostrador/ventas/'+encodeURIComponent(id)+'/devoluciones',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}

export function listarCajasRegistradas(almacenId:string,signal?:AbortSignal){return request<{datos:{id:string;nombre:string;almacenId:string;activa:boolean}[]}>('/ventas/mostrador/cajas-registradas?almacenId='+encodeURIComponent(almacenId),{signal});}
export function registrarCaja(almacenId:string,nombre:string){return request<{datos:{id:string;nombre:string}}>('/ventas/mostrador/cajas-registradas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({almacenId,nombre})});}
export function abrirTurnoCaja(almacenId:string,cajaRegistradaId:string,montoApertura:number){return request<{datos:{id:string;nombreCaja:string}}>('/ventas/mostrador/cajas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({almacenId,cajaRegistradaId,montoApertura})});}

export type PermisosCaja={admin:boolean;abrir:boolean;cerrar:boolean;retiros:boolean;anular:boolean;devoluciones:boolean};
export type UsuarioCaja={id:string;nombre:string;correo:string;roles:{rol:{nombre:string}}[];permisosCaja:PermisosCaja|null};
export function misPermisosCaja(signal?:AbortSignal){return request<{datos:PermisosCaja}>('/ventas/mostrador/cajas-permisos/mios',{signal});}
export function usuariosPermisosCaja(signal?:AbortSignal){return request<{datos:UsuarioCaja[]}>('/ventas/mostrador/cajas-permisos',{signal});}
export function guardarPermisosCaja(id:string,permisos:Omit<PermisosCaja,'admin'>){return request('/ventas/mostrador/cajas-permisos/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(permisos)});}
export function modificarCajaRegistrada(id:string,datos:{nombre?:string;activa?:boolean}){return request('/ventas/mostrador/cajas-registradas/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
export function cajerosReporte(signal?:AbortSignal){return request<{datos:{id:string;nombre:string;activo:boolean}[]}>('/ventas/mostrador/reporte-cajeros',{signal});}
export type MovimientoReporteCaja={id:string;tipo:string;sentido:'entrada'|'salida';medioPago:string;monto:number;descripcion:string;creadoEn:string;registradoPor:{id:string;nombre:string};sesionCaja:{nombreCaja:string;almacenId:string;cajaRegistradaId:string|null;almacen:{nombre:string;sucursal:{nombre:string}|null}};cobro:{pedido:{numero:string}}|null};
export function reporteCaja(filtros:Record<string,string>,signal?:AbortSignal){const q=new URLSearchParams(Object.entries(filtros).filter(([,v])=>v));return request<{datos:MovimientoReporteCaja[];truncado:boolean}>('/ventas/mostrador/reporte-caja?'+q.toString(),{signal});}
export type RolAdministracion={id:string;nombre:string;permisos:{permiso:{id:string;codigo:string;descripcion:string}}[]};
export type UsuarioAdministracion={id:string;nombre:string;correo:string;activo:boolean;ultimoAccesoEn:string|null;roles:{rol:{id:string;nombre:string}}[]};
export function administrarUsuarios(signal?:AbortSignal){return request<{datos:UsuarioAdministracion[]}>('/administracion/usuarios',{signal});}
export function administrarRoles(signal?:AbortSignal){return request<{datos:RolAdministracion[]}>('/administracion/roles',{signal});}
export function administrarPermisos(signal?:AbortSignal){return request<{datos:{id:string;codigo:string;descripcion:string}[]}>('/administracion/permisos',{signal});}
export function crearUsuarioAdmin(datos:{nombre:string;correo:string;clave:string;roles:string[]}){return request('/administracion/usuarios',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(datos)});}
export function actualizarUsuarioAdmin(id:string,activo:boolean){return request('/administracion/usuarios/'+id,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({activo})});}
export function crearRolAdmin(nombre:string,permisos:string[]){return request('/administracion/roles',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({nombre,permisos})});}
