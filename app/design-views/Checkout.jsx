"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { step: 1, doc: 0, cel: '', docId: '', tried: false, ship: 1, agency: 0, date: 1, pay: 0, uploaded: false, coupon: false };
  }
  renderVals() {
    const st = this.state;
    const accent = this.props.accent ?? '#FF914C';
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // mismos productos de ejemplo que el carrito
    const LINES = [
      ['Camping', 'Lámpara de camping recargable', 69.9, 2, 'a58999411e32d7481815ba8cdc175e97'],
      ['Solar', 'Panel solar monocristalino 100 W', 349, 1, '972ceb606bfca75ef6208d8d3966c77d'],
      ['Cables', 'Cable USB-C carga rápida 1 m', 19.9, 3, '3aba2390d3fbd5f06fdd2cede507b16f']
    ];
    const subtotal = LINES.reduce((s, l) => s + l[2] * l[3], 0);
    const discount = st.coupon ? Math.round(subtotal * 0.05 * 100) / 100 : 0;
    const freeShip = subtotal - discount >= 200;
    const SHIPS = [
      ['Recojo en tienda', 'Dean Valdivia 533 - Cercado, Arequipa · listo en 2 h', 'M3 9l1-5h16l1 5M4 9v11h16V9M3 9h18M9 20v-6h6v6', 'Gratis', 0],
      ['Delivery en Arequipa', 'Motorizado a tu puerta · 24 h', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5', freeShip ? 'Gratis' : '[TARIFA]', freeShip ? 0 : 10],
      ['Agencia a provincias', 'Cusco, Puno, Moquegua, Tacna, Lima…', 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1', 'Pagas al recoger', 0]
    ];
    const ship = SHIPS[st.ship];
    const total = subtotal - discount + ship[4];
    const PAYS = [
      ['Yape', 'Al instante, desde tu celular'],
      ['Plin', 'Al instante, desde tu banco'],
      ['Transferencia bancaria', '[BANCO] · confirmamos en horas'],
      ['Efectivo contra entrega', st.ship === 2 ? 'No disponible para envíos por agencia' : 'Solo en Arequipa'],
      ['Tarjeta de crédito o débito', 'Próximamente']
    ];
    const payOff = (i) => i === 4 || (i === 3 && st.ship === 2);
    const pay = payOff(st.pay) ? 0 : st.pay;
    const celOk = st.cel.replace(/\D/g, '').length === 9;
    const docDigits = st.docId.replace(/\D/g, '').length;
    const docOk = st.doc === 1 ? docDigits === 11 : docDigits === 0 || docDigits === 8;
    const step1Ok = celOk && docOk;
    const err1 = st.step === 1 && st.tried && !step1Ok;
    const NAMES = ['Datos', 'Entrega', 'Pago', 'Confirmación'];
    const D = [['Hoy', '26 oct'], ['Mar', '27 oct'], ['Mié', '28 oct'], ['Jue', '29 oct'], ['Vie', '30 oct'], ['Sáb', '31 oct']];
    const slot = st.ship === 0 ? 'desde 15:00' : (st.ship === 1 ? '9:00 – 13:00' : 'sale 18:00');
    const go = (n) => this.setState({ step: n, tried: false });
    return {
      accent,
      cartCount: LINES.reduce((s, l) => s + l[3], 0),
      pageTitle: st.step === 4 ? 'Pedido confirmado' : 'Pago',
      steps: NAMES.map((name, i) => {
        const n = i + 1;
        const done = n < st.step;
        const on = n === st.step;
        return {
          name, mark: done ? '✓' : String(n), current: on ? 'step' : 'false',
          bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111',
          ring: on ? accent : '#111111', dotBg: done || on ? accent : '#FFFFFF', dotFg: '#111111'
        };
      }),
      showError: err1,
      errorText: !celOk ? 'Escribe tu celular de 9 dígitos para avisarte por WhatsApp.' : (st.doc === 1 ? 'El RUC debe tener 11 dígitos para emitir la factura.' : 'El DNI debe tener 8 dígitos.'),
      isStep1: st.step === 1,
      isStep2: st.step === 2,
      isStep3: st.step === 3,
      isStep4: st.step === 4,
      onCel: (e) => this.setState({ cel: (e && e.target && e.target.value) || '' }),
      onDocId: (e) => this.setState({ docId: (e && e.target && e.target.value) || '' }),
      celBorder: err1 && !celOk ? '#C62828' : '#111111',
      docIdBorder: err1 && celOk && !docOk ? '#C62828' : '#111111',
      docIdLabel: st.doc === 1 ? 'RUC' : 'DNI (opcional)',
      docIdPh: st.doc === 1 ? '20XXXXXXXXX' : '8 dígitos',
      docs: ['Boleta', 'Factura'].map((name, i) => ({
        name, pressed: i === st.doc ? 'true' : 'false', bg: i === st.doc ? accent : '#FFFFFF',
        pick: () => this.setState({ doc: i })
      })),
      isFactura: st.doc === 1,
      ships: SHIPS.map((x, i) => ({
        name: x[0], sub: x[1], icon: x[2], price: x[3],
        pressed: i === st.ship ? 'true' : 'false',
        border: i === st.ship ? '3px solid #111111' : '1px solid #111111',
        dot: i === st.ship ? accent : '#FFFFFF',
        pick: () => this.setState({ ship: i })
      })),
      isPickup: st.ship === 0,
      isDelivery: st.ship === 1,
      isAgency: st.ship === 2,
      agencies: ['Shalom', 'Olva Courier', 'Marvisur'].map((name, i) => ({
        name, pressed: i === st.agency ? 'true' : 'false', bg: i === st.agency ? accent : '#FFFFFF',
        pick: () => this.setState({ agency: i })
      })),
      dateLabel: st.ship === 0 ? 'Día de recojo' : (st.ship === 1 ? 'Fecha de entrega' : 'Día de envío a la agencia'),
      dates: D.map((d, i) => ({
        day: d[0], date: d[1], slot: i === 0 && st.ship !== 0 ? 'Agotado' : slot,
        pressed: i === st.date ? 'true' : 'false', bg: i === st.date ? accent : '#FFFFFF',
        pick: () => this.setState({ date: i })
      })),
      pays: PAYS.map((x, i) => {
        const off = payOff(i);
        const on = i === pay;
        return {
          name: x[0], sub: x[1], disabled: off ? 'true' : 'false',
          pressed: on ? 'true' : 'false',
          border: on ? '3px solid #111111' : '1px solid #111111',
          dot: on ? accent : '#FFFFFF', o: off ? '0.45' : '1', cursor: off ? 'not-allowed' : 'pointer',
          pick: () => { if (!off) this.setState({ pay: i, uploaded: false }); }
        };
      }),
      isWallet: pay === 0 || pay === 1,
      walletName: pay === 1 ? 'Plin' : 'Yape',
      isTransfer: pay === 2,
      isCash: pay === 3,
      upload: () => this.setState({ uploaded: !st.uploaded }),
      uploadTitle: st.uploaded ? 'constancia-yape.jpg' : 'Sube tu constancia',
      uploadSub: st.uploaded ? 'Lista. Toca para cambiarla.' : 'Captura de pantalla del pago · JPG o PNG',
      uploadIcon: st.uploaded ? 'M5 12l5 5 9-10' : 'M12 16V4M7 9l5-5 5 5M4 20h16',
      uploadBorder: st.uploaded ? '#1B5E20' : '#111111',
      uploadBg: st.uploaded ? '#E4F4E7' : '#FFFFFF',
      confirmWhat: st.ship === 0 ? 'el pago y avisarte cuando esté listo para recoger' : (st.ship === 1 ? 'el pago y la hora de entrega' : 'el pago y enviarte la clave de la agencia'),
      confirmNext: st.doc === 1 ? 'Tu factura llegará a tu correo.' : 'Tu boleta llegará a tu correo.',
      confirmRows: [
        ['Entrega', ship[0] + ' · ' + D[st.date][1]],
        ['Pago', PAYS[pay][0]],
        ['Total', money(total)]
      ].map((r) => ({ k: r[0], v: r[1] })),
      showNav: st.step < 4,
      canBack: st.step > 1,
      back: () => go(Math.max(1, st.step - 1)),
      next: () => {
        if (st.step === 1 && !step1Ok) { this.setState({ tried: true }); return; }
        go(st.step + 1);
      },
      nextLabel: st.step === 3 ? 'Confirmar pedido' : 'Continuar',
      stepHint: st.step === 3 ? 'Total a pagar: ' + money(total) : 'Paso ' + st.step + ' de 3',
      lines: LINES.map((l) => ({ cat: l[0], name: l[1], qty: String(l[3]), total: money(l[2] * l[3]), img: 'img/' + l[4] })),
      coupon: st.coupon,
      applyCoupon: () => this.setState({ coupon: !st.coupon }),
      couponBtn: st.coupon ? 'Quitar' : 'Aplicar',
      couponBg: st.coupon ? accent : '#FFFFFF',
      subtotal: money(subtotal),
      discount: money(discount),
      shipName: ship[0],
      shipping: ship[4] === 0 ? (st.ship === 2 ? 'En la agencia' : 'Gratis') : money(ship[4]),
      shipNote: st.ship === 2 ? 'El flete de la agencia se paga al recoger.' : (freeShip ? 'Tu pedido tiene envío gratis en Arequipa.' : 'Envío gratis desde S/ 200.00 (ejemplo).'),
      total: money(total),
      trust: [
        ['M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z', 'Pago seguro: confirmamos cada pago antes de despachar.'],
        ['M4 20l1.3-4A8 8 0 1 1 8 18.7z', 'Atención por WhatsApp al +51 954 802 744.'],
        ['M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4', 'Boleta o factura electrónica con cada compra.']
      ].map((t) => ({ icon: t[0], text: t[1] }))
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Checkout(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.marquee{animation:via-marquee 40s linear infinite}\n@keyframes via-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion: reduce){.marquee{animation:none}}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.ck-field{height: 50px; border: 1px solid #111111; border-radius: 10px; padding: 0 14px; font-family: Roboto, sans-serif; font-size: 16px; box-sizing: border-box; width: 100%; background: #FFFFFF}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={lookup(v, "cartCount")} active={""} />
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "48px 40px 80px" }}>
        <a href={"/carrito"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px" }}>
          {"← Volver al carrito"}
        </a>
        <h1 style={{ "margin": "14px 0 28px", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "56px", "textTransform": "uppercase", "lineHeight": "1" }}>
          {lookup(v, "pageTitle")}
        </h1>
        <ol aria-label={"Pasos del pago"} style={{ "listStyle": "none", "margin": "0 0 36px", "padding": "0", "display": "grid", "gridTemplateColumns": "repeat(4, minmax(0, 1fr))", "gap": "10px" }}>
          {(lookup(v, "steps") || []).map((s, index1) => (
            <Fragment key={index1}>
              <li aria-current={lookup(s, "current")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(s, "bg"), "color": lookup(s, "fg") }}>
                <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "2px solid " + String(lookup(s, "ring") ?? ""), "background": lookup(s, "dotBg"), "color": lookup(s, "dotFg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "flex": "none", "boxSizing": "border-box" }}>
                  {lookup(s, "mark")}
                </span>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {lookup(s, "name")}
                </span>
              </li>
            </Fragment>
          ))}
        </ol>
        <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "48px", "alignItems": "flex-start" }}>
          <section aria-label={lookup(v, "pageTitle")} style={{ "flex": "999 1 640px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "26px" }}>
            {Boolean(lookup(v, "showError")) && (
              <Fragment>
                <div role={"alert"} style={{ "display": "flex", "gap": "12px", "alignItems": "center", "padding": "14px 18px", "borderRadius": "14px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "15px", "fontWeight": "500" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                    <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                  </svg>
                  {lookup(v, "errorText")}
                </div>
              </Fragment>
            )}
            {Boolean(lookup(v, "isStep1")) && (
              <Fragment>
                <div style={{ "borderTop": "2px solid #111111", "paddingTop": "24px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                  <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900", "textTransform": "uppercase" }}>
                    {"Tus datos"}
                  </h2>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                      {"Nombre y apellido"}
                      <input className={"ck-field"} type={"text"} autoComplete={"name"} placeholder={"María Quispe"} />
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                      {"Celular (WhatsApp)"}
                      <span style={{ "display": "flex", "alignItems": "center", "height": "50px", "border": "1px solid " + String(lookup(v, "celBorder") ?? ""), "borderRadius": "10px", "overflow": "hidden" }}>
                        <span style={{ "height": "100%", "padding": "0 12px", "display": "flex", "alignItems": "center", "background": "#F2F2F2", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "borderRight": "1px solid #111111" }}>
                          {"+51"}
                        </span>
                        <input type={"tel"} inputMode={"numeric"} autoComplete={"tel-national"} onChange={lookup(v, "onCel")} placeholder={"9XX XXX XXX"} style={{ "flex": "1", "minWidth": "0", "height": "100%", "border": "none", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px", "outline": "none" }} />
                      </span>
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                      {"Correo"}
                      <input className={"ck-field"} type={"email"} autoComplete={"email"} placeholder={"tu@correo.com"} />
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                      {lookup(v, "docIdLabel")}
                      <input className={"ck-field"} type={"text"} inputMode={"numeric"} onChange={lookup(v, "onDocId")} placeholder={lookup(v, "docIdPh")} style={{ "borderColor": lookup(v, "docIdBorder") }} />
                    </label>
                  </div>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {"Comprobante"}
                    </span>
                    <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                      {(lookup(v, "docs") || []).map((d, index2) => (
                        <Fragment key={index2}>
                          <button onClick={lookup(d, "pick")} aria-pressed={lookup(d, "pressed")} style={{ "height": "48px", "padding": "0 26px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(d, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                            {lookup(d, "name")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    {Boolean(lookup(v, "isFactura")) && (
                      <Fragment>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500", "maxWidth": "640px" }}>
                          {"Razón social"}
                          <input className={"ck-field"} type={"text"} autoComplete={"organization"} placeholder={"[RAZÓN SOCIAL S.A.C.]"} />
                        </label>
                        <span style={{ "fontSize": "14px", "color": "#444444" }}>
                          {"La factura llega a tu correo y por WhatsApp. Necesitamos el RUC de 11 dígitos."}
                        </span>
                      </Fragment>
                    )}
                  </div>
                </div>
              </Fragment>
            )}
            {Boolean(lookup(v, "isStep2")) && (
              <Fragment>
                <div style={{ "borderTop": "2px solid #111111", "paddingTop": "24px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                  <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900", "textTransform": "uppercase" }}>
                    {"¿Cómo lo recibes?"}
                  </h2>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    {(lookup(v, "ships") || []).map((o, index3) => (
                      <Fragment key={index3}>
                        <button onClick={lookup(o, "pick")} aria-pressed={lookup(o, "pressed")} style={{ "display": "flex", "alignItems": "center", "gap": "16px", "minHeight": "76px", "padding": "14px 18px", "borderRadius": "16px", "border": lookup(o, "border"), "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "textAlign": "left", "fontFamily": "Roboto, sans-serif" }}>
                          <span style={{ "width": "20px", "height": "20px", "borderRadius": "50%", "border": "2px solid #111111", "boxSizing": "border-box", "background": lookup(o, "dot"), "flex": "none" }}></span>
                          <span style={{ "width": "44px", "height": "44px", "borderRadius": "12px", "background": "#F2F2F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(o, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                            <span style={{ "fontSize": "17px", "fontWeight": "700" }}>
                              {lookup(o, "name")}
                            </span>
                            <span style={{ "fontSize": "14px", "color": "#444444" }}>
                              {lookup(o, "sub")}
                            </span>
                          </span>
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textAlign": "right" }}>
                            {lookup(o, "price")}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {Boolean(lookup(v, "isDelivery")) && (
                    <Fragment>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500", "gridColumn": "span 2" }}>
                          {"Dirección"}
                          <input className={"ck-field"} type={"text"} autoComplete={"street-address"} placeholder={"Calle, número, dpto."} />
                        </label>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                          {"Distrito"}
                          <select className={"ck-field"}>
                            <option>
                              {"Cercado"}
                            </option>
                            <option>
                              {"Cayma"}
                            </option>
                            <option>
                              {"Yanahuara"}
                            </option>
                            <option>
                              {"José Luis Bustamante y Rivero"}
                            </option>
                            <option>
                              {"Cerro Colorado"}
                            </option>
                            <option>
                              {"Paucarpata"}
                            </option>
                            <option>
                              {"Sachaca"}
                            </option>
                            <option>
                              {"Mariano Melgar"}
                            </option>
                            <option>
                              {"Miraflores"}
                            </option>
                          </select>
                        </label>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                          {"Referencia"}
                          <input className={"ck-field"} type={"text"} placeholder={"Frente al parque…"} />
                        </label>
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "isAgency")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                        <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                          {"Agencia"}
                        </span>
                        <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                          {(lookup(v, "agencies") || []).map((a, index4) => (
                            <Fragment key={index4}>
                              <button onClick={lookup(a, "pick")} aria-pressed={lookup(a, "pressed")} style={{ "height": "46px", "padding": "0 22px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(a, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "fontWeight": "700" }}>
                                {lookup(a, "name")}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                          <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                            {"Ciudad de destino"}
                            <input className={"ck-field"} type={"text"} placeholder={"Cusco, Puno, Moquegua…"} />
                          </label>
                          <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                            {"DNI de quien recoge"}
                            <input className={"ck-field"} type={"text"} inputMode={"numeric"} placeholder={"8 dígitos"} />
                          </label>
                        </div>
                        <span style={{ "fontSize": "14px", "color": "#444444" }}>
                          {"El flete se paga en la agencia al recoger: [TARIFA según peso y destino]. Te enviamos la clave de envío por WhatsApp."}
                        </span>
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "isPickup")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "gap": "14px", "alignItems": "center", "padding": "16px 18px", "border": "2px dashed #111111", "borderRadius": "16px", "fontSize": "15px", "lineHeight": "1.5" }}>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                          <path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"}></path>
                          <circle cx={"12"} cy={"10"} r={"2.5"}></circle>
                        </svg>
                        <span>
                          <strong>
                            {"Dean Valdivia 533 - Cercado, Arequipa."}
                          </strong>
                          {" Horario de atención: [HORARIO]. Trae tu número de pedido."}
                        </span>
                      </div>
                    </Fragment>
                  )}
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {lookup(v, "dateLabel")}
                    </span>
                    <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto" }}>
                      {(lookup(v, "dates") || []).map((f, index5) => (
                        <Fragment key={index5}>
                          <button onClick={lookup(f, "pick")} aria-pressed={lookup(f, "pressed")} style={{ "flex": "none", "minWidth": "108px", "padding": "12px 14px", "borderRadius": "16px", "border": "2px solid #111111", "background": lookup(f, "bg"), "color": "#111111", "cursor": "pointer", "display": "flex", "flexDirection": "column", "alignItems": "flex-start", "gap": "2px", "fontFamily": "Roboto, sans-serif" }}>
                            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                              {lookup(f, "day")}
                            </span>
                            <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                              {lookup(f, "date")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#444444" }}>
                              {lookup(f, "slot")}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </Fragment>
            )}
            {Boolean(lookup(v, "isStep3")) && (
              <Fragment>
                <div style={{ "borderTop": "2px solid #111111", "paddingTop": "24px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                  <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900", "textTransform": "uppercase" }}>
                    {"Elige cómo pagar"}
                  </h2>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px" }}>
                    {(lookup(v, "pays") || []).map((p, index6) => (
                      <Fragment key={index6}>
                        <button onClick={lookup(p, "pick")} aria-pressed={lookup(p, "pressed")} aria-disabled={lookup(p, "disabled")} style={{ "display": "flex", "alignItems": "center", "gap": "14px", "minHeight": "72px", "padding": "12px 16px", "borderRadius": "16px", "border": lookup(p, "border"), "background": "#FFFFFF", "color": "#111111", "cursor": lookup(p, "cursor"), "opacity": lookup(p, "o"), "textAlign": "left", "fontFamily": "Roboto, sans-serif" }}>
                          <span style={{ "width": "20px", "height": "20px", "borderRadius": "50%", "border": "2px solid #111111", "boxSizing": "border-box", "background": lookup(p, "dot"), "flex": "none" }}></span>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                            <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                              {lookup(p, "name")}
                            </span>
                            <span style={{ "fontSize": "13px", "color": "#444444" }}>
                              {lookup(p, "sub")}
                            </span>
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {Boolean(lookup(v, "isWallet")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "gap": "24px", "flexWrap": "wrap", "padding": "22px", "border": "2px solid #111111", "borderRadius": "20px" }}>
                        <div style={{ "width": "180px", "height": "180px", "borderRadius": "16px", "border": "2px dashed #111111", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "8px", "textAlign": "center", "flex": "none" }}>
                          <svg width={"40"} height={"40"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.6"} aria-hidden={"true"}>
                            <path d={"M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM18 14h2M14 18v2"}></path>
                          </svg>
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                            {"[QR de "}
                            {lookup(v, "walletName")}
                            {"]"}
                          </span>
                        </div>
                        <div style={{ "flex": "1 1 280px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                          <span style={{ "fontSize": "15px", "lineHeight": "1.5" }}>
                            {"Escanea el QR o paga al número "}
                            <strong style={{ "fontFamily": "'Roboto Mono', monospace" }}>
                              {"+51 954 802 744"}
                            </strong>
                            {" a nombre de "}
                            <strong>
                              {"VIA Provisiones"}
                            </strong>
                            {". Monto exacto: "}
                            <strong style={{ "fontFamily": "'Roboto Mono', monospace" }}>
                              {lookup(v, "total")}
                            </strong>
                          </span>
                          <button onClick={lookup(v, "upload")} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "6px", "minHeight": "104px", "borderRadius": "16px", "border": "2px dashed " + String(lookup(v, "uploadBorder") ?? ""), "background": lookup(v, "uploadBg"), "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "15px" }}>
                            <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(v, "uploadIcon")}></path>
                            </svg>
                            <strong>
                              {lookup(v, "uploadTitle")}
                            </strong>
                            <span style={{ "fontSize": "13px", "color": "#444444" }}>
                              {lookup(v, "uploadSub")}
                            </span>
                          </button>
                        </div>
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "isTransfer")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "padding": "22px", "border": "2px solid #111111", "borderRadius": "20px", "fontSize": "15px" }}>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                          <span>
                            {"Banco"}
                          </span>
                          <strong>
                            {"[BANCO]"}
                          </strong>
                        </div>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                          <span>
                            {"Cuenta corriente"}
                          </span>
                          <strong style={{ "fontFamily": "'Roboto Mono', monospace" }}>
                            {"[N° DE CUENTA]"}
                          </strong>
                        </div>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                          <span>
                            {"CCI"}
                          </span>
                          <strong style={{ "fontFamily": "'Roboto Mono', monospace" }}>
                            {"[CCI]"}
                          </strong>
                        </div>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                          <span>
                            {"Titular"}
                          </span>
                          <strong>
                            {"VIA Provisiones · RUC [RUC]"}
                          </strong>
                        </div>
                        <span style={{ "fontSize": "14px", "color": "#444444", "borderTop": "1px solid #111111", "paddingTop": "10px" }}>
                          {"Envía la constancia por WhatsApp al +51 954 802 744. Separamos tu pedido por 24 horas."}
                        </span>
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "isCash")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "gap": "14px", "alignItems": "center", "padding": "18px 20px", "border": "2px dashed #111111", "borderRadius": "16px", "fontSize": "15px", "lineHeight": "1.5" }}>
                        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                          <path d={"M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"}></path>
                        </svg>
                        <span>
                          {"Pagas en efectivo al recibir o al recoger. Si puedes, ten el monto exacto: "}
                          <strong style={{ "fontFamily": "'Roboto Mono', monospace" }}>
                            {lookup(v, "total")}
                          </strong>
                          {"."}
                        </span>
                      </div>
                    </Fragment>
                  )}
                  <label style={{ "display": "flex", "alignItems": "flex-start", "gap": "10px", "fontSize": "15px", "lineHeight": "1.45" }}>
                    <input type={"checkbox"} defaultChecked style={{ "width": "20px", "height": "20px", "margin": "1px 0 0", "accentColor": "#111111", "flex": "none" }} />
                    {"Acepto los "}
                    <a href={"#terminos"} style={{ "textUnderlineOffset": "3px" }}>
                      {"términos y condiciones"}
                    </a>
                    {" y la "}
                    <a href={"#privacidad"} style={{ "textUnderlineOffset": "3px" }}>
                      {"política de privacidad"}
                    </a>
                    {"."}
                  </label>
                </div>
              </Fragment>
            )}
            {Boolean(lookup(v, "isStep4")) && (
              <Fragment>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "22px", "padding": "32px", "borderRadius": "24px", "background": "#111111", "color": "#FFFFFF" }}>
                  <span style={{ "width": "64px", "height": "64px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    <svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                  </span>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "color": lookup(v, "accent") }}>
                      {"Pedido #1043 recibido"}
                    </span>
                    <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "40px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                      {"¡Gracias por tu compra!"}
                    </h2>
                    <p style={{ "margin": "0", "fontSize": "17px", "lineHeight": "1.55", "color": "#E8E8E8" }}>
                      {"Te escribiremos por WhatsApp para confirmar "}
                      {lookup(v, "confirmWhat")}
                      {". "}
                      {lookup(v, "confirmNext")}
                    </p>
                  </div>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "10px" }}>
                    {(lookup(v, "confirmRows") || []).map((r, index7) => (
                      <Fragment key={index7}>
                        <div style={{ "padding": "16px", "borderRadius": "16px", "background": "#222222", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "color": "#BDBDBD" }}>
                            {lookup(r, "k")}
                          </span>
                          <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                            {lookup(r, "v")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "display": "flex", "gap": "10px", "flexWrap": "wrap" }}>
                    <a href={"/tienda"} style={{ "display": "inline-flex", "alignItems": "center", "height": "54px", "padding": "0 26px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {"Seguir comprando"}
                    </a>
                    <a href={"/seguimiento"} style={{ "display": "inline-flex", "alignItems": "center", "height": "54px", "padding": "0 26px", "borderRadius": "999px", "border": "2px solid #FFFFFF", "boxSizing": "border-box", "color": "#FFFFFF", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {"Ver mi pedido"}
                    </a>
                    <a href={"https://wa.me/51954802744"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "54px", "padding": "0 26px", "borderRadius": "999px", "background": "#FFFFFF", "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                        <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                      </svg>
                      {"Escribir por WhatsApp"}
                    </a>
                  </div>
                </div>
              </Fragment>
            )}
            {Boolean(lookup(v, "showNav")) && (
              <Fragment>
                <div style={{ "display": "flex", "gap": "12px", "alignItems": "center", "flexWrap": "wrap", "borderTop": "1px solid #111111", "paddingTop": "22px" }}>
                  {Boolean(lookup(v, "canBack")) && (
                    <Fragment>
                      <button onClick={lookup(v, "back")} style={{ "height": "56px", "padding": "0 28px", "borderRadius": "999px", "border": "2px solid #111111", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                        {"← Volver"}
                      </button>
                    </Fragment>
                  )}
                  <span style={{ "flex": "1" }}></span>
                  <span style={{ "fontSize": "14px", "color": "#444444" }}>
                    {lookup(v, "stepHint")}
                  </span>
                  <button onClick={lookup(v, "next")} style={{ "height": "58px", "padding": "0 34px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase" }}>
                    {lookup(v, "nextLabel")}
                  </button>
                </div>
              </Fragment>
            )}
          </section>
          <aside aria-label={"Resumen del pedido"} style={{ "flex": "1 1 380px", "maxWidth": "460px", "border": "2px solid #111111", "borderRadius": "20px", "padding": "28px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "20px" }}>
            <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "900", "textTransform": "uppercase" }}>
              {"Tu pedido"}
            </h2>
            {(lookup(v, "lines") || []).map((l, index8) => (
              <Fragment key={index8}>
                <div style={{ "display": "flex", "gap": "14px", "alignItems": "center" }}>
                  <span style={{ "position": "relative", "flex": "none" }}>
                    <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "72px", "height": "72px", "objectFit": "cover", "borderRadius": "12px", "display": "block" }} />
                    <span style={{ "position": "absolute", "top": "-8px", "right": "-8px", "minWidth": "26px", "height": "26px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      {lookup(l, "qty")}
                    </span>
                  </span>
                  <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {lookup(l, "cat")}
                    </span>
                    <span style={{ "fontSize": "15px", "fontWeight": "500", "lineHeight": "1.3" }}>
                      {lookup(l, "name")}
                    </span>
                  </span>
                  <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700" }}>
                    {lookup(l, "total")}
                  </span>
                </div>
              </Fragment>
            ))}
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Cupón de descuento"}
              </span>
              <div style={{ "display": "flex", "gap": "8px" }}>
                <input type={"text"} aria-label={"Código de cupón"} placeholder={"Ej. VIA5"} style={{ "flex": "1", "minWidth": "0", "height": "48px", "border": "1px solid #111111", "borderRadius": "999px", "padding": "0 18px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "textTransform": "uppercase" }} />
                <button onClick={lookup(v, "applyCoupon")} style={{ "height": "48px", "padding": "0 20px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(v, "couponBg"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {lookup(v, "couponBtn")}
                </button>
              </div>
              {Boolean(lookup(v, "coupon")) && (
                <Fragment>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "14px", "color": "#1B5E20", "fontWeight": "500" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                    {"Cupón VIA5 aplicado: 5% de descuento (ejemplo)"}
                  </span>
                </Fragment>
              )}
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
              {Boolean(lookup(v, "coupon")) && (
                <Fragment>
                  <div style={{ "display": "flex", "justifyContent": "space-between" }}>
                    <span>
                      {"Descuento"}
                    </span>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontWeight": "700" }}>
                      {"− "}
                      {lookup(v, "discount")}
                    </span>
                  </div>
                </Fragment>
              )}
              <div style={{ "display": "flex", "justifyContent": "space-between", "gap": "12px" }}>
                <span>
                  {"Envío · "}
                  {lookup(v, "shipName")}
                </span>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontWeight": "700", "textAlign": "right" }}>
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
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "borderTop": "1px solid #111111", "paddingTop": "18px" }}>
              {(lookup(v, "trust") || []).map((t, index9) => (
                <Fragment key={index9}>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "12px", "fontSize": "14px", "lineHeight": "1.35" }}>
                    <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(t, "icon")}></path>
                      </svg>
                    </span>
                    {lookup(t, "text")}
                  </span>
                </Fragment>
              ))}
            </div>
          </aside>
        </div>
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
