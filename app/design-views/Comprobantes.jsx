"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), tab: 'Todos', sstate: '', sel: 'F001-00087', emitted: [], notice: '' };
  }
  renderVals() {
    const st = this.state;
    const accent = this.props.accent ?? '#FF914C';
    const money = (n) => (n < 0 ? '−' : '') + Math.abs(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const SC = {
      'Aceptado': ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      'Pendiente de envío': ['#FFF4D6', '#7A4A00', 'M12 7v5l3 2'],
      'Observado': ['#EDE7FF', '#4A2E9A', 'M12 7v6M12 17h.01'],
      'Rechazado': ['#FDE4E2', '#8E1C14', 'M6 6l12 12M18 6L6 18']
    };
    const KIND = { B: 'Boleta', F: 'Factura', N: 'Nota de crédito' };
    // [serie-número, tipo, fecha, cliente, documento, pedido, pago, líneas [cant, producto, precio con IGV], estado, referencia]
    const BASE = [
      ['F001-00087', 'F', '26 oct', 'Bodega San Martín', 'RUC [RUC]', '#1041', 'Transferencia', [[24, 'Foco LED 9 W luz cálida', 8.9], [10, 'Cable USB-C carga rápida 1 m', 19.9], [6, 'Extensión de uso rudo 5 m', 69.9], [1, 'Gancho multiuso de acero', 10.0]], 'Aceptado', '—'],
      ['B001-00421', 'B', '26 oct', 'María Q.', 'DNI [DNI]', '#1042', 'Yape', [[1, 'Lámpara de camping recargable', 69.9], [2, 'Llavero linterna LED', 14.9], [4, 'Gancho multiuso de acero', 15.0]], 'Aceptado', '—'],
      ['F001-00086', 'F', '25 oct', 'Ferretería Cayma', 'RUC [RUC]', '#1040', 'Crédito 30 días', [[100, 'Foco LED 9 W luz cálida', 7.6], [40, 'Extensión de uso rudo 5 m', 67.5]], 'Pendiente de envío', '—'],
      ['B001-00420', 'B', '25 oct', 'Luis R.', 'DNI [DNI]', '#1039', 'Tarjeta', [[1, 'Panel solar monocristalino 100 W', 459.0]], 'Aceptado', '—'],
      ['F001-00085', 'F', '25 oct', 'Constructora [Cliente]', 'RUC [RUC]', '#1038', 'Transferencia', [[8, 'Panel solar monocristalino 100 W', 420.0], [40, 'Extensión de uso rudo 5 m', 44.0]], 'Observado', '—'],
      ['FC01-00004', 'N', '24 oct', 'Bodega San Martín', 'RUC [RUC]', '#1031', 'Devolución', [[-2, 'Extensión de uso rudo 5 m (devolución)', 43.0]], 'Aceptado', 'F001-00079'],
      ['B001-00419', 'B', '24 oct', 'Ana P.', 'DNI [DNI]', '#1035', 'Efectivo', [[1, 'Pulsera de acero inoxidable', 49.9], [2, 'Aretes de plata 925', 20.0]], 'Rechazado', '—']
    ];
    const PEND = [
      ['#1043', 'Minimarket El Sol', 'RUC [RUC]', 'F', 'hoy 09:12', [[30, 'Foco LED 9 W luz cálida', 8.2], [12, 'Cable USB-C carga rápida 1 m', 18.0], [3, 'Extensión de uso rudo 5 m', 39.8]]],
      ['#1044', 'Carla V.', 'DNI [DNI]', 'B', 'hoy 10:40', [[1, 'Lámpara de camping recargable', 74.5]]],
      ['#1045', 'Minera [Cliente]', 'RUC [RUC]', 'F', 'ayer 17:05', [[15, 'Panel solar monocristalino 100 W', 430.0], [20, 'Linterna de cabeza recargable', 70.0]]]
    ];
    const sum = (lines) => Math.round(lines.reduce((a, l) => a + l[0] * l[2], 0) * 100) / 100;
    let nB = 421, nF = 87;
    const extra = st.emitted.map((oid) => {
      const p = PEND.find((x) => x[0] === oid);
      const id = p[3] === 'F' ? 'F001-' + String(++nF).padStart(5, '0') : 'B001-' + String(++nB).padStart(5, '0');
      return [id, p[3], '26 oct', p[1], p[2], p[0], 'Según pedido', p[5], 'Aceptado', '—'];
    });
    const ALL = extra.reverse().concat(BASE);
    const TABS = [['Todos', ''], ['Boletas', 'B'], ['Facturas', 'F'], ['Notas de crédito', 'N']];
    const tabKind = (TABS.find((t) => t[0] === st.tab) || TABS[0])[1];
    const list = ALL.filter((d) => (!tabKind || d[1] === tabKind) && (!st.sstate || d[8] === st.sstate));
    const sel = ALL.find((d) => d[0] === st.sel) || ALL[0];
    const tot = sum(sel[7]);
    const grav = Math.round((tot / 1.18) * 100) / 100;
    const sales = ALL.filter((d) => d[1] !== 'N');
    const monthBase = 268;
    const monthTotalN = 184320.5 + extra.reduce((a, d) => a + sum(d[7]), 0);
    const byKind = (k) => ALL.filter((d) => d[1] === k);
    const countState = (s) => ALL.filter((d) => d[8] === s).length;
    const pendingLeft = PEND.filter((p) => st.emitted.indexOf(p[0]) === -1);
    const words = (n) => 'Son: ' + Math.floor(Math.abs(n)).toLocaleString('es-PE') + ' con ' + String(Math.round((Math.abs(n) % 1) * 100)).padStart(2, '0') + '/100 soles';
    const S = SC[sel[8]];
    return {
      accent,
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      notice: st.notice,
      clearNotice: () => this.setState({ notice: '' }),
      emitNew: () => this.setState({ notice: 'Para emitir un comprobante nuevo elige un pedido pagado en "Pendientes por emitir" (diseño de ejemplo; aún no se envía a SUNAT).' }),
      monthCount: String(monthBase + extra.length),
      monthTotal: Math.round(monthTotalN).toLocaleString('es-PE'),
      headStats: [
        [String(byKind('F').length + 79), 'Facturas', 'serie F001', '#FFFFFF', '#111111'],
        [String(byKind('B').length + 182), 'Boletas', 'serie B001', '#FFFFFF', '#111111'],
        [String(countState('Pendiente de envío') + countState('Observado')), 'Por revisar', 'ante SUNAT', '#FFF4D6', '#7A4A00'],
        [String(pendingLeft.length), 'Pedidos sin', 'comprobante', '#E8701F', '#FFFFFF']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      series: [['Facturas', 'F001', 81, 132460], ['Boletas', 'B001', 184, 52180], ['Notas de crédito', 'FC01', 4, 320]].map((s) => ({ name: s[0], code: s[1], n: String(s[2]), amount: 'S/ ' + s[3].toLocaleString('es-PE'), w: Math.max(3, Math.round((s[3] / 132460) * 100)) + '%' })),
      igvMonth: money(Math.round((monthTotalN - monthTotalN / 1.18) * 100) / 100),
      gravMonth: money(Math.round((monthTotalN / 1.18) * 100) / 100),
      stateTiles: ['Aceptado', 'Pendiente de envío', 'Observado', 'Rechazado'].map((s) => ({
        name: s === 'Aceptado' ? 'Aceptados' : s === 'Observado' ? 'Observados' : s === 'Rechazado' ? 'Rechazados' : 'Pendientes de envío',
        n: String(countState(s) + (s === 'Aceptado' ? 258 : 0)), bg: SC[s][0], fg: SC[s][1], icon: SC[s][2],
        rowBg: st.sstate === s ? '#F4F4F2' : 'transparent',
        pick: () => this.setState({ sstate: st.sstate === s ? '' : s })
      })),
      ncCount: String(byKind('N').length + 3),
      ncTotal: money(320),
      tabs: TABS.map((t) => ({ label: t[0], n: String(ALL.filter((d) => !t[1] || d[1] === t[1]).length), pressed: st.tab === t[0] ? 'true' : 'false', bg: st.tab === t[0] ? '#111111' : '#F4F4F2', fg: st.tab === t[0] ? '#FFFFFF' : '#111111', pick: () => this.setState({ tab: t[0] }) })),
      stateFilterOn: !!st.sstate,
      stateFilter: st.sstate,
      clearState: () => this.setState({ sstate: '' }),
      docs: list.map((d) => ({
        id: d[0], type: KIND[d[1]], date: d[2], client: d[3], docId: d[4], order: d[5],
        totalTxt: 'S/ ' + money(sum(d[7])), status: d[8], sbg: SC[d[8]][0], sfg: SC[d[8]][1], sicon: SC[d[8]][2],
        bg: d[0] === sel[0] ? '#F4F4F2' : 'transparent', cls: d[0] === sel[0] ? '' : 'cp-row',
        pick: () => this.setState({ sel: d[0] })
      })),
      noDocs: list.length === 0,
      pvTitle: sel[1] === 'F' ? 'Factura electrónica' : sel[1] === 'B' ? 'Boleta de venta electrónica' : 'Nota de crédito electrónica',
      pvKind: sel[1] === 'F' ? 'factura' : sel[1] === 'B' ? 'boleta de venta' : 'nota de crédito',
      pvId: sel[0],
      pvClient: sel[3],
      pvDocLabel: sel[4].indexOf('RUC') === 0 ? 'RUC' : 'DNI',
      pvDocId: sel[4].replace(/^(RUC|DNI) /, ''),
      pvDate: sel[2],
      pvPay: sel[6],
      pvRef: sel[1] === 'N' ? 'Anula parcialmente ' + sel[9] : 'Pedido ' + sel[5],
      pvLines: sel[7].map((l) => ({ q: String(Math.abs(l[0])), name: l[1], p: money(l[2]), t: money(l[0] * l[2]) })),
      pvGrav: money(grav),
      pvIgv: money(Math.round((tot - grav) * 100) / 100),
      pvTotal: money(tot),
      pvWords: words(tot),
      pvStatus: sel[8], pvSbg: S[0], pvSfg: S[1], pvSicon: S[2],
      docActions: [
        ['Descargar PDF', 'M12 3v12M7 10l5 5 5-5M5 21h14', '#111111', '#FFFFFF', 'Se descargaría el PDF de ' + sel[0] + ' (diseño de ejemplo).'],
        ['Descargar XML', 'M8 8l-4 4 4 4M16 8l4 4-4 4M14 5l-4 14', '#F4F4F2', '#111111', 'Se descargaría el XML firmado de ' + sel[0] + ' (diseño de ejemplo).'],
        ['Enviar por WhatsApp', 'M4 20l1.4-4A8 8 0 1 1 8 18.6zM9 10c0 3 2 5 5 5', '#F4F4F2', '#111111', 'Se enviaría ' + sel[0] + ' al WhatsApp del cliente (diseño de ejemplo).'],
        ['Emitir nota de crédito', 'M4 9h11a5 5 0 0 1 0 10H9M4 9l4-4M4 9l4 4', '#FFF1E6', '#8A3B0A', 'Se abriría una nota de crédito que hace referencia a ' + sel[0] + ' (diseño de ejemplo).']
      ].map((a) => ({ label: a[0], icon: a[1], bg: a[2], fg: a[3], run: () => this.setState({ notice: a[4] }) })),
      pending: pendingLeft.map((p) => ({
        order: p[0], client: p[1], paid: p[4], kind: p[3] === 'F' ? 'factura (' + p[2] + ')' : 'boleta (' + p[2] + ')', kindShort: p[3] === 'F' ? 'factura' : 'boleta',
        totalTxt: 'S/ ' + money(sum(p[5])),
        emit: () => {
          const next = st.emitted.concat([p[0]]);
          let b = 421, f = 87, id = '';
          next.forEach((oid) => { const q = PEND.find((x) => x[0] === oid); id = q[3] === 'F' ? 'F001-' + String(++f).padStart(5, '0') : 'B001-' + String(++b).padStart(5, '0'); });
          this.setState({ emitted: next, sel: id, tab: 'Todos', sstate: '', notice: 'Se emitió ' + id + ' para el pedido ' + p[0] + ' (diseño de ejemplo).' });
        }
      })),
      noPending: pendingLeft.length === 0,
      config: [['Serie de facturas', 'F001'], ['Serie de boletas', 'B001'], ['Notas de crédito', 'FC01 · BC01'], ['Proveedor OSE / PSE', '[PROVEEDOR]'], ['Certificado digital vence', '[FECHA]']].map((c) => ({ k: c[0], v: c[1] }))
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Comprobantes(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.cp-row:hover{background:#F4F4F2}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Comprobantes"} onPin={lookup(v, "togglePin")} />
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
                    <clipPath id={"via-clip-cpe"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-cpe)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </a>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Comprobantes SUNAT"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Finanzas · boletas y facturas"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "emitNew")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Emitir comprobante"}
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
                    {"Buscar comprobante"}
                  </span>
                  <input type={"search"} placeholder={"Serie, cliente o RUC…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Comprobantes"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "monthCount")}
                    {" emitidos en octubre"}
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
              {Boolean(lookup(v, "notice")) && (
                <Fragment>
                  <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 18px", "borderRadius": "20px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "14px", "fontWeight": "600" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 8v5M12 16h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"}></path>
                    </svg>
                    <span style={{ "flex": "1" }}>
                      {lookup(v, "notice")}
                    </span>
                    <button onClick={lookup(v, "clearNotice")} aria-label={"Cerrar aviso"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "transparent", "cursor": "pointer", "color": "inherit", "fontSize": "18px" }}>
                      {"×"}
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
            <div style={{ "padding": "0 20px 16px", "display": "flex", "gap": "16px", "flexWrap": "wrap" }}>
              <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Emitidos este mes"}
                </span>
                <span style={{ "fontSize": "34px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                  <span style={{ "color": "#FF914C" }}>
                    {"S/"}
                  </span>
                  {" "}
                  {lookup(v, "monthTotal")}
                </span>
                {(lookup(v, "series") || []).map((s, index2) => (
                  <Fragment key={index2}>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                        <span style={{ "color": "#CFCFCF" }}>
                          {lookup(s, "name")}
                          {" "}
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "color": "#9A9A9A" }}>
                            {lookup(s, "code")}
                          </span>
                        </span>
                        <span style={{ "fontWeight": "800" }}>
                          {lookup(s, "n")}
                          {" · "}
                          {lookup(s, "amount")}
                        </span>
                      </span>
                      <span style={{ "height": "6px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                        <span style={{ "display": "block", "width": lookup(s, "w"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ "flex": "1 1 240px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"IGV del mes"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Lo que cobraste de IGV en tus ventas (débito fiscal)"}
                </span>
                <span style={{ "fontSize": "34px", "fontWeight": "700", "letterSpacing": "-0.02em", "marginTop": "4px" }}>
                  <span style={{ "color": "#E8701F" }}>
                    {"S/"}
                  </span>
                  {" "}
                  {lookup(v, "igvMonth")}
                </span>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "marginTop": "auto" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                    <span style={{ "color": "#6B6B6B" }}>
                      {"Op. gravadas"}
                    </span>
                    <span style={{ "fontWeight": "700" }}>
                      {"S/ "}
                      {lookup(v, "gravMonth")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                    <span style={{ "color": "#6B6B6B" }}>
                      {"Crédito fiscal de compras"}
                    </span>
                    <span style={{ "fontWeight": "700" }}>
                      {"[MONTO]"}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px", "paddingTop": "8px", "borderTop": "1px solid #EFEFEC" }}>
                    <span style={{ "color": "#6B6B6B" }}>
                      {"Declarar hasta"}
                    </span>
                    <span style={{ "fontWeight": "700" }}>
                      {"[FECHA SEGÚN RUC]"}
                    </span>
                  </span>
                </div>
              </div>
              <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Estado ante SUNAT"}
                </span>
                {(lookup(v, "stateTiles") || []).map((t, index3) => (
                  <Fragment key={index3}>
                    <button onClick={lookup(t, "pick")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "borderRadius": "18px", "border": "none", "background": lookup(t, "rowBg"), "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left" }}>
                      <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(t, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(t, "fg")} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(t, "icon")}></path>
                        </svg>
                      </span>
                      <span style={{ "flex": "1", "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(t, "name")}
                      </span>
                      <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                        {lookup(t, "n")}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ "flex": "1 1 220px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Notas de crédito"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Anulan o corrigen un comprobante ya emitido"}
                </span>
                <span style={{ "fontSize": "34px", "fontWeight": "700", "letterSpacing": "-0.02em", "marginTop": "4px" }}>
                  {lookup(v, "ncCount")}
                </span>
                <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                  {"por "}
                  <strong style={{ "color": "#111111" }}>
                    {"S/ "}
                    {lookup(v, "ncTotal")}
                  </strong>
                  {" este mes"}
                </span>
                <span style={{ "marginTop": "auto", "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Motivos: devolución de producto, descuento posterior, error en RUC."}
                </span>
              </div>
            </div>
            <div style={{ "padding": "0 20px 16px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                  <span style={{ "fontSize": "18px", "fontWeight": "700", "marginRight": "8px" }}>
                    {"Comprobantes emitidos"}
                  </span>
                  <span style={{ "flex": "1" }}></span>
                  {(lookup(v, "tabs") || []).map((t, index4) => (
                    <Fragment key={index4}>
                      <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(t, "label")}
                        {" "}
                        <span style={{ "opacity": "0.6" }}>
                          {lookup(t, "n")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                {Boolean(lookup(v, "stateFilterOn")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "13px", "color": "#6B6B6B" }}>
                      {"Mostrando solo: "}
                      <strong style={{ "color": "#111111" }}>
                        {lookup(v, "stateFilter")}
                      </strong>
                      <button onClick={lookup(v, "clearState")} style={{ "height": "30px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                        {"Quitar filtro"}
                      </button>
                    </div>
                  </Fragment>
                )}
                <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                  <div style={{ "minWidth": "760px", "display": "flex", "flexDirection": "column" }}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "150px minmax(0, 1fr) 90px 80px 110px 170px", "gap": "12px", "padding": "0 12px 10px", "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C", "borderBottom": "1px solid #EFEFEC" }}>
                      <span>
                        {"Serie-número"}
                      </span>
                      <span>
                        {"Cliente"}
                      </span>
                      <span>
                        {"Fecha"}
                      </span>
                      <span>
                        {"Pedido"}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Total"}
                      </span>
                      <span>
                        {"Estado SUNAT"}
                      </span>
                    </div>
                    {(lookup(v, "docs") || []).map((d, index5) => (
                      <Fragment key={index5}>
                        <div onClick={lookup(d, "pick")} className={lookup(d, "cls")} style={{ "display": "grid", "gridTemplateColumns": "150px minmax(0, 1fr) 90px 80px 110px 170px", "gap": "12px", "alignItems": "center", "minHeight": "58px", "padding": "6px 12px", "borderRadius": "18px", "cursor": "pointer", "background": lookup(d, "bg"), "fontSize": "13px" }}>
                          <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontWeight": "700" }}>
                              {lookup(d, "id")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {lookup(d, "type")}
                            </span>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25", "minWidth": "0" }}>
                            <span style={{ "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                              {lookup(d, "client")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {lookup(d, "docId")}
                            </span>
                          </span>
                          <span style={{ "color": "#444444" }}>
                            {lookup(d, "date")}
                          </span>
                          <a href={"/pedidos"} style={{ "fontWeight": "700", "color": "#C2410C", "textDecoration": "none" }}>
                            {lookup(d, "order")}
                          </a>
                          <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                            {lookup(d, "totalTxt")}
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "justifySelf": "start", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(d, "sbg"), "color": lookup(d, "sfg"), "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(d, "sicon")}></path>
                            </svg>
                            {lookup(d, "status")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {Boolean(lookup(v, "noDocs")) && (
                      <Fragment>
                        <span style={{ "padding": "24px 12px", "fontSize": "14px", "color": "#6B6B6B" }}>
                          {"No hay comprobantes con este filtro."}
                        </span>
                      </Fragment>
                    )}
                  </div>
                </div>
              </div>
              <div style={{ "flex": "1 1 400px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px", "fontSize": "12px" }}>
                  <div style={{ "display": "flex", "gap": "14px", "alignItems": "flex-start" }}>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "4px", "lineHeight": "1.4" }}>
                      <svg width={"150"} height={"50"} viewBox={"134 205 278 92"} role={"img"} aria-label={"VIA Provisiones"}>
                        <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#111111"} strokeWidth={"3"}></circle>
                        <clipPath id={"via-clip-cpe-doc"}>
                          <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                        </clipPath>
                        <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FF914C"}></polygon>
                        <path clipPath={"url(#via-clip-cpe-doc)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FF914C"}></path>
                        <g fill={"none"} stroke={"#111111"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                          <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
                          <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
                          <path d={"M295.8 229 V248.25"}></path>
                        </g>
                        <text x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={"#E8701F"}>
                          {"PROVISIONES"}
                        </text>
                      </svg>
                      <strong style={{ "fontSize": "13px" }}>
                        {"VIA PROVISIONES"}
                      </strong>
                      <span style={{ "color": "#444444" }}>
                        {"Dean Valdivia 533 - Cercado, Arequipa"}
                      </span>
                      <span style={{ "color": "#444444" }}>
                        {"+51 954 802 744 · viaprovisionesperu@gmail.com"}
                      </span>
                    </span>
                    <span style={{ "flex": "none", "width": "170px", "border": "2px solid #111111", "borderRadius": "14px", "padding": "12px", "textAlign": "center", "display": "flex", "flexDirection": "column", "gap": "4px", "fontWeight": "800" }}>
                      <span>
                        {"RUC [RUC]"}
                      </span>
                      <span style={{ "fontSize": "11px", "textTransform": "uppercase" }}>
                        {lookup(v, "pvTitle")}
                      </span>
                      <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px" }}>
                        {lookup(v, "pvId")}
                      </span>
                    </span>
                  </div>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "6px 14px", "padding": "12px", "borderRadius": "14px", "background": "#F4F4F2", "lineHeight": "1.35" }}>
                    <span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Cliente:"}
                      </span>
                      <strong>
                        {lookup(v, "pvClient")}
                      </strong>
                    </span>
                    <span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {lookup(v, "pvDocLabel")}
                        {":"}
                      </span>
                      {" "}
                      {lookup(v, "pvDocId")}
                    </span>
                    <span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Fecha de emisión:"}
                      </span>
                      {" "}
                      {lookup(v, "pvDate")}
                      {" 2026"}
                    </span>
                    <span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Moneda:"}
                      </span>
                      {" Soles (PEN)"}
                    </span>
                    <span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Forma de pago:"}
                      </span>
                      {" "}
                      {lookup(v, "pvPay")}
                    </span>
                    <span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Referencia:"}
                      </span>
                      {" "}
                      {lookup(v, "pvRef")}
                    </span>
                  </div>
                  <div style={{ "display": "flex", "flexDirection": "column" }}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "44px minmax(0, 1fr) 80px 80px", "gap": "8px", "padding": "8px 4px", "fontWeight": "700", "borderBottom": "1px solid #111111" }}>
                      <span>
                        {"Cant."}
                      </span>
                      <span>
                        {"Descripción"}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"P. unit."}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Importe"}
                      </span>
                    </div>
                    {(lookup(v, "pvLines") || []).map((l, index6) => (
                      <Fragment key={index6}>
                        <div style={{ "display": "grid", "gridTemplateColumns": "44px minmax(0, 1fr) 80px 80px", "gap": "8px", "padding": "8px 4px", "borderBottom": "1px solid #EFEFEC" }}>
                          <span>
                            {lookup(l, "q")}
                          </span>
                          <span>
                            {lookup(l, "name")}
                          </span>
                          <span style={{ "textAlign": "right" }}>
                            {lookup(l, "p")}
                          </span>
                          <span style={{ "textAlign": "right", "fontWeight": "700" }}>
                            {lookup(l, "t")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "display": "flex", "gap": "14px", "alignItems": "flex-end" }}>
                    <span style={{ "flex": "none", "width": "96px", "height": "96px", "borderRadius": "10px", "border": "1px dashed #8C8C8C", "display": "flex", "alignItems": "center", "justifyContent": "center", "textAlign": "center", "fontSize": "10px", "color": "#8C8C8C", "lineHeight": "1.3" }}>
                      {"Código QR"}
                      <br />
                      {"de SUNAT"}
                    </span>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "5px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                        <span style={{ "color": "#6B6B6B" }}>
                          {"Op. gravada"}
                        </span>
                        <span>
                          {"S/ "}
                          {lookup(v, "pvGrav")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                        <span style={{ "color": "#6B6B6B" }}>
                          {"IGV 18 %"}
                        </span>
                        <span>
                          {"S/ "}
                          {lookup(v, "pvIgv")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "paddingTop": "6px", "borderTop": "1px solid #111111", "fontSize": "15px", "fontWeight": "800" }}>
                        <span>
                          {"Importe total"}
                        </span>
                        <span>
                          {"S/ "}
                          {lookup(v, "pvTotal")}
                        </span>
                      </span>
                    </span>
                  </div>
                  <span style={{ "fontSize": "11px", "color": "#6B6B6B", "lineHeight": "1.45" }}>
                    {lookup(v, "pvWords")}
                    <br />
                    {"Representación impresa de la "}
                    {lookup(v, "pvKind")}
                    {" electrónica. Hash: "}
                    <span style={{ "fontFamily": "'Roboto Mono', monospace" }}>
                      {"[HASH DEL XML]"}
                    </span>
                    {". Consulte su validez en www.sunat.gob.pe."}
                  </span>
                  <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "alignSelf": "flex-start", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(v, "pvSbg"), "color": lookup(v, "pvSfg"), "fontSize": "12px", "fontWeight": "700" }}>
                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={lookup(v, "pvSicon")}></path>
                    </svg>
                    {"SUNAT: "}
                    {lookup(v, "pvStatus")}
                  </span>
                </div>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                  {(lookup(v, "docActions") || []).map((a, index7) => (
                    <Fragment key={index7}>
                      <button onClick={lookup(a, "run")} style={{ "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "height": "46px", "borderRadius": "999px", "border": "none", "background": lookup(a, "bg"), "color": lookup(a, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.1"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(a, "icon")}></path>
                        </svg>
                        {lookup(a, "label")}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap" }}>
              <div style={{ "flex": "999 1 520px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <span style={{ "display": "flex", "alignItems": "baseline", "gap": "10px", "flexWrap": "wrap" }}>
                  <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                    {"Pendientes por emitir"}
                  </span>
                  <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                    {"Pedidos pagados que todavía no tienen comprobante"}
                  </span>
                </span>
                {(lookup(v, "pending") || []).map((p, index8) => (
                  <Fragment key={index8}>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "12px 14px", "borderRadius": "20px", "background": "#F4F4F2", "flexWrap": "wrap" }}>
                      <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0"}></path>
                        </svg>
                      </span>
                      <span style={{ "flex": "1", "minWidth": "160px", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(p, "order")}
                          {" · "}
                          {lookup(p, "client")}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                          {"Pagado "}
                          {lookup(p, "paid")}
                          {" · corresponde "}
                          {lookup(p, "kind")}
                        </span>
                      </span>
                      <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                        {lookup(p, "totalTxt")}
                      </span>
                      <button onClick={lookup(p, "emit")} style={{ "height": "40px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                        {"Emitir "}
                        {lookup(p, "kindShort")}
                      </button>
                    </div>
                  </Fragment>
                ))}
                {Boolean(lookup(v, "noPending")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "16px", "borderRadius": "20px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "14px", "fontWeight": "600" }}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M5 12l5 5 9-10"}></path>
                      </svg>
                      {"Todos los pedidos pagados tienen su comprobante."}
                    </div>
                  </Fragment>
                )}
              </div>
              <div style={{ "flex": "1 1 340px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Configuración de emisión"}
                </span>
                {(lookup(v, "config") || []).map((c, index9) => (
                  <Fragment key={index9}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "12px", "padding": "8px 0", "borderBottom": "1px solid #2A2A2A", "fontSize": "13px" }}>
                      <span style={{ "color": "#BDBDBD" }}>
                        {lookup(c, "k")}
                      </span>
                      <span style={{ "fontWeight": "700", "textAlign": "right" }}>
                        {lookup(c, "v")}
                      </span>
                    </span>
                  </Fragment>
                ))}
                <span style={{ "fontSize": "12px", "lineHeight": "1.5", "color": "#CFCFCF" }}>
                  {"Esto es un diseño. Para emitir comprobantes de verdad se necesita un proveedor autorizado por SUNAT (OSE o PSE) y el certificado digital de la empresa."}
                </span>
                <a href={"/ajustes"} style={{ "marginTop": "auto", "height": "44px", "borderRadius": "999px", "background": "#FF914C", "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                  {"Abrir ajustes de facturación"}
                </a>
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Comprobantes"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
