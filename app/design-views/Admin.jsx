"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { inboxSel: 'i1', inboxFilter: 'Todo', orderStep: {}, done: {}, tier: 1, qty: {}, section: 'Bandeja', collapsed: false, range: 1, hover: -1, orderTab: 'Todos', prodTab: 'Todos', clientTab: 'Todos', cfgTab: 0, chat: 0, tg: {} };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const st = this.state;
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const go = (s) => () => this.setState({ section: s });
    const STATUS = {
      Pendiente: { bg: '#FFF4D6', fg: '#7A4A00', icon: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z' },
      Pagado: { bg: '#E3F1FF', fg: '#0B4A8A', icon: 'M5 12l5 5 9-10' },
      Enviado: { bg: '#EDE7FF', fg: '#4A2E9A', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7' },
      Entregado: { bg: '#E4F4E7', fg: '#1B5E20', icon: 'M5 12l5 5 9-10' },
      Cancelado: { bg: '#FDE4E2', fg: '#8E1C14', icon: 'M6 6l12 12M18 6L6 18' }
    };
    const QST = {
      Nueva: { bg: '#FFF4D6', fg: '#7A4A00', icon: 'M12 5v14M5 12h14' },
      'En revisión': { bg: '#E3F1FF', fg: '#0B4A8A', icon: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z' },
      Enviada: { bg: '#EDE7FF', fg: '#4A2E9A', icon: 'M4 12l16-8-6 16-2-6z' },
      Aceptada: { bg: '#E4F4E7', fg: '#1B5E20', icon: 'M5 12l5 5 9-10' }
    };
    const groups = [
      { title: 'General', items: [
        { label: 'Resumen', icon: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z' },
        { label: 'Pedidos', icon: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0', badge: '12' },
        { label: 'Cotizaciones', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', badge: '5', hot: true },
        { label: 'Clientes', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c1-4 4-6 7-6s6 2 7 6M16 3.5a4 4 0 0 1 0 7.5M22 21c-.6-2.6-2-4.4-4-5.3' }
      ] },
      { title: 'Catálogo', items: [
        { label: 'Productos', icon: 'M12 3l9 5v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v8' },
        { label: 'Categorías', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z' },
        { label: 'Inventario', icon: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', badge: '6', hot: true },
        { label: 'Ofertas y cupones', icon: 'M20 12l-8 8-9-9V3h8zM7.5 7.5h.01' }
      ] },
      { title: 'Canales', items: [
        { label: 'Tienda web', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18' },
        { label: 'WhatsApp', icon: 'M4 20l1.3-4A8 8 0 1 1 8 18.7z' },
        { label: 'Enlaces y QR', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2zM14 18h2' }
      ] },
      { title: 'Gestión', items: [
        { label: 'Reportes', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
        { label: 'Configuración', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z' }
      ] }
    ];
    const sec = st.section === 'Inventario' ? 'Productos' : st.section;
    const groupOf = st.section === 'Nuevo producto' ? 'Catálogo' : (groups.find((g) => g.items.some((i) => i.label === st.section)) || groups[0]).title;
    const expanded = !st.collapsed;

    // Ventas (datos de ejemplo) por periodo
    const series = [
      { title: 'de hoy por hora', ticks: ['9h', '10h', '11h', '12h', '13h', '14h', '15h', '16h', '17h', '18h', '19h', '20h'], vals: [120, 260, 340, 410, 380, 290, 330, 450, 520, 610, 480, 210], label: 'Hoy' },
      { title: 'de los últimos 7 días', ticks: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], vals: [2140, 2480, 1960, 2730, 3350, 4120, 1670], label: 'Últimos 7 días' },
      { title: 'de los últimos 30 días', ticks: Array.from({ length: 30 }, (_, i) => (i % 5 === 0 ? String(i + 1) : '')), vals: [520, 610, 480, 700, 820, 940, 560, 600, 650, 720, 880, 1010, 590, 620, 700, 760, 900, 1120, 640, 610, 730, 790, 950, 1180, 660, 700, 760, 840, 990, 1210], label: 'Últimos 30 días' },
      { title: 'del año por mes', ticks: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Dic'], vals: [14200, 13100, 15800, 16400, 17900, 16100, 18800, 19400, 18200, 20300, 0, 0], label: 'Año 2026' }
    ];
    const S = series[st.range];
    const max = Math.max(...S.vals);
    const top = Math.ceil(max / 1000) * 1000 || 1000;
    const kpiSets = [
      ['S/ 4,410.00', '31', 'S/ 142.26', '2'],
      ['S/ 18,450.00', '126', 'S/ 146.43', '5'],
      ['S/ 23,890.00', '164', 'S/ 145.67', '9'],
      ['S/ 170,200.00', '1,182', 'S/ 143.99', '41']
    ][st.range];
    const up = 'M12 19V5M5 12l7-7 7 7', down = 'M12 5v14M5 12l7 7 7-7';
    const n = S.vals.length;
    const prevVals = S.vals.map((v, i) => Math.round(v * (0.78 + 0.22 * Math.abs(Math.sin(i * 1.7 + st.range)))));
    const top2 = Math.ceil(Math.max(max, ...prevVals) / 1000) * 1000 || 1000;
    const X = (i) => (n === 1 ? 500 : (i / (n - 1)) * 1000);
    const Y = (v) => 290 - (v / top2) * 270;
    const lineOf = (arr) => arr.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ',' + Y(v).toFixed(1)).join(' ');
    const spark = (arr) => { const mx = Math.max(...arr), mn = Math.min(...arr); return arr.map((v, i) => (i ? 'L' : 'M') + ((i / (arr.length - 1)) * 100).toFixed(1) + ',' + (32 - ((v - mn) / ((mx - mn) || 1)) * 28).toFixed(1)).join(' '); };
    const sparkSets = [[3, 5, 4, 6, 7, 6, 8, 9], [4, 4, 5, 6, 5, 7, 7, 8], [6, 6, 5, 6, 5, 5, 4, 5], [2, 3, 2, 4, 3, 5, 4, 6]];
    const pageMeta = {
      Bandeja: ['Hola, Beltran', 'Esto es lo que necesita tu atención ahora · datos de ejemplo'],
      Resumen: ['Resumen', 'Gráficos de ventas, metas y canales · datos de ejemplo'],
      Pedidos: ['Pedidos', 'Todos los pedidos de la tienda web, WhatsApp y empresas'],
      Cotizaciones: ['Cotizaciones', 'Solicitudes de precio de empresas y negocios'],
      Clientes: ['Clientes', 'Consumidores, minoristas, mayoristas y empresas'],
      Productos: ['Productos', 'Catálogo, precios y stock'],
      Inventario: ['Inventario', 'Productos con stock bajo o agotados'],
      'Categorías': ['Categorías', 'Lo que aparece en el menú de la tienda'],
      'Ofertas y cupones': ['Ofertas y cupones', 'Precios por volumen y cupones de descuento'],
      'Tienda web': ['Tienda web', 'Portada y secciones de www.viaprovisiones.com'],
      WhatsApp: ['WhatsApp', 'Conversaciones del +51 954 802 744'],
      'Enlaces y QR': ['Enlaces y QR', 'Tu página de enlaces y el código QR'],
      Reportes: ['Reportes', 'Descarga tus reportes en Excel o PDF'],
      'Configuración': ['Configuración', 'Empresa, usuarios, pagos y envíos'],
      'Nuevo producto': ['Nuevo producto', 'Completa los datos y guarda para publicarlo']
    };

    const allOrders = [
      { id: '#1042', date: '23 oct · 10:24', client: 'María Q.', type: 'Consumidor', channel: 'Tienda web', pay: 'Yape', total: 159.70, status: 'Pendiente' },
      { id: '#1041', date: '23 oct · 09:51', client: 'Bodega San Martín', type: 'Minorista', channel: 'WhatsApp', pay: 'Transferencia', total: 842.00, status: 'Pagado' },
      { id: '#1040', date: '22 oct · 18:12', client: 'Ferretería Cayma', type: 'Mayorista', channel: 'Empresas', pay: 'Factura 30 días', total: 3460.00, status: 'Enviado' },
      { id: '#1039', date: '22 oct · 16:40', client: 'Luis R.', type: 'Consumidor', channel: 'Tienda web', pay: 'Tarjeta', total: 459.00, status: 'Entregado' },
      { id: '#1038', date: '22 oct · 12:05', client: 'Constructora [Cliente]', type: 'Empresa', channel: 'Empresas', pay: 'Factura', total: 5120.00, status: 'Pagado' },
      { id: '#1037', date: '21 oct · 19:30', client: 'Ana T.', type: 'Consumidor', channel: 'WhatsApp', pay: 'Plin', total: 69.90, status: 'Entregado' },
      { id: '#1036', date: '21 oct · 11:18', client: 'Minimarket Yanahuara', type: 'Minorista', channel: 'WhatsApp', pay: 'Yape', total: 615.50, status: 'Enviado' },
      { id: '#1035', date: '20 oct · 17:02', client: 'Jorge P.', type: 'Consumidor', channel: 'Tienda web', pay: 'Tarjeta', total: 39.90, status: 'Cancelado' },
      { id: '#1034', date: '20 oct · 10:44', client: 'Hotel [Cliente]', type: 'Empresa', channel: 'Empresas', pay: 'Factura', total: 1980.00, status: 'Entregado' }
    ];
    const decorate = (o) => ({ ...o, total: money(o.total), sBg: STATUS[o.status].bg, sFg: STATUS[o.status].fg, sIcon: STATUS[o.status].icon });
    const orderTabNames = ['Todos', 'Pendiente', 'Pagado', 'Enviado', 'Entregado', 'Cancelado'];

    const allProducts = [
      { name: 'Foco LED 9 W luz cálida', cat: 'Focos', price: 8.90, stock: 240, img: '52dc55c2523393f8f60ab89499fa3ec1' },
      { name: 'Foco inteligente Wi-Fi', cat: 'Focos', price: 39.90, stock: 18, img: '0906fd6ca8bd6e968244a06277498fc6' },
      { name: 'Panel solar monocristalino 100 W', cat: 'Solar', price: 349.00, stock: 7, img: '972ceb606bfca75ef6208d8d3966c77d' },
      { name: 'Estación de energía portátil', cat: 'Solar', price: 1290.00, stock: 3, img: '56a034356f25e7cd0fe7251db3cbbddc' },
      { name: 'Cable USB-C carga rápida 1 m', cat: 'Cables', price: 19.90, stock: 310, img: '3aba2390d3fbd5f06fdd2cede507b16f' },
      { name: 'Extensión de uso rudo 5 m', cat: 'Extensiones', price: 45.00, stock: 9, img: '323e29809539c2fb4b229651c8081ee9' },
      { name: 'Mosquetón llavero de aluminio', cat: 'Llaveros', price: 9.90, stock: 150, img: 'eb0c79147accd306bbd7a39d350a8e88' },
      { name: 'Ganchos de pared (set de 3)', cat: 'Ganchos', price: 24.90, stock: 64, img: 'b68602a2601d3a2d118c7190d31f96a1' },
      { name: 'Lámpara de camping recargable', cat: 'Camping', price: 69.90, stock: 5, img: 'a58999411e32d7481815ba8cdc175e97' },
      { name: 'Collar dorado de cadena fina', cat: 'Bisutería', price: 29.90, stock: 0, img: '792438e54fa4b4d81f31171a2cf026f6' }
    ];
    const stockState = (n) => (n === 0 ? { status: 'Agotado', bg: '#FDE4E2', fg: '#8E1C14', color: '#C5221F', icon: 'M6 6l12 12M18 6L6 18' }
      : n < 10 ? { status: 'Stock bajo', bg: '#FFF4D6', fg: '#7A4A00', color: '#B26A00', icon: 'M12 3l9 16H3zM12 10v4M12 17h.01' }
      : { status: 'Disponible', bg: '#E4F4E7', fg: '#1B5E20', color: '#2E7D32', icon: 'M5 12l5 5 9-10' });
    const prodTabNames = ['Todos', 'Focos', 'Solar', 'Cables', 'Extensiones', 'Llaveros', 'Ganchos', 'Camping', 'Bisutería'];

    const allQuotes = [
      { biz: 'Ferretería [Cliente]', type: 'Ferretería', city: 'Arequipa', cats: ['Cable eléctrico', 'Reflectores', 'Carretes'], amount: 'S/ 1,000 – 5,000', date: 'Hoy · 09:12', status: 'Nueva', icon: 'M14 6l4 4-9 9H5v-4zM12 8l4 4' },
      { biz: 'Minera [Cliente]', type: 'Minería', city: 'Cusco', cats: ['Paneles solares', 'Linternas de cabeza'], amount: 'Más de S/ 5,000', date: 'Hoy · 08:40', status: 'Nueva', icon: 'M2 20l7-12 4 6 3-4 6 10z' },
      { biz: 'Bodega [Cliente]', type: 'Minorista', city: 'Arequipa', cats: ['Focos LED', 'Llaveros', 'Bisutería'], amount: 'Hasta S/ 1,000', date: 'Ayer · 17:25', status: 'En revisión', icon: 'M3 9l1-5h16l1 5M4 9v11h16V9M3 9h18' },
      { biz: 'Distribuidora [Cliente]', type: 'Mayorista', city: 'Puno', cats: ['Focos por caja', 'Extensiones'], amount: 'Más de S/ 5,000', date: 'Ayer · 11:02', status: 'Enviada', icon: 'M3 8l9-5 9 5v12H3zM3 8h18' },
      { biz: 'Hotel [Cliente]', type: 'Hoteles y restaurantes', city: 'Arequipa', cats: ['Tiras LED', 'Focos filamento'], amount: 'S/ 1,000 – 5,000', date: '21 oct', status: 'Aceptada', icon: 'M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10' },
      { biz: 'Constructora [Cliente]', type: 'Construcción', city: 'Moquegua', cats: ['Reflectores', 'Carretes 15 m'], amount: 'S/ 1,000 – 5,000', date: '20 oct', status: 'En revisión', icon: 'M2 20h20M5 20V10l7-6 7 6v10' }
    ].map((q) => ({ ...q, sBg: QST[q.status].bg, sFg: QST[q.status].fg, sIcon: QST[q.status].icon, catList: q.cats.map((t) => ({ t })) }));


    // Interruptores (estado local por clave)
    const tg = (key, def) => {
      const on = key in st.tg ? st.tg[key] : def;
      return { on: on ? 'true' : 'false', trackBg: on ? '#111111' : '#BDBDBD', knob: on ? '25px' : '3px', opacity: on ? '1' : '0.55',
        toggle: () => this.setState({ tg: { ...this.state.tg, [key]: !on } }) };
    };
    const allClients = [
      { name: 'Bodega San Martín', doc: 'RUC 10XXXXXXXXX', type: 'Minorista', city: 'Arequipa', orders: 18, total: 9420, last: '23 oct', channel: 'WhatsApp' },
      { name: 'Ferretería Cayma', doc: 'RUC 20XXXXXXXXX', type: 'Mayorista', city: 'Arequipa', orders: 11, total: 28640, last: '22 oct', channel: 'Empresas' },
      { name: 'María Q.', doc: 'DNI', type: 'Consumidor', city: 'Arequipa', orders: 4, total: 612, last: '23 oct', channel: 'Tienda web' },
      { name: 'Constructora [Cliente]', doc: 'RUC 20XXXXXXXXX', type: 'Empresa', city: 'Moquegua', orders: 6, total: 31200, last: '22 oct', channel: 'Empresas' },
      { name: 'Minimarket Yanahuara', doc: 'RUC 10XXXXXXXXX', type: 'Minorista', city: 'Arequipa', orders: 9, total: 4310, last: '21 oct', channel: 'WhatsApp' },
      { name: 'Distribuidora [Cliente]', doc: 'RUC 20XXXXXXXXX', type: 'Mayorista', city: 'Puno', orders: 7, total: 19870, last: '19 oct', channel: 'Empresas' },
      { name: 'Luis R.', doc: 'DNI', type: 'Consumidor', city: 'Cusco', orders: 2, total: 498, last: '22 oct', channel: 'Tienda web' },
      { name: 'Hotel [Cliente]', doc: 'RUC 20XXXXXXXXX', type: 'Empresa', city: 'Arequipa', orders: 3, total: 5940, last: '20 oct', channel: 'Empresas' }
    ];
    const clientTabNames = ['Todos', 'Consumidor', 'Minorista', 'Mayorista', 'Empresa'];
    const adminCats = [
      { name: 'Focos', img: '3b9c9685b295f2e98de45092f0726e9d', count: 42, subs: ['Focos LED', 'Focos inteligentes', 'Focos ahorradores', 'Reflectores', 'Tiras LED'] },
      { name: 'Solar', img: 'b30fccfdffef62630e634c81713bce27', count: 18, subs: ['Paneles solares', 'Estaciones de energía', 'Lámparas solares', 'Baterías e inversores', 'Kits solares'] },
      { name: 'Cables', img: '9b50c161cb5babd38f32f5ae0d6d07f2', count: 56, subs: ['Cables USB', 'Cables HDMI', 'Cables de red', 'Cables de audio', 'Cable eléctrico'] },
      { name: 'Extensiones', img: 'eb24768cbcec06634442ffd75b2ec35e', count: 24, subs: ['Multicontactos', 'Extensiones de uso rudo', 'Carretes', 'Supresores de picos'] },
      { name: 'Llaveros', img: '486adc8e3498d09ac8c8b3601331de4e', count: 31, subs: ['Llaveros de metal', 'Llaveros de piel', 'Mosquetones', 'Llaveros personalizados'] },
      { name: 'Ganchos', img: '2199c77bc313fc070c4dd0829072f7f7', count: 19, subs: ['Ganchos adhesivos', 'Ganchos de pared', 'Ganchos de cocina', 'Organizadores'] },
      { name: 'Camping', img: 'a39c65aefaa4235a16422fb671911427', count: 37, subs: ['Lámparas y linternas', 'Casas de campaña', 'Cocina de campamento', 'Mochilas', 'Sillas plegables'] },
      { name: 'Bisutería', img: 'c293f47caea74d301a56eedd46949711', count: 64, subs: ['Collares', 'Pulseras', 'Aretes', 'Anillos', 'Sets'] }
    ];
    const allChats = [
      { name: 'Bodega San Martín', type: 'Minorista · Arequipa', time: '10:42', unread: '2', msgs: [
        { t: 'Hola, ¿tienen focos LED de 9 W por caja?', me: false, time: '10:38' },
        { t: 'Hola, sí. La caja trae [N] unidades y tiene precio de reventa.', me: true, time: '10:40' },
        { t: 'Perfecto, ¿me separan 2 cajas y 10 llaveros de metal?', me: false, time: '10:42' }
      ] },
      { name: 'María Q.', type: 'Consumidor · Arequipa', time: '09:15', unread: '', msgs: [
        { t: '¿La lámpara de camping viene con cable de carga?', me: false, time: '09:10' },
        { t: 'Sí, incluye cable USB. Puedes recogerla hoy en Dean Valdivia 533.', me: true, time: '09:15' }
      ] },
      { name: 'Ferretería Cayma', type: 'Mayorista · Arequipa', time: 'Ayer', unread: '1', msgs: [
        { t: 'Necesito cotización de 20 carretes de 15 m y 50 m de cable eléctrico.', me: false, time: 'Ayer 17:02' }
      ] },
      { name: 'Luis R.', type: 'Consumidor · Cusco', time: 'Ayer', unread: '', msgs: [
        { t: '¿Hacen envíos a Cusco?', me: false, time: 'Ayer 12:20' },
        { t: 'Sí, enviamos por agencia a todo el Perú.', me: true, time: 'Ayer 12:24' }
      ] },
      { name: 'Hotel [Cliente]', type: 'Empresa · Arequipa', time: 'Lun', unread: '', msgs: [
        { t: 'Gracias, recibimos las tiras LED.', me: false, time: 'Lun 16:45' }
      ] }
    ];
    const curChat = allChats[st.chat];
    const permRows = [
      ['Ver resumen y reportes', 1, 0, 0], ['Crear y editar productos', 1, 0, 1], ['Gestionar inventario', 1, 0, 1],
      ['Ver y atender pedidos', 1, 1, 1], ['Responder cotizaciones', 1, 1, 0], ['Editar precios y cupones', 1, 0, 0],
      ['Configuración y usuarios', 1, 0, 0]
    ];
    const yes = (v) => (v ? '✓' : '—');
    const yesLabel = (v) => (v ? 'Permitido' : 'No permitido');

    // Menú de dos niveles: áreas (barra negra) y subsecciones (panel blanco)
    const goCfg = (t) => () => this.setState({ section: 'Configuración', cfgTab: t });
    const AREAS = [
      { name: 'Inicio', short: 'Inicio', icon: 'M3 11l9-8 9 8v10H3zM9 21v-6h6v6', desc: 'Lo más importante de tu tienda, de un vistazo.',
        items: [{ label: 'Bandeja', sec: 'Bandeja', icon: 'M4 13l2-8h12l2 8M4 13v6h16v-6M4 13h5l1 2h4l1-2h5' }],
        action: ['Nuevo producto', 'M12 5v14M5 12h14', 'Nuevo producto'],
        card: { title: 'Meta del mes', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', stats: [['74%', 'de la meta'], ['8 días', 'para cerrar']], bar: '74%', cta: 'Ver reportes', go: 'Reportes', dark: true } },
      { name: 'Ventas', short: 'Ventas', icon: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0', desc: 'Pedidos, cotizaciones y clientes.', dot: true,
        items: [
          { label: 'Pedidos', sec: 'Pedidos', hint: 'Web, WhatsApp y empresas', icon: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0', count: '12' },
          { label: 'Cotizaciones', sec: 'Cotizaciones', hint: '2 nuevas hoy', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', count: '5', hot: true },
          { label: 'Clientes', sec: 'Clientes', hint: '348 registrados', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c1-4 4-6 7-6s6 2 7 6M16 3.5a4 4 0 0 1 0 7.5M22 21c-.6-2.6-2-4.4-4-5.3' }
        ],
        action: ['Ver pedidos', 'M5 12h14M13 6l6 6-6 6', 'Pedidos'],
        card: { title: 'Hoy', icon: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', stats: [['S/ 4,410', 'ventas'], ['31', 'pedidos']], cta: 'Pedidos pendientes', go: 'Pedidos', dark: true } },
      { name: 'Catálogo', short: 'Catálogo', icon: 'M12 3l9 5v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v8', desc: 'Productos, stock, categorías y precios.', dot: true,
        items: [
          { label: 'Productos', sec: 'Productos', hint: '291 productos', icon: 'M12 3l9 5v8l-9 5-9-5V8zM3 8l9 5 9-5M12 13v8' },
          { label: 'Inventario', sec: 'Inventario', hint: 'Stock bajo y agotados', icon: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10', count: '6', hot: true },
          { label: 'Categorías', sec: 'Categorías', hint: '8 categorías', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z' },
          { label: 'Ofertas y cupones', sec: 'Ofertas y cupones', hint: '4 cupones activos', icon: 'M20 12l-8 8-9-9V3h8zM7.5 7.5h.01' }
        ],
        action: ['Nuevo producto', 'M12 5v14M5 12h14', 'Nuevo producto'],
        card: { title: 'Stock', icon: 'M12 3l9 16H3zM12 10v4M12 17h.01', stats: [['6', 'por agotarse'], ['1', 'agotado']], cta: 'Revisar inventario', go: 'Inventario', dark: false } },
      { name: 'Canales', short: 'Canales', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18', desc: 'Dónde te encuentran tus clientes.',
        items: [
          { label: 'Tienda web', sec: 'Tienda web', hint: 'En línea', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18' },
          { label: 'WhatsApp', sec: 'WhatsApp', hint: '+51 954 802 744', icon: 'M4 20l1.3-4A8 8 0 1 1 8 18.7z', count: '3', hot: true },
          { label: 'Enlaces y QR', sec: 'Enlaces y QR', hint: '6 enlaces sin completar', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 18h2v2h-2z' }
        ],
        action: ['Responder WhatsApp', 'M4 20l1.3-4A8 8 0 1 1 8 18.7z', 'WhatsApp'],
        card: { title: 'Este mes', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z', stats: [['214', 'escaneos del QR'], ['1,920', 'visitas web']], cta: 'Ver enlaces y QR', go: 'Enlaces y QR', dark: true } },
      { name: 'Reportes', short: 'Reportes', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2', desc: 'Descarga tus números en Excel o PDF.',
        items: [{ label: 'Resumen', sec: 'Resumen', hint: 'Gráficos, metas y canales', icon: 'M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z' }, { label: 'Reportes', sec: 'Reportes', hint: '6 reportes disponibles', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' }],
        action: ['Descargar reporte', 'M12 4v11M7 10l5 5 5-5M5 20h14', 'Reportes'],
        card: { title: 'Ventas del mes', icon: 'M4 19V9M10 19V5M16 19v-7M22 19H2', stats: [['S/ 18,450', 'acumulado'], ['+12%', 'vs. mes pasado']], bar: '74%', cta: 'Ir al resumen', go: 'Resumen', dark: false } },
      { name: 'Ajustes', short: 'Ajustes', icon: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 12h2M18 12h2M12 4v2M12 18v2M6.3 6.3l1.4 1.4M16.3 16.3l1.4 1.4M6.3 17.7l1.4-1.4M16.3 7.7l1.4-1.4', desc: 'Empresa, usuarios, pagos y envíos.',
        items: [
          { label: 'Empresa', cfg: 0, hint: 'Datos y contacto', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6' },
          { label: 'Usuarios y roles', cfg: 1, hint: '1 activo · 2 invitados', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c1-4 4-6 7-6s6 2 7 6' },
          { label: 'Pagos', cfg: 2, hint: 'Tarjeta, Yape, Plin', icon: 'M3 6h18v12H3zM3 10h18M7 15h3' },
          { label: 'Envíos', cfg: 3, hint: '4 zonas', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7' }
        ],
        action: ['Invitar usuario', 'M12 5v14M5 12h14', null, 1],
        card: { title: 'Por completar', icon: 'M12 3l9 16H3zM12 10v4M12 17h.01', stats: [['4', 'datos pendientes'], ['RUC', 'y horario']], cta: 'Completar datos', go: null, cfg: 0, dark: false } }
    ];
    const secArea = { 'Nuevo producto': 'Catálogo', 'Configuración': 'Ajustes' };
    const curAreaName = secArea[st.section] || (AREAS.find((ar) => ar.items.some((it) => it.sec === st.section)) || AREAS[0]).name;
    const curArea = AREAS.find((ar) => ar.name === curAreaName);
    const goArea = (ar) => (ar.items[0].sec ? go(ar.items[0].sec) : goCfg(ar.items[0].cfg));

    // ---------- Bandeja de trabajo ----------
    const TYPE = {
      pago: { tag: 'Pago', icon: 'M3 6h18v12H3zM3 10h18M7 15h3', bg: '#E3F1FF', fg: '#0B4A8A' },
      pedido: { tag: 'Pedido', icon: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0', bg: '#FFE7D6', fg: '#8A3B0A' },
      cotizacion: { tag: 'Cotización', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', bg: '#141414', fg: '#FFFFFF' },
      whatsapp: { tag: 'WhatsApp', icon: 'M4 20l1.3-4A8 8 0 1 1 8 18.7z', bg: '#DFF7E6', fg: '#1B5E20' },
      stock: { tag: 'Stock', icon: 'M12 3l9 16H3zM12 10v4M12 17h.01', bg: '#FFF4D6', fg: '#7A4A00' }
    };
    const L = (name, qty, price, img) => ({ name, qty, price, img });
    const INBOX = [
      { id: 'i1', type: 'pago', when: 'Hoy', time: '10:24', urgent: true, title: 'Pago por confirmar · #1042', sub: 'María Q. pagó con Yape', amount: 159.70,
        order: { id: '#1042', client: 'María Q.', clientType: 'Consumidor · 4 compras', channel: 'Tienda web', step: 0, delivery: 'Recojo en tienda · Dean Valdivia 533', history: 'Cliente desde mayo · S/ 612 comprados', pay: 'Yape', ship: 'Gratis (recojo)',
          lines: [L('Lámpara de camping recargable', 2, 69.9, 'a58999411e32d7481815ba8cdc175e97'), L('Cable USB-C carga rápida 1 m', 1, 19.9, '3aba2390d3fbd5f06fdd2cede507b16f')] } },
      { id: 'i2', type: 'cotizacion', when: 'Hoy', time: '08:40', urgent: true, title: 'Minera [Cliente]', sub: 'Paneles solares y linternas de cabeza · Cusco', amountText: 'Más de S/ 5,000',
        quote: { biz: 'Minera [Cliente]', type: 'Minería', city: 'Cusco', ruc: '20XXXXXXXXX', contact: '[Nombre] · Logística', volume: 'Más de S/ 5,000 al mes', delivery: 'Campamento en Cusco',
          message: 'Necesitamos iluminación y energía para un campamento de 40 personas. ¿Pueden enviar a Cusco con factura?',
          rows: [L('Panel solar monocristalino 100 W', 10, 349, '972ceb606bfca75ef6208d8d3966c77d'), L('Estación de energía portátil', 2, 1290, '56a034356f25e7cd0fe7251db3cbbddc'), L('Linterna de cabeza LED', 40, 39.9, '9b85b845faa6856c6338458b006ed014')] } },
      { id: 'i3', type: 'whatsapp', when: 'Hoy', time: '10:42', title: 'Bodega San Martín', sub: '¿Me separan 2 cajas y 10 llaveros de metal?',
        chat: { name: 'Bodega San Martín', meta: 'Minorista · Arequipa · 18 pedidos', msgs: [
          { t: 'Hola, ¿tienen focos LED de 9 W por caja?', me: false, time: '10:38' },
          { t: 'Hola, sí. La caja trae [N] unidades y tiene precio de reventa.', me: true, time: '10:40' },
          { t: 'Perfecto, ¿me separan 2 cajas y 10 llaveros de metal?', me: false, time: '10:42' }] } },
      { id: 'i4', type: 'pedido', when: 'Hoy', time: '09:51', title: 'Pedido #1041 · por preparar', sub: 'Bodega San Martín · 3 productos', amount: 842.00,
        order: { id: '#1041', client: 'Bodega San Martín', clientType: 'Minorista · 18 pedidos', channel: 'WhatsApp', step: 1, delivery: 'Delivery · Av. [DIRECCIÓN], Arequipa', history: 'Cliente frecuente · S/ 9,420 comprados', pay: 'Transferencia', ship: 'S/ 0.00',
          lines: [L('Foco LED 9 W luz cálida (caja)', 4, 89, '52dc55c2523393f8f60ab89499fa3ec1'), L('Llavero de metal', 30, 6.9, '486adc8e3498d09ac8c8b3601331de4e'), L('Ganchos de pared (set de 3)', 12, 9.9, 'b68602a2601d3a2d118c7190d31f96a1')] } },
      { id: 'i5', type: 'cotizacion', when: 'Hoy', time: '09:12', title: 'Ferretería [Cliente]', sub: 'Cable eléctrico, reflectores y carretes', amountText: 'S/ 1,000 – 5,000',
        quote: { biz: 'Ferretería [Cliente]', type: 'Ferretería', city: 'Arequipa', ruc: '20XXXXXXXXX', contact: '[Nombre] · Dueño', volume: 'S/ 1,000 – 5,000 al mes', delivery: 'Local en Arequipa',
          message: 'Quiero precio por mayor para reponer mi tienda cada mes.',
          rows: [L('Carrete de extensión 15 m', 20, 119, 'c390a322d80bcca52c15a80479e59e7b'), L('Reflector LED 50 W', 12, 79.9, '3b9c9685b295f2e98de45092f0726e9d'), L('Extensión de uso rudo 5 m', 24, 45, '323e29809539c2fb4b229651c8081ee9')] } },
      { id: 'i6', type: 'stock', when: 'Hoy', time: '08:00', urgent: true, title: 'Collar dorado de cadena fina', sub: 'Agotado · 4 clientes lo vieron hoy',
        stock: { name: 'Collar dorado de cadena fina', cat: 'Bisutería · Collares', img: '792438e54fa4b4d81f31171a2cf026f6', left: 0, perWeek: 9, weeks: [5, 6, 8, 7, 9, 10, 9, 11], reorder: '30 und.', tip: 'Se agotó hace 2 días y se vende cada vez más. Pide 30 unidades para cubrir el próximo mes.' } },
      { id: 'i7', type: 'stock', when: 'Hoy', time: '08:00', title: 'Estación de energía portátil', sub: 'Quedan 3 und. · 1 venta cada 2 días',
        stock: { name: 'Estación de energía portátil', cat: 'Solar · Estaciones de energía', img: '56a034356f25e7cd0fe7251db3cbbddc', left: 3, perWeek: 3, weeks: [1, 2, 2, 3, 2, 3, 4, 3], reorder: '10 und.', tip: 'Con 3 unidades te alcanza para una semana. Las cotizaciones de minería también la piden.' } },
      { id: 'i8', type: 'pedido', when: 'Ayer', time: '18:12', title: 'Pedido #1040 · por enviar', sub: 'Ferretería Cayma · agencia a Cayma', amount: 3460.00,
        order: { id: '#1040', client: 'Ferretería Cayma', clientType: 'Mayorista · 11 pedidos', channel: 'Empresas', step: 2, delivery: 'Envío por agencia · Cayma, Arequipa', history: 'Mayorista · S/ 28,640 comprados', pay: 'Factura a 30 días', ship: 'S/ 25.00',
          lines: [L('Carrete de extensión 15 m', 10, 119, 'c390a322d80bcca52c15a80479e59e7b'), L('Extensión de uso rudo 5 m', 30, 45, '323e29809539c2fb4b229651c8081ee9'), L('Foco LED 9 W luz cálida (caja)', 10, 89, '52dc55c2523393f8f60ab89499fa3ec1')] } },
      { id: 'i9', type: 'whatsapp', when: 'Ayer', time: '17:02', title: 'Ferretería Cayma', sub: 'Necesito cotización de 20 carretes y 50 m de cable',
        chat: { name: 'Ferretería Cayma', meta: 'Mayorista · Arequipa · 11 pedidos', msgs: [
          { t: 'Necesito cotización de 20 carretes de 15 m y 50 m de cable eléctrico.', me: false, time: 'Ayer 17:02' }] } }
    ];
    const FILTERS = [['Todo', null], ['Pedidos', ['pedido', 'pago']], ['Cotizaciones', ['cotizacion']], ['WhatsApp', ['whatsapp']], ['Stock', ['stock']]];
    const fType = (FILTERS.find((f) => f[0] === st.inboxFilter) || FILTERS[0])[1];
    const visible = INBOX.filter((it) => !fType || fType.includes(it.type));
    const selItem = INBOX.find((it) => it.id === st.inboxSel) || INBOX[0];
    const isDone = (it) => !!st.done[it.id];
    const STEPS = ['Recibido', 'Pagado', 'Preparado', 'Enviado', 'Entregado'];
    const NEXT = ['Confirmar pago', 'Marcar como preparado', 'Marcar como enviado', 'Marcar como entregado'];
    const TIERS = [['Minorista', 5], ['Mayorista', 10], ['Distribuidor', 15]];
    const disc = TIERS[st.tier][1];
    const buildSel = (it) => {
      const T = TYPE[it.type];
      const base = { isOrder: false, isQuote: false, isChat: false, isStock: false };
      if (it.order) {
        const o = it.order;
        const step = o.id in st.orderStep ? st.orderStep[o.id] : o.step;
        const sum = o.lines.reduce((a, l) => a + l.qty * l.price, 0);
        return { ...base, isOrder: true, kicker: T.tag + ' · ' + o.channel + ' · ' + it.time, heading: 'Pedido ' + o.id, meta: o.client + ' · ' + o.lines.length + ' productos',
          total: money(sum), ship: o.ship, ini: o.client.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), client: o.client, clientType: o.clientType, delivery: o.delivery, history: o.history,
          payMethod: o.pay, payState: step >= 1 ? 'Confirmado' : 'Por confirmar', payBg: step >= 1 ? '#E4F4E7' : '#FFF4D6', payFg: step >= 1 ? '#1B5E20' : '#7A4A00',
          payNote: step >= 1 ? 'Pago verificado.' : 'Revisa la captura del ' + o.pay + ' antes de confirmar.',
          docLabel: 'Imprimir ' + (o.clientType.startsWith('Consumidor') ? 'boleta' : 'factura'),
          steps: STEPS.map((name, i) => ({ name, mark: i < step ? '✓' : String(i + 1), bar: i <= step ? '#E8701F' : '#ECECEA', dot: i < step ? '#1B5E20' : (i === step ? '#E8701F' : '#BDBDBD'), fg: i <= step ? '#111111' : '#8C8C8C', weight: i === step ? '700' : '500', when: i < step ? 'Listo' : (i === step ? 'Ahora' : '') })),
          canAdvance: step < 4, finished: step >= 4, nextLabel: NEXT[Math.min(step, 3)],
          advance: () => this.setState({ orderStep: { ...this.state.orderStep, [o.id]: step + 1 }, done: { ...this.state.done, [it.id]: true } }),
          lines: o.lines.map((l) => ({ name: l.name, qty: String(l.qty), unit: money(l.price), total: money(l.qty * l.price), img: B + l.img })) };
      }
      if (it.quote) {
        const q = it.quote;
        return { ...base, isQuote: true, kicker: 'Cotización · ' + q.type + ' · ' + it.time, heading: q.biz, meta: q.city + ' · ' + q.volume, message: q.message,
          facts: [['Tipo', q.type], ['RUC', q.ruc], ['Contacto', q.contact], ['Compra estimada', q.volume], ['Entrega', q.delivery]].map((x) => ({ k: x[0], v: x[1] })) };
      }
      if (it.chat) {
        const c = it.chat;
        return { ...base, isChat: true, heading: c.name, meta: c.meta, ini: c.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
          msgs: c.msgs.map((m) => ({ t: m.t, time: m.time, align: m.me ? 'flex-end' : 'flex-start', bg: m.me ? '#DCF8C6' : '#FFFFFF' })) };
      }
      const k = it.stock;
      const mx = Math.max(...k.weeks);
      return { ...base, isStock: true, kicker: k.cat, heading: k.name, meta: k.left === 0 ? 'Agotado en la tienda' : 'Quedan ' + k.left + ' unidades', img: B + k.img, tip: k.tip, reorder: k.reorder,
        facts: [[String(k.left), 'en stock'], [String(k.perWeek), 'ventas por semana'], [k.left === 0 ? '0' : String(Math.max(1, Math.round((k.left / k.perWeek) * 7))), 'días de stock']].map((x) => ({ v: x[0], k: x[1] })),
        weeks: k.weeks.map((w) => ({ h: Math.round((w / mx) * 100) + '%' })) };
    };
    const selQuote = selItem.quote;
    const quoteRowsData = selQuote ? selQuote.rows.map((r, i) => { const key = selItem.id + ':' + i; const qty = key in st.qty ? st.qty[key] : r.qty; return { ...r, key, qty }; }) : [];
    const quoteTotalN = quoteRowsData.reduce((a, r) => a + r.qty * r.price * (1 - disc / 100), 0);
    const quoteListN = quoteRowsData.reduce((a, r) => a + r.qty * r.price, 0);
    const otherCopy = {
      Clientes: 'Lista de clientes con su tipo (consumidor, minorista, mayorista o empresa), historial de compras y datos de contacto.',
      'Categorías': 'Las 8 categorías de la tienda con sus subcategorías, fotos y orden en el menú.',
      'Ofertas y cupones': 'Descuentos por producto o categoría, cupones y precios por volumen para minoristas y mayoristas.',
      'Tienda web': 'Portada, banners, carruseles y textos de www.viaprovisiones.com.',
      WhatsApp: 'Pedidos y conversaciones que llegan por WhatsApp al +51 954 802 744.',
      'Enlaces y QR': 'Botones de la página de enlaces, redes sociales y el código QR de la tienda.',
      Reportes: 'Ventas por periodo, categoría, canal y tipo de cliente, para descargar en Excel o PDF.',
      'Configuración': 'Datos de la empresa, RUC, métodos de pago, envíos, usuarios y permisos.'
    };
    const otherIcon = (groups.flatMap((g) => g.items).find((i) => i.label === st.section) || {}).icon || '';

    return {
      accent,
      expanded,
      collapsed: st.collapsed,
      sideW: st.collapsed ? '76px' : '268px',
      toggleSide: () => this.setState({ collapsed: !st.collapsed }),
      rail: AREAS.map((ar) => {
        const on = ar.name === curAreaName;
        return { name: ar.name, short: ar.short, icon: ar.icon, dot: !!ar.dot && !on, current: on ? 'page' : 'false', bg: on ? accent : 'transparent', fg: on ? '#111111' : '#9A9A9A', go: goArea(ar) };
      }),
      area: {
        name: curArea.name,
        desc: curArea.desc,
        actionLabel: curArea.action[0],
        actionIcon: curArea.action[1],
        action: curArea.action[2] ? go(curArea.action[2]) : goCfg(curArea.action[3]),
        items: curArea.items.map((it) => {
          const on = it.sec ? it.sec === st.section : (st.section === 'Configuración' && st.cfgTab === it.cfg);
          return { label: it.label, hint: it.hint || '', hasHint: !!it.hint, icon: it.icon, count: it.count || '', hasCount: !!it.count,
            current: on ? 'page' : 'false', bg: on ? '#F4F4F2' : 'transparent', weight: on ? '600' : '500',
            iconBg: on ? accent : '#F4F4F2', iconFg: '#111111',
            countBg: it.hot ? accent : '#ECECEA', countFg: '#111111',
            go: it.sec ? go(it.sec) : goCfg(it.cfg) };
        }),
        cardTitle: curArea.card.title,
        cardIcon: curArea.card.icon,
        stats: curArea.card.stats.map((x) => ({ v: x[0], k: x[1] })),
        hasBar: !!curArea.card.bar,
        barW: curArea.card.bar || '0%',
        barTrack: curArea.card.dark ? '#2E2E2E' : '#F1DCCB',
        cardBg: curArea.card.dark ? '#141414' : '#FFF1E6',
        cardFg: curArea.card.dark ? '#FFFFFF' : '#111111',
        cardMuted: curArea.card.dark ? '#A8A8A8' : '#6B4A2E',
        cardBtnBg: curArea.card.dark ? '#FFFFFF' : '#111111',
        cardBtnFg: curArea.card.dark ? '#111111' : '#FFFFFF',
        cardCta: curArea.card.cta,
        cardGo: curArea.card.go ? go(curArea.card.go) : goCfg(curArea.card.cfg)
      },
      toggleLabel: st.collapsed ? 'Mostrar panel del menú' : 'Ocultar panel del menú',
      toggleIcon: st.collapsed ? 'M9 6l6 6-6 6' : 'M15 6l-6 6 6 6',
      groups: groups.map((g) => ({
        title: g.title,
        items: g.items.map((i) => {
          const on = i.label === st.section;
          return {
            ...i,
            go: go(i.label),
            current: on ? 'page' : 'false',
            bg: on ? '#262626' : 'transparent',
            fg: on ? '#FFFFFF' : '#CFCFCF',
            iconColor: on ? accent : '#9A9A9A',
            weight: on ? '600' : '500',
            justify: st.collapsed ? 'center' : 'flex-start',
            showBadge: !!i.badge && !st.collapsed,
            badgeBg: i.hot ? accent : '#2E2E2E',
            badgeFg: i.hot ? '#111111' : '#FFFFFF'
          };
        })
      })),
      section: st.section,
      sectionGroup: curAreaName,
      isResumen: sec === 'Resumen',
      isBandeja: sec === 'Bandeja',
      showInbox: expanded && curAreaName === 'Inicio',
      showAreaPanel: expanded && curAreaName !== 'Inicio',
      showRanges: sec !== 'Bandeja',
      inboxOpen: String(INBOX.filter((it) => !isDone(it)).length),
      inboxFilters: FILTERS.map((f) => ({ name: f[0], count: String(f[1] ? INBOX.filter((it) => f[1].includes(it.type)).length : INBOX.length), pressed: st.inboxFilter === f[0] ? 'true' : 'false', bg: st.inboxFilter === f[0] ? '#111111' : '#F4F4F2', fg: st.inboxFilter === f[0] ? '#FFFFFF' : '#3A3A3A', pick: () => this.setState({ inboxFilter: f[0] }) })),
      inboxGroups: ['Hoy', 'Ayer'].map((w) => ({ title: w, items: visible.filter((it) => it.when === w).map((it) => {
        const T = TYPE[it.type]; const on = it.id === selItem.id; const dn = isDone(it);
        return { title: it.title, sub: it.sub, time: it.time, tag: T.tag, tagBg: T.bg, tagFg: T.fg, iconBg: T.bg, iconFg: T.fg, icon: T.icon,
          amount: it.amount ? money(it.amount) : (it.amountText || ''), hasAmount: !!(it.amount || it.amountText), done: dn,
          weight: dn ? '500' : '700', current: on ? 'true' : 'false', bg: on ? '#F6F6F4' : '#FFFFFF', bar: on ? '#111111' : (it.urgent && !dn ? '#E8701F' : 'transparent'),
          pick: () => this.setState({ inboxSel: it.id, section: 'Bandeja' }) };
      }) })).filter((g) => g.items.length),
      sel: buildSel(selItem),
      pulse: [
        { v: 'S/ 4,410', k: 'en 31 pedidos', go: go('Pedidos') },
        { v: '2', k: 'pagos por confirmar', go: () => this.setState({ inboxFilter: 'Pedidos' }) },
        { v: '5', k: 'cotizaciones esperan', go: () => this.setState({ inboxFilter: 'Cotizaciones' }) },
        { v: '6', k: 'productos con stock bajo', go: () => this.setState({ inboxFilter: 'Stock' }) }
      ],
      tierPick: TIERS.map((t, i) => ({ name: t[0], pct: '−' + t[1] + '%', pressed: i === st.tier ? 'true' : 'false', bg: i === st.tier ? '#FFFFFF' : 'transparent', shadow: i === st.tier ? '0 1px 3px rgba(0,0,0,0.12)' : 'none', pick: () => this.setState({ tier: i }) })),
      tierName: TIERS[st.tier][0].toLowerCase(),
      quoteRows: quoteRowsData.map((r) => ({ name: r.name, img: B + r.img, qty: String(r.qty), list: money(r.price), unit: money(r.price * (1 - disc / 100)), sub: money(r.qty * r.price * (1 - disc / 100)),
        inc: () => this.setState({ qty: { ...this.state.qty, [r.key]: r.qty + 1 } }), dec: () => this.setState({ qty: { ...this.state.qty, [r.key]: Math.max(1, r.qty - 1) } }) })),
      quoteTotal: money(quoteTotalN),
      quoteSave: money(quoteListN - quoteTotalN),
      isPedidos: sec === 'Pedidos',
      isProductos: sec === 'Productos',
      isCotizaciones: sec === 'Cotizaciones',
      otherText: otherCopy[st.section] || '',
      otherIcon,
      goResumen: go('Resumen'),
      goOrders: go('Pedidos'),
      goProducts: go('Nuevo producto'),
      goProductsList: go('Productos'),
      goStock: go('Inventario'),
      goQuotes: go('Cotizaciones'),
      ranges: ['Hoy', '7 días', '30 días', 'Año'].map((name, i) => ({
        name,
        pressed: i === st.range ? 'true' : 'false',
        bg: i === st.range ? '#111111' : 'transparent',
        fg: i === st.range ? '#FFFFFF' : '#3A3A3A',
        pick: () => this.setState({ range: i, hover: -1 })
      })),
      rangeLabel: S.label,
      kpis: [
        { label: 'Ventas', value: kpiSets[0], delta: '12%', note: 'vs. periodo anterior', deltaIcon: up, icon: 'M4 19V9M10 19V5M16 19v-7M22 19H2', bg: '#141414', fg: '#FFFFFF', border: '#141414', iconBg: accent, iconFg: '#111111', labelColor: '#CFCFCF', spark: spark(sparkSets[0]), sparkColor: accent, deltaBg: '#1F3A24', deltaFg: '#8FE3A0' },
        { label: 'Pedidos', value: kpiSets[1], delta: '8%', note: 'vs. periodo anterior', deltaIcon: up, icon: 'M6 3h12l1 18H5zM9 7a3 3 0 0 0 6 0', bg: '#FFFFFF', fg: '#111111', border: '#ECECEA', iconBg: '#F4F4F2', iconFg: '#111111', labelColor: '#6B6B6B', spark: spark(sparkSets[1]), sparkColor: '#E8701F', deltaBg: '#E4F4E7', deltaFg: '#1B5E20' },
        { label: 'Ticket promedio', value: kpiSets[2], delta: '2%', note: 'vs. periodo anterior', deltaIcon: down, icon: 'M5 4h14v16l-3-2-2 2-2-2-2 2-2-2-3 2zM9 9h6M9 13h6', bg: '#FFFFFF', fg: '#111111', border: '#ECECEA', iconBg: '#F4F4F2', iconFg: '#111111', labelColor: '#6B6B6B', spark: spark(sparkSets[2]), sparkColor: '#9A9A9A', deltaBg: '#FDE4E2', deltaFg: '#8E1C14' },
        { label: 'Cotizaciones abiertas', value: kpiSets[3], delta: '3 nuevas', note: 'sin responder', deltaIcon: 'M12 7v5l3 2', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', bg: '#FFFFFF', fg: '#111111', border: '#ECECEA', iconBg: '#F4F4F2', iconFg: '#111111', labelColor: '#6B6B6B', spark: spark(sparkSets[3]), sparkColor: '#E8701F', deltaBg: '#FFF4D6', deltaFg: '#7A4A00' }
      ],
      pageTitle: (pageMeta[st.section] || [st.section, ''])[0],
      pageSub: (pageMeta[st.section] || ['', ''])[1],
      chartTitle: S.title,
      chartTotal: money(S.vals.reduce((a, b) => a + b, 0)),
      chartPrevTotal: money(prevVals.reduce((a, b) => a + b, 0)),
      axisTop: 'S/ ' + top2.toLocaleString('es-PE'),
      axisMid: 'S/ ' + (top2 / 2).toLocaleString('es-PE'),
      linePath: lineOf(S.vals),
      areaPath: lineOf(S.vals) + ' L1000,290 L0,290 Z',
      prevPath: lineOf(prevVals),
      points: S.vals.map((v, i) => ({
        tick: S.ticks[i],
        label: S.ticks[i] || 'Día ' + (i + 1),
        value: 'Este periodo: ' + money(v),
        prev: 'Anterior: ' + money(prevVals[i]),
        aria: (S.ticks[i] || 'Día ' + (i + 1)) + ': ' + money(v) + ', periodo anterior ' + money(prevVals[i]),
        hover: st.hover === i,
        top: ((Y(v) / 300) * 100).toFixed(1) + '%',
        side: i > n / 2 ? 'right' : 'left',
        enter: () => this.setState({ hover: i }),
        leave: () => this.setState({ hover: -1 })
      })),
      goalPct: '74%',
      goalDash: (2 * Math.PI * 50 * 0.74).toFixed(1) + ' ' + (2 * Math.PI * 50).toFixed(1),
      goalAria: 'Meta del mes al 74%: S/ 18,450 de S/ 25,000',
      channels: [
        { name: 'Tienda web', pct: '46%', amount: 'S/ 8,487', color: '#E8701F', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18' },
        { name: 'WhatsApp', pct: '32%', amount: 'S/ 5,904', color: '#111111', icon: 'M4 20l1.3-4A8 8 0 1 1 8 18.7z' },
        { name: 'Empresas', pct: '22%', amount: 'S/ 4,059', color: '#9A9A9A', icon: 'M3 21h18M5 21V7l7-4 7 4v14' }
      ],
      recent: allOrders.slice(0, 5).map(decorate).map((o) => ({ ...o, ini: o.client.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), avBg: '#FFE7D6' })),
      topList: [['Foco LED 9 W luz cálida', 'Focos', 412, 3666.8, '52dc55c2523393f8f60ab89499fa3ec1'], ['Cable USB-C carga rápida 1 m', 'Cables', 238, 4736.2, '3aba2390d3fbd5f06fdd2cede507b16f'], ['Lámpara de camping recargable', 'Camping', 64, 4473.6, 'a58999411e32d7481815ba8cdc175e97'], ['Panel solar monocristalino 100 W', 'Solar', 12, 4188, '972ceb606bfca75ef6208d8d3966c77d'], ['Extensión de uso rudo 5 m', 'Extensiones', 57, 2565, '323e29809539c2fb4b229651c8081ee9']].map((t, i) => ({ rank: String(i + 1), name: t[0], cat: t[1], units: String(t[2]), sales: money(t[3]), img: B + t[4] })),
      byCat: [['Solar', 4980], ['Focos', 3720], ['Camping', 3150], ['Extensiones', 2240], ['Cables', 1890], ['Bisutería', 1260], ['Ganchos', 690], ['Llaveros', 520]].map(([name, v]) => ({ name, amount: 'S/ ' + v.toLocaleString('es-PE'), w: Math.round((v / 4980) * 100) + '%' })),
      lowStock: allProducts.filter((p) => p.stock < 10).map((p) => { const s = stockState(p.stock); return { name: p.name, cat: p.cat, img: B + p.img, left: p.stock === 0 ? 'Agotado' : p.stock + ' und.', sBg: s.bg, sFg: s.fg, bar: s.color, w: Math.max(4, Math.round((p.stock / 10) * 100)) + '%' }; }),
      quotesShort: allQuotes.slice(0, 3).map((q) => ({ ...q, cats: q.cats.slice(0, 2).join(', ') })),
      orderTabs: orderTabNames.map((name) => ({
        name: name === 'Todos' ? 'Todos' : name + 's',
        count: String(name === 'Todos' ? allOrders.length : allOrders.filter((o) => o.status === name).length),
        pressed: st.orderTab === name ? 'true' : 'false',
        bg: st.orderTab === name ? '#111111' : '#FFFFFF',
        fg: st.orderTab === name ? '#FFFFFF' : '#111111',
        pick: () => this.setState({ orderTab: name })
      })),
      orders: allOrders.filter((o) => st.orderTab === 'Todos' || o.status === st.orderTab).map(decorate),
      prodTabs: prodTabNames.map((name) => ({
        name,
        pressed: st.prodTab === name ? 'true' : 'false',
        bg: st.prodTab === name ? '#111111' : '#FFFFFF',
        fg: st.prodTab === name ? '#FFFFFF' : '#111111',
        pick: () => this.setState({ prodTab: name })
      })),
      products: allProducts
        .filter((p) => st.prodTab === 'Todos' || p.cat === st.prodTab)
        .filter((p) => st.section !== 'Inventario' || p.stock < 10)
        .map((p) => { const s = stockState(p.stock); return { ...p, img: B + p.img, price: money(p.price), stock: p.stock + ' und.', stockW: Math.min(100, Math.round((p.stock / 300) * 100)) + '%', stockColor: s.color, status: s.status, sBg: s.bg, sFg: s.fg, sIcon: s.icon }; }),
      isClientes: sec === 'Clientes',
      isCategorias: sec === 'Categorías',
      isOfertas: sec === 'Ofertas y cupones',
      isTienda: sec === 'Tienda web',
      isWhatsapp: sec === 'WhatsApp',
      isEnlaces: sec === 'Enlaces y QR',
      isReportes: sec === 'Reportes',
      isConfig: sec === 'Configuración',
      isNuevo: sec === 'Nuevo producto',
      clientKpis: [{ label: 'Clientes', value: '348' }, { label: 'Minoristas', value: '142' }, { label: 'Mayoristas', value: '37' }, { label: 'Empresas', value: '21' }],
      clientTabs: clientTabNames.map((name) => ({ name: name === 'Todos' ? 'Todos' : name + (name.endsWith('a') ? 's' : 'es'), pressed: st.clientTab === name ? 'true' : 'false', bg: st.clientTab === name ? '#111111' : '#FFFFFF', fg: st.clientTab === name ? '#FFFFFF' : '#111111', pick: () => this.setState({ clientTab: name }) })),
      clients: allClients.filter((c) => st.clientTab === 'Todos' || c.type === st.clientTab).map((c) => ({ ...c, ini: c.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), orders: String(c.orders), total: money(c.total) })),
      catCards: adminCats.map((c, i) => { const t = tg('cat' + i, true); return { name: c.name, img: B + c.img, order: String(i + 1), count: String(c.count), subCount: String(c.subs.length), subs: c.subs.map((x) => ({ t: x })), ...t }; }),
      tierCfg: [
        { name: 'Minorista', pct: '[X]', min: 'Desde [N] unidades por producto', bg: '#FFFFFF' },
        { name: 'Mayorista', pct: '[X]', min: 'Caja cerrada o desde S/ [MONTO]', bg: accent },
        { name: 'Distribuidor', pct: '[X]', min: 'Pedido mensual recurrente', bg: '#FFFFFF' }
      ],
      coupons: [
        { code: 'VIA10', off: '10%', scope: 'Toda la tienda', uses: '48', until: 'Hasta 31 dic 2026', def: true },
        { code: 'CAMPING15', off: '15%', scope: 'Camping', uses: '22', until: 'Hasta 30 nov 2026', def: true },
        { code: 'SOLAR50', off: 'S/ 50.00', scope: 'Solar · compras desde S/ 500', uses: '9', until: 'Hasta 15 nov 2026', def: true },
        { code: 'BIENVENIDA', off: '5%', scope: 'Primera compra', uses: '131', until: 'Sin vencimiento', def: true },
        { code: 'EMPRESA8', off: '8%', scope: 'Clientes empresa', uses: '0', until: 'Pausado', def: false }
      ].map((c) => ({ ...c, ...tg('cp' + c.code, c.def) })),
      slides: [
        { num: '01', tab: 'Camping', title: 'Para la noche más larga', cta: 'Comprar camping', img: '621ce65a45113393656af23955c4e044' },
        { num: '02', tab: 'Solar', title: 'Energía que no se corta', cta: 'Comprar solar', img: '1e3cbb6a8497f7e680445500f1240a3b' },
        { num: '03', tab: 'Focos', title: 'Luz para cada cuarto', cta: 'Comprar focos', img: '0e200ae6333f48d1adeafc046ff925a6' },
        { num: '04', tab: 'Cables', title: 'Siempre conectado', cta: 'Comprar cables', img: '96c00ebc0862099877967a7af4e3ef8e' }
      ].map((x) => ({ ...x, img: B + x.img, ...tg('sl' + x.num, true) })),
      homeSections: ['Barra de avisos', 'Portada con pestañas', 'Categorías', 'El estándar VIA', 'Nuevas llegadas', 'Energía solar', 'Lo más vendido', 'Productos destacados', 'Kits VIA', 'Nuestra historia', 'Banner de camping', 'Guías VIA', 'Atendemos a empresas'].map((name, i) => ({ name, ...tg('hs' + i, true) })),
      chats: allChats.map((c, i) => ({ name: c.name, time: c.time, unread: c.unread, last: c.msgs[c.msgs.length - 1].t, ini: c.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(), pressed: i === st.chat ? 'true' : 'false', bg: i === st.chat ? '#FFF1E6' : '#FFFFFF', pick: () => this.setState({ chat: i }) })),
      chat: { name: curChat.name, type: curChat.type, msgs: curChat.msgs.map((m) => ({ t: m.t, time: m.time, align: m.me ? 'flex-end' : 'flex-start', bg: m.me ? '#DCF8C6' : '#FFFFFF' })) },
      quickReplies: ['Gracias por escribirnos', 'Te envío el catálogo', 'Precio por mayor', 'Horario y dirección'].map((t) => ({ t })),
      linkRows: [
        { name: 'Tienda online', url: 'www.viaprovisiones.com' }, { name: 'WhatsApp', url: 'wa.me/51954802744' },
        { name: 'Correo', url: 'viaprovisionesperu@gmail.com' }, { name: 'Mapa', url: 'Dean Valdivia 533, Arequipa' },
        { name: 'Instagram', url: '', missing: true }, { name: 'Facebook', url: '', missing: true }, { name: 'TikTok', url: '', missing: true },
        { name: 'YouTube', url: '', missing: true }, { name: 'LinkedIn', url: '', missing: true }, { name: 'Catálogo PDF', url: '', missing: true }
      ].map((l, i) => ({ ...l, url: l.url || 'Sin enlace todavía', missing: !!l.missing, ...tg('lk' + i, !l.missing) })),
      reports: [
        { name: 'Ventas por periodo', text: 'Ventas diarias, semanales o mensuales con comparación al periodo anterior.', icon: 'M4 19V9M10 19V5M16 19v-7M22 19H2', iconBg: accent },
        { name: 'Ventas por categoría', text: 'Cuánto vende cada categoría y subcategoría.', icon: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z', iconBg: '#EFEFEC' },
        { name: 'Ventas por canal', text: 'Tienda web, WhatsApp y ventas a empresas.', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18', iconBg: '#EFEFEC' },
        { name: 'Clientes', text: 'Clientes nuevos y recurrentes por tipo: consumidor, minorista, mayorista y empresa.', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c1-4 4-6 7-6s6 2 7 6', iconBg: '#EFEFEC' },
        { name: 'Inventario', text: 'Stock actual, productos agotados y rotación.', icon: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4', iconBg: '#EFEFEC' },
        { name: 'Cotizaciones', text: 'Solicitudes de empresas, respondidas y aceptadas.', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6', iconBg: '#EFEFEC' }
      ],
      topProducts: [
        ['Foco LED 9 W luz cálida', 'Focos', 412, 3666.8], ['Cable USB-C carga rápida 1 m', 'Cables', 238, 4736.2], ['Lámpara de camping recargable', 'Camping', 64, 4473.6],
        ['Panel solar monocristalino 100 W', 'Solar', 12, 4188], ['Extensión de uso rudo 5 m', 'Extensiones', 57, 2565]
      ].map((t, i) => ({ rank: String(i + 1), name: t[0], cat: t[1], units: String(t[2]), sales: money(t[3]) })),
      cfgTabs: [
        { name: 'Empresa', icon: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6' }, { name: 'Usuarios y roles', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM2 21c1-4 4-6 7-6s6 2 7 6' },
        { name: 'Pagos', icon: 'M3 6h18v12H3zM3 10h18M7 15h3' }, { name: 'Envíos', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7' }
      ].map((t, i) => ({ ...t, selected: i === st.cfgTab ? 'true' : 'false', bg: i === st.cfgTab ? '#111111' : '#FFFFFF', fg: i === st.cfgTab ? '#FFFFFF' : '#111111', pick: () => this.setState({ cfgTab: i }) })),
      cfgEmpresa: st.cfgTab === 0,
      cfgUsuarios: st.cfgTab === 1,
      cfgPagos: st.cfgTab === 2,
      cfgEnvios: st.cfgTab === 3,
      users: [
        { name: 'Beltran Carlos Ccapa', email: 'viaprovisionesperu@gmail.com', role: 'Administrador', last: 'Activo ahora', ini: 'BC', avatarBg: accent, avatarFg: '#111111', roleBg: '#111111', roleFg: '#FFFFFF' },
        { name: '[Nombre del vendedor]', email: '[correo]', role: 'Vendedor', last: 'Invitación pendiente', ini: 'VE', avatarBg: '#111111', avatarFg: '#FFFFFF', roleBg: '#EFEFEC', roleFg: '#111111' },
        { name: '[Nombre de almacén]', email: '[correo]', role: 'Almacén', last: 'Invitación pendiente', ini: 'AL', avatarBg: '#111111', avatarFg: '#FFFFFF', roleBg: '#EFEFEC', roleFg: '#111111' }
      ],
      perms: permRows.map((p) => ({ name: p[0], a: yes(p[1]), v: yes(p[2]), w: yes(p[3]), aLabel: yesLabel(p[1]), vLabel: yesLabel(p[2]), wLabel: yesLabel(p[3]) })),
      payCfg: [
        { name: 'Visa / Mastercard', detail: 'Pago con tarjeta mediante [PASARELA DE PAGO].', def: true },
        { name: 'Yape', detail: 'Número o QR de Yape: [NÚMERO].', def: true },
        { name: 'Plin', detail: 'Número de Plin: [NÚMERO].', def: true },
        { name: 'Transferencia', detail: '[BANCO] · Cuenta [N° DE CUENTA] · CCI [CCI].', def: true },
        { name: 'Contra entrega', detail: 'Solo para pedidos dentro de Arequipa.', def: false }
      ].map((p, i) => ({ ...p, ...tg('pay' + i, p.def) })),
      zones: [
        { zone: 'Arequipa (tienda)', mode: 'Recojo en Dean Valdivia 533', time: 'Mismo día', fee: 'Gratis', free: '—' },
        { zone: 'Arequipa ciudad', mode: 'Delivery', time: '[PLAZO]', fee: 'S/ [MONTO]', free: 'S/ 200.00' },
        { zone: 'Sur del Perú', mode: 'Agencia de transporte', time: '[PLAZO]', fee: 'Según agencia', free: '—' },
        { zone: 'Resto del Perú', mode: 'Agencia de transporte', time: '[PLAZO]', fee: 'Según agencia', free: '—' }
      ],
      prodFlags: ['Publicado en la tienda', 'Mostrar en Nuevas llegadas', 'Precio por volumen para empresas', 'Etiqueta "Pocas unidades"'].map((name, i) => ({ name, ...tg('pf' + i, i < 3) })),
      quotes: allQuotes
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Admin(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}a:hover{color:#C2410C}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "15px", "letterSpacing": "0.01em", "color": "#111111", "background": "#F6F6F4", "minHeight": "100vh", "width": "100%", "borderRadius": "40px", "overflow": "hidden", "display": "flex", "flexWrap": "wrap", "alignItems": "stretch" }}>
      <div style={{ "flex": "0 0 auto", "display": "flex", "alignSelf": "stretch" }}>
        <nav aria-label={"Áreas del panel"} style={{ "width": "76px", "background": "#0E0E0E", "display": "flex", "flexDirection": "column", "alignItems": "center", "padding": "18px 0 16px", "boxSizing": "border-box", "gap": "6px" }}>
          <a href={"/tienda"} aria-label={"VIA Provisiones · ver tienda"} style={{ "width": "46px", "height": "46px", "borderRadius": "14px", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "marginBottom": "18px" }}>
            <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
              <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#111111"} strokeWidth={"5"}></circle>
              <clipPath id={"via-clip-rail"}>
                <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
              </clipPath>
              <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#111111"}></polygon>
              <path clipPath={"url(#via-clip-rail)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#111111"}></path>
            </svg>
          </a>
          {(lookup(v, "rail") || []).map((r, index1) => (
            <Fragment key={index1}>
              <button onClick={lookup(r, "go")} aria-label={lookup(r, "name")} aria-current={lookup(r, "current")} title={lookup(r, "name")} style={{ "position": "relative", "width": "60px", "minHeight": "58px", "border": "none", "borderRadius": "14px", "background": lookup(r, "bg"), "color": lookup(r, "fg"), "cursor": "pointer", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "4px", "padding": "6px 0" }}>
                <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={lookup(r, "icon")}></path>
                </svg>
                <span style={{ "fontSize": "10px", "fontWeight": "600", "letterSpacing": "0.02em" }}>
                  {lookup(r, "short")}
                </span>
                {Boolean(lookup(r, "dot")) && (
                  <Fragment>
                    <span style={{ "position": "absolute", "top": "8px", "right": "12px", "width": "8px", "height": "8px", "borderRadius": "50%", "background": lookup(v, "accent"), "border": "2px solid #0E0E0E" }}></span>
                  </Fragment>
                )}
              </button>
            </Fragment>
          ))}
          <span style={{ "flex": "1" }}></span>
          <button onClick={lookup(v, "toggleSide")} aria-label={lookup(v, "toggleLabel")} title={lookup(v, "toggleLabel")} style={{ "width": "44px", "height": "44px", "border": "none", "borderRadius": "12px", "background": "#1C1C1C", "color": "#CFCFCF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "marginBottom": "10px" }}>
            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
              <path d={"M4 5h16v14H4zM9 5v14"}></path>
              <path d={lookup(v, "toggleIcon")}></path>
            </svg>
          </button>
          <a href={"/admin/login"} aria-label={"Beltran Carlos Ccapa · cerrar sesión"} title={"Cerrar sesión"} style={{ "position": "relative", "width": "42px", "height": "42px", "borderRadius": "50%", "background": "#FFFFFF", "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "13px", "fontWeight": "700", "textDecoration": "none" }}>
            {"BC"}
            <span style={{ "position": "absolute", "right": "-1px", "bottom": "-1px", "width": "12px", "height": "12px", "borderRadius": "50%", "background": "#34C759", "border": "2px solid #0E0E0E" }}></span>
          </a>
        </nav>
        {Boolean(lookup(v, "showInbox")) && (
          <Fragment>
            <aside aria-label={"Bandeja de trabajo"} style={{ "width": "372px", "background": "#FFFFFF", "borderRight": "1px solid #ECECEA", "display": "flex", "flexDirection": "column", "boxSizing": "border-box" }}>
              <div style={{ "padding": "22px 20px 14px", "display": "flex", "flexDirection": "column", "gap": "14px", "borderBottom": "1px solid #F1F1EE" }}>
                <div style={{ "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "10px" }}>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "800", "letterSpacing": "-0.01em" }}>
                    {"Bandeja"}
                  </span>
                  <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                    <strong style={{ "color": "#111111" }}>
                      {lookup(v, "inboxOpen")}
                    </strong>
                    {" por atender"}
                  </span>
                </div>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "6px", "overflowX": "auto" }}>
                  {(lookup(v, "inboxFilters") || []).map((f, index2) => (
                    <Fragment key={index2}>
                      <button onClick={lookup(f, "pick")} aria-pressed={lookup(f, "pressed")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "6px", "minHeight": "32px", "padding": "0 10px", "borderRadius": "9px", "border": "none", "background": lookup(f, "bg"), "color": lookup(f, "fg"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "12px", "fontWeight": "600" }}>
                        {lookup(f, "name")}
                        <span style={{ "opacity": "0.7" }}>
                          {lookup(f, "count")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                {(lookup(v, "inboxGroups") || []).map((g, index3) => (
                  <Fragment key={index3}>
                    <span style={{ "padding": "14px 20px 6px", "fontSize": "11px", "fontWeight": "700", "letterSpacing": "0.06em", "textTransform": "uppercase", "color": "#8C8C8C" }}>
                      {lookup(g, "title")}
                    </span>
                    {(lookup(g, "items") || []).map((it, index4) => (
                      <Fragment key={index4}>
                        <button onClick={lookup(it, "pick")} aria-current={lookup(it, "current")} style={{ "position": "relative", "display": "flex", "gap": "12px", "padding": "12px 20px", "border": "none", "background": lookup(it, "bg"), "cursor": "pointer", "textAlign": "left", "fontFamily": "Roboto, sans-serif", "color": "#111111" }}>
                          <span style={{ "position": "absolute", "left": "0", "top": "10px", "bottom": "10px", "width": "3px", "borderRadius": "0 3px 3px 0", "background": lookup(it, "bar") }}></span>
                          <span style={{ "width": "38px", "height": "38px", "borderRadius": "11px", "background": lookup(it, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(it, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(it, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": lookup(it, "weight"), "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                                {lookup(it, "title")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#8C8C8C", "whiteSpace": "nowrap" }}>
                                {lookup(it, "time")}
                              </span>
                            </span>
                            <span style={{ "fontSize": "13px", "color": "#555555", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                              {lookup(it, "sub")}
                            </span>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "marginTop": "2px" }}>
                              <span style={{ "fontSize": "11px", "fontWeight": "700", "padding": "2px 8px", "borderRadius": "6px", "background": lookup(it, "tagBg"), "color": lookup(it, "tagFg") }}>
                                {lookup(it, "tag")}
                              </span>
                              {Boolean(lookup(it, "hasAmount")) && (
                                <Fragment>
                                  <span style={{ "fontSize": "12px", "fontWeight": "700" }}>
                                    {lookup(it, "amount")}
                                  </span>
                                </Fragment>
                              )}
                              {Boolean(lookup(it, "done")) && (
                                <Fragment>
                                  <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#1B5E20" }}>
                                    {"✓ Atendido"}
                                  </span>
                                </Fragment>
                              )}
                            </span>
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
              </div>
            </aside>
          </Fragment>
        )}
        {Boolean(lookup(v, "showAreaPanel")) && (
          <Fragment>
            <aside aria-label={lookup(v, "area.name")} style={{ "width": "252px", "background": "#FFFFFF", "borderRight": "1px solid #ECECEA", "display": "flex", "flexDirection": "column", "padding": "22px 16px 18px", "boxSizing": "border-box", "gap": "18px" }}>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "0 6px" }}>
                <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                  {"VIA Provisiones"}
                </span>
                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "800", "letterSpacing": "-0.01em" }}>
                  {lookup(v, "area.name")}
                </span>
                <span style={{ "fontSize": "13px", "lineHeight": "1.4", "color": "#6B6B6B" }}>
                  {lookup(v, "area.desc")}
                </span>
              </div>
              <button onClick={lookup(v, "area.action")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "minHeight": "42px", "borderRadius": "12px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "600" }}>
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={lookup(v, "area.actionIcon")}></path>
                </svg>
                {lookup(v, "area.actionLabel")}
              </button>
              <nav aria-label={"Secciones de " + String(lookup(v, "area.name") ?? "")} style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                {(lookup(v, "area.items") || []).map((i, index5) => (
                  <Fragment key={index5}>
                    <button onClick={lookup(i, "go")} aria-current={lookup(i, "current")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "minHeight": "44px", "padding": "0 12px", "border": "none", "borderRadius": "12px", "background": lookup(i, "bg"), "color": "#111111", "cursor": "pointer", "textAlign": "left", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": lookup(i, "weight") }}>
                      <span style={{ "width": "30px", "height": "30px", "borderRadius": "9px", "background": lookup(i, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(i, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(i, "icon")}></path>
                        </svg>
                      </span>
                      <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                        <span>
                          {lookup(i, "label")}
                        </span>
                        {Boolean(lookup(i, "hasHint")) && (
                          <Fragment>
                            <span style={{ "fontSize": "11px", "fontWeight": "400", "color": "#8C8C8C" }}>
                              {lookup(i, "hint")}
                            </span>
                          </Fragment>
                        )}
                      </span>
                      {Boolean(lookup(i, "hasCount")) && (
                        <Fragment>
                          <span style={{ "minWidth": "24px", "height": "22px", "padding": "0 7px", "boxSizing": "border-box", "borderRadius": "999px", "background": lookup(i, "countBg"), "color": lookup(i, "countFg"), "fontSize": "11px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            {lookup(i, "count")}
                          </span>
                        </Fragment>
                      )}
                    </button>
                  </Fragment>
                ))}
              </nav>
              <span style={{ "flex": "1" }}></span>
              <div style={{ "borderRadius": "16px", "background": lookup(v, "area.cardBg"), "color": lookup(v, "area.cardFg"), "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "12px", "fontWeight": "600", "color": lookup(v, "area.cardMuted") }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(v, "area.cardIcon")}></path>
                  </svg>
                  {lookup(v, "area.cardTitle")}
                </span>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px" }}>
                  {(lookup(v, "area.stats") || []).map((x, index6) => (
                    <Fragment key={index6}>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                        <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "20px", "fontWeight": "800", "lineHeight": "1.1" }}>
                          {lookup(x, "v")}
                        </span>
                        <span style={{ "fontSize": "11px", "color": lookup(v, "area.cardMuted") }}>
                          {lookup(x, "k")}
                        </span>
                      </span>
                    </Fragment>
                  ))}
                </div>
                {Boolean(lookup(v, "area.hasBar")) && (
                  <Fragment>
                    <span style={{ "height": "6px", "borderRadius": "999px", "background": lookup(v, "area.barTrack"), "overflow": "hidden" }}>
                      <span style={{ "display": "block", "width": lookup(v, "area.barW"), "height": "100%", "background": lookup(v, "accent"), "borderRadius": "999px" }}></span>
                    </span>
                  </Fragment>
                )}
                <button onClick={lookup(v, "area.cardGo")} style={{ "alignSelf": "flex-start", "minHeight": "34px", "padding": "0 12px", "borderRadius": "9px", "border": "none", "background": lookup(v, "area.cardBtnBg"), "color": lookup(v, "area.cardBtnFg"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "12px", "fontWeight": "600" }}>
                  {lookup(v, "area.cardCta")}
                  {" →"}
                </button>
              </div>
            </aside>
          </Fragment>
        )}
      </div>
      <div style={{ "flex": "999 1 640px", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
        <header style={{ "background": "#FFFFFF", "borderBottom": "1px solid #ECECEA", "padding": "0 32px", "minHeight": "68px", "display": "flex", "alignItems": "center", "gap": "14px", "flexWrap": "wrap" }}>
          <nav aria-label={"Ruta"} style={{ "flex": "1 1 220px", "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "14px", "color": "#6B6B6B" }}>
            <span>
              {lookup(v, "sectionGroup")}
            </span>
            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
              <path d={"M9 6l6 6-6 6"}></path>
            </svg>
            <span style={{ "color": "#111111", "fontWeight": "600" }}>
              {lookup(v, "section")}
            </span>
          </nav>
          <label style={{ "position": "relative", "display": "flex", "alignItems": "center", "width": "340px", "maxWidth": "100%", "height": "40px", "borderRadius": "10px", "background": "#F4F4F2", "padding": "0 12px", "boxSizing": "border-box", "gap": "8px" }}>
            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#6B6B6B"} strokeWidth={"2"} aria-hidden={"true"}>
              <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
              <path d={"M16 16l4 4"}></path>
            </svg>
            <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
              {"Buscar en el panel"}
            </span>
            <input type={"search"} placeholder={"Buscar pedidos, productos, clientes…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "14px", "outline": "none" }} />
            <span style={{ "fontSize": "11px", "color": "#6B6B6B", "border": "1px solid #DADAD6", "borderRadius": "6px", "padding": "1px 6px", "background": "#FFFFFF" }}>
              {"Ctrl K"}
            </span>
          </label>
          <button aria-label={"Ayuda"} style={{ "width": "40px", "height": "40px", "borderRadius": "10px", "border": "none", "background": "transparent", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#3A3A3A"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}>
              <circle cx={"12"} cy={"12"} r={"9"}></circle>
              <path d={"M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5V14M12 17h.01"}></path>
            </svg>
          </button>
          <button aria-label={"Notificaciones: 3 nuevas"} style={{ "position": "relative", "width": "40px", "height": "40px", "borderRadius": "10px", "border": "none", "background": "transparent", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#3A3A3A"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}>
              <path d={"M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 20a2 2 0 0 0 4 0"}></path>
            </svg>
            <span style={{ "position": "absolute", "top": "8px", "right": "9px", "width": "8px", "height": "8px", "borderRadius": "50%", "background": "#E8701F", "border": "2px solid #FFFFFF" }}></span>
          </button>
          <button onClick={lookup(v, "goProducts")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "40px", "padding": "0 16px", "borderRadius": "10px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "600" }}>
            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
              <path d={"M12 5v14M5 12h14"}></path>
            </svg>
            {"Nuevo producto"}
          </button>
        </header>
        <main style={{ "padding": "28px 32px 48px", "display": "flex", "flexDirection": "column", "gap": "22px", "maxWidth": "1480px", "width": "100%", "boxSizing": "border-box" }}>
          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "gap": "16px", "flexWrap": "wrap" }}>
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
              <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "30px", "fontWeight": "800", "letterSpacing": "-0.01em", "lineHeight": "1.1" }}>
                {lookup(v, "pageTitle")}
              </h1>
              <p style={{ "margin": "0", "fontSize": "14px", "color": "#6B6B6B" }}>
                {lookup(v, "pageSub")}
              </p>
            </div>
            {Boolean(lookup(v, "showRanges")) && (
              <Fragment>
                <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                  <div role={"group"} aria-label={"Periodo"} style={{ "display": "inline-flex", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "12px", "padding": "4px", "gap": "2px" }}>
                    {(lookup(v, "ranges") || []).map((r, index7) => (
                      <Fragment key={index7}>
                        <button onClick={lookup(r, "pick")} aria-pressed={lookup(r, "pressed")} style={{ "minHeight": "34px", "padding": "0 14px", "borderRadius": "9px", "border": "none", "background": lookup(r, "bg"), "color": lookup(r, "fg"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "13px", "fontWeight": "600" }}>
                          {lookup(r, "name")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "42px", "padding": "0 14px", "borderRadius": "12px", "border": "1px solid #ECECEA", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "13px", "fontWeight": "600" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
                    </svg>
                    {"Exportar"}
                  </button>
                </div>
              </Fragment>
            )}
          </div>
          {Boolean(lookup(v, "isBandeja")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                <div style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "center", "gap": "8px 22px", "padding": "14px 18px", "borderRadius": "14px", "background": "#141414", "color": "#FFFFFF", "fontSize": "14px" }}>
                  <span style={{ "fontWeight": "700", "color": lookup(v, "accent") }}>
                    {"Hoy"}
                  </span>
                  {(lookup(v, "pulse") || []).map((p, index8) => (
                    <Fragment key={index8}>
                      <button onClick={lookup(p, "go")} style={{ "display": "inline-flex", "alignItems": "baseline", "gap": "6px", "border": "none", "background": "transparent", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "padding": "4px 0" }}>
                        <strong style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "18px" }}>
                          {lookup(p, "v")}
                        </strong>
                        <span style={{ "color": "#BDBDBD" }}>
                          {lookup(p, "k")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                  <span style={{ "flex": "1" }}></span>
                  <button onClick={lookup(v, "goResumen")} style={{ "border": "none", "background": "transparent", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "13px", "fontWeight": "600", "textDecoration": "underline", "textUnderlineOffset": "4px" }}>
                    {"Ver gráficos"}
                  </button>
                </div>
                {Boolean(lookup(v, "sel.isOrder")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                      <div style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "22px" }}>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "16px", "flexWrap": "wrap" }}>
                          <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                            <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                              {lookup(v, "sel.kicker")}
                            </span>
                            <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "28px", "fontWeight": "800", "letterSpacing": "-0.01em" }}>
                              {lookup(v, "sel.heading")}
                            </span>
                            <span style={{ "fontSize": "14px", "color": "#3A3A3A" }}>
                              {lookup(v, "sel.meta")}
                            </span>
                          </div>
                          <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "30px", "fontWeight": "800" }}>
                            {lookup(v, "sel.total")}
                          </span>
                        </div>
                        <ol style={{ "listStyle": "none", "margin": "0", "padding": "0", "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "6px" }}>
                          {(lookup(v, "sel.steps") || []).map((s, index9) => (
                            <Fragment key={index9}>
                              <li style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                                <span style={{ "height": "6px", "borderRadius": "999px", "background": lookup(s, "bar") }}></span>
                                <span style={{ "display": "flex", "alignItems": "center", "gap": "6px", "fontSize": "13px", "fontWeight": lookup(s, "weight"), "color": lookup(s, "fg") }}>
                                  <span style={{ "width": "18px", "height": "18px", "borderRadius": "50%", "background": lookup(s, "dot"), "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "10px", "fontWeight": "700", "flex": "none" }}>
                                    {lookup(s, "mark")}
                                  </span>
                                  {lookup(s, "name")}
                                </span>
                                <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                                  {lookup(s, "when")}
                                </span>
                              </li>
                            </Fragment>
                          ))}
                        </ol>
                        <div style={{ "display": "flex", "gap": "10px", "flexWrap": "wrap", "paddingTop": "4px", "borderTop": "1px solid #F1F1EE" }}>
                          {Boolean(lookup(v, "sel.canAdvance")) && (
                            <Fragment>
                              <button onClick={lookup(v, "sel.advance")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "46px", "padding": "0 20px", "borderRadius": "12px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={"M5 12l5 5 9-10"}></path>
                                </svg>
                                {lookup(v, "sel.nextLabel")}
                              </button>
                            </Fragment>
                          )}
                          {Boolean(lookup(v, "sel.finished")) && (
                            <Fragment>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "46px", "padding": "0 16px", "borderRadius": "12px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "14px", "fontWeight": "700" }}>
                                {"✓ Pedido entregado"}
                              </span>
                            </Fragment>
                          )}
                          <a href={"https://wa.me/51954802744"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "46px", "padding": "0 16px", "borderRadius": "12px", "border": "1px solid #DADAD6", "color": "#111111", "textDecoration": "none", "fontSize": "14px", "fontWeight": "600" }}>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#25A244"} strokeWidth={"2"} aria-hidden={"true"}>
                              <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                            </svg>
                            {"Escribir al cliente"}
                          </a>
                          <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "46px", "padding": "0 16px", "borderRadius": "12px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "600" }}>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M6 9V3h12v6M6 18H4v-7h16v7h-2M8 14h8v7H8z"}></path>
                            </svg>
                            {lookup(v, "sel.docLabel")}
                          </button>
                        </div>
                      </div>
                      <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "flex-start" }}>
                        <section style={{ "flex": "2 1 420px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                          <h2 style={{ "margin": "0 0 10px", "fontSize": "15px", "fontWeight": "700" }}>
                            {"Productos"}
                          </h2>
                          {(lookup(v, "sel.lines") || []).map((l, index10) => (
                            <Fragment key={index10}>
                              <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "10px 0", "borderTop": "1px solid #F1F1EE" }}>
                                <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "52px", "height": "52px", "borderRadius": "12px", "objectFit": "cover", "flex": "none" }} />
                                <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                                  <span style={{ "fontSize": "14px", "fontWeight": "600" }}>
                                    {lookup(l, "name")}
                                  </span>
                                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                    {lookup(l, "qty")}
                                    {" × "}
                                    {lookup(l, "unit")}
                                  </span>
                                </span>
                                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                  {lookup(l, "total")}
                                </span>
                              </div>
                            </Fragment>
                          ))}
                          <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "paddingTop": "12px", "borderTop": "1px solid #ECECEA", "fontSize": "14px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "color": "#6B6B6B" }}>
                              <span>
                                {"Envío"}
                              </span>
                              <span>
                                {lookup(v, "sel.ship")}
                              </span>
                            </span>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "fontWeight": "700" }}>
                              <span>
                                {"Total"}
                              </span>
                              <span>
                                {lookup(v, "sel.total")}
                              </span>
                            </span>
                          </div>
                        </section>
                        <div style={{ "flex": "1 1 280px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                          <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                            <h2 style={{ "margin": "0", "fontSize": "15px", "fontWeight": "700" }}>
                              {"Cliente"}
                            </h2>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                              <span style={{ "width": "42px", "height": "42px", "borderRadius": "50%", "background": "#FFE7D6", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "700" }}>
                                {lookup(v, "sel.ini")}
                              </span>
                              <span style={{ "display": "flex", "flexDirection": "column" }}>
                                <span style={{ "fontWeight": "700" }}>
                                  {lookup(v, "sel.client")}
                                </span>
                                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                  {lookup(v, "sel.clientType")}
                                </span>
                              </span>
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "color": "#3A3A3A" }}>
                              <span>
                                {lookup(v, "sel.delivery")}
                              </span>
                              <span>
                                {lookup(v, "sel.history")}
                              </span>
                            </span>
                          </section>
                          <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                            <h2 style={{ "margin": "0", "fontSize": "15px", "fontWeight": "700" }}>
                              {"Pago"}
                            </h2>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "14px" }}>
                              <span>
                                {lookup(v, "sel.payMethod")}
                              </span>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "3px 10px", "borderRadius": "999px", "background": lookup(v, "sel.payBg"), "color": lookup(v, "sel.payFg"), "fontSize": "12px", "fontWeight": "700" }}>
                                {lookup(v, "sel.payState")}
                              </span>
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                              {lookup(v, "sel.payNote")}
                            </span>
                          </section>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "sel.isQuote")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "flex-start" }}>
                      <section style={{ "flex": "2 1 520px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "16px", "flexWrap": "wrap" }}>
                          <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                            <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                              {lookup(v, "sel.kicker")}
                            </span>
                            <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "28px", "fontWeight": "800" }}>
                              {lookup(v, "sel.heading")}
                            </span>
                            <span style={{ "fontSize": "14px", "color": "#3A3A3A" }}>
                              {lookup(v, "sel.meta")}
                            </span>
                          </div>
                          <div role={"group"} aria-label={"Nivel de precio"} style={{ "display": "inline-flex", "background": "#F4F4F2", "borderRadius": "12px", "padding": "4px", "gap": "2px" }}>
                            {(lookup(v, "tierPick") || []).map((t, index11) => (
                              <Fragment key={index11}>
                                <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "minHeight": "34px", "padding": "0 12px", "borderRadius": "9px", "border": "none", "background": lookup(t, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "13px", "fontWeight": "600", "boxShadow": lookup(t, "shadow") }}>
                                  {lookup(t, "name")}
                                  {" "}
                                  {lookup(t, "pct")}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <blockquote style={{ "margin": "0", "padding": "14px 16px", "borderRadius": "12px", "background": "#F6F6F4", "fontSize": "14px", "lineHeight": "1.5", "color": "#3A3A3A" }}>
                          {"“"}
                          {lookup(v, "sel.message")}
                          {"”"}
                        </blockquote>
                        <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                          <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "520px" }}>
                            <thead>
                              <tr style={{ "textAlign": "left", "fontSize": "12px", "color": "#6B6B6B" }}>
                                <th style={{ "padding": "8px 6px", "fontWeight": "500" }}>
                                  {"Producto"}
                                </th>
                                <th style={{ "padding": "8px 6px", "fontWeight": "500", "textAlign": "center" }}>
                                  {"Cantidad"}
                                </th>
                                <th style={{ "padding": "8px 6px", "fontWeight": "500", "textAlign": "right" }}>
                                  {"Lista"}
                                </th>
                                <th style={{ "padding": "8px 6px", "fontWeight": "500", "textAlign": "right" }}>
                                  {"Precio "}
                                  {lookup(v, "tierName")}
                                </th>
                                <th style={{ "padding": "8px 6px", "fontWeight": "500", "textAlign": "right" }}>
                                  {"Subtotal"}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {(lookup(v, "quoteRows") || []).map((q, index12) => (
                                <Fragment key={index12}>
                                  <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                                    <td style={{ "padding": "10px 6px" }}>
                                      <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                                        <img src={assetSrc(lookup(q, "img"))} alt={""} style={{ "width": "40px", "height": "40px", "borderRadius": "10px", "objectFit": "cover" }} />
                                        <span style={{ "fontWeight": "600" }}>
                                          {lookup(q, "name")}
                                        </span>
                                      </span>
                                    </td>
                                    <td style={{ "padding": "10px 6px", "textAlign": "center" }}>
                                      <span style={{ "display": "inline-flex", "alignItems": "center", "border": "1px solid #DADAD6", "borderRadius": "10px" }}>
                                        <button onClick={lookup(q, "dec")} aria-label={"Menos"} style={{ "width": "32px", "height": "32px", "border": "none", "background": "transparent", "cursor": "pointer", "fontSize": "16px" }}>
                                          {"−"}
                                        </button>
                                        <span style={{ "minWidth": "36px", "textAlign": "center", "fontWeight": "700" }}>
                                          {lookup(q, "qty")}
                                        </span>
                                        <button onClick={lookup(q, "inc")} aria-label={"Más"} style={{ "width": "32px", "height": "32px", "border": "none", "background": "transparent", "cursor": "pointer", "fontSize": "16px" }}>
                                          {"+"}
                                        </button>
                                      </span>
                                    </td>
                                    <td style={{ "padding": "10px 6px", "textAlign": "right", "color": "#8C8C8C", "textDecoration": "line-through" }}>
                                      {lookup(q, "list")}
                                    </td>
                                    <td style={{ "padding": "10px 6px", "textAlign": "right", "fontWeight": "600" }}>
                                      {lookup(q, "unit")}
                                    </td>
                                    <td style={{ "padding": "10px 6px", "textAlign": "right", "fontWeight": "700" }}>
                                      {lookup(q, "sub")}
                                    </td>
                                  </tr>
                                </Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div style={{ "display": "flex", "justifyContent": "flex-end", "gap": "28px", "flexWrap": "wrap", "fontSize": "14px", "paddingTop": "8px", "borderTop": "1px solid #ECECEA" }}>
                          <span style={{ "color": "#6B6B6B" }}>
                            {"Ahorro del cliente "}
                            <strong style={{ "color": "#1B5E20" }}>
                              {lookup(v, "quoteSave")}
                            </strong>
                          </span>
                          <span>
                            {"Total cotizado "}
                            <strong style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px" }}>
                              {lookup(v, "quoteTotal")}
                            </strong>
                          </span>
                        </div>
                        <div style={{ "display": "flex", "gap": "10px", "flexWrap": "wrap" }}>
                          <a href={"https://wa.me/51954802744"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "46px", "padding": "0 20px", "borderRadius": "12px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                            <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} aria-hidden={"true"}>
                              <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                            </svg>
                            {"Enviar por WhatsApp"}
                          </a>
                          <button style={{ "minHeight": "46px", "padding": "0 16px", "borderRadius": "12px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "600" }}>
                            {"Descargar PDF"}
                          </button>
                          <button style={{ "minHeight": "46px", "padding": "0 16px", "borderRadius": "12px", "border": "1px dashed #BDBDBD", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "600" }}>
                            {"+ Agregar producto"}
                          </button>
                        </div>
                      </section>
                      <section style={{ "flex": "1 1 260px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                        <h2 style={{ "margin": "0", "fontSize": "15px", "fontWeight": "700" }}>
                          {"Empresa"}
                        </h2>
                        {(lookup(v, "sel.facts") || []).map((f, index13) => (
                          <Fragment key={index13}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "10px", "fontSize": "13px", "padding": "6px 0", "borderTop": "1px solid #F1F1EE" }}>
                              <span style={{ "color": "#6B6B6B" }}>
                                {lookup(f, "k")}
                              </span>
                              <span style={{ "fontWeight": "600", "textAlign": "right" }}>
                                {lookup(f, "v")}
                              </span>
                            </span>
                          </Fragment>
                        ))}
                      </section>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "sel.isChat")) && (
                  <Fragment>
                    <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "overflow": "hidden", "display": "flex", "flexDirection": "column", "minHeight": "520px" }}>
                      <div style={{ "padding": "16px 20px", "borderBottom": "1px solid #ECECEA", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                          <span style={{ "width": "42px", "height": "42px", "borderRadius": "50%", "background": "#25D366", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "700", "color": "#111111" }}>
                            {lookup(v, "sel.ini")}
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontWeight": "700" }}>
                              {lookup(v, "sel.heading")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                              {lookup(v, "sel.meta")}
                            </span>
                          </span>
                        </span>
                        <button onClick={lookup(v, "goOrders")} style={{ "minHeight": "40px", "padding": "0 14px", "borderRadius": "10px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "13px", "fontWeight": "700" }}>
                          {"Convertir en pedido"}
                        </button>
                      </div>
                      <div style={{ "flex": "1", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px", "background": "#F7F3EE" }}>
                        {(lookup(v, "sel.msgs") || []).map((m, index14) => (
                          <Fragment key={index14}>
                            <div style={{ "alignSelf": lookup(m, "align"), "maxWidth": "70%", "background": lookup(m, "bg"), "borderRadius": "14px", "padding": "10px 14px", "fontSize": "14px", "lineHeight": "1.45", "boxShadow": "0 1px 1px rgba(0,0,0,0.06)" }}>
                              {lookup(m, "t")}
                              <span style={{ "display": "block", "textAlign": "right", "fontSize": "11px", "color": "#6B6B6B", "marginTop": "4px" }}>
                                {lookup(m, "time")}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ "padding": "12px 16px", "borderTop": "1px solid #ECECEA", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                        <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                          {(lookup(v, "quickReplies") || []).map((q, index15) => (
                            <Fragment key={index15}>
                              <button style={{ "minHeight": "32px", "padding": "0 12px", "borderRadius": "9px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "12px" }}>
                                {lookup(q, "t")}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div style={{ "display": "flex", "gap": "10px" }}>
                          <label style={{ "flex": "1", "display": "flex" }}>
                            <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                              {"Mensaje"}
                            </span>
                            <input type={"text"} placeholder={"Escribe un mensaje…"} style={{ "flex": "1", "height": "44px", "border": "1px solid #DADAD6", "borderRadius": "12px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "14px" }} />
                          </label>
                          <button aria-label={"Enviar"} style={{ "width": "44px", "height": "44px", "borderRadius": "12px", "border": "none", "background": "#25D366", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.2"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M4 12l16-8-6 16-2-6z"}></path>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </section>
                  </Fragment>
                )}
                {Boolean(lookup(v, "sel.isStock")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "flex-start" }}>
                      <section style={{ "flex": "2 1 480px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                        <div style={{ "display": "flex", "gap": "18px", "alignItems": "center", "flexWrap": "wrap" }}>
                          <img src={assetSrc(lookup(v, "sel.img"))} alt={""} style={{ "width": "96px", "height": "96px", "borderRadius": "18px", "objectFit": "cover" }} />
                          <div style={{ "flex": "1", "minWidth": "200px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                            <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                              {lookup(v, "sel.kicker")}
                            </span>
                            <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "800" }}>
                              {lookup(v, "sel.heading")}
                            </span>
                            <span style={{ "fontSize": "14px", "color": "#3A3A3A" }}>
                              {lookup(v, "sel.meta")}
                            </span>
                          </div>
                        </div>
                        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "12px" }}>
                          {(lookup(v, "sel.facts") || []).map((f, index16) => (
                            <Fragment key={index16}>
                              <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "14px", "borderRadius": "14px", "background": "#F6F6F4" }}>
                                <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "800" }}>
                                  {lookup(f, "v")}
                                </span>
                                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                  {lookup(f, "k")}
                                </span>
                              </span>
                            </Fragment>
                          ))}
                        </div>
                        <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                            {"Ventas de las últimas 8 semanas"}
                          </span>
                          <div aria-hidden={"true"} style={{ "display": "flex", "alignItems": "flex-end", "gap": "6px", "height": "90px" }}>
                            {(lookup(v, "sel.weeks") || []).map((w, index17) => (
                              <Fragment key={index17}>
                                <span style={{ "flex": "1", "height": lookup(w, "h"), "background": "#E8701F", "borderRadius": "4px 4px 0 0" }}></span>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div style={{ "display": "flex", "gap": "10px", "flexWrap": "wrap" }}>
                          <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "46px", "padding": "0 20px", "borderRadius": "12px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                            {"Pedir "}
                            {lookup(v, "sel.reorder")}
                            {" al proveedor"}
                          </button>
                          <button onClick={lookup(v, "goProducts")} style={{ "minHeight": "46px", "padding": "0 16px", "borderRadius": "12px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "600" }}>
                            {"Editar producto"}
                          </button>
                          <button style={{ "minHeight": "46px", "padding": "0 16px", "borderRadius": "12px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "600" }}>
                            {"Ocultar de la tienda"}
                          </button>
                        </div>
                      </section>
                      <section style={{ "flex": "1 1 260px", "minWidth": "0", "background": "#141414", "color": "#FFFFFF", "borderRadius": "20px", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "700", "color": lookup(v, "accent") }}>
                          {"Sugerencia"}
                        </span>
                        <span style={{ "fontSize": "15px", "lineHeight": "1.5" }}>
                          {lookup(v, "sel.tip")}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#A8A8A8" }}>
                          {"Proveedor: [PROVEEDOR] · Tiempo de entrega: [DÍAS]"}
                        </span>
                      </section>
                    </div>
                  </Fragment>
                )}
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isResumen")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "20px" }}>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(240px, 1fr))", "gap": "16px" }}>
                  {(lookup(v, "kpis") || []).map((k, index18) => (
                    <Fragment key={index18}>
                      <article style={{ "background": lookup(k, "bg"), "color": lookup(k, "fg"), "border": "1px solid " + String(lookup(k, "border") ?? ""), "borderRadius": "20px", "padding": "20px 20px 14px", "display": "flex", "flexDirection": "column", "gap": "14px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)" }}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                          <span style={{ "width": "34px", "height": "34px", "borderRadius": "10px", "background": lookup(k, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <svg width={"17"} height={"17"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(k, "iconFg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(k, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "fontSize": "14px", "fontWeight": "600", "color": lookup(k, "labelColor") }}>
                            {lookup(k, "label")}
                          </span>
                        </div>
                        <div style={{ "display": "flex", "alignItems": "flex-end", "justifyContent": "space-between", "gap": "10px" }}>
                          <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "32px", "fontWeight": "800", "letterSpacing": "-0.01em", "lineHeight": "1" }}>
                            {lookup(k, "value")}
                          </span>
                          <svg width={"96"} height={"36"} viewBox={"0 0 100 36"} preserveAspectRatio={"none"} aria-hidden={"true"} style={{ "flex": "none" }}>
                            <path d={lookup(k, "spark")} fill={"none"} stroke={lookup(k, "sparkColor")} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} vectorEffect={"non-scaling-stroke"}></path>
                          </svg>
                        </div>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "13px", "color": lookup(k, "labelColor") }}>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "3px", "padding": "2px 8px", "borderRadius": "999px", "background": lookup(k, "deltaBg"), "color": lookup(k, "deltaFg"), "fontWeight": "700" }}>
                            <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} aria-hidden={"true"}>
                              <path d={lookup(k, "deltaIcon")}></path>
                            </svg>
                            {lookup(k, "delta")}
                          </span>
                          {lookup(k, "note")}
                          {"\n"}
                        </div>
                      </article>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "stretch" }}>
                  <section style={{ "flex": "2 1 600px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "22px 22px 16px", "display": "flex", "flexDirection": "column", "gap": "14px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "12px", "flexWrap": "wrap" }}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                        <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                          {"Ventas "}
                          {lookup(v, "chartTitle")}
                        </h2>
                        <span style={{ "display": "flex", "alignItems": "baseline", "gap": "10px" }}>
                          <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "26px", "fontWeight": "800" }}>
                            {lookup(v, "chartTotal")}
                          </span>
                          <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                            {"vs. "}
                            {lookup(v, "chartPrevTotal")}
                            {" el periodo anterior"}
                          </span>
                        </span>
                      </div>
                      <div style={{ "display": "flex", "gap": "16px", "fontSize": "13px", "color": "#3A3A3A" }}>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px" }}>
                          <span style={{ "width": "14px", "height": "3px", "borderRadius": "2px", "background": "#E8701F" }}></span>
                          {"Este periodo"}
                        </span>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px" }}>
                          <span style={{ "width": "14px", "height": "0", "borderTop": "2px dashed #9A9A9A" }}></span>
                          {"Periodo anterior"}
                        </span>
                      </div>
                    </div>
                    <div style={{ "display": "flex", "gap": "10px" }}>
                      <div aria-hidden={"true"} style={{ "display": "flex", "flexDirection": "column", "justifyContent": "space-between", "height": "260px", "fontSize": "11px", "color": "#6B6B6B", "textAlign": "right", "flex": "none", "paddingBottom": "2px", "boxSizing": "border-box" }}>
                        <span>
                          {lookup(v, "axisTop")}
                        </span>
                        <span>
                          {lookup(v, "axisMid")}
                        </span>
                        <span>
                          {"0"}
                        </span>
                      </div>
                      <div style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        <div style={{ "position": "relative", "height": "260px" }}>
                          <div aria-hidden={"true"} style={{ "position": "absolute", "inset": "0", "display": "flex", "flexDirection": "column", "justifyContent": "space-between" }}>
                            <span style={{ "borderTop": "1px dashed #ECECEA" }}></span>
                            <span style={{ "borderTop": "1px dashed #ECECEA" }}></span>
                            <span style={{ "borderTop": "1px solid #DADAD6" }}></span>
                          </div>
                          <svg width={"100%"} height={"260"} viewBox={"0 0 1000 300"} preserveAspectRatio={"none"} aria-hidden={"true"} style={{ "position": "absolute", "inset": "0" }}>
                            <path d={lookup(v, "areaPath")} fill={"#E8701F"} fillOpacity={"0.10"}></path>
                            <path d={lookup(v, "prevPath")} fill={"none"} stroke={"#9A9A9A"} strokeWidth={"2"} strokeDasharray={"5 5"} vectorEffect={"non-scaling-stroke"}></path>
                            <path d={lookup(v, "linePath")} fill={"none"} stroke={"#E8701F"} strokeWidth={"2.5"} strokeLinejoin={"round"} strokeLinecap={"round"} vectorEffect={"non-scaling-stroke"}></path>
                          </svg>
                          <div style={{ "position": "absolute", "inset": "0", "display": "flex" }}>
                            {(lookup(v, "points") || []).map((p, index19) => (
                              <Fragment key={index19}>
                                <button onMouseEnter={lookup(p, "enter")} onMouseLeave={lookup(p, "leave")} onFocus={lookup(p, "enter")} onBlur={lookup(p, "leave")} aria-label={lookup(p, "aria")} style={{ "position": "relative", "flex": "1", "height": "100%", "border": "none", "background": "transparent", "padding": "0", "cursor": "crosshair" }}>
                                  {Boolean(lookup(p, "hover")) && (
                                    <Fragment>
                                      <span style={{ "position": "absolute", "left": "50%", "top": "0", "bottom": "0", "borderLeft": "1px solid #111111", "opacity": "0.25" }}></span>
                                      <span style={{ "position": "absolute", "left": "50%", "top": lookup(p, "top"), "width": "12px", "height": "12px", "margin": "-6px 0 0 -6px", "borderRadius": "50%", "background": "#E8701F", "border": "2px solid #FFFFFF", "boxSizing": "border-box" }}></span>
                                      <span style={{ "position": "absolute", "{{p.side}}": "50%", "top": "8px", "margin": "0 10px", "background": "#111111", "color": "#FFFFFF", "borderRadius": "10px", "padding": "10px 12px", "whiteSpace": "nowrap", "textAlign": "left", "zIndex": "3", "display": "flex", "flexDirection": "column", "gap": "4px", "fontSize": "12px" }}>
                                        <strong style={{ "fontSize": "12px" }}>
                                          {lookup(p, "label")}
                                        </strong>
                                        <span style={{ "display": "flex", "alignItems": "center", "gap": "6px" }}>
                                          <span style={{ "width": "8px", "height": "8px", "borderRadius": "50%", "background": "#E8701F" }}></span>
                                          {lookup(p, "value")}
                                        </span>
                                        <span style={{ "display": "flex", "alignItems": "center", "gap": "6px", "color": "#CFCFCF" }}>
                                          <span style={{ "width": "8px", "height": "8px", "borderRadius": "50%", "background": "#9A9A9A" }}></span>
                                          {lookup(p, "prev")}
                                        </span>
                                      </span>
                                    </Fragment>
                                  )}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                        <div aria-hidden={"true"} style={{ "display": "flex" }}>
                          {(lookup(v, "points") || []).map((p, index20) => (
                            <Fragment key={index20}>
                              <span style={{ "flex": "1", "textAlign": "center", "fontSize": "11px", "color": "#6B6B6B", "whiteSpace": "nowrap", "overflow": "hidden" }}>
                                {lookup(p, "tick")}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                  <section style={{ "flex": "1 1 320px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "18px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)" }}>
                    <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Meta del mes"}
                    </h2>
                    <div style={{ "display": "flex", "alignItems": "center", "gap": "18px" }}>
                      <svg width={"120"} height={"120"} viewBox={"0 0 120 120"} role={"img"} aria-label={lookup(v, "goalAria")} style={{ "flex": "none" }}>
                        <circle cx={"60"} cy={"60"} r={"50"} fill={"none"} stroke={"#F1F1EE"} strokeWidth={"12"}></circle>
                        <circle cx={"60"} cy={"60"} r={"50"} fill={"none"} stroke={"#E8701F"} strokeWidth={"12"} strokeLinecap={"round"} strokeDasharray={lookup(v, "goalDash")} transform={"rotate(-90 60 60)"}></circle>
                        <text x={"60"} y={"58"} textAnchor={"middle"} fontFamily={"Archivo, sans-serif"} fontSize={"24"} fontWeight={"800"} fill={"#111111"}>
                          {lookup(v, "goalPct")}
                        </text>
                        <text x={"60"} y={"76"} textAnchor={"middle"} fontFamily={"Roboto, sans-serif"} fontSize={"11"} fill={"#6B6B6B"}>
                          {"de la meta"}
                        </text>
                      </svg>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "color": "#6B6B6B" }}>
                        <span>
                          <strong style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "20px", "color": "#111111" }}>
                            {"S/ 18,450"}
                          </strong>
                        </span>
                        <span>
                          {"de S/ 25,000 (meta de ejemplo)"}
                        </span>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "color": "#1B5E20", "fontWeight": "600" }}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} aria-hidden={"true"}>
                            <path d={"M12 19V5M5 12l7-7 7 7"}></path>
                          </svg>
                          {"Faltan S/ 6,550 · 8 días"}
                        </span>
                      </div>
                    </div>
                    <div style={{ "borderTop": "1px solid #ECECEA", "paddingTop": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                      <h3 style={{ "margin": "0", "fontSize": "14px", "fontWeight": "700" }}>
                        {"Ventas por canal"}
                      </h3>
                      <div aria-hidden={"true"} style={{ "display": "flex", "gap": "2px", "height": "12px", "borderRadius": "6px", "overflow": "hidden" }}>
                        {(lookup(v, "channels") || []).map((c, index21) => (
                          <Fragment key={index21}>
                            <span style={{ "width": lookup(c, "pct"), "background": lookup(c, "color") }}></span>
                          </Fragment>
                        ))}
                      </div>
                      {(lookup(v, "channels") || []).map((c, index22) => (
                        <Fragment key={index22}>
                          <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "13px" }}>
                            <span style={{ "width": "10px", "height": "10px", "borderRadius": "3px", "background": lookup(c, "color"), "flex": "none" }}></span>
                            <span style={{ "flex": "1" }}>
                              {lookup(c, "name")}
                            </span>
                            <span style={{ "color": "#6B6B6B" }}>
                              {lookup(c, "pct")}
                            </span>
                            <span style={{ "fontWeight": "700", "minWidth": "72px", "textAlign": "right" }}>
                              {lookup(c, "amount")}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </section>
                </div>
                <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "stretch" }}>
                  <section style={{ "flex": "2 1 600px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                        {"Pedidos recientes"}
                      </h2>
                      <button onClick={lookup(v, "goOrders")} style={{ "border": "none", "background": "transparent", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "13px", "fontWeight": "600", "color": "#C2410C", "minHeight": "40px" }}>
                        {"Ver todos →"}
                      </button>
                    </div>
                    <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                      <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "600px" }}>
                        <thead>
                          <tr style={{ "textAlign": "left", "fontSize": "12px", "color": "#6B6B6B" }}>
                            <th style={{ "padding": "8px 6px", "fontWeight": "500" }}>
                              {"Cliente"}
                            </th>
                            <th style={{ "padding": "8px 6px", "fontWeight": "500" }}>
                              {"Pedido"}
                            </th>
                            <th style={{ "padding": "8px 6px", "fontWeight": "500" }}>
                              {"Canal"}
                            </th>
                            <th style={{ "padding": "8px 6px", "fontWeight": "500" }}>
                              {"Estado"}
                            </th>
                            <th style={{ "padding": "8px 6px", "fontWeight": "500", "textAlign": "right" }}>
                              {"Total"}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {(lookup(v, "recent") || []).map((o, index23) => (
                            <Fragment key={index23}>
                              <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                                <td style={{ "padding": "12px 6px" }}>
                                  <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                                    <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(o, "avBg"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "12px", "fontWeight": "700", "flex": "none" }}>
                                      {lookup(o, "ini")}
                                    </span>
                                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                                      <span style={{ "fontWeight": "600" }}>
                                        {lookup(o, "client")}
                                      </span>
                                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                        {lookup(o, "type")}
                                      </span>
                                    </span>
                                  </span>
                                </td>
                                <td style={{ "padding": "12px 6px" }}>
                                  <span style={{ "display": "flex", "flexDirection": "column" }}>
                                    <span style={{ "fontWeight": "600" }}>
                                      {lookup(o, "id")}
                                    </span>
                                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                      {lookup(o, "date")}
                                    </span>
                                  </span>
                                </td>
                                <td style={{ "padding": "12px 6px", "color": "#3A3A3A" }}>
                                  {lookup(o, "channel")}
                                </td>
                                <td style={{ "padding": "12px 6px" }}>
                                  <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": lookup(o, "sBg"), "color": lookup(o, "sFg"), "fontSize": "12px", "fontWeight": "600" }}>
                                    <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                      <path d={lookup(o, "sIcon")}></path>
                                    </svg>
                                    {lookup(o, "status")}
                                  </span>
                                </td>
                                <td style={{ "padding": "12px 6px", "textAlign": "right", "fontWeight": "700" }}>
                                  {lookup(o, "total")}
                                </td>
                              </tr>
                            </Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                  <section style={{ "flex": "1 1 320px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)" }}>
                    <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Requiere tu atención"}
                    </h2>
                    <button onClick={lookup(v, "goQuotes")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px", "borderRadius": "14px", "border": "none", "background": "#141414", "color": "#FFFFFF", "cursor": "pointer", "textAlign": "left", "fontFamily": "Roboto, sans-serif" }}>
                      <span style={{ "width": "38px", "height": "38px", "borderRadius": "10px", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"}></path>
                        </svg>
                      </span>
                      <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {"5 cotizaciones de empresas"}
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                          {"2 nuevas hoy · minería y ferretería"}
                        </span>
                      </span>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M9 6l6 6-6 6"}></path>
                      </svg>
                    </button>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                      <h3 style={{ "margin": "0", "fontSize": "14px", "fontWeight": "700" }}>
                        {"Stock por agotarse"}
                      </h3>
                      <button onClick={lookup(v, "goStock")} style={{ "border": "none", "background": "transparent", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "13px", "fontWeight": "600", "color": "#C2410C", "minHeight": "36px" }}>
                        {"Inventario →"}
                      </button>
                    </div>
                    {(lookup(v, "lowStock") || []).map((p, index24) => (
                      <Fragment key={index24}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                          <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "40px", "height": "40px", "borderRadius": "10px", "objectFit": "cover", "flex": "none" }} />
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px", "fontSize": "13px" }}>
                              <span style={{ "fontWeight": "600", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                                {lookup(p, "name")}
                              </span>
                              <span style={{ "fontWeight": "700", "color": lookup(p, "sFg"), "whiteSpace": "nowrap" }}>
                                {lookup(p, "left")}
                              </span>
                            </span>
                            <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F1F1EE", "overflow": "hidden" }}>
                              <span style={{ "display": "block", "width": lookup(p, "w"), "height": "100%", "background": lookup(p, "bar"), "borderRadius": "999px" }}></span>
                            </span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </section>
                </div>
                <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "stretch" }}>
                  <section style={{ "flex": "1 1 420px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)" }}>
                    <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Ventas por categoría"}
                    </h2>
                    {(lookup(v, "byCat") || []).map((c, index25) => (
                      <Fragment key={index25}>
                        <div style={{ "display": "grid", "gridTemplateColumns": "96px minmax(0, 1fr) 76px", "alignItems": "center", "gap": "12px", "fontSize": "13px" }}>
                          <span style={{ "fontWeight": "500" }}>
                            {lookup(c, "name")}
                          </span>
                          <span style={{ "height": "10px", "borderRadius": "0 5px 5px 0", "background": "#F6F6F4" }}>
                            <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "background": "#E8701F", "borderRadius": "0 5px 5px 0" }}></span>
                          </span>
                          <span style={{ "textAlign": "right", "fontWeight": "700" }}>
                            {lookup(c, "amount")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </section>
                  <section style={{ "flex": "1 1 420px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)" }}>
                    <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Más vendidos"}
                    </h2>
                    {(lookup(v, "topList") || []).map((t, index26) => (
                      <Fragment key={index26}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "4px 0" }}>
                          <span style={{ "width": "22px", "fontSize": "13px", "fontWeight": "700", "color": "#6B6B6B" }}>
                            {lookup(t, "rank")}
                          </span>
                          <img src={assetSrc(lookup(t, "img"))} alt={""} style={{ "width": "44px", "height": "44px", "borderRadius": "12px", "objectFit": "cover", "flex": "none" }} />
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "600", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                              {lookup(t, "name")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                              {lookup(t, "cat")}
                              {" · "}
                              {lookup(t, "units")}
                              {" und."}
                            </span>
                          </span>
                          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                            {lookup(t, "sales")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </section>
                </div>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isPedidos")) && (
            <Fragment>
              <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                  {(lookup(v, "orderTabs") || []).map((t, index27) => (
                    <Fragment key={index27}>
                      <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "minHeight": "40px", "padding": "0 14px", "borderRadius": "10px", "border": "1px solid #ECECEA", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "500", "display": "inline-flex", "alignItems": "center", "gap": "8px" }}>
                        {lookup(t, "name")}
                        <span style={{ "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(t, "count")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                  <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "860px" }}>
                    <thead>
                      <tr style={{ "textAlign": "left", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "color": "#6B6B6B" }}>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Pedido"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Fecha"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Cliente"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Tipo"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Canal"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Pago"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                          {"Total"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Estado"}
                        </th>
                        <th style={{ "padding": "10px 8px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(lookup(v, "orders") || []).map((o, index28) => (
                        <Fragment key={index28}>
                          <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                            <td style={{ "padding": "12px 8px", "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                              {lookup(o, "id")}
                            </td>
                            <td style={{ "padding": "12px 8px", "color": "#444444" }}>
                              {lookup(o, "date")}
                            </td>
                            <td style={{ "padding": "12px 8px", "fontWeight": "500" }}>
                              {lookup(o, "client")}
                            </td>
                            <td style={{ "padding": "12px 8px" }}>
                              {lookup(o, "type")}
                            </td>
                            <td style={{ "padding": "12px 8px" }}>
                              {lookup(o, "channel")}
                            </td>
                            <td style={{ "padding": "12px 8px" }}>
                              {lookup(o, "pay")}
                            </td>
                            <td style={{ "padding": "12px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                              {lookup(o, "total")}
                            </td>
                            <td style={{ "padding": "12px 8px" }}>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": lookup(o, "sBg"), "color": lookup(o, "sFg"), "fontSize": "12px", "fontWeight": "700" }}>
                                <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(o, "sIcon")}></path>
                                </svg>
                                {lookup(o, "status")}
                              </span>
                            </td>
                            <td style={{ "padding": "12px 8px", "textAlign": "right" }}>
                              <button style={{ "minHeight": "36px", "padding": "0 12px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                                {"Ver"}
                              </button>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </Fragment>
          )}
          {Boolean(lookup(v, "isProductos")) && (
            <Fragment>
              <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto" }}>
                  {(lookup(v, "prodTabs") || []).map((t, index29) => (
                    <Fragment key={index29}>
                      <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "flex": "none", "minHeight": "40px", "padding": "0 14px", "borderRadius": "10px", "border": "1px solid #ECECEA", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "500" }}>
                        {lookup(t, "name")}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                  <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "860px" }}>
                    <thead>
                      <tr style={{ "textAlign": "left", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "color": "#6B6B6B" }}>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Producto"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Categoría"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                          {"Precio"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                          {"Mayorista"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Stock"}
                        </th>
                        <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                          {"Estado"}
                        </th>
                        <th style={{ "padding": "10px 8px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {(lookup(v, "products") || []).map((p, index30) => (
                        <Fragment key={index30}>
                          <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                            <td style={{ "padding": "10px 8px" }}>
                              <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                                <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "44px", "height": "44px", "borderRadius": "10px", "objectFit": "cover", "flex": "none" }} />
                                <span style={{ "fontWeight": "500" }}>
                                  {lookup(p, "name")}
                                </span>
                              </span>
                            </td>
                            <td style={{ "padding": "10px 8px" }}>
                              {lookup(p, "cat")}
                            </td>
                            <td style={{ "padding": "10px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                              {lookup(p, "price")}
                            </td>
                            <td style={{ "padding": "10px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums", "color": "#444444" }}>
                              {"[PRECIO]"}
                            </td>
                            <td style={{ "padding": "10px 8px" }}>
                              <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                                <span style={{ "width": "90px", "height": "8px", "background": "#EFEFEC", "borderRadius": "999px", "overflow": "hidden" }}>
                                  <span style={{ "display": "block", "width": lookup(p, "stockW"), "height": "100%", "background": lookup(p, "stockColor") }}></span>
                                </span>
                                <span style={{ "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                                  {lookup(p, "stock")}
                                </span>
                              </span>
                            </td>
                            <td style={{ "padding": "10px 8px" }}>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": lookup(p, "sBg"), "color": lookup(p, "sFg"), "fontSize": "12px", "fontWeight": "700" }}>
                                <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(p, "sIcon")}></path>
                                </svg>
                                {lookup(p, "status")}
                              </span>
                            </td>
                            <td style={{ "padding": "10px 8px", "textAlign": "right", "whiteSpace": "nowrap" }}>
                              <button onClick={lookup(v, "goProducts")} aria-label={"Editar producto"} style={{ "width": "36px", "height": "36px", "borderRadius": "10px", "border": "1px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "display": "inline-flex", "alignItems": "center", "justifyContent": "center" }}>
                                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={"M4 20h4L19 9l-4-4L4 16zM14 6l4 4"}></path>
                                </svg>
                              </button>
                            </td>
                          </tr>
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </Fragment>
          )}
          {Boolean(lookup(v, "isCotizaciones")) && (
            <Fragment>
              <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fill, minmax(320px, 1fr))", "gap": "16px" }}>
                {(lookup(v, "quotes") || []).map((q, index31) => (
                  <Fragment key={index31}>
                    <article style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "10px" }}>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                          <span style={{ "width": "44px", "height": "44px", "borderRadius": "12px", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(q, "icon")}></path>
                            </svg>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column" }}>
                            <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800" }}>
                              {lookup(q, "biz")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                              {lookup(q, "type")}
                              {" · "}
                              {lookup(q, "city")}
                            </span>
                          </span>
                        </span>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": lookup(q, "sBg"), "color": lookup(q, "sFg"), "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(q, "sIcon")}></path>
                          </svg>
                          {lookup(q, "status")}
                        </span>
                      </div>
                      <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}>
                        {(lookup(q, "catList") || []).map((c, index32) => (
                          <Fragment key={index32}>
                            <span style={{ "padding": "4px 10px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "12px" }}>
                              {lookup(c, "t")}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px", "color": "#444444" }}>
                        <span>
                          {"Compra estimada al mes"}
                        </span>
                        <strong style={{ "fontVariantNumeric": "tabular-nums", "color": "#111111" }}>
                          {lookup(q, "amount")}
                        </strong>
                      </div>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px", "color": "#444444" }}>
                        <span>
                          {"Recibida"}
                        </span>
                        <span>
                          {lookup(q, "date")}
                        </span>
                      </div>
                      <div style={{ "display": "flex", "gap": "8px", "marginTop": "4px" }}>
                        <a href={"https://wa.me/51954802744"} style={{ "flex": "1", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "minHeight": "44px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                            <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                          </svg>
                          {"Responder"}
                        </a>
                        <button style={{ "minHeight": "44px", "padding": "0 16px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                          {"Ver detalle"}
                        </button>
                      </div>
                    </article>
                  </Fragment>
                ))}
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isClientes")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(200px, 1fr))", "gap": "16px" }}>
                  {(lookup(v, "clientKpis") || []).map((k, index33) => (
                    <Fragment key={index33}>
                      <div style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                        <span style={{ "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600", "color": "#444444" }}>
                          {lookup(k, "label")}
                        </span>
                        <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "30px", "fontWeight": "900" }}>
                          {lookup(k, "value")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                    <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                      {(lookup(v, "clientTabs") || []).map((t, index34) => (
                        <Fragment key={index34}>
                          <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "minHeight": "40px", "padding": "0 14px", "borderRadius": "10px", "border": "1px solid #ECECEA", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "500" }}>
                            {lookup(t, "name")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <button style={{ "minHeight": "40px", "padding": "0 16px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600", "display": "inline-flex", "alignItems": "center", "gap": "8px" }}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M12 4v11M7 10l5 5 5-5M5 20h14"}></path>
                      </svg>
                      {"Exportar"}
                    </button>
                  </div>
                  <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                    <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "900px" }}>
                      <thead>
                        <tr style={{ "textAlign": "left", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "color": "#6B6B6B" }}>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Cliente"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Tipo"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Ciudad"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                            {"Pedidos"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                            {"Total comprado"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Última compra"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Canal"}
                          </th>
                          <th style={{ "padding": "10px 8px" }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {(lookup(v, "clients") || []).map((c, index35) => (
                          <Fragment key={index35}>
                            <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                              <td style={{ "padding": "12px 8px" }}>
                                <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                                  <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "Archivo, sans-serif", "fontSize": "13px", "fontWeight": "900", "flex": "none" }}>
                                    {lookup(c, "ini")}
                                  </span>
                                  <span style={{ "display": "flex", "flexDirection": "column" }}>
                                    <span style={{ "fontWeight": "500" }}>
                                      {lookup(c, "name")}
                                    </span>
                                    <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                      {lookup(c, "doc")}
                                    </span>
                                  </span>
                                </span>
                              </td>
                              <td style={{ "padding": "12px 8px" }}>
                                <span style={{ "padding": "4px 10px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "12px", "fontWeight": "500", "whiteSpace": "nowrap" }}>
                                  {lookup(c, "type")}
                                </span>
                              </td>
                              <td style={{ "padding": "12px 8px" }}>
                                {lookup(c, "city")}
                              </td>
                              <td style={{ "padding": "12px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                                {lookup(c, "orders")}
                              </td>
                              <td style={{ "padding": "12px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                                {lookup(c, "total")}
                              </td>
                              <td style={{ "padding": "12px 8px", "color": "#444444" }}>
                                {lookup(c, "last")}
                              </td>
                              <td style={{ "padding": "12px 8px" }}>
                                {lookup(c, "channel")}
                              </td>
                              <td style={{ "padding": "12px 8px", "textAlign": "right", "whiteSpace": "nowrap" }}>
                                <a href={"https://wa.me/51954802744"} aria-label={"Escribir por WhatsApp"} style={{ "width": "36px", "height": "36px", "borderRadius": "10px", "background": "#25D366", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "verticalAlign": "middle" }}>
                                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
                                    <path d={"M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3z"} fill={"#FFFFFF"}></path>
                                  </svg>
                                </a>
                                <button style={{ "minHeight": "36px", "padding": "0 12px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600", "verticalAlign": "middle" }}>
                                  {"Ver ficha"}
                                </button>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isCategorias")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                  <p style={{ "margin": "0", "fontSize": "15px", "color": "#444444" }}>
                    {"Ordena, oculta o edita las categorías y subcategorías que aparecen en el menú de la tienda."}
                  </p>
                  <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "44px", "padding": "0 18px", "borderRadius": "10px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                      <path d={"M12 5v14M5 12h14"}></path>
                    </svg>
                    {"Nueva categoría"}
                  </button>
                </div>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fill, minmax(300px, 1fr))", "gap": "16px" }}>
                  {(lookup(v, "catCards") || []).map((c, index36) => (
                    <Fragment key={index36}>
                      <article style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "overflow": "hidden", "display": "flex", "flexDirection": "column", "opacity": lookup(c, "opacity") }}>
                        <div style={{ "position": "relative", "height": "130px", "background": "#111111" }}>
                          <img src={assetSrc(lookup(c, "img"))} alt={""} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
                          <span style={{ "position": "absolute", "left": "12px", "top": "12px", "background": "#FFFFFF", "fontVariantNumeric": "tabular-nums", "fontSize": "11px", "fontWeight": "700", "padding": "4px 10px", "borderRadius": "999px" }}>
                            {"#"}
                            {lookup(c, "order")}
                            {" en el menú"}
                          </span>
                        </div>
                        <div style={{ "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px" }}>
                            <span style={{ "display": "flex", "flexDirection": "column" }}>
                              <span style={{ "fontSize": "20px", "fontWeight": "700" }}>
                                {lookup(c, "name")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(c, "count")}
                                {" productos · "}
                                {lookup(c, "subCount")}
                                {" subcategorías"}
                              </span>
                            </span>
                            <button onClick={lookup(c, "toggle")} role={"switch"} aria-checked={lookup(c, "on")} aria-label={"Mostrar " + String(lookup(c, "name") ?? "") + " en el menú"} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(c, "trackBg"), "cursor": "pointer", "position": "relative", "padding": "0", "flex": "none" }}>
                              <span style={{ "position": "absolute", "top": "3px", "left": lookup(c, "knob"), "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                            </button>
                          </div>
                          <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "6px" }}>
                            {(lookup(c, "subs") || []).map((s, index37) => (
                              <Fragment key={index37}>
                                <span style={{ "padding": "4px 10px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "12px" }}>
                                  {lookup(s, "t")}
                                </span>
                              </Fragment>
                            ))}
                          </div>
                          <div style={{ "display": "flex", "gap": "8px" }}>
                            <button style={{ "flex": "1", "minHeight": "40px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                              {"Editar"}
                            </button>
                            <button style={{ "flex": "1", "minHeight": "40px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                              {"+ Subcategoría"}
                            </button>
                          </div>
                        </div>
                      </article>
                    </Fragment>
                  ))}
                </div>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isOfertas")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div>
                    <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Precios por volumen"}
                    </h2>
                    <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                      {"Los mismos niveles que ven los clientes en la página de Empresas."}
                    </span>
                  </div>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(240px, 1fr))", "gap": "12px" }}>
                    {(lookup(v, "tierCfg") || []).map((t, index38) => (
                      <Fragment key={index38}>
                        <div style={{ "border": "1px solid #ECECEA", "borderRadius": "14px", "padding": "16px", "display": "flex", "flexDirection": "column", "gap": "12px", "background": lookup(t, "bg") }}>
                          <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                            {lookup(t, "name")}
                          </span>
                          <label style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "fontSize": "13px", "fontWeight": "500" }}>
                            {"Descuento sobre precio de lista"}
                            <span style={{ "display": "flex", "alignItems": "center", "height": "44px", "border": "1px solid #DADAD6", "borderRadius": "10px", "background": "#FFFFFF", "padding": "0 12px" }}>
                              <input type={"text"} defaultValue={lookup(t, "pct")} style={{ "flex": "1", "minWidth": "0", "border": "none", "fontVariantNumeric": "tabular-nums", "fontSize": "15px", "outline": "none" }} />
                              <span style={{ "fontVariantNumeric": "tabular-nums" }}>
                                {"%"}
                              </span>
                            </span>
                          </label>
                          <label style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "fontSize": "13px", "fontWeight": "500" }}>
                            {"Condición mínima"}
                            <input type={"text"} defaultValue={lookup(t, "min")} style={{ "height": "44px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "14px" }} />
                          </label>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </section>
                <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                    <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Cupones y ofertas"}
                    </h2>
                    <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "40px", "padding": "0 16px", "borderRadius": "10px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                      <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                        <path d={"M12 5v14M5 12h14"}></path>
                      </svg>
                      {"Crear cupón"}
                    </button>
                  </div>
                  <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                    <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "820px" }}>
                      <thead>
                        <tr style={{ "textAlign": "left", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "color": "#6B6B6B" }}>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Código"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Descuento"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Aplica a"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                            {"Usos"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Vigencia"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Activo"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(lookup(v, "coupons") || []).map((c, index39) => (
                          <Fragment key={index39}>
                            <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                              <td style={{ "padding": "12px 8px" }}>
                                <span style={{ "fontVariantNumeric": "tabular-nums", "fontWeight": "700", "padding": "4px 10px", "border": "1px dashed #111111", "borderRadius": "8px" }}>
                                  {lookup(c, "code")}
                                </span>
                              </td>
                              <td style={{ "padding": "12px 8px", "fontWeight": "700" }}>
                                {lookup(c, "off")}
                              </td>
                              <td style={{ "padding": "12px 8px" }}>
                                {lookup(c, "scope")}
                              </td>
                              <td style={{ "padding": "12px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums" }}>
                                {lookup(c, "uses")}
                              </td>
                              <td style={{ "padding": "12px 8px", "color": "#444444" }}>
                                {lookup(c, "until")}
                              </td>
                              <td style={{ "padding": "12px 8px" }}>
                                <button onClick={lookup(c, "toggle")} role={"switch"} aria-checked={lookup(c, "on")} aria-label={"Activar cupón " + String(lookup(c, "code") ?? "")} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(c, "trackBg"), "cursor": "pointer", "position": "relative", "padding": "0" }}>
                                  <span style={{ "position": "absolute", "top": "3px", "left": lookup(c, "knob"), "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                                </button>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isTienda")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "flex-start" }}>
                <section style={{ "flex": "2 1 560px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                    <div>
                      <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                        {"Portada · pestañas"}
                      </h2>
                      <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                        {"Las 4 pestañas que rotan en la portada de la tienda."}
                      </span>
                    </div>
                    <a href={"/tienda"} style={{ "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600", "textUnderlineOffset": "4px", "minHeight": "44px", "display": "inline-flex", "alignItems": "center" }}>
                      {"Ver en la tienda ↗"}
                    </a>
                  </div>
                  {(lookup(v, "slides") || []).map((s, index40) => (
                    <Fragment key={index40}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "12px", "border": "1px solid #ECECEA", "borderRadius": "14px", "flexWrap": "wrap" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"#555555"} aria-hidden={"true"} style={{ "flex": "none" }}>
                          <circle cx={"9"} cy={"6"} r={"1.6"}></circle>
                          <circle cx={"15"} cy={"6"} r={"1.6"}></circle>
                          <circle cx={"9"} cy={"12"} r={"1.6"}></circle>
                          <circle cx={"15"} cy={"12"} r={"1.6"}></circle>
                          <circle cx={"9"} cy={"18"} r={"1.6"}></circle>
                          <circle cx={"15"} cy={"18"} r={"1.6"}></circle>
                        </svg>
                        <img src={assetSrc(lookup(s, "img"))} alt={""} style={{ "width": "120px", "height": "68px", "borderRadius": "10px", "objectFit": "cover", "flex": "none" }} />
                        <span style={{ "flex": "1 1 200px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                          <span style={{ "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600", "color": "#6B6B6B" }}>
                            {lookup(s, "num")}
                            {" · "}
                            {lookup(s, "tab")}
                          </span>
                          <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                            {lookup(s, "title")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                            {"Botón: "}
                            {lookup(s, "cta")}
                          </span>
                        </span>
                        <button onClick={lookup(s, "toggle")} role={"switch"} aria-checked={lookup(s, "on")} aria-label={"Mostrar pestaña " + String(lookup(s, "tab") ?? "")} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(s, "trackBg"), "cursor": "pointer", "position": "relative", "padding": "0", "flex": "none" }}>
                          <span style={{ "position": "absolute", "top": "3px", "left": lookup(s, "knob"), "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                        </button>
                        <button style={{ "minHeight": "36px", "padding": "0 12px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                          {"Editar"}
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </section>
                <section style={{ "flex": "1 1 320px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                  <h2 style={{ "margin": "0 0 8px", "fontSize": "16px", "fontWeight": "700" }}>
                    {"Secciones de la portada"}
                  </h2>
                  {(lookup(v, "homeSections") || []).map((h, index41) => (
                    <Fragment key={index41}>
                      <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "10px", "minHeight": "48px", "borderTop": "1px solid #F1F1EE" }}>
                        <span style={{ "fontSize": "14px", "fontWeight": "500" }}>
                          {lookup(h, "name")}
                        </span>
                        <button onClick={lookup(h, "toggle")} role={"switch"} aria-checked={lookup(h, "on")} aria-label={"Mostrar " + String(lookup(h, "name") ?? "")} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(h, "trackBg"), "cursor": "pointer", "position": "relative", "padding": "0", "flex": "none" }}>
                          <span style={{ "position": "absolute", "top": "3px", "left": lookup(h, "knob"), "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </section>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isWhatsapp")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexWrap": "wrap", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "overflow": "hidden", "minHeight": "620px" }}>
                <div style={{ "flex": "1 1 320px", "maxWidth": "380px", "borderRight": "1px solid #ECECEA", "display": "flex", "flexDirection": "column" }}>
                  <div style={{ "padding": "16px", "borderBottom": "1px solid #ECECEA", "display": "flex", "alignItems": "center", "gap": "10px" }}>
                    <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": "#25D366", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} aria-hidden={"true"}>
                        <path d={"M12 3a9 9 0 0 0-7.8 13.4L3 21l4.7-1.2A9 9 0 1 0 12 3z"} fill={"#FFFFFF"}></path>
                      </svg>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontWeight": "700" }}>
                        {"+51 954 802 744"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"WhatsApp Business conectado"}
                      </span>
                    </span>
                  </div>
                  {(lookup(v, "chats") || []).map((c, index42) => (
                    <Fragment key={index42}>
                      <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 16px", "border": "none", "borderBottom": "1px solid #EFEFEC", "background": lookup(c, "bg"), "cursor": "pointer", "textAlign": "left", "fontFamily": "Roboto, sans-serif" }}>
                        <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "13px", "flex": "none" }}>
                          {lookup(c, "ini")}
                        </span>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                          <span style={{ "display": "flex", "justifyContent": "space-between", "gap": "8px" }}>
                            <span style={{ "fontWeight": "700", "fontSize": "14px", "color": "#111111" }}>
                              {lookup(c, "name")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(c, "time")}
                            </span>
                          </span>
                          <span style={{ "fontSize": "13px", "color": "#444444", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                            {lookup(c, "last")}
                          </span>
                        </span>
                        {Boolean(lookup(c, "unread")) && (
                          <Fragment>
                            <span style={{ "minWidth": "20px", "height": "20px", "borderRadius": "999px", "background": "#25D366", "color": "#111111", "fontSize": "11px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                              {lookup(c, "unread")}
                            </span>
                          </Fragment>
                        )}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "999 1 420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "background": "#F7F3EE" }}>
                  <div style={{ "padding": "14px 20px", "background": "#FFFFFF", "borderBottom": "1px solid #ECECEA", "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontWeight": "700" }}>
                        {lookup(v, "chat.name")}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {lookup(v, "chat.type")}
                      </span>
                    </span>
                    <button onClick={lookup(v, "goOrders")} style={{ "minHeight": "40px", "padding": "0 14px", "borderRadius": "10px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                      {"Crear pedido"}
                    </button>
                  </div>
                  <div style={{ "flex": "1", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    {(lookup(v, "chat.msgs") || []).map((m, index43) => (
                      <Fragment key={index43}>
                        <div style={{ "alignSelf": lookup(m, "align"), "maxWidth": "70%", "background": lookup(m, "bg"), "border": "1px solid #ECECEA", "borderRadius": "14px", "padding": "10px 14px", "fontSize": "14px", "lineHeight": "1.45" }}>
                          {lookup(m, "t")}
                          <span style={{ "display": "block", "textAlign": "right", "fontSize": "11px", "color": "#6B6B6B", "marginTop": "4px" }}>
                            {lookup(m, "time")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "padding": "12px 16px", "background": "#FFFFFF", "borderTop": "1px solid #ECECEA", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                    <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "quickReplies") || []).map((q, index44) => (
                        <Fragment key={index44}>
                          <button style={{ "minHeight": "32px", "padding": "0 12px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "12px" }}>
                            {lookup(q, "t")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "display": "flex", "gap": "10px" }}>
                      <label style={{ "flex": "1", "display": "flex" }}>
                        <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                          {"Mensaje"}
                        </span>
                        <input type={"text"} placeholder={"Escribe un mensaje…"} style={{ "flex": "1", "height": "44px", "border": "1px solid #111111", "borderRadius": "999px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "14px" }} />
                      </label>
                      <button aria-label={"Enviar"} style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "border": "none", "background": "#25D366", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.2"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M4 12l16-8-6 16-2-6z"}></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isEnlaces")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "flex-start" }}>
                <section style={{ "flex": "2 1 520px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                    <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Botones de la página de enlaces"}
                    </h2>
                    <a href={"/enlaces"} style={{ "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600", "textUnderlineOffset": "4px", "minHeight": "44px", "display": "inline-flex", "alignItems": "center" }}>
                      {"Ver página ↗"}
                    </a>
                  </div>
                  {(lookup(v, "linkRows") || []).map((l, index45) => (
                    <Fragment key={index45}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "border": "1px solid #ECECEA", "borderRadius": "12px", "flexWrap": "wrap" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"#555555"} aria-hidden={"true"} style={{ "flex": "none" }}>
                          <circle cx={"9"} cy={"6"} r={"1.6"}></circle>
                          <circle cx={"15"} cy={"6"} r={"1.6"}></circle>
                          <circle cx={"9"} cy={"12"} r={"1.6"}></circle>
                          <circle cx={"15"} cy={"12"} r={"1.6"}></circle>
                          <circle cx={"9"} cy={"18"} r={"1.6"}></circle>
                          <circle cx={"15"} cy={"18"} r={"1.6"}></circle>
                        </svg>
                        <span style={{ "flex": "1 1 200px", "minWidth": "0", "display": "flex", "flexDirection": "column" }}>
                          <span style={{ "fontWeight": "700" }}>
                            {lookup(l, "name")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B", "fontVariantNumeric": "tabular-nums", "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                            {lookup(l, "url")}
                          </span>
                        </span>
                        {Boolean(lookup(l, "missing")) && (
                          <Fragment>
                            <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "4px 10px", "borderRadius": "999px", "background": "#FFF4D6", "color": "#7A4A00", "fontSize": "12px", "fontWeight": "700" }}>
                              <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                                <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                              </svg>
                              {"Falta el enlace"}
                            </span>
                          </Fragment>
                        )}
                        <button onClick={lookup(l, "toggle")} role={"switch"} aria-checked={lookup(l, "on")} aria-label={"Mostrar " + String(lookup(l, "name") ?? "")} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(l, "trackBg"), "cursor": "pointer", "position": "relative", "padding": "0", "flex": "none" }}>
                          <span style={{ "position": "absolute", "top": "3px", "left": lookup(l, "knob"), "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                        </button>
                      </div>
                    </Fragment>
                  ))}
                  <button style={{ "alignSelf": "flex-start", "minHeight": "40px", "padding": "0 16px", "borderRadius": "10px", "border": "1px dashed #BDBDBD", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                    {"+ Agregar botón"}
                  </button>
                </section>
                <section style={{ "flex": "1 1 300px", "minWidth": "0", "background": "#111111", "color": "#FFFFFF", "borderRadius": "18px", "padding": "22px", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "14px", "textAlign": "center" }}>
                  <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700", "color": lookup(v, "accent") }}>
                    {"Código QR"}
                  </h2>
                  <span style={{ "background": "#FFFFFF", "borderRadius": "16px", "padding": "12px" }}>
                    <img src={assetSrc("img/2d7ff64ebc4cab97ff138aeb7ef049b7.svg")} alt={"Código QR a www.viaprovisiones.com/enlaces"} style={{ "width": "180px", "height": "180px", "display": "block" }} />
                  </span>
                  <span style={{ "fontVariantNumeric": "tabular-nums", "fontSize": "13px" }}>
                    {"viaprovisiones.com/enlaces"}
                  </span>
                  <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap", "justifyContent": "center" }}>
                    <button style={{ "minHeight": "40px", "padding": "0 14px", "borderRadius": "10px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                      {"Descargar SVG"}
                    </button>
                    <a href={"/cartel-qr"} style={{ "minHeight": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid #FFFFFF", "color": "#FFFFFF", "textDecoration": "none", "display": "inline-flex", "alignItems": "center", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                      {"Ver cartel"}
                    </a>
                  </div>
                  <span style={{ "fontSize": "12px", "color": "#CFCFCF" }}>
                    {"Escaneos este mes: 214 (ejemplo)"}
                  </span>
                </section>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isReportes")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fill, minmax(280px, 1fr))", "gap": "16px" }}>
                  {(lookup(v, "reports") || []).map((r, index46) => (
                    <Fragment key={index46}>
                      <article style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                        <span style={{ "width": "44px", "height": "44px", "borderRadius": "12px", "background": lookup(r, "iconBg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(r, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "fontSize": "17px", "fontWeight": "700" }}>
                          {lookup(r, "name")}
                        </span>
                        <span style={{ "fontSize": "13px", "lineHeight": "1.45", "color": "#444444" }}>
                          {lookup(r, "text")}
                        </span>
                        <div style={{ "display": "flex", "gap": "8px", "marginTop": "auto" }}>
                          <button style={{ "flex": "1", "minHeight": "40px", "borderRadius": "10px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                            {"Excel"}
                          </button>
                          <button style={{ "flex": "1", "minHeight": "40px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "fontWeight": "600" }}>
                            {"PDF"}
                          </button>
                        </div>
                      </article>
                    </Fragment>
                  ))}
                </div>
                <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                    {"Productos más vendidos · "}
                    {lookup(v, "rangeLabel")}
                  </h2>
                  <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                    <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "640px" }}>
                      <thead>
                        <tr style={{ "textAlign": "left", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "color": "#6B6B6B" }}>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"#"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Producto"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                            {"Categoría"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                            {"Unidades"}
                          </th>
                          <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                            {"Ventas"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(lookup(v, "topProducts") || []).map((t, index47) => (
                          <Fragment key={index47}>
                            <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                              <td style={{ "padding": "12px 8px", "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                                {lookup(t, "rank")}
                              </td>
                              <td style={{ "padding": "12px 8px", "fontWeight": "500" }}>
                                {lookup(t, "name")}
                              </td>
                              <td style={{ "padding": "12px 8px" }}>
                                {lookup(t, "cat")}
                              </td>
                              <td style={{ "padding": "12px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums" }}>
                                {lookup(t, "units")}
                              </td>
                              <td style={{ "padding": "12px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                                {lookup(t, "sales")}
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isConfig")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div role={"tablist"} aria-label={"Configuración"} style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                  {(lookup(v, "cfgTabs") || []).map((t, index48) => (
                    <Fragment key={index48}>
                      <button role={"tab"} aria-selected={lookup(t, "selected")} onClick={lookup(t, "pick")} style={{ "minHeight": "44px", "padding": "0 18px", "borderRadius": "10px", "border": "1px solid #ECECEA", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "14px", "fontWeight": "500", "display": "inline-flex", "alignItems": "center", "gap": "8px" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(t, "icon")}></path>
                        </svg>
                        {lookup(t, "name")}
                      </button>
                    </Fragment>
                  ))}
                </div>
                {Boolean(lookup(v, "cfgEmpresa")) && (
                  <Fragment>
                    <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "24px", "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Nombre comercial"}
                        <input type={"text"} defaultValue={"VIA Provisiones"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"RUC"}
                        <input type={"text"} placeholder={"[RUC]"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Teléfono y WhatsApp"}
                        <input type={"text"} defaultValue={"+51 954 802 744"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Correo"}
                        <input type={"email"} defaultValue={"viaprovisionesperu@gmail.com"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                      </label>
                      <label style={{ "gridColumn": "1 / -1", "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Dirección"}
                        <input type={"text"} defaultValue={"Dean Valdivia 533 - Cercado, Arequipa"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Horario de atención"}
                        <input type={"text"} placeholder={"Lun a sáb · [HORARIO]"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Dominio"}
                        <input type={"text"} defaultValue={"www.viaprovisiones.com"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                      </label>
                      <div style={{ "gridColumn": "1 / -1", "display": "flex", "justifyContent": "flex-end", "gap": "10px" }}>
                        <button style={{ "minHeight": "44px", "padding": "0 18px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                          {"Cancelar"}
                        </button>
                        <button style={{ "minHeight": "44px", "padding": "0 22px", "borderRadius": "10px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                          {"Guardar cambios"}
                        </button>
                      </div>
                    </section>
                  </Fragment>
                )}
                {Boolean(lookup(v, "cfgUsuarios")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                      <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                        <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                          <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                            {"Usuarios"}
                          </h2>
                          <button style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "minHeight": "40px", "padding": "0 16px", "borderRadius": "10px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                              <path d={"M12 5v14M5 12h14"}></path>
                            </svg>
                            {"Invitar usuario"}
                          </button>
                        </div>
                        {(lookup(v, "users") || []).map((u, index49) => (
                          <Fragment key={index49}>
                            <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 0", "borderTop": "1px solid #F1F1EE", "flexWrap": "wrap" }}>
                              <span style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(u, "avatarBg"), "color": lookup(u, "avatarFg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "flex": "none" }}>
                                {lookup(u, "ini")}
                              </span>
                              <span style={{ "flex": "1 1 200px", "display": "flex", "flexDirection": "column" }}>
                                <span style={{ "fontWeight": "700" }}>
                                  {lookup(u, "name")}
                                </span>
                                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                  {lookup(u, "email")}
                                </span>
                              </span>
                              <span style={{ "padding": "4px 12px", "borderRadius": "999px", "background": lookup(u, "roleBg"), "color": lookup(u, "roleFg"), "fontSize": "12px", "fontWeight": "700" }}>
                                {lookup(u, "role")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B", "minWidth": "120px" }}>
                                {lookup(u, "last")}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </section>
                      <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                        <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                          {"Permisos por rol"}
                        </h2>
                        <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                          <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "560px" }}>
                            <thead>
                              <tr style={{ "textAlign": "left", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "color": "#6B6B6B" }}>
                                <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                                  {"Permiso"}
                                </th>
                                <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "center" }}>
                                  {"Administrador"}
                                </th>
                                <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "center" }}>
                                  {"Vendedor"}
                                </th>
                                <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "center" }}>
                                  {"Almacén"}
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {(lookup(v, "perms") || []).map((p, index50) => (
                                <Fragment key={index50}>
                                  <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                                    <td style={{ "padding": "12px 8px", "fontWeight": "500" }}>
                                      {lookup(p, "name")}
                                    </td>
                                    <td style={{ "padding": "12px 8px", "textAlign": "center", "fontWeight": "700" }} aria-label={lookup(p, "aLabel")}>
                                      {lookup(p, "a")}
                                    </td>
                                    <td style={{ "padding": "12px 8px", "textAlign": "center", "fontWeight": "700" }} aria-label={lookup(p, "vLabel")}>
                                      {lookup(p, "v")}
                                    </td>
                                    <td style={{ "padding": "12px 8px", "textAlign": "center", "fontWeight": "700" }} aria-label={lookup(p, "wLabel")}>
                                      {lookup(p, "w")}
                                    </td>
                                  </tr>
                                </Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </section>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "cfgPagos")) && (
                  <Fragment>
                    <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <h2 style={{ "margin": "0 0 8px", "fontSize": "16px", "fontWeight": "700" }}>
                        {"Métodos de pago"}
                      </h2>
                      {(lookup(v, "payCfg") || []).map((p, index51) => (
                        <Fragment key={index51}>
                          <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "minHeight": "60px", "borderTop": "1px solid #F1F1EE", "flexWrap": "wrap" }}>
                            <span style={{ "minWidth": "110px", "height": "32px", "padding": "0 12px", "borderRadius": "8px", "border": "1px solid #111111", "display": "inline-flex", "alignItems": "center", "justifyContent": "center", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                              {lookup(p, "name")}
                            </span>
                            <span style={{ "flex": "1 1 220px", "fontSize": "13px", "color": "#444444" }}>
                              {lookup(p, "detail")}
                            </span>
                            <button onClick={lookup(p, "toggle")} role={"switch"} aria-checked={lookup(p, "on")} aria-label={"Activar " + String(lookup(p, "name") ?? "")} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(p, "trackBg"), "cursor": "pointer", "position": "relative", "padding": "0", "flex": "none" }}>
                              <span style={{ "position": "absolute", "top": "3px", "left": lookup(p, "knob"), "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </section>
                  </Fragment>
                )}
                {Boolean(lookup(v, "cfgEnvios")) && (
                  <Fragment>
                    <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                      <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap" }}>
                        <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                          {"Zonas y tarifas de envío"}
                        </h2>
                        <button style={{ "minHeight": "40px", "padding": "0 16px", "borderRadius": "10px", "border": "1px dashed #BDBDBD", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                          {"+ Agregar zona"}
                        </button>
                      </div>
                      <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                        <table style={{ "width": "100%", "borderCollapse": "collapse", "fontSize": "14px", "minWidth": "640px" }}>
                          <thead>
                            <tr style={{ "textAlign": "left", "fontVariantNumeric": "tabular-nums", "fontSize": "13px", "color": "#6B6B6B" }}>
                              <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                                {"Zona"}
                              </th>
                              <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                                {"Modalidad"}
                              </th>
                              <th style={{ "padding": "10px 8px", "fontWeight": "500" }}>
                                {"Plazo"}
                              </th>
                              <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                                {"Tarifa"}
                              </th>
                              <th style={{ "padding": "10px 8px", "fontWeight": "500", "textAlign": "right" }}>
                                {"Gratis desde"}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {(lookup(v, "zones") || []).map((z, index52) => (
                              <Fragment key={index52}>
                                <tr style={{ "borderTop": "1px solid #F1F1EE" }}>
                                  <td style={{ "padding": "12px 8px", "fontWeight": "500" }}>
                                    {lookup(z, "zone")}
                                  </td>
                                  <td style={{ "padding": "12px 8px" }}>
                                    {lookup(z, "mode")}
                                  </td>
                                  <td style={{ "padding": "12px 8px" }}>
                                    {lookup(z, "time")}
                                  </td>
                                  <td style={{ "padding": "12px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums", "fontWeight": "700" }}>
                                    {lookup(z, "fee")}
                                  </td>
                                  <td style={{ "padding": "12px 8px", "textAlign": "right", "fontVariantNumeric": "tabular-nums" }}>
                                    {lookup(z, "free")}
                                  </td>
                                </tr>
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  </Fragment>
                )}
              </div>
            </Fragment>
          )}
          {Boolean(lookup(v, "isNuevo")) && (
            <Fragment>
              <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "16px", "alignItems": "flex-start" }}>
                <section style={{ "flex": "2 1 560px", "minWidth": "0", "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                  <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                    {"Información del producto"}
                  </h2>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                    {"Nombre"}
                    <input type={"text"} placeholder={"Ej. Lámpara de camping recargable"} style={{ "height": "48px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                  </label>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "14px" }}>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                      {"Categoría"}
                      <select style={{ "height": "48px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "15px", "background": "#FFFFFF" }}>
                        <option>
                          {"Camping"}
                        </option>
                        <option>
                          {"Focos"}
                        </option>
                        <option>
                          {"Solar"}
                        </option>
                        <option>
                          {"Cables"}
                        </option>
                        <option>
                          {"Extensiones"}
                        </option>
                        <option>
                          {"Llaveros"}
                        </option>
                        <option>
                          {"Ganchos"}
                        </option>
                        <option>
                          {"Bisutería"}
                        </option>
                      </select>
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                      {"Subcategoría"}
                      <select style={{ "height": "48px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "15px", "background": "#FFFFFF" }}>
                        <option>
                          {"Lámparas y linternas"}
                        </option>
                        <option>
                          {"Casas de campaña"}
                        </option>
                        <option>
                          {"Cocina de campamento"}
                        </option>
                        <option>
                          {"Mochilas"}
                        </option>
                        <option>
                          {"Sillas plegables"}
                        </option>
                      </select>
                    </label>
                  </div>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                    {"Descripción"}
                    <textarea rows={"5"} placeholder={"Para qué sirve, materiales, medidas…"} style={{ "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "12px 14px", "fontFamily": "inherit", "fontSize": "15px", "resize": "vertical" }}></textarea>
                  </label>
                  <h2 style={{ "margin": "6px 0 0", "fontSize": "16px", "fontWeight": "700" }}>
                    {"Fotos"}
                  </h2>
                  <div style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap" }}>
                    <div style={{ "width": "140px", "height": "140px", "border": "2px dashed #BDBDBD", "borderRadius": "14px", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "6px", "fontSize": "13px", "textAlign": "center", "padding": "10px", "boxSizing": "border-box" }}>
                      <svg width={"24"} height={"24"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}>
                        <path d={"M12 16V4M7 9l5-5 5 5M4 20h16"}></path>
                      </svg>
                      {"Arrastra fotos o haz clic"}
                    </div>
                    <img src={assetSrc("img/a58999411e32d7481815ba8cdc175e97")} alt={""} style={{ "width": "140px", "height": "140px", "borderRadius": "14px", "objectFit": "cover" }} />
                    <img src={assetSrc("img/a39c65aefaa4235a16422fb671911427")} alt={""} style={{ "width": "140px", "height": "140px", "borderRadius": "14px", "objectFit": "cover" }} />
                  </div>
                  <h2 style={{ "margin": "6px 0 0", "fontSize": "16px", "fontWeight": "700" }}>
                    {"Variantes"}
                  </h2>
                  <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                    <span style={{ "padding": "6px 12px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "13px" }}>
                      {"Color: Negro"}
                    </span>
                    <span style={{ "padding": "6px 12px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "13px" }}>
                      {"Color: Naranja"}
                    </span>
                    <button style={{ "padding": "6px 12px", "borderRadius": "10px", "border": "1px dashed #BDBDBD", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "13px" }}>
                      {"+ Agregar variante"}
                    </button>
                  </div>
                </section>
                <aside style={{ "flex": "1 1 320px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                    <h2 style={{ "margin": "0", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Precio y stock"}
                    </h2>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                      {"Precio de venta (S/)"}
                      <input type={"text"} placeholder={"0.00"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontVariantNumeric": "tabular-nums", "fontSize": "15px" }} />
                    </label>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                      {"Precio mayorista (S/)"}
                      <input type={"text"} placeholder={"0.00"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontVariantNumeric": "tabular-nums", "fontSize": "15px" }} />
                    </label>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px" }}>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Stock"}
                        <input type={"text"} placeholder={"0"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontVariantNumeric": "tabular-nums", "fontSize": "15px" }} />
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                        {"Alerta en"}
                        <input type={"text"} defaultValue={"10"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontVariantNumeric": "tabular-nums", "fontSize": "15px" }} />
                      </label>
                    </div>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "500" }}>
                      {"SKU / código"}
                      <input type={"text"} placeholder={"[CÓDIGO]"} style={{ "height": "46px", "border": "1px solid #DADAD6", "borderRadius": "10px", "padding": "0 14px", "fontVariantNumeric": "tabular-nums", "fontSize": "15px" }} />
                    </label>
                  </section>
                  <section style={{ "background": "#FFFFFF", "border": "1px solid #ECECEA", "borderRadius": "20px", "boxShadow": "0 1px 2px rgba(17,17,17,0.04)", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <h2 style={{ "margin": "0 0 8px", "fontSize": "16px", "fontWeight": "700" }}>
                      {"Visibilidad"}
                    </h2>
                    {(lookup(v, "prodFlags") || []).map((f, index53) => (
                      <Fragment key={index53}>
                        <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "10px", "minHeight": "48px", "borderTop": "1px solid #F1F1EE" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "500" }}>
                            {lookup(f, "name")}
                          </span>
                          <button onClick={lookup(f, "toggle")} role={"switch"} aria-checked={lookup(f, "on")} aria-label={lookup(f, "name")} style={{ "width": "52px", "height": "30px", "borderRadius": "999px", "border": "none", "background": lookup(f, "trackBg"), "cursor": "pointer", "position": "relative", "padding": "0", "flex": "none" }}>
                            <span style={{ "position": "absolute", "top": "3px", "left": lookup(f, "knob"), "width": "24px", "height": "24px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                          </button>
                        </div>
                      </Fragment>
                    ))}
                  </section>
                  <div style={{ "display": "flex", "gap": "10px" }}>
                    <button onClick={lookup(v, "goProductsList")} style={{ "flex": "1", "minHeight": "50px", "borderRadius": "10px", "border": "1px solid #DADAD6", "background": "#FFFFFF", "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Cancelar"}
                    </button>
                    <button onClick={lookup(v, "goProductsList")} style={{ "flex": "2", "minHeight": "50px", "borderRadius": "10px", "border": "none", "background": lookup(v, "accent"), "cursor": "pointer", "fontVariantNumeric": "tabular-nums", "fontSize": "12px", "fontWeight": "600" }}>
                      {"Guardar producto"}
                    </button>
                  </div>
                </aside>
              </div>
            </Fragment>
          )}
        </main>
      </div>
    </div>
    </Fragment>
  )} />;
}
