"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  renderVals() {
    const accent = this.props.accent ?? '#FF914C';
    return {
      accent,
      links: [
        { title: 'Tienda online', sub: 'www.viaprovisiones.com', href: '/tienda', icon: 'M3 4h2l2.2 11h11l2-8H6.2M9 19h.01M17 19h.01', bg: '#111111', fg: '#FFFFFF', iconBg: accent, iconFg: '#111111' },
        { title: 'Cotización para empresas', sub: 'Minería, construcción y pymes', href: '/empresas', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', bg: accent, fg: '#111111', iconBg: '#111111', iconFg: '#FFFFFF' },
        { title: 'Energía solar', sub: 'Paneles y estaciones de energía', href: '/categoria', icon: 'M12 3v2M12 19v2M3 12h2M19 12h2M6 6l1.5 1.5M16.5 16.5L18 18M6 18l1.5-1.5M16.5 7.5L18 6M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', bg: '#FFFFFF', fg: '#111111', iconBg: accent, iconFg: '#111111' },
        { title: 'Catálogo en PDF', sub: 'Descárgalo y compártelo', href: '#catalogo', icon: 'M6 3h9l4 4v14H6zM14 3v5h5M9 13h6M9 17h6', bg: '#FFFFFF', fg: '#111111', iconBg: accent, iconFg: '#111111' }
      ]
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Enlaces(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#111111}\n\n.via-links-page{width:100%;min-height:100vh;box-sizing:border-box;font-family:Roboto,system-ui,sans-serif;font-size:16px;color:#111;background:#fff;padding-bottom:28px}\n.via-links-hero{padding:36px 24px 84px;display:flex;flex-direction:column;align-items:center;gap:12px;text-align:center}\n.via-links-quick{position:relative;margin:-56px 16px 0;background:#fff;border:2px solid #111;border-radius:22px;padding:18px 10px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:4px}\n.via-links-primary{padding:22px 16px 0}\n.via-links-social{padding:28px 16px 0}\n.via-links-social-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}\n.via-links-services{padding:28px 16px 0;display:flex;flex-direction:column;gap:10px}\n.via-links-contact{margin:28px 16px 0;border:2px solid #111;border-radius:22px;overflow:hidden}\n.via-links-share{margin:20px 16px 0;border-radius:22px;padding:18px;display:flex;gap:16px;align-items:center}\n.via-links-footer{padding:24px 16px 0;text-align:center;font-family:'Roboto Mono',monospace;font-size:12px;font-weight:700;text-transform:uppercase}\n.via-links-contact a,.via-links-share span{overflow-wrap:anywhere}\n@media(max-width:359px){.via-links-social-grid{grid-template-columns:1fr}.via-links-hero>span:first-of-type{font-size:10px!important;letter-spacing:.18em!important}}\n@media(min-width:900px){\n .via-links-page{display:grid;grid-template-columns:minmax(28px,1fr) minmax(0,560px) minmax(0,560px) minmax(28px,1fr);column-gap:24px;row-gap:24px;align-content:start;padding-bottom:36px}\n .via-links-hero{grid-column:1/-1;padding:48px 24px 88px}\n .via-links-quick{grid-column:2/4;width:min(100%,720px);box-sizing:border-box;justify-self:center;margin:-56px 0 0;padding:22px 18px}\n .via-links-primary{grid-column:2/4;padding:0}\n .via-links-social{grid-column:2/3;padding:0}\n .via-links-services{grid-column:3/4;padding:0}\n .via-links-contact{grid-column:2/3;margin:0;align-self:start}\n .via-links-share{grid-column:3/4;margin:0;padding:32px;gap:24px;align-self:stretch;justify-content:center;min-height:220px}\n .via-links-share img{width:140px!important;height:140px!important}\n .via-links-footer{grid-column:1/-1;padding:8px 24px 0}\n}\n"}</style>
    <div className={"via-links-page"}>
      <div className={"via-links-hero"} style={{ "background": lookup(v, "accent") }}>
        <svg width={"230"} height={"76"} viewBox={"134 205 278 92"} role={"img"} aria-label={"VIA Provisiones"}>
          <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"3"}></circle>
          <clipPath id={"via-clip-links"}>
            <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
          </clipPath>
          <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
          <path clipPath={"url(#via-clip-links)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
          <g fill={"none"} stroke={"#FFFFFF"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
            <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
            <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
            <path d={"M295.8 229 V248.25"}></path>
          </g>
          <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={"#FFFFFF"}>
            {"PROVISIONES"}
          </text>
        </svg>
        <span style={{ "fontFamily": "Montserrat, sans-serif", "fontSize": "11px", "fontWeight": "500", "letterSpacing": "0.3em", "color": "#111111" }}>
          {"ILUMINACIÓN · SEGURIDAD · ACCESORIOS"}
        </span>
        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "background": "#111111", "color": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "padding": "6px 12px", "borderRadius": "999px" }}>
          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
            <path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"}></path>
            <circle cx={"12"} cy={"10"} r={"2.5"}></circle>
          </svg>
          {"Arequipa · Envíos a todo el Perú"}
        </span>
      </div>
      <div className={"via-links-quick"}>
        <DesignLink href={"tel:+51954802744"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "8px", "textDecoration": "none" }}>
          <span style={{ "width": "54px", "height": "54px", "borderRadius": "50%", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <path d={"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"}></path>
            </svg>
          </span>
          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
            {"Llamar"}
          </span>
        </DesignLink>
        <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "8px", "textDecoration": "none" }}>
          <span style={{ "width": "54px", "height": "54px", "borderRadius": "50%", "background": "#25D366", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
            <svg width={"28"} height={"28"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
              <path d={"M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3z"} fill={"#FFFFFF"}></path>
              <path d={"M9.2 7.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9z"} fill={"#25D366"}></path>
            </svg>
          </span>
          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
            {"WhatsApp"}
          </span>
        </DesignLink>
        <DesignLink href={"mailto:viaprovisionesperu@gmail.com"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "8px", "textDecoration": "none" }}>
          <span style={{ "width": "54px", "height": "54px", "borderRadius": "50%", "background": "#EA4335", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <path d={"M3 6h18v12H3zM3 7l9 6 9-6"}></path>
            </svg>
          </span>
          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
            {"Correo"}
          </span>
        </DesignLink>
        <DesignLink href={"https://www.google.com/maps/search/?api=1&query=Dean+Valdivia+533+Cercado+Arequipa"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "8px", "textDecoration": "none" }}>
          <span style={{ "width": "54px", "height": "54px", "borderRadius": "50%", "background": "#1A73E8", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
              <path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"}></path>
              <circle cx={"12"} cy={"10"} r={"2.5"}></circle>
            </svg>
          </span>
          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
            {"Mapa"}
          </span>
        </DesignLink>
      </div>
      <div className={"via-links-primary"}>
        <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "flex", "alignItems": "center", "gap": "14px", "minHeight": "68px", "padding": "0 20px", "borderRadius": "18px", "background": "#25D366", "textDecoration": "none", "color": "#111111" }}>
          <svg width={"30"} height={"30"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
            <path d={"M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3z"} fill={"#FFFFFF"}></path>
            <path d={"M9.2 7.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9z"} fill={"#25D366"}></path>
          </svg>
          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
            <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "18px", "fontWeight": "900", "textTransform": "uppercase" }}>
              {"Haz tu pedido por WhatsApp"}
            </span>
            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700" }}>
              {"+51 954 802 744"}
            </span>
          </span>
          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
            <path d={"M5 12h14M13 6l6 6-6 6"}></path>
          </svg>
        </DesignLink>
      </div>
      <section className={"via-links-social"}>
        <h2 style={{ "margin": "0 0 12px", "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "900", "textTransform": "uppercase" }}>
          {"Síguenos en redes"}
        </h2>
        <div className={"via-links-social-grid"}>
          <DesignLink href={"#instagram"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px", "border": "2px solid #111111", "borderRadius": "16px", "textDecoration": "none" }}>
            <svg width={"40"} height={"40"} viewBox={"0 0 40 40"} aria-hidden={"true"} style={{ "flex": "none" }}>
              <defs>
                <linearGradient id={"ig-grad"} x1={"0"} y1={"1"} x2={"1"} y2={"0"}>
                  <stop offset={"0"} stopColor={"#FEDA75"}></stop>
                  <stop offset={"0.3"} stopColor={"#FA7E1E"}></stop>
                  <stop offset={"0.6"} stopColor={"#D62976"}></stop>
                  <stop offset={"0.85"} stopColor={"#962FBF"}></stop>
                  <stop offset={"1"} stopColor={"#4F5BD5"}></stop>
                </linearGradient>
              </defs>
              <rect width={"40"} height={"40"} rx={"11"} fill={"url(#ig-grad)"}></rect>
              <rect x={"10"} y={"10"} width={"20"} height={"20"} rx={"6"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.6"}></rect>
              <circle cx={"20"} cy={"20"} r={"4.8"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.6"}></circle>
              <circle cx={"26.3"} cy={"13.7"} r={"1.5"} fill={"#FFFFFF"}></circle>
            </svg>
            <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800" }}>
                {"Instagram"}
              </span>
              <span style={{ "fontSize": "12px" }}>
                {"Fotos y novedades"}
              </span>
            </span>
          </DesignLink>
          <DesignLink href={"#facebook"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px", "border": "2px solid #111111", "borderRadius": "16px", "textDecoration": "none" }}>
            <svg width={"40"} height={"40"} viewBox={"0 0 40 40"} aria-hidden={"true"} style={{ "flex": "none" }}>
              <circle cx={"20"} cy={"20"} r={"20"} fill={"#1877F2"}></circle>
              <path d={"M22.2 40V25.6h4.6l.7-5.4h-5.3v-3.4c0-1.6.4-2.6 2.7-2.6h2.8V9.4c-.5-.1-2.2-.2-4.1-.2-4 0-6.8 2.5-6.8 7v3.9H12.2v5.4h4.6V40z"} fill={"#FFFFFF"}></path>
            </svg>
            <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800" }}>
                {"Facebook"}
              </span>
              <span style={{ "fontSize": "12px" }}>
                {"Ofertas y catálogo"}
              </span>
            </span>
          </DesignLink>
          <DesignLink href={"#tiktok"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px", "border": "2px solid #111111", "borderRadius": "16px", "textDecoration": "none" }}>
            <svg width={"40"} height={"40"} viewBox={"0 0 40 40"} aria-hidden={"true"} style={{ "flex": "none" }}>
              <rect width={"40"} height={"40"} rx={"11"} fill={"#111111"}></rect>
              <path d={"M23.4 9.5c.6 2.7 2.6 4.7 5.3 5v4c-2 0-3.8-.6-5.3-1.7v8.8a7.7 7.7 0 1 1-7.7-7.7h.7v4.2a3.5 3.5 0 1 0 2.8 3.5V9.5z"} fill={"#25F4EE"} transform={"translate(-1 -1)"}></path>
              <path d={"M23.4 9.5c.6 2.7 2.6 4.7 5.3 5v4c-2 0-3.8-.6-5.3-1.7v8.8a7.7 7.7 0 1 1-7.7-7.7h.7v4.2a3.5 3.5 0 1 0 2.8 3.5V9.5z"} fill={"#FE2C55"} transform={"translate(1 1)"}></path>
              <path d={"M23.4 9.5c.6 2.7 2.6 4.7 5.3 5v4c-2 0-3.8-.6-5.3-1.7v8.8a7.7 7.7 0 1 1-7.7-7.7h.7v4.2a3.5 3.5 0 1 0 2.8 3.5V9.5z"} fill={"#FFFFFF"}></path>
            </svg>
            <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800" }}>
                {"TikTok"}
              </span>
              <span style={{ "fontSize": "12px" }}>
                {"Videos de productos"}
              </span>
            </span>
          </DesignLink>
          <DesignLink href={"#youtube"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px", "border": "2px solid #111111", "borderRadius": "16px", "textDecoration": "none" }}>
            <svg width={"40"} height={"40"} viewBox={"0 0 40 40"} aria-hidden={"true"} style={{ "flex": "none" }}>
              <rect x={"1"} y={"7"} width={"38"} height={"26"} rx={"8"} fill={"#FF0000"}></rect>
              <path d={"M16 14v12l10.5-6z"} fill={"#FFFFFF"}></path>
            </svg>
            <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800" }}>
                {"YouTube"}
              </span>
              <span style={{ "fontSize": "12px" }}>
                {"Tutoriales y guías"}
              </span>
            </span>
          </DesignLink>
          <DesignLink href={"#linkedin"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px", "border": "2px solid #111111", "borderRadius": "16px", "textDecoration": "none" }}>
            <svg width={"40"} height={"40"} viewBox={"0 0 40 40"} aria-hidden={"true"} style={{ "flex": "none" }}>
              <rect width={"40"} height={"40"} rx={"8"} fill={"#0A66C2"}></rect>
              <rect x={"9"} y={"16"} width={"5"} height={"15"} fill={"#FFFFFF"}></rect>
              <circle cx={"11.5"} cy={"11"} r={"3"} fill={"#FFFFFF"}></circle>
              <path d={"M18 16h4.8v2.1c.7-1.3 2.4-2.5 4.9-2.5 5 0 5.3 3.3 5.3 7.4V31h-5v-7c0-1.7 0-3.8-2.3-3.8s-2.7 1.8-2.7 3.7V31H18z"} fill={"#FFFFFF"}></path>
            </svg>
            <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800" }}>
                {"LinkedIn"}
              </span>
              <span style={{ "fontSize": "12px" }}>
                {"Ventas a empresas"}
              </span>
            </span>
          </DesignLink>
          <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px", "border": "2px solid #111111", "borderRadius": "16px", "textDecoration": "none" }}>
            <svg width={"40"} height={"40"} viewBox={"0 0 40 40"} aria-hidden={"true"} style={{ "flex": "none" }}>
              <circle cx={"20"} cy={"20"} r={"20"} fill={"#25D366"}></circle>
              <g transform={"translate(8 8)"}>
                <path d={"M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3z"} fill={"#FFFFFF"}></path>
                <path d={"M9.2 7.8c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.9 4.5 3.9 2.2.9 2.7.7 3.2.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.2-.2-.5-.3l-1.7-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.9z"} fill={"#25D366"}></path>
              </g>
            </svg>
            <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800" }}>
                {"WhatsApp"}
              </span>
              <span style={{ "fontSize": "12px" }}>
                {"Atención directa"}
              </span>
            </span>
          </DesignLink>
        </div>
      </section>
      <section className={"via-links-services"}>
        <h2 style={{ "margin": "0 0 2px", "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "900", "textTransform": "uppercase" }}>
          {"Compra y cotiza"}
        </h2>
        {(lookup(v, "links") || []).map((l, index1) => (
          <Fragment key={index1}>
            <DesignLink href={lookup(l, "href")} style={{ "display": "flex", "alignItems": "center", "gap": "14px", "minHeight": "64px", "padding": "0 18px", "borderRadius": "18px", "border": "2px solid #111111", "boxSizing": "border-box", "background": lookup(l, "bg"), "color": lookup(l, "fg"), "textDecoration": "none" }}>
              <span style={{ "width": "40px", "height": "40px", "borderRadius": "12px", "background": lookup(l, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(l, "iconFg")} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={lookup(l, "icon")}></path>
                </svg>
              </span>
              <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800", "textTransform": "uppercase" }}>
                  {lookup(l, "title")}
                </span>
                <span style={{ "fontSize": "13px" }}>
                  {lookup(l, "sub")}
                </span>
              </span>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                <path d={"M5 12h14M13 6l6 6-6 6"}></path>
              </svg>
            </DesignLink>
          </Fragment>
        ))}
      </section>
      <section className={"via-links-contact"}>
        <div style={{ "background": "#111111", "color": "#FFFFFF", "padding": "18px 20px", "display": "flex", "alignItems": "center", "gap": "14px" }}>
          <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "Archivo, sans-serif", "fontSize": "20px", "fontWeight": "900", "flex": "none" }}>
            {"BC"}
          </span>
          <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
            <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "18px", "fontWeight": "800" }}>
              {"Beltran Carlos Ccapa"}
            </span>
            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "color": lookup(v, "accent") }}>
              {"Gerente Comercial"}
            </span>
          </span>
        </div>
        <ul style={{ "listStyle": "none", "margin": "0", "padding": "6px 20px", "display": "flex", "flexDirection": "column" }}>
          <li style={{ "borderBottom": "1px solid #DDDDDD" }}>
            <DesignLink href={"tel:+51954802744"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "textDecoration": "none" }}>
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#E8701F"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"}></path>
              </svg>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700" }}>
                {"+51 954 802 744"}
              </span>
            </DesignLink>
          </li>
          <li style={{ "borderBottom": "1px solid #DDDDDD" }}>
            <DesignLink href={"mailto:viaprovisionesperu@gmail.com"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "textDecoration": "none" }}>
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#E8701F"} strokeWidth={"1.9"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M3 6h18v12H3zM3 7l9 6 9-6"}></path>
              </svg>
              <span style={{ "fontSize": "15px", "fontWeight": "500" }}>
                {"viaprovisionesperu@gmail.com"}
              </span>
            </DesignLink>
          </li>
          <li style={{ "borderBottom": "1px solid #DDDDDD" }}>
            <DesignLink href={"https://www.google.com/maps/search/?api=1&query=Dean+Valdivia+533+Cercado+Arequipa"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "textDecoration": "none" }}>
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#E8701F"} strokeWidth={"1.9"} aria-hidden={"true"}>
                <path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"}></path>
                <circle cx={"12"} cy={"10"} r={"2.5"}></circle>
              </svg>
              <span style={{ "fontSize": "15px", "fontWeight": "500" }}>
                {"Dean Valdivia 533 - Cercado, Arequipa"}
              </span>
            </DesignLink>
          </li>
          <li>
            <DesignLink href={"https://www.viaprovisiones.com"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "textDecoration": "none" }}>
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#E8701F"} strokeWidth={"1.9"} aria-hidden={"true"}>
                <circle cx={"12"} cy={"12"} r={"9"}></circle>
                <path d={"M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"}></path>
              </svg>
              <span style={{ "fontSize": "15px", "fontWeight": "500" }}>
                {"www.viaprovisiones.com"}
              </span>
            </DesignLink>
          </li>
        </ul>
        <div style={{ "padding": "4px 20px 20px" }}>
          <button style={{ "width": "100%", "height": "52px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px" }}>
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
              <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
            </svg>
            {"Guardar contacto"}
          </button>
        </div>
      </section>
      <section className={"via-links-share"} style={{ "background": lookup(v, "accent") }}>
        <span style={{ "background": "#FFFFFF", "borderRadius": "14px", "padding": "8px", "flex": "none" }}>
          <img src={assetSrc("img/2d7ff64ebc4cab97ff138aeb7ef049b7.svg")} alt={"Código QR a www.viaprovisiones.com/enlaces"} style={{ "width": "96px", "height": "96px", "display": "block" }} />
        </span>
        <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
          <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1.1" }}>
            {"Comparte esta página"}
          </span>
          <span style={{ "fontSize": "13px", "lineHeight": "1.4" }}>
            {"Escanea el código para abrir todos nuestros enlaces."}
          </span>
          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700" }}>
            {"viaprovisiones.com/enlaces"}
          </span>
        </span>
      </section>
      <div className={"via-links-footer"}>
        {"© 2026 VIA Provisiones · Arequipa, Perú"}
      </div>
    </div>
    </Fragment>
  )} />;
}
