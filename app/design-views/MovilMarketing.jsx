"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    const B = 'img/';
    this.state = {
      screen: 'ofertas', menu: false, grp: 'tienda', q: '', toast: '',
      otab: 'ofertas', ofilter: 'Todas', paused: {}, extraOffers: [], creating: false,
      ed: { name: 'Nueva oferta', type: 'Porcentaje', value: 10, cat: 'Focos' }, copied: '',
      sel: 0, dirty: false, newMsg: '',
      slides: [
        { tab: 'Camping', img: B + '621ce65a45113393656af23955c4e044', title: 'Para la noche más larga', cta: 'Comprar camping', on: true, color: '#FFFFFF' },
        { tab: 'Solar', img: B + '1e3cbb6a8497f7e680445500f1240a3b', title: 'Energía que no se corta', cta: 'Comprar solar', on: true, color: '#FFFFFF' },
        { tab: 'Focos', img: B + '0e200ae6333f48d1adeafc046ff925a6', title: 'Luz para cada cuarto', cta: 'Comprar focos', on: true, color: '#FFFFFF' },
        { tab: 'Cables', img: B + '96c00ebc0862099877967a7af4e3ef8e', title: 'Siempre conectado', cta: 'Comprar cables', on: true, color: '#FFFFFF' }
      ],
      msgs: ['Envío a todo el país', 'Entrega programada', 'Pago seguro', 'Atención por WhatsApp', 'Paneles solares y energía portátil', 'Ofertas de temporada'],
      nfilter: 'Todas', read: { n5: true, n7: true, n10: true, n11: true },
      prefs: [[1, 1, 0], [1, 1, 1], [1, 0, 1], [1, 1, 0], [1, 0, 1], [1, 0, 1]],
      closedSes: {}
    };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const go = (s) => () => this.setState({ screen: s, menu: false, toast: '' });
    const money = (n, d) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
    const IC = {
      inicio: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
      pedidos: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0',
      cotiz: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
      clientes: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
      inv: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
      compras: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1',
      reportes: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      tienda: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18',
      qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z',
      ajustes: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
      pos: 'M3 4h18v10H3zM8 20h8M12 14v6M7 9h4',
      devol: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
      prov: 'M3 21V9l9-6 9 6v12M9 21v-6h6v6',
      tras: 'M4 8h13l-3-3M20 16H7l3 3',
      kardex: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      caja: 'M3 7h18v12H3zM3 11h18M7 15h3',
      cobro: 'M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6',
      gasto: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5',
      sunat: 'M7 3h10v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5zM10 8h4M10 12h4',
      oferta: 'M3 12l9-9h9v9l-9 9zM16 8h.01',
      banner: 'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6',
      bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4',
      users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1',
      mas: 'M5 12h.01M12 12h.01M19 12h.01',
      ok: 'M5 12l5 5 9-10', no: 'M8 12h8', plus: 'M12 5v14M5 12h14', copy: 'M8 8h12v12H8zM4 16V4h12'
    };
    const ST = {
      Activa: ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'], Programada: ['#E3F1FF', '#0B4A8A', 'M12 7v5l3 2'],
      Pausada: ['#FFF4D6', '#7A4A00', 'M9 6v12M15 6v12'], Vencida: ['#EFEFEC', '#555555', 'M6 6l12 12M18 6L6 18'],
      Activo: ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'], Agotado: ['#FDE4E2', '#8E1C14', 'M12 7v6M12 17h.01']
    };
    const IMG = { lamp: B + 'a58999411e32d7481815ba8cdc175e97', solar: B + '972ceb606bfca75ef6208d8d3966c77d', foco: B + '52dc55c2523393f8f60ab89499fa3ec1', cable: B + '3aba2390d3fbd5f06fdd2cede507b16f', ext: B + '323e29809539c2fb4b229651c8081ee9', otro: B + '56a034356f25e7cd0fe7251db3cbbddc' };

    // ---------- Ofertas ----------
    const OF = [
      { id: 'O1', name: 'Temporada camping −15%', state: 'Activa', from: '01 oct', to: '15 nov', uses: 86, limit: 0, sales: 3180, img: IMG.lamp },
      { id: 'O2', name: 'Focos LED 3x2', state: 'Activa', from: '10 oct', to: '31 oct', uses: 54, limit: 200, sales: 1420, img: IMG.foco },
      { id: 'O3', name: 'Mayorista: −8% desde 12 und', state: 'Activa', from: '01 ene', to: 'sin fin', uses: 37, limit: 0, sales: 1640, img: IMG.ext },
      { id: 'O4', name: 'Envío gratis en Arequipa desde S/ 150', state: 'Programada', from: '01 nov', to: '30 nov', uses: 0, limit: 0, sales: 0, img: IMG.cable },
      { id: 'O5', name: 'Cyber Solar −10%', state: 'Vencida', from: '15 jul', to: '31 jul', uses: 21, limit: 50, sales: 2310, img: IMG.solar }
    ].concat(st.extraOffers);
    const FIL = { Todas: null, Activas: ['Activa', 'Pausada'], Programadas: ['Programada'], Vencidas: ['Vencida'] };
    const offers = OF.map((o) => Object.assign({}, o, { state: o.state === 'Activa' && st.paused[o.id] ? 'Pausada' : o.state }))
      .filter((o) => !FIL[st.ofilter] || FIL[st.ofilter].indexOf(o.state) >= 0)
      .map((o) => {
        const s = ST[o.state];
        const on = o.state === 'Activa';
        return {
          name: o.name, img: o.img, state: o.state, bg: s[0], fg: s[1], icon: s[2],
          dates: o.from + ' – ' + o.to, uses: o.uses + (o.limit ? ' de ' + o.limit : '') + ' usos', sales: money(o.sales),
          canToggle: o.state === 'Activa' || o.state === 'Pausada', onAria: on ? 'true' : 'false',
          toggleLabel: on ? 'Pausar ' + o.name : 'Reactivar ' + o.name,
          swBg: on ? '#E8701F' : '#DCDCD8', swJ: on ? 'flex-end' : 'flex-start',
          toggle: () => this.setState({ paused: Object.assign({}, st.paused, { [o.id]: !st.paused[o.id] }), toast: (on ? 'Pausaste ' : 'Reactivaste ') + '«' + o.name + '».' })
        };
      });
    const CP = [
      ['VIA5', '5% de descuento', 'Compra mínima S/ 50', 'Vence 31 dic 2026', 64, 200, 'Activo'],
      ['BIENVENIDA10', '10% en la primera compra', 'Compra mínima S/ 80', 'Sin vencimiento', 51, 0, 'Activo'],
      ['EMPRESA50', 'S/ 50 de descuento', 'Mínimo S/ 1,000 · lista Empresa', 'Vence 30 nov 2026', 12, 30, 'Activo'],
      ['CAMPING20', 'S/ 20 de descuento', 'Mínimo S/ 150 · Camping', 'Vence 15 nov 2026', 16, 50, 'Activo'],
      ['FERIA2025', '15% de descuento', 'Feria de Arequipa', 'Venció 31 ago 2025', 100, 100, 'Agotado']
    ];
    const coupons = CP.map((c) => {
      const s = ST[c[6]];
      const done = st.copied === c[0];
      const dead = c[6] !== 'Activo';
      return {
        code: c[0], value: c[1], rule: c[2], until: c[3], state: c[6], bg: s[0], fg: s[1], icon: s[2],
        usage: c[4] + (c[5] ? '/' + c[5] : ' usos'), w: (c[5] ? Math.round((c[4] / c[5]) * 100) : 40) + '%', o: dead ? '0.6' : '1',
        btnText: done ? 'Copiado' : 'Copiar', btnIcon: done ? IC.ok : IC.copy, btnBg: done ? '#E4F4E7' : '#111111', btnFg: done ? '#1B5E20' : '#FFFFFF',
        copy: () => this.setState({ copied: c[0] })
      };
    });
    const PK = [
      ['Kit camping', [['Lámpara de camping', 89.9, IMG.lamp], ['Linterna de cabeza', 39.9, IMG.otro], ['Panel solar 20 W', 129, IMG.solar]], 219, 18, 12],
      ['Kit instalación', [['Extensión 5 m', 45, IMG.ext], ['3 focos LED 9 W', 26.7, IMG.foco], ['Cable USB-C 1 m', 19.9, IMG.cable]], 79, 34, 25],
      ['Kit regalo llavero', [['2 llaveros linterna', 30, IMG.otro], ['Gancho multiuso', 8.9, IMG.ext], ['Cable USB-C 1 m', 19.9, IMG.cable]], 49, 52, 40]
    ];
    const packs = PK.map((p) => {
      const sum = p[1].reduce((a, l) => a + l[1], 0);
      return { name: p[0], lines: p[1].map((l) => ({ name: l[0], img: l[2] })), sum: money(sum, 2), price: money(p[2], 2), save: money(sum - p[2], 2) + ' (' + Math.round(((sum - p[2]) / sum) * 100) + '%)', sold: String(p[3]), stock: String(p[4]) };
    });
    // editor
    const ed = st.ed;
    const BASE = { Focos: [IMG.foco, 'Foco LED 9 W luz cálida', 8.9], Cables: [IMG.cable, 'Cable USB-C carga rápida 1 m', 19.9], Extensiones: [IMG.ext, 'Extensión de uso rudo 5 m', 45], Camping: [IMG.lamp, 'Lámpara de camping recargable', 89.9], Solar: [IMG.solar, 'Panel solar monocristalino 100 W', 389] };
    const bp = BASE[ed.cat];
    let price = bp[2], badge = '', note = '', hasOld = true;
    if (ed.type === 'Porcentaje') { price = bp[2] * (1 - ed.value / 100); badge = '−' + ed.value + '%'; note = 'Descuento en toda la categoría ' + ed.cat; }
    else if (ed.type === 'Monto fijo') { price = Math.max(0, bp[2] - ed.value); badge = '−S/ ' + ed.value; note = 'Se descuenta por unidad'; }
    else if (ed.type === '3x2') { price = (bp[2] * 2) / 3; badge = '3x2'; note = 'Lleva 3, paga 2 · precio por unidad'; }
    else { badge = 'Envío gratis'; note = 'Envío gratis en Arequipa'; hasOld = false; }
    const showValue = ed.type === 'Porcentaje' || ed.type === 'Monto fijo';
    const step = (d) => () => {
      const max = ed.type === 'Porcentaje' ? 70 : 200;
      this.setState({ ed: Object.assign({}, ed, { value: Math.min(max, Math.max(5, ed.value + d)) }) });
    };
    const setEd = (o) => this.setState({ ed: Object.assign({}, ed, o) });

    // ---------- Banners ----------
    const slides = st.slides;
    const sel = Math.min(st.sel, slides.length - 1);
    const cur = slides[sel];
    const setSlides = (next, extra) => this.setState(Object.assign({ slides: next, dirty: true }, extra || {}));
    const move = (i, d) => () => {
      const j = i + d;
      if (j < 0 || j >= slides.length) return;
      const next = slides.slice();
      const t = next[i]; next[i] = next[j]; next[j] = t;
      setSlides(next, { sel: st.sel === i ? j : (st.sel === j ? i : st.sel) });
    };
    const editCur = (o) => setSlides(slides.map((s, i) => (i === sel ? Object.assign({}, s, o) : s)));
    const active = slides.filter((s) => s.on);
    const IMGS = [
      ['621ce65a45113393656af23955c4e044', 'Sendero con linterna de noche'], ['1e3cbb6a8497f7e680445500f1240a3b', 'Paneles solares'],
      ['0e200ae6333f48d1adeafc046ff925a6', 'Foco encendido'], ['96c00ebc0862099877967a7af4e3ef8e', 'Cables de colores'],
      ['6bfeade76520c7a9cd478f997069e6ca', 'Carpa iluminada'], ['c475e40bec8fdd711d15f0e45dd911ee', 'Kit solar para casa'],
      ['21203a7db58c579a492fb8673b0da391', 'Focos en la sala'], ['270fef37ab257fc6383d3c904a7f2911', 'Kit de camping']
    ];

    // ---------- Notificaciones ----------
    const T = {
      Pedidos: ['Pedido', '#E3F1FF', '#0B4A8A', 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0'],
      Stock: ['Stock y lotes', '#FFF4D6', '#7A4A00', 'M12 7v6M12 17h.01M10.3 3.9L2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'],
      Pagos: ['Pago', '#E4F4E7', '#1B5E20', 'M3 6h18v12H3zM3 10h18M7 15h4'],
      Cotizaciones: ['Cotización', '#EDE7FF', '#4A2E9A', 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4'],
      Sistema: ['Sistema', '#EFEFEC', '#444444', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2']
    };
    // destino móvil de cada aviso
    const N = [
      ['n1', 'Hoy', 'Pedidos', 'Nuevo pedido #1043', 'María Q. · Tienda web · S/ 548.50 · pago por Yape', '10:42', '/movil/almacen', 'Ver pedido'],
      ['n2', 'Hoy', 'Pagos', 'Constancia de Yape recibida', 'Pedido #1042 · S/ 159.70 · falta confirmar en la cuenta', '10:25', '/movil/almacen', 'Confirmar pago'],
      ['n3', 'Hoy', 'Stock', 'Stock bajo: Foco LED 9 W luz cálida', 'Quedan 18 unidades (mínimo 40) · se vende del lote L-1008', '09:58', '/admin/movil', 'Ver inventario'],
      ['n4', 'Hoy', 'Cotizaciones', 'Cotización COT-0218 por vencer', 'Constructora [Cliente] · vence en 2 días · S/ 14,320.90', '09:30', '/admin/movil', 'Ver cotización'],
      ['n5', 'Hoy', 'Sistema', 'Caja abierta por Beltran C.', 'Apertura con S/ 200.00', '08:30', '/movil/finanzas', 'Ver caja'],
      ['n6', 'Ayer', 'Stock', 'Lote L-1102 en camino', 'Panel solar 100 W · llega el 28 oct · OC-0417', '17:12', '/admin/movil', 'Ver lote'],
      ['n7', 'Ayer', 'Pedidos', 'Pedido #1040 enviado', 'Ferretería Cayma · agencia a Cusco', '15:40', '/admin/movil', 'Ver pedidos'],
      ['n8', 'Ayer', 'Sistema', '3 pedidos pagados sin comprobante', 'Emite las boletas para cerrar el día', '19:05', '/movil/finanzas', 'Emitir comprobantes'],
      ['n9', 'Esta semana', 'Pagos', 'Alquiler vence el 01 nov', 'Pago programado · S/ [MONTO]', 'Lun', '/movil/finanzas', 'Ver gastos'],
      ['n10', 'Esta semana', 'Cotizaciones', 'Cotización COT-0215 aceptada', 'Minera [Cliente] · S/ 8,940.00 · lista para pedido', 'Dom', '/admin/movil', 'Convertir en pedido'],
      ['n11', 'Esta semana', 'Sistema', 'Nuevo inicio de sesión', 'Celular Android · Arequipa', 'Sáb', '#perfil', 'Revisar sesiones']
    ];
    const isUnread = (n) => !st.read[n[0]];
    const unread = N.filter(isUnread).length;
    const CH = [['Todas', null], ['Sin leer', 'unread'], ['Pedidos', 'Pedidos'], ['Stock y lotes', 'Stock'], ['Pagos', 'Pagos'], ['Cotizaciones', 'Cotizaciones'], ['Sistema', 'Sistema']];
    const fil = (CH.find((c) => c[0] === st.nfilter) || CH[0])[1];
    const pass = (n) => !fil || (fil === 'unread' ? isUnread(n) : n[2] === fil);
    const nGroups = ['Hoy', 'Ayer', 'Esta semana'].map((d) => ({
      day: d,
      items: N.filter((n) => n[1] === d && pass(n)).map((n) => {
        const t = T[n[2]];
        const un = isUnread(n);
        return { type: t[0], bg: t[1], fg: t[2], icon: t[3], title: n[3], detail: n[4], time: n[5], href: n[6], action: n[7], unread: un, bgCard: un ? '#FFFFFF' : '#F4F4F2', markRead: () => this.setState({ read: Object.assign({}, st.read, { [n[0]]: true }) }) };
      })
    })).filter((g) => g.items.length > 0);
    const PREF = ['Pedidos nuevos', 'Pagos y constancias', 'Stock bajo y lotes', 'Cotizaciones', 'Comprobantes SUNAT', 'Inicios de sesión'];
    const CHN = ['Panel', 'WhatsApp', 'Correo'];

    // ---------- Pantalla actual ----------
    const META = {
      ofertas: ['Ofertas y cupones', '3 activas · 1 programada', 'Crear oferta', IC.plus],
      banners: ['Banners y portada', st.dirty ? 'Cambios sin publicar' : 'Publicado', 'Agregar diapositiva', IC.plus],
      notificaciones: ['Notificaciones', unread + ' sin leer', 'Marcar todo como leído', IC.ok]
    };
    const m = META[st.screen];

    // ---------- Menú ----------
    const HERE = ['ofertas', 'banners', 'notificaciones'];
    const WHERE = {
      inicio: '/admin/movil', pedidos: '/admin/movil', inventario: '/admin/movil', clientes: '/admin/movil', cotizaciones: '/admin/movil', compras: '/admin/movil', reportes: '/admin/movil', ajustes: '/admin/movil',
      caja: '/movil/finanzas', gastos: '/movil/finanzas', comprobantes: '/movil/finanzas', puntoventa: '/movil/finanzas',
      pedidodetalle: '/movil/almacen', kardex: '/movil/almacen', traslados: '/movil/almacen', devoluciones: '/movil/almacen', productoeditar: '/movil/almacen'
    };
    const I = (label, sub, icon, scr, o) => Object.assign({ label, sub, icon, scr }, o || {});
    const GROUPS = [
      ['fav', 'Favoritos', 'Lo que más usas', [
        I('Punto de venta', 'Vender en el mostrador', IC.pos, 'puntoventa'),
        I('Pedidos', 'Tablero por estado', IC.pedidos, 'pedidos', { badge: '8 por atender' }),
        I('Inventario y lotes', 'Stock por lote', IC.inv, 'inventario', { badge: '6 bajos' }),
        I('Cotizaciones', 'Empresas y mayoristas', IC.cotiz, 'cotizaciones', { badge: '5 nuevas' }),
        I('Caja del día', 'Apertura, arqueo y cierre', IC.caja, 'caja', { badge: 'Abierta', plain: true }),
        I('Panel de inicio', 'Resumen del día', IC.inicio, 'inicio')]],
      ['ventas', 'Ventas', 'Mostrador, pedidos y clientes', [
        I('Punto de venta', 'Vender en el mostrador', IC.pos, 'puntoventa'),
        I('Pedidos', 'Tablero por estado', IC.pedidos, 'pedidos', { badge: '8 por atender' }),
        I('Cotizaciones', 'Empresas y mayoristas', IC.cotiz, 'cotizaciones', { badge: '5 nuevas' }),
        I('Clientes', 'Fichas y cobranzas', IC.clientes, 'clientes', { badge: '414', plain: true }),
        I('Devoluciones', 'Cambios y garantías', IC.devol, 'devoluciones', { badge: '2 abiertas' })]],
      ['almacen', 'Almacén', 'Stock, lotes y compras', [
        I('Inventario y lotes', 'Stock por lote', IC.inv, 'inventario', { badge: '6 bajos' }),
        I('Kardex', 'Historial por producto y lote', IC.kardex, 'kardex'),
        I('Compras', 'Órdenes de compra', IC.compras, 'compras', { badge: '3 en camino', plain: true }),
        I('Proveedores', 'Datos y deudas', IC.prov, 'compras'),
        I('Traslados', 'Entre tienda y almacén', IC.tras, 'traslados')]],
      ['finanzas', 'Finanzas', 'Caja, cobros y gastos', [
        I('Caja del día', 'Apertura, arqueo y cierre', IC.caja, 'caja', { badge: 'Abierta', plain: true }),
        I('Cobranzas', 'Cuentas por cobrar', IC.cobro, 'clientes', { badge: 'S/ 18k', plain: true }),
        I('Gastos', 'Luz, alquiler, sueldos', IC.gasto, 'gastos', { badge: '2 por pagar' }),
        I('Comprobantes SUNAT', 'Boletas y facturas', IC.sunat, 'comprobantes', { badge: '3 por emitir' })]],
      ['tienda', 'Tienda y marketing', 'Canales de venta', [
        I('Tienda web', 'viaprovisiones.com', IC.tienda, '', { href: '/tienda' }),
        I('Enlaces y QR', 'Página del QR y redes', IC.qr, '', { href: '/enlaces' }),
        I('Ofertas y cupones', 'Descuentos y packs', IC.oferta, 'ofertas', { badge: '3 activas', plain: true }),
        I('Banners de la tienda', 'Portada y anuncios', IC.banner, 'banners')]],
      ['analisis', 'Análisis', 'Cómo va el negocio', [
        I('Panel de inicio', 'Resumen del día', IC.inicio, 'inicio'),
        I('Reportes', 'Ventas y márgenes', IC.reportes, 'reportes')]],
      ['cuenta', 'Cuenta', 'Configuración', [
        I('Notificaciones y perfil', 'Avisos y tu cuenta', IC.bell, 'notificaciones', { badge: unread ? unread + ' sin leer' : '' }),
        I('Ajustes', 'Negocio, pagos, envíos', IC.ajustes, 'ajustes'),
        I('Usuarios y roles', 'Quién ve qué', IC.users, 'ajustes')]]
    ];
    const card = (it, groupName) => {
      const here = HERE.indexOf(it.scr) >= 0;
      const on = here && st.screen === it.scr;
      return {
        label: it.label, sub: it.sub, icon: it.icon, group: groupName || '',
        isScreen: here, isLink: !here, href: it.href || WHERE[it.scr] || '#',
        current: on ? 'page' : 'false',
        bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', subFg: on ? '#BDBDBD' : '#8C8C8C',
        iconBg: on ? '#E8701F' : '#FFFFFF', iconFg: on ? '#FFFFFF' : '#111111',
        badge: it.badge || '',
        badgeBg: on ? '#2A2A2A' : (it.plain ? '#FFFFFF' : '#FFF1E6'), badgeFg: on ? '#FFFFFF' : (it.plain ? '#6B6B6B' : '#8A3B0A'),
        pick: here ? go(it.scr) : () => {}
      };
    };
    const norm = (t) => t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const q = norm((st.q || '').trim());
    const seen = {};
    const hits = [];
    if (q) GROUPS.slice(1).forEach((g) => g[3].forEach((it) => {
      if (seen[it.label]) return;
      if (norm(it.label + ' ' + it.sub + ' ' + g[1]).indexOf(q) >= 0) { seen[it.label] = 1; hits.push(card(it, g[1])); }
    }));
    const G = GROUPS.find((g) => g[0] === st.grp) || GROUPS[0];
    const pending = (g) => g[3].filter((it) => it.badge && !it.plain).length;

    return {
      accent: this.props.accent ?? '#FF914C',
      title: m[0], subtitle: m[1], fabLabel: m[2], fabIcon: m[3],
      fabAct: () => {
        if (st.screen === 'ofertas') this.setState({ otab: 'ofertas', creating: true, toast: '' });
        else if (st.screen === 'banners') setSlides(slides.concat([{ tab: 'Nueva', img: B + IMGS[4][0], title: 'Nueva diapositiva', cta: 'Ver más', on: false, color: '#FFFFFF' }]), { sel: slides.length, toast: 'Diapositiva agregada como borrador (apagada).' });
        else this.setState({ read: N.reduce((a, n) => Object.assign(a, { [n[0]]: true }), {}), toast: 'Todos los avisos quedaron como leídos.' });
      },
      toast: st.toast,
      closeToast: () => this.setState({ toast: '' }),
      menuOpen: st.menu,
      openMenu: () => this.setState({ menu: true, q: '' }),
      closeMenu: () => this.setState({ menu: false }),
      isOfertas: st.screen === 'ofertas', isBanners: st.screen === 'banners', isNotif: st.screen === 'notificaciones',

      // ofertas
      giveaway: [['Ofertas', 512], ['Cupones', 241], ['Packs', 59]].map((g) => ({ name: g[0], v: money(g[1]), w: Math.round((g[1] / 512) * 100) + '%' })),
      otabs: [['ofertas', 'Ofertas', OF.length], ['cupones', 'Cupones', CP.length], ['packs', 'Packs', PK.length]].map((t) => {
        const on = st.otab === t[0];
        return { label: t[1], n: String(t[2]), sel: on ? 'true' : 'false', bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ otab: t[0] }) };
      }),
      tabOfertas: st.otab === 'ofertas', tabCupones: st.otab === 'cupones', tabPacks: st.otab === 'packs',
      ofChips: Object.keys(FIL).map((c) => { const on = st.ofilter === c; return { label: c, sel: on ? 'true' : 'false', bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ ofilter: c }) }; }),
      offers, coupons, packs,
      creating: st.creating,
      cancelCreate: () => this.setState({ creating: false }),
      ed: { name: ed.name, showValue, valueText: ed.type === 'Porcentaje' ? ed.value + '%' : 'S/ ' + ed.value },
      edName: (e) => setEd({ name: e && e.target ? e.target.value : ed.name }),
      edMinus: step(-5), edPlus: step(5),
      types: ['Porcentaje', 'Monto fijo', '3x2', 'Envío gratis'].map((t) => { const on = ed.type === t; return { label: t, sel: on ? 'true' : 'false', bg: on ? '#FFF1E6' : '#FFFFFF', border: on ? '#E8701F' : '#E4E4E0', pick: () => setEd({ type: t, value: t === 'Monto fijo' ? 5 : 10 }) }; }),
      edCats: Object.keys(BASE).map((c) => { const on = ed.cat === c; return { label: c, sel: on ? 'true' : 'false', bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', pick: () => setEd({ cat: c }) }; }),
      pv: { img: bp[0], prod: bp[1], price: money(price, 2), old: money(bp[2], 2), hasOld, badge, note },
      saveOffer: () => {
        const name = (ed.name || '').trim() || 'Nueva oferta';
        this.setState({
          extraOffers: st.extraOffers.concat([{ id: 'N' + (st.extraOffers.length + 1), name, state: 'Programada', from: '01 nov', to: '30 nov', uses: 0, limit: 0, sales: 0, img: bp[0] }]),
          creating: false, ofilter: 'Todas', toast: '«' + name + '» quedó programada para noviembre (ejemplo).'
        });
      },

      // banners
      pub: st.dirty ? { bg: '#FFF4D6', fg: '#7A4A00', icon: 'M12 7v6M12 17h.01', text: 'Borrador · cambios sin publicar' } : { bg: '#E4F4E7', fg: '#1B5E20', icon: IC.ok, text: 'Publicado en la tienda' },
      publish: () => this.setState({ dirty: false, toast: 'Cambios publicados en la portada (ejemplo).' }),
      pv2: { img: cur.img, title: cur.title, cta: cur.cta, tab: cur.tab, color: cur.color },
      pvTabs: active.map((s) => { const on = s === cur; return { label: s.tab, bg: on ? '#FF914C' : 'rgba(255,255,255,0.18)', fg: on ? '#111111' : '#FFFFFF' }; }),
      slides: slides.map((s, i) => ({
        n: String(i + 1), tab: s.tab, title: s.title, img: s.img, border: i === sel ? '#111111' : '#FFFFFF', o: s.on ? '1' : '0.6',
        editLabel: 'Editar ' + s.tab, onAria: s.on ? 'true' : 'false', swBg: s.on ? '#E8701F' : '#DCDCD8', swJ: s.on ? 'flex-end' : 'flex-start',
        pick: () => this.setState({ sel: i }), up: move(i, -1), down: move(i, 1),
        toggle: () => setSlides(slides.map((x, k) => (k === i ? Object.assign({}, x, { on: !x.on }) : x)))
      })),
      editTitle: (e) => editCur({ title: e && e.target ? e.target.value : cur.title }),
      editCta: (e) => editCur({ cta: e && e.target ? e.target.value : cur.cta }),
      imgs: IMGS.map((x) => { const src = B + x[0]; const on = cur.img === src; return { src, alt: x[1], sel: on ? 'true' : 'false', ring: on ? '#E8701F' : '#FFFFFF', pick: () => editCur({ img: src }) }; }),
      ticker: st.msgs.join('  ·  '),
      msgs: st.msgs.map((t, i) => ({ text: t, removeLabel: 'Quitar «' + t + '»', remove: () => this.setState({ msgs: st.msgs.filter((_, k) => k !== i), dirty: true }) })),
      newMsg: st.newMsg,
      onNewMsg: (e) => this.setState({ newMsg: e && e.target ? e.target.value : '' }),
      addMsg: () => { const t = (st.newMsg || '').trim(); if (t) this.setState({ msgs: st.msgs.concat([t]), newMsg: '', dirty: true }); },

      // notificaciones
      unreadText: unread ? unread + ' sin leer' : 'Todo leído',
      readAll: () => this.setState({ read: N.reduce((a, n) => Object.assign(a, { [n[0]]: true }), {}) }),
      nChips: CH.map((c) => {
        const on = st.nfilter === c[0];
        const n = c[1] === 'unread' ? unread : (c[1] ? N.filter((x) => x[2] === c[1] && isUnread(x)).length : 0);
        return { label: c[0], sel: on ? 'true' : 'false', n: n ? String(n) : '', bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', nBg: on ? '#E8701F' : '#F4F4F2', nFg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ nfilter: c[0] }) };
      }),
      nGroups, nEmpty: nGroups.length === 0,
      sessions: [['s1', 'Este celular', 'Arequipa · ahora', 'M7 3h10v18H7zM11 18h2', true], ['s2', 'Computadora · Chrome', 'Arequipa · hace 2 h', 'M3 5h18v11H3zM8 20h8M12 16v4'], ['s3', 'Tablet del mostrador', 'Tienda · ayer 18:40', 'M5 3h14v18H5zM11 18h2']]
        .filter((s) => !st.closedSes[s[0]])
        .map((s) => ({ name: s[1], where: s[2], icon: s[3], current: !!s[4], closable: !s[4], close: () => this.setState({ closedSes: Object.assign({}, st.closedSes, { [s[0]]: true }), toast: 'Cerraste la sesión «' + s[1] + '».' }) })),
      prefs: PREF.map((name, r) => ({
        name,
        ch: CHN.map((label, k) => {
          const on = !!st.prefs[r][k];
          return {
            label, icon: on ? IC.ok : IC.no, aria: on ? 'true' : 'false', aria2: name + ' ' + label,
            bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#8C8C8C',
            toggle: () => this.setState({ prefs: st.prefs.map((row, i) => (i === r ? row.map((v, j) => (j === k ? (v ? 0 : 1) : v)) : row)) })
          };
        })
      })),

      // barra inferior
      tabs: [['ofertas', 'Ofertas', IC.oferta], ['banners', 'Banners', IC.banner], ['notificaciones', 'Avisos', IC.bell], ['mas', 'Más', IC.mas]].map((t) => {
        const on = st.screen === t[0];
        return {
          label: t[1], icon: t[2], on, current: on ? 'page' : 'false', flex: on ? '1.8 1 0' : '1 1 0',
          bg: on ? '#E8701F' : 'transparent', fg: on ? '#FFFFFF' : '#BDBDBD',
          badge: t[0] === 'notificaciones' && !on && unread ? String(unread) : '',
          pick: t[0] === 'mas' ? () => this.setState({ menu: true, q: '' }) : go(t[0])
        };
      }),

      // menú
      q: st.q || '',
      hasQ: !!q, noQ: !q,
      onSearch: (e) => this.setState({ q: e && e.target ? e.target.value : '' }),
      clearSearch: () => this.setState({ q: '' }),
      chips: GROUPS.map((g) => {
        const on = g[0] === G[0];
        const n = pending(g);
        return { label: g[1], sel: on ? 'true' : 'false', count: n ? String(n) : '', bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', countBg: on ? '#E8701F' : '#FFFFFF', countFg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ grp: g[0] }) };
      }),
      grpTitle: G[1], grpDesc: G[2],
      cards: q ? hits : G[3].map((it) => card(it)),
      resultLabel: hits.length + (hits.length === 1 ? ' resultado' : ' resultados'),
      noResults: !!q && hits.length === 0,
      quick: [['Vender', IC.plus, '/movil/finanzas', true], ['Nuevo pedido', IC.pedidos, '/admin/movil'], ['Ingresar lote', IC.inv, '/admin/movil'], ['Orden de compra', IC.compras, '/admin/movil']].map((a) => ({
        label: a[0], icon: a[1], href: a[2], bg: a[3] ? '#E8701F' : '#F4F4F2', fg: a[3] ? '#FFFFFF' : '#111111'
      }))
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function MovilMarketing(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:inherit}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "height": "100vh", "height": "100dvh", "margin": "0 auto", "borderRadius": "24px", "overflow": "hidden", "background": "#E9E9E7", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "absolute", "top": "0", "left": "0", "right": "0", "zIndex": "5", "padding": "16px 16px 12px", "display": "flex", "alignItems": "center", "gap": "10px", "background": "#E9E9E7" }}>
        <button onClick={lookup(v, "openMenu")} aria-label={"Abrir menú"} style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
            <path d={"M4 8h16M4 16h10"}></path>
          </svg>
        </button>
        <a href={"/admin/movil"} aria-label={"Ir al inicio del panel"} style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
          <svg width={"26"} height={"26"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
            <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
            <clipPath id={"via-clip-mmkt"}>
              <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
            </clipPath>
            <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
            <path clipPath={"url(#via-clip-mmkt)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
          </svg>
        </a>
        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
          <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
            {lookup(v, "title")}
          </span>
          <span style={{ "fontSize": "13px", "fontWeight": "500", "color": "#8C8C8C" }}>
            {lookup(v, "subtitle")}
          </span>
        </span>
        <span style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "14px", "fontWeight": "800", "flex": "none" }}>
          {"BC"}
        </span>
      </div>
      <div className={"noscroll"} style={{ "position": "absolute", "inset": "0", "overflowY": "auto", "padding": "82px 14px 120px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
        {Boolean(lookup(v, "toast")) && (
          <Fragment>
            <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 14px", "borderRadius": "18px", "background": "#111111", "color": "#FFFFFF", "fontSize": "13px", "fontWeight": "600" }}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FF914C"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M5 12l5 5 9-10"}></path>
              </svg>
              <span style={{ "flex": "1" }}>
                {lookup(v, "toast")}
              </span>
              <button onClick={lookup(v, "closeToast")} aria-label={"Cerrar aviso"} style={{ "width": "28px", "height": "28px", "border": "none", "borderRadius": "50%", "background": "#2A2A2A", "color": "#FFFFFF", "cursor": "pointer" }}>
                {"×"}
              </button>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isOfertas")) && (
          <Fragment>
            <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "13px", "color": "#BDBDBD" }}>
                  {"Descuento otorgado · octubre"}
                </span>
                <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                  {"ejemplo"}
                </span>
              </span>
              <span style={{ "fontSize": "30px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                {"S/ 812"}
              </span>
              {(lookup(v, "giveaway") || []).map((g, index1) => (
                <Fragment key={index1}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "12px" }}>
                    <span style={{ "width": "62px", "color": "#CFCFCF" }}>
                      {lookup(g, "name")}
                    </span>
                    <span style={{ "flex": "1", "height": "6px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                      <span style={{ "display": "block", "width": lookup(g, "w"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                    </span>
                    <span style={{ "width": "50px", "textAlign": "right", "fontWeight": "700" }}>
                      {lookup(g, "v")}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div role={"tablist"} aria-label={"Tipo"} style={{ "display": "flex", "gap": "4px", "padding": "4px", "borderRadius": "999px", "background": "#FFFFFF" }}>
              {(lookup(v, "otabs") || []).map((t, index2) => (
                <Fragment key={index2}>
                  <button role={"tab"} aria-selected={lookup(t, "sel")} onClick={lookup(t, "pick")} style={{ "flex": "1", "height": "40px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                    {lookup(t, "label")}
                    {" "}
                    <span style={{ "opacity": "0.6" }}>
                      {lookup(t, "n")}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            {Boolean(lookup(v, "creating")) && (
              <Fragment>
                <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px", "border": "2px solid #E8701F" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "16px", "fontWeight": "800" }}>
                      {"Nueva oferta"}
                    </span>
                    <button onClick={lookup(v, "cancelCreate")} aria-label={"Cerrar editor"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontSize": "16px" }}>
                      {"×"}
                    </button>
                  </span>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                    {"Nombre"}
                    <input value={(lookup(v, "ed.name") ?? "")} onInput={lookup(v, "edName")} onChange={lookup(v, "edName")} style={{ "height": "44px", "borderRadius": "14px", "border": "1px solid #E4E4E0", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "14px", "color": "#111111" }} />
                  </label>
                  <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                    {"Tipo de descuento"}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "6px" }}>
                    {(lookup(v, "types") || []).map((t, index3) => (
                      <Fragment key={index3}>
                        <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "sel")} style={{ "height": "42px", "borderRadius": "14px", "border": "1px solid " + String(lookup(t, "border") ?? ""), "background": lookup(t, "bg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "color": "#111111", "cursor": "pointer" }}>
                          {lookup(t, "label")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {Boolean(lookup(v, "ed.showValue")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "8px 8px 8px 14px", "borderRadius": "16px", "background": "#F4F4F2" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                          {"Valor"}
                        </span>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <button onClick={lookup(v, "edMinus")} aria-label={"Bajar valor"} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                            {"−"}
                          </button>
                          <span style={{ "minWidth": "62px", "textAlign": "center", "fontSize": "18px", "fontWeight": "800" }}>
                            {lookup(v, "ed.valueText")}
                          </span>
                          <button onClick={lookup(v, "edPlus")} aria-label={"Subir valor"} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                            {"+"}
                          </button>
                        </span>
                      </div>
                    </Fragment>
                  )}
                  <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                    {"Aplica a la categoría"}
                  </span>
                  <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -16px", "padding": "0 16px" }}>
                    {(lookup(v, "edCats") || []).map((c, index4) => (
                      <Fragment key={index4}>
                        <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "sel")} style={{ "flex": "none", "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                          {lookup(c, "label")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                    {"Así se verá en la tienda"}
                  </span>
                  <div style={{ "display": "flex", "gap": "12px", "alignItems": "center", "padding": "10px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                    <span style={{ "position": "relative", "width": "84px", "height": "84px", "borderRadius": "14px", "overflow": "hidden", "background": "#FFFFFF", "flex": "none" }}>
                      <img src={assetSrc(lookup(v, "pv.img"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
                      <span style={{ "position": "absolute", "top": "6px", "left": "6px", "padding": "3px 7px", "borderRadius": "999px", "background": "#FF914C", "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700" }}>
                        {lookup(v, "pv.badge")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "minWidth": "0" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700", "lineHeight": "1.25" }}>
                        {lookup(v, "pv.prod")}
                      </span>
                      <span style={{ "display": "flex", "alignItems": "baseline", "gap": "8px" }}>
                        <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                          {lookup(v, "pv.price")}
                        </span>
                        {Boolean(lookup(v, "pv.hasOld")) && (
                          <Fragment>
                            <span style={{ "fontSize": "12px", "color": "#8C8C8C", "textDecoration": "line-through" }}>
                              {lookup(v, "pv.old")}
                            </span>
                          </Fragment>
                        )}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(v, "pv.note")}
                      </span>
                    </span>
                  </div>
                  <button onClick={lookup(v, "saveOffer")} style={{ "height": "48px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "800", "cursor": "pointer" }}>
                    {"Guardar como programada"}
                  </button>
                </div>
              </Fragment>
            )}
            {Boolean(lookup(v, "tabOfertas")) && (
              <Fragment>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
                  {(lookup(v, "ofChips") || []).map((c, index5) => (
                    <Fragment key={index5}>
                      <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "sel")} style={{ "flex": "none", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                        {lookup(c, "label")}
                      </button>
                    </Fragment>
                  ))}
                </div>
                {(lookup(v, "offers") || []).map((o, index6) => (
                  <Fragment key={index6}>
                    <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "12px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                      <div style={{ "display": "flex", "gap": "12px", "alignItems": "center" }}>
                        <img src={assetSrc(lookup(o, "img"))} alt={""} style={{ "width": "56px", "height": "56px", "borderRadius": "16px", "objectFit": "cover", "flex": "none" }} />
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "700", "lineHeight": "1.25" }}>
                            {lookup(o, "name")}
                          </span>
                          <span style={{ "display": "inline-flex", "alignSelf": "flex-start", "alignItems": "center", "gap": "5px", "height": "24px", "padding": "0 9px", "borderRadius": "999px", "background": lookup(o, "bg"), "color": lookup(o, "fg"), "fontSize": "11px", "fontWeight": "700" }}>
                            <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(o, "icon")}></path>
                            </svg>
                            {lookup(o, "state")}
                          </span>
                        </span>
                        {Boolean(lookup(o, "canToggle")) && (
                          <Fragment>
                            <button role={"switch"} aria-checked={lookup(o, "onAria")} aria-label={lookup(o, "toggleLabel")} onClick={lookup(o, "toggle")} style={{ "width": "48px", "height": "28px", "padding": "3px", "boxSizing": "border-box", "borderRadius": "999px", "border": "none", "background": lookup(o, "swBg"), "display": "flex", "justifyContent": lookup(o, "swJ"), "cursor": "pointer", "flex": "none" }}>
                              <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                            </button>
                          </Fragment>
                        )}
                      </div>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px", "paddingTop": "10px", "borderTop": "1px solid #F0F0EE", "fontSize": "12px" }}>
                        <span style={{ "color": "#6B6B6B" }}>
                          {lookup(o, "dates")}
                        </span>
                        <span style={{ "fontWeight": "700" }}>
                          {lookup(o, "uses")}
                          {" · "}
                          {lookup(o, "sales")}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </Fragment>
            )}
            {Boolean(lookup(v, "tabCupones")) && (
              <Fragment>
                {(lookup(v, "coupons") || []).map((c, index7) => (
                  <Fragment key={index7}>
                    <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "10px", "opacity": lookup(c, "o") }}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "17px", "fontWeight": "700", "letterSpacing": "0.04em" }}>
                            {lookup(c, "code")}
                          </span>
                          <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                            {lookup(c, "value")}
                          </span>
                        </span>
                        <button onClick={lookup(c, "copy")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "btnBg"), "color": lookup(c, "btnFg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                          <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(c, "btnIcon")}></path>
                          </svg>
                          {lookup(c, "btnText")}
                        </button>
                      </div>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(c, "rule")}
                        {" · "}
                        {lookup(c, "until")}
                      </span>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                        <span style={{ "flex": "1", "height": "6px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                          <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                        </span>
                        <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(c, "usage")}
                        </span>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontSize": "10px", "fontWeight": "700" }}>
                          <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(c, "icon")}></path>
                          </svg>
                          {lookup(c, "state")}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </Fragment>
            )}
            {Boolean(lookup(v, "tabPacks")) && (
              <Fragment>
                {(lookup(v, "packs") || []).map((p, index8) => (
                  <Fragment key={index8}>
                    <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                        <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                          {lookup(p, "name")}
                        </span>
                        <span style={{ "height": "24px", "padding": "0 10px", "borderRadius": "999px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "11px", "fontWeight": "700", "display": "flex", "alignItems": "center" }}>
                          {"Ahorra "}
                          {lookup(p, "save")}
                        </span>
                      </span>
                      <div style={{ "display": "flex", "gap": "6px" }}>
                        {(lookup(p, "lines") || []).map((l, index9) => (
                          <Fragment key={index9}>
                            <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                              <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "100%", "height": "64px", "borderRadius": "14px", "objectFit": "cover" }} />
                              <span style={{ "fontSize": "10px", "color": "#6B6B6B", "lineHeight": "1.25" }}>
                                {lookup(l, "name")}
                              </span>
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "paddingTop": "10px", "borderTop": "1px solid #F0F0EE" }}>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                          <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                            {"Por separado "}
                            <span style={{ "textDecoration": "line-through" }}>
                              {lookup(p, "sum")}
                            </span>
                          </span>
                          <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                            {lookup(p, "price")}
                          </span>
                        </span>
                        <span style={{ "textAlign": "right", "fontSize": "11px", "color": "#6B6B6B", "lineHeight": "1.4" }}>
                          {lookup(p, "sold")}
                          {" vendidos"}
                          <br />
                          {"Stock para "}
                          {lookup(p, "stock")}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </Fragment>
            )}
          </Fragment>
        )}
        {Boolean(lookup(v, "isBanners")) && (
          <Fragment>
            <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 14px", "borderRadius": "20px", "background": lookup(v, "pub.bg"), "color": lookup(v, "pub.fg") }}>
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={lookup(v, "pub.icon")}></path>
              </svg>
              <span style={{ "flex": "1", "fontSize": "13px", "fontWeight": "700" }}>
                {lookup(v, "pub.text")}
              </span>
              <button onClick={lookup(v, "publish")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                {"Publicar"}
              </button>
            </div>
            <div style={{ "position": "relative", "height": "230px", "borderRadius": "24px", "overflow": "hidden", "background": "#111111" }}>
              <img src={assetSrc(lookup(v, "pv2.img"))} alt={""} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
              <span style={{ "position": "absolute", "inset": "0", "background": "linear-gradient(180deg, rgba(17,17,17,0.05) 30%, rgba(17,17,17,0.75) 100%)" }}></span>
              <span style={{ "position": "absolute", "left": "16px", "right": "16px", "bottom": "50px", "display": "flex", "flexDirection": "column", "gap": "8px", "color": lookup(v, "pv2.color") }}>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "900", "lineHeight": "0.98", "textTransform": "uppercase" }}>
                  {lookup(v, "pv2.title")}
                </span>
                <span style={{ "alignSelf": "flex-start", "height": "32px", "padding": "0 14px", "borderRadius": "999px", "background": "#FF914C", "color": "#111111", "display": "flex", "alignItems": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {lookup(v, "pv2.cta")}
                </span>
              </span>
              <div style={{ "position": "absolute", "left": "10px", "right": "10px", "bottom": "10px", "display": "flex", "gap": "4px" }}>
                {(lookup(v, "pvTabs") || []).map((t, index10) => (
                  <Fragment key={index10}>
                    <span style={{ "flex": "1", "height": "28px", "borderRadius": "999px", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "10px", "fontWeight": "700" }}>
                      {lookup(t, "label")}
                    </span>
                  </Fragment>
                ))}
              </div>
              <span style={{ "position": "absolute", "top": "10px", "left": "10px", "height": "24px", "padding": "0 10px", "borderRadius": "999px", "background": "rgba(255,255,255,0.9)", "fontSize": "10px", "fontWeight": "700", "display": "flex", "alignItems": "center" }}>
                {"Vista previa · celular"}
              </span>
            </div>
            <span style={{ "fontSize": "15px", "fontWeight": "800", "padding": "4px 2px 0" }}>
              {"Diapositivas de la portada"}
            </span>
            {(lookup(v, "slides") || []).map((s, index11) => (
              <Fragment key={index11}>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "8px", "borderRadius": "22px", "background": "#FFFFFF", "border": "2px solid " + String(lookup(s, "border") ?? ""), "opacity": lookup(s, "o") }}>
                  <button onClick={lookup(s, "pick")} aria-label={lookup(s, "editLabel")} style={{ "flex": "1", "minWidth": "0", "display": "flex", "alignItems": "center", "gap": "10px", "border": "none", "background": "transparent", "padding": "0", "fontFamily": "inherit", "textAlign": "left", "cursor": "pointer" }}>
                    <img src={assetSrc(lookup(s, "img"))} alt={""} style={{ "width": "64px", "height": "48px", "borderRadius": "12px", "objectFit": "cover", "flex": "none" }} />
                    <span style={{ "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                      <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#C2410C" }}>
                        {lookup(s, "n")}
                        {" · "}
                        {lookup(s, "tab")}
                      </span>
                      <span style={{ "fontSize": "13px", "fontWeight": "700", "color": "#111111" }}>
                        {lookup(s, "title")}
                      </span>
                    </span>
                  </button>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <button onClick={lookup(s, "up")} aria-label={"Subir"} style={{ "width": "28px", "height": "24px", "borderRadius": "8px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M6 15l6-6 6 6"}></path>
                      </svg>
                    </button>
                    <button onClick={lookup(s, "down")} aria-label={"Bajar"} style={{ "width": "28px", "height": "24px", "borderRadius": "8px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M6 9l6 6 6-6"}></path>
                      </svg>
                    </button>
                  </span>
                  <button role={"switch"} aria-checked={lookup(s, "onAria")} aria-label={"Mostrar en la portada"} onClick={lookup(s, "toggle")} style={{ "width": "44px", "height": "26px", "padding": "3px", "boxSizing": "border-box", "borderRadius": "999px", "border": "none", "background": lookup(s, "swBg"), "display": "flex", "justifyContent": lookup(s, "swJ"), "cursor": "pointer", "flex": "none" }}>
                    <span style={{ "width": "20px", "height": "20px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                  </button>
                </div>
              </Fragment>
            ))}
            <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                {"Editar «"}
                {lookup(v, "pv2.tab")}
                {"»"}
              </span>
              <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                {"Título"}
                <input value={(lookup(v, "pv2.title") ?? "")} onInput={lookup(v, "editTitle")} onChange={lookup(v, "editTitle")} style={{ "height": "44px", "borderRadius": "14px", "border": "1px solid #E4E4E0", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "14px", "color": "#111111" }} />
              </label>
              <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                {"Texto del botón"}
                <input value={(lookup(v, "pv2.cta") ?? "")} onInput={lookup(v, "editCta")} onChange={lookup(v, "editCta")} style={{ "height": "44px", "borderRadius": "14px", "border": "1px solid #E4E4E0", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "14px", "color": "#111111" }} />
              </label>
              <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                {"Imagen"}
              </span>
              <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
                {(lookup(v, "imgs") || []).map((i, index12) => (
                  <Fragment key={index12}>
                    <button onClick={lookup(i, "pick")} aria-label={lookup(i, "alt")} aria-pressed={lookup(i, "sel")} style={{ "flex": "none", "width": "70px", "height": "52px", "padding": "0", "borderRadius": "12px", "border": "3px solid " + String(lookup(i, "ring") ?? ""), "overflow": "hidden", "cursor": "pointer", "background": "#F4F4F2" }}>
                      <img src={assetSrc(lookup(i, "src"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                {"Barra de anuncios"}
              </span>
              <div style={{ "height": "36px", "borderRadius": "12px", "background": "#111111", "color": "#FFFFFF", "overflow": "hidden", "display": "flex", "alignItems": "center", "padding": "0 12px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase", "whiteSpace": "nowrap" }}>
                {lookup(v, "ticker")}
              </div>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}>
                {(lookup(v, "msgs") || []).map((m, index13) => (
                  <Fragment key={index13}>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "34px", "padding": "0 4px 0 12px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "12px", "fontWeight": "600" }}>
                      {lookup(m, "text")}
                      <button onClick={lookup(m, "remove")} aria-label={lookup(m, "removeLabel")} style={{ "width": "26px", "height": "26px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "13px" }}>
                        {"×"}
                      </button>
                    </span>
                  </Fragment>
                ))}
              </div>
              <div style={{ "display": "flex", "gap": "6px" }}>
                <input value={(lookup(v, "newMsg") ?? "")} onInput={lookup(v, "onNewMsg")} onChange={lookup(v, "onNewMsg")} placeholder={"Nuevo mensaje…"} aria-label={"Nuevo mensaje"} style={{ "flex": "1", "minWidth": "0", "height": "42px", "borderRadius": "999px", "border": "1px solid #E4E4E0", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "13px" }} />
                <button onClick={lookup(v, "addMsg")} style={{ "height": "42px", "padding": "0 16px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                  {"Agregar"}
                </button>
              </div>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isNotif")) && (
          <Fragment>
            <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
              <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.15" }}>
                <span style={{ "fontSize": "26px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                  {"Avisos"}
                </span>
                <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                  {lookup(v, "unreadText")}
                </span>
              </span>
              <button onClick={lookup(v, "readAll")} style={{ "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                {"Marcar todo leído"}
              </button>
            </div>
            <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
              {(lookup(v, "nChips") || []).map((c, index14) => (
                <Fragment key={index14}>
                  <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "sel")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer", "whiteSpace": "nowrap" }}>
                    {lookup(c, "label")}
                    {Boolean(lookup(c, "n")) && (
                      <Fragment>
                        <span style={{ "minWidth": "20px", "height": "20px", "padding": "0 6px", "boxSizing": "border-box", "borderRadius": "999px", "background": lookup(c, "nBg"), "color": lookup(c, "nFg"), "fontSize": "11px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          {lookup(c, "n")}
                        </span>
                      </Fragment>
                    )}
                  </button>
                </Fragment>
              ))}
            </div>
            {Boolean(lookup(v, "nEmpty")) && (
              <Fragment>
                <div role={"status"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "8px", "padding": "30px 16px", "borderRadius": "24px", "background": "#FFFFFF", "textAlign": "center" }}>
                  <span style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": "#E4F4E7", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1B5E20"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                  </span>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Todo al día"}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                    {"No hay avisos en este filtro."}
                  </span>
                </div>
              </Fragment>
            )}
            {(lookup(v, "nGroups") || []).map((g, index15) => (
              <Fragment key={index15}>
                <span style={{ "fontSize": "13px", "fontWeight": "700", "color": "#8C8C8C", "padding": "6px 2px 0" }}>
                  {lookup(g, "day")}
                </span>
                {(lookup(g, "items") || []).map((n, index16) => (
                  <Fragment key={index16}>
                    <div style={{ "display": "flex", "gap": "12px", "padding": "12px", "borderRadius": "22px", "background": lookup(n, "bgCard") }}>
                      <span style={{ "position": "relative", "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(n, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(n, "fg")} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(n, "icon")}></path>
                        </svg>
                        {Boolean(lookup(n, "unread")) && (
                          <Fragment>
                            <span aria-label={"Sin leer"} style={{ "position": "absolute", "top": "-1px", "right": "-1px", "width": "11px", "height": "11px", "borderRadius": "50%", "background": "#E8701F", "border": "2px solid #FFFFFF" }}></span>
                          </Fragment>
                        )}
                      </span>
                      <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px" }}>
                          <span style={{ "fontSize": "11px", "fontWeight": "700", "color": lookup(n, "fg") }}>
                            {lookup(n, "type")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                            {lookup(n, "time")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "14px", "fontWeight": "700", "lineHeight": "1.25" }}>
                          {lookup(n, "title")}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#6B6B6B", "lineHeight": "1.35" }}>
                          {lookup(n, "detail")}
                        </span>
                        <span style={{ "display": "flex", "gap": "6px", "marginTop": "4px", "flexWrap": "wrap" }}>
                          <a href={lookup(n, "href")} style={{ "display": "inline-flex", "alignItems": "center", "height": "32px", "padding": "0 12px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(n, "action")}
                          </a>
                          {Boolean(lookup(n, "unread")) && (
                            <Fragment>
                              <button onClick={lookup(n, "markRead")} style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                                {"Marcar leído"}
                              </button>
                            </Fragment>
                          )}
                        </span>
                      </span>
                    </div>
                  </Fragment>
                ))}
              </Fragment>
            ))}
            <div id={"perfil"} style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px", "marginTop": "6px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "17px", "fontWeight": "800", "flex": "none" }}>
                  {"BC"}
                </span>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "800" }}>
                    {"Beltran Carlos Ccapa"}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                    {"Gerente Comercial · Administrador"}
                  </span>
                </span>
              </div>
              <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "color": "#CFCFCF" }}>
                <span>
                  {"viaprovisionesperu@gmail.com"}
                </span>
                <span>
                  {"+51 954 802 744"}
                </span>
                <span>
                  {"Dean Valdivia 533 - Cercado, Arequipa"}
                </span>
              </span>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "paddingTop": "10px", "borderTop": "1px solid #2A2A2A" }}>
                <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#BDBDBD" }}>
                  {"Sesiones activas"}
                </span>
                {(lookup(v, "sessions") || []).map((s, index17) => (
                  <Fragment key={index17}>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                      <span style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "background": "#2A2A2A", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(s, "icon")}></path>
                        </svg>
                      </span>
                      <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                        <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(s, "name")}
                        </span>
                        <span style={{ "fontSize": "11px", "color": "#9A9A9A" }}>
                          {lookup(s, "where")}
                        </span>
                      </span>
                      {Boolean(lookup(s, "current")) && (
                        <Fragment>
                          <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#FF914C" }}>
                            {"Esta"}
                          </span>
                        </Fragment>
                      )}
                      {Boolean(lookup(s, "closable")) && (
                        <Fragment>
                          <button onClick={lookup(s, "close")} style={{ "height": "30px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": "#2A2A2A", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "11px", "fontWeight": "700", "cursor": "pointer" }}>
                            {"Cerrar"}
                          </button>
                        </Fragment>
                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                  {"Cómo recibir cada aviso"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                  {"Toca para activar o desactivar"}
                </span>
              </span>
              {(lookup(v, "prefs") || []).map((p, index18) => (
                <Fragment key={index18}>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "padding": "10px 0", "borderTop": "1px solid #F0F0EE" }}>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {lookup(p, "name")}
                    </span>
                    <div style={{ "display": "flex", "gap": "6px" }}>
                      {(lookup(p, "ch") || []).map((c, index19) => (
                        <Fragment key={index19}>
                          <button role={"switch"} aria-checked={lookup(c, "aria")} aria-label={lookup(c, "aria2")} onClick={lookup(c, "toggle")} style={{ "flex": "1", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "gap": "5px", "height": "34px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "11px", "fontWeight": "700", "cursor": "pointer" }}>
                            <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(c, "icon")}></path>
                            </svg>
                            {lookup(c, "label")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </Fragment>
        )}
      </div>
      <button onClick={lookup(v, "fabAct")} aria-label={lookup(v, "fabLabel")} style={{ "position": "absolute", "right": "18px", "bottom": "100px", "zIndex": "6", "width": "58px", "height": "58px", "borderRadius": "50%", "border": "none", "background": "#E8701F", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxShadow": "0 10px 24px rgba(232,112,31,0.4)" }}>
        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
          <path d={lookup(v, "fabIcon")}></path>
        </svg>
      </button>
      <nav aria-label={"Navegación de marketing"} style={{ "position": "absolute", "left": "14px", "right": "14px", "bottom": "18px", "zIndex": "6", "height": "66px", "padding": "7px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#111111", "display": "flex", "gap": "4px" }}>
        {(lookup(v, "tabs") || []).map((t, index20) => (
          <Fragment key={index20}>
            <button onClick={lookup(t, "pick")} aria-current={lookup(t, "current")} aria-label={lookup(t, "label")} style={{ "position": "relative", "flex": lookup(t, "flex"), "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
              <svg width={"19"} height={"19"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={lookup(t, "icon")}></path>
              </svg>
              {Boolean(lookup(t, "on")) && (
                <Fragment>
                  <span>
                    {lookup(t, "label")}
                  </span>
                </Fragment>
              )}
              {Boolean(lookup(t, "badge")) && (
                <Fragment>
                  <span style={{ "position": "absolute", "top": "6px", "right": "12px", "minWidth": "18px", "height": "18px", "padding": "0 5px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#FF914C", "color": "#111111", "fontSize": "10px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    {lookup(t, "badge")}
                  </span>
                </Fragment>
              )}
            </button>
          </Fragment>
        ))}
      </nav>
      {Boolean(lookup(v, "menuOpen")) && (
        <Fragment>
          <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.45)", "display": "flex", "flexDirection": "column", "justifyContent": "flex-end" }}>
            <button onClick={lookup(v, "closeMenu")} aria-label={"Cerrar menú"} style={{ "flex": "1", "minHeight": "40px", "border": "none", "background": "transparent", "cursor": "pointer" }}></button>
            <nav aria-label={"Menú del panel"} style={{ "height": "92%", "background": "#FFFFFF", "borderRadius": "30px 30px 0 0", "boxSizing": "border-box", "display": "flex", "flexDirection": "column" }}>
              <div style={{ "padding": "10px 16px 12px", "display": "flex", "flexDirection": "column", "gap": "12px", "flex": "none" }}>
                <span style={{ "alignSelf": "center", "width": "44px", "height": "5px", "borderRadius": "999px", "background": "#DCDCD8" }}></span>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                  <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.15" }}>
                    <span style={{ "fontSize": "24px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                      {"Menú"}
                    </span>
                    <span style={{ "fontSize": "12px", "fontWeight": "500", "color": "#8C8C8C" }}>
                      {"¿A dónde vamos?"}
                    </span>
                  </span>
                  <button onClick={lookup(v, "closeMenu")} aria-label={"Cerrar menú"} style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "border": "none", "background": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M6 6l12 12M18 6L6 18"}></path>
                    </svg>
                  </button>
                </div>
                <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "height": "46px", "padding": "0 6px 0 16px", "borderRadius": "999px", "background": "#F4F4F2", "boxSizing": "border-box" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"} style={{ "flex": "none" }}>
                    <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                    <path d={"M16 16l4 4"}></path>
                  </svg>
                  <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                    {"Buscar en el menú"}
                  </span>
                  <input type={"search"} value={(lookup(v, "q") ?? "")} onInput={lookup(v, "onSearch")} onChange={lookup(v, "onSearch")} placeholder={"Buscar módulo: ofertas, caja, lotes…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "14px", "outline": "none" }} />
                  {Boolean(lookup(v, "hasQ")) && (
                    <Fragment>
                      <button onClick={lookup(v, "clearSearch")} aria-label={"Borrar búsqueda"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M6 6l12 12M18 6L6 18"}></path>
                        </svg>
                      </button>
                    </Fragment>
                  )}
                </label>
                {Boolean(lookup(v, "noQ")) && (
                  <Fragment>
                    <div className={"noscroll"} role={"tablist"} aria-label={"Grupos del menú"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -16px", "padding": "0 16px" }}>
                      {(lookup(v, "chips") || []).map((c, index21) => (
                        <Fragment key={index21}>
                          <button role={"tab"} aria-selected={lookup(c, "sel")} onClick={lookup(c, "pick")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "7px", "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer", "whiteSpace": "nowrap" }}>
                            {lookup(c, "label")}
                            {Boolean(lookup(c, "count")) && (
                              <Fragment>
                                <span style={{ "minWidth": "20px", "height": "20px", "padding": "0 6px", "boxSizing": "border-box", "borderRadius": "999px", "background": lookup(c, "countBg"), "color": lookup(c, "countFg"), "fontSize": "11px", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                  {lookup(c, "count")}
                                </span>
                              </Fragment>
                            )}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                )}
              </div>
              <div className={"noscroll"} style={{ "flex": "1", "minHeight": "0", "overflowY": "auto", "padding": "4px 16px 16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                {Boolean(lookup(v, "noQ")) && (
                  <Fragment>
                    <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25", "padding": "0 2px" }}>
                      <span style={{ "fontSize": "17px", "fontWeight": "700" }}>
                        {lookup(v, "grpTitle")}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                        {lookup(v, "grpDesc")}
                      </span>
                    </span>
                  </Fragment>
                )}
                {Boolean(lookup(v, "hasQ")) && (
                  <Fragment>
                    <span style={{ "fontSize": "13px", "fontWeight": "600", "color": "#8C8C8C", "padding": "0 2px" }}>
                      {lookup(v, "resultLabel")}
                    </span>
                  </Fragment>
                )}
                {Boolean(lookup(v, "noResults")) && (
                  <Fragment>
                    <div role={"status"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "10px", "padding": "34px 16px", "borderRadius": "22px", "background": "#F4F4F2", "textAlign": "center" }}>
                      <span style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                          <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                          <path d={"M16 16l4 4"}></path>
                        </svg>
                      </span>
                      <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                        {"Sin resultados"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Prueba con otra palabra, por ejemplo \"cupón\" o \"lote\"."}
                      </span>
                    </div>
                  </Fragment>
                )}
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                  {(lookup(v, "cards") || []).map((i, index22) => (
                    <Fragment key={index22}>
                      {Boolean(lookup(i, "isScreen")) && (
                        <Fragment>
                          <button onClick={lookup(i, "pick")} aria-current={lookup(i, "current")} style={{ "display": "flex", "flexDirection": "column", "alignItems": "stretch", "gap": "10px", "minHeight": "112px", "padding": "12px", "borderRadius": "22px", "border": "none", "background": lookup(i, "bg"), "color": lookup(i, "fg"), "fontFamily": "inherit", "textAlign": "left", "cursor": "pointer" }}>
                            <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "6px" }}>
                              <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": lookup(i, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                                <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(i, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(i, "icon")}></path>
                                </svg>
                              </span>
                              {Boolean(lookup(i, "badge")) && (
                                <Fragment>
                                  <span style={{ "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(i, "badgeBg"), "color": lookup(i, "badgeFg"), "fontSize": "10px", "fontWeight": "700", "display": "flex", "alignItems": "center", "whiteSpace": "nowrap" }}>
                                    {lookup(i, "badge")}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                {lookup(i, "label")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": lookup(i, "subFg") }}>
                                {lookup(i, "sub")}
                              </span>
                              {Boolean(lookup(i, "group")) && (
                                <Fragment>
                                  <span style={{ "fontSize": "11px", "fontWeight": "600", "color": lookup(i, "subFg"), "marginTop": "2px" }}>
                                    {lookup(i, "group")}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                          </button>
                        </Fragment>
                      )}
                      {Boolean(lookup(i, "isLink")) && (
                        <Fragment>
                          <a href={lookup(i, "href")} style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "minHeight": "112px", "padding": "12px", "borderRadius": "22px", "background": "#F4F4F2", "color": "#111111", "textDecoration": "none", "boxSizing": "border-box" }}>
                            <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "6px" }}>
                              <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                                <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(i, "icon")}></path>
                                </svg>
                              </span>
                              {Boolean(lookup(i, "badge")) && (
                                <Fragment>
                                  <span style={{ "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(i, "badgeBg"), "color": lookup(i, "badgeFg"), "fontSize": "10px", "fontWeight": "700", "display": "flex", "alignItems": "center", "whiteSpace": "nowrap" }}>
                                    {lookup(i, "badge")}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                {lookup(i, "label")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                                {lookup(i, "sub")}
                              </span>
                              {Boolean(lookup(i, "group")) && (
                                <Fragment>
                                  <span style={{ "fontSize": "11px", "fontWeight": "600", "color": "#8C8C8C", "marginTop": "2px" }}>
                                    {lookup(i, "group")}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                          </a>
                        </Fragment>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "flex": "none", "padding": "12px 16px 22px", "borderTop": "1px solid #EFEFEC", "display": "flex", "flexDirection": "column", "gap": "10px", "background": "#FFFFFF" }}>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -16px", "padding": "0 16px" }}>
                  {(lookup(v, "quick") || []).map((a, index23) => (
                    <Fragment key={index23}>
                      <a href={lookup(a, "href")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "7px", "height": "40px", "padding": "0 14px 0 11px", "borderRadius": "999px", "background": lookup(a, "bg"), "color": lookup(a, "fg"), "textDecoration": "none", "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(a, "icon")}></path>
                        </svg>
                        {lookup(a, "label")}
                      </a>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                  <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "13px", "fontWeight": "800", "flex": "none" }}>
                    {"BC"}
                  </span>
                  <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                    <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                      {"Beltran Carlos Ccapa"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Administrador"}
                    </span>
                  </span>
                  <a href={"/admin/login"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "7px", "height": "40px", "padding": "0 14px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"}></path>
                    </svg>
                    {"Cerrar sesión"}
                  </a>
                </div>
              </div>
            </nav>
          </div>
        </Fragment>
      )}
    </div>
    </Fragment>
  )} />;
}
