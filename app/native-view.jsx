"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";

const views = {
  Admin: dynamic(() => import("./design-views/Admin"), { ssr: false }),
  AdminLogin: dynamic(() => import("./design-views/AdminLogin"), { ssr: false }),
  AdminMovil: dynamic(() => import("./design-views/AdminMovil"), { ssr: false }),
  Ajustes: dynamic(() => import("./design-views/Ajustes"), { ssr: false }),
  Banners: dynamic(() => import("./design-views/Banners"), { ssr: false }),
  Busqueda: dynamic(() => import("./design-views/Busqueda"), { ssr: false }),
  Caja: dynamic(() => import("./design-views/Caja"), { ssr: false }),
  Carrito: dynamic(() => import("./design-views/Carrito"), { ssr: false }),
  CartelQR: dynamic(() => import("./design-views/CartelQR"), { ssr: false }),
  Categoria: dynamic(() => import("./design-views/Categoria"), { ssr: false }),
  Checkout: dynamic(() => import("./design-views/Checkout"), { ssr: false }),
  Clientes: dynamic(() => import("./design-views/Clientes"), { ssr: false }),
  Compras: dynamic(() => import("./design-views/Compras"), { ssr: false }),
  Comprobantes: dynamic(() => import("./design-views/Comprobantes"), { ssr: false }),
  Cotizaciones: dynamic(() => import("./design-views/Cotizaciones"), { ssr: false }),
  Dashboard: dynamic(() => import("./design-views/Dashboard"), { ssr: false }),
  Devoluciones: dynamic(() => import("./design-views/Devoluciones"), { ssr: false }),
  Empresas: dynamic(() => import("./design-views/Empresas"), { ssr: false }),
  Enlaces: dynamic(() => import("./design-views/Enlaces"), { ssr: false }),
  Error404: dynamic(() => import("./design-views/Error404"), { ssr: false }),
  Footer: dynamic(() => import("./design-views/Footer"), { ssr: false }),
  Gastos: dynamic(() => import("./design-views/Gastos"), { ssr: false }),
  Header: dynamic(() => import("./design-views/Header"), { ssr: false }),
  Inventario: dynamic(() => import("./design-views/Inventario"), { ssr: false }),
  Kardex: dynamic(() => import("./design-views/Kardex"), { ssr: false }),
  Main: dynamic(() => import("./design-views/Main"), { ssr: false }),
  MenuPanel: dynamic(() => import("./design-views/MenuPanel"), { ssr: false }),
  MiCuenta: dynamic(() => import("./design-views/MiCuenta"), { ssr: false }),
  MovilAlmacen: dynamic(() => import("./design-views/MovilAlmacen"), { ssr: false }),
  MovilFinanzas: dynamic(() => import("./design-views/MovilFinanzas"), { ssr: false }),
  MovilMarketing: dynamic(() => import("./design-views/MovilMarketing"), { ssr: false }),
  Notificaciones: dynamic(() => import("./design-views/Notificaciones"), { ssr: false }),
  Ofertas: dynamic(() => import("./design-views/Ofertas"), { ssr: false }),
  PanelMenuAbierto: dynamic(() => import("./design-views/PanelMenuAbierto"), { ssr: false }),
  PedidoDetalle: dynamic(() => import("./design-views/PedidoDetalle"), { ssr: false }),
  Pedidos: dynamic(() => import("./design-views/Pedidos"), { ssr: false }),
  Producto: dynamic(() => import("./design-views/Producto"), { ssr: false }),
  ProductoEditar: dynamic(() => import("./design-views/ProductoEditar"), { ssr: false }),
  PuntoVenta: dynamic(() => import("./design-views/PuntoVenta"), { ssr: false }),
  Reportes: dynamic(() => import("./design-views/Reportes"), { ssr: false }),
  Seguimiento: dynamic(() => import("./design-views/Seguimiento"), { ssr: false }),
  TiendaMovil: dynamic(() => import("./design-views/TiendaMovil"), { ssr: false }),
  Traslados: dynamic(() => import("./design-views/Traslados"), { ssr: false }),
};
const panelViews = new Set(["Admin","AdminLogin","Ajustes","Banners","Caja","Clientes","Compras","Comprobantes","Cotizaciones","Dashboard","Devoluciones","Gastos","Inventario","Kardex","Notificaciones","Ofertas","PanelMenuAbierto","PedidoDetalle","Pedidos","ProductoEditar","PuntoVenta","Reportes","Traslados"]);
const mobileViews = new Set(["AdminMovil","MovilAlmacen","MovilFinanzas","MovilMarketing","TiendaMovil"]);

export function DesignImport({ name, ...props }) {
  const View = views[name];
  return View ? <View {...props} /> : null;
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
  return <main ref={shell} className={className}><div className="native-content"><DesignImport name={name} /></div></main>;
}

