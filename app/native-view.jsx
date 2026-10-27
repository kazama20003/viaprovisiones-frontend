"use client";

import dynamic from "next/dynamic";
import Ajustes from "./design-views/Ajustes";
import Banners from "./design-views/Banners";
import Caja from "./design-views/Caja";
import Clientes from "./design-views/Clientes";
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

import { useEffect, useRef } from "react";

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

