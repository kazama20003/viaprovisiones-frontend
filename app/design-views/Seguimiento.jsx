"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { step: 3, found: true };
  }
  renderVals() {
    const st = this.state;
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const S = [
      ['Recibido', '26 oct · 09:12', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0'],
      ['Pago confirmado', '26 oct · 09:40', 'M5 12l5 5 9-10'],
      ['Preparando', '26 oct · 11:05', 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10'],
      ['En camino', '26 oct · 14:20', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5'],
      ['Entregado', 'Hoy, 3 a 5 pm', 'M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z']
    ];
    const HEAD = [
      ['Recibimos tu pedido', 'Confirmaremos tu pago en unos minutos.'],
      ['Pago confirmado', 'Ya estamos separando tus productos.'],
      ['Preparando tu pedido', 'Lo estamos empacando para enviarlo.'],
      ['Tu pedido va en camino', 'Llega hoy entre 3 y 5 pm a tu dirección.'],
      ['Pedido entregado', 'Gracias por comprar en VIA Provisiones.']
    ];
    const items = [
      ['Lámpara de camping recargable', 2, 69.9, 'a58999411e32d7481815ba8cdc175e97'],
      ['Panel solar monocristalino 100 W', 1, 349, '972ceb606bfca75ef6208d8d3966c77d'],
      ['Cable USB-C carga rápida 1 m', 3, 19.9, '3aba2390d3fbd5f06fdd2cede507b16f']
    ];
    const sub = items.reduce((a, i) => a + i[1] * i[2], 0);
    const ship = 0;
    return {
      accent: this.props.accent ?? '#FF914C',
      found: st.found,
      notFound: !st.found,
      search: (e) => { if (e && e.preventDefault) e.preventDefault(); this.setState({ found: true }); },
      headline: HEAD[st.step][0],
      subline: HEAD[st.step][1],
      currentName: S[st.step][0],
      currentIcon: S[st.step][2],
      steps: S.map((s, i) => {
        const done = i < st.step;
        const cur = i === st.step;
        return {
          name: s[0], when: i <= st.step ? s[1] : 'Pendiente', icon: s[2],
          current: cur ? 'step' : 'false',
          dotBg: done ? '#FFFFFF' : (cur ? '#FF914C' : 'transparent'),
          dotBorder: done || cur ? (cur ? '#FF914C' : '#FFFFFF') : '#555555',
          dotFg: done || cur ? '#111111' : '#777777',
          fg: done || cur ? '#FFFFFF' : '#8C8C8C',
          line: i < st.step ? '#FFFFFF' : '#3A3A3A'
        };
      }),
      demo: S.map((s, i) => ({ name: s[0], on: i === st.step ? 'true' : 'false', bg: i === st.step ? '#FFFFFF' : 'transparent', fg: i === st.step ? '#111111' : '#CFCFCF', pick: () => this.setState({ step: i, found: true }) })).concat([{ name: 'No encontrado', on: st.found ? 'false' : 'true', bg: st.found ? 'transparent' : '#FFFFFF', fg: st.found ? '#CFCFCF' : '#111111', pick: () => this.setState({ found: false }) }]),
      items: items.map((i) => ({ name: i[0], qty: i[1] + (i[1] === 1 ? ' unidad' : ' unidades') + ' · ' + money(i[2]) + ' c/u', total: money(i[1] * i[2]), img: 'img/' + i[3] })),
      subtotal: money(sub),
      shipping: ship ? money(ship) : 'Gratis',
      total: money(sub + ship)
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Seguimiento(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.marquee{animation:via-marquee 40s linear infinite}\n@keyframes via-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion: reduce){.marquee{animation:none}}\nhtml,body{scrollbar-width:none;-ms-overflow-style:none}html::-webkit-scrollbar,body::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={"0"} active={""} />
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "48px 40px 80px", "display": "flex", "flexDirection": "column", "gap": "36px" }}>
        <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "32px", "alignItems": "flex-end", "justifyContent": "space-between" }}>
          <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
              {"Seguimiento de pedido"}
            </span>
            <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "56px", "textTransform": "uppercase", "lineHeight": "1" }}>
              {"¿Dónde está mi pedido?"}
            </h1>
          </div>
          <form onSubmit={lookup(v, "search")} aria-label={"Buscar pedido"} style={{ "display": "flex", "flexWrap": "wrap", "gap": "12px", "alignItems": "flex-end" }}>
            <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
              {"N° de pedido\n"}
              <input type={"text"} defaultValue={"#1043"} style={{ "width": "160px", "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px", "boxSizing": "border-box" }} />
            </label>
            <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
              {"Celular\n"}
              <span style={{ "display": "flex", "alignItems": "center", "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "boxSizing": "border-box" }}>
                <span style={{ "fontWeight": "700", "marginRight": "8px" }}>
                  {"+51"}
                </span>
                <input type={"tel"} defaultValue={"9•• ••• 512"} style={{ "width": "140px", "border": "none", "fontFamily": "inherit", "fontSize": "16px", "outline": "none" }} />
              </span>
            </label>
            <button type={"button"} onClick={lookup(v, "search")} style={{ "height": "52px", "padding": "0 26px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
              {"Buscar"}
            </button>
          </form>
        </div>
        {Boolean(lookup(v, "notFound")) && (
          <Fragment>
            <div role={"alert"} style={{ "display": "flex", "gap": "12px", "alignItems": "center", "padding": "16px 20px", "borderRadius": "14px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "15px", "fontWeight": "500" }}>
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
              </svg>
              {"No encontramos ese pedido con ese celular. Revisa el número que te llegó por WhatsApp."}
              <button type={"button"} onClick={lookup(v, "search")} style={{ "marginLeft": "auto", "border": "none", "background": "transparent", "cursor": "pointer", "textDecoration": "underline", "color": "inherit", "fontFamily": "inherit", "fontSize": "14px" }}>
                {"Ver ejemplo correcto"}
              </button>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "found")) && (
          <Fragment>
            <section aria-label={"Estado del pedido"} style={{ "borderRadius": "28px", "background": "#111111", "color": "#FFFFFF", "padding": "36px 40px", "display": "flex", "flexDirection": "column", "gap": "32px" }}>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "20px", "alignItems": "flex-end", "justifyContent": "space-between" }}>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                  <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "color": "#CFCFCF" }}>
                    {"Pedido #1043 · 26 oct 2026 · ejemplo"}
                  </span>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "44px", "textTransform": "uppercase", "lineHeight": "1" }}>
                    {lookup(v, "headline")}
                  </span>
                  <span style={{ "fontSize": "17px", "color": "#E8E8E8" }}>
                    {lookup(v, "subline")}
                  </span>
                </div>
                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "46px", "padding": "0 20px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(v, "currentIcon")}></path>
                  </svg>
                  {lookup(v, "currentName")}
                </span>
              </div>
              <ol style={{ "listStyle": "none", "margin": "0", "padding": "0", "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "8px" }}>
                {(lookup(v, "steps") || []).map((s, index1) => (
                  <Fragment key={index1}>
                    <li aria-current={lookup(s, "current")} style={{ "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                      <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                        <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(s, "dotBg"), "border": "2px solid " + String(lookup(s, "dotBorder") ?? ""), "boxSizing": "border-box", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "dotFg")} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "height": "4px", "borderRadius": "999px", "background": lookup(s, "line") }}></span>
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                        <span style={{ "fontSize": "16px", "fontWeight": "700", "color": lookup(s, "fg") }}>
                          {lookup(s, "name")}
                        </span>
                        <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "color": "#BDBDBD" }}>
                          {lookup(s, "when")}
                        </span>
                      </span>
                    </li>
                  </Fragment>
                ))}
              </ol>
              <div style={{ "display": "flex", "gap": "10px", "flexWrap": "wrap", "alignItems": "center", "fontSize": "13px", "color": "#BDBDBD" }}>
                <span>
                  {"Vista de ejemplo — mira cada estado:"}
                </span>
                {(lookup(v, "demo") || []).map((d, index2) => (
                  <Fragment key={index2}>
                    <button type={"button"} onClick={lookup(d, "pick")} aria-pressed={lookup(d, "on")} style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid #444444", "background": lookup(d, "bg"), "color": lookup(d, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px" }}>
                      {lookup(d, "name")}
                    </button>
                  </Fragment>
                ))}
              </div>
            </section>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "32px", "alignItems": "flex-start" }}>
              <section aria-label={"Entrega"} style={{ "flex": "999 1 620px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "20px" }}>
                <div style={{ "position": "relative", "height": "320px", "borderRadius": "24px", "overflow": "hidden", "background": "#F2F2F2", "border": "1px solid #111111" }}>
                  <svg width={"100%"} height={"100%"} viewBox={"0 0 800 320"} preserveAspectRatio={"xMidYMid slice"} aria-hidden={"true"}>
                    <g stroke={"#DADADA"} strokeWidth={"14"} fill={"none"} strokeLinecap={"round"}>
                      <path d={"M-20 90 H820"}></path>
                      <path d={"M-20 230 H820"}></path>
                      <path d={"M160 -20 V340"}></path>
                      <path d={"M470 -20 V340"}></path>
                      <path d={"M660 -20 V340"}></path>
                    </g>
                    <path d={"M160 230 H470 V90 H620"} fill={"none"} stroke={"#111111"} strokeWidth={"5"} strokeDasharray={"2 12"} strokeLinecap={"round"}></path>
                    <circle cx={"160"} cy={"230"} r={"12"} fill={"#111111"}></circle>
                    <circle cx={"620"} cy={"90"} r={"14"} fill={"#E8701F"}></circle>
                    <circle cx={"470"} cy={"160"} r={"20"} fill={"#FFFFFF"} stroke={"#111111"} strokeWidth={"3"}></circle>
                  </svg>
                  <span style={{ "position": "absolute", "left": "20px", "top": "20px", "padding": "8px 14px", "borderRadius": "999px", "background": "#FFFFFF", "border": "1px solid #111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Mapa referencial · [MAPA EN VIVO]"}
                  </span>
                </div>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                  <div style={{ "border": "1px solid #111111", "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {"Entrega"}
                    </span>
                    <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "800", "textTransform": "uppercase" }}>
                      {"Delivery Arequipa"}
                    </span>
                    <span style={{ "fontSize": "15px", "lineHeight": "1.5" }}>
                      {"[DIRECCIÓN DEL CLIENTE], Cayma"}
                      <br />
                      {"Llega "}
                      <strong>
                        {"hoy entre 3 y 5 pm"}
                      </strong>
                    </span>
                  </div>
                  <div style={{ "border": "1px solid #111111", "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {"Tu repartidor"}
                    </span>
                    <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                      <span style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "700" }}>
                        {"M"}
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                        <span style={{ "fontSize": "17px", "fontWeight": "700" }}>
                          {"Motorizado [NOMBRE]"}
                        </span>
                        <span style={{ "fontSize": "14px", "color": "#444444" }}>
                          {"Placa [PLACA]"}
                        </span>
                      </span>
                    </span>
                    <DesignLink href={"https://wa.me/51954802744"} style={{ "fontSize": "14px", "fontWeight": "700", "textUnderlineOffset": "3px" }}>
                      {"Coordinar por WhatsApp"}
                    </DesignLink>
                  </div>
                </div>
                <div style={{ "borderRadius": "20px", "background": "#FFF1E6", "padding": "24px", "display": "flex", "flexWrap": "wrap", "gap": "18px", "alignItems": "center" }}>
                  <span style={{ "flex": "1 1 320px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "800", "textTransform": "uppercase" }}>
                      {"¿Problema con tu pedido?"}
                    </span>
                    <span style={{ "fontSize": "15px", "lineHeight": "1.5" }}>
                      {"Si algo llegó dañado o no es lo que pediste, tienes 7 días para cambiarlo. Escríbenos con tu N° de pedido y una foto, y coordinamos el cambio o la devolución."}
                    </span>
                  </span>
                  <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 24px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M4 20l1.5-4A8 8 0 1 1 8 18.5z"}></path>
                    </svg>
                    {"Escribir por WhatsApp"}
                  </DesignLink>
                </div>
              </section>
              <aside aria-label={"Resumen del pedido"} style={{ "flex": "1 1 380px", "minWidth": "0", "border": "2px solid #111111", "borderRadius": "24px", "padding": "26px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900", "textTransform": "uppercase" }}>
                  {"Tu pedido"}
                </span>
                {(lookup(v, "items") || []).map((i, index3) => (
                  <Fragment key={index3}>
                    <div style={{ "display": "flex", "gap": "14px", "alignItems": "center" }}>
                      <img src={assetSrc(lookup(i, "img"))} alt={""} style={{ "width": "72px", "height": "72px", "objectFit": "cover", "borderRadius": "12px", "flex": "none" }} />
                      <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                        <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                          {lookup(i, "name")}
                        </span>
                        <span style={{ "fontSize": "13px", "color": "#444444" }}>
                          {lookup(i, "qty")}
                        </span>
                      </span>
                      <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700" }}>
                        {lookup(i, "total")}
                      </span>
                    </div>
                  </Fragment>
                ))}
                <div style={{ "borderTop": "1px solid #111111", "paddingTop": "14px", "display": "flex", "flexDirection": "column", "gap": "8px", "fontSize": "15px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                    <span>
                      {"Subtotal"}
                    </span>
                    <span>
                      {lookup(v, "subtotal")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                    <span>
                      {"Envío"}
                    </span>
                    <span>
                      {lookup(v, "shipping")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900" }}>
                    <span>
                      {"Total"}
                    </span>
                    <span>
                      {lookup(v, "total")}
                    </span>
                  </span>
                  <span style={{ "fontSize": "13px", "color": "#444444" }}>
                    {"IGV incluido · Pagado con Yape"}
                  </span>
                </div>
                <DesignLink href={"#comprobante"} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px", "height": "52px", "borderRadius": "999px", "border": "2px solid #111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
                  </svg>
                  {"Boleta B001-00424 (PDF)"}
                </DesignLink>
                <DesignLink href={"/mi-cuenta"} style={{ "fontSize": "14px", "fontWeight": "700", "textUnderlineOffset": "3px", "alignSelf": "center" }}>
                  {"Ver todos mis pedidos"}
                </DesignLink>
              </aside>
            </div>
          </Fragment>
        )}
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
