"use client";

import { Fragment } from "react";
import Link from "next/link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { grp: '', q: '', barOpen: '', barClosing: false };
  }
  cancelBarClose() { clearTimeout(this.barCloseDelay); clearTimeout(this.barCloseTimer); this.barCloseDelay = null; this.barCloseTimer = null; }
  openBar(id) { this.cancelBarClose(); if (this.state.barOpen !== id || this.state.barClosing) this.setState({ barOpen: id, barClosing: false }); }
  closeBar() {
    this.cancelBarClose();
    if (!this.state.barOpen) return;
    this.setState({ barClosing: true });
    this.barCloseTimer = setTimeout(() => { this.barCloseTimer = null; this.setState({ barOpen: '', barClosing: false }); }, 240);
  }
  scheduleBarClose() { this.cancelBarClose(); this.barCloseDelay = setTimeout(() => this.closeBar(), 350); }
  componentWillUnmount() { this.cancelBarClose(); }
  renderVals() {
    const st = this.state;
    const active = this.props.active ?? 'Pedidos';
    const bar = (this.props.mode ?? 'pop') === 'bar';
    const IC = {
      star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z',
      ventas: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0',
      almacen: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
      finanzas: 'M3 6h18v12H3zM3 10h18M7 15h4',
      tienda: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18',
      analisis: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      cuenta: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a8 8 0 0 1 16 0v1',
      panel: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
      pedidos: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0',
      cotiz: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
      clientes: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
      devol: 'M4 9h11a5 5 0 0 1 0 10H9M4 9l4-4M4 9l4 4',
      inv: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
      compras: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1',
      prov: 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6',
      traslado: 'M4 8h13l-3-3M20 16H7l3 3',
      caja: 'M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
      cobro: 'M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6',
      gasto: 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6',
      sunat: 'M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4',
      web: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18',
      qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z',
      cupon: 'M3 8a2 2 0 0 0 0 4v4h18v-4a2 2 0 0 0 0-4V4H3zM10 4v16',
      banner: 'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6',
      reportes: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      ajustes: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4',
      roles: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z'
    };
    // [id de vista, nombre, descripción, destino, icono, aviso, número, es alerta]; destino vacío = módulo que viene pronto
    const IT = {
      pos: ['PuntoVenta', 'Punto de venta', 'Vender en el mostrador', '/punto-de-venta', 'M3 4h18v10H3zM8 20h8M12 14v6M7 9h4'],
      pedidos: ['Pedidos', 'Pedidos', 'Tablero por estado', '/pedidos', IC.pedidos, '8 por atender', 8, true],
      cotiz: ['Cotizaciones', 'Cotizaciones', 'Empresas y mayoristas', '/cotizaciones', IC.cotiz, '5 nuevas', 5, true],
      clientes: ['Clientes', 'Clientes', 'Fichas y cobranzas', '/clientes', IC.clientes, '414'],
      devol: ['Devoluciones', 'Devoluciones', 'Cambios y garantías', '/devoluciones', IC.devol, '2 abiertas', 2, true],
      inv: ['Inventario', 'Inventario y lotes', 'Stock por lote', '/inventario', IC.inv, '6 bajos', 6, true],
      nuevoProducto: ['ProductoEditar', 'Crear producto', 'Agregar al catálogo', '/producto/editar', 'M12 5v14M5 12h14'],
      categorias: ['CategoriasAdmin', 'Categorías', 'Organizar el catálogo', '/categorias', IC.inv],
      marcas: ['MarcasAdmin', 'Marcas', 'Administrar marcas', '/marcas', IC.inv],
      compras: ['Compras', 'Compras', 'Órdenes de compra', '/compras', IC.compras, '3 en camino'],
      prov: ['', 'Proveedores', 'Datos y deudas', '/compras', IC.prov],
      traslado: ['Traslados', 'Traslados', 'Entre tienda y almacén', '/traslados', IC.traslado],
      kardex: ['', 'Kardex', 'Historial por producto y lote', '/kardex', IC.reportes],
      caja: ['Caja', 'Caja del día', 'Apertura, arqueo y cierre', '/caja', IC.caja, 'Abierta'],
      cobro: ['', 'Cobranzas', 'Cuentas por cobrar', '/clientes', IC.cobro, 'S/ 18k'],
      gasto: ['Gastos', 'Gastos', 'Luz, alquiler, sueldos', '/gastos', IC.gasto, '2 por pagar', 2, true],
      sunat: ['Comprobantes', 'Comprobantes SUNAT', 'Boletas y facturas', '/comprobantes', IC.sunat, '3 por emitir', 3, true],
      web: ['', 'Tienda web', 'viaprovisiones.com', '/tienda', IC.web],
      qr: ['', 'Enlaces y QR', 'Página del QR y redes', '/enlaces', IC.qr],
      cupon: ['Ofertas', 'Ofertas y cupones', 'Descuentos y packs', '/ofertas', IC.cupon, '3 activas'],
      banner: ['Banners', 'Banners de la tienda', 'Portada y anuncios', '/banners', IC.banner],
      panel: ['Panel', 'Panel de inicio', 'Resumen del día', '/dashboard', IC.panel],
      reportes: ['Reportes', 'Reportes', 'Ventas y márgenes', '/reportes', IC.reportes],
      ajustes: ['Ajustes', 'Ajustes', 'Negocio, pagos, envíos', '/ajustes', IC.ajustes],
      roles: ['', 'Usuarios y roles', 'Quién ve qué', '/ajustes', IC.roles],
      notif: ['Notificaciones', 'Notificaciones y perfil', 'Avisos y tu cuenta', '/notificaciones', 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4', '5 sin leer', 5, true]
    };
    const G = [
      ['fav', 'Favoritos', 'Lo que más usas', IC.star, ['pos', 'pedidos', 'inv', 'cotiz', 'caja', 'panel']],
      ['ventas', 'Ventas', 'Mostrador, pedidos y clientes', IC.ventas, ['pos', 'pedidos', 'cotiz', 'clientes', 'devol']],
      ['almacen', 'Almacén', 'Stock, lotes y compras', IC.almacen, ['inv', 'nuevoProducto', 'categorias', 'marcas', 'kardex', 'compras', 'prov', 'traslado']],
      ['finanzas', 'Finanzas', 'Caja, cobros y gastos', IC.finanzas, ['caja', 'cobro', 'gasto', 'sunat']],
      ['tienda', 'Tienda y marketing', 'Canales de venta', IC.tienda, ['web', 'qr', 'cupon', 'banner']],
      ['analisis', 'Análisis', 'Cómo va el negocio', IC.analisis, ['panel', 'reportes']],
      ['cuenta', 'Cuenta', 'Configuración', IC.cuenta, ['notif', 'ajustes', 'roles']]
    ];
    const item = (k) => {
      const x = IT[k];
      const on = x[0] !== '' && x[0] === active;
      const soon = x[3] === '';
      return {
        key: k, label: x[1], sub: soon ? 'Próximamente' : x[2], href: soon ? '#pronto' : x[3], icon: x[4],
        hint: soon ? 'Pronto' : (x[5] || ''), hintOrSub: soon ? 'Próximamente' : (x[5] || x[2]),
        n: x[6] || 0,
        cls: on || soon ? '' : 'mp-card', current: on ? 'page' : 'false', disabled: soon ? 'true' : 'false',
        bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', subFg: on ? '#BDBDBD' : '#8C8C8C', o: soon ? '0.55' : '1',
        iconBg: on ? '#E8701F' : '#FFFFFF', iconFg: on ? '#FFFFFF' : '#111111',
        hintBg: on ? '#2A2A2A' : (x[7] ? '#FFF1E6' : '#FFFFFF'), hintFg: on ? '#FFFFFF' : (x[7] ? '#8A3B0A' : '#6B6B6B'),
        isOn: on
      };
    };
    const home = (G.find((g) => g[0] !== 'fav' && g[4].some((k) => IT[k][0] === active)) || G[0])[0];
    const sel = st.grp || (['ProductoEditar', 'CategoriasAdmin'].includes(active) ? 'almacen' : 'fav');
    const groups = G.map((g) => {
      const items = g[4].map(item);
      const alert = items.reduce((a, i) => a + i.n, 0);
      const on = g[0] === sel;
      const here = g[0] === home;
      const open = st.barOpen === g[0];
      return {
        id: g[0], title: g[1], desc: g[2], icon: g[3], items,
        alert: g[0] === 'fav' ? '' : (alert ? String(alert) : ''), count: String(items.length),
        pick: () => this.setState({ grp: g[0], q: '' }),
        pressed: on ? 'true' : 'false', cls: on ? '' : 'mp-grp',
        bg: on ? '#FFFFFF' : 'transparent', fg: '#111111', countFg: '#8C8C8C',
        iconBg: on ? '#111111' : '#FFFFFF', iconFg: on ? '#FFFFFF' : '#111111',
        toggle: (event) => { if (event.detail && window.matchMedia('(hover: hover)').matches) this.openBar(g[0]); else if (open && !st.barClosing) this.closeBar(); else this.openBar(g[0]); },
        hover: (event) => { if (event.pointerType === 'mouse') this.openBar(g[0]); },
        expanded: open ? 'true' : 'false', pillCls: here || open ? '' : 'mp-pill',
        barBg: here ? '#111111' : (open ? '#F4F4F2' : 'transparent'), barFg: here ? '#FFFFFF' : '#111111',
        barIconBg: here ? '#E8701F' : '#F4F4F2', barIconFg: here ? '#FFFFFF' : '#111111',
        chev: open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6'
      };
    });
    const cur = groups.find((g) => g.id === sel) || groups[0];
    const q = st.q.trim().toLowerCase();
    const seen = {};
    const results = q ? Object.keys(IT).filter((k) => { const x = IT[k]; return (x[1] + ' ' + x[2]).toLowerCase().indexOf(q) !== -1; }).map(item).filter((i) => (seen[i.key] ? false : (seen[i.key] = true))) : [];
    const bg = groups.find((g) => g.id === st.barOpen);
    const total = Object.keys(IT).length;
    return {
      accent: this.props.accent ?? '#FF914C',
      isPop: !bar,
      isBar: bar,
      totalText: total + ' secciones en ' + (G.length - 1) + ' grupos',
      close: () => { if (this.props.onClose) this.props.onClose(); },
      pin: () => { if (this.props.onPin) this.props.onPin(); },
      onSearch: (e) => this.setState({ q: (e && e.target && e.target.value) || '' }),
      groups,
      searching: !!q,
      browsing: !q,
      noResults: !!q && results.length === 0,
      resultTitle: results.length + (results.length === 1 ? ' resultado' : ' resultados') + ' para “' + st.q.trim() + '”',
      grpTitle: cur.title,
      grpDesc: cur.desc,
      shown: q ? results : cur.items,
      barGroups: groups.filter((g) => g.id !== 'fav'),
      barOpen: !!bg,
      barClosing: st.barClosing,
      barEnter: () => { if (this.state.barClosing && this.state.barOpen) this.openBar(this.state.barOpen); else this.cancelBarClose(); },
      barLeave: (event) => { if (event.pointerType === 'mouse') this.scheduleBarClose(); },
      barKeyDown: (event) => { if (event.key === 'Escape') this.closeBar(); },
      barTitle: bg ? bg.title : '',
      barDesc: bg ? bg.desc : '',
      barItems: bg ? bg.items : [],
      actions: [
        ['Vender', '/punto-de-venta', 'M12 5v14M5 12h14', '#E8701F'],
        ['Nuevo pedido', '/pedidos', IC.pedidos, '#2A2A2A'],
        ['Crear producto', '/producto/editar', 'M12 5v14M5 12h14', '#2A2A2A'],
        ['Cotización', '/cotizaciones', IC.cotiz, '#2A2A2A'],
        ['Ingresar lote', '/inventario', IC.inv, '#2A2A2A'],
        ['Orden de compra', '/compras', IC.compras, '#2A2A2A']
      ].map((a) => ({ label: a[0], href: a[1], icon: a[2], bg: a[3] }))
    };
  }
}

