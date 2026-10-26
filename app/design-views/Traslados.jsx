"use client";

import { Fragment } from "react";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
  constructor(props) {
    super(props);
    this.state = {
      menu: false, pinned: (() => { try { return localStorage.getItem('via-menu-pinned') === '1'; } catch (e) { return false; } })(),
      filter: 'Todos', sel: 'TR-034', stage: {}, extra: [],
      from: 'Almacén', to: 'Tienda', reason: 'Reponer tienda',
      rows: [{ p: 'foco', qty: 40 }], added: {}, created: ''
    };
  }
  renderVals() {
    const st = this.state;
    const money = (n) => 'S/ ' + n.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    const STATUS = {
      'Preparando': ['#FFF1E6', '#8A3B0A', 'M12 7v5l3 2M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z'],
      'En camino': ['#E3F1FF', '#0B4A8A', 'M3 7h11v9H3zM14 10h4l3 3v3h-7'],
      'Recibido': ['#E4F4E7', '#1B5E20', 'M5 12l5 5 9-10'],
      'Con diferencia': ['#FDE4E2', '#8E1C14', 'M12 3l9 16H3zM12 10v4M12 17h.01']
    };
    const ORDER = ['Preparando', 'En camino', 'Recibido'];
    // productos de ejemplo: nombre, lote más antiguo en almacén, costo, disponible en almacén
    const P = {
      foco: ['Foco LED 9 W luz cálida', 'L-1008', 4.1, 320],
      panel: ['Panel solar monocristalino 100 W', 'L-0805', 238, 14],
      gancho: ['Ganchos de pared (set de 3)', 'L-0840', 4.6, 60],
      llavero: ['Llavero linterna LED', 'L-0833', 3.2, 48],
      cable: ['Cable USB-C carga rápida 1 m', 'L-0901', 6.5, 210],
      ext: ['Extensión de uso rudo 5 m', 'L-0928', 24, 85],
      lamp: ['Lámpara de camping recargable', 'L-1012', 38, 40]
    };
    const LN = (p, sent, recv) => ({ p, sent, recv });
    const BASE = [
      { id: 'TR-035', date: '26 oct · 15:10', from: 'Almacén', to: 'Tienda', who: '[Almacén]', reason: 'Reponer tienda', stage: 0, lines: [LN('cable', 60, 60), LN('ext', 20, 20)] },
      { id: 'TR-034', date: '26 oct · 14:05', from: 'Almacén', to: 'Tienda', who: '[Almacén]', reason: 'Reponer tienda', stage: 1, lines: [LN('foco', 80, 80), LN('lamp', 12, 12), LN('gancho', 48, 46)] },
      { id: 'TR-033', date: '25 oct · 10:20', from: 'Tienda', to: 'Exhibición', who: 'Beltran C.', reason: 'Exhibición', stage: 2, lines: [LN('lamp', 4, 4), LN('panel', 1, 1)] },
      { id: 'TR-032', date: '24 oct · 16:45', from: 'Almacén', to: 'Tienda', who: '[Almacén]', reason: 'Reponer tienda', stage: 2, lines: [LN('foco', 40, 38), LN('llavero', 24, 24)] },
      { id: 'TR-031', date: '22 oct · 09:30', from: 'Tienda', to: 'Almacén', who: '[Vendedor]', reason: 'Devolución a almacén', stage: 2, lines: [LN('ext', 6, 6)] }
    ];
    const ALL = st.extra.concat(BASE);
    const stageOf = (t) => (t.id in st.stage ? st.stage[t.id] : t.stage);
    const diffOf = (t) => t.lines.reduce((a, l) => a + (l.sent - l.recv), 0);
    const statusOf = (t) => { const s = stageOf(t); return s < 2 ? ORDER[s] : (diffOf(t) > 0 ? 'Con diferencia' : 'Recibido'); };
    const F = ['Todos', 'Preparando', 'En camino', 'Recibido', 'Con diferencia'];
    const vis = ALL.filter((t) => st.filter === 'Todos' || statusOf(t) === st.filter);
    const S = ALL.find((t) => t.id === st.sel) || ALL[0];
    const sS = statusOf(S);
    const sSt = stageOf(S);
    const chip = (on) => ({ bg: on ? '#111111' : '#FFFFFF', fg: on ? '#FFFFFF' : '#111111', border: on ? '#111111' : '#E4E4E0', pressed: on ? 'true' : 'false' });
    const LOCS = ['Tienda', 'Almacén', 'Exhibición'];
    const rows = st.rows.map((r, i) => {
      const p = P[r.p];
      const upd = (q) => this.setState({ rows: st.rows.map((x, j) => (j === i ? { p: x.p, qty: q } : x)), created: '' });
      return {
        name: p[0], lot: p[1], avail: String(p[3]), qty: String(r.qty),
        minus: () => upd(Math.max(1, r.qty - 1)),
        plus: () => upd(Math.min(p[3], r.qty + 1)),
        remove: () => this.setState({ rows: st.rows.filter((_, j) => j !== i), created: '' })
      };
    });
    const units = st.rows.reduce((a, r) => a + r.qty, 0);
    const value = st.rows.reduce((a, r) => a + r.qty * P[r.p][2], 0);
    const same = st.from === st.to;
    const SUG = [['foco', 8, 40, 60], ['panel', 2, 5, 4], ['gancho', 0, 20, 30], ['llavero', 4, 15, 20]];
    const nextId = 'TR-0' + (36 + st.extra.length);
    const inTr = ALL.filter((t) => stageOf(t) < 2).length;
    return {
      accent: this.props.accent ?? '#FF914C',
      menuOpen: st.menu || !!this.props.menuAbierto,
      openMenu: () => this.setState({ menu: true }),
      closeMenu: () => this.setState({ menu: false }),
      pinned: this.state.pinned,
      menuBtnLabel: 'Abrir menú',
      menuBtn: () => this.setState({ menu: true }),
      togglePin: () => { const p = !this.state.pinned; try { localStorage.setItem('via-menu-pinned', p ? '1' : '0'); } catch (e) {} this.setState({ pinned: p, menu: false }); },
      openCount: String(inTr),
      headStats: [
        { v: String(18 + st.extra.length), k1: 'Traslados', k2: 'en octubre', bg: '#FFFFFF', fg: '#111111' },
        { v: String(ALL.filter((t) => stageOf(t) === 1).length), k1: 'En', k2: 'camino', bg: '#E3F1FF', fg: '#0B4A8A' },
        { v: String(ALL.filter((t) => statusOf(t) === 'Con diferencia').length), k1: 'Con', k2: 'diferencia', bg: '#FDE4E2', fg: '#8E1C14' },
        { v: '1,240', k1: 'Unidades', k2: 'movidas', bg: '#111111', fg: '#FFFFFF' }
      ],
      locations: [
        ['Tienda', 'Dean Valdivia 533 - Cercado', '724', 'S/ 8,093', '82%', '182 productos', '12 lotes', 'M3 9l1-5h16l1 5M4 9v11h16V9M3 9h18'],
        ['Almacén', '[DIRECCIÓN DEL ALMACÉN]', '1,860', 'S/ 21,450', '64%', '214 productos', '27 lotes', 'M3 21V8l9-5 9 5v13M7 21v-8h10v8M7 17h10'],
        ['Exhibición', 'Vitrina de la tienda', '96', 'S/ 2,310', '40%', '38 productos', '9 lotes', 'M4 4h16v12H4zM8 20h8M12 16v4']
      ].map((l) => ({ name: l[0], addr: l[1], units: l[2], value: l[3], cap: l[4], products: l[5], lots: l[6], icon: l[7] })),
      selTransit: () => this.setState({ sel: 'TR-034', filter: 'Todos' }),
      filters: F.map((f) => ({ name: f, n: String(f === 'Todos' ? ALL.length : ALL.filter((t) => statusOf(t) === f).length), ...chip(st.filter === f), pick: () => this.setState({ filter: f }) })),
      rows: vis.map((t) => {
        const s = statusOf(t);
        const on = t.id === S.id;
        return {
          id: t.id, date: t.date, from: t.from, to: t.to, who: t.who,
          items: t.lines.length + (t.lines.length === 1 ? ' producto' : ' productos') + ' · ' + t.lines.reduce((a, l) => a + l.sent, 0) + ' u.',
          lots: t.lines.map((l) => P[l.p][1]).join(', '),
          status: s, sbg: STATUS[s][0], sfg: STATUS[s][1], sicon: STATUS[s][2],
          border: on ? '#111111' : 'transparent', pressed: on ? 'true' : 'false', cls: on ? '' : 'tr-row',
          pick: () => this.setState({ sel: t.id })
        };
      }),
      noRows: vis.length === 0,
      d: {
        id: S.id, date: S.date, from: S.from, to: S.to, who: S.who, reason: S.reason,
        status: sS, sbg: STATUS[sS][0], sfg: STATUS[sS][1], sicon: STATUS[sS][2],
        lines: S.lines.map((l) => {
          const done = sSt >= 2;
          const diff = l.sent - l.recv;
          const bad = done && diff > 0;
          return {
            name: P[l.p][0], lot: P[l.p][1], sent: String(l.sent),
            recv: done ? String(l.recv) : '—', recvFg: bad ? '#8E1C14' : '#111111',
            diff: !done ? 'Por recibir' : (diff > 0 ? 'Faltan ' + diff : 'Completo'),
            dbg: !done ? '#EFEFEC' : (diff > 0 ? '#FDE4E2' : '#E4F4E7'),
            dfg: !done ? '#6B6B6B' : (diff > 0 ? '#8E1C14' : '#1B5E20'),
            dicon: !done ? 'M12 7v5l3 2' : (diff > 0 ? 'M12 3l9 16H3zM12 10v4M12 17h.01' : 'M5 12l5 5 9-10')
          };
        }),
        totalSent: String(S.lines.reduce((a, l) => a + l.sent, 0)),
        totalValue: money(S.lines.reduce((a, l) => a + l.sent * P[l.p][2], 0)) + ' a costo',
        hasDiff: sSt >= 2 && diffOf(S) > 0,
        diffText: 'Llegaron ' + diffOf(S) + (diffOf(S) === 1 ? ' unidad menos' : ' unidades menos') + ' de lo enviado.',
        canAct: sSt < 2,
        actLabel: sSt === 0 ? 'Marcar como enviado' : 'Confirmar recepción',
        actHint: sSt === 0 ? 'Descuenta el stock de ' + S.from + ' y lo deja en camino.' : 'Suma el stock a ' + S.to + ' y compara lo enviado con lo recibido.',
        act: () => this.setState({ stage: { ...st.stage, [S.id]: sSt + 1 } })
      },
      fromOpts: LOCS.map((l) => ({ name: l, ...chip(st.from === l), pick: () => this.setState({ from: l, created: '' }) })),
      toOpts: LOCS.map((l) => ({ name: l, ...chip(st.to === l), pick: () => this.setState({ to: l, created: '' }) })),
      swap: () => this.setState({ from: st.to, to: st.from, created: '' }),
      sameLoc: same,
      formRows: rows,
      noFormRows: rows.length === 0,
      addRow: () => {
        const keys = Object.keys(P).filter((k) => !st.rows.some((r) => r.p === k));
        if (keys.length) this.setState({ rows: st.rows.concat([{ p: keys[0], qty: 10 }]), created: '' });
      },
      reasons: ['Reponer tienda', 'Exhibición', 'Devolución a almacén'].map((r) => ({ name: r, ...chip(st.reason === r), pick: () => this.setState({ reason: r }) })),
      formSummary: rows.length ? rows.length + (rows.length === 1 ? ' producto' : ' productos') + ' · ' + units + ' unidades · ' + money(value) + ' a costo' : 'Sin productos',
      createTr: () => {
        if (same || !st.rows.length) return;
        const t = { id: nextId, date: '26 oct · ahora', from: st.from, to: st.to, who: 'Beltran C.', reason: st.reason, stage: 0, lines: st.rows.map((r) => LN(r.p, r.qty, r.qty)) };
        this.setState({ extra: [t].concat(st.extra), sel: nextId, filter: 'Todos', rows: [], added: {}, created: nextId + ' creado: ' + st.from + ' → ' + st.to + ', ' + units + ' unidades. Queda en “Preparando”.' });
      },
      created: !!st.created,
      createdText: st.created,
      sugg: SUG.map((s) => {
        const on = !!st.added[s[0]] || st.rows.some((r) => r.p === s[0]);
        return {
          name: P[s[0]][0], lot: P[s[0]][1], store: String(s[1]), min: String(s[2]), wh: String(P[s[0]][3]), qty: String(s[3]),
          label: on ? 'Agregado ✓' : 'Agregar', pressed: on ? 'true' : 'false',
          bg: on ? '#2A2A2A' : '#FF914C', fg: on ? '#FFFFFF' : '#111111',
          add: () => { if (!on) this.setState({ rows: st.rows.concat([{ p: s[0], qty: s[3] }]), added: { ...st.added, [s[0]]: true }, from: 'Almacén', to: 'Tienda', reason: 'Reponer tienda', created: '' }); }
        };
      })
    };
  }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Traslados(props) {
  return <DesignHost Logic={Component} defaults={defaults} componentProps={props} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.tr-row:hover{background:#ECECE9}\n"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          {Boolean(lookup(v, "pinned")) && (
            <Fragment>
              <div style={{ "padding": "20px 20px 0" }}>
                <DesignImport name={"MenuPanel"} mode={"bar"} active={"Traslados"} onPin={lookup(v, "togglePin")} />
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
                    <clipPath id={"via-clip-tra"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-tra)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </a>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Traslados"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Entre ubicaciones"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <a href={"#nuevo-traslado"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Nuevo traslado"}
                </a>
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
                    {"Buscar traslado"}
                  </span>
                  <input type={"search"} placeholder={"N° de traslado o lote…"} style={{ "width": "170px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>
              </div>
              <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Traslados"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "openCount")}
                    {" en curso hoy"}
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
            <div style={{ "background": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              <div style={{ "display": "flex", "gap": "14px", "flexWrap": "wrap" }}>
                {(lookup(v, "locations") || []).map((l, index2) => (
                  <Fragment key={index2}>
                    <div style={{ "flex": "1 1 250px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                        <span style={{ "width": "44px", "height": "44px", "borderRadius": "50%", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(l, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                          <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                            {lookup(l, "name")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                            {lookup(l, "addr")}
                          </span>
                        </span>
                      </div>
                      <div style={{ "display": "flex", "alignItems": "baseline", "justifyContent": "space-between", "gap": "10px" }}>
                        <span style={{ "fontSize": "32px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                          {lookup(l, "units")}
                          <span style={{ "fontSize": "13px", "fontWeight": "600", "color": "#8C8C8C" }}>
                            {" unidades"}
                          </span>
                        </span>
                        <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                          {lookup(l, "value")}
                        </span>
                      </div>
                      <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px" }}>
                        <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px", "color": "#6B6B6B" }}>
                          <span>
                            {"Espacio ocupado"}
                          </span>
                          <span style={{ "fontWeight": "700", "color": "#111111" }}>
                            {lookup(l, "cap")}
                          </span>
                        </span>
                        <span style={{ "height": "8px", "borderRadius": "999px", "background": "#FFFFFF" }}>
                          <span style={{ "display": "block", "width": lookup(l, "cap"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                        </span>
                      </div>
                      <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                        <span style={{ "height": "28px", "padding": "0 12px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "12px", "fontWeight": "600", "display": "flex", "alignItems": "center" }}>
                          {lookup(l, "products")}
                        </span>
                        <span style={{ "height": "28px", "padding": "0 12px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "12px", "fontWeight": "600", "display": "flex", "alignItems": "center" }}>
                          {lookup(l, "lots")}
                        </span>
                      </div>
                    </div>
                  </Fragment>
                ))}
                <div style={{ "flex": "1 1 280px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "15px", "fontWeight": "700" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FF914C"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 1 0 0-.1M17 19a2 2 0 1 0 0-.1"}></path>
                    </svg>
                    {"En camino ahora"}
                  </span>
                  <span style={{ "fontSize": "28px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                    {"TR-034"}
                  </span>
                  <span style={{ "display": "flex", "alignItems": "center", "gap": "10px", "fontSize": "14px", "fontWeight": "600" }}>
                    <span>
                      {"Almacén"}
                    </span>
                    <svg width={"22"} height={"12"} viewBox={"0 0 22 12"} fill={"none"} stroke={"#FF914C"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M1 6h19M15 1l5 5-5 5"}></path>
                    </svg>
                    <span>
                      {"Tienda"}
                    </span>
                  </span>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "2px" }}>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "9px 0", "borderTop": "1px solid #2A2A2A", "fontSize": "13px" }}>
                      <span style={{ "color": "#CFCFCF" }}>
                        {"Salió"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"14:05"}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "9px 0", "borderTop": "1px solid #2A2A2A", "fontSize": "13px" }}>
                      <span style={{ "color": "#CFCFCF" }}>
                        {"Llega aprox."}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"15:30"}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "9px 0", "borderTop": "1px solid #2A2A2A", "fontSize": "13px" }}>
                      <span style={{ "color": "#CFCFCF" }}>
                        {"Lleva"}
                      </span>
                      <span style={{ "fontWeight": "700" }}>
                        {"3 productos · 140 u."}
                      </span>
                    </div>
                  </div>
                  <button onClick={lookup(v, "selTransit")} style={{ "marginTop": "auto", "height": "44px", "borderRadius": "999px", "border": "none", "background": "#FF914C", "color": "#111111", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "800" }}>
                    {"Ver y recibir"}
                  </button>
                </div>
              </div>
              <div style={{ "display": "flex", "gap": "14px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
                <div style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700", "marginRight": "auto" }}>
                      {"Traslados de octubre"}
                    </span>
                    {(lookup(v, "filters") || []).map((f, index3) => (
                      <Fragment key={index3}>
                        <button onClick={lookup(f, "pick")} aria-pressed={lookup(f, "pressed")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(f, "border") ?? ""), "background": lookup(f, "bg"), "color": lookup(f, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                          {lookup(f, "name")}
                          {" · "}
                          {lookup(f, "n")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ "display": "grid", "gridTemplateColumns": "96px minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) 150px", "gap": "10px", "padding": "0 14px", "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                    <span>
                      {"N°"}
                    </span>
                    <span>
                      {"Ruta"}
                    </span>
                    <span>
                      {"Contenido"}
                    </span>
                    <span>
                      {"Responsable"}
                    </span>
                    <span>
                      {"Estado"}
                    </span>
                  </div>
                  {(lookup(v, "rows") || []).map((r, index4) => (
                    <Fragment key={index4}>
                      <button onClick={lookup(r, "pick")} className={lookup(r, "cls")} aria-pressed={lookup(r, "pressed")} style={{ "display": "grid", "gridTemplateColumns": "96px minmax(0, 1.5fr) minmax(0, 1fr) minmax(0, 1fr) 150px", "gap": "10px", "alignItems": "center", "minHeight": "64px", "padding": "10px 14px", "borderRadius": "20px", "border": "2px solid " + String(lookup(r, "border") ?? ""), "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "textAlign": "left", "color": "#111111" }}>
                        <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                          <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                            {lookup(r, "id")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                            {lookup(r, "date")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "13px", "fontWeight": "700", "minWidth": "0" }}>
                          <span>
                            {lookup(r, "from")}
                          </span>
                          <svg width={"20"} height={"10"} viewBox={"0 0 22 12"} fill={"none"} stroke={"#E8701F"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                            <path d={"M1 6h19M15 1l5 5-5 5"}></path>
                          </svg>
                          <span>
                            {lookup(r, "to")}
                          </span>
                        </span>
                        <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.3", "fontSize": "12px" }}>
                          <span style={{ "fontWeight": "700" }}>
                            {lookup(r, "items")}
                          </span>
                          <span style={{ "color": "#8C8C8C" }}>
                            {lookup(r, "lots")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "12px", "color": "#444444" }}>
                          {lookup(r, "who")}
                        </span>
                        <span style={{ "justifySelf": "start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "28px", "padding": "0 10px", "borderRadius": "999px", "background": lookup(r, "sbg"), "color": lookup(r, "sfg"), "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                          <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(r, "sicon")}></path>
                          </svg>
                          {lookup(r, "status")}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                  {Boolean(lookup(v, "noRows")) && (
                    <Fragment>
                      <span style={{ "padding": "22px", "borderRadius": "20px", "background": "#FFFFFF", "fontSize": "13px", "color": "#6B6B6B" }}>
                        {"No hay traslados con ese estado."}
                      </span>
                    </Fragment>
                  )}
                </div>
                <div style={{ "flex": "1 1 400px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "alignItems": "flex-start", "justifyContent": "space-between", "gap": "10px" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                        {"Traslado "}
                        {lookup(v, "d.date")}
                      </span>
                      <span style={{ "fontSize": "26px", "fontWeight": "700", "letterSpacing": "-0.02em" }}>
                        {lookup(v, "d.id")}
                      </span>
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "height": "30px", "padding": "0 12px", "borderRadius": "999px", "background": lookup(v, "d.sbg"), "color": lookup(v, "d.sfg"), "fontSize": "12px", "fontWeight": "700" }}>
                      <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(v, "d.sicon")}></path>
                      </svg>
                      {lookup(v, "d.status")}
                    </span>
                  </div>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "14px", "borderRadius": "20px", "background": "#FFFFFF" }}>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                      <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                        {"Sale de"}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                        {lookup(v, "d.from")}
                      </span>
                    </span>
                    <svg width={"28"} height={"14"} viewBox={"0 0 22 12"} fill={"none"} stroke={"#E8701F"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                      <path d={"M1 6h19M15 1l5 5-5 5"}></path>
                    </svg>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column", "lineHeight": "1.25", "textAlign": "right" }}>
                      <span style={{ "fontSize": "11px", "color": "#8C8C8C" }}>
                        {"Llega a"}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                        {lookup(v, "d.to")}
                      </span>
                    </span>
                  </div>
                  <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                    {"Motivo: "}
                    <strong style={{ "color": "#111111" }}>
                      {lookup(v, "d.reason")}
                    </strong>
                    {" · Responsable: "}
                    {lookup(v, "d.who")}
                  </span>
                  <div style={{ "display": "grid", "gridTemplateColumns": "minmax(0, 1fr) 54px 64px 78px", "gap": "8px", "padding": "0 12px", "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C", "textTransform": "uppercase", "letterSpacing": "0.04em" }}>
                    <span>
                      {"Producto y lote"}
                    </span>
                    <span style={{ "textAlign": "right" }}>
                      {"Envió"}
                    </span>
                    <span style={{ "textAlign": "right" }}>
                      {"Recibió"}
                    </span>
                    <span style={{ "textAlign": "right" }}>
                      {"Diferencia"}
                    </span>
                  </div>
                  {(lookup(v, "d.lines") || []).map((x, index5) => (
                    <Fragment key={index5}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "minmax(0, 1fr) 54px 64px 78px", "gap": "8px", "alignItems": "center", "padding": "10px 12px", "borderRadius": "18px", "background": "#FFFFFF" }}>
                        <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.3", "minWidth": "0" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(x, "name")}
                          </span>
                          <a href={"/kardex"} style={{ "fontSize": "12px", "color": "#C2410C", "fontWeight": "700", "textUnderlineOffset": "3px" }}>
                            {"Lote "}
                            {lookup(x, "lot")}
                            {" · ver kardex"}
                          </a>
                        </span>
                        <span style={{ "textAlign": "right", "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(x, "sent")}
                        </span>
                        <span style={{ "textAlign": "right", "fontSize": "14px", "fontWeight": "700", "color": lookup(x, "recvFg") }}>
                          {lookup(x, "recv")}
                        </span>
                        <span style={{ "justifySelf": "end", "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "26px", "padding": "0 8px", "borderRadius": "999px", "background": lookup(x, "dbg"), "color": lookup(x, "dfg"), "fontSize": "12px", "fontWeight": "700", "whiteSpace": "nowrap" }}>
                          <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(x, "dicon")}></path>
                          </svg>
                          {lookup(x, "diff")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <div style={{ "display": "flex", "justifyContent": "space-between", "padding": "4px 12px", "fontSize": "13px" }}>
                    <span style={{ "color": "#6B6B6B" }}>
                      {"Total enviado"}
                    </span>
                    <span style={{ "fontWeight": "800" }}>
                      {lookup(v, "d.totalSent")}
                      {" u. · "}
                      {lookup(v, "d.totalValue")}
                    </span>
                  </div>
                  {Boolean(lookup(v, "d.hasDiff")) && (
                    <Fragment>
                      <div role={"status"} style={{ "display": "flex", "gap": "10px", "alignItems": "flex-start", "padding": "12px 14px", "borderRadius": "18px", "background": "#FDE4E2", "color": "#8E1C14", "fontSize": "13px", "lineHeight": "1.45" }}>
                        <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                          <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                        </svg>
                        <span>
                          {lookup(v, "d.diffText")}
                          {" Se registró como ajuste en el kardex del lote y queda pendiente de revisión."}
                        </span>
                      </div>
                    </Fragment>
                  )}
                  {Boolean(lookup(v, "d.canAct")) && (
                    <Fragment>
                      <button onClick={lookup(v, "d.act")} style={{ "height": "50px", "borderRadius": "999px", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#FF914C"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                        {lookup(v, "d.actLabel")}
                      </button>
                      <span style={{ "fontSize": "12px", "color": "#8C8C8C", "textAlign": "center" }}>
                        {lookup(v, "d.actHint")}
                      </span>
                    </Fragment>
                  )}
                </div>
              </div>
              <div style={{ "display": "flex", "gap": "14px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
                <div id={"nuevo-traslado"} style={{ "flex": "999 1 560px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                    <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                      {"Nuevo traslado"}
                    </span>
                    <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                      {"Elige de dónde sale, a dónde va y qué lotes se mueven."}
                    </span>
                  </span>
                  <div style={{ "display": "flex", "gap": "12px", "flexWrap": "wrap", "alignItems": "flex-end" }}>
                    <div style={{ "flex": "1 1 200px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                        {"Sale de"}
                      </span>
                      <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                        {(lookup(v, "fromOpts") || []).map((o, index6) => (
                          <Fragment key={index6}>
                            <button onClick={lookup(o, "pick")} aria-pressed={lookup(o, "pressed")} style={{ "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(o, "border") ?? ""), "background": lookup(o, "bg"), "color": lookup(o, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(o, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <button onClick={lookup(v, "swap")} aria-label={"Invertir origen y destino"} style={{ "width": "40px", "height": "40px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M4 8h13l-3-3M20 16H7l3 3"}></path>
                      </svg>
                    </button>
                    <div style={{ "flex": "1 1 200px", "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                        {"Llega a"}
                      </span>
                      <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                        {(lookup(v, "toOpts") || []).map((o, index7) => (
                          <Fragment key={index7}>
                            <button onClick={lookup(o, "pick")} aria-pressed={lookup(o, "pressed")} style={{ "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(o, "border") ?? ""), "background": lookup(o, "bg"), "color": lookup(o, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(o, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  {Boolean(lookup(v, "sameLoc")) && (
                    <Fragment>
                      <span role={"alert"} style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "13px", "fontWeight": "600", "color": "#8E1C14" }}>
                        <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                          <path d={"M12 3l9 16H3zM12 10v4M12 17h.01"}></path>
                        </svg>
                        {"El origen y el destino no pueden ser el mismo lugar."}
                      </span>
                    </Fragment>
                  )}
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                      {"Productos y lotes"}
                    </span>
                    {(lookup(v, "formRows") || []).map((f, index8) => (
                      <Fragment key={index8}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "flexWrap": "wrap", "padding": "10px 12px", "borderRadius": "18px", "background": "#FFFFFF" }}>
                          <span style={{ "flex": "1 1 220px", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(f, "name")}
                            </span>
                            <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                              {"Lote "}
                              {lookup(f, "lot")}
                              {" · hay "}
                              {lookup(f, "avail")}
                              {" en origen"}
                            </span>
                          </span>
                          <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "height": "40px", "padding": "0 4px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                            <button onClick={lookup(f, "minus")} aria-label={"Quitar una unidad"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "16px", "fontWeight": "700" }}>
                              {"−"}
                            </button>
                            <span style={{ "minWidth": "40px", "textAlign": "center", "fontSize": "14px", "fontWeight": "800" }}>
                              {lookup(f, "qty")}
                            </span>
                            <button onClick={lookup(f, "plus")} aria-label={"Agregar una unidad"} style={{ "width": "32px", "height": "32px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "16px", "fontWeight": "700" }}>
                              {"+"}
                            </button>
                          </span>
                          <button onClick={lookup(f, "remove")} aria-label={"Quitar producto"} style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2.2"} strokeLinecap={"round"} aria-hidden={"true"}>
                              <path d={"M6 6l12 12M18 6L6 18"}></path>
                            </svg>
                          </button>
                        </div>
                      </Fragment>
                    ))}
                    {Boolean(lookup(v, "noFormRows")) && (
                      <Fragment>
                        <span style={{ "padding": "16px", "borderRadius": "18px", "border": "1px dashed #BDBDBD", "fontSize": "13px", "color": "#6B6B6B" }}>
                          {"Todavía no agregaste productos. Usa “Agregar producto” o las sugerencias de la derecha."}
                        </span>
                      </Fragment>
                    )}
                    <button onClick={lookup(v, "addRow")} style={{ "alignSelf": "flex-start", "height": "40px", "padding": "0 16px", "borderRadius": "999px", "border": "1px dashed #111111", "background": "transparent", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                      {"+ Agregar producto"}
                    </button>
                  </div>
                  <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                    <span style={{ "fontSize": "12px", "fontWeight": "700", "color": "#6B6B6B" }}>
                      {"Motivo"}
                    </span>
                    <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "reasons") || []).map((o, index9) => (
                        <Fragment key={index9}>
                          <button onClick={lookup(o, "pick")} aria-pressed={lookup(o, "pressed")} style={{ "height": "40px", "padding": "0 14px", "borderRadius": "999px", "border": "1px solid " + String(lookup(o, "border") ?? ""), "background": lookup(o, "bg"), "color": lookup(o, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(o, "name")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "flexWrap": "wrap", "paddingTop": "4px" }}>
                    <span style={{ "fontSize": "13px", "color": "#6B6B6B", "marginRight": "auto" }}>
                      {lookup(v, "formSummary")}
                    </span>
                    <button onClick={lookup(v, "createTr")} style={{ "height": "50px", "padding": "0 24px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "800" }}>
                      {"Crear traslado"}
                    </button>
                  </div>
                  {Boolean(lookup(v, "created")) && (
                    <Fragment>
                      <div role={"status"} style={{ "display": "flex", "alignItems": "center", "gap": "10px", "padding": "12px 14px", "borderRadius": "18px", "background": "#E4F4E7", "color": "#1B5E20", "fontSize": "13px", "fontWeight": "600" }}>
                        <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                        {lookup(v, "createdText")}
                      </div>
                    </Fragment>
                  )}
                </div>
                <div style={{ "flex": "1 1 340px", "minWidth": "0", "borderRadius": "30px", "background": "#111111", "color": "#FFFFFF", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "12px" }}>
                  <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Sugerencia: reponer la tienda"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#9A9A9A" }}>
                      {"Poco stock en Tienda, pero hay en Almacén"}
                    </span>
                  </span>
                  {(lookup(v, "sugg") || []).map((s, index10) => (
                    <Fragment key={index10}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px", "borderRadius": "20px", "background": "#1E1E1E" }}>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "4px", "lineHeight": "1.25" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(s, "name")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#BDBDBD" }}>
                            {"Tienda "}
                            {lookup(s, "store")}
                            {" · mín. "}
                            {lookup(s, "min")}
                            {" · Almacén "}
                            {lookup(s, "wh")}
                          </span>
                          <span style={{ "fontSize": "11px", "color": "#FF914C", "fontWeight": "700" }}>
                            {"Lote "}
                            {lookup(s, "lot")}
                            {" · llevar "}
                            {lookup(s, "qty")}
                          </span>
                        </span>
                        <button onClick={lookup(s, "add")} aria-pressed={lookup(s, "pressed")} style={{ "height": "36px", "padding": "0 14px", "borderRadius": "999px", "border": "none", "background": lookup(s, "bg"), "color": lookup(s, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "800", "whiteSpace": "nowrap" }}>
                          {lookup(s, "label")}
                        </button>
                      </div>
                    </Fragment>
                  ))}
                  <span style={{ "fontSize": "11px", "color": "#9A9A9A", "lineHeight": "1.5" }}>
                    {"Se sugiere el lote más antiguo con stock, para respetar el orden de salida (PEPS). Datos de ejemplo."}
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
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Traslados"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
