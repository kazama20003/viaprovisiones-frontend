"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { cart: 0, open: -1, hero: 0, heroPaused: false };
  }
  componentDidMount() {
    this.heroTimer = setInterval(() => {
      if (!this.state.heroPaused) this.setState({ hero: (this.state.hero + 1) % 4 });
    }, 6000);
  }
  componentWillUnmount() {
    clearInterval(this.heroTimer);
  }
  renderVals() {
    const B = 'img/';
    const add = () => this.setState({ cart: this.state.cart + 1 });
    const open = this.state.open;
    const apiProductos = Array.isArray(this.props.apiProductos) ? this.props.apiProductos : [];
    const apiCatalogState = this.props.apiCatalogState ?? 'idle';
    const apiCatalogError = this.props.apiCatalogError ?? '';
    const cats = [
      { name: 'Focos', img: B + '3b9c9685b295f2e98de45092f0726e9d', blurb: 'Iluminación LED e inteligente para cada espacio.', subs: ['Focos LED', 'Focos inteligentes', 'Focos ahorradores', 'Reflectores', 'Tiras LED'] },
      { name: 'Cables', img: B + '9b50c161cb5babd38f32f5ae0d6d07f2', blurb: 'Carga, video, red y audio con conexiones confiables.', subs: ['Cables USB', 'Cables HDMI', 'Cables de red', 'Cables de audio', 'Cable eléctrico'] },
      { name: 'Extensiones', img: B + 'eb24768cbcec06634442ffd75b2ec35e', blurb: 'Energía donde la necesites, en casa o en el taller.', subs: ['Multicontactos', 'Extensiones de uso rudo', 'Carretes', 'Supresores de picos'] },
      { name: 'Solar', img: B + 'b30fccfdffef62630e634c81713bce27', blurb: 'Energía del sol para tu casa, tu negocio o tu campamento.', subs: ['Paneles solares', 'Estaciones de energía', 'Lámparas solares', 'Baterías e inversores', 'Kits solares'] },
      { name: 'Llaveros', img: B + '486adc8e3498d09ac8c8b3601331de4e', blurb: 'Lleva tus llaves en orden y con estilo.', subs: ['Llaveros de metal', 'Llaveros de piel', 'Mosquetones', 'Llaveros personalizados'] },
      { name: 'Ganchos', img: B + '2199c77bc313fc070c4dd0829072f7f7', blurb: 'Organiza paredes, cocina y entrada sin complicaciones.', subs: ['Ganchos adhesivos', 'Ganchos de pared', 'Ganchos de cocina', 'Organizadores'] },
      { name: 'Camping', img: B + 'a39c65aefaa4235a16422fb671911427', blurb: 'Equipo para acampar con luz, comodidad y seguridad.', subs: ['Lámparas y linternas', 'Casas de campaña', 'Cocina de campamento', 'Mochilas', 'Sillas plegables'] },
      { name: 'Bisutería', img: B + 'c293f47caea74d301a56eedd46949711', blurb: 'Accesorios para completar cualquier look.', subs: ['Collares', 'Pulseras', 'Aretes', 'Anillos', 'Sets'] }
    ];
    const menu = cats.map((c, i) => ({
      name: c.name,
      img: c.img,
      count: c.subs.length + ' subcategorías',
      expanded: open === i ? 'true' : 'false',
      underline: open === i ? '3px solid ' + (this.props.accent ?? '#FF914C') : '3px solid transparent',
      chevron: open === i ? 'M6 15l6-6 6 6' : 'M6 9l6 6 6-6',
      toggle: () => this.setState({ open: this.state.open === i ? -1 : i })
    }));
    const cur = open >= 0 ? cats[open] : cats[0];
    const PR = {"Foco LED 9 W luz cálida": "S/ 8.90", "Foco inteligente Wi-Fi": "S/ 39.90", "Cable USB-C carga rápida 1 m": "S/ 19.90", "Cable HDMI 4K 2 m": "S/ 29.90", "Extensión de uso rudo 5 m": "S/ 45.00", "Panel solar monocristalino 100 W": "S/ 349.00", "Estación de energía portátil": "S/ 1,290.00", "Lámpara solar LED para exterior": "S/ 89.90", "Kit solar plegable para camping": "S/ 459.00", "Carrete de extensión 15 m": "S/ 119.00", "Llavero de piel con argolla": "S/ 15.90", "Mosquetón llavero de aluminio": "S/ 9.90", "Ganchos de pared de metal (set de 3)": "S/ 24.90", "Lámpara de camping recargable": "S/ 69.90", "Linterna de cabeza LED": "S/ 39.90", "Set de cocina para campamento": "S/ 129.00", "Collar dorado de cadena fina": "S/ 29.90", "Pulsera de eslabones": "S/ 24.90", "Aretes colgantes": "S/ 19.90"};
    const P = (cat, sub, name, img, extra) => ({ cat, sub, name, img: B + img, price: PR[name] || 'S/ 0.00', was: '', best: false, limited: false, sale: false, add, ...(extra || {}) });
    const line = '1px solid #111111';
    const heroSlides = [
      { num: '01', tab: 'Camping', img: B + '621ce65a45113393656af23955c4e044', alt: 'Sendero iluminado con linterna de cabeza de noche', title: 'Para la noche más larga', text: 'Linternas de cabeza, lámparas recargables y todo lo que necesitas para acampar con luz.', cta: 'Comprar camping', href: '#destacados' },
      { num: '02', tab: 'Solar', img: B + '1e3cbb6a8497f7e680445500f1240a3b', alt: 'Paneles solares en el campo', title: 'Energía que no se corta', text: 'Paneles, estaciones de energía y lámparas que se cargan con el sol.', cta: 'Comprar solar', href: '#solar' },
      { num: '03', tab: 'Focos', img: B + '0e200ae6333f48d1adeafc046ff925a6', alt: 'Foco encendido', title: 'Luz para cada cuarto', text: 'Focos LED, inteligentes y ahorradores para tu casa o tu negocio.', cta: 'Comprar focos', href: '#nuevos' },
      { num: '04', tab: 'Cables', img: B + '96c00ebc0862099877967a7af4e3ef8e', alt: 'Cables de colores', title: 'Siempre conectado', text: 'Cables USB, HDMI, de red y extensiones de uso rudo.', cta: 'Comprar cables', href: '#nuevos' }
    ];
    return {
      accent: this.props.accent ?? '#FF914C',
      accentText: '#E8701F',
      apiProductos,
      apiCatalogState,
      apiCatalogError,
      ticker: [0, 1].flatMap(() => ['Envío a todo el país', 'Entrega programada', 'Pago seguro', 'Atención por WhatsApp', 'Focos LED e inteligentes', 'Paneles solares y energía portátil', 'Cables y extensiones', 'Todo para camping', 'Bisutería nueva cada semana', 'Ofertas de temporada', 'Kits VIA para cada proyecto'].map((label) => ({ label }))),
      slide: heroSlides[this.state.hero],
      heroTabs: heroSlides.map((h, i) => ({
        num: h.num,
        name: h.tab,
        selected: i === this.state.hero ? 'true' : 'false',
        border: i === this.state.hero ? '4px solid ' + (this.props.accent ?? '#FF914C') : '4px solid #3A3A3A',
        numColor: i === this.state.hero ? (this.props.accent ?? '#FF914C') : '#A8A8A8',
        pick: () => this.setState({ hero: i, heroPaused: true })
      })),
      cartCount: this.state.cart,
      hasCart: this.state.cart > 0,
      menu,
      menuOpen: open >= 0,
      current: { name: cur.name, blurb: cur.blurb, img: cur.img, subs: cur.subs.map((name) => ({ name })) },
      closeMenu: () => this.setState({ open: -1 }),
      standard: [
        { title: 'Calidad probada', text: 'Cada producto pasa por nuestra revisión antes de llegar a tu casa', icon: 'M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6zM9 12l2 2 4-4', border: 'none' },
        { title: 'Envío a todo el país', text: 'Despacho rápido, directo a tu puerta', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a1.6 1.6 0 1 0 0-.1M17 19a1.6 1.6 0 1 0 0-.1', border: line },
        { title: 'Atención personal', text: 'Te ayudamos a elegir el foco, cable o equipo correcto', icon: 'M4 20l1.3-4A8 8 0 1 1 8 18.7z', border: line },
        { title: 'Todo en un lugar', text: 'Iluminación, conexión, camping y accesorios en una sola tienda', icon: 'M4 7h16v13H4zM4 7l2-4h12l2 4M9 11h6', border: line }
      ],
      rails: [
        { id: 'nuevos', t1: 'Nuevas', t2: 'llegadas', sub: 'Lo más reciente en iluminación, cables y extensiones.', items: [
          P('Focos', 'LED', 'Foco LED 9 W luz cálida', '52dc55c2523393f8f60ab89499fa3ec1'),
          P('Focos', 'Inteligentes', 'Foco inteligente Wi-Fi', '0906fd6ca8bd6e968244a06277498fc6', { best: true }),
          P('Cables', 'USB', 'Cable USB-C carga rápida 1 m', '3aba2390d3fbd5f06fdd2cede507b16f'),
          P('Cables', 'HDMI', 'Cable HDMI 4K 2 m', '354b714744e85c34391d3c7f8d167078'),
          P('Extensiones', 'Uso rudo', 'Extensión de uso rudo 5 m', '323e29809539c2fb4b229651c8081ee9', { limited: true })
        ] },
        { id: 'solar', t1: 'Energía', t2: 'solar', sub: 'Paneles, estaciones de energía y lámparas que se cargan con el sol.', items: [
          P('Solar', 'Paneles', 'Panel solar monocristalino 100 W', '972ceb606bfca75ef6208d8d3966c77d', { best: true }),
          P('Solar', 'Estaciones', 'Estación de energía portátil', '56a034356f25e7cd0fe7251db3cbbddc'),
          P('Solar', 'Lámparas', 'Lámpara solar LED para exterior', '9d99a75423f8001324e3e1e3c77fbb84', { limited: true }),
          P('Solar', 'Kits', 'Kit solar plegable para camping', 'b6ecf2ad3d873fbfa09db032a5d5c447')
        ] },
        { id: 'vendidos', t1: 'Lo más', t2: 'vendido', sub: 'Los favoritos de nuestros clientes para casa, llaves y organización.', items: [
          P('Extensiones', 'Carretes', 'Carrete de extensión 15 m', 'c390a322d80bcca52c15a80479e59e7b', { best: true }),
          P('Llaveros', 'Piel', 'Llavero de piel con argolla', '75498ebf44874110a781233eb485dd6f'),
          P('Llaveros', 'Mosquetones', 'Mosquetón llavero de aluminio', 'eb0c79147accd306bbd7a39d350a8e88', { best: true }),
          P('Ganchos', 'Pared', 'Ganchos de pared de metal (set de 3)', 'b68602a2601d3a2d118c7190d31f96a1'),
          P('Camping', 'Lámparas', 'Lámpara de camping recargable', 'a58999411e32d7481815ba8cdc175e97', { limited: true })
        ] },
        { id: 'destacados', t1: 'Productos', t2: 'destacados', sub: 'Camping y bisutería seleccionados para esta temporada.', items: [
          P('Camping', 'Linternas', 'Linterna de cabeza LED', '9b85b845faa6856c6338458b006ed014', { sale: true, was: 'S/ 54.90' }),
          P('Camping', 'Cocina', 'Set de cocina para campamento', 'a5d2725814df1e3e53351e1060258c0c'),
          P('Bisutería', 'Collares', 'Collar dorado de cadena fina', '792438e54fa4b4d81f31171a2cf026f6', { best: true }),
          P('Bisutería', 'Pulseras', 'Pulsera de eslabones', '35ff16973619d00cc993a3ade94f5914'),
          P('Bisutería', 'Aretes', 'Aretes colgantes', 'a4055f5b70cb00ac6200555fc6a9593d', { limited: true })
        ] }
      ],
      bundles: [
        { title: 'Kit iluminación hogar', text: 'Focos LED para sala, cocina y recámaras, listos para instalar', img: B + '21203a7db58c579a492fb8673b0da391' },
        { title: 'Kit solar para casa', text: 'Paneles, batería e inversor para generar tu propia energía', img: B + 'c475e40bec8fdd711d15f0e45dd911ee' },
        { title: 'Kit camping esencial', text: 'Lámpara, linterna de cabeza y utensilios para tu primera salida', img: B + '270fef37ab257fc6383d3c904a7f2911' },
        { title: 'Kit organiza tu entrada', text: 'Ganchos y llaveros para que nada se pierda al salir de casa', img: B + '272bea8b7248b836c67be12c95c01d95' }
      ],
      posts: [
        { title: 'Cómo elegir el foco LED correcto', excerpt: 'Watts, lúmenes y temperatura de color: qué significan y cuál conviene en cada cuarto...', img: B + '05c028e463fb57c46a6c19eb20c948ec' },
        { title: 'Qué cable necesitas para cada dispositivo', excerpt: 'USB-C, Lightning, HDMI o red: una guía rápida para no comprar el equivocado...', img: B + '6af821d524de317f8c0336930400fc16' },
        { title: 'Lista básica para tu primer campamento', excerpt: 'Iluminación, refugio y cocina: lo indispensable para una noche al aire libre...', img: B + '5bcbbd21ce25a9016f20a6456029204e' },
        { title: 'Cómo cuidar tu bisutería para que dure', excerpt: 'Guárdala seca, lejos del perfume y límpiala con un paño suave...', img: B + '93753441fe020acc16180c6da0263063' }
      ],
      partners: ['[LOGO CLIENTE]', '[LOGO CLIENTE]', '[LOGO CLIENTE]', '[LOGO CLIENTE]', '[LOGO CLIENTE]'].map((name) => ({ name })),
      sectors: [
        { name: 'Minoristas y bodegas', text: 'Precio de reventa y cajas surtidas para tu tienda, bodega o puesto.', img: B + 'cd5b8d4d29882c962f6ce191254c644d' },
        { name: 'Mayoristas y ferreterías', text: 'Cajas cerradas, precios escalonados y despacho a provincias.', img: B + '0bb06f99d56a0b4730372a08e5afe328' },
        { name: 'Construcción y minería', text: 'Reflectores, extensiones de uso rudo y energía solar con entrega en obra o campamento.', img: B + '524ebfd4d972c8db18ff6599e8f01b62' },
        { name: 'Hoteles y oficinas', text: 'Iluminación decorativa, cables y multicontactos con factura.', img: B + '4b2506636a27e493dfe772a736a94305' }
      ],
      footerCols: [
        { title: 'Categorías', links: cats.map((c) => ({ label: c.name })) },
        { title: 'Atención al cliente', links: [{ label: 'Envíos y devoluciones' }, { label: 'Contacto' }, { label: 'Preguntas frecuentes' }, { label: 'Facturación' }] },
        { title: 'VIA', links: [{ label: 'Nosotros' }, { label: 'Empresas' }, { label: 'Guías' }, { label: 'Kits' }, { label: 'Enlaces y redes' }] }
      ]
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Main(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.marquee{animation:via-marquee 40s linear infinite}\n@keyframes via-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion: reduce){.marquee{animation:none}}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <div style={{ "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "height": "48px", "overflow": "hidden", "display": "flex", "alignItems": "center", "whiteSpace": "nowrap" }}>
        <div className={"marquee"} style={{ "display": "flex", "alignItems": "center", "flex": "none" }}>
          {(lookup(v, "ticker") || []).map((t, index1) => (
            <Fragment key={index1}>
              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "28px", "paddingRight": "28px" }}>
                {lookup(t, "label")}
                <span style={{ "width": "6px", "height": "6px", "borderRadius": "50%", "background": "#111111" }}></span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>
      <header style={{ "background": "#FFFFFF", "position": "sticky", "top": "0", "zIndex": "5", "borderBottom": "1px solid #111111" }}>
        <div style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "0 40px", "position": "relative" }}>
          <div style={{ "minHeight": "88px", "display": "flex", "alignItems": "center", "gap": "24px", "justifyContent": "space-between", "flexWrap": "wrap" }}>
            <DesignLink href={"#top"} aria-label={"VIA Provisiones, inicio"} style={{ "display": "flex", "alignItems": "center", "textDecoration": "none" }}>
              <svg width={"176"} height={"58"} viewBox={"134 205 278 92"} role={"img"} aria-label={"VIA Provisiones"}>
                <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={lookup(v, "accent")} strokeWidth={"3"}></circle>
                <clipPath id={"via-clip-h"}>
                  <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                </clipPath>
                <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={lookup(v, "accent")}></polygon>
                <path clipPath={"url(#via-clip-h)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
                <g fill={"none"} stroke={"#111111"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
                  <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
                  <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
                  <path d={"M295.8 229 V248.25"}></path>
                </g>
                <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={lookup(v, "accent")}>
                  {"PROVISIONES"}
                </text>
              </svg>
            </DesignLink>
            <div style={{ "display": "flex", "alignItems": "center", "gap": "22px", "flexWrap": "wrap", "justifyContent": "flex-end" }}>
              <label style={{ "position": "relative", "display": "flex", "alignItems": "center", "width": "474px", "maxWidth": "80vw", "height": "46px", "border": "1px solid #111111", "borderRadius": "999px", "padding": "0 6px 0 18px", "boxSizing": "border-box" }}>
                <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                  {"Buscar productos"}
                </span>
                <input type={"search"} placeholder={"Buscar focos, paneles solares, camping…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "16px", "color": "#111111", "outline": "none" }} />
                <span style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                    <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                    <path d={"M16 16l4 4"}></path>
                  </svg>
                </span>
              </label>
              <DesignLink href={"/empresas"} style={{ "textDecoration": "none", "fontSize": "16px", "fontWeight": "700", "display": "inline-flex", "alignItems": "center", "gap": "6px" }}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"}></path>
                </svg>
                {"Empresas"}
              </DesignLink>
              <DesignLink href={"#historia"} style={{ "textDecoration": "none", "fontSize": "16px", "fontWeight": "500" }}>
                {"Nosotros"}
              </DesignLink>
              <button aria-label={"Favoritos"} style={{ "width": "32px", "height": "44px", "border": "none", "background": "transparent", "color": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "padding": "0" }}>
                <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"}></path>
                </svg>
              </button>
              <DesignLink href={"/admin/login"} aria-label={"Acceso al panel de administración"} title={"Ingresar al panel de administración"} style={{ "width": "auto", "height": "44px", "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "6px", "padding": "0 6px", "fontSize": "13px", "fontWeight": "700", "textDecoration": "none" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <circle cx={"12"} cy={"8"} r={"4"}></circle>
                  <path d={"M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"}></path>
                </svg>
                {"Panel"}
              </DesignLink>
              <DesignLink href={"/carrito"} aria-label={"Carrito"} style={{ "position": "relative", "width": "40px", "height": "40px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none" }}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M3 4h2l2.2 11h11l2-8H6.2"}></path>
                  <circle cx={"9"} cy={"19"} r={"1.3"}></circle>
                  <circle cx={"17"} cy={"19"} r={"1.3"}></circle>
                </svg>
                {Boolean(lookup(v, "hasCart")) && (
                  <Fragment>
                    <span style={{ "position": "absolute", "top": "-4px", "right": "-4px", "minWidth": "18px", "height": "18px", "borderRadius": "9px", "background": "#111111", "color": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      {lookup(v, "cartCount")}
                    </span>
                  </Fragment>
                )}
              </DesignLink>
            </div>
          </div>
          <nav aria-label={"Categorías"} style={{ "borderTop": "1px solid #111111", "minHeight": "56px", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "4px 28px", "flexWrap": "wrap" }}>
            {(lookup(v, "menu") || []).map((m, index2) => (
              <Fragment key={index2}>
                <button onClick={lookup(m, "toggle")} aria-expanded={lookup(m, "expanded")} style={{ "border": "none", "background": "transparent", "cursor": "pointer", "padding": "0 2px", "minHeight": "44px", "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase", "letterSpacing": "0.02em", "color": "#111111", "display": "inline-flex", "alignItems": "center", "gap": "8px", "borderBottom": lookup(m, "underline") }}>
                  {lookup(m, "name")}
                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                    <path d={lookup(m, "chevron")}></path>
                  </svg>
                </button>
              </Fragment>
            ))}
            <DesignLink href={"#destacados"} style={{ "minHeight": "44px", "display": "inline-flex", "alignItems": "center", "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800", "textTransform": "uppercase", "textDecoration": "none", "color": "#111111" }}>
              <span style={{ "background": lookup(v, "accent"), "padding": "4px 10px", "borderRadius": "999px" }}>
                {"Ofertas"}
              </span>
            </DesignLink>
          </nav>
          {Boolean(lookup(v, "menuOpen")) && (
            <Fragment>
              <div style={{ "position": "absolute", "left": "40px", "right": "40px", "top": "100%", "background": "#FFFFFF", "border": "1px solid #111111", "borderTop": "4px solid " + String(lookup(v, "accent") ?? ""), "borderRadius": "0 0 16px 16px", "padding": "32px", "display": "flex", "flexWrap": "wrap", "gap": "32px", "boxShadow": "0 18px 40px rgba(0,0,0,0.12)" }}>
                <div style={{ "flex": "0 1 240px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Categoría"}
                  </span>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "36px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                    {lookup(v, "current.name")}
                  </span>
                  <span style={{ "fontSize": "16px", "lineHeight": "1.5" }}>
                    {lookup(v, "current.blurb")}
                  </span>
                  <DesignLink href={"/categoria"} onClick={lookup(v, "closeMenu")} style={{ "alignSelf": "flex-start", "marginTop": "6px", "display": "inline-flex", "alignItems": "center", "height": "46px", "padding": "0 22px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Ver todo"}
                  </DesignLink>
                </div>
                <ul style={{ "flex": "1 1 320px", "listStyle": "none", "margin": "0", "padding": "0", "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "4px 24px", "alignContent": "start" }}>
                  {(lookup(v, "current.subs") || []).map((s, index3) => (
                    <Fragment key={index3}>
                      <li>
                        <DesignLink href={"#nuevos"} onClick={lookup(v, "closeMenu")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "minHeight": "48px", "borderBottom": "1px solid #111111", "textDecoration": "none", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "700", "textTransform": "uppercase" }}>
                          {lookup(s, "name")}
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                            <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                          </svg>
                        </DesignLink>
                      </li>
                    </Fragment>
                  ))}
                </ul>
                <img src={assetSrc(lookup(v, "current.img"))} alt={""} style={{ "flex": "0 1 300px", "width": "300px", "maxWidth": "100%", "height": "220px", "objectFit": "cover", "borderRadius": "12px" }} />
                <button onClick={lookup(v, "closeMenu")} aria-label={"Cerrar menú"} style={{ "position": "absolute", "top": "12px", "right": "12px", "width": "40px", "height": "40px", "border": "1px solid #111111", "borderRadius": "50%", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                </button>
              </div>
            </Fragment>
          )}
        </div>
      </header>
      <section id={"top"} style={{ "position": "relative", "height": "760px", "background": "#111111", "overflow": "hidden" }}>
        <img src={assetSrc(lookup(v, "slide.img"))} alt={lookup(v, "slide.alt")} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
        <div style={{ "position": "absolute", "left": "0", "right": "0", "top": "0", "bottom": "76px" }}>
          <div style={{ "maxWidth": "1520px", "height": "100%", "margin": "0 auto", "padding": "0 40px 40px", "boxSizing": "border-box", "display": "flex", "alignItems": "flex-end" }}>
            <div style={{ "width": "580px", "maxWidth": "100%", "background": "#FFFFFF", "borderTop": "6px solid " + String(lookup(v, "accent") ?? ""), "padding": "34px 40px 36px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
              <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "color": "#111111" }}>
                {lookup(v, "slide.num")}
                {" / 04 — "}
                {lookup(v, "slide.tab")}
              </span>
              <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "64px", "lineHeight": "0.95", "letterSpacing": "-0.01em", "textTransform": "uppercase", "color": "#111111" }}>
                {lookup(v, "slide.title")}
              </h1>
              <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.5", "color": "#111111" }}>
                {lookup(v, "slide.text")}
              </p>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "24px", "flexWrap": "wrap", "marginTop": "6px" }}>
                <DesignLink href={lookup(v, "slide.href")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "12px", "height": "54px", "padding": "0 28px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase" }}>
                  {lookup(v, "slide.cta")}
                  {" "}
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                    <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                  </svg>
                </DesignLink>
                <DesignLink href={"#categorias"} style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px", "minHeight": "44px", "display": "inline-flex", "alignItems": "center" }}>
                  {"Todas las categorías"}
                </DesignLink>
              </div>
            </div>
          </div>
        </div>
        <div style={{ "position": "absolute", "left": "0", "right": "0", "bottom": "0", "background": "#111111" }}>
          <div role={"tablist"} aria-label={"Destacados de la portada"} style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "0 40px", "boxSizing": "border-box", "display": "grid", "gridTemplateColumns": "repeat(4, minmax(0, 1fr))" }}>
            {(lookup(v, "heroTabs") || []).map((t, index4) => (
              <Fragment key={index4}>
                <button role={"tab"} aria-selected={lookup(t, "selected")} onClick={lookup(t, "pick")} style={{ "height": "76px", "border": "none", "borderTop": lookup(t, "border"), "background": "transparent", "color": "#FFFFFF", "cursor": "pointer", "textAlign": "left", "padding": "0 16px 0 0", "display": "flex", "alignItems": "center", "gap": "14px", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "800", "textTransform": "uppercase" }}>
                  <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "color": lookup(t, "numColor") }}>
                    {lookup(t, "num")}
                  </span>
                  {lookup(t, "name")}
                  {"\n"}
                </button>
              </Fragment>
            ))}
          </div>
        </div>
      </section>
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "0 40px" }}>
        <section id={"categorias"} style={{ "padding": "64px 0" }}>
          <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "lineHeight": "1.15", "textTransform": "uppercase", "margin": "0 0 8px" }}>
            {"Compra por "}
            <span style={{ "color": lookup(v, "accentText") }}>
              {"categoría"}
            </span>
          </h2>
          <p style={{ "margin": "0 0 36px" }}>
            {"Todo lo que necesitas, a un toque"}
          </p>
          <div className={"noscroll"} style={{ "display": "flex", "gap": "24px", "overflowX": "auto", "justifyContent": "space-between" }}>
            {(lookup(v, "menu") || []).map((c, index5) => (
              <Fragment key={index5}>
                <DesignLink href={"/categoria"} style={{ "flex": "none", "textDecoration": "none", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "14px", "width": "150px" }}>
                  <img src={assetSrc(lookup(c, "img"))} alt={""} style={{ "width": "140px", "height": "140px", "borderRadius": "50%", "border": "3px solid " + String(lookup(v, "accent") ?? ""), "objectFit": "cover", "boxSizing": "border-box" }} />
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {lookup(c, "name")}
                  </span>
                  <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "500", "color": "#444444" }}>
                    {lookup(c, "count")}
                  </span>
                </DesignLink>
              </Fragment>
            ))}
          </div>
        </section>
        <section style={{ "padding": "40px 0 72px" }}>
          <div style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "marginBottom": "14px" }}>
            {"Nuestra promesa —"}
          </div>
          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap", "marginBottom": "32px" }}>
            <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "lineHeight": "1.15", "textTransform": "uppercase", "margin": "0" }}>
              {"El estándar "}
              <span style={{ "color": lookup(v, "accentText") }}>
                {"VIA"}
              </span>
            </h2>
            <p style={{ "margin": "0" }}>
              {"Lo que necesitas, cuando lo necesitas"}
            </p>
          </div>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(240px, 1fr))", "borderTop": "1px solid #111111", "borderBottom": "1px solid #111111" }}>
            {(lookup(v, "standard") || []).map((s, index6) => (
              <Fragment key={index6}>
                <div style={{ "padding": "28px 24px", "borderLeft": lookup(s, "border"), "display": "flex", "flexDirection": "column", "gap": "10px", "minHeight": "196px", "boxSizing": "border-box" }}>
                  <span style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "marginBottom": "18px" }}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                      <path d={lookup(s, "icon")}></path>
                    </svg>
                  </span>
                  <h3 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "18px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {lookup(s, "title")}
                  </h3>
                  <p style={{ "margin": "0", "fontSize": "16px", "lineHeight": "1.55" }}>
                    {lookup(s, "text")}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        {lookup(v, "apiCatalogState") === "success" ? (
          <section id="productos" style={{ padding: "40px 0 64px" }}>
            <h2 style={{ fontFamily: "Archivo, sans-serif", fontWeight: "800", fontSize: "40px", textTransform: "uppercase", margin: "0 0 24px" }}>
              Productos <span style={{ color: lookup(v, "accentText") }}>disponibles</span>
            </h2>
            {lookup(v, "apiProductos").length === 0 ? (
              <p role="status">Pronto publicaremos productos en la tienda.</p>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "20px" }}>
                {(lookup(v, "apiProductos") || []).map((p, index7) => (
                  <article key={lookup(p, "id") || index7} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <img src={assetSrc(lookup(p, "imagen") || "img/a58999411e32d7481815ba8cdc175e97")} alt={lookup(p, "textoAlternativo") || lookup(p, "nombre")} style={{ width: "100%", aspectRatio: "1", borderRadius: "18px", objectFit: "cover", background: "#F4F4F2" }} />
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: "12px", textTransform: "uppercase" }}>{lookup(p, "categoria") || "VIA Provisiones"}</span>
                    <h3 style={{ margin: 0, fontFamily: "Archivo, sans-serif", fontSize: "18px", textTransform: "uppercase" }}><DesignLink href={`/producto?id=${encodeURIComponent(p.id)}`}>{lookup(p, "nombre")}</DesignLink></h3>
                    <strong style={{ fontFamily: "'Roboto Mono', monospace" }}>S/ {Number(lookup(p, "precio") || 0).toFixed(2)}</strong>
                    <button onClick={add} style={{ height: "44px", borderRadius: "999px", border: "2px solid #111111", background: "#FFFFFF", cursor: "pointer", fontWeight: "700" }}>Añadir al carrito</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : lookup(v, "apiCatalogState") === "error" ? (
          <section role="status" style={{ margin: "32px 0", padding: "18px 22px", borderRadius: "16px", background: "#FFF4D6" }}>
            {lookup(v, "apiCatalogError") || "No se pudo conectar con el catálogo."}
          </section>
        ) : lookup(v, "apiCatalogState") === "pending" ? (
          <section role="status" style={{ padding: "40px 0 64px" }}>Cargando el catálogo…</section>
        ) : (lookup(v, "rails") || []).map((r, index7) => (
          <Fragment key={index7}>
            <section id={lookup(r, "id")} style={{ "padding": "40px 0 64px", "display": "flex", "flexWrap": "wrap", "gap": "40px" }}>
              <div style={{ "flex": "0 1 340px", "minWidth": "260px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "lineHeight": "1.1", "textTransform": "uppercase", "margin": "0" }}>
                  {lookup(r, "t1")}
                  {" "}
                  <span style={{ "color": lookup(v, "accentText") }}>
                    {lookup(r, "t2")}
                  </span>
                </h2>
                <p style={{ "margin": "0 0 16px", "lineHeight": "1.55" }}>
                  {lookup(r, "sub")}
                </p>
                <DesignLink href={"#nuevos"} style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "gap": "12px", "height": "54px", "padding": "0 26px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase", "boxSizing": "border-box" }}>
                  {"Ver la colección "}
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                    <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                  </svg>
                </DesignLink>
                <div style={{ "display": "flex", "gap": "10px", "marginTop": "18px" }}>
                  <button aria-label={"Anterior"} style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "border": "2px solid #111111", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                      <path d={"M19 12H5M11 6l-6 6 6 6"}></path>
                    </svg>
                  </button>
                  <button aria-label={"Siguiente"} style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                      <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                    </svg>
                  </button>
                </div>
              </div>
              <div className={"noscroll"} style={{ "flex": "999 1 560px", "minWidth": "0", "display": "flex", "gap": "20px", "overflowX": "auto" }}>
                {(lookup(r, "items") || []).map((p, index8) => (
                  <Fragment key={index8}>
                    <article style={{ "flex": "none", "width": "298px", "display": "flex", "flexDirection": "column" }}>
                      <div style={{ "position": "relative", "width": "298px", "height": "298px", "borderRadius": "19px", "overflow": "hidden", "background": "#FFFFFF" }}>
                        <img src={assetSrc(lookup(p, "img"))} alt={lookup(p, "name")} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
                        <div style={{ "position": "absolute", "top": "12px", "left": "12px", "display": "flex", "flexDirection": "column", "alignItems": "flex-start", "gap": "6px" }}>
                          {Boolean(lookup(p, "best")) && (
                            <Fragment>
                              <span style={{ "background": "#111111", "color": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase", "padding": "4px 10px", "borderRadius": "999px" }}>
                                {"Más vendido"}
                              </span>
                            </Fragment>
                          )}
                          {Boolean(lookup(p, "limited")) && (
                            <Fragment>
                              <span style={{ "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase", "padding": "4px 10px", "borderRadius": "999px" }}>
                                {"Pocas unidades"}
                              </span>
                            </Fragment>
                          )}
                          {Boolean(lookup(p, "sale")) && (
                            <Fragment>
                              <span style={{ "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase", "padding": "4px 10px", "borderRadius": "999px" }}>
                                {"Oferta"}
                              </span>
                            </Fragment>
                          )}
                        </div>
                        <button aria-label={"Añadir a favoritos"} style={{ "position": "absolute", "top": "10px", "right": "10px", "width": "34px", "height": "34px", "border": "1px solid #111111", "borderRadius": "50%", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "padding": "0" }}>
                          <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                            <path d={"M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"}></path>
                          </svg>
                        </button>
                      </div>
                      <DesignLink href={"#categorias"} style={{ "marginTop": "16px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "3px" }}>
                        {lookup(p, "cat")}
                        {" · "}
                        {lookup(p, "sub")}
                      </DesignLink>
                      <h3 style={{ "margin": "6px 0 0", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "700", "textTransform": "uppercase", "lineHeight": "1.3", "minHeight": "44px" }}>
                        <DesignLink href={"/producto"} style={{ "textDecoration": "none" }}>
                          {lookup(p, "name")}
                        </DesignLink>
                      </h3>
                      <div style={{ "marginTop": "12px", "display": "flex", "gap": "8px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700" }}>
                        <span>
                          {lookup(p, "price")}
                        </span>
                        {Boolean(lookup(p, "was")) && (
                          <Fragment>
                            <s style={{ "fontWeight": "500", "color": "#555555" }}>
                              {lookup(p, "was")}
                            </s>
                          </Fragment>
                        )}
                      </div>
                      <button onClick={lookup(p, "add")} style={{ "marginTop": "12px", "height": "46px", "borderRadius": "999px", "border": "2px solid #111111", "background": "#FFFFFF", "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase", "cursor": "pointer" }}>
                        {"Añadir al carrito"}
                      </button>
                    </article>
                  </Fragment>
                ))}
              </div>
            </section>
          </Fragment>
        ))}
        <section style={{ "padding": "48px 0 72px" }}>
          <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "lineHeight": "1.15", "textTransform": "uppercase", "margin": "0 0 8px" }}>
            {"Kits "}
            <span style={{ "color": lookup(v, "accentText") }}>
              {"VIA"}
            </span>
          </h2>
          <p style={{ "margin": "0 0 32px" }}>
            {"Todo lo necesario para cada proyecto, en un solo paquete"}
          </p>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(300px, 1fr))", "gap": "20px" }}>
            {(lookup(v, "bundles") || []).map((b, index9) => (
              <Fragment key={index9}>
                <DesignLink href={"#nuevos"} style={{ "textDecoration": "none", "display": "flex", "flexDirection": "column" }}>
                  <img src={assetSrc(lookup(b, "img"))} alt={""} style={{ "width": "100%", "aspectRatio": "4 / 3", "borderRadius": "16px", "objectFit": "cover", "display": "block" }} />
                  <span style={{ "marginTop": "18px", "fontFamily": "Archivo, sans-serif", "fontSize": "24px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {lookup(b, "title")}
                  </span>
                  <span style={{ "marginTop": "8px", "lineHeight": "1.55" }}>
                    {lookup(b, "text")}
                  </span>
                  <span style={{ "marginTop": "10px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "textDecoration": "underline", "textUnderlineOffset": "4px" }}>
                    {"Ver el kit"}
                  </span>
                </DesignLink>
              </Fragment>
            ))}
          </div>
        </section>
        <section id={"historia"} style={{ "padding": "40px 0 64px", "display": "flex", "flexWrap": "wrap", "gap": "64px", "alignItems": "flex-start" }}>
          <div style={{ "flex": "1 1 520px", "minWidth": "0" }}>
            <div style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "marginBottom": "18px" }}>
              {"Nuestra historia —"}
            </div>
            <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "lineHeight": "1.12", "textTransform": "uppercase", "margin": "0" }}>
              {"Todo lo que necesitas, "}
              <span style={{ "color": lookup(v, "accentText") }}>
                {"en un solo camino"}
              </span>
            </h2>
          </div>
          <div style={{ "flex": "1 1 420px", "minWidth": "0", "paddingTop": "4px" }}>
            <div style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "marginBottom": "18px" }}>
              {"Sobre VIA Provisiones"}
            </div>
            <p style={{ "margin": "0 0 24px", "fontSize": "19px", "lineHeight": "1.55" }}>
              {"VIA Provisiones reúne iluminación, energía solar, conexión, organización, camping y accesorios en una sola tienda, para que encuentres lo que buscas sin dar vueltas."}
            </p>
            <DesignLink href={"#historia"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "12px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "textDecoration": "none", "minHeight": "44px" }}>
              {"Conócenos "}
              <span style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "inline-flex", "alignItems": "center", "justifyContent": "center" }}>
                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                  <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                </svg>
              </span>
            </DesignLink>
          </div>
        </section>
        <section style={{ "padding": "40px 0 72px" }}>
          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "24px", "flexWrap": "wrap", "marginBottom": "28px" }}>
            <div>
              <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "lineHeight": "1.12", "textTransform": "uppercase", "margin": "0 0 10px" }}>
                {"Ilumina tu "}
                <span style={{ "color": lookup(v, "accentText") }}>
                  {"próxima aventura"}
                </span>
              </h2>
              <p style={{ "margin": "0", "lineHeight": "1.55", "maxWidth": "640px" }}>
                {"Lámparas recargables, linternas de cabeza y todo el equipo para acampar con luz y energía de sobra."}
              </p>
            </div>
            <DesignLink href={"#destacados"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "12px", "height": "54px", "padding": "0 26px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase", "boxSizing": "border-box" }}>
              {"Comprar camping "}
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                <path d={"M5 12h14M13 6l6 6-6 6"}></path>
              </svg>
            </DesignLink>
          </div>
          <img src={assetSrc("img/6bfeade76520c7a9cd478f997069e6ca")} alt={"Casa de campaña iluminada de noche"} style={{ "width": "100%", "height": "581px", "borderRadius": "16px", "objectFit": "cover", "display": "block" }} />
        </section>
        <section style={{ "padding": "40px 0 56px" }}>
          <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "lineHeight": "1.15", "textTransform": "uppercase", "margin": "0 0 32px" }}>
            {"Guías "}
            <span style={{ "color": lookup(v, "accentText") }}>
              {"VIA"}
            </span>
          </h2>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(260px, 1fr))", "gap": "32px 24px" }}>
            {(lookup(v, "posts") || []).map((a, index10) => (
              <Fragment key={index10}>
                <article style={{ "display": "flex", "flexDirection": "column" }}>
                  <img src={assetSrc(lookup(a, "img"))} alt={""} style={{ "width": "100%", "aspectRatio": "4 / 3", "borderRadius": "12px", "objectFit": "cover", "display": "block" }} />
                  <h3 style={{ "margin": "20px 0 10px", "fontFamily": "Archivo, sans-serif", "fontSize": "19px", "fontWeight": "800", "textTransform": "uppercase", "lineHeight": "1.25" }}>
                    {lookup(a, "title")}
                  </h3>
                  <p style={{ "margin": "0 0 16px", "fontSize": "16px", "lineHeight": "1.55" }}>
                    {lookup(a, "excerpt")}
                  </p>
                  <DesignLink href={"#top"} style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px", "alignSelf": "flex-start" }}>
                    {"Leer más"}
                  </DesignLink>
                </article>
              </Fragment>
            ))}
          </div>
          <div style={{ "display": "flex", "justifyContent": "center", "gap": "8px", "marginTop": "40px" }}>
            <span style={{ "width": "28px", "height": "4px", "background": lookup(v, "accent") }}></span>
            <span style={{ "width": "28px", "height": "4px", "background": "#111111" }}></span>
          </div>
        </section>
        <section id={"empresas"} style={{ "padding": "48px 0 72px" }}>
          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap", "marginBottom": "32px" }}>
            <div>
              <div style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "marginBottom": "14px" }}>
                {"Ventas corporativas —"}
              </div>
              <h2 style={{ "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "lineHeight": "1.12", "textTransform": "uppercase", "margin": "0 0 10px" }}>
                {"Atendemos a "}
                <span style={{ "color": lookup(v, "accentText") }}>
                  {"empresas"}
                </span>
              </h2>
              <p style={{ "margin": "0", "lineHeight": "1.55", "maxWidth": "640px" }}>
                {"Vendemos por mayor y menor a bodegas, minoristas, mayoristas, ferreterías, constructoras, mineras, hoteles y oficinas, con precios según tu volumen, factura y despacho a todo el Perú."}
              </p>
            </div>
            <DesignLink href={"/empresas"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "12px", "height": "54px", "padding": "0 26px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase" }}>
              {"Cotizar para mi empresa "}
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                <path d={"M5 12h14M13 6l6 6-6 6"}></path>
              </svg>
            </DesignLink>
          </div>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(260px, 1fr))", "gap": "20px" }}>
            {(lookup(v, "sectors") || []).map((x, index11) => (
              <Fragment key={index11}>
                <DesignLink href={"/empresas"} style={{ "position": "relative", "display": "block", "height": "420px", "borderRadius": "16px", "overflow": "hidden", "textDecoration": "none", "background": "#111111" }}>
                  <img src={assetSrc(lookup(x, "img"))} alt={""} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
                  <span style={{ "position": "absolute", "left": "16px", "right": "16px", "bottom": "16px", "background": "#FFFFFF", "padding": "18px 20px", "display": "flex", "flexDirection": "column", "gap": "6px", "borderTop": "4px solid " + String(lookup(v, "accent") ?? "") }}>
                    <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "22px", "fontWeight": "900", "textTransform": "uppercase", "color": "#111111" }}>
                      {lookup(x, "name")}
                    </span>
                    <span style={{ "fontSize": "15px", "lineHeight": "1.45", "color": "#111111" }}>
                      {lookup(x, "text")}
                    </span>
                  </span>
                </DesignLink>
              </Fragment>
            ))}
          </div>
          <div style={{ "marginTop": "40px", "display": "flex", "alignItems": "center", "gap": "24px", "flexWrap": "wrap", "justifyContent": "center" }}>
            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
              {"Empresas que confían en VIA"}
            </span>
            {(lookup(v, "partners") || []).map((l, index12) => (
              <Fragment key={index12}>
                <span style={{ "width": "130px", "height": "54px", "borderRadius": "6px", "border": "2px dashed #111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "color": "#111111" }}>
                  {lookup(l, "name")}
                </span>
              </Fragment>
            ))}
          </div>
        </section>
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
