"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), channel: 'Todos', sel: '#1041', moved: {} };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const st = this.state;
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const COLS = [['Por pagar', '#F2A100'], ['Pagado', '#2F7BD8'], ['Preparando', '#E8701F'], ['Enviado', '#7B5CD6'], ['Entregado', '#2E9E4F']];
    const NEXT = ['Confirmar pago', 'Preparar', 'Enviar', 'Entregado'];
    const L = (name, qty, price, img, lot) => ({ name, qty, price, img, lot });
    const ORD = [
      { id: '#1042', client: 'María Q.', type: 'Consumidor', channel: 'Web', time: '10:24', col: 0, tags: ['Yape', 'Recojo'], doc: 'boleta', lines: [L('Lámpara de camping recargable', 2, 69.9, 'a58999411e32d7481815ba8cdc175e97', 'L-0915'), L('Cable USB-C carga rápida 1 m', 1, 19.9, '3aba2390d3fbd5f06fdd2cede507b16f', 'L-0901')] },
      { id: '#1043', client: 'Ana T.', type: 'Consumidor', channel: 'WhatsApp', time: '11:02', col: 0, tags: ['Plin', 'Delivery'], doc: 'boleta', lines: [L('Collar dorado de cadena fina', 1, 29.9, '792438e54fa4b4d81f31171a2cf026f6', 'L-0820')] },
      { id: '#1041', client: 'Bodega San Martín', type: 'Minorista', channel: 'WhatsApp', time: '09:51', col: 1, tags: ['Transferencia', 'Delivery'], doc: 'factura', lines: [L('Foco LED 9 W luz cálida', 48, 8.9, '52dc55c2523393f8f60ab89499fa3ec1', 'L-1008'), L('Mosquetón llavero de aluminio', 30, 6.9, 'eb0c79147accd306bbd7a39d350a8e88', 'L-0830'), L('Ganchos de pared (set de 3)', 12, 9.9, 'b68602a2601d3a2d118c7190d31f96a1', 'L-0907')] },
      { id: '#1038', client: 'Constructora [Cliente]', type: 'Empresa', channel: 'Empresas', time: 'Ayer', col: 1, tags: ['Factura', 'Obra'], doc: 'factura', lines: [L('Extensión de uso rudo 5 m', 20, 45, '323e29809539c2fb4b229651c8081ee9', 'L-0928'), L('Panel solar monocristalino 100 W', 8, 349, '972ceb606bfca75ef6208d8d3966c77d', 'L-0805')] },
      { id: '#1044', client: 'Luis R.', type: 'Consumidor', channel: 'Web', time: '08:40', col: 2, tags: ['Tarjeta', 'Agencia'], doc: 'boleta', lines: [L('Estación de energía portátil', 1, 1290, '56a034356f25e7cd0fe7251db3cbbddc', 'L-0910')] },
      { id: '#1040', client: 'Ferretería Cayma', type: 'Mayorista', channel: 'Empresas', time: 'Ayer', col: 3, tags: ['Factura 30 días', 'Agencia'], doc: 'factura', lines: [L('Carrete de extensión 15 m', 10, 119, 'c390a322d80bcca52c15a80479e59e7b', 'L-0918'), L('Extensión de uso rudo 5 m', 30, 45, '323e29809539c2fb4b229651c8081ee9', 'L-0928')] },
      { id: '#1039', client: 'Hotel [Cliente]', type: 'Empresa', channel: 'Empresas', time: 'Ayer', col: 4, tags: ['Factura'], doc: 'factura', lines: [L('Foco LED 9 W luz cálida', 60, 8.9, '52dc55c2523393f8f60ab89499fa3ec1', 'L-0921')] },
      { id: '#1037', client: 'Minimarket Yanahuara', type: 'Minorista', channel: 'WhatsApp', time: 'Ayer', col: 4, tags: ['Yape'], doc: 'boleta', lines: [L('Cable USB-C carga rápida 1 m', 20, 15.9, '3aba2390d3fbd5f06fdd2cede507b16f', 'L-0901')] }
    ];
    const colOf = (o) => (o.id in st.moved ? st.moved[o.id] : o.col);
    const sum = (o) => o.lines.reduce((a, l) => a + l.qty * l.price, 0);
    const CH = ['Todos', 'Web', 'WhatsApp', 'Empresas'];
    const vis = ORD.filter((o) => st.channel === 'Todos' || o.channel === st.channel);
    const S = ORD.find((o) => o.id === st.sel) || ORD[0];
    const MI = (label, href, icon, on) => ({ label, href, icon, bg: on ? '#F4F4F2' : 'transparent', iconBg: on ? '#E8701F' : '#F4F4F2', iconFg: on ? '#FFFFFF' : '#111111' });
    return {
      accent,
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      activeCount: String(ORD.filter((o) => colOf(o) < 4).length),
      headStats: [
        { v: '126', k1: 'Pedidos', k2: 'en octubre', bg: '#FFFFFF', fg: '#111111' },
        { v: String(ORD.filter((o) => colOf(o) === 0).length), k1: 'Por', k2: 'pagar', bg: '#FFF4D6', fg: '#7A4A00' },
        { v: '3 h', k1: 'Preparación', k2: 'promedio', bg: '#FFFFFF', fg: '#111111' },
        { v: 'S/ 146', k1: 'Ticket', k2: 'promedio', bg: '#111111', fg: '#FFFFFF' }
      ],
      channels: CH.map((c) => ({ name: c, pressed: st.channel === c ? 'true' : 'false', bg: st.channel === c ? '#111111' : '#FFFFFF', fg: st.channel === c ? '#FFFFFF' : '#111111', border: st.channel === c ? '#111111' : '#E4E4E0', pick: () => this.setState({ channel: c }) })),
      columns: COLS.map((c, ci) => {
        const cards = vis.filter((o) => colOf(o) === ci).map((o) => {
          const on = o.id === S.id;
          return {
            id: o.id, client: o.client, type: o.type, channel: o.channel, time: o.time, items: String(o.lines.length), total: money(sum(o)),
            ini: o.client.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
            tags: o.tags.map((t) => ({ t })),
            bg: on ? '#FFF6EF' : '#FFFFFF', border: on ? '#E8701F' : '#EDEDEA',
            canAdvance: ci < 4, next: NEXT[Math.min(ci, 3)],
            btnBg: ci === 0 ? '#E8701F' : '#111111', btnFg: '#FFFFFF',
            select: () => this.setState({ sel: o.id }),
            advance: () => this.setState({ moved: { ...this.state.moved, [o.id]: ci + 1 }, sel: o.id })
          };
        });
        return { name: c[0], dot: c[1], count: String(cards.length), cards, empty: cards.length === 0 };
      }),
      sel: {
        id: S.id, client: S.client, channel: S.channel, time: S.time, total: money(sum(S)), doc: S.doc,
        status: COLS[colOf(S)][0], dot: COLS[colOf(S)][1],
        lines: S.lines.map((l) => ({ name: l.name, qty: String(l.qty), unit: money(l.price), total: money(l.qty * l.price), img: B + l.img, lot: l.lot }))
      },
      times: [['Confirmar pago', '25 min', 25], ['Preparar pedido', '3 h', 60], ['Entregar (Arequipa)', '1 día', 85]].map((t) => ({ name: t[0], v: t[1], w: t[2] + '%' })),
      deliveries: [
        ['Recojo en tienda', 'Dean Valdivia 533', '4', '#FFF1E6', '#8A3B0A', 'M3 9l1-5h16l1 5M4 9v11h16V9M3 9h18'],
        ['Delivery Arequipa', 'Motorizado · 2 rutas', '6', '#E3F1FF', '#0B4A8A', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5'],
        ['Agencia a provincias', 'Cusco, Puno, Moquegua', '3', '#EDE7FF', '#4A2E9A', 'M3 7h11v9H3zM14 10h4l3 3v3h-7']
      ].map((d) => ({ name: d[0], sub: d[1], n: d[2], bg: d[3], fg: d[4], icon: d[5] })),
      menu: [
        MI('Panel', '/dashboard', 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z'),
        MI('Pedidos', '/pedidos', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0', true),
        MI('Inventario y lotes', '/inventario', 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10'),
        MI('Tienda web', '/tienda', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18'),
        MI('Enlaces y QR', '/enlaces', 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z'),
        MI('Cerrar sesión', '/admin/login', 'M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10')
      ]
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Pedidos(props) {
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
                    <clipPath id={"via-clip-ped"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-ped)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Pedidos"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Tablero por estado"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Nuevo pedido"}
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
                    {"Buscar pedido"}
                  </span>
                  <input type={"search"} placeholder={"N° de pedido o cliente…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Pedidos"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "activeCount")}
                    {" en curso hoy"}
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
              <div style={{ "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                  <span style={{ "display": "flex", "flexDirection": "column" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Tablero de pedidos"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Usa \"Avanzar\" para mover un pedido al siguiente estado."}
                    </span>
                  </span>
                  <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                    {(lookup(v, "channels") || []).map((c, index2) => (
                      <Fragment key={index2}>
                        <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(c, "border") ?? ""), "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(c, "name")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(5, minmax(240px, 1fr))", "gap": "12px", "minWidth": "1240px" }}>
                    {(lookup(v, "columns") || []).map((col, index3) => (
                      <Fragment key={index3}>
                        <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "10px", "minHeight": "420px" }}>
                          <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "2px 4px 6px" }}>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "13px", "fontWeight": "800" }}>
                              <span style={{ "width": "10px", "height": "10px", "borderRadius": "50%", "background": lookup(col, "dot") }}></span>
                              {lookup(col, "name")}
                            </span>
                            <span style={{ "minWidth": "26px", "height": "24px", "borderRadius": "999px", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "12px", "fontWeight": "800" }}>
                              {lookup(col, "count")}
                            </span>
                          </div>
                          {(lookup(col, "cards") || []).map((o, index4) => (
                            <Fragment key={index4}>
                              <div style={{ "borderRadius": "18px", "background": lookup(o, "bg"), "border": "1px solid " + String(lookup(o, "border") ?? ""), "padding": "12px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                                <button onClick={lookup(o, "select")} style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "border": "none", "background": "transparent", "padding": "0", "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111" }}>
                                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "8px" }}>
                                    <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                                      {lookup(o, "id")}
                                    </span>
                                    <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                                      {lookup(o, "time")}
                                    </span>
                                  </span>
                                  <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                                    <span style={{ "width": "28px", "height": "28px", "borderRadius": "50%", "background": "#FFF1E6", "color": "#8A3B0A", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "10px", "fontWeight": "800", "flex": "none" }}>
                                      {lookup(o, "ini")}
                                    </span>
                                    <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                                      <span style={{ "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                                        {lookup(o, "client")}
                                      </span>
                                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                                        {lookup(o, "type")}
                                      </span>
                                    </span>
                                  </span>
                                  <span style={{ "display": "flex", "gap": "4px", "flexWrap": "wrap" }}>
                                    {(lookup(o, "tags") || []).map((t, index5) => (
                                      <Fragment key={index5}>
                                        <span style={{ "padding": "2px 8px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "10px", "fontWeight": "700" }}>
                                          {lookup(t, "t")}
                                        </span>
                                      </Fragment>
                                    ))}
                                  </span>
                                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                                    <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                                      {lookup(o, "items")}
                                      {" productos · "}
                                      {lookup(o, "channel")}
                                    </span>
                                    <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                                      {lookup(o, "total")}
                                    </span>
                                  </span>
                                </button>
                                {Boolean(lookup(o, "canAdvance")) && (
                                  <Fragment>
                                    <button onClick={lookup(o, "advance")} style={{ "height": "34px", "borderRadius": "999px", "border": "none", "background": lookup(o, "btnBg"), "color": lookup(o, "btnFg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                                      {lookup(o, "next")}
                                      {" →"}
                                    </button>
                                  </Fragment>
                                )}
                              </div>
                            </Fragment>
                          ))}
                          {Boolean(lookup(col, "empty")) && (
                            <Fragment>
                              <span style={{ "padding": "16px", "borderRadius": "16px", "border": "1px dashed #DADAD6", "fontSize": "12px", "color": "#8C8C8C", "textAlign": "center" }}>
                                {"Sin pedidos"}
                              </span>
                            </Fragment>
                          )}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "2 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Pedido seleccionado · "}
                        {lookup(v, "sel.channel")}
                        {" · "}
                        {lookup(v, "sel.time")}
                      </span>
                      <span style={{ "fontSize": "26px", "fontWeight": "800" }}>
                        {lookup(v, "sel.id")}
                        {" · "}
                        {lookup(v, "sel.client")}
                      </span>
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "36px", "padding": "0 14px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "fontSize": "12px", "fontWeight": "700" }}>
                      <span style={{ "width": "8px", "height": "8px", "borderRadius": "50%", "background": lookup(v, "sel.dot") }}></span>
                      {lookup(v, "sel.status")}
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "6px 16px" }}>
                    {(lookup(v, "sel.lines") || []).map((l, index6) => (
                      <Fragment key={index6}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 0", "borderBottom": "1px solid #F1F1EE", "flexWrap": "wrap" }}>
                          <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "46px", "height": "46px", "borderRadius": "14px", "objectFit": "cover", "flex": "none" }} />
                          <span style={{ "flex": "1 1 200px", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(l, "name")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(l, "qty")}
                              {" × "}
                              {lookup(l, "unit")}
                            </span>
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "11px", "fontWeight": "700" }}>
                            <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4"}></path>
                            </svg>
                            {"Sale del lote "}
                            {lookup(l, "lot")}
                          </span>
                          <span style={{ "minWidth": "90px", "textAlign": "right", "fontSize": "14px", "fontWeight": "800" }}>
                            {lookup(l, "total")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "14px 0 10px", "fontSize": "15px", "fontWeight": "800" }}>
                      <span>
                        {"Total"}
                      </span>
                      <span>
                        {lookup(v, "sel.total")}
                      </span>
                    </div>
                  </div>
                  <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                    <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "42px", "padding": "0 18px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#25A244"} strokeWidth={"2"} aria-hidden={"true"}>
                        <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                      </svg>
                      {"Escribir al cliente"}
                    </DesignLink>
                    <button style={{ "height": "42px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Imprimir "}
                      {lookup(v, "sel.doc")}
                    </button>
                    <DesignLink href={"/inventario"} style={{ "display": "inline-flex", "alignItems": "center", "height": "42px", "padding": "0 18px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Ver lotes en inventario"}
                    </DesignLink>
                    <DesignLink href={"/pedido/detalle"} style={{ "display": "inline-flex", "alignItems": "center", "height": "42px", "padding": "0 18px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Ver detalle completo"}
                    </DesignLink>
                  </div>
                </div>
                <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Tiempos de atención"}
                  </span>
                  {(lookup(v, "times") || []).map((t, index7) => (
                    <Fragment key={index7}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                          <span style={{ "color": "#CFCFCF" }}>
                            {lookup(t, "name")}
                          </span>
                          <span style={{ "fontWeight": "800" }}>
                            {lookup(t, "v")}
                          </span>
                        </span>
                        <span style={{ "height": "6px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                          <span style={{ "display": "block", "width": lookup(t, "w"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "marginTop": "auto", "fontSize": "12px", "color": "#BDBDBD" }}>
                    {"Meta: preparar en menos de 4 h los pedidos pagados antes de las 15:00."}
                  </span>
                </div>
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Entregas de hoy"}
                  </span>
                  {(lookup(v, "deliveries") || []).map((d, index8) => (
                    <Fragment key={index8}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "18px", "background": "#FFFFFF" }}>
                        <span style={{ "width": "36px", "height": "36px", "borderRadius": "12px", "background": lookup(d, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(d, "fg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(d, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(d, "name")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(d, "sub")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                          {lookup(d, "n")}
                        </span>
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
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Pedidos"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
