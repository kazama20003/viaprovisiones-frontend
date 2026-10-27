"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { q: 'lámpara', cat: 'Todas', price: 0, stockOnly: false, offersOnly: false, sort: 'rel', cart: 0, added: {} };
  }
  renderVals() {
    const st = this.state;
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    // [nombre, categoría, precio, precio anterior, imagen, stock, palabras extra]
    const ALL = [
      ['Lámpara de camping recargable', 'Camping', 69.9, 0, 'a58999411e32d7481815ba8cdc175e97', 64, 'luz linterna'],
      ['Linterna de cabeza LED', 'Camping', 39.9, 54.9, '9b85b845faa6856c6338458b006ed014', 22, 'lampara frontal luz'],
      ['Linterna táctica recargable', 'Camping', 59.9, 0, '621ce65a45113393656af23955c4e044', 3, 'lampara luz'],
      ['Kit solar plegable para camping', 'Solar', 459, 0, 'b6ecf2ad3d873fbfa09db032a5d5c447', 4, 'lampara panel'],
      ['Panel solar monocristalino 100 W', 'Solar', 349, 0, '972ceb606bfca75ef6208d8d3966c77d', 12, 'energia'],
      ['Foco LED 9 W luz cálida', 'Focos', 8.9, 0, '52dc55c2523393f8f60ab89499fa3ec1', 412, 'lampara bombilla luz'],
      ['Lámpara de emergencia LED', 'Focos', 49.9, 59.9, '52dc55c2523393f8f60ab89499fa3ec1', 0, 'luz corte'],
      ['Cable USB-C carga rápida 1 m', 'Cables', 19.9, 0, '3aba2390d3fbd5f06fdd2cede507b16f', 238, 'cargador'],
      ['Extensión de uso rudo 5 m', 'Extensiones', 45, 0, '323e29809539c2fb4b229651c8081ee9', 57, 'enchufe'],
      ['Casa de campaña para 4 personas', 'Camping', 389, 0, 'a39c65aefaa4235a16422fb671911427', 9, 'carpa'],
      ['Set de cocina para campamento', 'Camping', 129, 0, 'a5d2725814df1e3e53351e1060258c0c', 15, 'olla'],
      ['Mochila de trekking 45 L', 'Camping', 179, 0, '270fef37ab257fc6383d3c904a7f2911', 18, 'bolso']
    ];
    const RANGES = [['Todo', 0, 1e9], ['Hasta S/ 50', 0, 50], ['S/ 50 – 150', 50, 150], ['Más de S/ 150', 150, 1e9]];
    const money = (n) => 'S/ ' + n.toFixed(2);
    const q = norm(st.q.trim());
    const words = q.split(/\s+/).filter(Boolean);
    const match = ALL.filter((p) => { const hay = norm(p[0] + ' ' + p[1] + ' ' + p[6]); return words.every((w) => hay.indexOf(w) !== -1); });
    const rg = RANGES[st.price];
    let list = match.filter((p) => (st.cat === 'Todas' || p[1] === st.cat) && p[2] >= rg[1] && p[2] < rg[2] && (!st.stockOnly || p[5] > 0) && (!st.offersOnly || p[3] > 0));
    if (st.sort === 'asc') list = list.slice().sort((a, b) => a[2] - b[2]);
    if (st.sort === 'desc') list = list.slice().sort((a, b) => b[2] - a[2]);
    const catNames = ['Todas'].concat(match.map((p) => p[1]).filter((c, i, a) => a.indexOf(c) === i));
    return {
      accent,
      cart: st.cart,
      q: st.q,
      hasQ: st.q.length > 0,
      onSearch: (e) => this.setState({ q: (e && e.target && e.target.value) || '', cat: 'Todas' }),
      clear: () => this.setState({ q: '', cat: 'Todas' }),
      suggest: ['lámpara recargable', 'linterna de cabeza', 'panel solar'].map((t) => ({ t, pick: () => this.setState({ q: t, cat: 'Todas' }) })),
      hasResults: match.length > 0,
      noResults: match.length === 0,
      filteredEmpty: match.length > 0 && list.length === 0,
      resultLabel: list.length + (list.length === 1 ? ' producto' : ' productos') + (st.q.trim() ? ' para “' + st.q.trim() + '”' : ''),
      cats: catNames.map((name) => ({
        name, count: String(name === 'Todas' ? match.length : match.filter((p) => p[1] === name).length),
        pressed: st.cat === name ? 'true' : 'false', bg: st.cat === name ? accent : '#FFFFFF',
        pick: () => this.setState({ cat: name })
      })),
      prices: RANGES.map((r, i) => ({ t: r[0], pressed: st.price === i ? 'true' : 'false', bg: st.price === i ? accent : '#FFFFFF', pick: () => this.setState({ price: i }) })),
      stockOnly: st.stockOnly,
      offersOnly: st.offersOnly,
      toggleStock: () => this.setState({ stockOnly: !st.stockOnly }),
      toggleOffers: () => this.setState({ offersOnly: !st.offersOnly }),
      onSort: (e) => this.setState({ sort: (e && e.target && e.target.value) || 'rel' }),
      resetFilters: () => this.setState({ cat: 'Todas', price: 0, stockOnly: false, offersOnly: false }),
      items: list.map((p) => {
        const out = p[5] === 0;
        const n = st.added[p[0]] || 0;
        const badge = p[3] ? 'Oferta' : (p[5] > 0 && p[5] <= 5 ? 'Pocas unidades' : '');
        return {
          name: p[0], cat: p[1], price: money(p[2]), was: p[3] ? money(p[3]) : '', img: B + p[4],
          badge, badgeBg: accent, badgeFg: '#111111',
          stock: out ? '✕ Agotado' : (p[5] <= 5 ? '! Quedan ' + p[5] : '✓ En stock'),
          stockFg: out ? '#B42318' : (p[5] <= 5 ? '#8A5300' : '#1B5E20'),
          out, btn: out ? 'Avísame' : (n ? 'Añadido (' + n + ')' : 'Añadir al carrito'),
          btnBg: n ? accent : '#FFFFFF',
          add: () => { if (out) return; const a = Object.assign({}, st.added); a[p[0]] = n + 1; this.setState({ added: a, cart: st.cart + 1 }); }
        };
      }),
      popular: [['Focos', '52dc55c2523393f8f60ab89499fa3ec1'], ['Camping', 'a39c65aefaa4235a16422fb671911427'], ['Solar', '972ceb606bfca75ef6208d8d3966c77d'], ['Cables', '3aba2390d3fbd5f06fdd2cede507b16f']].map((c) => ({ name: c[0], img: B + c[1] }))
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Busqueda(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={lookup(v, "cart")} active={""} />
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "0 40px 80px" }}>
        <nav aria-label={"Ruta"} style={{ "padding": "24px 0", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "display": "flex", "gap": "10px" }}>
          <DesignLink href={"/tienda"} style={{ "textDecoration": "none" }}>
            {"Inicio"}
          </DesignLink>
          <span aria-hidden={"true"}>
            {"/"}
          </span>
          <span>
            {"Búsqueda"}
          </span>
        </nav>
        <section style={{ "display": "flex", "flexDirection": "column", "gap": "18px", "paddingBottom": "32px", "borderBottom": "2px solid #111111" }}>
          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
            {"Resultados de búsqueda"}
          </span>
          <label style={{ "display": "flex", "alignItems": "center", "gap": "16px", "height": "84px", "padding": "0 12px 0 28px", "border": "3px solid #111111", "borderRadius": "999px", "boxSizing": "border-box" }}>
            <svg width={"28"} height={"28"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} aria-hidden={"true"} style={{ "flex": "none" }}>
              <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
              <path d={"M16 16l4 4"}></path>
            </svg>
            <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
              {"Buscar productos"}
            </span>
            <input type={"search"} value={(lookup(v, "q") ?? "")} onChange={lookup(v, "onSearch")} placeholder={"¿Qué estás buscando?"} style={{ "flex": "1", "minWidth": "0", "border": "none", "outline": "none", "background": "transparent", "fontFamily": "Archivo, sans-serif", "fontSize": "36px", "fontWeight": "800", "textTransform": "uppercase", "color": "#111111" }} />
            {Boolean(lookup(v, "hasQ")) && (
              <Fragment>
                <button onClick={lookup(v, "clear")} aria-label={"Borrar búsqueda"} style={{ "width": "48px", "height": "48px", "borderRadius": "50%", "border": "2px solid #111111", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M6 6l12 12M18 6L6 18"}></path>
                  </svg>
                </button>
              </Fragment>
            )}
            <span style={{ "height": "60px", "padding": "0 30px", "borderRadius": "999px", "background": lookup(v, "accent"), "display": "flex", "alignItems": "center", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase", "flex": "none" }}>
              {"Buscar"}
            </span>
          </label>
          <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
            <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "marginRight": "6px" }}>
              {"También buscan"}
            </span>
            {(lookup(v, "suggest") || []).map((s, index1) => (
              <Fragment key={index1}>
                <button onClick={lookup(s, "pick")} style={{ "height": "40px", "padding": "0 18px", "borderRadius": "999px", "border": "2px solid #111111", "background": "#FFFFFF", "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "fontWeight": "500" }}>
                  {lookup(s, "t")}
                </button>
              </Fragment>
            ))}
          </div>
        </section>
        {Boolean(lookup(v, "hasResults")) && (
          <Fragment>
            <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "40px", "paddingTop": "36px" }}>
              <aside style={{ "flex": "1 1 260px", "maxWidth": "300px", "display": "flex", "flexDirection": "column", "gap": "32px" }}>
                <div>
                  <h2 style={{ "margin": "0 0 14px", "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {"Categoría"}
                  </h2>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                    {(lookup(v, "cats") || []).map((c, index2) => (
                      <Fragment key={index2}>
                        <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "minHeight": "46px", "padding": "0 16px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(c, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "fontWeight": "500", "textAlign": "left" }}>
                          {lookup(c, "name")}
                          <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(c, "count")}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 style={{ "margin": "0 0 14px", "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {"Precio"}
                  </h2>
                  <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "8px" }}>
                    {(lookup(v, "prices") || []).map((r, index3) => (
                      <Fragment key={index3}>
                        <button onClick={lookup(r, "pick")} aria-pressed={lookup(r, "pressed")} style={{ "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(r, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(r, "t")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <h2 style={{ "margin": "0 0 2px", "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {"Disponibilidad"}
                  </h2>
                  <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "15px" }}>
                    <input type={"checkbox"} checked={truthy(lookup(v, "stockOnly"))} onChange={lookup(v, "toggleStock")} style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                    {"Solo en stock"}
                  </label>
                  <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "15px" }}>
                    <input type={"checkbox"} checked={truthy(lookup(v, "offersOnly"))} onChange={lookup(v, "toggleOffers")} style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                    {"Solo ofertas"}
                  </label>
                </div>
              </aside>
              <section style={{ "flex": "999 1 640px", "minWidth": "0" }}>
                <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "16px", "flexWrap": "wrap", "marginBottom": "24px" }}>
                  <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {lookup(v, "resultLabel")}
                  </span>
                  <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase" }}>
                    {"Ordenar\n"}
                    <select onChange={lookup(v, "onSort")} style={{ "height": "44px", "border": "2px solid #111111", "borderRadius": "999px", "padding": "0 16px", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "background": "#FFFFFF" }}>
                      <option value={"rel"}>
                        {"Más relevantes"}
                      </option>
                      <option value={"asc"}>
                        {"Precio: menor a mayor"}
                      </option>
                      <option value={"desc"}>
                        {"Precio: mayor a menor"}
                      </option>
                    </select>
                  </label>
                </div>
                {Boolean(lookup(v, "filteredEmpty")) && (
                  <Fragment>
                    <div style={{ "padding": "32px", "border": "2px dashed #111111", "borderRadius": "20px", "fontSize": "16px", "lineHeight": "1.5" }}>
                      {"Ningún producto cumple estos filtros. "}
                      <button onClick={lookup(v, "resetFilters")} style={{ "border": "none", "background": "transparent", "padding": "0", "font": "inherit", "fontWeight": "700", "textDecoration": "underline", "cursor": "pointer", "color": "#111111" }}>
                        {"Quitar filtros"}
                      </button>
                    </div>
                  </Fragment>
                )}
                <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fill, minmax(260px, 1fr))", "gap": "36px 20px" }}>
                  {(lookup(v, "items") || []).map((p, index4) => (
                    <Fragment key={index4}>
                      <article style={{ "display": "flex", "flexDirection": "column" }}>
                        <DesignLink href={"/producto"} style={{ "position": "relative", "display": "block", "aspectRatio": "1 / 1", "borderRadius": "19px", "overflow": "hidden" }}>
                          <img src={assetSrc(lookup(p, "img"))} alt={lookup(p, "name")} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
                          {Boolean(lookup(p, "badge")) && (
                            <Fragment>
                              <span style={{ "position": "absolute", "top": "12px", "left": "12px", "background": lookup(p, "badgeBg"), "color": lookup(p, "badgeFg"), "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase", "padding": "4px 10px", "borderRadius": "999px" }}>
                                {lookup(p, "badge")}
                              </span>
                            </Fragment>
                          )}
                        </DesignLink>
                        <span style={{ "marginTop": "14px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                          {lookup(p, "cat")}
                        </span>
                        <h3 style={{ "margin": "6px 0 0", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "700", "textTransform": "uppercase", "lineHeight": "1.3", "minHeight": "44px" }}>
                          <DesignLink href={"/producto"} style={{ "textDecoration": "none" }}>
                            {lookup(p, "name")}
                          </DesignLink>
                        </h3>
                        <div style={{ "marginTop": "10px", "display": "flex", "gap": "8px", "alignItems": "baseline", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700" }}>
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
                          <span style={{ "marginLeft": "auto", "fontSize": "12px", "color": lookup(p, "stockFg") }}>
                            {lookup(p, "stock")}
                          </span>
                        </div>
                        <button onClick={lookup(p, "add")} style={{ "marginTop": "12px", "height": "46px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(p, "btnBg"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "cursor": "pointer" }}>
                          {lookup(p, "btn")}
                        </button>
                      </article>
                    </Fragment>
                  ))}
                </div>
              </section>
            </div>
          </Fragment>
        )}
        {Boolean(lookup(v, "noResults")) && (
          <Fragment>
            <section style={{ "display": "flex", "flexWrap": "wrap", "gap": "40px", "paddingTop": "48px" }}>
              <div style={{ "flex": "1 1 420px", "display": "flex", "flexDirection": "column", "gap": "18px" }}>
                <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "56px", "fontWeight": "900", "lineHeight": "0.95", "textTransform": "uppercase" }}>
                  {"No encontramos resultados para “"}
                  {lookup(v, "q")}
                  {"”"}
                </h1>
                <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.5" }}>
                  {"Revisa cómo está escrito o prueba con una palabra más general."}
                </p>
                <ul style={{ "margin": "0", "paddingLeft": "22px", "display": "flex", "flexDirection": "column", "gap": "8px", "fontSize": "16px", "lineHeight": "1.5" }}>
                  <li>
                    {"Usa nombres simples: “foco”, “cable”, “extensión”."}
                  </li>
                  <li>
                    {"Busca por uso: “camping”, “emergencia”, “carga”."}
                  </li>
                  <li>
                    {"¿No lo tenemos? Te lo conseguimos: escríbenos por WhatsApp."}
                  </li>
                </ul>
                <DesignLink href={"https://wa.me/51954802744"} style={{ "alignSelf": "flex-start", "height": "56px", "padding": "0 28px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Pedir por WhatsApp"}
                </DesignLink>
              </div>
              <div style={{ "flex": "1 1 520px", "display": "grid", "gridTemplateColumns": "repeat(2, minmax(0, 1fr))", "gap": "16px" }}>
                {(lookup(v, "popular") || []).map((c, index5) => (
                  <Fragment key={index5}>
                    <DesignLink href={"/categoria"} style={{ "position": "relative", "height": "200px", "borderRadius": "19px", "overflow": "hidden", "textDecoration": "none", "background": "#111111" }}>
                      <img src={assetSrc(lookup(c, "img"))} alt={""} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover", "opacity": "0.8" }} />
                      <span style={{ "position": "absolute", "left": "14px", "bottom": "14px", "background": "#FFFFFF", "padding": "8px 14px", "borderRadius": "999px", "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800", "textTransform": "uppercase" }}>
                        {lookup(c, "name")}
                      </span>
                    </DesignLink>
                  </Fragment>
                ))}
              </div>
            </section>
          </Fragment>
        )}
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
