"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  renderVals() {
    return { accent: this.props.accent ?? '#FF914C' };
  }
}

const defaults = {"accent": "#FF914C"};

export default function CartelQR(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0}\na{color:#111111}a:hover{color:#111111}\n"}</style>
    <div style={{ "width": "600px", "height": "850px", "boxSizing": "border-box", "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "Roboto, system-ui, sans-serif", "padding": "48px", "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "26px", "textAlign": "center" }}>
      <svg width={"300"} height={"99"} viewBox={"134 205 278 92"} role={"img"} aria-label={"VIA Provisiones"}>
        <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"3"}></circle>
        <clipPath id={"via-clip-qr"}>
          <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
        </clipPath>
        <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
        <path clipPath={"url(#via-clip-qr)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
        <g fill={"none"} stroke={"#FFFFFF"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
          <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
          <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
          <path d={"M295.8 229 V248.25"}></path>
        </g>
        <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={"#FFFFFF"}>
          {"PROVISIONES"}
        </text>
      </svg>
      <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontWeight": "900", "fontSize": "76px", "lineHeight": "0.92", "textTransform": "uppercase" }}>
        {"Escanéanos"}
      </h1>
      <p style={{ "margin": "0", "fontSize": "20px", "fontWeight": "500", "lineHeight": "1.4", "maxWidth": "420px" }}>
        {"Síguenos en redes, compra por WhatsApp o cotiza para tu empresa."}
      </p>
      <div style={{ "position": "relative", "background": "#FFFFFF", "border": "4px solid #111111", "borderRadius": "28px", "padding": "22px", "width": "300px", "height": "300px", "boxSizing": "border-box" }}>
        <img src={assetSrc("img/2d7ff64ebc4cab97ff138aeb7ef049b7.svg")} alt={"Código QR a www.viaprovisiones.com/enlaces"} style={{ "width": "100%", "height": "100%", "display": "block" }} />
        <span style={{ "position": "absolute", "left": "50%", "top": "50%", "width": "64px", "height": "64px", "margin": "-32px 0 0 -32px", "borderRadius": "50%", "background": lookup(v, "accent"), "border": "4px solid #FFFFFF", "boxSizing": "border-box", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
          <svg width={"30"} height={"30"} viewBox={"0 0 100 100"} aria-hidden={"true"}>
            <polygon points={"50,18 82,64 50,52 18,64"} fill={"#FFFFFF"}></polygon>
          </svg>
        </span>
      </div>
      <span style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "17px", "fontWeight": "700", "background": "#111111", "color": "#FFFFFF", "padding": "10px 18px", "borderRadius": "999px" }}>
        {"viaprovisiones.com/enlaces"}
      </span>
      <div style={{ "display": "flex", "gap": "18px", "justifyContent": "center", "flexWrap": "wrap", "fontFamily": "'Roboto Mono', monospace", "fontSize": "14px", "fontWeight": "700", "textTransform": "uppercase" }}>
        <span>
          {"Instagram"}
        </span>
        <span aria-hidden={"true"}>
          {"·"}
        </span>
        <span>
          {"Facebook"}
        </span>
        <span aria-hidden={"true"}>
          {"·"}
        </span>
        <span>
          {"TikTok"}
        </span>
        <span aria-hidden={"true"}>
          {"·"}
        </span>
        <span>
          {"WhatsApp"}
        </span>
      </div>
    </div>
    </Fragment>
  )} />;
}
