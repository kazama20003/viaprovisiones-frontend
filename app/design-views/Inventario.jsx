"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), open: 'P1', filter: 'Todos', cat: 'Todas', loc: 0, saved: false, formHi: false };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const st = this.state;
    const money = (n, d = 2) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: d, maximumFractionDigits: d });
    const LOT = (code, supplier, date, qty, left, cost, loc, warranty, status) => ({ code, supplier, date, qty, left, cost, loc, warranty, status });
    const PROD = [
      { id: 'P1', name: 'Foco LED 9 W luz cálida', sku: 'FOC-LED9-C', cat: 'Focos', price: 8.9, min: 60, img: '52dc55c2523393f8f60ab89499fa3ec1', lots: [
        LOT('L-0921', '[Proveedor A]', '21 set', 300, 0, 4.2, 'Tienda · A3', 'set 2027', 'Agotado'),
        LOT('L-1008', '[Proveedor A]', '08 oct', 200, 140, 4.1, 'Tienda · A3', 'oct 2027', 'Activo'),
        LOT('L-1020', '[Proveedor B]', '20 oct', 120, 100, 4.05, 'Almacén · R2', 'oct 2027', 'Activo')] },
      { id: 'P2', name: 'Panel solar monocristalino 100 W', sku: 'SOL-PAN100', cat: 'Solar', price: 349, min: 5, img: '972ceb606bfca75ef6208d8d3966c77d', lots: [
        LOT('L-0805', '[Proveedor C]', '05 ago', 10, 2, 238, 'Almacén · R1', 'ago 2036', 'Activo'),
        LOT('L-1015', '[Proveedor C]', '15 oct', 10, 5, 232, 'Almacén · R1', 'oct 2036', 'Activo'),
        LOT('L-1102', '[Proveedor C]', 'Llega 28 oct', 12, 12, 229, 'Almacén · R1', 'oct 2036', 'En tránsito')] },
      { id: 'P3', name: 'Estación de energía portátil', sku: 'SOL-EST500', cat: 'Solar', price: 1290, min: 4, img: '56a034356f25e7cd0fe7251db3cbbddc', lots: [
        LOT('L-0910', '[Proveedor C]', '10 set', 6, 3, 905, 'Tienda · Vitrina', 'set 2028', 'Activo')] },
      { id: 'P4', name: 'Lámpara de camping recargable', sku: 'CAM-LAMP-R', cat: 'Camping', price: 69.9, min: 10, img: 'a58999411e32d7481815ba8cdc175e97', lots: [
        LOT('L-0915', '[Proveedor D]', '15 set', 40, 5, 31, 'Tienda · B1', 'set 2027', 'Activo'),
        LOT('L-1030', '[Proveedor D]', 'Llega 30 oct', 30, 30, 30.5, 'Tienda · B1', 'oct 2027', 'En tránsito')] },
      { id: 'P5', name: 'Cable USB-C carga rápida 1 m', sku: 'CAB-USBC-1', cat: 'Cables', price: 19.9, min: 50, img: '3aba2390d3fbd5f06fdd2cede507b16f', lots: [
        LOT('L-0901', '[Proveedor B]', '01 set', 200, 110, 6.5, 'Tienda · C2', 'set 2027', 'Activo'),
        LOT('L-1012', '[Proveedor B]', '12 oct', 200, 200, 6.3, 'Almacén · R3', 'oct 2027', 'En revisión')] },
      { id: 'P6', name: 'Extensión de uso rudo 5 m', sku: 'EXT-RUDO-5', cat: 'Extensiones', price: 45, min: 12, img: '323e29809539c2fb4b229651c8081ee9', lots: [
        LOT('L-0928', '[Proveedor E]', '28 set', 30, 9, 22, 'Almacén · R2', 'set 2027', 'Activo')] },
      { id: 'P7', name: 'Mosquetón llavero de aluminio', sku: 'LLA-MOSQ-A', cat: 'Llaveros', price: 9.9, min: 30, img: 'eb0c79147accd306bbd7a39d350a8e88', lots: [
        LOT('L-0830', '[Proveedor F]', '30 ago', 200, 150, 2.9, 'Tienda · Mostrador', '—', 'Activo')] },
      { id: 'P8', name: 'Collar dorado de cadena fina', sku: 'BIS-COL-DOR', cat: 'Bisutería', price: 29.9, min: 8, img: '792438e54fa4b4d81f31171a2cf026f6', lots: [
        LOT('L-0820', '[Proveedor G]', '20 ago', 40, 0, 9.8, 'Tienda · Vitrina', '—', 'Agotado')] }
    ];
    const sellable = (l) => l.status === 'Activo';
    const enrich = PROD.map((p) => {
      const stock = p.lots.filter(sellable).reduce((a, l) => a + l.left, 0);
      const units = p.lots.filter((l) => l.status !== 'En tránsito' && l.status !== 'Agotado').reduce((a, l) => a + l.left, 0);
      const valued = p.lots.filter((l) => l.status !== 'En tránsito' && l.status !== 'Agotado');
      const avg = valued.length ? valued.reduce((a, l) => a + l.left * l.cost, 0) / Math.max(1, units) : p.lots[p.lots.length - 1].cost;
      const state = stock === 0 ? 'Agotado' : stock < p.min ? 'Stock bajo' : 'Disponible';
      const transit = p.lots.some((l) => l.status === 'En tránsito');
      return { ...p, stock, units, avg, state, transit, value: units * avg };
    });
    const SS = {
      Disponible: ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10', '#2E9E4F'],
      'Stock bajo': ['#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01', '#F2A100'],
      Agotado: ['#FDE4E2', '#8E1C14', 'M6 6l12 12M18 6L6 18', '#E5483B']
    };
    const LS = {
      Activo: ['#E4F4E7', '#1B5E20', '#2E9E4F'], 'En tránsito': ['#E3F1FF', '#0B4A8A', '#2F7BD8'],
      'En revisión': ['#FFF4D6', '#7A4A00', '#F2A100'], Agotado: ['#EFEFEC', '#6B6B6B', '#BDBDBD']
    };
    const FILTERS = [['Todos', () => true], ['Stock bajo', (p) => p.state === 'Stock bajo'], ['Agotados', (p) => p.state === 'Agotado'], ['En tránsito', (p) => p.transit]];
    const CATS = ['Todas', 'Focos', 'Solar', 'Cables', 'Extensiones', 'Llaveros', 'Camping', 'Bisutería'];
    const fFn = (FILTERS.find((f) => f[0] === st.filter) || FILTERS[0])[1];
    const list = enrich.filter(fFn).filter((p) => st.cat === 'Todas' || p.cat === st.cat);
    const totalUnits = enrich.reduce((a, p) => a + p.units, 0);
    const allLots = PROD.flatMap((p) => p.lots);
    const totalValue = enrich.reduce((a, p) => a + p.value, 0);
    const retail = enrich.reduce((a, p) => a + p.units * p.price, 0);
    const catVals = {};
    enrich.forEach((p) => { catVals[p.cat] = (catVals[p.cat] || 0) + p.value; });
    const catArr = Object.entries(catVals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const counts = { Disponible: enrich.filter((p) => p.state === 'Disponible').length, 'Stock bajo': enrich.filter((p) => p.state === 'Stock bajo').length, Agotado: enrich.filter((p) => p.state === 'Agotado').length };
    const LOCS = ['Tienda Dean Valdivia', 'Almacén', 'En tránsito'];
    const MI = (label, href, icon, on) => ({ label, href, icon, bg: on ? '#F4F4F2' : 'transparent', iconBg: on ? '#E8701F' : '#F4F4F2', iconFg: on ? '#FFFFFF' : '#111111' });
    const moves = [
      ['Entrada de lote', '+120', 'Foco LED 9 W · L-1020 · Almacén', '#E4F4E7', '#1B5E20', 'M12 19V5M5 12l7-7 7 7', '#1B5E20'],
      ['Venta #1041', '−48', 'Foco LED 9 W · salió del lote L-1008', '#FFE7D6', '#8A3B0A', 'M12 5v14M5 12l7 7 7-7', '#8A3B0A'],
      ['Traslado', '20', 'Cable USB-C · Almacén → Tienda C2', '#E3F1FF', '#0B4A8A', 'M4 12h16M14 6l6 6-6 6', '#0B4A8A'],
      ['Ajuste por daño', '−2', 'Cable USB-C · L-0901 · empaque roto', '#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01', '#7A4A00'],
      ['Venta #1042', '−2', 'Lámpara de camping · lote L-0915', '#FFE7D6', '#8A3B0A', 'M12 5v14M5 12l7 7 7-7', '#8A3B0A']
    ];
    return {
      accent,
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      focusForm: () => this.setState({ formHi: true, saved: false }),
      formBg: st.formHi ? '#FFF1E6' : '#F4F4F2',
      saved: st.saved,
      saveLot: () => this.setState({ saved: true, formHi: false }),
      totalUnits: totalUnits.toLocaleString('es-PE'),
      lotCount: String(allLots.filter((l) => l.status !== 'Agotado').length),
      headStats: [
        { v: '291', k1: 'Productos', k2: 'en catálogo', bg: '#FFFFFF', fg: '#111111' },
        { v: String(counts['Stock bajo']), k1: 'Con stock', k2: 'bajo', bg: '#FFF4D6', fg: '#7A4A00' },
        { v: String(counts.Agotado), k1: 'Productos', k2: 'agotados', bg: '#FDE4E2', fg: '#8E1C14' },
        { v: String(allLots.filter((l) => l.status === 'En tránsito').length), k1: 'Lotes', k2: 'en camino', bg: '#111111', fg: '#FFFFFF' }
      ],
      stockValue: totalValue.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      retailValue: retail.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      potMargin: Math.round(((retail - totalValue) / retail) * 100) + '%',
      byCat: catArr.map(([name, v]) => ({ name, v: money(v, 0), w: Math.round((v / catArr[0][1]) * 100) + '%' })),
      health: ['Disponible', 'Stock bajo', 'Agotado'].map((k) => ({ name: k, n: String(counts[k]), w: Math.max(3, Math.round((counts[k] / enrich.length) * 100)) + '%', c: SS[k][3], icon: SS[k][2],
        note: k === 'Disponible' ? 'Sobre el mínimo' : k === 'Stock bajo' ? 'Por debajo del mínimo' : 'Sin unidades para vender',
        pick: () => this.setState({ filter: k === 'Disponible' ? 'Todos' : k === 'Agotado' ? 'Agotados' : 'Stock bajo' }) })),
      rotation: [['Focos', 18], ['Cables', 24], ['Llaveros', 31], ['Camping', 42], ['Solar', 67]].map((r, i) => ({ name: r[0], d: r[1] + ' d', w: Math.round((r[1] / 67) * 100) + '%', o: (1 - i * 0.15).toFixed(2) })),
      lotStates: ['Activo', 'En tránsito', 'En revisión', 'Agotado'].map((k) => ({ name: k === 'Activo' ? 'Activos' : k === 'Agotado' ? 'Agotados' : k, n: String(allLots.filter((l) => l.status === k).length), fg: LS[k][1], dot: LS[k][2] })),
      filters: FILTERS.map((f) => ({ name: f[0], count: String(enrich.filter(f[1]).length), pressed: st.filter === f[0] ? 'true' : 'false', bg: st.filter === f[0] ? '#111111' : '#FFFFFF', fg: st.filter === f[0] ? '#FFFFFF' : '#111111', border: st.filter === f[0] ? '#111111' : '#E4E4E0', pick: () => this.setState({ filter: f[0] }) })),
      cats: CATS.map((c) => ({ name: c, pressed: st.cat === c ? 'true' : 'false', bg: st.cat === c ? '#E8701F' : '#FFFFFF', fg: st.cat === c ? '#FFFFFF' : '#111111', pick: () => this.setState({ cat: c }) })),
      rows: list.map((p) => {
        const open = st.open === p.id;
        const active = p.lots.filter((l) => l.status !== 'Agotado');
        let ord = 0;
        const sortedLots = [...p.lots];
        return {
          name: p.name, sku: p.sku, cat: p.cat, img: B + p.img,
          lotsActive: String(active.length), lotsNote: p.lots.length > active.length ? '+' + (p.lots.length - active.length) + ' cerrado' : (p.transit ? '1 en camino' : 'activos'),
          stock: String(p.stock), min: String(p.min), w: Math.min(100, Math.round((p.stock / (p.min * 3)) * 100)) + '%', barC: SS[p.state][3],
          cost: money(p.avg), price: money(p.price), margin: Math.round(((p.price - p.avg) / p.price) * 100) + '%',
          status: p.state, sBg: SS[p.state][0], sFg: SS[p.state][1], sIcon: SS[p.state][2],
          border: open ? '#E8701F' : '#FFFFFF', open, expanded: open ? 'true' : 'false', chev: open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6',
          toggle: () => this.setState({ open: open ? null : p.id }),
          lots: sortedLots.map((l) => {
            const sellNow = l.status === 'Activo';
            if (sellNow) ord += 1;
            const first = sellNow && ord === 1;
            return { code: l.code, supplier: l.supplier, date: l.date, qty: String(l.qty), left: String(l.left), cost: money(l.cost), loc: l.loc, warranty: l.warranty,
              w: Math.round((l.left / l.qty) * 100) + '%', status: first ? 'Se vende primero' : l.status,
              sBg: first ? '#FFE7D6' : LS[l.status][0], sFg: first ? '#8A3B0A' : LS[l.status][1], dot: first ? '#E8701F' : LS[l.status][2],
              ord: sellNow ? String(ord) : '—', ordBg: first ? '#E8701F' : (sellNow ? '#111111' : '#E9E9E6'), ordFg: sellNow ? '#FFFFFF' : '#6B6B6B',
              rowBg: first ? '#FFF6EF' : '#F7F7F5', op: l.status === 'Agotado' ? '0.6' : '1' };
          })
        };
      }),
      locs: LOCS.map((n, i) => ({ name: n, pressed: i === st.loc ? 'true' : 'false', bg: i === st.loc ? '#111111' : '#FFFFFF', fg: i === st.loc ? '#FFFFFF' : '#111111', pick: () => this.setState({ loc: i }) })),
      moveCount: moves.length + ' movimientos',
      moves: moves.map((m) => ({ title: m[0], qty: m[1], sub: m[2], bg: m[3], fg: m[4], icon: m[5], qtyC: m[6] })),
      menu: [
        MI('Panel', '/dashboard', 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z'),
        MI('Pedidos', '/pedidos', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0'),
        MI('Inventario y lotes', '/inventario', 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', true),
        MI('Tienda web', '/tienda', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18'),
        MI('Enlaces y QR', '/enlaces', 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z'),
        MI('Cerrar sesión', '/admin/login', 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10')
      ]
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Inventario(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Inventario"} onPin={lookup(v, "togglePin")} />
              </div>
            </Fragment>
          )}
          <div>
            <div style={{ "padding": "28px 32px 30px", "display": "flex", "flexDirection": "column", "gap": "28px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "flexWrap": "wrap" }}>
                <button onClick={lookup(v, "menuBtn")} aria-label={lookup(v, "menuBtnLabel")} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M4 8h16M4 16h10"}></path>
                  </svg>
                </button>
                <a href={"/dashboard"} aria-label={"Ir al panel"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-inv"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-inv)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </a>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Inventario"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Stock y lotes"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "focusForm")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Ingresar lote"}
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
                <label style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                  <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                      <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                      <path d={"M16 16l4 4"}></path>
                    </svg>
                  </span>
                  <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                    {"Buscar producto, SKU o lote"}
                  </span>
                  <input type={"search"} placeholder={"Producto, SKU o lote…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Inventario"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "totalUnits")}
                    {" unidades en "}
                    {lookup(v, "lotCount")}
                    {" lotes"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                {(lookup(v, "headStats") || []).map((h, index1) => (
                  <Fragment key={index1}>
                    <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                      <span style={{ "minWidth": "76px", "height": "76px", "padding": "0 14px", "boxSizing": "border-box", "borderRadius": "999px", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "20px", "fontWeight": "700", "background": lookup(h, "bg"), "color": lookup(h, "fg") }}>
                        {lookup(h, "v")}
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "fontSize": "13px", "fontWeight": "600", "lineHeight": "1.25" }}>
                        <span>
                          {lookup(h, "k1")}
                        </span>
                        <span style={{ "color": "#8C8C8C" }}>
                          {lookup(h, "k2")}
                        </span>
                      </span>
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ "background": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Valor del inventario"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                      {"a costo"}
                    </span>
                  </div>
                  <span style={{ "fontSize": "34px", "fontWeight": "800", "lineHeight": "1" }}>
                    <span style={{ "color": "#FF914C" }}>
                      {"S/"}
                    </span>
                    {" "}
                    {lookup(v, "stockValue")}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                    {"Valor a precio de venta: S/ "}
                    {lookup(v, "retailValue")}
                    {" · margen potencial "}
                    {lookup(v, "potMargin")}
                  </span>
                  {(lookup(v, "byCat") || []).map((c, index2) => (
                    <Fragment key={index2}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "82px minmax(0, 1fr) 74px", "alignItems": "center", "gap": "10px", "fontSize": "12px" }}>
                        <span>
                          {lookup(c, "name")}
                        </span>
                        <span style={{ "height": "6px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                          <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                        </span>
                        <span style={{ "textAlign": "right", "fontWeight": "700" }}>
                          {lookup(c, "v")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 260px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Salud del stock"}
                  </span>
                  <div aria-hidden={"true"} style={{ "display": "flex", "gap": "3px", "height": "14px", "borderRadius": "7px", "overflow": "hidden" }}>
                    {(lookup(v, "health") || []).map((h, index3) => (
                      <Fragment key={index3}>
                        <span style={{ "width": lookup(h, "w"), "background": lookup(h, "c") }}></span>
                      </Fragment>
                    ))}
                  </div>
                  {(lookup(v, "health") || []).map((h, index4) => (
                    <Fragment key={index4}>
                      <button onClick={lookup(h, "pick")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "18px", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "textAlign": "left", "color": "#111111" }}>
                        <span style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "background": lookup(h, "c"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(h, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(h, "name")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(h, "note")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                          {lookup(h, "n")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 260px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Rotación"}
                    </span>
                    <span style={{ "height": "30px", "padding": "0 12px", "borderRadius": "999px", "background": "#FFFFFF", "display": "inline-flex", "alignItems": "center", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Últimos 90 días"}
                    </span>
                  </div>
                  <span style={{ "display": "flex", "alignItems": "baseline", "gap": "8px" }}>
                    <span style={{ "fontSize": "34px", "fontWeight": "800" }}>
                      {"38"}
                    </span>
                    <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                      {"días promedio para vender un lote"}
                    </span>
                  </span>
                  {(lookup(v, "rotation") || []).map((r, index5) => (
                    <Fragment key={index5}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "82px minmax(0, 1fr) 54px", "alignItems": "center", "gap": "10px", "fontSize": "12px" }}>
                        <span style={{ "fontWeight": "600" }}>
                          {lookup(r, "name")}
                        </span>
                        <span style={{ "height": "22px", "borderRadius": "7px", "background": "#FFFFFF", "overflow": "hidden" }}>
                          <span style={{ "display": "block", "width": lookup(r, "w"), "height": "100%", "background": "#E8701F", "opacity": lookup(r, "o"), "borderRadius": "7px" }}></span>
                        </span>
                        <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                          {lookup(r, "d")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                    {"Menos días = se vende más rápido."}
                  </span>
                </div>
                <div style={{ "flex": "1 1 260px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Lotes"}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                    {(lookup(v, "lotStates") || []).map((l, index6) => (
                      <Fragment key={index6}>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "12px", "borderRadius": "16px", "background": "#FFFFFF" }}>
                          <span style={{ "display": "flex", "alignItems": "center", "gap": "6px", "fontSize": "11px", "fontWeight": "700", "color": lookup(l, "fg") }}>
                            <span style={{ "width": "8px", "height": "8px", "borderRadius": "50%", "background": lookup(l, "dot") }}></span>
                            {lookup(l, "name")}
                          </span>
                          <span style={{ "fontSize": "24px", "fontWeight": "800" }}>
                            {lookup(l, "n")}
                          </span>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "marginTop": "auto", "padding": "14px", "borderRadius": "18px", "background": "#FFFFFF", "display": "flex", "gap": "12px", "alignItems": "center" }}>
                    <span style={{ "width": "38px", "height": "38px", "borderRadius": "12px", "background": "#E3F1FF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#0B4A8A"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.5 1.5 0 1 0 0-.1M17 19a1.5 1.5 0 1 0 0-.1"}></path>
                      </svg>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "fontSize": "12px" }}>
                      <span style={{ "fontWeight": "700" }}>
                        {"Próximo en llegar · 28 oct"}
                      </span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Panel solar 100 W · 12 und. · L-1102"}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "flex-start" }}>
                <div style={{ "flex": "3 1 760px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Productos y lotes"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Toca un producto para ver sus lotes. Se vende primero el lote más antiguo (PEPS)."}
                      </span>
                    </span>
                    <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "filters") || []).map((f, index7) => (
                        <Fragment key={index7}>
                          <button onClick={lookup(f, "pick")} aria-pressed={lookup(f, "pressed")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "34px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(f, "border") ?? ""), "background": lookup(f, "bg"), "color": lookup(f, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(f, "name")}
                            <span style={{ "opacity": "0.7" }}>
                              {lookup(f, "count")}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                    {(lookup(v, "cats") || []).map((c, index8) => (
                      <Fragment key={index8}>
                        <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "flex": "none", "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "600" }}>
                          {lookup(c, "name")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                    <div style={{ "minWidth": "820px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      <div aria-hidden={"true"} style={{ "display": "grid", "gridTemplateColumns": "minmax(0, 2.4fr) 1fr 1.3fr 0.9fr 0.9fr 0.8fr 1fr 36px", "gap": "12px", "padding": "0 16px", "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C" }}>
                        <span>
                          {"Producto"}
                        </span>
                        <span>
                          {"Lotes"}
                        </span>
                        <span>
                          {"Stock / mínimo"}
                        </span>
                        <span style={{ "textAlign": "right" }}>
                          {"Costo prom."}
                        </span>
                        <span style={{ "textAlign": "right" }}>
                          {"Precio"}
                        </span>
                        <span style={{ "textAlign": "right" }}>
                          {"Margen"}
                        </span>
                        <span>
                          {"Estado"}
                        </span>
                        <span></span>
                      </div>
                      {(lookup(v, "rows") || []).map((p, index9) => (
                        <Fragment key={index9}>
                          <div style={{ "background": "#FFFFFF", "borderRadius": "22px", "border": "1px solid " + String(lookup(p, "border") ?? ""), "overflow": "hidden" }}>
                            <button onClick={lookup(p, "toggle")} aria-expanded={lookup(p, "expanded")} style={{ "width": "100%", "display": "grid", "gridTemplateColumns": "minmax(0, 2.4fr) 1fr 1.3fr 0.9fr 0.9fr 0.8fr 1fr 36px", "gap": "12px", "alignItems": "center", "padding": "12px 16px", "border": "none", "background": "transparent", "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111" }}>
                              <span style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minWidth": "0" }}>
                                <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "46px", "height": "46px", "borderRadius": "14px", "objectFit": "cover", "flex": "none" }} />
                                <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                                  <span style={{ "fontSize": "14px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                                    {lookup(p, "name")}
                                  </span>
                                  <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                                    {lookup(p, "sku")}
                                    {" · "}
                                    {lookup(p, "cat")}
                                  </span>
                                </span>
                              </span>
                              <span style={{ "display": "flex", "alignItems": "center", "gap": "6px", "fontSize": "13px", "fontWeight": "700" }}>
                                {lookup(p, "lotsActive")}
                                <span style={{ "fontSize": "11px", "fontWeight": "500", "color": "#8C8C8C" }}>
                                  {lookup(p, "lotsNote")}
                                </span>
                              </span>
                              <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                                <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                                  {lookup(p, "stock")}
                                  {" "}
                                  <span style={{ "fontWeight": "500", "color": "#8C8C8C" }}>
                                    {"/ "}
                                    {lookup(p, "min")}
                                  </span>
                                </span>
                                <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F1F1EE", "overflow": "hidden" }}>
                                  <span style={{ "display": "block", "width": lookup(p, "w"), "height": "100%", "background": lookup(p, "barC"), "borderRadius": "999px" }}></span>
                                </span>
                              </span>
                              <span style={{ "textAlign": "right", "fontSize": "13px", "fontWeight": "600" }}>
                                {lookup(p, "cost")}
                              </span>
                              <span style={{ "textAlign": "right", "fontSize": "13px", "fontWeight": "700" }}>
                                {lookup(p, "price")}
                              </span>
                              <span style={{ "textAlign": "right", "fontSize": "13px", "fontWeight": "700", "color": "#1B5E20" }}>
                                {lookup(p, "margin")}
                              </span>
                              <span style={{ "justifySelf": "start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": lookup(p, "sBg"), "color": lookup(p, "sFg"), "fontSize": "11px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                                <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(p, "sIcon")}></path>
                                </svg>
                                {lookup(p, "status")}
                              </span>
                              <span style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                                  <path d={lookup(p, "chev")}></path>
                                </svg>
                              </span>
                            </button>
                            {Boolean(lookup(p, "open")) && (
                              <Fragment>
                                <div style={{ "padding": "4px 16px 16px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                                  <div aria-hidden={"true"} style={{ "display": "grid", "gridTemplateColumns": "40px 1.1fr 1.4fr 1fr 1.6fr 0.9fr 1.3fr 1.2fr", "gap": "10px", "padding": "8px 12px", "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C", "borderTop": "1px solid #F1F1EE" }}>
                                    <span>
                                      {"Orden"}
                                    </span>
                                    <span>
                                      {"Lote"}
                                    </span>
                                    <span>
                                      {"Proveedor"}
                                    </span>
                                    <span>
                                      {"Ingreso"}
                                    </span>
                                    <span>
                                      {"Restante"}
                                    </span>
                                    <span style={{ "textAlign": "right" }}>
                                      {"Costo"}
                                    </span>
                                    <span>
                                      {"Ubicación"}
                                    </span>
                                    <span>
                                      {"Estado"}
                                    </span>
                                  </div>
                                  {(lookup(p, "lots") || []).map((l, index10) => (
                                    <Fragment key={index10}>
                                      <div style={{ "display": "grid", "gridTemplateColumns": "40px 1.1fr 1.4fr 1fr 1.6fr 0.9fr 1.3fr 1.2fr", "gap": "10px", "alignItems": "center", "padding": "10px 12px", "borderRadius": "16px", "background": lookup(l, "rowBg"), "fontSize": "12px", "opacity": lookup(l, "op") }}>
                                        <span style={{ "width": "26px", "height": "26px", "borderRadius": "50%", "background": lookup(l, "ordBg"), "color": lookup(l, "ordFg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                                          {lookup(l, "ord")}
                                        </span>
                                        <span style={{ "display": "flex", "flexDirection": "column" }}>
                                          <span style={{ "fontWeight": "800" }}>
                                            {lookup(l, "code")}
                                          </span>
                                          <span style={{ "fontSize": "10px", "color": "#8C8C8C" }}>
                                            {"Garantía "}
                                            {lookup(l, "warranty")}
                                          </span>
                                        </span>
                                        <span style={{ "fontWeight": "600" }}>
                                          {lookup(l, "supplier")}
                                        </span>
                                        <span>
                                          {lookup(l, "date")}
                                        </span>
                                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "5px" }}>
                                          <span style={{ "fontWeight": "700" }}>
                                            {lookup(l, "left")}
                                            {" "}
                                            <span style={{ "fontWeight": "500", "color": "#8C8C8C" }}>
                                              {"de "}
                                              {lookup(l, "qty")}
                                            </span>
                                          </span>
                                          <span style={{ "height": "5px", "borderRadius": "999px", "background": "#E9E9E6", "overflow": "hidden" }}>
                                            <span style={{ "display": "block", "width": lookup(l, "w"), "height": "100%", "background": "#E8701F" }}></span>
                                          </span>
                                        </span>
                                        <span style={{ "textAlign": "right", "fontWeight": "700" }}>
                                          {lookup(l, "cost")}
                                        </span>
                                        <span>
                                          {lookup(l, "loc")}
                                        </span>
                                        <span style={{ "justifySelf": "start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": lookup(l, "sBg"), "color": lookup(l, "sFg"), "fontSize": "11px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                                          <span style={{ "width": "7px", "height": "7px", "borderRadius": "50%", "background": lookup(l, "dot") }}></span>
                                          {lookup(l, "status")}
                                        </span>
                                      </div>
                                    </Fragment>
                                  ))}
                                  <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap", "paddingTop": "6px" }}>
                                    <button onClick={lookup(v, "focusForm")} style={{ "height": "38px", "padding": "0 16px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                                      {"+ Nuevo lote de este producto"}
                                    </button>
                                    <button style={{ "height": "38px", "padding": "0 16px", "borderRadius": "999px", "border": "1px solid #E4E4E0", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                                      {"Ajustar stock"}
                                    </button>
                                    <button style={{ "height": "38px", "padding": "0 16px", "borderRadius": "999px", "border": "1px solid #E4E4E0", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                                      {"Trasladar"}
                                    </button>
                                    <a href={"/kardex"} style={{ "display": "inline-flex", "alignItems": "center", "height": "38px", "padding": "0 16px", "borderRadius": "999px", "border": "1px solid #E4E4E0", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                                      {"Ver kardex"}
                                    </a>
                                  </div>
                                </div>
                              </Fragment>
                            )}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "borderRadius": "30px", "background": lookup(v, "formBg"), "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                        {"Ingresar lote"}
                      </span>
                      <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C" }}>
                        {"L-1103"}
                      </span>
                    </div>
                    {Boolean(lookup(v, "saved")) && (
                      <Fragment>
                        <div role={"status"} style={{ "padding": "12px 14px", "borderRadius": "16px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "13px", "fontWeight": "700" }}>
                          {"✓ Lote L-1103 registrado. Ya suma al stock."}
                        </div>
                      </Fragment>
                    )}
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "700" }}>
                      {"Producto"}
                      <select style={{ "height": "44px", "border": "none", "borderRadius": "14px", "padding": "0 12px", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px" }}>
                        <option>
                          {"Lámpara de camping recargable"}
                        </option>
                        <option>
                          {"Panel solar monocristalino 100 W"}
                        </option>
                        <option>
                          {"Foco LED 9 W luz cálida"}
                        </option>
                        <option>
                          {"Collar dorado de cadena fina"}
                        </option>
                      </select>
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "700" }}>
                      {"Proveedor"}
                      <input type={"text"} placeholder={"[PROVEEDOR]"} style={{ "height": "44px", "border": "none", "borderRadius": "14px", "padding": "0 12px", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px" }} />
                    </label>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "700" }}>
                        {"Cantidad"}
                        <input type={"text"} defaultValue={"30"} style={{ "height": "44px", "border": "none", "borderRadius": "14px", "padding": "0 12px", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "700" }}>
                        {"Costo unitario (S/)"}
                        <input type={"text"} defaultValue={"31.00"} style={{ "height": "44px", "border": "none", "borderRadius": "14px", "padding": "0 12px", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "700" }}>
                        {"Fecha de ingreso"}
                        <input type={"text"} defaultValue={"24/10/2026"} style={{ "height": "44px", "border": "none", "borderRadius": "14px", "padding": "0 12px", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "700" }}>
                        {"Garantía hasta"}
                        <input type={"text"} defaultValue={"24/10/2027"} style={{ "height": "44px", "border": "none", "borderRadius": "14px", "padding": "0 12px", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px" }} />
                      </label>
                    </div>
                    <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                      {"Ubicación"}
                    </span>
                    <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "locs") || []).map((l, index11) => (
                        <Fragment key={index11}>
                          <button onClick={lookup(l, "pick")} aria-pressed={lookup(l, "pressed")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(l, "bg"), "color": lookup(l, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "600" }}>
                            {lookup(l, "name")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "12px", "fontWeight": "600" }}>
                      <input type={"checkbox"} defaultChecked style={{ "width": "18px", "height": "18px", "accentColor": "#E8701F" }} />
                      {"Revisar calidad antes de vender"}
                    </label>
                    <button onClick={lookup(v, "saveLot")} style={{ "height": "48px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                      {"Registrar lote"}
                    </button>
                  </div>
                  <div style={{ "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                        {"Movimientos de hoy"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(v, "moveCount")}
                      </span>
                    </div>
                    {(lookup(v, "moves") || []).map((m, index12) => (
                      <Fragment key={index12}>
                        <div style={{ "display": "flex", "gap": "12px", "alignItems": "flex-start" }}>
                          <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(m, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(m, "fg")} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(m, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px", "fontSize": "13px" }}>
                              <span style={{ "fontWeight": "700" }}>
                                {lookup(m, "title")}
                              </span>
                              <span style={{ "fontWeight": "800", "color": lookup(m, "qtyC") }}>
                                {lookup(m, "qty")}
                              </span>
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(m, "sub")}
                            </span>
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
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Inventario"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
