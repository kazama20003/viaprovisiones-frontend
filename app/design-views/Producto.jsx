"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { img: 0, color: 0, qty: 1, tab: 0, cart: 0, added: false };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const imgs = ['a58999411e32d7481815ba8cdc175e97', 'a39c65aefaa4235a16422fb671911427', '6bfeade76520c7a9cd478f997069e6ca', '621ce65a45113393656af23955c4e044'].map((x) => B + x);
    const colors = [{ name: 'Negro', swatch: '#111111' }, { name: 'Naranja', swatch: accent }];
    const tabNames = ['Descripción', 'Especificaciones', 'Envío'];
    return {
      accent,
      cart: this.state.cart,
      hasCart: this.state.cart > 0,
      mainImg: imgs[this.state.img],
      thumbs: imgs.map((img, i) => ({
        img,
        label: 'Ver foto ' + (i + 1),
        border: i === this.state.img ? '3px solid ' + accent : '1px solid #111111',
        pick: () => this.setState({ img: i })
      })),
      colorName: colors[this.state.color].name,
      colors: colors.map((c, i) => ({
        ...c,
        pressed: i === this.state.color ? 'true' : 'false',
        border: i === this.state.color ? '3px solid #111111' : '1px solid #111111',
        pick: () => this.setState({ color: i })
      })),
      qty: this.state.qty,
      inc: () => this.setState({ qty: this.state.qty + 1 }),
      dec: () => this.setState({ qty: Math.max(1, this.state.qty - 1) }),
      addToCart: () => this.setState({ cart: this.state.cart + this.state.qty, added: true }),
      addLabel: this.state.added ? 'Añadido ✓ · Añadir más' : 'Añadir al carrito',
      tabs: tabNames.map((name, i) => ({
        name,
        selected: i === this.state.tab ? 'true' : 'false',
        border: i === this.state.tab ? '4px solid ' + accent : '4px solid transparent',
        pick: () => this.setState({ tab: i })
      })),
      showDesc: this.state.tab === 0,
      showSpecs: this.state.tab === 1,
      showShip: this.state.tab === 2,
      specs: [
        { k: 'Tipo de luz', v: 'LED, luz cálida' },
        { k: 'Niveles de luz', v: '3' },
        { k: 'Batería', v: '[CAPACIDAD] mAh, recargable por USB' },
        { k: 'Autonomía', v: '[HORAS] horas' },
        { k: 'Medidas', v: '[ALTO × ANCHO] cm' },
        { k: 'Garantía', v: '[MESES] meses' }
      ],
      related: [
        { name: 'Linterna de cabeza LED', price: 'S/ 39.90', img: B + '9b85b845faa6856c6338458b006ed014' },
        { name: 'Kit solar plegable para camping', price: 'S/ 459.00', img: B + 'b6ecf2ad3d873fbfa09db032a5d5c447' },
        { name: 'Set de cocina para campamento', price: 'S/ 129.00', img: B + 'a5d2725814df1e3e53351e1060258c0c' },
        { name: 'Lámpara solar LED para exterior', price: 'S/ 89.90', img: B + '9d99a75423f8001324e3e1e3c77fbb84' }
      ]
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Producto(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.marquee{animation:via-marquee 40s linear infinite}\n@keyframes via-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion: reduce){.marquee{animation:none}}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={lookup(v, "cart")} active={""} />
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "0 40px 80px" }}>
        <nav aria-label={"Ruta"} style={{ "padding": "24px 0", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "display": "flex", "gap": "10px", "flexWrap": "wrap" }}>
          <DesignLink href={"/tienda"} style={{ "textDecoration": "none" }}>
            {"Inicio"}
          </DesignLink>
          <span aria-hidden={"true"}>
            {"/"}
          </span>
          <DesignLink href={"/categoria"} style={{ "textDecoration": "none" }}>
            {"Camping"}
          </DesignLink>
          <span aria-hidden={"true"}>
            {"/"}
          </span>
          <span>
            {"Lámparas y linternas"}
          </span>
        </nav>
        <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "56px", "alignItems": "flex-start" }}>
          <div style={{ "flex": "1 1 560px", "minWidth": "0", "display": "flex", "gap": "16px" }}>
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "12px", "flex": "none" }}>
              {(lookup(v, "thumbs") || []).map((t, index1) => (
                <Fragment key={index1}>
                  <button onClick={lookup(t, "pick")} aria-label={lookup(t, "label")} style={{ "width": "88px", "height": "88px", "padding": "0", "borderRadius": "14px", "overflow": "hidden", "border": lookup(t, "border"), "background": "#FFFFFF", "cursor": "pointer", "boxSizing": "border-box" }}>
                    <img src={assetSrc(lookup(t, "img"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "position": "relative", "flex": "1", "minWidth": "0", "aspectRatio": "1 / 1", "borderRadius": "24px", "overflow": "hidden", "background": "#111111" }}>
              <img src={assetSrc(lookup(v, "mainImg"))} alt={"Lámpara de camping recargable"} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
              <span style={{ "position": "absolute", "top": "18px", "left": "18px", "background": "#111111", "color": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "padding": "6px 12px", "borderRadius": "999px" }}>
                {"Más vendido"}
              </span>
            </div>
          </div>
          <div style={{ "flex": "1 1 440px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "22px" }}>
            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
              {"Camping · Lámparas y linternas · SKU [CÓDIGO]"}
            </span>
            <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "52px", "lineHeight": "1", "textTransform": "uppercase" }}>
              {"Lámpara de camping recargable"}
            </h1>
            <div style={{ "display": "flex", "alignItems": "baseline", "gap": "14px", "flexWrap": "wrap" }}>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "32px", "fontWeight": "700" }}>
                {"S/ 69.90"}
              </span>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "background": lookup(v, "accent"), "padding": "4px 10px", "borderRadius": "999px" }}>
                {"Precio por volumen para empresas"}
              </span>
            </div>
            <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.6" }}>
              {"Lámpara LED con batería recargable por USB, ideal para la casa de campaña, cortes de luz o trabajos de noche. Asa para colgar y luz cálida regulable."}
            </p>
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Color: "}
                {lookup(v, "colorName")}
              </span>
              <div style={{ "display": "flex", "gap": "10px" }}>
                {(lookup(v, "colors") || []).map((c, index2) => (
                  <Fragment key={index2}>
                    <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "minHeight": "46px", "padding": "0 20px", "borderRadius": "999px", "border": lookup(c, "border"), "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "gap": "10px", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "fontWeight": "500" }}>
                      <span style={{ "width": "18px", "height": "18px", "borderRadius": "50%", "background": lookup(c, "swatch"), "border": "1px solid #111111" }}></span>
                      {lookup(c, "name")}
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap", "alignItems": "center" }}>
              <div role={"group"} aria-label={"Cantidad"} style={{ "display": "flex", "alignItems": "center", "height": "56px", "border": "2px solid #111111", "borderRadius": "999px", "boxSizing": "border-box" }}>
                <button onClick={lookup(v, "dec")} aria-label={"Quitar uno"} style={{ "width": "52px", "height": "52px", "border": "none", "background": "transparent", "cursor": "pointer", "fontSize": "22px", "color": "#111111" }}>
                  {"−"}
                </button>
                <span style={{ "minWidth": "36px", "textAlign": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "18px", "fontWeight": "700" }}>
                  {lookup(v, "qty")}
                </span>
                <button onClick={lookup(v, "inc")} aria-label={"Agregar uno"} style={{ "width": "52px", "height": "52px", "border": "none", "background": "transparent", "cursor": "pointer", "fontSize": "22px", "color": "#111111" }}>
                  {"+"}
                </button>
              </div>
              <button onClick={lookup(v, "addToCart")} style={{ "flex": "1 1 220px", "height": "56px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase" }}>
                {lookup(v, "addLabel")}
              </button>
            </div>
            <DesignLink href={"/enlaces"} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px", "height": "56px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase" }}>
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
              </svg>
              {"Pedir por WhatsApp"}
            </DesignLink>
            <ul style={{ "listStyle": "none", "margin": "0", "padding": "18px 0 0", "borderTop": "1px solid #111111", "display": "flex", "flexDirection": "column", "gap": "12px", "fontSize": "16px" }}>
              <li style={{ "display": "flex", "gap": "12px", "alignItems": "center" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M3 7h11v9H3zM14 10h4l3 3v3h-7"}></path>
                </svg>
                {"Recojo en Arequipa · Envío a todo el Perú"}
              </li>
              <li style={{ "display": "flex", "gap": "12px", "alignItems": "center" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"}></path>
                </svg>
                {"Pago seguro con tarjeta, Yape o transferencia"}
              </li>
              <li style={{ "display": "flex", "gap": "12px", "alignItems": "center" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M4 4h16v16H4zM8 9h8M8 13h8M8 17h5"}></path>
                </svg>
                {"Boleta o factura electrónica"}
              </li>
            </ul>
            <DesignLink href={"/empresas"} style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px" }}>
              {"¿Compras por volumen? Cotiza para tu empresa →"}
            </DesignLink>
          </div>
        </div>
        <section style={{ "marginTop": "72px" }}>
          <div role={"tablist"} aria-label={"Detalles del producto"} style={{ "display": "flex", "gap": "28px", "borderBottom": "1px solid #111111", "flexWrap": "wrap" }}>
            {(lookup(v, "tabs") || []).map((t, index3) => (
              <Fragment key={index3}>
                <button role={"tab"} aria-selected={lookup(t, "selected")} onClick={lookup(t, "pick")} style={{ "height": "56px", "border": "none", "borderBottom": lookup(t, "border"), "background": "transparent", "cursor": "pointer", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "800", "textTransform": "uppercase", "color": "#111111", "padding": "0" }}>
                  {lookup(t, "name")}
                </button>
              </Fragment>
            ))}
          </div>
          {Boolean(lookup(v, "showDesc")) && (
            <Fragment>
              <div style={{ "padding": "32px 0", "maxWidth": "820px", "fontSize": "18px", "lineHeight": "1.65" }}>
                <p style={{ "margin": "0 0 16px" }}>
                  {"Ilumina tu campamento, tu patio o cualquier espacio sin enchufe. Se carga con cable USB y tiene tres niveles de luz para ahorrar batería cuando no necesitas toda la potencia."}
                </p>
                <p style={{ "margin": "0" }}>
                  {"Su cuerpo resistente y el asa plegable te permiten colgarla dentro de la casa de campaña o llevarla en la mano."}
                </p>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "showSpecs")) && (
            <Fragment>
              <div style={{ "padding": "24px 0", "maxWidth": "820px" }}>
                {(lookup(v, "specs") || []).map((s, index4) => (
                  <Fragment key={index4}>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px", "padding": "14px 0", "borderBottom": "1px solid #DDDDDD" }}>
                      <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                        {lookup(s, "k")}
                      </span>
                      <span>
                        {lookup(s, "v")}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "showShip")) && (
            <Fragment>
              <div style={{ "padding": "32px 0", "maxWidth": "820px", "fontSize": "18px", "lineHeight": "1.65" }}>
                <p style={{ "margin": "0 0 12px" }}>
                  {"Puedes recoger tu pedido en nuestra tienda de Dean Valdivia 533, Cercado de Arequipa, o recibirlo en cualquier ciudad del Perú. Plazo de envío: [PLAZO]."}
                </p>
                <p style={{ "margin": "0" }}>
                  {"Para pedidos de empresas coordinamos entregas programadas en obra, almacén o campamento."}
                </p>
              </div>
            </Fragment>
          )}
        </section>
        <section style={{ "marginTop": "40px" }}>
          <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "36px", "textTransform": "uppercase", "margin": "0 0 28px" }}>
            {"También te puede "}
            <span style={{ "color": "#E8701F" }}>
              {"servir"}
            </span>
          </h2>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fill, minmax(240px, 1fr))", "gap": "32px 20px" }}>
            {(lookup(v, "related") || []).map((p, index5) => (
              <Fragment key={index5}>
                <DesignLink href={"/producto"} style={{ "display": "flex", "flexDirection": "column", "textDecoration": "none" }}>
                  <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "100%", "aspectRatio": "1 / 1", "objectFit": "cover", "borderRadius": "19px", "display": "block" }} />
                  <span style={{ "marginTop": "14px", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "700", "textTransform": "uppercase", "lineHeight": "1.3" }}>
                    {lookup(p, "name")}
                  </span>
                  <span style={{ "marginTop": "8px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700" }}>
                    {lookup(p, "price")}
                  </span>
                </DesignLink>
              </Fragment>
            ))}
          </div>
        </section>
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
