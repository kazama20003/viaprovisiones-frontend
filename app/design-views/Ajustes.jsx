"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = {
      menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), sec: 'Negocio', saved: false, method: 'PEPS',
      on: { yape: true, plin: true, transf: true, efectivo: true, tarjeta: false, recojo: true, delivery: true, agencia: true, nPedido: true, nStock: true, nGarantia: true, nCotiz: true, nResumen: false, wStock: true, wMayor: true, wPausa: false, wWhats: true },
      perm: { 'Pedidos-1': true, 'Cotizaciones-1': true, 'Inventario y lotes-2': true, 'Compras a proveedores-2': true }
    };
  }
  renderVals() {
    const st = this.state;
    const on = st.on || {};
    const T = (key, name, sub, extra) => {
      const v = !!on[key];
      return Object.assign({ name, sub, on: v, ariaOn: v ? 'true' : 'false', track: v ? '#E8701F' : '#D6D6D2', ml: v ? '22px' : '2px', state: v ? 'Activo' : 'Apagado',
        toggle: () => this.setState({ on: Object.assign({}, this.state.on, { [key]: !v }), saved: false }) }, extra || {});
    };
    const SECS = [
      ['Negocio', 'M3 21h18M5 21V8l7-5 7 5v13M9 21v-6h6v6', 'Datos'],
      ['Usuarios y roles', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21a7 7 0 0 1 14 0M17 11a3 3 0 1 0 0-6M22 21a6 6 0 0 0-4-5.6', '3'],
      ['Pagos', 'M3 6h18v12H3zM3 10h18M7 15h3', '5'],
      ['Envíos', 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1', '3'],
      ['Precios y listas', 'M20 12l-8 8-9-9V3h8zM7.5 7.5h.01', '4'],
      ['Notificaciones', 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4', ''],
      ['Tienda web', 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3c3 3 3 15 0 18', '']
    ];
    const SUB = { 'Negocio': 'Datos del negocio', 'Usuarios y roles': 'Usuarios y permisos', 'Pagos': 'Métodos de pago', 'Envíos': 'Envíos y entregas', 'Precios y listas': 'Precios, listas y lotes', 'Notificaciones': 'Avisos del panel', 'Tienda web': 'Lo que ve el cliente' };
    const pays = [
      T('yape', 'Yape', '[NÚMERO YAPE] · confirmación con captura', { short: 'Y', iconBg: '#EDE7FF', iconFg: '#4A2E9A' }),
      T('plin', 'Plin', '[NÚMERO PLIN]', { short: 'P', iconBg: '#E3F1FF', iconFg: '#0B4A8A' }),
      T('transf', 'Transferencia bancaria', '[BANCO] · [CCI] · para empresas y mayoristas', { short: 'TB', iconBg: '#F4F4F2', iconFg: '#111111' }),
      T('efectivo', 'Efectivo contra entrega', 'Solo recojo en tienda y delivery en Arequipa', { short: 'S/', iconBg: '#E4F4E7', iconFg: '#1B5E20' }),
      T('tarjeta', 'Tarjeta de crédito o débito', 'Requiere pasarela de pago [POR DEFINIR]', { short: 'TC', iconBg: '#FFF1E6', iconFg: '#8A3B0A' })
    ];
    const ships = [
      T('recojo', 'Recojo en tienda', 'Dean Valdivia 533 - Cercado, Arequipa', { fee: 'Gratis', time: 'Mismo día', icon: 'M3 9l1-5h16l1 5M4 9v11h16V9M3 9h18' }),
      T('delivery', 'Delivery Arequipa', 'Motorizado propio por zonas', { fee: '[TARIFA]', time: '[24 h]', icon: 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5' }),
      T('agencia', 'Agencia a provincias', 'Cusco, Puno, Moquegua, Tacna, Lima', { fee: '[SEGÚN AGENCIA]', time: '[2–4 días]', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7' })
    ];
    const notifs = [
      T('nPedido', 'Nuevo pedido por WhatsApp', 'Mensaje al instante con cliente, total y forma de pago', { icon: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0' }),
      T('nStock', 'Stock bajo', 'Cuando un producto baja de su mínimo', { icon: 'M12 7v6M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z' }),
      T('nGarantia', 'Lote con garantía por vencer', 'Lotes con menos de 60 días de garantía', { icon: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10' }),
      T('nCotiz', 'Cotización por vencer', 'Dos días antes de la fecha de validez', { icon: 'M7 3h8l4 4v14H7zM15 3v4h4M10 13h6M10 17h4' }),
      T('nResumen', 'Resumen diario por correo', 'Ventas, pedidos y caja del día a las 20:00', { icon: 'M4 6h16v12H4zM4 7l8 6 8-6' })
    ];
    const webs = [
      T('wStock', 'Mostrar stock disponible', 'El cliente ve “Quedan 8” cuando hay pocas unidades'),
      T('wMayor', 'Precios mayoristas solo con sesión', 'Minoristas, mayoristas y empresas ven su lista al ingresar'),
      T('wWhats', 'Botón de WhatsApp flotante', 'Abre chat con +51 954 802 744'),
      T('wPausa', 'Pausar la tienda', 'Muestra un aviso y no recibe pedidos nuevos')
    ];
    const ROLES = ['Administrador', 'Vendedor', 'Almacén'];
    const PERMS = [['Pedidos', [1, 1, 0]], ['Cotizaciones', [1, 1, 0]], ['Inventario y lotes', [1, 0, 1]], ['Compras a proveedores', [1, 0, 1]], ['Reportes', [1, 0, 0]], ['Ajustes', [1, 0, 0]]];
    const pm = st.perm || {};
    const countOn = (xs) => xs.filter((x) => x.on).length;
    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      saved: st.saved,
      save: () => this.setState({ saved: !this.state.saved }),
      secTitle: SUB[st.sec],
      secNegocio: st.sec === 'Negocio',
      secUsuarios: st.sec === 'Usuarios y roles',
      secPagos: st.sec === 'Pagos',
      secEnvios: st.sec === 'Envíos',
      secPrecios: st.sec === 'Precios y listas',
      secNotif: st.sec === 'Notificaciones',
      secWeb: st.sec === 'Tienda web',
      secs: SECS.map((s) => {
        const a = st.sec === s[0];
        return { label: s[0], icon: s[1], hint: s[2], current: a ? 'page' : 'false', bg: a ? '#111111' : 'transparent', fg: a ? '#FFFFFF' : '#111111', iconBg: a ? '#E8701F' : '#F4F4F2', iconFg: a ? '#FFFFFF' : '#111111', subFg: a ? '#BDBDBD' : '#8C8C8C', pick: () => this.setState({ sec: s[0], saved: false }) };
      }),
      headStats: [
        { v: '3', k1: 'Usuarios', k2: 'con acceso', bg: '#FFFFFF', fg: '#111111' },
        { v: String(countOn(pays)), k1: 'Métodos', k2: 'de pago activos', bg: '#FFFFFF', fg: '#111111' },
        { v: String(countOn(ships)), k1: 'Formas', k2: 'de entrega', bg: '#FFFFFF', fg: '#111111' },
        { v: '4', k1: 'Datos', k2: 'por completar', bg: '#E8701F', fg: '#FFFFFF' }
      ],
      users: [
        { ini: 'BC', name: 'Beltran Carlos Ccapa', job: 'Gerente Comercial', role: 'Administrador', last: 'Activo ahora', bg: '#FF914C', fg: '#111111' },
        { ini: 'VE', name: '[Vendedor]', job: 'Ventas y WhatsApp · ejemplo', role: 'Vendedor', last: 'Hace 2 h', bg: '#111111', fg: '#FFFFFF' },
        { ini: 'AL', name: '[Almacén]', job: 'Recepción de lotes · ejemplo', role: 'Almacén', last: 'Ayer', bg: '#E4E4E0', fg: '#111111' }
      ],
      perms: PERMS.map((p) => ({
        name: p[0],
        cells: ROLES.map((r, ri) => {
          const key = p[0] + '-' + ri;
          const ok = ri === 0 ? true : (key in pm ? !!pm[key] : !!p[1][ri]);
          return {
            pressed: ok ? 'true' : 'false', aria: r + ': ' + p[0] + (ok ? ' permitido' : ' sin acceso'),
            bg: ok ? (ri === 0 ? '#111111' : '#E8701F') : '#F4F4F2', fg: ok ? '#FFFFFF' : '#BDBDBD',
            icon: ok ? 'M5 12l5 5 9-10' : 'M7 12h10',
            toggle: () => { if (ri === 0) return; this.setState({ perm: Object.assign({}, this.state.perm, { [key]: !ok }), saved: false }); }
          };
        })
      })),
      pays, ships, notifs, webs,
      tiers: [
        ['Público', 'Consumidores en la tienda web', '—', 'Sin mínimo', '#BDBDBD'],
        ['Minorista', 'Bodegas, ferreterías y tiendas', '8%', 'S/ 300 o 12 unidades', '#F5C3A0'],
        ['Mayorista', 'Distribuidores con RUC', '15%', 'S/ 1,500 o 1 caja', '#E8701F'],
        ['Empresa', 'Minería, construcción e instituciones', 'Por cotización', 'Según contrato', '#111111']
      ].map((t) => ({ name: t[0], who: t[1], off: t[2], min: t[3], dot: t[4] })),
      methods: [
        ['PEPS', 'Primero en entrar, primero en salir', 'Sale primero el lote más antiguo. Recomendado.'],
        ['GAR', 'Por vencimiento de garantía', 'Sale primero el lote con garantía más próxima a vencer.'],
        ['MAN', 'Manual', 'El vendedor elige el lote en cada pedido.']
      ].map((m) => {
        const a = st.method === m[0];
        return { name: m[1], sub: m[2], checked: a ? 'true' : 'false', border: a ? '#E8701F' : '#E4E4E0', dot: a ? '#E8701F' : 'transparent', pick: () => this.setState({ method: m[0], saved: false }) };
      })
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Ajustes(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.fld{height:48px;border:1px solid #E4E4E0;border-radius:14px;padding:0 14px;font-family:inherit;font-size:14px;color:#111111;background:#FFFFFF;box-sizing:border-box;width:100%}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "max(100vh, 1340px)", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Ajustes"} onPin={lookup(v, "togglePin")} />
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
                    <clipPath id={"via-clip-aj"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-aj)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Ajustes"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Configuración de la tienda"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "save")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 12l5 5 9-10"}></path>
                  </svg>
                  {"Guardar cambios"}
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Ajustes"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "secTitle")}
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
              {Boolean(lookup(v, "saved")) && (
                <Fragment>
                  <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 18px", "borderRadius": "20px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "14px", "fontWeight": "600" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                    <span style={{ "flex": "1" }}>
                      {"Cambios guardados. La tienda y el panel ya usan esta configuración."}
                    </span>
                    <button onClick={lookup(v, "save")} aria-label={"Cerrar aviso"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "transparent", "cursor": "pointer", "color": "inherit", "fontSize": "18px" }}>
                      {"×"}
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "1 1 280px", "maxWidth": "320px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <nav aria-label={"Secciones de ajustes"} style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                  {(lookup(v, "secs") || []).map((s, index2) => (
                    <Fragment key={index2}>
                      <button onClick={lookup(s, "pick")} aria-current={lookup(s, "current")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "padding": "0 8px", "borderRadius": "999px", "border": "none", "background": lookup(s, "bg"), "color": lookup(s, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "600", "textAlign": "left" }}>
                        <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(s, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1" }}>
                          {lookup(s, "label")}
                        </span>
                        <span style={{ "fontSize": "12px", "fontWeight": "500", "color": lookup(s, "subFg") }}>
                          {lookup(s, "hint")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </nav>
                <div style={{ "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Datos por completar"}
                  </span>
                  <span style={{ "fontSize": "13px", "lineHeight": "1.5", "color": "#CFCFCF" }}>
                    {"Los campos entre corchetes todavía no tienen el dato real."}
                  </span>
                  <span style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}>
                    <span style={{ "padding": "6px 12px", "borderRadius": "999px", "background": "#2A2A2A", "fontSize": "12px", "fontWeight": "600" }}>
                      {"RUC"}
                    </span>
                    <span style={{ "padding": "6px 12px", "borderRadius": "999px", "background": "#2A2A2A", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Horario"}
                    </span>
                    <span style={{ "padding": "6px 12px", "borderRadius": "999px", "background": "#2A2A2A", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Banco y CCI"}
                    </span>
                    <span style={{ "padding": "6px 12px", "borderRadius": "999px", "background": "#2A2A2A", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Tarifas de envío"}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "10px", "marginTop": "4px" }}>
                    <span style={{ "flex": "1", "height": "6px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                      <span style={{ "display": "block", "width": "72%", "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                    </span>
                    <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                      {"72%"}
                    </span>
                  </span>
                </div>
              </div>
              <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "28px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "22px" }}>
                {Boolean(lookup(v, "secNegocio")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                        {"Datos del negocio"}
                      </span>
                      <span style={{ "fontSize": "14px", "color": "#6B6B6B" }}>
                        {"Aparecen en la tienda, en las cotizaciones y en los comprobantes."}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "gap": "20px", "flexWrap": "wrap", "alignItems": "center", "padding": "18px", "borderRadius": "24px", "background": "#F4F4F2" }}>
                      <span style={{ "width": "220px", "height": "92px", "borderRadius": "20px", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"180"} height={"60"} viewBox={"134 205 278 92"} role={"img"} aria-label={"Logo VIA Provisiones"}>
                          <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={lookup(v, "accent")} strokeWidth={"3"}></circle>
                          <clipPath id={"via-clip-aj-logo"}>
                            <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                          </clipPath>
                          <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={lookup(v, "accent")}></polygon>
                          <path clipPath={"url(#via-clip-aj-logo)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
                          <g fill={"none"} stroke={"#FFFFFF"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                            <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
                            <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
                            <path d={"M295.8 229 V248.25"}></path>
                          </g>
                          <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={lookup(v, "accent")}>
                            {"PROVISIONES"}
                          </text>
                        </svg>
                      </span>
                      <span style={{ "flex": "1", "minWidth": "200px", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                        <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                          {"Logo de la tienda"}
                        </span>
                        <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                          {"Naranja #FF914C sobre negro. SVG o PNG de al menos 512 px."}
                        </span>
                      </span>
                      <button style={{ "height": "44px", "padding": "0 18px", "borderRadius": "999px", "border": "1px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                        {"Cambiar logo"}
                      </button>
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Nombre comercial"}
                        <input className={"fld"} defaultValue={"VIA Provisiones"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"RUC"}
                        <input className={"fld"} defaultValue={"[RUC]"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Lema"}
                        <input className={"fld"} defaultValue={"Iluminación · Seguridad · Accesorios"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Dirección"}
                        <input className={"fld"} defaultValue={"Dean Valdivia 533 - Cercado, Arequipa"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"WhatsApp y teléfono"}
                        <input className={"fld"} defaultValue={"+51 954 802 744"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Correo"}
                        <input className={"fld"} type={"email"} defaultValue={"viaprovisionesperu@gmail.com"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Sitio web"}
                        <input className={"fld"} defaultValue={"www.viaprovisiones.com"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Horario de atención"}
                        <input className={"fld"} defaultValue={"[HORARIO]"} />
                      </label>
                    </div>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "16px 18px", "borderRadius": "20px", "border": "1px dashed #DCDCD8" }}>
                      <span style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": "#FFF1E6", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#8A3B0A"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"}></path>
                        </svg>
                      </span>
                      <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {"Responsable comercial"}
                        </span>
                        <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                          {"Beltran Carlos Ccapa · Gerente Comercial"}
                        </span>
                      </span>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "secUsuarios")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "gap": "16px", "flexWrap": "wrap" }}>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                        <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                          {"Usuarios y roles"}
                        </span>
                        <span style={{ "fontSize": "14px", "color": "#6B6B6B" }}>
                          {"Quién entra al panel y qué puede hacer cada rol."}
                        </span>
                      </span>
                      <button style={{ "height": "44px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                        {"Invitar usuario"}
                      </button>
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "12px" }}>
                      {(lookup(v, "users") || []).map((u, index3) => (
                        <Fragment key={index3}>
                          <div style={{ "padding": "18px", "borderRadius": "24px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                              <span style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": lookup(u, "bg"), "color": lookup(u, "fg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800", "flex": "none" }}>
                                {lookup(u, "ini")}
                              </span>
                              <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                  {lookup(u, "name")}
                                </span>
                                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                  {lookup(u, "job")}
                                </span>
                              </span>
                            </span>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                              <span style={{ "padding": "6px 12px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "12px", "fontWeight": "700" }}>
                                {lookup(u, "role")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(u, "last")}
                              </span>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "borderRadius": "24px", "border": "1px solid #E4E4E0", "overflowX": "auto" }} className={"noscroll"}>
                      <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "520px" }}>
                        <thead>
                          <tr style={{ "background": "#F4F4F2" }}>
                            <th scope={"col"} style={{ "textAlign": "left", "padding": "14px 18px", "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                              {"Permiso"}
                            </th>
                            <th scope={"col"} style={{ "padding": "14px", "fontSize": "12px", "fontWeight": "700" }}>
                              {"Administrador"}
                            </th>
                            <th scope={"col"} style={{ "padding": "14px", "fontSize": "12px", "fontWeight": "700" }}>
                              {"Vendedor"}
                            </th>
                            <th scope={"col"} style={{ "padding": "14px", "fontSize": "12px", "fontWeight": "700" }}>
                              {"Almacén"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(lookup(v, "perms") || []).map((p, index4) => (
                            <Fragment key={index4}>
                              <tr style={{ "borderTop": "1px solid #EFEFEC" }}>
                                <th scope={"row"} style={{ "textAlign": "left", "padding": "12px 18px", "fontWeight": "600" }}>
                                  {lookup(p, "name")}
                                </th>
                                {(lookup(p, "cells") || []).map((c, index5) => (
                                  <Fragment key={index5}>
                                    <td style={{ "padding": "8px", "textAlign": "center" }}>
                                      <button onClick={lookup(c, "toggle")} aria-pressed={lookup(c, "pressed")} aria-label={lookup(c, "aria")} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": lookup(c, "bg"), "cursor": "pointer", "display": "inline-flex", "alignItems": "center", "justifyContent": "center" }}>
                                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(c, "fg")} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                          <path d={lookup(c, "icon")}></path>
                                        </svg>
                                      </button>
                                    </td>
                                  </Fragment>
                                ))}
                              </tr>
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {"Toca un círculo para dar o quitar el permiso. [Vendedor] y [Almacén] son usuarios de ejemplo."}
                    </span>
                  </Fragment>
                )}
                {Boolean(lookup(v, "secPagos")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                        {"Métodos de pago"}
                      </span>
                      <span style={{ "fontSize": "14px", "color": "#6B6B6B" }}>
                        {"Los activos se muestran en el carrito y en los pedidos por WhatsApp."}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                      {(lookup(v, "pays") || []).map((t, index6) => (
                        <Fragment key={index6}>
                          <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "16px 18px", "borderRadius": "22px", "background": "#F4F4F2" }}>
                            <span style={{ "width": "44px", "height": "44px", "borderRadius": "14px", "background": lookup(t, "iconBg"), "color": lookup(t, "iconFg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "13px", "fontWeight": "800", "flex": "none" }}>
                              {lookup(t, "short")}
                            </span>
                            <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                {lookup(t, "name")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(t, "sub")}
                              </span>
                            </span>
                            <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                              {lookup(t, "state")}
                            </span>
                            <button role={"switch"} aria-checked={lookup(t, "ariaOn")} aria-label={lookup(t, "name")} onClick={lookup(t, "toggle")} style={{ "width": "48px", "height": "28px", "borderRadius": "999px", "border": "none", "background": lookup(t, "track"), "cursor": "pointer", "padding": "0", "flex": "none", "display": "flex", "alignItems": "center" }}>
                              <span style={{ "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF", "marginLeft": lookup(t, "ml") }}></span>
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Banco"}
                        <input className={"fld"} defaultValue={"[BANCO]"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Cuenta y CCI"}
                        <input className={"fld"} defaultValue={"[N° CUENTA / CCI]"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Número de Yape y Plin"}
                        <input className={"fld"} defaultValue={"[NÚMERO YAPE / PLIN]"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Titular"}
                        <input className={"fld"} defaultValue={"[TITULAR DE LA CUENTA]"} />
                      </label>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "secEnvios")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                        {"Envíos y entregas"}
                      </span>
                      <span style={{ "fontSize": "14px", "color": "#6B6B6B" }}>
                        {"Opciones que el cliente elige al pagar."}
                      </span>
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "12px" }}>
                      {(lookup(v, "ships") || []).map((t, index7) => (
                        <Fragment key={index7}>
                          <div style={{ "padding": "20px", "borderRadius": "24px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                              <span style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(t, "icon")}></path>
                                </svg>
                              </span>
                              <button role={"switch"} aria-checked={lookup(t, "ariaOn")} aria-label={lookup(t, "name")} onClick={lookup(t, "toggle")} style={{ "width": "48px", "height": "28px", "borderRadius": "999px", "border": "none", "background": lookup(t, "track"), "cursor": "pointer", "padding": "0", "flex": "none", "display": "flex", "alignItems": "center" }}>
                                <span style={{ "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF", "marginLeft": lookup(t, "ml") }}></span>
                              </button>
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                              <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                                {lookup(t, "name")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(t, "sub")}
                              </span>
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "paddingTop": "12px", "borderTop": "1px solid #E4E4E0" }}>
                              <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                                <span style={{ "color": "#6B6B6B" }}>
                                  {"Costo"}
                                </span>
                                <span style={{ "fontWeight": "700" }}>
                                  {lookup(t, "fee")}
                                </span>
                              </span>
                              <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                                <span style={{ "color": "#6B6B6B" }}>
                                  {"Tiempo"}
                                </span>
                                <span style={{ "fontWeight": "700" }}>
                                  {lookup(t, "time")}
                                </span>
                              </span>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Envío gratis desde"}
                        <input className={"fld"} defaultValue={"[MONTO EN S/]"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Hora de corte para despacho del día"}
                        <input className={"fld"} defaultValue={"15:00"} />
                      </label>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "secPrecios")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                        {"Precios, listas y lotes"}
                      </span>
                      <span style={{ "fontSize": "14px", "color": "#6B6B6B" }}>
                        {"Cada tipo de cliente ve su lista de precios al iniciar sesión o en su cotización."}
                      </span>
                    </div>
                    <div style={{ "borderRadius": "24px", "border": "1px solid #E4E4E0", "overflowX": "auto" }} className={"noscroll"}>
                      <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "520px" }}>
                        <thead>
                          <tr style={{ "background": "#F4F4F2" }}>
                            <th scope={"col"} style={{ "textAlign": "left", "padding": "14px 18px", "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                              {"Lista"}
                            </th>
                            <th scope={"col"} style={{ "textAlign": "left", "padding": "14px", "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                              {"Para"}
                            </th>
                            <th scope={"col"} style={{ "textAlign": "right", "padding": "14px", "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                              {"Descuento"}
                            </th>
                            <th scope={"col"} style={{ "textAlign": "right", "padding": "14px 18px", "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                              {"Compra mínima"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(lookup(v, "tiers") || []).map((r, index8) => (
                            <Fragment key={index8}>
                              <tr style={{ "borderTop": "1px solid #EFEFEC" }}>
                                <th scope={"row"} style={{ "textAlign": "left", "padding": "14px 18px" }}>
                                  <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "fontWeight": "700" }}>
                                    <span style={{ "width": "10px", "height": "10px", "borderRadius": "50%", "background": lookup(r, "dot") }}></span>
                                    {lookup(r, "name")}
                                  </span>
                                </th>
                                <td style={{ "padding": "14px", "color": "#6B6B6B" }}>
                                  {lookup(r, "who")}
                                </td>
                                <td style={{ "padding": "14px", "textAlign": "right", "fontWeight": "800" }}>
                                  {lookup(r, "off")}
                                </td>
                                <td style={{ "padding": "14px 18px", "textAlign": "right" }}>
                                  {lookup(r, "min")}
                                </td>
                              </tr>
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div style={{ "display": "flex", "gap": "16px", "flexWrap": "wrap" }}>
                      <div style={{ "flex": "1 1 300px", "padding": "20px", "borderRadius": "24px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                        <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                          {"Orden de salida de lotes"}
                        </span>
                        <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                          {"Define de qué lote se descuenta cada venta."}
                        </span>
                        <div role={"radiogroup"} aria-label={"Método de salida"} style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                          {(lookup(v, "methods") || []).map((m, index9) => (
                            <Fragment key={index9}>
                              <button role={"radio"} aria-checked={lookup(m, "checked")} onClick={lookup(m, "pick")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "18px", "border": "1px solid " + String(lookup(m, "border") ?? ""), "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left" }}>
                                <span style={{ "width": "20px", "height": "20px", "borderRadius": "50%", "border": "2px solid " + String(lookup(m, "border") ?? ""), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none", "boxSizing": "border-box" }}>
                                  <span style={{ "width": "10px", "height": "10px", "borderRadius": "50%", "background": lookup(m, "dot") }}></span>
                                </span>
                                <span style={{ "display": "flex", "flexDirection": "column" }}>
                                  <span style={{ "fontSize": "14px", "fontWeight": "700", "color": "#111111" }}>
                                    {lookup(m, "name")}
                                  </span>
                                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                    {lookup(m, "sub")}
                                  </span>
                                </span>
                              </button>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div style={{ "flex": "1 1 260px", "padding": "20px", "borderRadius": "24px", "background": "#111111", "color": "#FFFFFF", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                        <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                          {"Alertas de stock"}
                        </span>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "color": "#CFCFCF" }}>
                          {"Avisar cuando el stock baje del"}
                          <input className={"fld"} defaultValue={"20% del mínimo"} style={{ "background": "#2A2A2A", "borderColor": "#2A2A2A", "color": "#FFFFFF" }} />
                        </label>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "color": "#CFCFCF" }}>
                          {"Avisar garantía de lote por vencer con"}
                          <input className={"fld"} defaultValue={"60 días de anticipación"} style={{ "background": "#2A2A2A", "borderColor": "#2A2A2A", "color": "#FFFFFF" }} />
                        </label>
                        <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                          {"El mínimo de cada producto se edita en Inventario y lotes."}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "secNotif")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                        {"Notificaciones"}
                      </span>
                      <span style={{ "fontSize": "14px", "color": "#6B6B6B" }}>
                        {"Avisos que llegan al WhatsApp +51 954 802 744 y al correo del panel."}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                      {(lookup(v, "notifs") || []).map((t, index10) => (
                        <Fragment key={index10}>
                          <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "16px 18px", "borderRadius": "22px", "background": "#F4F4F2" }}>
                            <span style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(t, "icon")}></path>
                              </svg>
                            </span>
                            <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                {lookup(t, "name")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(t, "sub")}
                              </span>
                            </span>
                            <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                              {lookup(t, "state")}
                            </span>
                            <button role={"switch"} aria-checked={lookup(t, "ariaOn")} aria-label={lookup(t, "name")} onClick={lookup(t, "toggle")} style={{ "width": "48px", "height": "28px", "borderRadius": "999px", "border": "none", "background": lookup(t, "track"), "cursor": "pointer", "padding": "0", "flex": "none", "display": "flex", "alignItems": "center" }}>
                              <span style={{ "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF", "marginLeft": lookup(t, "ml") }}></span>
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "secWeb")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "gap": "16px", "flexWrap": "wrap" }}>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                        <span style={{ "fontSize": "22px", "fontWeight": "700" }}>
                          {"Tienda web"}
                        </span>
                        <span style={{ "fontSize": "14px", "color": "#6B6B6B" }}>
                          {"Lo que ve el cliente en www.viaprovisiones.com."}
                        </span>
                      </span>
                      <DesignLink href={"/tienda"} style={{ "height": "44px", "padding": "0 18px", "borderRadius": "999px", "border": "1px solid #111111", "display": "inline-flex", "alignItems": "center", "fontSize": "13px", "fontWeight": "700", "textDecoration": "none" }}>
                        {"Ver la tienda"}
                      </DesignLink>
                    </div>
                    <div style={{ "padding": "20px", "borderRadius": "24px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                      <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                        {"Barra de anuncios"}
                      </span>
                      <div style={{ "height": "46px", "borderRadius": "14px", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "gap": "28px", "padding": "0 18px", "overflow": "hidden", "whiteSpace": "nowrap", "fontSize": "13px", "fontWeight": "600" }}>
                        <span>
                          {"Envíos a todo el sur del Perú"}
                        </span>
                        <span style={{ "color": "#FF914C" }}>
                          {"●"}
                        </span>
                        <span>
                          {"Precios especiales para empresas"}
                        </span>
                        <span style={{ "color": "#FF914C" }}>
                          {"●"}
                        </span>
                        <span>
                          {"Paga con Yape o Plin"}
                        </span>
                      </div>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Mensaje 1"}
                        <input className={"fld"} defaultValue={"Envíos a todo el sur del Perú"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Mensaje 2"}
                        <input className={"fld"} defaultValue={"Precios especiales para empresas"} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                        {"Mensaje 3"}
                        <input className={"fld"} defaultValue={"Paga con Yape o Plin"} />
                      </label>
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                      {(lookup(v, "webs") || []).map((t, index11) => (
                        <Fragment key={index11}>
                          <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "16px 18px", "borderRadius": "22px", "background": "#F4F4F2" }}>
                            <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                {lookup(t, "name")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(t, "sub")}
                              </span>
                            </span>
                            <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                              {lookup(t, "state")}
                            </span>
                            <button role={"switch"} aria-checked={lookup(t, "ariaOn")} aria-label={lookup(t, "name")} onClick={lookup(t, "toggle")} style={{ "width": "48px", "height": "28px", "borderRadius": "999px", "border": "none", "background": lookup(t, "track"), "cursor": "pointer", "padding": "0", "flex": "none", "display": "flex", "alignItems": "center" }}>
                              <span style={{ "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF", "marginLeft": lookup(t, "ml") }}></span>
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "600" }}>
                      {"Horario visible en la tienda"}
                      <input className={"fld"} defaultValue={"[HORARIO]"} />
                    </label>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Ajustes"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