const defaults = {"accent": "#FF914C", "mode": "pop", "active": "Pedidos"};

export default function MenuPanel(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:inherit}\n.mp-card:hover{background:#ECECE9}\n.mp-grp:hover{background:#F4F4F2}\n.mp-pill:hover{background:#F4F4F2}\n.mp-noscroll{scrollbar-width:none;-ms-overflow-style:none}.mp-noscroll::-webkit-scrollbar{display:none}\n"}</style>
      <style>{`
        .mp-bar-item { position: relative; isolation: isolate; transition: transform 420ms cubic-bezier(.22, 1, .36, 1), box-shadow 420ms cubic-bezier(.22, 1, .36, 1); }
        .mp-bar-item::before { content: ''; position: absolute; inset: 0; z-index: -1; border-radius: inherit; background: #ecece9; opacity: 0; transform: scale(.88); transition: opacity 300ms ease, transform 440ms cubic-bezier(.22, 1, .36, 1); }
        .mp-bar-item > span:first-child { transition: transform 480ms cubic-bezier(.22, 1.4, .36, 1), background-color 300ms ease; }
        .mp-bar-item > span:first-child svg, .mp-bar-item > svg:last-child { transition: transform 480ms cubic-bezier(.22, 1.4, .36, 1); }
        .mp-bar-item:focus-visible, .mp-pin:focus-visible { outline: 2px solid #e8701f; outline-offset: 2px; }
        @media (hover: hover) {
          .mp-bar-item:hover { transform: translateY(-2px); }
          .mp-bar-item.mp-pill:hover::before { opacity: 1; transform: scale(1); }
          .mp-bar-item:hover > span:first-child { transform: scale(1.09); }
          .mp-bar-item:hover > span:first-child svg { transform: rotate(-8deg); }
          .mp-bar-item:hover > svg:last-child { transform: translateY(2px); }
          .mp-pin:hover { transform: rotate(-12deg) scale(1.08); }
        }
        .mp-bar-item:active { transform: scale(.97); }
        .mp-pin { transition: transform 480ms cubic-bezier(.22, 1.4, .36, 1); }
        @keyframes mp-dropdown-in { from { opacity: 0; transform: translate3d(0,-10px,0) scale(.985); } to { opacity: 1; transform: translate3d(0,0,0) scale(1); } }
        @keyframes mp-dropdown-out { from { opacity: 1; transform: translate3d(0,0,0) scale(1); } to { opacity: 0; transform: translate3d(0,-8px,0) scale(.985); } }
        .mp-dropdown { transform-origin: center top; animation: mp-dropdown-in 380ms cubic-bezier(.22,1,.36,1) both; }
        .mp-dropdown::before { content: ''; position: absolute; top: -12px; left: 0; right: 0; height: 12px; }
        .mp-dropdown.is-closing { pointer-events: none; animation: mp-dropdown-out 240ms cubic-bezier(.4,0,1,1) both; }
        .mp-dropdown a { transition: transform 350ms cubic-bezier(.22,1,.36,1), background-color 250ms ease; }
        .mp-dropdown-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 8px; }
        @media (max-width: 800px) { .mp-dropdown-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .mp-dropdown { max-height: calc(100dvh - 120px); overflow-y: auto; } }
        @media (max-width: 440px) { .mp-dropdown-grid { grid-template-columns: 1fr; } }
        @media (hover: hover) { .mp-dropdown a:hover { transform: translateY(-2px); } }
        @media (prefers-reduced-motion: reduce) { .mp-bar-item, .mp-bar-item::before, .mp-bar-item > span:first-child, .mp-bar-item svg, .mp-pin, .mp-dropdown a { transition-duration: .01ms !important; } .mp-dropdown, .mp-dropdown.is-closing { animation-duration: .01ms; } .mp-bar-item:hover, .mp-bar-item:active, .mp-pin:hover, .mp-bar-item:hover > span:first-child, .mp-bar-item:hover svg, .mp-dropdown a:hover { transform: none; } }
      `}</style>
    <div style={{ "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      {Boolean(lookup(v, "isPop")) && (
        <Fragment>
          <nav aria-label={"Menú del panel"} style={{ "width": "100%", "borderRadius": "34px", "background": "#FFFFFF", "padding": "20px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "16px", "boxShadow": "0 28px 70px rgba(17,17,17,0.28)" }}>
            <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
              <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.15", "margin": "0 8px 0 4px" }}>
                <span style={{ "fontSize": "26px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                  {"Menú"}
                </span>
                <span style={{ "fontSize": "13px", "fontWeight": "500", "color": "#8C8C8C" }}>
                  {lookup(v, "totalText")}
                </span>
              </span>
              <label style={{ "flex": "1 1 260px", "display": "flex", "alignItems": "center", "gap": "10px", "height": "48px", "padding": "0 16px", "borderRadius": "999px", "background": "#F4F4F2", "boxSizing": "border-box" }}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"} style={{ "flex": "none" }}>
                  <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                  <path d={"M16 16l4 4"}></path>
                </svg>
                <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                  {"Buscar en el menú"}
                </span>
                <input type={"search"} onChange={lookup(v, "onSearch")} placeholder={"Buscar una sección: lotes, cobranzas, cupones…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "14px", "outline": "none" }} />
              </label>
              <button onClick={lookup(v, "pin")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "48px", "padding": "0 18px 0 14px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "color": "#111111", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M9 3h6l-1 6 4 4H6l4-4zM12 13v8"}></path>
                </svg>
                {"Fijar arriba"}
              </button>
              <button onClick={lookup(v, "close")} aria-label={"Cerrar menú"} style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "border": "none", "background": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                  <path d={"M6 6l12 12M18 6L6 18"}></path>
                </svg>
              </button>
            </div>
            <div style={{ "display": "flex", "gap": "14px", "alignItems": "stretch", "flexWrap": "wrap" }}>
              <div style={{ "flex": "1 1 220px", "maxWidth": "250px", "borderRadius": "26px", "background": "#F4F4F2", "padding": "8px", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                {(lookup(v, "groups") || []).map((g, index1) => (
                  <Fragment key={index1}>
                    <button onClick={lookup(g, "pick")} className={lookup(g, "cls")} aria-pressed={lookup(g, "pressed")} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "minHeight": "50px", "padding": "0 10px 0 6px", "borderRadius": "999px", "border": "none", "background": lookup(g, "bg"), "color": lookup(g, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700", "textAlign": "left" }}>
                      <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(g, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(g, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(g, "icon")}></path>
                        </svg>
                      </span>
                      <span style={{ "flex": "1" }}>
                        {lookup(g, "title")}
                      </span>
                      {Boolean(lookup(g, "alert")) && (
                        <Fragment>
                          <span style={{ "minWidth": "22px", "height": "22px", "padding": "0 6px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "fontSize": "11px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            {lookup(g, "alert")}
                          </span>
                        </Fragment>
                      )}
                      <span style={{ "fontSize": "12px", "fontWeight": "600", "color": lookup(g, "countFg") }}>
                        {lookup(g, "count")}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ "flex": "999 1 520px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "12px", "padding": "6px 4px" }}>
                {Boolean(lookup(v, "searching")) && (
                  <Fragment>
                    <span style={{ "fontSize": "20px", "fontWeight": "600", "letterSpacing": "-0.01em" }}>
                      {lookup(v, "resultTitle")}
                    </span>
                    {Boolean(lookup(v, "noResults")) && (
                      <Fragment>
                        <span style={{ "padding": "28px", "borderRadius": "22px", "background": "#F4F4F2", "fontSize": "14px", "color": "#6B6B6B" }}>
                          {"No hay ninguna sección con ese nombre. Prueba con “pedido”, “lote” o “cliente”."}
                        </span>
                      </Fragment>
                    )}
                  </Fragment>
                )}
                {Boolean(lookup(v, "browsing")) && (
                  <Fragment>
                    <span style={{ "display": "flex", "alignItems": "baseline", "gap": "12px", "flexWrap": "wrap" }}>
                      <span style={{ "fontSize": "24px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                        {lookup(v, "grpTitle")}
                      </span>
                      <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                        {lookup(v, "grpDesc")}
                      </span>
                    </span>
                  </Fragment>
                )}
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "10px" }}>
                  {(lookup(v, "shown") || []).map((i, index2) => (
                    <Fragment key={index2}>
                      <Link href={lookup(i, "href")} className={lookup(i, "cls")} aria-current={lookup(i, "current")} aria-disabled={lookup(i, "disabled")} style={{ "display": "flex", "flexDirection": "column", "gap": "12px", "minHeight": "112px", "padding": "14px", "borderRadius": "24px", "textDecoration": "none", "background": lookup(i, "bg"), "color": lookup(i, "fg"), "opacity": lookup(i, "o"), "boxSizing": "border-box" }}>
                        <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "8px" }}>
                          <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(i, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(i, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(i, "icon")}></path>
                            </svg>
                          </span>
                          {Boolean(lookup(i, "hint")) && (
                            <Fragment>
                              <span style={{ "height": "24px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(i, "hintBg"), "color": lookup(i, "hintFg"), "fontSize": "11px", "fontWeight": "700", "display": "flex", "alignItems": "center", "whiteSpace": "nowrap" }}>
                                {lookup(i, "hint")}
                              </span>
                            </Fragment>
                          )}
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                            {lookup(i, "label")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": lookup(i, "subFg") }}>
                            {lookup(i, "sub")}
                          </span>
                        </span>
                      </Link>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ "display": "flex", "alignItems": "center", "gap": "8px", "flexWrap": "wrap", "padding": "10px", "borderRadius": "26px", "background": "#111111" }}>
              <span style={{ "fontSize": "13px", "fontWeight": "700", "color": "#FFFFFF", "padding": "0 8px" }}>
                {"Acciones rápidas"}
              </span>
              {(lookup(v, "actions") || []).map((a, index3) => (
                <Fragment key={index3}>
                  <Link href={lookup(a, "href")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "42px", "padding": "0 16px 0 12px", "borderRadius": "999px", "background": lookup(a, "bg"), "color": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={lookup(a, "icon")}></path>
                    </svg>
                    {lookup(a, "label")}
                  </Link>
                </Fragment>
              ))}
              <span style={{ "flex": "1" }}></span>
              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "color": "#FFFFFF" }}>
                <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "12px", "fontWeight": "800" }}>
                  {"BC"}
                </span>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                    {"Beltran Carlos Ccapa"}
                  </span>
                  <span style={{ "fontSize": "11px", "color": "#9A9A9A" }}>
                    {"Administrador"}
                  </span>
                </span>
              </span>
              <Link href={"/admin/login"} aria-label={"Cerrar sesión"} title={"Cerrar sesión"} style={{ "width": "42px", "height": "42px", "borderRadius": "50%", "background": "#2A2A2A", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"}></path>
                </svg>
              </Link>
            </div>
          </nav>
        </Fragment>
      )}
      {Boolean(lookup(v, "isBar")) && (
        <Fragment>
          <div onPointerEnter={lookup(v, "barEnter")} onPointerLeave={lookup(v, "barLeave")} onKeyDown={lookup(v, "barKeyDown")} style={{ "position": "relative" }}>
            <nav aria-label={"Menú del panel"} style={{ "display": "flex", "alignItems": "center", "gap": "6px", "padding": "6px", "borderRadius": "999px", "background": "#FFFFFF" }}>
              <div className={"mp-noscroll"} style={{ "flex": "1", "minWidth": "0", "display": "flex", "gap": "4px", "overflowX": "auto" }}>
                {(lookup(v, "barGroups") || []).map((g, index4) => (
                  <Fragment key={index4}>
                    <button onClick={lookup(g, "toggle")} onPointerEnter={lookup(g, "hover")} className={`mp-bar-item ${lookup(g, "pillCls")}`} aria-expanded={lookup(g, "expanded")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "46px", "padding": "0 14px 0 5px", "borderRadius": "999px", "border": "none", "background": lookup(g, "barBg"), "color": lookup(g, "barFg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap", "flex": "none" }}>
                      <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(g, "barIconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(g, "barIconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(g, "icon")}></path>
                        </svg>
                      </span>
                      {lookup(g, "title")}
                      {Boolean(lookup(g, "alert")) && (
                        <Fragment>
                          <span style={{ "minWidth": "22px", "height": "22px", "padding": "0 6px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "fontSize": "11px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            {lookup(g, "alert")}
                          </span>
                        </Fragment>
                      )}
                      <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(g, "chev")}></path>
                      </svg>
                    </button>
                  </Fragment>
                ))}
              </div>
              <button className="mp-pin" onClick={lookup(v, "pin")} aria-label={"Soltar el menú"} title={"Soltar el menú"} style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "border": "none", "background": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"#E8701F"} stroke={"#FFFFFF"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M9 3h6l-1 6 4 4H6l4-4zM12 13v8"}></path>
                </svg>
              </button>
            </nav>
            {Boolean(lookup(v, "barOpen")) && (
              <Fragment>
                <div className={`mp-dropdown ${lookup(v, "barClosing") ? "is-closing" : ""}`} style={{ "position": "absolute", "top": "66px", "left": "0", "right": "0", "zIndex": "15", "borderRadius": "28px", "background": "#FFFFFF", "padding": "14px", "boxShadow": "0 24px 60px rgba(17,17,17,0.22)", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <span style={{ "display": "flex", "alignItems": "baseline", "gap": "12px", "padding": "4px 6px 0" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {lookup(v, "barTitle")}
                    </span>
                    <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                      {lookup(v, "barDesc")}
                    </span>
                  </span>
                  <div className="mp-dropdown-grid">
                    {(lookup(v, "barItems") || []).map((i, index5) => (
                      <Fragment key={index5}>
                        <Link href={lookup(i, "href")} className={lookup(i, "cls")} aria-current={lookup(i, "current")} aria-disabled={lookup(i, "disabled")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "22px", "textDecoration": "none", "background": lookup(i, "bg"), "color": lookup(i, "fg"), "opacity": lookup(i, "o") }}>
                          <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": lookup(i, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(i, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(i, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(i, "label")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": lookup(i, "subFg") }}>
                              {lookup(i, "hintOrSub")}
                            </span>
                          </span>
                        </Link>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            )}
          </div>
        </Fragment>
      )}
    </div>
    </Fragment>
  )} />;
}
