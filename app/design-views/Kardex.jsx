"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), prod: 'foco', period: 0, type: 'Todos', lot: 'Todos', exported: '' };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const n0 = (n) => n.toLocaleString('es-PE');
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // Datos de ejemplo. Lote: [código, proveedor, ingreso, cantidad ingresada, costo, saldo al 01 oct, estado fijo opcional]
    // Movimiento: [día de octubre, documento, tipo, lote, entra, sale, detalle]
    const PRODUCTS = {
      foco: { name: 'Foco LED 9 W luz cálida', img: '52dc55c2523393f8f60ab89499fa3ec1', min: 120,
        lots: [['L-0921', '[Proveedor A]', '21 set', 300, 4.2, 85], ['L-1008', '[Proveedor A]', '08 oct', 200, 4.1, 0], ['L-1020', '[Proveedor B]', '20 oct', 120, 4.05, 0]],
        moves: [[3, 'B001-00388', 'Salida', 'L-0921', 0, 30, 'Venta en tienda'], [6, 'B001-00395', 'Salida', 'L-0921', 0, 40, 'Venta web #1012'], [8, 'OC-0409', 'Entrada', 'L-1008', 200, 0, 'Compra a [Proveedor A]'],
          [10, 'B001-00402', 'Salida', 'L-0921', 0, 15, 'Lote L-0921 se agota'], [12, 'B001-00405', 'Salida', 'L-1008', 0, 25, 'Venta en tienda'], [14, 'AJ-003', 'Ajuste', 'L-1008', 0, 2, 'Rotos en exhibición'],
          [16, 'TR-002', 'Traslado', 'L-1008', 20, 20, 'Almacén R2 → Tienda A3'], [18, 'DV-001', 'Devolución', 'L-1008', 3, 0, 'Cliente devolvió, en buen estado'], [20, 'OC-0415', 'Entrada', 'L-1020', 120, 0, 'Compra a [Proveedor B]'],
          [22, 'B001-00421', 'Salida', 'L-1008', 0, 36, 'Pedido #1041 Bodega San Martín'], [24, 'F001-00085', 'Salida', 'L-1020', 0, 20, 'Venta a empresa']] },
      solar: { name: 'Panel solar monocristalino 100 W', img: '972ceb606bfca75ef6208d8d3966c77d', min: 8,
        lots: [['L-0805', '[Proveedor C]', '05 ago', 10, 238, 4], ['L-1015', '[Proveedor C]', '15 oct', 10, 232, 0], ['L-1102', '[Proveedor C]', 'llega 28 oct', 12, 229, 0, 'En tránsito']],
        moves: [[5, 'F001-00079', 'Salida', 'L-0805', 0, 2, 'Venta a empresa minera'], [15, 'OC-0412', 'Entrada', 'L-1015', 10, 0, 'Compra a [Proveedor C]'], [19, 'B001-00410', 'Salida', 'L-1015', 0, 3, 'Venta web #1027'],
          [23, 'F001-00084', 'Salida', 'L-1015', 0, 2, 'Cotización COT-0211 aceptada']] },
      lampara: { name: 'Lámpara de camping recargable', img: 'a58999411e32d7481815ba8cdc175e97', min: 15,
        lots: [['L-0915', '[Proveedor D]', '15 set', 40, 31, 22], ['L-1030', '[Proveedor D]', 'llega 30 oct', 30, 30.5, 0, 'En tránsito']],
        moves: [[4, 'B001-00391', 'Salida', 'L-0915', 0, 6, 'Venta en tienda'], [11, 'B001-00403', 'Salida', 'L-0915', 0, 4, 'Venta web #1019'], [17, 'DV-002', 'Devolución', 'L-0915', 1, 0, 'Cambio por talla de correa'],
          [21, 'B001-00418', 'Salida', 'L-0915', 0, 5, 'Venta en tienda'], [25, 'B001-00424', 'Salida', 'L-0915', 0, 3, 'Pedido #1043']] },
      cable: { name: 'Cable USB-C carga rápida 1 m', img: '3aba2390d3fbd5f06fdd2cede507b16f', min: 60,
        lots: [['L-0901', '[Proveedor B]', '01 set', 200, 6.5, 168], ['L-1012', '[Proveedor B]', '12 oct', 200, 6.3, 0, 'En revisión']],
        moves: [[2, 'B001-00386', 'Salida', 'L-0901', 0, 12, 'Venta en tienda'], [7, 'B001-00398', 'Salida', 'L-0901', 0, 18, 'Venta web #1014'], [12, 'OC-0410', 'Entrada', 'L-1012', 200, 0, 'Compra · pasa por revisión de calidad'],
          [13, 'B001-00406', 'Salida', 'L-0901', 0, 10, 'Venta en tienda'], [19, 'B001-00411', 'Salida', 'L-0901', 0, 8, 'Venta web #1028'], [26, 'F001-00086', 'Salida', 'L-0901', 0, 10, 'Venta a ferretería']] }
    };
    const PERIODS = [['Octubre', 1, 26], ['Últimos 7 días', 20, 26], ['Primera quincena', 1, 15]];
    const TYPES = {
      Entrada: ['#E4F4E7', '#1B5E20', 'M12 5v14M6 13l6 6 6-6'],
      Salida: ['#FFF1E6', '#8A3B0A', 'M12 19V5M6 11l6-6 6 6'],
      Ajuste: ['#FFF4D6', '#7A4A00', 'M4 7h10M18 7h2M4 17h2M10 17h10M14 4v6M6 14v6'],
      Traslado: ['#E3F1FF', '#0B4A8A', 'M4 8h13l-3-3M20 16H7l3 3'],
      'Devolución': ['#EDE7FF', '#4A2E9A', 'M4 9h11a5 5 0 0 1 0 10H9M4 9l4-4M4 9l4 4']
    };
    const P = PRODUCTS[st.prod] || PRODUCTS.foco;
    const per = PERIODS[st.period] || PERIODS[0];
    const costOf = {};
    P.lots.forEach((l) => { costOf[l[0]] = l[4]; });
    // saldos por lote, día a día
    const bal = {};
    P.lots.forEach((l) => { bal[l[0]] = l[5]; });
    const totalUnits = () => Object.keys(bal).reduce((a, k) => a + bal[k], 0);
    const totalValue = () => Object.keys(bal).reduce((a, k) => a + bal[k] * costOf[k], 0);
    const apply = (m) => { bal[m[3]] += m[4] - m[5]; };
    P.moves.filter((m) => m[0] < per[1]).forEach(apply);
    const openUnits = totalUnits();
    const openValue = totalValue();
    const inPeriod = P.moves.filter((m) => m[0] >= per[1] && m[0] <= per[2]);
    let sumIn = 0; let sumOut = 0; let valIn = 0; let valOut = 0;
    const allRows = inPeriod.map((m) => {
      apply(m);
      const internal = m[2] === 'Traslado';
      if (!internal) { sumIn += m[4]; sumOut += m[5]; valIn += m[4] * costOf[m[3]]; valOut += m[5] * costOf[m[3]]; }
      const t = TYPES[m[2]];
      const doc = m[1];
      const href = doc.indexOf('OC-') === 0 ? '/compras' : (doc.indexOf('B0') === 0 || doc.indexOf('F0') === 0 ? '/comprobantes' : (doc.indexOf('TR-') === 0 ? '/traslados' : (doc.indexOf('DV-') === 0 || doc.indexOf('DEV-') === 0 ? '/devoluciones' : '#' + doc)));
      return {
        type: m[2], lotCode: m[3], date: String(m[0]).padStart(2, '0') + ' oct', doc, href, bg: t[0], fg: t[1], icon: t[2], lot: m[3],
        inn: m[4] ? '+' + n0(m[4]) : '—', out: m[5] ? '−' + n0(m[5]) : '—', cost: money(costOf[m[3]]),
        bal: n0(totalUnits()), val: money(totalValue()), note: m[6]
      };
    });
    const rows = allRows.filter((r) => (st.type === 'Todos' || r.type === st.type) && (st.lot === 'Todos' || r.lotCode === st.lot));
    const closeUnits = totalUnits();
    const closeValue = totalValue();
    // PEPS: el lote activo con stock más antiguo sale primero
    let ord = 0;
    const lots = P.lots.map((l) => {
      const left = bal[l[0]];
      const state = l[6] || (left > 0 ? 'Activo' : 'Agotado');
      const sells = state === 'Activo' && left > 0;
      if (sells) ord += 1;
      const S = { Activo: ['#1F3A24', '#7EE08F', 'M5 12l5 5 9-10'], Agotado: ['#3A1F1F', '#FF8A80', 'M6 6l12 12M18 6L6 18'], 'En tránsito': ['#1F2A3A', '#8AC4FF', 'M3 7h11v9H3zM14 10h4l3 3v3h-7'], 'En revisión': ['#3A321F', '#FFD27A', 'M12 7v6M12 17h.01'] }[state];
      return {
        code: l[0], meta: l[1] + ' · ingresó ' + l[2], inn: n0(l[3]), left: n0(left), cost: money(l[4]),
        w: Math.round((left / l[3]) * 100) + '%', state, stBg: S[0], stFg: S[1], stIcon: S[2],
        ord: sells ? String(ord) : '–', ordBg: sells && ord === 1 ? '#E8701F' : '#2E2E2E', ordFg: '#FFFFFF'
      };
    });
    // gráfico de stock (escalón por día)
    const days = [];
    const bal2 = {};
    P.lots.forEach((l) => { bal2[l[0]] = l[5]; });
    const units2 = () => Object.keys(bal2).reduce((a, k) => a + bal2[k], 0);
    P.moves.filter((m) => m[0] < per[1]).forEach((m) => { bal2[m[3]] += m[4] - m[5]; });
    for (let d = per[1]; d <= per[2]; d += 1) {
      P.moves.filter((m) => m[0] === d).forEach((m) => { bal2[m[3]] += m[4] - m[5]; });
      days.push([d, units2()]);
    }
    const maxV = Math.max(P.min * 1.3, ...days.map((x) => x[1]), openUnits) * 1.1;
    const X0 = 40; const X1 = 640; const Y0 = 20; const Y1 = 200;
    const span = Math.max(1, per[2] - per[1]);
    const xs = (d) => X0 + ((d - per[1]) / span) * (X1 - X0);
    const ys = (v) => Y1 - (v / maxV) * (Y1 - Y0);
    let line = 'M' + xs(per[1]).toFixed(1) + ' ' + ys(openUnits).toFixed(1);
    let prev = openUnits;
    days.forEach((p) => { line += ' L' + xs(p[0]).toFixed(1) + ' ' + ys(prev).toFixed(1) + ' L' + xs(p[0]).toFixed(1) + ' ' + ys(p[1]).toFixed(1); prev = p[1]; });
    const area = line + ' L' + X1 + ' ' + Y1 + ' L' + X0 + ' ' + Y1 + ' Z';
    const step = maxV > 300 ? 100 : (maxV > 60 ? 20 : 5);
    const gridLines = [];
    for (let v = 0; v <= maxV; v += step) gridLines.push({ y: ys(v).toFixed(1), ty: (ys(v) + 4).toFixed(1), v: String(v) });
    const tickDays = per[2] - per[1] > 10 ? [per[1], per[1] + 7, per[1] + 14, per[1] + 21, per[2]].filter((d) => d <= per[2]) : days.map((x) => x[0]);
    const endV = days.length ? days[days.length - 1][1] : openUnits;
    const minY = ys(P.min);
    const below = endV <= P.min;
    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      prodName: P.name,
      headStats: [
        [n0(closeUnits), 'Saldo final', 'unidades', below ? '#FFF4D6' : '#FFFFFF', below ? '#7A4A00' : '#111111'],
        ['+' + n0(sumIn), 'Entradas', 'del periodo', '#FFFFFF', '#111111'],
        ['−' + n0(sumOut), 'Salidas', 'del periodo', '#FFFFFF', '#111111'],
        [String(lots.filter((l) => l.state === 'Activo').length), 'Lotes', 'activos', '#111111', '#FFFFFF']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      products: Object.keys(PRODUCTS).map((k) => {
        const on = k === st.prod; const p = PRODUCTS[k];
        return { name: p.name, sub: 'Mínimo ' + p.min + ' u.', img: B + p.img, pressed: on ? 'true' : 'false', bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', subFg: on ? '#BDBDBD' : '#8C8C8C', pick: () => this.setState({ prod: k, lot: 'Todos', type: 'Todos', exported: '' }) };
      }),
      periods: PERIODS.map((p, i) => ({ label: p[0], pressed: i === st.period ? 'true' : 'false', bg: i === st.period ? '#111111' : 'transparent', fg: i === st.period ? '#FFFFFF' : '#111111', pick: () => this.setState({ period: i, exported: '' }) })),
      tiles: [
        ['Saldo inicial', n0(openUnits), money(openValue) + ' a costo', 'M4 12h16', false],
        ['Entradas', '+' + n0(sumIn), money(valIn) + ' · compras y devoluciones', 'M12 5v14M6 13l6 6 6-6', false],
        ['Salidas', '−' + n0(sumOut), money(valOut) + ' · ventas y ajustes', 'M12 19V5M6 11l6-6 6 6', false],
        ['Saldo final', n0(closeUnits), money(closeValue) + ' valorizado', 'M5 12l5 5 9-10', true],
        ['Costo promedio', closeUnits ? money(closeValue / closeUnits).replace('S/ ', '') : '—', 'S/ por unidad, según lotes con stock', 'M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6', false]
      ].map((t) => ({ label: t[0], units: t[1], unitWord: t[0] === 'Costo promedio' ? 'S/' : 'u.', money: t[2], icon: t[3], bg: t[4] ? '#111111' : '#F4F4F2', fg: t[4] ? '#FFFFFF' : '#111111', subFg: t[4] ? '#BDBDBD' : '#6B6B6B', iconBg: t[4] ? '#E8701F' : '#FFFFFF', iconFg: t[4] ? '#FFFFFF' : '#111111' })),
      chartNote: below ? 'Por debajo del mínimo: conviene reponer' : 'Unidades en stock al cierre de cada día',
      chartAria: 'Stock de ' + P.name + ': empieza en ' + openUnits + ' y termina en ' + endV + ' unidades; mínimo ' + P.min,
      gridLines,
      minY: minY.toFixed(1),
      minLabelY: (minY - 6).toFixed(1),
      minLabel: 'Mínimo ' + P.min,
      linePath: line,
      areaPath: area,
      startX: xs(per[1]).toFixed(1), startY: ys(openUnits).toFixed(1), startLabelY: (ys(openUnits) - 10).toFixed(1), startLabel: String(openUnits),
      endX: X1.toFixed(1), endY: ys(endV).toFixed(1), endLabelY: (ys(endV) - 12).toFixed(1), endLabel: endV + ' u. hoy',
      xTicks: tickDays.map((d) => ({ x: xs(d).toFixed(1), t: d + ' oct' })),
      lots,
      rowsNote: rows.length + ' de ' + allRows.length + ' movimientos · ' + per[0].toLowerCase(),
      typeChips: ['Todos', 'Entrada', 'Salida', 'Ajuste', 'Traslado', 'Devolución'].map((t) => ({ label: t, pressed: t === st.type ? 'true' : 'false', bg: t === st.type ? '#111111' : '#FFFFFF', fg: t === st.type ? '#FFFFFF' : '#111111', pick: () => this.setState({ type: t }) })),
      lotOptions: [{ v: 'Todos', t: 'Todos', sel: st.lot === 'Todos' }].concat(P.lots.map((l) => ({ v: l[0], t: l[0], sel: st.lot === l[0] }))),
      pickLot: (e) => this.setState({ lot: (e && e.target && e.target.value) || 'Todos' }),
      exportXls: () => this.setState({ exported: 'xlsx' }),
      exportPdf: () => this.setState({ exported: 'pdf' }),
      exported: !!st.exported,
      exportMsg: 'Kardex de ' + P.name + ' (' + per[0].toLowerCase() + ') listo para descargar en ' + (st.exported === 'pdf' ? 'PDF' : 'Excel') + '. Es un ejemplo del diseño.',
      openDate: String(per[1]).padStart(2, '0') + ' oct',
      openUnits: n0(openUnits),
      openMoney: money(openValue),
      rows,
      noRows: rows.length === 0,
      sumIn: '+' + n0(sumIn),
      sumOut: '−' + n0(sumOut),
      closeUnits: n0(closeUnits),
      closeMoney: money(closeValue)
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Kardex(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.kx-row:hover{background:#FAFAF8}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          <div>
            <div style={{ "padding": "28px 32px 30px", "display": "flex", "flexDirection": "column", "gap": "28px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "flexWrap": "wrap" }}>
                <button onClick={lookup(v, "menuBtn")} aria-label={lookup(v, "menuBtnLabel")} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M4 8h16M4 16h10"}></path>
                  </svg>
                </button>
                <DesignLink href={"/dashboard"} aria-label={"Ir al panel"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-kx"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-kx)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    <DesignLink href={"/inventario"} style={{ "color": "#111111", "textDecoration": "none" }}>
                      {"Inventario y lotes"}
                    </DesignLink>
                    <span style={{ "color": "#BDBDBD" }}>
                      {"›"}
                    </span>
                    {" Kardex"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Movimientos por producto y lote · PEPS"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <DesignLink href={"/inventario"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Ingresar lote"}
                </DesignLink>
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
                    {"Buscar documento"}
                  </span>
                  <input type={"search"} placeholder={"Documento o lote…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Kardex"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "prodName")}
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
              <div style={{ "borderRadius": "30px", "background": "#F4F4F2", "padding": "18px 20px", "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "center" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700", "marginRight": "4px" }}>
                  {"Producto"}
                </span>
                <div className={"noscroll"} style={{ "flex": "1 1 520px", "minWidth": "0", "display": "flex", "gap": "8px", "overflowX": "auto" }}>
                  {(lookup(v, "products") || []).map((p, index2) => (
                    <Fragment key={index2}>
                      <button onClick={lookup(p, "pick")} aria-pressed={lookup(p, "pressed")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 16px 0 6px", "borderRadius": "999px", "border": "none", "background": lookup(p, "bg"), "color": lookup(p, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                        <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "overflow": "hidden", "background": "#FFFFFF", "flex": "none" }}>
                          <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2", "textAlign": "left" }}>
                          <span>
                            {lookup(p, "name")}
                          </span>
                          <span style={{ "fontSize": "11px", "fontWeight": "600", "color": lookup(p, "subFg") }}>
                            {lookup(p, "sub")}
                          </span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "display": "flex", "gap": "6px", "padding": "5px", "borderRadius": "999px", "background": "#FFFFFF" }}>
                  {(lookup(v, "periods") || []).map((pr, index3) => (
                    <Fragment key={index3}>
                      <button onClick={lookup(pr, "pick")} aria-pressed={lookup(pr, "pressed")} style={{ "height": "40px", "padding": "0 16px", "borderRadius": "999px", "border": "none", "background": lookup(pr, "bg"), "color": lookup(pr, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(pr, "label")}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "14px" }}>
                {(lookup(v, "tiles") || []).map((t, index4) => (
                  <Fragment key={index4}>
                    <div style={{ "borderRadius": "30px", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px", "minHeight": "150px", "boxSizing": "border-box" }}>
                      <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between" }}>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(t, "label")}
                        </span>
                        <span style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "background": lookup(t, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(t, "iconFg")} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(t, "icon")}></path>
                          </svg>
                        </span>
                      </span>
                      <span style={{ "marginTop": "auto", "fontSize": "34px", "fontWeight": "700", "letterSpacing": "-0.02em", "lineHeight": "1" }}>
                        {lookup(t, "units")}
                        <span style={{ "fontSize": "14px", "fontWeight": "600", "color": lookup(t, "subFg") }}>
                          {" "}
                          {lookup(t, "unitWord")}
                        </span>
                      </span>
                      <span style={{ "fontSize": "13px", "color": lookup(t, "subFg") }}>
                        {lookup(t, "money")}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ "display": "flex", "gap": "14px", "flexWrap": "wrap", "alignItems": "stretch" }}>
                <div style={{ "flex": "2 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Stock día a día"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(v, "chartNote")}
                    </span>
                  </span>
                  <svg viewBox={"0 0 680 230"} role={"img"} aria-label={lookup(v, "chartAria")} style={{ "width": "100%", "height": "auto", "display": "block" }}>
                    {(lookup(v, "gridLines") || []).map((g, index5) => (
                      <Fragment key={index5}>
                        <line x1={"40"} x2={"640"} y1={lookup(g, "y")} y2={lookup(g, "y")} stroke={"#E4E4E0"} strokeWidth={"1"}></line>
                        <text x={"32"} y={lookup(g, "ty")} textAnchor={"end"} fontFamily={"Manrope, sans-serif"} fontSize={"11"} fill={"#8C8C8C"}>
                          {lookup(g, "v")}
                        </text>
                      </Fragment>
                    ))}
                    <line x1={"40"} x2={"640"} y1={lookup(v, "minY")} y2={lookup(v, "minY")} stroke={"#111111"} strokeWidth={"1.5"} strokeDasharray={"5 5"}></line>
                    <text x={"640"} y={lookup(v, "minLabelY")} textAnchor={"end"} fontFamily={"Manrope, sans-serif"} fontSize={"11"} fontWeight={"700"} fill={"#111111"}>
                      {lookup(v, "minLabel")}
                    </text>
                    <path d={lookup(v, "areaPath")} fill={"#E8701F"} fillOpacity={"0.12"}></path>
                    <path d={lookup(v, "linePath")} fill={"none"} stroke={"#E8701F"} strokeWidth={"2.5"} strokeLinejoin={"round"}></path>
                    <circle cx={lookup(v, "startX")} cy={lookup(v, "startY")} r={"4"} fill={"#E8701F"}></circle>
                    <circle cx={lookup(v, "endX")} cy={lookup(v, "endY")} r={"5"} fill={"#E8701F"} stroke={"#FFFFFF"} strokeWidth={"2"}></circle>
                    <text x={lookup(v, "startX")} y={lookup(v, "startLabelY")} fontFamily={"Manrope, sans-serif"} fontSize={"12"} fontWeight={"700"} fill={"#111111"}>
                      {lookup(v, "startLabel")}
                    </text>
                    <text x={lookup(v, "endX")} y={lookup(v, "endLabelY")} textAnchor={"end"} fontFamily={"Manrope, sans-serif"} fontSize={"12"} fontWeight={"800"} fill={"#C2410C"}>
                      {lookup(v, "endLabel")}
                    </text>
                    {(lookup(v, "xTicks") || []).map((x, index6) => (
                      <Fragment key={index6}>
                        <text x={lookup(x, "x")} y={"222"} textAnchor={"middle"} fontFamily={"Manrope, sans-serif"} fontSize={"11"} fill={"#8C8C8C"}>
                          {lookup(x, "t")}
                        </text>
                      </Fragment>
                    ))}
                  </svg>
                </div>
                <div style={{ "flex": "1 1 340px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Lotes de este producto"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                      {"Orden de salida PEPS"}
                    </span>
                  </span>
                  {(lookup(v, "lots") || []).map((l, index7) => (
                    <Fragment key={index7}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "padding": "12px 14px", "borderRadius": "20px", "background": "#1E1E1E" }}>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <span style={{ "minWidth": "28px", "height": "28px", "borderRadius": "50%", "background": lookup(l, "ordBg"), "color": lookup(l, "ordFg"), "fontSize": "12px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            {lookup(l, "ord")}
                          </span>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                              {lookup(l, "code")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#9A9A9A" }}>
                              {lookup(l, "meta")}
                            </span>
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(l, "stBg"), "color": lookup(l, "stFg"), "fontSize": "11px", "fontWeight": "700" }}>
                            <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(l, "stIcon")}></path>
                            </svg>
                            {lookup(l, "state")}
                          </span>
                        </span>
                        <span style={{ "height": "6px", "borderRadius": "999px", "background": "#2E2E2E" }}>
                          <span style={{ "display": "block", "width": lookup(l, "w"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                        </span>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px", "color": "#CFCFCF" }}>
                          <span>
                            {"Quedan "}
                            <strong style={{ "color": "#FFFFFF" }}>
                              {lookup(l, "left")}
                            </strong>
                            {" de "}
                            {lookup(l, "inn")}
                          </span>
                          <span>
                            {"Costo "}
                            {lookup(l, "cost")}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <DesignLink href={"/inventario"} style={{ "marginTop": "auto", "height": "42px", "borderRadius": "999px", "background": "#2A2A2A", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                    {"Ver lotes en Inventario"}
                  </DesignLink>
                </div>
              </div>
              <div style={{ "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2", "marginRight": "8px" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Movimientos"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(v, "rowsNote")}
                    </span>
                  </span>
                  <span style={{ "flex": "1" }}></span>
                  <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                    {(lookup(v, "typeChips") || []).map((c, index8) => (
                      <Fragment key={index8}>
                        <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "flex": "none", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(c, "label")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <label style={{ "display": "flex", "alignItems": "center", "gap": "8px", "height": "38px", "padding": "0 6px 0 14px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "12px", "fontWeight": "700" }}>
                    {"Lote\n"}
                    <select onChange={lookup(v, "pickLot")} style={{ "height": "30px", "border": "none", "background": "#F4F4F2", "borderRadius": "999px", "padding": "0 10px", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }} value={((lookup(v, "lotOptions") || []).find((option) => option.sel) || {}).v ?? ""}>
                      {(lookup(v, "lotOptions") || []).map((o, index9) => (
                        <Fragment key={index9}>
                          <option value={lookup(o, "v")}>
                            {lookup(o, "t")}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <button onClick={lookup(v, "exportXls")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
                    </svg>
                    {"Excel"}
                  </button>
                  <button onClick={lookup(v, "exportPdf")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
                    </svg>
                    {"PDF"}
                  </button>
                </div>
                {Boolean(lookup(v, "exported")) && (
                  <Fragment>
                    <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 16px", "borderRadius": "18px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "13px", "fontWeight": "600" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M5 12l5 5 9-10"}></path>
                      </svg>
                      {lookup(v, "exportMsg")}
                    </div>
                  </Fragment>
                )}
                <div className={"noscroll"} style={{ "overflowX": "auto", "borderRadius": "22px", "background": "#FFFFFF" }}>
                  <div style={{ "minWidth": "1060px", "display": "flex", "flexDirection": "column" }}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "70px 120px 130px 82px 80px 80px 96px 86px 110px minmax(0, 1fr)", "gap": "10px", "padding": "14px 18px", "fontSize": "11px", "fontWeight": "700", "color": "#6B6B6B", "textTransform": "uppercase", "letterSpacing": "0.04em", "borderBottom": "1px solid #EFEFEC" }}>
                      <span>
                        {"Fecha"}
                      </span>
                      <span>
                        {"Documento"}
                      </span>
                      <span>
                        {"Tipo"}
                      </span>
                      <span>
                        {"Lote"}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Entra"}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Sale"}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Costo u."}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Saldo u."}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Saldo S/"}
                      </span>
                      <span>
                        {"Detalle"}
                      </span>
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "70px 120px 130px 82px 80px 80px 96px 86px 110px minmax(0, 1fr)", "gap": "10px", "padding": "12px 18px", "fontSize": "13px", "background": "#FAFAF8", "borderBottom": "1px solid #EFEFEC" }}>
                      <span style={{ "color": "#6B6B6B" }}>
                        {lookup(v, "openDate")}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"Saldo inicial"}
                      </span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span></span>
                      <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                        {lookup(v, "openUnits")}
                      </span>
                      <span style={{ "textAlign": "right", "fontWeight": "700" }}>
                        {lookup(v, "openMoney")}
                      </span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Viene del periodo anterior"}
                      </span>
                    </div>
                    {(lookup(v, "rows") || []).map((r, index10) => (
                      <Fragment key={index10}>
                        <div className={"kx-row"} style={{ "display": "grid", "gridTemplateColumns": "70px 120px 130px 82px 80px 80px 96px 86px 110px minmax(0, 1fr)", "gap": "10px", "alignItems": "center", "padding": "11px 18px", "fontSize": "13px", "borderBottom": "1px solid #F2F2EF" }}>
                          <span style={{ "color": "#6B6B6B" }}>
                            {lookup(r, "date")}
                          </span>
                          <DesignLink href={lookup(r, "href")} style={{ "fontWeight": "700", "color": "#C2410C", "textUnderlineOffset": "3px" }}>
                            {lookup(r, "doc")}
                          </DesignLink>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "justifySelf": "start", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(r, "bg"), "color": lookup(r, "fg"), "fontSize": "12px", "fontWeight": "700" }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(r, "icon")}></path>
                            </svg>
                            {lookup(r, "type")}
                          </span>
                          <span style={{ "fontWeight": "700" }}>
                            {lookup(r, "lot")}
                          </span>
                          <span style={{ "textAlign": "right", "fontWeight": "700", "color": "#1B5E20" }}>
                            {lookup(r, "inn")}
                          </span>
                          <span style={{ "textAlign": "right", "fontWeight": "700" }}>
                            {lookup(r, "out")}
                          </span>
                          <span style={{ "textAlign": "right", "color": "#444444" }}>
                            {lookup(r, "cost")}
                          </span>
                          <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                            {lookup(r, "bal")}
                          </span>
                          <span style={{ "textAlign": "right", "fontWeight": "600" }}>
                            {lookup(r, "val")}
                          </span>
                          <span style={{ "color": "#6B6B6B", "fontSize": "12px" }}>
                            {lookup(r, "note")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {Boolean(lookup(v, "noRows")) && (
                      <Fragment>
                        <div style={{ "padding": "26px 18px", "fontSize": "13px", "color": "#6B6B6B" }}>
                          {"No hay movimientos con estos filtros en el periodo elegido."}
                        </div>
                      </Fragment>
                    )}
                    <div style={{ "display": "grid", "gridTemplateColumns": "70px 120px 130px 82px 80px 80px 96px 86px 110px minmax(0, 1fr)", "gap": "10px", "padding": "14px 18px", "fontSize": "13px", "background": "#111111", "color": "#FFFFFF" }}>
                      <span></span>
                      <span style={{ "fontWeight": "800" }}>
                        {"Totales"}
                      </span>
                      <span></span>
                      <span></span>
                      <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                        {lookup(v, "sumIn")}
                      </span>
                      <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                        {lookup(v, "sumOut")}
                      </span>
                      <span></span>
                      <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                        {lookup(v, "closeUnits")}
                      </span>
                      <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                        {lookup(v, "closeMoney")}
                      </span>
                      <span style={{ "color": "#BDBDBD", "fontSize": "12px" }}>
                        {"Saldo final del periodo"}
                      </span>
                    </div>
                  </div>
                </div>
                <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "12px", "color": "#6B6B6B" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#6B6B6B"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <circle cx={"12"} cy={"12"} r={"9"}></circle>
                    <path d={"M12 11v5M12 8h.01"}></path>
                  </svg>
                  {"Formato compatible con el registro de inventario permanente valorizado (SUNAT). Las salidas se valorizan con el costo del lote más antiguo (PEPS). Datos de ejemplo; RUC del contribuyente: [RUC]."}
                </span>
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
