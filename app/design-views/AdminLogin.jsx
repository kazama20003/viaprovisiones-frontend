"use client";

import { Fragment } from "react";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = { show: false, correo: '', clave: '', recordarSesion: false, recuperacion: '' };
  }
  renderVals() {
    return {
      accent: this.props.accent ?? '#FF914C',
      pwType: this.state.show ? 'text' : 'password',
      pwLabel: this.state.show ? 'Ocultar contraseña' : 'Mostrar contraseña',
      togglePw: () => this.setState({ show: !this.state.show }),
      error: Boolean(this.props.loginError),
      errorText: this.props.loginError || 'Correo o contraseña incorrectos. Inténtalo otra vez.',
      loading: Boolean(this.props.loginLoading),
      correo: this.state.correo,
      clave: this.state.clave,
      recordarSesion: this.state.recordarSesion,
      recuperacion: this.state.recuperacion,
      onCorreo: (e) => this.setState({ correo: e.target.value, recuperacion: '' }),
      onClave: (e) => this.setState({ clave: e.target.value }),
      onRecordar: (e) => this.setState({ recordarSesion: e.target.checked }),
      onRecuperar: (e) => { e.preventDefault(); this.setState({ recuperacion: 'Solicita al administrador de VIA Provisiones que restablezca tu contraseña.' }); },
      onSubmit: (e) => { e.preventDefault(); this.props.onLogin?.({ correo: this.state.correo, clave: this.state.clave, recordarSesion: this.state.recordarSesion }); }
    };
  }
}

const defaults = {"accent": "#FF914C"};

