"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { screen: 'inicio', menu: false, grp: 'fav', q: '', toast: '', ostatus: 'Pagado', moved: {}, open: 'p1', seg: 'Todos', quote: 'COT-0218', period: 0 };
  }
  renderVals() {
    const st = this.state;
    const go = (s) => () => this.setState({ screen: s, menu: false, toast: '' });
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
      mas: 'M5 12h.01M12 12h.01M19 12h.01',
      ok: 'M5 12l5 5 9-10', warn: 'M12 7v6M12 17h.01', x: 'M6 6l12 12M18 6L6 18', clock: 'M12 7v5l3 2', truck: 'M3 7h11v9H3zM14 10h4l3 3v3h-7', box: 'M3 7l9-4 9 4v10l-9 4-9-4z', draft: 'M4 20h4L19 9l-4-4L4 16z', send: 'M4 12l16-8-6 16-2-6z'
    };
    const T = {
      green: ['#E4F4E7', '#1B5E20'], amber: ['#FFF4D6', '#7A4A00'], red: ['#FDE4E2', '#8E1C14'], blue: ['#E3F1FF', '#0B4A8A'], violet: ['#EDE7FF', '#4A2E9A'], orange: ['#FFF1E6', '#8A3B0A'], gray: ['#EFEFEC', '#444444']
    };
    const money = (n, d) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
    const META = {
      inicio: ['Panel', 'Inicio · 26 oct', 'Nuevo pedido'],
      pedidos: ['Pedidos', 'Tablero por estado', 'Nuevo pedido'],
      inventario: ['Inventario y lotes', '724 unidades · 12 lotes', 'Ingresar lote'],
      clientes: ['Clientes', '414 registrados', 'Nuevo cliente'],
      cotizaciones: ['Cotizaciones', '5 por responder', 'Nueva cotización'],
      compras: ['Compras y proveedores', '3 órdenes en camino', 'Nueva orden de compra'],
      reportes: ['Reportes', 'Ventas y márgenes', 'Exportar reporte'],
      ajustes: ['Ajustes', 'Configuración de la tienda', 'Agregar usuario']
    };
    const m = META[st.screen];

    // Pedidos
    const FLOW = ['Por pagar', 'Pagado', 'Preparando', 'Enviado', 'Entregado'];
    const OST = { 'Por pagar': [T.amber, IC.clock], 'Pagado': [T.blue, IC.ok], 'Preparando': [T.orange, IC.box], 'Enviado': [T.violet, IC.truck], 'Entregado': [T.green, IC.ok] };
    const ORD = [
      ['#1042', 'María Q.', 'Web', '10:24', 'Por pagar', 159.7, '3 productos'],
      ['#1041', 'Bodega San Martín', 'WhatsApp', '09:51', 'Pagado', 842, '6 productos · sale de L-1008'],
      ['#1044', 'Minimarket El Sol', 'WhatsApp', '11:02', 'Pagado', 318.5, '4 productos'],
      ['#1040', 'Ferretería Cayma', 'Empresas', 'Ayer', 'Preparando', 3460, '12 productos'],
      ['#1038', 'Constructora [Cliente]', 'Empresas', 'Ayer', 'Enviado', 5120, '8 productos · agencia'],
      ['#1039', 'Luis R.', 'Web', 'Ayer', 'Entregado', 459, '2 productos']
    ].map((o) => ({ id: o[0], client: o[1], channel: o[2], time: o[3], status: st.moved[o[0]] || o[4], total: money(o[5], 2), lines: o[6] }));
    const orders = ORD.filter((o) => o.status === st.ostatus).map((o) => {
      const i = FLOW.indexOf(o.status);
      const s = OST[o.status];
      return { ...o, ini: o.client.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), bg: s[0][0], fg: s[0][1], icon: s[1], canAdvance: i < FLOW.length - 1, next: FLOW[i + 1] || '', advance: () => this.setState({ moved: { ...st.moved, [o.id]: FLOW[i + 1] }, toast: 'Pedido ' + o.id + ' pasó a ' + FLOW[i + 1] + '.' }) };
    });

    // Inventario
    const LS = { 'Se vende primero': [T.orange, IC.clock], 'Activo': [T.green, IC.ok], 'En tránsito': [T.violet, IC.truck], 'Agotado': [T.gray, IC.x] };
    const PROD = [
      ['p1', 'Foco LED 9 W luz cálida', 'Focos', 'Disponible', [['L-0921', '[Proveedor A]', '21 set', 300, 40, 3.9, 'Tienda · A3'], ['L-1008', '[Proveedor A]', '08 oct', 200, 200, 4.1, 'Almacén · B1']]],
      ['p2', 'Panel solar monocristalino 100 W', 'Solar', 'Stock bajo', [['L-0930', '[Proveedor C]', '30 set', 10, 3, 248, 'Almacén · C2'], ['L-1102', '[Proveedor C]', '28 oct', 20, 20, 242, 'En camino']]],
      ['p3', 'Cable USB-C carga rápida 1 m', 'Cables', 'Disponible', [['L-0915', '[Proveedor B]', '15 set', 150, 62, 6.2, 'Tienda · A1'], ['L-0918', '[Proveedor B]', '18 set', 100, 100, 6.0, 'Almacén · B2']]],
      ['p4', 'Gancho multiuso acero x10', 'Ganchos', 'Agotado', [['L-0822', '[Proveedor D]', '22 ago', 80, 0, 2.4, '—']]]
    ];
    const PS = { 'Disponible': [T.green, IC.ok], 'Stock bajo': [T.amber, IC.warn], 'Agotado': [T.red, IC.x] };
    const products = PROD.map((p) => {
      let firstDone = false;
      const lotList = p[4].map((l, i) => {
        let state = 'Activo';
        if (l[6] === 'En camino') state = 'En tránsito';
        else if (l[4] === 0) state = 'Agotado';
        else if (!firstDone) { state = 'Se vende primero'; firstDone = true; }
        const s = LS[state];
        return { n: String(i + 1), code: l[0], sup: l[1], date: l[2], qty: String(l[3]), left: String(l[4]), cost: money(l[5], 2), loc: l[6], w: Math.round((l[4] / l[3]) * 100) + '%', state, bg: s[0][0], fg: s[0][1], icon: s[1], numBg: state === 'Se vende primero' ? '#E8701F' : '#FFFFFF', numFg: state === 'Se vende primero' ? '#FFFFFF' : '#111111' };
      });
      const units = p[4].filter((l) => l[6] !== 'En camino').reduce((a, l) => a + l[4], 0);
      const ps = PS[p[3]];
      const open = st.open === p[0];
      return { name: p[1], cat: p[2], lots: p[4].length + (p[4].length === 1 ? ' lote' : ' lotes'), units: String(units), state: p[3], bg: ps[0][0], fg: ps[0][1], icon: ps[1], open, chev: open ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6', lotList, toggle: () => this.setState({ open: open ? '' : p[0] }) };
    });

    // Clientes
    const CS = { 'Al día': [T.green, IC.ok], 'Por cobrar': [T.amber, IC.clock], 'Pago vencido': [T.red, IC.warn], 'Sin compras 60 d': [T.gray, IC.clock] };
    const CLI = [
      ['Bodega San Martín', 'Minoristas', 'Arequipa', 38, 'Por cobrar', 9840],
      ['Ferretería Cayma', 'Mayoristas', 'Arequipa', 24, 'Al día', 21460],
      ['Constructora [Cliente]', 'Empresas', 'Cusco', 9, 'Pago vencido', 34200],
      ['María Q.', 'Consumidores', 'Arequipa', 6, 'Al día', 812],
      ['Minimarket El Sol', 'Minoristas', 'Puno', 11, 'Sin compras 60 d', 2930]
    ];
    const SEGS = ['Todos', 'Consumidores', 'Minoristas', 'Mayoristas', 'Empresas'];
    const clients = CLI.filter((c) => st.seg === 'Todos' || c[1] === st.seg).map((c) => { const s = CS[c[4]]; return { name: c[0], type: c[1], city: c[2], orders: String(c[3]), state: c[4], total: money(c[5]), bg: s[0][0], fg: s[0][1], icon: s[1], ini: c[0].split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() }; });

    // Cotizaciones
    const QS = { 'Enviada': [T.blue, IC.send], 'En negociación': [T.orange, IC.clock], 'Aceptada': [T.green, IC.ok], 'Borrador': [T.gray, IC.draft] };
    const QUO = [
      ['COT-0218', 'Minera [Cliente]', 'Minería', '9 días', 'En negociación', [[60, 'Linterna de cabeza recargable', 38.9], [40, 'Extensión de uso rudo 10 m', 64.0], [24, 'Reflector LED 100 W', 119.0]]],
      ['COT-0217', '[Cliente]', 'Constructora', '4 días', 'Enviada', [[30, 'Extensión de uso rudo 5 m', 45.0], [100, 'Foco LED 12 W', 7.9]]],
      ['COT-0216', 'Ferretería Cayma', 'Mayorista', '12 días', 'Aceptada', [[200, 'Foco LED 9 W luz cálida', 7.5], [50, 'Cable USB-C 1 m', 11.5]]],
      ['COT-0215', 'Bodega San Martín', 'Minorista', '15 días', 'Borrador', [[24, 'Llavero linterna', 9.9]]]
    ];
    const tot = (lines) => lines.reduce((a, l) => a + l[0] * l[2], 0);
    const quotes = QUO.map((q) => { const s = QS[q[4]]; return { id: q[0], client: q[1], type: q[2], due: q[3], state: q[4], amount: money(tot(q[5])), bg: s[0][0], fg: s[0][1], icon: s[1], border: st.quote === q[0] ? '#111111' : '#FFFFFF', pick: () => this.setState({ quote: q[0] }) }; });
    const qs = QUO.find((q) => q[0] === st.quote) || QUO[0];
    const qt = tot(qs[5]);
    const quote = { id: qs[0], client: qs[1], lines: qs[5].map((l) => ({ q: String(l[0]), name: l[1], t: money(l[0] * l[2], 2) })), igv: money(qt - qt / 1.18, 2), total: money(qt, 2) };

    // Compras
    const POS = { 'En tránsito': [T.violet, IC.truck], 'Enviada': [T.blue, IC.send], 'Recepción parcial': [T.amber, IC.clock], 'Recibida': [T.green, IC.ok] };
    const pos = [
      ['OC-0417', '[Proveedor C]', 'Panel solar 100 W × 20', '28 oct', 0, 20, 'En tránsito', 5710, 'Creará el lote L-1102'],
      ['OC-0416', '[Proveedor A]', 'Focos LED surtidos × 600', '30 oct', 0, 600, 'Enviada', 2480, 'Creará el lote L-1103'],
      ['OC-0415', '[Proveedor B]', 'Cables y cargadores × 300', '24 oct', 180, 300, 'Recepción parcial', 1890, 'Lote L-1009 creado'],
      ['OC-0413', '[Proveedor D]', 'Ganchos y llaveros × 400', '18 oct', 400, 400, 'Recibida', 1060, 'Lote L-1001 creado']
    ].map((p) => { const s = POS[p[6]]; return { id: p[0], sup: p[1], what: p[2], eta: p[3], recv: 'Recibido ' + p[4] + ' de ' + p[5], w: Math.round((p[4] / p[5]) * 100) + '%', state: p[6], total: money(p[7]), lot: p[8], bg: s[0][0], fg: s[0][1], icon: s[1] }; });

    // Reportes
    const PER = [['Este mes', 18450, 0.36, 3920], ['Trimestre', 52650, 0.35, 10840], ['Año', 186940, 0.34, 37120]];
    const pr = PER[st.period];
    const CATS = [['Focos', 0.27], ['Cables', 0.21], ['Camping', 0.19], ['Solar', 0.17], ['Extensiones', 0.10], ['Otros', 0.06]];

    const curTab = ['inicio', 'pedidos', 'inventario'].indexOf(st.screen) >= 0 ? st.screen : 'mas';
    // Menú: grupos con chips y búsqueda; los módulos de otras pantallas móviles van como enlace
    const MX = {
      devol: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
      prov: 'M3 21V9l9-6 9 6v12M9 21v-6h6v6',
      tras: 'M4 8h13l-3-3M20 16H7l3 3',
      caja: 'M3 7h18v12H3zM3 11h18M7 15h3',
      cobro: 'M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6',
      gasto: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5',
      sunat: 'M7 3h10v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5zM10 8h4M10 12h4',
      oferta: 'M3 12l9-9h9v9l-9 9zM16 8h.01',
      banner: 'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6',
      users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1',
      pos: 'M3 4h18v10H3zM8 20h8M12 14v6M7 9h4',
      kardex: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      notif: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4'
    };
    const N = (label, sub, icon, o) => Object.assign({ label, sub, icon }, o || {});
    const GROUPS = [
      ['fav', 'Favoritos', 'Lo que más usas', [
        N('Punto de venta', 'Vender en el mostrador', MX.pos, { href: '/movil/finanzas' }),
        N('Pedidos', 'Tablero por estado', IC.pedidos, { screen: 'pedidos', badge: '8 por atender' }),
        N('Inventario y lotes', 'Stock por lote', IC.inv, { screen: 'inventario', badge: '6 bajos' }),
        N('Cotizaciones', 'Empresas y mayoristas', IC.cotiz, { screen: 'cotizaciones', badge: '5 nuevas' }),
        N('Panel de inicio', 'Resumen del día', IC.inicio, { screen: 'inicio' })]],
      ['ventas', 'Ventas', 'Pedidos, cotizaciones y clientes', [
        N('Punto de venta', 'Vender en el mostrador', MX.pos, { href: '/movil/finanzas' }),
        N('Pedidos', 'Tablero por estado', IC.pedidos, { screen: 'pedidos', badge: '8 por atender' }),
        N('Cotizaciones', 'Empresas y mayoristas', IC.cotiz, { screen: 'cotizaciones', badge: '5 nuevas' }),
        N('Clientes', 'Fichas y cobranzas', IC.clientes, { screen: 'clientes', badge: '414', plain: true }),
        N('Devoluciones', 'Cambios y garantías', MX.devol, { href: '/movil/almacen', badge: '2 abiertas' })]],
      ['almacen', 'Almacén', 'Stock, lotes y compras', [
        N('Inventario y lotes', 'Stock por lote', IC.inv, { screen: 'inventario', badge: '6 bajos' }),
        N('Kardex', 'Historial por lote', MX.kardex, { href: '/movil/almacen' }),
        N('Compras', 'Órdenes de compra', IC.compras, { screen: 'compras', badge: '3 en camino', plain: true }),
        N('Proveedores', 'Datos y deudas', MX.prov, { screen: 'compras', alt: true }),
        N('Traslados', 'Entre tienda y almacén', MX.tras, { href: '/movil/almacen' })]],
      ['finanzas', 'Finanzas', 'Caja, cobros y gastos', [
        N('Caja del día', 'Apertura y cierre', MX.caja, { href: '/movil/finanzas', badge: 'Abierta', plain: true }),
        N('Cobranzas', 'Cuentas por cobrar', MX.cobro, { screen: 'clientes', alt: true }),
        N('Gastos', 'Luz, alquiler, sueldos', MX.gasto, { href: '/movil/finanzas', badge: '2 por pagar' }),
        N('Comprobantes SUNAT', 'Boletas y facturas', MX.sunat, { href: '/movil/finanzas', badge: '3 por emitir' })]],
      ['tienda', 'Tienda y marketing', 'Canales de venta', [
        N('Tienda web', 'viaprovisiones.com', IC.tienda, { href: '/tienda' }),
        N('Enlaces y QR', 'Página del QR', IC.qr, { href: '/enlaces' }),
        N('Ofertas y cupones', 'Descuentos y packs', MX.oferta, { href: '/movil/marketing', badge: '3 activas', plain: true }),
        N('Banners de la tienda', 'Portada y avisos', MX.banner, { href: '/movil/marketing' })]],
      ['analisis', 'Análisis', 'Cómo va el negocio', [
        N('Panel de inicio', 'Resumen del día', IC.inicio, { screen: 'inicio' }),
        N('Reportes', 'Ventas y márgenes', IC.reportes, { screen: 'reportes' })]],
      ['cuenta', 'Cuenta', 'Configuración', [
        N('Notificaciones y perfil', 'Avisos y tu cuenta', MX.notif, { href: '/movil/marketing', badge: '5 sin leer' }),
        N('Ajustes', 'Negocio, pagos, envíos', IC.ajustes, { screen: 'ajustes' }),
        N('Usuarios y roles', '3 usuarios', MX.users, { screen: 'ajustes', alt: true })]]
    ];
    // alt: abre la misma pantalla que otro módulo, sin marcarse como actual
    const card = (it, groupName) => {
      const on = !!it.screen && !it.alt && st.screen === it.screen;
      return {
        label: it.label, sub: it.sub, icon: it.icon, group: groupName || '',
        isScreen: !!it.screen, isLink: !!it.href, isSoon: !!it.soon, href: it.href || '',
        current: on ? 'page' : 'false',
        bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', subFg: on ? '#BDBDBD' : '#8C8C8C',
        iconBg: on ? '#E8701F' : '#FFFFFF', iconFg: on ? '#FFFFFF' : '#111111',
        badge: it.badge || '',
        badgeBg: on ? '#2A2A2A' : (it.plain ? '#FFFFFF' : '#FFF1E6'), badgeFg: on ? '#FFFFFF' : (it.plain ? '#6B6B6B' : '#8A3B0A'),
        pick: it.screen ? go(it.screen) : () => {}
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
      title: m[0], subtitle: m[1], fabLabel: m[2],
      fabAct: () => this.setState({ toast: m[2] + ': se abriría el formulario (ejemplo).' }),
      toast: st.toast,
      closeToast: () => this.setState({ toast: '' }),
      menuOpen: st.menu,
      openMenu: () => this.setState({ menu: true, q: '' }),
      closeMenu: () => this.setState({ menu: false }),
      isInicio: st.screen === 'inicio', isPedidos: st.screen === 'pedidos', isInventario: st.screen === 'inventario', isClientes: st.screen === 'clientes',
      isCotizaciones: st.screen === 'cotizaciones', isCompras: st.screen === 'compras', isReportes: st.screen === 'reportes', isAjustes: st.screen === 'ajustes',
      goInventario: go('inventario'),
      cash: [['Efectivo', 'S/ 980'], ['Yape / Plin', 'S/ 1,120'], ['Transfer.', 'S/ 360']].map((c) => ({ k: c[0], v: c[1] })),
      week: [['Lun', 1720], ['Mar', 1890], ['Mié', 1640], ['Jue', 2010], ['Vie', 2240], ['Sáb', 2460], ['Dom', 2020]].map((w, i) => ({ d: w[0], v: (w[1] / 1000).toFixed(1) + 'k', h: Math.round((w[1] / 2460) * 78) + '%', c: i === 5 ? '#E8701F' : '#F5C3A0' })),
      alerts: [
        ['Panel solar monocristalino 100 W', 'Quedan 3 · llega L-1102 el 28 oct', 'Stock bajo', T.amber, IC.warn],
        ['Gancho multiuso acero x10', 'Sin stock desde el 20 oct', 'Agotado', T.red, IC.x],
        ['Foco LED 9 W luz cálida', 'Lote L-0921 casi vacío: pasa a L-1008', 'Cambio de lote', T.orange, IC.clock]
      ].map((a) => ({ name: a[0], sub: a[1], state: a[2], bg: a[3][0], fg: a[3][1], icon: a[4] })),
      orderChips: FLOW.map((f) => { const on = st.ostatus === f; return { label: f, n: String(ORD.filter((o) => o.status === f).length), bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ ostatus: f }) }; }),
      orders, noOrders: orders.length === 0,
      invStats: [['724', 'unidades'], ['12', 'lotes'], ['6', 'stock bajo']].map((s) => ({ v: s[0], k: s[1] })),
      products,
      segChips: SEGS.map((s) => { const on = st.seg === s; return { label: s, bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ seg: s }) }; }),
      clients,
      quotes, quote,
      sendQuote: () => this.setState({ toast: qs[0] + ' enviada por WhatsApp (ejemplo).' }),
      convertQuote: () => this.setState({ screen: 'pedidos', ostatus: 'Por pagar', toast: qs[0] + ' se convirtió en pedido (ejemplo).' }),
      pos,
      periods: PER.map((p, i) => { const on = st.period === i; return { label: p[0], bg: on ? '#111111' : 'transparent', fg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ period: i }) }; }),
      rep: { label: pr[0].toLowerCase(), sales: money(pr[1]), margin: Math.round(pr[2] * 100) + ' %', profit: money(pr[3]) },
      repCats: CATS.map((c) => ({ name: c[0], v: money(Math.round(pr[1] * c[1])), w: Math.round((c[1] / 0.27) * 100) + '%' })),
      settings: [
        ['Negocio', 'Datos y logo', IC.tienda], ['Usuarios y roles', '3 usuarios', IC.clientes], ['Pagos', 'Yape, Plin…', IC.ok],
        ['Envíos', '3 formas', IC.truck], ['Precios y listas', 'PEPS', IC.box], ['Notificaciones', '5 activas', IC.clock]
      ].map((s) => ({ label: s[0], hint: s[1], icon: s[2], pick: () => this.setState({ toast: s[0] + ': se edita en la versión de escritorio (ejemplo).' }) })),
      tabs: [['inicio', 'Inicio', IC.inicio], ['pedidos', 'Pedidos', IC.pedidos], ['inventario', 'Inventario', IC.inv], ['mas', 'Más', IC.mas]].map((t) => {
        const on = curTab === t[0];
        return { label: t[1], icon: t[2], on, current: on ? 'page' : 'false', flex: on ? '1.8 1 0' : '1 1 0', bg: on ? '#E8701F' : 'transparent', fg: on ? '#FFFFFF' : '#BDBDBD', pick: t[0] === 'mas' ? () => this.setState({ menu: true, q: '' }) : go(t[0]) };
      }),
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
      quick: [['Nuevo pedido', 'M12 5v14M5 12h14', true], ['Cotización', IC.cotiz], ['Ingresar lote', IC.inv], ['Orden de compra', IC.compras]].map((a) => ({
        label: a[0], icon: a[1], bg: a[2] ? '#E8701F' : '#F4F4F2', fg: a[2] ? '#FFFFFF' : '#111111',
        pick: () => this.setState({ menu: false, toast: a[0] + ': se abriría el formulario (ejemplo).' })
      }))
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function AdminMovil(props) {
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
        <span style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
          <svg width={"26"} height={"26"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
            <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
            <clipPath id={"via-clip-movil"}>
              <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
            </clipPath>
            <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
            <path clipPath={"url(#via-clip-movil)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
          </svg>
        </span>
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
        {Boolean(lookup(v, "isInicio")) && (
          <Fragment>
            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "padding": "4px 4px 2px" }}>
              <span style={{ "fontSize": "28px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                {"Hola, Beltran"}
              </span>
              <span style={{ "fontSize": "28px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                {"8 pedidos por atender"}
              </span>
            </span>
            <div style={{ "borderRadius": "28px", "background": "#111111", "color": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Caja de hoy"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                  {"26 oct · ejemplo"}
                </span>
              </span>
              <span style={{ "fontSize": "38px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                <span style={{ "color": "#FF914C" }}>
                  {"S/"}
                </span>
                {" 2,460"}
              </span>
              <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "8px" }}>
                {(lookup(v, "cash") || []).map((c, index1) => (
                  <Fragment key={index1}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px", "borderRadius": "16px", "background": "#1E1E1E" }}>
                      <span style={{ "fontSize": "11px", "color": "#9A9A9A" }}>
                        {lookup(c, "k")}
                      </span>
                      <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                        {lookup(c, "v")}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "12px" }}>
              <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Ventas de octubre"}
                </span>
                <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                  {"S/ 18,450"}
                </span>
                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "fontSize": "12px", "fontWeight": "700", "color": "#1B5E20" }}>
                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M7 17L17 7M9 7h8v8"}></path>
                  </svg>
                  {"+6.7 % vs set"}
                </span>
              </div>
              <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Ticket promedio"}
                </span>
                <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                  {"S/ 146"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                  {"126 pedidos"}
                </span>
              </div>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#F4F4F2", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px", "border": "1px solid #DCDCD8" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Últimos 7 días"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"S/ 13,980"}
                </span>
              </span>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "8px", "height": "110px" }}>
                {(lookup(v, "week") || []).map((w, index2) => (
                  <Fragment key={index2}>
                    <span style={{ "flex": "1", "height": "100%", "display": "flex", "flexDirection": "column", "justifyContent": "flex-end", "alignItems": "center", "gap": "6px" }}>
                      <span style={{ "fontSize": "10px", "fontWeight": "700", "color": "#6B6B6B" }}>
                        {lookup(w, "v")}
                      </span>
                      <span style={{ "width": "100%", "height": lookup(w, "h"), "borderRadius": "10px", "background": lookup(w, "c") }}></span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(w, "d")}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Alertas de stock"}
                </span>
                <button onClick={lookup(v, "goInventario")} style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                  {"Ver inventario"}
                </button>
              </span>
              {(lookup(v, "alerts") || []).map((a, index3) => (
                <Fragment key={index3}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                    <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(a, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(a, "fg")} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={lookup(a, "icon")}></path>
                      </svg>
                    </span>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(a, "name")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(a, "sub")}
                      </span>
                    </span>
                    <span style={{ "fontSize": "11px", "fontWeight": "700", "color": lookup(a, "fg") }}>
                      {lookup(a, "state")}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isPedidos")) && (
          <Fragment>
            <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
              {(lookup(v, "orderChips") || []).map((c, index4) => (
                <Fragment key={index4}>
                  <button onClick={lookup(c, "pick")} style={{ "flex": "none", "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                    {lookup(c, "label")}
                    {" · "}
                    {lookup(c, "n")}
                  </button>
                </Fragment>
              ))}
            </div>
            {(lookup(v, "orders") || []).map((o, index5) => (
              <Fragment key={index5}>
                <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                    <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "13px", "fontWeight": "800", "flex": "none" }}>
                      {lookup(o, "ini")}
                    </span>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                        {lookup(o, "client")}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(o, "id")}
                        {" · "}
                        {lookup(o, "channel")}
                        {" · "}
                        {lookup(o, "time")}
                      </span>
                    </span>
                    <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                      {lookup(o, "total")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(o, "bg"), "color": lookup(o, "fg"), "fontSize": "11px", "fontWeight": "700" }}>
                      <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(o, "icon")}></path>
                      </svg>
                      {lookup(o, "status")}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(o, "lines")}
                    </span>
                  </span>
                  {Boolean(lookup(o, "canAdvance")) && (
                    <Fragment>
                      <button onClick={lookup(o, "advance")} style={{ "height": "44px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                        {"Avanzar a "}
                        {lookup(o, "next")}
                      </button>
                    </Fragment>
                  )}
                </div>
              </Fragment>
            ))}
            {Boolean(lookup(v, "noOrders")) && (
              <Fragment>
                <div style={{ "padding": "24px", "borderRadius": "26px", "background": "#FFFFFF", "textAlign": "center", "fontSize": "13px", "color": "#6B6B6B" }}>
                  {"No hay pedidos en este estado."}
                </div>
              </Fragment>
            )}
          </Fragment>
        )}
        {Boolean(lookup(v, "isInventario")) && (
          <Fragment>
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "8px" }}>
              {(lookup(v, "invStats") || []).map((s, index6) => (
                <Fragment key={index6}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "12px", "borderRadius": "20px", "background": "#FFFFFF" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                      {lookup(s, "v")}
                    </span>
                    <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                      {lookup(s, "k")}
                    </span>
                  </span>
                </Fragment>
              ))}
            </div>
            {(lookup(v, "products") || []).map((p, index7) => (
              <Fragment key={index7}>
                <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <button onClick={lookup(p, "toggle")} aria-expanded={lookup(p, "open")} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "border": "none", "background": "transparent", "padding": "0", "textAlign": "left", "fontFamily": "inherit", "color": "inherit", "cursor": "pointer" }}>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                      <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                        {lookup(p, "name")}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(p, "cat")}
                        {" · "}
                        {lookup(p, "lots")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "4px" }}>
                      <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                        {lookup(p, "units")}
                        {" u"}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(p, "bg"), "color": lookup(p, "fg"), "fontSize": "10px", "fontWeight": "700" }}>
                        <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={lookup(p, "icon")}></path>
                        </svg>
                        {lookup(p, "state")}
                      </span>
                    </span>
                    <span style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={lookup(p, "chev")}></path>
                      </svg>
                    </span>
                  </button>
                  {Boolean(lookup(p, "open")) && (
                    <Fragment>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "paddingTop": "4px", "borderTop": "1px solid #EFEFEC" }}>
                        <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C", "paddingTop": "6px" }}>
                          {"LOTES · SALEN EN ORDEN DE INGRESO (PEPS)"}
                        </span>
                        {(lookup(p, "lotList") || []).map((l, index8) => (
                          <Fragment key={index8}>
                            <div style={{ "display": "flex", "gap": "10px", "alignItems": "center", "padding": "10px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                              <span style={{ "width": "28px", "height": "28px", "borderRadius": "50%", "background": lookup(l, "numBg"), "color": lookup(l, "numFg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "12px", "fontWeight": "800", "flex": "none" }}>
                                {lookup(l, "n")}
                              </span>
                              <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                                <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                                  {lookup(l, "code")}
                                  {" "}
                                  <span style={{ "fontWeight": "500", "color": "#6B6B6B" }}>
                                    {"· "}
                                    {lookup(l, "sup")}
                                    {" · "}
                                    {lookup(l, "date")}
                                  </span>
                                </span>
                                <span style={{ "height": "6px", "borderRadius": "999px", "background": "#DCDCD8" }}>
                                  <span style={{ "display": "block", "width": lookup(l, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                                </span>
                                <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                                  {"Quedan "}
                                  {lookup(l, "left")}
                                  {" de "}
                                  {lookup(l, "qty")}
                                  {" · "}
                                  {lookup(l, "cost")}
                                  {" c/u · "}
                                  {lookup(l, "loc")}
                                </span>
                              </span>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "padding": "4px 8px", "borderRadius": "999px", "background": lookup(l, "bg"), "color": lookup(l, "fg"), "fontSize": "10px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                                <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(l, "icon")}></path>
                                </svg>
                                {lookup(l, "state")}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </Fragment>
                  )}
                </div>
              </Fragment>
            ))}
          </Fragment>
        )}
        {Boolean(lookup(v, "isClientes")) && (
          <Fragment>
            <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
              {(lookup(v, "segChips") || []).map((c, index9) => (
                <Fragment key={index9}>
                  <button onClick={lookup(c, "pick")} style={{ "flex": "none", "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                    {lookup(c, "label")}
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "16px", "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
              <span style={{ "display": "flex", "flexDirection": "column" }}>
                <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                  {"Por cobrar a clientes"}
                </span>
                <span style={{ "fontSize": "24px", "fontWeight": "800" }}>
                  {"S/ 18,420"}
                </span>
              </span>
              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "11px", "fontWeight": "700" }}>
                <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} aria-hidden={"true"}>
                  <path d={"M12 7v6M12 17h.01"}></path>
                </svg>
                {"3 vencidos"}
              </span>
            </div>
            {(lookup(v, "clients") || []).map((c, index10) => (
              <Fragment key={index10}>
                <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "alignItems": "center", "gap": "10px" }}>
                  <span style={{ "width": "42px", "height": "42px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "13px", "fontWeight": "800", "flex": "none" }}>
                    {lookup(c, "ini")}
                  </span>
                  <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                      {lookup(c, "name")}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(c, "type")}
                      {" · "}
                      {lookup(c, "city")}
                      {" · "}
                      {lookup(c, "orders")}
                      {" pedidos"}
                    </span>
                    <span style={{ "display": "inline-flex", "alignSelf": "flex-start", "alignItems": "center", "gap": "4px", "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontSize": "10px", "fontWeight": "700" }}>
                      <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(c, "icon")}></path>
                      </svg>
                      {lookup(c, "state")}
                    </span>
                  </span>
                  <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                    {lookup(c, "total")}
                  </span>
                </div>
              </Fragment>
            ))}
          </Fragment>
        )}
        {Boolean(lookup(v, "isCotizaciones")) && (
          <Fragment>
            {(lookup(v, "quotes") || []).map((q, index11) => (
              <Fragment key={index11}>
                <button onClick={lookup(q, "pick")} style={{ "borderRadius": "24px", "border": "2px solid " + String(lookup(q, "border") ?? ""), "background": "#FFFFFF", "padding": "14px", "display": "flex", "alignItems": "center", "gap": "10px", "fontFamily": "inherit", "color": "inherit", "textAlign": "left", "cursor": "pointer" }}>
                  <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                    <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                      {lookup(q, "id")}
                      {" · "}
                      {lookup(q, "client")}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(q, "type")}
                      {" · vence en "}
                      {lookup(q, "due")}
                    </span>
                    <span style={{ "display": "inline-flex", "alignSelf": "flex-start", "alignItems": "center", "gap": "4px", "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(q, "bg"), "color": lookup(q, "fg"), "fontSize": "10px", "fontWeight": "700" }}>
                      <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(q, "icon")}></path>
                      </svg>
                      {lookup(q, "state")}
                    </span>
                  </span>
                  <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                    {lookup(q, "amount")}
                  </span>
                </button>
              </Fragment>
            ))}
            <div style={{ "borderRadius": "28px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {lookup(v, "quote.id")}
                </span>
                <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                  {"Válida 15 días"}
                </span>
              </span>
              <span style={{ "fontSize": "13px", "color": "#CFCFCF" }}>
                {lookup(v, "quote.client")}
                {" · RUC [RUC]"}
              </span>
              {(lookup(v, "quote.lines") || []).map((l, index12) => (
                <Fragment key={index12}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px", "padding": "8px 0", "borderTop": "1px solid #2A2A2A", "fontSize": "13px" }}>
                    <span style={{ "color": "#E8E8E8" }}>
                      {lookup(l, "q")}
                      {" × "}
                      {lookup(l, "name")}
                    </span>
                    <span style={{ "fontWeight": "700", "whiteSpace": "nowrap" }}>
                      {lookup(l, "t")}
                    </span>
                  </span>
                </Fragment>
              ))}
              <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px", "color": "#9A9A9A" }}>
                <span>
                  {"Incluye IGV 18 %"}
                </span>
                <span>
                  {lookup(v, "quote.igv")}
                </span>
              </span>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "paddingTop": "6px", "borderTop": "1px solid #2A2A2A" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Total"}
                </span>
                <span style={{ "fontSize": "24px", "fontWeight": "800", "color": "#FF914C" }}>
                  {lookup(v, "quote.total")}
                </span>
              </span>
              <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px", "paddingTop": "4px" }}>
                <button onClick={lookup(v, "sendQuote")} style={{ "height": "44px", "borderRadius": "999px", "border": "1px solid #3A3A3A", "background": "transparent", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                  {"Enviar WhatsApp"}
                </button>
                <button onClick={lookup(v, "convertQuote")} style={{ "height": "44px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                  {"Pasar a pedido"}
                </button>
              </div>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isCompras")) && (
          <Fragment>
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "12px" }}>
              <div style={{ "borderRadius": "24px", "background": "#111111", "color": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                  {"Compras del mes"}
                </span>
                <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                  {"S/ 9,860"}
                </span>
              </div>
              <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Por pagar"}
                </span>
                <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                  {"S/ 4,120"}
                </span>
              </div>
            </div>
            {(lookup(v, "pos") || []).map((p, index13) => (
              <Fragment key={index13}>
                <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "gap": "10px" }}>
                    <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                      {lookup(p, "id")}
                      {" · "}
                      {lookup(p, "sup")}
                    </span>
                    <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                      {lookup(p, "total")}
                    </span>
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                    {lookup(p, "what")}
                    {" · llega "}
                    {lookup(p, "eta")}
                  </span>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                    <span style={{ "flex": "1", "height": "6px", "borderRadius": "999px", "background": "#EFEFEC" }}>
                      <span style={{ "display": "block", "width": lookup(p, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                    </span>
                    <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                      {lookup(p, "recv")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "8px" }}>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "24px", "padding": "0 9px", "borderRadius": "999px", "background": lookup(p, "bg"), "color": lookup(p, "fg"), "fontSize": "11px", "fontWeight": "700" }}>
                      <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(p, "icon")}></path>
                      </svg>
                      {lookup(p, "state")}
                    </span>
                    <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                      {lookup(p, "lot")}
                    </span>
                  </span>
                </div>
              </Fragment>
            ))}
          </Fragment>
        )}
        {Boolean(lookup(v, "isReportes")) && (
          <Fragment>
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "6px", "padding": "4px", "borderRadius": "999px", "background": "#FFFFFF" }}>
              {(lookup(v, "periods") || []).map((p, index14) => (
                <Fragment key={index14}>
                  <button onClick={lookup(p, "pick")} style={{ "height": "38px", "borderRadius": "999px", "border": "none", "background": lookup(p, "bg"), "color": lookup(p, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                    {lookup(p, "label")}
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "28px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
              <span style={{ "fontSize": "13px", "color": "#9A9A9A" }}>
                {"Ventas · "}
                {lookup(v, "rep.label")}
                {" · ejemplo"}
              </span>
              <span style={{ "fontSize": "34px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                {lookup(v, "rep.sales")}
              </span>
              <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "padding": "10px", "borderRadius": "16px", "background": "#1E1E1E" }}>
                  <span style={{ "fontSize": "11px", "color": "#9A9A9A" }}>
                    {"Margen bruto"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "800", "color": "#FF914C" }}>
                    {lookup(v, "rep.margin")}
                  </span>
                </span>
                <span style={{ "display": "flex", "flexDirection": "column", "padding": "10px", "borderRadius": "16px", "background": "#1E1E1E" }}>
                  <span style={{ "fontSize": "11px", "color": "#9A9A9A" }}>
                    {"Utilidad estimada"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "800" }}>
                    {lookup(v, "rep.profit")}
                  </span>
                </span>
              </div>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                {"Ventas por categoría"}
              </span>
              {(lookup(v, "repCats") || []).map((c, index15) => (
                <Fragment key={index15}>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "5px" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                      <span style={{ "fontWeight": "600" }}>
                        {lookup(c, "name")}
                      </span>
                      <span style={{ "fontWeight": "800" }}>
                        {lookup(c, "v")}
                      </span>
                    </span>
                    <span style={{ "height": "8px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                      <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isAjustes")) && (
          <Fragment>
            <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "10px", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
              {(lookup(v, "settings") || []).map((s, index16) => (
                <Fragment key={index16}>
                  <button onClick={lookup(s, "pick")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "52px", "padding": "0 8px", "borderRadius": "999px", "border": "none", "background": "transparent", "color": "#111111", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "600", "textAlign": "left", "cursor": "pointer" }}>
                    <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(s, "icon")}></path>
                      </svg>
                    </span>
                    <span style={{ "flex": "1" }}>
                      {lookup(s, "label")}
                    </span>
                    <span style={{ "fontSize": "12px", "fontWeight": "500", "color": "#8C8C8C" }}>
                      {lookup(s, "hint")}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "lineHeight": "1.5" }}>
              <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                {"VIA Provisiones"}
              </span>
              <span style={{ "color": "#CFCFCF" }}>
                {"Dean Valdivia 533 - Cercado, Arequipa"}
              </span>
              <span style={{ "color": "#CFCFCF" }}>
                {"+51 954 802 744 · viaprovisionesperu@gmail.com"}
              </span>
              <span style={{ "color": "#CFCFCF" }}>
                {"RUC [RUC] · Horario [HORARIO]"}
              </span>
            </div>
          </Fragment>
        )}
      </div>
      <button onClick={lookup(v, "fabAct")} aria-label={lookup(v, "fabLabel")} style={{ "position": "absolute", "right": "18px", "bottom": "100px", "zIndex": "6", "width": "58px", "height": "58px", "borderRadius": "50%", "border": "none", "background": "#E8701F", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxShadow": "0 10px 24px rgba(232,112,31,0.4)" }}>
        <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
          <path d={"M12 5v14M5 12h14"}></path>
        </svg>
      </button>
      <nav aria-label={"Navegación principal"} style={{ "position": "absolute", "left": "14px", "right": "14px", "bottom": "18px", "zIndex": "6", "height": "66px", "padding": "7px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#111111", "display": "flex", "gap": "4px" }}>
        {(lookup(v, "tabs") || []).map((t, index17) => (
          <Fragment key={index17}>
            <button onClick={lookup(t, "pick")} aria-current={lookup(t, "current")} style={{ "flex": lookup(t, "flex"), "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
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
                  <input type={"search"} value={(lookup(v, "q") ?? "")} onInput={lookup(v, "onSearch")} onChange={lookup(v, "onSearch")} placeholder={"Buscar módulo: pedidos, lotes, caja…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "14px", "outline": "none" }} />
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
                      {(lookup(v, "chips") || []).map((c, index18) => (
                        <Fragment key={index18}>
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
                        {"Prueba con otra palabra, por ejemplo \"lote\" o \"cliente\"."}
                      </span>
                    </div>
                  </Fragment>
                )}
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                  {(lookup(v, "cards") || []).map((i, index19) => (
                    <Fragment key={index19}>
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
                            <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between" }}>
                              <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(i, "icon")}></path>
                                </svg>
                              </span>
                              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#8C8C8C"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={"M7 17L17 7M9 7h8v8"}></path>
                              </svg>
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
                      {Boolean(lookup(i, "isSoon")) && (
                        <Fragment>
                          <div aria-disabled={"true"} style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "minHeight": "112px", "padding": "12px", "borderRadius": "22px", "border": "1px dashed #DCDCD8", "background": "#FFFFFF", "color": "#9A9A9A", "boxSizing": "border-box" }}>
                            <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between" }}>
                              <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#9A9A9A"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(i, "icon")}></path>
                                </svg>
                              </span>
                              <span style={{ "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": "#F4F4F2", "color": "#6B6B6B", "fontSize": "10px", "fontWeight": "700", "display": "flex", "alignItems": "center" }}>
                                {"Pronto"}
                              </span>
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                {lookup(i, "label")}
                              </span>
                              <span style={{ "fontSize": "12px" }}>
                                {lookup(i, "sub")}
                              </span>
                              {Boolean(lookup(i, "group")) && (
                                <Fragment>
                                  <span style={{ "fontSize": "11px", "fontWeight": "600", "marginTop": "2px" }}>
                                    {lookup(i, "group")}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                          </div>
                        </Fragment>
                      )}
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "flex": "none", "padding": "12px 16px 22px", "borderTop": "1px solid #EFEFEC", "display": "flex", "flexDirection": "column", "gap": "10px", "background": "#FFFFFF", "borderRadius": "0" }}>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -16px", "padding": "0 16px" }}>
                  {(lookup(v, "quick") || []).map((a, index20) => (
                    <Fragment key={index20}>
                      <button onClick={lookup(a, "pick")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "7px", "height": "40px", "padding": "0 14px 0 11px", "borderRadius": "999px", "border": "none", "background": lookup(a, "bg"), "color": lookup(a, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer", "whiteSpace": "nowrap" }}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(a, "icon")}></path>
                        </svg>
                        {lookup(a, "label")}
                      </button>
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
