"use client";

import { Fragment, useEffect, useState } from "react";
import { useUbicacionTrabajo } from "../ubicacion-trabajo";
import { listarAlmacenes, listarCajasMostrador, catalogoMostrador, ventasMostrador, venderMostrador } from "../backend-api";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
 constructor(p){super(p);this.state={menu:false,pinned:(()=>{try{return localStorage.getItem('via-menu-pinned')==='1'}catch{return false}})(),q:'',cat:'Todos',lines:{},order:[],pay:'Efectivo',received:0,ref:'',done:null,busy:false,error:'',key:crypto.randomUUID()};}
 renderVals(){
 const st=this.state,data=this.props.data||{datos:[],tasaIgv:.18,preciosIncluyenIgv:true},caja=this.props.caja,rows=data.datos||[],by=Object.fromEntries(rows.map(p=>[p.productoId+':'+(p.varianteId||''),p])),money=n=>'S/ '+(Number(n)||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2}),round=n=>Math.round((n+Number.EPSILON)*100)/100;
 const setQty=(id,n)=>{const p=by[id];if(!p)return;const qty=Math.max(0,Math.min(n,p.stock)),lines={...st.lines};let order=st.order.slice();if(!qty){delete lines[id];order=order.filter(x=>x!==id)}else{if(!lines[id])order.push(id);lines[id]=qty}this.setState({lines,order,received:0,key:crypto.randomUUID()})};
 let sub=0,igv=0;const lines=st.order.filter(id=>st.lines[id]&&by[id]).map(id=>{const p=by[id],qty=st.lines[id],amount=round(p.precio*qty),base=data.preciosIncluyenIgv?round(amount/(1+p.tasaIgv)):amount,tax=data.preciosIncluyenIgv?round(amount-base):round(base*p.tasaIgv);sub=round(sub+base);igv=round(igv+tax);return{name:p.nombre,unit:money(p.precio),lot:p.primerLote?'Primer lote '+p.primerLote:'Sin lote',qty:String(qty),total:money(base+tax),dec:()=>setQty(id,qty-1),inc:()=>setQty(id,qty+1),remove:()=>setQty(id,0),warn:p.stock-qty<=3,left:String(p.stock-qty)}});
 const total=round(sub+igv),units=Object.values(st.lines).reduce((a,n)=>a+n,0),cash=st.pay==='Efectivo',received=st.received===-1?total:Number(st.received),change=round(received-total),can=!!caja&&total>0&&!st.busy&&(cash?received>=total:!!st.ref.trim());
 const products=rows.filter(p=>(st.cat==='Todos'||st.cat===p.categoria)&&(!st.q.trim()||(p.nombre+' '+p.sku+' '+(p.skuProducto||'')+' '+(p.codigoBarras||'')).toLowerCase().includes(st.q.trim().toLowerCase()))).map(p=>{const id=p.productoId+':'+(p.varianteId||''),out=p.stock<=0||p.precio==null||p.precio<=0||p.estadoProducto==='borrador',inT=st.lines[id]||0,reason=p.estadoProducto==='borrador'?'Producto en borrador · cámbialo a Publicado u Oculto para vender':p.precio==null?'Falta precio público':p.precio<=0?'El precio debe ser mayor que cero':p.stock<=0?'Sin stock vendible en esta ubicación':'';return{productoId:p.productoId,reason,blocked:out,name:p.nombre,price:p.precio==null?'Sin precio':money(p.precio),img:p.imagen||'',hasImg:!!p.imagen,noImg:!p.imagen,stock:p.stock+' disponibles en esta ubicación',stockFg:out?'#B3261E':'#1B5E20',stockIcon:out?'M6 6l12 12M18 6L6 18':'M5 12l5 5 9-10',lot:p.primerLote?'Primer lote '+p.primerLote:'Sin lote',inTicket:inT>0,qty:String(inT),border:inT?'#E8701F':'transparent',cls:out?'':'pv-card',cursor:out?'not-allowed':'pointer',o:'1',aria:out?p.nombre+': '+reason:'Agregar '+p.nombre,add:()=>{if(!out)setQty(id,inT+1)}}});
 const sales=this.props.sales||[],sold=sales.filter(x=>x.estado!=='cancelado'),sum=sold.reduce((n,x)=>n+x.monto-(x.reembolsado||0),0),methods=[['Efectivo','M3 6h18v12H3z'],['Yape','M7 3h10v18H7z'],['Plin','M7 3h10v18H7z'],['Tarjeta','M3 6h18v12H3z'],['Transferencia','M4 8h13l-3-3']];
 return{accent:this.props.accent??'#FF914C',menuOpen:st.menu||!!this.props.menuAbierto,menuBtnLabel:'Abrir menú',menuBtn:()=>this.setState({menu:true}),closeMenu:()=>this.setState({menu:false}),pinned:st.pinned,togglePin:()=>{const p=!st.pinned;try{localStorage.setItem('via-menu-pinned',p?'1':'0')}catch{}this.setState({pinned:p,menu:false})},headStats:[[money(sum),'Vendido','en esta caja','#111','#fff'],[String(sold.length),'Ventas','en esta caja','#fff','#111'],[money(sold.length?sum/sold.length:0),'Ticket','promedio','#fff','#111']].map(h=>({v:h[0],k1:h[1],k2:h[2],bg:h[3],fg:h[4]})),onSearch:e=>this.setState({q:e.target.value}),emptyTitle:!this.props.almacenId?'Selecciona una ubicación':this.props.catalogError?'No se pudo cargar el catálogo':!this.props.catalogLoaded?'Cargando productos…':'No encontramos productos',emptyNote:!this.props.almacenId?'Elige la tienda o almacén para consultar sus productos.':this.props.catalogError?this.props.catalogError:!this.props.catalogLoaded?'Espera un momento.':'Prueba con otro nombre, SKU o código de barras.',cats:['Todos',...new Set(rows.map(p=>p.categoria))].map(c=>({name:c,pick:()=>this.setState({cat:c}),pressed:st.cat===c?'true':'false',bg:st.cat===c?'#111':'#F4F4F2',fg:st.cat===c?'#fff':'#111'})),products,noProducts:!products.length,
 sales:sales.map(x=>({doc:x.numero,items:x.estado==='cancelado'?'Cancelada':'Venta interna',time:new Date(x.recibidoEn).toLocaleTimeString('es-PE',{hour:'2-digit',minute:'2-digit'}),method:x.medioPago,total:money(x.monto),bg:'#FFF1E6',fg:'#8A3B0A',icon:'M6 3h12v18l-3-2-3 2-3-2-3 2z'})),done:!!st.done,editing:!st.done,doneTotal:st.done?money(st.done.total):'',doneDoc:st.done?'Venta interna '+st.done.numero:'',doneMethod:st.pay,doneLots:'Stock actualizado',doneChange:!!(st.done&&st.done.change>0),doneChangeText:st.done?money(st.done.change):'',newSale:()=>this.setState({done:null,lines:{},order:[],received:0,ref:'',key:crypto.randomUUID()}),
 ticketCount:units?units+' unidades':'Vacío',clients:[{name:'Consumidor final',pick:()=>{},pressed:'true',bg:'#111',fg:'#fff'}],needsDoc:false,lists:[{name:'Público',pick:()=>{},pressed:'true',bg:'#111',fg:'#fff',border:'#111'}],listName:'Público',empty:!lines.length,lines,subtotal:money(sub),hasDisc:false,igv:money(igv),igvLabel:'IGV'+(data.preciosIncluyenIgv?' incluido':''),total:money(total),
 methods:methods.map(m=>({name:m[0],icon:m[1],pick:()=>this.setState({pay:m[0],received:0,ref:'',key:crypto.randomUUID()}),pressed:st.pay===m[0]?'true':'false',bg:st.pay===m[0]?'#111':'#F4F4F2',fg:st.pay===m[0]?'#fff':'#111'})),isCash:cash,receivedText:money(received),onReceived:e=>this.setState({received:Number(e.target.value),key:crypto.randomUUID()}),onReference:e=>this.setState({ref:e.target.value,key:crypto.randomUUID()}),quick:[[50,'S/ 50'],[100,'S/ 100'],[200,'S/ 200'],[-1,'Exacto']].map(x=>({label:x[1],pick:()=>this.setState({received:x[0],key:crypto.randomUUID()}),bg:st.received===x[0]?'#111':'#fff',fg:st.received===x[0]?'#fff':'#111'})),changeLabel:!received?'Indica cuánto recibiste':change>=0?'Vuelto':'Falta',changeText:received?money(Math.abs(change)):'',changeFg:change>=0?'#1B5E20':'#B3261E',changeIcon:'M12 7v5l3 2',docs:[{name:'Nota interna',pick:()=>{},pressed:'true',bg:'#111',fg:'#fff'}],docWarn:false,error:st.error,chargeText:st.busy?'Registrando…':!caja?'Selecciona una caja':total?'Cobrar '+money(total):'Agrega productos',chargeBg:can?'#E8701F':'#BDBDBD',chargeCursor:can?'pointer':'not-allowed',chargeDisabled:!can,
 charge:async()=>{if(!can)return;this.setState({busy:true,error:''});try{const r=await venderMostrador({cajaId:caja.id,claveIdempotencia:st.key,lineas:st.order.filter(id=>st.lines[id]&&by[id]).map(id=>({productoId:by[id].productoId,varianteId:by[id].varianteId,cantidad:st.lines[id],precioEsperado:by[id].precio})),medioPago:st.pay,referencia:st.ref,recibido:received});this.setState({done:{...r.datos,change:cash?change:0},busy:false});this.props.reload()}catch(e){this.setState({error:e.message,busy:false})}}
 };}
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function PuntoVenta(props) {
  const [almacenes,setAlmacenes]=useState([]),[cajas,setCajas]=useState([]),[almacenId,setAlmacenId]=useState(''),[cajaId,setCajaId]=useState(''),[data,setData]=useState(null),[catalogError,setCatalogError]=useState(''),[sales,setSales]=useState([]),[error,setError]=useState(''),[version,setVersion]=useState(0),[notice,setNotice]=useState('');
  const ubicacionTrabajo=useUbicacionTrabajo();
  const reload=()=>setVersion(n=>n+1);
  useEffect(()=>{setAlmacenId(ubicacionTrabajo.actual?.id || '');},[ubicacionTrabajo.actual?.id]);
  useEffect(()=>{const ac=new AbortController();Promise.all([listarAlmacenes(ac.signal),listarCajasMostrador(ac.signal)]).then(([a,c])=>{const active=a.datos.filter(x=>x.activo);setAlmacenes(active);setCajas(c.datos);setAlmacenId(id=>active.some(x=>x.id===id)?id:'');setError('')}).catch(e=>{if(e.name!=='AbortError')setError(e.message)});return()=>ac.abort()},[version]);
  const abiertas=cajas.filter(c=>c.almacenId===almacenId);
  const caja=abiertas.find(c=>c.id===cajaId);
  useEffect(()=>{setCajaId(id=>abiertas.some(c=>c.id===id)?id:abiertas.length===1?abiertas[0].id:'')},[almacenId,cajas]);
  useEffect(()=>{const ac=new AbortController();setData(null);setCatalogError('');setSales([]);if(almacenId)catalogoMostrador(almacenId,ac.signal).then(setData).catch(e=>{if(e.name!=='AbortError')setCatalogError(e.message)});if(caja)ventasMostrador(caja.id,ac.signal).then(r=>setSales(r.datos)).catch(e=>{if(e.name!=='AbortError')setError(e.message)});return()=>ac.abort()},[almacenId,caja?.id,version]);

  return <DesignHost key={almacenId+':'+(caja?.id||'')} Logic={Component} defaults={defaults} componentProps={{...props,data,caja,sales,reload,almacenId,catalogLoaded:!!data,catalogError}} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n.pv-card{transition:transform .12s ease, box-shadow .12s ease}\n.pv-card:hover{transform:translateY(-2px);box-shadow:0 10px 24px rgba(17,17,17,0.08)}\n"}</style>
      <style>{"\n.pv-shell{--pv-orange:#e8701f}.pv-shell button,.pv-shell a,.pv-shell input,.pv-shell select{transition:background-color .2s ease,border-color .2s ease,box-shadow .2s ease,transform .2s ease}.pv-shell button:focus-visible,.pv-shell a:focus-visible,.pv-shell input:focus-visible,.pv-shell select:focus-visible{outline:3px solid #ffad75;outline-offset:2px}.pv-shell button:not(:disabled):active{transform:scale(.98)}\n.pv-caja{margin:0 20px 16px;padding:18px 22px;background:#fff;border-radius:26px;display:flex;align-items:end;gap:12px;flex-wrap:wrap}.pv-caja-intro{display:flex;align-items:center;gap:12px;min-width:210px;margin-right:auto}.pv-caja-icon{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#fff1e6;color:#d65d10;flex:none}.pv-caja-title{font-size:14px;font-weight:800}.pv-caja-subtitle{font-size:12px;color:#858585;margin-top:3px}.pv-field{display:flex;flex-direction:column;gap:6px;color:#686868;font-size:11px;font-weight:700}.pv-field select,.pv-field input,.pv-input{height:42px;box-sizing:border-box;border:1px solid #e4e4e1;border-radius:14px;background:#f8f8f6;padding:0 14px;font:600 13px Manrope,system-ui,sans-serif;color:#111}.pv-field select{min-width:180px}.pv-field input{width:142px}.pv-field select:focus,.pv-field input:focus,.pv-input:focus{border-color:#e8701f;background:#fff;outline:none;box-shadow:0 0 0 3px #ff914c26}.pv-caja-action{height:42px;padding:0 20px;border:0;border-radius:14px;background:#111;color:#fff;font:700 13px Manrope,system-ui,sans-serif;cursor:pointer}.pv-caja-action:not(:disabled):hover{background:#e8701f}.pv-caja-action:disabled{opacity:.5;cursor:not-allowed}.pv-message{flex-basis:100%;font-size:13px}.pv-catalog-title{display:flex;justify-content:space-between;gap:12px;align-items:center}.pv-kicker{font-size:11px;text-transform:uppercase;letter-spacing:.1em;font-weight:800;color:#df6b1d}.pv-catalog-title h1{font-size:21px;letter-spacing:-.03em;line-height:1.2;margin:4px 0 0}.pv-catalog-caption{font-size:12px;color:#8c8c8c;text-align:right}.pv-search:focus-within{box-shadow:0 0 0 2px #ff914c80}.pv-empty{min-height:190px;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:8px;padding:24px;background:#f8f8f6;border:1px dashed #dededb;border-radius:22px;text-align:center}.pv-empty-icon{display:grid;place-items:center;width:48px;height:48px;border-radius:50%;background:#fff1e6;color:#e8701f}.pv-empty strong{font-size:14px}.pv-empty span:last-child{font-size:12px;line-height:1.5;color:#858585;max-width:300px}.pv-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:12px}.pv-ticket{box-shadow:0 8px 30px #17171708}.pv-ticket .pv-input{width:100%;background:#fff}.pv-client-grid,.pv-doc-grid{grid-template-columns:minmax(0,1fr)!important}.pv-client-grid button,.pv-doc-grid button{text-align:left;padding:0 16px}.pv-sales-empty{border-top:1px solid #f0f0ed;padding:15px 0 3px;color:#969696;font-size:12px}.pv-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px #11111114}.pv-shell button[aria-pressed=true]{box-shadow:0 3px 8px #11111112}\n@media(max-width:850px){.pv-ticket{max-width:none!important;flex-basis:100%!important}.pv-caja-intro{flex-basis:100%}.pv-caja{margin:0 14px 14px}.pv-grid{grid-template-columns:repeat(auto-fill,minmax(135px,1fr))}}@media(max-width:520px){.pv-stat{gap:6px!important}.pv-stat>span:first-child{min-width:48px!important;height:48px!important;padding:0 8px!important;font-size:12px!important}.pv-stat>span:last-child{font-size:10px!important}.pv-search-hint{display:none!important}.pv-caja{padding:16px}.pv-field{flex:1;min-width:130px}.pv-field input,.pv-field select{width:100%;min-width:0}.pv-caja-action{width:100%}.pv-catalog-caption{display:none}.pv-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pv-ticket{padding:16px!important}.pv-shell .pv-payment{grid-template-columns:repeat(3,minmax(0,1fr))!important}}@media(prefers-reduced-motion:reduce){.pv-shell *{transition:none!important;animation:none!important}}\n"}</style>
    <div className="pv-shell" style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
          <div>
            <div style={{ "padding": "28px 32px 22px", "display": "flex", "flexDirection": "column", "gap": "22px" }}>
              <div style={{ "display": "flex", "alignItems": "center", "gap": "14px", "flexWrap": "wrap" }}>
                <button onClick={lookup(v, "menuBtn")} aria-label={lookup(v, "menuBtnLabel")} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "none", "background": "#FFFFFF", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                  <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M4 8h16M4 16h10"}></path>
                  </svg>
                </button>
                <DesignLink href={"/dashboard"} aria-label={"Ir al panel"} style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                  <svg width={"30"} height={"30"} viewBox={"136 205 86 86"} aria-hidden={"true"}>
                    <circle cx={"178.6"} cy={"247.5"} r={"39.4"} fill={"none"} stroke={"#FFFFFF"} strokeWidth={"5"}></circle>
                    <clipPath id={"via-clip-pv"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-pv)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Punto de venta"}
                  </span>
                  <DesignLink href={"#controles-caja"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "14px", "fontWeight": "600", "color": caja ? "#1B5E20" : "#8C8C8C", "textDecoration": "none" }}>
                    <span style={{ "width": "8px", "height": "8px", "borderRadius": "50%", "background": caja ? "#34C759" : "#B8B8B3" }}></span>
                    {caja ? "Caja abierta · " + caja.nombreCaja : "Caja cerrada"}
                  </DesignLink>
                </span>
                <span style={{ "flex": "1" }}></span>
                {(lookup(v, "headStats") || []).map((h, index1) => (
                  <Fragment key={index1}>
                    <span className="pv-stat" style={{ "display": "flex", "alignItems": "center", "gap": "10px" }}>
                      <span style={{ "minWidth": "64px", "height": "64px", "padding": "0 14px", "boxSizing": "border-box", "borderRadius": "999px", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontSize": "17px", "fontWeight": "700", "background": lookup(h, "bg"), "color": lookup(h, "fg") }}>
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
                <DesignLink href={"#controles-caja"} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 20px", "borderRadius": "999px", "background": "#FFFFFF", "textDecoration": "none", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                    <path d={"M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"}></path>
                  </svg>
                  {"Gestionar caja"}
                </DesignLink>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"VIA"}
                </span>
              </div>
            </div>
            <div id="controles-caja" className="pv-caja">
              <div className="pv-caja-intro"><span className="pv-caja-icon" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18v12H3zM3 10h18M12 15h.01" /></svg></span><div><div className="pv-caja-title">Caja de venta</div><div className="pv-caja-subtitle">{caja ? caja.nombreCaja+' · '+caja.almacen.nombre : abiertas.length ? 'Selecciona una caja abierta' : 'Abre una caja en la sección Cajas'}</div></div></div>
              <label className="pv-field">Ubicación<select value={almacenId} onChange={e=>{setNotice('');ubicacionTrabajo.cambiar(e.target.value||null).catch(err=>setError(err.message))}}><option value="">Selecciona ubicación</option>{almacenes.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}</select></label>
              <label className="pv-field">Caja<select value={cajaId} onChange={e=>setCajaId(e.target.value)}><option value="">Selecciona caja abierta</option>{abiertas.map(c=><option key={c.id} value={c.id}>{c.nombreCaja}</option>)}</select></label>
              <DesignLink href="/caja" className="pv-caja-action" style={{display:'inline-flex',alignItems:'center',textDecoration:'none'}}>Gestionar cajas</DesignLink>
              {notice&&<span className="pv-message" role="status">{notice}</span>}{error&&<span className="pv-message" role="alert" style={{color:'#b3261e'}}>{error}</span>}
            </div>
            <div style={{ "padding": "0 20px 24px", "display": "flex", "gap": "16px", "flexWrap": "wrap", "alignItems": "flex-start" }}>
              <div style={{ "flex": "999 1 620px", "minWidth": "0", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div className="pv-catalog-title"><div><div className="pv-kicker">Punto de venta</div><h1>Productos</h1></div><span className="pv-catalog-caption">Selecciona un producto para agregarlo al ticket</span></div>
                  <label className="pv-search" style={{ "display": "flex", "alignItems": "center", "gap": "14px", "height": "64px", "padding": "0 10px 0 22px", "borderRadius": "999px", "background": "#F4F4F2", "boxSizing": "border-box" }}>
                    <svg width={"22"} height={"22"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"1.9"} strokeLinecap={"round"} aria-hidden={"true"} style={{ "flex": "none" }}>
                      <path d={"M3 7V4h3M18 4h3v3M21 17v3h-3M6 20H3v-3M7 8v8M10 8v8M13 8v8M16 8v8"}></path>
                    </svg>
                    <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                      {"Buscar producto"}
                    </span>
                    <input type={"search"} onChange={lookup(v, "onSearch")} placeholder={"Busca por nombre, SKU o código…"} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "18px", "fontWeight": "600", "outline": "none" }} />
                    <span className="pv-search-hint" style={{ "height": "44px", "padding": "0 16px", "borderRadius": "999px", "background": "#FFFFFF", "fontSize": "13px", "fontWeight": "700", "color": "#6B6B6B", "display": "flex", "alignItems": "center" }}>
                      {"Buscar"}
                    </span>
                  </label>
                  <div className={"noscroll"} style={{ "display": "flex", "gap": "8px", "overflowX": "auto" }}>
                    {(lookup(v, "cats") || []).map((c, index2) => (
                      <Fragment key={index2}>
                        <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "flex": "none", "height": "44px", "padding": "0 18px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "14px", "fontWeight": "700" }}>
                          {lookup(c, "name")}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  {Boolean(lookup(v, "noProducts")) && (
                    <Fragment>
                      <div className="pv-empty"><span className="pv-empty-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m16 16 4 4"/></svg></span><strong>{lookup(v,"emptyTitle")}</strong><span>{lookup(v,"emptyNote")}</span></div>
                    </Fragment>
                  )}
                  <div className="pv-grid">
                    {(lookup(v, "products") || []).map((p, index3) => (
                      <Fragment key={index3}>
                        <div style={{display:"flex",flexDirection:"column",gap:6,minWidth:0}}>
                        <button onClick={lookup(p, "add")} className={lookup(p, "cls")} aria-label={lookup(p, "aria")} style={{ "display": "flex", "flexDirection": "column", "gap": "10px", "padding": "10px 10px 14px", "borderRadius": "24px", "border": "2px solid " + String(lookup(p, "border") ?? ""), "background": "#F4F4F2", "cursor": lookup(p, "cursor"), "opacity": lookup(p, "o"), "fontFamily": "inherit", "textAlign": "left", "color": "#111111", "position": "relative" }}>
                          <span style={{ "position": "relative", "display": "block", "aspectRatio": "4 / 3", "borderRadius": "18px", "overflow": "hidden", "background": "#FFFFFF" }}>
                            {Boolean(lookup(p, "hasImg")) && (
                              <Fragment>
                                <img src={assetSrc(lookup(p, "img"))} alt={""} style={{ "width": "100%", "height": "100%", "objectFit": "cover", "display": "block" }} />
                              </Fragment>
                            )}
                            {Boolean(lookup(p, "noImg")) && (
                              <Fragment>
                                <span style={{ "position": "absolute", "inset": "0", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                  <svg width={"40"} height={"40"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#BDBDBD"} strokeWidth={"1.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                    <path d={"M12 3v7a4 4 0 1 1-4 4"}></path>
                                  </svg>
                                </span>
                              </Fragment>
                            )}
                            {Boolean(lookup(p, "inTicket")) && (
                              <Fragment>
                                <span style={{ "position": "absolute", "top": "8px", "right": "8px", "minWidth": "30px", "height": "30px", "padding": "0 8px", "boxSizing": "border-box", "borderRadius": "999px", "background": "#E8701F", "color": "#FFFFFF", "fontSize": "13px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                  {lookup(p, "qty")}
                                </span>
                              </Fragment>
                            )}
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px", "padding": "0 4px", "lineHeight": "1.25" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700", "minHeight": "35px" }}>
                              {lookup(p, "name")}
                            </span>
                            <span style={{ "fontSize": "20px", "fontWeight": "800" }}>
                              {lookup(p, "price")}
                            </span>
                          </span>
                          <span style={{ "display": "flex", "alignItems": "center", "gap": "6px", "padding": "0 4px", "fontSize": "12px", "fontWeight": "600", "color": lookup(p, "stockFg") }}>
                            <svg width={"12"} height={"12"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.6"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                              <path d={lookup(p, "stockIcon")}></path>
                            </svg>
                            {lookup(p, "stock")}
                          </span>
                          {lookup(p,"reason") && <span style={{padding:"0 4px",fontSize:12,fontWeight:700,color:"#9a4e15",lineHeight:1.4}}>{lookup(p,"reason")}</span>}
                          <span style={{ "padding": "0 4px", "fontSize": "11px", "color": "#8C8C8C" }}>
                            {lookup(p, "lot")}
                          </span>
                        </button>
                        {lookup(p,"blocked") && <DesignLink href={'/producto/editar?id='+encodeURIComponent(lookup(p,"productoId"))} style={{padding:'6px 12px',color:'#b84d0f',fontSize:12,fontWeight:700,textDecoration:'none'}}>Revisar producto ›</DesignLink>}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={{ "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                    <span style={{ "fontSize": "15px", "fontWeight": "700" }}>
                      {"Ventas de esta caja"}
                    </span>
                    <span style={{ "fontSize": "12px", "color": "#8C8C8C" }}>
                      {"Operaciones registradas"}
                    </span>
                  </div>
                  {!(lookup(v, "sales") || []).length && <div className="pv-sales-empty">Las ventas registradas en esta caja aparecerán aquí.</div>}
                  {(lookup(v, "sales") || []).map((s, index4) => (
                    <Fragment key={index4}>
                      <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "10px 12px", "borderRadius": "18px", "background": "#F4F4F2" }}>
                        <span style={{ "width": "36px", "height": "36px", "borderRadius": "50%", "background": lookup(s, "bg"), "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                          <svg width={"15"} height={"15"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(s, "fg")} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                            <path d={lookup(s, "icon")}></path>
                          </svg>
                        </span>
                        <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.25" }}>
                          <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                            {lookup(s, "doc")}
                            {" · "}
                            {lookup(s, "items")}
                          </span>
                          <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                            {lookup(s, "time")}
                            {" · "}
                            {lookup(s, "method")}
                          </span>
                        </span>
                        <span style={{ "fontSize": "15px", "fontWeight": "800" }}>
                          {lookup(s, "total")}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div className="pv-ticket" style={{ "flex": "1 1 400px", "maxWidth": "460px", "minWidth": "0", "borderRadius": "30px", "background": "#FFFFFF", "padding": "20px", "boxSizing": "border-box", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                {Boolean(lookup(v, "done")) && (
                  <Fragment>
                    <div role={"status"} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "14px", "padding": "36px 20px", "textAlign": "center" }}>
                      <span style={{ "width": "84px", "height": "84px", "borderRadius": "50%", "background": "#E4F4E7", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                        <svg width={"40"} height={"40"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#1B5E20"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                          <path d={"M5 12l5 5 9-10"}></path>
                        </svg>
                      </span>
                      <span style={{ "fontSize": "26px", "fontWeight": "700", "letterSpacing": "-0.01em" }}>
                        {"Venta registrada"}
                      </span>
                      <span style={{ "fontSize": "40px", "fontWeight": "800" }}>
                        {lookup(v, "doneTotal")}
                      </span>
                      <span style={{ "fontSize": "14px", "lineHeight": "1.5", "color": "#444444" }}>
                        {lookup(v, "doneDoc")}
                        {" · "}
                        {lookup(v, "doneMethod")}
                        <br />
                        {lookup(v, "doneLots")}
                      </span>
                      {Boolean(lookup(v, "doneChange")) && (
                        <Fragment>
                          <span style={{ "padding": "10px 18px", "borderRadius": "999px", "background": "#FFF1E6", "color": "#8A3B0A", "fontSize": "15px", "fontWeight": "800" }}>
                            {"Vuelto: "}
                            {lookup(v, "doneChangeText")}
                          </span>
                        </Fragment>
                      )}
                      <button onClick={lookup(v, "newSale")} style={{ "width": "100%", "height": "60px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "inherit", "fontSize": "17px", "fontWeight": "800" }}>
                        {"Nueva venta"}
                      </button>
                    </div>
                  </Fragment>
                )}
                {Boolean(lookup(v, "editing")) && (
                  <Fragment>
                    <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline" }}>
                      <span style={{ "fontSize": "22px", "fontWeight": "700", "letterSpacing": "-0.01em" }}>
                        {"Ticket"}
                      </span>
                      <span style={{ "fontSize": "13px", "color": "#8C8C8C" }}>
                        {lookup(v, "ticketCount")}
                      </span>
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      <div className="pv-client-grid" style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "6px", "padding": "4px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                        {(lookup(v, "clients") || []).map((c, index5) => (
                          <Fragment key={index5}>
                            <button onClick={lookup(c, "pick")} aria-pressed={lookup(c, "pressed")} style={{ "height": "40px", "borderRadius": "999px", "border": "none", "background": lookup(c, "bg"), "color": lookup(c, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(c, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      {Boolean(lookup(v, "needsDoc")) && (
                        <Fragment>
                          <label style={{ "display": "flex", "alignItems": "center", "gap": "10px", "height": "46px", "padding": "0 16px", "borderRadius": "999px", "border": "1px solid #DCDCD8", "boxSizing": "border-box" }}>
                            <span style={{ "fontSize": "13px", "fontWeight": "700", "color": "#6B6B6B" }}>
                              {lookup(v, "docLabel")}
                            </span>
                            <input placeholder={lookup(v, "docPlaceholder")} style={{ "flex": "1", "minWidth": "0", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "14px", "outline": "none" }} />
                          </label>
                        </Fragment>
                      )}
                      <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap", "alignItems": "center" }}>
                        <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C", "marginRight": "2px" }}>
                          {"Precio"}
                        </span>
                        {(lookup(v, "lists") || []).map((l, index6) => (
                          <Fragment key={index6}>
                            <button onClick={lookup(l, "pick")} aria-pressed={lookup(l, "pressed")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid " + String(lookup(l, "border") ?? ""), "background": lookup(l, "bg"), "color": lookup(l, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                              {lookup(l, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    {Boolean(lookup(v, "empty")) && (
                      <Fragment>
                        <div style={{ "padding": "34px 18px", "borderRadius": "22px", "border": "2px dashed #DCDCD8", "textAlign": "center", "fontSize": "14px", "lineHeight": "1.5", "color": "#6B6B6B" }}>
                          {"Toca un producto"}
                          <br />
                          {"para agregarlo al ticket."}
                        </div>
                      </Fragment>
                    )}
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px" }}>
                      {(lookup(v, "lines") || []).map((l, index7) => (
                        <Fragment key={index7}>
                          <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "padding": "12px", "borderRadius": "20px", "background": "#F4F4F2" }}>
                            <div style={{ "display": "flex", "gap": "10px", "alignItems": "flex-start" }}>
                              <span style={{ "flex": "1", "minWidth": "0", "display": "flex", "flexDirection": "column", "lineHeight": "1.3" }}>
                                <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                                  {lookup(l, "name")}
                                </span>
                                <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                  {lookup(l, "unit")}
                                  {" c/u · "}
                                  {lookup(l, "lot")}
                                </span>
                              </span>
                              <span style={{ "fontSize": "16px", "fontWeight": "800", "whiteSpace": "nowrap" }}>
                                {lookup(l, "total")}
                              </span>
                            </div>
                            <div style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "4px", "padding": "3px", "borderRadius": "999px", "background": "#FFFFFF" }}>
                                <button onClick={lookup(l, "dec")} aria-label={"Quitar una unidad"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#F4F4F2", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                                  {"−"}
                                </button>
                                <span style={{ "minWidth": "28px", "textAlign": "center", "fontSize": "15px", "fontWeight": "800" }}>
                                  {lookup(l, "qty")}
                                </span>
                                <button onClick={lookup(l, "inc")} aria-label={"Agregar una unidad"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "#111111", "color": "#FFFFFF", "cursor": "pointer", "fontSize": "18px", "fontWeight": "700" }}>
                                  {"+"}
                                </button>
                              </span>
                              <button hidden onClick={lookup(l, "disc")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "none", "background": lookup(l, "discBg"), "color": lookup(l, "discFg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "12px", "fontWeight": "700" }}>
                                {lookup(l, "discText")}
                              </button>
                              <span style={{ "flex": "1" }}></span>
                              {Boolean(lookup(l, "warn")) && (
                                <Fragment>
                                  <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#7A4A00" }}>
                                    {"Quedan "}
                                    {lookup(l, "left")}
                                  </span>
                                </Fragment>
                              )}
                              <button onClick={lookup(l, "remove")} aria-label={"Quitar del ticket"} style={{ "width": "34px", "height": "34px", "borderRadius": "50%", "border": "none", "background": "transparent", "cursor": "pointer", "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                                <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#6B6B6B"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={"M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"}></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "padding": "14px 4px 0", "borderTop": "1px solid #ECECE9", "fontSize": "14px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                        <span style={{ "color": "#6B6B6B" }}>
                          {"Subtotal ("}
                          {lookup(v, "listName")}
                          {")"}
                        </span>
                        <span style={{ "fontWeight": "600" }}>
                          {lookup(v, "subtotal")}
                        </span>
                      </span>
                      {Boolean(lookup(v, "hasDisc")) && (
                        <Fragment>
                          <span style={{ "display": "flex", "justifyContent": "space-between" }}>
                            <span style={{ "color": "#6B6B6B" }}>
                              {"Descuentos"}
                            </span>
                            <span style={{ "fontWeight": "600", "color": "#C2410C" }}>
                              {"− "}
                              {lookup(v, "discTotal")}
                            </span>
                          </span>
                        </Fragment>
                      )}
                      <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "12px", "color": "#8C8C8C" }}>
                        <span>
                          {lookup(v, "igvLabel")}
                        </span>
                        <span>
                          {lookup(v, "igv")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "baseline", "paddingTop": "6px" }}>
                        <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                          {"Total"}
                        </span>
                        <span style={{ "fontSize": "38px", "fontWeight": "800", "letterSpacing": "-0.02em" }}>
                          {lookup(v, "total")}
                        </span>
                      </span>
                    </div>
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "10px" }}>
                      <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                        {"Método de pago"}
                      </span>
                      <div className="pv-payment" style={{ "display": "grid", "gridTemplateColumns": "repeat(5, minmax(0, 1fr))", "gap": "6px" }}>
                        {(lookup(v, "methods") || []).map((m, index8) => (
                          <Fragment key={index8}>
                            <button onClick={lookup(m, "pick")} aria-pressed={lookup(m, "pressed")} style={{ "display": "flex", "flexDirection": "column", "alignItems": "center", "gap": "4px", "padding": "10px 4px", "borderRadius": "18px", "border": "none", "background": lookup(m, "bg"), "color": lookup(m, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "11px", "fontWeight": "700" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(m, "icon")}></path>
                              </svg>
                              {lookup(m, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      {Boolean(lookup(v, "isCash")) && (
                        <Fragment>
                          <div style={{ "display": "flex", "flexDirection": "column", "gap": "8px", "padding": "12px", "borderRadius": "20px", "background": "#F4F4F2" }}>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center" }}>
                              <span style={{ "fontSize": "13px", "fontWeight": "700" }}>
                                {"Recibido"}
                              </span>
                              <span style={{ "fontSize": "18px", "fontWeight": "800" }}>
                                {lookup(v, "receivedText")}
                              </span>
                            </span>
                            <input className="pv-input" type="number" min="0" step="0.01" aria-label="Efectivo recibido" onChange={lookup(v,"onReceived")} placeholder="Otro monto recibido" />
                            <div style={{ "display": "grid", "gridTemplateColumns": "repeat(4, minmax(0, 1fr))", "gap": "6px" }}>
                              {(lookup(v, "quick") || []).map((q, index9) => (
                                <Fragment key={index9}>
                                  <button onClick={lookup(q, "pick")} style={{ "height": "40px", "borderRadius": "999px", "border": "none", "background": lookup(q, "bg"), "color": lookup(q, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                                    {lookup(q, "label")}
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                            <span style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "paddingTop": "4px" }}>
                              <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "6px", "fontSize": "13px", "fontWeight": "700", "color": lookup(v, "changeFg") }}>
                                <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                  <path d={lookup(v, "changeIcon")}></path>
                                </svg>
                                {lookup(v, "changeLabel")}
                              </span>
                              <span style={{ "fontSize": "22px", "fontWeight": "800", "color": lookup(v, "changeFg") }}>
                                {lookup(v, "changeText")}
                              </span>
                            </span>
                          </div>
                        </Fragment>
                      )}
                      {!lookup(v,"isCash") && <input className="pv-input" aria-label="Referencia del pago" placeholder="Referencia del pago recibido" onChange={lookup(v,"onReference")} />}
                      <span style={{ "fontSize": "12px", "fontWeight": "600", "color": "#8C8C8C" }}>
                        {"Documento interno (no es comprobante SUNAT)"}
                      </span>
                      <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "6px", "padding": "4px", "borderRadius": "999px", "background": "#F4F4F2" }}>
                        {(lookup(v, "docs") || []).map((d, index10) => (
                          <Fragment key={index10}>
                            <button onClick={lookup(d, "pick")} aria-pressed={lookup(d, "pressed")} style={{ "height": "38px", "borderRadius": "999px", "border": "none", "background": lookup(d, "bg"), "color": lookup(d, "fg"), "cursor": "pointer", "fontFamily": "inherit", "fontSize": "13px", "fontWeight": "700" }}>
                              {lookup(d, "name")}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      {Boolean(lookup(v, "docWarn")) && (
                        <Fragment>
                          <span style={{ "display": "flex", "alignItems": "center", "gap": "8px", "fontSize": "12px", "fontWeight": "600", "color": "#7A4A00" }}>
                            <svg width={"14"} height={"14"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                              <path d={"M12 7v6M12 17h.01"}></path>
                            </svg>
                            {"La factura necesita el RUC del cliente."}
                          </span>
                        </Fragment>
                      )}
                    </div>
                    {lookup(v,"error") && <span role="alert" style={{color:"#b3261e"}}>{lookup(v,"error")}</span>}
                    <button onClick={lookup(v, "charge")} disabled={lookup(v, "chargeDisabled")} aria-disabled={lookup(v, "chargeDisabled")} style={{ "height": "68px", "borderRadius": "999px", "border": "none", "background": lookup(v, "chargeBg"), "color": "#FFFFFF", "cursor": lookup(v, "chargeCursor"), "fontFamily": "inherit", "fontSize": "19px", "fontWeight": "800", "display": "flex", "alignItems": "center", "justifyContent": "center", "gap": "10px" }}>
                      <svg width={"20"} height={"20"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M5 12l5 5 9-10"}></path>
                      </svg>
                      {lookup(v, "chargeText")}
                    </button>
                    <span style={{ "fontSize": "12px", "textAlign": "center", "color": "#8C8C8C" }}>
                      {"Al cobrar se descuenta el stock del lote que se vende primero."}
                    </span>
                  </Fragment>
                )}
              </div>
            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"PuntoVenta"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
