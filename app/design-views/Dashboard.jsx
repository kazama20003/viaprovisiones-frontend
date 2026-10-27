"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, menuClosing: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), range: 0, chip: 'Todo', done: {}, feat: 0, hoverM: -1 };
  }
  renderVals() {
    const accent = this.props.accent ?? '#FF914C';
    const st = this.state;
    const TASKS = [
      { id: 'pago', name: 'Confirmar pago #1042', type: 'Pedidos', icon: 'M5 12l5 5 9-10' },
      { id: 'cot', name: 'Cotización minera', type: 'Cotizaciones', icon: 'M3 21h18M5 21V7l7-4 7 4v14' },
      { id: 'prep', name: 'Preparar pedido #1041', type: 'Pedidos', icon: 'M6 3h12l1 18H5z' },
      { id: 'stock', name: 'Reponer collar dorado', type: 'Stock', icon: 'M12 3l9 16H3zM12 10v4' },
      { id: 'cot2', name: 'Cotización ferretería', type: 'Cotizaciones', icon: 'M3 21h18M5 21V7l7-4 7 4v14' }
    ];
    const FEATS = {
      Todo: { title: 'Pago por confirmar', sub: 'María Q. pagó S/ 159.70 con Yape por el pedido #1042.', cta: 'Confirmar', id: 'pago' },
      Pedidos: { title: 'Preparar pedido #1041', sub: 'Bodega San Martín · 3 productos · delivery en Arequipa.', cta: 'Marcar preparado', id: 'prep' },
      Cotizaciones: { title: 'Cotización de minera', sub: 'Paneles solares y linternas para un campamento en Cusco.', cta: 'Responder', id: 'cot' },
      Stock: { title: 'Collar dorado agotado', sub: '4 clientes lo vieron hoy. Sugerido: pedir 30 unidades.', cta: 'Pedir al proveedor', id: 'stock' }
    };
    const shown = TASKS.filter((t) => st.chip === 'Todo' || t.type === st.chip);
    const f = FEATS[st.chip];
    const fDone = !!st.done[f.id];
    const open = TASKS.filter((t) => !st.done[t.id]).length;
    const R = [['Mes', 'del mes', '18,450.00', '146.43', 'Octubre'], ['Semana', 'de la semana', '4,410.00', '142.26', 'Esta semana']][st.range];
    const hoursV = [3, 6, 8, 10, 9, 7, 8, 11, 12, 14, 10, 5];
    const mx = Math.max(...hoursV);
    let wave = '';
    for (let x = 0; x <= 400; x += 4) { const y = 35 + Math.sin(x / 13) * 10 + Math.sin(x / 5) * 5 + Math.sin(x / 37) * 8; wave += (x ? 'L' : 'M') + x + ',' + y.toFixed(1) + ' '; }
    const FACES = [
      { d: 'M3 10 Q10 2 17 10', n: '2' }, { d: 'M3 9 Q10 4 17 9', n: '3' }, { d: 'M3 6 L17 6', n: '9' }, { d: 'M3 3 Q10 8 17 3', n: '34' }, { d: 'M3 2 Q10 11 17 2', n: '76' }
    ];
    const H = (label, href, icon, count, on) => ({ label, href, icon, count: count || '', bg: on ? '#F4F4F2' : 'transparent', iconBg: on ? '#E8701F' : '#F4F4F2', iconFg: on ? '#FFFFFF' : '#111111' });
    const openMenu = () => { if (this.closeTimer) { clearTimeout(this.closeTimer); this.closeTimer = null; } this.setState({ menu: true, menuClosing: false }); };
    const closeMenu = () => { if (this.closeTimer) return; this.setState({ menuClosing: true }); this.closeTimer = setTimeout(() => { this.closeTimer = null; this.setState({ menu: false, menuClosing: false }); }, 460); };
    return {
      accent,
      openCount: String(open),
      menuOpen: st.menu || !!this.props.menuAbierto,
      menuBackdropAnimation: st.menuClosing ? 'via-menu-backdrop-out 340ms ease-in both' : 'via-menu-backdrop-in 420ms cubic-bezier(.16,1,.3,1) both',
      menuPanelAnimation: st.menuClosing ? 'via-menu-panel-out 420ms cubic-bezier(.4,0,1,1) both' : 'via-menu-panel-in 640ms cubic-bezier(.16,1,.3,1) both',
      openMenu,
      closeMenu,
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: openMenu,
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p }); if (this.state.menu) closeMenu(); },
      showTasks: () => this.setState({ chip: 'Todo' }),
      ranges: ['Mes', 'Semana'].map((n, i) => ({ name: n, pressed: i === st.range ? 'true' : 'false', bg: i === st.range ? '#111111' : '#FFFFFF', fg: i === st.range ? '#FFFFFF' : '#111111', border: i === st.range ? '#111111' : '#E4E4E0', pick: () => this.setState({ range: i }) })),
      rangeWord: R[1], sales: R[2], ticket: R[3], rangeLabel: R[4],
      goalDash: (2 * Math.PI * 52 * 0.74).toFixed(1) + ' 400',
      days: Array.from({ length: 31 }, (_, i) => ({ c: i < 24 ? '#E8701F' : '#DADAD6' })),
      wave,
      chips: ['Todo', 'Pedidos', 'Cotizaciones', 'Stock'].map((n) => ({ name: n, pressed: st.chip === n ? 'true' : 'false', border: st.chip === n ? '#111111' : '#E4E4E0', dot: st.chip === n ? '#E8701F' : '#DADAD6', pick: () => this.setState({ chip: n }) })),
      hours: hoursV.map((v, i) => ({ h: Math.round((v / mx) * 100) + '%', c: i % 3 === 1 ? '#DADAD6' : '#E8701F' })),
      tasks: shown.map((t) => { const d = !!st.done[t.id]; return { name: t.name, icon: t.icon, done: d, weight: d ? '500' : '600', fg: d ? '#8C8C8C' : '#111111', dotBg: d ? '#E8F5EC' : '#FFF1E6', dotFg: d ? '#2E9E4F' : '#E8701F', border: d ? '#EDEDEA' : '#E4E4E0', pick: () => this.setState({ chip: t.type }) }; }),
      feat: { title: fDone ? f.title + ' · listo' : f.title, sub: f.sub, cta: fDone ? 'Hecho ✓' : f.cta, btnBg: fDone ? '#2E9E4F' : '#E8701F', act: () => this.setState({ done: { ...st.done, [f.id]: true } }) },
      faces: FACES.map((x, i) => ({ ...x, bg: i === 4 ? '#E8701F' : '#FFFFFF', stroke: i === 4 ? '#FFFFFF' : '#111111' })),
      ...(() => {
        const B = 'img/';
        const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        const MON = [['Nov', 12400], ['Dic', 21800], ['Ene', 11900], ['Feb', 12600], ['Mar', 14100], ['Abr', 14900], ['May', 15700], ['Jun', 15100], ['Jul', 16300], ['Ago', 16900], ['Set', 17300], ['Oct', 18450]];
        const full = ['Noviembre 2025', 'Diciembre 2025', 'Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026', 'Mayo 2026', 'Junio 2026', 'Julio 2026', 'Agosto 2026', 'Setiembre 2026', 'Octubre 2026'];
        const C = 2 * Math.PI * 78;
        const DON = [['Tienda web', 46, 8487, '#E8701F'], ['WhatsApp', 32, 5904, '#111111'], ['Empresas', 22, 4059, '#BDBDBD']];
        let acc = 0;
        const hourCurve = [0.25, 0.4, 0.55, 0.75, 0.7, 0.45, 0.5, 0.65, 0.9, 1, 0.8, 0.35];
        const dayF = [['Lun', 0.7], ['Mar', 0.72], ['Mié', 0.68], ['Jue', 0.78], ['Vie', 0.88], ['Sáb', 1], ['Dom', 0.35]];
        const SEG = [['Consumidores', 6900, '37%', '214 clientes'], ['Minoristas y bodegas', 4980, '27%', '142 clientes'], ['Mayoristas', 3870, '21%', '37 clientes'], ['Empresas', 2700, '15%', '21 clientes']];
        const FUN = [['Recibidos', 126], ['Pagados', 121], ['Preparados', 112], ['Enviados', 98], ['Entregados', 93]];
        const TOP = [['Foco LED 9 W luz cálida', 'Focos', 412, 3667, '52dc55c2523393f8f60ab89499fa3ec1'], ['Cable USB-C carga rápida 1 m', 'Cables', 238, 4736, '3aba2390d3fbd5f06fdd2cede507b16f'], ['Lámpara de camping recargable', 'Camping', 64, 4474, 'a58999411e32d7481815ba8cdc175e97'], ['Panel solar monocristalino 100 W', 'Solar', 12, 4188, '972ceb606bfca75ef6208d8d3966c77d'], ['Extensión de uso rudo 5 m', 'Extensiones', 57, 2565, '323e29809539c2fb4b229651c8081ee9']];
        const CIT = [['Arequipa', 91], ['Cusco', 14], ['Puno', 9], ['Moquegua', 6], ['Lima', 4], ['Tacna', 2]];
        const SC = { Pendiente: ['#FFF4D6', '#7A4A00'], Pagado: ['#E3F1FF', '#0B4A8A'], Enviado: ['#EDE7FF', '#4A2E9A'], Entregado: ['#E4F4E7', '#1B5E20'] };
        const REC = [['María Q.', '#1042', 'Web', '10:24', 'Pendiente', 159.7], ['Bodega San Martín', '#1041', 'WhatsApp', '09:51', 'Pagado', 753], ['Ferretería Cayma', '#1040', 'Empresas', 'Ayer', 'Enviado', 3460], ['Luis R.', '#1039', 'Web', 'Ayer', 'Entregado', 459], ['Constructora [Cliente]', '#1038', 'Empresas', 'Ayer', 'Pagado', 5120]];
        return {
          yearTotal: MON.reduce((a, m) => a + m[1], 0).toLocaleString('es-PE'),
          months: MON.map((m, i) => ({
            tick: m[0], label: full[i], value: money(m[1]), orders: Math.round(m[1] / 146) + ' pedidos',
            aria: full[i] + ': ' + money(m[1]),
            h: Math.round((m[1] / 25000) * 100) + '%',
            c: st.hoverM === i ? '#111111' : (i === 11 ? '#E8701F' : '#F5C3A0'),
            hover: st.hoverM === i,
            enter: () => this.setState({ hoverM: i }), leave: () => this.setState({ hoverM: -1 })
          })),
          donut: DON.map((x) => { const len = (x[1] / 100) * C; const seg = { name: x[0], pct: x[1] + '%', amount: money(x[2]), color: x[3], dash: Math.max(0, len - 3).toFixed(1) + ' ' + C.toFixed(1), offset: (-acc).toFixed(1) }; acc += len; return seg; }),
          segments: SEG.map((x) => ({ name: x[0], amount: money(x[1]), pct: x[2], clients: x[3], w: Math.round((x[1] / SEG[0][1]) * 100) + '%' })),
          funnel: FUN.map((x) => ({ name: x[0], n: String(x[1]), w: Math.round((x[1] / 126) * 100) + '%', c: '#E8701F', fg: '#111111' })),
          heat: dayF.map((dd) => ({ day: dd[0], cells: hourCurve.map((hc, hi) => { const v = hc * dd[1]; return { title: dd[0] + ' ' + (9 + hi) + 'h', bg: v > 0.92 ? '#B4530F' : '#E8701F', o: (0.12 + 0.88 * v).toFixed(2) }; }) })),
          heatHours: hourCurve.map((_, i) => ({ t: (9 + i) + 'h' })),
          stockMix: [['Disponible', '284', '#34C759', 'M5 12l5 5 9-10'], ['Stock bajo', '6', '#FFB020', 'M12 7v6M12 17h.01'], ['Agotado', '1', '#FF5A4E', 'M6 6l12 12M18 6L6 18']].map((x) => ({ name: x[0], n: x[1], c: x[2], icon: x[3] })),
          top: TOP.map((x) => ({ name: x[0], cat: x[1], units: String(x[2]), sales: money(x[3]), img: B + x[4], w: Math.round((x[3] / 4736) * 100) + '%' })),
          cities: CIT.map((x, i) => ({ name: x[0], n: String(x[1]), w: Math.max(4, Math.round((x[1] / 91) * 100)) + '%', o: i === 0 ? '1' : '0.55' })),
          recent: REC.map((x) => ({ client: x[0], id: x[1], channel: x[2], time: x[3], status: x[4], total: 'S/ ' + x[5].toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), bg: SC[x[4]][0], fg: SC[x[4]][1], ini: x[0].split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() }))
        };
      })(),
      menu: [
        { title: 'Inicio', items: [H('Panel', '/dashboard', 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z', '', true)] },
        { title: 'Ventas', items: [H('Pedidos', '/pedidos', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0', '12'), H('Cotizaciones', '/pedidos', 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', '5'), H('Clientes', '/pedidos', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c1-4 4-6 7-6s6 2 7 6')] },
        { title: 'Catálogo', items: [H('Productos', '/inventario', 'M12 3l9 5v8l-9 5-9-5V8z'), H('Inventario y lotes', '/inventario', 'M3 7l9-4 9 4v10l-9 4-9-4z', '6'), H('Ofertas y cupones', '/inventario', 'M20 12l-8 8-9-9V3h8z')] },
        { title: 'Canales y ajustes', items: [H('Tienda web', '/tienda', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18'), H('Enlaces y QR', '/enlaces', 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z'), H('Reportes y ajustes', '/dashboard', 'M4 20V10M10 20V4M16 20v-7M22 20H2')] }
      ]
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Dashboard(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n@keyframes via-menu-backdrop-in{from{opacity:0;backdrop-filter:blur(0)}to{opacity:1;backdrop-filter:blur(5px)}}\n@keyframes via-menu-backdrop-out{from{opacity:1;backdrop-filter:blur(5px)}to{opacity:0;backdrop-filter:blur(0)}}\n@keyframes via-menu-panel-in{0%{opacity:0;transform:translate3d(0,-30px,0) scale(.94);filter:blur(8px)}58%{opacity:1;transform:translate3d(0,5px,0) scale(1.012);filter:blur(0)}78%{transform:translate3d(0,-2px,0) scale(.999)}100%{opacity:1;transform:translate3d(0,0,0) scale(1);filter:blur(0)}}\n@keyframes via-menu-panel-out{from{opacity:1;transform:translate3d(0,0,0) scale(1);filter:blur(0)}to{opacity:0;transform:translate3d(0,-18px,0) scale(.975);filter:blur(5px)}}\n@keyframes via-menu-content-in{from{opacity:0;transform:translate3d(0,14px,0)}to{opacity:1;transform:translate3d(0,0,0)}}\n@keyframes via-menu-sidebar-in{from{opacity:0;transform:translate3d(-14px,0,0)}to{opacity:1;transform:translate3d(0,0,0)}}\n@keyframes via-menu-option-in{from{opacity:0;transform:translate3d(0,10px,0) scale(.98)}to{opacity:1;transform:translate3d(0,0,0) scale(1)}}\n.db-menu-backdrop{will-change:opacity,backdrop-filter}\n.db-menu-panel{width:100%;transform-origin:50% 0;will-change:opacity,transform,filter}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(1){animation:via-menu-content-in 460ms cubic-bezier(.16,1,.3,1) 70ms both}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(1){animation:via-menu-sidebar-in 500ms cubic-bezier(.16,1,.3,1) 110ms both}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2){animation:via-menu-content-in 500ms cubic-bezier(.16,1,.3,1) 150ms both}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a{animation:via-menu-option-in 420ms cubic-bezier(.16,1,.3,1) both}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(1){animation-delay:190ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(2){animation-delay:225ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(3){animation-delay:260ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(4){animation-delay:295ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(5){animation-delay:330ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(6){animation-delay:365ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(7){animation-delay:400ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(8){animation-delay:435ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(9){animation-delay:470ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(10){animation-delay:505ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(11){animation-delay:540ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(2)>div:nth-child(2)>div:nth-child(2)>a:nth-child(12){animation-delay:575ms}\n.db-menu-panel nav[aria-label=\"Menú del panel\"]>div:nth-child(3){animation:via-menu-content-in 460ms cubic-bezier(.16,1,.3,1) 220ms both}\n@media(prefers-reduced-motion:reduce){.db-menu-backdrop,.db-menu-panel,.db-menu-panel nav[aria-label=\"Menú del panel\"]>div,.db-menu-panel nav[aria-label=\"Menú del panel\"] a{animation-duration:.01ms!important;animation-delay:0ms!important}}\n"}</style>
      <style>{`
        .db-pinned-menu { position: relative; z-index: 20; display: grid; grid-template-rows: 0fr; transition: grid-template-rows 560ms cubic-bezier(.22, 1, .36, 1); }
        .db-pinned-menu.is-open { grid-template-rows: 1fr; }
        .db-pinned-menu-inner { min-height: 0; overflow: hidden; }
        .db-pinned-menu.is-open .db-pinned-menu-inner { overflow: visible; }
        .db-pinned-menu-content { padding: 20px 20px 0; opacity: 0; transform: translate3d(0, -16px, 0) scale(.98); transform-origin: center top; transition: opacity 300ms ease, transform 560ms cubic-bezier(.22, 1, .36, 1); }
        .db-pinned-menu.is-open .db-pinned-menu-content { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
        @media (prefers-reduced-motion: reduce) { .db-pinned-menu, .db-pinned-menu-content { transition-duration: 0.01ms; } }
      `}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          <div className={`db-pinned-menu ${lookup(v, "pinned") ? "is-open" : ""}`} inert={!lookup(v, "pinned")}>
            <div className="db-pinned-menu-inner">
              <div className="db-pinned-menu-content">
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Panel"} onPin={lookup(v, "togglePin")} />
              </div>
            </div>
          </div>
          <div>
            <div style={{ "background": "#F4F4F2", "padding": "28px 32px 30px", "display": "flex", "flexDirection": "column", "gap": "30px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "flexWrap": "wrap" }}>
                <button onClick={lookup(v, "menuBtn")} aria-label={lookup(v, "menuBtnLabel")} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M4 8h16M4 16h10"}></path>
                  </svg>
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} role={"img"} aria-label={"VIA Provisiones"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-db"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-db)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </span>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"VIA Provisiones"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Panel de control"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <DesignLink href={"/producto/editar"} aria-label={"Nuevo producto"} title={"Nuevo producto"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none" }}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "alignItems": "center", "gap": "12px", "paddingRight": "10px" }}>
                  <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "16px", "fontWeight": "800" }}>
                    {"BC"}
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                    <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                      {"Beltran Carlos Ccapa"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Gerente Comercial"}
                    </span>
                  </span>
                </span>
                <label style={{ "display": "flex", "alignItems": "center", "gap": "12px", "paddingRight": "6px" }}>
                  <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                      <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                      <path d={"M16 16l4 4"}></path>
                    </svg>
                  </span>
                  <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                    {"Buscar"}
                  </span>
                  <input type={"search"} placeholder={"Buscar pedidos, productos…"} style={{ "width": "180px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "color": "#111111", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "18px", "flexWrap": "wrap" }}>
                <span style={{ "width": "92px", "height": "92px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "30px", "fontWeight": "500", "flex": "none" }}>
                  {"24"}
                </span>
                <span style={{ "display": "flex", "flexDirection": "column", "fontSize": "16px", "fontWeight": "500", "lineHeight": "1.25" }}>
                  <span>
                    {"Vie,"}
                  </span>
                  <span>
                    {"Octubre"}
                  </span>
                </span>
                <span style={{ "width": "1px", "height": "40px", "background": "#DCDCD8", "margin": "0 6px" }}></span>
                <button onClick={lookup(v, "showTasks")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "28px", "height": "54px", "padding": "0 24px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "15px", "fontWeight": "600" }}>
                  {"Ver mis pendientes"}
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M4 12h16M14 6l6 6-6 6"}></path>
                  </svg>
                </button>
                <span style={{ "position": "relative", "width": "54px", "height": "54px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M4 6h16v14H4zM4 10h16M9 3v5M15 3v5"}></path>
                  </svg>
                  <span style={{ "position": "absolute", "top": "10px", "right": "11px", "width": "7px", "height": "7px", "borderRadius": "50%", "background": "#E8701F" }}></span>
                </span>
                <span style={{ "flex": "1 1 40px" }}></span>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "280px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Hola, Beltran"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {"Tienes "}
                    {lookup(v, "openCount")}
                    {" pendientes hoy"}
                  </span>
                </span>
                <DesignLink href={"https://wa.me/51954802744"} aria-label={"Abrir WhatsApp"} style={{ "width": "92px", "height": "92px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"26"} height={"26"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                  </svg>
                </DesignLink>
              </div>
            </div>
            <div style={{ "background": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "0 0 62px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <div style={{ "flex": "1", "minHeight": "200px", "borderRadius": "999px", "border": "1px solid #E4E4E0", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "flex-end", "paddingBottom": "14px" }}>
                    <DesignLink href={"/producto/editar"} aria-label={"Nuevo producto"} style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M12 5v14M5 12h14"}></path>
                      </svg>
                    </DesignLink>
                  </div>
                  <DesignLink href={"/enlaces"} aria-label={"Compartir enlaces y QR"} style={{ "width": "62px", "height": "62px", "borderRadius": "50%", "border": "1px solid #E4E4E0", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <circle cx={"18"} cy={"5"} r={"2.5"}></circle>
                      <circle cx={"6"} cy={"12"} r={"2.5"}></circle>
                      <circle cx={"18"} cy={"19"} r={"2.5"}></circle>
                      <path d={"M8.2 10.8l7.6-4.4M8.2 13.2l7.6 4.4"}></path>
                    </svg>
                  </DesignLink>
                </div>
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column" }}>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "30px", "margin": "0", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px", "boxShadow": "0 1px 0 #EDEDEA" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "800", "letterSpacing": "0.04em" }}>
                        {"CAJA DE HOY"}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid #E4E4E0", "fontSize": "12px", "fontWeight": "600" }}>
                        {"Yape · Plin · Tarjeta "}
                        <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"#111111"} aria-hidden={"true"}>
                          <path d={"M6 9l6 6 6-6z"}></path>
                        </svg>
                      </span>
                    </div>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                        {"Cobrado hoy"}
                      </span>
                      <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                        <span style={{ "color": "#E8701F" }}>
                          {"S/"}
                        </span>
                        {" 4,410.00"}
                      </span>
                    </span>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                      <DesignLink href={"/pedidos"} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "height": "38px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Registrar venta"}
                      </DesignLink>
                      <DesignLink href={"/pedidos"} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "height": "38px", "borderRadius": "999px", "background": "#F4F4F2", "textDecoration": "none", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Cerrar caja"}
                      </DesignLink>
                    </div>
                  </div>
                  <div style={{ "padding": "16px 22px 20px", "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "gap": "10px" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Pagos por confirmar"}
                      </span>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        <span style={{ "color": "#E8701F" }}>
                          {"S/"}
                        </span>
                        {" 159.70"}
                      </span>
                    </span>
                    <DesignLink href={"/pedidos"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "fontSize": "12px", "fontWeight": "600", "color": "#C2410C", "textDecoration": "none" }}>
                      <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#E8701F", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"3"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                      </span>
                      {"Confirmar"}
                      <br />
                      {"pagos"}
                    </DesignLink>
                  </div>
                </div>
                <div style={{ "flex": "1 1 260px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column" }}>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "30px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px", "boxShadow": "0 1px 0 #EDEDEA" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "1px solid #E4E4E0", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M4 19V9M10 19V5M16 19v-7"}></path>
                        </svg>
                      </span>
                      <div role={"group"} aria-label={"Periodo"} style={{ "display": "inline-flex", "gap": "4px" }}>
                        {(lookup(v, "ranges") || []).map((r, index1) => (
                          <Fragment key={index1}>
                            <button onClick={lookup(r, "pick")} aria-pressed={lookup(r, "pressed")} style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid " + String(lookup(r, "border") ?? ""), "background": lookup(r, "bg"), "color": lookup(r, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "600" }}>
                              {lookup(r, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                        {"Ventas "}
                        {lookup(v, "rangeWord")}
                      </span>
                      <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                        <span style={{ "color": "#E8701F" }}>
                          {"S/"}
                        </span>
                        {" "}
                        {lookup(v, "sales")}
                      </span>
                    </span>
                  </div>
                  <div style={{ "padding": "16px 22px 20px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2z"}></path>
                        </svg>
                      </span>
                      <span style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "display": "inline-flex", "alignItems": "center", "fontSize": "12px", "fontWeight": "600" }}>
                        {lookup(v, "rangeLabel")}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end" }}>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                        <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                          {"Ticket promedio"}
                        </span>
                        <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                          <span style={{ "color": "#E8701F" }}>
                            {"S/"}
                          </span>
                          {" "}
                          {lookup(v, "ticket")}
                        </span>
                      </span>
                      <DesignLink href={"/reportes"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "fontSize": "12px", "fontWeight": "600", "color": "#C2410C", "textDecoration": "none" }}>
                        <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#E8701F", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"3"} strokeLinecap={"round"} aria-hidden={"true"}>
                            <path d={"M4 16l5-5 4 4 7-7"}></path>
                          </svg>
                        </span>
                        {"Ver en"}
                        <br />
                        {"reportes"}
                      </DesignLink>
                    </div>
                  </div>
                </div>
                <div style={{ "flex": "0 0 150px", "display": "flex", "flexDirection": "column", "gap": "14px", "alignItems": "center" }}>
                  <DesignLink href={"/tienda"} style={{ "width": "140px", "height": "140px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "8px", "textDecoration": "none", "fontSize": "13px", "fontWeight": "600" }}>
                    <span style={{ "position": "relative", "display": "flex" }}>
                      <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <circle cx={"12"} cy={"12"} r={"9"}></circle>
                        <path d={"M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"}></path>
                      </svg>
                      <span style={{ "position": "absolute", "right": "-4px", "top": "-2px", "width": "8px", "height": "8px", "borderRadius": "50%", "background": "#2E9E4F", "border": "2px solid #F4F4F2" }}></span>
                    </span>
                    {"Tienda en línea"}
                  </DesignLink>
                  <div style={{ "width": "150px", "height": "150px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "position": "relative" }}>
                    <svg width={"150"} height={"150"} viewBox={"0 0 150 150"} role={"img"} aria-label={"Meta del mes al 74%"}>
                      <circle cx={"75"} cy={"75"} r={"52"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"7"} strokeLinecap={"round"} strokeDasharray={"80 400"} transform={"rotate(120 75 75)"}></circle>
                      <circle cx={"75"} cy={"75"} r={"52"} fill={"none"} stroke={"#E8701F"} strokeWidth={"7"} strokeLinecap={"round"} strokeDasharray={lookup(v, "goalDash")} transform={"rotate(-90 75 75)"}></circle>
                      <circle cx={"75"} cy={"75"} r={"40"} fill={"#1E1E1E"}></circle>
                      <text x={"75"} y={"74"} textAnchor={"middle"} fontFamily={"Manrope, sans-serif"} fontSize={"20"} fontWeight={"700"} fill={"#FFFFFF"}>
                        {"74%"}
                      </text>
                      <text x={"75"} y={"91"} textAnchor={"middle"} fontFamily={"Manrope, sans-serif"} fontSize={"10"} fill={"#BDBDBD"}>
                        {"de la meta"}
                      </text>
                    </svg>
                  </div>
                </div>
                <div style={{ "flex": "1 1 400px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px" }}>
                    <div style={{ "flex": "1 1 190px", "borderRadius": "30px", "background": "#F4F4F2", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                      <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <circle cx={"12"} cy={"12"} r={"9"}></circle>
                          <path d={"M12 7v5l3 2"}></path>
                        </svg>
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                        <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                          {"7 días"}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                          {"para cerrar octubre · faltan S/ 6,550"}
                        </span>
                      </span>
                      <div aria-hidden={"true"} style={{ "display": "grid", "gridTemplateColumns": "repeat(11, 10px)", "gap": "4px" }}>
                        {(lookup(v, "days") || []).map((d, index2) => (
                          <Fragment key={index2}>
                            <span style={{ "width": "10px", "height": "10px", "borderRadius": "50%", "background": lookup(d, "c") }}></span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ "flex": "1 1 190px", "borderRadius": "30px", "background": "#F4F4F2", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px", "position": "relative", "overflow": "hidden", "minHeight": "170px" }}>
                      <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "position": "relative", "zIndex": "1" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M4 19V9M10 19V5M16 19v-7M22 19H2"}></path>
                        </svg>
                      </span>
                      <div aria-hidden={"true"} style={{ "position": "absolute", "inset": "0", "display": "grid", "gridTemplateColumns": "repeat(6, minmax(0, 1fr))" }}>
                        <span style={{ "borderRight": "1px solid #E2E2DE" }}></span>
                        <span style={{ "borderRight": "1px solid #E2E2DE" }}></span>
                        <span style={{ "borderRight": "1px solid #E2E2DE" }}></span>
                        <span style={{ "borderRight": "1px solid #E2E2DE" }}></span>
                        <span style={{ "borderRight": "1px solid #E2E2DE" }}></span>
                        <span></span>
                      </div>
                      <span style={{ "position": "absolute", "right": "22%", "top": "46px", "bottom": "0", "width": "2px", "background": "#E8701F" }}></span>
                      <span style={{ "position": "absolute", "right": "12%", "top": "40px", "padding": "4px 10px", "borderRadius": "8px", "background": "#E8701F", "color": "#FFFFFF", "fontSize": "12px", "fontWeight": "700" }}>
                        {"2026 · S/ 18.4k"}
                      </span>
                      <span style={{ "position": "absolute", "left": "14%", "top": "92px", "padding": "4px 10px", "borderRadius": "8px", "background": "#DADAD6", "fontSize": "12px", "fontWeight": "700" }}>
                        {"2025 · S/ 16.5k"}
                      </span>
                      <span style={{ "position": "absolute", "left": "20px", "bottom": "16px", "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Octubre vs. año pasado"}
                      </span>
                    </div>
                  </div>
                  <div style={{ "borderRadius": "30px", "background": "#F4F4F2", "padding": "20px 22px", "display": "flex", "flexDirection": "column", "gap": "6px", "position": "relative", "overflow": "hidden", "minHeight": "180px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "position": "relative", "zIndex": "1" }}>
                      <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0"}></path>
                        </svg>
                      </span>
                      <span style={{ "fontSize": "24px", "fontWeight": "700" }}>
                        <span style={{ "color": "#E8701F" }}>
                          {"S/"}
                        </span>
                        {" 18,450.00"}
                      </span>
                    </div>
                    <svg width={"100%"} height={"70"} viewBox={"0 0 400 70"} preserveAspectRatio={"none"} aria-hidden={"true"} style={{ "position": "absolute", "left": "0", "right": "0", "top": "52px" }}>
                      <path d={lookup(v, "wave")} fill={"none"} stroke={"#E8701F"} strokeWidth={"1.6"} vectorEffect={"non-scaling-stroke"}></path>
                    </svg>
                    <span style={{ "flex": "1" }}></span>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "position": "relative", "zIndex": "1" }}>
                      <span style={{ "display": "flex", "flexDirection": "column" }}>
                        <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                          {"126 pedidos"}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                          {"Octubre · web, WhatsApp y empresas"}
                        </span>
                      </span>
                      <span style={{ "height": "32px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid #E8701F", "color": "#C2410C", "display": "inline-flex", "alignItems": "center", "fontSize": "13px", "fontWeight": "700" }}>
                        {"+ 8.0%"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "6px", "overflow": "hidden" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Ventas por categoría"}
                    </span>
                    <span style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "display": "inline-flex", "alignItems": "center", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Octubre"}
                    </span>
                  </div>
                  <svg width={"100%"} height={"300"} viewBox={"0 0 300 300"} role={"img"} aria-label={"Solar S/ 4,980; Focos S/ 3,720; Camping S/ 3,150; Extensiones S/ 2,240"}>
                    <circle cx={"150"} cy={"300"} r={"150"} fill={"#E8701F"} fillOpacity={"0.10"}></circle>
                    <circle cx={"150"} cy={"300"} r={"118"} fill={"#E8701F"} fillOpacity={"0.16"}></circle>
                    <circle cx={"150"} cy={"300"} r={"86"} fill={"#E8701F"} fillOpacity={"0.26"}></circle>
                    <circle cx={"150"} cy={"300"} r={"52"} fill={"#E8701F"}></circle>
                    <text x={"150"} y={"182"} textAnchor={"middle"} fontFamily={"Manrope, sans-serif"} fontSize={"15"} fontWeight={"700"} fill={"#111111"}>
                      {"Solar S/ 4,980"}
                    </text>
                    <text x={"150"} y={"214"} textAnchor={"middle"} fontFamily={"Manrope, sans-serif"} fontSize={"15"} fontWeight={"700"} fill={"#111111"}>
                      {"Focos S/ 3,720"}
                    </text>
                    <text x={"150"} y={"246"} textAnchor={"middle"} fontFamily={"Manrope, sans-serif"} fontSize={"15"} fontWeight={"700"} fill={"#111111"}>
                      {"Camping S/ 3,150"}
                    </text>
                    <text x={"150"} y={"284"} textAnchor={"middle"} fontFamily={"Manrope, sans-serif"} fontSize={"13"} fontWeight={"700"} fill={"#FFFFFF"}>
                      {"Ext. S/ 2,240"}
                    </text>
                  </svg>
                </div>
                <div style={{ "flex": "2 1 520px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Centro de actividad"}
                    </span>
                    <DesignLink href={"/pedidos"} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "background": "#FFFFFF", "display": "inline-flex", "alignItems": "center", "gap": "8px", "textDecoration": "none", "fontSize": "12px", "fontWeight": "600" }}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M4 6h16M7 12h10M10 18h4"}></path>
                      </svg>
                      {"Ver todo"}
                    </DesignLink>
                  </div>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                    <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "color": "#8C8C8C", "fontSize": "13px" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                        <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                        <path d={"M16 16l4 4"}></path>
                      </svg>
                      <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                        {"Buscar actividad"}
                      </span>
                      <input type={"search"} placeholder={"Buscar en la actividad…"} style={{ "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none", "width": "170px" }} />
                    </label>
                    <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "chips") || []).map((c, index3) => (
                        <Fragment key={index3}>
                          <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid " + String(lookup(c, "border") ?? ""), "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "600", "color": "#111111" }}>
                            {lookup(c, "name")}
                            <span style={{ "width": "7px", "height": "7px", "borderRadius": "50%", "background": lookup(c, "dot") }}></span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "12px" }}>
                    <div style={{ "flex": "1 1 170px", "minWidth": "0", "background": "#FFFFFF", "borderRadius": "24px", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                      <span style={{ "fontSize": "26px", "fontWeight": "700" }}>
                        <span style={{ "color": "#E8701F" }}>
                          {"S/"}
                        </span>
                        {" 4,410 "}
                        <span style={{ "fontSize": "11px", "color": "#8C8C8C", "fontWeight": "600" }}>
                          {"HOY"}
                        </span>
                      </span>
                      <div aria-hidden={"true"} style={{ "display": "flex", "alignItems": "center", "gap": "5px", "height": "70px" }}>
                        {(lookup(v, "hours") || []).map((h, index4) => (
                          <Fragment key={index4}>
                            <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "justifyContent": "center", "height": "100%" }}>
                              <span style={{ "width": "2px", "margin": "0 auto", "height": lookup(h, "h"), "background": lookup(h, "c"), "borderRadius": "2px" }}></span>
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      <div aria-hidden={"true"} style={{ "display": "flex", "justifyContent": "center", "gap": "6px" }}>
                        <span style={{ "width": "6px", "height": "6px", "borderRadius": "50%", "background": "#DADAD6" }}></span>
                        <span style={{ "width": "6px", "height": "6px", "borderRadius": "50%", "background": "#DADAD6" }}></span>
                        <span style={{ "width": "18px", "height": "6px", "borderRadius": "3px", "background": "#E8701F" }}></span>
                        <span style={{ "width": "6px", "height": "6px", "borderRadius": "50%", "background": "#DADAD6" }}></span>
                      </div>
                    </div>
                    <div style={{ "flex": "1 1 200px", "minWidth": "0", "background": "#FFFFFF", "borderRadius": "24px", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                          {"Por atender"}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                          {lookup(v, "openCount")}
                        </span>
                      </div>
                      {(lookup(v, "tasks") || []).map((t, index5) => (
                        <Fragment key={index5}>
                          <button onClick={lookup(t, "pick")} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "border": "none", "background": "transparent", "padding": "0", "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": lookup(t, "weight"), "color": lookup(t, "fg") }}>
                            <span style={{ "width": "26px", "height": "26px", "borderRadius": "50%", "background": lookup(t, "dotBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                              <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(t, "dotFg")} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(t, "icon")}></path>
                              </svg>
                            </span>
                            <span style={{ "flex": "1", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "minHeight": "30px", "padding": "0 10px", "borderRadius": "999px", "border": "1px solid " + String(lookup(t, "border") ?? "") }}>
                              {lookup(t, "name")}
                              {Boolean(lookup(t, "done")) && (
                                <Fragment>
                                  <span style={{ "color": "#2E9E4F" }}>
                                    {"✓"}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "flex": "1 1 190px", "minWidth": "0", "background": "#FFFFFF", "borderRadius": "24px", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                      <svg width={"44"} height={"44"} viewBox={"0 0 44 44"} aria-hidden={"true"}>
                        <g stroke={"#E8701F"} strokeWidth={"1.6"} strokeLinecap={"round"}>
                          <path d={"M22 4v8M22 32v8M4 22h8M32 22h8M9.3 9.3l5.6 5.6M29.1 29.1l5.6 5.6M9.3 34.7l5.6-5.6M29.1 14.9l5.6-5.6"}></path>
                        </g>
                        <circle cx={"22"} cy={"22"} r={"6"} fill={"none"} stroke={"#E8701F"} strokeWidth={"1.6"}></circle>
                      </svg>
                      <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                        {lookup(v, "feat.title")}
                      </span>
                      <span style={{ "fontSize": "12px", "lineHeight": "1.45", "color": "#8C8C8C" }}>
                        {lookup(v, "feat.sub")}
                      </span>
                      <span style={{ "flex": "1" }}></span>
                      <button onClick={lookup(v, "feat.act")} style={{ "height": "40px", "borderRadius": "999px", "border": "none", "background": lookup(v, "feat.btnBg"), "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(v, "feat.cta")}
                      </button>
                    </div>
                  </div>
                </div>
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span aria-hidden={"true"} style={{ "display": "flex", "gap": "5px" }}>
                      <span style={{ "width": "6px", "height": "6px", "borderRadius": "50%", "background": "#BDBDBD" }}></span>
                      <span style={{ "width": "6px", "height": "6px", "borderRadius": "50%", "background": "#BDBDBD" }}></span>
                      <span style={{ "width": "16px", "height": "6px", "borderRadius": "3px", "background": "#111111" }}></span>
                    </span>
                    <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M6 6l12 12M18 6L6 18"}></path>
                      </svg>
                    </span>
                  </div>
                  <span style={{ "flex": "1" }}></span>
                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                    {"Opinión de clientes · octubre"}
                  </span>
                  <span style={{ "fontSize": "18px", "fontWeight": "700", "lineHeight": "1.3" }}>
                    {"¿Cómo calificaron su compra en VIA?"}
                  </span>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "gap": "6px" }}>
                    {(lookup(v, "faces") || []).map((f, index6) => (
                      <Fragment key={index6}>
                        <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "6px" }}>
                          <span style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": lookup(f, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <svg width={"20"} height={"12"} viewBox={"0 0 20 12"} aria-hidden={"true"}>
                              <path d={lookup(f, "d")} fill={"none"} stroke={lookup(f, "stroke")} strokeWidth={"2"} strokeLinecap={"round"}></path>
                            </svg>
                          </span>
                          <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(f, "n")}
                          </span>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "2 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                        {"Ventas de los últimos 12 meses"}
                      </span>
                      <span style={{ "fontSize": "24px", "fontWeight": "700" }}>
                        <span style={{ "color": "#E8701F" }}>
                          {"S/"}
                        </span>
                        {" "}
                        {lookup(v, "yearTotal")}
                        {" "}
                        <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#2E7D32" }}>
                          {"▲ 18% vs. año anterior"}
                        </span>
                      </span>
                    </span>
                    <span style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "background": "#FFFFFF", "display": "inline-flex", "alignItems": "center", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Nov 2025 – Oct 2026"}
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "18px 18px 12px", "display": "flex", "gap": "10px" }}>
                    <div aria-hidden={"true"} style={{ "display": "flex", "flexDirection": "column", "justifyContent": "space-between", "height": "200px", "fontSize": "11px", "color": "#8C8C8C", "textAlign": "right", "flex": "none" }}>
                      <span>
                        {"S/ 25k"}
                      </span>
                      <span>
                        {"S/ 12.5k"}
                      </span>
                      <span>
                        {"0"}
                      </span>
                    </div>
                    <div style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      <div style={{ "position": "relative", "height": "200px", "display": "flex", "alignItems": "flex-end", "gap": "10px", "borderBottom": "1px solid #E4E4E0" }}>
                        <div aria-hidden={"true"} style={{ "position": "absolute", "left": "0", "right": "0", "top": "0", "borderTop": "1px dashed #EDEDEA" }}></div>
                        <div aria-hidden={"true"} style={{ "position": "absolute", "left": "0", "right": "0", "top": "100px", "borderTop": "1px dashed #EDEDEA" }}></div>
                        {(lookup(v, "months") || []).map((m, index7) => (
                          <Fragment key={index7}>
                            <button onMouseEnter={lookup(m, "enter")} onMouseLeave={lookup(m, "leave")} onFocus={lookup(m, "enter")} onBlur={lookup(m, "leave")} aria-label={lookup(m, "aria")} style={{ "position": "relative", "flex": "1", "height": "100%", "border": "none", "background": "transparent", "padding": "0", "cursor": "default", "display": "flex", "alignItems": "flex-end" }}>
                              <span style={{ "width": "100%", "height": lookup(m, "h"), "background": lookup(m, "c"), "borderRadius": "10px 10px 4px 4px" }}></span>
                              {Boolean(lookup(m, "hover")) && (
                                <Fragment>
                                  <span style={{ "position": "absolute", "left": "50%", "bottom": "calc(" + String(lookup(m, "h") ?? "") + " + 10px)", "transform": "translateX(-50%)", "background": "#111111", "color": "#FFFFFF", "borderRadius": "10px", "padding": "8px 10px", "whiteSpace": "nowrap", "fontSize": "12px", "fontWeight": "700", "zIndex": "3", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                                    <span>
                                      {lookup(m, "label")}
                                    </span>
                                    <span style={{ "color": "#FFB98A" }}>
                                      {lookup(m, "value")}
                                    </span>
                                    <span style={{ "fontWeight": "500", "color": "#CFCFCF" }}>
                                      {lookup(m, "orders")}
                                    </span>
                                  </span>
                                </Fragment>
                              )}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      <div aria-hidden={"true"} style={{ "display": "flex", "gap": "10px" }}>
                        {(lookup(v, "months") || []).map((m, index8) => (
                          <Fragment key={index8}>
                            <span style={{ "flex": "1", "textAlign": "center", "fontSize": "11px", "color": "#8C8C8C" }}>
                              {lookup(m, "tick")}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Canales de venta"}
                  </span>
                  <div style={{ "position": "relative", "alignSelf": "center", "width": "200px", "height": "200px" }}>
                    <svg width={"200"} height={"200"} viewBox={"0 0 200 200"} role={"img"} aria-label={"Tienda web 46%, WhatsApp 32%, Empresas 22%"}>
                      {(lookup(v, "donut") || []).map((d, index9) => (
                        <Fragment key={index9}>
                          <circle cx={"100"} cy={"100"} r={"78"} fill={"none"} stroke={lookup(d, "color")} strokeWidth={"26"} strokeDasharray={lookup(d, "dash")} strokeDashoffset={lookup(d, "offset")} transform={"rotate(-90 100 100)"}></circle>
                        </Fragment>
                      ))}
                    </svg>
                    <span style={{ "position": "absolute", "inset": "0", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Octubre"}
                      </span>
                      <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                        {"S/ 18.4k"}
                      </span>
                    </span>
                  </div>
                  {(lookup(v, "donut") || []).map((d, index10) => (
                    <Fragment key={index10}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "13px" }}>
                        <span style={{ "width": "12px", "height": "12px", "borderRadius": "4px", "background": lookup(d, "color"), "flex": "none" }}></span>
                        <span style={{ "flex": "1", "fontWeight": "600" }}>
                          {lookup(d, "name")}
                        </span>
                        <span style={{ "color": "#6B6B6B" }}>
                          {lookup(d, "pct")}
                        </span>
                        <span style={{ "fontWeight": "700", "minWidth": "70px", "textAlign": "right" }}>
                          {lookup(d, "amount")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Ventas por tipo de cliente"}
                  </span>
                  {(lookup(v, "segments") || []).map((s, index11) => (
                    <Fragment key={index11}>
                      <div style={{ "background": "#FFFFFF", "borderRadius": "18px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(s, "name")}
                          </span>
                          <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                            {lookup(s, "amount")}
                          </span>
                        </div>
                        <span style={{ "height": "8px", "borderRadius": "999px", "background": "#F1F1EE", "overflow": "hidden" }}>
                          <span style={{ "display": "block", "width": lookup(s, "w"), "height": "100%", "background": "#E8701F", "borderRadius": "999px" }}></span>
                        </span>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "11px", "color": "#6B6B6B" }}>
                          <span>
                            {lookup(s, "clients")}
                          </span>
                          <span>
                            {lookup(s, "pct")}
                            {" de las ventas"}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Pedidos por estado"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Octubre · 126"}
                    </span>
                  </div>
                  {(lookup(v, "funnel") || []).map((f, index12) => (
                    <Fragment key={index12}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                        <span style={{ "width": "84px", "fontSize": "12px", "fontWeight": "600", "flex": "none" }}>
                          {lookup(f, "name")}
                        </span>
                        <span style={{ "flex": "1", "height": "34px", "borderRadius": "12px", "background": "#FFFFFF", "position": "relative", "overflow": "hidden" }}>
                          <span style={{ "position": "absolute", "left": "0", "top": "0", "bottom": "0", "width": lookup(f, "w"), "background": lookup(f, "c"), "borderRadius": "12px" }}></span>
                          <span style={{ "position": "absolute", "left": "12px", "top": "0", "bottom": "0", "display": "flex", "alignItems": "center", "fontSize": "13px", "fontWeight": "800", "color": lookup(f, "fg") }}>
                            {lookup(f, "n")}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                    {"5 pedidos esperan pago y 9 están por preparar."}
                  </span>
                </div>
                <div style={{ "flex": "2 1 520px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"¿Cuándo se vende más?"}
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "fontSize": "11px", "color": "#6B6B6B" }}>
                      {"Menos"}
                      <span style={{ "display": "inline-flex", "gap": "3px" }}>
                        <span style={{ "width": "14px", "height": "14px", "borderRadius": "4px", "background": "#E8701F", "opacity": "0.12" }}></span>
                        <span style={{ "width": "14px", "height": "14px", "borderRadius": "4px", "background": "#E8701F", "opacity": "0.35" }}></span>
                        <span style={{ "width": "14px", "height": "14px", "borderRadius": "4px", "background": "#E8701F", "opacity": "0.6" }}></span>
                        <span style={{ "width": "14px", "height": "14px", "borderRadius": "4px", "background": "#E8701F", "opacity": "0.85" }}></span>
                        <span style={{ "width": "14px", "height": "14px", "borderRadius": "4px", "background": "#B4530F" }}></span>
                      </span>
                      {"Más"}
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "5px" }}>
                    {(lookup(v, "heat") || []).map((r, index13) => (
                      <Fragment key={index13}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "5px" }}>
                          <span style={{ "width": "34px", "fontSize": "11px", "fontWeight": "600", "color": "#6B6B6B", "flex": "none" }}>
                            {lookup(r, "day")}
                          </span>
                          {(lookup(r, "cells") || []).map((c, index14) => (
                            <Fragment key={index14}>
                              <span title={lookup(c, "title")} style={{ "flex": "1", "height": "24px", "borderRadius": "6px", "background": lookup(c, "bg"), "opacity": lookup(c, "o") }}></span>
                            </Fragment>
                          ))}
                        </div>
                      </Fragment>
                    ))}
                    <div aria-hidden={"true"} style={{ "display": "flex", "gap": "5px", "paddingLeft": "39px" }}>
                      {(lookup(v, "heatHours") || []).map((h, index15) => (
                        <Fragment key={index15}>
                          <span style={{ "flex": "1", "textAlign": "center", "fontSize": "10px", "color": "#8C8C8C" }}>
                            {lookup(h, "t")}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                    {"Los sábados de 17h a 19h es cuando más vendes. Programa ofertas y respuestas rápidas de WhatsApp en ese horario."}
                  </span>
                </div>
                <div style={{ "flex": "1 1 260px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Inventario"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                      {"291 productos"}
                    </span>
                  </div>
                  <span style={{ "fontSize": "34px", "fontWeight": "800", "lineHeight": "1" }}>
                    {"98%"}
                    <span style={{ "fontSize": "13px", "fontWeight": "600", "color": "#BDBDBD" }}>
                      {" disponible"}
                    </span>
                  </span>
                  <div aria-hidden={"true"} style={{ "display": "flex", "gap": "3px", "height": "14px", "borderRadius": "7px", "overflow": "hidden" }}>
                    <span style={{ "width": "96%", "background": "#34C759" }}></span>
                    <span style={{ "width": "3%", "background": "#FFB020" }}></span>
                    <span style={{ "width": "1%", "background": "#FF5A4E" }}></span>
                  </div>
                  {(lookup(v, "stockMix") || []).map((s, index16) => (
                    <Fragment key={index16}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "13px" }}>
                        <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": lookup(s, "c"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1" }}>
                          {lookup(s, "name")}
                        </span>
                        <span style={{ "fontWeight": "800" }}>
                          {lookup(s, "n")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <DesignLink href={"/inventario"} style={{ "marginTop": "auto", "height": "40px", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                    {"Revisar inventario"}
                  </DesignLink>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Más vendidos"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Octubre"}
                    </span>
                  </div>
                  {(lookup(v, "top") || []).map((t, index17) => (
                    <Fragment key={index17}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "background": "#FFFFFF", "borderRadius": "18px", "padding": "10px 12px" }}>
                        <img src={assetSrc(lookup(t, "img"))} alt={""} style={{ "width": "42px", "height": "42px", "borderRadius": "12px", "objectFit": "cover", "flex": "none" }} />
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                          <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px", "fontSize": "13px" }}>
                            <span style={{ "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                              {lookup(t, "name")}
                            </span>
                            <span style={{ "fontWeight": "800", "whiteSpace": "nowrap" }}>
                              {lookup(t, "sales")}
                            </span>
                          </span>
                          <span style={{ "height": "5px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                            <span style={{ "display": "block", "width": lookup(t, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(t, "units")}
                            {" unidades · "}
                            {lookup(t, "cat")}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 260px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Envíos por ciudad"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Pedidos"}
                    </span>
                  </div>
                  {(lookup(v, "cities") || []).map((c, index18) => (
                    <Fragment key={index18}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "84px minmax(0, 1fr) 32px", "alignItems": "center", "gap": "10px", "fontSize": "13px" }}>
                        <span style={{ "fontWeight": "600" }}>
                          {lookup(c, "name")}
                        </span>
                        <span style={{ "height": "26px", "borderRadius": "8px", "background": "#FFFFFF", "overflow": "hidden" }}>
                          <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "background": "#E8701F", "opacity": lookup(c, "o"), "borderRadius": "8px" }}></span>
                        </span>
                        <span style={{ "fontWeight": "800", "textAlign": "right" }}>
                          {lookup(c, "n")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                    {"72% de los pedidos se quedan en Arequipa; Cusco y Puno crecen por las ventas a minería."}
                  </span>
                </div>
                <div style={{ "flex": "2 1 480px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Pedidos recientes"}
                    </span>
                    <DesignLink href={"/pedidos"} style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "background": "#FFFFFF", "display": "inline-flex", "alignItems": "center", "textDecoration": "none", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Ver todos →"}
                    </DesignLink>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "6px 14px" }}>
                    {(lookup(v, "recent") || []).map((o, index19) => (
                      <Fragment key={index19}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 0", "borderBottom": "1px solid #F1F1EE", "flexWrap": "wrap" }}>
                          <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": "#FFF1E6", "color": "#8A3B0A", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "12px", "fontWeight": "800", "flex": "none" }}>
                            {lookup(o, "ini")}
                          </span>
                          <span style={{ "flex": "1 1 160px", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(o, "client")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(o, "id")}
                              {" · "}
                              {lookup(o, "channel")}
                              {" · "}
                              {lookup(o, "time")}
                            </span>
                          </span>
                          <span style={{ "padding": "4px 10px", "borderRadius": "999px", "background": lookup(o, "bg"), "color": lookup(o, "fg"), "fontSize": "11px", "fontWeight": "700" }}>
                            {lookup(o, "status")}
                          </span>
                          <span style={{ "minWidth": "88px", "textAlign": "right", "fontSize": "14px", "fontWeight": "800" }}>
                            {lookup(o, "total")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div className={"db-menu-backdrop"} style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box", "animation": lookup(v, "menuBackdropAnimation") }}>
              <div className={"db-menu-panel"} style={{ "maxWidth": "1100px", "width": "100%", "margin": "0 auto", "animation": lookup(v, "menuPanelAnimation") }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Panel"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
