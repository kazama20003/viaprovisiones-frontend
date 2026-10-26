"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = {
      doc: 0,
      pay: 0,
      lines: [
        { id: 1, cat: 'Camping', name: 'Lámpara de camping recargable', price: 69.9, qty: 2, img: 'a58999411e32d7481815ba8cdc175e97' },
        { id: 2, cat: 'Solar', name: 'Panel solar monocristalino 100 W', price: 349, qty: 1, img: '972ceb606bfca75ef6208d8d3966c77d' },
        { id: 3, cat: 'Cables', name: 'Cable USB-C carga rápida 1 m', price: 19.9, qty: 3, img: '3aba2390d3fbd5f06fdd2cede507b16f' }
      ]
    };
  }
  renderVals() {
    const accent = this.props.accent ?? '#FF914C';
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const setQty = (id, d) => this.setState({ lines: this.state.lines.map((l) => (l.id === id ? { ...l, qty: Math.max(1, l.qty + d) } : l)) });
    const lines = this.state.lines;
    const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
    const freeShip = subtotal >= 200;
    const shipping = lines.length === 0 || freeShip ? 0 : 15;
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const docNames = ['Boleta', 'Factura'];
    const payNames = ['Tarjeta de crédito o débito', 'Yape / Plin', 'Transferencia bancaria'];
    return {
      accent,
      cartCount: count,
      countLabel: count + (count === 1 ? ' producto' : ' productos'),
      empty: lines.length === 0,
      lines: lines.map((l) => ({
        ...l,
        img: 'img/' + l.img,
        unit: money(l.price),
        total: money(l.price * l.qty),
        inc: () => setQty(l.id, 1),
        dec: () => setQty(l.id, -1),
        remove: () => this.setState({ lines: this.state.lines.filter((x) => x.id !== l.id) })
      })),
      docs: docNames.map((name, i) => ({
        name,
        pressed: i === this.state.doc ? 'true' : 'false',
        bg: i === this.state.doc ? accent : '#FFFFFF',
        pick: () => this.setState({ doc: i })
      })),
      isFactura: this.state.doc === 1,
      pays: payNames.map((name, i) => ({
        name,
        pressed: i === this.state.pay ? 'true' : 'false',
        border: i === this.state.pay ? '3px solid #111111' : '1px solid #111111',
        dot: i === this.state.pay ? accent : '#FFFFFF',
        pick: () => this.setState({ pay: i })
      })),
      subtotal: money(subtotal),
      shipping: shipping === 0 ? 'Gratis' : money(shipping),
      shipNote: freeShip ? 'Tu pedido tiene envío gratis.' : 'Envío gratis desde S/ 200.00 (ejemplo).',
      total: money(subtotal + shipping)
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Carrito(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.marquee{animation:via-marquee 40s linear infinite}\n@keyframes via-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion: reduce){.marquee{animation:none}}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={lookup(v, "cartCount")} active={""} />
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "48px 40px 80px" }}>
        <h1 style={{ "margin": "0 0 32px", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "56px", "textTransform": "uppercase", "lineHeight": "1" }}>
          {"Tu carrito "}
          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "20px", "fontWeight": "700", "verticalAlign": "middle", "background": lookup(v, "accent"), "padding": "4px 12px", "borderRadius": "999px" }}>
            {lookup(v, "countLabel")}
          </span>
        </h1>
        <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "48px", "alignItems": "flex-start" }}>
          <section aria-label={"Productos"} style={{ "flex": "999 1 640px", "minWidth": "0", "borderTop": "2px solid #111111" }}>
            {Boolean(lookup(v, "empty")) && (
              <Fragment>
                <div style={{ "padding": "48px 0", "display": "flex", "flexDirection": "column", "gap": "16px", "alignItems": "flex-start" }}>
                  <p style={{ "margin": "0", "fontSize": "20px" }}>
                    {"Tu carrito está vacío."}
                  </p>
                  <a href={"/tienda"} style={{ "display": "inline-flex", "alignItems": "center", "height": "54px", "padding": "0 28px", "borderRadius": "999px", "background": lookup(v, "accent"), "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Ver productos"}
                  </a>
                </div>
              </Fragment>
            )}
            {(lookup(v, "lines") || []).map((l, index1) => (
              <Fragment key={index1}>
                <div style={{ "display": "flex", "gap": "20px", "alignItems": "center", "padding": "22px 0", "borderBottom": "1px solid #111111", "flexWrap": "wrap" }}>
                  <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "120px", "height": "120px", "objectFit": "cover", "borderRadius": "14px", "flex": "none" }} />
                  <div style={{ "flex": "1 1 220px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {lookup(l, "cat")}
                    </span>
                    <a href={"/producto"} style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "19px", "fontWeight": "800", "textTransform": "uppercase", "textDecoration": "none", "lineHeight": "1.25" }}>
                      {lookup(l, "name")}
                    </a>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px" }}>
                      {lookup(l, "unit")}
                      {" c/u"}
                    </span>
                  </div>
                  <div role={"group"} aria-label={"Cantidad"} style={{ "display": "flex", "alignItems": "center", "height": "48px", "border": "2px solid #111111", "borderRadius": "999px", "boxSizing": "border-box" }}>
                    <button onClick={lookup(l, "dec")} aria-label={"Quitar uno"} style={{ "width": "44px", "height": "44px", "border": "none", "background": "transparent", "cursor": "pointer", "fontSize": "20px", "color": "#111111" }}>
                      {"−"}
                    </button>
                    <span style={{ "minWidth": "28px", "textAlign": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700" }}>
                      {lookup(l, "qty")}
                    </span>
                    <button onClick={lookup(l, "inc")} aria-label={"Agregar uno"} style={{ "width": "44px", "height": "44px", "border": "none", "background": "transparent", "cursor": "pointer", "fontSize": "20px", "color": "#111111" }}>
                      {"+"}
                    </button>
                  </div>
                  <span style={{ "minWidth": "120px", "textAlign": "right", "fontFamily": "'Roboto Mono', monospace", "fontSize": "18px", "fontWeight": "700" }}>
                    {lookup(l, "total")}
                  </span>
                  <button onClick={lookup(l, "remove")} aria-label={"Quitar del carrito"} style={{ "width": "44px", "height": "44px", "border": "1px solid #111111", "borderRadius": "50%", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
                      <path d={"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"}></path>
                    </svg>
                  </button>
                </div>
              </Fragment>
            ))}
            <div style={{ "marginTop": "28px", "padding": "22px 24px", "border": "2px dashed #111111", "borderRadius": "16px", "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "16px", "flexWrap": "wrap" }}>
              <span style={{ "fontSize": "16px" }}>
                <strong>
                  {"¿Compras para tu empresa?"}
                </strong>
                {" Pide precios por volumen y entrega programada."}
              </span>
              <a href={"/empresas"} style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px" }}>
                {"Solicitar cotización →"}
              </a>
            </div>
          </section>
          <aside aria-label={"Resumen del pedido"} style={{ "flex": "1 1 380px", "maxWidth": "460px", "border": "2px solid #111111", "borderRadius": "20px", "padding": "28px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "22px" }}>
            <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "900", "textTransform": "uppercase" }}>
              {"Resumen"}
            </h2>
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Comprobante"}
              </span>
              <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                {(lookup(v, "docs") || []).map((d, index2) => (
                  <Fragment key={index2}>
                    <button onClick={lookup(d, "pick")} aria-pressed={lookup(d, "pressed")} style={{ "height": "46px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(d, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {lookup(d, "name")}
                    </button>
                  </Fragment>
                ))}
              </div>
              {Boolean(lookup(v, "isFactura")) && (
                <Fragment>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "marginTop": "4px" }}>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                      {"RUC"}
                      <input type={"text"} inputMode={"numeric"} placeholder={"20XXXXXXXXX"} style={{ "height": "46px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                      {"Razón social"}
                      <input type={"text"} style={{ "height": "46px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                    </label>
                  </div>
                </Fragment>
              )}
            </div>
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Método de pago"}
              </span>
              {(lookup(v, "pays") || []).map((p, index3) => (
                <Fragment key={index3}>
                  <button onClick={lookup(p, "pick")} aria-pressed={lookup(p, "pressed")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "padding": "0 16px", "borderRadius": "14px", "border": lookup(p, "border"), "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "textAlign": "left", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "fontWeight": "500" }}>
                    <span style={{ "width": "18px", "height": "18px", "borderRadius": "50%", "border": "2px solid #111111", "boxSizing": "border-box", "background": lookup(p, "dot") }}></span>
                    {lookup(p, "name")}
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "borderTop": "1px solid #111111", "paddingTop": "18px", "fontSize": "16px" }}>
              <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                <span>
                  {"Subtotal"}
                </span>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontWeight": "700" }}>
                  {lookup(v, "subtotal")}
                </span>
              </div>
              <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                <span>
                  {"Envío"}
                </span>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontWeight": "700" }}>
                  {lookup(v, "shipping")}
                </span>
              </div>
              <span style={{ "fontSize": "13px", "color": "#444444" }}>
                {"Precios con IGV incluido. "}
                {lookup(v, "shipNote")}
              </span>
              <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "marginTop": "6px" }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "20px", "fontWeight": "900", "textTransform": "uppercase" }}>
                  {"Total"}
                </span>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "26px", "fontWeight": "700" }}>
                  {lookup(v, "total")}
                </span>
              </div>
            </div>
            <a href={"/checkout"} style={{ "height": "58px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase" }}>
              {"Ir a pagar"}
            </a>
            <a href={"/enlaces"} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px", "height": "52px", "borderRadius": "999px", "border": "2px solid #111111", "boxSizing": "border-box", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
              </svg>
              {"Enviar pedido por WhatsApp"}
            </a>
          </aside>
        </div>
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
