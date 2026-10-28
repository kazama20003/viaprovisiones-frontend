"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import MenuPanel from "./design-views/MenuPanel";
import { viewForPath } from "./view-map";
import { isPopupOpen, subscribePopup } from "./panel-menu-state";

const panelNames = new Set(["Dashboard", "Ajustes", "Banners", "Caja", "Clientes", "Compras", "Comprobantes", "Cotizaciones", "Devoluciones", "Gastos", "Inventario", "CategoriasAdmin", "MarcasAdmin", "Kardex", "Notificaciones", "Ofertas", "PedidoDetalle", "Pedidos", "ProductoEditar", "PuntoVenta", "Reportes", "Traslados"]);
const activeNames = { Dashboard: "Panel", Kardex: "Inventario", PedidoDetalle: "Pedidos" };
const subscribe = (callback) => {
  window.addEventListener("via-menu-pin-change", callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener("via-menu-pin-change", callback); window.removeEventListener("storage", callback); };
};
const getPinned = () => { try { return localStorage.getItem("via-menu-pinned") === "1"; } catch { return false; } };

export default function PersistentPanelMenu() {
  const pathname = usePathname();
  const pinned = useSyncExternalStore(subscribe, getPinned, () => false);
  const popupOpen = useSyncExternalStore(subscribePopup, isPopupOpen, () => false);
  const name = viewForPath(pathname || "/")?.name;
  const visible = pinned && !popupOpen && panelNames.has(name);

  useEffect(() => {
    document.body.classList.toggle("via-pinned-panel", visible);
    return () => document.body.classList.remove("via-pinned-panel");
  }, [visible]);

  function unpin() {
    try { localStorage.setItem("via-menu-pinned", "0"); } catch {}
    window.dispatchEvent(new CustomEvent("via-menu-pin-change", { detail: false }));
  }

  return <div className={`via-persistent-menu ${visible ? "is-open" : ""}`} inert={!visible}>
    <MenuPanel mode="bar" active={activeNames[name] || name} onPin={unpin} />
  </div>;
}
