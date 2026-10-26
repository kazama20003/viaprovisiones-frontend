"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef } from "react";
import { viewForFile } from "./view-map";

const roundedPanelViews = new Set([
  "Admin.dc.html", "AdminLogin.dc.html", "Ajustes.dc.html", "Banners.dc.html", "Caja.dc.html",
  "Clientes.dc.html", "Compras.dc.html", "Comprobantes.dc.html", "Cotizaciones.dc.html", "Dashboard.dc.html",
  "Devoluciones.dc.html", "Gastos.dc.html", "Inventario.dc.html", "Kardex.dc.html", "Notificaciones.dc.html",
  "Ofertas.dc.html", "PanelMenuAbierto.dc.html", "PedidoDetalle.dc.html", "Pedidos.dc.html", "ProductoEditar.dc.html",
  "PuntoVenta.dc.html", "Reportes.dc.html", "Traslados.dc.html",
]);
const mobileViews = new Set([
  "AdminMovil.dc.html", "MovilAlmacen.dc.html", "MovilFinanzas.dc.html", "MovilMarketing.dc.html", "TiendaMovil.dc.html",
]);

export default function ViewFrame({ file }: { file: string }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const router = useRouter();

  const syncRoute = useCallback(() => {
    try {
      const location = frame.current?.contentWindow?.location;
      const nextView = viewForFile(location?.pathname.split("/").pop() ?? "");
      if (nextView && nextView.path !== window.location.pathname) {
        router.replace(nextView.path, { scroll: false });
      }
    } catch {
      // External links stay inside the design frame and never change the app route.
    }
  }, [router]);

  const radiusClass = mobileViews.has(file)
    ? "design-frame-shell--mobile"
    : roundedPanelViews.has(file) ? "design-frame-shell--rounded" : "";

  return <main className={`design-frame-shell ${radiusClass}`}>
    <iframe
      ref={frame}
      key={file}
      className="design-frame"
      src={`/storefront/${file}`}
      title={viewForFile(file)?.label ?? "VIA Provisiones"}
      onLoad={syncRoute}
    />
  </main>;
}
