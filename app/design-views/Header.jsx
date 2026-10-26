"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { open: -1 };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const cart = Number(this.props.cart ?? 0);
    const active = this.props.active ?? '';
    const open = this.state.open;
    const cats = [
      { name: 'Focos', img: B + '3b9c9685b295f2e98de45092f0726e9d', blurb: 'Iluminación LED e inteligente para cada espacio.', subs: ['Focos LED', 'Focos inteligentes', 'Focos ahorradores', 'Reflectores', 'Tiras LED'] },
      { name: 'Solar', img: B + 'b30fccfdffef62630e634c81713bce27', blurb: 'Energía del sol para tu casa, tu negocio o tu campamento.', subs: ['Paneles solares', 'Estaciones de energía', 'Lámparas solares', 'Baterías e inversores', 'Kits solares'] },
      { name: 'Cables', img: B + '9b50c161cb5babd38f32f5ae0d6d07f2', blurb: 'Carga, video, red y audio con conexiones confiables.', subs: ['Cables USB', 'Cables HDMI', 'Cables de red', 'Cables de audio', 'Cable eléctrico'] },
      { name: 'Extensiones', img: B + 'eb24768cbcec06634442ffd75b2ec35e', blurb: 'Energía donde la necesites, en casa o en el taller.', subs: ['Multicontactos', 'Extensiones de uso rudo', 'Carretes', 'Supresores de picos'] },
      { name: 'Llaveros', img: B + '486adc8e3498d09ac8c8b3601331de4e', blurb: 'Lleva tus llaves en orden y con estilo.', subs: ['Llaveros de metal', 'Llaveros de piel', 'Mosquetones', 'Llaveros personalizados'] },
      { name: 'Ganchos', img: B + '2199c77bc313fc070c4dd0829072f7f7', blurb: 'Organiza paredes, cocina y entrada sin complicaciones.', subs: ['Ganchos adhesivos', 'Ganchos de pared', 'Ganchos de cocina', 'Organizadores'] },
      { name: 'Camping', img: B + 'a39c65aefaa4235a16422fb671911427', blurb: 'Equipo para acampar con luz, comodidad y seguridad.', subs: ['Lámparas y linternas', 'Casas de campaña', 'Cocina de campamento', 'Mochilas', 'Sillas plegables'] },
      { name: 'Bisutería', img: B + 'c293f47caea74d301a56eedd46949711', blurb: 'Accesorios para completar cualquier look.', subs: ['Collares', 'Pulseras', 'Aretes', 'Anillos', 'Sets'] }
    ];
    const cur = open >= 0 ? cats[open] : cats[0];
    const links = [
      { label: 'Empresas', href: '/empresas', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6' },
      { label: 'Redes', href: '/enlaces', icon: 'M8 12h8M10 8H7a4 4 0 0 0 0 8h3M14 8h3a4 4 0 0 1 0 8h-3' },
      { label: 'Nosotros', href: '/tienda', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6' }
    ];
    return {
      accent,
      cartCount: cart,
      hasCart: cart > 0,
      topLinks: links.map((l) => ({ ...l, underline: l.label === active ? '3px solid ' + accent : '3px solid transparent' })),
      ticker: [0, 1].flatMap(() => ['Envío a todo el Perú desde Arequipa', 'WhatsApp +51 954 802 744', 'Precios por mayor y menor', 'Pago con tarjeta, Yape o Plin', 'Focos LED e inteligentes', 'Paneles solares y energía portátil', 'Cables y extensiones', 'Todo para camping', 'Bisutería nueva cada semana', 'Boleta o factura electrónica'].map((label) => ({ label }))),
      menu: cats.map((c, i) => ({
        name: c.name,
        expanded: open === i ? 'true' : 'false',
        underline: open === i ? '3px solid ' + accent : '3px solid transparent',
        chevron: open === i ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6',
        toggle: () => this.setState({ open: this.state.open === i ? -1 : i })
      })),
      menuOpen: open >= 0,
      current: { name: cur.name, blurb: cur.blurb, img: cur.img, subs: cur.subs.map((name) => ({ name })) },
      closeMenu: () => this.setState({ open: -1 })
    };
  }
}

