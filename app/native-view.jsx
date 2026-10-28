"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import Ajustes from "./design-views/Ajustes";
import Banners from "./design-views/Banners";
import Caja from "./design-views/Caja";
import Clientes from "./design-views/Clientes";
import CategoriasAdmin from "./design-views/CategoriasAdmin";
import Compras from "./design-views/Compras";
import Comprobantes from "./design-views/Comprobantes";
import Cotizaciones from "./design-views/Cotizaciones";
import Dashboard from "./design-views/Dashboard";
import Devoluciones from "./design-views/Devoluciones";
import Gastos from "./design-views/Gastos";
import Inventario from "./design-views/Inventario";
import Kardex from "./design-views/Kardex";
import Notificaciones from "./design-views/Notificaciones";
import Ofertas from "./design-views/Ofertas";
import PedidoDetalle from "./design-views/PedidoDetalle";
import Pedidos from "./design-views/Pedidos";
import ProductoEditar from "./design-views/ProductoEditar";
import PuntoVenta from "./design-views/PuntoVenta";
import Reportes from "./design-views/Reportes";
import Traslados from "./design-views/Traslados";

import { Suspense, useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { avanzarPedido, cerrarSesion, guardarProducto, registrarLote, operarLote, subirArchivoProducto, elegirImagenPrincipal, iniciarSesion, listarCategorias, guardarCategoria, listarClientes, listarPedidos, listarProductos, listarProductosAdministracion, obtenerResumenPanel, obtenerSesion } from "./backend-api";

const views = {
  Admin: dynamic(() => import("./design-views/Admin"), { ssr: false }),
  AdminLogin: dynamic(() => import("./design-views/AdminLogin"), { ssr: false }),
  AdminMovil: dynamic(() => import("./design-views/AdminMovil"), { ssr: false }),
  Ajustes,
  Banners,
  Busqueda: dynamic(() => import("./design-views/Busqueda"), { ssr: false }),
  Caja,
  Carrito: dynamic(() => import("./design-views/Carrito"), { ssr: false }),
  CartelQR: dynamic(() => import("./design-views/CartelQR"), { ssr: false }),
  Categoria: dynamic(() => import("./design-views/Categoria"), { ssr: false }),
  CategoriasAdmin,
  Checkout: dynamic(() => import("./design-views/Checkout"), { ssr: false }),
  Clientes,
  Compras,
  Comprobantes,
  Cotizaciones,
  Dashboard,
  Devoluciones,
  Empresas: dynamic(() => import("./design-views/Empresas"), { ssr: false }),
  Enlaces: dynamic(() => import("./design-views/Enlaces"), { ssr: false }),
  Error404: dynamic(() => import("./design-views/Error404"), { ssr: false }),
  Footer: dynamic(() => import("./design-views/Footer"), { ssr: false }),
  Gastos,
  Header: dynamic(() => import("./design-views/Header"), { ssr: false }),
  Inventario,
  Kardex,
  Main: dynamic(() => import("./design-views/Main"), { ssr: false }),
  MenuPanel: dynamic(() => import("./design-views/MenuPanel"), { ssr: false }),
  MiCuenta: dynamic(() => import("./design-views/MiCuenta"), { ssr: false }),
  MovilAlmacen: dynamic(() => import("./design-views/MovilAlmacen"), { ssr: false }),
  MovilFinanzas: dynamic(() => import("./design-views/MovilFinanzas"), { ssr: false }),
  MovilMarketing: dynamic(() => import("./design-views/MovilMarketing"), { ssr: false }),
  Notificaciones,
  Ofertas,
  PanelMenuAbierto: dynamic(() => import("./design-views/PanelMenuAbierto"), { ssr: false }),
  PedidoDetalle,
  Pedidos,
  Producto: dynamic(() => import("./design-views/Producto"), { ssr: false }),
  ProductoEditar,
  PuntoVenta,
  Reportes,
  Seguimiento: dynamic(() => import("./design-views/Seguimiento"), { ssr: false }),
  TiendaMovil: dynamic(() => import("./design-views/TiendaMovil"), { ssr: false }),
  Traslados,
};
const panelViews = new Set(["Admin","AdminLogin","Ajustes","Banners","Caja","Clientes","Compras","Comprobantes","Cotizaciones","Dashboard","Devoluciones","Gastos","Inventario","CategoriasAdmin","Kardex","Notificaciones","Ofertas","PanelMenuAbierto","PedidoDetalle","Pedidos","ProductoEditar","PuntoVenta","Reportes","Traslados"]);
const mobileViews = new Set(["AdminMovil","MovilAlmacen","MovilFinanzas","MovilMarketing","TiendaMovil"]);

export function DesignImport({ name, ...props }) {
  const View = views[name];
  return View ? <View {...props} /> : null;
}

function ConnectedView({ name }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productoId = name === 'ProductoEditar' ? searchParams.get('id') : null;
  const queryClient = useQueryClient();
  const cargaCatalogo = ["Main", "Categoria", "Busqueda"].includes(name);
  const requiereSesion = panelViews.has(name) && name !== "AdminLogin";
  const clientes = useQuery({ queryKey: ["clientes"], queryFn: ({ signal }) => listarClientes(signal), enabled: name === "Clientes" });
  const pedidos = useQuery({ queryKey: ["pedidos"], queryFn: ({ signal }) => listarPedidos(signal), enabled: name === "Pedidos" });
  const resumen = useQuery({ queryKey: ["panel", "resumen"], queryFn: ({ signal }) => obtenerResumenPanel(signal), enabled: name === "Dashboard" });
  const productosAdmin = useQuery({ queryKey: ["productos", "admin"], queryFn: ({ signal }) => listarProductosAdministracion(signal), enabled: ["ProductoEditar", "Inventario"].includes(name) });
  const categorias = useQuery({ queryKey: ['categorias', 'admin'], queryFn: ({ signal }) => listarCategorias(signal), enabled: ['CategoriasAdmin', 'ProductoEditar'].includes(name) });
  const productos = useQuery({
    queryKey: ["tienda", "productos"],
    queryFn: ({ signal }) => listarProductos(signal),
    enabled: cargaCatalogo,
  });
  const sesion = useQuery({
    queryKey: ["sesion", "actual"],
    queryFn: ({ signal }) => obtenerSesion(signal),
    enabled: panelViews.has(name),
    staleTime: 30_000,
  });
  const iniciar = useMutation({
    mutationFn: iniciarSesion,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["sesion", "actual"] });
      router.push("/dashboard");
    },
  });
  const cerrar = useMutation({
    mutationFn: cerrarSesion,
    onSettled: () => {
      queryClient.clear();
      router.replace("/admin/login");
    },
  });
  const transicionarPedido = useMutation({
    mutationFn: ({ id, estado }) => avanzarPedido(id, estado),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pedidos"] }),
  });
  const productoMutation = useMutation({ mutationFn: ({ id, datos }) => guardarProducto(id, datos), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['productos'] }), queryClient.invalidateQueries({ queryKey: ['tienda', 'productos'] })]); } });
  const categoriaMutation = useMutation({ mutationFn: ({ id, datos }) => guardarCategoria(id, datos), onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['categorias'] }), queryClient.invalidateQueries({ queryKey: ['productos'] }), queryClient.invalidateQueries({ queryKey: ['tienda', 'productos'] })]); } });
  const loteMutation = useMutation({ mutationFn: registrarLote, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); queryClient.invalidateQueries({ queryKey: ['tienda', 'productos'] }); } });
  const operarLoteMutation = useMutation({ mutationFn: ({ id, accion, datos }) => operarLote(id, accion, datos), onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['productos'] }); queryClient.invalidateQueries({ queryKey: ['tienda', 'productos'] }); } });
  const actualizarArchivos = async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['productos'] }), queryClient.invalidateQueries({ queryKey: ['tienda', 'productos'] })]); };
  useEffect(() => {
    if (sesion.error?.status === 401) router.replace("/admin/login");
  }, [sesion.error, router]);
  useEffect(() => {
    if (name === "AdminLogin" && sesion.data) router.replace("/dashboard");
  }, [name, sesion.data, router]);

  if (requiereSesion && (sesion.isPending || sesion.error?.status === 401)) {
    return <main className="design-frame-shell" aria-busy="true" />;
  }
  if (requiereSesion && sesion.isError && sesion.error?.status !== 401) {
    return <main role="alert" style={{ padding: "32px", fontFamily: "Manrope, sans-serif" }}>
      <p>No se pudo validar la sesión. {sesion.error?.message || "Comprueba la conexión con el servidor."}</p>
      <button type="button" onClick={() => sesion.refetch()}>Reintentar</button>
    </main>;
  }
  if (name === 'ProductoEditar' && productoId && productosAdmin.isPending) return <main className="design-frame-shell" aria-busy="true" />;
  if (name === 'ProductoEditar' && productoId && productosAdmin.isError) return <main role="alert" style={{ padding: 32 }}>No se pudo cargar el producto. <button type="button" onClick={() => productosAdmin.refetch()}>Reintentar</button></main>;
  if (name === 'ProductoEditar' && productoId && !productosAdmin.data?.datos.some(p => p.id === productoId)) return <main role="alert" style={{ padding: 32 }}>No se encontró el producto. <Link href="/inventario">Volver al inventario</Link></main>;
  return <div style={{ display: "contents" }} onClickCapture={(event) => {
    if (!requiereSesion || cerrar.isPending) return;
    const enlace = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (!enlace) return;
    const destino = new URL(enlace.href, window.location.href);
    if (destino.origin === window.location.origin && destino.pathname === "/admin/login") {
      event.preventDefault();
      cerrar.mutate();
    }
  }}><DesignImport key={name === 'ProductoEditar' ? productoId || 'nuevo' : name} name={name}
    apiProductos={productos.data?.datos ?? []}
    apiCatalogState={cargaCatalogo ? productos.status : "idle"}
    apiCatalogError={productos.error?.message ?? ""}
    onLogin={(credenciales) => iniciar.mutate(credenciales)}
    loginError={iniciar.error?.message ?? ""}
    loginLoading={iniciar.isPending}
    apiClientes={clientes.data?.datos ?? []}
    apiClientesState={clientes.status}
    apiPedidos={pedidos.data?.datos ?? []}
    apiPedidosState={pedidos.status}
    apiResumen={resumen.data?.datos ?? null}
    apiResumenState={resumen.status}
    apiProductosAdmin={productosAdmin.data?.datos ?? []}
    apiProductosAdminState={productosAdmin.status}
    apiProductosAdminError={productosAdmin.error?.message ?? ""}
    pedidoError={transicionarPedido.error?.message ?? ""}
    onAvanzarPedido={(id, estado) => transicionarPedido.mutate({ id, estado })}
    productoActual={productosAdmin.data?.datos.find(p => p.id === productoId) || null}
    categorias={categorias.data?.datos || []} estado={categorias.status} error={categorias.error?.message || ''} reintentar={() => categorias.refetch()}
    guardarCategoria={(id, datos) => categoriaMutation.mutateAsync({ id, datos })} pendiente={categoriaMutation.isPending}
    onGuardarProducto={async (id, datos) => { const result = await productoMutation.mutateAsync({ id, datos }); if (!id) router.replace(`/producto/editar?id=${encodeURIComponent(result.datos.id)}`); return result; }}
    onSubirArchivo={async (id, archivo) => { const result = await subirArchivoProducto(id, archivo); await actualizarArchivos(); return result; }}
    onImagenPrincipal={async (productoId, id) => { const result = await elegirImagenPrincipal(productoId, id); await actualizarArchivos(); return result; }}
    onRegistrarLote={(datos) => loteMutation.mutateAsync(datos)}
    onOperarLote={(id, accion, datos) => operarLoteMutation.mutateAsync({ id, accion, datos })}
  /></div>;
}

export default function NativeView({ name }) {
  const shell = useRef(null);
  const isPanel = panelViews.has(name);
  useEffect(() => {
    if (!isPanel) return;
    let instance;
    const start = () => {
      if (!instance && window.Lenis && shell.current?.firstElementChild) {
        instance = new window.Lenis({ wrapper: shell.current, content: shell.current.firstElementChild, autoRaf: true, anchors: true, allowNestedScroll: true, stopInertiaOnNavigate: true });
      }
    };
    window.addEventListener("via-lenis-ready", start);
    start();
    return () => { window.removeEventListener("via-lenis-ready", start); instance?.destroy(); };
  }, [isPanel, name]);
  const className = mobileViews.has(name) ? "native-mobile-shell" : isPanel ? "native-panel-shell" : "native-store-shell";
  return <main ref={shell} className={className}><div className="native-content"><Suspense fallback={<div aria-busy="true" />}><ConnectedView name={name} /></Suspense></div></main>;
}

