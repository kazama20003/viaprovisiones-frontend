"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(), tab: 'ofertas', filter: 'Todas', sel: 'O1', edits: {}, saved: '', copied: {}, cp: { code: 'VERANO15', kind: '%', value: 15, first: false }, extraCoupons: [], pack: 'K1', packPrice: {} };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const IMG = { lamp: B + 'a58999411e32d7481815ba8cdc175e97', solar: B + '972ceb606bfca75ef6208d8d3966c77d', foco: B + '52dc55c2523393f8f60ab89499fa3ec1', cable: B + '3aba2390d3fbd5f06fdd2cede507b16f', ext: B + '323e29809539c2fb4b229651c8081ee9', otro: B + '56a034356f25e7cd0fe7251db3cbbddc' };
    // estado: icono y color siempre juntos con su texto
    const ST = {
      Activa: ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      Programada: ['#E3F1FF', '#0B4A8A', 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18'],
      Pausada: ['#FFF4D6', '#7A4A00', 'M9 6v12M15 6v12'],
      Vencida: ['#EFEFEC', '#555555', 'M6 6l12 12M18 6L6 18'],
      Activo: ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      Vencido: ['#EFEFEC', '#555555', 'M6 6l12 12M18 6L6 18'],
      Agotado: ['#FDE4E2', '#8E1C14', 'M12 7v6M12 17h.01']
    };
    const OF = [
      { id: 'O1', name: 'Temporada camping −15%', type: 'Porcentaje', value: 15, scope: 'Categoría', cats: ['Camping'], lists: ['Público', 'Minorista'], from: '01 oct 2026', to: '15 nov 2026', state: 'Activa', uses: 86, limit: 0, sales: 3180, banner: true, img: IMG.lamp, prod: 'Lámpara de camping recargable', price: 89.9 },
      { id: 'O2', name: 'Focos LED 3x2', type: '3x2', value: 0, scope: 'Productos', cats: [], lists: ['Público'], from: '10 oct 2026', to: '31 oct 2026', state: 'Activa', uses: 54, limit: 200, sales: 1420, banner: false, img: IMG.foco, prod: 'Foco LED 9 W luz cálida', price: 8.9 },
      { id: 'O3', name: 'Mayorista: −8% desde 12 und', type: 'Porcentaje', value: 8, scope: 'Todo', cats: [], lists: ['Mayorista'], from: '01 ene 2026', to: 'Sin fecha de fin', state: 'Activa', uses: 37, limit: 0, sales: 1640, banner: false, img: IMG.ext, prod: 'Extensión de uso rudo 5 m', price: 45 },
      { id: 'O4', name: 'Envío gratis en Arequipa desde S/ 150', type: 'Envío gratis', value: 0, scope: 'Todo', cats: [], lists: ['Público', 'Minorista'], from: '01 nov 2026', to: '30 nov 2026', state: 'Programada', uses: 0, limit: 0, sales: 0, banner: true, img: IMG.cable, prod: 'Cable USB-C carga rápida 1 m', price: 19.9 },
      { id: 'O5', name: 'Cyber Solar −10%', type: 'Porcentaje', value: 10, scope: 'Categoría', cats: ['Solar'], lists: ['Público'], from: '15 jul 2026', to: '31 jul 2026', state: 'Vencida', uses: 21, limit: 50, sales: 2310, banner: false, img: IMG.solar, prod: 'Panel solar monocristalino 100 W', price: 389 }
    ];
    const NEW = { id: 'new', name: 'Nueva oferta', type: 'Porcentaje', value: 10, scope: 'Categoría', cats: ['Focos'], lists: ['Público'], from: '01 nov 2026', to: '30 nov 2026', state: 'Programada', uses: 0, limit: 0, sales: 0, banner: false, img: IMG.foco, prod: 'Foco LED 9 W luz cálida', price: 8.9 };
    const base = st.sel === 'new' ? NEW : (OF.find((o) => o.id === st.sel) || OF[0]);
    const ed = { ...base, ...(st.edits[base.id] || {}) };
    const edit = (patch) => this.setState({ edits: { ...st.edits, [base.id]: { ...(st.edits[base.id] || {}), ...patch } }, saved: '' });
    const stateOf = (o) => ({ ...o, ...(st.edits[o.id] || {}) }).state;
    const badgeOf = (o) => (o.type === 'Porcentaje' ? '−' + o.value + '%' : o.type === 'Monto fijo' ? '−S/' + o.value : o.type === 'Envío gratis' ? 'ENVÍO' : o.type);
    const shown = OF.filter((o) => st.filter === 'Todas' || stateOf(o) === st.filter.replace(/s$/, ''));
    const TYPES = [['Porcentaje', 'M19 5L5 19M7 7h.01M17 17h.01'], ['Monto fijo', 'M12 3v18M17 7H9.5a3 3 0 0 0 0 6h5a3 3 0 0 1 0 6H6'], ['3x2', 'M4 7h16v13H4zM9 7V4h6v3'], ['Envío gratis', 'M3 7h11v9H3zM14 10h4l3 3v3h-7']];
    const CATS = ['Focos', 'Cables', 'Extensiones', 'Llaveros', 'Ganchos', 'Camping', 'Bisutería', 'Solar'];
    const LISTS = ['Público', 'Minorista', 'Mayorista', 'Empresa'];
    // vista previa del precio
    let pvNew = money(ed.price), pvOld = '', pvBadge = badgeOf(ed), pvNote = '';
    if (ed.type === 'Porcentaje') { pvNew = money(ed.price * (1 - ed.value / 100)); pvOld = money(ed.price); pvNote = 'Ahorras ' + money(ed.price * ed.value / 100); }
    else if (ed.type === 'Monto fijo') { pvNew = money(Math.max(0, ed.price - ed.value)); pvOld = money(ed.price); pvNote = 'Ahorras ' + money(Math.min(ed.price, ed.value)); }
    else if (ed.type === '3x2') { pvNote = 'Llevas 3 y pagas 2 · ' + money(ed.price * 2) + ' por 3'; }
    else { pvNote = 'Envío gratis en Arequipa desde S/ 150'; }
    // el monto fijo nunca pasa del 70% del precio del producto de muestra
    const step = ed.type === 'Monto fijo' && ed.price >= 50 ? 5 : 1;
    const maxVal = ed.type === 'Porcentaje' ? 70 : Math.max(1, Math.floor(ed.price * 0.7));
    // cupones
    const CP = [
      { code: 'VIA5', value: '5% de descuento', rule: 'Compra mínima S/ 50', until: 'Vence 31 dic 2026', used: 64, limit: 200, state: 'Activo' },
      { code: 'BIENVENIDA10', value: '10% en la primera compra', rule: 'Compra mínima S/ 80', until: 'Sin vencimiento', used: 51, limit: 0, state: 'Activo' },
      { code: 'EMPRESA50', value: 'S/ 50 de descuento', rule: 'Compra mínima S/ 1,000 · lista Empresa', until: 'Vence 30 nov 2026', used: 12, limit: 30, state: 'Activo' },
      { code: 'CAMPING20', value: 'S/ 20 de descuento', rule: 'Compra mínima S/ 150 · Camping', until: 'Vence 15 nov 2026', used: 16, limit: 50, state: 'Activo' },
      { code: 'FERIA2025', value: '15% de descuento', rule: 'Feria de Arequipa', until: 'Venció 31 ago 2025', used: 100, limit: 100, state: 'Agotado' }
    ].concat(st.extraCoupons);
    const cp = st.cp;
    const cpValueText = cp.kind === '%' ? cp.value + '%' : 'S/ ' + cp.value;
    // packs
    const PK = [
      { id: 'K1', name: 'Kit camping', lines: [['Lámpara de camping recargable', 89.9, IMG.lamp], ['Linterna de cabeza LED', 39.9, IMG.otro], ['Panel solar portátil 20 W', 129, IMG.solar]], price: 219, cost: 168.4, sold: 18, stock: 12 },
      { id: 'K2', name: 'Kit instalación', lines: [['Extensión de uso rudo 5 m', 45, IMG.ext], ['3 focos LED 9 W', 26.7, IMG.foco], ['Cable USB-C carga rápida 1 m', 19.9, IMG.cable]], price: 79, cost: 55.2, sold: 34, stock: 57 },
      { id: 'K3', name: 'Kit regalo llavero', lines: [['2 llaveros linterna', 30, IMG.otro], ['Gancho multiuso', 8.9, IMG.ext], ['Cable USB-C 1 m', 19.9, IMG.cable]], price: 49, cost: 31.5, sold: 52, stock: 40 }
    ];
    const packPrice = (k) => (st.packPrice[k.id] != null ? st.packPrice[k.id] : k.price);
    const sumOf = (k) => k.lines.reduce((a, l) => a + l[1], 0);
    const pk = PK.find((k) => k.id === st.pack) || PK[0];
    const pkP = packPrice(pk);
    const active = OF.filter((o) => stateOf(o) === 'Activa').length;
    const sw = (on) => ({ track: on ? '#E8701F' : '#CFCFCB', justify: on ? 'flex-end' : 'flex-start' });
    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      newOffer: () => this.setState({ tab: 'ofertas', sel: 'new', saved: '' }),
      activeCount: String(active),
      headStats: [
        [String(active), 'Ofertas', 'activas', '#111111', '#FFFFFF'],
        ['1', 'Programada', 'para noviembre', '#FFFFFF', '#111111'],
        [String(CP.filter((c) => c.state === 'Activo').length), 'Cupones', 'activos', '#FFFFFF', '#111111'],
        ['3', 'Packs', 'a la venta', '#FF914C', '#111111']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      giveaway: [['Ofertas', 512, 'S/ 512'], ['Cupones', 241, 'S/ 241'], ['Packs', 59, 'S/ 59']].map((g) => ({ name: g[0], v: g[2], w: Math.round((g[1] / 512) * 100) + '%' })),
      weeks: [['S1', 28], ['S2', 31], ['S3', 46], ['S4', 38]].map((w, i) => ({ k: w[0], t: 'Semana ' + (i + 1) + ': ' + w[1] + ' cupones', h: Math.round((w[1] / 46) * 100) + '%', c: i === 2 ? '#E8701F' : '#F5C3A0' })),
      tabs: [['ofertas', 'Ofertas', OF.length], ['cupones', 'Cupones', CP.length], ['packs', 'Packs', PK.length]].map((t) => ({ label: t[1], n: String(t[2]), pressed: st.tab === t[0] ? 'true' : 'false', bg: st.tab === t[0] ? '#111111' : '#FFFFFF', fg: st.tab === t[0] ? '#FFFFFF' : '#111111', nBg: st.tab === t[0] ? '#E8701F' : '#F4F4F2', nFg: st.tab === t[0] ? '#FFFFFF' : '#111111', pick: () => this.setState({ tab: t[0] }) })),
      tabOfertas: st.tab === 'ofertas',
      tabCupones: st.tab === 'cupones',
      tabPacks: st.tab === 'packs',
      stateChips: ['Todas', 'Activas', 'Programadas', 'Vencidas'].map((c) => ({ label: c, bg: st.filter === c ? '#111111' : '#F4F4F2', fg: st.filter === c ? '#FFFFFF' : '#111111', pick: () => this.setState({ filter: c }) })),
      offers: shown.map((o0) => {
        const o = { ...o0, ...(st.edits[o0.id] || {}) };
        const s = ST[o.state];
        const on = st.sel === o.id;
        return {
          name: o.name, badge: badgeOf(o),
          scope: o.scope === 'Categoría' ? 'Categoría: ' + o.cats.join(', ') : o.scope === 'Productos' ? 'Producto: ' + o.prod : 'Toda la tienda · ' + o.lists.join(', '),
          dates: o.from + ' – ' + o.to,
          uses: o.limit ? o.uses + ' / ' + o.limit : String(o.uses), sales: o.sales ? money(o.sales) : '—',
          state: o.state, sBg: s[0], sFg: s[1], sIcon: s[2],
          bg: on ? '#FFF8F2' : '#FFFFFF', border: on ? '#E8701F' : '#F4F4F2',
          pick: () => this.setState({ sel: o.id, saved: '' })
        };
      }),
      edTitle: st.sel === 'new' ? 'Nueva oferta' : 'Editar oferta',
      edCode: st.sel === 'new' ? 'Borrador' : ed.state,
      edName: ed.name,
      setName: (e) => edit({ name: (e && e.target && e.target.value) || '' }),
      types: TYPES.map((t) => ({ label: t[0], icon: t[1], bg: ed.type === t[0] ? '#FFF1E6' : '#FFFFFF', border: ed.type === t[0] ? '#E8701F' : '#ECECE9', pick: () => edit({ type: t[0], value: t[0] === 'Monto fijo' ? (ed.price >= 50 ? 10 : 2) : t[0] === 'Porcentaje' ? 10 : 0 }) })),
      hasValue: ed.type === 'Porcentaje' || ed.type === 'Monto fijo',
      valueLabel: ed.type === 'Monto fijo' ? 'Monto de descuento' : 'Porcentaje de descuento',
      valueText: ed.type === 'Monto fijo' ? 'S/ ' + ed.value : ed.value + '%',
      valDown: () => edit({ value: Math.max(step, ed.value - step) }),
      valUp: () => edit({ value: Math.min(maxVal, ed.value + step) }),
      scopes: ['Todo', 'Categoría', 'Productos'].map((s) => ({ label: s === 'Todo' ? 'Toda la tienda' : s, bg: ed.scope === s ? '#111111' : '#F4F4F2', fg: ed.scope === s ? '#FFFFFF' : '#111111', pick: () => edit({ scope: s }) })),
      scopeCats: ed.scope === 'Categoría',
      scopeProducts: ed.scope === 'Productos',
      cats: CATS.map((c) => { const on = ed.cats.indexOf(c) !== -1; return { label: c, pressed: on ? 'true' : 'false', bg: on ? '#FFF1E6' : '#FFFFFF', fg: on ? '#8A3B0A' : '#111111', border: on ? '#E8701F' : '#DCDCD8', pick: () => edit({ cats: on ? ed.cats.filter((x) => x !== c) : ed.cats.concat([c]) }) }; }),
      prodImg: ed.img,
      prodName: ed.prod,
      lists: LISTS.map((l) => { const on = ed.lists.indexOf(l) !== -1; return { label: l, pressed: on ? 'true' : 'false', icon: on ? 'M5 12l5 5 9-10' : 'M12 5v14M5 12h14', bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', border: on ? '#111111' : '#DCDCD8', pick: () => edit({ lists: on ? ed.lists.filter((x) => x !== l) : ed.lists.concat([l]) }) }; }),
      edFrom: ed.from,
      edTo: ed.to,
      edLimit: ed.limit ? String(ed.limit) : 'Sin límite',
      limDown: () => edit({ limit: Math.max(0, ed.limit - 10) }),
      limUp: () => edit({ limit: ed.limit + 10 }),
      toggleBanner: () => edit({ banner: !ed.banner }),
      bannerChecked: ed.banner ? 'true' : 'false',
      bannerTrack: sw(ed.banner).track,
      bannerJustify: sw(ed.banner).justify,
      saveText: st.sel === 'new' ? 'Programar oferta' : 'Guardar cambios',
      saveOffer: () => this.setState({ saved: st.sel === 'new' ? '“' + ed.name + '” quedó programada del ' + ed.from + ' al ' + ed.to + '.' : 'Cambios guardados. La tienda ya muestra el nuevo precio.' }),
      pauseText: ed.state === 'Pausada' ? 'Reanudar' : 'Pausar',
      togglePause: () => edit({ state: ed.state === 'Pausada' ? 'Activa' : 'Pausada' }),
      savedMsg: st.saved,
      pvNew, pvOld, pvBadge, pvNote,
      coupons: CP.map((c) => {
        const s = ST[c.state];
        const done = !!st.copied[c.code];
        return {
          code: c.code, value: c.value, rule: c.rule, until: c.until,
          usesText: c.limit ? c.used + ' / ' + c.limit : c.used + ' · sin límite',
          w: c.limit ? Math.min(100, Math.round((c.used / c.limit) * 100)) + '%' : '35%',
          state: c.state, sBg: s[0], sFg: s[1], sIcon: s[2], o: c.state === 'Activo' ? '1' : '0.6',
          copyText: done ? 'Copiado' : 'Copiar', copyIcon: done ? 'M5 12l5 5 9-10' : 'M8 8h11v13H8zM5 16H4V3h11v1',
          copyBg: done ? '#E4F4E7' : '#111111', copyFg: done ? '#1B5E20' : '#FFFFFF',
          copy: () => this.setState({ copied: { ...st.copied, [c.code]: true } })
        };
      }),
      cpCode: cp.code,
      setCpCode: (e) => this.setState({ cp: { ...cp, code: ((e && e.target && e.target.value) || '').toUpperCase().replace(/\s/g, '') } }),
      cpKinds: [['%', 'Porcentaje'], ['S/', 'Monto fijo']].map((k) => ({ label: k[1], bg: cp.kind === k[0] ? '#FFF1E6' : '#FFFFFF', border: cp.kind === k[0] ? '#E8701F' : '#ECECE9', pick: () => this.setState({ cp: { ...cp, kind: k[0], value: k[0] === '%' ? 10 : 20 } }) })),
      cpValueText,
      cpDown: () => this.setState({ cp: { ...cp, value: Math.max(1, cp.value - (cp.kind === '%' ? 1 : 5)) } }),
      cpUp: () => this.setState({ cp: { ...cp, value: cp.value + (cp.kind === '%' ? 1 : 5) } }),
      toggleFirst: () => this.setState({ cp: { ...cp, first: !cp.first } }),
      firstChecked: cp.first ? 'true' : 'false',
      firstTrack: sw(cp.first).track,
      firstJustify: sw(cp.first).justify,
      createCoupon: () => { if (!cp.code) return; this.setState({ extraCoupons: [{ code: cp.code, value: cpValueText + ' de descuento', rule: 'Compra mínima S/ 100' + (cp.first ? ' · primera compra' : ''), until: 'Vence 31 dic 2026', used: 0, limit: 100, state: 'Activo' }].concat(st.extraCoupons), cp: { code: '', kind: '%', value: 10, first: false } }); },
      packs: PK.map((k) => { const p = packPrice(k); const s = sumOf(k); return { name: k.name, items: k.lines.map((l) => l[0]).join(' + '), price: money(p), sum: money(s), save: money(s - p), sold: String(k.sold), imgs: k.lines.map((l) => ({ src: l[2] })), border: k.id === pk.id ? '#E8701F' : '#FFFFFF', pick: () => this.setState({ pack: k.id }) }; }),
      pkName: pk.name,
      pkLines: pk.lines.map((l) => ({ name: l[0], price: money(l[1]), img: l[2] })),
      pkSum: money(sumOf(pk)),
      pkPrice: money(pkP),
      pkSave: money(sumOf(pk) - pkP),
      pkMargin: Math.round(((pkP - pk.cost) / pkP) * 100) + '%',
      pkStock: pk.stock + ' packs',
      pkDown: () => this.setState({ packPrice: { ...st.packPrice, [pk.id]: Math.max(Math.ceil(pk.cost), pkP - 1) } }),
      pkUp: () => this.setState({ packPrice: { ...st.packPrice, [pk.id]: Math.min(Math.floor(sumOf(pk)), pkP + 1) } })
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Ofertas(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.of-row:hover{background:#FAFAF8}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Ofertas"} onPin={lookup(v, "togglePin")} />
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
                <a href={"/dashboard"} aria-label={"Ir al panel"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-ofe"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-ofe)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </a>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Ofertas y cupones"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Descuentos de la tienda"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "newOffer")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Crear oferta"}
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
                <label style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                  <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                      <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                      <path d={"M16 16l4 4"}></path>
                    </svg>
                  </span>
                  <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                    {"Buscar oferta o cupón"}
                  </span>
                  <input type={"search"} placeholder={"Oferta o código…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Ofertas y cupones"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "activeCount")}
                    {" activas ahora"}
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
            </div>
            <div style={{ "padding": "0 20px 16px", "display": "flex", "gap": "16px", "flexWrap": "wrap" }}>
              <div style={{ "flex": "1 1 300px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Ventas con descuento · octubre"}
                </span>
                <span style={{ "fontSize": "40px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                  <span style={{ "color": "#FF914C" }}>
                    {"S/"}
                  </span>
                  {" 6,240"}
                </span>
                <span style={{ "height": "10px", "borderRadius": "999px", "background": "#2A2A2A", "display": "flex", "overflow": "hidden" }}>
                  <span style={{ "width": "34%", "background": "#FF914C" }}></span>
                </span>
                <span style={{ "fontSize": "13px", "color": "#CFCFCF" }}>
                  {"34% de lo vendido en el mes llevó alguna oferta o cupón. Ejemplo."}
                </span>
              </div>
              <div style={{ "flex": "1 1 240px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Descuento otorgado"}
                </span>
                <span style={{ "fontSize": "32px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                  {"S/ 812"}
                </span>
                {(lookup(v, "giveaway") || []).map((g, index2) => (
                  <Fragment key={index2}>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px" }}>
                        <span style={{ "color": "#6B6B6B" }}>
                          {lookup(g, "name")}
                        </span>
                        <span style={{ "fontWeight": "700" }}>
                          {lookup(g, "v")}
                        </span>
                      </span>
                      <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                        <span style={{ "display": "block", "width": lookup(g, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ "flex": "1 1 240px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                  {"Cupones usados"}
                </span>
                <span style={{ "fontSize": "32px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                  {"143 "}
                  <span style={{ "fontSize": "14px", "fontWeight": "600", "color": "#8C8C8C" }}>
                    {"este mes"}
                  </span>
                </span>
                <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "6px", "height": "64px" }}>
                  {(lookup(v, "weeks") || []).map((w, index3) => (
                    <Fragment key={index3}>
                      <span title={lookup(w, "t")} style={{ "flex": "1", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "4px", "height": "100%", "justifyContent": "flex-end" }}>
                        <span style={{ "width": "100%", "height": lookup(w, "h"), "borderRadius": "10px", "background": lookup(w, "c") }}></span>
                        <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                          {lookup(w, "k")}
                        </span>
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "gap": "14px", "alignItems": "center" }}>
                <img src={assetSrc("img/a58999411e32d7481815ba8cdc175e97")} alt={"Lámpara de camping recargable"} style={{ "width": "96px", "height": "96px", "borderRadius": "22px", "objectFit": "cover", "flex": "none" }} />
                <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "minWidth": "0" }}>
                  <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#8C8C8C" }}>
                    {"Oferta que más vende"}
                  </span>
                  <span style={{ "fontSize": "17px", "fontWeight": "700", "lineHeight": "1.2" }}>
                    {"Temporada camping −15%"}
                  </span>
                  <span style={{ "fontSize": "13px", "color": "#6B6B6B" }}>
                    {"86 usos · S/ 3,180 en ventas"}
                  </span>
                  <a href={"/tienda"} style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C", "textDecoration": "none" }}>
                    {"Ver en la tienda →"}
                  </a>
                </span>
              </div>
            </div>
            <div style={{ "padding": "0 20px 14px", "display": "flex", "gap": "8px", "flexWrap": "wrap" }}>
              {(lookup(v, "tabs") || []).map((t, index4) => (
                <Fragment key={index4}>
                  <button onClick={lookup(t, "pick")} aria-pressed={lookup(t, "pressed")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "48px", "padding": "0 8px 0 20px", "borderRadius": "999px", "border": "none", "background": lookup(t, "bg"), "color": lookup(t, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                    {lookup(t, "label")}
                    <span style={{ "minWidth": "32px", "height": "32px", "padding": "0 8px", "boxSizing": "border-box", "borderRadius": "999px", "background": lookup(t, "nBg"), "color": lookup(t, "nFg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "12px" }}>
                      {lookup(t, "n")}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              {Boolean(lookup(v, "tabOfertas")) && (
                <Fragment>
                  <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                    <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "10px", "flexWrap": "wrap", "paddingBottom": "8px" }}>
                      <span style={{ "fontSize": "17px", "fontWeight": "700" }}>
                        {"Ofertas"}
                      </span>
                      <span style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                        {(lookup(v, "stateChips") || []).map((c, index5) => (
                          <Fragment key={index5}>
                            <button onClick={lookup(c, "pick")} style={{ "height": "34px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                              {lookup(c, "label")}
                            </button>
                          </Fragment>
                        ))}
                      </span>
                    </div>
                    {(lookup(v, "offers") || []).map((o, index6) => (
                      <Fragment key={index6}>
                        <button onClick={lookup(o, "pick")} className={"of-row"} style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "12px", "borderRadius": "22px", "border": "2px solid " + String(lookup(o, "border") ?? ""), "background": lookup(o, "bg"), "cursor": "pointer", "fontFamily": "inherit", "color": "#111111", "textAlign": "left", "flexWrap": "wrap" }}>
                          <span style={{ "width": "56px", "height": "56px", "borderRadius": "18px", "background": "#FFF1E6", "color": "#C2410C", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "15px", "fontWeight": "800", "flex": "none" }}>
                            {lookup(o, "badge")}
                          </span>
                          <span style={{ "flex": "1 1 200px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                            <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                              {lookup(o, "name")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                              {lookup(o, "scope")}
                              {" · "}
                              {lookup(o, "dates")}
                            </span>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "minWidth": "90px" }}>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {"Usos"}
                            </span>
                            <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(o, "uses")}
                            </span>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "minWidth": "100px" }}>
                            <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                              {"Ventas generadas"}
                            </span>
                            <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(o, "sales")}
                            </span>
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "30px", "padding": "0 12px", "borderRadius": "999px", "background": lookup(o, "sBg"), "color": lookup(o, "sFg"), "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                            <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(o, "sIcon")}></path>
                            </svg>
                            {lookup(o, "state")}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "flex": "1 1 380px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                    <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                      <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "10px" }}>
                        <span style={{ "fontSize": "17px", "fontWeight": "700" }}>
                          {lookup(v, "edTitle")}
                        </span>
                        <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#8C8C8C" }}>
                          {lookup(v, "edCode")}
                        </span>
                      </div>
                      <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                        {"Nombre de la oferta"}
                        <input value={(lookup(v, "edName") ?? "")} onChange={lookup(v, "setName")} style={{ "height": "46px", "border": "1px solid #DCDCD8", "borderRadius": "14px", "padding": "0 14px", "fontFamily": "inherit", "fontSize": "15px", "fontWeight": "600", "color": "#111111" }} />
                      </label>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                          {"Tipo de descuento"}
                        </span>
                        <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "6px" }}>
                          {(lookup(v, "types") || []).map((t, index7) => (
                            <Fragment key={index7}>
                              <button onClick={lookup(t, "pick")} style={{ "display": "flex", "alignItems": "center", "gap": "8px", "height": "44px", "padding": "0 12px", "borderRadius": "14px", "border": "2px solid " + String(lookup(t, "border") ?? ""), "background": lookup(t, "bg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700", "color": "#111111" }}>
                                <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(t, "icon")}></path>
                                </svg>
                                {lookup(t, "label")}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      {Boolean(lookup(v, "hasValue")) && (
                        <Fragment>
                          <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "10px", "padding": "10px 10px 10px 16px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(v, "valueLabel")}
                            </span>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                              <button onClick={lookup(v, "valDown")} aria-label={"Bajar"} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                                {"−"}
                              </button>
                              <span style={{ "minWidth": "64px", "textAlign": "center", "fontSize": "20px", "fontWeight": "800" }}>
                                {lookup(v, "valueText")}
                              </span>
                              <button onClick={lookup(v, "valUp")} aria-label={"Subir"} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                                {"+"}
                              </button>
                            </span>
                          </div>
                        </Fragment>
                      )}
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                          {"Aplica a"}
                        </span>
                        <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                          {(lookup(v, "scopes") || []).map((s, index8) => (
                            <Fragment key={index8}>
                              <button onClick={lookup(s, "pick")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(s, "bg"), "color": lookup(s, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                                {lookup(s, "label")}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        {Boolean(lookup(v, "scopeCats")) && (
                          <Fragment>
                            <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                              {(lookup(v, "cats") || []).map((c, index9) => (
                                <Fragment key={index9}>
                                  <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid " + String(lookup(c, "border") ?? ""), "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "600" }}>
                                    {lookup(c, "label")}
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                          </Fragment>
                        )}
                        {Boolean(lookup(v, "scopeProducts")) && (
                          <Fragment>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "10px", "borderRadius": "16px", "border": "1px dashed #DCDCD8", "fontSize": "13px" }}>
                              <img src={assetSrc(lookup(v, "prodImg"))} alt={""} style={{ "width": "36px", "height": "36px", "borderRadius": "10px", "objectFit": "cover" }} />
                              {lookup(v, "prodName")}
                              <span style={{ "flex": "1" }}></span>
                              <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C" }}>
                                {"+ Agregar productos"}
                              </span>
                            </span>
                          </Fragment>
                        )}
                      </div>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                        <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                          {"Lista de precios"}
                        </span>
                        <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                          {(lookup(v, "lists") || []).map((l, index10) => (
                            <Fragment key={index10}>
                              <button onClick={lookup(l, "pick")} aria-pressed={lookup(l, "pressed")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid " + String(lookup(l, "border") ?? ""), "background": lookup(l, "bg"), "color": lookup(l, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                                <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"3"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(l, "icon")}></path>
                                </svg>
                                {lookup(l, "label")}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "10px 14px", "borderRadius": "14px", "border": "1px solid #DCDCD8" }}>
                          <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C" }}>
                            {"Desde"}
                          </span>
                          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                            {lookup(v, "edFrom")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "10px 14px", "borderRadius": "14px", "border": "1px solid #DCDCD8" }}>
                          <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C" }}>
                            {"Hasta"}
                          </span>
                          <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                            {lookup(v, "edTo")}
                          </span>
                        </span>
                      </div>
                      <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "gap": "10px" }}>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {"Límite de usos"}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {"0 = sin límite"}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                          <button onClick={lookup(v, "limDown")} aria-label={"Menos usos"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "16px", "fontWeight": "700" }}>
                            {"−"}
                          </button>
                          <span style={{ "minWidth": "48px", "textAlign": "center", "fontSize": "16px", "fontWeight": "800" }}>
                            {lookup(v, "edLimit")}
                          </span>
                          <button onClick={lookup(v, "limUp")} aria-label={"Más usos"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "16px", "fontWeight": "700" }}>
                            {"+"}
                          </button>
                        </span>
                      </div>
                      <button onClick={lookup(v, "toggleBanner")} role={"switch"} aria-checked={lookup(v, "bannerChecked")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "18px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left", "color": "#111111" }}>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {"Mostrar banner en la tienda"}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                            {"Se arma en "}
                            <a href={"/banners"} style={{ "color": "#C2410C", "fontWeight": "700" }}>
                              {"Banners de la tienda"}
                            </a>
                          </span>
                        </span>
                        <span style={{ "width": "48px", "height": "28px", "borderRadius": "999px", "background": lookup(v, "bannerTrack"), "display": "flex", "alignItems": "center", "padding": "3px", "boxSizing": "border-box", "justifyContent": lookup(v, "bannerJustify") }}>
                          <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                        </span>
                      </button>
                      <div style={{ "display": "flex", "gap": "8px" }}>
                        <button onClick={lookup(v, "saveOffer")} style={{ "flex": "1", "height": "48px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(v, "saveText")}
                        </button>
                        <button onClick={lookup(v, "togglePause")} style={{ "height": "48px", "padding": "0 18px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                          {lookup(v, "pauseText")}
                        </button>
                      </div>
                      {Boolean(lookup(v, "savedMsg")) && (
                        <Fragment>
                          <span role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "8px", "padding": "10px 14px", "borderRadius": "14px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "13px", "fontWeight": "600" }}>
                            <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={"M5 12l5 5 9-10"}></path>
                            </svg>
                            {lookup(v, "savedMsg")}
                          </span>
                        </Fragment>
                      )}
                    </div>
                    <div style={{ "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                      <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                        {"Así se verá en la tienda"}
                      </span>
                      <div style={{ "borderRadius": "22px", "background": "#FFFFFF", "color": "#111111", "padding": "12px", "display": "flex", "gap": "14px", "alignItems": "center" }}>
                        <span style={{ "position": "relative", "flex": "none" }}>
                          <img src={assetSrc(lookup(v, "prodImg"))} alt={lookup(v, "prodName")} style={{ "width": "104px", "height": "104px", "borderRadius": "16px", "objectFit": "cover", "display": "block" }} />
                          <span style={{ "position": "absolute", "top": "6px", "left": "6px", "padding": "4px 8px", "borderRadius": "999px", "background": "#FF914C", "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700" }}>
                            {lookup(v, "pvBadge")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "minWidth": "0" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "700", "lineHeight": "1.25" }}>
                            {lookup(v, "prodName")}
                          </span>
                          <span style={{ "display": "flex", "alignItems": "baseline", "gap": "8px", "flexWrap": "wrap" }}>
                            <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                              {lookup(v, "pvNew")}
                            </span>
                            {Boolean(lookup(v, "pvOld")) && (
                              <Fragment>
                                <span style={{ "fontSize": "13px", "color": "#8C8C8C", "textDecoration": "line-through" }}>
                                  {lookup(v, "pvOld")}
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#C2410C" }}>
                            {lookup(v, "pvNote")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
              {Boolean(lookup(v, "tabCupones")) && (
                <Fragment>
                  <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                    <span style={{ "fontSize": "17px", "fontWeight": "700", "paddingBottom": "6px" }}>
                      {"Cupones"}
                    </span>
                    {(lookup(v, "coupons") || []).map((c, index11) => (
                      <Fragment key={index11}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "padding": "12px", "borderRadius": "22px", "background": "#F4F4F2", "flexWrap": "wrap", "opacity": lookup(c, "o") }}>
                          <span style={{ "display": "flex", "alignItems": "center", "height": "44px", "padding": "0 16px", "borderRadius": "14px", "border": "2px dashed #E8701F", "background": "#FFFFFF", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "letterSpacing": "0.04em" }}>
                            {lookup(c, "code")}
                          </span>
                          <span style={{ "flex": "1 1 160px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "3px" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(c, "value")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                              {lookup(c, "rule")}
                              {" · "}
                              {lookup(c, "until")}
                            </span>
                          </span>
                          <span style={{ "flex": "0 1 160px", "display": "flex", "flexDirection": "column", "gap": "5px", "minWidth": "120px" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px" }}>
                              <span style={{ "color": "#6B6B6B" }}>
                                {"Usos"}
                              </span>
                              <span style={{ "fontWeight": "700" }}>
                                {lookup(c, "usesText")}
                              </span>
                            </span>
                            <span style={{ "height": "6px", "borderRadius": "999px", "background": "#FFFFFF" }}>
                              <span style={{ "display": "block", "width": lookup(c, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                            </span>
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "30px", "padding": "0 12px", "borderRadius": "999px", "background": lookup(c, "sBg"), "color": lookup(c, "sFg"), "fontSize": "12px", "fontWeight": "700" }}>
                            <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(c, "sIcon")}></path>
                            </svg>
                            {lookup(c, "state")}
                          </span>
                          <button onClick={lookup(c, "copy")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(c, "copyBg"), "color": lookup(c, "copyFg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                            <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(c, "copyIcon")}></path>
                            </svg>
                            {lookup(c, "copyText")}
                          </button>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "flex": "1 1 380px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                    <span style={{ "fontSize": "17px", "fontWeight": "700" }}>
                      {"Crear cupón"}
                    </span>
                    <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                      {"Código"}
                      <input value={(lookup(v, "cpCode") ?? "")} onChange={lookup(v, "setCpCode")} style={{ "height": "46px", "border": "1px solid #DCDCD8", "borderRadius": "14px", "padding": "0 14px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700", "color": "#111111", "textTransform": "uppercase" }} />
                    </label>
                    <div style={{ "display": "flex", "gap": "6px" }}>
                      {(lookup(v, "cpKinds") || []).map((k, index12) => (
                        <Fragment key={index12}>
                          <button onClick={lookup(k, "pick")} style={{ "flex": "1", "height": "42px", "borderRadius": "14px", "border": "2px solid " + String(lookup(k, "border") ?? ""), "background": lookup(k, "bg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(k, "label")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "10px 10px 10px 16px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {"Valor"}
                      </span>
                      <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                        <button onClick={lookup(v, "cpDown")} aria-label={"Bajar valor"} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                          {"−"}
                        </button>
                        <span style={{ "minWidth": "64px", "textAlign": "center", "fontSize": "20px", "fontWeight": "800" }}>
                          {lookup(v, "cpValueText")}
                        </span>
                        <button onClick={lookup(v, "cpUp")} aria-label={"Subir valor"} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                          {"+"}
                        </button>
                      </span>
                    </div>
                    <div style={{ "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "8px" }}>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "10px 14px", "borderRadius": "14px", "border": "1px solid #DCDCD8" }}>
                        <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C" }}>
                          {"Compra mínima"}
                        </span>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {"S/ 100"}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "10px 14px", "borderRadius": "14px", "border": "1px solid #DCDCD8" }}>
                        <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C" }}>
                          {"Vence"}
                        </span>
                        <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                          {"31 dic 2026"}
                        </span>
                      </span>
                    </div>
                    <button onClick={lookup(v, "toggleFirst")} role={"switch"} aria-checked={lookup(v, "firstChecked")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "18px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left", "color": "#111111" }}>
                      <span style={{ "flex": "1", "fontSize": "13px", "fontWeight": "700" }}>
                        {"Solo para la primera compra"}
                      </span>
                      <span style={{ "width": "48px", "height": "28px", "borderRadius": "999px", "background": lookup(v, "firstTrack"), "display": "flex", "alignItems": "center", "padding": "3px", "boxSizing": "border-box", "justifyContent": lookup(v, "firstJustify") }}>
                        <span style={{ "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                      </span>
                    </button>
                    <div style={{ "borderRadius": "22px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "alignItems": "center", "gap": "14px" }}>
                      <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#FF914C", "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "14px", "fontWeight": "800" }}>
                        {lookup(v, "cpValueText")}
                      </span>
                      <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                        <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                          {"Así lo recibe el cliente por WhatsApp"}
                        </span>
                        <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "18px", "fontWeight": "700", "letterSpacing": "0.04em" }}>
                          {lookup(v, "cpCode")}
                        </span>
                      </span>
                    </div>
                    <button onClick={lookup(v, "createCoupon")} style={{ "height": "48px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                      {"Crear cupón"}
                    </button>
                  </div>
                </Fragment>
              )}
              {Boolean(lookup(v, "tabPacks")) && (
                <Fragment>
                  <div style={{ "flex": "999 1 560px", "minWidth": "0", "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "12px" }}>
                    {(lookup(v, "packs") || []).map((k, index13) => (
                      <Fragment key={index13}>
                        <button onClick={lookup(k, "pick")} style={{ "borderRadius": "30px", "border": "2px solid " + String(lookup(k, "border") ?? ""), "background": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "12px", "cursor": "pointer", "fontFamily": "inherit", "color": "#111111", "textAlign": "left" }}>
                          <span style={{ "display": "flex" }}>
                            {(lookup(k, "imgs") || []).map((im, index14) => (
                              <Fragment key={index14}>
                                <img src={assetSrc(lookup(im, "src"))} alt={""} style={{ "width": "56px", "height": "56px", "borderRadius": "50%", "objectFit": "cover", "border": "3px solid #FFFFFF", "marginRight": "-14px" }} />
                              </Fragment>
                            ))}
                          </span>
                          <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                            {lookup(k, "name")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B", "lineHeight": "1.4" }}>
                            {lookup(k, "items")}
                          </span>
                          <span style={{ "display": "flex", "alignItems": "baseline", "gap": "8px" }}>
                            <span style={{ "fontSize": "22px", "fontWeight": "800" }}>
                              {lookup(k, "price")}
                            </span>
                            <span style={{ "fontSize": "13px", "color": "#8C8C8C", "textDecoration": "line-through" }}>
                              {lookup(k, "sum")}
                            </span>
                          </span>
                          <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px", "fontWeight": "700" }}>
                            <span style={{ "color": "#C2410C" }}>
                              {"Ahorra "}
                              {lookup(k, "save")}
                            </span>
                            <span style={{ "color": "#6B6B6B" }}>
                              {lookup(k, "sold")}
                              {" vendidos"}
                            </span>
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "flex": "1 1 380px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                    <span style={{ "fontSize": "17px", "fontWeight": "700" }}>
                      {lookup(v, "pkName")}
                    </span>
                    {(lookup(v, "pkLines") || []).map((l, index15) => (
                      <Fragment key={index15}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                          <img src={assetSrc(lookup(l, "img"))} alt={""} style={{ "width": "44px", "height": "44px", "borderRadius": "12px", "objectFit": "cover" }} />
                          <span style={{ "flex": "1", "fontSize": "13px", "fontWeight": "600" }}>
                            {lookup(l, "name")}
                          </span>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(l, "price")}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px", "color": "#6B6B6B" }}>
                      <span>
                        {"Suma por separado"}
                      </span>
                      <span>
                        {lookup(v, "pkSum")}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "padding": "10px 10px 10px 16px", "borderRadius": "18px", "background": "#111111", "color": "#FFFFFF" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                        {"Precio del pack"}
                      </span>
                      <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                        <button onClick={lookup(v, "pkDown")} aria-label={"Bajar precio"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#2A2A2A", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "16px", "fontWeight": "700" }}>
                          {"−"}
                        </button>
                        <span style={{ "minWidth": "90px", "textAlign": "center", "fontSize": "20px", "fontWeight": "800" }}>
                          {lookup(v, "pkPrice")}
                        </span>
                        <button onClick={lookup(v, "pkUp")} aria-label={"Subir precio"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#FF914C", "color": "#111111", "cursor": "pointer", "fontSize": "16px", "fontWeight": "700" }}>
                          {"+"}
                        </button>
                      </span>
                    </div>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "13px", "fontWeight": "700" }}>
                      <span style={{ "color": "#C2410C" }}>
                        {"El cliente ahorra "}
                        {lookup(v, "pkSave")}
                      </span>
                      <span>
                        {"Margen "}
                        {lookup(v, "pkMargin")}
                      </span>
                    </div>
                    <span style={{ "fontSize": "12px", "color": "#6B6B6B", "lineHeight": "1.45" }}>
                      {"Stock del pack: "}
                      {lookup(v, "pkStock")}
                      {" (lo limita el producto con menos unidades). Al venderlo, cada producto sale de su lote según el orden de salida."}
                    </span>
                    <a href={"/inventario"} style={{ "height": "44px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                      {"Ver lotes de estos productos"}
                    </a>
                  </div>
                </Fragment>
              )}
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Ofertas"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