const defaults = {"accent": "#FF914C", "cart": 0, "active": ""};

export default function Header(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "position": "relative", "zIndex": "20" }}>
      <div style={{ "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "height": "48px", "overflow": "hidden", "display": "flex", "alignItems": "center", "whiteSpace": "nowrap" }}>
        <div className={"marquee"} style={{ "display": "flex", "alignItems": "center", "flex": "none" }}>
          {(lookup(v, "ticker") || []).map((t, index1) => (
            <Fragment key={index1}>
              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "28px", "paddingRight": "28px" }}>
                {lookup(t, "label")}
                <span style={{ "width": "6px", "height": "6px", "borderRadius": "50%", "background": "#111111" }}></span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>
      <header style={{ "background": "#FFFFFF", "borderBottom": "1px solid #111111" }}>
        <div style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "0 40px", "position": "relative" }}>
          <div style={{ "minHeight": "88px", "display": "flex", "alignItems": "center", "gap": "24px", "justifyContent": "space-between", "flexWrap": "wrap" }}>
            <a href={"/tienda"} aria-label={"VIA Provisiones, inicio"} style={{ "display": "flex", "alignItems": "center", "textDecoration": "none" }}>
              <svg width={"176"} height={"58"} viewBox={"134 205 278 92"} role={"img"} aria-label={"VIA Provisiones"}>
                <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={lookup(v, "accent")} strokeWidth={"3"}></circle>
                <clipPath id={"via-clip-hdr"}>
                  <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                </clipPath>
                <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={lookup(v, "accent")}></polygon>
                <path clipPath={"url(#via-clip-hdr)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
                <g fill={"none"} stroke={"#111111"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                  <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
                  <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
                  <path d={"M295.8 229 V248.25"}></path>
                </g>
                <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={lookup(v, "accent")}>
                  {"PROVISIONES"}
                </text>
              </svg>
            </a>
            <div style={{ "display": "flex", "alignItems": "center", "gap": "22px", "flexWrap": "wrap", "justifyContent": "flex-end" }}>
              <label style={{ "position": "relative", "display": "flex", "alignItems": "center", "width": "440px", "maxWidth": "80vw", "height": "46px", "border": "1px solid #111111", "borderRadius": "999px", "padding": "0 6px 0 18px", "boxSizing": "border-box" }}>
                <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                  {"Buscar productos"}
                </span>
                <input type={"search"} placeholder={"Buscar focos, paneles solares, camping…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "16px", "color": "#111111", "outline": "none" }} />
                <a href={"/busqueda"} aria-label={"Buscar"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                    <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                    <path d={"M16 16l4 4"}></path>
                  </svg>
                </a>
              </label>
              {(lookup(v, "topLinks") || []).map((l, index2) => (
                <Fragment key={index2}>
                  <a href={lookup(l, "href")} style={{ "textDecoration": "none", "fontSize": "16px", "fontWeight": "700", "display": "inline-flex", "alignItems": "center", "gap": "6px", "minHeight": "44px", "borderBottom": lookup(l, "underline"), "boxSizing": "border-box" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={lookup(l, "icon")}></path>
                    </svg>
                    {lookup(l, "label")}
                  </a>
                </Fragment>
              ))}
              <a href={"https://wa.me/51954802744"} aria-label={"WhatsApp +51 954 802 744"} style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": "#25D366", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
                  <path d={"M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3z"} fill={"#FFFFFF"}></path>
                  <path d={"M9.2 7.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9z"} fill={"#25D366"}></path>
                </svg>
              </a>
              <a href={"/mi-cuenta"} aria-label={"Mi cuenta"} style={{ "width": "32px", "height": "44px", "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "padding": "0" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <circle cx={"12"} cy={"8"} r={"4"}></circle>
                  <path d={"M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"}></path>
                </svg>
              </a>
              <a href={"/carrito"} aria-label={"Carrito"} style={{ "position": "relative", "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none" }}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M3 4h2l2.2 11h11l2-8H6.2"}></path>
                  <circle cx={"9"} cy={"19"} r={"1.3"}></circle>
                  <circle cx={"17"} cy={"19"} r={"1.3"}></circle>
                </svg>
                {Boolean(lookup(v, "hasCart")) && (
                  <Fragment>
                    <span style={{ "position": "absolute", "top": "-4px", "right": "-4px", "minWidth": "18px", "height": "18px", "borderRadius": "9px", "background": "#111111", "color": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      {lookup(v, "cartCount")}
                    </span>
                  </Fragment>
                )}
              </a>
            </div>
          </div>
          <nav aria-label={"Categorías"} style={{ "borderTop": "1px solid #111111", "minHeight": "56px", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "4px 28px", "flexWrap": "wrap" }}>
            {(lookup(v, "menu") || []).map((m, index3) => (
              <Fragment key={index3}>
                <button onClick={lookup(m, "toggle")} aria-expanded={lookup(m, "expanded")} style={{ "border": "none", "background": "transparent", "cursor": "pointer", "padding": "0 2px", "minHeight": "44px", "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase", "letterSpacing": "0.02em", "color": "#111111", "display": "inline-flex", "alignItems": "center", "gap": "8px", "borderBottom": lookup(m, "underline") }}>
                  {lookup(m, "name")}
                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                    <path d={lookup(m, "chevron")}></path>
                  </svg>
                </button>
              </Fragment>
            ))}
            <a href={"/categoria"} style={{ "minHeight": "44px", "display": "inline-flex", "alignItems": "center", "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800", "textTransform": "uppercase", "textDecoration": "none", "color": "#111111" }}>
              <span style={{ "background": lookup(v, "accent"), "padding": "4px 10px", "borderRadius": "999px" }}>
                {"Ofertas"}
              </span>
            </a>
          </nav>
          {Boolean(lookup(v, "menuOpen")) && (
            <Fragment>
              <div style={{ "position": "absolute", "left": "40px", "right": "40px", "top": "100%", "background": "#FFFFFF", "border": "1px solid #111111", "borderTop": "4px solid " + String(lookup(v, "accent") ?? ""), "borderRadius": "0 0 16px 16px", "padding": "32px", "display": "flex", "flexWrap": "wrap", "gap": "32px", "boxShadow": "0 18px 40px rgba(0,0,0,0.12)" }}>
                <div style={{ "flex": "0 1 240px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Categoría"}
                  </span>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "36px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                    {lookup(v, "current.name")}
                  </span>
                  <span style={{ "fontSize": "16px", "lineHeight": "1.5" }}>
                    {lookup(v, "current.blurb")}
                  </span>
                  <a href={"/categoria"} onClick={lookup(v, "closeMenu")} style={{ "alignSelf": "flex-start", "marginTop": "6px", "display": "inline-flex", "alignItems": "center", "height": "46px", "padding": "0 22px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Ver todo"}
                  </a>
                </div>
                <ul style={{ "flex": "1 1 320px", "listStyle": "none", "margin": "0", "padding": "0", "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "4px 24px", "alignContent": "start" }}>
                  {(lookup(v, "current.subs") || []).map((s, index4) => (
                    <Fragment key={index4}>
                      <li>
                        <a href={"/categoria"} onClick={lookup(v, "closeMenu")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "minHeight": "48px", "borderBottom": "1px solid #111111", "textDecoration": "none", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "700", "textTransform": "uppercase", "color": "#111111" }}>
                          {lookup(s, "name")}
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                            <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                          </svg>
                        </a>
                      </li>
                    </Fragment>
                  ))}
                </ul>
                <img src={assetSrc(lookup(v, "current.img"))} alt={""} style={{ "flex": "0 1 300px", "width": "300px", "maxWidth": "100%", "height": "220px", "objectFit": "cover", "borderRadius": "12px" }} />
                <button onClick={lookup(v, "closeMenu")} aria-label={"Cerrar menú"} style={{ "position": "absolute", "top": "12px", "right": "12px", "width": "40px", "height": "40px", "border": "1px solid #111111", "borderRadius": "50%", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                </button>
              </div>
            </Fragment>
          )}
        </div>
      </header>
    </div>
    </Fragment>
  )} />;
}
