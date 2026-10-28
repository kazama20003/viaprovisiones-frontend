"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), seg: 'Todos', sel: 'c1' };
  }
  renderVals() {
    const accent = this.props.accent ?? '#FF914C';
    const st = this.state;
    const money = (n) => 'S/ ' + Math.round(n).toLocaleString('es-PE');
    const money2 = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const ini = (s) => s.replace(/\[|\]/g, '').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const ST = {
      'Al día': ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      'Por cobrar': ['#FFF4D6', '#7A4A00', 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18M12 7v5l3 2'],
      'Pago vencido': ['#FDE4E2', '#8E1C14', 'M12 3l9 16H3zM12 10v4M12 17h.01'],
      'Sin compras 60 d': ['#EFEFEC', '#4A4A4A', 'M6 12h12']
    };
    const TYPE = { Consumidor: 'Consumidores', Minorista: 'Minoristas y bodegas', Mayorista: 'Mayoristas', Empresa: 'Empresas' };
    const TIER = { Consumidor: 'Precio de tienda', Minorista: 'Precio minorista', Mayorista: 'Precio mayorista', Empresa: 'Precio empresa por volumen' };
    const C = (id, name, type, city, last, orders, total, cond, status, credit, contact) => ({ id, name, type, city, last, orders, total, cond, status, credit, contact });
    const CLDemo = [
      C('c1', 'Constructora [Cliente]', 'Empresa', 'Arequipa', 'Ayer', 18, 42380, 'Factura a 30 días', 'Por cobrar', [15000, 8460], '[Nombre] · Logística'),
      C('c2', 'Ferretería Cayma', 'Mayorista', 'Arequipa', 'Ayer', 26, 31940, 'Factura a 30 días', 'Al día', [10000, 6120], '[Nombre] · Dueño'),
      C('c3', 'Minera [Cliente]', 'Empresa', 'Moquegua', '12 oct', 6, 21600, 'Factura a 45 días', 'Al día', [20000, 1600], '[Nombre] · Compras'),
      C('c4', 'Distribuidora [Cliente]', 'Mayorista', 'Cusco', '08 oct', 11, 14230, 'Factura a 30 días', 'Al día', [8000, 0], '[Nombre] · Gerente'),
      C('c5', 'Hotel [Cliente]', 'Empresa', 'Arequipa', 'Ayer', 9, 12860, 'Factura a 15 días', 'Pago vencido', [6000, 2240], '[Nombre] · Mantenimiento'),
      C('c6', 'Bodega San Martín', 'Minorista', 'Arequipa', 'Hoy', 34, 9870, 'Contado · Yape', 'Al día', null, '[Nombre] · Dueña'),
      C('c7', 'Minimarket Yanahuara', 'Minorista', 'Arequipa', 'Ayer', 22, 5410, 'Contado · Plin', 'Al día', null, '[Nombre] · Dueño'),
      C('c8', 'Bazar [Cliente]', 'Minorista', 'Puno', '14 ago', 5, 2180, 'Contado', 'Sin compras 60 d', null, '[Nombre] · Dueña'),
      C('c9', 'Luis R.', 'Consumidor', 'Arequipa', 'Hoy', 4, 1749, 'Contado · Tarjeta', 'Al día', null, 'Luis R.'),
      C('c10', 'María Q.', 'Consumidor', 'Arequipa', 'Hoy', 7, 892, 'Contado · Yape', 'Al día', null, 'María Q.')
    ];
    const datosConectados = ['success', 'pending', 'error'].includes(this.props.apiClientesState);
    const CL = this.props.apiClientesState === 'success'
      ? (this.props.apiClientes || []).map((c) => {
          const tipo = { consumidor: 'Consumidor', minorista: 'Minorista', mayorista: 'Mayorista', empresa: 'Empresa' }[c.tipoCliente] || 'Consumidor';
          return C(c.id, c.razonSocial || c.nombre, tipo, '—', 'Sin compras', 0, 0,
            c.condicionPagoDias ? `Factura a ${c.condicionPagoDias} días` : 'Contado', 'Al día',
            c.limiteCredito > 0 ? [c.limiteCredito, 0] : null, c.correo || c.telefono || '—');
        })
      : datosConectados ? [] : CLDemo;
    const vis = CL.filter((c) => st.seg === 'Todos' || c.type === st.seg);
    const S = CL.find((c) => c.id === st.sel) || CL[0] || C('', 'Sin clientes registrados', 'Consumidor', '—', '—', 0, 0, '—', 'Al día', null, '—');
    const SEG = datosConectados
      ? ['Consumidor', 'Minorista', 'Mayorista', 'Empresa'].map((tipo) => [tipo, CL.filter((c) => c.type === tipo).length, CL.filter((c) => c.type === tipo).reduce((suma, c) => suma + c.total, 0)])
      : [['Consumidor', 214, 6900], ['Minorista', 142, 4980], ['Mayorista', 37, 3870], ['Empresa', 21, 2700]];
    const MON = ['May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct'];
    const NEW = [14, 17, 15, 19, 21, 23];
    const W = [0.13, 0.15, 0.14, 0.17, 0.19, 0.22];
    const sm = W.map((w) => Math.round(S.total * w * 0.45));
    const smMax = Math.max(...sm);
    const idx = CL.indexOf(S);
    const OST = { Pagado: ['#E3F1FF', '#0B4A8A'], Enviado: ['#EDE7FF', '#4A2E9A'], Entregado: ['#E4F4E7', '#1B5E20'] };
    const avg = S.total / Math.max(1, S.orders);
    const hist = [0, 1, 2].map((k) => {
      const status = k === 0 && (S.last === 'Hoy' || S.last === 'Ayer') ? 'Pagado' : 'Entregado';
      return { id: '#' + (1041 - idx * 2 - k * 9), date: [S.last, '02 oct', '18 set'][k], status, bg: OST[status][0], fg: OST[status][1], total: money2(avg * [1.1, 0.9, 1.05][k]) };
    });
    const corp = S.type === 'Empresa' || S.type === 'Mayorista';
    const quotes = corp ? [{ id: 'COT-0' + (231 + idx), sub: 'Vence en ' + (3 + idx) + ' días · ' + TIER[S.type], status: idx % 2 ? 'Enviada' : 'En negociación', total: money(avg * 1.6) }] : [];
    return {
      accent,
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      headStats: [
        { v: datosConectados ? String(CL.length) : '414', k1: 'Clientes', k2: 'registrados', bg: '#FFFFFF', fg: '#111111' },
        { v: datosConectados ? '—' : '62%', k1: 'Vuelven', k2: 'a comprar', bg: '#FFFFFF', fg: '#111111' },
        { v: datosConectados ? '—' : '3', k1: 'Pagos', k2: 'vencidos', bg: '#FDE4E2', fg: '#8E1C14' },
        { v: datosConectados ? '—' : 'S/ 18k', k1: 'Por', k2: 'cobrar', bg: '#111111', fg: '#FFFFFF' }
      ],
      segments: SEG.map((s) => ({
        name: TYPE[s[0]], n: String(s[1]), sales: money(s[2]), w: Math.round((s[2] / SEG[0][2]) * 100) + '%',
        pressed: st.seg === s[0] ? 'true' : 'false', border: st.seg === s[0] ? '#E8701F' : '#FFFFFF',
        pick: () => this.setState({ seg: st.seg === s[0] ? 'Todos' : s[0] })
      })),
      aging: [
        ['Al día', 'Dentro del plazo · 6 facturas', 'S/ 11,200', '#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
        ['Vence esta semana', '3 facturas', 'S/ 4,980', '#FFF4D6', '#7A4A00', 'M12 7v5l3 2'],
        ['Vencido', 'Más de 15 días · 3 facturas', 'S/ 2,240', '#FDE4E2', '#8E1C14', 'M12 4v10M12 18h.01']
      ].map((a) => ({ name: a[0], sub: a[1], v: a[2], bg: a[3], fg: a[4], icon: a[5] })),
      newMonths: NEW.map((n, i) => ({ t: MON[i], n: String(n), h: Math.round((n / 25) * 100) + '%', c: i === 5 ? '#E8701F' : '#F5C3A0' })),
      newAria: 'Clientes nuevos por mes: ' + NEW.map((n, i) => MON[i] + ' ' + n).join(', '),
      chips: ['Todos', 'Consumidor', 'Minorista', 'Mayorista', 'Empresa'].map((c) => ({
        name: c === 'Todos' ? 'Todos' : TYPE[c], pressed: st.seg === c ? 'true' : 'false',
        bg: st.seg === c ? '#111111' : '#FFFFFF', fg: st.seg === c ? '#FFFFFF' : '#111111', border: st.seg === c ? '#111111' : '#E4E4E0',
        pick: () => this.setState({ seg: c })
      })),
      rowsCount: String(vis.length),
      apiClientesState: this.props.apiClientesState,
      apiClientesError: this.props.apiClientesError || '',
      rows: vis.map((c) => {
        const on = c.id === S.id;
        return {
          name: c.name, city: c.city, type: TYPE[c.type], last: c.last, orders: String(c.orders), total: money(c.total), cond: c.cond, ini: ini(c.name),
          status: c.status, stBg: ST[c.status][0], stFg: ST[c.status][1], stIcon: ST[c.status][2],
          bg: on ? '#FFF6EF' : '#FFFFFF', avBg: on ? '#E8701F' : '#F4F4F2', avFg: on ? '#FFFFFF' : '#111111',
          select: () => this.setState({ sel: c.id })
        };
      }),
      sel: {
        name: S.name, type: TYPE[S.type], city: S.city, ini: ini(S.name), contact: S.contact,
        doc: corp || S.type === 'Minorista' ? '[RUC]' : '[DNI]', tier: TIER[S.type], cond: S.cond,
        status: S.status, stBg: ST[S.status][0], stFg: ST[S.status][1], stIcon: ST[S.status][2],
        total: money(S.total), ticket: money2(avg),
        hasCredit: !!S.credit,
        creditTxt: S.credit ? money(S.credit[1]) + ' usados de ' + money(S.credit[0]) : '',
        creditW: S.credit ? Math.round((S.credit[1] / S.credit[0]) * 100) + '%' : '0%',
        creditC: S.status === 'Pago vencido' ? '#D93025' : '#E8701F',
        creditFree: S.credit ? money(S.credit[0] - S.credit[1]) : '',
        months: sm.map((v, i) => ({ t: MON[i], v: money(v), h: Math.max(6, Math.round((v / smMax) * 100)) + '%', c: i === 5 ? '#E8701F' : '#F5C3A0' })),
        monthsAria: 'Compras por mes de ' + S.name + ': ' + sm.map((v, i) => MON[i] + ' ' + money(v)).join(', '),
        hist,
        quotes,
        noQuotes: quotes.length === 0
      },
      top: [['Constructora [Cliente]', 'Empresa', 5120], ['Ferretería Cayma', 'Mayorista', 3460], ['Minera [Cliente]', 'Empresa', 2980], ['Bodega San Martín', 'Minorista', 1840], ['Hotel [Cliente]', 'Empresa', 1210]].map((t, i) => ({ rank: String(i + 1), name: t[0], type: TYPE[t[1]], v: money(t[2]), w: Math.round((t[2] / 5120) * 100) + '%' })),
      reactivate: [['Bazar [Cliente]', 'Puno · 73 días sin comprar · 5 pedidos'], ['Hostal [Cliente]', 'Chivay · 65 días · 3 pedidos'], ['Ferretería [Cliente]', 'Mollendo · 61 días · 8 pedidos']].map((r) => ({ name: r[0], sub: r[1], ini: ini(r[0]) }))
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Clientes(props) {
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
                    <clipPath id={"via-clip-cli"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-cli)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Clientes"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Cartera y cobranzas"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Nuevo cliente"}
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
                    {"Buscar cliente"}
                  </span>
                  <input type={"search"} placeholder={"Nombre, RUC o celular…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Clientes"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {"23 nuevos en octubre"}
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
                <div style={{ "flex": "1.3 1 380px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Clientes por tipo"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Toca un tipo para filtrar la lista"}
                    </span>
                  </span>
                  {(lookup(v, "segments") || []).map((s, index2) => (
                    <Fragment key={index2}>
                      <button onClick={lookup(s, "pick")} aria-pressed={lookup(s, "pressed")} style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "padding": "12px 14px", "borderRadius": "18px", "border": "1px solid " + String(lookup(s, "border") ?? ""), "background": "#FFFFFF", "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "gap": "8px" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(s, "name")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                            <strong style={{ "fontSize": "15px", "color": "#111111" }}>
                              {lookup(s, "n")}
                            </strong>
                            {" · "}
                            {lookup(s, "sales")}
                            {" en oct."}
                          </span>
                        </span>
                        <span style={{ "height": "8px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                          <span style={{ "display": "block", "width": lookup(s, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Cuentas por cobrar"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                      {"Crédito a empresas"}
                    </span>
                  </span>
                  <span style={{ "fontSize": "40px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                    <span style={{ "color": "#FF914C" }}>
                      {"S/"}
                    </span>
                    {" 18,420"}
                  </span>
                  {(lookup(v, "aging") || []).map((a, index3) => (
                    <Fragment key={index3}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "borderRadius": "16px", "background": "#1E1E1E" }}>
                        <span style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "background": lookup(a, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(a, "fg")} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(a, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(a, "name")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#BDBDBD" }}>
                            {lookup(a, "sub")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                          {lookup(a, "v")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <DesignLink href={"/pedidos"} style={{ "marginTop": "auto", "height": "42px", "borderRadius": "999px", "background": "#FF914C", "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontSize": "13px", "fontWeight": "800" }}>
                    {"Ver facturas por cobrar"}
                  </DesignLink>
                </div>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Clientes nuevos por mes"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Mayo a octubre 2026"}
                    </span>
                  </span>
                  <div role={"img"} aria-label={lookup(v, "newAria")} style={{ "flex": "1", "minHeight": "190px", "display": "flex", "alignItems": "flex-end", "gap": "10px", "paddingTop": "10px" }}>
                    {(lookup(v, "newMonths") || []).map((m, index4) => (
                      <Fragment key={index4}>
                        <span style={{ "flex": "1", "height": "100%", "display": "flex", "flexDirection": "column", "justifyContent": "flex-end", "alignItems": "center", "gap": "6px" }}>
                          <span style={{ "fontSize": "12px", "fontWeight": "800" }}>
                            {lookup(m, "n")}
                          </span>
                          <span style={{ "width": "100%", "height": lookup(m, "h"), "borderRadius": "12px", "background": lookup(m, "c") }}></span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(m, "t")}
                          </span>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                    {"El 62 % de los clientes volvió a comprar dentro de los 90 días."}
                  </span>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "flex-start" }}>
                <div style={{ "flex": "2 1 640px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Lista de clientes"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(v, "rowsCount")}
                        {lookup(v, "apiClientesState") === "success" ? " clientes cargados del backend" : lookup(v, "apiClientesState") === "error" ? "No se pudo cargar la lista de clientes." : " mostrados de 414 · datos de ejemplo"}
                      </span>
                    </span>
                    <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "chips") || []).map((c, index5) => (
                        <Fragment key={index5}>
                          <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(c, "border") ?? ""), "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(c, "name")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className={"noscroll"} style={{ "overflowX": "auto", "background": "#FFFFFF", "borderRadius": "24px" }}>
                    <div style={{ "minWidth": "860px", "padding": "6px 10px" }}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "2.2fr 1.1fr 1fr 0.7fr 1.1fr 1.2fr 1.3fr", "gap": "10px", "padding": "12px 10px", "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                        <span>
                          {"Cliente"}
                        </span>
                        <span>
                          {"Tipo"}
                        </span>
                        <span>
                          {"Último pedido"}
                        </span>
                        <span>
                          {"Pedidos"}
                        </span>
                        <span>
                          {"Total comprado"}
                        </span>
                        <span>
                          {"Condición"}
                        </span>
                        <span>
                          {"Estado"}
                        </span>
                      </div>
                      {(lookup(v, "rows") || []).map((r, index6) => (
                        <Fragment key={index6}>
                          <button onClick={lookup(r, "select")} style={{ "width": "100%", "display": "grid", "gridTemplateColumns": "2.2fr 1.1fr 1fr 0.7fr 1.1fr 1.2fr 1.3fr", "gap": "10px", "alignItems": "center", "padding": "10px", "border": "none", "borderTop": "1px solid #F1F1EE", "borderRadius": "16px", "background": lookup(r, "bg"), "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111" }}>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "10px", "minWidth": "0" }}>
                              <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(r, "avBg"), "color": lookup(r, "avFg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "11px", "fontWeight": "800", "flex": "none" }}>
                                {lookup(r, "ini")}
                              </span>
                              <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                                <span style={{ "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                                  {lookup(r, "name")}
                                </span>
                                <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                                  {lookup(r, "city")}
                                </span>
                              </span>
                            </span>
                            <span style={{ "fontSize": "12px", "fontWeight": "600" }}>
                              {lookup(r, "type")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#444444" }}>
                              {lookup(r, "last")}
                            </span>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(r, "orders")}
                            </span>
                            <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                              {lookup(r, "total")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#444444" }}>
                              {lookup(r, "cond")}
                            </span>
                            <span style={{ "justifySelf": "start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": lookup(r, "stBg"), "color": lookup(r, "stFg"), "fontSize": "11px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                              <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(r, "stIcon")}></path>
                              </svg>
                              {lookup(r, "status")}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
                <div style={{ "flex": "1 1 380px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "14px" }}>
                    <span style={{ "width": "60px", "height": "60px", "borderRadius": "50%", "background": "#111111", "color": "#FF914C", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "18px", "fontWeight": "800", "flex": "none" }}>
                      {lookup(v, "sel.ini")}
                    </span>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px", "minWidth": "0" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(v, "sel.type")}
                        {" · "}
                        {lookup(v, "sel.city")}
                      </span>
                      <span style={{ "fontSize": "22px", "fontWeight": "800", "lineHeight": "1.15" }}>
                        {lookup(v, "sel.name")}
                      </span>
                    </span>
                  </div>
                  <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "5px 12px", "borderRadius": "999px", "background": lookup(v, "sel.stBg"), "color": lookup(v, "sel.stFg"), "fontSize": "12px", "fontWeight": "700" }}>
                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={lookup(v, "sel.stIcon")}></path>
                    </svg>
                    {lookup(v, "sel.status")}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                    <span style={{ "background": "#FFFFFF", "borderRadius": "18px", "padding": "12px", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"Total comprado"}
                      </span>
                      <span style={{ "fontSize": "17px", "fontWeight": "800" }}>
                        {lookup(v, "sel.total")}
                      </span>
                    </span>
                    <span style={{ "background": "#FFFFFF", "borderRadius": "18px", "padding": "12px", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"Ticket promedio"}
                      </span>
                      <span style={{ "fontSize": "17px", "fontWeight": "800" }}>
                        {lookup(v, "sel.ticket")}
                      </span>
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "22px", "padding": "14px 16px", "display": "flex", "flexDirection": "column", "gap": "10px", "fontSize": "13px" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Contacto"}
                      </span>
                      <span style={{ "fontWeight": "700", "textAlign": "right" }}>
                        {lookup(v, "sel.contact")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Celular"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"[CELULAR]"}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"RUC / DNI"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {lookup(v, "sel.doc")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Lista de precios"}
                      </span>
                      <span style={{ "fontWeight": "700", "color": "#C2410C", "textAlign": "right" }}>
                        {lookup(v, "sel.tier")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                      <span style={{ "color": "#6B6B6B" }}>
                        {"Condición de pago"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {lookup(v, "sel.cond")}
                      </span>
                    </span>
                  </div>
                  {Boolean(lookup(v, "sel.hasCredit")) && (
                    <Fragment>
                      <div style={{ "background": "#FFFFFF", "borderRadius": "22px", "padding": "14px 16px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                          <span style={{ "fontWeight": "700" }}>
                            {"Línea de crédito"}
                          </span>
                          <span style={{ "color": "#6B6B6B" }}>
                            {lookup(v, "sel.creditTxt")}
                          </span>
                        </span>
                        <span style={{ "height": "10px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                          <span style={{ "display": "block", "width": lookup(v, "sel.creditW"), "height": "100%", "borderRadius": "999px", "background": lookup(v, "sel.creditC") }}></span>
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                          {"Disponible: "}
                          <strong style={{ "color": "#111111" }}>
                            {lookup(v, "sel.creditFree")}
                          </strong>
                        </span>
                      </div>
                    </Fragment>
                  )}
                  <div style={{ "background": "#FFFFFF", "borderRadius": "22px", "padding": "14px 16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {"Compras por mes"}
                    </span>
                    <div role={"img"} aria-label={lookup(v, "sel.monthsAria")} style={{ "height": "90px", "display": "flex", "alignItems": "flex-end", "gap": "8px" }}>
                      {(lookup(v, "sel.months") || []).map((m, index7) => (
                        <Fragment key={index7}>
                          <span style={{ "flex": "1", "height": "100%", "display": "flex", "flexDirection": "column", "justifyContent": "flex-end", "alignItems": "center", "gap": "4px" }}>
                            <span title={lookup(m, "v")} style={{ "width": "100%", "height": lookup(m, "h"), "borderRadius": "8px", "background": lookup(m, "c") }}></span>
                            <span style={{ "fontSize": "10px", "color": "#6B6B6B" }}>
                              {lookup(m, "t")}
                            </span>
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "22px", "padding": "6px 16px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "padding": "10px 0 4px" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {"Últimos pedidos"}
                      </span>
                      <DesignLink href={"/pedidos"} style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C", "textDecoration": "none" }}>
                        {"Ver en pedidos →"}
                      </DesignLink>
                    </div>
                    {(lookup(v, "sel.hist") || []).map((o, index8) => (
                      <Fragment key={index8}>
                        <DesignLink href={"/pedidos"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px 0", "borderTop": "1px solid #F1F1EE", "textDecoration": "none" }}>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(o, "id")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(o, "date")}
                            </span>
                          </span>
                          <span style={{ "padding": "3px 9px", "borderRadius": "999px", "background": lookup(o, "bg"), "color": lookup(o, "fg"), "fontSize": "11px", "fontWeight": "700" }}>
                            {lookup(o, "status")}
                          </span>
                          <span style={{ "minWidth": "86px", "textAlign": "right", "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(o, "total")}
                          </span>
                        </DesignLink>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "22px", "padding": "6px 16px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "padding": "10px 0 4px" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {"Cotizaciones"}
                      </span>
                      <DesignLink href={"/cotizaciones"} style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C", "textDecoration": "none" }}>
                        {"Ver todas →"}
                      </DesignLink>
                    </div>
                    {(lookup(v, "sel.quotes") || []).map((q, index9) => (
                      <Fragment key={index9}>
                        <DesignLink href={"/cotizaciones"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px 0", "borderTop": "1px solid #F1F1EE", "textDecoration": "none" }}>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(q, "id")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(q, "sub")}
                            </span>
                          </span>
                          <span style={{ "padding": "3px 9px", "borderRadius": "999px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "11px", "fontWeight": "700" }}>
                            {lookup(q, "status")}
                          </span>
                          <span style={{ "minWidth": "86px", "textAlign": "right", "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(q, "total")}
                          </span>
                        </DesignLink>
                      </Fragment>
                    ))}
                    {Boolean(lookup(v, "sel.noQuotes")) && (
                      <Fragment>
                        <span style={{ "display": "block", "padding": "10px 0 12px", "borderTop": "1px solid #F1F1EE", "fontSize": "12px", "color": "#8C8C8C" }}>
                          {"Sin cotizaciones abiertas."}
                        </span>
                      </Fragment>
                    )}
                  </div>
                  <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                    <DesignLink href={"#whatsapp"} style={{ "flex": "1 1 140px", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "height": "44px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#4ADE80"} strokeWidth={"2"} aria-hidden={"true"}>
                        <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                      </svg>
                      {"WhatsApp"}
                    </DesignLink>
                    <DesignLink href={"/cotizaciones"} style={{ "flex": "1 1 140px", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "height": "44px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Nueva cotización"}
                    </DesignLink>
                    <DesignLink href={"/pedidos"} style={{ "flex": "1 1 140px", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "height": "44px", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Nuevo pedido"}
                    </DesignLink>
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                <div style={{ "flex": "1.4 1 460px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Mejores clientes de octubre"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Por monto comprado"}
                    </span>
                  </span>
                  {(lookup(v, "top") || []).map((t, index10) => (
                    <Fragment key={index10}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "borderRadius": "18px", "background": "#FFFFFF" }}>
                        <span style={{ "width": "26px", "fontSize": "14px", "fontWeight": "800", "color": "#C2410C" }}>
                          {lookup(t, "rank")}
                        </span>
                        <span style={{ "flex": "0 0 200px", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                            {lookup(t, "name")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(t, "type")}
                          </span>
                        </span>
                        <span style={{ "flex": "1", "height": "8px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                          <span style={{ "display": "block", "width": lookup(t, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                        </span>
                        <span style={{ "minWidth": "90px", "textAlign": "right", "fontSize": "14px", "fontWeight": "800" }}>
                          {lookup(t, "v")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 360px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Para reactivar"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Clientes que no compran hace más de 60 días"}
                    </span>
                  </span>
                  {(lookup(v, "reactivate") || []).map((r, index11) => (
                    <Fragment key={index11}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "18px", "background": "#FFFFFF" }}>
                        <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": "#EFEFEC", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "11px", "fontWeight": "800", "flex": "none" }}>
                          {lookup(r, "ini")}
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(r, "name")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(r, "sub")}
                          </span>
                        </span>
                        <DesignLink href={"#whatsapp"} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "display": "inline-flex", "alignItems": "center", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                          {"Escribir"}
                        </DesignLink>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "marginTop": "auto", "fontSize": "12px", "color": "#6B6B6B" }}>
                    {"Sugerencia: envíales la oferta de la semana desde Enlaces y QR."}
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
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Clientes"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
