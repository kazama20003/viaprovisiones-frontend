"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  renderVals() {
    const L = (label, href) => ({ label, href });
    return {
      accent: this.props.accent ?? '#FF914C',
      socials: [
        { name: 'Instagram', href: '#instagram', icon: 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM17 6.5h.01' },
        { name: 'Facebook', href: '#facebook', icon: 'M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z' },
        { name: 'TikTok', href: '#tiktok', icon: 'M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.5 2.5 2.5 4 5 4' },
        { name: 'YouTube', href: '#youtube', icon: 'M7 6h10a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4zM10 9.5v5l4.5-2.5z' },
        { name: 'LinkedIn', href: '#linkedin', icon: 'M4 4h16v16H4zM8 10v6M8 7.5v.01M12 16v-6M12 13c0-2 4-2.5 4 0v3' },
        { name: 'WhatsApp', href: 'https://wa.me/51954802744', icon: 'M4 20l1.3-4A8 8 0 1 1 8 18.7z' }
      ],
      cols: [
        { title: 'Categorías', links: ['Focos', 'Solar', 'Cables', 'Extensiones', 'Llaveros', 'Ganchos', 'Camping', 'Bisutería'].map((x) => L(x, '/categoria')) },
        { title: 'Compra', links: [L('Ofertas', '/categoria'), L('Kits VIA', '/tienda'), L('Guías', '/tienda'), L('Mi carrito', '/carrito'), L('Pedir por WhatsApp', 'https://wa.me/51954802744')] },
        { title: 'Empresas', links: [L('Minoristas y bodegas', '/empresas'), L('Mayoristas y distribuidores', '/empresas'), L('Ferreterías', '/empresas'), L('Construcción y minería', '/empresas'), L('Solicitar cotización', '/empresas')] },
        { title: 'Ayuda', links: [L('Envíos y recojo en tienda', '#envios'), L('Cambios y devoluciones', '#devoluciones'), L('Preguntas frecuentes', '#faq'), L('Términos y condiciones', '#terminos'), L('Política de privacidad', '#privacidad'), L('Enlaces y redes', '/enlaces')] }
      ],
      pays: ['Visa', 'Mastercard', 'Yape', 'Plin', 'Transferencia'].map((name) => ({ name }))
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Footer(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0}\n"}</style>
    <footer style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "16px", "letterSpacing": "0.02em", "color": "#111111", "background": lookup(v, "accent") }}>
      <div style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "56px 40px 40px", "boxSizing": "border-box", "display": "flex", "flexWrap": "wrap", "gap": "40px", "justifyContent": "space-between", "borderBottom": "2px solid #111111" }}>
        <div style={{ "flex": "1 1 420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
          <svg width={"220"} height={"73"} viewBox={"134 205 278 92"} role={"img"} aria-label={"VIA Provisiones"}>
            <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"3"}></circle>
            <clipPath id={"via-clip-ftr"}>
              <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
            </clipPath>
            <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
            <path clipPath={"url(#via-clip-ftr)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
            <g fill={"none"} stroke={"#FFFFFF"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
              <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
              <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
              <path d={"M295.8 229 V248.25"}></path>
            </g>
            <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={"#FFFFFF"}>
              {"PROVISIONES"}
            </text>
          </svg>
          <span style={{ "fontFamily": "Montserrat, sans-serif", "fontSize": "12px", "fontWeight": "500", "letterSpacing": "0.3em" }}>
            {"ILUMINACIÓN · SEGURIDAD · ACCESORIOS"}
          </span>
          <h2 style={{ "margin": "6px 0 0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "36px", "lineHeight": "1.05", "textTransform": "uppercase" }}>
            {"Recibe ofertas y novedades"}
          </h2>
          <form style={{ "display": "flex", "alignItems": "center", "width": "100%", "maxWidth": "420px", "height": "52px", "background": "#FFFFFF", "border": "2px solid #111111", "borderRadius": "999px", "padding": "0 4px 0 20px", "boxSizing": "border-box" }}>
            <label htmlFor={"ftr-email"} style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
              {"Correo electrónico"}
            </label>
            <input id={"ftr-email"} type={"email"} placeholder={"Tu correo electrónico"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "16px", "color": "#111111", "outline": "none" }} />
            <button type={"button"} style={{ "height": "42px", "padding": "0 18px", "border": "none", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
              {"Suscribirme"}
            </button>
          </form>
          <div style={{ "display": "flex", "gap": "10px", "flexWrap": "wrap" }}>
            {(lookup(v, "socials") || []).map((s, index1) => (
              <Fragment key={index1}>
                <DesignLink href={lookup(s, "href")} aria-label={lookup(s, "name")} style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(s, "icon")}></path>
                  </svg>
                </DesignLink>
              </Fragment>
            ))}
          </div>
        </div>
        <address style={{ "flex": "0 1 360px", "fontStyle": "normal", "display": "flex", "flexDirection": "column", "gap": "4px", "background": "#FFFFFF", "border": "2px solid #111111", "borderRadius": "20px", "padding": "24px" }}>
          <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "18px", "fontWeight": "900", "textTransform": "uppercase", "marginBottom": "8px" }}>
            {"Contáctanos"}
          </span>
          <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "44px", "textDecoration": "none", "color": "#111111" }}>
            <span style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "background": "#25D366", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
                <path d={"M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3z"} fill={"#FFFFFF"}></path>
              </svg>
            </span>
            <span style={{ "display": "flex", "flexDirection": "column" }}>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700" }}>
                {"+51 954 802 744"}
              </span>
              <span style={{ "fontSize": "12px" }}>
                {"WhatsApp y llamadas"}
              </span>
            </span>
          </DesignLink>
          <DesignLink href={"mailto:viaprovisionesperu@gmail.com"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "44px", "textDecoration": "none", "color": "#111111" }}>
            <span style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M3 6h18v12H3zM3 7l9 6 9-6"}></path>
              </svg>
            </span>
            <span style={{ "fontSize": "15px", "fontWeight": "500" }}>
              {"viaprovisionesperu@gmail.com"}
            </span>
          </DesignLink>
          <DesignLink href={"https://www.google.com/maps/search/?api=1&query=Dean+Valdivia+533+Cercado+Arequipa"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "44px", "textDecoration": "none", "color": "#111111" }}>
            <span style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
                <path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"}></path>
                <circle cx={"12"} cy={"10"} r={"2.5"}></circle>
              </svg>
            </span>
            <span style={{ "fontSize": "15px", "fontWeight": "500" }}>
              {"Dean Valdivia 533 - Cercado, Arequipa"}
            </span>
          </DesignLink>
          <span style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "44px" }}>
            <span style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
                <circle cx={"12"} cy={"12"} r={"9"}></circle>
                <path d={"M12 7v5l3 2"}></path>
              </svg>
            </span>
            <span style={{ "fontSize": "15px", "fontWeight": "500" }}>
              {"Lun a sáb · [HORARIO]"}
            </span>
          </span>
        </address>
      </div>
      <div style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "40px 40px 48px", "boxSizing": "border-box", "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))", "gap": "32px" }}>
        {(lookup(v, "cols") || []).map((c, index2) => (
          <Fragment key={index2}>
            <nav aria-label={lookup(c, "title")} style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "900", "textTransform": "uppercase", "marginBottom": "4px" }}>
                {lookup(c, "title")}
              </span>
              {(lookup(c, "links") || []).map((k, index3) => (
                <Fragment key={index3}>
                  <DesignLink href={lookup(k, "href")} style={{ "color": "#111111", "textDecoration": "none", "fontSize": "15px", "minHeight": "28px", "display": "inline-flex", "alignItems": "center" }}>
                    {lookup(k, "label")}
                  </DesignLink>
                </Fragment>
              ))}
            </nav>
          </Fragment>
        ))}
      </div>
      <div style={{ "background": "#111111", "color": "#FFFFFF" }}>
        <div style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "20px 40px", "boxSizing": "border-box", "display": "flex", "flexWrap": "wrap", "gap": "16px 32px", "alignItems": "center", "justifyContent": "space-between" }}>
          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "500" }}>
            {"© 2026 VIA Provisiones · RUC [RUC] · Arequipa, Perú"}
          </span>
          <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap", "alignItems": "center" }}>
            {(lookup(v, "pays") || []).map((p, index4) => (
              <Fragment key={index4}>
                <span style={{ "height": "28px", "padding": "0 10px", "borderRadius": "6px", "background": "#FFFFFF", "color": "#111111", "display": "flex", "alignItems": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {lookup(p, "name")}
                </span>
              </Fragment>
            ))}
          </div>
          <DesignLink href={"#reclamaciones"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "minHeight": "44px", "padding": "0 16px", "borderRadius": "10px", "border": "2px solid #FFFFFF", "color": "#FFFFFF", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "boxSizing": "border-box" }}>
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
              <path d={"M5 4h11l3 3v13H5zM9 9h6M9 13h6M9 17h4"}></path>
            </svg>
            {"Libro de Reclamaciones"}
          </DesignLink>
        </div>
      </div>
    </footer>
    </Fragment>
  )} />;
}
