"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), filter: 'Todos', sel: 'DEV-031', decided: {}, registered: false };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const st = this.state;
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // estado → [fondo, texto, icono]; siempre con icono y etiqueta
    const ST = {
      'Solicitada': ['#FFF4D6', '#7A4A00', 'M12 7v5l3 2'],
      'En revisión': ['#E3F1FF', '#0B4A8A', 'M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM16 16l4 4'],
      'Aprobada': ['#EDE7FF', '#4A2E9A', 'M5 12l5 5 9-10'],
      'Resuelta': ['#E4F4E7', '#1B5E20', 'M2 12l5 5 9-10M10 17l1 1 11-12'],
      'Rechazada': ['#FDE4E2', '#8E1C14', 'M6 6l12 12M18 6L6 18']
    };
    const ORDER = ['Solicitada', 'En revisión', 'Aprobada', 'Resuelta', 'Rechazada'];
    const C = [
      { id: 'DEV-032', date: 'Hoy 09:40', client: 'Bodega San Martín', order: '#1041', product: 'Foco LED 9 W luz cálida', qty: '6 unidades', lot: 'L-1008', amount: 53.4, img: '52dc55c2523393f8f60ab89499fa3ec1', type: 'Cambio', reason: 'Llegó dañado', state: 'Solicitada', bought: '24 oct', days: 2, limit: 7, defect: false, note: 'Seis focos llegaron con el vidrio roto, la caja estaba aplastada.' },
      { id: 'DEV-031', date: 'Ayer', client: 'Luis R.', order: '#1039', product: 'Lámpara de camping recargable', qty: '1 unidad', lot: 'L-1012', amount: 69.9, img: 'a58999411e32d7481815ba8cdc175e97', type: 'Garantía', reason: 'Falla de fábrica', state: 'En revisión', bought: '12 ago', days: 75, limit: 180, defect: true, note: 'Ya no carga. La luz parpadea y se apaga a los pocos minutos.' },
      { id: 'DEV-030', date: '22 oct', client: 'María Q.', order: '#1036', product: 'Cable USB-C carga rápida 1 m', qty: '1 unidad', lot: 'L-0901', amount: 19.9, img: '3aba2390d3fbd5f06fdd2cede507b16f', type: 'Reembolso', reason: 'No le gustó', state: 'Aprobada', bought: '18 oct', days: 4, limit: 7, defect: false, note: 'Lo quería más largo. Está sin abrir.' },
      { id: 'DEV-029', date: '19 oct', client: 'Ferretería Cayma', order: '#1040', product: 'Extensión de uso rudo 5 m', qty: '2 unidades', lot: 'L-0928', amount: 90, img: '323e29809539c2fb4b229651c8081ee9', type: 'Cambio', reason: 'Producto equivocado', state: 'Resuelta', bought: '17 oct', days: 2, limit: 7, defect: false, note: 'Pedimos de 10 m y llegó de 5 m.' },
      { id: 'DEV-028', date: '15 oct', client: '[Cliente]', order: '#0987', product: 'Panel solar monocristalino 100 W', qty: '1 unidad', lot: 'L-0805', amount: 349, img: '972ceb606bfca75ef6208d8d3966c77d', type: 'Garantía', reason: 'Falla de fábrica', state: 'Rechazada', bought: '20 mar', days: 209, limit: 180, defect: true, note: 'Bajó mucho la carga que entrega.' }
    ];
    // la decisión tomada en pantalla cambia el estado del caso
    const DEC = { cambio: 'Aprobada', reembolso: 'Aprobada', rechazo: 'Rechazada' };
    const stateOf = (c) => (st.decided[c.id] ? DEC[st.decided[c.id]] : c.state);
    const counts = {};
    C.forEach((c) => { const s = stateOf(c); counts[s] = (counts[s] || 0) + 1; });
    const list = C.filter((c) => st.filter === 'Todos' || stateOf(c) === st.filter);
    const sel = C.find((c) => c.id === st.sel) || C[0];
    const sState = stateOf(sel);
    const dec = st.decided[sel.id] || '';
    const inTerm = sel.days <= sel.limit;
    let stock;
    if (dec === 'rechazo' || sState === 'Rechazada') stock = 'No hay movimiento de stock. El producto se devuelve al cliente con el informe de revisión.';
    else if (sel.defect) stock = 'La unidad con falla se da de baja del lote ' + sel.lot + ' y se reclama a [Proveedor A].' + (dec === 'cambio' || sel.type === 'Garantía' ? ' Sale 1 unidad nueva del lote que se vende primero.' : '');
    else if (dec === 'cambio' || sel.type === 'Cambio') stock = 'Vuelve al lote ' + sel.lot + ' como En revisión hasta comprobar que está bien. Sale el reemplazo del lote que se vende primero.';
    else stock = 'Vuelve al lote ' + sel.lot + ' como En revisión. Si está sin uso, pasa a Activo y se puede vender otra vez.';
    const showNC = dec === 'reembolso' || (sel.type === 'Reembolso' && sState !== 'Rechazada');
    const openCount = C.filter((c) => ['Solicitada', 'En revisión', 'Aprobada'].indexOf(stateOf(c)) !== -1).length;
    const REA = [['Falla de fábrica', 9], ['Llegó dañado', 6], ['Producto equivocado', 4], ['No le gustó', 3]];
    const totalR = REA.reduce((a, r) => a + r[1], 0);
    return {
      accent,
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      registered: st.registered,
      register: () => this.setState({ registered: !st.registered }),
      openCount: String(openCount),
      headStats: [
        [String(counts['Solicitada'] || 0), 'Por revisar', 'recién llegadas', '#FFF4D6', '#7A4A00'],
        ['3.2 d', 'Tiempo', 'para resolver', '#FFFFFF', '#111111'],
        ['S/ 312', 'Reembolsado', 'en octubre', '#FFFFFF', '#111111'],
        ['2', 'Reclamos', 'a proveedores', '#111111', '#FFFFFF']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      byState: ORDER.map((s) => ({ name: s, n: String(counts[s] || 0), bg: ST[s][0], fg: ST[s][1], icon: ST[s][2] })),
      refundSplit: [['Yape y Plin', 'S/ 172.40'], ['Transferencia', 'S/ 140.00'], ['Notas de crédito', '3']].map((r) => ({ k: r[0], v: r[1] })),
      reasons: REA.map((r) => ({ name: r[0], n: String(r[1]), pct: Math.round((r[1] / totalR) * 100) + '%', w: Math.round((r[1] / REA[0][1]) * 100) + '%' })),
      filters: ['Todos'].concat(ORDER).map((f) => {
        const on = st.filter === f;
        return { label: f, n: String(f === 'Todos' ? C.length : (counts[f] || 0)), pick: () => this.setState({ filter: f }), pressed: on ? 'true' : 'false', bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111' };
      }),
      cases: list.map((c) => {
        const s = stateOf(c);
        return {
          id: c.id, date: c.date, client: c.client, order: c.order, product: c.product, img: B + c.img, type: c.type, reason: c.reason, amount: money(c.amount),
          state: s, stBg: ST[s][0], stFg: ST[s][1], stIcon: ST[s][2],
          pressed: c.id === sel.id ? 'true' : 'false', rowBg: c.id === sel.id ? '#FFF1E6' : 'transparent',
          pick: () => this.setState({ sel: c.id })
        };
      }),
      noCases: list.length === 0,
      flow: ORDER.slice(0, 4).map((s, i) => ({ name: s, bg: ST[s][0], fg: ST[s][1], icon: ST[s][2], sep: i < 3 ? '→' : '' })).concat([{ name: 'o Rechazada', bg: ST['Rechazada'][0], fg: ST['Rechazada'][1], icon: ST['Rechazada'][2], sep: '' }]),
      d: {
        id: sel.id, type: sel.type, reason: sel.reason, product: sel.product, qty: sel.qty, lot: sel.lot, amount: money(sel.amount), img: B + sel.img,
        client: sel.client, bought: sel.bought, order: sel.order, note: sel.note,
        state: sState, stBg: ST[sState][0], stFg: ST[sState][1], stIcon: ST[sState][2],
        termTitle: sel.limit > 7 ? 'Garantía de 6 meses' : 'Plazo de 7 días para cambios',
        termText: inTerm ? 'Dentro del plazo' : 'Fuera del plazo',
        termFg: inTerm ? '#1B5E20' : '#8E1C14',
        termW: Math.min(100, Math.round((sel.days / sel.limit) * 100)) + '%',
        termBar: inTerm ? '#E8701F' : '#8E1C14',
        termSub: sel.days + ' de ' + sel.limit + ' días desde la compra',
        photos: [{ t: 'Foto 1 del cliente' }, { t: 'Foto 2' }, { t: 'Boleta' }],
        stock,
        showNC,
        ncText: 'Reembolso de ' + money(sel.amount) + ': se emite la nota de crédito FC01 sobre la boleta del pedido ' + sel.order + '.'
      },
      decisions: [['cambio', 'Aprobar cambio'], ['reembolso', 'Reembolsar'], ['rechazo', 'Rechazar']].map((x) => {
        const on = dec === x[0];
        const bad = x[0] === 'rechazo';
        return {
          label: x[1], pressed: on ? 'true' : 'false',
          bg: on ? (bad ? '#8E1C14' : '#E8701F') : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', border: on ? 'none' : '1px solid #DCDCD8',
          pick: () => this.setState({ decided: Object.assign({}, st.decided, { [sel.id]: on ? '' : x[0] }) })
        };
      }),
      warranty: [['Focos y cables', '3 meses'], ['Extensiones', '6 meses'], ['Camping y linternas', '6 meses'], ['Paneles y estaciones solares', '[12 meses]'], ['Llaveros, ganchos y bisutería', 'Solo 7 días']].map((w) => ({ k: w[0], v: w[1] }))
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Devoluciones(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.dv-row:hover{background:#FAFAF8}\n"}</style>
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
                    <clipPath id={"via-clip-dev"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-dev)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Devoluciones"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Cambios y garantías"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "register")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Registrar devolución"}
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
                    {"Buscar devolución"}
                  </span>
                  <input type={"search"} placeholder={"DEV, pedido o cliente…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Devoluciones"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "openCount")}
                    {" casos abiertos"}
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
              {Boolean(lookup(v, "registered")) && (
                <Fragment>
                  <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 18px", "borderRadius": "20px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "14px", "fontWeight": "600" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M12 5v14M5 12h14"}></path>
                    </svg>
                    <span style={{ "flex": "1" }}>
                      {"Ejemplo: aquí se abre el formulario para registrar una devolución (pedido, producto, lote, motivo y fotos)."}
                    </span>
                    <button onClick={lookup(v, "register")} aria-label={"Cerrar aviso"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "transparent", "cursor": "pointer", "color": "inherit", "fontSize": "18px" }}>
                      {"×"}
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
            <div style={{ "padding": "0 20px 16px", "display": "flex", "gap": "16px", "flexWrap": "wrap" }}>
              <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Casos por estado"}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                    {"octubre · ejemplo"}
                  </span>
                </span>
                {(lookup(v, "byState") || []).map((s, index2) => (
                  <Fragment key={index2}>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                      <span style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "background": lookup(s, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "fg")} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(s, "icon")}></path>
                        </svg>
                      </span>
                      <span style={{ "flex": "1", "fontSize": "13px", "color": "#CFCFCF" }}>
                        {lookup(s, "name")}
                      </span>
                      <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                        {lookup(s, "n")}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ "flex": "1 1 240px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Tasa de devolución"}
                </span>
                <span style={{ "fontSize": "44px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                  {"1.8%"}
                </span>
                <span style={{ "fontSize": "13px", "color": "#6B6B6B", "lineHeight": "1.45" }}>
                  {"8 devoluciones de 441 pedidos en octubre. El mes pasado fue 2.3%."}
                </span>
                <span style={{ "marginTop": "auto", "height": "8px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                  <span style={{ "display": "block", "width": "18%", "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                </span>
                <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                  {"Meta: menos de 3%"}
                </span>
              </div>
              <div style={{ "flex": "1 1 240px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Reembolsado este mes"}
                </span>
                <span style={{ "fontSize": "36px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                  <span style={{ "color": "#E8701F" }}>
                    {"S/"}
                  </span>
                  {" 312.40"}
                </span>
                {(lookup(v, "refundSplit") || []).map((r, index3) => (
                  <Fragment key={index3}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "8px 0", "borderTop": "1px solid #EFEFEC", "fontSize": "13px" }}>
                      <span style={{ "color": "#6B6B6B" }}>
                        {lookup(r, "k")}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {lookup(r, "v")}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ "flex": "1.3 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Motivos"}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                    {"últimos 90 días"}
                  </span>
                </span>
                {(lookup(v, "reasons") || []).map((m, index4) => (
                  <Fragment key={index4}>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                        <span style={{ "fontWeight": "600" }}>
                          {lookup(m, "name")}
                        </span>
                        <span style={{ "fontWeight": "800" }}>
                          {lookup(m, "n")}
                          {" "}
                          <span style={{ "fontWeight": "500", "color": "#8C8C8C" }}>
                            {lookup(m, "pct")}
                          </span>
                        </span>
                      </span>
                      <span style={{ "height": "10px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                        <span style={{ "display": "block", "width": lookup(m, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                      </span>
                    </div>
                  </Fragment>
                ))}
                <span style={{ "fontSize": "12px", "color": "#6B6B6B", "lineHeight": "1.45" }}>
                  {"La mayoría de fallas vienen de lámparas recargables del lote L-1012. Conviene revisar con [Proveedor A]."}
                </span>
              </div>
            </div>
            <div style={{ "padding": "0 20px 16px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Casos"}
                  </span>
                  <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                    {(lookup(v, "filters") || []).map((f, index5) => (
                      <Fragment key={index5}>
                        <button onClick={lookup(f, "pick")} aria-pressed={lookup(f, "pressed")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(f, "bg"), "color": lookup(f, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                          {lookup(f, "label")}
                          {" "}
                          <span style={{ "opacity": "0.6" }}>
                            {lookup(f, "n")}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ "overflowX": "auto" }} className={"noscroll"}>
                  <div style={{ "minWidth": "640px", "display": "flex", "flexDirection": "column" }}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "90px minmax(0, 2fr) minmax(0, 1.1fr) 90px 150px", "gap": "12px", "padding": "0 12px 10px", "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                      <span>
                        {"Caso"}
                      </span>
                      <span>
                        {"Producto y cliente"}
                      </span>
                      <span>
                        {"Tipo · motivo"}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Monto"}
                      </span>
                      <span>
                        {"Estado"}
                      </span>
                    </div>
                    {(lookup(v, "cases") || []).map((c, index6) => (
                      <Fragment key={index6}>
                        <button onClick={lookup(c, "pick")} className={"dv-row"} aria-pressed={lookup(c, "pressed")} style={{ "display": "grid", "gridTemplateColumns": "90px minmax(0, 2fr) minmax(0, 1.1fr) 90px 150px", "gap": "12px", "alignItems": "center", "padding": "12px", "border": "none", "borderTop": "1px solid #EFEFEC", "borderRadius": "18px", "background": lookup(c, "rowBg"), "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left", "color": "#111111" }}>
                          <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                              {lookup(c, "id")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {lookup(c, "date")}
                            </span>
                          </span>
                          <span style={{ "display": "flex", "alignItems": "center", "gap": "10px", "minWidth": "0" }}>
                            <img src={assetSrc(lookup(c, "img"))} alt={""} style={{ "width": "40px", "height": "40px", "borderRadius": "12px", "objectFit": "cover", "flex": "none" }} />
                            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25", "minWidth": "0" }}>
                              <span style={{ "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                                {lookup(c, "product")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(c, "client")}
                                {" · "}
                                {lookup(c, "order")}
                              </span>
                            </span>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(c, "type")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                              {lookup(c, "reason")}
                            </span>
                          </span>
                          <span style={{ "fontSize": "13px", "fontWeight": "800", "textAlign": "right" }}>
                            {lookup(c, "amount")}
                          </span>
                          <span style={{ "justifySelf": "start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(c, "stBg"), "color": lookup(c, "stFg"), "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(c, "stIcon")}></path>
                            </svg>
                            {lookup(c, "state")}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                    {Boolean(lookup(v, "noCases")) && (
                      <Fragment>
                        <span style={{ "padding": "24px 12px", "fontSize": "14px", "color": "#6B6B6B" }}>
                          {"No hay casos en este estado."}
                        </span>
                      </Fragment>
                    )}
                  </div>
                </div>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 14px", "borderRadius": "18px", "background": "#F4F4F2", "fontSize": "12px", "color": "#444444", "flexWrap": "wrap" }}>
                  <span style={{ "fontWeight": "700" }}>
                    {"Recorrido:"}
                  </span>
                  {(lookup(v, "flow") || []).map((s, index7) => (
                    <Fragment key={index7}>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px" }}>
                        <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": lookup(s, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "fg")} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        {lookup(s, "name")}
                        <span style={{ "color": "#BDBDBD" }}>
                          {lookup(s, "sep")}
                        </span>
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "flex": "1 1 420px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "10px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                      {lookup(v, "d.type")}
                      {" · "}
                      {lookup(v, "d.reason")}
                    </span>
                    <span style={{ "fontSize": "26px", "fontWeight": "700", "letterSpacing": "-0.01em" }}>
                      {lookup(v, "d.id")}
                    </span>
                  </span>
                  <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "32px", "padding": "0 12px", "borderRadius": "999px", "background": lookup(v, "d.stBg"), "color": lookup(v, "d.stFg"), "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                    <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={lookup(v, "d.stIcon")}></path>
                    </svg>
                    {lookup(v, "d.state")}
                  </span>
                </div>
                <div style={{ "display": "flex", "gap": "12px", "alignItems": "center", "padding": "12px", "borderRadius": "22px", "background": "#F4F4F2" }}>
                  <img src={assetSrc(lookup(v, "d.img"))} alt={""} style={{ "width": "64px", "height": "64px", "borderRadius": "16px", "objectFit": "cover", "flex": "none" }} />
                  <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px", "lineHeight": "1.25" }}>
                    <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                      {lookup(v, "d.product")}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(v, "d.qty")}
                      {" · Lote "}
                      {lookup(v, "d.lot")}
                      {" · "}
                      {lookup(v, "d.amount")}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(v, "d.client")}
                      {" · comprado el "}
                      {lookup(v, "d.bought")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "flex": "none" }}>
                    <DesignLink href={"/pedido/detalle"} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "background": "#FFFFFF", "display": "inline-flex", "alignItems": "center", "gap": "6px", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                      {"Pedido "}
                      {lookup(v, "d.order")}
                    </DesignLink>
                    <DesignLink href={"/kardex"} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "background": "#FFFFFF", "display": "inline-flex", "alignItems": "center", "gap": "6px", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                      {"Ver lote"}
                    </DesignLink>
                  </span>
                </div>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                    <span style={{ "fontWeight": "700" }}>
                      {lookup(v, "d.termTitle")}
                    </span>
                    <span style={{ "color": lookup(v, "d.termFg"), "fontWeight": "700" }}>
                      {lookup(v, "d.termText")}
                    </span>
                  </span>
                  <span style={{ "height": "10px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                    <span style={{ "display": "block", "width": lookup(v, "d.termW"), "height": "100%", "borderRadius": "999px", "background": lookup(v, "d.termBar") }}></span>
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                    {lookup(v, "d.termSub")}
                  </span>
                </div>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                  <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                    {"Lo que dice el cliente"}
                  </span>
                  <span style={{ "fontSize": "13px", "lineHeight": "1.5", "color": "#444444", "padding": "12px 14px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                    {"“"}
                    {lookup(v, "d.note")}
                    {"”"}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "8px" }}>
                    {(lookup(v, "d.photos") || []).map((p, index8) => (
                      <Fragment key={index8}>
                        <span style={{ "aspectRatio": "1", "borderRadius": "16px", "border": "1px dashed #CFCFCB", "background": "#FAFAF8", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "6px", "fontSize": "11px", "color": "#8C8C8C" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#8C8C8C"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6"}></path>
                          </svg>
                          {lookup(p, "t")}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                  <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                    {"Decisión"}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "8px" }}>
                    {(lookup(v, "decisions") || []).map((x, index9) => (
                      <Fragment key={index9}>
                        <button onClick={lookup(x, "pick")} aria-pressed={lookup(x, "pressed")} style={{ "height": "48px", "borderRadius": "999px", "border": lookup(x, "border"), "background": lookup(x, "bg"), "color": lookup(x, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                          {lookup(x, "label")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ "display": "flex", "gap": "12px", "alignItems": "flex-start", "padding": "14px", "borderRadius": "20px", "background": "#111111", "color": "#FFFFFF" }}>
                  <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": "#2A2A2A", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FF914C"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"}></path>
                    </svg>
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "lineHeight": "1.45" }}>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {"Qué pasa con el stock"}
                    </span>
                    <span style={{ "fontSize": "13px", "color": "#CFCFCF" }}>
                      {lookup(v, "d.stock")}
                    </span>
                  </span>
                </div>
                {Boolean(lookup(v, "d.showNC")) && (
                  <Fragment>
                    <DesignLink href={"/comprobantes"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px", "borderRadius": "20px", "background": "#FFF1E6", "color": "#8A3B0A", "textDecoration": "none", "fontSize": "13px", "fontWeight": "600" }}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4"}></path>
                      </svg>
                      <span style={{ "flex": "1" }}>
                        {lookup(v, "d.ncText")}
                      </span>
                      <span style={{ "fontWeight": "800" }}>
                        {"Ver comprobante →"}
                      </span>
                    </DesignLink>
                  </Fragment>
                )}
              </div>
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap" }}>
              <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "gap": "10px", "flexWrap": "wrap" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Política de devoluciones"}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                    {"Se muestra en la tienda y en cada boleta"}
                  </span>
                </span>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "10px" }}>
                  <div style={{ "padding": "16px", "borderRadius": "22px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <span style={{ "fontSize": "28px", "fontWeight": "700" }}>
                      {"7 días"}
                    </span>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {"Para cambios y devoluciones"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B", "lineHeight": "1.45" }}>
                      {"Producto sin uso, con empaque y boleta o factura. [CONDICIONES]"}
                    </span>
                  </div>
                  <div style={{ "padding": "16px", "borderRadius": "22px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <span style={{ "fontSize": "28px", "fontWeight": "700" }}>
                      {"6 meses"}
                    </span>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {"Garantía por falla de fábrica"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B", "lineHeight": "1.45" }}>
                      {"Se cambia por uno nuevo del mismo producto o se reembolsa si no hay stock."}
                    </span>
                  </div>
                  <div style={{ "padding": "16px", "borderRadius": "22px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <span style={{ "fontSize": "28px", "fontWeight": "700" }}>
                      {"[PLAZO]"}
                    </span>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {"Reembolso"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B", "lineHeight": "1.45" }}>
                      {"Por el mismo medio de pago: Yape, Plin o transferencia. Se emite nota de crédito."}
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ "flex": "1 1 360px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Garantía por categoría"}
                </span>
                {(lookup(v, "warranty") || []).map((w, index10) => (
                  <Fragment key={index10}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "8px 0", "borderTop": "1px solid #EFEFEC", "fontSize": "13px" }}>
                      <span style={{ "color": "#444444" }}>
                        {lookup(w, "k")}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {lookup(w, "v")}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Devoluciones"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