export default function AdminLogin(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}a:hover{color:#C2410C}\n"}</style>
    <div style={{ "minHeight": "100vh", "width": "100%", "borderRadius": "40px", "overflow": "hidden", "display": "flex", "flexWrap": "wrap", "fontFamily": "Roboto, system-ui, sans-serif", "color": "#111111", "background": "#111111" }}>
      <div style={{ "flex": "1 1 520px", "minHeight": "420px", "position": "relative", "overflow": "hidden", "background": "#111111", "color": "#FFFFFF", "display": "flex", "flexDirection": "column", "justifyContent": "space-between", "padding": "48px", "boxSizing": "border-box" }}>
        <img src={assetSrc("img/0bb06f99d56a0b4730372a08e5afe328")} alt={""} style={{ "position": "absolute", "inset": "0", "width": "100%", "height": "100%", "objectFit": "cover", "opacity": "0.35" }} />
        <svg width={"220"} height={"73"} viewBox={"134 205 278 92"} role={"img"} aria-label={"VIA Provisiones"} style={{ "position": "relative" }}>
          <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={lookup(v, "accent")} strokeWidth={"3"}></circle>
          <clipPath id={"via-clip-login"}>
            <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
          </clipPath>
          <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={lookup(v, "accent")}></polygon>
          <path clipPath={"url(#via-clip-login)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={lookup(v, "accent")}></path>
          <g fill={"none"} stroke={"#FFFFFF"} strokeWidth={"10"} strokeLinecap={"round"} strokeLinejoin={"round"}>
            <path d={"M242.6 229 L257.8 248.25 L281.1 229"}></path>
            <path d={"M310.1 248 L334.3 228 L349.6 248"}></path>
            <path d={"M295.8 229 V248.25"}></path>
          </g>
          <text transform={"translate(0 283.4) skewX(-12) translate(0 -283.4)"} x={"229"} y={"283.4"} textLength={"178"} lengthAdjust={"spacing"} fontFamily={"Montserrat, 'Segoe UI', Arial, sans-serif"} fontSize={"20"} fontWeight={"500"} fill={lookup(v, "accent")}>
            {"PROVISIONES"}
          </text>
        </svg>
        <div style={{ "position": "relative", "display": "flex", "flexDirection": "column", "gap": "16px", "maxWidth": "520px" }}>
          <span style={{ "alignSelf": "flex-start", "background": lookup(v, "accent"), "color": "#111111", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "padding": "6px 12px", "borderRadius": "999px" }}>
            {"Panel de administración"}
          </span>
          <h1 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "56px", "fontWeight": "900", "lineHeight": "0.95", "textTransform": "uppercase" }}>
            {"Tu tienda, en un solo lugar"}
          </h1>
          <p style={{ "margin": "0", "fontSize": "18px", "lineHeight": "1.5", "color": "#E8E8E8" }}>
            {"Pedidos, productos, inventario, clientes y cotizaciones de empresas de VIA Provisiones."}
          </p>
        </div>
        <span style={{ "position": "relative", "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "color": "#CFCFCF" }}>
          {"© 2026 VIA Provisiones · Arequipa, Perú"}
        </span>
      </div>
      <div style={{ "flex": "1 1 480px", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "padding": "48px 24px", "boxSizing": "border-box" }}>
        <div style={{ "width": "100%", "maxWidth": "420px", "display": "flex", "flexDirection": "column", "gap": "22px" }}>
          <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
            <h2 style={{ "margin": "0", "fontFamily": "Archivo, sans-serif", "fontSize": "34px", "fontWeight": "900", "textTransform": "uppercase" }}>
              {"Ingresar"}
            </h2>
            <p style={{ "margin": "0", "fontSize": "15px", "color": "#444444" }}>
              {"Acceso solo para el equipo de VIA Provisiones."}
            </p>
          </div>
          {Boolean(lookup(v, "error")) && (
            <Fragment>
              <div role={"alert"} style={{ "display": "flex", "gap": "10px", "alignItems": "center", "padding": "12px 14px", "borderRadius": "12px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "14px", "fontWeight": "500" }}>
                <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                  <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                </svg>
                {lookup(v, "errorText")}
              </div>
            </Fragment>
          )}
          <form onSubmit={lookup(v, "onSubmit")} style={{ "display": "flex", "flexDirection": "column", "gap": "16px" }}>
            <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
              {"Correo\n"}
              <input type={"email"} value={lookup(v, "correo")} onChange={lookup(v, "onCorreo")} autoComplete={"username"} required style={{ "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 16px", "fontFamily": "inherit", "fontSize": "16px" }} />
            </label>
            <label style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "fontSize": "14px", "fontWeight": "500" }}>
              {"Contraseña\n"}
              <span style={{ "display": "flex", "alignItems": "center", "height": "52px", "border": "1px solid #111111", "borderRadius": "12px", "padding": "0 6px 0 16px", "boxSizing": "border-box" }}>
                <input type={lookup(v, "pwType")} value={lookup(v, "clave")} onChange={lookup(v, "onClave")} placeholder={"••••••••"} autoComplete={"current-password"} required style={{ "flex": "1", "minWidth": "0", "border": "none", "fontFamily": "inherit", "fontSize": "16px", "outline": "none" }} />
                <button type={"button"} onClick={lookup(v, "togglePw")} aria-label={lookup(v, "pwLabel")} style={{ "width": "40px", "height": "40px", "border": "none", "background": "transparent", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"}></path>
                    <circle cx={"12"} cy={"12"} r={"3"}></circle>
                  </svg>
                </button>
              </span>
            </label>
            <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "12px", "flexWrap": "wrap", "fontSize": "14px" }}>
              <label style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                <input type={"checkbox"} checked={lookup(v, "recordarSesion")} onChange={lookup(v, "onRecordar")} style={{ "width": "18px", "height": "18px", "accentColor": "#111111" }} />
                {"Mantener sesión iniciada"}
              </label>
              <DesignLink href={"#recuperar"} onClick={lookup(v, "onRecuperar")} style={{ "fontWeight": "500", "textUnderlineOffset": "3px" }}>
                {"¿Olvidaste tu contraseña?"}
              </DesignLink>
              {Boolean(lookup(v, "recuperacion")) && <span role={"status"} style={{ "flexBasis": "100%", "fontSize": "12px", "color": "#444444" }}>{lookup(v, "recuperacion")}</span>}
            </div>
            <button type="submit" disabled={lookup(v, "loading")} style={{ "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px", "height": "56px", "border": "none", "borderRadius": "999px", "background": lookup(v, "accent"), "color": "#111111", "cursor": "pointer", "fontFamily": "'Roboto Mono', monospace", "fontSize": "15px", "fontWeight": "700", "textTransform": "uppercase" }}>
              {lookup(v, "loading") ? "Ingresando…" : "Ingresar al panel "}
              <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} aria-hidden={"true"}>
                <path d={"M5 12h14M13 6l6 6-6 6"}></path>
              </svg>
            </button>
          </form>
          <div style={{ "display": "flex", "gap": "12px", "alignItems": "center", "padding": "14px 16px", "border": "1px dashed #111111", "borderRadius": "14px", "fontSize": "13px", "lineHeight": "1.45" }}>
            <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.8"} aria-hidden={"true"} style={{ "flex": "none" }}>
              <path d={"M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z"}></path>
            </svg>
            <span>
              {"Cada usuario tiene su rol: "}
              <strong>
                {"Administrador"}
              </strong>
              {", "}
              <strong>
                {"Vendedor"}
              </strong>
              {" o "}
              <strong>
                {"Almacén"}
              </strong>
              {". Se configuran en Configuración › Usuarios y roles."}
            </span>
          </div>
          <DesignLink href={"/tienda"} style={{ "fontFamily": "'Roboto Mono', monospace", "fontSize": "12px", "fontWeight": "700", "textTransform": "uppercase", "textUnderlineOffset": "4px", "alignSelf": "flex-start" }}>
            {"← Volver a la tienda"}
          </DesignLink>
        </div>
      </div>
    </div>
    </Fragment>
  )} />;
}
