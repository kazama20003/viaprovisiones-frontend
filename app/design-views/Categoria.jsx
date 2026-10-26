"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { sub: 'Todo', cart: 0 };
  }
  renderVals() {
    const B = 'img/';
    const accent = this.props.accent ?? '#FF914C';
    const all = [
      { sub: 'Lámparas y linternas', name: 'Lámpara de camping recargable', price: 'S/ 69.90', img: 'a58999411e32d7481815ba8cdc175e97', badge: 'Más vendido', dark: true },
      { sub: 'Lámparas y linternas', name: 'Linterna de cabeza LED', price: 'S/ 39.90', was: 'S/ 54.90', img: '9b85b845faa6856c6338458b006ed014', badge: 'Oferta' },
      { sub: 'Cocina de campamento', name: 'Set de cocina para campamento', price: 'S/ 129.00', img: 'a5d2725814df1e3e53351e1060258c0c' },
      { sub: 'Casas de campaña', name: 'Casa de campaña para 4 personas', price: 'S/ 389.00', img: 'a39c65aefaa4235a16422fb671911427' },
      { sub: 'Casas de campaña', name: 'Casa de campaña para 2 personas', price: 'S/ 229.00', img: '6bfeade76520c7a9cd478f997069e6ca' },
      { sub: 'Lámparas y linternas', name: 'Kit solar plegable para camping', price: 'S/ 459.00', img: 'b6ecf2ad3d873fbfa09db032a5d5c447', badge: 'Pocas unidades' },
      { sub: 'Mochilas', name: 'Mochila de trekking 45 L', price: 'S/ 179.00', img: '270fef37ab257fc6383d3c904a7f2911' },
      { sub: 'Sillas plegables', name: 'Silla plegable con portavasos', price: 'S/ 89.00', img: '5bcbbd21ce25a9016f20a6456029204e' },
      { sub: 'Lámparas y linternas', name: 'Linterna táctica recargable', price: 'S/ 59.90', img: '621ce65a45113393656af23955c4e044' }
    ];
    const names = ['Todo', 'Lámparas y linternas', 'Casas de campaña', 'Cocina de campamento', 'Mochilas', 'Sillas plegables'];
    const cur = this.state.sub;
    const items = all.filter((p) => cur === 'Todo' || p.sub === cur).map((p) => ({
      ...p,
      img: B + p.img,
      was: p.was || '',
      badge: p.badge || '',
      badgeBg: p.badge === 'Más vendido' ? '#111111' : accent,
      badgeFg: p.badge === 'Más vendido' ? '#FFFFFF' : '#111111'
    }));
    return {
      accent,
      cart: this.state.cart,
      hasCart: this.state.cart > 0,
      add: () => this.setState({ cart: this.state.cart + 1 }),
      subs: names.map((name) => ({
        name,
        count: String(name === 'Todo' ? all.length : all.filter((p) => p.sub === name).length),
        pressed: cur === name ? 'true' : 'false',
        bg: cur === name ? accent : '#FFFFFF',
        pick: () => this.setState({ sub: name })
      })),
      items,
      resultLabel: items.length + ' productos'
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Categoria(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n.marquee{animation:via-marquee 40s linear infinite}\n@keyframes via-marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}\n@media (prefers-reduced-motion: reduce){.marquee{animation:none}}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={lookup(v, "cart")} active={""} />
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "0 40px 80px" }}>
        <nav aria-label={"Ruta"} style={{ "padding": "24px 0", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "display": "flex", "gap": "10px" }}>
          <a href={"/tienda"} style={{ "textDecoration": "none" }}>
            {"Inicio"}
          </a>
          <span aria-hidden={"true"}>
            {"/"}
          </span>
          <span>
            {"Camping"}
          </span>
        </nav>
        <section style={{ "position": "relative", "height": "320px", "borderRadius": "20px", "overflow": "hidden", "background": "#111111" }}>
          <img src={assetSrc("img/a39c65aefaa4235a16422fb671911427")} alt={"Casa de campaña de noche"} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
          <div style={{ "position": "absolute", "left": "32px", "bottom": "32px", "background": "#FFFFFF", "borderTop": "6px solid " + String(lookup(v, "accent") ?? ""), "padding": "24px 28px", "maxWidth": "520px" }}>
            <h1 style={{ "margin": "0 0 8px", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "56px", "lineHeight": "1", "textTransform": "uppercase" }}>
              {"Camping"}
            </h1>
            <p style={{ "margin": "0", "fontSize": "17px", "lineHeight": "1.5" }}>
              {"Equipo para acampar con luz, comodidad y seguridad."}
            </p>
          </div>
        </section>
        <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "40px", "paddingTop": "40px" }}>
          <aside style={{ "flex": "1 1 260px", "maxWidth": "300px", "display": "flex", "flexDirection": "column", "gap": "32px" }}>
            <div>
              <h2 style={{ "margin": "0 0 14px", "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800", "textTransform": "uppercase" }}>
                {"Subcategorías"}
              </h2>
              <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                {(lookup(v, "subs") || []).map((s, index1) => (
                  <Fragment key={index1}>
                    <button onClick={lookup(s, "pick")} aria-pressed={lookup(s, "pressed")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "space-between", "minHeight": "46px", "padding": "0 16px", "borderRadius": "999px", "border": "2px solid #111111", "background": lookup(s, "bg"), "color": "#111111", "cursor": "pointer", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "fontWeight": "500", "textAlign": "left" }}>
                      {lookup(s, "name")}
                      <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700" }}>
                        {lookup(s, "count")}
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
              <div style={{ "display": "flex", "gap": "10px" }}>
                <label style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "6px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Desde"}
                  <input type={"text"} defaultValue={"S/ 0"} style={{ "height": "44px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "14px" }} />
                </label>
                <label style={{ "flex": "1", "display": "flex", "flexDirection": "column", "gap": "6px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                  {"Hasta"}
                  <input type={"text"} defaultValue={"S/ 1,500"} style={{ "height": "44px", "border": "1px solid #111111", "borderRadius": "10px", "padding": "0 12px", "fontFamily": "inherit", "fontSize": "14px" }} />
                </label>
              </div>
            </div>
            <div style={{ "display": "flex", "flexDirection": "column", "gap": "12px" }}>
              <h2 style={{ "margin": "0 0 2px", "fontFamily": "Archivo, sans-serif", "fontSize": "16px", "fontWeight": "800", "textTransform": "uppercase" }}>
                {"Disponibilidad"}
              </h2>
              <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "15px" }}>
                <input type={"checkbox"} defaultChecked style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                {"En stock"}
              </label>
              <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "15px" }}>
                <input type={"checkbox"} style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                {"En oferta"}
              </label>
              <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "15px" }}>
                <input type={"checkbox"} style={{ "width": "20px", "height": "20px", "accentColor": "#111111" }} />
                {"Precio por volumen (empresas)"}
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
                <select style={{ "height": "44px", "border": "2px solid #111111", "borderRadius": "999px", "padding": "0 16px", "fontFamily": "Roboto, sans-serif", "fontSize": "15px", "background": "#FFFFFF" }}>
                  <option>
                    {"Más vendidos"}
                  </option>
                  <option>
                    {"Precio: menor a mayor"}
                  </option>
                  <option>
                    {"Precio: mayor a menor"}
                  </option>
                  <option>
                    {"Novedades"}
                  </option>
                </select>
              </label>
            </div>
            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fill, minmax(260px, 1fr))", "gap": "36px 20px" }}>
              {(lookup(v, "items") || []).map((p, index2) => (
                <Fragment key={index2}>
                  <article style={{ "display": "flex", "flexDirection": "column" }}>
                    <a href={"/producto"} style={{ "position": "relative", "display": "block", "aspectRatio": "1 / 1", "borderRadius": "19px", "overflow": "hidden" }}>
                      <img src={assetSrc(lookup(p, "img"))} alt={lookup(p, "name")} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
                      {Boolean(lookup(p, "badge")) && (
                        <Fragment>
                          <span style={{ "position": "absolute", "top": "12px", "left": "12px", "background": lookup(p, "badgeBg"), "color": lookup(p, "badgeFg"), "fontFamily": "'Roboto Mono', monospace", "fontSize": "11px", "fontWeight": "700", "textTransform": "uppercase", "padding": "4px 10px", "borderRadius": "999px" }}>
                            {lookup(p, "badge")}
                          </span>
                        </Fragment>
                      )}
                    </a>
                    <span style={{ "marginTop": "14px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase" }}>
                      {"Camping · "}
                      {lookup(p, "sub")}
                    </span>
                    <h3 style={{ "margin": "6px 0 0", "fontFamily": "Archivo, sans-serif", "fontSize": "17px", "fontWeight": "700", "textTransform": "uppercase", "lineHeight": "1.3", "minHeight": "44px" }}>
                      <a href={"/producto"} style={{ "textDecoration": "none" }}>
                        {lookup(p, "name")}
                      </a>
                    </h3>
                    <div style={{ "marginTop": "10px", "display": "flex", "gap": "8px", "fontFamily": "'Roboto Mono', monospace", "fontSize": "16px", "fontWeight": "700" }}>
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
                    <button onClick={lookup(v, "add")} style={{ "marginTop": "12px", "height": "46px", "borderRadius": "999px", "border": "2px solid #111111", "background": "#FFFFFF", "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "cursor": "pointer" }}>
                      {"Añadir al carrito"}
                    </button>
                  </article>
                </Fragment>
              ))}
            </div>
            <nav aria-label={"Páginas"} style={{ "display": "flex", "justifyContent": "center", "gap": "8px", "marginTop": "56px" }}>
              <span style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": "#111111", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontWeight": "700" }}>
                {"1"}
              </span>
              <a href={"/categoria"} style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "border": "2px solid #111111", "boxSizing": "border-box", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontWeight": "700", "textDecoration": "none" }}>
                {"2"}
              </a>
              <a href={"/categoria"} style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "border": "2px solid #111111", "boxSizing": "border-box", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontFamily": "'Roboto Mono', monospace", "fontWeight": "700", "textDecoration": "none" }}>
                {"3"}
              </a>
            </nav>
          </section>
        </div>
      </main>
      <DesignImport name={"Footer"} accent={lookup(v, "accent")} />
    </div>
    </Fragment>
  )} />;
}
