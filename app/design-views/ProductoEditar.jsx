"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";
import { opcionesCategoria, rutaCategoria } from '../categoria-jerarquia';
import { CodigoBarras, EscanerCodigo, QrProducto } from '../producto-codigos';

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    const p = props.productoActual;
    this.state = {
      menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(),
      id: p?.id || null, status: ({ publicado: 'Publicado', borrador: 'Borrador', oculto: 'Oculto' })[p?.estado] || 'Borrador', saved: false, saving: false, error: '',
      name: p?.nombre || '', sku: p?.sku || '', marca: p?.marca || '', codigoBarras: p?.codigoBarras || '',
      desc: p?.descripcion || '',
      prices: { pub: p?.precios?.['Público'] ?? p?.precio ?? 0, min: p?.precios?.Minorista ?? 0, may: p?.precios?.Mayorista ?? 0, emp: p?.precios?.Empresa ?? 0 },
      uploading: false, uploadError: '', uploadMessage: '', scanning: false, colors: p?.datosAdicionales?.colores || [], caps: p?.datosAdicionales?.capacidades || [],
      categoria: p?.categoriaId || '', tags: p?.datosAdicionales?.etiquetas || [], tagInput: '',
      peso: p?.datosAdicionales?.peso || '', medidas: p?.datosAdicionales?.medidas || '', garantia: p?.datosAdicionales?.garantia || 'Sin garantía', tipoEnvio: p?.datosAdicionales?.tipoEnvio || 'Paquete pequeño',
      visible: p?.visibleEnTienda ?? false, featured: p?.destacado ?? false, delivery: p?.permiteDelivery ?? true, agency: p?.permiteAgencia ?? true, pickup: p?.permiteRecojo ?? true, minStock: p?.stockMinimo ?? 0
    };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const soles = (n) => 'S/ ' + Number(n || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const LOTS = (this.props.productoActual?.lotes || []).filter(l => l.estado === 'disponible').map(l => [l.codigo, l.existencias.reduce((n,x) => n + x.cantidadFisica - x.cantidadReservada, 0), l.costoUnitario, new Date(l.fechaIngreso).toLocaleDateString('es-PE'), l.existencias.map(x => x.almacen.nombre).join(', ')]);
    const units = LOTS.reduce((a, l) => a + l[1], 0);
    const cost = units ? LOTS.reduce((a, l) => a + l[1] * l[2], 0) / units : 0;
    const OK = 'M5 12l5 5 9-10', WARN = 'M12 7v6M12 17h.01', BAD = 'M6 6l12 12M18 6L6 18';
    const TIERS = [['pub', 'Público', 'Tienda web y mostrador', '1 unidad'], ['min', 'Minorista', 'Bodegas y tiendas', 'Desde 6 u.'], ['may', 'Mayorista', 'Distribuidores', 'Desde 24 u.'], ['emp', 'Empresa', 'Minería, constructoras', 'Desde 50 u.']];
    const archivos = this.props.productoActual?.archivos || [];
    const imagenes = archivos.filter(a => a.tipo === 'imagen');
    const videos = archivos.filter(a => a.tipo === 'video');
    const principal = imagenes.find(a => a.principal) || imagenes[0];
    const COLORS = ['Negro', 'Verde', 'Naranja'], CAPS = ['2000 mAh', '4000 mAh', '6000 mAh'];
    const toggleIn = (key, v) => () => { const a = st[key]; const has = a.indexOf(v) !== -1; this.setState({ [key]: has ? a.filter((x) => x !== v) : a.concat([v]), saved: false }); };
    const SW = (label, sub, key) => ({ label, sub, on: st[key] ? 'true' : 'false', track: st[key] ? '#E8701F' : '#CFCFCB', knob: st[key] ? '21px' : '3px', toggle: () => this.setState({ [key]: !st[key] }) });
    const STS = { Publicado: ['#E4F4E7', '#1B5E20', OK], Borrador: ['#FFF4D6', '#7A4A00', 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4'], Oculto: ['#EFEFEC', '#444444', 'M3 3l18 18M10.6 6.1A10 10 0 0 1 22 12s-1.2 2.2-3.4 4.1M6.6 6.6C3.8 8.3 2 12 2 12s4 7 10 7c1.6 0 3-.4 4.3-1'] };
    const sstock = units <= st.minStock ? ['Stock bajo', '#7A4A00', WARN] : ['Disponible', '#1B5E20', OK];
    const pub = st.prices.pub;
    const vcount = st.colors.length * st.caps.length;
    const todasCategorias = this.props.categorias || [];
    const categorias = opcionesCategoria(todasCategorias).filter(c => c.activa || c.id === st.categoria).map(c => ({ ...c, ruta: rutaCategoria(todasCategorias, c.id) }));
    const categoriaNombre = categorias.find(c => c.id === st.categoria)?.ruta || this.props.productoActual?.categoria || 'Sin categoría';
    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      name: st.name,
      sku: st.sku, marca: st.marca, codigoBarras: st.codigoBarras,
      marcas: (this.props.marcas || []).filter(m => m.activa || m.nombre === st.marca), marcasEstado: this.props.marcasEstado,
      scanning: st.scanning, abrirEscaner: () => this.setState({ scanning: true }), cerrarEscaner: () => this.setState({ scanning: false }), codigoDetectado: (value) => this.setState({ codigoBarras: value, scanning: false, saved: false }),
      productoId: st.id, productoPublicado: this.props.productoActual?.estado === 'publicado', productoVisible: !!this.props.productoActual?.visibleEnTienda,
      codigoGuardado: this.props.productoActual?.codigoBarras || '',
      setSku: (e) => this.setState({ sku: e.target.value, saved: false }),
      setMarca: (e) => this.setState({ marca: e.target.value, saved: false }),
      setCodigoBarras: (e) => this.setState({ codigoBarras: e.target.value, saved: false }),
      setName: (e) => this.setState({ name: (e && e.target && e.target.value) || '', saved: false }),
      desc: st.desc,
      setDesc: (e) => this.setState({ desc: (e && e.target && e.target.value) || '', saved: false }),
      descCount: st.desc.length + ' / 600',
      descFg: st.desc.length > 560 ? '#C2410C' : '#8C8C8C',
      headline: categoriaNombre + ' · ' + soles(pub) + ' público',
      categoria: st.categoria, categoriaNombre, categorias, categoriaEstado: this.props.estado, categoriaError: this.props.error,
      peso: st.peso, medidas: st.medidas, garantia: st.garantia, tipoEnvio: st.tipoEnvio, tagInput: st.tagInput, units: String(units),
      setCategoria: e => this.setState({ categoria: e.target.value, saved: false }), setPeso: e => this.setState({ peso: e.target.value, saved: false }), setMedidas: e => this.setState({ medidas: e.target.value, saved: false }), setGarantia: e => this.setState({ garantia: e.target.value, saved: false }), setTipoEnvio: e => this.setState({ tipoEnvio: e.target.value, saved: false }), setTagInput: e => this.setState({ tagInput: e.target.value }),
      addTag: () => { const tag = this.state.tagInput.trim(); if (tag && !this.state.tags.includes(tag) && this.state.tags.length < 20) this.setState({ tags: [...this.state.tags, tag], tagInput: '', saved: false }); },
      headStats: [
        [String(units), 'Unidades', 'en ' + LOTS.length + ' lotes', '#FFFFFF', '#111111'],
        [(pub ? Math.round(((pub - cost) / pub) * 100) : 0) + '%', 'Margen', 'precio público', '#FFFFFF', '#111111'],
        ['—', 'Vendidas', 'últimos 90 días', '#FFFFFF', '#111111'],
        [String(vcount), 'Variantes', 'activas', '#111111', '#FFFFFF']
      ].map((h) => ({ v: h[0], k1: h[1], k2: h[2], bg: h[3], fg: h[4] })),
      statuses: ['Publicado', 'Borrador', 'Oculto'].map((s) => ({ label: s, icon: STS[s][2], checked: st.status === s ? 'true' : 'false', bg: st.status === s ? STS[s][0] : 'transparent', fg: st.status === s ? STS[s][1] : '#6B6B6B', pick: () => this.setState({ status: s, saved: false }) })),
      statusName: st.status,
      previewTagBg: STS[st.status][0], previewTagFg: STS[st.status][1],
      previewO: st.status === 'Publicado' ? '1' : '0.6',
      saved: st.saved,
      error: st.error, saving: st.saving, dismiss: () => this.setState({ saved: false }),
      save: async () => {
        if (this.state.saving) return;
        if (!st.name.trim() || !st.sku.trim()) { this.setState({ error: 'Completa el nombre y el código SKU.' }); return; }
        if (this.props.estado !== 'success' || this.props.marcasEstado !== 'success') { this.setState({ error: 'Espera a que se carguen las categorías y marcas o reintenta la conexión.' }); return; }
        this.setState({ saving: true, error: '', saved: false });
        try {
          const result = await this.props.onGuardarProducto(st.id, { nombre: st.name, sku: st.sku, marca: st.marca, codigoBarras: st.codigoBarras, descripcion: st.desc, estado: ({ Publicado: 'publicado', Borrador: 'borrador', Oculto: 'oculto' })[st.status], categoriaId: st.categoria || null, datosAdicionales: { peso: st.peso, medidas: st.medidas, garantia: st.garantia, tipoEnvio: st.tipoEnvio, etiquetas: st.tags, colores: st.colors, capacidades: st.caps }, visibleEnTienda: st.visible, destacado: st.featured, permiteDelivery: st.delivery, permiteAgencia: st.agency, permiteRecojo: st.pickup, stockMinimo: st.minStock, precios: st.prices });
          this.setState({ id: result.datos.id, saving: false, saved: true });
        } catch (error) { this.setState({ saving: false, error: error.message || 'No se pudo guardar el producto.' }); }
      },
      mainImg: principal?.url || '',
      photos: imagenes.map((p, i) => ({ src: p.url, n: String(i + 1), aria: 'Usar foto ' + (i + 1) + ' como principal', pressed: p.principal ? 'true' : 'false', ring: p.principal ? '#E8701F' : 'transparent', pick: async () => { try { await this.props.onImagenPrincipal(st.id, p.id); this.setState({ uploadError: '', uploadMessage: 'Foto principal actualizada.' }); } catch (error) { this.setState({ uploadError: error.message || 'No se pudo actualizar la foto.' }); } } })),
      videos, uploading: st.uploading, uploadError: st.uploadError, uploadMessage: st.uploadMessage,
      onArchivos: async e => {
        const files = Array.from(e.target.files || []); e.target.value = '';
        if (!files.length) return;
        if (!st.id) { this.setState({ uploadError: 'Primero guarda el producto para poder subir archivos.', uploadMessage: '' }); return; }
        this.setState({ uploading: true, uploadError: '', uploadMessage: '' });
        let subidos = 0;
        try {
          for (const file of files) { await this.props.onSubirArchivo(st.id, file); subidos++; }
          this.setState({ uploading: false, uploadMessage: `${subidos} archivo(s) guardado(s).` });
        } catch (error) { this.setState({ uploading: false, uploadError: `${subidos ? subidos + ' archivo(s) guardado(s). ' : ''}${error.message || 'No se pudo subir el archivo.'}` }); }
      },
      costText: soles(cost),
      floorText: soles(cost),
      tiers: TIERS.map((t) => {
        const v = st.prices[t[0]] || 0;
        const m = v > 0 ? (v - cost) / v : -1;
        const s = m < 0 ? ['Pierdes', '#FDE4E2', '#8E1C14', BAD] : m < 0.25 ? ['Margen bajo', '#FFF4D6', '#7A4A00', WARN] : ['Bien', '#E4F4E7', '#1B5E20', OK];
        return {
          name: t[1], who: t[2], minQty: t[3], aria: 'Precio ' + t[1], val: String(v),
          change: (e) => { const n = parseFloat((e && e.target && e.target.value) || '0'); this.setState({ prices: Object.assign({}, st.prices, { [t[0]]: isNaN(n) ? 0 : n }), saved: false }); },
          margin: m < 0 ? '−' + Math.round(-m * 100) + '%' : Math.round(m * 100) + '%',
          w: Math.max(0, Math.min(100, Math.round(m * 200))) + '%',
          sLabel: s[0], sBg: s[1], sFg: s[2], sIcon: s[3]
        };
      }),
      pubText: soles(pub),
      wholesaleText: 'Mayorista desde ' + soles(st.prices.may) + ' · 24 u.',
      options: [['Color', 'colors', COLORS], ['Capacidad', 'caps', CAPS]].map((o) => ({
        name: o[0],
        values: o[2].map((v) => { const on = st[o[1]].indexOf(v) !== -1; return { label: v, pressed: on ? 'true' : 'false', aria: (on ? 'Quitar ' : 'Agregar ') + v, bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', border: on ? '#111111' : '#DCDCD8', icon: on ? 'M5 12l5 5 9-10' : 'M12 5v14M5 12h14', toggle: toggleIn(o[1], v) }; })
      })),
      variantCount: vcount + (vcount === 1 ? ' variante' : ' variantes') + ' · toca para agregar o quitar',
      variants: st.colors.reduce((acc, c) => acc.concat(st.caps.map((k) => {
        const existente = (this.props.productoActual?.variantes || []).find(v => v.atributos?.color === c && v.atributos?.capacidad === k);
        const stock = existente?.stock || 0;
        return {
          name: c + ' · ' + k,
          sku: existente?.sku || 'Se asigna al guardar',
          price: soles(pub),
          stock: stock ? stock + ' u.' : 'Sin stock',
          fg: stock ? (stock < 5 ? '#7A4A00' : '#1B5E20') : '#8E1C14',
          icon: stock ? (stock < 5 ? WARN : OK) : BAD
        };
      })), []),
      ship: [SW('Recojo en tienda', 'Dean Valdivia 533', 'pickup'), SW('Delivery Arequipa', 'Motorizado', 'delivery'), SW('Agencia a provincias', 'Cusco, Puno, Moquegua…', 'agency')],
      tags: st.tags.map(t => ({ label: t, remove: () => this.setState({ tags: this.state.tags.filter(x => x !== t), saved: false }) })),
      orgToggles: [SW('Visible en la tienda', 'Aparece en catálogo y búsqueda', 'visible'), SW('Destacado', 'Sale en la portada y en ofertas', 'featured')],
      featured: st.featured,
      minStock: String(st.minStock),
      minDown: () => this.setState({ minStock: Math.max(0, st.minStock - 1) }),
      minUp: () => this.setState({ minStock: st.minStock + 1 }),
      stockState: sstock[0], stockFg: sstock[1], stockIcon: sstock[2],
      lots: LOTS.map((l, i) => ({
        n: String(i + 1), code: l[0], left: l[1] + ' u.', sub: 'Ingresó ' + l[3] + ' · ' + soles(l[2]) + ' c/u · ' + l[4],
        nBg: i === 0 ? '#E8701F' : '#FFFFFF', nFg: i === 0 ? '#FFFFFF' : '#111111',
        tag: i === 0 ? 'Se vende primero' : 'Después', tagFg: i === 0 ? '#8A3B0A' : '#6B6B6B', tagIcon: i === 0 ? 'M12 5v14M5 12l7 7 7-7' : 'M12 7v5l3 2'
      })),
      history: (this.props.productoActual?.historial || []).map(h => ({ what: h.accion, when: new Date(h.creadoEn).toLocaleString('es-PE'), dot: '#E8701F' }))
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function ProductoEditar(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.pe-in{height:46px;border:1px solid #E4E4E0;border-radius:14px;padding:0 14px;background:#FFFFFF;font-family:inherit;font-size:14px;color:#111111;box-sizing:border-box;width:100%;outline:none}\n.pe-in:focus{border-color:#111111}\n.pe-lab{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:700;color:#444444;min-width:0}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          <div>
            <div style={{ "padding": "28px 32px 26px", "display": "flex", "flexDirection": "column", "gap": "24px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "flexWrap": "wrap" }}>
                <button onClick={lookup(v, "menuBtn")} aria-label={lookup(v, "menuBtnLabel")} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M4 8h16M4 16h10"}></path>
                  </svg>
                </button>
                <DesignLink href={"/dashboard"} aria-label={"Ir al panel"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-pe"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-pe)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <nav aria-label={"Ruta"} style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    <DesignLink href={"/inventario"} style={{ "textDecoration": "none", "color": "#8C8C8C" }}>
                      {"Inventario y lotes"}
                    </DesignLink>
                    <span style={{ "color": "#BDBDBD" }}>
                      {"›"}
                    </span>
                    {" "}
                    {lookup(v, "name")}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {lookup(v, "sku") ? "Producto · " + lookup(v, "sku") : "Nuevo producto"}
                  </span>
                </nav>
                <span style={{ "flex": "1" }}></span>
                <div role={"radiogroup"} aria-label={"Estado del producto"} style={{ "display": "flex", "gap": "4px", "padding": "4px", "borderRadius": "999px", "background": "#FFFFFF" }}>
                  {(lookup(v, "statuses") || []).map((s, index1) => (
                    <Fragment key={index1}>
                      <button role={"radio"} aria-checked={lookup(s, "checked")} onClick={lookup(s, "pick")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "44px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(s, "bg"), "color": lookup(s, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                        <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(s, "icon")}></path>
                        </svg>
                        {lookup(s, "label")}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <DesignLink href={lookup(v, 'productoId') ? `/producto?id=${encodeURIComponent(lookup(v, 'productoId'))}` : '/producto'} style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "52px", "padding": "0 20px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"}></path>
                  </svg>
                  {"Ver en la tienda"}
                </DesignLink>
                <button disabled={lookup(v, "saving")} onClick={lookup(v, "save")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 24px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M5 12l5 5 9-10"}></path>
                  </svg>
                  {"Guardar"}
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {lookup(v, "name")}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "headline")}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                {(lookup(v, "headStats") || []).map((h, index2) => (
                  <Fragment key={index2}>
                    <span style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                      <span style={{ "minWidth": "76px", "height": "76px", "padding": "0 14px", "boxSizing": "border-box", "borderRadius": "999px", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "18px", "fontWeight": "700", "background": lookup(h, "bg"), "color": lookup(h, "fg") }}>
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
              {Boolean(lookup(v, "saved")) && (
                <Fragment>
                  <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 18px", "borderRadius": "20px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "14px", "fontWeight": "600" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M5 12l5 5 9-10"}></path>
                    </svg>
                    <span style={{ "flex": "1" }}>
                      {"Cambios guardados. Estado: "}
                      {lookup(v, "statusName")}
                      {". La tienda muestra los precios nuevos en unos segundos."}
                    </span>
                    <button onClick={lookup(v, "dismiss")} aria-label={"Cerrar aviso"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "transparent", "cursor": "pointer", "color": "inherit", "fontSize": "18px" }}>
                      {"×"}
                    </button>
                  </div>
                </Fragment>
              )}
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 640px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                {lookup(v, "error") && <p role="alert">{lookup(v, "error")}</p>}
                <section style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <span style={{ "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Información"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Lo que ve el cliente en la ficha"}
                    </span>
                  </span>
                  <label className={"pe-lab"}>
                    {"Nombre del producto"}
                    <input className={"pe-in"} value={(lookup(v, "name") ?? "")} onChange={lookup(v, "setName")} maxLength={"80"} />
                  </label>
                  <label className={"pe-lab"}>
                    <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                      <span>
                        {"Descripción"}
                      </span>
                      <span style={{ "fontWeight": "600", "color": lookup(v, "descFg") }}>
                        {lookup(v, "descCount")}
                      </span>
                    </span>
                    <textarea onChange={lookup(v, "setDesc")} rows={"4"} maxLength={"600"} style={{ "border": "1px solid #E4E4E0", "borderRadius": "14px", "padding": "12px 14px", "fontFamily": "inherit", "fontSize": "14px", "lineHeight": "1.5", "resize": "vertical", "outline": "none", "color": "#111111" }} value={lookup(v, "desc")}></textarea>
                  </label>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "12px" }}>
                    <label className={"pe-lab"}>
                      {"Marca"}
                      <select className={"pe-in"} value={lookup(v, "marca")} onChange={lookup(v, "setMarca")} disabled={lookup(v, 'marcasEstado') !== 'success'}><option value="">Sin marca</option>{(lookup(v, 'marcas') || []).map(m => <option key={m.id} value={m.nombre}>{m.nombre}{m.activa ? '' : ' (inactiva)'}</option>)}</select><DesignLink href="/marcas" style={{ fontSize:12,color:'#c2410c',fontWeight:700 }}>Administrar marcas ›</DesignLink>
                    </label>
                    <label className={"pe-lab"}>
                      {"Código / SKU"}
                      <input className={"pe-in"} value={lookup(v, "sku")} onChange={lookup(v, "setSku")} style={{ "fontVariantNumeric": "tabular-nums" }} />
                    </label>
                    <label className={"pe-lab"}>
                      {"Código de barras"}
                      <span style={{ "display": "flex", "gap": "6px" }}>
                        <input className={"pe-in"} value={lookup(v, "codigoBarras")} onChange={lookup(v, "setCodigoBarras")} />
                        <button type="button" onClick={lookup(v, 'abrirEscaner')} aria-label={"Escanear código"} style={{ "width": "46px", "height": "46px", "flex": "none", "borderRadius": "14px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} aria-hidden={"true"}>
                            <path d={"M4 7V4h3M17 4h3v3M20 17v3h-3M7 20H4v-3M8 8v8M11 8v8M14 8v8M17 8v8"}></path>
                          </svg>
                        </button>
                      </span>
                    </label>
                  </div>
                  {lookup(v, 'marcasEstado') === 'error' && <p role="alert" style={{ margin:0,color:'#8e1c14',fontSize:12 }}>{props.marcasError || 'No se pudieron cargar las marcas.'} <button type="button" onClick={props.reintentarMarcas}>Reintentar</button></p>}
                  {truthy(lookup(v, 'scanning')) && <EscanerCodigo onDetectar={lookup(v, 'codigoDetectado')} onCerrar={lookup(v, 'cerrarEscaner')} />}
                </section>
                <QrProducto id={lookup(v, 'productoId')} publicado={lookup(v, 'productoPublicado')} visible={lookup(v, 'productoVisible')} />
                <CodigoBarras valor={lookup(v, 'codigoGuardado')} />
                <section style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <span style={{ "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Fotos y videos"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Toca una foto para hacerla principal"}
                    </span>
                  </span>
                  <div style={{ "display": "flex", "gap": "14px", "flexWrap": "wrap" }}>
                    <div style={{ "flex": "1 1 320px", "position": "relative", "borderRadius": "24px", "overflow": "hidden", "background": "#F4F4F2", "aspectRatio": "4 / 3", "minWidth": "0" }}>
                      {lookup(v, "mainImg") ? <img src={assetSrc(lookup(v, "mainImg"))} alt={lookup(v, "name")} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} /> : <span style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#8C8C8C' }}>Sin foto principal</span>}
                      <span style={{ "position": "absolute", "top": "14px", "left": "14px", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "30px", "padding": "0 12px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "fontSize": "12px", "fontWeight": "700" }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"#E8701F"} stroke={"#E8701F"} strokeWidth={"2"} aria-hidden={"true"}>
                          <path d={"M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"}></path>
                        </svg>
                        {"Foto principal"}
                      </span>
                    </div>
                    <div style={{ "flex": "1 1 260px", "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "10px", "alignContent": "start" }}>
                      {(lookup(v, "photos") || []).map((p, index3) => (
                        <Fragment key={index3}>
                          <button onClick={lookup(p, "pick")} aria-label={lookup(p, "aria")} aria-pressed={lookup(p, "pressed")} style={{ "position": "relative", "padding": "0", "border": "3px solid " + String(lookup(p, "ring") ?? ""), "borderRadius": "20px", "overflow": "hidden", "background": "#F4F4F2", "cursor": "grab", "aspectRatio": "1 / 1" }}>
                            <img src={assetSrc(lookup(p, "src"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />
                            <span style={{ "position": "absolute", "bottom": "8px", "left": "8px", "width": "24px", "height": "24px", "borderRadius": "50%", "background": "rgba(255,255,255,0.92)", "fontSize": "12px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                              {lookup(p, "n")}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                      <label style={{ "gridColumn": "span 2", "border": "2px dashed #DCDCD8", "borderRadius": "20px", "padding": "16px", "display": "flex", "alignItems": "center", "gap": "12px", "cursor": "pointer" }}>
                        <input type="file" accept="image/jpeg,image/png,image/webp,video/mp4,video/webm" multiple disabled={lookup(v, "uploading")} onChange={lookup(v, "onArchivos")} style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }} />
                        <span style={{ "width": "42px", "height": "42px", "borderRadius": "50%", "background": "#FFF1E6", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#C2410C"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={"M12 16V4M7 9l5-5 5 5M4 20h16"}></path>
                          </svg>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(v, "uploading") ? "Subiendo archivos…" : "Subir fotos o videos"}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {"JPG, PNG, WebP · MP4 o WebM · hasta 8 fotos y 3 videos"}
                          </span>
                        </span>
                      </label>
                      {lookup(v, "uploadError") && <p role="alert" style={{ gridColumn: 'span 2', color: '#8E1C14', margin: 0 }}>{lookup(v, "uploadError")}</p>}
                      {lookup(v, "uploadMessage") && <p role="status" style={{ gridColumn: 'span 2', color: '#1B5E20', margin: 0 }}>{lookup(v, "uploadMessage")}</p>}
                    </div>
                  </div>
                  {(lookup(v, "videos") || []).map(video => <video key={video.id} controls preload="metadata" src={assetSrc(video.url)} style={{ width: '100%', maxHeight: 320, borderRadius: 20, background: '#111111' }} />)}
                </section>
                <section style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <span style={{ "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Precios por lista"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"El margen se calcula con el costo promedio de los lotes con stock"}
                    </span>
                  </span>
                  <div style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap" }}>
                    <div style={{ "flex": "1 1 220px", "borderRadius": "22px", "background": "#111111", "color": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                        {"Costo promedio de lotes"}
                      </span>
                      <span style={{ "fontSize": "30px", "fontWeight": "800", "letterSpacing": "-0.01em" }}>
                        {lookup(v, "costText")}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                        {"Solo lectura · se actualiza al ingresar lotes"}
                      </span>
                    </div>
                    <div style={{ "flex": "2 1 320px", "borderRadius": "22px", "background": "#FFF1E6", "color": "#8A3B0A", "padding": "18px", "display": "flex", "gap": "12px", "alignItems": "flex-start" }}>
                      <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} style={{ "flex": "none", "marginTop": "2px" }}>
                        <path d={"M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 8v5M12 16h.01"}></path>
                      </svg>
                      <span style={{ "fontSize": "13px", "lineHeight": "1.5" }}>
                        <strong>
                          {"Precio mínimo sin perder: "}
                          {lookup(v, "floorText")}
                          {"."}
                        </strong>
                        {" Por debajo de ese precio vendes a pérdida. Te avisamos si una lista deja menos de 25 % de margen."}
                      </span>
                    </div>
                  </div>
                  <div style={{ "overflowX": "auto" }} className={"noscroll"}>
                    <table style={{ "width": "100%", "minWidth": "620px", "borderCollapse": "collapse", "fontSize": "13px" }}>
                      <thead>
                        <tr style={{ "textAlign": "left", "color": "#8C8C8C", "fontSize": "12px" }}>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"Lista"}
                          </th>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"Precio (S/)"}
                          </th>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"Compra mínima"}
                          </th>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"Margen"}
                          </th>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"Estado"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(lookup(v, "tiers") || []).map((t, index4) => (
                          <Fragment key={index4}>
                            <tr style={{ "borderTop": "1px solid #EFEFEC" }}>
                              <td style={{ "padding": "12px 10px" }}>
                                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                                  <span style={{ "fontWeight": "700" }}>
                                    {lookup(t, "name")}
                                  </span>
                                  <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                                    {lookup(t, "who")}
                                  </span>
                                </span>
                              </td>
                              <td style={{ "padding": "12px 10px" }}>
                                <input type={"number"} step={"0.10"} min={"0"} aria-label={lookup(t, "aria")} value={(lookup(t, "val") ?? "")} onChange={lookup(t, "change")} className={"pe-in"} style={{ "width": "120px", "fontWeight": "700", "fontVariantNumeric": "tabular-nums" }} />
                              </td>
                              <td style={{ "padding": "12px 10px", "fontWeight": "600" }}>
                                {lookup(t, "minQty")}
                              </td>
                              <td style={{ "padding": "12px 10px", "minWidth": "160px" }}>
                                <span style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                                  <span style={{ "flex": "1", "height": "8px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                                    <span style={{ "display": "block", "width": lookup(t, "w"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                                  </span>
                                  <span style={{ "fontWeight": "800", "fontVariantNumeric": "tabular-nums", "width": "48px", "textAlign": "right" }}>
                                    {lookup(t, "margin")}
                                  </span>
                                </span>
                              </td>
                              <td style={{ "padding": "12px 10px" }}>
                                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(t, "sBg"), "color": lookup(t, "sFg"), "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                    <path d={lookup(t, "sIcon")}></path>
                                  </svg>
                                  {lookup(t, "sLabel")}
                                </span>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <span style={{ "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "12px" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Variantes"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {lookup(v, "variantCount")}
                    </span>
                  </span>
                  {(lookup(v, "options") || []).map((o, index5) => (
                    <Fragment key={index5}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                        <span style={{ "width": "90px", "fontSize": "13px", "fontWeight": "700" }}>
                          {lookup(o, "name")}
                        </span>
                        {(lookup(o, "values") || []).map((v, index6) => (
                          <Fragment key={index6}>
                            <button onClick={lookup(v, "toggle")} aria-pressed={lookup(v, "pressed")} aria-label={lookup(v, "aria")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "38px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(v, "border") ?? ""), "background": lookup(v, "bg"), "color": lookup(v, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                              <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} aria-hidden={"true"}>
                                <path d={lookup(v, "icon")}></path>
                              </svg>
                              {lookup(v, "label")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </Fragment>
                  ))}
                  <div style={{ "overflowX": "auto" }} className={"noscroll"}>
                    <table style={{ "width": "100%", "minWidth": "560px", "borderCollapse": "collapse", "fontSize": "13px" }}>
                      <thead>
                        <tr style={{ "textAlign": "left", "color": "#8C8C8C", "fontSize": "12px" }}>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"Variante"}
                          </th>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"SKU"}
                          </th>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"Precio público"}
                          </th>
                          <th style={{ "padding": "8px 10px", "fontWeight": "600" }}>
                            {"Stock"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(lookup(v, "variants") || []).map((r, index7) => (
                          <Fragment key={index7}>
                            <tr style={{ "borderTop": "1px solid #EFEFEC" }}>
                              <td style={{ "padding": "12px 10px", "fontWeight": "700" }}>
                                {lookup(r, "name")}
                              </td>
                              <td style={{ "padding": "12px 10px", "color": "#6B6B6B", "fontVariantNumeric": "tabular-nums" }}>
                                {lookup(r, "sku")}
                              </td>
                              <td style={{ "padding": "12px 10px", "fontWeight": "700", "fontVariantNumeric": "tabular-nums" }}>
                                {lookup(r, "price")}
                              </td>
                              <td style={{ "padding": "12px 10px" }}>
                                <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "fontWeight": "700", "color": lookup(r, "fg") }}>
                                  <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                    <path d={lookup(r, "icon")}></path>
                                  </svg>
                                  {lookup(r, "stock")}
                                </span>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
                <section style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "24px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                    {"Envío y garantía"}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(4, minmax(0, 1fr))", "gap": "12px" }}>
                    <label className={"pe-lab"}>
                      {"Peso (kg)"}
                      <input className={"pe-in"} type="number" min="0" step="0.001" value={lookup(v, "peso")} onChange={lookup(v, "setPeso")} />
                    </label>
                    <label className={"pe-lab"}>
                      {"Medidas (cm)"}
                      <input className={"pe-in"} value={lookup(v, "medidas")} onChange={lookup(v, "setMedidas")} placeholder="Ej.: 12 × 12 × 22" />
                    </label>
                    <label className={"pe-lab"}>
                      {"Garantía"}
                      <select className={"pe-in"} value={lookup(v, "garantia")} onChange={lookup(v, "setGarantia")}>
                        <option>
                          {"6 meses"}
                        </option>
                        <option>
                          {"3 meses"}
                        </option>
                        <option>
                          {"12 meses"}
                        </option>
                        <option>
                          {"Sin garantía"}
                        </option>
                      </select>
                    </label>
                    <label className={"pe-lab"}>
                      {"Tipo de envío"}
                      <select className={"pe-in"} value={lookup(v, "tipoEnvio")} onChange={lookup(v, "setTipoEnvio")}>
                        <option>
                          {"Paquete pequeño"}
                        </option>
                        <option>
                          {"Paquete mediano"}
                        </option>
                        <option>
                          {"Carga"}
                        </option>
                      </select>
                    </label>
                  </div>
                  <div style={{ "display": "flex", "gap": "10px", "flexWrap": "wrap" }}>
                    {(lookup(v, "ship") || []).map((s, index8) => (
                      <Fragment key={index8}>
                        <button onClick={lookup(s, "toggle")} role={"switch"} aria-checked={lookup(s, "on")} style={{ "flex": "1 1 200px", "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "20px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left" }}>
                          <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700", "color": "#111111" }}>
                              {lookup(s, "label")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                              {lookup(s, "sub")}
                            </span>
                          </span>
                          <span style={{ "width": "46px", "height": "28px", "borderRadius": "999px", "background": lookup(s, "track"), "position": "relative", "flex": "none" }}>
                            <span style={{ "position": "absolute", "top": "3px", "left": lookup(s, "knob"), "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </section>
              </div>
              <div style={{ "flex": "1 1 340px", "maxWidth": "420px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <section style={{ "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Vista previa en la tienda"}
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(v, "previewTagBg"), "color": lookup(v, "previewTagFg"), "fontSize": "11px", "fontWeight": "700" }}>
                      {lookup(v, "statusName")}
                    </span>
                  </span>
                  <div style={{ "borderRadius": "22px", "background": "#FFFFFF", "color": "#111111", "overflow": "hidden", "opacity": lookup(v, "previewO") }}>
                    <div style={{ "position": "relative", "aspectRatio": "4 / 3", "background": "#F4F4F2" }}>
                      {lookup(v, "mainImg") && <img src={assetSrc(lookup(v, "mainImg"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />}
                      {Boolean(lookup(v, "featured")) && (
                        <Fragment>
                          <span style={{ "position": "absolute", "top": "10px", "left": "10px", "height": "26px", "padding": "0 10px", "borderRadius": "999px", "background": "#FF914C", "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "display": "flex", "alignItems": "center", "textTransform": "uppercase" }}>
                            {"Destacado"}
                          </span>
                        </Fragment>
                      )}
                    </div>
                    <div style={{ "padding": "14px 16px 16px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                        {lookup(v, "categoriaNombre")}
                      </span>
                      <span style={{ "fontSize": "15px", "fontWeight": "700", "lineHeight": "1.3" }}>
                        {lookup(v, "name")}
                      </span>
                      <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                        {lookup(v, "pubText")}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#C2410C", "fontWeight": "700" }}>
                        {lookup(v, "wholesaleText")}
                      </span>
                    </div>
                  </div>
                  <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                    {"Así se ve en el catálogo y en la búsqueda."}
                  </span>
                </section>
                <section style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Organización"}
                  </span>
                  <label className={"pe-lab"}>
                    {"Categoría"}
                    <select className={"pe-in"} value={lookup(v, "categoria")} onChange={lookup(v, "setCategoria")} disabled={lookup(v, "categoriaEstado") !== 'success'}>
                      <option value="">Sin categoría</option>
                      {(lookup(v, "categorias") || []).map(c => <option key={c.id} value={c.id}>{c.ruta}{c.activa ? '' : ' (inactiva)'}</option>)}
                    </select>
                  </label>
                  {lookup(v, "categoriaEstado") === 'error' && <p role="alert" style={{ margin: 0, color: '#8E1C14', fontSize: 12 }}>{lookup(v, "categoriaError") || 'No se pudieron cargar las categorías.'} <button type="button" onClick={props.reintentar}>Reintentar</button></p>}
                  <DesignLink href="/categorias" style={{ fontSize: 12, fontWeight: 700, color: '#C2410C', textDecoration: 'none' }}>Administrar categorías ›</DesignLink>
                  <div className={"pe-lab"}>
                    {"Etiquetas"}
                    <span style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "tags") || []).map((t, index9) => (
                        <Fragment key={index9}>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "32px", "padding": "0 12px", "borderRadius": "999px", "background": "#F4F4F2", "fontSize": "12px", "fontWeight": "700", "color": "#111111" }}>
                            {lookup(t, "label")}
                            <button type="button" onClick={lookup(t, "remove")} aria-label={'Quitar etiqueta ' + lookup(t, "label")} style={{ border: 0, background: 'transparent', cursor: 'pointer', fontSize: 15 }}>×</button>
                          </span>
                        </Fragment>
                      ))}
                      <input aria-label="Nueva etiqueta" value={lookup(v, "tagInput")} onChange={lookup(v, "setTagInput")} maxLength={50} className="pe-in" style={{ width: 130, height: 32 }} />
                      <button type="button" onClick={lookup(v, "addTag")} style={{ "display": "inline-flex", "alignItems": "center", "height": "32px", "padding": "0 12px", "borderRadius": "999px", "border": "1px dashed #BDBDBD", "background": "transparent", "cursor": "pointer", "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                        {"+ Agregar"}
                      </button>
                    </span>
                  </div>
                  {(lookup(v, "orgToggles") || []).map((s, index10) => (
                    <Fragment key={index10}>
                      <button onClick={lookup(s, "toggle")} role={"switch"} aria-checked={lookup(s, "on")} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 14px", "borderRadius": "20px", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left" }}>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700", "color": "#111111" }}>
                            {lookup(s, "label")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {lookup(s, "sub")}
                          </span>
                        </span>
                        <span style={{ "width": "46px", "height": "28px", "borderRadius": "999px", "background": lookup(s, "track"), "position": "relative", "flex": "none" }}>
                          <span style={{ "position": "absolute", "top": "3px", "left": lookup(s, "knob"), "width": "22px", "height": "22px", "borderRadius": "50%", "background": "#FFFFFF" }}></span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </section>
                <section style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Inventario"}
                    </span>
                    <DesignLink href={"/inventario"} style={{ "fontSize": "12px", "fontWeight": "700", "color": "#C2410C", "textDecoration": "none" }}>
                      {"Ver lotes ›"}
                    </DesignLink>
                  </span>
                  <div style={{ "display": "flex", "gap": "10px" }}>
                    <div style={{ "flex": "1", "borderRadius": "20px", "background": "#F4F4F2", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Stock total"}
                      </span>
                      <span style={{ "fontSize": "26px", "fontWeight": "800" }}>
                        {lookup(v, "units")}
                      </span>
                      <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "fontSize": "12px", "fontWeight": "700", "color": lookup(v, "stockFg") }}>
                        <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={lookup(v, "stockIcon")}></path>
                        </svg>
                        {lookup(v, "stockState")}
                      </span>
                    </div>
                    <div style={{ "flex": "1", "borderRadius": "20px", "background": "#F4F4F2", "padding": "14px", "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Stock mínimo"}
                      </span>
                      <span style={{ "display": "flex", "alignItems": "center", "gap": "6px" }}>
                        <button onClick={lookup(v, "minDown")} aria-label={"Bajar stock mínimo"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                          {"−"}
                        </button>
                        <span style={{ "fontSize": "22px", "fontWeight": "800", "minWidth": "34px", "textAlign": "center" }}>
                          {lookup(v, "minStock")}
                        </span>
                        <button onClick={lookup(v, "minUp")} aria-label={"Subir stock mínimo"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                          {"+"}
                        </button>
                      </span>
                    </div>
                  </div>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "13px" }}>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"}></path>
                    </svg>
                    {"Ubicación: "}
                    <strong>
                      {"Consulta los lotes para ver la ubicación"}
                    </strong>
                  </span>
                  <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#8C8C8C" }}>
                    {"Lotes · orden de salida (el más antiguo primero)"}
                  </span>
                  {(lookup(v, "lots") || []).map((l, index11) => (
                    <Fragment key={index11}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                        <span style={{ "width": "30px", "height": "30px", "borderRadius": "50%", "background": lookup(l, "nBg"), "color": lookup(l, "nFg"), "fontSize": "13px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          {lookup(l, "n")}
                        </span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.3", "minWidth": "0" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(l, "code")}
                            {" · "}
                            {lookup(l, "left")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                            {lookup(l, "sub")}
                          </span>
                        </span>
                        <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "5px", "fontSize": "11px", "fontWeight": "700", "color": lookup(l, "tagFg"), "whiteSpace": "nowrap" }}>
                          <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(l, "tagIcon")}></path>
                          </svg>
                          {lookup(l, "tag")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <DesignLink href={"/inventario"} style={{ "height": "44px", "borderRadius": "999px", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "8px", "textDecoration": "none", "fontSize": "13px", "fontWeight": "700" }}>
                    <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M12 5v14M5 12h14"}></path>
                    </svg>
                    {"Ingresar lote"}
                  </DesignLink>
                </section>
                <section style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                    {"Historial"}
                  </span>
                  {(lookup(v, "history") || []).map((h, index12) => (
                    <Fragment key={index12}>
                      <div style={{ "display": "flex", "gap": "12px", "alignItems": "flex-start" }}>
                        <span style={{ "width": "10px", "height": "10px", "borderRadius": "50%", "background": lookup(h, "dot"), "marginTop": "5px", "flex": "none" }}></span>
                        <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.35" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                            {lookup(h, "what")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {lookup(h, "when")}
                          </span>
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "fontSize": "11px", "color": "#9A9A9A", "paddingTop": "6px" }}>
                    {"Historial del producto."}
                  </span>
                </section>
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"ProductoEditar"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
