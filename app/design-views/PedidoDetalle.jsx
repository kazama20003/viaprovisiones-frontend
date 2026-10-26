"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), step: 1, cancelAsk: false, emitted: false, draft: '', notes: [
      { text: 'El cliente pide que se entregue antes del mediodía; la bodega cierra a la 1.', meta: 'Beltran C. · hoy 10:15' },
      { text: 'Separar los focos del lote L-1008 (son los más antiguos).', meta: '[Almacén] · hoy 10:40' }
    ] };
  }
  renderVals() {
    const st = this.state;
    const money = (n) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const B = 'img/';
    // mismas líneas que el pedido #1041 del tablero de Pedidos
    const L = [
      ['Foco LED 9 W luz cálida', 48, 8.9, '52dc55c2523393f8f60ab89499fa3ec1', 'L-1008'],
      ['Mosquetón llavero de aluminio', 30, 6.9, 'eb0c79147accd306bbd7a39d350a8e88', 'L-0830'],
      ['Ganchos de pared (set de 3)', 12, 9.9, 'b68602a2601d3a2d118c7190d31f96a1', 'L-0907']
    ];
    const sum = L.reduce((a, l) => a + l[1] * l[2], 0);
    const gravada = sum / 1.18;
    const S = [
      ['Por pagar', 'M12 7v5l3 2', 'hoy 09:51'],
      ['Pagado', 'M3 6h18v12H3zM3 10h18', 'hoy 10:12'],
      ['Preparando', 'M3 7l9-4 9 4v10l-9 4-9-4z', ''],
      ['Enviado', 'M3 7h11v9H3zM14 10h4l3 3v3h-7', ''],
      ['Entregado', 'M5 12l5 5 9-10', '']
    ];
    const whenNow = ['hoy 09:51', 'hoy 10:12', 'hoy 11:30', 'hoy 14:05', 'mañana 10:20'];
    const TL = [
      ['Pedido recibido por WhatsApp', 'Beltran C. · hoy 09:51', 'M4 20l1.5-4.5A8 8 0 1 1 9 19z', 0],
      ['Pago confirmado · transferencia', 'Beltran C. · hoy 10:12', 'M5 12l5 5 9-10', 1],
      ['Preparado y empacado por Almacén', '[Almacén] · hoy 11:30', 'M3 7l9-4 9 4v10l-9 4-9-4z', 2],
      ['Salió con el motorizado · ruta 2', '[NOMBRE] · hoy 14:05', 'M3 7h11v9H3zM14 10h4l3 3v3h-7', 3],
      ['Entregado y firmado', 'mañana 10:20', 'M5 12l5 5 9-10', 4]
    ];
    const last = st.step >= 4;
    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      total: money(sum),
      stateName: S[st.step][0],
      advText: last ? 'Pedido entregado' : 'Avanzar a ' + S[st.step + 1][0],
      advBg: last ? '#9A9A9A' : '#E8701F',
      advDisabled: last ? 'true' : 'false',
      advance: () => { if (this.state.step < 4) this.setState({ step: this.state.step + 1, cancelAsk: false }); },
      cancelAsk: st.cancelAsk,
      toggleCancel: () => this.setState({ cancelAsk: !this.state.cancelAsk }),
      steps: S.map((s, i) => ({
        name: s[0], icon: s[1], when: i <= st.step ? whenNow[i] : 'Pendiente',
        bar: i <= st.step ? '#E8701F' : '#ECECE9',
        dotBg: i < st.step ? '#111111' : (i === st.step ? '#E8701F' : '#F4F4F2'),
        dotFg: i <= st.step ? '#FFFFFF' : '#9A9A9A',
        fg: i <= st.step ? '#111111' : '#9A9A9A'
      })),
      units: String(L.reduce((a, l) => a + l[1], 0)),
      lines: L.map((l) => ({ name: l[0], qty: String(l[1]), price: 'S/ ' + money(l[2]), sub: 'S/ ' + money(l[1] * l[2]), img: B + l[3], lot: l[4] })),
      summary: [['Subtotal (precio Minorista)', 'S/ ' + money(sum)], ['Descuento', 'S/ 0.00'], ['Envío', 'Gratis'], ['Op. gravada', 'S/ ' + money(gravada)], ['IGV 18 % (incluido)', 'S/ ' + money(sum - gravada)]].map((r) => ({ k: r[0], v: r[1] })),
      timeline: TL.map((t) => ({ title: t[0], meta: t[3] <= st.step ? t[1] : 'Pendiente', icon: t[2], bg: t[3] <= st.step ? '#111111' : '#F4F4F2', fg: t[3] <= st.step ? '#FFFFFF' : '#9A9A9A' })),
      emitted: st.emitted,
      notEmitted: !st.emitted,
      emit: () => this.setState({ emitted: true }),
      notes: st.notes,
      draft: st.draft,
      onDraft: (e) => this.setState({ draft: (e && e.target && e.target.value) || '' }),
      addNote: () => { const t = this.state.draft.trim(); if (!t) return; this.setState({ notes: this.state.notes.concat([{ text: t, meta: 'Beltran C. · ahora' }]), draft: '' }); }
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function PedidoDetalle(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Pedidos"} onPin={lookup(v, "togglePin")} />
              </div>
            </Fragment>
          )}
          <div>
            <div style={{ "padding": "28px 32px 30px", "display": "flex", "flexDirection": "column", "gap": "26px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "flexWrap": "wrap" }}>
                <button onClick={lookup(v, "menuBtn")} aria-label={lookup(v, "menuBtnLabel")} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M4 8h16M4 16h10"}></path>
                  </svg>
                </button>
                <a href={"/dashboard"} aria-label={"Ir al panel"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-pdet"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-pdet)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </a>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    <a href={"/pedidos"} style={{ "color": "#111111", "textDecoration": "none" }}>
                      {"Pedidos"}
                    </a>
                    <span style={{ "color": "#BDBDBD" }}>
                      {"›"}
                    </span>
                    {" #1041"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Detalle del pedido"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "toggleCancel")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "52px", "padding": "0 20px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "background": "transparent", "color": "#111111", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                  {"Cancelar pedido"}
                </button>
                <button onClick={lookup(v, "advance")} aria-disabled={lookup(v, "advDisabled")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": lookup(v, "advBg"), "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                  {lookup(v, "advText")}
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                  </svg>
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Pedido #1041 · Bodega San Martín"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {"S/ "}
                    {lookup(v, "total")}
                    {" · "}
                    {lookup(v, "stateName")}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "40px", "padding": "0 16px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "13px", "fontWeight": "700" }}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M4 20l1.5-4.5A8 8 0 1 1 9 19z"}></path>
                  </svg>
                  {"Canal WhatsApp"}
                </span>
                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "40px", "padding": "0 16px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "13px", "fontWeight": "700" }}>
                  {"Minorista · lista de precios Minorista"}
                </span>
                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "40px", "padding": "0 16px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "13px", "fontWeight": "700" }}>
                  {"Recibido hoy 09:51"}
                </span>
              </div>
              {Boolean(lookup(v, "cancelAsk")) && (
                <Fragment>
                  <div role={"alert"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "flexWrap": "wrap", "padding": "16px 18px", "borderRadius": "22px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "14px", "fontWeight": "600" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                    </svg>
                    <span style={{ "flex": "1", "minWidth": "240px" }}>
                      {"¿Cancelar el pedido #1041? Las 90 unidades vuelven a sus lotes y se avisa al cliente por WhatsApp. Si ya pagó, registra la devolución del dinero."}
                    </span>
                    <button onClick={lookup(v, "toggleCancel")} style={{ "height": "40px", "padding": "0 16px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                      {"No, mantener"}
                    </button>
                    <a href={"/devoluciones"} style={{ "height": "40px", "padding": "0 16px", "borderRadius": "999px", "background": "#8E1C14", "color": "#FFFFFF", "textDecoration": "none", "display": "inline-flex", "alignItems": "center", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Sí, cancelar y devolver"}
                    </a>
                  </div>
                </Fragment>
              )}
              <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px 24px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "8px" }}>
                  {(lookup(v, "steps") || []).map((s, index1) => (
                    <Fragment key={index1}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                        <span style={{ "height": "8px", "borderRadius": "999px", "background": lookup(s, "bar") }}></span>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(s, "dotBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "dotFg")} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(s, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700", "color": lookup(s, "fg") }}>
                              {lookup(s, "name")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                              {lookup(s, "when")}
                            </span>
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 640px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Productos · "}
                      {lookup(v, "units")}
                      {" unidades"}
                    </span>
                    <a href={"/inventario"} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "background": "#F4F4F2", "display": "inline-flex", "alignItems": "center", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                      {"Ver lotes en inventario"}
                    </a>
                  </div>
                  {(lookup(v, "lines") || []).map((l, index2) => (
                    <Fragment key={index2}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "16px", "padding": "12px", "borderRadius": "24px", "background": "#F4F4F2", "flexWrap": "wrap" }}>
                        <img src={assetSrc(lookup(l, "img"))} alt={lookup(l, "name")} style={{ "width": "72px", "height": "72px", "borderRadius": "18px", "objectFit": "cover", "flex": "none" }} />
                        <span style={{ "flex": "1 1 220px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                          <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                            {lookup(l, "name")}
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "alignSelf": "flex-start", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "12px", "fontWeight": "700" }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4"}></path>
                            </svg>
                            {"Sale del lote "}
                            {lookup(l, "lot")}
                            {" · PEPS"}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "lineHeight": "1.3", "minWidth": "90px" }}>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {"Cantidad"}
                          </span>
                          <span style={{ "fontSize": "16px", "fontWeight": "800" }}>
                            {lookup(l, "qty")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "lineHeight": "1.3", "minWidth": "110px" }}>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {"Precio Minorista"}
                          </span>
                          <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                            {lookup(l, "price")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "lineHeight": "1.3", "minWidth": "110px" }}>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {"Subtotal"}
                          </span>
                          <span style={{ "fontSize": "16px", "fontWeight": "800" }}>
                            {lookup(l, "sub")}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "display": "flex", "gap": "16px", "flexWrap": "wrap" }}>
                  <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                        {"Pago"}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "28px", "padding": "0 12px", "borderRadius": "999px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "12px", "fontWeight": "700" }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                        {"Verificado"}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "gap": "14px", "alignItems": "center" }}>
                      <span style={{ "width": "84px", "height": "108px", "borderRadius": "16px", "border": "1px dashed #BDBDBD", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "6px", "fontSize": "11px", "color": "#6B6B6B", "textAlign": "center", "flex": "none" }}>
                        <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#6B6B6B"} strokeWidth={"1.8"} aria-hidden={"true"}>
                          <path d={"M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6"}></path>
                        </svg>
                        {"Constancia"}
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "fontSize": "13px", "flex": "1" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                          <span style={{ "color": "#8C8C8C" }}>
                            {"Método"}
                          </span>
                          <span style={{ "fontWeight": "700" }}>
                            {"Transferencia · [BANCO]"}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                          <span style={{ "color": "#8C8C8C" }}>
                            {"Monto"}
                          </span>
                          <span style={{ "fontWeight": "700" }}>
                            {"S/ "}
                            {lookup(v, "total")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                          <span style={{ "color": "#8C8C8C" }}>
                            {"Fecha"}
                          </span>
                          <span style={{ "fontWeight": "700" }}>
                            {"26 oct · 10:12"}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                          <span style={{ "color": "#8C8C8C" }}>
                            {"Verificó"}
                          </span>
                          <span style={{ "fontWeight": "700" }}>
                            {"Beltran C."}
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                  <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                        {"Entrega"}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "height": "28px", "padding": "0 12px", "borderRadius": "999px", "background": "#E3F1FF", "color": "#0B4A8A", "fontSize": "12px", "fontWeight": "700" }}>
                        {"Delivery Arequipa"}
                      </span>
                    </div>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "fontSize": "13px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                        <span style={{ "color": "#8C8C8C" }}>
                          {"Dirección"}
                        </span>
                        <span style={{ "fontWeight": "700", "textAlign": "right" }}>
                          {"[DIRECCIÓN], Cayma"}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                        <span style={{ "color": "#8C8C8C" }}>
                          {"Fecha programada"}
                        </span>
                        <span style={{ "fontWeight": "700" }}>
                          {"Mañana, 27 oct · 9–13 h"}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                        <span style={{ "color": "#8C8C8C" }}>
                          {"Motorizado"}
                        </span>
                        <span style={{ "fontWeight": "700" }}>
                          {"[NOMBRE] · ruta 2"}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                        <span style={{ "color": "#8C8C8C" }}>
                          {"Guía"}
                        </span>
                        <span style={{ "fontWeight": "700" }}>
                          {"GR-0412 (por generar)"}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px" }}>
                        <span style={{ "color": "#8C8C8C" }}>
                          {"Costo de envío"}
                        </span>
                        <span style={{ "fontWeight": "700" }}>
                          {"Gratis (compra mayor a S/ 500)"}
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700", "paddingBottom": "10px" }}>
                    {"Línea de tiempo"}
                  </span>
                  {(lookup(v, "timeline") || []).map((t, index3) => (
                    <Fragment key={index3}>
                      <div style={{ "display": "flex", "gap": "14px" }}>
                        <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "flex": "none" }}>
                          <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(t, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(t, "fg")} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(t, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "width": "2px", "flex": "1", "minHeight": "14px", "background": "#ECECE9" }}></span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "paddingBottom": "14px" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                            {lookup(t, "title")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {lookup(t, "meta")}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "flex": "1 1 340px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Resumen"}
                  </span>
                  {(lookup(v, "summary") || []).map((r, index4) => (
                    <Fragment key={index4}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "14px" }}>
                        <span style={{ "color": "#CFCFCF" }}>
                          {lookup(r, "k")}
                        </span>
                        <span style={{ "fontWeight": "700" }}>
                          {lookup(r, "v")}
                        </span>
                      </span>
                    </Fragment>
                  ))}
                  <span style={{ "height": "1px", "background": "#2A2A2A" }}></span>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                    <span style={{ "fontSize": "14px", "color": "#CFCFCF" }}>
                      {"Total"}
                    </span>
                    <span style={{ "fontSize": "32px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                      <span style={{ "color": "#FF914C" }}>
                        {"S/"}
                      </span>
                      {" "}
                      {lookup(v, "total")}
                    </span>
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                    {"Precios con IGV incluido. Ejemplo."}
                  </span>
                </div>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                    <span style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                      {"BS"}
                    </span>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                      <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                        {"Bodega San Martín"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                        {"Minorista · Arequipa"}
                      </span>
                    </span>
                    <a href={"/clientes"} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "background": "#F4F4F2", "display": "inline-flex", "alignItems": "center", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                      {"Ver ficha"}
                    </a>
                  </div>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "fontSize": "13px" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                      <span style={{ "color": "#8C8C8C" }}>
                        {"WhatsApp"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"[CELULAR]"}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                      <span style={{ "color": "#8C8C8C" }}>
                        {"RUC"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"[RUC]"}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                      <span style={{ "color": "#8C8C8C" }}>
                        {"Historial"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"12 pedidos · S/ 8,940"}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                      <span style={{ "color": "#8C8C8C" }}>
                        {"Condición"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"Contado"}
                      </span>
                    </span>
                  </span>
                </div>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Comprobante"}
                  </span>
                  {Boolean(lookup(v, "emitted")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "20px", "background": "#F4F4F2" }}>
                        <span style={{ "width": "40px", "height": "40px", "borderRadius": "12px", "background": "#E4F4E7", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1B5E20"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M7 3h7l5 5v13H7zM10 14l2 2 4-4"}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                            {"Factura F001-00088"}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#1B5E20" }}>
                            {"Aceptada por SUNAT · ejemplo"}
                          </span>
                        </span>
                        <a href={"/comprobantes"} style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C" }}>
                          {"Ver"}
                        </a>
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "notEmitted")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "20px", "background": "#FFF4D6", "color": "#7A4A00" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M12 7v6M12 17h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z"}></path>
                        </svg>
                        <span style={{ "flex": "1", "fontSize": "13px", "fontWeight": "600" }}>
                          {"Falta emitir la factura (cliente con RUC)."}
                        </span>
                        <button onClick={lookup(v, "emit")} style={{ "height": "38px", "padding": "0 16px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                          {"Emitir"}
                        </button>
                      </div>
                    </Fragment>
                  )}
                </div>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Notas internas"}
                  </span>
                  {(lookup(v, "notes") || []).map((n, index5) => (
                    <Fragment key={index5}>
                      <div style={{ "padding": "12px 14px", "borderRadius": "18px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                        <span style={{ "fontSize": "13px", "lineHeight": "1.45" }}>
                          {lookup(n, "text")}
                        </span>
                        <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                          {lookup(n, "meta")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                      {"Nueva nota"}
                    </span>
                    <textarea value={(lookup(v, "draft") ?? "")} onChange={lookup(v, "onDraft")} rows={"2"} placeholder={"Escribe una nota para el equipo…"} style={{ "border": "1px solid #DCDCD8", "borderRadius": "16px", "padding": "10px 12px", "fontFamily": "inherit", "fontSize": "13px", "resize": "none" }}></textarea>
                  </label>
                  <button onClick={lookup(v, "addNote")} style={{ "alignSelf": "flex-end", "height": "38px", "padding": "0 16px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                    {"Agregar nota"}
                  </button>
                </div>
                <div style={{ "borderRadius": "30px", "background": "#F4F4F2", "border": "1px solid #E4E4E0", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                  <button style={{ "height": "46px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px" }}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M6 9V3h12v6M6 18H4v-7h16v7h-2M6 14h12v7H6z"}></path>
                    </svg>
                    {"Imprimir guía"}
                  </button>
                  <a href={"https://wa.me/51954802744"} style={{ "height": "46px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px" }}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M4 20l1.5-4.5A8 8 0 1 1 9 19z"}></path>
                    </svg>
                    {"Enviar resumen por WhatsApp"}
                  </a>
                  <a href={"/devoluciones"} style={{ "height": "46px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px" }}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M4 9h11a5 5 0 0 1 0 10H9M4 9l4-4M4 9l4 4"}></path>
                    </svg>
                    {"Registrar devolución"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Pedidos"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
