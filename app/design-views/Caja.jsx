"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), filter: 'Todos', count: null, closed: false };
  }
  renderVals() {
    const st = this.state;
    const money = (n) => (n < 0 ? '− ' : '') + 'S/ ' + Math.abs(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const OPEN = 200;
    // [hora, tipo, descripción, medio, monto, enlace, texto del enlace]
    const MOV = [
      ['08:30', 'Apertura', 'Monto de apertura', 'Efectivo · Beltran C.', 200, '', ''],
      ['09:12', 'Venta', 'Pedido #1036 · Minimarket Yanahuara', 'Efectivo', 318, '/pedidos', 'Pedido'],
      ['09:51', 'Venta', 'Pedido #1041 · Bodega San Martín', 'Transferencia', 1101.6, '/pedidos', 'Pedido'],
      ['10:24', 'Venta', 'Pedido #1042 · María Q.', 'Yape', 159.7, '/pedidos', 'Pedido'],
      ['11:05', 'Egreso', 'Pago movilidad (delivery)', 'Efectivo', -35, '/gastos', 'Gasto'],
      ['11:40', 'Venta', 'Venta en mostrador · 6 productos', 'Efectivo', 486.5, '', ''],
      ['12:15', 'Venta', 'Pedido #1043 · Ana T.', 'Plin', 29.9, '/pedidos', 'Pedido'],
      ['13:30', 'Egreso', 'Compra de bolsas y cinta', 'Efectivo', -42.5, '/gastos', 'Gasto'],
      ['15:02', 'Venta', 'Pedido #1044 · Luis R.', 'Tarjeta', 1290, '/pedidos', 'Pedido'],
      ['16:20', 'Retiro', 'Depósito al banco [BANCO]', 'Efectivo · Beltran C.', -800, '', ''],
      ['17:45', 'Venta', 'Venta en mostrador · 11 productos', 'Efectivo', 712.3, '', '']
    ];
    const T = {
      Apertura: ['#EFEFEC', '#444444', 'M5 12l5 5 9-10'],
      Venta: ['#E4F4E7', '#1B5E20', 'M12 19V5M5 12l7-7 7 7'],
      Egreso: ['#FDE4E2', '#8E1C14', 'M12 5v14M5 12l7 7 7-7'],
      Retiro: ['#E3F1FF', '#0B4A8A', 'M3 10h18M5 10v8M19 10v8M12 3l9 5H3z']
    };
    const cashIn = MOV.filter((m) => m[3].indexOf('Efectivo') === 0 && m[1] === 'Venta').reduce((a, m) => a + m[4], 0);
    const cashOut = MOV.filter((m) => m[3].indexOf('Efectivo') === 0 && (m[1] === 'Egreso' || m[1] === 'Retiro')).reduce((a, m) => a + m[4], 0);
    const expected = OPEN + cashIn + cashOut;
    const DEN = [['S/ 200', 200, 1], ['S/ 100', 100, 4], ['S/ 50', 50, 3], ['S/ 20', 20, 3], ['S/ 10', 10, 2], ['S/ 5', 5, 1], ['Monedas', 1, 4.3]];
    const cnt = st.count || DEN.map((d) => d[2]);
    const counted = DEN.reduce((a, d, i) => a + d[1] * cnt[i], 0);
    const diff = Math.round((counted - expected) * 100) / 100;
    const D = diff === 0 ? ['Cuadra', '#1E3A23', '#7CDB8E', '#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'] : diff > 0 ? ['Sobra ' + money(diff), '#3A2E10', '#FFC857', '#FFF4D6', '#7A4A00', 'M12 19V5M5 12l7-7 7 7'] : ['Falta ' + money(-diff), '#3A1512', '#FF8A80', '#FDE4E2', '#8E1C14', 'M12 5v14M5 12l7 7 7-7'];
    const setCnt = (i, delta) => {
      const c = (st.count || DEN.map((d) => d[2])).slice();
      const step = i === DEN.length - 1 ? 0.1 : 1;
      c[i] = Math.max(0, Math.round((c[i] + delta * step) * 10) / 10);
      this.setState({ count: c });
    };
    const METH = ['Efectivo', 'Yape', 'Plin', 'Transferencia', 'Tarjeta'].map((n) => {
      const ms = MOV.filter((m) => m[1] === 'Venta' && m[3].indexOf(n) === 0);
      return [n, ms.reduce((a, m) => a + m[4], 0), ms.length];
    });
    const maxM = Math.max.apply(null, METH.map((m) => m[1]));
    const totalIn = METH.reduce((a, m) => a + m[1], 0);
    const HRS = [0.2, 0.55, 0.8, 0.6, 0.4, 0.35, 0.5, 0.9, 0.7, 0.45, 0.25];
    const FIL = ['Todos', 'Venta', 'Egreso', 'Retiro'];
    const HIS = [
      ['Dom 25 oct', 1840, 620, 620, 0, 'Beltran C.'],
      ['Sáb 24 oct', 3420, 1310, 1305, -5, '[Vendedor]'],
      ['Vie 23 oct', 2980, 1120, 1120, 0, '[Vendedor]'],
      ['Jue 22 oct', 2610, 940, 942, 2, 'Beltran C.'],
      ['Mié 21 oct', 2390, 880, 880, 0, '[Vendedor]'],
      ['Mar 20 oct', 2550, 910, 900, -10, 'Beltran C.'],
      ['Lun 19 oct', 2270, 790, 790, 0, '[Vendedor]']
    ];
    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      closed: st.closed,
      closeCash: () => this.setState({ closed: !st.closed }),
      closeLabel: st.closed ? 'Caja cerrada' : 'Cerrar caja',
      stateText: st.closed ? 'Cerrada 20:00' : 'Abierta desde 08:30',
      stateBg: st.closed ? '#EFEFEC' : '#E4F4E7',
      stateFg: st.closed ? '#444444' : '#1B5E20',
      stateIcon: st.closed ? 'M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4' : 'M5 12l5 5 9-10',
      totalIn: money(totalIn),
      headStats: [
        [money(OPEN).replace('.00', ''), 'Apertura', '08:30 · ejemplo', '#FFFFFF', '#111111'],
        [String(MOV.filter((m) => m[1] === 'Venta').length), 'Ventas', 'cobradas hoy', '#FFFFFF', '#111111'],
        [money(-MOV.filter((m) => m[1] === 'Egreso').reduce((a, m) => a + m[4], 0)).replace('.00', ''), 'Egresos', 'en efectivo', '#FFFFFF', '#111111'],
        [D[0] === 'Cuadra' ? 'OK' : (diff > 0 ? '+' : '−'), 'Arqueo', D[0], D[3], D[4]]
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      expected: money(expected),
      counted: money(counted),
      diffText: D[0],
      diffBg: D[1], diffFg: D[2], diffBgLight: D[3], diffFgLight: D[4], diffIcon: D[5],
      cashCalc: [['Apertura', money(OPEN)], ['Ventas en efectivo', '+ ' + money(cashIn)], ['Egresos y retiros', money(cashOut)], ['Debe haber en el cajón', money(expected)]].map((c) => ({ k: c[0], v: c[1] })),
      methods: METH.map((m) => ({ name: m[0], amount: money(m[1]), n: m[2] + (m[2] === 1 ? ' venta' : ' ventas'), w: Math.max(3, Math.round((m[1] / maxM) * 100)) + '%' })),
      hours: HRS.map((v, i) => ({ t: (8 + i) + 'h', h: Math.round(v * 100) + '%', c: v === 0.9 ? '#E8701F' : '#F5C3A0', title: (8 + i) + ':00 · ' + money(Math.round(v * 620)) })),
      filters: FIL.map((f) => ({ label: f === 'Todos' ? 'Todos' : f + (f === 'Venta' ? 's' : 's'), pick: () => this.setState({ filter: f }), pressed: st.filter === f ? 'true' : 'false', bg: st.filter === f ? '#111111' : '#F4F4F2', fg: st.filter === f ? '#FFFFFF' : '#111111' })),
      moves: MOV.filter((m) => st.filter === 'Todos' || m[1] === st.filter).map((m) => ({
        time: m[0], type: m[1], desc: m[2], method: m[3], amount: (m[4] > 0 ? '+ ' : '') + money(m[4]),
        amtFg: m[4] < 0 ? '#8E1C14' : '#111111', bg: T[m[1]][0], fg: T[m[1]][1], icon: T[m[1]][2], link: m[5], linkText: m[6]
      })),
      denoms: DEN.map((d, i) => ({
        label: d[0], qty: i === DEN.length - 1 ? money(cnt[i]) : String(cnt[i]), sub: money(d[1] * cnt[i]),
        minus: () => setCnt(i, -1), plus: () => setCnt(i, 1),
        minusLabel: 'Quitar ' + d[0], plusLabel: 'Agregar ' + d[0]
      })),
      resetCount: () => this.setState({ count: null }),
      history: HIS.map((h) => {
        const ok = h[4] === 0;
        return { date: h[0], sales: money(h[1]), cash: money(h[2]), counted: money(h[3]), diff: ok ? 'Cuadra' : (h[4] > 0 ? 'Sobra ' : 'Falta ') + money(Math.abs(h[4])), who: h[5],
          bg: ok ? '#E4F4E7' : (h[4] > 0 ? '#FFF4D6' : '#FDE4E2'), fg: ok ? '#1B5E20' : (h[4] > 0 ? '#7A4A00' : '#8E1C14'), icon: ok ? 'M5 12l5 5 9-10' : (h[4] > 0 ? 'M12 19V5M5 12l7-7 7 7' : 'M12 5v14M5 12l7 7 7-7') };
      })
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Caja(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
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
                    <clipPath id={"via-clip-caja"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-caja)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Caja del día"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Finanzas · lunes 26 de octubre"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "40px", "padding": "0 16px", "borderRadius": "999px", "background": lookup(v, "stateBg"), "color": lookup(v, "stateFg"), "fontSize": "13px", "fontWeight": "700" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(v, "stateIcon")}></path>
                  </svg>
                  {lookup(v, "stateText")}
                </span>
                <button onClick={lookup(v, "closeCash")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4"}></path>
                  </svg>
                  {lookup(v, "closeLabel")}
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Caja · "}
                    {lookup(v, "totalIn")}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {"ingresó hoy por todos los medios"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                {(lookup(v, "headStats") || []).map((h, index1) => (
                  <Fragment key={index1}>
                    <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                      <span style={{ "minWidth": "76px", "height": "76px", "padding": "0 14px", "boxSizing": "border-box", "borderRadius": "999px", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "18px", "fontWeight": "700", "background": lookup(h, "bg"), "color": lookup(h, "fg") }}>
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
              {Boolean(lookup(v, "closed")) && (
                <Fragment>
                  <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 18px", "borderRadius": "20px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "14px", "fontWeight": "600" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                    <span style={{ "flex": "1" }}>
                      {"Caja cerrada a las 20:00 con "}
                      {lookup(v, "counted")}
                      {" contados ("}
                      {lookup(v, "diffText")}
                      {"). El cierre quedó en el historial (ejemplo)."}
                    </span>
                    <button onClick={lookup(v, "closeCash")} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "color": "#1B5E20", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                      {"Reabrir"}
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
            <div style={{ "padding": "0 20px 16px", "display": "flex", "gap": "16px", "flexWrap": "wrap" }}>
              <div style={{ "flex": "1 1 360px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Efectivo en caja"}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                    {"Abierta 08:30 · Beltran C."}
                  </span>
                </div>
                <div style={{ "display": "flex", "gap": "20px", "flexWrap": "wrap" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                    <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                      {"Esperado"}
                    </span>
                    <span style={{ "fontSize": "34px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                      {lookup(v, "expected")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                    <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                      {"Contado"}
                    </span>
                    <span style={{ "fontSize": "34px", "fontWeight": "700", "letterSpacing": "-0.02em", "color": "#FF914C" }}>
                      {lookup(v, "counted")}
                    </span>
                  </span>
                </div>
                <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "34px", "padding": "0 14px", "borderRadius": "999px", "background": lookup(v, "diffBg"), "color": lookup(v, "diffFg"), "fontSize": "13px", "fontWeight": "700" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(v, "diffIcon")}></path>
                  </svg>
                  {lookup(v, "diffText")}
                </span>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "0", "borderTop": "1px solid #2A2A2A" }}>
                  {(lookup(v, "cashCalc") || []).map((c, index2) => (
                    <Fragment key={index2}>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "10px 0", "borderBottom": "1px solid #2A2A2A", "fontSize": "13px" }}>
                        <span style={{ "color": "#CFCFCF" }}>
                          {lookup(c, "k")}
                        </span>
                        <span style={{ "fontWeight": "700" }}>
                          {lookup(c, "v")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "flex": "1 1 380px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Ingresos por medio de pago"}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                    {"ejemplo"}
                  </span>
                </div>
                {(lookup(v, "methods") || []).map((m, index3) => (
                  <Fragment key={index3}>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "fontSize": "13px" }}>
                        <span style={{ "fontWeight": "600" }}>
                          {lookup(m, "name")}
                        </span>
                        <span>
                          <span style={{ "fontWeight": "800" }}>
                            {lookup(m, "amount")}
                          </span>
                          <span style={{ "color": "#8C8C8C" }}>
                            {" · "}
                            {lookup(m, "n")}
                          </span>
                        </span>
                      </span>
                      <span style={{ "height": "10px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                        <span style={{ "display": "block", "width": lookup(m, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                      </span>
                    </div>
                  </Fragment>
                ))}
                <span style={{ "marginTop": "auto", "fontSize": "12px", "color": "#6B6B6B", "lineHeight": "1.5" }}>
                  {"Solo el efectivo entra al cajón. Yape, Plin, transferencia y tarjeta se concilian con el banco [BANCO]."}
                </span>
              </div>
              <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Ventas por hora"}
                </span>
                <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "6px", "height": "150px" }}>
                  {(lookup(v, "hours") || []).map((h, index4) => (
                    <Fragment key={index4}>
                      <span title={lookup(h, "title")} style={{ "flex": "1", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "flex-end", "gap": "6px", "height": "100%" }}>
                        <span style={{ "width": "100%", "height": lookup(h, "h"), "borderRadius": "8px 8px 4px 4px", "background": lookup(h, "c") }}></span>
                        <span style={{ "fontSize": "10px", "color": "#8C8C8C" }}>
                          {lookup(h, "t")}
                        </span>
                      </span>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "display": "flex", "gap": "10px", "padding": "12px 14px", "borderRadius": "18px", "background": "#F4F4F2", "fontSize": "13px", "lineHeight": "1.4" }}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                    <path d={"M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4"}></path>
                  </svg>
                  <span>
                    {"Hoy se emitieron "}
                    <strong>
                      {"27 boletas"}
                    </strong>
                    {" y "}
                    <strong>
                      {"4 facturas"}
                    </strong>
                    {". "}
                    <DesignLink href={"/comprobantes"} style={{ "fontWeight": "700", "color": "#C2410C", "textUnderlineOffset": "3px" }}>
                      {"Ver comprobantes"}
                    </DesignLink>
                  </span>
                </div>
              </div>
            </div>
            <div style={{ "padding": "0 20px 16px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Movimientos de hoy"}
                  </span>
                  <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                    {(lookup(v, "filters") || []).map((f, index5) => (
                      <Fragment key={index5}>
                        <button onClick={lookup(f, "pick")} aria-pressed={lookup(f, "pressed")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(f, "bg"), "color": lookup(f, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(f, "label")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                {(lookup(v, "moves") || []).map((m, index6) => (
                  <Fragment key={index6}>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 6px", "borderBottom": "1px solid #F0F0EE" }}>
                      <span style={{ "fontSize": "12px", "color": "#8C8C8C", "width": "42px", "flex": "none" }}>
                        {lookup(m, "time")}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(m, "bg"), "color": lookup(m, "fg"), "fontSize": "11px", "fontWeight": "700", "width": "92px", "boxSizing": "border-box", "flex": "none" }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(m, "icon")}></path>
                        </svg>
                        {lookup(m, "type")}
                      </span>
                      <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                          {lookup(m, "desc")}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                          {lookup(m, "method")}
                        </span>
                      </span>
                      {Boolean(lookup(m, "link")) && (
                        <Fragment>
                          <DesignLink href={lookup(m, "link")} style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C", "textUnderlineOffset": "3px" }}>
                            {lookup(m, "linkText")}
                          </DesignLink>
                        </Fragment>
                      )}
                      <span style={{ "fontSize": "14px", "fontWeight": "800", "color": lookup(m, "amtFg"), "minWidth": "96px", "textAlign": "right" }}>
                        {lookup(m, "amount")}
                      </span>
                    </div>
                  </Fragment>
                ))}
                <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap", "paddingTop": "4px" }}>
                  <DesignLink href={"/gastos"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "42px", "padding": "0 16px", "borderRadius": "999px", "background": "#F4F4F2", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M5 12h14"}></path>
                    </svg>
                    {"Registrar egreso"}
                  </DesignLink>
                  <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "42px", "padding": "0 16px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 5v14M5 12h14"}></path>
                    </svg>
                    {"Ingreso manual"}
                  </button>
                </div>
              </div>
              <div style={{ "flex": "1 1 360px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Arqueo de caja"}
                  </span>
                  <button onClick={lookup(v, "resetCount")} style={{ "border": "none", "background": "transparent", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "color": "#C2410C" }}>
                    {"Volver a contar"}
                  </button>
                </div>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Cuenta los billetes y monedas del cajón."}
                </span>
                {(lookup(v, "denoms") || []).map((d, index7) => (
                  <Fragment key={index7}>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "6px 8px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                      <span style={{ "width": "64px", "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(d, "label")}
                      </span>
                      <button onClick={lookup(d, "minus")} aria-label={lookup(d, "minusLabel")} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "16px", "fontWeight": "700" }}>
                        {"−"}
                      </button>
                      <span style={{ "width": "34px", "textAlign": "center", "fontSize": "15px", "fontWeight": "800" }}>
                        {lookup(d, "qty")}
                      </span>
                      <button onClick={lookup(d, "plus")} aria-label={lookup(d, "plusLabel")} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "16px", "fontWeight": "700" }}>
                        {"+"}
                      </button>
                      <span style={{ "flex": "1", "textAlign": "right", "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(d, "sub")}
                      </span>
                    </div>
                  </Fragment>
                ))}
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "padding": "12px 4px 0", "borderTop": "1px solid #F0F0EE" }}>
                  <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                    {"Total contado"}
                  </span>
                  <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                    {lookup(v, "counted")}
                  </span>
                </div>
                <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "34px", "padding": "0 14px", "borderRadius": "999px", "background": lookup(v, "diffBgLight"), "color": lookup(v, "diffFgLight"), "fontSize": "13px", "fontWeight": "700" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(v, "diffIcon")}></path>
                  </svg>
                  {lookup(v, "diffText")}
                </span>
              </div>
            </div>
            <div style={{ "padding": "0 20px 24px" }}>
              <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Cierres de los últimos 7 días"}
                  </span>
                  <DesignLink href={"/reportes"} style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C", "textUnderlineOffset": "3px" }}>
                    {"Ver en reportes"}
                  </DesignLink>
                </div>
                <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                  <div style={{ "minWidth": "760px", "display": "flex", "flexDirection": "column" }}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "1.2fr 1fr 1fr 1fr 1.2fr 1fr", "gap": "10px", "padding": "8px 10px", "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                      <span>
                        {"Fecha"}
                      </span>
                      <span>
                        {"Ventas"}
                      </span>
                      <span>
                        {"Efectivo"}
                      </span>
                      <span>
                        {"Contado"}
                      </span>
                      <span>
                        {"Diferencia"}
                      </span>
                      <span>
                        {"Responsable"}
                      </span>
                    </div>
                    {(lookup(v, "history") || []).map((h, index8) => (
                      <Fragment key={index8}>
                        <div style={{ "display": "grid", "gridTemplateColumns": "1.2fr 1fr 1fr 1fr 1.2fr 1fr", "gap": "10px", "alignItems": "center", "padding": "10px", "borderTop": "1px solid #F0F0EE", "fontSize": "13px" }}>
                          <span style={{ "fontWeight": "700" }}>
                            {lookup(h, "date")}
                          </span>
                          <span>
                            {lookup(h, "sales")}
                          </span>
                          <span>
                            {lookup(h, "cash")}
                          </span>
                          <span>
                            {lookup(h, "counted")}
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "justifySelf": "start", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(h, "bg"), "color": lookup(h, "fg"), "fontSize": "12px", "fontWeight": "700" }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(h, "icon")}></path>
                            </svg>
                            {lookup(h, "diff")}
                          </span>
                          <span>
                            {lookup(h, "who")}
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
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Caja"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
