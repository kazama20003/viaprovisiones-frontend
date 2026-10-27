"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), period: 0, hoverW: -1, hoverM: -1, sort: 'Ventas', weekly: true, dl: {}, reminded: {}, exported: false };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const st = this.state;
    const money = (n) => 'S/ ' + Math.round(n).toLocaleString('es-PE');
    const pct = (n) => Math.round(n * 100) + '%';
    // Periodos (cifras de ejemplo): factor sobre octubre 2026, costo y gastos como parte de la venta
    const PER = [
      { name: 'Este mes', label: 'Octubre 2026', prev: 'setiembre', f: 1, cost: 0.6, exp: 0.173, delta: '+1.2 pts', months: [11] },
      { name: 'Trimestre', label: 'Agosto – octubre 2026', prev: 'may – jul', f: 52650 / 18450, cost: 0.605, exp: 0.18, delta: '+0.8 pts', months: [9, 10, 11] },
      { name: 'Año', label: 'Nov 2025 – oct 2026', prev: 'el año anterior', f: 187450 / 18450, cost: 0.612, exp: 0.19, delta: '+2.1 pts', months: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
      { name: 'Personalizado', label: '01 – 20 oct 2026', prev: '01 – 20 set', f: 0.62, cost: 0.598, exp: 0.17, delta: '+0.5 pts', months: [11] }
    ];
    const P = PER[st.period];
    const sales = 18450 * P.f;
    const cost = sales * P.cost;
    const gross = sales - cost;
    const exp = sales * P.exp;
    const net = gross - exp;
    const orders = Math.round(sales / 146);

    const WF = [
      ['Ventas', sales, 0, sales, true, 'Todo lo cobrado en boletas y facturas del periodo.'],
      ['Costo de lo vendido', cost, gross, cost, false, 'Calculado con el precio de compra de cada lote, vendiendo primero el más antiguo.'],
      ['Margen bruto', gross, 0, gross, true, 'Lo que queda después de pagar la mercadería.'],
      ['Gastos [ejemplo]', exp, net, exp, false, 'Alquiler, planilla, envíos y servicios: [completar con tus datos].'],
      ['Utilidad', net, 0, net, true, 'Lo que gana el negocio en el periodo antes de impuestos.']
    ];
    const H = 0.86; // deja espacio para la etiqueta encima de la barra más alta
    const waterfall = WF.map((w, i) => {
      const hov = st.hoverW === i;
      return {
        name: w[0], value: (w[4] ? '' : '− ') + money(w[1]), pct: pct(w[1] / sales) + ' de las ventas',
        b: ((w[2] / sales) * H * 100).toFixed(1) + '%', h: ((w[3] / sales) * H * 100).toFixed(1) + '%',
        top: (((w[2] + w[3]) / sales) * H * 100).toFixed(1) + '%',
        c: hov ? '#111111' : (w[4] ? '#E8701F' : '#CFCFCB'), labelFg: w[4] ? '#111111' : '#6B6B6B',
        enter: () => this.setState({ hoverW: i }), leave: () => this.setState({ hoverW: -1 })
      };
    });
    const hw = WF[st.hoverW];
    const wfInfo = hw ? hw[0] + ': ' + money(hw[1]) + ' · ' + pct(hw[1] / sales) + ' de las ventas. ' + hw[5]
      : 'De cada S/ 100 que vendes te quedan S/ ' + Math.round((gross / sales) * 100) + ' de margen y S/ ' + Math.round((net / sales) * 100) + ' de utilidad. Pasa el cursor por una barra para ver el detalle.';

    const MON = [['Nov', 12400, 37], ['Dic', 21800, 35], ['Ene', 11900, 38], ['Feb', 12600, 38], ['Mar', 14100, 39], ['Abr', 14900, 39], ['May', 15700, 38], ['Jun', 15100, 39], ['Jul', 16300, 39], ['Ago', 16900, 39], ['Set', 17300, 39], ['Oct', 18450, 40]];
    const full = ['Noviembre 2025', 'Diciembre 2025', 'Enero 2026', 'Febrero 2026', 'Marzo 2026', 'Abril 2026', 'Mayo 2026', 'Junio 2026', 'Julio 2026', 'Agosto 2026', 'Setiembre 2026', 'Octubre 2026'];
    const months = MON.map((m, i) => {
      const inP = P.months.indexOf(i) >= 0;
      return {
        tick: m[0], aria: full[i] + ': ' + money(m[1]) + ' · margen ' + m[2] + '%',
        h: Math.round((m[1] / 22000) * 100) + '%',
        c: st.hoverM === i ? '#111111' : (inP ? '#E8701F' : '#E4E4E0'),
        tickFg: inP ? '#111111' : '#9A9A9A',
        enter: () => this.setState({ hoverM: i }), leave: () => this.setState({ hoverM: -1 })
      };
    });
    const hm = MON[st.hoverM];
    const monthInfo = hm ? { label: full[st.hoverM], value: money(hm[1]), sub: 'Margen ' + hm[2] + '% · ' + Math.round(hm[1] / 146) + ' pedidos' }
      : { label: 'Mejor mes', value: money(21800), sub: 'Diciembre 2025 · campaña navideña' };

    const CH = [['Tienda web', 0.46], ['WhatsApp', 0.32], ['Empresas', 0.22]];
    const SEL = [['Beltran C.', 'Gerente comercial · empresas', 0.41, '#111111', '#FFFFFF'], ['[Vendedor 1]', 'Tienda y WhatsApp', 0.33, '#FFF1E6', '#8A3B0A'], ['[Vendedor 2]', 'Tienda y WhatsApp', 0.26, '#F4F4F2', '#111111']];

    const CAT = [['Solar', 0.227, 0.31, 0.022], ['Focos', 0.215, 0.46, 0.48], ['Cables', 0.18, 0.42, 0.21], ['Camping', 0.162, 0.38, 0.06], ['Extensiones', 0.104, 0.35, 0.05], ['Llaveros', 0.044, 0.58, 0.09], ['Ganchos', 0.035, 0.52, 0.07], ['Bisutería', 0.033, 0.61, 0.04]];
    const catRows = CAT.slice().sort((a, b) => (st.sort === 'Margen' ? b[2] - a[2] : b[1] - a[1]));
    const maxShare = 0.227;
    const cats = catRows.map((c) => ({
      name: c[0], v: money(sales * c[1]), w: Math.round((c[1] / maxShare) * 100) + '%',
      units: Math.round(sales * c[1] * c[3]).toLocaleString('es-PE'), cost: money(sales * c[1] * (1 - c[2])),
      margin: pct(c[2]), mBg: c[2] >= 0.5 ? '#FFE2CC' : (c[2] >= 0.4 ? '#FFF1E6' : '#F4F4F2')
    }));

    const PM = (name, m, img) => ({ name, m: m + '%', w: Math.round((m / 70) * 100) + '%', img: B + img, warn: m < 20 });
    const topM = [PM('Collar dorado de cadena fina', 64, '792438e54fa4b4d81f31171a2cf026f6'), PM('Mosquetón llavero de aluminio', 58, 'eb0c79147accd306bbd7a39d350a8e88'), PM('Foco LED 9 W luz cálida', 46, '52dc55c2523393f8f60ab89499fa3ec1'), PM('Cable USB-C carga rápida 1 m', 44, '3aba2390d3fbd5f06fdd2cede507b16f')];
    const lowM = [PM('Panel solar monocristalino 100 W', 24, '972ceb606bfca75ef6208d8d3966c77d'), PM('Estación de energía portátil', 22, '56a034356f25e7cd0fe7251db3cbbddc'), PM('Extensión de uso rudo 5 m', 19, '323e29809539c2fb4b229651c8081ee9'), PM('Carrete de extensión 15 m', 17, 'c390a322d80bcca52c15a80479e59e7b')];

    const ROT = [['Focos', 18], ['Cables', 22], ['Llaveros', 34], ['Camping', 41], ['Extensiones', 47], ['Solar', 63]];
    const STK = [['L-0712', 'Extensión de uso rudo 10 m', 128, 34, 1020], ['L-0705', 'Linterna frontal LED', 112, 22, 396], ['L-0698', 'Gancho S de acero (pack 10)', 104, 150, 270], ['L-0730', 'Aretes de acero quirúrgico', 96, 40, 240]];

    const AG = [
      ['0 – 30 días', 6240, 'Al día', '#2E9E4F', '#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      ['31 – 60 días', 2180, 'Por cobrar pronto', '#F2A100', '#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01'],
      ['Más de 60 días', 940, 'Vencido', '#E5483D', '#FDE4E2', '#8E1C14', 'M6 6l12 12M18 6L6 18']
    ];
    const arSum = AG.reduce((a, x) => a + x[1], 0);
    const DEB = [['Ferretería Cayma', 'Factura 30 días · vence 03 nov', 3460], ['Constructora [Cliente]', 'Factura · 45 días', 2180], ['Hotel [Cliente]', 'Factura · 72 días', 940]];

    const REP = [['Ventas del periodo', 'Por día, canal y comprobante'], ['Registro de ventas (SUNAT)', 'Boletas y facturas emitidas'], ['Kardex por lote', 'Entradas, salidas y saldo de cada lote'], ['Cuentas por cobrar', 'Por cliente y antigüedad'], ['Margen por producto', 'Venta, costo de lote y margen']];

    return {
      accent,
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      exportLabel: st.exported ? 'Exportado ✓' : 'Exportar',
      exportAll: () => this.setState({ exported: true }),
      periodLabel: P.label,
      prevLabel: P.prev,
      periods: PER.map((p, i) => ({ name: p.name, on: st.period === i, bg: st.period === i ? '#111111' : 'transparent', fg: st.period === i ? '#FFFFFF' : '#111111', pick: () => this.setState({ period: i, hoverW: -1 }) })),
      waterfall,
      wfInfo,
      marginPct: pct(gross / sales),
      marginDelta: P.delta,
      kpis: [['Ventas', money(sales)], ['Utilidad estimada', money(net)], ['Pedidos', orders.toLocaleString('es-PE')], ['Ticket promedio', money(sales / orders)]].map((k) => ({ name: k[0], v: k[1] })),
      months,
      monthInfo,
      salesTotal: money(sales),
      channels: CH.map((c) => ({ name: c[0], v: money(sales * c[1]), pct: pct(c[1]), w: Math.round((c[1] / 0.46) * 100) + '%' })),
      sellers: SEL.map((s) => ({ name: s[0], v: money(sales * s[2]), w: Math.round((s[2] / 0.41) * 100) + '%', sub: s[1] + ' · ' + Math.round(orders * s[2]) + ' pedidos', bg: s[3], fg: s[4], ini: s[0].replace(/[\[\]]/g, '').split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase() })),
      sorts: ['Ventas', 'Margen'].map((n) => ({ name: n, on: st.sort === n, bg: st.sort === n ? '#111111' : '#FFFFFF', fg: st.sort === n ? '#FFFFFF' : '#111111', border: st.sort === n ? '#111111' : '#DCDCD8', pick: () => this.setState({ sort: n }) })),
      cats,
      topM,
      lowM,
      rotation: ROT.map((r) => ({ name: r[0], d: r[1] + ' d', w: Math.round((r[1] / 63) * 100) + '%' })),
      stuck: STK.map((l) => ({ lot: l[0], name: l[1], days: l[2], units: l[3], v: money(l[4]) })),
      stuckTotal: money(STK.reduce((a, l) => a + l[4], 0)),
      aging: AG.map((a) => ({ name: a[0], v: money(a[1]), state: a[2], c: a[3], bg: a[4], fg: a[5], icon: a[6], w: ((a[1] / arSum) * 100).toFixed(1) + '%' })),
      arTotal: money(arSum),
      debtors: DEB.map((d) => {
        const done = !!st.reminded[d[0]];
        return { name: d[0], sub: d[1], v: money(d[2]), btn: done ? 'Enviado ✓' : 'Recordar', btnBg: done ? '#E4F4E7' : '#111111', btnFg: done ? '#1B5E20' : '#FFFFFF', remind: () => this.setState({ reminded: { ...st.reminded, [d[0]]: true } }) };
      }),
      saved: REP.map((r) => {
        const got = st.dl[r[0]];
        return { name: r[0], sub: got ? 'Descargado en ' + got + ' · ' + P.label : r[1], subFg: got ? '#1B5E20' : '#8C8C8C', xls: () => this.setState({ dl: { ...st.dl, [r[0]]: 'Excel' } }), pdf: () => this.setState({ dl: { ...st.dl, [r[0]]: 'PDF' } }) };
      }),
      weeklyOn: st.weekly,
      weeklyBg: st.weekly ? '#E8701F' : '#CFCFCB',
      weeklyJustify: st.weekly ? 'flex-end' : 'flex-start',
      toggleWeekly: () => this.setState({ weekly: !st.weekly })
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Reportes(props) {
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
                    <clipPath id={"via-clip-rep"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-rep)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Reportes"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Resultados del negocio"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "exportAll")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
                  </svg>
                  {lookup(v, "exportLabel")}
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
                    {"Buscar reporte"}
                  </span>
                  <input type={"search"} placeholder={"Buscar reporte…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Reportes"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "periodLabel")}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "10px" }}>
                  <div role={"group"} aria-label={"Periodo"} style={{ "display": "flex", "gap": "6px", "padding": "6px", "borderRadius": "999px", "background": "#FFFFFF", "flexWrap": "wrap" }}>
                    {(lookup(v, "periods") || []).map((p, index1) => (
                      <Fragment key={index1}>
                        <button onClick={lookup(p, "pick")} aria-pressed={lookup(p, "on")} style={{ "height": "44px", "padding": "0 20px", "borderRadius": "999px", "border": "none", "background": lookup(p, "bg"), "color": lookup(p, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "13px", "fontWeight": "700" }}>
                          {lookup(p, "name")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                    {"Cifras de ejemplo · comparado con "}
                    {lookup(v, "prevLabel")}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ "background": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "3 1 620px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Estado de resultados"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"De lo que vendiste a lo que te queda. El costo sale del precio de compra de cada lote."}
                      </span>
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "14px", "fontSize": "11px", "fontWeight": "700", "color": "#6B6B6B" }}>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px" }}>
                        <span style={{ "width": "10px", "height": "10px", "borderRadius": "3px", "background": "#E8701F" }}></span>
                        {"Resultado"}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px" }}>
                        <span style={{ "width": "10px", "height": "10px", "borderRadius": "3px", "background": "#CFCFCB" }}></span>
                        {"Se descuenta"}
                      </span>
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "18px 18px 14px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "14px", "height": "250px", "borderBottom": "1px solid #E4E4E0" }}>
                      {(lookup(v, "waterfall") || []).map((w, index2) => (
                        <Fragment key={index2}>
                          <div onMouseEnter={lookup(w, "enter")} onMouseLeave={lookup(w, "leave")} style={{ "position": "relative", "height": "100%" }}>
                            <span style={{ "position": "absolute", "left": "0", "right": "0", "bottom": lookup(w, "top"), "marginBottom": "6px", "textAlign": "center", "fontSize": "13px", "fontWeight": "800", "color": lookup(w, "labelFg") }}>
                              {lookup(w, "value")}
                            </span>
                            <span title={String(lookup(w, "name") ?? "") + ": " + String(lookup(w, "value") ?? "")} style={{ "position": "absolute", "left": "12%", "right": "12%", "bottom": lookup(w, "b"), "height": lookup(w, "h"), "borderRadius": "10px", "background": lookup(w, "c") }}></span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "14px" }}>
                      {(lookup(v, "waterfall") || []).map((w, index3) => (
                        <Fragment key={index3}>
                          <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "textAlign": "center", "gap": "2px" }}>
                            <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                              {lookup(w, "name")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {lookup(w, "pct")}
                            </span>
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 16px", "borderRadius": "18px", "background": "#FFFFFF", "fontSize": "13px" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#E8701F"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                      <circle cx={"12"} cy={"12"} r={"9"}></circle>
                      <path d={"M12 11v5M12 8h.01"}></path>
                    </svg>
                    <span>
                      {lookup(v, "wfInfo")}
                    </span>
                  </div>
                </div>
                <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Margen bruto"}
                  </span>
                  <span style={{ "display": "flex", "alignItems": "baseline", "gap": "10px" }}>
                    <span style={{ "fontSize": "64px", "fontWeight": "800", "letterSpacing": "-0.03em", "lineHeight": "1" }}>
                      {lookup(v, "marginPct")}
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "padding": "4px 10px", "borderRadius": "999px", "background": "#2A2A2A", "fontSize": "12px", "fontWeight": "700", "color": "#FFB27D" }}>
                      <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M5 15l7-7 7 7"}></path>
                      </svg>
                      {lookup(v, "marginDelta")}
                    </span>
                  </span>
                  <span style={{ "height": "10px", "borderRadius": "999px", "background": "#2A2A2A", "overflow": "hidden" }}>
                    <span style={{ "display": "block", "width": lookup(v, "marginPct"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                  </span>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    {(lookup(v, "kpis") || []).map((k, index4) => (
                      <Fragment key={index4}>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "padding": "10px 0", "borderBottom": "1px solid #2A2A2A", "gap": "10px" }}>
                          <span style={{ "fontSize": "13px", "color": "#CFCFCF" }}>
                            {lookup(k, "name")}
                          </span>
                          <span style={{ "fontSize": "17px", "fontWeight": "800" }}>
                            {lookup(k, "v")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <span style={{ "marginTop": "auto", "fontSize": "12px", "lineHeight": "1.45", "color": "#BDBDBD" }}>
                    {"Gastos del negocio: [completar alquiler, planilla, envíos y servicios] para que la utilidad sea real."}
                  </span>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "3 1 620px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Ventas por mes"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Últimos 12 meses. En naranja, los meses del periodo elegido."}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "padding": "8px 14px", "borderRadius": "16px", "background": "#FFFFFF", "minWidth": "180px" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(v, "monthInfo.label")}
                      </span>
                      <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                        {lookup(v, "monthInfo.value")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(v, "monthInfo.sub")}
                      </span>
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "18px 18px 12px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(12, minmax(0, 1fr))", "gap": "8px", "height": "200px", "alignItems": "end", "borderBottom": "1px solid #E4E4E0" }}>
                      {(lookup(v, "months") || []).map((m, index5) => (
                        <Fragment key={index5}>
                          <div onMouseEnter={lookup(m, "enter")} onMouseLeave={lookup(m, "leave")} title={lookup(m, "aria")} style={{ "height": "100%", "display": "flex", "flexDirection": "column", "justifyContent": "flex-end", "cursor": "default" }}>
                            <span style={{ "display": "block", "height": lookup(m, "h"), "borderRadius": "8px 8px 3px 3px", "background": lookup(m, "c") }}></span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(12, minmax(0, 1fr))", "gap": "8px" }}>
                      {(lookup(v, "months") || []).map((m, index6) => (
                        <Fragment key={index6}>
                          <span style={{ "textAlign": "center", "fontSize": "11px", "fontWeight": "700", "color": lookup(m, "tickFg") }}>
                            {lookup(m, "tick")}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ "flex": "2 1 400px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Por canal y por vendedor"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Ventas del periodo · "}
                      {lookup(v, "salesTotal")}
                    </span>
                  </span>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "800", "color": "#6B6B6B", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                      {"Canal"}
                    </span>
                    {(lookup(v, "channels") || []).map((c, index7) => (
                      <Fragment key={index7}>
                        <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                          <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                            <span style={{ "fontWeight": "700" }}>
                              {lookup(c, "name")}
                            </span>
                            <span>
                              <strong>
                                {lookup(c, "v")}
                              </strong>
                              <span style={{ "color": "#8C8C8C" }}>
                                {"· "}
                                {lookup(c, "pct")}
                              </span>
                            </span>
                          </span>
                          <span style={{ "height": "10px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                            <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "800", "color": "#6B6B6B", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                      {"Vendedor"}
                    </span>
                    {(lookup(v, "sellers") || []).map((s, index8) => (
                      <Fragment key={index8}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                          <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(s, "bg"), "color": lookup(s, "fg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "12px", "fontWeight": "800", "flex": "none" }}>
                            {lookup(s, "ini")}
                          </span>
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px", "fontSize": "13px" }}>
                              <span style={{ "fontWeight": "700" }}>
                                {lookup(s, "name")}
                              </span>
                              <strong>
                                {lookup(s, "v")}
                              </strong>
                            </span>
                            <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                              <span style={{ "display": "block", "width": lookup(s, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {lookup(s, "sub")}
                            </span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "3 1 620px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Ventas por categoría"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Margen = (venta − costo del lote) ÷ venta"}
                      </span>
                    </span>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "6px" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Ordenar por"}
                      </span>
                      {(lookup(v, "sorts") || []).map((o, index9) => (
                        <Fragment key={index9}>
                          <button onClick={lookup(o, "pick")} aria-pressed={lookup(o, "on")} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(o, "border") ?? ""), "background": lookup(o, "bg"), "color": lookup(o, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(o, "name")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className={"noscroll"} style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "6px 16px", "overflowX": "auto" }}>
                    <table style={{ "width": "100%", "minWidth": "640px", "borderCollapse": "collapse", "fontSize": "13px" }}>
                      <thead>
                        <tr style={{ "textAlign": "left", "color": "#6B6B6B", "fontSize": "11px", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                          <th style={{ "padding": "12px 8px 10px 0", "fontWeight": "700" }}>
                            {"Categoría"}
                          </th>
                          <th style={{ "padding": "12px 8px 10px", "fontWeight": "700", "width": "34%" }}>
                            {"Ventas"}
                          </th>
                          <th style={{ "padding": "12px 8px 10px", "fontWeight": "700", "textAlign": "right" }}>
                            {"Unidades"}
                          </th>
                          <th style={{ "padding": "12px 8px 10px", "fontWeight": "700", "textAlign": "right" }}>
                            {"Costo"}
                          </th>
                          <th style={{ "padding": "12px 0 10px 8px", "fontWeight": "700", "textAlign": "right" }}>
                            {"Margen"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(lookup(v, "cats") || []).map((c, index10) => (
                          <Fragment key={index10}>
                            <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                              <td style={{ "padding": "11px 8px 11px 0", "fontWeight": "700" }}>
                                {lookup(c, "name")}
                              </td>
                              <td style={{ "padding": "11px 8px" }}>
                                <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                                  <span style={{ "flex": "1", "height": "8px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                                    <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                                  </span>
                                  <span style={{ "minWidth": "86px", "textAlign": "right", "fontWeight": "800" }}>
                                    {lookup(c, "v")}
                                  </span>
                                </span>
                              </td>
                              <td style={{ "padding": "11px 8px", "textAlign": "right", "color": "#444444" }}>
                                {lookup(c, "units")}
                              </td>
                              <td style={{ "padding": "11px 8px", "textAlign": "right", "color": "#444444" }}>
                                {lookup(c, "cost")}
                              </td>
                              <td style={{ "padding": "11px 0 11px 8px", "textAlign": "right" }}>
                                <span style={{ "display": "inline-block", "minWidth": "48px", "padding": "3px 8px", "borderRadius": "999px", "background": lookup(c, "mBg"), "fontWeight": "800" }}>
                                  {lookup(c, "margin")}
                                </span>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div style={{ "flex": "2 1 400px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Margen por producto"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Los que más dejan y los que menos"}
                    </span>
                  </span>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "800", "color": "#6B6B6B", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                      {"Mayor margen"}
                    </span>
                    {(lookup(v, "topM") || []).map((p, index11) => (
                      <Fragment key={index11}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "36px", "height": "36px", "borderRadius": "12px", "objectFit": "cover", "flex": "none" }} />
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px", "fontSize": "13px" }}>
                              <span style={{ "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                                {lookup(p, "name")}
                              </span>
                              <strong>
                                {lookup(p, "m")}
                              </strong>
                            </span>
                            <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                              <span style={{ "display": "block", "width": lookup(p, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                            </span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "800", "color": "#6B6B6B", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                      {"Menor margen"}
                    </span>
                    {(lookup(v, "lowM") || []).map((p, index12) => (
                      <Fragment key={index12}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "36px", "height": "36px", "borderRadius": "12px", "objectFit": "cover", "flex": "none" }} />
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px", "fontSize": "13px" }}>
                              <span style={{ "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                                {lookup(p, "name")}
                              </span>
                              <strong>
                                {lookup(p, "m")}
                              </strong>
                            </span>
                            <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                              <span style={{ "display": "block", "width": lookup(p, "w"), "height": "100%", "borderRadius": "999px", "background": "#F5C3A0" }}></span>
                            </span>
                            {Boolean(lookup(p, "warn")) && (
                              <Fragment>
                                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "fontSize": "11px", "fontWeight": "700", "color": "#7A4A00" }}>
                                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#F2A100"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                                    <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                                  </svg>
                                  {"Revisar precio o proveedor"}
                                </span>
                              </Fragment>
                            )}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 380px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Rotación e inmovilizado"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Foto de hoy, no depende del periodo"}
                    </span>
                  </span>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "9px" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "800", "color": "#6B6B6B", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                      {"Días para vender un lote"}
                    </span>
                    {(lookup(v, "rotation") || []).map((r, index13) => (
                      <Fragment key={index13}>
                        <div style={{ "display": "grid", "gridTemplateColumns": "90px minmax(0, 1fr) 54px", "alignItems": "center", "gap": "10px", "fontSize": "12px" }}>
                          <span style={{ "fontWeight": "700" }}>
                            {lookup(r, "name")}
                          </span>
                          <span style={{ "height": "8px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                            <span style={{ "display": "block", "width": lookup(r, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                          </span>
                          <span style={{ "textAlign": "right", "fontWeight": "800" }}>
                            {lookup(r, "d")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "gap": "8px" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "800", "color": "#6B6B6B", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                        {"Lotes con más de 90 días"}
                      </span>
                      <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                        {lookup(v, "stuckTotal")}
                      </span>
                    </span>
                    {(lookup(v, "stuck") || []).map((l, index14) => (
                      <Fragment key={index14}>
                        <DesignLink href={"/inventario"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "8px 0", "borderTop": "1px solid #F1F1EE", "textDecoration": "none" }}>
                          <span style={{ "padding": "3px 8px", "borderRadius": "8px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "11px", "fontWeight": "800", "flex": "none" }}>
                            {lookup(l, "lot")}
                          </span>
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                              {lookup(l, "name")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {lookup(l, "days")}
                              {" días · quedan "}
                              {lookup(l, "units")}
                              {" u"}
                            </span>
                          </span>
                          <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(l, "v")}
                          </span>
                        </DesignLink>
                      </Fragment>
                    ))}
                    <span style={{ "fontSize": "11px", "color": "#6B6B6B", "lineHeight": "1.4" }}>
                      {"Idea: ponlos en oferta o en paquetes para liberar caja."}
                    </span>
                  </div>
                </div>
                <div style={{ "flex": "1 1 380px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Cuentas por cobrar"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Facturas a crédito de empresas · "}
                      {lookup(v, "arTotal")}
                      {" pendiente"}
                    </span>
                  </span>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <span style={{ "display": "flex", "height": "14px", "borderRadius": "999px", "overflow": "hidden", "gap": "2px" }}>
                      {(lookup(v, "aging") || []).map((a, index15) => (
                        <Fragment key={index15}>
                          <span style={{ "display": "block", "width": lookup(a, "w"), "height": "100%", "background": lookup(a, "c") }}></span>
                        </Fragment>
                      ))}
                    </span>
                    {(lookup(v, "aging") || []).map((a, index16) => (
                      <Fragment key={index16}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <span style={{ "width": "32px", "height": "32px", "borderRadius": "10px", "background": lookup(a, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(a, "c")} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(a, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(a, "name")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": lookup(a, "fg"), "fontWeight": "700" }}>
                              {lookup(a, "state")}
                            </span>
                          </span>
                          <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                            {lookup(a, "v")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "800", "color": "#6B6B6B", "textTransform": "uppercase", "letterSpacing": "0.04em", "paddingBottom": "6px" }}>
                      {"Quién debe más"}
                    </span>
                    {(lookup(v, "debtors") || []).map((d, index17) => (
                      <Fragment key={index17}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "8px 0", "borderTop": "1px solid #F1F1EE" }}>
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                            <DesignLink href={"/clientes"} style={{ "fontSize": "13px", "fontWeight": "700", "textDecoration": "none" }}>
                              {lookup(d, "name")}
                            </DesignLink>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {lookup(d, "sub")}
                            </span>
                          </span>
                          <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(d, "v")}
                          </span>
                          <button onClick={lookup(d, "remind")} style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(d, "btnBg"), "color": lookup(d, "btnFg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "11px", "fontWeight": "700" }}>
                            {lookup(d, "btn")}
                          </button>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ "flex": "1 1 380px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Reportes guardados"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Descárgalos para tu contador o para revisar"}
                    </span>
                  </span>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "6px 16px" }}>
                    {(lookup(v, "saved") || []).map((r, index18) => (
                      <Fragment key={index18}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "11px 0", "borderBottom": "1px solid #F1F1EE" }}>
                          <span style={{ "width": "34px", "height": "34px", "borderRadius": "10px", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M6 3h9l4 4v14H6zM14 3v5h5M9 13h7M9 17h5"}></path>
                            </svg>
                          </span>
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(r, "name")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": lookup(r, "subFg") }}>
                              {lookup(r, "sub")}
                            </span>
                          </span>
                          <button onClick={lookup(r, "xls")} aria-label={"Descargar " + String(lookup(r, "name") ?? "") + " en Excel"} style={{ "height": "30px", "padding": "0 10px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "11px", "fontWeight": "700" }}>
                            {"Excel"}
                          </button>
                          <button onClick={lookup(r, "pdf")} aria-label={"Descargar " + String(lookup(r, "name") ?? "") + " en PDF"} style={{ "height": "30px", "padding": "0 10px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "11px", "fontWeight": "700" }}>
                            {"PDF"}
                          </button>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 0 10px" }}>
                      <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                          {"Enviar por correo cada lunes"}
                        </span>
                        <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                          {"Resumen semanal a viaprovisionesperu@gmail.com"}
                        </span>
                      </span>
                      <button role={"switch"} aria-checked={lookup(v, "weeklyOn")} aria-label={"Enviar por correo cada lunes"} onClick={lookup(v, "toggleWeekly")} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(v, "weeklyBg"), "cursor": "pointer", "padding": "3px", "display": "flex", "justifyContent": lookup(v, "weeklyJustify") }}>
                        <span style={{ "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF", "display": "block" }}></span>
                      </button>
                    </div>
                  </div>
                  <div style={{ "display": "flex", "gap": "10px", "padding": "14px 16px", "borderRadius": "20px", "border": "1px dashed #BDBDBD", "fontSize": "12px", "lineHeight": "1.45" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                      <path d={"M4 4h16v16H4zM8 9h8M8 13h8M8 17h4"}></path>
                    </svg>
                    <span>
                      <strong>
                        {"Registro de ventas (SUNAT)."}
                      </strong>
                      {" Se arma con las boletas y facturas emitidas en el periodo. RUC [RUC] · Formato [confirmar con tu contador]."}
                    </span>
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
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Reportes"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
