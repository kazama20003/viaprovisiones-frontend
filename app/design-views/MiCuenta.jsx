"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { logged: true, auth: 0, tab: 0, mainAddr: 0, extra: 0, wishOff: {}, saved: false };
  }
  renderVals() {
    const st = this.state;
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const B = 'img/';
    const ST = {
      'En camino': ['#E3F1FF', '#0B4A8A', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5'],
      'Entregado': ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      'Por pagar': ['#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01'],
      'Cancelado': ['#F2F2F2', '#444444', 'M6 6l12 12M18 6L6 18']
    };
    const ORD = [
      ['#1043', '26 oct 2026 · Delivery Arequipa · 6 productos', 'En camino', 548.5, ['a58999411e32d7481815ba8cdc175e97', '972ceb606bfca75ef6208d8d3966c77d']],
      ['#0987', '12 set 2026 · Recojo en tienda · 4 productos', 'Entregado', 72.6, ['52dc55c2523393f8f60ab89499fa3ec1']],
      ['#0912', '20 ago 2026 · Delivery Arequipa · 2 productos', 'Entregado', 128, ['323e29809539c2fb4b229651c8081ee9', '3aba2390d3fbd5f06fdd2cede507b16f']],
      ['#0860', '02 ago 2026 · Agencia a Cusco · 1 producto', 'Cancelado', 349, ['972ceb606bfca75ef6208d8d3966c77d']]
    ];
    const ADDR = [
      ['Casa', '[DIRECCIÓN], Cayma, Arequipa', 'Referencia: [REFERENCIA]'],
      ['Trabajo', '[DIRECCIÓN], Cercado, Arequipa', 'Horario: lunes a viernes de 9 a 6'],
      ['Nueva dirección', '[DIRECCIÓN], [DISTRITO]', 'Ejemplo agregado']
    ].slice(0, 2 + Math.min(st.extra, 1));
    const WISH = [
      ['w1', 'Focos', 'Foco LED 9 W luz cálida', 8.9, '52dc55c2523393f8f60ab89499fa3ec1'],
      ['w2', 'Extensiones', 'Extensión de uso rudo 5 m', 45, '323e29809539c2fb4b229651c8081ee9'],
      ['w3', 'Camping', 'Lámpara de camping recargable', 69.9, 'a58999411e32d7481815ba8cdc175e97']
    ].filter((w) => !st.wishOff[w[0]]);
    const TABS = [
      ['Mis pedidos', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0', String(ORD.length)],
      ['Direcciones', 'M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', String(ADDR.length)],
      ['Datos personales', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21v-1a8 8 0 0 1 16 0v1', ''],
      ['Facturación', 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4', ''],
      ['Lista de deseos', 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z', String(WISH.length)]
    ];
    const reg = st.auth === 1;
    return {
      accent: this.props.accent ?? '#FF914C',
      loggedIn: st.logged,
      loggedOut: !st.logged,
      authTabs: ['Ingresar', 'Crear cuenta'].map((n, i) => ({ name: n, on: st.auth === i ? 'true' : 'false', bg: st.auth === i ? '#111111' : 'transparent', fg: st.auth === i ? '#FFFFFF' : '#111111', pick: () => this.setState({ auth: i }) })),
      isRegister: reg,
      authCta: reg ? 'Crear mi cuenta' : 'Ingresar',
      authNote: reg ? 'Al crear tu cuenta aceptas los términos y la política de privacidad.' : '¿Olvidaste tu contraseña? Te enviamos un enlace a tu correo.',
      login: () => this.setState({ logged: true, tab: 0 }),
      logout: () => this.setState({ logged: false, auth: 0 }),
      perks: [
        ['Sigue tus pedidos en tiempo real', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5'],
        ['Guarda tus direcciones y datos de factura', 'M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z'],
        ['Vuelve a comprar con un clic', 'M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3M18 3v4h-4M6 21v-4h4'],
        ['Lista de deseos y avisos de ofertas', 'M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z']
      ].map((p) => ({ text: p[0], icon: p[1] })),
      stats: [['4', 'pedidos'], ['S/ 1,098', 'comprado'], ['1', 'en camino']].map((s) => ({ v: s[0], k: s[1] })),
      tabs: TABS.map((t, i) => ({ name: t[0], icon: t[1], count: t[2], current: st.tab === i ? 'page' : 'false', cls: st.tab === i ? '' : 'mc-tab', bg: st.tab === i ? '#111111' : 'transparent', fg: st.tab === i ? '#FFFFFF' : '#111111', pick: () => this.setState({ tab: i, saved: false }) })),
      tabTitle: TABS[st.tab][0],
      tOrders: st.tab === 0,
      tAddr: st.tab === 1,
      tData: st.tab === 2,
      tBill: st.tab === 3,
      tWish: st.tab === 4,
      orders: ORD.map((o) => ({ id: 'Pedido ' + o[0], meta: o[1], status: o[2], total: money(o[3]), bg: ST[o[2]][0], fg: ST[o[2]][1], icon: ST[o[2]][2], imgs: o[4].map((x) => ({ src: B + x })) })),
      addresses: ADDR.map((a, i) => ({ name: a[0], line: a[1], ref: a[2], main: st.mainAddr === i, border: st.mainAddr === i ? '#111111' : '#DADADA', makeMain: () => this.setState({ mainAddr: i }) })),
      addAddress: () => this.setState({ extra: st.extra + 1 }),
      wish: WISH.map((w) => ({ cat: w[1], name: w[2], price: money(w[3]), img: B + w[4], remove: () => this.setState({ wishOff: { ...st.wishOff, [w[0]]: true } }) })),
      wishEmpty: WISH.length === 0,
      save: () => this.setState({ saved: true }),
      saved: st.saved
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function MiCuenta(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.marquee{animation:via-marquee 40s linear infinite}\n@keyframes via-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion: reduce){.marquee{animation:none}}\nhtml,body{scrollbar-width:none;-ms-overflow-style:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}\n.mc-tab:hover{background:#F2F2F2}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={"0"} active={""} />
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "48px 40px 80px" }}>
        {Boolean(lookup(v, "loggedOut")) && (
          <Fragment>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "48px", "alignItems": "stretch" }}>
              <div style={{ "flex": "1 1 460px", "display": "flex", "flexDirection": "column", "gap": "24px", "maxWidth": "560px" }}>
                <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "56px", "textTransform": "uppercase", "lineHeight": "1" }}>
                  {"Mi cuenta"}
                </h1>
                <div role={"tablist"} style={{ "display": "flex", "gap": "6px", "padding": "6px", "border": "2px solid #111111", "borderRadius": "999px", "alignSelf": "flex-start" }}>
                  {(lookup(v, "authTabs") || []).map((t, index1) => (
                    <Fragment key={index1}>
                      <button role={"tab"} aria-selected={lookup(t, "on")} onClick={lookup(t, "pick")} style={{ "height": "44px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                        {lookup(t, "name")}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <form style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  {Boolean(lookup(v, "isRegister")) && (
                    <Fragment>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                        {"Nombre y apellido"}
                        <input type={"text"} placeholder={"Ej. María Quispe"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                        {"Celular"}
                        <input type={"tel"} placeholder={"+51 9•• ••• •••"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                    </Fragment>
                  )}
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"Correo"}
                    <input type={"email"} placeholder={"tucorreo@ejemplo.com"} autoComplete={"username"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"Contraseña"}
                    <input type={"password"} placeholder={"••••••••"} autoComplete={"current-password"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                  </label>
                  <button type={"button"} onClick={lookup(v, "login")} style={{ "height": "56px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {lookup(v, "authCta")}
                  </button>
                  <span style={{ "fontSize": "14px", "color": "#444444" }}>
                    {lookup(v, "authNote")}
                  </span>
                </form>
              </div>
              <div style={{ "flex": "1 1 460px", "borderRadius": "28px", "background": "#111111", "color": "#FFFFFF", "padding": "40px", "display": "flex", "flexDirection": "column", "justifyContent": "space-between", "gap": "28px" }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "40px", "textTransform": "uppercase", "lineHeight": "1" }}>
                  {"Con tu cuenta compras más rápido"}
                </span>
                <ul style={{ "margin": "0", "padding": "0", "listStyle": "none", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  {(lookup(v, "perks") || []).map((p, index2) => (
                    <Fragment key={index2}>
                      <li style={{ "display": "flex", "gap": "14px", "alignItems": "center", "fontSize": "17px" }}>
                        <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(p, "icon")}></path>
                          </svg>
                        </span>
                        {lookup(p, "text")}
                      </li>
                    </Fragment>
                  ))}
                </ul>
                <a href={"/empresas"} style={{ "color": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px" }}>
                  {"¿Compras para tu negocio? Precios para empresas →"}
                </a>
              </div>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "loggedIn")) && (
          <Fragment>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "24px", "alignItems": "flex-end", "justifyContent": "space-between", "marginBottom": "32px" }}>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Mi cuenta · cliente de ejemplo"}
                </span>
                <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "56px", "textTransform": "uppercase", "lineHeight": "1" }}>
                  {"Hola, María"}
                </h1>
              </div>
              <div style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap" }}>
                {(lookup(v, "stats") || []).map((s, index3) => (
                  <Fragment key={index3}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "14px 20px", "border": "2px solid #111111", "borderRadius": "18px", "minWidth": "120px" }}>
                      <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900" }}>
                        {lookup(s, "v")}
                      </span>
                      <span style={{ "fontSize": "13px", "color": "#444444" }}>
                        {lookup(s, "k")}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "32px", "alignItems": "flex-start" }}>
              <nav aria-label={"Secciones de mi cuenta"} style={{ "flex": "1 1 260px", "maxWidth": "300px", "display": "flex", "flexDirection": "column", "gap": "4px", "border": "2px solid #111111", "borderRadius": "24px", "padding": "10px" }}>
                {(lookup(v, "tabs") || []).map((t, index4) => (
                  <Fragment key={index4}>
                    <button onClick={lookup(t, "pick")} className={lookup(t, "cls")} aria-current={lookup(t, "current")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "15px", "fontWeight": "700", "textAlign": "left" }}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(t, "icon")}></path>
                      </svg>
                      <span style={{ "flex": "1" }}>
                        {lookup(t, "name")}
                      </span>
                      <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px" }}>
                        {lookup(t, "count")}
                      </span>
                    </button>
                  </Fragment>
                ))}
                <button onClick={lookup(v, "logout")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": "transparent", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "15px", "fontWeight": "700", "color": "#8E1C14", "textAlign": "left" }}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"}></path>
                  </svg>
                  {"Cerrar sesión"}
                </button>
              </nav>
              <section aria-label={lookup(v, "tabTitle")} style={{ "flex": "999 1 640px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "20px" }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "32px", "fontWeight": "900", "textTransform": "uppercase" }}>
                  {lookup(v, "tabTitle")}
                </span>
                {Boolean(lookup(v, "tOrders")) && (
                  <Fragment>
                    {(lookup(v, "orders") || []).map((o, index5) => (
                      <Fragment key={index5}>
                        <div style={{ "border": "1px solid #111111", "borderRadius": "20px", "padding": "20px", "display": "flex", "flexWrap": "wrap", "gap": "18px", "alignItems": "center" }}>
                          <div style={{ "display": "flex", "gap": "6px" }}>
                            {(lookup(o, "imgs") || []).map((im, index6) => (
                              <Fragment key={index6}>
                                <img src={assetSrc(lookup(im, "src"))} alt={""} style={{ "width": "64px", "height": "64px", "objectFit": "cover", "borderRadius": "12px" }} />
                              </Fragment>
                            ))}
                          </div>
                          <span style={{ "flex": "1 1 200px", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700" }}>
                              {lookup(o, "id")}
                            </span>
                            <span style={{ "fontSize": "14px", "color": "#444444" }}>
                              {lookup(o, "meta")}
                            </span>
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "34px", "padding": "0 14px", "borderRadius": "999px", "background": lookup(o, "bg"), "color": lookup(o, "fg"), "fontSize": "13px", "fontWeight": "700" }}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(o, "icon")}></path>
                            </svg>
                            {lookup(o, "status")}
                          </span>
                          <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "900", "minWidth": "120px", "textAlign": "right" }}>
                            {lookup(o, "total")}
                          </span>
                          <span style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                            <a href={"/seguimiento"} style={{ "display": "inline-flex", "alignItems": "center", "height": "44px", "padding": "0 18px", "borderRadius": "999px", "border": "2px solid #111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                              {"Ver seguimiento"}
                            </a>
                            <a href={"/carrito"} style={{ "display": "inline-flex", "alignItems": "center", "height": "44px", "padding": "0 18px", "borderRadius": "999px", "background": lookup(v, "accent"), "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                              {"Volver a comprar"}
                            </a>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </Fragment>
                )}
                {Boolean(lookup(v, "tAddr")) && (
                  <Fragment>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                      {(lookup(v, "addresses") || []).map((a, index7) => (
                        <Fragment key={index7}>
                          <div style={{ "border": "2px solid " + String(lookup(a, "border") ?? ""), "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "20px", "fontWeight": "800", "textTransform": "uppercase" }}>
                                {lookup(a, "name")}
                              </span>
                              {Boolean(lookup(a, "main")) && (
                                <Fragment>
                                  <span style={{ "padding": "4px 10px", "borderRadius": "999px", "background": lookup(v, "accent"), "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                                    {"Principal"}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                            <span style={{ "fontSize": "15px", "lineHeight": "1.5" }}>
                              {lookup(a, "line")}
                            </span>
                            <span style={{ "fontSize": "13px", "color": "#444444" }}>
                              {lookup(a, "ref")}
                            </span>
                            <span style={{ "display": "flex", "gap": "14px", "fontSize": "14px", "fontWeight": "700" }}>
                              <a href={"#editar"}>
                                {"Editar"}
                              </a>
                              <button onClick={lookup(a, "makeMain")} style={{ "border": "none", "background": "transparent", "padding": "0", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700", "textDecoration": "underline" }}>
                                {"Usar como principal"}
                              </button>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                      <button onClick={lookup(v, "addAddress")} style={{ "minHeight": "160px", "border": "2px dashed #111111", "borderRadius": "20px", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                        {"+ Agregar dirección"}
                      </button>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "tData")) && (
                  <Fragment>
                    <form style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px", "maxWidth": "760px" }}>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                        {"Nombre y apellido"}
                        <input type={"text"} defaultValue={"María Quispe"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                        {"DNI"}
                        <input type={"text"} defaultValue={"[DNI]"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                        {"Celular"}
                        <input type={"tel"} defaultValue={"+51 [CELULAR]"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                        {"Correo"}
                        <input type={"email"} defaultValue={"maria@ejemplo.com"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "gridColumn": "1 / -1", "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "15px" }}>
                        <input type={"checkbox"} defaultChecked style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                        {"Quiero recibir ofertas por WhatsApp"}
                      </label>
                      <button type={"button"} onClick={lookup(v, "save")} style={{ "gridColumn": "1 / -1", "justifySelf": "start", "height": "52px", "padding": "0 28px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                        {"Guardar cambios"}
                      </button>
                    </form>
                  </Fragment>
                )}
                {Boolean(lookup(v, "tBill")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px", "maxWidth": "760px" }}>
                      <p style={{ "margin": "0", "fontSize": "16px", "lineHeight": "1.5" }}>
                        {"Guarda los datos de tu empresa para pedir factura sin escribirlos cada vez."}
                      </p>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                          {"RUC"}
                          <input type={"text"} defaultValue={"[RUC]"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                        </label>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                          {"Razón social"}
                          <input type={"text"} defaultValue={"[RAZÓN SOCIAL]"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                        </label>
                        <label style={{ "gridColumn": "1 / -1", "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                          {"Dirección fiscal"}
                          <input type={"text"} defaultValue={"[DIRECCIÓN FISCAL]"} style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
                        </label>
                      </div>
                      <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "15px" }}>
                        <input type={"checkbox"} style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                        {"Pedir factura por defecto"}
                      </label>
                      <button type={"button"} onClick={lookup(v, "save")} style={{ "alignSelf": "flex-start", "height": "52px", "padding": "0 28px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                        {"Guardar datos"}
                      </button>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "tWish")) && (
                  <Fragment>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "16px" }}>
                      {(lookup(v, "wish") || []).map((w, index8) => (
                        <Fragment key={index8}>
                          <div style={{ "border": "1px solid #111111", "borderRadius": "20px", "overflow": "hidden", "display": "flex", "flexDirection": "column" }}>
                            <img src={assetSrc(lookup(w, "img"))} alt={""} style={{ "width": "100%", "aspectRatio": "4 / 3", "objectFit": "cover" }} />
                            <div style={{ "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "color": "#444444" }}>
                                {lookup(w, "cat")}
                              </span>
                              <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                                {lookup(w, "name")}
                              </span>
                              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "900" }}>
                                  {lookup(w, "price")}
                                </span>
                                <button onClick={lookup(w, "remove")} aria-label={"Quitar de la lista"} style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "border": "1px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"#E8701F"} stroke={"#E8701F"} strokeWidth={"1.8"} aria-hidden={"true"}>
                                    <path d={"M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"}></path>
                                  </svg>
                                </button>
                              </span>
                              <a href={"/producto"} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "height": "44px", "borderRadius": "999px", "background": lookup(v, "accent"), "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                                {"Ver producto"}
                              </a>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    {Boolean(lookup(v, "wishEmpty")) && (
                      <Fragment>
                        <p style={{ "margin": "0", "fontSize": "16px" }}>
                          {"Tu lista está vacía. "}
                          <a href={"/tienda"}>
                            {"Ver productos"}
                          </a>
                        </p>
                      </Fragment>
                    )}
                  </Fragment>
                )}
                {Boolean(lookup(v, "saved")) && (
                  <Fragment>
                    <div role={"status"} style={{ "display": "flex", "gap": "10px", "alignItems": "center", "padding": "14px 18px", "borderRadius": "14px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "15px", "fontWeight": "500" }}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M5 12l5 5 9-10"}></path>
                      </svg>
                      {"Cambios guardados."}
                    </div>
                  </Fragment>
                )}
                <div style={{ "borderRadius": "24px", "background": "#111111", "color": "#FFFFFF", "padding": "28px", "display": "flex", "flexWrap": "wrap", "gap": "20px", "alignItems": "center" }}>
                  <span style={{ "flex": "1 1 360px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900", "textTransform": "uppercase" }}>
                      {"¿Compras para tu negocio?"}
                    </span>
                    <span style={{ "fontSize": "15px", "color": "#E8E8E8" }}>
                      {"Bodegas, ferreterías, mayoristas y empresas tienen precios por volumen y crédito."}
                    </span>
                  </span>
                  <a href={"/empresas"} style={{ "display": "inline-flex", "alignItems": "center", "height": "54px", "padding": "0 26px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Ver precios para empresas"}
                  </a>
                </div>
              </section>
            </div>
          </Fragment>
        )}
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
