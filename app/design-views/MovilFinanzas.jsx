"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'caja', menu: false, grp: 'finanzas', q: '', toast: '',
      movFilter: 'Todos', count: null, closed: false,
      cat: 'Todas', paid: {}, added: [], fConcept: '', fAmount: '', fCat: 'Movilidad y envíos', fErr: '',
      tab: 'Todos', sel: 'F001-00087', emitted: [],
      posQ: '', posCat: 'Todos', lines: { P1: 4, P5: 1 }, order: ['P1', 'P5'], list: 'Público', method: 'Efectivo', recv: 50, docType: 'Boleta', ticket: false, done: null, saleNo: 423
    };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const money = (n) => (n < 0 ? '− ' : '') + 'S/ ' + Math.abs(n).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const go = (s) => () => this.setState({ screen: s, menu: false, ticket: false, toast: '' });
    const IC = {
      caja: 'M3 7h18v12H3zM3 11h18M7 15h3',
      gasto: 'M4 4h16v16H4zM8 9h8M8 13h8M8 17h5',
      sunat: 'M7 3h10v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5zM10 8h4M10 12h4',
      pos: 'M3 4h18v10H3zM8 20h8M12 14v6M7 9h4',
      mas: 'M5 12h.01M12 12h.01M19 12h.01',
      inicio: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
      pedidos: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0',
      cotiz: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
      clientes: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
      devol: 'M3 12a9 9 0 1 0 3-6.7M3 4v5h5',
      inv: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
      kardex: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      compras: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1',
      prov: 'M3 21V9l9-6 9 6v12M9 21v-6h6v6',
      tras: 'M4 8h13l-3-3M20 16H7l3 3',
      cobro: 'M12 3v18M17 7H9.5a2.5 2.5 0 0 0 0 5h5a2.5 2.5 0 0 1 0 5H6',
      tienda: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18',
      qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z',
      oferta: 'M3 12l9-9h9v9l-9 9zM16 8h.01',
      banner: 'M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6',
      reportes: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      notif: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4',
      ajustes: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2',
      users: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1',
      ok: 'M5 12l5 5 9-10', warn: 'M12 7v6M12 17h.01', x: 'M6 6l12 12M18 6L6 18', up: 'M12 19V5M5 12l7-7 7 7', down: 'M12 5v14M5 12l7 7 7-7', clock: 'M12 7v5l3 2'
    };

    // ---------- Caja ----------
    const OPEN = 200;
    const MOV = [
      ['08:30', 'Apertura', 'Monto de apertura', 'Efectivo', 200],
      ['09:12', 'Venta', 'Pedido #1036 · Minimarket Yanahuara', 'Efectivo', 318],
      ['09:51', 'Venta', 'Pedido #1041 · Bodega San Martín', 'Transferencia', 1101.6],
      ['10:24', 'Venta', 'Pedido #1042 · María Q.', 'Yape', 159.7],
      ['11:05', 'Egreso', 'Pago movilidad (delivery)', 'Efectivo', -35],
      ['11:40', 'Venta', 'Mostrador · 6 productos', 'Efectivo', 486.5],
      ['12:15', 'Venta', 'Pedido #1043 · Ana T.', 'Plin', 29.9],
      ['13:30', 'Egreso', 'Compra de bolsas y cinta', 'Efectivo', -42.5],
      ['15:02', 'Venta', 'Pedido #1044 · Luis R.', 'Tarjeta', 1290],
      ['16:20', 'Retiro', 'Depósito al banco [BANCO]', 'Efectivo', -800],
      ['17:45', 'Venta', 'Mostrador · 11 productos', 'Efectivo', 712.3]
    ];
    const MT = { Apertura: ['#F4F4F2', '#111111', IC.caja], Venta: ['#E4F4E7', '#1B5E20', IC.down], Egreso: ['#FDE4E2', '#8E1C14', IC.up], Retiro: ['#FFF4D6', '#7A4A00', IC.up] };
    const cashIn = MOV.filter((m) => m[3] === 'Efectivo' && m[1] === 'Venta').reduce((a, m) => a + m[4], 0);
    const cashOut = MOV.filter((m) => m[3] === 'Efectivo' && (m[1] === 'Egreso' || m[1] === 'Retiro')).reduce((a, m) => a + m[4], 0);
    const expected = Math.round((OPEN + cashIn + cashOut) * 100) / 100;
    const DEN = [['S/ 200', 200, 1], ['S/ 100', 100, 4], ['S/ 50', 50, 3], ['S/ 20', 20, 3], ['S/ 10', 10, 2], ['S/ 5', 5, 1], ['Monedas', 1, 4.3]];
    const cnt = st.count || DEN.map((d) => d[2]);
    const counted = Math.round(DEN.reduce((a, d, i) => a + d[1] * cnt[i], 0) * 100) / 100;
    const diff = Math.round((counted - expected) * 100) / 100;
    const D = diff === 0 ? ['Cuadra', '#1E3A23', '#7CDB8E', IC.ok] : diff > 0 ? ['Sobra ' + money(diff), '#3A2E10', '#FFC857', IC.up] : ['Falta ' + money(-diff), '#3A1512', '#FF8A80', IC.down];
    const setCnt = (i, delta) => () => {
      const c = (this.state.count || DEN.map((d) => d[2])).slice();
      const step = i === DEN.length - 1 ? 0.1 : 1;
      c[i] = Math.max(0, Math.round((c[i] + delta * step) * 10) / 10);
      this.setState({ count: c });
    };
    const METH = ['Efectivo', 'Yape', 'Plin', 'Transferencia', 'Tarjeta'].map((n) => [n, MOV.filter((m) => m[1] === 'Venta' && m[3] === n).reduce((a, m) => a + m[4], 0)]);
    const maxM = Math.max.apply(null, METH.map((m) => m[1]));
    const totalIn = METH.reduce((a, m) => a + m[1], 0);

    // ---------- Gastos ----------
    const CAT = [['Alquiler', 'Fijo', 2800], ['Sueldos', 'Fijo', 2400], ['Movilidad y envíos', 'Variable', 912.4], ['Publicidad', 'Variable', 650], ['Luz y agua', 'Fijo', 386.5], ['Otros', 'Variable', 375], ['Comisiones de pago', 'Variable', 318.4]];
    const REC = { fac: ['Con factura', '#E4F4E7', '#1B5E20', IC.ok], bol: ['Con boleta', '#E3F1FF', '#0B4A8A', IC.ok], sin: ['Sin comprobante', '#FFF4D6', '#7A4A00', IC.warn] };
    const EXP = [
      ['24 oct', 'Envío por agencia a Puno', 'Movilidad y envíos', 'Efectivo', 'bol', 62],
      ['22 oct', 'Volantes impresos para tienda', 'Publicidad', 'Efectivo', 'sin', 200],
      ['20 oct', 'Bolsas y cinta de embalaje', 'Otros', 'Efectivo', 'bol', 125],
      ['18 oct', 'Comisiones Yape y tarjeta', 'Comisiones de pago', 'Débito automático', 'fac', 158.2],
      ['15 oct', 'Sueldos 1.ª quincena', 'Sueldos', 'Transferencia', 'bol', 1200],
      ['14 oct', 'Anuncios en redes', 'Publicidad', 'Tarjeta', 'fac', 450],
      ['10 oct', 'Motorizado · rutas 1 y 2', 'Movilidad y envíos', 'Efectivo', 'sin', 240],
      ['05 oct', 'Luz · SEAL', 'Luz y agua', 'Yape', 'fac', 298.3],
      ['01 oct', 'Alquiler del local', 'Alquiler', 'Transferencia', 'fac', 2800]
    ];
    const addedAmt = st.added.reduce((a, x) => a + x[5], 0);
    const catTotals = CAT.map((c) => c[2] + st.added.filter((x) => x[2] === c[0]).reduce((a, x) => a + x[5], 0));
    const maxCat = Math.max.apply(null, catTotals);
    const spent = 7842.3 + addedAmt;
    const budget = 9500;
    const allExp = st.added.concat(EXP);
    const expList = st.cat === 'Todas' ? allExp : allExp.filter((x) => x[2] === st.cat);
    const DUE = [['d1', '31', 'oct', 'Sueldos 2.ª quincena', 1200], ['d2', '01', 'nov', 'Alquiler del local', 2800], ['d3', '05', 'nov', 'Luz · SEAL', 300], ['d4', '14', 'nov', 'Anuncios en redes', 450]];
    const duePending = DUE.filter((d) => !st.paid[d[0]]).length;

    // ---------- Comprobantes ----------
    const SC = { 'Aceptado': ['#E4F4E7', '#1B5E20', IC.ok], 'Pendiente de envío': ['#FFF4D6', '#7A4A00', IC.clock], 'Observado': ['#EDE7FF', '#4A2E9A', IC.warn], 'Rechazado': ['#FDE4E2', '#8E1C14', IC.x] };
    const KIND = { B: 'Boleta', F: 'Factura', N: 'Nota de crédito' };
    const DOCS = [
      ['F001-00087', 'F', '26 oct', 'Bodega San Martín', 'RUC [RUC]', '#1041', 'Transferencia', [[24, 'Foco LED 9 W luz cálida', 8.9], [10, 'Cable USB-C carga rápida 1 m', 19.9], [6, 'Extensión de uso rudo 5 m', 69.9], [1, 'Gancho multiuso de acero', 10]], 'Aceptado'],
      ['B001-00421', 'B', '26 oct', 'María Q.', 'DNI [DNI]', '#1042', 'Yape', [[1, 'Lámpara de camping recargable', 69.9], [2, 'Llavero linterna LED', 14.9], [4, 'Gancho multiuso de acero', 15]], 'Aceptado'],
      ['F001-00086', 'F', '25 oct', 'Ferretería Cayma', 'RUC [RUC]', '#1040', 'Crédito 30 días', [[100, 'Foco LED 9 W luz cálida', 7.6], [40, 'Extensión de uso rudo 5 m', 67.5]], 'Pendiente de envío'],
      ['B001-00420', 'B', '25 oct', 'Luis R.', 'DNI [DNI]', '#1039', 'Tarjeta', [[1, 'Panel solar monocristalino 100 W', 459]], 'Aceptado'],
      ['F001-00085', 'F', '25 oct', 'Constructora [Cliente]', 'RUC [RUC]', '#1038', 'Transferencia', [[8, 'Panel solar monocristalino 100 W', 420], [40, 'Extensión de uso rudo 5 m', 44]], 'Observado'],
      ['FC01-00004', 'N', '24 oct', 'Bodega San Martín', 'RUC [RUC]', '#1031', 'Devolución', [[-2, 'Extensión de uso rudo 5 m', 43]], 'Aceptado'],
      ['B001-00419', 'B', '24 oct', 'Ana P.', 'DNI [DNI]', '#1035', 'Efectivo', [[1, 'Pulsera de acero inoxidable', 49.9], [2, 'Aretes de plata 925', 20]], 'Rechazado']
    ];
    const PEND = [
      ['#1043', 'Minimarket El Sol', 'RUC [RUC]', 'F', 'hoy 09:12', [[30, 'Foco LED 9 W luz cálida', 8.2], [12, 'Cable USB-C carga rápida 1 m', 18], [3, 'Extensión de uso rudo 5 m', 39.8]]],
      ['#1044', 'Carla V.', 'DNI [DNI]', 'B', 'hoy 10:40', [[1, 'Lámpara de camping recargable', 74.5]]],
      ['#1045', 'Minera [Cliente]', 'RUC [RUC]', 'F', 'ayer 17:05', [[15, 'Panel solar monocristalino 100 W', 430], [20, 'Linterna de cabeza recargable', 70]]]
    ];
    const sum = (lines) => Math.round(lines.reduce((a, l) => a + l[0] * l[2], 0) * 100) / 100;
    let nF = 87; let nB = 421;
    const extra = st.emitted.map((oid) => {
      const p = PEND.find((x) => x[0] === oid);
      const id = p[3] === 'F' ? 'F001-' + String(++nF).padStart(5, '0') : 'B001-' + String(++nB).padStart(5, '0');
      return [id, p[3], '26 oct', p[1], p[2], p[0], 'Pagado', p[5], 'Pendiente de envío'];
    });
    const ALLD = extra.slice().reverse().concat(DOCS);
    const TABS = [['Todos', ''], ['Boletas', 'B'], ['Facturas', 'F'], ['Notas de crédito', 'N']];
    const tk = (TABS.find((t) => t[0] === st.tab) || TABS[0])[1];
    const dList = ALLD.filter((d) => !tk || d[1] === tk);
    const sel = ALLD.find((d) => d[0] === st.sel) || ALLD[0];
    const tot = sum(sel[7]);
    const grav = Math.round((tot / 1.18) * 100) / 100;
    const pendLeft = PEND.filter((p) => st.emitted.indexOf(p[0]) === -1);

    // ---------- Punto de venta ----------
    const PR = [
      ['P1', 'Foco LED 9 W luz cálida', 'Focos', 8.9, 240, 'L-1008', '52dc55c2523393f8f60ab89499fa3ec1', 'FOC-LED9-C'],
      ['P5', 'Cable USB-C carga rápida 1 m', 'Cables', 19.9, 110, 'L-0901', '3aba2390d3fbd5f06fdd2cede507b16f', 'CAB-USBC-1'],
      ['P6', 'Extensión de uso rudo 5 m', 'Extensiones', 45, 9, 'L-0928', '323e29809539c2fb4b229651c8081ee9', 'EXT-RUDO-5'],
      ['P7', 'Mosquetón llavero de aluminio', 'Llaveros', 9.9, 150, 'L-0830', 'eb0c79147accd306bbd7a39d350a8e88', 'LLA-MOSQ-A'],
      ['P9', 'Gancho de pared adhesivo x6', 'Ganchos', 12.9, 36, 'L-0925', '', 'GAN-ADH-6'],
      ['P4', 'Lámpara de camping recargable', 'Camping', 69.9, 5, 'L-0915', 'a58999411e32d7481815ba8cdc175e97', 'CAM-LAMP-R'],
      ['P8', 'Collar dorado de cadena fina', 'Bisutería', 29.9, 0, '', '792438e54fa4b4d81f31171a2cf026f6', 'BIS-COL-DOR'],
      ['P2', 'Panel solar monocristalino 100 W', 'Solar', 349, 7, 'L-0805', '972ceb606bfca75ef6208d8d3966c77d', 'SOL-PAN100'],
      ['P3', 'Estación de energía portátil', 'Solar', 1290, 3, 'L-0910', '56a034356f25e7cd0fe7251db3cbbddc', 'SOL-EST500']
    ];
    const byId = {};
    PR.forEach((p) => { byId[p[0]] = p; });
    const LISTS = [['Público', 0], ['Minorista', 0.05], ['Mayorista', 0.12], ['Empresa', 0.15]];
    const off = (LISTS.find((l) => l[0] === st.list) || LISTS[0])[1];
    const unit = (p) => Math.round(p[3] * (1 - off) * 100) / 100;
    const setQty = (id, n) => () => {
      const p = byId[id];
      const q = Math.max(0, Math.min(n, p[4]));
      const lines = Object.assign({}, this.state.lines);
      let order = this.state.order.slice();
      if (q === 0) { delete lines[id]; order = order.filter((x) => x !== id); } else { lines[id] = q; if (order.indexOf(id) === -1) order.push(id); }
      this.setState({ lines, order });
    };
    const tLines = st.order.filter((id) => st.lines[id]).map((id) => {
      const p = byId[id]; const qty = st.lines[id]; const u = unit(p);
      return { name: p[1], lot: p[5], qty: String(qty), unit: money(u), sub: money(u * qty), minus: setQty(id, qty - 1), plus: setQty(id, qty + 1), minusLabel: 'Quitar uno de ' + p[1], plusLabel: 'Agregar uno de ' + p[1], raw: u * qty, lotRaw: p[5] };
    });
    const total = Math.round(tLines.reduce((a, l) => a + l.raw, 0) * 100) / 100;
    const units = Object.keys(st.lines).reduce((a, k) => a + st.lines[k], 0);
    const pq = st.posQ.trim().toLowerCase();
    const posProducts = PR.filter((p) => (st.posCat === 'Todos' || p[2] === st.posCat) && (!pq || (p[1] + ' ' + p[7]).toLowerCase().indexOf(pq) !== -1)).map((p) => {
      const out = p[4] === 0; const low = !out && p[4] <= 9; const inC = st.lines[p[0]] || 0;
      return {
        name: p[1], price: money(unit(p)), img: p[6] ? B + p[6] : '', noImg: !p[6],
        stock: out ? 'Agotado' : (low ? 'Quedan ' + p[4] : p[4] + ' en stock'), stockFg: out ? '#8E1C14' : (low ? '#7A4A00' : '#1B5E20'), stockIcon: out ? IC.x : (low ? IC.warn : IC.ok),
        inCart: inC ? String(inC) : '', o: out ? '0.5' : '1', aria: 'Agregar ' + p[1],
        add: out ? () => this.setState({ toast: p[1] + ' está agotado.' }) : setQty(p[0], inC + 1)
      };
    });
    const isCash = st.method === 'Efectivo';
    const recv = st.recv === 'exacto' ? total : st.recv;
    const change = Math.round((recv - total) * 100) / 100;
    const short = isCash && change < 0;
    const canCharge = units > 0 && !short;

    // ---------- Menú ----------
    const N = (label, sub, icon, o) => Object.assign({ label, sub, icon }, o || {});
    const A = '/admin/movil'; const AL = '/movil/almacen'; const MK = '/movil/marketing';
    const GROUPS = [
      ['fav', 'Favoritos', 'Lo que más usas', [
        N('Punto de venta', 'Vender en el mostrador', IC.pos, { screen: 'puntoventa' }),
        N('Pedidos', 'Tablero por estado', IC.pedidos, { href: A, badge: '8 por atender' }),
        N('Inventario y lotes', 'Stock por lote', IC.inv, { href: A, badge: '6 bajos' }),
        N('Cotizaciones', 'Empresas y mayoristas', IC.cotiz, { href: A, badge: '5 nuevas' }),
        N('Caja del día', 'Apertura, arqueo y cierre', IC.caja, { screen: 'caja', badge: 'Abierta', plain: true }),
        N('Panel de inicio', 'Resumen del día', IC.inicio, { href: A })]],
      ['ventas', 'Ventas', 'Mostrador, pedidos y clientes', [
        N('Punto de venta', 'Vender en el mostrador', IC.pos, { screen: 'puntoventa' }),
        N('Pedidos', 'Tablero por estado', IC.pedidos, { href: A, badge: '8 por atender' }),
        N('Cotizaciones', 'Empresas y mayoristas', IC.cotiz, { href: A, badge: '5 nuevas' }),
        N('Clientes', 'Fichas y cobranzas', IC.clientes, { href: A, badge: '414', plain: true }),
        N('Devoluciones', 'Cambios y garantías', IC.devol, { href: AL, badge: '2 abiertas' })]],
      ['almacen', 'Almacén', 'Stock, lotes y compras', [
        N('Inventario y lotes', 'Stock por lote', IC.inv, { href: A, badge: '6 bajos' }),
        N('Kardex', 'Historial por producto y lote', IC.kardex, { href: AL }),
        N('Compras', 'Órdenes de compra', IC.compras, { href: A, badge: '3 en camino', plain: true }),
        N('Proveedores', 'Datos y deudas', IC.prov, { href: A }),
        N('Traslados', 'Entre tienda y almacén', IC.tras, { href: AL })]],
      ['finanzas', 'Finanzas', 'Caja, cobros y gastos', [
        N('Caja del día', 'Apertura, arqueo y cierre', IC.caja, { screen: 'caja', badge: 'Abierta', plain: true }),
        N('Cobranzas', 'Cuentas por cobrar', IC.cobro, { href: A, badge: 'S/ 18k', plain: true }),
        N('Gastos', 'Luz, alquiler, sueldos', IC.gasto, { screen: 'gastos', badge: '2 por pagar' }),
        N('Comprobantes SUNAT', 'Boletas y facturas', IC.sunat, { screen: 'comprobantes', badge: '3 por emitir' })]],
      ['tienda', 'Tienda y marketing', 'Canales de venta', [
        N('Tienda web', 'viaprovisiones.com', IC.tienda, { href: '/tienda' }),
        N('Enlaces y QR', 'Página del QR', IC.qr, { href: '/enlaces' }),
        N('Ofertas y cupones', 'Descuentos y packs', IC.oferta, { href: MK, badge: '3 activas', plain: true }),
        N('Banners de la tienda', 'Portada y anuncios', IC.banner, { href: MK })]],
      ['analisis', 'Análisis', 'Cómo va el negocio', [
        N('Panel de inicio', 'Resumen del día', IC.inicio, { href: A }),
        N('Reportes', 'Ventas y márgenes', IC.reportes, { href: A })]],
      ['cuenta', 'Cuenta', 'Configuración', [
        N('Notificaciones y perfil', 'Avisos y tu cuenta', IC.notif, { href: MK, badge: '5 sin leer' }),
        N('Ajustes', 'Negocio, pagos, envíos', IC.ajustes, { href: A }),
        N('Usuarios y roles', 'Quién ve qué', IC.users, { href: A })]]
    ];
    const card = (it, groupName) => {
      const on = !!it.screen && st.screen === it.screen;
      return {
        label: it.label, sub: it.sub, icon: it.icon, group: groupName || '',
        isScreen: !!it.screen, isLink: !!it.href, href: it.href || '',
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
    const pendingN = (g) => g[3].filter((it) => it.badge && !it.plain).length;

    const META = {
      caja: ['Caja del día', st.closed ? 'Caja cerrada · 18:30' : 'Abierta desde 08:30 · Beltran C.', 'Registrar egreso'],
      gastos: ['Gastos', 'Octubre · ' + allExp.length + ' registrados', 'Registrar gasto'],
      comprobantes: ['Comprobantes SUNAT', 'Boletas y facturas electrónicas', 'Emitir comprobante'],
      puntoventa: ['Punto de venta', 'Caja abierta · Beltran C.', '']
    };
    const m = META[st.screen];
    const tabKey = { caja: 'caja', puntoventa: 'puntoventa', gastos: 'gastos' }[st.screen] || 'mas';
    const chip = (on) => ({ bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', pressed: on ? 'true' : 'false' });
    const chipG = (on) => ({ bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', pressed: on ? 'true' : 'false' });
    const isPos = st.screen === 'puntoventa';

    return {
      accent: this.props.accent ?? '#FF914C',
      title: m[0], subtitle: m[1], fabLabel: m[2],
      showFab: !isPos,
      bottomPad: isPos ? '180px' : '120px',
      fabAct: () => {
        if (st.screen === 'gastos') this.setState({ toast: 'Completa el formulario "Registrar gasto" al final de esta pantalla.' });
        else if (st.screen === 'comprobantes') this.setState({ toast: 'Emitir comprobante: elige un pedido pagado en "Pendientes por emitir".' });
        else this.setState({ toast: 'Registrar egreso: se abriría el formulario (ejemplo).' });
      },
      toast: st.toast,
      closeToast: () => this.setState({ toast: '' }),
      isCaja: st.screen === 'caja', isGastos: st.screen === 'gastos', isComp: st.screen === 'comprobantes', isPos,

      // caja
      cajaTotal: money(totalIn).replace('.00', ''),
      cajaState: st.closed ? 'Caja cerrada' : 'Caja abierta',
      cajaStateBg: st.closed ? '#111111' : '#E4F4E7', cajaStateFg: st.closed ? '#FFFFFF' : '#1B5E20', cajaStateIcon: st.closed ? IC.x : IC.ok,
      expected: money(expected), counted: money(counted),
      diffLabel: D[0], diffBg: D[1], diffFg: D[2], diffIcon: D[3],
      methods: METH.map((x) => ({ name: x[0], v: money(x[1]), w: Math.max(3, Math.round((x[1] / maxM) * 100)) + '%' })),
      movChips: ['Todos', 'Venta', 'Egreso', 'Retiro'].map((f) => Object.assign({ label: f === 'Todos' ? 'Todos' : f + 's', pick: () => this.setState({ movFilter: f }) }, chip(st.movFilter === f))),
      movs: MOV.filter((x) => st.movFilter === 'Todos' || x[1] === st.movFilter).map((x) => ({ time: x[0], type: x[1], what: x[2], method: x[3], amt: (x[4] > 0 ? '+ ' : '') + money(x[4]), amtFg: x[4] < 0 ? '#8E1C14' : '#111111', bg: MT[x[1]][0], fg: MT[x[1]][1], icon: MT[x[1]][2] })),
      den: DEN.map((d, i) => ({ label: d[0], n: String(cnt[i]), sub: money(d[1] * cnt[i]), minus: setCnt(i, -1), plus: setCnt(i, 1), minusLabel: 'Quitar ' + d[0], plusLabel: 'Agregar ' + d[0] })),
      toggleClose: () => this.setState({ closed: !st.closed, toast: st.closed ? 'Caja reabierta (ejemplo).' : 'Caja cerrada con ' + D[0].toLowerCase() + ' (ejemplo).' }),
      closeText: st.closed ? 'Reabrir caja' : 'Cerrar caja',
      closeBg: st.closed ? '#F4F4F2' : '#E8701F', closeFg: st.closed ? '#111111' : '#FFFFFF',

      // gastos
      spent: money(spent),
      budgetW: Math.min(100, Math.round((spent / budget) * 100)) + '%',
      budgetPct: Math.round((spent / budget) * 100) + ' %',
      budgetLeft: money(Math.max(0, budget - spent)),
      cats: CAT.map((c, i) => { const on = st.cat === c[0]; return { name: c[0], kind: c[1], v: money(catTotals[i]), w: Math.max(3, Math.round((catTotals[i] / maxCat) * 100)) + '%', bg: on ? '#FFF1E6' : 'transparent', pressed: on ? 'true' : 'false', pick: () => this.setState({ cat: on ? 'Todas' : c[0] }) }; }),
      catFilterLabel: st.cat === 'Todas' ? 'Todas las categorías' : st.cat + ' · toca otra vez para ver todas',
      expenses: expList.map((x) => { const r = REC[x[4]]; return { date: x[0], concept: x[1], cat: x[2], method: x[3], amt: money(x[5]), rec: r[0], recBg: r[1], recFg: r[2], recIcon: r[3] }; }),
      dueCount: duePending + ' por pagar',
      dues: DUE.map((d) => { const p = !!st.paid[d[0]]; return { day: d[1], mon: d[2], name: d[3], amt: money(d[4]), o: p ? '0.55' : '1', btn: p ? 'Pagado' : 'Marcar pagado', btnBg: p ? '#E4F4E7' : '#111111', btnFg: p ? '#1B5E20' : '#FFFFFF', pay: () => this.setState({ paid: Object.assign({}, st.paid, { [d[0]]: !p }) }) }; }),
      fConcept: st.fConcept, fAmount: st.fAmount, fErr: st.fErr,
      setConcept: (e) => this.setState({ fConcept: (e && e.target && e.target.value) || '', fErr: '' }),
      setAmount: (e) => this.setState({ fAmount: (e && e.target && e.target.value) || '', fErr: '' }),
      fCats: CAT.map((c) => Object.assign({ label: c[0], pick: () => this.setState({ fCat: c[0] }) }, chipG(st.fCat === c[0]))),
      saveExpense: () => {
        const amt = parseFloat(String(st.fAmount).replace(',', '.'));
        if (!st.fConcept.trim() || !(amt > 0)) { this.setState({ fErr: 'Escribe el concepto y un monto mayor a cero.' }); return; }
        this.setState({ added: [['Hoy', st.fConcept.trim(), st.fCat, 'Efectivo', 'sin', amt]].concat(st.added), fConcept: '', fAmount: '', fErr: '', toast: 'Gasto guardado y descontado de la caja del día (ejemplo).' });
      },

      // comprobantes
      compCount: String(268 + extra.length),
      compTabs: TABS.map((t) => Object.assign({ label: t[0], pick: () => this.setState({ tab: t[0] }) }, chip(st.tab === t[0]))),
      doc: { id: sel[0], kind: KIND[sel[1]], date: sel[2], client: sel[3], taxId: sel[4], order: sel[5], pay: sel[6], state: sel[8], bg: SC[sel[8]][0], fg: SC[sel[8]][1], icon: SC[sel[8]][2], grav: money(grav), igv: money(Math.round((tot - grav) * 100) / 100), total: money(tot) },
      docLines: sel[7].map((l) => ({ q: String(l[0]), name: l[1], v: money(l[0] * l[2]) })),
      docs: dList.map((d) => { const on = d[0] === sel[0]; return { id: d[0], client: d[3], date: d[2], total: money(sum(d[7])), state: d[8], bg: SC[d[8]][0], fg: SC[d[8]][1], icon: SC[d[8]][2], rowBg: on ? '#111111' : '#F4F4F2', rowFg: on ? '#FFFFFF' : '#111111', subFg: on ? '#BDBDBD' : '#6B6B6B', pressed: on ? 'true' : 'false', pick: () => this.setState({ sel: d[0] }) }; }),
      noDocs: dList.length === 0,
      downloadDoc: () => this.setState({ toast: 'Se descargaría el PDF de ' + sel[0] + ' (diseño de ejemplo).' }),
      sendDoc: () => this.setState({ toast: 'Se enviaría ' + sel[0] + ' al WhatsApp del cliente (ejemplo).' }),
      pend: pendLeft.map((p) => ({ order: p[0], client: p[1], kind: KIND[p[3]], when: p[4], total: money(sum(p[5])), emit: () => this.setState({ emitted: st.emitted.concat([p[0]]), sel: '', tab: 'Todos', toast: KIND[p[3]] + ' emitida para el pedido ' + p[0] + ' (ejemplo).' }) })),
      noPend: pendLeft.length === 0,

      // punto de venta
      posQ: st.posQ,
      onPosSearch: (e) => this.setState({ posQ: (e && e.target && e.target.value) || '' }),
      posCats: ['Todos', 'Focos', 'Cables', 'Extensiones', 'Llaveros', 'Ganchos', 'Camping', 'Bisutería', 'Solar'].map((c) => Object.assign({ label: c, pick: () => this.setState({ posCat: c }) }, chip(st.posCat === c))),
      posProducts, noPosProducts: posProducts.length === 0,
      showCartBar: isPos && units > 0 && !st.ticket,
      cartUnits: units + (units === 1 ? ' producto' : ' productos') + ' · ' + st.list,
      cartTotal: money(total),
      openTicket: () => this.setState({ ticket: true, done: null }),
      closeTicket: () => (st.done ? this.setState({ lines: {}, order: [], done: null, ticket: false, recv: 50, saleNo: st.saleNo + 1 }) : this.setState({ ticket: false })),
      ticketOpen: isPos && st.ticket,
      ticketTitle: st.done ? 'Listo' : 'Ticket de venta',
      saleDone: !!st.done, saleOpen: !st.done,
      saleLine: st.done ? st.done : '',
      priceLists: LISTS.map((l) => Object.assign({ label: l[0] + (l[1] ? ' −' + Math.round(l[1] * 100) + '%' : ''), pick: () => this.setState({ list: l[0] }) }, chipG(st.list === l[0]))),
      ticket: tLines,
      ticketEmpty: tLines.length === 0,
      payMethods: ['Efectivo', 'Yape', 'Plin', 'Tarjeta', 'Transferencia'].map((x) => Object.assign({ label: x, pick: () => this.setState({ method: x }) }, chipG(st.method === x))),
      isCash,
      recvOpts: [[50, 'S/ 50'], [100, 'S/ 100'], [200, 'S/ 200'], ['exacto', 'Exacto']].map((r) => Object.assign({ label: r[1], pick: () => this.setState({ recv: r[0] }) }, chipG(st.recv === r[0]))),
      changeLabel: short ? 'Falta ' + money(-change) : 'Vuelto ' + money(change),
      changeBg: short ? '#FDE4E2' : '#E4F4E7', changeFg: short ? '#8E1C14' : '#1B5E20', changeIcon: short ? IC.warn : IC.ok,
      docTypes: ['Boleta', 'Factura', 'Nota de venta'].map((x) => Object.assign({ label: x, pick: () => this.setState({ docType: x }) }, chipG(st.docType === x))),
      chargeText: units === 0 ? 'Agrega productos' : (short ? 'Falta efectivo' : 'Cobrar ' + money(total)),
      chargeBg: canCharge ? '#E8701F' : '#BDBDBD',
      charge: () => {
        if (!canCharge) return;
        const serie = st.docType === 'Factura' ? 'F001-00089' : (st.docType === 'Boleta' ? 'B001-00' + st.saleNo : 'NV-00' + st.saleNo);
        const lots = tLines.map((l) => l.lotRaw).filter((x) => x).join(', ');
        this.setState({ done: serie + ' · ' + money(total) + ' por ' + st.method.toLowerCase() + (isCash ? ' · vuelto ' + money(change) : '') + ' · stock descontado de ' + lots + ' (ejemplo).' });
      },
      printSale: () => this.setState({ toast: 'Se imprimiría el ticket (ejemplo).' }),
      sendSale: () => this.setState({ toast: 'Se enviaría el comprobante por WhatsApp (ejemplo).' }),
      newSale: () => this.setState({ lines: {}, order: [], done: null, ticket: false, recv: 50, saleNo: st.saleNo + 1, toast: 'Venta registrada. Listo para la siguiente.' }),

      // barra inferior
      tabs: [['caja', 'Caja', IC.caja], ['puntoventa', 'Vender', IC.pos], ['gastos', 'Gastos', IC.gasto], ['mas', 'Más', IC.mas]].map((t) => {
        const on = tabKey === t[0];
        return { label: t[1], icon: t[2], on, current: on ? 'page' : 'false', flex: on ? '1.8 1 0' : '1 1 0', bg: on ? '#E8701F' : 'transparent', fg: on ? '#FFFFFF' : '#BDBDBD', pick: t[0] === 'mas' ? () => this.setState({ menu: true, q: '' }) : go(t[0]) };
      }),

      // menú
      menuOpen: st.menu,
      openMenu: () => this.setState({ menu: true, q: '' }),
      closeMenu: () => this.setState({ menu: false }),
      q: st.q || '',
      hasQ: !!q, noQ: !q,
      onSearch: (e) => this.setState({ q: e && e.target ? e.target.value : '' }),
      clearSearch: () => this.setState({ q: '' }),
      chips: GROUPS.map((g) => {
        const on = g[0] === G[0];
        const n = pendingN(g);
        return { label: g[1], sel: on ? 'true' : 'false', count: n ? String(n) : '', bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', countBg: on ? '#E8701F' : '#FFFFFF', countFg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ grp: g[0] }) };
      }),
      grpTitle: G[1], grpDesc: G[2],
      cards: q ? hits : G[3].map((it) => card(it)),
      resultLabel: hits.length + (hits.length === 1 ? ' resultado' : ' resultados'),
      noResults: !!q && hits.length === 0,
      quick: [['Vender', 'M12 5v14M5 12h14', 'puntoventa', true], ['Registrar gasto', IC.gasto, 'gastos'], ['Emitir comprobante', IC.sunat, 'comprobantes'], ['Cerrar caja', IC.caja, 'caja']].map((a) => ({
        label: a[0], icon: a[1], bg: a[3] ? '#E8701F' : '#F4F4F2', fg: a[3] ? '#FFFFFF' : '#111111',
        pick: go(a[2])
      }))
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function MovilFinanzas(props) {
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
        <DesignLink href={"/admin/movil"} aria-label={"Ir al inicio del panel"} style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
          <svg width={"26"} height={"26"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
            <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
            <clipPath id={"via-clip-movfin"}>
              <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
            </clipPath>
            <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
            <path clipPath={"url(#via-clip-movfin)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
          </svg>
        </DesignLink>
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
      <div className={"noscroll"} style={{ "position": "absolute", "inset": "0", "overflowY": "auto", "padding": "82px 14px " + String(lookup(v, "bottomPad") ?? ""), "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
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
        {Boolean(lookup(v, "isCaja")) && (
          <Fragment>
            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.1", "padding": "4px 4px 2px" }}>
              <span style={{ "fontSize": "30px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                {lookup(v, "cajaTotal")}
              </span>
              <span style={{ "fontSize": "15px", "color": "#9A9A9A" }}>
                {"ingresó hoy · ejemplo"}
              </span>
            </span>
            <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "34px", "padding": "0 14px 0 10px", "borderRadius": "999px", "background": lookup(v, "cajaStateBg"), "color": lookup(v, "cajaStateFg"), "fontSize": "12px", "fontWeight": "700" }}>
              <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={lookup(v, "cajaStateIcon")}></path>
              </svg>
              {lookup(v, "cajaState")}
            </span>
            <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
              <span style={{ "fontSize": "13px", "color": "#BDBDBD" }}>
                {"Efectivo en caja"}
              </span>
              <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                  <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                    {"Esperado"}
                  </span>
                  <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                    {lookup(v, "expected")}
                  </span>
                </span>
                <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                  <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                    {"Contado"}
                  </span>
                  <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                    {lookup(v, "counted")}
                  </span>
                </span>
              </div>
              <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "34px", "padding": "0 14px 0 10px", "borderRadius": "999px", "background": lookup(v, "diffBg"), "color": lookup(v, "diffFg"), "fontSize": "13px", "fontWeight": "700" }}>
                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={lookup(v, "diffIcon")}></path>
                </svg>
                {lookup(v, "diffLabel")}
              </span>
              <span style={{ "fontSize": "12px", "color": "#9A9A9A", "lineHeight": "1.45" }}>
                {"Apertura S/ 200 + ventas en efectivo − egresos y retiros."}
              </span>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                {"Ingresos por medio de pago"}
              </span>
              {(lookup(v, "methods") || []).map((m, index1) => (
                <Fragment key={index1}>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "5px" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                      <span>
                        {lookup(m, "name")}
                      </span>
                      <span style={{ "fontWeight": "800" }}>
                        {lookup(m, "v")}
                      </span>
                    </span>
                    <span style={{ "height": "8px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                      <span style={{ "display": "block", "width": lookup(m, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                {"Movimientos de hoy"}
              </span>
              <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                {(lookup(v, "movChips") || []).map((c, index2) => (
                  <Fragment key={index2}>
                    <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "flex": "none", "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                      {lookup(c, "label")}
                    </button>
                  </Fragment>
                ))}
              </div>
              {(lookup(v, "movs") || []).map((m, index3) => (
                <Fragment key={index3}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                    <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(m, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(m, "fg")} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(m, "icon")}></path>
                      </svg>
                    </span>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(m, "what")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(m, "time")}
                        {" · "}
                        {lookup(m, "type")}
                        {" · "}
                        {lookup(m, "method")}
                      </span>
                    </span>
                    <span style={{ "fontSize": "13px", "fontWeight": "800", "color": lookup(m, "amtFg"), "whiteSpace": "nowrap" }}>
                      {lookup(m, "amt")}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Arqueo de caja"}
                </span>
                <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                  {lookup(v, "counted")}
                </span>
              </span>
              {(lookup(v, "den") || []).map((d, index4) => (
                <Fragment key={index4}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "minHeight": "44px" }}>
                    <span style={{ "flex": "1", "fontSize": "13px", "fontWeight": "600" }}>
                      {lookup(d, "label")}
                    </span>
                    <button onClick={lookup(d, "minus")} aria-label={lookup(d, "minusLabel")} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                      {"−"}
                    </button>
                    <span style={{ "minWidth": "34px", "textAlign": "center", "fontSize": "14px", "fontWeight": "800" }}>
                      {lookup(d, "n")}
                    </span>
                    <button onClick={lookup(d, "plus")} aria-label={lookup(d, "plusLabel")} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                      {"+"}
                    </button>
                    <span style={{ "minWidth": "74px", "textAlign": "right", "fontSize": "12px", "color": "#6B6B6B" }}>
                      {lookup(d, "sub")}
                    </span>
                  </div>
                </Fragment>
              ))}
              <button onClick={lookup(v, "toggleClose")} style={{ "marginTop": "6px", "height": "52px", "borderRadius": "999px", "border": "none", "background": lookup(v, "closeBg"), "color": lookup(v, "closeFg"), "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "800", "cursor": "pointer" }}>
                {lookup(v, "closeText")}
              </button>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isGastos")) && (
          <Fragment>
            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.1", "padding": "4px 4px 2px" }}>
              <span style={{ "fontSize": "30px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                {lookup(v, "spent")}
              </span>
              <span style={{ "fontSize": "15px", "color": "#9A9A9A" }}>
                {"gastado en octubre · ejemplo"}
              </span>
            </span>
            <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                <span style={{ "color": "#BDBDBD" }}>
                  {"Presupuesto del mes"}
                </span>
                <span style={{ "fontWeight": "800" }}>
                  {"S/ 9,500"}
                </span>
              </span>
              <span style={{ "height": "10px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                <span style={{ "display": "block", "width": lookup(v, "budgetW"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
              </span>
              <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px", "color": "#9A9A9A" }}>
                <span>
                  {lookup(v, "budgetPct")}
                  {" usado"}
                </span>
                <span>
                  {"Quedan "}
                  {lookup(v, "budgetLeft")}
                </span>
              </span>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                {"Por categoría"}
              </span>
              {(lookup(v, "cats") || []).map((c, index5) => (
                <Fragment key={index5}>
                  <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "display": "flex", "flexDirection": "column", "gap": "5px", "padding": "6px 8px", "borderRadius": "14px", "border": "none", "background": lookup(c, "bg"), "fontFamily": "inherit", "color": "#111111", "cursor": "pointer", "textAlign": "left" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "width": "100%", "fontSize": "13px" }}>
                      <span>
                        {lookup(c, "name")}
                        {" "}
                        <span style={{ "color": "#8C8C8C", "fontSize": "11px" }}>
                          {"· "}
                          {lookup(c, "kind")}
                        </span>
                      </span>
                      <span style={{ "fontWeight": "800" }}>
                        {lookup(c, "v")}
                      </span>
                    </span>
                    <span style={{ "width": "100%", "height": "8px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                      <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Próximos pagos"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                  {lookup(v, "dueCount")}
                </span>
              </span>
              {(lookup(v, "dues") || []).map((d, index6) => (
                <Fragment key={index6}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px", "borderRadius": "18px", "background": "#F4F4F2", "opacity": lookup(d, "o") }}>
                    <span style={{ "width": "44px", "height": "44px", "borderRadius": "14px", "background": "#FFFFFF", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "lineHeight": "1", "flex": "none" }}>
                      <span style={{ "fontSize": "16px", "fontWeight": "800" }}>
                        {lookup(d, "day")}
                      </span>
                      <span style={{ "fontSize": "10px", "color": "#8C8C8C" }}>
                        {lookup(d, "mon")}
                      </span>
                    </span>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(d, "name")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(d, "amt")}
                      </span>
                    </span>
                    <button onClick={lookup(d, "pay")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(d, "btnBg"), "color": lookup(d, "btnFg"), "fontFamily": "inherit", "fontSize": "11px", "fontWeight": "700", "cursor": "pointer", "whiteSpace": "nowrap" }}>
                      {lookup(d, "btn")}
                    </button>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Gastos"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                  {lookup(v, "catFilterLabel")}
                </span>
              </span>
              {(lookup(v, "expenses") || []).map((x, index7) => (
                <Fragment key={index7}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px 2px", "borderBottom": "1px solid #F0F0EE" }}>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(x, "concept")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(x, "date")}
                        {" · "}
                        {lookup(x, "cat")}
                        {" · "}
                        {lookup(x, "method")}
                      </span>
                      <span style={{ "alignSelf": "flex-start", "marginTop": "4px", "display": "inline-flex", "alignItems": "center", "gap": "5px", "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(x, "recBg"), "color": lookup(x, "recFg"), "fontSize": "10px", "fontWeight": "700" }}>
                        <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(x, "recIcon")}></path>
                        </svg>
                        {lookup(x, "rec")}
                      </span>
                    </span>
                    <span style={{ "fontSize": "13px", "fontWeight": "800", "whiteSpace": "nowrap" }}>
                      {lookup(x, "amt")}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div id={"registrar-gasto"} style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                {"Registrar gasto"}
              </span>
              <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600" }}>
                {"Concepto"}
                <input value={(lookup(v, "fConcept") ?? "")} onChange={lookup(v, "setConcept")} placeholder={"Ej.: Envío por agencia a Cusco"} style={{ "height": "46px", "border": "1px solid #DCDCD8", "borderRadius": "14px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "14px" }} />
              </label>
              <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600" }}>
                {"Monto (S/)"}
                <input value={(lookup(v, "fAmount") ?? "")} onChange={lookup(v, "setAmount")} inputMode={"decimal"} placeholder={"0.00"} style={{ "height": "46px", "border": "1px solid #DCDCD8", "borderRadius": "14px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "14px" }} />
              </label>
              <span style={{ "fontSize": "12px", "fontWeight": "600" }}>
                {"Categoría"}
              </span>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}>
                {(lookup(v, "fCats") || []).map((c, index8) => (
                  <Fragment key={index8}>
                    <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                      {lookup(c, "label")}
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "height": "64px", "borderRadius": "18px", "border": "1.5px dashed #DCDCD8", "fontSize": "12px", "color": "#6B6B6B" }}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M12 16V4M7 9l5-5 5 5M4 20h16"}></path>
                </svg>
                {"Foto o PDF del comprobante"}
              </div>
              {Boolean(lookup(v, "fErr")) && (
                <Fragment>
                  <span role={"alert"} style={{ "display": "flex", "alignItems": "center", "gap": "8px", "padding": "10px 12px", "borderRadius": "14px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "12px", "fontWeight": "600" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 7v6M12 17h.01"}></path>
                    </svg>
                    {lookup(v, "fErr")}
                  </span>
                </Fragment>
              )}
              <button onClick={lookup(v, "saveExpense")} style={{ "height": "52px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "800", "cursor": "pointer" }}>
                {"Guardar gasto"}
              </button>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isComp")) && (
          <Fragment>
            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.1", "padding": "4px 4px 2px" }}>
              <span style={{ "fontSize": "30px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                {lookup(v, "compCount")}
                {" emitidos"}
              </span>
              <span style={{ "fontSize": "15px", "color": "#9A9A9A" }}>
                {"en octubre · ejemplo"}
              </span>
            </span>
            <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
              {(lookup(v, "compTabs") || []).map((t, index9) => (
                <Fragment key={index9}>
                  <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "flex": "none", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                    {lookup(t, "label")}
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "8px" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                    {lookup(v, "doc.kind")}
                  </span>
                  <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                    {lookup(v, "doc.id")}
                  </span>
                </span>
                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(v, "doc.bg"), "color": lookup(v, "doc.fg"), "fontSize": "11px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(v, "doc.icon")}></path>
                  </svg>
                  {lookup(v, "doc.state")}
                </span>
              </span>
              <span style={{ "fontSize": "13px", "lineHeight": "1.45" }}>
                {lookup(v, "doc.client")}
                {" · "}
                {lookup(v, "doc.taxId")}
                <br />
                <span style={{ "color": "#6B6B6B" }}>
                  {lookup(v, "doc.date")}
                  {" · Pedido "}
                  {lookup(v, "doc.order")}
                  {" · "}
                  {lookup(v, "doc.pay")}
                </span>
              </span>
              {(lookup(v, "docLines") || []).map((l, index10) => (
                <Fragment key={index10}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px", "fontSize": "12px" }}>
                    <span style={{ "color": "#444444" }}>
                      {lookup(l, "q")}
                      {" × "}
                      {lookup(l, "name")}
                    </span>
                    <span style={{ "fontWeight": "700", "whiteSpace": "nowrap" }}>
                      {lookup(l, "v")}
                    </span>
                  </span>
                </Fragment>
              ))}
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "paddingTop": "8px", "borderTop": "1px dashed #DCDCD8", "fontSize": "12px" }}>
                <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                  <span style={{ "color": "#6B6B6B" }}>
                    {"Op. gravada"}
                  </span>
                  <span>
                    {lookup(v, "doc.grav")}
                  </span>
                </span>
                <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                  <span style={{ "color": "#6B6B6B" }}>
                    {"IGV 18 %"}
                  </span>
                  <span>
                    {lookup(v, "doc.igv")}
                  </span>
                </span>
                <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "16px", "fontWeight": "800", "paddingTop": "4px" }}>
                  <span>
                    {"Total"}
                  </span>
                  <span>
                    {lookup(v, "doc.total")}
                  </span>
                </span>
              </div>
              <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                <button onClick={lookup(v, "downloadDoc")} style={{ "height": "46px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                  {"Descargar PDF"}
                </button>
                <button onClick={lookup(v, "sendDoc")} style={{ "height": "46px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "color": "#111111", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                  {"WhatsApp"}
                </button>
              </div>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "12px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
              {(lookup(v, "docs") || []).map((d, index11) => (
                <Fragment key={index11}>
                  <button onClick={lookup(d, "pick")} aria-pressed={lookup(d, "pressed")} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px", "borderRadius": "18px", "border": "none", "background": lookup(d, "rowBg"), "color": lookup(d, "rowFg"), "fontFamily": "inherit", "textAlign": "left", "cursor": "pointer" }}>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                        {lookup(d, "id")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": lookup(d, "subFg") }}>
                        {lookup(d, "client")}
                        {" · "}
                        {lookup(d, "date")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "4px" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                        {lookup(d, "total")}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "20px", "padding": "0 7px", "borderRadius": "999px", "background": lookup(d, "bg"), "color": lookup(d, "fg"), "fontSize": "10px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                        <svg width={"9"} height={"9"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(d, "icon")}></path>
                        </svg>
                        {lookup(d, "state")}
                      </span>
                    </span>
                  </button>
                </Fragment>
              ))}
              {Boolean(lookup(v, "noDocs")) && (
                <Fragment>
                  <span style={{ "padding": "18px", "textAlign": "center", "fontSize": "13px", "color": "#6B6B6B" }}>
                    {"No hay comprobantes en esta pestaña."}
                  </span>
                </Fragment>
              )}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Pendientes por emitir"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                  {"pedidos pagados"}
                </span>
              </span>
              {(lookup(v, "pend") || []).map((p, index12) => (
                <Fragment key={index12}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px", "borderRadius": "18px", "background": "#1E1E1E" }}>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(p, "order")}
                        {" · "}
                        {lookup(p, "client")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#9A9A9A" }}>
                        {lookup(p, "kind")}
                        {" · "}
                        {lookup(p, "when")}
                        {" · "}
                        {lookup(p, "total")}
                      </span>
                    </span>
                    <button onClick={lookup(p, "emit")} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                      {"Emitir"}
                    </button>
                  </div>
                </Fragment>
              ))}
              {Boolean(lookup(v, "noPend")) && (
                <Fragment>
                  <span style={{ "fontSize": "13px", "color": "#BDBDBD" }}>
                    {"Todo emitido. No quedan pedidos sin comprobante."}
                  </span>
                </Fragment>
              )}
              <span style={{ "fontSize": "11px", "lineHeight": "1.45", "color": "#9A9A9A" }}>
                {"Diseño de ejemplo: para emitir de verdad se necesita un proveedor autorizado por SUNAT [PROVEEDOR]."}
              </span>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isPos")) && (
          <Fragment>
            <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 16px", "borderRadius": "999px", "background": "#FFFFFF", "boxSizing": "border-box" }}>
              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"} style={{ "flex": "none" }}>
                <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                <path d={"M16 16l4 4"}></path>
              </svg>
              <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                {"Buscar producto"}
              </span>
              <input type={"search"} value={(lookup(v, "posQ") ?? "")} onChange={lookup(v, "onPosSearch")} placeholder={"Escanea o escribe el producto…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "14px", "outline": "none" }} />
              <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#8C8C8C"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                <path d={"M4 6v12M7 6v12M11 6v12M14 6v12M17 6v12M20 6v12"}></path>
              </svg>
            </label>
            <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
              {(lookup(v, "posCats") || []).map((c, index13) => (
                <Fragment key={index13}>
                  <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "flex": "none", "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                    {lookup(c, "label")}
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
              {(lookup(v, "posProducts") || []).map((p, index14) => (
                <Fragment key={index14}>
                  <button onClick={lookup(p, "add")} aria-label={lookup(p, "aria")} style={{ "position": "relative", "display": "flex", "flexDirection": "column", "gap": "8px", "padding": "8px", "borderRadius": "22px", "border": "none", "background": "#FFFFFF", "fontFamily": "inherit", "color": "#111111", "textAlign": "left", "cursor": "pointer", "opacity": lookup(p, "o") }}>
                    <span style={{ "height": "104px", "borderRadius": "16px", "background": "#F4F4F2", "overflow": "hidden", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      {Boolean(lookup(p, "img")) && (
                        <Fragment>
                          <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover" }} />
                        </Fragment>
                      )}
                      {Boolean(lookup(p, "noImg")) && (
                        <Fragment>
                          <svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#BDBDBD"} strokeWidth={"1.8"} aria-hidden={"true"}>
                            <path d={"M3 7l9-4 9 4v10l-9 4-9-4z"}></path>
                          </svg>
                        </Fragment>
                      )}
                    </span>
                    <span style={{ "fontSize": "12px", "fontWeight": "700", "lineHeight": "1.3", "padding": "0 2px" }}>
                      {lookup(p, "name")}
                    </span>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "padding": "0 2px 2px" }}>
                      <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                        {lookup(p, "price")}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "fontSize": "10px", "fontWeight": "700", "color": lookup(p, "stockFg") }}>
                        <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(p, "stockIcon")}></path>
                        </svg>
                        {lookup(p, "stock")}
                      </span>
                    </span>
                    {Boolean(lookup(p, "inCart")) && (
                      <Fragment>
                        <span style={{ "position": "absolute", "top": "14px", "right": "14px", "minWidth": "28px", "height": "28px", "padding": "0 8px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "fontSize": "13px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          {lookup(p, "inCart")}
                        </span>
                      </Fragment>
                    )}
                  </button>
                </Fragment>
              ))}
            </div>
            {Boolean(lookup(v, "noPosProducts")) && (
              <Fragment>
                <span style={{ "padding": "24px", "borderRadius": "22px", "background": "#FFFFFF", "textAlign": "center", "fontSize": "13px", "color": "#6B6B6B" }}>
                  {"No encontramos ese producto. Prueba con el código o el nombre."}
                </span>
              </Fragment>
            )}
            <span style={{ "fontSize": "12px", "color": "#8C8C8C", "padding": "0 4px" }}>
              {"Cada producto se descuenta del lote más antiguo (PEPS)."}
            </span>
          </Fragment>
        )}
      </div>
      {Boolean(lookup(v, "showCartBar")) && (
        <Fragment>
          <button onClick={lookup(v, "openTicket")} style={{ "position": "absolute", "left": "14px", "right": "14px", "bottom": "96px", "zIndex": "6", "height": "60px", "padding": "0 8px 0 18px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "display": "flex", "alignItems": "center", "gap": "10px", "cursor": "pointer", "boxShadow": "0 10px 24px rgba(232,112,31,0.4)" }}>
            <span style={{ "flex": "1", "textAlign": "left", "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
              <span style={{ "fontSize": "12px", "fontWeight": "600" }}>
                {lookup(v, "cartUnits")}
              </span>
              <span style={{ "fontSize": "17px", "fontWeight": "800" }}>
                {lookup(v, "cartTotal")}
              </span>
            </span>
            <span style={{ "height": "44px", "padding": "0 18px", "borderRadius": "999px", "background": "#111111", "display": "flex", "alignItems": "center", "fontSize": "14px", "fontWeight": "800" }}>
              {"Cobrar"}
            </span>
          </button>
        </Fragment>
      )}
      {Boolean(lookup(v, "showFab")) && (
        <Fragment>
          <button onClick={lookup(v, "fabAct")} aria-label={lookup(v, "fabLabel")} style={{ "position": "absolute", "right": "18px", "bottom": "100px", "zIndex": "6", "width": "58px", "height": "58px", "borderRadius": "50%", "border": "none", "background": "#E8701F", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "boxShadow": "0 10px 24px rgba(232,112,31,0.4)" }}>
            <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
              <path d={"M12 5v14M5 12h14"}></path>
            </svg>
          </button>
        </Fragment>
      )}
      <nav aria-label={"Navegación principal"} style={{ "position": "absolute", "left": "14px", "right": "14px", "bottom": "18px", "zIndex": "6", "height": "66px", "padding": "7px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#111111", "display": "flex", "gap": "4px" }}>
        {(lookup(v, "tabs") || []).map((t, index15) => (
          <Fragment key={index15}>
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
      {Boolean(lookup(v, "ticketOpen")) && (
        <Fragment>
          <div style={{ "position": "absolute", "inset": "0", "zIndex": "15", "background": "rgba(17,17,17,0.45)", "display": "flex", "flexDirection": "column", "justifyContent": "flex-end" }}>
            <button onClick={lookup(v, "closeTicket")} aria-label={"Cerrar ticket"} style={{ "flex": "1", "minHeight": "40px", "border": "none", "background": "transparent", "cursor": "pointer" }}></button>
            <div style={{ "maxHeight": "88%", "background": "#FFFFFF", "borderRadius": "30px 30px 0 0", "display": "flex", "flexDirection": "column" }}>
              <div style={{ "padding": "10px 16px 8px", "display": "flex", "flexDirection": "column", "gap": "10px", "flex": "none" }}>
                <span style={{ "alignSelf": "center", "width": "44px", "height": "5px", "borderRadius": "999px", "background": "#DCDCD8" }}></span>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                  <span style={{ "flex": "1", "fontSize": "22px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {lookup(v, "ticketTitle")}
                  </span>
                  <button onClick={lookup(v, "closeTicket")} aria-label={"Cerrar ticket"} style={{ "width": "42px", "height": "42px", "borderRadius": "50%", "border": "none", "background": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M6 6l12 12M18 6L6 18"}></path>
                    </svg>
                  </button>
                </div>
              </div>
              {Boolean(lookup(v, "saleDone")) && (
                <Fragment>
                  <div style={{ "padding": "6px 16px 28px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <div style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "8px", "padding": "22px 16px", "borderRadius": "24px", "background": "#E4F4E7", "color": "#1B5E20", "textAlign": "center" }}>
                      <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1B5E20"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                      </span>
                      <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                        {"Venta registrada"}
                      </span>
                      <span style={{ "fontSize": "13px", "lineHeight": "1.45" }}>
                        {lookup(v, "saleLine")}
                      </span>
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                      <button onClick={lookup(v, "printSale")} style={{ "height": "48px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                        {"Imprimir"}
                      </button>
                      <button onClick={lookup(v, "sendSale")} style={{ "height": "48px", "borderRadius": "999px", "border": "none", "background": "#F4F4F2", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
                        {"WhatsApp"}
                      </button>
                    </div>
                    <button onClick={lookup(v, "newSale")} style={{ "height": "54px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "15px", "fontWeight": "800", "cursor": "pointer" }}>
                      {"Nueva venta"}
                    </button>
                  </div>
                </Fragment>
              )}
              {Boolean(lookup(v, "saleOpen")) && (
                <Fragment>
                  <div className={"noscroll"} style={{ "flex": "1", "minHeight": "0", "overflowY": "auto", "padding": "0 16px 12px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                      {(lookup(v, "priceLists") || []).map((l, index16) => (
                        <Fragment key={index16}>
                          <button onClick={lookup(l, "pick")} aria-pressed={lookup(l, "pressed")} style={{ "flex": "none", "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(l, "bg"), "color": lookup(l, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                            {lookup(l, "label")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    {(lookup(v, "ticket") || []).map((t, index17) => (
                      <Fragment key={index17}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(t, "name")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(t, "unit")}
                              {" · lote "}
                              {lookup(t, "lot")}
                            </span>
                          </span>
                          <button onClick={lookup(t, "minus")} aria-label={lookup(t, "minusLabel")} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "17px", "fontWeight": "700" }}>
                            {"−"}
                          </button>
                          <span style={{ "minWidth": "22px", "textAlign": "center", "fontSize": "14px", "fontWeight": "800" }}>
                            {lookup(t, "qty")}
                          </span>
                          <button onClick={lookup(t, "plus")} aria-label={lookup(t, "plusLabel")} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "17px", "fontWeight": "700" }}>
                            {"+"}
                          </button>
                          <span style={{ "minWidth": "66px", "textAlign": "right", "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(t, "sub")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {Boolean(lookup(v, "ticketEmpty")) && (
                      <Fragment>
                        <span style={{ "padding": "18px", "textAlign": "center", "fontSize": "13px", "color": "#6B6B6B" }}>
                          {"El ticket está vacío. Toca un producto para agregarlo."}
                        </span>
                      </Fragment>
                    )}
                    <span style={{ "fontSize": "12px", "fontWeight": "700", "paddingTop": "4px" }}>
                      {"Pago"}
                    </span>
                    <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                      {(lookup(v, "payMethods") || []).map((m, index18) => (
                        <Fragment key={index18}>
                          <button onClick={lookup(m, "pick")} aria-pressed={lookup(m, "pressed")} style={{ "flex": "none", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(m, "bg"), "color": lookup(m, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                            {lookup(m, "label")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    {Boolean(lookup(v, "isCash")) && (
                      <Fragment>
                        <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                          {"Recibido"}
                        </span>
                        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(4, minmax(0, 1fr))", "gap": "6px" }}>
                          {(lookup(v, "recvOpts") || []).map((r, index19) => (
                            <Fragment key={index19}>
                              <button onClick={lookup(r, "pick")} aria-pressed={lookup(r, "pressed")} style={{ "height": "40px", "borderRadius": "999px", "border": "none", "background": lookup(r, "bg"), "color": lookup(r, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                                {lookup(r, "label")}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "alignSelf": "flex-start", "height": "32px", "padding": "0 12px", "borderRadius": "999px", "background": lookup(v, "changeBg"), "color": lookup(v, "changeFg"), "fontSize": "12px", "fontWeight": "700" }}>
                          <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(v, "changeIcon")}></path>
                          </svg>
                          {lookup(v, "changeLabel")}
                        </span>
                      </Fragment>
                    )}
                    <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                      {"Comprobante"}
                    </span>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "6px" }}>
                      {(lookup(v, "docTypes") || []).map((d, index20) => (
                        <Fragment key={index20}>
                          <button onClick={lookup(d, "pick")} aria-pressed={lookup(d, "pressed")} style={{ "height": "38px", "borderRadius": "999px", "border": "none", "background": lookup(d, "bg"), "color": lookup(d, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                            {lookup(d, "label")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ "flex": "none", "padding": "12px 16px 22px", "borderTop": "1px solid #EFEFEC", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                      <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                        {"Total · IGV incluido"}
                      </span>
                      <span style={{ "fontSize": "24px", "fontWeight": "800" }}>
                        {lookup(v, "cartTotal")}
                      </span>
                    </span>
                    <button onClick={lookup(v, "charge")} style={{ "height": "56px", "borderRadius": "999px", "border": "none", "background": lookup(v, "chargeBg"), "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "16px", "fontWeight": "800", "cursor": "pointer" }}>
                      {lookup(v, "chargeText")}
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </Fragment>
      )}
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
                        {"Prueba con otra palabra, por ejemplo \"caja\" o \"gasto\"."}
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
                          <DesignLink href={lookup(i, "href")} style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "minHeight": "112px", "padding": "12px", "borderRadius": "22px", "background": "#F4F4F2", "color": "#111111", "textDecoration": "none", "boxSizing": "border-box" }}>
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
                          </DesignLink>
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
                  <DesignLink href={"/admin/login"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "7px", "height": "40px", "padding": "0 14px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "12px", "fontWeight": "700" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10"}></path>
                    </svg>
                    {"Cerrar sesión"}
                  </DesignLink>
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
