"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), filter: 'Todas', sel: 'OC-0417', recv: {}, quality: {}, done: {}, added: {}, draft: false };
  }
  renderVals() {
    const st = this.state;
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const money0 = (n) => 'S/ ' + Math.round(n).toLocaleString('es-PE');
    const SC = {
      'Borrador': ['#EFEFEC', '#444444', 'M4 20h4l10-10-4-4L4 16zM13 7l4 4'],
      'Enviada': ['#E3F1FF', '#0B4A8A', 'M3 11l18-8-8 18-2-8z'],
      'En tránsito': ['#EDE7FF', '#4A2E9A', 'M3 7h11v9H3zM14 10h4l3 3v3h-7'],
      'Recepción parcial': ['#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01'],
      'Recibida': ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10']
    };
    const L = (name, qty, rec, cost) => ({ name, qty, rec, cost });
    const ORD = [
      { id: 'OC-0418', prov: '[Proveedor C]', cat: 'Solar', state: 'Borrador', created: '26 oct', eta: 'Por definir', pay: 'Contado', lot: 'L-1104', loc: 'Almacén · B2', lines: [L('Panel solar monocristalino 100 W', 10, 0, 268), L('Controlador de carga 20 A', 10, 0, 74)] },
      { id: 'OC-0417', prov: '[Proveedor B]', cat: 'Solar', state: 'En tránsito', created: '20 oct', eta: '28 oct', pay: 'Crédito 30 días', lot: 'L-1102', loc: 'Almacén · B2', lines: [L('Panel solar monocristalino 100 W', 12, 0, 265), L('Batería de gel 100 Ah', 4, 0, 410), L('Cable solar 4 mm (rollo)', 6, 0, 96)] },
      { id: 'OC-0416', prov: '[Proveedor A]', cat: 'Focos', state: 'Recepción parcial', created: '18 oct', eta: 'Llegó 24 oct', pay: 'Crédito 15 días', lot: 'L-1101', loc: 'Tienda · A3', lines: [L('Foco LED 9 W luz cálida', 300, 200, 4.1), L('Foco LED 12 W luz blanca', 200, 200, 5.3), L('Reflector LED 50 W', 20, 8, 38)] },
      { id: 'OC-0415', prov: '[Proveedor D]', cat: 'Cables', state: 'Enviada', created: '22 oct', eta: '30 oct', pay: 'Crédito 30 días', lot: 'L-1103', loc: 'Almacén · C1', lines: [L('Cable USB-C carga rápida 1 m', 150, 0, 6.2), L('Cable mellizo 2×14 (rollo 100 m)', 8, 0, 128)] },
      { id: 'OC-0414', prov: '[Proveedor E]', cat: 'Camping', state: 'Recibida', created: '08 oct', eta: 'Llegó 14 oct', pay: 'Pagado', lot: 'L-1012', loc: 'Almacén · D1', lines: [L('Lámpara de camping recargable', 40, 40, 28), L('Linterna frontal 300 lm', 60, 60, 12.5)] },
      { id: 'OC-0413', prov: '[Proveedor A]', cat: 'Extensiones', state: 'Recibida', created: '02 oct', eta: 'Llegó 07 oct', pay: 'Pagado', lot: 'L-1005', loc: 'Tienda · A1', lines: [L('Extensión de uso rudo 5 m', 50, 50, 21), L('Regleta 6 tomas con supresor', 40, 40, 17.5)] }
    ];
    const isChecked = (o, i) => !!(st.recv[o.id] && st.recv[o.id][i]);
    const recOf = (o, l, i) => (st.done[o.id] && isChecked(o, i) ? l.qty : l.rec);
    const stateOf = (o) => {
      if (st.done[o.id]) return o.lines.every((l, i) => recOf(o, l, i) >= l.qty) ? 'Recibida' : 'Recepción parcial';
      return o.state;
    };
    const subOf = (o) => o.lines.reduce((a, l) => a + l.qty * l.cost, 0);
    const FN = ['Todas', 'Borrador', 'Enviada', 'En tránsito', 'Recepción parcial', 'Recibida'];
    const shown = ORD.filter((o) => st.filter === 'Todas' || stateOf(o) === st.filter);
    const so = ORD.find((o) => o.id === st.sel) || ORD[1];
    const sState = stateOf(so);
    const sSub = subOf(so);
    const canReceive = so.state === 'En tránsito' || so.state === 'Recepción parcial';
    const pendingUnits = so.lines.reduce((a, l, i) => a + (isChecked(so, i) && l.rec < l.qty ? l.qty - l.rec : 0), 0);
    const qOk = !!st.quality[so.id];
    const openCount = ORD.filter((o) => stateOf(o) !== 'Recibida').length;
    const SUG = [
      ['Panel solar monocristalino 100 W', 'Solar', 4, 10, 12, '[Proveedor B]', 'Stock bajo'],
      ['Foco LED 9 W luz cálida', 'Focos', 38, 60, 300, '[Proveedor A]', 'Stock bajo'],
      ['Gancho multiuso de acero x10', 'Ganchos', 0, 25, 60, '[Proveedor E]', 'Agotado'],
      ['Llavero linterna LED', 'Llaveros', 9, 20, 100, '[Proveedor D]', 'Stock bajo']
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
      newOrder: () => this.setState({ draft: true }),
      draftMsg: st.draft,
      openCount: String(openCount),
      headStats: [
        [String(openCount), 'Órdenes', 'abiertas', '#FFFFFF', '#111111'],
        ['2', 'En tránsito', 'llegan esta semana', '#FFFFFF', '#111111'],
        ['5', 'Proveedores', 'activos', '#FFFFFF', '#111111'],
        ['4', 'Productos', 'por reponer', '#E8701F', '#FFFFFF']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      monthTotal: '18,240',
      byCat: [['Solar', 7420], ['Focos', 4580], ['Cables', 2950], ['Camping', 1870], ['Extensiones', 1420]].map((c) => ({ name: c[0], amount: money0(c[1]), w: Math.round((c[1] / 7420) * 100) + '%' })),
      payTotal: money0(9860),
      payables: [
        ['30', 'OCT', '[Proveedor B]', 'OC-0417 · crédito 30 días', 5640, '#FFF4D6', '#7A4A00'],
        ['02', 'NOV', '[Proveedor A]', 'OC-0416 · crédito 15 días', 2780, '#FFF1E6', '#8A3B0A'],
        ['21', 'NOV', '[Proveedor D]', 'OC-0415 · crédito 30 días', 1440, '#F4F4F2', '#444444']
      ].map((p) => ({ day: p[0], mon: p[1], prov: p[2], note: p[3], amount: money0(p[4]), bg: p[5], fg: p[6] })),
      transitCount: String(ORD.filter((o) => stateOf(o) === 'En tránsito' || stateOf(o) === 'Enviada').length),
      track: [['Creada', 1], ['Enviada', 1], ['En tránsito', 1], ['Recibida', 0]].map((t) => ({ name: t[0], c: t[1] ? '#4A2E9A' : '#E4E4E0', fg: t[1] ? '#111111' : '#9A9A9A' })),
      ringDash: (0.92 * 2 * Math.PI * 46).toFixed(1) + ' ' + (2 * Math.PI * 46).toFixed(1),
      kpis: [['Entregas completas', '97%'], ['Demora promedio', '1.2 días']].map((k) => ({ name: k[0], v: k[1] })),
      filters: FN.map((f) => {
        const on = st.filter === f;
        return { name: f, n: String(f === 'Todas' ? ORD.length : ORD.filter((o) => stateOf(o) === f).length), pressed: on ? 'true' : 'false', bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', border: on ? '#111111' : '#E4E4E0', pick: () => this.setState({ filter: f }) };
      }),
      orders: shown.map((o) => {
        const s = stateOf(o); const c = SC[s];
        const q = o.lines.reduce((a, l) => a + l.qty, 0);
        const r = o.lines.reduce((a, l, i) => a + recOf(o, l, i), 0);
        const on = o.id === so.id;
        return { id: o.id, prov: o.prov, created: o.created, cat: o.cat, eta: o.eta, state: s, sbg: c[0], sfg: c[1], icon: c[2], total: money0(subOf(o) * 1.18), recText: r + ' de ' + q + ' u', pct: Math.round((r / q) * 100) + '%', pressed: on ? 'true' : 'false', bg: on ? '#FFF8F2' : '#FFFFFF', border: on ? '#E8701F' : 'transparent', select: () => this.setState({ sel: o.id }) };
      }),
      noOrders: shown.length === 0,
      sel: {
        id: so.id, prov: so.prov, cat: so.cat, created: so.created, eta: so.eta, pay: so.pay, loc: so.loc,
        state: sState, sbg: SC[sState][0], sfg: SC[sState][1], icon: SC[sState][2],
        subtotal: money(sSub), igv: money(sSub * 0.18), total: money(sSub * 1.18),
        lotText: sState === 'Recibida' ? 'Lote ' + so.lot + ' creado al recibir' : 'Al recibir se crea el lote ' + so.lot
      },
      selLines: so.lines.map((l, i) => {
        const r = recOf(so, l, i);
        return { name: l.name, qty: String(l.qty), rec: String(r), pct: Math.round((r / l.qty) * 100) + '%', barC: r >= l.qty ? '#34C759' : '#E8701F', sub: money(l.qty * l.cost), unit: money(l.cost) };
      }),
      canReceive,
      noReceive: !canReceive,
      recvNote: sState === 'Recibida' ? 'Esta orden ya se recibió completa.' : (sState === 'Borrador' ? 'Esta orden aún es un borrador: envíala al proveedor.' : 'La mercadería aún no llega.'),
      recvLines: so.lines.map((l, i) => {
        const full = l.rec >= l.qty; const on = full || isChecked(so, i);
        return { name: l.name, note: full ? 'Ya recibido · ' + l.qty + ' u' : (l.qty - l.rec) + ' u por recibir de ' + l.qty, checked: on, aria: on ? 'true' : 'false', boxBg: on ? '#FF914C' : 'transparent', boxBorder: on ? '#FF914C' : '#6B6B6B', toggle: () => { if (full) return; const cur = Object.assign({}, st.recv[so.id] || {}); cur[i] = !cur[i]; this.setState({ recv: Object.assign({}, st.recv, { [so.id]: cur }) }); } };
      }),
      recvUnits: String(pendingUnits),
      qualityOk: qOk,
      qualityAria: qOk ? 'true' : 'false',
      qualityBg: qOk ? '#FF914C' : 'transparent',
      qualityBorder: qOk ? '#FF914C' : '#6B6B6B',
      toggleQuality: () => this.setState({ quality: Object.assign({}, st.quality, { [so.id]: !qOk }) }),
      confirmRecv: () => { if (pendingUnits > 0 && !st.done[so.id]) this.setState({ done: Object.assign({}, st.done, { [so.id]: { units: pendingUnits, q: qOk } }) }); },
      recvDone: !!st.done[so.id],
      doneText: st.done[so.id] ? 'Se creó el lote ' + so.lot + ' con ' + st.done[so.id].units + ' unidades en ' + so.loc + ', con estado "' + (st.done[so.id].q ? 'Activo' : 'En revisión') + '".' : '',
      suppliers: [
        ['[Proveedor A]', 'Focos y extensiones', '3 días', 96, '4.8', 2780],
        ['[Proveedor B]', 'Solar', '7 días', 88, '4.5', 5640],
        ['[Proveedor C]', 'Solar', '10 días', 81, '4.1', 0],
        ['[Proveedor D]', 'Cables y llaveros', '5 días', 93, '4.6', 1440],
        ['[Proveedor E]', 'Camping y ganchos', '4 días', 98, '4.9', 0]
      ].map((s, i) => ({ name: s[0], cat: s[1], lead: s[2], ontime: s[3] + '%', rating: s[4], debt: money0(s[5]), ini: s[0].replace(/[\[\]]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), bg: i === 1 ? '#111111' : '#FFF1E6', fg: i === 1 ? '#FFFFFF' : '#8A3B0A' })),
      suggest: SUG.map((g, i) => {
        const on = !!st.added[i]; const out = g[6] === 'Agotado';
        return { name: g[0], cat: g[1], stock: String(g[2]), min: String(g[3]), sugg: String(g[4]), prov: g[5], state: g[6], sbg: out ? '#FDE4E2' : '#FFF4D6', sfg: out ? '#8E1C14' : '#7A4A00', icon: out ? 'M6 6l12 12M18 6L6 18' : 'M12 7v6M12 17h.01', pct: Math.max(3, Math.round((g[2] / g[3]) * 100)) + '%', barC: out ? '#FF5A4E' : '#FFB020', pressed: on ? 'true' : 'false', btn: on ? 'Agregado a OC-0418 ✓' : '+ Agregar a la orden borrador', btnBg: on ? '#111111' : '#FFFFFF', btnFg: on ? '#FFFFFF' : '#111111', btnBorder: on ? '#111111' : '#E4E4E0', add: () => this.setState({ added: Object.assign({}, st.added, { [i]: !on }) }) };
      })
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Compras(props) {
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
                    <clipPath id={"via-clip-com"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-com)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Compras"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Órdenes y proveedores"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "newOrder")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Nueva orden de compra"}
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
                    {"Buscar orden o proveedor"}
                  </span>
                  <input type={"search"} placeholder={"N° de orden o proveedor…"} style={{ "width": "180px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Compras"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "openCount")}
                    {" órdenes abiertas"}
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
              {Boolean(lookup(v, "draftMsg")) && (
                <Fragment>
                  <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 16px", "borderRadius": "18px", "background": "#FFFFFF", "fontSize": "13px", "fontWeight": "600" }}>
                    <span style={{ "width": "28px", "height": "28px", "borderRadius": "50%", "background": "#FFF1E6", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#8A3B0A"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M12 5v14M5 12h14"}></path>
                      </svg>
                    </span>
                    {"Se creó un borrador nuevo (ejemplo). Elige proveedor y productos, o agrega los sugeridos para reponer más abajo."}
                  </div>
                </Fragment>
              )}
            </div>
            <div style={{ "background": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Compras del mes"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                      {"Octubre 2026"}
                    </span>
                  </span>
                  <span style={{ "fontSize": "34px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                    <span style={{ "color": "#FF914C" }}>
                      {"S/"}
                    </span>
                    {" "}
                    {lookup(v, "monthTotal")}
                  </span>
                  {(lookup(v, "byCat") || []).map((c, index2) => (
                    <Fragment key={index2}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "5px" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px" }}>
                          <span style={{ "color": "#CFCFCF" }}>
                            {lookup(c, "name")}
                          </span>
                          <span style={{ "fontWeight": "800" }}>
                            {lookup(c, "amount")}
                          </span>
                        </span>
                        <span style={{ "height": "6px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                          <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "marginTop": "auto", "fontSize": "11px", "color": "#BDBDBD" }}>
                    {"Montos de ejemplo, sin IGV."}
                  </span>
                </div>
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Por pagar a proveedores"}
                  </span>
                  <span style={{ "fontSize": "30px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                    {lookup(v, "payTotal")}
                  </span>
                  {(lookup(v, "payables") || []).map((p, index3) => (
                    <Fragment key={index3}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "borderRadius": "18px", "background": "#FFFFFF" }}>
                        <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "width": "44px", "height": "44px", "borderRadius": "14px", "background": lookup(p, "bg"), "color": lookup(p, "fg"), "flex": "none", "lineHeight": "1" }}>
                          <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                            {lookup(p, "day")}
                          </span>
                          <span style={{ "fontSize": "10px", "fontWeight": "700" }}>
                            {lookup(p, "mon")}
                          </span>
                        </span>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(p, "prov")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(p, "note")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                          {lookup(p, "amount")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"En tránsito"}
                    </span>
                    <span style={{ "height": "30px", "padding": "0 12px", "borderRadius": "999px", "background": "#EDE7FF", "color": "#4A2E9A", "display": "inline-flex", "alignItems": "center", "fontSize": "12px", "fontWeight": "800" }}>
                      {lookup(v, "transitCount")}
                      {" órdenes"}
                    </span>
                  </span>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "22px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Próximo en llegar"}
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                        {"28 oct · OC-0417"}
                      </span>
                      <span style={{ "fontSize": "13px", "color": "#444444" }}>
                        {"Panel solar 100 W · [Proveedor B]"}
                      </span>
                    </span>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "6px" }}>
                      {(lookup(v, "track") || []).map((t, index4) => (
                        <Fragment key={index4}>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                            <span style={{ "height": "6px", "borderRadius": "999px", "background": lookup(t, "c") }}></span>
                            <span style={{ "fontSize": "10px", "fontWeight": "700", "color": lookup(t, "fg") }}>
                              {lookup(t, "name")}
                            </span>
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "12px", "fontWeight": "600", "color": "#4A2E9A" }}>
                      <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4"}></path>
                      </svg>
                      {"Al llegar crea el lote L-1102"}
                    </span>
                  </div>
                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                    {"Agencia: [Transportes] · guía [N° GUÍA]"}
                  </span>
                </div>
                <div style={{ "flex": "1 1 260px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px", "alignItems": "stretch" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Cumplimiento de proveedores"}
                  </span>
                  <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "position": "relative", "padding": "4px 0" }}>
                    <svg width={"150"} height={"150"} viewBox={"0 0 120 120"} role={"img"} aria-label={"92% de entregas a tiempo"}>
                      <circle cx={"60"} cy={"60"} r={"46"} fill={"none"} stroke={"#E4E4E0"} strokeWidth={"12"}></circle>
                      <circle cx={"60"} cy={"60"} r={"46"} fill={"none"} stroke={"#E8701F"} strokeWidth={"12"} strokeLinecap={"round"} strokeDasharray={lookup(v, "ringDash")} transform={"rotate(-90 60 60)"}></circle>
                    </svg>
                    <span style={{ "position": "absolute", "display": "flex", "flexDirection": "column", "alignItems": "center" }}>
                      <span style={{ "fontSize": "30px", "fontWeight": "800" }}>
                        {"92%"}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"a tiempo"}
                      </span>
                    </span>
                  </div>
                  {(lookup(v, "kpis") || []).map((k, index5) => (
                    <Fragment key={index5}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "padding": "10px 14px", "borderRadius": "16px", "background": "#FFFFFF", "fontSize": "13px" }}>
                        <span style={{ "color": "#444444" }}>
                          {lookup(k, "name")}
                        </span>
                        <span style={{ "fontWeight": "800" }}>
                          {lookup(k, "v")}
                        </span>
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "3 1 640px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Órdenes de compra"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Toca una orden para ver su detalle y recibir la mercadería."}
                      </span>
                    </span>
                    <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "filters") || []).map((f, index6) => (
                        <Fragment key={index6}>
                          <button onClick={lookup(f, "pick")} aria-pressed={lookup(f, "pressed")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid " + String(lookup(f, "border") ?? ""), "background": lookup(f, "bg"), "color": lookup(f, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(f, "name")}
                            {" · "}
                            {lookup(f, "n")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                    <div style={{ "minWidth": "760px", "background": "#FFFFFF", "borderRadius": "24px", "padding": "6px 10px" }}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "44px 1.5fr 1fr 0.9fr 1.2fr 0.9fr 1fr", "gap": "12px", "alignItems": "center", "padding": "10px 8px", "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C", "textTransform": "uppercase", "letterSpacing": "0.04em", "borderBottom": "1px solid #F1F1EE" }}>
                        <span></span>
                        <span>
                          {"Orden · proveedor"}
                        </span>
                        <span>
                          {"Categoría"}
                        </span>
                        <span>
                          {"Llegada"}
                        </span>
                        <span>
                          {"Recibido"}
                        </span>
                        <span style={{ "textAlign": "right" }}>
                          {"Total"}
                        </span>
                        <span>
                          {"Estado"}
                        </span>
                      </div>
                      {(lookup(v, "orders") || []).map((o, index7) => (
                        <Fragment key={index7}>
                          <button onClick={lookup(o, "select")} aria-pressed={lookup(o, "pressed")} style={{ "width": "100%", "display": "grid", "gridTemplateColumns": "44px 1.5fr 1fr 0.9fr 1.2fr 0.9fr 1fr", "gap": "12px", "alignItems": "center", "padding": "12px 8px", "margin": "4px 0", "border": "1px solid " + String(lookup(o, "border") ?? ""), "borderRadius": "18px", "background": lookup(o, "bg"), "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111" }}>
                            <span style={{ "width": "40px", "height": "40px", "borderRadius": "14px", "background": lookup(o, "sbg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(o, "sfg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(o, "icon")}></path>
                              </svg>
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                                {lookup(o, "id")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(o, "prov")}
                                {" · creada "}
                                {lookup(o, "created")}
                              </span>
                            </span>
                            <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                              {lookup(o, "cat")}
                            </span>
                            <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                              {lookup(o, "eta")}
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "gap": "5px" }}>
                              <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                                {lookup(o, "recText")}
                              </span>
                              <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                                <span style={{ "display": "block", "width": lookup(o, "pct"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                              </span>
                            </span>
                            <span style={{ "fontSize": "14px", "fontWeight": "800", "textAlign": "right" }}>
                              {lookup(o, "total")}
                            </span>
                            <span style={{ "justifySelf": "start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "5px 10px", "borderRadius": "999px", "background": lookup(o, "sbg"), "color": lookup(o, "sfg"), "fontSize": "11px", "fontWeight": "800" }}>
                              <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(o, "icon")}></path>
                              </svg>
                              {lookup(o, "state")}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                      {Boolean(lookup(v, "noOrders")) && (
                        <Fragment>
                          <div style={{ "padding": "24px", "textAlign": "center", "fontSize": "13px", "color": "#8C8C8C" }}>
                            {"No hay órdenes en este estado."}
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ "flex": "2 1 420px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Orden seleccionada · "}
                        {lookup(v, "sel.cat")}
                      </span>
                      <span style={{ "fontSize": "26px", "fontWeight": "800" }}>
                        {lookup(v, "sel.id")}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "600" }}>
                        {lookup(v, "sel.prov")}
                      </span>
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "36px", "padding": "0 14px", "borderRadius": "999px", "background": lookup(v, "sel.sbg"), "color": lookup(v, "sel.sfg"), "fontSize": "12px", "fontWeight": "800" }}>
                      <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(v, "sel.icon")}></path>
                      </svg>
                      {lookup(v, "sel.state")}
                    </span>
                  </div>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "8px" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px 12px", "borderRadius": "16px", "background": "#FFFFFF" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"Creada"}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                        {lookup(v, "sel.created")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px 12px", "borderRadius": "16px", "background": "#FFFFFF" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"Llegada estimada"}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                        {lookup(v, "sel.eta")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px 12px", "borderRadius": "16px", "background": "#FFFFFF" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"Pago"}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                        {lookup(v, "sel.pay")}
                      </span>
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "6px 16px" }}>
                    {(lookup(v, "selLines") || []).map((l, index8) => (
                      <Fragment key={index8}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 0", "borderBottom": "1px solid #F1F1EE", "flexWrap": "wrap" }}>
                          <span style={{ "flex": "1 1 180px", "display": "flex", "flexDirection": "column", "gap": "6px", "minWidth": "0" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(l, "name")}
                            </span>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                              <span style={{ "flex": "1", "height": "6px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                                <span style={{ "display": "block", "width": lookup(l, "pct"), "height": "100%", "borderRadius": "999px", "background": lookup(l, "barC") }}></span>
                              </span>
                              <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#6B6B6B", "whiteSpace": "nowrap" }}>
                                {lookup(l, "rec")}
                                {" de "}
                                {lookup(l, "qty")}
                                {" recibidos"}
                              </span>
                            </span>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "minWidth": "90px" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                              {lookup(l, "sub")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(l, "unit")}
                              {" c/u"}
                            </span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "padding": "12px 0 10px", "fontSize": "13px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "color": "#444444" }}>
                        <span>
                          {"Subtotal"}
                        </span>
                        <span>
                          {lookup(v, "sel.subtotal")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "color": "#444444" }}>
                        <span>
                          {"IGV 18%"}
                        </span>
                        <span>
                          {lookup(v, "sel.igv")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "16px", "fontWeight": "800" }}>
                        <span>
                          {"Total"}
                        </span>
                        <span>
                          {lookup(v, "sel.total")}
                        </span>
                      </span>
                    </div>
                  </div>
                  <DesignLink href={"/inventario"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 16px", "borderRadius": "20px", "background": "#FFF1E6", "color": "#8A3B0A", "textDecoration": "none" }}>
                    <span style={{ "width": "36px", "height": "36px", "borderRadius": "12px", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#8A3B0A"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"}></path>
                      </svg>
                    </span>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                        {lookup(v, "sel.lotText")}
                      </span>
                      <span style={{ "fontSize": "12px" }}>
                        {"Ubicación: "}
                        {lookup(v, "sel.loc")}
                        {" · ver en Inventario y lotes"}
                      </span>
                    </span>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} aria-hidden={"true"}>
                      <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                    </svg>
                  </DesignLink>
                  <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                    <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "42px", "padding": "0 18px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#25A244"} strokeWidth={"2"} aria-hidden={"true"}>
                        <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                      </svg>
                      {"Enviar al proveedor"}
                    </DesignLink>
                    <button style={{ "height": "42px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Descargar PDF"}
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 340px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Recibir mercadería"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                      {lookup(v, "sel.id")}
                      {" · marca lo que llegó completo"}
                    </span>
                  </span>
                  {Boolean(lookup(v, "canReceive")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        {(lookup(v, "recvLines") || []).map((r, index9) => (
                          <Fragment key={index9}>
                            <button onClick={lookup(r, "toggle")} role={"checkbox"} aria-checked={lookup(r, "aria")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "18px", "border": "1px solid #2A2A2A", "background": "#1C1C1C", "color": "#FFFFFF", "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif" }}>
                              <span style={{ "width": "24px", "height": "24px", "borderRadius": "8px", "border": "2px solid " + String(lookup(r, "boxBorder") ?? ""), "background": lookup(r, "boxBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none", "boxSizing": "border-box" }}>
                                {Boolean(lookup(r, "checked")) && (
                                  <Fragment>
                                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                      <path d={"M5 12l5 5 9-10"}></path>
                                    </svg>
                                  </Fragment>
                                )}
                              </span>
                              <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                                <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                                  {lookup(r, "name")}
                                </span>
                                <span style={{ "fontSize": "11px", "color": "#BDBDBD" }}>
                                  {lookup(r, "note")}
                                </span>
                              </span>
                            </button>
                          </Fragment>
                        ))}
                        <button onClick={lookup(v, "toggleQuality")} role={"checkbox"} aria-checked={lookup(v, "qualityAria")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "18px", "border": "1px dashed #4A4A4A", "background": "transparent", "color": "#FFFFFF", "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif" }}>
                          <span style={{ "width": "24px", "height": "24px", "borderRadius": "8px", "border": "2px solid " + String(lookup(v, "qualityBorder") ?? ""), "background": lookup(v, "qualityBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none", "boxSizing": "border-box" }}>
                            {Boolean(lookup(v, "qualityOk")) && (
                              <Fragment>
                                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={"M5 12l5 5 9-10"}></path>
                                </svg>
                              </Fragment>
                            )}
                          </span>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {"Revisión de calidad aprobada"}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#BDBDBD" }}>
                              {"Muestra probada, empaques sin daño, garantía vigente"}
                            </span>
                          </span>
                        </button>
                        <button onClick={lookup(v, "confirmRecv")} style={{ "height": "46px", "borderRadius": "999px", "border": "none", "background": "#FF914C", "color": "#111111", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "800" }}>
                          {"Confirmar recepción · "}
                          {lookup(v, "recvUnits")}
                          {" unidades"}
                        </button>
                        {Boolean(lookup(v, "recvDone")) && (
                          <Fragment>
                            <div role={"status"} style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "12px 14px", "borderRadius": "16px", "background": "#1F2A20", "color": "#CFEFD3", "fontSize": "12px", "lineHeight": "1.45" }}>
                              <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "13px", "fontWeight": "800", "color": "#FFFFFF" }}>
                                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#34C759"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={"M5 12l5 5 9-10"}></path>
                                </svg>
                                {"Recepción registrada"}
                              </span>
                              <span>
                                {lookup(v, "doneText")}
                              </span>
                              <DesignLink href={"/inventario"} style={{ "color": "#FFB27A", "fontWeight": "700" }}>
                                {"Ver el lote en inventario →"}
                              </DesignLink>
                            </div>
                          </Fragment>
                        )}
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "noReceive")) && (
                    <Fragment>
                      <div style={{ "flex": "1", "display": "flex", "flexDirection": "column", "alignItems": "flex-start", "justifyContent": "center", "gap": "10px", "padding": "18px", "borderRadius": "20px", "border": "1px dashed #4A4A4A" }}>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FF914C"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M3 7h11v9H3zM14 10h4l3 3v3h-7"}></path>
                        </svg>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(v, "recvNote")}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                          {"La recepción se habilita cuando la orden está en tránsito o recibida a medias."}
                        </span>
                      </div>
                    </Fragment>
                  )}
                </div>
                <div style={{ "flex": "1.4 1 420px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Proveedores"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"5 activos · datos de ejemplo"}
                    </span>
                  </span>
                  {(lookup(v, "suppliers") || []).map((s, index10) => (
                    <Fragment key={index10}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "20px", "background": "#FFFFFF", "flexWrap": "wrap" }}>
                        <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(s, "bg"), "color": lookup(s, "fg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "13px", "fontWeight": "800", "flex": "none" }}>
                          {lookup(s, "ini")}
                        </span>
                        <span style={{ "flex": "1 1 140px", "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(s, "name")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(s, "cat")}
                            {" · entrega en "}
                            {lookup(s, "lead")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "width": "110px" }}>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {"A tiempo "}
                            {lookup(s, "ontime")}
                          </span>
                          <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                            <span style={{ "display": "block", "width": lookup(s, "ontime"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                          </span>
                        </span>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "width": "50px", "fontSize": "13px", "fontWeight": "800" }}>
                          <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"#E8701F"} aria-hidden={"true"}>
                            <path d={"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"}></path>
                          </svg>
                          {lookup(s, "rating")}
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "minWidth": "84px" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(s, "debt")}
                          </span>
                          <span style={{ "fontSize": "10px", "color": "#6B6B6B" }}>
                            {"por pagar"}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1.2 1 360px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Sugerido para reponer"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Productos bajo su stock mínimo en Inventario"}
                    </span>
                  </span>
                  {(lookup(v, "suggest") || []).map((g, index11) => (
                    <Fragment key={index11}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "padding": "12px 14px", "borderRadius": "20px", "background": "#FFFFFF" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "10px" }}>
                          <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                              {lookup(g, "name")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(g, "cat")}
                              {" · sugerido "}
                              {lookup(g, "sugg")}
                              {" u · "}
                              {lookup(g, "prov")}
                            </span>
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "padding": "4px 9px", "borderRadius": "999px", "background": lookup(g, "sbg"), "color": lookup(g, "sfg"), "fontSize": "10px", "fontWeight": "800", "whiteSpace": "nowrap" }}>
                            <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                              <path d={lookup(g, "icon")}></path>
                            </svg>
                            {lookup(g, "state")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <span style={{ "flex": "1", "height": "6px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                            <span style={{ "display": "block", "width": lookup(g, "pct"), "height": "100%", "borderRadius": "999px", "background": lookup(g, "barC") }}></span>
                          </span>
                          <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#6B6B6B", "whiteSpace": "nowrap" }}>
                            {lookup(g, "stock")}
                            {" / mín "}
                            {lookup(g, "min")}
                          </span>
                        </span>
                        <button onClick={lookup(g, "add")} aria-pressed={lookup(g, "pressed")} style={{ "height": "34px", "borderRadius": "999px", "border": "1px solid " + String(lookup(g, "btnBorder") ?? ""), "background": lookup(g, "btnBg"), "color": lookup(g, "btnFg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(g, "btn")}
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Compras"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
