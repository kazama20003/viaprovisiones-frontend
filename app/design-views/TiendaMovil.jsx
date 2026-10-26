"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'busqueda', menu: false,
      q: 'lámpara', cat: 'Todas', price: 0, stockOnly: false, offersOnly: false, sort: 'rel', cart: 6, added: {}, filters: false,
      step: 1, sum: false, cel: '', tried: false, doc: 0, ship: 1, pay: 0, uploaded: false,
      logged: false, auth: 'in', sub: '', wishOut: {}
    };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const go = (screen) => () => this.setState({ screen, menu: false, filters: false });

    // ---------- búsqueda (mismos productos que /busqueda) ----------
    const ALL = [
      ['Lámpara de camping recargable', 'Camping', 69.9, 0, 'a58999411e32d7481815ba8cdc175e97', 64, 'luz linterna'],
      ['Linterna de cabeza LED', 'Camping', 39.9, 54.9, '9b85b845faa6856c6338458b006ed014', 22, 'lampara frontal luz'],
      ['Linterna táctica recargable', 'Camping', 59.9, 0, '621ce65a45113393656af23955c4e044', 3, 'lampara luz'],
      ['Kit solar plegable para camping', 'Solar', 459, 0, 'b6ecf2ad3d873fbfa09db032a5d5c447', 4, 'lampara panel'],
      ['Panel solar monocristalino 100 W', 'Solar', 349, 0, '972ceb606bfca75ef6208d8d3966c77d', 12, 'energia'],
      ['Foco LED 9 W luz cálida', 'Focos', 8.9, 0, '52dc55c2523393f8f60ab89499fa3ec1', 412, 'lampara bombilla luz'],
      ['Lámpara de emergencia LED', 'Focos', 49.9, 59.9, '52dc55c2523393f8f60ab89499fa3ec1', 0, 'luz corte'],
      ['Cable USB-C carga rápida 1 m', 'Cables', 19.9, 0, '3aba2390d3fbd5f06fdd2cede507b16f', 238, 'cargador'],
      ['Extensión de uso rudo 5 m', 'Extensiones', 45, 0, '323e29809539c2fb4b229651c8081ee9', 57, 'enchufe'],
      ['Casa de campaña para 4 personas', 'Camping', 389, 0, 'a39c65aefaa4235a16422fb671911427', 9, 'carpa'],
      ['Set de cocina para campamento', 'Camping', 129, 0, 'a5d2725814df1e3e53351e1060258c0c', 15, 'olla'],
      ['Mochila de trekking 45 L', 'Camping', 179, 0, '270fef37ab257fc6383d3c904a7f2911', 18, 'bolso']
    ];
    const RANGES = [['Todo', 0, 1e9], ['Hasta S/ 50', 0, 50], ['S/ 50 – 150', 50, 150], ['Más de S/ 150', 150, 1e9]];
    const words = norm(st.q.trim()).split(/\s+/).filter(Boolean);
    const match = ALL.filter((p) => { const hay = norm(p[0] + ' ' + p[1] + ' ' + p[6]); return words.every((w) => hay.indexOf(w) !== -1); });
    const rg = RANGES[st.price];
    let list = match.filter((p) => (st.cat === 'Todas' || p[1] === st.cat) && p[2] >= rg[1] && p[2] < rg[2] && (!st.stockOnly || p[5] > 0) && (!st.offersOnly || p[3] > 0));
    if (st.sort === 'asc') list = list.slice().sort((a, b) => a[2] - b[2]);
    if (st.sort === 'desc') list = list.slice().sort((a, b) => b[2] - a[2]);
    const nFilters = (st.cat !== 'Todas' ? 1 : 0) + (st.price ? 1 : 0) + (st.stockOnly ? 1 : 0) + (st.offersOnly ? 1 : 0);
    const catNames = ['Todas'].concat(match.map((p) => p[1]).filter((c, i, a) => a.indexOf(c) === i));

    // ---------- pago (mismos datos que /checkout) ----------
    const LINES = [
      ['Lámpara de camping recargable', 69.9, 2, 'a58999411e32d7481815ba8cdc175e97'],
      ['Panel solar monocristalino 100 W', 349, 1, '972ceb606bfca75ef6208d8d3966c77d'],
      ['Cable USB-C carga rápida 1 m', 19.9, 3, '3aba2390d3fbd5f06fdd2cede507b16f']
    ];
    const subtotal = LINES.reduce((s, l) => s + l[1] * l[2], 0);
    const SHIPS = [
      ['Recojo en tienda', 'Dean Valdivia 533 - Cercado, Arequipa · listo en 2 h', 'M3 9l1-5h16l1 5M4 9v11h16V9M3 9h18M9 20v-6h6v6', 'Gratis'],
      ['Delivery en Arequipa', 'Motorizado a tu puerta · 24 h', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5', 'Gratis'],
      ['Agencia a provincias', 'Shalom, Olva Courier o Marvisur · [TARIFA]', 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1', 'Al recoger']
    ];
    const PAYS = [
      ['Yape', 'Al instante, desde tu celular'],
      ['Plin', 'Al instante, desde tu banco'],
      ['Transferencia bancaria', '[BANCO] · confirmamos en horas'],
      ['Efectivo contra entrega', st.ship === 2 ? 'No disponible para agencia' : 'Solo en Arequipa'],
      ['Tarjeta', 'Próximamente']
    ];
    const payOff = (i) => i === 4 || (i === 3 && st.ship === 2);
    const pay = payOff(st.pay) ? 0 : st.pay;
    const celOk = st.cel.replace(/\D/g, '').length === 9;
    const err = st.step === 1 && st.tried && !celOk;
    const NAMES = ['Datos', 'Entrega', 'Pago', 'Listo'];

    // ---------- seguimiento ----------
    const TS = [
      ['Recibido', '26 oct · 09:12', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0'],
      ['Pago confirmado', '26 oct · 09:40', 'M5 12l5 5 9-10'],
      ['Preparando', '26 oct · 11:05', 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10'],
      ['En camino', '26 oct · 14:20', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5'],
      ['Entregado', 'Hoy, 3 a 5 pm', 'M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z']
    ];
    const tNow = 3;

    // ---------- cuenta ----------
    const SUBS = { pedidos: 'Mis pedidos', direcciones: 'Direcciones', datos: 'Datos personales', facturacion: 'Facturación', deseos: 'Lista de deseos' };
    const OS = {
      'En camino': ['#FFF1E6', '#8A3B0A', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5'],
      Entregado: ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      Cancelado: ['#F4F4F2', '#444444', 'M6 6l12 12M18 6L6 18']
    };
    const ORD = [
      ['#1043', '26 oct', 'En camino', 548.5, ['a58999411e32d7481815ba8cdc175e97', '972ceb606bfca75ef6208d8d3966c77d']],
      ['#0987', '12 oct', 'Entregado', 89.7, ['52dc55c2523393f8f60ab89499fa3ec1']],
      ['#0912', '28 set', 'Entregado', 179, ['270fef37ab257fc6383d3c904a7f2911']],
      ['#0870', '03 set', 'Cancelado', 45, ['323e29809539c2fb4b229651c8081ee9']]
    ];
    const WISH = [
      ['w1', 'Casa de campaña para 4 personas', 389, 'a39c65aefaa4235a16422fb671911427'],
      ['w2', 'Kit solar plegable para camping', 459, 'b6ecf2ad3d873fbfa09db032a5d5c447'],
      ['w3', 'Linterna de cabeza LED', 39.9, '9b85b845faa6856c6338458b006ed014']
    ].filter((w) => !st.wishOut[w[0]]);
    const scr = st.screen;
    const inSub = scr === 'cuenta' && st.logged && st.sub !== '';

    const TABS = [
      ['busqueda', 'Buscar', 'M11 17.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13zM16 16l4 4'],
      ['pago', 'Pagar', 'M5 7h14l-1.5 13h-11zM9 7a3 3 0 0 1 6 0'],
      ['seguimiento', 'Pedido', 'M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5'],
      ['cuenta', 'Cuenta', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6']
    ];

    return {
      accent,
      cart: String(st.cart),
      cartLabel: 'Carrito, ' + st.cart + ' productos',
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      menuOpen: st.menu,
      menuLinks: [['Inicio', '/tienda'], ['Catálogo', '/categoria'], ['Empresas', '/empresas'], ['Carrito', '/carrito'], ['Enlaces y redes', '/enlaces']].map((m) => ({ t: m[0], href: m[1] })),
      goBusqueda: go('busqueda'),
      goPago: go('pago'),
      goSeguimiento: go('seguimiento'),
      goError: go('error'),
      tabs: TABS.map((t) => ({ t: t[1], icon: t[2], current: scr === t[0] ? 'page' : 'false', bg: scr === t[0] ? accent : 'transparent', pick: go(t[0]) })),
      isBusqueda: scr === 'busqueda',
      isPago: scr === 'pago',
      isSeguimiento: scr === 'seguimiento',
      isCuenta: scr === 'cuenta',
      isError: scr === 'error',

      // búsqueda
      q: st.q,
      onSearch: (e) => this.setState({ q: (e && e.target && e.target.value) || '', cat: 'Todas' }),
      suggest: ['lámpara recargable', 'linterna de cabeza', 'panel solar'].map((t) => ({ t, pick: () => this.setState({ q: t, cat: 'Todas' }) })),
      hasResults: match.length > 0,
      noResults: match.length === 0,
      filteredEmpty: match.length > 0 && list.length === 0,
      resultLabel: list.length + (list.length === 1 ? ' producto' : ' productos'),
      filterBadge: nFilters ? ' · ' + nFilters : '',
      openFilters: () => this.setState({ filters: true }),
      closeFilters: () => this.setState({ filters: false }),
      filterOpen: st.filters,
      listCount: String(list.length),
      resetFilters: () => this.setState({ cat: 'Todas', price: 0, stockOnly: false, offersOnly: false, sort: 'rel' }),
      cats: catNames.map((name) => ({ name, count: String(name === 'Todas' ? match.length : match.filter((p) => p[1] === name).length), pressed: st.cat === name ? 'true' : 'false', bg: st.cat === name ? accent : '#FFFFFF', pick: () => this.setState({ cat: name }) })),
      prices: RANGES.map((r, i) => ({ t: r[0], pressed: st.price === i ? 'true' : 'false', bg: st.price === i ? accent : '#FFFFFF', pick: () => this.setState({ price: i }) })),
      toggles: [['Solo en stock', 'stockOnly'], ['Solo ofertas', 'offersOnly']].map((t) => ({ t: t[0], pressed: st[t[1]] ? 'true' : 'false', track: st[t[1]] ? '#111111' : '#DCDCD8', justify: st[t[1]] ? 'flex-end' : 'flex-start', pick: () => this.setState({ [t[1]]: !st[t[1]] }) })),
      sorts: [['rel', 'Relevancia'], ['asc', 'Menor precio'], ['desc', 'Mayor precio']].map((s) => ({ t: s[1], pressed: st.sort === s[0] ? 'true' : 'false', bg: st.sort === s[0] ? accent : '#FFFFFF', pick: () => this.setState({ sort: s[0] }) })),
      items: list.map((p) => {
        const n = st.added[p[0]] || 0;
        const out = p[5] === 0;
        const low = !out && p[5] <= 5;
        return {
          name: p[0], cat: p[1], img: B + p[4], price: money(p[2]), old: p[3] ? money(p[3]) : '', offer: p[3] > 0,
          stock: out ? 'Agotado' : (low ? 'Quedan ' + p[5] : 'En stock'),
          stockFg: out ? '#8E1C14' : (low ? '#7A4A00' : '#1B5E20'),
          stockIcon: out ? 'M6 6l12 12M18 6L6 18' : (low ? 'M12 7v6M12 17h.01' : 'M5 12l5 5 9-10'),
          btn: out ? 'Avísame' : (n ? 'Agregado · ' + n : 'Añadir'),
          btnBg: out ? '#FFFFFF' : (n ? '#111111' : accent), btnBorder: out ? '2px solid #111111' : 'none',
          add: () => { if (out) return; this.setState({ cart: st.cart + 1, added: Object.assign({}, st.added, { [p[0]]: n + 1 }) }); }
        };
      }).map((i) => Object.assign(i, { btnBg: i.btn.indexOf('Agregado') === 0 ? '#FFFFFF' : i.btnBg, btnBorder: i.btn.indexOf('Agregado') === 0 ? '2px solid #111111' : i.btnBorder })),

      // pago
      steps: NAMES.map((n, i) => ({ name: n, bar: i + 1 <= st.step ? '#111111' : '#DCDCD8', fg: i + 1 === st.step ? '#111111' : '#6B6B6B' })),
      sumOpen: st.sum,
      sumExpanded: st.sum ? 'true' : 'false',
      sumLabel: st.sum ? 'Ocultar resumen' : 'Ver resumen',
      sumChev: st.sum ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6',
      toggleSum: () => this.setState({ sum: !st.sum }),
      totalTxt: money(subtotal),
      shipCost: SHIPS[st.ship][3],
      lines: LINES.map((l) => ({ name: l[0], qty: String(l[2]), total: money(l[1] * l[2]), img: B + l[3] })),
      err,
      step1: st.step === 1, step2: st.step === 2, step3: st.step === 3, step4: st.step === 4,
      cel: st.cel,
      onCel: (e) => this.setState({ cel: (e && e.target && e.target.value) || '' }),
      celBorder: err ? '2px solid #C62828' : '1px solid #111111',
      docs: ['Boleta', 'Factura'].map((t, i) => ({ t, pressed: st.doc === i ? 'true' : 'false', bg: st.doc === i ? '#111111' : '#FFFFFF', fg: st.doc === i ? '#FFFFFF' : '#111111', pick: () => this.setState({ doc: i }) })),
      isFactura: st.doc === 1,
      ships: SHIPS.map((s, i) => ({ name: s[0], sub: s[1], icon: s[2], price: s[3], pressed: st.ship === i ? 'true' : 'false', border: st.ship === i ? '2px solid #111111' : '1px solid #DCDCD8', bg: '#FFFFFF', iconBg: st.ship === i ? accent : '#F4F4F2', pick: () => this.setState({ ship: i }) })),
      isDelivery: st.ship === 1,
      pays: PAYS.map((p, i) => ({ name: p[0], sub: p[1], pressed: pay === i ? 'true' : 'false', disabled: payOff(i) ? 'true' : 'false', o: payOff(i) ? '0.45' : '1', border: pay === i ? '2px solid #111111' : '1px solid #DCDCD8', bg: '#FFFFFF', dot: pay === i ? '#111111' : 'transparent', pick: () => { if (!payOff(i)) this.setState({ pay: i, uploaded: false }); } })),
      isWallet: pay === 0 || pay === 1,
      isTransfer: pay === 2,
      walletName: pay === 1 ? 'PLIN' : 'YAPE',
      upload: () => this.setState({ uploaded: true }),
      uploadTxt: st.uploaded ? 'Constancia subida ✓' : 'Subir constancia',
      showCta: scr === 'pago' && st.step < 4,
      canBack: st.step > 1,
      back: () => this.setState({ step: Math.max(1, st.step - 1), tried: false }),
      next: () => { if (st.step === 1 && !celOk) { this.setState({ tried: true }); return; } this.setState({ step: st.step + 1, tried: false }); },
      nextTxt: st.step === 3 ? 'Confirmar pedido · ' + money(subtotal) : 'Continuar',

      // seguimiento
      tHead: 'Tu pedido va en camino',
      tSub: 'Llega hoy entre 3 y 5 pm a tu dirección.',
      tSteps: TS.map((s, i) => ({ name: s[0], when: s[1], icon: s[2], bg: i < tNow ? '#111111' : (i === tNow ? accent : '#FFFFFF'), fg: i < tNow ? '#FFFFFF' : '#111111', line: i < tNow ? '#111111' : '#DCDCD8', weight: i === tNow ? '700' : '500' })),

      // cuenta
      loggedOut: scr === 'cuenta' && !st.logged,
      loggedHome: scr === 'cuenta' && st.logged && st.sub === '',
      inSub,
      authTabs: [['in', 'Ingresar'], ['up', 'Crear cuenta']].map((t) => ({ t: t[1], pressed: st.auth === t[0] ? 'true' : 'false', bg: st.auth === t[0] ? '#111111' : 'transparent', fg: st.auth === t[0] ? '#FFFFFF' : '#111111', pick: () => this.setState({ auth: t[0] }) })),
      isSignup: st.auth === 'up',
      authCta: st.auth === 'up' ? 'Crear mi cuenta' : 'Ingresar',
      login: () => this.setState({ logged: true, sub: '' }),
      logout: () => this.setState({ logged: false, sub: '' }),
      accMenu: [
        ['pedidos', 'Mis pedidos', '4', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0'],
        ['direcciones', 'Direcciones', '2', 'M12 21s-7-6.5-7-11a7 7 0 0 1 14 0c0 4.5-7 11-7 11z'],
        ['datos', 'Datos personales', '', 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6'],
        ['facturacion', 'Facturación', '', 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4'],
        ['deseos', 'Lista de deseos', String(WISH.length), 'M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z']
      ].map((m) => ({ t: m[1], count: m[2], icon: m[3], pick: () => this.setState({ sub: m[0] }) })),
      backAcc: () => this.setState({ sub: '' }),
      subTitle: SUBS[st.sub] || '',
      subPedidos: st.sub === 'pedidos',
      subDirecciones: st.sub === 'direcciones',
      subDatos: st.sub === 'datos',
      subFacturacion: st.sub === 'facturacion',
      subDeseos: st.sub === 'deseos',
      orders: ORD.map((o) => ({ id: o[0], date: o[1], status: o[2], total: money(o[3]), bg: OS[o[2]][0], fg: OS[o[2]][1], icon: OS[o[2]][2], imgs: o[4].map((x) => ({ src: B + x })) })),
      wish: WISH.map((w) => ({ name: w[1], price: money(w[2]), img: B + w[3], remove: () => this.setState({ wishOut: Object.assign({}, st.wishOut, { [w[0]]: true }) }) })),
      wishEmpty: WISH.length === 0
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function TiendaMovil(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "position": "relative", "width": "100%", "height": "100vh", "height": "100dvh", "borderRadius": "24px", "overflow": "hidden", "display": "flex", "flexDirection": "column", "background": "#FFFFFF", "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "15px", "color": "#111111" }}>
      <div style={{ "height": "60px", "flex": "none", "display": "flex", "alignItems": "center", "gap": "4px", "padding": "0 8px", "borderBottom": "1px solid #111111", "boxSizing": "border-box", "background": "#FFFFFF" }}>
        <button onClick={lookup(v, "openMenu")} aria-label={"Abrir menú"} style={{ "width": "44px", "height": "44px", "border": "none", "background": "transparent", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
          <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
            <path d={"M4 7h16M4 12h16M4 17h10"}></path>
          </svg>
        </button>
        <a href={"/tienda"} aria-label={"VIA Provisiones, inicio"} style={{ "flex": "1", "display": "flex", "justifyContent": "center" }}>
          <svg width={"108"} height={"36"} viewBox={"134 205 278 92"} aria-hidden={"true"}>
            <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#111111"} strokeWidth={"4"}></circle>
            <clipPath id={"via-clip-tmov"}>
              <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
            </clipPath>
            <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={lookup(v, "accent")}></polygon>
            <path clipPath={"url(#via-clip-tmov)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
            <g fill={"none"} stroke={"#111111"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
              <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
              <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
              <path d={"M295.8 229 V248.25"}></path>
            </g>
            <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={"#C2410C"}>
              {"PROVISIONES"}
            </text>
          </svg>
        </a>
        <button onClick={lookup(v, "goBusqueda")} aria-label={"Buscar"} style={{ "width": "44px", "height": "44px", "border": "none", "background": "transparent", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
          <svg width={"21"} height={"21"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
            <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
            <path d={"M16 16l4 4"}></path>
          </svg>
        </button>
        <button onClick={lookup(v, "goPago")} aria-label={lookup(v, "cartLabel")} style={{ "position": "relative", "width": "44px", "height": "44px", "border": "none", "background": "transparent", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
          <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
            <path d={"M5 7h14l-1.5 13h-11zM9 7a3 3 0 0 1 6 0"}></path>
          </svg>
          <span style={{ "position": "absolute", "top": "4px", "right": "2px", "minWidth": "18px", "height": "18px", "padding": "0 4px", "boxSizing": "border-box", "borderRadius": "999px", "background": lookup(v, "accent"), "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
            {lookup(v, "cart")}
          </span>
        </button>
      </div>
      <div className={"noscroll"} style={{ "flex": "1", "minHeight": "0", "overflowY": "auto" }}>
        {Boolean(lookup(v, "isBusqueda")) && (
          <Fragment>
            <div style={{ "padding": "16px 16px 24px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <label style={{ "display": "flex", "alignItems": "center", "gap": "8px", "height": "50px", "padding": "0 6px 0 16px", "border": "2px solid #111111", "borderRadius": "999px", "boxSizing": "border-box" }}>
                <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                  {"Buscar productos"}
                </span>
                <input type={"search"} value={(lookup(v, "q") ?? "")} onChange={lookup(v, "onSearch")} placeholder={"¿Qué estás buscando?"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "16px", "outline": "none" }} />
                <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.2"} aria-hidden={"true"}>
                    <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                    <path d={"M16 16l4 4"}></path>
                  </svg>
                </span>
              </label>
              <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto", "margin": "0 -16px", "padding": "0 16px" }}>
                {(lookup(v, "suggest") || []).map((s, index1) => (
                  <Fragment key={index1}>
                    <button onClick={lookup(s, "pick")} style={{ "flex": "none", "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px" }}>
                      {lookup(s, "t")}
                    </button>
                  </Fragment>
                ))}
              </div>
              {Boolean(lookup(v, "hasResults")) && (
                <Fragment>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                    <span style={{ "flex": "1", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {lookup(v, "resultLabel")}
                    </span>
                    <button onClick={lookup(v, "openFilters")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M4 6h16M7 12h10M10 18h4"}></path>
                      </svg>
                      {"Filtros"}
                      {lookup(v, "filterBadge")}
                    </button>
                  </div>
                  {Boolean(lookup(v, "filteredEmpty")) && (
                    <Fragment>
                      <div style={{ "padding": "20px", "border": "2px dashed #111111", "borderRadius": "18px", "display": "flex", "flexDirection": "column", "gap": "10px", "alignItems": "flex-start" }}>
                        <span style={{ "fontSize": "14px" }}>
                          {"Ningún producto cumple con estos filtros."}
                        </span>
                        <button onClick={lookup(v, "resetFilters")} style={{ "height": "40px", "padding": "0 16px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                          {"Quitar filtros"}
                        </button>
                      </div>
                    </Fragment>
                  )}
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "12px" }}>
                    {(lookup(v, "items") || []).map((p, index2) => (
                      <Fragment key={index2}>
                        <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                          <a href={"/producto"} style={{ "position": "relative", "display": "block", "aspectRatio": "1 / 1", "borderRadius": "16px", "overflow": "hidden", "background": "#F4F4F2" }}>
                            <img src={assetSrc(lookup(p, "img"))} alt={lookup(p, "name")} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />
                            {Boolean(lookup(p, "offer")) && (
                              <Fragment>
                                <span style={{ "position": "absolute", "top": "8px", "left": "8px", "padding": "4px 8px", "borderRadius": "999px", "background": lookup(v, "accent"), "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase" }}>
                                  {"Oferta"}
                                </span>
                              </Fragment>
                            )}
                          </a>
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase", "color": "#6B6B6B" }}>
                            {lookup(p, "cat")}
                          </span>
                          <a href={"/producto"} style={{ "fontSize": "13px", "fontWeight": "500", "lineHeight": "1.3", "textDecoration": "none", "minHeight": "34px" }}>
                            {lookup(p, "name")}
                          </a>
                          <span style={{ "display": "flex", "alignItems": "baseline", "gap": "6px" }}>
                            <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "800" }}>
                              {lookup(p, "price")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B", "textDecoration": "line-through" }}>
                              {lookup(p, "old")}
                            </span>
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "fontSize": "11px", "color": lookup(p, "stockFg") }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(p, "stockIcon")}></path>
                            </svg>
                            {lookup(p, "stock")}
                          </span>
                          <button onClick={lookup(p, "add")} style={{ "height": "40px", "borderRadius": "999px", "border": lookup(p, "btnBorder"), "background": lookup(p, "btnBg"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                            {lookup(p, "btn")}
                          </button>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              )}
              {Boolean(lookup(v, "noResults")) && (
                <Fragment>
                  <div style={{ "padding": "22px 18px", "borderRadius": "20px", "background": "#111111", "color": "#FFFFFF", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                      {"No encontramos resultados"}
                    </span>
                    <span style={{ "fontSize": "14px", "lineHeight": "1.5", "color": "#E8E8E8" }}>
                      {"Revisa cómo lo escribiste o prueba con una palabra más general, como “luz” o “cable”."}
                    </span>
                    <a href={"https://wa.me/51954802744"} style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "height": "44px", "padding": "0 18px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {"Pedir por WhatsApp"}
                    </a>
                  </div>
                </Fragment>
              )}
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isPago")) && (
          <Fragment>
            <div style={{ "padding": "14px 16px 110px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                {(lookup(v, "steps") || []).map((s, index3) => (
                  <Fragment key={index3}>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "height": "6px", "borderRadius": "999px", "background": lookup(s, "bar") }}></span>
                      <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase", "color": lookup(s, "fg") }}>
                        {lookup(s, "name")}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </div>
              <button onClick={lookup(v, "toggleSum")} aria-expanded={lookup(v, "sumExpanded")} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "height": "50px", "padding": "0 16px", "borderRadius": "14px", "border": "1px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "textAlign": "left" }}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M5 7h14l-1.5 13h-11zM9 7a3 3 0 0 1 6 0"}></path>
                </svg>
                <span style={{ "flex": "1", "fontWeight": "500" }}>
                  {lookup(v, "sumLabel")}
                </span>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800" }}>
                  {lookup(v, "totalTxt")}
                </span>
                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={lookup(v, "sumChev")}></path>
                </svg>
              </button>
              {Boolean(lookup(v, "sumOpen")) && (
                <Fragment>
                  <div style={{ "padding": "14px", "borderRadius": "14px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    {(lookup(v, "lines") || []).map((l, index4) => (
                      <Fragment key={index4}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <span style={{ "position": "relative", "width": "48px", "height": "48px", "borderRadius": "10px", "overflow": "hidden", "background": "#FFFFFF", "flex": "none" }}>
                            <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
                          </span>
                          <span style={{ "flex": "1", "fontSize": "13px", "lineHeight": "1.3" }}>
                            {lookup(l, "name")}
                            {" "}
                            <span style={{ "color": "#6B6B6B" }}>
                              {"× "}
                              {lookup(l, "qty")}
                            </span>
                          </span>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(l, "total")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px", "paddingTop": "8px", "borderTop": "1px solid #DCDCD8" }}>
                      <span>
                        {"Envío"}
                      </span>
                      <span>
                        {lookup(v, "shipCost")}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "15px", "fontWeight": "700" }}>
                      <span>
                        {"Total · IGV incluido"}
                      </span>
                      <span>
                        {lookup(v, "totalTxt")}
                      </span>
                    </div>
                  </div>
                </Fragment>
              )}
              {Boolean(lookup(v, "err")) && (
                <Fragment>
                  <div role={"alert"} style={{ "display": "flex", "gap": "10px", "alignItems": "center", "padding": "12px 14px", "borderRadius": "12px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "13px", "fontWeight": "500" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                      <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                    </svg>
                    {"Escribe un celular de 9 dígitos para avisarte de tu pedido."}
                  </div>
                </Fragment>
              )}
              {Boolean(lookup(v, "step1")) && (
                <Fragment>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "900", "textTransform": "uppercase" }}>
                    {"Tus datos"}
                  </span>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                    {"Nombre completo"}
                    <input type={"text"} placeholder={"María Quispe"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                    {"Celular"}
                    <span style={{ "display": "flex", "alignItems": "center", "height": "50px", "border": lookup(v, "celBorder"), "borderRadius": "12px", "overflow": "hidden" }}>
                      <span style={{ "padding": "0 12px", "height": "100%", "display": "flex", "alignItems": "center", "background": "#F4F4F2", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700" }}>
                        {"+51"}
                      </span>
                      <input type={"tel"} value={(lookup(v, "cel") ?? "")} onChange={lookup(v, "onCel")} placeholder={"9XX XXX XXX"} style={{ "flex": "1", "minWidth": "0", "height": "100%", "border": "none", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "16px", "outline": "none" }} />
                    </span>
                  </label>
                  <span style={{ "fontSize": "13px", "fontWeight": "500" }}>
                    {"Comprobante"}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                    {(lookup(v, "docs") || []).map((d, index5) => (
                      <Fragment key={index5}>
                        <button onClick={lookup(d, "pick")} aria-pressed={lookup(d, "pressed")} style={{ "height": "46px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(d, "bg"), "color": lookup(d, "fg"), "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                          {lookup(d, "t")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {Boolean(lookup(v, "isFactura")) && (
                    <Fragment>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"RUC"}
                        <input type={"text"} placeholder={"[RUC de 11 dígitos]"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Razón social"}
                        <input type={"text"} placeholder={"[RAZÓN SOCIAL]"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                    </Fragment>
                  )}
                </Fragment>
              )}
              {Boolean(lookup(v, "step2")) && (
                <Fragment>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "900", "textTransform": "uppercase" }}>
                    {"Entrega"}
                  </span>
                  {(lookup(v, "ships") || []).map((s, index6) => (
                    <Fragment key={index6}>
                      <button onClick={lookup(s, "pick")} aria-pressed={lookup(s, "pressed")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px", "borderRadius": "16px", "border": lookup(s, "border"), "background": lookup(s, "bg"), "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left" }}>
                        <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(s, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                            {lookup(s, "name")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#444444", "lineHeight": "1.35" }}>
                            {lookup(s, "sub")}
                          </span>
                        </span>
                        <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                          {lookup(s, "price")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                  {Boolean(lookup(v, "isDelivery")) && (
                    <Fragment>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Dirección"}
                        <input type={"text"} placeholder={"[DIRECCIÓN]"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Referencia"}
                        <input type={"text"} placeholder={"Frente al parque, puerta negra"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                    </Fragment>
                  )}
                </Fragment>
              )}
              {Boolean(lookup(v, "step3")) && (
                <Fragment>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "900", "textTransform": "uppercase" }}>
                    {"Pago"}
                  </span>
                  {(lookup(v, "pays") || []).map((p, index7) => (
                    <Fragment key={index7}>
                      <button onClick={lookup(p, "pick")} aria-pressed={lookup(p, "pressed")} aria-disabled={lookup(p, "disabled")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px", "borderRadius": "16px", "border": lookup(p, "border"), "background": lookup(p, "bg"), "opacity": lookup(p, "o"), "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left" }}>
                        <span style={{ "width": "20px", "height": "20px", "borderRadius": "50%", "border": "2px solid #111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <span style={{ "width": "10px", "height": "10px", "borderRadius": "50%", "background": lookup(p, "dot") }}></span>
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                            {lookup(p, "name")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#444444" }}>
                            {lookup(p, "sub")}
                          </span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                  {Boolean(lookup(v, "isWallet")) && (
                    <Fragment>
                      <div style={{ "padding": "16px", "borderRadius": "16px", "background": "#111111", "color": "#FFFFFF", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "12px", "textAlign": "center" }}>
                        <span style={{ "width": "150px", "height": "150px", "borderRadius": "12px", "background": "#FFFFFF", "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700" }}>
                          {"[QR DE "}
                          {lookup(v, "walletName")}
                          {"]"}
                        </span>
                        <span style={{ "fontSize": "14px" }}>
                          {"Yapea o plinea "}
                          <strong>
                            {lookup(v, "totalTxt")}
                          </strong>
                          {" al "}
                          <strong>
                            {"+51 954 802 744"}
                          </strong>
                        </span>
                        <button onClick={lookup(v, "upload")} style={{ "height": "44px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                          {lookup(v, "uploadTxt")}
                        </button>
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "isTransfer")) && (
                    <Fragment>
                      <div style={{ "padding": "16px", "borderRadius": "16px", "background": "#F4F4F2", "fontSize": "13px", "lineHeight": "1.6" }}>
                        <strong>
                          {"[BANCO]"}
                        </strong>
                        <br />
                        {"Cuenta: [N° DE CUENTA]"}
                        <br />
                        {"CCI: [CCI]"}
                        <br />
                        {"Titular: VIA Provisiones · RUC [RUC]"}
                      </div>
                    </Fragment>
                  )}
                </Fragment>
              )}
              {Boolean(lookup(v, "step4")) && (
                <Fragment>
                  <div style={{ "padding": "22px 18px", "borderRadius": "20px", "background": lookup(v, "accent"), "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M5 12l5 5 9-10"}></path>
                      </svg>
                    </span>
                    <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                      {"Pedido #1043 recibido"}
                    </span>
                    <span style={{ "fontSize": "14px", "lineHeight": "1.5" }}>
                      {"Te escribiremos por WhatsApp para confirmar tu pago y la entrega. Total "}
                      {lookup(v, "totalTxt")}
                      {"."}
                    </span>
                  </div>
                  <button onClick={lookup(v, "goSeguimiento")} style={{ "height": "52px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Ver mi pedido"}
                  </button>
                  <a href={"/tienda"} style={{ "height": "52px", "borderRadius": "999px", "border": "2px solid #111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Seguir comprando"}
                  </a>
                </Fragment>
              )}
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isSeguimiento")) && (
          <Fragment>
            <div style={{ "padding": "16px 16px 24px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "color": "#6B6B6B" }}>
                {"Pedido #1043 · 26 oct"}
              </span>
              <div style={{ "padding": "20px 18px", "borderRadius": "20px", "background": "#111111", "color": "#FFFFFF", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                  {lookup(v, "tHead")}
                </span>
                <span style={{ "fontSize": "14px", "color": "#E8E8E8" }}>
                  {lookup(v, "tSub")}
                </span>
              </div>
              <div style={{ "display": "flex", "flexDirection": "column" }}>
                {(lookup(v, "tSteps") || []).map((s, index8) => (
                  <Fragment key={index8}>
                    <div style={{ "display": "flex", "gap": "14px" }}>
                      <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "center" }}>
                        <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(s, "bg"), "border": "2px solid #111111", "boxSizing": "border-box", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "fg")} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "width": "2px", "flex": "1", "minHeight": "18px", "background": lookup(s, "line") }}></span>
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "6px 0 16px" }}>
                        <span style={{ "fontSize": "14px", "fontWeight": lookup(s, "weight") }}>
                          {lookup(s, "name")}
                        </span>
                        <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "color": "#6B6B6B" }}>
                          {lookup(s, "when")}
                        </span>
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ "padding": "16px", "borderRadius": "16px", "border": "1px solid #111111", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Entrega"}
                </span>
                <span style={{ "fontSize": "14px", "lineHeight": "1.5" }}>
                  <strong>
                    {"Delivery en Arequipa"}
                  </strong>
                  <br />
                  {"[DIRECCIÓN] · Hoy entre 3 y 5 pm"}
                </span>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "paddingTop": "10px", "borderTop": "1px solid #DCDCD8" }}>
                  <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 17a2 2 0 1 0 0-.1M19 17a2 2 0 1 0 0-.1M7 17h8l2-6h-6l-2-4H5"}></path>
                    </svg>
                  </span>
                  <span style={{ "flex": "1", "fontSize": "13px", "lineHeight": "1.4" }}>
                    <strong>
                      {"Motorizado [NOMBRE]"}
                    </strong>
                    <br />
                    {"Placa [PLACA]"}
                  </span>
                  <a href={"https://wa.me/51954802744"} style={{ "height": "40px", "padding": "0 14px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"WhatsApp"}
                  </a>
                </div>
              </div>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                {(lookup(v, "lines") || []).map((l, index9) => (
                  <Fragment key={index9}>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                      <span style={{ "width": "52px", "height": "52px", "borderRadius": "12px", "overflow": "hidden", "background": "#F4F4F2", "flex": "none" }}>
                        <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
                      </span>
                      <span style={{ "flex": "1", "fontSize": "13px", "lineHeight": "1.3" }}>
                        {lookup(l, "name")}
                        {" "}
                        <span style={{ "color": "#6B6B6B" }}>
                          {"× "}
                          {lookup(l, "qty")}
                        </span>
                      </span>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(l, "total")}
                      </span>
                    </div>
                  </Fragment>
                ))}
                <div style={{ "display": "flex", "justifyContent": "space-between", "paddingTop": "10px", "borderTop": "1px solid #111111", "fontFamily": "Archivo, sans-serif", "fontSize": "18px", "fontWeight": "800" }}>
                  <span>
                    {"Total"}
                  </span>
                  <span>
                    {"S/ 548.50"}
                  </span>
                </div>
              </div>
              <div style={{ "padding": "16px", "borderRadius": "16px", "background": "#F4F4F2", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"¿Problema con tu pedido?"}
                </span>
                <span style={{ "fontSize": "13px", "lineHeight": "1.5", "color": "#444444" }}>
                  {"Tienes 7 días para cambios o devoluciones. Escríbenos y lo resolvemos."}
                </span>
                <a href={"https://wa.me/51954802744"} style={{ "alignSelf": "flex-start", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px" }}>
                  {"Escribir al 954 802 744"}
                </a>
              </div>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isCuenta")) && (
          <Fragment>
            <div style={{ "padding": "16px 16px 24px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              {Boolean(lookup(v, "loggedOut")) && (
                <Fragment>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "28px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                    {"Mi cuenta"}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "padding": "4px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                    {(lookup(v, "authTabs") || []).map((t, index10) => (
                      <Fragment key={index10}>
                        <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "height": "44px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                          {lookup(t, "t")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {Boolean(lookup(v, "isSignup")) && (
                    <Fragment>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Nombre"}
                        <input type={"text"} placeholder={"Tu nombre"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                    </Fragment>
                  )}
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                    {"Correo o celular"}
                    <input type={"text"} placeholder={"tucorreo@ejemplo.com"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                    {"Contraseña"}
                    <input type={"password"} placeholder={"••••••••"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                  </label>
                  <button onClick={lookup(v, "login")} style={{ "height": "52px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {lookup(v, "authCta")}
                  </button>
                  <div style={{ "padding": "16px", "borderRadius": "16px", "background": "#111111", "color": "#FFFFFF", "fontSize": "13px", "lineHeight": "1.6" }}>
                    {"Con tu cuenta ves tus pedidos, guardas direcciones y pides factura más rápido. "}
                    <a href={"/empresas"} style={{ "color": lookup(v, "accent"), "fontWeight": "700" }}>
                      {"¿Compras para tu negocio?"}
                    </a>
                  </div>
                </Fragment>
              )}
              {Boolean(lookup(v, "loggedHome")) && (
                <Fragment>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                    <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "Archivo, sans-serif", "fontSize": "18px", "fontWeight": "900" }}>
                      {"MQ"}
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                      <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "900", "textTransform": "uppercase" }}>
                        {"Hola, María"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Cliente de ejemplo · 4 pedidos"}
                      </span>
                    </span>
                  </div>
                  <div style={{ "display": "flex", "flexDirection": "column", "border": "1px solid #111111", "borderRadius": "18px", "overflow": "hidden" }}>
                    {(lookup(v, "accMenu") || []).map((m, index11) => (
                      <Fragment key={index11}>
                        <button onClick={lookup(m, "pick")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "58px", "padding": "0 16px", "border": "none", "borderBottom": "1px solid #DCDCD8", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "15px", "textAlign": "left" }}>
                          <svg width={"19"} height={"19"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(m, "icon")}></path>
                          </svg>
                          <span style={{ "flex": "1", "fontWeight": "500" }}>
                            {lookup(m, "t")}
                          </span>
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "color": "#6B6B6B" }}>
                            {lookup(m, "count")}
                          </span>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M9 6l6 6-6 6"}></path>
                          </svg>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <button onClick={lookup(v, "logout")} style={{ "alignSelf": "flex-start", "height": "40px", "padding": "0 4px", "border": "none", "background": "transparent", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "textDecoration": "underline", "textUnderlineOffset": "4px" }}>
                    {"Cerrar sesión"}
                  </button>
                </Fragment>
              )}
              {Boolean(lookup(v, "inSub")) && (
                <Fragment>
                  <button onClick={lookup(v, "backAcc")} style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "36px", "padding": "0", "border": "none", "background": "transparent", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M15 6l-6 6 6 6"}></path>
                    </svg>
                    {"Mi cuenta"}
                  </button>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                    {lookup(v, "subTitle")}
                  </span>
                  {Boolean(lookup(v, "subPedidos")) && (
                    <Fragment>
                      {(lookup(v, "orders") || []).map((o, index12) => (
                        <Fragment key={index12}>
                          <div style={{ "padding": "14px", "borderRadius": "16px", "border": "1px solid #111111", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                            <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700" }}>
                                {lookup(o, "id")}
                                {" · "}
                                {lookup(o, "date")}
                              </span>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(o, "bg"), "color": lookup(o, "fg"), "fontSize": "11px", "fontWeight": "700" }}>
                                <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(o, "icon")}></path>
                                </svg>
                                {lookup(o, "status")}
                              </span>
                            </div>
                            <div style={{ "display": "flex", "gap": "6px" }}>
                              {(lookup(o, "imgs") || []).map((im, index13) => (
                                <Fragment key={index13}>
                                  <span style={{ "width": "44px", "height": "44px", "borderRadius": "10px", "overflow": "hidden", "background": "#F4F4F2" }}>
                                    <img src={assetSrc(lookup(im, "src"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
                                  </span>
                                </Fragment>
                              ))}
                              <span style={{ "flex": "1" }}></span>
                              <span style={{ "alignSelf": "center", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "800" }}>
                                {lookup(o, "total")}
                              </span>
                            </div>
                            <button onClick={lookup(v, "goSeguimiento")} style={{ "height": "42px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                              {"Ver seguimiento"}
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "subDirecciones")) && (
                    <Fragment>
                      <div style={{ "padding": "14px", "borderRadius": "16px", "border": "2px solid #111111", "fontSize": "14px", "lineHeight": "1.5" }}>
                        <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase", "background": lookup(v, "accent"), "padding": "3px 8px", "borderRadius": "999px" }}>
                          {"Principal"}
                        </span>
                        <br />
                        <strong>
                          {"Casa"}
                        </strong>
                        <br />
                        {"[DIRECCIÓN] · Cayma, Arequipa"}
                      </div>
                      <div style={{ "padding": "14px", "borderRadius": "16px", "border": "1px solid #DCDCD8", "fontSize": "14px", "lineHeight": "1.5" }}>
                        <strong>
                          {"Trabajo"}
                        </strong>
                        <br />
                        {"[DIRECCIÓN] · Cercado, Arequipa"}
                      </div>
                      <button style={{ "height": "48px", "borderRadius": "999px", "border": "2px dashed #111111", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                        {"+ Agregar dirección"}
                      </button>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "subDatos")) && (
                    <Fragment>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Nombre"}
                        <input type={"text"} defaultValue={"María Quispe"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Celular"}
                        <input type={"tel"} defaultValue={"[CELULAR]"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"DNI"}
                        <input type={"text"} defaultValue={"[DNI]"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "subFacturacion")) && (
                    <Fragment>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"RUC"}
                        <input type={"text"} defaultValue={"[RUC]"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Razón social"}
                        <input type={"text"} defaultValue={"[RAZÓN SOCIAL]"} style={{ "height": "50px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "16px" }} />
                      </label>
                      <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "14px" }}>
                        <input type={"checkbox"} defaultChecked style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                        {"Pedir factura por defecto"}
                      </label>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "subDeseos")) && (
                    <Fragment>
                      {Boolean(lookup(v, "wishEmpty")) && (
                        <Fragment>
                          <span style={{ "padding": "20px", "borderRadius": "16px", "background": "#F4F4F2", "fontSize": "14px" }}>
                            {"Tu lista de deseos está vacía."}
                          </span>
                        </Fragment>
                      )}
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "12px" }}>
                        {(lookup(v, "wish") || []).map((w, index14) => (
                          <Fragment key={index14}>
                            <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                              <span style={{ "position": "relative", "display": "block", "aspectRatio": "1 / 1", "borderRadius": "16px", "overflow": "hidden", "background": "#F4F4F2" }}>
                                <img src={assetSrc(lookup(w, "img"))} alt={lookup(w, "name")} style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
                                <button onClick={lookup(w, "remove")} aria-label={"Quitar de la lista"} style={{ "position": "absolute", "top": "8px", "right": "8px", "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"#C2410C"} stroke={"#C2410C"} strokeWidth={"1.8"} aria-hidden={"true"}>
                                    <path d={"M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"}></path>
                                  </svg>
                                </button>
                              </span>
                              <span style={{ "fontSize": "13px", "lineHeight": "1.3" }}>
                                {lookup(w, "name")}
                              </span>
                              <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800" }}>
                                {lookup(w, "price")}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </Fragment>
                  )}
                </Fragment>
              )}
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isError")) && (
          <Fragment>
            <div style={{ "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <div style={{ "padding": "22px 18px", "borderRadius": "22px", "background": "#111111", "color": "#FFFFFF", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <svg width={"100%"} height={"190"} viewBox={"0 0 460 360"} role={"img"} aria-label={"Linterna apuntando a un 404 iluminado"}>
                  <polygon points={"150,150 460,20 460,300"} fill={lookup(v, "accent")} opacity={"0.22"}></polygon>
                  <polygon points={"150,150 460,80 460,240"} fill={lookup(v, "accent")} opacity={"0.35"}></polygon>
                  <text x={"300"} y={"196"} textAnchor={"middle"} fontFamily={"Archivo, sans-serif"} fontSize={"110"} fontWeight={"900"} fill={"#FFFFFF"}>
                    {"404"}
                  </text>
                  <rect x={"20"} y={"128"} width={"100"} height={"44"} rx={"14"} fill={"#FFFFFF"}></rect>
                  <rect x={"38"} y={"140"} width={"22"} height={"20"} rx={"5"} fill={"#111111"}></rect>
                  <rect x={"72"} y={"140"} width={"10"} height={"20"} rx={"3"} fill={lookup(v, "accent")}></rect>
                  <path d={"M118 120 L150 108 L150 192 L118 180 Z"} fill={"#FFFFFF"}></path>
                  <rect x={"148"} y={"106"} width={"10"} height={"88"} rx={"4"} fill={lookup(v, "accent")}></rect>
                  <circle cx={"70"} cy={"252"} r={"5"} fill={lookup(v, "accent")}></circle>
                  <circle cx={"104"} cy={"282"} r={"3"} fill={"#FFFFFF"} opacity={"0.6"}></circle>
                </svg>
                <span style={{ "alignSelf": "flex-start", "padding": "5px 10px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Error 404"}
                </span>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "30px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "0.95" }}>
                  {"Esta ruta se quedó sin luz"}
                </span>
                <span style={{ "fontSize": "14px", "lineHeight": "1.5", "color": "#E8E8E8" }}>
                  {"La página que buscas no existe o cambió de lugar. Busca tu producto o vuelve al inicio."}
                </span>
              </div>
              <button onClick={lookup(v, "goBusqueda")} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "height": "50px", "padding": "0 16px", "borderRadius": "999px", "border": "2px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "15px", "color": "#6B6B6B", "textAlign": "left" }}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                  <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                  <path d={"M16 16l4 4"}></path>
                </svg>
                {"Buscar focos, camping, solar…"}
              </button>
              <a href={"/tienda"} style={{ "height": "52px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Ir al inicio"}
              </a>
              <a href={"https://wa.me/51954802744"} style={{ "height": "52px", "borderRadius": "999px", "border": "2px solid #111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Escribir por WhatsApp"}
              </a>
            </div>
          </Fragment>
        )}
      </div>
      {Boolean(lookup(v, "showCta")) && (
        <Fragment>
          <div style={{ "position": "absolute", "left": "0", "right": "0", "bottom": "68px", "padding": "12px 16px", "background": "#FFFFFF", "borderTop": "1px solid #DCDCD8", "display": "flex", "gap": "8px", "zIndex": "5" }}>
            {Boolean(lookup(v, "canBack")) && (
              <Fragment>
                <button onClick={lookup(v, "back")} aria-label={"Volver"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "2px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M15 6l-6 6 6 6"}></path>
                  </svg>
                </button>
              </Fragment>
            )}
            <button onClick={lookup(v, "next")} style={{ "flex": "1", "height": "52px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
              {lookup(v, "nextTxt")}
            </button>
          </div>
        </Fragment>
      )}
      <nav aria-label={"Navegación de la tienda"} style={{ "height": "68px", "flex": "none", "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "borderTop": "1px solid #111111", "background": "#FFFFFF", "zIndex": "6" }}>
        <a href={"/tienda"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "4px", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase" }}>
          <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
            <path d={"M3 11l9-7 9 7v9H3zM9 20v-6h6v6"}></path>
          </svg>
          {"Inicio"}
        </a>
        {(lookup(v, "tabs") || []).map((t, index15) => (
          <Fragment key={index15}>
            <button onClick={lookup(t, "pick")} aria-current={lookup(t, "current")} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "4px", "border": "none", "background": "transparent", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase", "color": "#111111" }}>
              <span style={{ "width": "44px", "height": "28px", "borderRadius": "999px", "background": lookup(t, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={lookup(t, "icon")}></path>
                </svg>
              </span>
              {lookup(t, "t")}
            </button>
          </Fragment>
        ))}
      </nav>
      {Boolean(lookup(v, "filterOpen")) && (
        <Fragment>
          <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.45)", "display": "flex", "flexDirection": "column", "justifyContent": "flex-end" }}>
            <div style={{ "background": "#FFFFFF", "borderRadius": "26px 26px 0 0", "padding": "10px 18px 22px", "display": "flex", "flexDirection": "column", "gap": "14px", "maxHeight": "88%", "overflowY": "auto" }} className={"noscroll"}>
              <span style={{ "alignSelf": "center", "width": "44px", "height": "5px", "borderRadius": "999px", "background": "#DCDCD8" }}></span>
              <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between" }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "900", "textTransform": "uppercase" }}>
                  {"Filtros"}
                </span>
                <button onClick={lookup(v, "closeFilters")} aria-label={"Cerrar filtros"} style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                </button>
              </div>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Categoría"}
              </span>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
                {(lookup(v, "cats") || []).map((c, index16) => (
                  <Fragment key={index16}>
                    <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid #111111", "background": lookup(c, "bg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px" }}>
                      {lookup(c, "name")}
                      {" · "}
                      {lookup(c, "count")}
                    </button>
                  </Fragment>
                ))}
              </div>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Precio"}
              </span>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
                {(lookup(v, "prices") || []).map((r, index17) => (
                  <Fragment key={index17}>
                    <button onClick={lookup(r, "pick")} aria-pressed={lookup(r, "pressed")} style={{ "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid #111111", "background": lookup(r, "bg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px" }}>
                      {lookup(r, "t")}
                    </button>
                  </Fragment>
                ))}
              </div>
              {(lookup(v, "toggles") || []).map((t, index18) => (
                <Fragment key={index18}>
                  <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "height": "50px", "padding": "0 4px", "border": "none", "borderBottom": "1px solid #DCDCD8", "background": "transparent", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "15px" }}>
                    <span>
                      {lookup(t, "t")}
                    </span>
                    <span style={{ "width": "48px", "height": "28px", "borderRadius": "999px", "background": lookup(t, "track"), "display": "flex", "alignItems": "center", "justifyContent": lookup(t, "justify"), "padding": "3px", "boxSizing": "border-box" }}>
                      <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                    </span>
                  </button>
                </Fragment>
              ))}
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Ordenar por"}
              </span>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
                {(lookup(v, "sorts") || []).map((s, index19) => (
                  <Fragment key={index19}>
                    <button onClick={lookup(s, "pick")} aria-pressed={lookup(s, "pressed")} style={{ "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid #111111", "background": lookup(s, "bg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px" }}>
                      {lookup(s, "t")}
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ "display": "flex", "gap": "8px", "paddingTop": "4px" }}>
                <button onClick={lookup(v, "resetFilters")} style={{ "flex": "1", "height": "50px", "borderRadius": "999px", "border": "2px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Limpiar"}
                </button>
                <button onClick={lookup(v, "closeFilters")} style={{ "flex": "2", "height": "50px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Ver "}
                  {lookup(v, "listCount")}
                  {" productos"}
                </button>
              </div>
            </div>
          </div>
        </Fragment>
      )}
      {Boolean(lookup(v, "menuOpen")) && (
        <Fragment>
          <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.45)", "display": "flex" }}>
            <nav aria-label={"Menú de la tienda"} style={{ "width": "300px", "height": "100%", "background": "#FFFFFF", "padding": "18px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
              <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "paddingBottom": "10px" }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "900", "textTransform": "uppercase" }}>
                  {"Menú"}
                </span>
                <button onClick={lookup(v, "closeMenu")} aria-label={"Cerrar menú"} style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                </button>
              </div>
              {(lookup(v, "menuLinks") || []).map((m, index20) => (
                <Fragment key={index20}>
                  <a href={lookup(m, "href")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "minHeight": "52px", "borderBottom": "1px solid #DCDCD8", "textDecoration": "none", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {lookup(m, "t")}
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M9 6l6 6-6 6"}></path>
                    </svg>
                  </a>
                </Fragment>
              ))}
              <button onClick={lookup(v, "goError")} style={{ "alignSelf": "flex-start", "marginTop": "10px", "height": "36px", "padding": "0", "border": "none", "background": "transparent", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase", "color": "#6B6B6B", "textDecoration": "underline", "textUnderlineOffset": "4px" }}>
                {"Ver página 404 (ejemplo)"}
              </button>
              <span style={{ "flex": "1" }}></span>
              <a href={"https://wa.me/51954802744"} style={{ "height": "50px", "borderRadius": "999px", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"WhatsApp 954 802 744"}
              </a>
            </nav>
          </div>
        </Fragment>
      )}
    </div>
    </Fragment>
  )} />;
}
