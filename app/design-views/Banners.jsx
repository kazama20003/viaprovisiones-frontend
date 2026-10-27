"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    const B = 'img/';
    this.state = {
      menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(),
      sel: 0, device: 'desk', dirty: false, published: false, newMsg: '', speed: 'Normal', barBg: 'Negro',
      slides: [
        { id: 's1', tab: 'Camping', img: B + '621ce65a45113393656af23955c4e044', title: 'Para la noche más larga', text: 'Linternas de cabeza, lámparas recargables y todo lo que necesitas para acampar con luz.', cta: 'Comprar camping', href: '#destacados', on: true, from: '01 oct 2026', to: 'Sin fecha', color: '#FFFFFF' },
        { id: 's2', tab: 'Solar', img: B + '1e3cbb6a8497f7e680445500f1240a3b', title: 'Energía que no se corta', text: 'Paneles, estaciones de energía y lámparas que se cargan con el sol.', cta: 'Comprar solar', href: '#solar', on: true, from: '01 oct 2026', to: 'Sin fecha', color: '#FFFFFF' },
        { id: 's3', tab: 'Focos', img: B + '0e200ae6333f48d1adeafc046ff925a6', title: 'Luz para cada cuarto', text: 'Focos LED, inteligentes y ahorradores para tu casa o tu negocio.', cta: 'Comprar focos', href: '#nuevos', on: true, from: '01 oct 2026', to: 'Sin fecha', color: '#FFFFFF' },
        { id: 's4', tab: 'Cables', img: B + '96c00ebc0862099877967a7af4e3ef8e', title: 'Siempre conectado', text: 'Cables USB, HDMI, de red y extensiones de uso rudo.', cta: 'Comprar cables', href: '#nuevos', on: true, from: '01 oct 2026', to: 'Sin fecha', color: '#FFFFFF' }
      ],
      msgs: ['Envío a todo el país', 'Entrega programada', 'Pago seguro', 'Atención por WhatsApp', 'Paneles solares y energía portátil', 'Ofertas de temporada'],
      cats: [['Focos', true], ['Cables', true], ['Extensiones', true], ['Solar', true], ['Camping', true], ['Llaveros', true], ['Ganchos', true], ['Bisutería', false]]
    };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const edit = (patch) => this.setState({ slides: st.slides.map((s, i) => (i === st.sel ? Object.assign({}, s, patch) : s)), dirty: true, published: false });
    const field = (k) => (e) => edit({ [k]: (e && e.target && e.target.value) || '' });
    const move = (arr, i, d) => { const j = i + d; if (j < 0 || j >= arr.length) return arr; const a = arr.slice(); const t = a[i]; a[i] = a[j]; a[j] = t; return a; };
    const cur = st.slides[st.sel] || st.slides[0];
    const IMGS = [
      ['621ce65a45113393656af23955c4e044', 'Sendero con linterna de noche'], ['1e3cbb6a8497f7e680445500f1240a3b', 'Paneles solares'],
      ['0e200ae6333f48d1adeafc046ff925a6', 'Foco encendido'], ['96c00ebc0862099877967a7af4e3ef8e', 'Cables de colores'],
      ['6bfeade76520c7a9cd478f997069e6ca', 'Carpa iluminada'], ['c475e40bec8fdd711d15f0e45dd911ee', 'Kit solar para casa'],
      ['21203a7db58c579a492fb8673b0da391', 'Focos en la sala'], ['270fef37ab257fc6383d3c904a7f2911', 'Kit de camping']
    ];
    const desk = st.device === 'desk';
    const activeSlides = st.slides.filter((s) => s.on);
    const CLK = { Camping: 412, Solar: 688, Focos: 356, Cables: 241 };
    const clickRows = st.slides.map((s) => [s.tab, CLK[s.tab] || 0]);
    const maxClk = Math.max(1, ...clickRows.map((r) => r[1]));
    const catOn = st.cats.filter((c) => c[1]).length;
    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },

      statusText: st.dirty ? 'Borrador · cambios sin publicar' : 'Publicado',
      statusIcon: st.dirty ? 'M12 7v6M12 17h.01' : 'M5 12l5 5 9-10',
      statusBg: st.dirty ? '#FFF4D6' : '#E4F4E7',
      statusFg: st.dirty ? '#7A4A00' : '#1B5E20',
      publish: () => this.setState({ dirty: false, published: true }),
      hideNotice: () => this.setState({ published: false }),
      published: st.published,
      activeCount: String(activeSlides.length),
      headStats: [
        [String(activeSlides.length), 'Portadas', 'activas', '#FFFFFF', '#111111'],
        [String(st.msgs.length), 'Mensajes', 'en la barra', '#FFFFFF', '#111111'],
        [String(catOn), 'Categorías', 'destacadas', '#FFFFFF', '#111111'],
        ['1.7k', 'Clics', '7 días · ejemplo', '#111111', '#FFFFFF']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),

      slides: st.slides.map((s, i) => {
        const on = i === st.sel;
        return {
          num: String(i + 1).padStart(2, '0'), tab: s.tab, title: s.title, img: s.img,
          cls: on ? '' : 'bn-row', bg: on ? '#111111' : '#F4F4F2', fg: on ? '#FFFFFF' : '#111111',
          numFg: on ? '#FF914C' : '#8C8C8C', subFg: on ? '#BDBDBD' : '#6B6B6B', imgO: s.on ? '1' : '0.4',
          stateText: s.on ? 'Activa · ' + s.from : 'Apagada', stateIcon: s.on ? 'M5 12l5 5 9-10' : 'M6 6l12 12M18 6L6 18',
          stateFg: s.on ? (on ? '#7FD68E' : '#1B5E20') : (on ? '#BDBDBD' : '#8C8C8C'),
          pick: () => this.setState({ sel: i }), pickLabel: 'Editar diapositiva ' + s.tab,
          btnBg: on ? '#2A2A2A' : '#FFFFFF',
          up: () => this.setState({ slides: move(st.slides, i, -1), sel: i > 0 ? i - 1 : i, dirty: true, published: false }),
          down: () => this.setState({ slides: move(st.slides, i, 1), sel: i < st.slides.length - 1 ? i + 1 : i, dirty: true, published: false }),
          upO: i === 0 ? '0.35' : '1', downO: i === st.slides.length - 1 ? '0.35' : '1',
          on: s.on ? 'true' : 'false', toggleLabel: (s.on ? 'Apagar ' : 'Encender ') + s.tab,
          toggle: () => this.setState({ slides: st.slides.map((x, k) => (k === i ? Object.assign({}, x, { on: !x.on }) : x)), dirty: true, published: false }),
          swBg: s.on ? '#E8701F' : '#CFCFCB', swJustify: s.on ? 'flex-end' : 'flex-start'
        };
      }),
      addSlide: () => this.setState({ slides: st.slides.concat([{ id: 's' + (st.slides.length + 1), tab: 'Nueva', img: B + '6bfeade76520c7a9cd478f997069e6ca', title: 'Nuevo título', text: 'Escribe aquí el texto de la portada.', cta: 'Ver productos', href: '/categoria', on: false, from: '[FECHA]', to: '[FECHA]', color: '#FFFFFF' }]), sel: st.slides.length, dirty: true, published: false }),

      ed: { num: String(st.sel + 1).padStart(2, '0'), tab: cur.tab, title: cur.title, text: cur.text, cta: cur.cta, href: cur.href, from: cur.from, to: cur.to, img: cur.img, color: cur.color, titleCount: String(cur.title.length) },
      setTitle: field('title'), setText: field('text'), setCta: field('cta'), setHref: field('href'), setFrom: field('from'), setTo: field('to'),
      images: IMGS.map((m) => ({ src: B + m[0], alt: 'Usar imagen: ' + m[1], on: cur.img === B + m[0] ? 'true' : 'false', ring: cur.img === B + m[0] ? '#E8701F' : 'transparent', pick: () => edit({ img: B + m[0] }) })),
      colors: [['Blanco', '#FFFFFF'], ['Negro', '#111111']].map((c) => ({ label: c[0], sw: c[1], on: cur.color === c[1] ? 'true' : 'false', ring: cur.color === c[1] ? '#111111' : '#E4E4E0', pick: () => edit({ color: c[1] }) })),
      devices: [['desk', 'Escritorio', 'M3 4h18v12H3zM8 20h8M12 16v4'], ['mob', 'Celular', 'M7 2h10v20H7zM11 18h2']].map((d) => ({ label: d[1], icon: d[2], on: st.device === d[0] ? 'true' : 'false', bg: st.device === d[0] ? '#111111' : 'transparent', fg: st.device === d[0] ? '#FFFFFF' : '#111111', pick: () => this.setState({ device: d[0] }) })),
      deviceName: desk ? 'escritorio' : 'celular',
      pv: desk
        ? { w: '100%', h: '320px', r: '20px', frame: 'none', pad: '24px', gap: '8px', kick: '11px', h1: '34px', p: '13px', btn: '34px' }
        : { w: '230px', h: '420px', r: '30px', frame: '6px solid #111111', pad: '16px', gap: '8px', kick: '10px', h1: '26px', p: '12px', btn: '32px' },
      pvTabs: st.slides.filter((s) => s.on).map((s) => ({ tab: s.tab, bg: s.tab === cur.tab ? '#FFFFFF' : 'rgba(255,255,255,0.18)', fg: s.tab === cur.tab ? '#111111' : '#FFFFFF' })),

      msgCount: String(st.msgs.length),
      msgs: st.msgs.map((m, i) => ({ text: m, removeLabel: 'Quitar mensaje ' + m, remove: () => this.setState({ msgs: st.msgs.filter((_, k) => k !== i), dirty: true, published: false }) })),
      newMsg: st.newMsg,
      setNewMsg: (e) => this.setState({ newMsg: (e && e.target && e.target.value) || '' }),
      addMsg: () => { const t = st.newMsg.trim(); if (!t) return; this.setState({ msgs: st.msgs.concat([t]), newMsg: '', dirty: true, published: false }); },
      barPv: st.barBg === 'Negro' ? { bg: '#111111', fg: '#FFFFFF', dot: '#FF914C' } : { bg: '#FF914C', fg: '#111111', dot: '#111111' },
      speeds: ['Lenta', 'Normal', 'Rápida'].map((v) => ({ label: v, on: st.speed === v ? 'true' : 'false', bg: st.speed === v ? '#111111' : '#F4F4F2', fg: st.speed === v ? '#FFFFFF' : '#111111', pick: () => this.setState({ speed: v, dirty: true, published: false }) })),
      barBgs: [['Negro', '#111111'], ['Naranja', '#FF914C']].map((v) => ({ label: v[0], sw: v[1], on: st.barBg === v[0] ? 'true' : 'false', ring: st.barBg === v[0] ? '#111111' : '#E4E4E0', pick: () => this.setState({ barBg: v[0], dirty: true, published: false }) })),

      catsOn: String(catOn),
      cats: st.cats.map((c, i) => ({
        n: String(i + 1), name: c[0], o: c[1] ? '1' : '0.5',
        up: () => this.setState({ cats: move(st.cats, i, -1), dirty: true, published: false }), upLabel: 'Subir ' + c[0],
        toggle: () => this.setState({ cats: st.cats.map((x, k) => (k === i ? [x[0], !x[1]] : x)), dirty: true, published: false }),
        toggleLabel: (c[1] ? 'Ocultar ' : 'Mostrar ') + c[0],
        eye: c[1] ? 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' : 'M3 3l18 18M10.6 6.1A9.7 9.7 0 0 1 12 6c6 0 10 6 10 6a17 17 0 0 1-3.2 3.7M6.6 6.6C3.8 8.4 2 12 2 12s4 7 10 7c1.7 0 3.2-.5 4.5-1.2'
      })),
      clicksTotal: clickRows.reduce((a, r) => a + r[1], 0).toLocaleString('es-PE'),
      clicks: clickRows.map((r) => ({ tab: r[0], v: String(r[1]), w: Math.max(3, Math.round((r[1] / maxClk) * 100)) + '%' }))
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Banners(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.bn-in{width:100%;box-sizing:border-box;border:1px solid #DCDCD8;border-radius:14px;background:#FFFFFF;padding:0 14px;height:46px;font-family:Manrope,sans-serif;font-size:14px;color:#111111;outline:none}\n.bn-in:focus{border-color:#111111}\n.bn-row:hover{background:#ECECE9}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Banners"} onPin={lookup(v, "togglePin")} />
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
                    <clipPath id={"via-clip-ban"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-ban)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Banners"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Portada y anuncios de la tienda"}
                  </span>
                </span>
                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "40px", "padding": "0 14px", "borderRadius": "999px", "background": lookup(v, "statusBg"), "color": lookup(v, "statusFg"), "fontSize": "13px", "fontWeight": "700" }}>
                  <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={lookup(v, "statusIcon")}></path>
                  </svg>
                  {lookup(v, "statusText")}
                </span>
                <span style={{ "flex": "1" }}></span>
                <DesignLink href={"/tienda"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "52px", "padding": "0 20px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3 12h18"}></path>
                  </svg>
                  {"Ver tienda"}
                </DesignLink>
                <button onClick={lookup(v, "publish")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 12l5 5 9-10"}></path>
                  </svg>
                  {"Publicar cambios"}
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Banners"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "activeCount")}
                    {" portadas activas"}
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
              {Boolean(lookup(v, "published")) && (
                <Fragment>
                  <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 18px", "borderRadius": "20px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "14px", "fontWeight": "600" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                    <span style={{ "flex": "1" }}>
                      {"Cambios publicados. La portada y la barra de anuncios ya se ven así en viaprovisiones.com."}
                    </span>
                    <button onClick={lookup(v, "hideNotice")} aria-label={"Cerrar aviso"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "transparent", "cursor": "pointer", "color": "inherit", "fontSize": "18px" }}>
                      {"×"}
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
              <div style={{ "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "stretch" }}>
                <div style={{ "flex": "1 1 360px", "maxWidth": "440px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <div style={{ "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "10px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Portada"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Pestañas del inicio, en este orden"}
                    </span>
                  </div>
                  {(lookup(v, "slides") || []).map((s, index2) => (
                    <Fragment key={index2}>
                      <div className={lookup(s, "cls")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px", "borderRadius": "22px", "background": lookup(s, "bg"), "color": lookup(s, "fg") }}>
                        <button onClick={lookup(s, "pick")} aria-label={lookup(s, "pickLabel")} style={{ "flex": "1", "minWidth": "0", "display": "flex", "alignItems": "center", "gap": "12px", "border": "none", "background": "transparent", "color": "inherit", "cursor": "pointer", "padding": "0", "textAlign": "left", "fontFamily": "inherit" }}>
                          <span style={{ "fontSize": "12px", "fontWeight": "800", "color": lookup(s, "numFg"), "width": "20px" }}>
                            {lookup(s, "num")}
                          </span>
                          <img src={assetSrc(lookup(s, "img"))} alt={""} style={{ "width": "72px", "height": "52px", "borderRadius": "14px", "objectFit": "cover", "flex": "none", "opacity": lookup(s, "imgO") }} />
                          <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(s, "tab")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": lookup(s, "subFg"), "whiteSpace": "nowrap", "overflow": "hidden", "textOverflow": "ellipsis" }}>
                              {lookup(s, "title")}
                            </span>
                            <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "fontSize": "11px", "fontWeight": "700", "color": lookup(s, "stateFg") }}>
                              <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(s, "stateIcon")}></path>
                              </svg>
                              {lookup(s, "stateText")}
                            </span>
                          </span>
                        </button>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                          <button onClick={lookup(s, "up")} aria-label={"Subir"} style={{ "width": "30px", "height": "26px", "borderRadius": "10px", "border": "none", "background": lookup(s, "btnBg"), "color": "inherit", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "opacity": lookup(s, "upO") }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M6 15l6-6 6 6"}></path>
                            </svg>
                          </button>
                          <button onClick={lookup(s, "down")} aria-label={"Bajar"} style={{ "width": "30px", "height": "26px", "borderRadius": "10px", "border": "none", "background": lookup(s, "btnBg"), "color": "inherit", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "opacity": lookup(s, "downO") }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M6 9l6 6 6-6"}></path>
                            </svg>
                          </button>
                        </span>
                        <button onClick={lookup(s, "toggle")} role={"switch"} aria-checked={lookup(s, "on")} aria-label={lookup(s, "toggleLabel")} style={{ "width": "46px", "height": "28px", "borderRadius": "999px", "border": "none", "background": lookup(s, "swBg"), "cursor": "pointer", "padding": "3px", "display": "flex", "justifyContent": lookup(s, "swJustify"), "flex": "none" }}>
                          <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                        </button>
                      </div>
                    </Fragment>
                  ))}
                  <button onClick={lookup(v, "addSlide")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "height": "48px", "borderRadius": "999px", "border": "1px dashed #BDBDBD", "background": "transparent", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "color": "#111111" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 5v14M5 12h14"}></path>
                    </svg>
                    {"Agregar diapositiva"}
                  </button>
                  <span style={{ "fontSize": "12px", "lineHeight": "1.5", "color": "#8C8C8C" }}>
                    {"La tienda rota las portadas activas cada 6 segundos. Las apagadas no se muestran pero se guardan."}
                  </span>
                </div>
                <div style={{ "flex": "999 1 640px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                  <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Editar diapositiva "}
                        {lookup(v, "ed.num")}
                      </span>
                      <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                        {"Pestaña “"}
                        {lookup(v, "ed.tab")}
                        {"” · los cambios se ven al instante en la vista previa"}
                      </span>
                    </span>
                    <span style={{ "display": "inline-flex", "padding": "4px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                      {(lookup(v, "devices") || []).map((d, index3) => (
                        <Fragment key={index3}>
                          <button onClick={lookup(d, "pick")} aria-pressed={lookup(d, "on")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(d, "bg"), "color": lookup(d, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(d, "icon")}></path>
                            </svg>
                            {lookup(d, "label")}
                          </button>
                        </Fragment>
                      ))}
                    </span>
                  </div>
                  <div style={{ "display": "flex", "gap": "20px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
                    <div style={{ "flex": "1 1 300px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                          {"Imagen"}
                        </span>
                        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(4, minmax(0, 1fr))", "gap": "8px" }}>
                          {(lookup(v, "images") || []).map((im, index4) => (
                            <Fragment key={index4}>
                              <button onClick={lookup(im, "pick")} aria-label={lookup(im, "alt")} aria-pressed={lookup(im, "on")} style={{ "padding": "0", "border": "3px solid " + String(lookup(im, "ring") ?? ""), "borderRadius": "14px", "background": "#F4F4F2", "cursor": "pointer", "overflow": "hidden", "height": "58px" }}>
                                <img src={assetSrc(lookup(im, "src"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                          {"Tamaño recomendado: 1920 × 900 px, foto horizontal."}
                        </span>
                      </div>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "700" }}>
                        {"Título"}
                        <input className={"bn-in"} value={(lookup(v, "ed.title") ?? "")} onChange={lookup(v, "setTitle")} maxLength={"40"} />
                        <span style={{ "fontSize": "11px", "fontWeight": "500", "color": "#8C8C8C" }}>
                          {lookup(v, "ed.titleCount")}
                          {" / 40 · se muestra en mayúsculas"}
                        </span>
                      </label>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "700" }}>
                        {"Texto"}
                        <textarea className={"bn-in"} value={(lookup(v, "ed.text") ?? "")} onChange={lookup(v, "setText")} rows={"3"} style={{ "height": "auto", "padding": "12px 14px", "resize": "vertical", "lineHeight": "1.45" }}></textarea>
                      </label>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px" }}>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "700" }}>
                          {"Texto del botón"}
                          <input className={"bn-in"} value={(lookup(v, "ed.cta") ?? "")} onChange={lookup(v, "setCta")} />
                        </label>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "700" }}>
                          {"Enlace"}
                          <input className={"bn-in"} value={(lookup(v, "ed.href") ?? "")} onChange={lookup(v, "setHref")} />
                        </label>
                      </div>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                          {"Color del texto"}
                        </span>
                        <span style={{ "display": "flex", "gap": "8px" }}>
                          {(lookup(v, "colors") || []).map((c, index5) => (
                            <Fragment key={index5}>
                              <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "on")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "40px", "padding": "0 14px 0 6px", "borderRadius": "999px", "border": "2px solid " + String(lookup(c, "ring") ?? ""), "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                                <span style={{ "width": "26px", "height": "26px", "borderRadius": "50%", "background": lookup(c, "sw"), "border": "1px solid #DCDCD8" }}></span>
                                {lookup(c, "label")}
                              </button>
                            </Fragment>
                          ))}
                        </span>
                      </div>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px" }}>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "700" }}>
                          {"Mostrar desde"}
                          <input className={"bn-in"} value={(lookup(v, "ed.from") ?? "")} onChange={lookup(v, "setFrom")} />
                        </label>
                        <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "13px", "fontWeight": "700" }}>
                          {"Hasta"}
                          <input className={"bn-in"} value={(lookup(v, "ed.to") ?? "")} onChange={lookup(v, "setTo")} />
                        </label>
                      </div>
                    </div>
                    <div style={{ "flex": "1 1 380px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "10px", "alignItems": "center" }}>
                      <span style={{ "alignSelf": "flex-start", "fontSize": "13px", "fontWeight": "700" }}>
                        {"Vista previa · "}
                        {lookup(v, "deviceName")}
                      </span>
                      <div style={{ "width": lookup(v, "pv.w"), "maxWidth": "100%", "height": lookup(v, "pv.h"), "borderRadius": lookup(v, "pv.r"), "overflow": "hidden", "position": "relative", "background": "#111111", "border": lookup(v, "pv.frame"), "boxSizing": "border-box" }}>
                        <img src={assetSrc(lookup(v, "ed.img"))} alt={""} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
                        <div style={{ "position": "absolute", "inset": "0", "background": "linear-gradient(180deg, rgba(17,17,17,0.15) 0%, rgba(17,17,17,0.72) 100%)" }}></div>
                        <div style={{ "position": "absolute", "left": "0", "right": "0", "bottom": "0", "padding": lookup(v, "pv.pad"), "display": "flex", "flexDirection": "column", "gap": lookup(v, "pv.gap"), "color": lookup(v, "ed.color") }}>
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": lookup(v, "pv.kick"), "fontWeight": "700", "color": lookup(v, "accent") }}>
                            {lookup(v, "ed.num")}
                            {" / "}
                            {lookup(v, "ed.tab")}
                          </span>
                          <span style={{ "fontFamily": "Archivo, sans-serif", "fontSize": lookup(v, "pv.h1"), "fontWeight": "900", "lineHeight": "0.95", "textTransform": "uppercase" }}>
                            {lookup(v, "ed.title")}
                          </span>
                          <span style={{ "fontFamily": "Roboto, sans-serif", "fontSize": lookup(v, "pv.p"), "lineHeight": "1.4", "maxWidth": "420px" }}>
                            {lookup(v, "ed.text")}
                          </span>
                          <span style={{ "alignSelf": "flex-start", "display": "inline-flex", "alignItems": "center", "height": lookup(v, "pv.btn"), "padding": "0 16px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": lookup(v, "pv.kick"), "fontWeight": "700", "textTransform": "uppercase" }}>
                            {lookup(v, "ed.cta")}
                            {" →"}
                          </span>
                          <span className={"noscroll"} style={{ "display": "flex", "gap": "6px", "marginTop": "6px", "overflowX": "auto" }}>
                            {(lookup(v, "pvTabs") || []).map((t, index6) => (
                              <Fragment key={index6}>
                                <span style={{ "flex": "none", "padding": "6px 10px", "borderRadius": "999px", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "fontFamily": "'Roboto Mono', monospace", "fontSize": "10px", "fontWeight": "700", "textTransform": "uppercase" }}>
                                  {lookup(t, "tab")}
                                </span>
                              </Fragment>
                            ))}
                          </span>
                        </div>
                      </div>
                      <span style={{ "alignSelf": "flex-start", "fontSize": "12px", "color": "#8C8C8C" }}>
                        {"Programada: "}
                        {lookup(v, "ed.from")}
                        {" → "}
                        {lookup(v, "ed.to")}
                        {". Enlace: "}
                        {lookup(v, "ed.href")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "stretch" }}>
                <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Barra de anuncios"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"La cinta que corre arriba de toda la tienda · "}
                      {lookup(v, "msgCount")}
                      {" mensajes"}
                    </span>
                  </div>
                  <div className={"noscroll"} style={{ "height": "48px", "borderRadius": "16px", "background": lookup(v, "barPv.bg"), "color": lookup(v, "barPv.fg"), "display": "flex", "alignItems": "center", "overflow": "hidden", "whiteSpace": "nowrap", "padding": "0 18px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "gap": "22px" }}>
                    {(lookup(v, "msgs") || []).map((m, index7) => (
                      <Fragment key={index7}>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "22px", "flex": "none" }}>
                          {lookup(m, "text")}
                          <span style={{ "color": lookup(v, "barPv.dot") }}>
                            {"✦"}
                          </span>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
                    {(lookup(v, "msgs") || []).map((m, index8) => (
                      <Fragment key={index8}>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "38px", "padding": "0 6px 0 14px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "13px", "fontWeight": "600" }}>
                          {lookup(m, "text")}
                          <button onClick={lookup(m, "remove")} aria-label={lookup(m, "removeLabel")} style={{ "width": "28px", "height": "28px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                              <path d={"M6 6l12 12M18 6L6 18"}></path>
                            </svg>
                          </button>
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
                    <label style={{ "flex": "1 1 260px", "display": "flex" }}>
                      <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                        {"Nuevo mensaje"}
                      </span>
                      <input className={"bn-in"} value={(lookup(v, "newMsg") ?? "")} onChange={lookup(v, "setNewMsg")} placeholder={"Ej.: 10% en focos este fin de semana"} maxLength={"48"} />
                    </label>
                    <button onClick={lookup(v, "addMsg")} style={{ "height": "46px", "padding": "0 20px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Agregar mensaje"}
                    </button>
                  </div>
                  <div style={{ "display": "flex", "gap": "22px", "flexWrap": "wrap", "alignItems": "center" }}>
                    <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {"Velocidad"}
                      </span>
                      {(lookup(v, "speeds") || []).map((v, index9) => (
                        <Fragment key={index9}>
                          <button onClick={lookup(v, "pick")} aria-pressed={lookup(v, "on")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(v, "bg"), "color": lookup(v, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(v, "label")}
                          </button>
                        </Fragment>
                      ))}
                    </span>
                    <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {"Fondo"}
                      </span>
                      {(lookup(v, "barBgs") || []).map((bb, index10) => (
                        <Fragment key={index10}>
                          <button onClick={lookup(bb, "pick")} aria-pressed={lookup(bb, "on")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "36px", "padding": "0 12px 0 6px", "borderRadius": "999px", "border": "2px solid " + String(lookup(bb, "ring") ?? ""), "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                            <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": lookup(bb, "sw") }}></span>
                            {lookup(bb, "label")}
                          </button>
                        </Fragment>
                      ))}
                    </span>
                  </div>
                </div>
                <div style={{ "flex": "1 1 320px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <div style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Categorías destacadas"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Orden de los bloques “Compra por categoría” · "}
                      {lookup(v, "catsOn")}
                      {" visibles"}
                    </span>
                  </div>
                  {(lookup(v, "cats") || []).map((ct, index11) => (
                    <Fragment key={index11}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "minHeight": "42px", "padding": "0 6px 0 12px", "borderRadius": "16px", "background": "#F4F4F2", "opacity": lookup(ct, "o") }}>
                        <span style={{ "fontSize": "12px", "fontWeight": "800", "color": "#8C8C8C", "width": "18px" }}>
                          {lookup(ct, "n")}
                        </span>
                        <span style={{ "flex": "1", "fontSize": "13px", "fontWeight": "700" }}>
                          {lookup(ct, "name")}
                        </span>
                        <button onClick={lookup(ct, "up")} aria-label={lookup(ct, "upLabel")} style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M6 15l6-6 6 6"}></path>
                          </svg>
                        </button>
                        <button onClick={lookup(ct, "toggle")} aria-label={lookup(ct, "toggleLabel")} style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(ct, "eye")}></path>
                          </svg>
                        </button>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Clics por portada"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                      {"Últimos 7 días · ejemplo"}
                    </span>
                  </div>
                  <span style={{ "fontSize": "40px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                    {lookup(v, "clicksTotal")}
                    <span style={{ "fontSize": "14px", "fontWeight": "600", "color": "#9A9A9A" }}>
                      {" clics al botón"}
                    </span>
                  </span>
                  {(lookup(v, "clicks") || []).map((k, index12) => (
                    <Fragment key={index12}>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px" }}>
                          <span style={{ "color": "#CFCFCF" }}>
                            {lookup(k, "tab")}
                          </span>
                          <span style={{ "fontWeight": "800" }}>
                            {lookup(k, "v")}
                          </span>
                        </span>
                        <span style={{ "height": "8px", "borderRadius": "999px", "background": "#2A2A2A" }}>
                          <span style={{ "display": "block", "width": lookup(k, "w"), "height": "100%", "borderRadius": "999px", "background": "#FF914C" }}></span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "marginTop": "auto", "fontSize": "12px", "lineHeight": "1.5", "color": "#BDBDBD" }}>
                    {"Solar lleva más clics: conviene ponerla primera durante la temporada de lluvias."}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Banners"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
