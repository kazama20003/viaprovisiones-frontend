"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  renderVals() {
    const B = 'img/';
    return {
      accent: this.props.accent ?? '#FF914C',
      cats: [
        ['Focos', '52dc55c2523393f8f60ab89499fa3ec1'],
        ['Camping', 'a39c65aefaa4235a16422fb671911427'],
        ['Solar', '972ceb606bfca75ef6208d8d3966c77d'],
        ['Cables', '3aba2390d3fbd5f06fdd2cede507b16f'],
        ['Extensiones', '323e29809539c2fb4b229651c8081ee9']
      ].map((c) => ({ name: c[0], img: B + c[1] }))
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function Error404(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#FFFFFF}\na{color:#111111}a:hover{color:#E8701F}\n"}</style>
    <div style={{ "fontFamily": "Roboto, system-ui, sans-serif", "fontSize": "17px", "letterSpacing": "0.02em", "color": "#111111", "background": "#FFFFFF", "minHeight": "100vh" }}>
      <DesignImport name={"Header"} accent={lookup(v, "accent")} cart={"0"} active={""} />
      <main style={{ "maxWidth": "1520px", "margin": "0 auto", "padding": "40px 40px 80px", "display": "flex", "flexDirection": "column", "gap": "48px" }}>
        <section style={{ "display": "flex", "flexWrap": "wrap", "alignItems": "center", "gap": "40px", "borderRadius": "28px", "background": "#111111", "color": "#FFFFFF", "padding": "56px", "boxSizing": "border-box", "overflow": "hidden" }}>
          <div style={{ "flex": "1 1 520px", "display": "flex", "flexDirection": "column", "gap": "22px" }}>
            <span style={{ "alignSelf": "flex-start", "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "13px", "fontWeight": "700", "textTransform": "uppercase", "padding": "6px 14px", "borderRadius": "999px" }}>
              {"Error 404 · Página no encontrada"}
            </span>
            <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "84px", "fontWeight": "900", "lineHeight": "0.92", "textTransform": "uppercase" }}>
              {"Esta ruta se quedó sin luz"}
            </h1>
            <p style={{ "margin": "0", "maxWidth": "560px", "fontSize": "19px", "lineHeight": "1.5", "color": "#E8E8E8" }}>
              {"La página que buscas no existe o cambió de lugar. Busca lo que necesitas o vuelve a un camino iluminado."}
            </p>
            <label style={{ "display": "flex", "alignItems": "center", "gap": "12px", "height": "64px", "maxWidth": "620px", "padding": "0 8px 0 22px", "borderRadius": "999px", "background": "#FFFFFF", "boxSizing": "border-box" }}>
              <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} aria-hidden={"true"} style={{ "flex": "none" }}>
                <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                <path d={"M16 16l4 4"}></path>
              </svg>
              <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                {"Buscar productos"}
              </span>
              <input type={"search"} placeholder={"Buscar focos, cables, linternas…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "outline": "none", "background": "transparent", "fontFamily": "Roboto, sans-serif", "fontSize": "17px", "color": "#111111" }} />
              <a href={"/busqueda"} style={{ "height": "48px", "padding": "0 24px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Buscar"}
              </a>
            </label>
            <div style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap" }}>
              <a href={"/tienda"} style={{ "height": "56px", "padding": "0 28px", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Ir al inicio"}
              </a>
              <a href={"/categoria"} style={{ "height": "56px", "padding": "0 28px", "borderRadius": "999px", "border": "2px solid #FFFFFF", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                {"Ver catálogo"}
              </a>
              <a href={"https://wa.me/51954802744"} style={{ "height": "56px", "padding": "0 28px", "borderRadius": "999px", "border": "2px solid #FFFFFF", "color": "#FFFFFF", "display": "flex", "alignItems": "center", "gap": "10px", "textDecoration": "none", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                  <path d={"M4 20l1.4-4A8 8 0 1 1 8 18.6z"}></path>
                </svg>
                {"Escribir por WhatsApp"}
              </a>
            </div>
          </div>
          <div style={{ "flex": "1 1 420px", "display": "flex", "justifyContent": "center" }}>
            <svg width={"460"} height={"360"} viewBox={"0 0 460 360"} role={"img"} aria-label={"Linterna apuntando a un 404 iluminado"}>
              <polygon points={"150,150 460,20 460,300"} fill={lookup(v, "accent")} opacity={"0.22"}></polygon>
              <polygon points={"150,150 460,80 460,240"} fill={lookup(v, "accent")} opacity={"0.35"}></polygon>
              <text x={"300"} y={"196"} textAnchor={"middle"} fontFamily={"Archivo, sans-serif"} fontSize={"110"} fontWeight={"900"} fill={"#FFFFFF"}>
                {"404"}
              </text>
              <rect x={"20"} y={"128"} width={"100"} height={"44"} rx={"14"} fill={"#FFFFFF"}></rect>
              <rect x={"38"} y={"140"} width={"22"} height={"20"} rx={"5"} fill={"#111111"}></rect>
              <rect x={"72"} y={"140"} width={"10"} height={"20"} rx={"3"} fill={lookup(v, "accent")}></rect>
              <path d={"M118 120 L150 108 L150 192 L118 180 Z"} fill={"#FFFFFF"}></path>
              <rect x={"148"} y={"106"} width={"10"} height={"88"} rx={"4"} fill={lookup(v, "accent")}></rect>
              <circle cx={"70"} cy={"252"} r={"5"} fill={lookup(v, "accent")}></circle>
              <circle cx={"104"} cy={"282"} r={"3"} fill={"#FFFFFF"} opacity={"0.6"}></circle>
              <circle cx={"40"} cy={"300"} r={"4"} fill={"#FFFFFF"} opacity={"0.4"}></circle>
            </svg>
          </div>
        </section>
        <section style={{ "display": "flex", "flexDirection": "column", "gap": "20px" }}>
          <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-end", "gap": "16px", "flexWrap": "wrap" }}>
            <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "36px", "fontWeight": "900", "textTransform": "uppercase" }}>
              {"Lo más buscado"}
            </h2>
            <a href={"/categoria"} style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px" }}>
              {"Ver todas las categorías"}
            </a>
          </div>
          <div style={{ "display": "grid", "gridTemplateColumns": "repeat(auto-fill, minmax(220px, 1fr))", "gap": "16px" }}>
            {(lookup(v, "cats") || []).map((c, index1) => (
              <Fragment key={index1}>
                <a href={"/categoria"} style={{ "display": "flex", "flexDirection": "column", "gap": "12px", "textDecoration": "none" }}>
                  <span style={{ "position": "relative", "display": "block", "aspectRatio": "4 / 3", "borderRadius": "19px", "overflow": "hidden", "background": "#111111" }}>
                    <img src={assetSrc(lookup(c, "img"))} alt={""} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover" }} />
                  </span>
                  <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "fontFamily": "Archivo, sans-serif", "fontSize": "18px", "fontWeight": "800", "textTransform": "uppercase" }}>
                    {lookup(c, "name")}
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                      <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                    </svg>
                  </span>
                </a>
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
