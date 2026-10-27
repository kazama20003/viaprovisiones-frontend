"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), filter: 'Todas', sel: 'COT-0218', qty: {} };
  }
  renderVals() {
    const accent = this.props.accent ?? '#FF914C';
    const st = this.state;
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const STAGES = {
      'Borrador': ['#F1F1EE', '#3D3D3D', 'M4 20h4L19 9l-4-4L4 16zM13 7l4 4'],
      'Enviada': ['#E3F1FF', '#0B4A8A', 'M3 11l18-8-8 18-2-8z'],
      'En negociación': ['#FFF4D6', '#7A4A00', 'M4 5h16v11H9l-5 4z'],
      'Aceptada': ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      'Vencida': ['#FDE4E2', '#8E1C14', 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z']
    };
    const STOCK = {
      ok: ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      transit: ['#E3F1FF', '#0B4A8A', 'M3 7h11v9H3zM14 10h4l3 3v3h-7'],
      order: ['#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01']
    };
    // Línea: nombre, cantidad, precio de lista sin IGV, tipo de stock, texto de stock
    const L = (name, qty, price, s, text) => ({ name, qty, price, s, text });
    const Q = [
      { id: 'COT-0218', client: 'Minera [Cliente]', type: 'Minería', contact: '[Jefe de logística]', date: '22 oct', until: '06 nov', due: 11, status: 'En negociación', place: 'Campamento · [Provincia], Arequipa', pay: 'Factura a 30 días', lines: [
        L('Reflector LED 100 W uso exterior', 40, 89, 'ok', 'Hay stock · lote L-0994'),
        L('Extensión de uso rudo 5 m', 60, 45, 'ok', 'Hay stock · lote L-0928'),
        L('Panel solar monocristalino 100 W', 12, 349, 'transit', 'Llega 28 oct · lote L-1102'),
        L('Linterna frontal recargable', 80, 39.9, 'order', 'Se pide al proveedor')
      ] },
      { id: 'COT-0217', client: 'Constructora [Cliente]', type: 'Constructora', contact: '[Residente de obra]', date: '21 oct', until: '05 nov', due: 10, status: 'Enviada', place: 'Obra · Cerro Colorado', pay: '50 % adelanto, saldo contra entrega', lines: [
        L('Carrete de extensión 15 m', 15, 119, 'ok', 'Hay stock · lote L-0918'),
        L('Foco LED 18 W luz blanca', 120, 12.9, 'ok', 'Hay stock · lote L-1011')
      ] },
      { id: 'COT-0216', client: 'Ferretería Cayma', type: 'Mayorista', contact: '[Encargado de compras]', date: '20 oct', until: '04 nov', due: 9, status: 'Aceptada', place: 'Recojo en tienda', pay: 'Transferencia', lines: [
        L('Foco LED 9 W luz cálida', 200, 8.9, 'ok', 'Hay stock · lote L-1008'),
        L('Cable USB-C carga rápida 1 m', 60, 15.9, 'ok', 'Hay stock · lote L-0901')
      ] },
      { id: 'COT-0215', client: 'Bodega San Martín', type: 'Minorista', contact: '[Dueño]', date: '24 oct', until: '08 nov', due: 13, status: 'Borrador', place: 'Delivery Arequipa', pay: 'Yape / Plin', lines: [
        L('Mosquetón llavero de aluminio', 24, 6.9, 'ok', 'Hay stock · lote L-0830'),
        L('Ganchos de pared (set de 3)', 12, 9.9, 'ok', 'Hay stock · lote L-0907')
      ] },
      { id: 'COT-0214', client: 'Hotel [Cliente]', type: 'Empresa', contact: '[Administración]', date: '15 oct', until: '30 oct', due: 3, status: 'Enviada', place: 'Delivery Arequipa', pay: 'Factura a 15 días', lines: [
        L('Foco LED 9 W luz cálida', 90, 8.9, 'ok', 'Hay stock · lote L-1008'),
        L('Lámpara de camping recargable', 10, 69.9, 'ok', 'Hay stock · lote L-0915')
      ] },
      { id: 'COT-0213', client: 'Colegio [Cliente]', type: 'Empresa', contact: '[Dirección]', date: '13 oct', until: '28 oct', due: 1, status: 'En negociación', place: 'Delivery Arequipa', pay: 'Transferencia', lines: [
        L('Extensión de uso rudo 5 m', 30, 45, 'ok', 'Hay stock · lote L-0928'),
        L('Estación de energía portátil', 2, 1290, 'order', 'Se pide al proveedor')
      ] },
      { id: 'COT-0211', client: 'Distribuidora [Cliente]', type: 'Mayorista', contact: '[Compras]', date: '28 sep', until: '13 oct', due: -13, status: 'Vencida', place: 'Agencia a Cusco', pay: 'Transferencia', lines: [
        L('Cable USB-C carga rápida 1 m', 150, 15.9, 'ok', 'Hay stock · lote L-0901'),
        L('Collar dorado de cadena fina', 40, 22.9, 'ok', 'Hay stock · lote L-0820')
      ] }
    ];
    const tierOf = (n) => (n >= 50 ? [0.15, 'Volumen −15 %'] : n >= 12 ? [0.08, 'Mayorista −8 %'] : [0, 'Precio unidad']);
    const qtyOf = (q, i) => { const k = q.id + '-' + i; return k in st.qty ? st.qty[k] : q.lines[i].qty; };
    const calc = (q) => {
      let list = 0, net = 0;
      q.lines.forEach((l, i) => { const n = qtyOf(q, i); const t = tierOf(n); list += n * l.price; net += n * l.price * (1 - t[0]); });
      return { list, net, igv: net * 0.18, total: net * 1.18 };
    };
    const setQty = (q, i, d) => () => { const k = q.id + '-' + i; const n = Math.max(1, qtyOf(q, i) + d); this.setState({ qty: { ...this.state.qty, [k]: n } }); };
    const vis = Q.filter((q) => st.filter === 'Todas' || q.status === st.filter);
    const S = Q.find((q) => q.id === st.sel) || Q[0];
    const sc = calc(S);
    const maxStage = Math.max(...Object.keys(STAGES).map((k) => Q.filter((q) => q.status === k).reduce((a, q) => a + calc(q).total, 0)));
    const open = Q.filter((q) => ['Enviada', 'En negociación', 'Borrador'].includes(q.status)).reduce((a, q) => a + calc(q).total, 0);
    const TYPES = ['Minería', 'Constructora', 'Empresa', 'Mayorista', 'Minorista'];
    const typeSum = TYPES.map((t) => [t, Q.filter((q) => q.type === t).reduce((a, q) => a + calc(q).total, 0)]);
    const maxType = Math.max(...typeSum.map((t) => t[1]));
    const all = st.filter === 'Todas';
    return {
      accent,
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      openAmount: 'S/ ' + Math.round(open).toLocaleString('es-PE'),
      totalCount: String(Q.length),
      headStats: [
        { v: '37', k1: 'Cotizaciones', k2: 'en octubre', bg: '#FFFFFF', fg: '#111111' },
        { v: String(Q.filter((q) => q.due >= 0 && q.due <= 3 && q.status !== 'Aceptada').length), k1: 'Vencen en', k2: '3 días', bg: '#FFF4D6', fg: '#7A4A00' },
        { v: '2.4 h', k1: 'Respuesta', k2: 'promedio', bg: '#FFFFFF', fg: '#111111' },
        { v: '38%', k1: 'Tasa de', k2: 'cierre', bg: '#111111', fg: '#FFFFFF' }
      ],
      showAll: () => this.setState({ filter: 'Todas' }),
      allPressed: all ? 'true' : 'false',
      allBg: all ? '#111111' : '#FFFFFF', allFg: all ? '#FFFFFF' : '#111111', allBorder: all ? '#111111' : '#E4E4E0',
      stages: Object.keys(STAGES).map((k) => {
        const qs = Q.filter((q) => q.status === k);
        const amt = qs.reduce((a, q) => a + calc(q).total, 0);
        const on = st.filter === k;
        return { name: k, count: String(qs.length), amount: money(amt), w: Math.max(4, Math.round((amt / maxStage) * 100)) + '%', bg: STAGES[k][0], fg: STAGES[k][1], icon: STAGES[k][2], border: on ? '#E8701F' : '#FFFFFF', pressed: on ? 'true' : 'false', pick: () => this.setState({ filter: on ? 'Todas' : k }) };
      }),
      perf: [['Monto aceptado', 'S/ 48,620'], ['Tiempo de respuesta', '2.4 h'], ['Ticket promedio cotizado', 'S/ 6,180']].map((p) => ({ k: p[0], v: p[1] })),
      listTitle: all ? 'Todas las cotizaciones' : st.filter,
      listCount: vis.length + (vis.length === 1 ? ' cotización' : ' cotizaciones'),
      noRows: vis.length === 0,
      rows: vis.map((q) => {
        const on = q.id === S.id;
        return {
          id: q.id, client: q.client, type: q.type, date: q.date, status: q.status, total: money(calc(q).total),
          due: q.status === 'Aceptada' ? 'Aceptada' : q.due < 0 ? 'Venció ' + q.until : 'Vence en ' + q.due + ' días',
          dueFg: q.due >= 0 && q.due <= 3 && q.status !== 'Aceptada' ? '#C2410C' : '#6B6B6B',
          ini: q.client.replace(/\[|\]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
          sbg: STAGES[q.status][0], sfg: STAGES[q.status][1], icon: STAGES[q.status][2],
          bg: on ? '#FFF6EF' : '#FFFFFF', border: on ? '#E8701F' : '#FFFFFF', pressed: on ? 'true' : 'false',
          select: () => this.setState({ sel: q.id })
        };
      }),
      q: {
        id: S.id, client: S.client, type: S.type, contact: S.contact, date: S.date, until: S.until, place: S.place, pay: S.pay,
        status: S.status, sbg: STAGES[S.status][0], sfg: STAGES[S.status][1], icon: STAGES[S.status][2],
        listSum: money(sc.list), disc: money(sc.list - sc.net), net: money(sc.net), igv: money(sc.igv), total: money(sc.total),
        lines: S.lines.map((l, i) => {
          const n = qtyOf(S, i); const t = tierOf(n); const unit = l.price * (1 - t[0]);
          return { name: l.name, qty: String(n), unit: money(unit), list: t[0] ? money(l.price) : '', tier: t[1], total: money(n * unit), stock: l.text, sbg: STOCK[l.s][0], sfg: STOCK[l.s][1], sicon: STOCK[l.s][2], inc: setQty(S, i, 1), dec: setQty(S, i, -1) };
        })
      },
      tiers: [['Precio unidad', '1 a 11 unidades por producto', '0 %', '#F1F1EE', '#3D3D3D'], ['Mayorista', '12 a 49 unidades por producto', '−8 %', '#FFF1E6', '#8A3B0A'], ['Volumen', '50 unidades o más por producto', '−15 %', '#E8701F', '#FFFFFF']].map((t) => ({ name: t[0], rule: t[1], off: t[2], bg: t[3], fg: t[4] })),
      expiring: Q.filter((q) => q.due >= 0 && q.due <= 7 && q.status !== 'Aceptada').sort((a, b) => a.due - b.due).map((q) => ({ id: q.id, client: q.client, status: q.status, days: String(q.due), total: money(calc(q).total), select: () => this.setState({ sel: q.id, filter: 'Todas' }) })),
      byType: typeSum.map((t) => ({ name: t[0], amount: money(t[1]), w: Math.max(3, Math.round((t[1] / maxType) * 100)) + '%' }))
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Cotizaciones(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Cotizaciones"} onPin={lookup(v, "togglePin")} />
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
                <DesignLink href={"/dashboard"} aria-label={"Ir al panel"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-cot"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-cot)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Cotizaciones"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Ventas a empresas y por volumen"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Nueva cotización"}
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
                    {"Buscar cotización"}
                  </span>
                  <input type={"search"} placeholder={"N° COT o empresa…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Cotizaciones"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "openAmount")}
                    {" por cerrar"}
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
                <div style={{ "flex": "3 1 760px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Cotizaciones por estado"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Toca un estado para filtrar la lista."}
                      </span>
                    </span>
                    <button onClick={lookup(v, "showAll")} aria-pressed={lookup(v, "allPressed")} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(v, "allBorder") ?? ""), "background": lookup(v, "allBg"), "color": lookup(v, "allFg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                      {"Ver todas · "}
                      {lookup(v, "totalCount")}
                    </button>
                  </div>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "10px" }}>
                    {(lookup(v, "stages") || []).map((s, index2) => (
                      <Fragment key={index2}>
                        <button onClick={lookup(s, "pick")} aria-pressed={lookup(s, "pressed")} style={{ "borderRadius": "24px", "border": "2px solid " + String(lookup(s, "border") ?? ""), "background": "#FFFFFF", "padding": "16px", "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111", "display": "flex", "flexDirection": "column", "gap": "12px", "minWidth": "0" }}>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "alignSelf": "flex-start", "padding": "4px 10px 4px 6px", "borderRadius": "999px", "background": lookup(s, "bg"), "color": lookup(s, "fg"), "fontSize": "12px", "fontWeight": "700" }}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(s, "icon")}></path>
                            </svg>
                            {lookup(s, "name")}
                          </span>
                          <span style={{ "fontSize": "30px", "fontWeight": "800", "lineHeight": "1" }}>
                            {lookup(s, "count")}
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(s, "amount")}
                            </span>
                            <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                              <span style={{ "display": "block", "width": lookup(s, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                            </span>
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Rendimiento de octubre"}
                  </span>
                  <div style={{ "display": "flex", "gap": "18px", "alignItems": "center" }}>
                    <svg width={"96"} height={"96"} viewBox={"0 0 100 100"} role={"img"} aria-label={"Tasa de cierre 38%"}>
                      <circle cx={"50"} cy={"50"} r={"40"} fill={"none"} stroke={"#2A2A2A"} strokeWidth={"12"}></circle>
                      <circle cx={"50"} cy={"50"} r={"40"} fill={"none"} stroke={"#FF914C"} strokeWidth={"12"} strokeLinecap={"round"} strokeDasharray={"95.5 251.3"} transform={"rotate(-90 50 50)"}></circle>
                      <text x={"50"} y={"56"} textAnchor={"middle"} fontFamily={"Manrope, sans-serif"} fontSize={"20"} fontWeight={"800"} fill={"#FFFFFF"}>
                        {"38%"}
                      </text>
                    </svg>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "fontSize": "13px", "color": "#CFCFCF" }}>
                        {"Tasa de cierre"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                        {"14 aceptadas de 37 enviadas"}
                      </span>
                    </span>
                  </div>
                  {(lookup(v, "perf") || []).map((p, index3) => (
                    <Fragment key={index3}>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "paddingTop": "10px", "borderTop": "1px solid #2A2A2A", "fontSize": "13px" }}>
                        <span style={{ "color": "#CFCFCF" }}>
                          {lookup(p, "k")}
                        </span>
                        <span style={{ "fontSize": "16px", "fontWeight": "800" }}>
                          {lookup(p, "v")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "flex-start" }}>
                <div style={{ "flex": "1 1 400px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "gap": "10px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {lookup(v, "listTitle")}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(v, "listCount")}
                    </span>
                  </div>
                  {(lookup(v, "rows") || []).map((r, index4) => (
                    <Fragment key={index4}>
                      <button onClick={lookup(r, "select")} aria-pressed={lookup(r, "pressed")} style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "padding": "14px 16px", "borderRadius": "22px", "border": "1px solid " + String(lookup(r, "border") ?? ""), "background": lookup(r, "bg"), "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(r, "id")}
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "3px 10px 3px 6px", "borderRadius": "999px", "background": lookup(r, "sbg"), "color": lookup(r, "sfg"), "fontSize": "11px", "fontWeight": "700" }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(r, "icon")}></path>
                            </svg>
                            {lookup(r, "status")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": "#FFF1E6", "color": "#8A3B0A", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "11px", "fontWeight": "800", "flex": "none" }}>
                            {lookup(r, "ini")}
                          </span>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                              {lookup(r, "client")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(r, "type")}
                              {" · "}
                              {lookup(r, "date")}
                            </span>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end" }}>
                            <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                              {lookup(r, "total")}
                            </span>
                            <span style={{ "fontSize": "11px", "fontWeight": "600", "color": lookup(r, "dueFg") }}>
                              {lookup(r, "due")}
                            </span>
                          </span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                  {Boolean(lookup(v, "noRows")) && (
                    <Fragment>
                      <span style={{ "padding": "18px", "borderRadius": "18px", "border": "1px dashed #DADAD6", "fontSize": "13px", "color": "#8C8C8C", "textAlign": "center" }}>
                        {"No hay cotizaciones en este estado."}
                      </span>
                    </Fragment>
                  )}
                </div>
                <div style={{ "flex": "2 1 640px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Vista previa del documento · ajusta cantidades y se recalcula"}
                      </span>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {lookup(v, "q.id")}
                        {" · "}
                        {lookup(v, "q.client")}
                      </span>
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "36px", "padding": "0 14px", "borderRadius": "999px", "background": lookup(v, "q.sbg"), "color": lookup(v, "q.sfg"), "fontSize": "12px", "fontWeight": "700" }}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(v, "q.icon")}></path>
                      </svg>
                      {lookup(v, "q.status")}
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "32px", "display": "flex", "flexDirection": "column", "gap": "24px", "boxShadow": "0 1px 0 #E4E4E0" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "20px", "flexWrap": "wrap" }}>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                        <svg width={"186"} height={"62"} viewBox={"134 205 278 92"} role={"img"} aria-label={"VIA Provisiones"}>
                          <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FF914C"} strokeWidth={"3"}></circle>
                          <clipPath id={"via-clip-cot-doc"}>
                            <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                          </clipPath>
                          <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FF914C"}></polygon>
                          <path clipPath={"url(#via-clip-cot-doc)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FF914C"}></path>
                          <g fill={"none"} stroke={"#111111"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
                            <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
                            <path d={"M295.8 229 V248.25"}></path>
                          </g>
                          <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={"#E8701F"}>
                            {"PROVISIONES"}
                          </text>
                        </svg>
                        <span style={{ "fontSize": "11px", "lineHeight": "1.5", "color": "#6B6B6B" }}>
                          {"RUC [RUC] · Dean Valdivia 533 - Cercado, Arequipa"}
                          <br />
                          {"+51 954 802 744 · viaprovisionesperu@gmail.com"}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "4px", "textAlign": "right" }}>
                        <span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.12em", "color": "#E8701F" }}>
                          {"COTIZACIÓN"}
                        </span>
                        <span style={{ "fontSize": "26px", "fontWeight": "800" }}>
                          {lookup(v, "q.id")}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                          {"Emitida: "}
                          {lookup(v, "q.date")}
                          {" 2026"}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                          {"Válida hasta: "}
                          {lookup(v, "q.until")}
                          {" 2026"}
                        </span>
                      </span>
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "12px" }}>
                      <div style={{ "borderRadius": "18px", "background": "#F8F8F6", "padding": "14px 16px", "display": "flex", "flexDirection": "column", "gap": "4px", "fontSize": "12px", "lineHeight": "1.5" }}>
                        <span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.08em", "color": "#8C8C8C" }}>
                          {"CLIENTE"}
                        </span>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(v, "q.client")}
                        </span>
                        <span>
                          {"RUC [RUC] · "}
                          {lookup(v, "q.type")}
                        </span>
                        <span>
                          {"Atención: "}
                          {lookup(v, "q.contact")}
                        </span>
                      </div>
                      <div style={{ "borderRadius": "18px", "background": "#F8F8F6", "padding": "14px 16px", "display": "flex", "flexDirection": "column", "gap": "4px", "fontSize": "12px", "lineHeight": "1.5" }}>
                        <span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.08em", "color": "#8C8C8C" }}>
                          {"ENTREGA Y PAGO"}
                        </span>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(v, "q.place")}
                        </span>
                        <span>
                          {"Pago: "}
                          {lookup(v, "q.pay")}
                        </span>
                        <span>
                          {"Vendedor: Beltran Carlos Ccapa"}
                        </span>
                      </div>
                    </div>
                    <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                      <div style={{ "minWidth": "640px", "display": "flex", "flexDirection": "column" }}>
                        <div style={{ "display": "grid", "gridTemplateColumns": "minmax(0, 1fr) 132px 120px 110px", "gap": "12px", "padding": "0 0 10px", "borderBottom": "2px solid #111111", "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.06em", "color": "#6B6B6B" }}>
                          <span>
                            {"PRODUCTO"}
                          </span>
                          <span style={{ "textAlign": "center" }}>
                            {"CANTIDAD"}
                          </span>
                          <span style={{ "textAlign": "right" }}>
                            {"PRECIO UNIT."}
                          </span>
                          <span style={{ "textAlign": "right" }}>
                            {"IMPORTE"}
                          </span>
                        </div>
                        {(lookup(v, "q.lines") || []).map((l, index5) => (
                          <Fragment key={index5}>
                            <div style={{ "display": "grid", "gridTemplateColumns": "minmax(0, 1fr) 132px 120px 110px", "gap": "12px", "alignItems": "center", "padding": "14px 0", "borderBottom": "1px solid #F1F1EE" }}>
                              <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "minWidth": "0" }}>
                                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                  {lookup(l, "name")}
                                </span>
                                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "alignSelf": "flex-start", "padding": "3px 10px 3px 6px", "borderRadius": "999px", "background": lookup(l, "sbg"), "color": lookup(l, "sfg"), "fontSize": "11px", "fontWeight": "700" }}>
                                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                    <path d={lookup(l, "sicon")}></path>
                                  </svg>
                                  {lookup(l, "stock")}
                                </span>
                              </span>
                              <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "4px" }}>
                                <button onClick={lookup(l, "dec")} aria-label={"Quitar 1"} style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "border": "1px solid #E4E4E0", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "16px", "fontWeight": "700" }}>
                                  {"−"}
                                </button>
                                <span style={{ "minWidth": "44px", "textAlign": "center", "fontSize": "15px", "fontWeight": "800" }}>
                                  {lookup(l, "qty")}
                                </span>
                                <button onClick={lookup(l, "inc")} aria-label={"Agregar 1"} style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "border": "1px solid #E4E4E0", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "16px", "fontWeight": "700" }}>
                                  {"+"}
                                </button>
                              </span>
                              <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "2px" }}>
                                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                  {lookup(l, "unit")}
                                </span>
                                <span style={{ "fontSize": "11px", "color": "#8C8C8C", "textDecoration": "line-through" }}>
                                  {lookup(l, "list")}
                                </span>
                                <span style={{ "fontSize": "10px", "fontWeight": "800", "color": "#C2410C" }}>
                                  {lookup(l, "tier")}
                                </span>
                              </span>
                              <span style={{ "textAlign": "right", "fontSize": "14px", "fontWeight": "800" }}>
                                {lookup(l, "total")}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "20px", "justifyContent": "space-between", "alignItems": "flex-start" }}>
                      <div style={{ "flex": "1 1 260px", "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "lineHeight": "1.5", "color": "#444444" }}>
                        <span style={{ "fontSize": "11px", "fontWeight": "800", "letterSpacing": "0.08em", "color": "#8C8C8C" }}>
                          {"CONDICIONES"}
                        </span>
                        <span>
                          {"• Validez de la oferta: 15 días calendario."}
                        </span>
                        <span>
                          {"• Precios por volumen: 12+ unidades −8 %, 50+ unidades −15 %."}
                        </span>
                        <span>
                          {"• Productos \"se pide al proveedor\": entrega en 7 a 10 días."}
                        </span>
                        <span>
                          {"• Garantía según ficha de cada producto."}
                        </span>
                      </div>
                      <div style={{ "flex": "0 1 300px", "display": "flex", "flexDirection": "column", "gap": "8px", "fontSize": "13px" }}>
                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                          <span style={{ "color": "#6B6B6B" }}>
                            {"Subtotal a precio de lista"}
                          </span>
                          <span style={{ "fontWeight": "700" }}>
                            {lookup(v, "q.listSum")}
                          </span>
                        </div>
                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                          <span style={{ "color": "#6B6B6B" }}>
                            {"Descuento por volumen"}
                          </span>
                          <span style={{ "fontWeight": "700", "color": "#C2410C" }}>
                            {"− "}
                            {lookup(v, "q.disc")}
                          </span>
                        </div>
                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                          <span style={{ "color": "#6B6B6B" }}>
                            {"Valor de venta"}
                          </span>
                          <span style={{ "fontWeight": "700" }}>
                            {lookup(v, "q.net")}
                          </span>
                        </div>
                        <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                          <span style={{ "color": "#6B6B6B" }}>
                            {"IGV 18 %"}
                          </span>
                          <span style={{ "fontWeight": "700" }}>
                            {lookup(v, "q.igv")}
                          </span>
                        </div>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "padding": "12px 16px", "marginTop": "4px", "borderRadius": "16px", "background": "#111111", "color": "#FFFFFF" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {"Total"}
                          </span>
                          <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                            {lookup(v, "q.total")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                      {"Datos de ejemplo para el diseño. Reemplazar RUC, contactos y precios por los reales."}
                    </span>
                  </div>
                  <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                    <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "46px", "padding": "0 18px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#25A244"} strokeWidth={"2"} aria-hidden={"true"}>
                        <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                      </svg>
                      {"Enviar por WhatsApp"}
                    </DesignLink>
                    <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "46px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "13px", "fontWeight": "700" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
                      </svg>
                      {"Descargar PDF"}
                    </button>
                    <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "46px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "13px", "fontWeight": "700" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M8 4h8M9 4v5l-4 11h14L15 9V4"}></path>
                      </svg>
                      {"Duplicar"}
                    </button>
                    <span style={{ "flex": "1" }}></span>
                    <DesignLink href={"/pedidos"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "46px", "padding": "0 22px", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Convertir en pedido "}
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                      </svg>
                    </DesignLink>
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Escala de precios por volumen"}
                  </span>
                  {(lookup(v, "tiers") || []).map((t, index6) => (
                    <Fragment key={index6}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "18px", "background": "#FFFFFF" }}>
                        <span style={{ "minWidth": "54px", "height": "34px", "borderRadius": "999px", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "13px", "fontWeight": "800" }}>
                          {lookup(t, "off")}
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(t, "name")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(t, "rule")}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Por vencer esta semana"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Haz seguimiento"}
                    </span>
                  </span>
                  {(lookup(v, "expiring") || []).map((e, index7) => (
                    <Fragment key={index7}>
                      <button onClick={lookup(e, "select")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "18px", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111" }}>
                        <span style={{ "width": "40px", "height": "40px", "borderRadius": "14px", "background": "#FFF4D6", "color": "#7A4A00", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "lineHeight": "1", "flex": "none" }}>
                          <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                            {lookup(e, "days")}
                          </span>
                          <span style={{ "fontSize": "9px", "fontWeight": "700" }}>
                            {"días"}
                          </span>
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                            {lookup(e, "client")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(e, "id")}
                            {" · "}
                            {lookup(e, "status")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                          {lookup(e, "total")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Monto cotizado por tipo de negocio"}
                  </span>
                  {(lookup(v, "byType") || []).map((b, index8) => (
                    <Fragment key={index8}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                          <span style={{ "fontWeight": "600" }}>
                            {lookup(b, "name")}
                          </span>
                          <span style={{ "fontWeight": "800" }}>
                            {lookup(b, "amount")}
                          </span>
                        </span>
                        <span style={{ "height": "8px", "borderRadius": "999px", "background": "#E4E4E0" }}>
                          <span style={{ "display": "block", "width": lookup(b, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "marginTop": "auto", "fontSize": "11px", "color": "#8C8C8C" }}>
                    {"Suma de las cotizaciones de ejemplo de esta vista."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Cotizaciones"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
