"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = {
      screen: 'pedidodetalle', menu: false, grp: 'fav', q: '', toast: '',
      stage: 1, docDone: false,
      kprod: 'foco', klot: 'Todos',
      tsel: '', tstage: {},
      dfilter: 'Todos', dsel: '', ddec: {},
      photo: 0, pstatus: 'Publicado', name: 'Lámpara de camping recargable', prices: { pub: 69.9, min: 62.9, may: 55, emp: 52 }, colors: { Negro: true, Verde: true, Naranja: false }, caps: { '2000 mAh': true, '4000 mAh': true }, minStock: 15
    };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const go = (s) => () => this.setState({ screen: s, menu: false, toast: '', tsel: '', dsel: '' });
    const money = (n, d) => 'S/ ' + Number(n).toLocaleString('es-PE', { minimumFractionDigits: d == null ? 2 : d, maximumFractionDigits: d == null ? 2 : d });
    const IC = {
      inicio: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z',
      pedidos: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0',
      cotiz: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h4',
      clientes: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21v-1a7 7 0 0 1 14 0v1M16 3.5a4 4 0 0 1 0 7.5M22 21v-1a6 6 0 0 0-4-5.6',
      inv: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
      compras: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1',
      reportes: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
      kardex: 'M4 6h16M4 12h16M4 18h10',
      tienda: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18',
      qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z',
      ajustes: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1',
      pos: 'M3 4h18v10H3zM8 20h8M12 14v6M7 9h4',
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
      notif: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20h4',
      mas: 'M5 12h.01M12 12h.01M19 12h.01',
      ok: 'M5 12l5 5 9-10', warn: 'M12 7v6M12 17h.01', x: 'M6 6l12 12M18 6L6 18', clock: 'M12 7v5l3 2', truck: 'M3 7h11v9H3zM14 10h4l3 3v3h-7', box: 'M3 7l9-4 9 4v10l-9 4-9-4z',
      inArrow: 'M12 5v14M5 12l7 7 7-7', outArrow: 'M12 19V5M5 12l7-7 7 7', adj: 'M4 20h4L19 9l-4-4L4 16z', print: 'M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z', wa: 'M4 20l1.5-4A8 8 0 1 1 9 19.5z', save: 'M5 12l5 5 9-10'
    };
    const T = { green: ['#E4F4E7', '#1B5E20'], amber: ['#FFF4D6', '#7A4A00'], red: ['#FDE4E2', '#8E1C14'], blue: ['#E3F1FF', '#0B4A8A'], violet: ['#EDE7FF', '#4A2E9A'], orange: ['#FFF1E6', '#8A3B0A'], gray: ['#EFEFEC', '#444444'] };
    const META = {
      pedidodetalle: ['Pedido #1041', 'Bodega San Martín · WhatsApp'],
      kardex: ['Kardex del producto', 'Inventario y lotes'],
      traslados: ['Traslados', 'Tienda, Almacén y Exhibición'],
      devoluciones: ['Devoluciones', 'Cambios y garantías'],
      productoeditar: ['Editar producto', 'Camping › Lámparas']
    };
    const m = META[st.screen];

    // ---------- Pedido #1041 ----------
    const FLOW = [['Por pagar', '25 oct 18:40', IC.clock], ['Pagado', '26 oct 09:58', IC.ok], ['Preparando', 'hoy', IC.box], ['Enviado', '—', IC.truck], ['Entregado', '—', IC.ok]];
    const L = [['Foco LED 9 W luz cálida', 48, 8.9, '52dc55c2523393f8f60ab89499fa3ec1', 'L-1008'], ['Mosquetón llavero de aluminio', 30, 6.9, 'eb0c79147accd306bbd7a39d350a8e88', 'L-0830'], ['Ganchos de pared (set de 3)', 12, 9.9, 'b68602a2601d3a2d118c7190d31f96a1', 'L-0907']];
    const sum = L.reduce((a, l) => a + l[1] * l[2], 0);
    const grav = sum / 1.18;
    const TL = [['Pedido creado por WhatsApp', '25 oct · 18:40 · Beltran C.'], ['Pago confirmado (transferencia)', '26 oct · 09:58 · Beltran C.'], ['Preparado por Almacén', 'Lotes L-1008, L-0830 y L-0907'], ['Salió con el motorizado', '[NOMBRE] · guía G-2211'], ['Entregado al cliente', 'Firma de recepción']];
    const ped = {
      status: FLOW[st.stage][0], total: money(sum), totalNum: sum.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      steps: FLOW.map((f, i) => ({ label: f[0], time: i <= st.stage ? (i === st.stage && i > 1 ? 'ahora' : f[1]) : '', icon: i <= st.stage ? f[2] : 'M12 12h.01', bg: i < st.stage ? '#111111' : (i === st.stage ? '#E8701F' : '#F4F4F2'), fg: i <= st.stage ? '#FFFFFF' : '#BDBDBD', lineL: i === 0 ? 'transparent' : (i <= st.stage ? '#111111' : '#EFEFEC'), lineR: i === FLOW.length - 1 ? 'transparent' : (i < st.stage ? '#111111' : '#EFEFEC') })),
      canAdvance: st.stage < FLOW.length - 1, done: st.stage === FLOW.length - 1, next: st.stage < FLOW.length - 1 ? FLOW[st.stage + 1][0] : '',
      lines: L.map((l) => ({ name: l[0], qty: String(l[1]), price: money(l[2]), sub: money(l[1] * l[2]), img: B + l[3], lot: l[4] })),
      summary: [['Subtotal', money(sum)], ['Descuento', 'S/ 0.00'], ['Envío', 'Gratis'], ['IGV 18 % (incluido)', money(sum - grav)]].map((r) => ({ k: r[0], v: r[1] })),
      docState: st.docDone ? 'Emitida · aceptada por SUNAT (ejemplo)' : 'Por emitir',
      docPending: !st.docDone,
      timeline: TL.slice(0, st.stage + 1).map((t, i) => ({ label: t[0], meta: t[1], dot: i === st.stage ? '#E8701F' : '#111111' })).reverse()
    };

    // ---------- Kardex ----------
    const KP = {
      foco: { name: 'Foco LED 9 W luz cálida', short: 'Foco LED 9 W', img: '52dc55c2523393f8f60ab89499fa3ec1', min: 60, open: 85, cost: 4.2, lots: ['L-0921', 'L-1008', 'L-1020'],
        moves: [[3, 'B001-00388', 'Salida', 'L-0921', 0, 30, 'Venta en tienda'], [6, 'B001-00395', 'Salida', 'L-0921', 0, 40, 'Venta web #1012'], [8, 'OC-0409', 'Entrada', 'L-1008', 200, 0, 'Compra a [Proveedor A]'], [10, 'B001-00402', 'Salida', 'L-0921', 0, 15, 'Lote L-0921 se agota'], [12, 'B001-00405', 'Salida', 'L-1008', 0, 25, 'Venta en tienda'], [14, 'AJ-003', 'Ajuste', 'L-1008', 0, 2, 'Rotos en exhibición'], [16, 'TR-002', 'Traslado', 'L-1008', 20, 20, 'Almacén → Tienda A3'], [18, 'DV-001', 'Devolución', 'L-1008', 3, 0, 'Cliente devolvió, en buen estado'], [20, 'OC-0415', 'Entrada', 'L-1020', 120, 0, 'Compra a [Proveedor B]'], [22, 'B001-00421', 'Salida', 'L-1008', 0, 36, 'Pedido #1041 Bodega San Martín'], [24, 'F001-00085', 'Salida', 'L-1020', 0, 20, 'Venta a empresa']] },
      panel: { name: 'Panel solar monocristalino 100 W', short: 'Panel solar 100 W', img: '972ceb606bfca75ef6208d8d3966c77d', min: 8, open: 4, cost: 238, lots: ['L-0805', 'L-1015'],
        moves: [[5, 'F001-00079', 'Salida', 'L-0805', 0, 2, 'Venta a empresa minera'], [15, 'OC-0412', 'Entrada', 'L-1015', 10, 0, 'Compra a [Proveedor C]'], [19, 'B001-00410', 'Salida', 'L-1015', 0, 3, 'Venta web #1027'], [23, 'F001-00084', 'Salida', 'L-1015', 0, 2, 'Cotización COT-0211 aceptada']] },
      cable: { name: 'Cable USB-C carga rápida 1 m', short: 'Cable USB-C', img: '3aba2390d3fbd5f06fdd2cede507b16f', min: 40, open: 168, cost: 6.5, lots: ['L-0901', 'L-1012'],
        moves: [[2, 'B001-00386', 'Salida', 'L-0901', 0, 12, 'Venta en tienda'], [7, 'B001-00398', 'Salida', 'L-0901', 0, 18, 'Venta web #1014'], [12, 'OC-0410', 'Entrada', 'L-1012', 200, 0, 'Compra · pasa por revisión'], [13, 'B001-00406', 'Salida', 'L-0901', 0, 10, 'Venta en tienda'], [19, 'B001-00411', 'Salida', 'L-0901', 0, 8, 'Venta web #1028'], [26, 'F001-00086', 'Salida', 'L-0901', 0, 10, 'Venta a ferretería']] }
    };
    const KT = { Entrada: [T.green, IC.inArrow], Salida: [T.orange, IC.outArrow], Ajuste: [T.amber, IC.adj], Traslado: [T.blue, IC.tras], 'Devolución': [T.violet, IC.devol] };
    const kp = KP[st.kprod] || KP.foco;
    let bal = kp.open;
    const series = [[1, bal]];
    const all = kp.moves.map((mv) => { bal = bal + mv[4] - mv[5]; series.push([mv[0], bal]); return { mv, bal }; });
    series.push([31, bal]);
    const ins = kp.moves.reduce((a, mv) => a + mv[4], 0);
    const outs = kp.moves.reduce((a, mv) => a + mv[5], 0);
    const maxB = Math.max(kp.min, ...series.map((s) => s[1])) * 1.15;
    const px = (d) => Math.round(((d - 1) / 30) * 300 + 10);
    const py = (v) => Math.round(110 - (v / maxB) * 100);
    const moves = all.filter((x) => st.klot === 'Todos' || x.mv[3] === st.klot).reverse().map((x) => {
      const mv = x.mv; const t = KT[mv[2]]; const net = mv[4] - mv[5];
      return { type: mv[2], date: mv[0] + ' oct', doc: mv[1], lot: mv[3], note: mv[6], qty: mv[2] === 'Traslado' ? '±' + mv[4] : (net > 0 ? '+' + net : String(net)), qtyFg: net > 0 ? '#1B5E20' : (net < 0 ? '#111111' : '#4A2E9A'), bal: String(x.bal), bg: t[0][0], fg: t[0][1], icon: t[1] };
    });
    const kx = {
      name: kp.name, min: String(kp.min),
      prods: Object.keys(KP).map((k) => { const on = k === st.kprod; return { short: KP[k].short, img: B + KP[k].img, bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ kprod: k, klot: 'Todos' }) }; }),
      stats: [['Saldo inicial', kp.open, false], ['Entradas', ins, false], ['Salidas', outs, false], ['Saldo final', bal, true]].map((s) => ({ k: s[0], v: String(s[1]) + ' u.', money: money(s[1] * kp.cost, 0) + ' a costo', bg: s[2] ? '#111111' : '#FFFFFF', fg: s[2] ? '#FFFFFF' : '#111111', sub: s[2] ? '#BDBDBD' : '#6B6B6B' })),
      points: series.map((s) => px(s[0]) + ',' + py(s[1])).join(' '),
      minY: String(py(kp.min)), endX: String(px(31)), endY: String(py(bal)),
      startLabel: String(kp.open) + ' u.', startLabelY: String(Math.max(12, py(kp.open) - 8)),
      endLabel: String(bal) + ' u.', endLabelY: String(Math.max(12, py(bal) - 10)),
      aria: 'Stock de ' + kp.name + ' en octubre: empieza en ' + kp.open + ' y termina en ' + bal + ' unidades; mínimo ' + kp.min,
      lotChips: ['Todos'].concat(kp.lots).map((l) => { const on = st.klot === l; return { label: l === 'Todos' ? 'Todos los lotes' : l, bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ klot: l }) }; }),
      moves, empty: moves.length === 0
    };

    // ---------- Traslados ----------
    const PR = { foco: ['Foco LED 9 W luz cálida', 'L-1008'], panel: ['Panel solar monocristalino 100 W', 'L-0805'], gancho: ['Ganchos de pared (set de 3)', 'L-0840'], llavero: ['Llavero linterna LED', 'L-0833'], cable: ['Cable USB-C carga rápida 1 m', 'L-0901'], ext: ['Extensión de uso rudo 5 m', 'L-0928'], lamp: ['Lámpara de camping recargable', 'L-1012'] };
    const TRS = [
      ['TR-035', '26 oct · 15:10', 'Almacén', 'Tienda', '[Almacén]', 'Reponer tienda', 0, [['cable', 60, 60], ['ext', 20, 20]]],
      ['TR-034', '26 oct · 14:05', 'Almacén', 'Tienda', '[Almacén]', 'Reponer tienda', 1, [['foco', 80, 80], ['lamp', 12, 12], ['gancho', 48, 46]]],
      ['TR-033', '25 oct · 10:20', 'Tienda', 'Exhibición', 'Beltran C.', 'Exhibición', 2, [['lamp', 4, 4], ['panel', 1, 1]]],
      ['TR-032', '24 oct · 16:45', 'Almacén', 'Tienda', '[Almacén]', 'Reponer tienda', 2, [['foco', 40, 38], ['llavero', 24, 24]]],
      ['TR-031', '22 oct · 09:30', 'Tienda', 'Almacén', '[Vendedor]', 'Devolución a almacén', 2, [['ext', 6, 6]]]
    ];
    const TS = { Preparando: [T.amber, IC.box], 'En camino': [T.blue, IC.truck], Recibido: [T.green, IC.ok], 'Con diferencia': [T.red, IC.warn] };
    const trOf = (t) => {
      const stage = st.tstage[t[0]] != null ? st.tstage[t[0]] : t[6];
      const received = stage === 2;
      const diff = received && t[7].some((l) => l[1] !== l[2]);
      const state = stage === 0 ? 'Preparando' : (stage === 1 ? 'En camino' : (diff ? 'Con diferencia' : 'Recibido'));
      const s = TS[state];
      const units = t[7].reduce((a, l) => a + l[1], 0);
      return {
        id: t[0], date: t[1], from: t[2], to: t[3], who: t[4], reason: t[5], state, bg: s[0][0], fg: s[0][1], icon: s[1],
        summary: t[7].length + (t[7].length === 1 ? ' producto' : ' productos') + ' · ' + units + ' unidades · ' + t[7].map((l) => PR[l[0]][1]).join(', '),
        canSend: stage === 0, canReceive: stage === 1, hasDiff: diff,
        lines: t[7].map((l) => { const ok = l[1] === l[2]; const lr = received ? (ok ? [T.green, IC.ok, 'Completo'] : [T.red, IC.warn, 'Faltan ' + (l[1] - l[2])]) : [T.gray, IC.clock, 'Por recibir']; return { name: PR[l[0]][0], lot: PR[l[0]][1], sent: String(l[1]), recv: received ? String(l[2]) : '—', diff: lr[2], bg: lr[0][0], fg: lr[0][1], icon: lr[1] }; }),
        open: () => this.setState({ tsel: t[0] })
      };
    };
    const trItems = TRS.map(trOf);
    const trSel = trItems.find((t) => t.id === st.tsel);
    const tr = {
      list: !trSel, detail: !!trSel, items: trItems,
      sel: trSel || trItems[0],
      locs: [['Tienda', 'Dean Valdivia 533 - Cercado', '724', 'S/ 8,093', '82%', '12 lotes', IC.pos], ['Almacén', '[DIRECCIÓN DEL ALMACÉN]', '1,860', 'S/ 21,450', '64%', '27 lotes', IC.prov], ['Exhibición', 'Vitrina de la tienda', '96', 'S/ 2,310', '40%', '9 lotes', IC.banner]].map((l, i) => ({ name: l[0], addr: l[1], units: l[2], value: l[3], cap: l[4], lots: l[5], icon: l[6], bg: i === 0 ? '#111111' : '#FFFFFF', fg: i === 0 ? '#FFFFFF' : '#111111', sub: i === 0 ? '#BDBDBD' : '#6B6B6B', track: i === 0 ? '#2A2A2A' : '#F4F4F2', iconBg: i === 0 ? '#E8701F' : '#F4F4F2', iconFg: i === 0 ? '#FFFFFF' : '#111111' }))
    };

    // ---------- Devoluciones ----------
    const DC = [
      { id: 'DEV-032', date: 'Hoy 09:40', client: 'Bodega San Martín', order: '#1041', product: 'Foco LED 9 W luz cálida', qty: '6 unidades', lot: 'L-1008', amount: 53.4, img: '52dc55c2523393f8f60ab89499fa3ec1', type: 'Cambio', reason: 'Llegó dañado', state: 'Solicitada', days: 1, limit: 7, comment: 'Seis focos llegaron con el vidrio roto en la caja.' },
      { id: 'DEV-031', date: 'Ayer', client: 'Luis R.', order: '#1039', product: 'Lámpara de camping recargable', qty: '1 unidad', lot: 'L-1012', amount: 69.9, img: 'a58999411e32d7481815ba8cdc175e97', type: 'Garantía', reason: 'Falla de fábrica', state: 'En revisión', days: 40, limit: 180, comment: 'No carga desde la semana pasada.' },
      { id: 'DEV-030', date: '22 oct', client: 'María Q.', order: '#1036', product: 'Cable USB-C carga rápida 1 m', qty: '1 unidad', lot: 'L-0901', amount: 19.9, img: '3aba2390d3fbd5f06fdd2cede507b16f', type: 'Reembolso', reason: 'No le gustó', state: 'Aprobada', days: 3, limit: 7, comment: 'Lo compré por error, es otro modelo.' },
      { id: 'DEV-029', date: '19 oct', client: 'Ferretería Cayma', order: '#1040', product: 'Extensión de uso rudo 5 m', qty: '2 unidades', lot: 'L-0928', amount: 90, img: '323e29809539c2fb4b229651c8081ee9', type: 'Cambio', reason: 'Producto equivocado', state: 'Resuelta', days: 2, limit: 7, comment: 'Pedimos de 10 m y llegaron de 5 m.' },
      { id: 'DEV-028', date: '15 oct', client: '[Cliente]', order: '#0987', product: 'Panel solar monocristalino 100 W', qty: '1 unidad', lot: 'L-0805', amount: 349, img: '972ceb606bfca75ef6208d8d3966c77d', type: 'Garantía', reason: 'Falla de fábrica', state: 'Rechazada', days: 210, limit: 180, comment: 'El panel dejó de generar energía.' }
    ];
    const DS = { Solicitada: [T.amber, IC.clock], 'En revisión': [T.blue, IC.box], Aprobada: [T.green, IC.ok], Resuelta: [T.gray, IC.ok], Rechazada: [T.red, IC.x] };
    const dState = (c) => (st.ddec[c.id] ? st.ddec[c.id].state : c.state);
    const DF = ['Todos', 'Solicitada', 'En revisión', 'Aprobada', 'Resuelta', 'Rechazada'];
    const cases = DC.filter((c) => st.dfilter === 'Todos' || dState(c) === st.dfilter).map((c) => { const s = DS[dState(c)]; return { id: c.id, date: c.date, product: c.product, client: c.client, type: c.type, state: dState(c), amount: money(c.amount), img: B + c.img, bg: s[0][0], fg: s[0][1], icon: s[1], open: () => this.setState({ dsel: c.id }) }; });
    const dc = DC.find((c) => c.id === st.dsel);
    let dsel = null;
    if (dc) {
      const state = dState(dc); const s = DS[state]; const dec = st.ddec[dc.id];
      const inTerm = dc.days <= dc.limit;
      const stock = dec ? dec.stock : (state === 'Rechazada' ? 'No se mueve el stock: el producto sigue con el cliente.' : (state === 'Resuelta' || state === 'Aprobada' ? 'Las unidades volvieron al lote ' + dc.lot + ' como "En revisión" hasta revisarlas.' : 'Al aprobar, las unidades vuelven al lote ' + dc.lot + ' como "En revisión". Si tienen falla, se dan de baja.'));
      dsel = {
        id: dc.id, product: dc.product, qty: dc.qty, lot: dc.lot, client: dc.client, order: dc.order, type: dc.type, reason: dc.reason, comment: dc.comment, img: B + dc.img,
        state, bg: s[0][0], fg: s[0][1], icon: s[1],
        termLabel: (dc.limit === 7 ? 'Plazo de cambio: 7 días' : 'Garantía: 6 meses') + ' · día ' + dc.days,
        termState: inTerm ? 'Dentro del plazo' : 'Fuera del plazo', termFg: inTerm ? '#1B5E20' : '#8E1C14',
        termW: Math.min(100, Math.round((dc.days / dc.limit) * 100)) + '%', termBar: inTerm ? '#E8701F' : '#8E1C14',
        canDecide: state === 'Solicitada' || state === 'En revisión',
        refunded: !!(dec && dec.refund), stock
      };
    }
    const decide = (kind) => () => {
      if (!dc) return;
      const map = {
        change: { state: 'Aprobada', stock: 'Se entrega un producto nuevo del lote más antiguo con stock. Lo devuelto vuelve al lote ' + dc.lot + ' como "En revisión".', toast: dc.id + ': cambio aprobado.' },
        refund: { state: 'Aprobada', refund: true, stock: 'Lo devuelto vuelve al lote ' + dc.lot + ' como "En revisión" y se emite una nota de crédito por ' + money(dc.amount) + '.', toast: dc.id + ': reembolso aprobado.' },
        reject: { state: 'Rechazada', stock: 'No se mueve el stock: el producto sigue con el cliente.', toast: dc.id + ': devolución rechazada.' }
      };
      const d = map[kind];
      this.setState({ ddec: { ...st.ddec, [dc.id]: d }, toast: d.toast });
    };
    const dv = {
      list: !dsel, detail: !!dsel, sel: dsel || { id: '', product: '', qty: '', lot: '', client: '', order: '', type: '', reason: '', comment: '', img: '', state: '', bg: '', fg: '', icon: '', termLabel: '', termState: '', termFg: '', termW: '0%', termBar: '', canDecide: false, refunded: false, stock: '' },
      open: String(DC.filter((c) => ['Solicitada', 'En revisión'].indexOf(dState(c)) >= 0).length),
      chips: DF.map((f) => { const on = st.dfilter === f; return { label: f, n: String(f === 'Todos' ? DC.length : DC.filter((c) => dState(c) === f).length), bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', pick: () => this.setState({ dfilter: f }) }; }),
      cases, empty: cases.length === 0
    };

    // ---------- Editar producto ----------
    const LOTS = [['L-1012', 24, 30.5, '12 oct', 'Tienda · B2'], ['L-1031', 40, 31.8, '31 oct', 'Almacén · R1']];
    const units = LOTS.reduce((a, l) => a + l[1], 0);
    const cost = LOTS.reduce((a, l) => a + l[1] * l[2], 0) / units;
    const PH = ['a58999411e32d7481815ba8cdc175e97', '972ceb606bfca75ef6208d8d3966c77d', '52dc55c2523393f8f60ab89499fa3ec1', '323e29809539c2fb4b229651c8081ee9'];
    const TIERS = [['pub', 'Público', '1 unidad'], ['min', 'Minorista', 'Desde 6 u.'], ['may', 'Mayorista', 'Desde 24 u.'], ['emp', 'Empresa', 'Desde 50 u.']];
    const PST = { Publicado: [T.green, IC.ok], Borrador: [T.amber, IC.adj], Oculto: [T.gray, IC.x] };
    const colorsOn = Object.keys(st.colors).filter((k) => st.colors[k]).length;
    const capsOn = Object.keys(st.caps).filter((k) => st.caps[k]).length;
    const chip = (obj, key) => Object.keys(obj).map((k) => { const on = obj[k]; return { label: k, pressed: on ? 'true' : 'false', bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', toggle: () => this.setState({ [key]: { ...obj, [k]: !on } }) }; });
    const pe = {
      photo: B + PH[st.photo],
      photos: PH.map((p, i) => ({ src: B + p, aria: 'Usar foto ' + (i + 1) + ' como principal', border: st.photo === i ? '#E8701F' : 'transparent', pick: () => this.setState({ photo: i }) })),
      statuses: Object.keys(PST).map((k) => { const on = st.pstatus === k; const s = PST[k]; return { label: k, icon: s[1], bg: on ? s[0][0] : '#FFFFFF', fg: on ? s[0][1] : '#6B6B6B', pick: () => this.setState({ pstatus: k }) }; }),
      name: st.name,
      onName: (e) => this.setState({ name: (e && e.target && e.target.value) || '' }),
      cost: money(cost),
      tiers: TIERS.map((t) => {
        const v = st.prices[t[0]] || 0;
        const mg = v > 0 ? (v - cost) / v : -1;
        const s = mg < 0 ? [T.red, IC.x, 'Pierdes'] : (mg < 0.25 ? [T.amber, IC.warn, 'Margen bajo'] : [T.green, IC.ok, 'Bien']);
        return { label: t[1], min: t[2], value: String(v), margin: v > 0 ? Math.round(mg * 100) + ' %' : '—', state: s[2], fg: s[0][1], icon: s[1], change: (e) => { const n = parseFloat((e && e.target && e.target.value) || '0'); this.setState({ prices: { ...st.prices, [t[0]]: isNaN(n) ? 0 : n } }); } };
      }),
      colors: chip(st.colors, 'colors'),
      caps: chip(st.caps, 'caps'),
      variantCount: (colorsOn * capsOn) + (colorsOn * capsOn === 1 ? ' variante' : ' variantes') + ' (' + colorsOn + ' colores × ' + capsOn + ' capacidades)',
      min: String(st.minStock), low: units <= st.minStock,
      minDown: () => this.setState({ minStock: Math.max(0, st.minStock - 5) }),
      minUp: () => this.setState({ minStock: st.minStock + 5 }),
      lots: LOTS.map((l, i) => ({ n: String(i + 1), code: l[0], left: String(l[1]), meta: 'Ingresó ' + l[3] + ' · ' + money(l[2]) + ' c/u · ' + l[4], tag: i === 0 ? 'Se vende primero' : 'Activo', tagFg: i === 0 ? '#FF914C' : '#9A9A9A', numBg: i === 0 ? '#E8701F' : '#2A2A2A', numFg: '#FFFFFF' }))
    };

    // ---------- Menú: mismos grupos que el escritorio ----------
    const HERE = ['kardex', 'traslados', 'devoluciones', 'pedidodetalle', 'productoeditar'];
    const MOVIL = { inicio: '/admin/movil', pedidos: '/admin/movil', inventario: '/admin/movil', clientes: '/admin/movil', cotizaciones: '/admin/movil', compras: '/admin/movil', reportes: '/admin/movil', ajustes: '/admin/movil', caja: '/movil/finanzas', gastos: '/movil/finanzas', comprobantes: '/movil/finanzas', puntoventa: '/movil/finanzas', ofertas: '/movil/marketing', banners: '/movil/marketing', notificaciones: '/movil/marketing' };
    const N = (label, sub, icon, o) => Object.assign({ label, sub, icon }, o || {});
    const GROUPS = [
      ['fav', 'Favoritos', 'Lo que más usas', [
        N('Punto de venta', 'Vender en el mostrador', IC.pos, { to: 'puntoventa' }),
        N('Pedidos', 'Tablero por estado', IC.pedidos, { to: 'pedidos', badge: '8 por atender' }),
        N('Inventario y lotes', 'Stock por lote', IC.inv, { to: 'inventario', badge: '6 bajos' }),
        N('Cotizaciones', 'Empresas y mayoristas', IC.cotiz, { to: 'cotizaciones', badge: '5 nuevas' }),
        N('Caja del día', 'Apertura, arqueo y cierre', IC.caja, { to: 'caja', badge: 'Abierta', plain: true }),
        N('Panel de inicio', 'Resumen del día', IC.inicio, { to: 'inicio' })]],
      ['ventas', 'Ventas', 'Mostrador, pedidos y clientes', [
        N('Punto de venta', 'Vender en el mostrador', IC.pos, { to: 'puntoventa' }),
        N('Pedidos', 'Tablero por estado', IC.pedidos, { to: 'pedidos', badge: '8 por atender' }),
        N('Cotizaciones', 'Empresas y mayoristas', IC.cotiz, { to: 'cotizaciones', badge: '5 nuevas' }),
        N('Clientes', 'Fichas y cobranzas', IC.clientes, { to: 'clientes', badge: '414', plain: true }),
        N('Devoluciones', 'Cambios y garantías', IC.devol, { to: 'devoluciones', badge: '2 abiertas' })]],
      ['almacen', 'Almacén', 'Stock, lotes y compras', [
        N('Inventario y lotes', 'Stock por lote', IC.inv, { to: 'inventario', badge: '6 bajos' }),
        N('Kardex', 'Historial por producto y lote', IC.kardex, { to: 'kardex' }),
        N('Compras', 'Órdenes de compra', IC.compras, { to: 'compras', badge: '3 en camino', plain: true }),
        N('Proveedores', 'Datos y deudas', IC.prov, { to: 'compras', alt: true }),
        N('Traslados', 'Entre tienda y almacén', IC.tras, { to: 'traslados' })]],
      ['finanzas', 'Finanzas', 'Caja, cobros y gastos', [
        N('Caja del día', 'Apertura, arqueo y cierre', IC.caja, { to: 'caja', badge: 'Abierta', plain: true }),
        N('Cobranzas', 'Cuentas por cobrar', IC.cobro, { to: 'clientes', alt: true, badge: 'S/ 18k', plain: true }),
        N('Gastos', 'Luz, alquiler, sueldos', IC.gasto, { to: 'gastos', badge: '2 por pagar' }),
        N('Comprobantes SUNAT', 'Boletas y facturas', IC.sunat, { to: 'comprobantes', badge: '3 por emitir' })]],
      ['tienda', 'Tienda y marketing', 'Canales de venta', [
        N('Tienda web', 'viaprovisiones.com', IC.tienda, { href: '/tienda' }),
        N('Enlaces y QR', 'Página del QR y redes', IC.qr, { href: '/enlaces' }),
        N('Ofertas y cupones', 'Descuentos y packs', IC.oferta, { to: 'ofertas', badge: '3 activas', plain: true }),
        N('Banners de la tienda', 'Portada y anuncios', IC.banner, { to: 'banners' })]],
      ['analisis', 'Análisis', 'Cómo va el negocio', [
        N('Panel de inicio', 'Resumen del día', IC.inicio, { to: 'inicio' }),
        N('Reportes', 'Ventas y márgenes', IC.reportes, { to: 'reportes' })]],
      ['cuenta', 'Cuenta', 'Configuración', [
        N('Notificaciones y perfil', 'Avisos y tu cuenta', IC.notif, { to: 'notificaciones', badge: '5 sin leer' }),
        N('Ajustes', 'Negocio, pagos, envíos', IC.ajustes, { to: 'ajustes' }),
        N('Usuarios y roles', 'Quién ve qué', IC.users, { to: 'ajustes', alt: true })]]
    ];
    const card = (it, groupName) => {
      const here = !!it.to && HERE.indexOf(it.to) >= 0;
      const on = here && !it.alt && st.screen === it.to;
      const href = it.href || (it.to && !here ? MOVIL[it.to] : '');
      return {
        label: it.label, sub: it.sub, icon: it.icon, group: groupName || '',
        isScreen: here, isLink: !here, href,
        current: on ? 'page' : 'false',
        bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111', subFg: on ? '#BDBDBD' : '#8C8C8C',
        iconBg: on ? '#E8701F' : '#FFFFFF', iconFg: on ? '#FFFFFF' : '#111111',
        badge: it.badge || '',
        badgeBg: on ? '#2A2A2A' : (it.plain ? '#FFFFFF' : '#FFF1E6'), badgeFg: on ? '#FFFFFF' : (it.plain ? '#6B6B6B' : '#8A3B0A'),
        pick: here ? go(it.to) : () => {}
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

    // Barras inferiores
    const curTab = ['pedidodetalle', 'kardex', 'traslados'].indexOf(st.screen) >= 0 ? st.screen : 'mas';
    const isPed = st.screen === 'pedidodetalle';
    const isProd = st.screen === 'productoeditar';
    const showActions = isPed || isProd;
    const FAB = { kardex: 'Registrar ajuste', traslados: 'Nuevo traslado', devoluciones: 'Registrar devolución' };
    const actions = isPed
      ? [['Guía', IC.print, false, () => this.setState({ toast: 'Guía de #1041 lista para imprimir (ejemplo).' })], ['WhatsApp', IC.wa, false, () => this.setState({ toast: 'Resumen de #1041 enviado por WhatsApp (ejemplo).' })], ['Devolución', IC.devol, true, () => this.setState({ screen: 'devoluciones', dsel: 'DEV-032', toast: '' })]]
      : [['Ver en tienda', IC.tienda, false, () => this.setState({ toast: 'Se abriría la ficha en la tienda (ejemplo).' })], ['Guardar', IC.save, true, () => this.setState({ toast: 'Producto guardado · ' + st.pstatus + '.' })]];

    return {
      accent: this.props.accent ?? '#FF914C',
      title: m[0], subtitle: m[1],
      backToList: isPed, backToKardex: isProd, showLogo: !isPed && !isProd,
      goKardex: go('kardex'), goProducto: go('productoeditar'),
      padBottom: showActions ? '180px' : '120px',
      toast: st.toast,
      closeToast: () => this.setState({ toast: '' }),
      isPedido: isPed, isKardex: st.screen === 'kardex', isTraslados: st.screen === 'traslados', isDevoluciones: st.screen === 'devoluciones', isProducto: isProd,
      ped, advance: () => { const n = Math.min(st.stage + 1, FLOW.length - 1); this.setState({ stage: n, toast: 'Pedido #1041 pasó a ' + FLOW[n][0] + '.' }); },
      emitDoc: () => this.setState({ docDone: true, toast: 'Factura F001-00088 emitida (ejemplo).' }),
      kx, tr, dv, pe,
      closeTransfer: () => this.setState({ tsel: '' }),
      sendTransfer: () => this.setState({ tstage: { ...st.tstage, [st.tsel]: 1 }, toast: st.tsel + ' salió hacia su destino.' }),
      receiveTransfer: () => this.setState({ tstage: { ...st.tstage, [st.tsel]: 2 }, toast: st.tsel + ' recibido.' }),
      closeCase: () => this.setState({ dsel: '' }),
      decideChange: decide('change'), decideRefund: decide('refund'), decideReject: decide('reject'),
      uploadPhoto: () => this.setState({ toast: 'Se abriría la cámara o la galería (ejemplo).' }),
      showActions,
      actions: actions.map((a) => ({ label: a[0], icon: a[1], bg: a[2] ? '#E8701F' : '#F4F4F2', fg: a[2] ? '#FFFFFF' : '#111111', flex: a[2] ? '1.4 1 0' : '1 1 0', pick: a[3] })),
      showFab: !showActions,
      fabLabel: FAB[st.screen] || 'Nuevo',
      fabAct: () => this.setState({ toast: (FAB[st.screen] || 'Nuevo') + ': se abriría el formulario (ejemplo).' }),
      menuOpen: st.menu,
      openMenu: () => this.setState({ menu: true, q: '' }),
      closeMenu: () => this.setState({ menu: false }),
      tabs: [['pedidodetalle', 'Pedido', IC.pedidos], ['kardex', 'Kardex', IC.kardex], ['traslados', 'Traslados', IC.tras], ['mas', 'Más', IC.mas]].map((t) => {
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
      quick: [['Vender', 'M12 5v14M5 12h14', true, '/movil/finanzas'], ['Ingresar lote', IC.inv], ['Nuevo traslado', IC.tras], ['Orden de compra', IC.compras]].map((a) => ({
        label: a[0], icon: a[1], bg: a[2] ? '#E8701F' : '#F4F4F2', fg: a[2] ? '#FFFFFF' : '#111111',
        pick: a[0] === 'Nuevo traslado' ? () => this.setState({ screen: 'traslados', tsel: '', menu: false, toast: 'Nuevo traslado: se abriría el formulario (ejemplo).' }) : () => this.setState({ menu: false, toast: a[0] + ': se abriría el formulario (ejemplo).' })
      }))
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function MovilAlmacen(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:inherit}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "height": "100vh", "height": "100dvh", "margin": "0 auto", "borderRadius": "24px", "overflow": "hidden", "background": "#E9E9E7", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "absolute", "top": "0", "left": "0", "right": "0", "zIndex": "5", "padding": "16px 16px 12px", "display": "flex", "alignItems": "center", "gap": "10px", "background": "#E9E9E7" }}>
        {Boolean(lookup(v, "backToList")) && (
          <Fragment>
            <a href={"/admin/movil"} aria-label={"Volver a pedidos"} style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M15 6l-6 6 6 6"}></path>
              </svg>
            </a>
          </Fragment>
        )}
        {Boolean(lookup(v, "backToKardex")) && (
          <Fragment>
            <button onClick={lookup(v, "goKardex")} aria-label={"Volver al kardex"} style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                <path d={"M15 6l-6 6 6 6"}></path>
              </svg>
            </button>
          </Fragment>
        )}
        <button onClick={lookup(v, "openMenu")} aria-label={"Abrir menú"} style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
            <path d={"M4 8h16M4 16h10"}></path>
          </svg>
        </button>
        {Boolean(lookup(v, "showLogo")) && (
          <Fragment>
            <span style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
              <svg width={"26"} height={"26"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                <clipPath id={"via-clip-malm"}>
                  <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                </clipPath>
                <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                <path clipPath={"url(#via-clip-malm)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
              </svg>
            </span>
          </Fragment>
        )}
        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
          <span style={{ "fontSize": "15px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
            {lookup(v, "title")}
          </span>
          <span style={{ "fontSize": "13px", "fontWeight": "500", "color": "#8C8C8C", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
            {lookup(v, "subtitle")}
          </span>
        </span>
        <span style={{ "width": "46px", "height": "46px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "14px", "fontWeight": "800", "flex": "none" }}>
          {"BC"}
        </span>
      </div>
      <div className={"noscroll"} style={{ "position": "absolute", "inset": "0", "overflowY": "auto", "padding": "82px 14px " + String(lookup(v, "padBottom") ?? ""), "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
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
        {Boolean(lookup(v, "isPedido")) && (
          <Fragment>
            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "padding": "4px 4px 2px" }}>
              <span style={{ "fontSize": "26px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                {"Bodega San Martín"}
              </span>
              <span style={{ "fontSize": "26px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                {lookup(v, "ped.total")}
                {" · "}
                {lookup(v, "ped.status")}
              </span>
            </span>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <div style={{ "display": "flex", "alignItems": "flex-start", "gap": "4px" }}>
                {(lookup(v, "ped.steps") || []).map((s, index1) => (
                  <Fragment key={index1}>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "6px", "textAlign": "center" }}>
                      <span style={{ "width": "100%", "display": "flex", "alignItems": "center" }}>
                        <span style={{ "flex": "1", "height": "3px", "background": lookup(s, "lineL") }}></span>
                        <span style={{ "width": "28px", "height": "28px", "borderRadius": "50%", "background": lookup(s, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "fg")} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "height": "3px", "background": lookup(s, "lineR") }}></span>
                      </span>
                      <span style={{ "fontSize": "10px", "fontWeight": "700", "lineHeight": "1.2" }}>
                        {lookup(s, "label")}
                      </span>
                      <span style={{ "fontSize": "9px", "color": "#8C8C8C" }}>
                        {lookup(s, "time")}
                      </span>
                    </span>
                  </Fragment>
                ))}
              </div>
              {Boolean(lookup(v, "ped.canAdvance")) && (
                <Fragment>
                  <button onClick={lookup(v, "advance")} style={{ "height": "48px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700", "cursor": "pointer" }}>
                    {"Avanzar a "}
                    {lookup(v, "ped.next")}
                  </button>
                </Fragment>
              )}
              {Boolean(lookup(v, "ped.done")) && (
                <Fragment>
                  <span style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "height": "48px", "borderRadius": "999px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "14px", "fontWeight": "700" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                    {"Pedido entregado"}
                  </span>
                </Fragment>
              )}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Productos"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Precio Minorista"}
                </span>
              </span>
              {(lookup(v, "ped.lines") || []).map((l, index2) => (
                <Fragment key={index2}>
                  <div style={{ "display": "flex", "gap": "12px", "alignItems": "center" }}>
                    <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "54px", "height": "54px", "borderRadius": "16px", "objectFit": "cover", "background": "#F4F4F2", "flex": "none" }} />
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700", "lineHeight": "1.25" }}>
                        {lookup(l, "name")}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(l, "qty")}
                        {" × "}
                        {lookup(l, "price")}
                      </span>
                      <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "10px", "fontWeight": "700" }}>
                        <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M12 7v5l3 2"}></path>
                        </svg>
                        {"Sale del lote "}
                        {lookup(l, "lot")}
                        {" · PEPS"}
                      </span>
                    </span>
                    <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                      {lookup(l, "sub")}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
              <span style={{ "fontSize": "14px", "fontWeight": "700", "paddingBottom": "4px" }}>
                {"Resumen"}
              </span>
              {(lookup(v, "ped.summary") || []).map((r, index3) => (
                <Fragment key={index3}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                    <span style={{ "color": "#BDBDBD" }}>
                      {lookup(r, "k")}
                    </span>
                    <span style={{ "fontWeight": "700" }}>
                      {lookup(r, "v")}
                    </span>
                  </span>
                </Fragment>
              ))}
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "paddingTop": "10px", "borderTop": "1px solid #2A2A2A" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Total"}
                </span>
                <span style={{ "fontSize": "26px", "fontWeight": "800" }}>
                  <span style={{ "color": "#FF914C" }}>
                    {"S/"}
                  </span>
                  {" "}
                  {lookup(v, "ped.totalNum")}
                </span>
              </span>
            </div>
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px" }}>
              <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Pago"}
                </span>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Transferencia"}
                </span>
                <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                  {"26 oct · 09:58"}
                </span>
                <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "10px", "fontWeight": "700" }}>
                  <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 12l5 5 9-10"}></path>
                  </svg>
                  {"Verificado · Beltran C."}
                </span>
              </div>
              <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                  {"Entrega"}
                </span>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Delivery Arequipa"}
                </span>
                <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                  {"[DIRECCIÓN] · 27 oct, mañana"}
                </span>
                <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                  {"Motorizado [NOMBRE]"}
                </span>
              </div>
            </div>
            <div style={{ "borderRadius": "24px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "alignItems": "center", "gap": "12px" }}>
              <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": "#F4F4F2", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M7 3h7l5 5v13H7zM14 3v5h5M10 14l2 2 4-4"}></path>
                </svg>
              </span>
              <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                  {"Factura F001-00088"}
                </span>
                <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                  {lookup(v, "ped.docState")}
                </span>
              </span>
              {Boolean(lookup(v, "ped.docPending")) && (
                <Fragment>
                  <button onClick={lookup(v, "emitDoc")} style={{ "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                    {"Emitir"}
                  </button>
                </Fragment>
              )}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "0" }}>
              <span style={{ "fontSize": "14px", "fontWeight": "700", "paddingBottom": "10px" }}>
                {"Línea de tiempo"}
              </span>
              {(lookup(v, "ped.timeline") || []).map((t, index4) => (
                <Fragment key={index4}>
                  <div style={{ "display": "flex", "gap": "12px" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "flex": "none" }}>
                      <span style={{ "width": "12px", "height": "12px", "borderRadius": "50%", "background": lookup(t, "dot"), "marginTop": "3px" }}></span>
                      <span style={{ "flex": "1", "width": "2px", "background": "#EFEFEC", "minHeight": "22px" }}></span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "paddingBottom": "12px" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(t, "label")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(t, "meta")}
                      </span>
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "isKardex")) && (
          <Fragment>
            <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
              {(lookup(v, "kx.prods") || []).map((p, index5) => (
                <Fragment key={index5}>
                  <button onClick={lookup(p, "pick")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "46px", "padding": "0 14px 0 5px", "borderRadius": "999px", "border": "none", "background": lookup(p, "bg"), "color": lookup(p, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer", "whiteSpace": "nowrap" }}>
                    <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "objectFit": "cover" }} />
                    {lookup(p, "short")}
                  </button>
                </Fragment>
              ))}
            </div>
            <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.15", "padding": "2px 4px" }}>
              <span style={{ "fontSize": "22px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                {lookup(v, "kx.name")}
              </span>
              <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                {"Octubre · método PEPS"}
              </span>
            </span>
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
              {(lookup(v, "kx.stats") || []).map((s, index6) => (
                <Fragment key={index6}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "14px", "borderRadius": "22px", "background": lookup(s, "bg"), "color": lookup(s, "fg") }}>
                    <span style={{ "fontSize": "11px", "color": lookup(s, "sub") }}>
                      {lookup(s, "k")}
                    </span>
                    <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                      {lookup(s, "v")}
                    </span>
                    <span style={{ "fontSize": "11px", "color": lookup(s, "sub") }}>
                      {lookup(s, "money")}
                    </span>
                  </span>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Stock en el mes"}
                </span>
                <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                  {"mínimo "}
                  {lookup(v, "kx.min")}
                  {" u."}
                </span>
              </span>
              <svg viewBox={"0 0 320 120"} width={"100%"} height={"120"} role={"img"} aria-label={lookup(v, "kx.aria")}>
                <line x1={"0"} y1={lookup(v, "kx.minY")} x2={"320"} y2={lookup(v, "kx.minY")} stroke={"#BDBDBD"} strokeWidth={"1.5"} strokeDasharray={"5 5"}></line>
                <polyline points={lookup(v, "kx.points")} fill={"none"} stroke={"#E8701F"} strokeWidth={"3"} strokeLinejoin={"round"} strokeLinecap={"round"}></polyline>
                <circle cx={lookup(v, "kx.endX")} cy={lookup(v, "kx.endY")} r={"5"} fill={"#E8701F"}></circle>
                <text x={"4"} y={lookup(v, "kx.startLabelY")} fontSize={"11"} fontWeight={"700"} fill={"#6B6B6B"} fontFamily={"Manrope, sans-serif"}>
                  {lookup(v, "kx.startLabel")}
                </text>
                <text x={"316"} y={lookup(v, "kx.endLabelY")} textAnchor={"end"} fontSize={"12"} fontWeight={"800"} fill={"#111111"} fontFamily={"Manrope, sans-serif"}>
                  {lookup(v, "kx.endLabel")}
                </text>
              </svg>
              <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "10px", "color": "#8C8C8C" }}>
                <span>
                  {"1 oct"}
                </span>
                <span>
                  {"15 oct"}
                </span>
                <span>
                  {"31 oct"}
                </span>
              </span>
            </div>
            <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
              {(lookup(v, "kx.lotChips") || []).map((c, index7) => (
                <Fragment key={index7}>
                  <button onClick={lookup(c, "pick")} style={{ "flex": "none", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                    {lookup(c, "label")}
                  </button>
                </Fragment>
              ))}
            </div>
            {(lookup(v, "kx.moves") || []).map((m, index8) => (
              <Fragment key={index8}>
                <div style={{ "borderRadius": "22px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "alignItems": "center", "gap": "12px" }}>
                  <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(m, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(m, "fg")} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={lookup(m, "icon")}></path>
                    </svg>
                  </span>
                  <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "display": "flex", "alignItems": "center", "gap": "6px" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "700", "color": lookup(m, "fg") }}>
                        {lookup(m, "type")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                        {lookup(m, "date")}
                      </span>
                    </span>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {lookup(m, "doc")}
                      {" · "}
                      {lookup(m, "lot")}
                    </span>
                    <span style={{ "fontSize": "11px", "color": "#6B6B6B", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                      {lookup(m, "note")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "2px", "flex": "none" }}>
                    <span style={{ "fontSize": "16px", "fontWeight": "800", "color": lookup(m, "qtyFg") }}>
                      {lookup(m, "qty")}
                    </span>
                    <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                      {"saldo "}
                      {lookup(m, "bal")}
                    </span>
                  </span>
                </div>
              </Fragment>
            ))}
            {Boolean(lookup(v, "kx.empty")) && (
              <Fragment>
                <div style={{ "padding": "22px", "borderRadius": "22px", "background": "#FFFFFF", "textAlign": "center", "fontSize": "13px", "color": "#6B6B6B" }}>
                  {"Este lote no tiene movimientos en octubre."}
                </div>
              </Fragment>
            )}
            <button onClick={lookup(v, "goProducto")} style={{ "height": "48px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "cursor": "pointer" }}>
              {"Editar este producto"}
            </button>
          </Fragment>
        )}
        {Boolean(lookup(v, "isTraslados")) && (
          <Fragment>
            {Boolean(lookup(v, "tr.list")) && (
              <Fragment>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "10px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
                  {(lookup(v, "tr.locs") || []).map((l, index9) => (
                    <Fragment key={index9}>
                      <div style={{ "flex": "none", "width": "210px", "borderRadius": "24px", "background": lookup(l, "bg"), "color": lookup(l, "fg"), "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                          <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(l, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(l, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(l, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(l, "name")}
                            </span>
                            <span style={{ "fontSize": "10px", "color": lookup(l, "sub") }}>
                              {lookup(l, "addr")}
                            </span>
                          </span>
                        </span>
                        <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                          {lookup(l, "units")}
                          {" u."}
                        </span>
                        <span style={{ "fontSize": "11px", "color": lookup(l, "sub") }}>
                          {lookup(l, "value")}
                          {" · "}
                          {lookup(l, "lots")}
                        </span>
                        <span style={{ "height": "6px", "borderRadius": "999px", "background": lookup(l, "track") }}>
                          <span style={{ "display": "block", "width": lookup(l, "cap"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                        </span>
                        <span style={{ "fontSize": "10px", "color": lookup(l, "sub") }}>
                          {lookup(l, "cap")}
                          {" del espacio ocupado"}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <span style={{ "fontSize": "15px", "fontWeight": "700", "padding": "4px 4px 0" }}>
                  {"Traslados recientes"}
                </span>
                {(lookup(v, "tr.items") || []).map((t, index10) => (
                  <Fragment key={index10}>
                    <button onClick={lookup(t, "open")} style={{ "borderRadius": "22px", "border": "none", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "8px", "fontFamily": "inherit", "textAlign": "left", "cursor": "pointer", "color": "#111111" }}>
                      <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "width": "100%" }}>
                        <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                          {lookup(t, "id")}
                        </span>
                        <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                          {lookup(t, "date")}
                        </span>
                        <span style={{ "flex": "1" }}></span>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "24px", "padding": "0 9px", "borderRadius": "999px", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "fontSize": "10px", "fontWeight": "700" }}>
                          <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(t, "icon")}></path>
                          </svg>
                          {lookup(t, "state")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(t, "from")}
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#E8701F"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                        </svg>
                        {lookup(t, "to")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(t, "summary")}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </Fragment>
            )}
            {Boolean(lookup(v, "tr.detail")) && (
              <Fragment>
                <button onClick={lookup(v, "closeTransfer")} style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "36px", "padding": "0 14px 0 10px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M15 6l-6 6 6 6"}></path>
                  </svg>
                  {"Todos los traslados"}
                </button>
                <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                    <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                      {lookup(v, "tr.sel.id")}
                    </span>
                    <span style={{ "flex": "1" }}></span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(v, "tr.sel.bg"), "color": lookup(v, "tr.sel.fg"), "fontSize": "11px", "fontWeight": "700" }}>
                      <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(v, "tr.sel.icon")}></path>
                      </svg>
                      {lookup(v, "tr.sel.state")}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "16px", "fontWeight": "700" }}>
                    {lookup(v, "tr.sel.from")}
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FF914C"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                    </svg>
                    {lookup(v, "tr.sel.to")}
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                    {lookup(v, "tr.sel.date")}
                    {" · "}
                    {lookup(v, "tr.sel.reason")}
                    {" · "}
                    {lookup(v, "tr.sel.who")}
                  </span>
                </div>
                {(lookup(v, "tr.sel.lines") || []).map((l, index11) => (
                  <Fragment key={index11}>
                    <div style={{ "borderRadius": "22px", "background": "#FFFFFF", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                          {lookup(l, "name")}
                        </span>
                        <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#C2410C", "whiteSpace": "nowrap" }}>
                          {"Lote "}
                          {lookup(l, "lot")}
                        </span>
                      </span>
                      <span style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                        <span style={{ "display": "flex", "flexDirection": "column", "padding": "10px", "borderRadius": "16px", "background": "#F4F4F2" }}>
                          <span style={{ "fontSize": "10px", "color": "#6B6B6B" }}>
                            {"Enviado"}
                          </span>
                          <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                            {lookup(l, "sent")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "padding": "10px", "borderRadius": "16px", "background": "#F4F4F2" }}>
                          <span style={{ "fontSize": "10px", "color": "#6B6B6B" }}>
                            {"Recibido"}
                          </span>
                          <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                            {lookup(l, "recv")}
                          </span>
                        </span>
                      </span>
                      <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "24px", "padding": "0 9px", "borderRadius": "999px", "background": lookup(l, "bg"), "color": lookup(l, "fg"), "fontSize": "10px", "fontWeight": "700" }}>
                        <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(l, "icon")}></path>
                        </svg>
                        {lookup(l, "diff")}
                      </span>
                    </div>
                  </Fragment>
                ))}
                {Boolean(lookup(v, "tr.sel.canSend")) && (
                  <Fragment>
                    <button onClick={lookup(v, "sendTransfer")} style={{ "height": "50px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700", "cursor": "pointer" }}>
                      {"Marcar como enviado"}
                    </button>
                  </Fragment>
                )}
                {Boolean(lookup(v, "tr.sel.canReceive")) && (
                  <Fragment>
                    <button onClick={lookup(v, "receiveTransfer")} style={{ "height": "50px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700", "cursor": "pointer" }}>
                      {"Confirmar recepción"}
                    </button>
                  </Fragment>
                )}
                {Boolean(lookup(v, "tr.sel.hasDiff")) && (
                  <Fragment>
                    <div role={"alert"} style={{ "display": "flex", "gap": "10px", "alignItems": "center", "padding": "12px 14px", "borderRadius": "18px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "12px", "fontWeight": "600" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                        <path d={"M12 7v6M12 17h.01"}></path>
                      </svg>
                      {"Llegaron menos unidades de las enviadas. Revisa con quien llevó el traslado."}
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
        {Boolean(lookup(v, "isDevoluciones")) && (
          <Fragment>
            {Boolean(lookup(v, "dv.list")) && (
              <Fragment>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "8px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "12px", "borderRadius": "20px", "background": "#111111", "color": "#FFFFFF" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                      {lookup(v, "dv.open")}
                    </span>
                    <span style={{ "fontSize": "11px", "color": "#BDBDBD" }}>
                      {"abiertas"}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "12px", "borderRadius": "20px", "background": "#FFFFFF" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                      {"1.8 %"}
                    </span>
                    <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                      {"tasa del mes"}
                    </span>
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "12px", "borderRadius": "20px", "background": "#FFFFFF" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                      {"S/ 312"}
                    </span>
                    <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                      {"reembolsado"}
                    </span>
                  </span>
                </div>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
                  {(lookup(v, "dv.chips") || []).map((c, index12) => (
                    <Fragment key={index12}>
                      <button onClick={lookup(c, "pick")} style={{ "flex": "none", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                        {lookup(c, "label")}
                        {" · "}
                        {lookup(c, "n")}
                      </button>
                    </Fragment>
                  ))}
                </div>
                {(lookup(v, "dv.cases") || []).map((d, index13) => (
                  <Fragment key={index13}>
                    <button onClick={lookup(d, "open")} style={{ "borderRadius": "22px", "border": "none", "background": "#FFFFFF", "padding": "12px", "display": "flex", "gap": "12px", "alignItems": "center", "fontFamily": "inherit", "textAlign": "left", "cursor": "pointer", "color": "#111111" }}>
                      <img src={assetSrc(lookup(d, "img"))} alt={""} style={{ "width": "56px", "height": "56px", "borderRadius": "16px", "objectFit": "cover", "background": "#F4F4F2", "flex": "none" }} />
                      <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                        <span style={{ "display": "flex", "gap": "6px", "alignItems": "baseline" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                            {lookup(d, "id")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                            {lookup(d, "date")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                          {lookup(d, "product")}
                        </span>
                        <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                          {lookup(d, "client")}
                          {" · "}
                          {lookup(d, "type")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "6px", "flex": "none" }}>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "22px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(d, "bg"), "color": lookup(d, "fg"), "fontSize": "10px", "fontWeight": "700" }}>
                          <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(d, "icon")}></path>
                          </svg>
                          {lookup(d, "state")}
                        </span>
                        <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                          {lookup(d, "amount")}
                        </span>
                      </span>
                    </button>
                  </Fragment>
                ))}
                {Boolean(lookup(v, "dv.empty")) && (
                  <Fragment>
                    <div style={{ "padding": "22px", "borderRadius": "22px", "background": "#FFFFFF", "textAlign": "center", "fontSize": "13px", "color": "#6B6B6B" }}>
                      {"No hay casos en este estado."}
                    </div>
                  </Fragment>
                )}
              </Fragment>
            )}
            {Boolean(lookup(v, "dv.detail")) && (
              <Fragment>
                <button onClick={lookup(v, "closeCase")} style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "36px", "padding": "0 14px 0 10px", "borderRadius": "999px", "border": "none", "background": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M15 6l-6 6 6 6"}></path>
                  </svg>
                  {"Todos los casos"}
                </button>
                <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "gap": "12px", "alignItems": "center" }}>
                    <img src={assetSrc(lookup(v, "dv.sel.img"))} alt={""} style={{ "width": "70px", "height": "70px", "borderRadius": "18px", "objectFit": "cover", "background": "#F4F4F2", "flex": "none" }} />
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                        {lookup(v, "dv.sel.id")}
                      </span>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(v, "dv.sel.product")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(v, "dv.sel.qty")}
                        {" · lote "}
                        {lookup(v, "dv.sel.lot")}
                      </span>
                    </span>
                  </span>
                  <span style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(v, "dv.sel.bg"), "color": lookup(v, "dv.sel.fg"), "fontSize": "11px", "fontWeight": "700" }}>
                      <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(v, "dv.sel.icon")}></path>
                      </svg>
                      {lookup(v, "dv.sel.state")}
                    </span>
                    <span style={{ "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "11px", "fontWeight": "700", "display": "inline-flex", "alignItems": "center" }}>
                      {lookup(v, "dv.sel.type")}
                    </span>
                    <span style={{ "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "11px", "fontWeight": "700", "display": "inline-flex", "alignItems": "center" }}>
                      {lookup(v, "dv.sel.reason")}
                    </span>
                  </span>
                  <span style={{ "fontSize": "12px", "color": "#444444", "lineHeight": "1.45" }}>
                    {"“"}
                    {lookup(v, "dv.sel.comment")}
                    {"” — "}
                    {lookup(v, "dv.sel.client")}
                    {", pedido "}
                    {lookup(v, "dv.sel.order")}
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "11px" }}>
                      <span style={{ "color": "#6B6B6B" }}>
                        {lookup(v, "dv.sel.termLabel")}
                      </span>
                      <span style={{ "fontWeight": "700", "color": lookup(v, "dv.sel.termFg") }}>
                        {lookup(v, "dv.sel.termState")}
                      </span>
                    </span>
                    <span style={{ "height": "8px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                      <span style={{ "display": "block", "width": lookup(v, "dv.sel.termW"), "height": "100%", "borderRadius": "999px", "background": lookup(v, "dv.sel.termBar") }}></span>
                    </span>
                  </span>
                </div>
                {Boolean(lookup(v, "dv.sel.canDecide")) && (
                  <Fragment>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "8px" }}>
                      <button onClick={lookup(v, "decideChange")} style={{ "height": "54px", "borderRadius": "18px", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                        {"Aprobar cambio"}
                      </button>
                      <button onClick={lookup(v, "decideRefund")} style={{ "height": "54px", "borderRadius": "18px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                        {"Reembolsar"}
                      </button>
                      <button onClick={lookup(v, "decideReject")} style={{ "height": "54px", "borderRadius": "18px", "border": "1px solid #DCDCD8", "background": "#FFFFFF", "color": "#8E1C14", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                        {"Rechazar"}
                      </button>
                    </div>
                  </Fragment>
                )}
                <div style={{ "borderRadius": "24px", "background": "#111111", "color": "#FFFFFF", "padding": "16px", "display": "flex", "gap": "12px", "alignItems": "flex-start" }}>
                  <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": "#2A2A2A", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FF914C"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"}></path>
                    </svg>
                  </span>
                  <span style={{ "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                    <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                      {"Qué pasa con el stock"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#CFCFCF", "lineHeight": "1.45" }}>
                      {lookup(v, "dv.sel.stock")}
                    </span>
                  </span>
                </div>
                {Boolean(lookup(v, "dv.sel.refunded")) && (
                  <Fragment>
                    <a href={"/movil/finanzas"} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "height": "46px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Ver la nota de crédito en Comprobantes"}
                    </a>
                  </Fragment>
                )}
              </Fragment>
            )}
          </Fragment>
        )}
        {Boolean(lookup(v, "isProducto")) && (
          <Fragment>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "10px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <img src={assetSrc(lookup(v, "pe.photo"))} alt={"Foto principal del producto"} style={{ "width": "100%", "height": "230px", "borderRadius": "20px", "objectFit": "cover", "background": "#F4F4F2" }} />
              <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto" }}>
                {(lookup(v, "pe.photos") || []).map((p, index14) => (
                  <Fragment key={index14}>
                    <button onClick={lookup(p, "pick")} aria-label={lookup(p, "aria")} style={{ "flex": "none", "width": "62px", "height": "62px", "padding": "0", "borderRadius": "16px", "border": "2px solid " + String(lookup(p, "border") ?? ""), "background": "#F4F4F2", "cursor": "pointer", "overflow": "hidden" }}>
                      <img src={assetSrc(lookup(p, "src"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />
                    </button>
                  </Fragment>
                ))}
                <button onClick={lookup(v, "uploadPhoto")} aria-label={"Subir fotos"} style={{ "flex": "none", "width": "62px", "height": "62px", "borderRadius": "16px", "border": "1px dashed #BDBDBD", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto", "margin": "0 -14px", "padding": "0 14px" }}>
              {(lookup(v, "pe.statuses") || []).map((s, index15) => (
                <Fragment key={index15}>
                  <button onClick={lookup(s, "pick")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "38px", "padding": "0 14px 0 11px", "borderRadius": "999px", "border": "none", "background": lookup(s, "bg"), "color": lookup(s, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                    <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={lookup(s, "icon")}></path>
                    </svg>
                    {lookup(s, "label")}
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                {"Información"}
              </span>
              <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                {"Nombre"}
                <input value={(lookup(v, "pe.name") ?? "")} onChange={lookup(v, "pe.onName")} style={{ "height": "46px", "border": "1px solid #DCDCD8", "borderRadius": "14px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "14px", "color": "#111111" }} />
              </label>
              <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "600", "color": "#6B6B6B" }}>
                {"Descripción"}
                <textarea rows={"3"} style={{ "border": "1px solid #DCDCD8", "borderRadius": "14px", "padding": "12px 14px", "fontFamily": "inherit", "fontSize": "13px", "color": "#111111", "resize": "none" }} defaultValue={"Luz LED blanca con 3 modos, batería recargable por USB-C y gancho para colgar. Ideal para camping y cortes de luz."}></textarea>
              </label>
              <span style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px 12px", "borderRadius": "14px", "background": "#F4F4F2" }}>
                  <span style={{ "fontSize": "10px", "color": "#6B6B6B" }}>
                    {"SKU"}
                  </span>
                  <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                    {"CAM-LAM-004"}
                  </span>
                </span>
                <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px 12px", "borderRadius": "14px", "background": "#F4F4F2" }}>
                  <span style={{ "fontSize": "10px", "color": "#6B6B6B" }}>
                    {"Marca"}
                  </span>
                  <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                    {"[MARCA]"}
                  </span>
                </span>
              </span>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Precios por lista"}
                </span>
                <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                  {"Costo promedio "}
                  {lookup(v, "pe.cost")}
                </span>
              </span>
              {(lookup(v, "pe.tiers") || []).map((t, index16) => (
                <Fragment key={index16}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(t, "label")}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {lookup(t, "min")}
                      </span>
                    </span>
                    <label style={{ "display": "flex", "alignItems": "center", "gap": "4px", "width": "104px", "height": "42px", "padding": "0 10px", "borderRadius": "12px", "background": "#FFFFFF", "boxSizing": "border-box" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                        {"S/"}
                      </span>
                      <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                        {"Precio "}
                        {lookup(t, "label")}
                      </span>
                      <input type={"number"} step={"0.1"} value={(lookup(t, "value") ?? "")} onChange={lookup(t, "change")} style={{ "width": "100%", "minWidth": "0", "border": "none", "fontFamily": "inherit", "fontSize": "15px", "fontWeight": "800", "outline": "none" }} />
                    </label>
                    <span style={{ "width": "74px", "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "gap": "2px" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                        {lookup(t, "margin")}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "3px", "fontSize": "10px", "fontWeight": "700", "color": lookup(t, "fg") }}>
                        <svg width={"10"} height={"10"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(t, "icon")}></path>
                        </svg>
                        {lookup(t, "state")}
                      </span>
                    </span>
                  </div>
                </Fragment>
              ))}
              <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                {"Precio mínimo sin perder: "}
                {lookup(v, "pe.cost")}
              </span>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                {"Variantes"}
              </span>
              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                {"Color"}
              </span>
              <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                {(lookup(v, "pe.colors") || []).map((c, index17) => (
                  <Fragment key={index17}>
                    <button onClick={lookup(c, "toggle")} aria-pressed={lookup(c, "pressed")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                      {lookup(c, "label")}
                    </button>
                  </Fragment>
                ))}
              </div>
              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                {"Capacidad"}
              </span>
              <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                {(lookup(v, "pe.caps") || []).map((c, index18) => (
                  <Fragment key={index18}>
                    <button onClick={lookup(c, "toggle")} aria-pressed={lookup(c, "pressed")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer" }}>
                      {lookup(c, "label")}
                    </button>
                  </Fragment>
                ))}
              </div>
              <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C" }}>
                {lookup(v, "pe.variantCount")}
              </span>
            </div>
            <div style={{ "borderRadius": "26px", "background": "#111111", "color": "#FFFFFF", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
              <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                  {"Stock y lotes"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                  {"Tienda · B2"}
                </span>
              </span>
              <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                <span style={{ "fontSize": "30px", "fontWeight": "800" }}>
                  {"64"}
                </span>
                <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                  {"unidades"}
                </span>
                <span style={{ "flex": "1" }}></span>
                <span style={{ "display": "flex", "alignItems": "center", "gap": "6px", "height": "40px", "padding": "0 6px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                  <button onClick={lookup(v, "pe.minDown")} aria-label={"Bajar mínimo"} style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontSize": "16px", "cursor": "pointer" }}>
                    {"−"}
                  </button>
                  <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                    {"mín. "}
                    {lookup(v, "pe.min")}
                  </span>
                  <button onClick={lookup(v, "pe.minUp")} aria-label={"Subir mínimo"} style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "fontSize": "16px", "cursor": "pointer" }}>
                    {"+"}
                  </button>
                </span>
              </span>
              {Boolean(lookup(v, "pe.low")) && (
                <Fragment>
                  <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "12px", "fontWeight": "700", "color": "#FFB020" }}>
                    <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 7v6M12 17h.01"}></path>
                    </svg>
                    {"Stock bajo: ya alcanzó el mínimo"}
                  </span>
                </Fragment>
              )}
              {(lookup(v, "pe.lots") || []).map((l, index19) => (
                <Fragment key={index19}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px", "borderRadius": "16px", "background": "#1E1E1E" }}>
                    <span style={{ "width": "28px", "height": "28px", "borderRadius": "50%", "background": lookup(l, "numBg"), "color": lookup(l, "numFg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "12px", "fontWeight": "800", "flex": "none" }}>
                      {lookup(l, "n")}
                    </span>
                    <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {lookup(l, "code")}
                        {" · "}
                        {lookup(l, "left")}
                        {" u."}
                      </span>
                      <span style={{ "fontSize": "11px", "color": "#9A9A9A" }}>
                        {lookup(l, "meta")}
                      </span>
                    </span>
                    <span style={{ "fontSize": "11px", "fontWeight": "700", "color": lookup(l, "tagFg") }}>
                      {lookup(l, "tag")}
                    </span>
                  </div>
                </Fragment>
              ))}
            </div>
          </Fragment>
        )}
      </div>
      {Boolean(lookup(v, "showActions")) && (
        <Fragment>
          <div style={{ "position": "absolute", "left": "14px", "right": "14px", "bottom": "96px", "zIndex": "6", "display": "flex", "gap": "8px", "padding": "8px", "borderRadius": "999px", "background": "#FFFFFF", "boxShadow": "0 10px 28px rgba(17,17,17,0.14)" }}>
            {(lookup(v, "actions") || []).map((a, index20) => (
              <Fragment key={index20}>
                <button onClick={lookup(a, "pick")} style={{ "flex": lookup(a, "flex"), "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "gap": "6px", "height": "46px", "borderRadius": "999px", "border": "none", "background": lookup(a, "bg"), "color": lookup(a, "fg"), "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700", "cursor": "pointer", "whiteSpace": "nowrap" }}>
                  <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.1"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(a, "icon")}></path>
                  </svg>
                  {lookup(a, "label")}
                </button>
              </Fragment>
            ))}
          </div>
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
        {(lookup(v, "tabs") || []).map((t, index21) => (
          <Fragment key={index21}>
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
                      {(lookup(v, "chips") || []).map((c, index22) => (
                        <Fragment key={index22}>
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
                  {(lookup(v, "cards") || []).map((i, index23) => (
                    <Fragment key={index23}>
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
                              <span style={{ "width": "38px", "height": "38px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
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
                  {(lookup(v, "quick") || []).map((a, index24) => (
                    <Fragment key={index24}>
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
