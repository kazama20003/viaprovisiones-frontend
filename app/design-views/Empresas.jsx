"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { seg: 0, vol: 1, sent: false, picked: ['Focos', 'Cables'] };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const line = '1px solid #111111';
    const segs = [
      { name: 'Minoristas y bodegas', short: 'tu bodega', img: 'cd5b8d4d29882c962f6ce191254c644d', alt: 'Estantes de una tienda', icon: 'M3 9l1-5h16l1 5M4 9v11h16V9M3 9h18M9 20v-6h6v6',
        text: 'Compra para revender en tu tienda, bodega o puesto con precios de reventa y surtido variado en una sola caja.',
        perks: ['Precio de reventa desde [N] unidades por producto', 'Cajas surtidas: varios productos en un solo pedido', 'Exhibidores para llaveros, bisutería y cables', 'Reposición semanal en Arequipa'],
        items: ['Focos LED', 'Cables USB', 'Llaveros', 'Ganchos adhesivos', 'Bisutería', 'Linternas'] },
      { name: 'Mayoristas y distribuidores', short: 'tu distribuidora', img: '0bb06f99d56a0b4730372a08e5afe328', alt: 'Almacén con mercadería', icon: 'M3 8l9-5 9 5v12H3zM3 8h18M8 20v-7h8v7',
        text: 'Cajas cerradas y precios escalonados para que revendas a otros negocios en tu ciudad o región.',
        perks: ['Precio mayorista por caja cerrada', 'Descuentos escalonados por volumen mensual', 'Despacho por agencia a todo el Perú', 'Crédito para clientes frecuentes, previa evaluación'],
        items: ['Focos por caja', 'Extensiones', 'Multicontactos', 'Lámparas solares', 'Cables HDMI'] },
      { name: 'Ferreterías', short: 'tu ferretería', img: '9fcd1df911cd5c0f55feec4bad8b2a10', alt: 'Pasillo de una ferretería', icon: 'M14 6l4 4-9 9H5v-4zM12 8l4 4',
        text: 'Material eléctrico y de iluminación con buena rotación para completar tu surtido.',
        perks: ['Línea completa de material eléctrico', 'Precios para reventa en ferretería', 'Pedidos mixtos por categoría', 'Asesoría para armar tu surtido'],
        items: ['Cable eléctrico', 'Reflectores', 'Carretes', 'Supresores de picos', 'Focos ahorradores'] },
      { name: 'Construcción', short: 'tu obra', img: 'cd5e42c16694deb78e6abc37257e1045', alt: 'Trabajadores en una obra', icon: 'M2 20h20M5 20V10l7-6 7 6v10M9 20v-5h6v5',
        text: 'Iluminación temporal, extensiones de uso rudo y cable para obra, con entrega en el sitio.',
        perks: ['Entrega programada en obra', 'Extensiones y carretes de uso rudo', 'Reflectores LED para trabajo nocturno', 'Factura por proyecto u orden de compra'],
        items: ['Reflectores', 'Carretes 15 m', 'Cable eléctrico', 'Ganchos de pared', 'Linternas de cabeza'] },
      { name: 'Minería', short: 'tu operación', img: '524ebfd4d972c8db18ff6599e8f01b62', alt: 'Maquinaria en una mina', icon: 'M2 20l7-12 4 6 3-4 6 10z',
        text: 'Energía e iluminación para campamentos y operaciones en altura, con despacho a unidad minera.',
        perks: ['Paneles solares y estaciones de energía', 'Linternas de cabeza y lámparas recargables', 'Despacho a campamento o unidad minera', 'Atención por orden de compra'],
        items: ['Paneles solares', 'Estaciones de energía', 'Linternas de cabeza', 'Extensiones uso rudo', 'Casas de campaña'] },
      { name: 'Hoteles y restaurantes', short: 'tu local', img: '4b2506636a27e493dfe772a736a94305', alt: 'Salón de un restaurante', icon: 'M7 3v8M5 3v4a2 2 0 0 0 4 0V3M7 11v10M16 3c-2 0-3 3-3 6s1 4 3 4v8',
        text: 'Iluminación decorativa y de ambiente, más accesorios para cocina y habitaciones.',
        perks: ['Focos decorativos y luz cálida', 'Tiras LED para barras y fachadas', 'Ganchos y organizadores de cocina', 'Reposición rápida en Arequipa'],
        items: ['Focos filamento', 'Tiras LED', 'Focos inteligentes', 'Ganchos de cocina', 'Lámparas solares'] },
      { name: 'Oficinas e instituciones', short: 'tu oficina', img: '70bafa87296de04ca0d3bb324aaf3b34', alt: 'Oficina con escritorios', icon: 'M4 4h16v12H4zM8 20h8M12 16v4',
        text: 'Conexión, energía e iluminación para oficinas, colegios e instituciones.',
        perks: ['Cables HDMI, de red y USB', 'Multicontactos y supresores de picos', 'Focos ahorradores para todo el local', 'Factura y orden de compra'],
        items: ['Cables de red', 'Cables HDMI', 'Multicontactos', 'Focos LED', 'Organizadores'] },
      { name: 'Industria y almacenes', short: 'tu planta', img: '711f571a47fbc62189cd0ffb2a6bcc58', alt: 'Interior de un negocio', icon: 'M2 20V9l6 4V9l6 4V5h8v15z',
        text: 'Abastecimiento recurrente para plantas, talleres y almacenes.',
        perks: ['Pedidos recurrentes programados', 'Iluminación de alto rendimiento', 'Extensiones y cableado industrial', 'Asesor dedicado'],
        items: ['Reflectores', 'Extensiones', 'Carretes', 'Organizadores', 'Linternas'] }
    ];
    const s = this.state.seg;
    const cur = segs[s];
    const volumes = [
      { range: 'Hasta S/ 1,000', tier: 'Precio minorista' },
      { range: 'S/ 1,000 – 5,000', tier: 'Precio mayorista' },
      { range: 'Más de S/ 5,000', tier: 'Precio distribuidor' }
    ];
    const catNames = ['Focos', 'Solar', 'Cables', 'Extensiones', 'Llaveros', 'Ganchos', 'Camping', 'Bisutería'];
    const picked = this.state.picked;
    return {
      accent,
      segTabs: segs.map((g, i) => ({
        name: g.name, icon: g.icon,
        selected: i === s ? 'true' : 'false',
        bg: i === s ? '#111111' : '#FFFFFF',
        fg: i === s ? '#FFFFFF' : '#111111',
        pick: () => this.setState({ seg: i })
      })),
      seg: {
        ...cur,
        num: String(s + 1).padStart(2, '0'),
        img: B + cur.img,
        perks: cur.perks.map((t) => ({ t })),
        items: cur.items.map((t) => ({ t })),
        quote: () => this.setState({ sent: false })
      },
      segShortLower: cur.short,
      segChips: segs.map((g, i) => ({
        name: g.name,
        pressed: i === s ? 'true' : 'false',
        bg: i === s ? accent : '#FFFFFF',
        pick: () => this.setState({ seg: i })
      })),
      tiers: [
        { for: 'Bodegas y tiendas', name: 'Minorista', price: '[X]% de descuento', min: 'Desde [N] unidades por producto', popular: false, bg: '#FFFFFF', fg: '#111111', line: '#111111', btnBg: '#111111', btnFg: '#FFFFFF',
          perks: ['Precio de reventa sobre lista', 'Cajas surtidas', 'Boleta o factura', 'Recojo en tienda o envío'] },
        { for: 'Mayoristas y ferreterías', name: 'Mayorista', price: '[X]% de descuento', min: 'Cajas cerradas · desde S/ [MONTO] por pedido', popular: true, bg: accent, fg: '#111111', line: '#111111', btnBg: '#111111', btnFg: '#FFFFFF',
          perks: ['Precio por caja cerrada', 'Despacho a todo el Perú', 'Factura electrónica', 'Prioridad en stock'] },
        { for: 'Distribuidores y empresas', name: 'Distribuidor', price: 'Precio especial', min: 'Pedidos mensuales recurrentes', popular: false, bg: '#111111', fg: '#FFFFFF', line: '#FFFFFF', btnBg: accent, btnFg: '#111111',
          perks: ['Mejor precio por volumen', 'Asesor dedicado', 'Crédito previa evaluación', 'Entrega programada'] }
      ].map((t, i) => ({ ...t, perks: t.perks.map((x) => ({ t: x })), pick: () => this.setState({ vol: i, sent: false }) })),
      volumes: volumes.map((v, i) => ({
        ...v,
        pressed: i === this.state.vol ? 'true' : 'false',
        border: i === this.state.vol ? '3px solid #111111' : '1px solid #111111',
        pick: () => this.setState({ vol: i })
      })),
      sent: this.state.sent,
      notSent: !this.state.sent,
      send: () => this.setState({ sent: true }),
      reset: () => this.setState({ sent: false }),
      cats: catNames.map((name) => ({
        name,
        pressed: picked.includes(name) ? 'true' : 'false',
        bg: picked.includes(name) ? accent : '#FFFFFF',
        toggle: () => this.setState({ picked: picked.includes(name) ? picked.filter((x) => x !== name) : [...picked, name] })
      })),
      benefits: [
        { title: 'Precios por volumen', text: 'Minorista, mayorista o distribuidor: pagas según lo que compras.', icon: 'M4 19V9M10 19V5M16 19v-7M22 19H2', border: 'none' },
        { title: 'Factura electrónica', text: 'Emitimos boleta o factura con tu RUC en cada pedido.', icon: 'M5 3h14v18l-3-2-2 2-2-2-2 2-2-2-3 2zM9 8h6M9 12h6', border: line },
        { title: 'Despacho a todo el Perú', text: 'Recojo en Arequipa o envío por agencia a tu ciudad.', icon: 'M3 7h11v9H3zM14 10h4l3 3v3h-7', border: line },
        { title: 'Atención directa', text: 'Te atiende nuestro equipo comercial por WhatsApp, correo o en tienda.', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6', border: line }
      ],
      steps: [
        { num: '01', title: 'Envíanos tu pedido', text: 'Llena el formulario o escríbenos por WhatsApp con productos y cantidades.', bg: '#111111', fg: '#FFFFFF', numColor: accent },
        { num: '02', title: 'Recibe tu cotización', text: 'Te enviamos precios según tu nivel, stock y plazos de entrega.', bg: accent, fg: '#111111', numColor: '#111111' },
        { num: '03', title: 'Recibe tu mercadería', text: 'Confirmas, facturamos y entregamos en tu local, obra o almacén.', bg: '#FFFFFF', fg: '#111111', numColor: '#C2410C' }
      ]
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Empresas(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.marquee{animation:via-marquee 40s linear infinite}\n@keyframes via-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion: reduce){.marquee{animation:none}}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={"0"} active={"Empresas"} />
      <section style={{ "position": "relative", "height": "600px", "background": "#111111", "overflow": "hidden" }}>
        <img src={assetSrc("img/0bb06f99d56a0b4730372a08e5afe328")} alt={"Almacén con estanterías llenas de mercadería"} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
        <div style={{ "position": "relative", "maxWidth": "1520px", "height": "100%", "margin": "0 auto", "padding": "0 40px 48px", "boxSizing": "border-box", "display": "flex", "alignItems": "flex-end" }}>
          <div style={{ "width": "680px", "maxWidth": "100%", "background": "#FFFFFF", "borderTop": "6px solid " + String(lookup(v, "accent") ?? ""), "padding": "36px 40px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
              {"VIA Empresas — ventas por mayor y menor"}
            </span>
            <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "60px", "lineHeight": "0.95", "textTransform": "uppercase" }}>
              {"Abastecemos tu negocio"}
            </h1>
            <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.55" }}>
              {"Bodegas, minoristas, mayoristas, ferreterías, constructoras, mineras, hoteles y oficinas. Precios según tu volumen, factura electrónica y despacho a todo el Perú desde Arequipa."}
            </p>
            <div style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap", "marginTop": "4px" }}>
              <DesignLink href={"#cotizar"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "12px", "height": "54px", "padding": "0 28px", "borderRadius": "999px", "background": lookup(v, "accent"), "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Solicitar cotización"}
              </DesignLink>
              <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "54px", "padding": "0 24px", "borderRadius": "999px", "border": "2px solid #111111", "boxSizing": "border-box", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                </svg>
                {"Hablar con un asesor"}
              </DesignLink>
            </div>
          </div>
        </div>
      </section>
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "0 40px 80px" }}>
        <section id={"negocios"} style={{ "padding": "72px 0 56px" }}>
          <div style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "marginBottom": "14px" }}>
            {"Soluciones por tipo de negocio —"}
          </div>
          <h2 style={{ "margin": "0 0 24px", "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "textTransform": "uppercase" }}>
            {"¿Qué tipo de negocio "}
            <span style={{ "color": "#E8701F" }}>
              {"tienes?"}
            </span>
          </h2>
          <div role={"tablist"} aria-label={"Tipo de negocio"} className={"noscroll"} style={{ "display": "flex", "gap": "10px", "overflowX": "auto", "paddingBottom": "4px", "marginBottom": "28px" }}>
            {(lookup(v, "segTabs") || []).map((t, index1) => (
              <Fragment key={index1}>
                <button role={"tab"} aria-selected={lookup(t, "selected")} onClick={lookup(t, "pick")} style={{ "flex": "none", "display": "inline-flex", "alignItems": "center", "gap": "10px", "minHeight": "50px", "padding": "0 20px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "Archivo, sans-serif", "fontSize": "15px", "fontWeight": "800", "textTransform": "uppercase" }}>
                  <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(t, "icon")}></path>
                  </svg>
                  {lookup(t, "name")}
                </button>
              </Fragment>
            ))}
          </div>
          <div style={{ "display": "flex", "flexWrap": "wrap", "border": "2px solid #111111", "borderRadius": "24px", "overflow": "hidden" }}>
            <div style={{ "position": "relative", "flex": "1 1 520px", "minHeight": "460px", "background": "#111111" }}>
              <img src={assetSrc(lookup(v, "seg.img"))} alt={lookup(v, "seg.alt")} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
              <span style={{ "position": "absolute", "left": "20px", "top": "20px", "background": lookup(v, "accent"), "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "padding": "6px 12px", "borderRadius": "999px" }}>
                {lookup(v, "seg.num")}
                {" / 08"}
              </span>
            </div>
            <div style={{ "flex": "1 1 520px", "minWidth": "0", "padding": "40px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
              <h3 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "40px", "fontWeight": "900", "lineHeight": "1", "textTransform": "uppercase" }}>
                {lookup(v, "seg.name")}
              </h3>
              <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.55" }}>
                {lookup(v, "seg.text")}
              </p>
              <ul style={{ "listStyle": "none", "margin": "0", "padding": "0", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                {(lookup(v, "seg.perks") || []).map((p, index2) => (
                  <Fragment key={index2}>
                    <li style={{ "display": "flex", "gap": "12px", "alignItems": "flex-start", "fontSize": "16px", "lineHeight": "1.45" }}>
                      <span style={{ "width": "24px", "height": "24px", "borderRadius": "50%", "background": lookup(v, "accent"), "flex": "none", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"3.2"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                      </span>
                      {lookup(p, "t")}
                    </li>
                  </Fragment>
                ))}
              </ul>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Lo que más piden"}
                </span>
                <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
                  {(lookup(v, "seg.items") || []).map((i, index3) => (
                    <Fragment key={index3}>
                      <DesignLink href={"/categoria"} style={{ "display": "inline-flex", "alignItems": "center", "minHeight": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid #111111", "textDecoration": "none", "fontSize": "14px", "fontWeight": "500" }}>
                        {lookup(i, "t")}
                      </DesignLink>
                    </Fragment>
                  ))}
                </div>
              </div>
              <DesignLink href={"#cotizar"} onClick={lookup(v, "seg.quote")} style={{ "alignSelf": "flex-start", "marginTop": "6px", "display": "inline-flex", "alignItems": "center", "gap": "12px", "height": "54px", "padding": "0 26px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Cotizar para "}
                {lookup(v, "seg.short")}
                {" "}
                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                  <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                </svg>
              </DesignLink>
            </div>
          </div>
        </section>
        <section style={{ "padding": "24px 0 56px" }}>
          <h2 style={{ "margin": "0 0 8px", "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "textTransform": "uppercase" }}>
            {"Precios según tu "}
            <span style={{ "color": "#E8701F" }}>
              {"volumen"}
            </span>
          </h2>
          <p style={{ "margin": "0 0 28px", "fontSize": "17px" }}>
            {"Mientras más compras, mejor precio. Elige el nivel que va con tu negocio."}
          </p>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(300px, 1fr))", "gap": "20px", "alignItems": "stretch" }}>
            {(lookup(v, "tiers") || []).map((t, index4) => (
              <Fragment key={index4}>
                <article style={{ "border": "2px solid #111111", "borderRadius": "22px", "padding": "30px", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {lookup(t, "for")}
                    </span>
                    {Boolean(lookup(t, "popular")) && (
                      <Fragment>
                        <span style={{ "background": "#111111", "color": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase", "padding": "4px 10px", "borderRadius": "999px" }}>
                          {"Más elegido"}
                        </span>
                      </Fragment>
                    )}
                  </div>
                  <h3 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "34px", "fontWeight": "900", "textTransform": "uppercase", "lineHeight": "1" }}>
                    {lookup(t, "name")}
                  </h3>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "26px", "fontWeight": "700" }}>
                      {lookup(t, "price")}
                    </span>
                    <span style={{ "fontSize": "14px" }}>
                      {lookup(t, "min")}
                    </span>
                  </div>
                  <ul style={{ "listStyle": "none", "margin": "0", "padding": "16px 0 0", "borderTop": "1px solid " + String(lookup(t, "line") ?? ""), "display": "flex", "flexDirection": "column", "gap": "10px", "flex": "1" }}>
                    {(lookup(t, "perks") || []).map((p, index5) => (
                      <Fragment key={index5}>
                        <li style={{ "display": "flex", "gap": "10px", "fontSize": "15px", "lineHeight": "1.45" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"} style={{ "flex": "none", "marginTop": "1px" }}>
                            <path d={"M5 12l5 5 9-10"}></path>
                          </svg>
                          {lookup(p, "t")}
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                  <DesignLink href={"#cotizar"} onClick={lookup(t, "pick")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "height": "52px", "borderRadius": "999px", "background": lookup(t, "btnBg"), "color": lookup(t, "btnFg"), "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Quiero este precio"}
                  </DesignLink>
                </article>
              </Fragment>
            ))}
          </div>
          <p style={{ "margin": "16px 0 0", "fontSize": "14px" }}>
            {"Los montos y porcentajes entre corchetes se definen según tu lista de precios."}
          </p>
        </section>
        <section style={{ "padding": "24px 0 56px" }}>
          <h2 style={{ "margin": "0 0 28px", "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "textTransform": "uppercase" }}>
            {"Por qué trabajar con "}
            <span style={{ "color": "#E8701F" }}>
              {"VIA"}
            </span>
          </h2>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(240px, 1fr))", "borderTop": "1px solid #111111", "borderBottom": "1px solid #111111" }}>
            {(lookup(v, "benefits") || []).map((b, index6) => (
              <Fragment key={index6}>
                <div style={{ "padding": "28px 24px", "borderLeft": lookup(b, "border"), "display": "flex", "flexDirection": "column", "gap": "10px", "boxSizing": "border-box" }}>
                  <span style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center", "marginBottom": "14px" }}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} aria-hidden={"true"}>
                      <path d={lookup(b, "icon")}></path>
                    </svg>
                  </span>
                  <h3 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "18px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {lookup(b, "title")}
                  </h3>
                  <p style={{ "margin": "0", "fontSize": "16px", "lineHeight": "1.55" }}>
                    {lookup(b, "text")}
                  </p>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <section style={{ "padding": "24px 0 56px" }}>
          <h2 style={{ "margin": "0 0 28px", "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "40px", "textTransform": "uppercase" }}>
            {"Cómo "}
            <span style={{ "color": "#E8701F" }}>
              {"funciona"}
            </span>
          </h2>
          <ol style={{ "listStyle": "none", "margin": "0", "padding": "0", "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(260px, 1fr))", "gap": "20px" }}>
            {(lookup(v, "steps") || []).map((s, index7) => (
              <Fragment key={index7}>
                <li style={{ "background": lookup(s, "bg"), "border": "2px solid #111111", "borderRadius": "18px", "padding": "28px", "display": "flex", "flexDirection": "column", "gap": "12px", "minHeight": "200px", "boxSizing": "border-box" }}>
                  <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "64px", "fontWeight": "900", "lineHeight": "1", "color": lookup(s, "numColor") }}>
                    {lookup(s, "num")}
                  </span>
                  <h3 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "20px", "fontWeight": "800", "textTransform": "uppercase", "color": lookup(s, "fg") }}>
                    {lookup(s, "title")}
                  </h3>
                  <p style={{ "margin": "0", "fontSize": "16px", "lineHeight": "1.5", "color": lookup(s, "fg") }}>
                    {lookup(s, "text")}
                  </p>
                </li>
              </Fragment>
            ))}
          </ol>
        </section>
        <section id={"cotizar"} style={{ "padding": "24px 0 56px", "display": "flex", "flexWrap": "wrap", "gap": "48px", "alignItems": "flex-start" }}>
          <div style={{ "flex": "1 1 360px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
            <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "48px", "lineHeight": "1", "textTransform": "uppercase" }}>
              {"Solicita tu "}
              <span style={{ "color": "#E8701F" }}>
                {"cotización"}
              </span>
            </h2>
            <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.55" }}>
              {"Cuéntanos qué necesitas y te respondemos con precios para tu negocio, stock y plazos de entrega."}
            </p>
            <div style={{ "border": "2px solid #111111", "borderRadius": "18px", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "14px", "marginTop": "8px", "fontSize": "16px" }}>
              <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                <strong style={{ "fontFamily": "Archivo, sans-serif", "fontSize": "18px" }}>
                  {"Beltran Carlos Ccapa"}
                </strong>
                <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "color": "#C2410C" }}>
                  {"Gerente Comercial"}
                </span>
              </span>
              <DesignLink href={"https://wa.me/51954802744"} style={{ "display": "flex", "gap": "10px", "alignItems": "center", "textDecoration": "none" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M4 20l1.3-4A8 8 0 1 1 8 18.7z"}></path>
                </svg>
                {"WhatsApp: +51 954 802 744"}
              </DesignLink>
              <DesignLink href={"mailto:viaprovisionesperu@gmail.com"} style={{ "display": "flex", "gap": "10px", "alignItems": "center", "textDecoration": "none" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M4 6h16v12H4zM4 7l8 6 8-6"}></path>
                </svg>
                {"viaprovisionesperu@gmail.com"}
              </DesignLink>
              <span style={{ "display": "flex", "gap": "10px", "alignItems": "center" }}>
                <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.8"} aria-hidden={"true"}>
                  <path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"}></path>
                  <circle cx={"12"} cy={"10"} r={"2.5"}></circle>
                </svg>
                {"Dean Valdivia 533 - Cercado, Arequipa"}
              </span>
            </div>
          </div>
          <div style={{ "flex": "999 1 640px", "minWidth": "0", "border": "2px solid #111111", "borderRadius": "20px", "padding": "32px", "boxSizing": "border-box" }}>
            {Boolean(lookup(v, "sent")) && (
              <Fragment>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "16px", "alignItems": "flex-start", "padding": "24px 0" }}>
                  <span style={{ "width": "64px", "height": "64px", "borderRadius": "50%", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                    <svg width={"30"} height={"30"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                  </span>
                  <h3 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "32px", "fontWeight": "900", "textTransform": "uppercase" }}>
                    {"Solicitud enviada"}
                  </h3>
                  <p style={{ "margin": "0", "fontSize": "17px", "lineHeight": "1.55" }}>
                    {"Gracias. Te contactaremos con tu cotización para "}
                    {lookup(v, "segShortLower")}
                    {"."}
                  </p>
                  <button onClick={lookup(v, "reset")} style={{ "height": "48px", "padding": "0 22px", "borderRadius": "999px", "border": "2px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Enviar otra solicitud"}
                  </button>
                </div>
              </Fragment>
            )}
            {Boolean(lookup(v, "notSent")) && (
              <Fragment>
                <form style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "18px" }}>
                  <fieldset style={{ "gridColumn": "1 / -1", "border": "none", "margin": "0", "padding": "0" }}>
                    <legend style={{ "fontSize": "14px", "fontWeight": "500", "marginBottom": "10px" }}>
                      {"Tipo de negocio"}
                    </legend>
                    <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
                      {(lookup(v, "segChips") || []).map((c, index8) => (
                        <Fragment key={index8}>
                          <button type={"button"} onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "minHeight": "44px", "padding": "0 16px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(c, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "fontWeight": "500" }}>
                            {lookup(c, "name")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </fieldset>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"RUC o DNI"}
                    <input type={"text"} inputMode={"numeric"} placeholder={"20XXXXXXXXX"} style={{ "height": "48px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"Razón social o nombre del negocio"}
                    <input type={"text"} style={{ "height": "48px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"Nombre de contacto"}
                    <input type={"text"} style={{ "height": "48px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"Ciudad"}
                    <input type={"text"} placeholder={"Arequipa"} style={{ "height": "48px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"Correo"}
                    <input type={"email"} style={{ "height": "48px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                  </label>
                  <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"Teléfono / WhatsApp"}
                    <input type={"tel"} style={{ "height": "48px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px" }} />
                  </label>
                  <fieldset style={{ "gridColumn": "1 / -1", "border": "none", "margin": "0", "padding": "0" }}>
                    <legend style={{ "fontSize": "14px", "fontWeight": "500", "marginBottom": "10px" }}>
                      {"Compra estimada al mes"}
                    </legend>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fit, minmax(160px, 1fr))", "gap": "8px" }}>
                      {(lookup(v, "volumes") || []).map((v, index9) => (
                        <Fragment key={index9}>
                          <button type={"button"} onClick={lookup(v, "pick")} aria-pressed={lookup(v, "pressed")} style={{ "minHeight": "52px", "padding": "0 12px", "borderRadius": "14px", "border": lookup(v, "border"), "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "display": "flex", "flexDirection": "column", "alignItems": "center", "justifyContent": "center", "gap": "2px" }}>
                            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(v, "range")}
                            </span>
                            <span style={{ "fontSize": "12px" }}>
                              {lookup(v, "tier")}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset style={{ "gridColumn": "1 / -1", "border": "none", "margin": "0", "padding": "0" }}>
                    <legend style={{ "fontSize": "14px", "fontWeight": "500", "marginBottom": "10px" }}>
                      {"¿Qué categorías necesitas?"}
                    </legend>
                    <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
                      {(lookup(v, "cats") || []).map((c, index10) => (
                        <Fragment key={index10}>
                          <button type={"button"} onClick={lookup(c, "toggle")} aria-pressed={lookup(c, "pressed")} style={{ "minHeight": "44px", "padding": "0 16px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(c, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "fontWeight": "500" }}>
                            {lookup(c, "name")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </fieldset>
                  <label style={{ "gridColumn": "1 / -1", "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
                    {"Detalle del pedido (productos y cantidades aproximadas)"}
                    <textarea rows={"4"} style={{ "border": "1px solid #111111", "borderRadius": "10px", "padding": "12px 14px", "fontFamily": "inherit", "fontSize": "15px", "resize": "vertical" }}></textarea>
                  </label>
                  <label style={{ "gridColumn": "1 / -1", "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "14px" }}>
                    <input type={"checkbox"} style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                    {"Necesito factura electrónica"}
                  </label>
                  <label style={{ "gridColumn": "1 / -1", "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "14px" }}>
                    <input type={"checkbox"} style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                    {"Necesito entrega en mi local, obra, almacén o campamento"}
                  </label>
                  <button type={"button"} onClick={lookup(v, "send")} style={{ "gridColumn": "1 / -1", "height": "58px", "borderRadius": "999px", "border": "none", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700", "letterSpacing": "0.56px", "textTransform": "uppercase" }}>
                    {"Enviar solicitud"}
                  </button>
                </form>
              </Fragment>
            )}
          </div>
        </section>
        <section style={{ "padding": "24px 0 0", "textAlign": "center" }}>
          <h2 style={{ "margin": "0 0 24px", "fontFamily": "Archivo, sans-serif", "fontWeight": "800", "fontSize": "28px", "textTransform": "uppercase" }}>
            {"Negocios que confían en VIA"}
          </h2>
          <div style={{ "display": "flex", "justifyContent": "center", "flexWrap": "wrap", "gap": "24px" }}>
            <span style={{ "width": "150px", "height": "64px", "border": "2px dashed #111111", "borderRadius": "8px", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700" }}>
              {"[LOGO CLIENTE]"}
            </span>
            <span style={{ "width": "150px", "height": "64px", "border": "2px dashed #111111", "borderRadius": "8px", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700" }}>
              {"[LOGO CLIENTE]"}
            </span>
            <span style={{ "width": "150px", "height": "64px", "border": "2px dashed #111111", "borderRadius": "8px", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700" }}>
              {"[LOGO CLIENTE]"}
            </span>
            <span style={{ "width": "150px", "height": "64px", "border": "2px dashed #111111", "borderRadius": "8px", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700" }}>
              {"[LOGO CLIENTE]"}
            </span>
            <span style={{ "width": "150px", "height": "64px", "border": "2px dashed #111111", "borderRadius": "8px", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700" }}>
              {"[LOGO CLIENTE]"}
            </span>
          </div>
        </section>
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
