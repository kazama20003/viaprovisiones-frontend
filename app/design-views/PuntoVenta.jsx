"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), q: '', cat: 'Todos', lines: { P1: 4, P5: 1 }, order: ['P1', 'P5'], disc: {}, client: 'varios', list: 'Público', pay: 'Efectivo', received: 100, doc: 'Boleta', done: null, seq: { Boleta: 422, Factura: 88, 'Nota de venta': 131 }, extra: [] };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // [id, nombre, categoría, precio público, stock vendible, lote que sale primero, imagen, código]
    const PR = [
      ['P1', 'Foco LED 9 W luz cálida', 'Focos', 8.9, 240, 'L-1008', '52dc55c2523393f8f60ab89499fa3ec1', 'FOC-LED9-C'],
      ['P5', 'Cable USB-C carga rápida 1 m', 'Cables', 19.9, 110, 'L-0901', '3aba2390d3fbd5f06fdd2cede507b16f', 'CAB-USBC-1'],
      ['P6', 'Extensión de uso rudo 5 m', 'Extensiones', 45, 9, 'L-0928', '323e29809539c2fb4b229651c8081ee9', 'EXT-RUDO-5'],
      ['P7', 'Mosquetón llavero de aluminio', 'Llaveros', 9.9, 150, 'L-0830', 'eb0c79147accd306bbd7a39d350a8e88', 'LLA-MOSQ-A'],
      ['P9', 'Gancho de pared adhesivo x6', 'Ganchos', 12.9, 36, 'L-0925', '', 'GAN-ADH-6'],
      ['P4', 'Lámpara de camping recargable', 'Camping', 69.9, 5, 'L-0915', 'a58999411e32d7481815ba8cdc175e97', 'CAM-LAMP-R'],
      ['P8', 'Collar dorado de cadena fina', 'Bisutería', 29.9, 0, '', '792438e54fa4b4d81f31171a2cf026f6', 'BIS-COL-DOR'],
      ['P2', 'Panel solar monocristalino 100 W', 'Solar', 349, 7, 'L-0805', '972ceb606bfca75ef6208d8d3966c77d', 'SOL-PAN100'],
      ['P3', 'Estación de energía portátil', 'Solar', 1290, 3, 'L-0910', '56a034356f25e7cd0fe7251db3cbbddc', 'SOL-EST500']
    ];
    const byId = {};
    PR.forEach((p) => { byId[p[0]] = p; });
    const LISTS = [['Público', 0], ['Minorista', 0.05], ['Mayorista', 0.12], ['Empresa', 0.15]];
    const listOff = (LISTS.find((l) => l[0] === st.list) || LISTS[0])[1];
    const unitPrice = (p) => Math.round(p[3] * (1 - listOff) * 100) / 100;

    const setQty = (id, n) => {
      const p = byId[id];
      const q = Math.max(0, Math.min(n, p[4]));
      const lines = { ...this.state.lines };
      let order = this.state.order.slice();
      if (q === 0) { delete lines[id]; order = order.filter((x) => x !== id); }
      else { if (!lines[id]) order.push(id); lines[id] = q; }
      this.setState({ lines, order, received: 0 });
    };

    // líneas del ticket
    let sub = 0;
    let discTotal = 0;
    const lines = st.order.filter((id) => st.lines[id]).map((id) => {
      const p = byId[id];
      const qty = st.lines[id];
      const u = unitPrice(p);
      const gross = u * qty;
      const pct = st.disc[id] || 0;
      const d = Math.round(gross * pct) / 100;
      sub += gross;
      discTotal += d;
      const left = p[4] - qty;
      return {
        name: p[1], unit: money(u), lot: 'Sale del lote ' + p[5], qty: String(qty), total: money(gross - d),
        dec: () => setQty(id, qty - 1), inc: () => setQty(id, qty + 1), remove: () => setQty(id, 0),
        disc: () => this.setState({ disc: { ...this.state.disc, [id]: pct >= 10 ? 0 : pct + 5 }, received: 0 }),
        discText: pct ? '−' + pct + '%' : 'Descuento',
        discBg: pct ? '#FFF1E6' : '#FFFFFF', discFg: pct ? '#8A3B0A' : '#6B6B6B',
        warn: left <= 3, left: String(left)
      };
    });
    const total = Math.round((sub - discTotal) * 100) / 100;
    const units = Object.keys(st.lines).reduce((a, k) => a + st.lines[k], 0);

    // productos
    const q = st.q.trim().toLowerCase();
    const products = PR.filter((p) => (st.cat === 'Todos' || p[2] === st.cat) && (!q || (p[1] + ' ' + p[7]).toLowerCase().indexOf(q) !== -1)).map((p) => {
      const out = p[4] === 0;
      const low = !out && p[4] <= 9;
      const inT = st.lines[p[0]] || 0;
      return {
        name: p[1], price: money(unitPrice(p)), img: p[6] ? B + p[6] : '', hasImg: !!p[6], noImg: !p[6],
        stock: out ? 'Agotado' : (low ? 'Quedan ' + p[4] : p[4] + ' en stock'),
        stockFg: out ? '#B3261E' : (low ? '#7A4A00' : '#1B5E20'),
        stockIcon: out ? 'M6 6l12 12M18 6L6 18' : (low ? 'M12 7v6M12 17h.01' : 'M5 12l5 5 9-10'),
        lot: out ? 'Sin lote disponible' : 'Sale del lote ' + p[5],
        inTicket: inT > 0, qty: String(inT),
        border: inT ? '#E8701F' : 'transparent',
        cls: out ? '' : 'pv-card', cursor: out ? 'not-allowed' : 'pointer', o: out ? '0.5' : '1',
        aria: out ? p[1] + ', agotado' : 'Agregar ' + p[1] + ' al ticket',
        add: () => { if (!out) setQty(p[0], inT + 1); }
      };
    });
    const CATS = ['Todos', 'Focos', 'Cables', 'Extensiones', 'Llaveros', 'Ganchos', 'Camping', 'Bisutería', 'Solar'];

    // pago
    const METHODS = [
      ['Efectivo', 'M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
      ['Yape', 'M7 3h10v18H7zM11 18h2'],
      ['Plin', 'M7 3h10v18H7zM11 18h2'],
      ['Tarjeta', 'M3 6h18v12H3zM3 10h18M7 15h4'],
      ['Transferencia', 'M4 8h13l-3-3M20 16H7l3 3']
    ];
    const isCash = st.pay === 'Efectivo';
    const received = st.received === -1 ? total : st.received;
    const change = Math.round((received - total) * 100) / 100;
    const hasRec = !!received && total > 0;
    const cashOk = !isCash || received >= total;
    const factWarn = st.doc === 'Factura' && st.client !== 'ruc';
    const canCharge = total > 0 && cashOk && !factWarn;
    const CLIENTS = [['varios', 'Cliente varios'], ['dni', 'Con DNI'], ['ruc', 'Con RUC']];

    // ventas de la caja (ejemplo) + las registradas aquí
    const SALES = [
      ['B001-00421', '3 productos', '10:42', 'Yape', 86.7],
      ['NV-0130', '1 producto', '10:15', 'Efectivo', 45],
      ['F001-00087', '12 productos', '09:48', 'Transferencia', 1240],
      ['B001-00420', '2 productos', '09:05', 'Efectivo', 28.8]
    ];
    const allSales = st.extra.concat(SALES);
    const cashTotal = allSales.reduce((a, s) => a + s[4], 0);
    const docIcon = (doc) => doc.indexOf('F') === 0 ? ['#E3F1FF', '#0B4A8A', 'M7 3h7l5 5v13H7zM14 3v5h5'] : (doc.indexOf('NV') === 0 ? ['#EFEFEC', '#444444', 'M6 3h12v18l-3-2-3 2-3-2-3 2z'] : ['#FFF1E6', '#8A3B0A', 'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6']);

    const prefix = { Boleta: 'B001-00', Factura: 'F001-000', 'Nota de venta': 'NV-0' };
    const done = st.done;

    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },

      headStats: [
        [money(cashTotal).replace('.00', ''), 'Vendido', 'en esta caja', '#111111', '#FFFFFF'],
        [String(allSales.length), 'Tickets', 'hoy', '#FFFFFF', '#111111'],
        [money(cashTotal / allSales.length).replace(/\.\d\d$/, ''), 'Ticket', 'promedio', '#FFFFFF', '#111111']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),

      onSearch: (e) => this.setState({ q: (e && e.target && e.target.value) || '' }),
      cats: CATS.map((c) => ({ name: c, pick: () => this.setState({ cat: c }), pressed: st.cat === c ? 'true' : 'false', bg: st.cat === c ? '#111111' : '#F4F4F2', fg: st.cat === c ? '#FFFFFF' : '#111111' })),
      products,
      noProducts: products.length === 0,

      sales: allSales.map((s) => { const ic = docIcon(s[0]); return { doc: s[0], items: s[1], time: s[2], method: s[3], total: money(s[4]), bg: ic[0], fg: ic[1], icon: ic[2] }; }),

      done: !!done,
      editing: !done,
      doneTotal: done ? money(done.total) : '',
      doneDoc: done ? done.doc : '',
      doneMethod: done ? done.method : '',
      doneLots: done ? 'Stock descontado del lote ' + done.lots : '',
      doneChange: !!(done && done.change > 0),
      doneChangeText: done ? money(done.change) : '',
      newSale: () => this.setState({ done: null, lines: {}, order: [], disc: {}, received: 0, client: 'varios', list: 'Público', doc: 'Boleta' }),

      ticketCount: units ? units + (units === 1 ? ' unidad' : ' unidades') : 'Vacío',
      clients: CLIENTS.map((c) => ({ name: c[1], pick: () => this.setState({ client: c[0] }), pressed: st.client === c[0] ? 'true' : 'false', bg: st.client === c[0] ? '#111111' : 'transparent', fg: st.client === c[0] ? '#FFFFFF' : '#111111' })),
      needsDoc: st.client !== 'varios',
      docLabel: st.client === 'ruc' ? 'RUC' : 'DNI',
      docPlaceholder: st.client === 'ruc' ? '[RUC del cliente]' : '[DNI del cliente]',
      lists: LISTS.map((l) => ({ name: l[0] + (l[1] ? ' −' + Math.round(l[1] * 100) + '%' : ''), pick: () => this.setState({ list: l[0], received: 0 }), pressed: st.list === l[0] ? 'true' : 'false', bg: st.list === l[0] ? '#111111' : '#FFFFFF', fg: st.list === l[0] ? '#FFFFFF' : '#111111', border: st.list === l[0] ? '#111111' : '#DCDCD8' })),
      listName: st.list,
      empty: lines.length === 0,
      lines,
      subtotal: money(sub),
      hasDisc: discTotal > 0,
      discTotal: money(discTotal),
      igv: money(total - total / 1.18),
      total: money(total),

      methods: METHODS.map((m) => ({ name: m[0], icon: m[1], pick: () => this.setState({ pay: m[0], received: 0 }), pressed: st.pay === m[0] ? 'true' : 'false', bg: st.pay === m[0] ? '#111111' : '#F4F4F2', fg: st.pay === m[0] ? '#FFFFFF' : '#111111' })),
      isCash,
      receivedText: received ? money(received) : '—',
      quick: [[50, 'S/ 50'], [100, 'S/ 100'], [200, 'S/ 200'], [-1, 'Exacto']].map((x) => {
        const on = st.received === x[0];
        return { label: x[1], pick: () => this.setState({ received: x[0] }), bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111' };
      }),
      changeLabel: !hasRec ? 'Elige cuánto te dieron' : (change >= 0 ? 'Vuelto' : 'Falta'),
      changeText: !hasRec ? '' : money(Math.abs(change)),
      changeFg: !hasRec ? '#8C8C8C' : (change >= 0 ? '#1B5E20' : '#B3261E'),
      changeIcon: !hasRec ? 'M12 7v5l3 2' : (change >= 0 ? 'M5 12l5 5 9-10' : 'M12 7v6M12 17h.01'),

      docs: ['Boleta', 'Factura', 'Nota de venta'].map((d) => ({ name: d, pick: () => this.setState({ doc: d, client: d === 'Factura' ? 'ruc' : this.state.client }), pressed: st.doc === d ? 'true' : 'false', bg: st.doc === d ? '#111111' : 'transparent', fg: st.doc === d ? '#FFFFFF' : '#111111' })),
      docWarn: factWarn,

      chargeText: total > 0 ? 'Cobrar ' + money(total) : 'Agrega productos',
      chargeBg: canCharge ? '#E8701F' : '#BDBDBD',
      chargeCursor: canCharge ? 'pointer' : 'not-allowed',
      chargeDisabled: canCharge ? 'false' : 'true',
      charge: () => {
        if (!canCharge) return;
        const n = this.state.seq[st.doc] + 1;
        const num = prefix[st.doc] + n;
        const lots = st.order.filter((id) => st.lines[id]).map((id) => byId[id][5]).join(', ');
        const now = new Date();
        const time = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
        this.setState({
          done: { total, doc: st.doc + ' ' + num, method: st.pay, lots, change: isCash ? change : 0 },
          seq: { ...this.state.seq, [st.doc]: n },
          extra: [[num, units + (units === 1 ? ' producto' : ' productos'), time, st.pay, total]].concat(this.state.extra)
        });
      }
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function PuntoVenta(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.pv-card{transition:transform .12s ease, box-shadow .12s ease}\n.pv-card:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(17,17,17,0.08)}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          <div>
            <div style={{ "padding": "28px 32px 22px", "display": "flex", "flexDirection": "column", "gap": "22px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "flexWrap": "wrap" }}>
                <button onClick={lookup(v, "menuBtn")} aria-label={lookup(v, "menuBtnLabel")} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M4 8h16M4 16h10"}></path>
                  </svg>
                </button>
                <DesignLink href={"/dashboard"} aria-label={"Ir al panel"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-pv"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-pv)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Punto de venta"}
                  </span>
                  <DesignLink href={"/caja"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "14px", "fontWeight": "600", "color": "#1B5E20", "textDecoration": "none" }}>
                    <span style={{ "width": "8px", "height": "8px", "borderRadius": "50%", "background": "#34C759" }}></span>
                    {"Caja abierta · Beltran C."}
                  </DesignLink>
                </span>
                <span style={{ "flex": "1" }}></span>
                {(lookup(v, "headStats") || []).map((h, index1) => (
                  <Fragment key={index1}>
                    <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                      <span style={{ "minWidth": "64px", "height": "64px", "padding": "0 14px", "boxSizing": "border-box", "borderRadius": "999px", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "17px", "fontWeight": "700", "background": lookup(h, "bg"), "color": lookup(h, "fg") }}>
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
                <DesignLink href={"/caja"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 20px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"}></path>
                  </svg>
                  {"Ver caja"}
                </DesignLink>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
              </div>
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 620px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <label style={{ "display": "flex", "alignItems": "center", "gap": "14px", "height": "64px", "padding": "0 10px 0 22px", "borderRadius": "999px", "background": "#F4F4F2", "boxSizing": "border-box" }}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                      <path d={"M3 7V4h3M18 4h3v3M21 17v3h-3M6 20H3v-3M7 8v8M10 8v8M13 8v8M16 8v8"}></path>
                    </svg>
                    <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                      {"Buscar producto"}
                    </span>
                    <input type={"search"} onChange={lookup(v, "onSearch")} placeholder={"Escanea o escribe el producto…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "18px", "fontWeight": "600", "outline": "none" }} />
                    <span style={{ "height": "44px", "padding": "0 16px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "13px", "fontWeight": "700", "color": "#6B6B6B", "display": "flex", "alignItems": "center" }}>
                      {"Lector listo"}
                    </span>
                  </label>
                  <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto" }}>
                    {(lookup(v, "cats") || []).map((c, index2) => (
                      <Fragment key={index2}>
                        <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "flex": "none", "height": "44px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(c, "name")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {Boolean(lookup(v, "noProducts")) && (
                    <Fragment>
                      <div style={{ "padding": "32px", "borderRadius": "24px", "background": "#F4F4F2", "fontSize": "15px", "color": "#6B6B6B", "textAlign": "center" }}>
                        {"No hay productos con ese nombre o código."}
                      </div>
                    </Fragment>
                  )}
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(4, minmax(0, 1fr))", "gap": "12px" }}>
                    {(lookup(v, "products") || []).map((p, index3) => (
                      <Fragment key={index3}>
                        <button onClick={lookup(p, "add")} className={lookup(p, "cls")} aria-label={lookup(p, "aria")} style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "padding": "10px 10px 14px", "borderRadius": "24px", "border": "2px solid " + String(lookup(p, "border") ?? ""), "background": "#F4F4F2", "cursor": lookup(p, "cursor"), "opacity": lookup(p, "o"), "fontFamily": "inherit", "textAlign": "left", "color": "#111111", "position": "relative" }}>
                          <span style={{ "position": "relative", "display": "block", "aspectRatio": "4 / 3", "borderRadius": "18px", "overflow": "hidden", "background": "#FFFFFF" }}>
                            {Boolean(lookup(p, "hasImg")) && (
                              <Fragment>
                                <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />
                              </Fragment>
                            )}
                            {Boolean(lookup(p, "noImg")) && (
                              <Fragment>
                                <span style={{ "position": "absolute", "inset": "0", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                  <svg width={"40"} height={"40"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#BDBDBD"} strokeWidth={"1.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                    <path d={"M12 3v7a4 4 0 1 1-4 4"}></path>
                                  </svg>
                                </span>
                              </Fragment>
                            )}
                            {Boolean(lookup(p, "inTicket")) && (
                              <Fragment>
                                <span style={{ "position": "absolute", "top": "8px", "right": "8px", "minWidth": "30px", "height": "30px", "padding": "0 8px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "fontSize": "13px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                  {lookup(p, "qty")}
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "0 4px", "lineHeight": "1.25" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700", "minHeight": "35px" }}>
                              {lookup(p, "name")}
                            </span>
                            <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                              {lookup(p, "price")}
                            </span>
                          </span>
                          <span style={{ "display": "flex", "alignItems": "center", "gap": "6px", "padding": "0 4px", "fontSize": "12px", "fontWeight": "600", "color": lookup(p, "stockFg") }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(p, "stockIcon")}></path>
                            </svg>
                            {lookup(p, "stock")}
                          </span>
                          <span style={{ "padding": "0 4px", "fontSize": "11px", "color": "#8C8C8C" }}>
                            {lookup(p, "lot")}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Ventas de esta caja"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Ejemplo · hoy desde 08:30"}
                    </span>
                  </div>
                  {(lookup(v, "sales") || []).map((s, index4) => (
                    <Fragment key={index4}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                        <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(s, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "fg")} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(s, "doc")}
                            {" · "}
                            {lookup(s, "items")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                            {lookup(s, "time")}
                            {" · "}
                            {lookup(s, "method")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                          {lookup(s, "total")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "flex": "1 1 400px", "maxWidth": "460px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                {Boolean(lookup(v, "done")) && (
                  <Fragment>
                    <div role={"status"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "14px", "padding": "36px 20px", "textAlign": "center" }}>
                      <span style={{ "width": "84px", "height": "84px", "borderRadius": "50%", "background": "#E4F4E7", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"40"} height={"40"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1B5E20"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                      </span>
                      <span style={{ "fontSize": "26px", "fontWeight": "700", "letterSpacing": "-0.01em" }}>
                        {"Venta registrada"}
                      </span>
                      <span style={{ "fontSize": "40px", "fontWeight": "800" }}>
                        {lookup(v, "doneTotal")}
                      </span>
                      <span style={{ "fontSize": "14px", "lineHeight": "1.5", "color": "#444444" }}>
                        {lookup(v, "doneDoc")}
                        {" · "}
                        {lookup(v, "doneMethod")}
                        <br />
                        {lookup(v, "doneLots")}
                      </span>
                      {Boolean(lookup(v, "doneChange")) && (
                        <Fragment>
                          <span style={{ "padding": "10px 18px", "borderRadius": "999px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "15px", "fontWeight": "800" }}>
                            {"Vuelto: "}
                            {lookup(v, "doneChangeText")}
                          </span>
                        </Fragment>
                      )}
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px", "width": "100%", "marginTop": "6px" }}>
                        <button style={{ "height": "50px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                          {"Imprimir"}
                        </button>
                        <DesignLink href={"#whatsapp"} style={{ "height": "50px", "borderRadius": "999px", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                          {"Enviar por WhatsApp"}
                        </DesignLink>
                      </div>
                      <button onClick={lookup(v, "newSale")} style={{ "width": "100%", "height": "60px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "17px", "fontWeight": "800" }}>
                        {"Nueva venta"}
                      </button>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "editing")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                      <span style={{ "fontSize": "22px", "fontWeight": "700", "letterSpacing": "-0.01em" }}>
                        {"Ticket"}
                      </span>
                      <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                        {lookup(v, "ticketCount")}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "6px", "padding": "4px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                        {(lookup(v, "clients") || []).map((c, index5) => (
                          <Fragment key={index5}>
                            <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "height": "40px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(c, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      {Boolean(lookup(v, "needsDoc")) && (
                        <Fragment>
                          <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "height": "46px", "padding": "0 16px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "boxSizing": "border-box" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700", "color": "#6B6B6B" }}>
                              {lookup(v, "docLabel")}
                            </span>
                            <input placeholder={lookup(v, "docPlaceholder")} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "14px", "outline": "none" }} />
                          </label>
                        </Fragment>
                      )}
                      <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap", "alignItems": "center" }}>
                        <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C", "marginRight": "2px" }}>
                          {"Precio"}
                        </span>
                        {(lookup(v, "lists") || []).map((l, index6) => (
                          <Fragment key={index6}>
                            <button onClick={lookup(l, "pick")} aria-pressed={lookup(l, "pressed")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid " + String(lookup(l, "border") ?? ""), "background": lookup(l, "bg"), "color": lookup(l, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                              {lookup(l, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    {Boolean(lookup(v, "empty")) && (
                      <Fragment>
                        <div style={{ "padding": "34px 18px", "borderRadius": "22px", "border": "2px dashed #DCDCD8", "textAlign": "center", "fontSize": "14px", "lineHeight": "1.5", "color": "#6B6B6B" }}>
                          {"Toca un producto o escanéalo"}
                          <br />
                          {"para agregarlo al ticket."}
                        </div>
                      </Fragment>
                    )}
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      {(lookup(v, "lines") || []).map((l, index7) => (
                        <Fragment key={index7}>
                          <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "padding": "12px", "borderRadius": "20px", "background": "#F4F4F2" }}>
                            <div style={{ "display": "flex", "gap": "10px", "alignItems": "flex-start" }}>
                              <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                  {lookup(l, "name")}
                                </span>
                                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                  {lookup(l, "unit")}
                                  {" c/u · "}
                                  {lookup(l, "lot")}
                                </span>
                              </span>
                              <span style={{ "fontSize": "16px", "fontWeight": "800", "whiteSpace": "nowrap" }}>
                                {lookup(l, "total")}
                              </span>
                            </div>
                            <div style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "padding": "3px", "borderRadius": "999px", "background": "#FFFFFF" }}>
                                <button onClick={lookup(l, "dec")} aria-label={"Quitar una unidad"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                                  {"−"}
                                </button>
                                <span style={{ "minWidth": "28px", "textAlign": "center", "fontSize": "15px", "fontWeight": "800" }}>
                                  {lookup(l, "qty")}
                                </span>
                                <button onClick={lookup(l, "inc")} aria-label={"Agregar una unidad"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                                  {"+"}
                                </button>
                              </span>
                              <button onClick={lookup(l, "disc")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(l, "discBg"), "color": lookup(l, "discFg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                                {lookup(l, "discText")}
                              </button>
                              <span style={{ "flex": "1" }}></span>
                              {Boolean(lookup(l, "warn")) && (
                                <Fragment>
                                  <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#7A4A00" }}>
                                    {"Quedan "}
                                    {lookup(l, "left")}
                                  </span>
                                </Fragment>
                              )}
                              <button onClick={lookup(l, "remove")} aria-label={"Quitar del ticket"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "transparent", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#6B6B6B"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"}></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "padding": "14px 4px 0", "borderTop": "1px solid #ECECE9", "fontSize": "14px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                        <span style={{ "color": "#6B6B6B" }}>
                          {"Subtotal ("}
                          {lookup(v, "listName")}
                          {")"}
                        </span>
                        <span style={{ "fontWeight": "600" }}>
                          {lookup(v, "subtotal")}
                        </span>
                      </span>
                      {Boolean(lookup(v, "hasDisc")) && (
                        <Fragment>
                          <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                            <span style={{ "color": "#6B6B6B" }}>
                              {"Descuentos"}
                            </span>
                            <span style={{ "fontWeight": "600", "color": "#C2410C" }}>
                              {"− "}
                              {lookup(v, "discTotal")}
                            </span>
                          </span>
                        </Fragment>
                      )}
                      <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px", "color": "#8C8C8C" }}>
                        <span>
                          {"IGV 18% incluido"}
                        </span>
                        <span>
                          {lookup(v, "igv")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "paddingTop": "6px" }}>
                        <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                          {"Total"}
                        </span>
                        <span style={{ "fontSize": "38px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                          {lookup(v, "total")}
                        </span>
                      </span>
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                        {"Método de pago"}
                      </span>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "6px" }}>
                        {(lookup(v, "methods") || []).map((m, index8) => (
                          <Fragment key={index8}>
                            <button onClick={lookup(m, "pick")} aria-pressed={lookup(m, "pressed")} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "4px", "padding": "10px 4px", "borderRadius": "18px", "border": "none", "background": lookup(m, "bg"), "color": lookup(m, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "11px", "fontWeight": "700" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(m, "icon")}></path>
                              </svg>
                              {lookup(m, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      {Boolean(lookup(v, "isCash")) && (
                        <Fragment>
                          <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "padding": "12px", "borderRadius": "20px", "background": "#F4F4F2" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                              <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                                {"Recibido"}
                              </span>
                              <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                                {lookup(v, "receivedText")}
                              </span>
                            </span>
                            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(4, minmax(0, 1fr))", "gap": "6px" }}>
                              {(lookup(v, "quick") || []).map((q, index9) => (
                                <Fragment key={index9}>
                                  <button onClick={lookup(q, "pick")} style={{ "height": "40px", "borderRadius": "999px", "border": "none", "background": lookup(q, "bg"), "color": lookup(q, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                                    {lookup(q, "label")}
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "4px" }}>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "13px", "fontWeight": "700", "color": lookup(v, "changeFg") }}>
                                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(v, "changeIcon")}></path>
                                </svg>
                                {lookup(v, "changeLabel")}
                              </span>
                              <span style={{ "fontSize": "22px", "fontWeight": "800", "color": lookup(v, "changeFg") }}>
                                {lookup(v, "changeText")}
                              </span>
                            </span>
                          </div>
                        </Fragment>
                      )}
                      <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                        {"Comprobante"}
                      </span>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "6px", "padding": "4px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                        {(lookup(v, "docs") || []).map((d, index10) => (
                          <Fragment key={index10}>
                            <button onClick={lookup(d, "pick")} aria-pressed={lookup(d, "pressed")} style={{ "height": "38px", "borderRadius": "999px", "border": "none", "background": lookup(d, "bg"), "color": lookup(d, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(d, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      {Boolean(lookup(v, "docWarn")) && (
                        <Fragment>
                          <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "12px", "fontWeight": "600", "color": "#7A4A00" }}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                              <path d={"M12 7v6M12 17h.01"}></path>
                            </svg>
                            {"La factura necesita el RUC del cliente."}
                          </span>
                        </Fragment>
                      )}
                    </div>
                    <button onClick={lookup(v, "charge")} aria-disabled={lookup(v, "chargeDisabled")} style={{ "height": "68px", "borderRadius": "999px", "border": "none", "background": lookup(v, "chargeBg"), "color": "#FFFFFF", "cursor": lookup(v, "chargeCursor"), "fontFamily": "inherit", "fontSize": "19px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px" }}>
                      <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M5 12l5 5 9-10"}></path>
                      </svg>
                      {lookup(v, "chargeText")}
                    </button>
                    <span style={{ "fontSize": "12px", "textAlign": "center", "color": "#8C8C8C" }}>
                      {"Al cobrar se descuenta el stock del lote que se vende primero."}
                    </span>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"PuntoVenta"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
