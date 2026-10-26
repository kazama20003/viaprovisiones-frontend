"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = {
      menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(),
      cat: 'Todas', paid: {}, added: [], cash: true, saved: '', err: '',
      f: { concept: '', cat: 'Otros', amount: '', date: '2026-10-26', method: 'Efectivo', comp: 'bol' }
    };
  }
  renderVals() {
    const st = this.state;
    const accent = this.props.accent ?? '#FF914C';
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // [categoría, tipo, monto del mes] — datos de ejemplo
    const CAT = [['Alquiler', 'Fijo', 2800], ['Sueldos', 'Fijo', 2400], ['Movilidad y envíos', 'Variable', 912.4], ['Publicidad', 'Variable', 650], ['Luz y agua', 'Fijo', 386.5], ['Otros', 'Variable', 375], ['Comisiones de pago', 'Variable', 318.4]];
    const COMP = {
      fac: ['Con factura', '#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      bol: ['Con boleta', '#E3F1FF', '#0B4A8A', 'M7 3h10v18l-2.5-1.5L12 21l-2.5-1.5L7 21zM10 8h4M10 12h4'],
      sin: ['Sin comprobante', '#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01']
    };
    const BASE = [
      ['24 oct', 'Envío por agencia a Puno', 'Movilidad y envíos', 'Efectivo', 'bol', 62],
      ['22 oct', 'Volantes impresos para tienda', 'Publicidad', 'Efectivo', 'sin', 200],
      ['20 oct', 'Bolsas y cinta de embalaje', 'Otros', 'Efectivo', 'bol', 125],
      ['18 oct', 'Comisiones Yape y tarjeta (1.ª quincena)', 'Comisiones de pago', 'Débito automático', 'fac', 158.2],
      ['15 oct', 'Sueldos 1.ª quincena · [Vendedor] y [Almacén]', 'Sueldos', 'Transferencia', 'bol', 1200],
      ['14 oct', 'Anuncios en Facebook e Instagram', 'Publicidad', 'Tarjeta', 'fac', 450],
      ['12 oct', 'Envío por agencia a Cusco', 'Movilidad y envíos', 'Efectivo', 'bol', 85.4],
      ['10 oct', 'Motorizado · rutas 1 y 2', 'Movilidad y envíos', 'Efectivo', 'sin', 240],
      ['06 oct', 'Agua · SEDAPAR', 'Luz y agua', 'Yape', 'fac', 88.2],
      ['05 oct', 'Luz · SEAL', 'Luz y agua', 'Yape', 'fac', 298.3],
      ['01 oct', 'Alquiler del local · Dean Valdivia 533', 'Alquiler', 'Transferencia', 'fac', 2800]
    ];
    const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'set', 'oct', 'nov', 'dic'];
    const fmtDate = (iso) => { const p = String(iso || '').split('-'); return p.length === 3 ? (p[2] + ' ' + MON[Math.max(0, Math.min(11, Number(p[1]) - 1))]) : 'Hoy'; };
    const addedAmt = st.added.reduce((a, x) => a + x[5], 0);
    const catTotals = CAT.map((c) => c[2] + st.added.filter((x) => x[2] === c[0]).reduce((a, x) => a + x[5], 0));
    const spent = 7842.3 + addedAmt;
    const budget = 9500;
    const fixed = CAT.reduce((a, c, i) => a + (c[1] === 'Fijo' ? catTotals[i] : 0), 0);
    const maxCat = Math.max.apply(null, catTotals);
    const all = st.added.concat(BASE);
    const list = st.cat === 'Todas' ? all : all.filter((x) => x[2] === st.cat);
    const noRec = all.filter((x) => x[4] === 'sin');
    const DUE = [
      ['d1', '31', 'oct', 'Sueldos 2.ª quincena', 'Transferencia · [Vendedor] y [Almacén]', 1200],
      ['d2', '01', 'nov', 'Alquiler del local', 'Transferencia · [ARRENDADOR]', 2800],
      ['d3', '05', 'nov', 'Luz · SEAL', 'Yape · monto estimado', 300],
      ['d4', '08', 'nov', 'Internet y teléfono', 'Débito automático · [MONTO]', 0],
      ['d5', '14', 'nov', 'Anuncios en redes', 'Tarjeta', 450]
    ];
    const pending = DUE.filter((d) => !st.paid[d[0]]);
    const setF = (k) => (e) => this.setState({ f: Object.assign({}, st.f, { [k]: (e && e.target && e.target.value) || '' }), saved: '', err: '' });
    const vsPct = (spent / 18450) * 100;
    return {
      accent,
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      spentText: money(spent),
      budgetText: money(budget),
      leftText: money(Math.max(0, budget - spent)),
      budgetPct: Math.min(100, Math.round((spent / budget) * 100)) + '%',
      dailyText: money(spent / 26),
      headStats: [
        [money(Math.max(0, budget - spent)).replace('.00', ''), 'Presupuesto', 'disponible', '#FFFFFF', '#111111'],
        [String(pending.length), 'Pagos', 'por vencer', '#FFF1E6', '#8A3B0A'],
        [String(noRec.length), 'Sin', 'comprobante', '#FFF4D6', '#7A4A00'],
        [String(all.length), 'Gastos', 'registrados', '#111111', '#FFFFFF']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      cats: CAT.map((c, i) => ({
        name: c[0], kind: c[1] === 'Fijo' ? 'Gasto fijo' : 'Gasto variable', amount: money(catTotals[i]),
        w: Math.max(3, Math.round((catTotals[i] / maxCat) * 100)) + '%',
        rowBg: st.cat === c[0] ? '#FFF1E6' : 'transparent', pressed: st.cat === c[0] ? 'true' : 'false',
        pick: () => this.setState({ cat: st.cat === c[0] ? 'Todas' : c[0] })
      })),
      fixedPct: Math.round((fixed / spent) * 100) + '%',
      varPct: (100 - Math.round((fixed / spent) * 100)) + '%',
      fixedText: money(fixed),
      varText: money(spent - fixed),
      vsSales: vsPct.toFixed(1) + '%',
      vsSalesShort: 'S/ ' + vsPct.toFixed(0),
      chips: ['Todas'].concat(CAT.map((c) => c[0])).map((n) => ({ name: n, pressed: st.cat === n ? 'true' : 'false', bg: st.cat === n ? '#111111' : '#F4F4F2', fg: st.cat === n ? '#FFFFFF' : '#111111', pick: () => this.setState({ cat: n }) })),
      listCount: list.length + (list.length === 1 ? ' gasto' : ' gastos') + (st.cat === 'Todas' ? ' · todas las categorías' : ' · ' + st.cat) + ' · ' + money(list.reduce((a, x) => a + x[5], 0)),
      rows: list.map((x) => ({
        date: x[0], concept: x[1], cat: x[2], method: x[3], amount: money(x[5]),
        comp: COMP[x[4]][0], cBg: COMP[x[4]][1], cFg: COMP[x[4]][2], cIcon: COMP[x[4]][3],
        note: x[6] ? 'Recién registrado' + (x[7] ? ' · salió de caja' : '') : '', newFg: '#C2410C'
      })),
      empty: list.length === 0,
      noReceiptNote: noRec.length + (noRec.length === 1 ? ' gasto no tiene' : ' gastos no tienen') + ' comprobante. Sin factura no se pueden usar para el crédito fiscal del IGV; pide factura cuando puedas.',
      dueSummary: pending.length ? pending.length + ' pendientes · ' + money(pending.reduce((a, d) => a + d[5], 0)) : 'Todo al día',
      due: DUE.map((d) => {
        const p = !!st.paid[d[0]];
        return {
          day: d[1], mon: d[2], name: d[3], sub: d[4], amount: d[5] ? money(d[5]) : '[MONTO]',
          o: p ? '0.6' : '1', dateBg: p ? '#E4F4E7' : (d[2] === 'oct' ? '#E8701F' : '#FFFFFF'), dateFg: p ? '#1B5E20' : (d[2] === 'oct' ? '#FFFFFF' : '#111111'),
          pressed: p ? 'true' : 'false', btnBg: p ? '#E4F4E7' : '#111111', btnFg: p ? '#1B5E20' : '#FFFFFF',
          btnIcon: p ? 'M5 12l5 5 9-10' : 'M12 5v14M5 12h14', btnText: p ? 'Pagado' : 'Marcar pagado',
          toggle: () => this.setState({ paid: Object.assign({}, st.paid, { [d[0]]: !p }) })
        };
      }),
      fv: st.f,
      fConcept: setF('concept'), fCat: setF('cat'), fAmount: setF('amount'), fDate: setF('date'), fMethod: setF('method'), fComp: setF('comp'),
      catOptions: CAT.map((c) => ({ v: c[0] })),
      methodOptions: ['Efectivo', 'Yape', 'Plin', 'Transferencia', 'Tarjeta'].map((v) => ({ v })),
      cashChecked: st.cash ? 'true' : 'false', cashBg: st.cash ? '#E8701F' : '#CFCFCB', cashJustify: st.cash ? 'flex-end' : 'flex-start',
      toggleCash: () => this.setState({ cash: !st.cash }),
      savedMsg: st.saved,
      errMsg: st.err,
      save: () => {
        const amt = parseFloat(st.f.amount);
        if (!st.f.concept.trim() || !(amt > 0)) { this.setState({ err: 'Escribe el concepto y un monto mayor a 0.', saved: '' }); return; }
        const row = [fmtDate(st.f.date), st.f.concept.trim(), st.f.cat, st.f.method, st.f.comp, amt, true, st.cash];
        this.setState({
          added: [row].concat(st.added), cat: 'Todas', err: '',
          saved: 'Gasto guardado: ' + row[1] + ' · ' + money(amt) + (st.cash ? ' (se descontó de la caja)' : ''),
          f: { concept: '', cat: st.f.cat, amount: '', date: st.f.date, method: st.f.method, comp: st.f.comp }
        });
      }
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Gastos(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.gx-row:hover{background:#FAFAF8}\n.gx-in{height: 46px; border: 1px solid #E4E4E0; border-radius: 14px; padding: 0 14px; font-family: inherit; font-size: 14px; background: #FFFFFF; color: #111111; box-sizing: border-box; width: 100%}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Gastos"} onPin={lookup(v, "togglePin")} />
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
                    <clipPath id={"via-clip-gas"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-gas)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </a>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Gastos"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Finanzas · octubre 2026"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <a href={"#registrar-gasto"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Registrar gasto"}
                </a>
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
                    {"Buscar gasto"}
                  </span>
                  <input type={"search"} placeholder={"Concepto o proveedor…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Gastos"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "spentText")}
                    {" en octubre"}
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
            </div>
            <div style={{ "padding": "0 20px 16px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "stretch" }}>
              <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Gastos del mes"}
                  </span>
                  <span style={{ "height": "30px", "padding": "0 12px", "borderRadius": "999px", "background": "#2A2A2A", "fontSize": "12px", "fontWeight": "600", "display": "flex", "alignItems": "center" }}>
                    {"Octubre · ejemplo"}
                  </span>
                </span>
                <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                  <span style={{ "fontSize": "44px", "fontWeight": "700", "letterSpacing": "-0.02em", "lineHeight": "1" }}>
                    {lookup(v, "spentText")}
                  </span>
                  <span style={{ "fontSize": "13px", "color": "#BDBDBD" }}>
                    {"de "}
                    {lookup(v, "budgetText")}
                    {" de presupuesto"}
                  </span>
                </span>
                <span style={{ "height": "14px", "borderRadius": "999px", "background": "#2A2A2A", "overflow": "hidden" }}>
                  <span style={{ "display": "block", "width": lookup(v, "budgetPct"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                </span>
                <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                  <span style={{ "color": "#CFCFCF" }}>
                    {"Usado "}
                    {lookup(v, "budgetPct")}
                  </span>
                  <span style={{ "fontWeight": "700" }}>
                    {"Quedan "}
                    {lookup(v, "leftText")}
                  </span>
                </span>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px", "marginTop": "auto" }}>
                  <span style={{ "padding": "12px", "borderRadius": "18px", "background": "#1E1E1E", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                      {"Promedio por día"}
                    </span>
                    <span style={{ "fontSize": "17px", "fontWeight": "800" }}>
                      {lookup(v, "dailyText")}
                    </span>
                  </span>
                  <span style={{ "padding": "12px", "borderRadius": "18px", "background": "#1E1E1E", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                      {"Septiembre"}
                    </span>
                    <span style={{ "fontSize": "17px", "fontWeight": "800" }}>
                      {"S/ 7,410.90"}
                    </span>
                  </span>
                </div>
              </div>
              <div style={{ "flex": "2 1 460px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "gap": "10px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Gastos por categoría"}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                    {"Toca una para filtrar la lista"}
                  </span>
                </span>
                {(lookup(v, "cats") || []).map((c, index2) => (
                  <Fragment key={index2}>
                    <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "display": "grid", "gridTemplateColumns": "170px minmax(0, 1fr) 100px", "alignItems": "center", "gap": "12px", "padding": "6px 8px", "borderRadius": "14px", "border": "none", "background": lookup(c, "rowBg"), "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left", "color": "#111111" }}>
                      <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                          {lookup(c, "name")}
                        </span>
                        <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                          {lookup(c, "kind")}
                        </span>
                      </span>
                      <span style={{ "height": "12px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                        <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                      </span>
                      <span style={{ "fontSize": "13px", "fontWeight": "800", "textAlign": "right" }}>
                        {lookup(c, "amount")}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ "flex": "1 1 280px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Fijos y variables"}
                  </span>
                  <span style={{ "display": "flex", "height": "14px", "borderRadius": "999px", "overflow": "hidden", "gap": "3px" }}>
                    <span style={{ "width": lookup(v, "fixedPct"), "background": "#111111" }}></span>
                    <span style={{ "flex": "1", "background": "#E8701F" }}></span>
                  </span>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "12px", "fontSize": "13px" }}>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontWeight": "700" }}>
                        {"Fijos · "}
                        {lookup(v, "fixedPct")}
                      </span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {lookup(v, "fixedText")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "textAlign": "right" }}>
                      <span style={{ "fontWeight": "700", "color": "#C2410C" }}>
                        {"Variables · "}
                        {lookup(v, "varPct")}
                      </span>
                      <span style={{ "color": "#6B6B6B" }}>
                        {lookup(v, "varText")}
                      </span>
                    </span>
                  </span>
                  <span style={{ "fontSize": "12px", "lineHeight": "1.5", "color": "#6B6B6B" }}>
                    {"Fijos: alquiler, sueldos, luz y agua. Variables: envíos, publicidad, comisiones y otros."}
                  </span>
                </div>
                <div style={{ "borderRadius": "30px", "background": "#F4F4F2", "border": "1px solid #E4E4E0", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Gastos vs ventas"}
                  </span>
                  <span style={{ "fontSize": "32px", "fontWeight": "700", "letterSpacing": "-0.02em", "lineHeight": "1" }}>
                    {lookup(v, "vsSales")}
                  </span>
                  <span style={{ "fontSize": "13px", "lineHeight": "1.5", "color": "#444444" }}>
                    {"De cada S/ 100 vendidos en octubre (S/ 18,450, ejemplo), "}
                    {lookup(v, "vsSalesShort")}
                    {" se fueron en gastos del negocio."}
                  </span>
                  <a href={"/reportes"} style={{ "alignSelf": "flex-start", "height": "38px", "padding": "0 16px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "display": "inline-flex", "alignItems": "center", "gap": "8px", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                    {"Ver margen en reportes "}
                    <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                      <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 640px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Gastos de octubre"}
                    </span>
                    <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                      {lookup(v, "listCount")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "gap": "8px" }}>
                    <button style={{ "height": "40px", "padding": "0 16px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Descargar Excel"}
                    </button>
                  </span>
                </div>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                  {(lookup(v, "chips") || []).map((c, index3) => (
                    <Fragment key={index3}>
                      <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "flex": "none", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                        {lookup(c, "name")}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "overflowX": "auto" }} className={"noscroll"}>
                  <div style={{ "minWidth": "760px", "display": "flex", "flexDirection": "column" }}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "70px minmax(0, 2.2fr) minmax(0, 1.2fr) minmax(0, 1.1fr) 150px 110px", "gap": "12px", "padding": "0 12px 10px", "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C", "borderBottom": "1px solid #EFEFEC" }}>
                      <span>
                        {"Fecha"}
                      </span>
                      <span>
                        {"Concepto"}
                      </span>
                      <span>
                        {"Categoría"}
                      </span>
                      <span>
                        {"Pago"}
                      </span>
                      <span>
                        {"Comprobante"}
                      </span>
                      <span style={{ "textAlign": "right" }}>
                        {"Monto"}
                      </span>
                    </div>
                    {(lookup(v, "rows") || []).map((r, index4) => (
                      <Fragment key={index4}>
                        <div className={"gx-row"} style={{ "display": "grid", "gridTemplateColumns": "70px minmax(0, 2.2fr) minmax(0, 1.2fr) minmax(0, 1.1fr) 150px 110px", "gap": "12px", "alignItems": "center", "minHeight": "58px", "padding": "0 12px", "borderBottom": "1px solid #F4F4F2", "fontSize": "13px" }}>
                          <span style={{ "fontWeight": "600", "color": "#6B6B6B" }}>
                            {lookup(r, "date")}
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                            <span style={{ "fontWeight": "700" }}>
                              {lookup(r, "concept")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": lookup(r, "newFg") }}>
                              {lookup(r, "note")}
                            </span>
                          </span>
                          <span>
                            {lookup(r, "cat")}
                          </span>
                          <span style={{ "color": "#444444" }}>
                            {lookup(r, "method")}
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "justifySelf": "start", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(r, "cBg"), "color": lookup(r, "cFg"), "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(r, "cIcon")}></path>
                            </svg>
                            {lookup(r, "comp")}
                          </span>
                          <span style={{ "fontWeight": "800", "textAlign": "right" }}>
                            {lookup(r, "amount")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {Boolean(lookup(v, "empty")) && (
                      <Fragment>
                        <div style={{ "padding": "28px 12px", "fontSize": "14px", "color": "#6B6B6B" }}>
                          {"No hay gastos de esta categoría en octubre."}
                        </div>
                      </Fragment>
                    )}
                  </div>
                </div>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 14px", "borderRadius": "18px", "background": "#FFF4D6", "color": "#7A4A00", "fontSize": "13px", "fontWeight": "600" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                    <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                  </svg>
                  <span>
                    {lookup(v, "noReceiptNote")}
                  </span>
                </div>
              </div>
              <div style={{ "flex": "1 1 360px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Próximos pagos"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {lookup(v, "dueSummary")}
                    </span>
                  </span>
                  {(lookup(v, "due") || []).map((d, index5) => (
                    <Fragment key={index5}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px", "borderRadius": "18px", "background": "#F4F4F2", "opacity": lookup(d, "o") }}>
                        <span style={{ "width": "48px", "height": "48px", "borderRadius": "16px", "background": lookup(d, "dateBg"), "color": lookup(d, "dateFg"), "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "lineHeight": "1.05", "flex": "none" }}>
                          <span style={{ "fontSize": "17px", "fontWeight": "800" }}>
                            {lookup(d, "day")}
                          </span>
                          <span style={{ "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase" }}>
                            {lookup(d, "mon")}
                          </span>
                        </span>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(d, "name")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                            {lookup(d, "sub")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "4px" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(d, "amount")}
                          </span>
                          <button onClick={lookup(d, "toggle")} aria-pressed={lookup(d, "pressed")} style={{ "height": "28px", "padding": "0 10px", "borderRadius": "999px", "border": "none", "background": lookup(d, "btnBg"), "color": lookup(d, "btnFg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "11px", "fontWeight": "700", "display": "inline-flex", "alignItems": "center", "gap": "5px" }}>
                            <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(d, "btnIcon")}></path>
                            </svg>
                            {lookup(d, "btnText")}
                          </button>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div id={"registrar-gasto"} style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px", "border": "2px solid #E8701F" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Registrar gasto"}
                    </span>
                    <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                      {"Se suma a la lista y al total del mes"}
                    </span>
                  </span>
                  {Boolean(lookup(v, "savedMsg")) && (
                    <Fragment>
                      <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 14px", "borderRadius": "16px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "13px", "fontWeight": "600" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                        {lookup(v, "savedMsg")}
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "errMsg")) && (
                    <Fragment>
                      <div role={"alert"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 14px", "borderRadius": "16px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "13px", "fontWeight": "600" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                        </svg>
                        {lookup(v, "errMsg")}
                      </div>
                    </Fragment>
                  )}
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                    {"Concepto"}
                    <input className={"gx-in"} type={"text"} value={(lookup(v, "fv.concept") ?? "")} onChange={lookup(v, "fConcept")} placeholder={"Ej.: Recibo de luz de noviembre"} />
                  </label>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px" }}>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                      {"Categoría"}
                      <select className={"gx-in"} value={(lookup(v, "fv.cat") ?? "")} onChange={lookup(v, "fCat")}>
                        {(lookup(v, "catOptions") || []).map((o, index6) => (
                          <Fragment key={index6}>
                            <option value={lookup(o, "v")}>
                              {lookup(o, "v")}
                            </option>
                          </Fragment>
                        ))}
                      </select>
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                      {"Monto (S/)"}
                      <input className={"gx-in"} type={"number"} min={"0"} step={"0.10"} value={(lookup(v, "fv.amount") ?? "")} onChange={lookup(v, "fAmount")} placeholder={"0.00"} />
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                      {"Fecha"}
                      <input className={"gx-in"} type={"date"} value={(lookup(v, "fv.date") ?? "")} onChange={lookup(v, "fDate")} />
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                      {"Método de pago"}
                      <select className={"gx-in"} value={(lookup(v, "fv.method") ?? "")} onChange={lookup(v, "fMethod")}>
                        {(lookup(v, "methodOptions") || []).map((o, index7) => (
                          <Fragment key={index7}>
                            <option value={lookup(o, "v")}>
                              {lookup(o, "v")}
                            </option>
                          </Fragment>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                    {"Comprobante"}
                    <select className={"gx-in"} value={(lookup(v, "fv.comp") ?? "")} onChange={lookup(v, "fComp")}>
                      <option value={"fac"}>
                        {"Con factura"}
                      </option>
                      <option value={"bol"}>
                        {"Con boleta"}
                      </option>
                      <option value={"sin"}>
                        {"Sin comprobante"}
                      </option>
                    </select>
                  </label>
                  <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "6px", "padding": "18px", "borderRadius": "18px", "border": "1.5px dashed #CFCFCB", "background": "#FAFAF8", "textAlign": "center" }}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#6B6B6B"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M12 16V4M7 9l5-5 5 5M4 16v4h16v-4"}></path>
                    </svg>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {"Adjuntar foto o PDF del comprobante"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Arrastra aquí o toca para elegir · máx. 10 MB"}
                    </span>
                  </div>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {"Sale de la caja del día"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Se descuenta del efectivo en "}
                        <a href={"/caja"} style={{ "color": "#C2410C", "fontWeight": "700", "textUnderlineOffset": "3px" }}>
                          {"Caja del día"}
                        </a>
                      </span>
                    </span>
                    <button onClick={lookup(v, "toggleCash")} role={"switch"} aria-checked={lookup(v, "cashChecked")} aria-label={"Sale de la caja del día"} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(v, "cashBg"), "cursor": "pointer", "padding": "3px", "display": "flex", "justifyContent": lookup(v, "cashJustify"), "boxSizing": "border-box", "flex": "none" }}>
                      <span style={{ "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                    </button>
                  </div>
                  <button onClick={lookup(v, "save")} style={{ "height": "52px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                    {"Guardar gasto"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Gastos"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
