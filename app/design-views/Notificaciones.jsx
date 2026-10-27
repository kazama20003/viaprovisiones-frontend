"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), filter: 'Todas', read: {}, tfa: false, pwSaved: false, closed: {}, prefs: {} };
  }
  renderVals() {
    const st = this.state;
    // tipo → [etiqueta, fondo, texto, icono]
    const T = {
      Pedidos: ['Pedido', '#E3F1FF', '#0B4A8A', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0'],
      Stock: ['Stock y lotes', '#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01M10.3 3.9L2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'],
      Pagos: ['Pago', '#E4F4E7', '#1B5E20', 'M3 6h18v12H3zM3 10h18M7 15h4'],
      Cotizaciones: ['Cotización', '#EDE7FF', '#4A2E9A', 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4'],
      Sistema: ['Sistema', '#EFEFEC', '#444444', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2']
    };
    // [id, día, tipo, título, detalle, hora, enlace, acción, leído al inicio]
    const N = [
      ['n1', 'Hoy', 'Pedidos', 'Nuevo pedido #1043', 'María Q. · Tienda web · S/ 548.50 · pago por Yape', '10:42', '/pedido/detalle', 'Ver pedido'],
      ['n2', 'Hoy', 'Pagos', 'Constancia de Yape recibida', 'Pedido #1042 · S/ 159.70 · falta confirmar en la cuenta', '10:25', '/pedido/detalle', 'Confirmar pago'],
      ['n3', 'Hoy', 'Stock', 'Stock bajo: Foco LED 9 W luz cálida', 'Quedan 18 unidades (mínimo 40) · se vende del lote L-1008', '09:58', '/inventario', 'Ver inventario'],
      ['n4', 'Hoy', 'Cotizaciones', 'Cotización COT-0218 por vencer', 'Constructora [Cliente] · vence en 2 días · S/ 14,320.90', '09:30', '/cotizaciones', 'Ver cotización'],
      ['n5', 'Hoy', 'Sistema', 'Caja abierta por Beltran C.', 'Apertura con S/ 200.00', '08:30', '/caja', 'Ver caja', true],
      ['n6', 'Ayer', 'Stock', 'Lote L-1102 en camino', 'Panel solar 100 W · llega el 28 oct · OC-0417', '17:12', '/inventario', 'Ver lote'],
      ['n7', 'Ayer', 'Pedidos', 'Pedido #1040 enviado', 'Ferretería Cayma · agencia a Cusco', '15:40', '/pedidos', 'Ver pedidos', true],
      ['n8', 'Ayer', 'Sistema', '3 pedidos pagados sin comprobante', 'Emite las boletas para cerrar el día', '19:05', '/comprobantes', 'Emitir comprobantes'],
      ['n9', 'Esta semana', 'Pagos', 'Alquiler vence el 01 nov', 'Pago programado · S/ [MONTO]', 'Lun', '/gastos', 'Ver gastos'],
      ['n10', 'Esta semana', 'Cotizaciones', 'Cotización COT-0215 aceptada', 'Minera [Cliente] · S/ 8,940.00 · lista para pedido', 'Dom', '/cotizaciones', 'Convertir en pedido', true],
      ['n11', 'Esta semana', 'Sistema', 'Nuevo inicio de sesión', 'Celular Android · Arequipa', 'Sáb', '#sesiones', 'Revisar sesiones', true]
    ];
    const isRead = (n) => !!(st.read[n[0]] || n[8]);
    const CH = [['Todas', null], ['Sin leer', 'unread'], ['Pedidos', 'Pedidos'], ['Stock y lotes', 'Stock'], ['Pagos', 'Pagos'], ['Cotizaciones', 'Cotizaciones'], ['Sistema', 'Sistema']];
    const match = (n, key) => key === null ? true : (key === 'unread' ? !isRead(n) : n[2] === key);
    const cur = (CH.find((c) => c[0] === st.filter) || CH[0])[1];
    const list = N.filter((n) => match(n, cur));
    const unread = N.filter((n) => !isRead(n)).length;
    const groups = ['Hoy', 'Ayer', 'Esta semana'].map((d) => ({
      title: d,
      items: list.filter((n) => n[1] === d).map((n) => {
        const t = T[n[2]];
        const r = isRead(n);
        return {
          title: n[3], detail: n[4], time: n[5], href: n[6], cta: n[7], type: t[0], bg: t[1], fg: t[2], icon: t[3],
          unread: !r, isRead: r, weight: r ? '600' : '800', rowBg: r ? '#FFFFFF' : '#FBF7F3',
          read: () => this.setState({ read: Object.assign({}, st.read, { [n[0]]: true }) })
        };
      })
    })).filter((g) => g.items.length > 0);
    const OK = 'M5 12l5 5 9-10', NO = 'M8 12h8';
    const PREF = [
      ['Pedidos nuevos', [1, 1, 0]], ['Pagos y constancias', [1, 1, 1]], ['Stock bajo y lotes', [1, 0, 1]],
      ['Cotizaciones', [1, 1, 0]], ['Comprobantes SUNAT', [1, 0, 1]], ['Inicios de sesión', [1, 0, 1]]
    ];
    const chNames = ['en el panel', 'por WhatsApp', 'por correo'];
    const SES = [
      ['s1', 'Computadora · Chrome', 'Arequipa · ahora', 'M3 5h18v11H3zM8 20h8M12 16v4', true],
      ['s2', 'Celular Android', 'Arequipa · hace 2 h', 'M7 3h10v18H7zM11 18h2'],
      ['s3', 'Tablet del mostrador', 'Tienda · ayer 18:40', 'M5 3h14v18H5zM11 18h2']
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
      unreadText: unread ? unread + (unread === 1 ? ' aviso sin leer' : ' avisos sin leer') : 'todo al día',
      headStats: [
        [String(unread), 'Sin leer', 'en todos los tipos', unread ? '#E8701F' : '#FFFFFF', unread ? '#FFFFFF' : '#111111'],
        [String(N.filter((n) => n[2] === 'Pedidos').length), 'Pedidos', 'esta semana', '#FFFFFF', '#111111'],
        [String(N.filter((n) => n[2] === 'Stock').length), 'Stock y lotes', 'requieren mirar', '#FFFFFF', '#111111'],
        [String(SES.length - Object.keys(st.closed).length), 'Sesiones', 'activas', '#FFFFFF', '#111111']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      readAll: () => { const r = {}; N.forEach((n) => { r[n[0]] = true; }); this.setState({ read: r }); },
      chips: CH.map((c) => {
        const on = c[0] === st.filter;
        const n = N.filter((x) => match(x, c[1])).length;
        return { label: c[0], n: String(n), pressed: on ? 'true' : 'false', bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', nBg: on ? '#E8701F' : '#FFFFFF', nFg: on ? '#FFFFFF' : '#6B6B6B', pick: () => this.setState({ filter: c[0] }) };
      }),
      shownText: list.length + (list.length === 1 ? ' aviso' : ' avisos') + ' · ejemplo',
      empty: list.length === 0,
      groups,
      savePw: () => this.setState({ pwSaved: !st.pwSaved }),
      pwSaved: st.pwSaved,
      toggle2fa: () => this.setState({ tfa: !st.tfa }),
      tfaPressed: st.tfa ? 'true' : 'false',
      tfaText: st.tfa ? 'Activada · código por WhatsApp al ingresar' : 'Desactivada · recomendada para administradores',
      tfaTrack: st.tfa ? '#E8701F' : '#CFCFCB',
      tfaJustify: st.tfa ? 'flex-end' : 'flex-start',
      sessions: SES.filter((s) => !st.closed[s[0]]).map((s) => ({
        device: s[1], where: s[2], icon: s[3], current: !!s[4], closable: !s[4],
        close: () => this.setState({ closed: Object.assign({}, st.closed, { [s[0]]: true }) })
      })),
      prefs: PREF.map((p, pi) => ({
        label: p[0],
        ch: p[1].map((def, ci) => {
          const k = pi + '-' + ci;
          const on = st.prefs[k] === undefined ? !!def : st.prefs[k];
          return {
            pressed: on ? 'true' : 'false', aria: p[0] + ' ' + chNames[ci] + (on ? ': activado' : ': desactivado'),
            bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FF914C' : '#BDBDBD', icon: on ? OK : NO,
            toggle: () => this.setState({ prefs: Object.assign({}, st.prefs, { [k]: !on }) })
          };
        })
      }))
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Notificaciones(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.nt-item:hover{background:#FAFAF8}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Notificaciones"} onPin={lookup(v, "togglePin")} />
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
                    <clipPath id={"via-clip-not"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-not)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Notificaciones"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Avisos y tu perfil"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "readAll")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M2 12l5 5L18 6M12 17l1 1L22 9"}></path>
                  </svg>
                  {"Marcar todo como leído"}
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Notificaciones"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "unreadText")}
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
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 640px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                  <span style={{ "fontSize": "20px", "fontWeight": "700" }}>
                    {"Centro de avisos"}
                  </span>
                  <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                    {lookup(v, "shownText")}
                  </span>
                </div>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                  {(lookup(v, "chips") || []).map((c, index2) => (
                    <Fragment key={index2}>
                      <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "whiteSpace": "nowrap", "flex": "none" }}>
                        {lookup(c, "label")}
                        <span style={{ "minWidth": "20px", "height": "20px", "padding": "0 6px", "boxSizing": "border-box", "borderRadius": "999px", "background": lookup(c, "nBg"), "color": lookup(c, "nFg"), "fontSize": "11px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          {lookup(c, "n")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                {Boolean(lookup(v, "empty")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "10px", "padding": "48px 20px", "borderRadius": "24px", "background": "#F4F4F2", "textAlign": "center" }}>
                      <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#E4F4E7", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1B5E20"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                      </span>
                      <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                        {"Todo al día"}
                      </span>
                      <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                        {"No hay avisos en este filtro."}
                      </span>
                    </div>
                  </Fragment>
                )}
                {(lookup(v, "groups") || []).map((g, index3) => (
                  <Fragment key={index3}>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#8C8C8C", "padding": "4px 4px 2px" }}>
                        {lookup(g, "title")}
                      </span>
                      {(lookup(g, "items") || []).map((n, index4) => (
                        <Fragment key={index4}>
                          <div className={"nt-item"} style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "12px", "borderRadius": "22px", "background": lookup(n, "rowBg") }}>
                            <span style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": lookup(n, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(n, "fg")} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(n, "icon")}></path>
                              </svg>
                            </span>
                            <DesignLink href={lookup(n, "href")} style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "2px", "textDecoration": "none", "lineHeight": "1.3" }}>
                              <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "flexWrap": "wrap" }}>
                                <span style={{ "fontSize": "14px", "fontWeight": lookup(n, "weight") }}>
                                  {lookup(n, "title")}
                                </span>
                                <span style={{ "height": "22px", "padding": "0 9px", "borderRadius": "999px", "background": lookup(n, "bg"), "color": lookup(n, "fg"), "fontSize": "11px", "fontWeight": "700", "display": "inline-flex", "alignItems": "center" }}>
                                  {lookup(n, "type")}
                                </span>
                              </span>
                              <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                                {lookup(n, "detail")}
                              </span>
                              <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C" }}>
                                {lookup(n, "cta")}
                                {" →"}
                              </span>
                            </DesignLink>
                            <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "8px", "flex": "none" }}>
                              <span style={{ "fontSize": "12px", "color": "#8C8C8C", "whiteSpace": "nowrap" }}>
                                {lookup(n, "time")}
                              </span>
                              {Boolean(lookup(n, "unread")) && (
                                <Fragment>
                                  <button onClick={lookup(n, "read")} aria-label={"Marcar como leído"} title={"Marcar como leído"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "30px", "padding": "0 10px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "11px", "fontWeight": "700", "color": "#111111" }}>
                                    <span style={{ "width": "8px", "height": "8px", "borderRadius": "50%", "background": "#E8701F" }}></span>
                                    {"Sin leer"}
                                  </button>
                                </Fragment>
                              )}
                              {Boolean(lookup(n, "isRead")) && (
                                <Fragment>
                                  <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "fontSize": "11px", "fontWeight": "600", "color": "#8C8C8C" }}>
                                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                      <path d={"M5 12l5 5 9-10"}></path>
                                    </svg>
                                    {"Leído"}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ "flex": "1 1 360px", "minWidth": "0", "maxWidth": "460px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "14px" }}>
                    <span style={{ "width": "72px", "height": "72px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "24px", "fontWeight": "800", "flex": "none" }}>
                      {"BC"}
                    </span>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Beltran Carlos Ccapa"}
                      </span>
                      <span style={{ "fontSize": "13px", "color": "#BDBDBD" }}>
                        {"Gerente Comercial"}
                      </span>
                      <span style={{ "alignSelf": "flex-start", "marginTop": "6px", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "24px", "padding": "0 10px", "borderRadius": "999px", "background": "#2A2A2A", "fontSize": "11px", "fontWeight": "700" }}>
                        <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FF914C"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"}></path>
                        </svg>
                        {"Administrador"}
                      </span>
                    </span>
                  </div>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "0" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px", "padding": "10px 0", "borderTop": "1px solid #2A2A2A", "fontSize": "13px" }}>
                      <span style={{ "color": "#9A9A9A" }}>
                        {"Correo"}
                      </span>
                      <span style={{ "fontWeight": "600" }}>
                        {"viaprovisionesperu@gmail.com"}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px", "padding": "10px 0", "borderTop": "1px solid #2A2A2A", "fontSize": "13px" }}>
                      <span style={{ "color": "#9A9A9A" }}>
                        {"Celular"}
                      </span>
                      <span style={{ "fontWeight": "600" }}>
                        {"+51 954 802 744"}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px", "padding": "10px 0", "borderTop": "1px solid #2A2A2A", "fontSize": "13px" }}>
                      <span style={{ "color": "#9A9A9A" }}>
                        {"Tienda"}
                      </span>
                      <span style={{ "fontWeight": "600" }}>
                        {"Dean Valdivia 533 · Arequipa"}
                      </span>
                    </span>
                  </div>
                  <div style={{ "display": "flex", "gap": "8px" }}>
                    <button style={{ "flex": "1", "height": "44px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Cambiar foto"}
                    </button>
                    <DesignLink href={"/ajustes"} style={{ "flex": "1", "height": "44px", "borderRadius": "999px", "background": "#2A2A2A", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Editar datos"}
                    </DesignLink>
                  </div>
                </div>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Seguridad"}
                  </span>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                    {"Contraseña actual"}
                    <input type={"password"} placeholder={"••••••••"} autoComplete={"current-password"} style={{ "height": "44px", "border": "1px solid #E4E4E0", "borderRadius": "14px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "14px", "background": "#F4F4F2" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                    {"Nueva contraseña"}
                    <input type={"password"} placeholder={"Mínimo 8 caracteres"} autoComplete={"new-password"} style={{ "height": "44px", "border": "1px solid #E4E4E0", "borderRadius": "14px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "14px", "background": "#F4F4F2" }} />
                  </label>
                  <button onClick={lookup(v, "savePw")} style={{ "height": "44px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                    {"Cambiar contraseña"}
                  </button>
                  {Boolean(lookup(v, "pwSaved")) && (
                    <Fragment>
                      <span role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "8px", "padding": "10px 12px", "borderRadius": "14px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "12px", "fontWeight": "600" }}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                        {"Ejemplo: contraseña actualizada."}
                      </span>
                    </Fragment>
                  )}
                  <button onClick={lookup(v, "toggle2fa")} aria-pressed={lookup(v, "tfaPressed")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "18px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left" }}>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700", "color": "#111111" }}>
                        {"Verificación en dos pasos"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(v, "tfaText")}
                      </span>
                    </span>
                    <span style={{ "width": "46px", "height": "28px", "borderRadius": "999px", "background": lookup(v, "tfaTrack"), "display": "flex", "alignItems": "center", "padding": "3px", "boxSizing": "border-box", "justifyContent": lookup(v, "tfaJustify") }}>
                      <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                    </span>
                  </button>
                  <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#8C8C8C", "paddingTop": "4px" }}>
                    {"Sesiones activas"}
                  </span>
                  {(lookup(v, "sessions") || []).map((s, index5) => (
                    <Fragment key={index5}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                        <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(s, "device")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {lookup(s, "where")}
                          </span>
                        </span>
                        {Boolean(lookup(s, "current")) && (
                          <Fragment>
                            <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#1B5E20", "background": "#E4F4E7", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "display": "flex", "alignItems": "center" }}>
                              {"Esta sesión"}
                            </span>
                          </Fragment>
                        )}
                        {Boolean(lookup(s, "closable")) && (
                          <Fragment>
                            <button onClick={lookup(s, "close")} style={{ "height": "32px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid #E4E4E0", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                              {"Cerrar"}
                            </button>
                          </Fragment>
                        )}
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                      {"Preferencias de avisos"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Dónde te llega cada tipo de aviso"}
                    </span>
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "minmax(0, 1.6fr) repeat(3, minmax(0, 1fr))", "gap": "6px", "alignItems": "center", "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C" }}>
                    <span></span>
                    <span style={{ "textAlign": "center" }}>
                      {"Panel"}
                    </span>
                    <span style={{ "textAlign": "center" }}>
                      {"WhatsApp"}
                    </span>
                    <span style={{ "textAlign": "center" }}>
                      {"Correo"}
                    </span>
                  </div>
                  {(lookup(v, "prefs") || []).map((p, index6) => (
                    <Fragment key={index6}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "minmax(0, 1.6fr) repeat(3, minmax(0, 1fr))", "gap": "6px", "alignItems": "center", "padding": "6px 0", "borderTop": "1px solid #F0F0EC" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                          {lookup(p, "label")}
                        </span>
                        {(lookup(p, "ch") || []).map((x, index7) => (
                          <Fragment key={index7}>
                            <button onClick={lookup(x, "toggle")} aria-pressed={lookup(x, "pressed")} aria-label={lookup(x, "aria")} style={{ "justifySelf": "center", "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": lookup(x, "bg"), "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(x, "fg")} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(x, "icon")}></path>
                              </svg>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </Fragment>
                  ))}
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "18px", "background": "#FFF1E6" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#8A3B0A"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                      <path d={"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2"}></path>
                    </svg>
                    <span style={{ "fontSize": "12px", "lineHeight": "1.45", "color": "#8A3B0A" }}>
                      <strong>
                        {"Resumen diario"}
                      </strong>
                      {" por WhatsApp a las [HORA]: ventas del día, pedidos por atender y stock bajo."}
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
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Notificaciones"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
