"use client";

import { Fragment } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listarProveedoresCompra, guardarProveedorCompra, listarOrdenesCompra, crearOrdenCompra, accionarOrdenCompra, listarProductosCompra, listarAlmacenes } from "../backend-api";
import DesignLink from "../design-link";
import { DesignImport } from "../native-view";
import { DesignLogic, DesignHost, lookup, assetSrc, truthy } from "../design-runtime";

class Component extends DesignLogic {
 constructor(props){super(props);this.state={menu:false,pinned:false,filter:'Todas',buscar:'',sel:'',draft:false,proveedorId:'',productoId:'',varianteId:'',cantidad:'',costo:'',lineas:[],fecha:'',condicion:'',proveedorForm:false,proveedorBusqueda:'',pNombre:'',pDocumento:'',pCorreo:'',pTelefono:'',pDireccion:'',editingId:'',recv:{},almacenId:'',revisar:true,devDetalle:'',devAlmacen:'',devCantidad:'',devMotivo:'',busy:false,error:'',aviso:''};}
 renderVals(){
  const st=this.state,ubicacion=st.almacenId || this.props.ubicacionTrabajoId || '',ordenes=this.props.ordenes||[],proveedores=this.props.proveedores||[],productos=this.props.productos||[],almacenes=(this.props.almacenes||[]).filter(x=>x.activo);
  const nombreVar=v=>v?Object.values(v.atributos).join(' · '):'';
  const selected=ordenes.find(o=>o.id===this.props.ordenId), product=productos.find(p=>p.id===st.productoId);
  const estado={borrador:'Borrador',enviada:'Enviada',en_transito:'En tránsito',recepcion_parcial:'Recepción parcial',recibida:'Recibida',cancelada:'Cancelada'};
  const color={Borrador:['#EFEFEC','#444'],Enviada:['#E3F1FF','#0B4A8A'],'En tránsito':['#EDE7FF','#4A2E9A'],'Recepción parcial':['#FFF4D6','#7A4A00'],Recibida:['#E4F4E7','#1B5E20'],Cancelada:['#EFEFEC','#6B6B6B']};
  const icon='M3 7h11v9H3zM14 10h4l3 3v3h-7', money=n=>'S/ '+Number(n||0).toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2}), date=d=>d?new Date(d).toLocaleDateString('es-PE',{timeZone:'UTC'}):'—';
  const filters=['Todas','Borrador','Enviada','En tránsito','Recepción parcial','Recibida','Cancelada'];
  const matches=o=>(!st.buscar||(`${o.numero} ${o.proveedor.nombre}`).toLowerCase().includes(st.buscar.trim().toLowerCase()))&&(st.filter==='Todas'||estado[o.estado]===st.filter);
  const open=ordenes.filter(o=>!['recibida','cancelada'].includes(o.estado)).length;
  const action=async(fn,success)=>{if(this.state.busy)return;this.setState({busy:true,error:'',aviso:''});try{const r=await fn();this.setState({busy:false,aviso:typeof success==='function'?success(r):success});return r;}catch(e){this.setState({busy:false,error:e.message||'No se pudo completar la operación.'});}};
  const qty=o=>o.lineas.reduce((a,l)=>a+Number(l.cantidadPedida),0),received=o=>o.lineas.reduce((a,l)=>a+Number(l.cantidadRecibida),0);
  const detalles=(selected?.recepciones||[]).flatMap(r=>r.detalles.map(d=>({...d,recepcionNumero:r.numero,pendiente:Math.max(0,Math.round((Number(d.cantidad)-(d.devolucionesProveedor||[]).reduce((n,x)=>n+Number(x.cantidad),0))*1000)/1000)})));
  const detalleDev=detalles.find(d=>d.id===st.devDetalle);
  const ubicacionesDev=(detalleDev?.lote?.existencias||[]).filter(x=>x.almacen.activo);
  const styles={height:42,border:'1px solid #E4E4E0',borderRadius:14,padding:'0 12px',background:'#fff',fontFamily:'inherit'};
  return {accent:this.props.accent??'#FF914C',menuOpen:st.menu||!!this.props.menuAbierto,openMenu:()=>this.setState({menu:true}),closeMenu:()=>this.setState({menu:false}),pinned:st.pinned,menuBtnLabel:'Abrir menú',menuBtn:()=>this.setState({menu:true}),togglePin:()=>this.setState({pinned:!st.pinned,menu:false}),newOrder:()=>{this.setState({error:'',aviso:''});this.props.navegar('nueva');},openCount:String(open),headStats:[[open,'Órdenes','abiertas'],[ordenes.filter(o=>['enviada','en_transito','recepcion_parcial'].includes(o.estado)).length,'Pendientes','de recepción'],[proveedores.filter(p=>p.activo).length,'Proveedores','activos'],[ordenes.filter(o=>o.estado==='recibida').length,'Órdenes','recibidas']].map((x,i)=>({v:String(x[0]),k1:x[1],k2:x[2],bg:i===3?'#111':'#fff',fg:i===3?'#fff':'#111'})),
   filters:filters.map(f=>({name:f,n:String(f==='Todas'?ordenes.length:ordenes.filter(o=>estado[o.estado]===f).length),pressed:String(st.filter===f),bg:st.filter===f?'#111':'#fff',fg:st.filter===f?'#fff':'#111',border:st.filter===f?'#111':'#E4E4E0',pick:()=>this.setState({filter:f})})),
   buscar:st.buscar,setBuscar:e=>this.setState({buscar:e.target.value}),orders:ordenes.filter(matches).map(o=>{const state=estado[o.estado]||o.estado,c=color[state]||color.Borrador,on=o.id===selected?.id;return {id:o.numero,prov:o.proveedor.nombre,created:date(o.creadaEn),cat:o.lineas.length+' productos',eta:date(o.fechaEntregaPrevista),state,sbg:c[0],sfg:c[1],icon,total:money(o.total),recText:received(o)+' de '+qty(o)+' u',pct:(qty(o)?received(o)/qty(o)*100:0)+'%',pressed:String(on),bg:on?'#FFF8F2':'#fff',border:on?'#E8701F':'transparent',select:()=>{this.setState({sel:o.id,recv:{},devDetalle:'',devAlmacen:'',devCantidad:'',devMotivo:'',error:'',aviso:''});this.props.navegar('detalle',o.id)}};}),noOrders:!this.props.cargando&&!ordenes.some(matches),
   sel:selected?{id:selected.numero,prov:selected.proveedor.nombre,cat:selected.lineas.length+' productos',created:date(selected.creadaEn),eta:date(selected.fechaEntregaPrevista),pay:selected.condicionPago||'—',loc:'Elegir al recibir',state:estado[selected.estado],sbg:(color[estado[selected.estado]]||color.Borrador)[0],sfg:(color[estado[selected.estado]]||color.Borrador)[1],icon,subtotal:money(selected.subtotal),igv:money(selected.impuesto),total:money(selected.total),lotText:'Se crean lotes al registrar cada recepción.'}:{id:'Selecciona una orden',prov:'',cat:'',created:'—',eta:'—',pay:'—',loc:'—',state:'',sbg:'#eee',sfg:'#444',icon,subtotal:'—',igv:'—',total:'—',lotText:'Crea una orden para registrar mercadería.'},
   selLines:(selected?.lineas||[]).map(l=>({name:l.producto.nombre+(l.variante?' · '+nombreVar(l.variante):''),qty:String(l.cantidadPedida),rec:String(l.cantidadRecibida),pct:(Number(l.cantidadPedida)?Number(l.cantidadRecibida)/Number(l.cantidadPedida)*100:0)+'%',barC:'#E8701F',sub:money(Number(l.cantidadPedida)*Number(l.costoUnitario)),unit:money(l.costoUnitario)})),
   selected,puedeEnviar:selected?.estado==='borrador',puedeCancelar:selected&&['borrador','enviada','en_transito'].includes(selected.estado),canReceive:selected&&['enviada','en_transito','recepcion_parcial'].includes(selected.estado),noReceive:!selected||!['enviada','en_transito','recepcion_parcial'].includes(selected.estado),recvNote:!selected?'Selecciona una orden.':selected.estado==='borrador'?'Marca la orden como enviada para recibirla.':'La orden no tiene recepciones pendientes.',
   enviar:()=>action(()=>this.props.accionar(selected.id,'enviar'),'Orden marcada como enviada. No se envió ningún mensaje.'),cancelar:()=>{if(window.confirm('¿Cancelar esta orden de compra?'))action(()=>this.props.accionar(selected.id,'cancelar'),'Orden cancelada.');},
   receiveLines:(selected?.lineas||[]).filter(l=>Number(l.cantidadPedida)>Number(l.cantidadRecibida)).map(l=>({id:l.id,name:l.producto.nombre+(l.variante?' · '+nombreVar(l.variante):''),pendiente:(Math.round((Number(l.cantidadPedida)-Number(l.cantidadRecibida))*1000)/1000),value:st.recv[l.id]||'',change:e=>this.setState({recv:{...this.state.recv,[l.id]:e.target.value}})})),
   almacenes,almacenId:ubicacion,setAlmacen:e=>this.setState({almacenId:e.target.value}),revisar:st.revisar,setRevisar:e=>this.setState({revisar:e.target.checked}),
   recibir:()=>{const lineas=(selected?.lineas||[]).filter(l=>st.recv[l.id]!==undefined&&st.recv[l.id]!=='').map(l=>({lineaId:l.id,cantidad:Number(st.recv[l.id]),pendiente:Math.round((Number(l.cantidadPedida)-Number(l.cantidadRecibida))*1000)/1000}));if(!ubicacion||!lineas.length||lineas.some(l=>!Number.isFinite(l.cantidad)||l.cantidad<=0||l.cantidad>l.pendiente||Math.abs(l.cantidad*1000-Math.round(l.cantidad*1000))>0.000001)){this.setState({error:'Selecciona ubicación e indica cantidades válidas hasta lo pendiente.'});return;}action(()=>this.props.accionar(selected.id,'recibir',{almacenId:ubicacion,revisar:st.revisar,lineas:lineas.map(({lineaId,cantidad})=>({lineaId,cantidad}))}),r=>{this.setState({recv:{}});return 'Recepción '+r.datos.numero+' registrada. Se crearon los lotes.';});},
   detalles,detalleDev,ubicacionesDev,devDetalle:st.devDetalle,devAlmacen:st.devAlmacen,devCantidad:st.devCantidad,devMotivo:st.devMotivo,setDevDetalle:e=>this.setState({devDetalle:e.target.value,devAlmacen:'',devCantidad:'',error:'',aviso:''}),
   devolver:()=>{const ex=ubicacionesDev.find(x=>x.almacen.id===st.devAlmacen),n=Number(st.devCantidad),disponible=ex?Number(ex.cantidadFisica)-Number(ex.cantidadReservada):0;if(!detalleDev||!ex||!st.devCantidad.trim()||!Number.isFinite(n)||n<=0||n>detalleDev.pendiente||n>disponible||Math.abs(n*1000-Math.round(n*1000))>0.000001||!st.devMotivo.trim()){this.setState({error:'Selecciona recepción y ubicación, indica una cantidad disponible y escribe el motivo.'});return;}action(()=>this.props.accionar(selected.id,'devoluciones',{detalleRecepcionId:detalleDev.id,almacenId:st.devAlmacen,cantidad:n,motivo:st.devMotivo.trim()}),r=>{this.setState({devDetalle:'',devAlmacen:'',devCantidad:'',devMotivo:''});return 'Devolución '+r.datos.numero+' registrada y descontada del inventario.';});},
   vista:this.props.vista,draft:this.props.vista==='nueva',hideDraft:()=>this.props.navegar('ordenes'),proveedores,proveedoresFiltrados:proveedores.filter(p=>(p.nombre+' '+(p.numeroDocumento||'')).toLowerCase().includes(st.proveedorBusqueda.trim().toLowerCase())),proveedorBusqueda:st.proveedorBusqueda,setProveedorBusqueda:e=>this.setState({proveedorBusqueda:e.target.value}),productos,product,proveedorId:st.proveedorId,productoId:st.productoId,varianteId:st.varianteId,cantidad:st.cantidad,costo:st.costo,lineas:st.lineas,fecha:st.fecha,condicion:st.condicion,field:k=>e=>this.setState({[k]:e.target.value}),setProduct:e=>this.setState({productoId:e.target.value,varianteId:''}),
   addLine:()=>{const n=Number(st.cantidad),c=Number(st.costo),v=product?.variantes?.find(x=>x.id===st.varianteId);if(!product||!st.cantidad||!st.costo||!Number.isFinite(n)||n<=0||n>999999||Math.abs(n*1000-Math.round(n*1000))>0.000001||!Number.isFinite(c)||c<0||c>999999||Math.abs(c*10000-Math.round(c*10000))>0.000001||(product.variantes?.length&&!v)||st.lineas.some(x=>x.productoId===st.productoId&&x.varianteId===(st.varianteId||null))){this.setState({error:'Revisa producto, variante, cantidad y costo; no repitas líneas.'});return;}this.setState({lineas:[...st.lineas,{productoId:product.id,varianteId:st.varianteId||null,cantidad:n,costoUnitario:c,nombre:product.nombre+(v?' · '+nombreVar(v):'')}],cantidad:'',costo:'',error:''});},removeLine:i=>this.setState({lineas:st.lineas.filter((_,j)=>j!==i)}),
   saveOrder:()=>{if(!st.proveedorId||!st.lineas.length){this.setState({error:'Selecciona proveedor y agrega productos.'});return;}action(()=>this.props.crearOrden({proveedorId:st.proveedorId,lineas:st.lineas.map(({productoId,varianteId,cantidad,costoUnitario})=>({productoId,varianteId,cantidad,costoUnitario})),fechaEntregaPrevista:st.fecha||null,condicionPago:st.condicion}),r=>{this.setState({draft:false,lineas:[],sel:r.datos.id});this.props.navegar('detalle',r.datos.id);return 'Orden '+r.datos.numero+' creada en borrador.';});},
   proveedorForm:st.proveedorForm,editingId:st.editingId,pNombre:st.pNombre,pDocumento:st.pDocumento,pCorreo:st.pCorreo,pTelefono:st.pTelefono,pDireccion:st.pDireccion,openProveedor:()=>this.setState({proveedorForm:true,editingId:'',pNombre:'',pDocumento:'',pCorreo:'',pTelefono:'',pDireccion:'',error:'',aviso:''}),editProveedor:p=>this.setState({proveedorForm:true,editingId:p.id,pNombre:p.nombre,pDocumento:p.numeroDocumento||'',pCorreo:p.correo||'',pTelefono:p.telefono||'',pDireccion:p.direccion||'',error:'',aviso:''}),closeProveedor:()=>this.setState({proveedorForm:false}),
   saveProveedor:()=>{if(!st.pNombre.trim()){this.setState({error:'Indica el nombre del proveedor.'});return;}const datos={nombre:st.pNombre,correo:st.pCorreo,telefono:st.pTelefono,direccion:st.pDireccion,numeroDocumento:st.pDocumento};action(()=>this.props.guardarProveedor(st.editingId||null,datos),()=>{this.setState({proveedorForm:false});return 'Proveedor guardado.';});},toggleProveedor:p=>action(()=>this.props.guardarProveedor(p.id,{activo:!p.activo}),'Estado del proveedor actualizado.'),
   error:st.error||this.props.error||'',aviso:st.aviso,busy:st.busy,cargando:this.props.cargando,styles
  };
 }
}

const defaults = {"accent": "#FF914C", "menuAbierto": false};

export default function Compras(props) {
  const qc=useQueryClient();
  const router=useRouter(), search=useSearchParams();
  const vista=['nueva','proveedores','detalle'].includes(search.get('vista'))?search.get('vista'):'ordenes';
  const ordenId=vista==='detalle'?search.get('orden')||'':'';
  const navegar=(destino,id)=>router.push(destino==='ordenes'?'/compras':destino==='detalle'?'/compras?vista=detalle&orden='+encodeURIComponent(id):'/compras?vista='+destino);
  const ordenes=useQuery({queryKey:['compras','ordenes'],queryFn:({signal})=>listarOrdenesCompra(signal)});
  const proveedores=useQuery({queryKey:['compras','proveedores'],queryFn:({signal})=>listarProveedoresCompra(signal)});
  const productos=useQuery({queryKey:['compras','productos'],queryFn:({signal})=>listarProductosCompra(signal)});
  const almacenes=useQuery({queryKey:['inventario','almacenes'],queryFn:({signal})=>listarAlmacenes(signal)});
  const actualizar=()=>Promise.all([qc.invalidateQueries({queryKey:['compras']}),qc.invalidateQueries({queryKey:['inventario']}),qc.invalidateQueries({queryKey:['productos']}),qc.invalidateQueries({queryKey:['tienda']})]);
  const mut=useMutation({mutationFn:({tipo,id,accion,datos})=>tipo==='proveedor'?guardarProveedorCompra(id,datos):tipo==='crear'?crearOrdenCompra(datos):accionarOrdenCompra(id,accion,datos),onSuccess:actualizar});
  const connected={...props,vista,ordenId,navegar,ordenes:ordenes.data?.datos||[],proveedores:proveedores.data?.datos||[],productos:productos.data?.datos||[],almacenes:almacenes.data?.datos||[],cargando:ordenes.isPending||proveedores.isPending||productos.isPending||almacenes.isPending,error:ordenes.error?.message||proveedores.error?.message||productos.error?.message||almacenes.error?.message||'',guardarProveedor:(id,datos)=>mut.mutateAsync({tipo:'proveedor',id,datos}),crearOrden:datos=>mut.mutateAsync({tipo:'crear',datos}),accionar:(id,accion,datos)=>mut.mutateAsync({tipo:'accion',id,accion,datos})};
  return <DesignHost Logic={Component} defaults={defaults} componentProps={connected} render={(v) => (
    <Fragment>
      <style>{"\nbody{margin:0;background:#E9E9E7}\na{color:#111111}\n.noscroll{scrollbar-width:none;-ms-overflow-style:none}.noscroll::-webkit-scrollbar{display:none}\n"}</style>
      <style>{".co-form{padding:24px;border-radius:28px;background:#f4f4f2;display:flex;flex-direction:column;gap:18px;min-width:0}.co-form-head{display:flex;align-items:center;gap:12px}.co-form-icon{display:grid;place-items:center;flex:none;width:44px;height:44px;border-radius:15px;background:#fff1e6;color:#dc671a;font-size:20px;font-weight:700}.co-form-title{font-size:16px;font-weight:800;color:#111}.co-form-subtitle{font-size:12px;color:#828282;line-height:1.5;margin:4px 0 0}.co-fields{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.co-order-fields{grid-template-columns:repeat(4,minmax(0,1fr));align-items:end}.co-field{display:flex;flex-direction:column;gap:7px;min-width:0;font-size:12px;font-weight:700;color:#494949}.co-field input,.co-field select{width:100%!important;min-width:0;box-sizing:border-box;height:46px!important;font-size:14px!important;color:#111;outline:none}.co-field input:focus,.co-field select:focus{border-color:#e8701f!important;box-shadow:0 0 0 3px #ff914c24}.co-address{grid-column:span 2}.co-form-actions{display:flex;gap:8px;flex-wrap:wrap}.co-form-actions button,.co-add{min-height:44px;padding:0 19px;border:0;border-radius:999px;font:700 13px Manrope,system-ui,sans-serif;cursor:pointer}.co-primary{background:#e8701f;color:#fff}.co-secondary{background:#fff;color:#111}.co-add{background:#111;color:#fff;align-self:flex-start}.co-form-actions button:disabled{opacity:.5;cursor:wait}.co-line{padding:12px 14px;border-radius:16px;background:#fff;display:flex;gap:12px;align-items:center;font-size:13px}.co-line span{flex:1;min-width:0;overflow-wrap:anywhere}.co-line button{border:0;border-radius:999px;background:#f4f4f2;padding:9px 14px;font:700 12px Manrope,system-ui;cursor:pointer}.co-form-note{padding:11px 14px;border-radius:14px;background:#fff;color:#777;font-size:12px;line-height:1.5}@media(max-width:900px){.co-order-fields{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.co-form{padding:18px;gap:16px;border-radius:24px}.co-fields{grid-template-columns:minmax(0,1fr);gap:12px}.co-address{grid-column:auto}.co-order-fields{grid-template-columns:repeat(2,minmax(0,1fr))}.co-order-fields .co-wide{grid-column:1/-1}.co-form-actions button{flex:1 1 100%}.co-add{width:100%}}@media(max-width:350px){.co-fields{grid-template-columns:minmax(0,1fr)}.co-address,.co-order-fields .co-wide{grid-column:auto}}"}</style>
      <style>{".co-nav{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.co-nav a{display:inline-flex;align-items:center;min-height:42px;padding:0 17px;border-radius:999px;background:#f4f4f2;color:#111;text-decoration:none;font-size:13px;font-weight:700}.co-nav a[aria-current=page]{background:#111;color:#fff}.co-nav a:hover{background:#e5e5e1}.co-nav a[aria-current=page]:hover{background:#222}.co-provider-head{display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap}.co-provider-head strong{font-size:18px}.co-provider-head p{margin:4px 0 0;color:#777;font-size:12px}.co-provider-add{border:0;border-radius:999px;padding:12px 18px;font:700 13px Manrope,system-ui;cursor:pointer}.co-empty-detail{width:100%;padding:24px;border-radius:24px;background:#f4f4f2;color:#6b6b6b;font-size:14px}.co-empty-detail a{font-weight:700;color:#c2410c}@media(max-width:600px){.co-nav a{flex:1 1 auto;justify-content:center}.co-provider-head .co-provider-add{width:100%}}"}</style>
    <div style={{ "minHeight": "100vh", "background": "#E9E9E7", "padding": "0", "boxSizing": "border-box", "fontFamily": "Manrope, system-ui, sans-serif", "color": "#111111" }}>
      <div style={{ "position": "relative", "width": "100%", "maxWidth": "none", "minHeight": "100vh", "margin": "0 auto", "background": "#F4F4F2", "borderRadius": "40px", "overflow": "hidden" }}>
        <div>
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
                    <clipPath id={"via-clip-com"}>
                      <circle cx={"178.6"} cy={"247.5"} r={"40.5"}></circle>
                    </clipPath>
                    <polygon points={"178.6,222.5 208.5,261.5 178.6,251 149,261.5"} fill={"#FFFFFF"}></polygon>
                    <path clipPath={"url(#via-clip-com)"} d={"M136 270.5 C158 271, 174 265, 190 264.6 C200 264.4, 208 267.5, 221 271 L221 292 L136 292 Z"} fill={"#FFFFFF"}></path>
                  </svg>
                </DesignLink>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.2" }}>
                  <span style={{ "fontSize": "16px", "fontWeight": "700" }}>
                    {"Compras"}
                  </span>
                  <span style={{ "fontSize": "16px", "fontWeight": "500", "color": "#8C8C8C" }}>
                    {"Órdenes y proveedores"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                <button onClick={lookup(v, "newOrder")} style={{ "display": "inline-flex", "alignItems": "center", "gap": "10px", "height": "52px", "padding": "0 22px", "borderRadius": "999px", "border": "none", "background": "#E8701F", "color": "#FFFFFF", "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "14px", "fontWeight": "700" }}>
                  <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} aria-hidden={"true"}>
                    <path d={"M12 5v14M5 12h14"}></path>
                  </svg>
                  {"Nueva orden de compra"}
                </button>
                <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "background": lookup(v, "accent"), "color": "#111111", "display": "flex", "alignItems": "center", "justifyContent": "center", "fontWeight": "800" }}>
                  {"BC"}
                </span>
                {vista==='ordenes' && <label style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
                  <span style={{ "width": "52px", "height": "52px", "borderRadius": "50%", "border": "1px solid #DCDCD8", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                    <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#111111"} strokeWidth={"2"} aria-hidden={"true"}>
                      <circle cx={"11"} cy={"11"} r={"6.5"}></circle>
                      <path d={"M16 16l4 4"}></path>
                    </svg>
                  </span>
                  <span style={{ "position": "absolute", "width": "1px", "height": "1px", "overflow": "hidden", "clip": "rect(0 0 0 0)" }}>
                    {"Buscar orden o proveedor"}
                  </span>
                  <input type={"search"} value={lookup(v,"buscar")} onChange={lookup(v,"setBuscar")} placeholder={"N° de orden o proveedor…"} style={{ "width": "180px", "border": "none", "background": "transparent", "fontFamily": "inherit", "fontSize": "13px", "outline": "none" }} />
                </label>}
              </div>
              {vista==='ordenes' && <div style={{ "display": "flex", "alignItems": "flex-end", "gap": "24px", "flexWrap": "wrap" }}>
                <span style={{ "display": "flex", "flexDirection": "column", "lineHeight": "1.12", "minWidth": "300px" }}>
                  <span style={{ "fontSize": "38px", "fontWeight": "600", "letterSpacing": "-0.02em" }}>
                    {"Compras"}
                  </span>
                  <span style={{ "fontSize": "38px", "fontWeight": "400", "letterSpacing": "-0.02em", "color": "#9A9A9A" }}>
                    {lookup(v, "openCount")}
                    {" órdenes abiertas"}
                  </span>
                </span>
                <span style={{ "flex": "1" }}></span>
                {(lookup(v, "headStats") || []).map((h, index1) => (
                  <Fragment key={index1}>
                    <span className="via-panel-stat" style={{ "display": "flex", "alignItems": "center", "gap": "12px" }}>
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
              </div>}
            </div>
            <div style={{ "background": "#FFFFFF", "padding": "18px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
              {(lookup(v,'error')||lookup(v,'aviso'))&&<p role={lookup(v,'error')?'alert':'status'} style={{padding:'12px 16px',borderRadius:18,background:lookup(v,'error')?'#FDE4E2':'#E4F4E7',color:lookup(v,'error')?'#8E1C14':'#1B5E20',fontSize:13}}>{lookup(v,'error')||lookup(v,'aviso')}</p>}
              <nav className="co-nav" aria-label="Secciones de compras"><DesignLink href="/compras" aria-current={vista==='ordenes'||vista==='detalle'?'page':undefined}>Órdenes</DesignLink><DesignLink href="/compras?vista=nueva" aria-current={vista==='nueva'?'page':undefined}>Nueva compra</DesignLink><DesignLink href="/compras?vista=proveedores" aria-current={vista==='proveedores'?'page':undefined}>Proveedores</DesignLink><DesignLink href="/cuentas-por-pagar">Cuentas por pagar ↗</DesignLink></nav>
              {vista==='detalle' && <DesignLink href="/compras" style={{alignSelf:'flex-start',fontSize:13,fontWeight:700,color:'#a7470d',textDecoration:'none'}}>← Volver a órdenes</DesignLink>}
              {vista==='proveedores' && lookup(v,'proveedorForm') && <section className="co-form" aria-label={lookup(v,'editingId')?'Editar proveedor':'Nuevo proveedor'}>
                <div className="co-form-head"><span className="co-form-icon" aria-hidden="true">+</span><div><div className="co-form-title">{lookup(v,'editingId')?'Editar proveedor':'Nuevo proveedor'}</div><p className="co-form-subtitle">Registra sus datos para seleccionarlo en tus órdenes de compra.</p></div></div>
                <div className="co-fields">
                  <label className="co-field">Nombre <input aria-label="Nombre del proveedor" placeholder="Nombre o razón social" style={lookup(v,'styles')} value={lookup(v,'pNombre')} onChange={lookup(v,'field')('pNombre')}/></label>
                  <label className="co-field">RUC o documento <input aria-label="Documento del proveedor" placeholder="Número de documento" style={lookup(v,'styles')} value={lookup(v,'pDocumento')} onChange={lookup(v,'field')('pDocumento')}/></label>
                  <label className="co-field">Correo <input aria-label="Correo del proveedor" type="email" placeholder="correo@ejemplo.com" style={lookup(v,'styles')} value={lookup(v,'pCorreo')} onChange={lookup(v,'field')('pCorreo')}/></label>
                  <label className="co-field">Teléfono <input aria-label="Teléfono del proveedor" type="tel" placeholder="Número de contacto" style={lookup(v,'styles')} value={lookup(v,'pTelefono')} onChange={lookup(v,'field')('pTelefono')}/></label>
                  <label className="co-field co-address">Dirección <input aria-label="Dirección del proveedor" placeholder="Dirección del proveedor" style={lookup(v,'styles')} value={lookup(v,'pDireccion')} onChange={lookup(v,'field')('pDireccion')}/></label>
                </div>
                <div className="co-form-actions"><button type="button" className="co-primary" disabled={lookup(v,'busy')} onClick={lookup(v,'saveProveedor')}>Guardar proveedor</button><button type="button" className="co-secondary" onClick={lookup(v,'closeProveedor')}>Cerrar</button></div>
              </section>}
              {vista==='nueva' && <section id="nueva-orden" className="co-form" aria-label="Nueva orden de compra">
                <div className="co-form-head"><span className="co-form-icon" aria-hidden="true">+</span><div><div className="co-form-title">Nueva orden de compra</div><p className="co-form-subtitle">Agrega el proveedor y los productos que deseas comprar.</p></div></div>
                <div className="co-form-note">Los costos son por unidad, sin IGV. La orden se guarda como borrador.</div>
                <div className="co-fields co-order-fields">
                  <label className="co-field co-wide">Proveedor <select aria-label="Proveedor de la orden" style={lookup(v,'styles')} value={lookup(v,'proveedorId')} onChange={lookup(v,'field')('proveedorId')}><option value="">Selecciona proveedor</option>{lookup(v,'proveedores').filter(p=>p.activo).map(p=><option key={p.id} value={p.id}>{p.nombre}</option>)}</select></label>
                  <label className="co-field co-wide">Producto <select aria-label="Producto de la orden" style={lookup(v,'styles')} value={lookup(v,'productoId')} onChange={lookup(v,'setProduct')}><option value="">Selecciona producto</option>{lookup(v,'productos').map(p=><option key={p.id} value={p.id}>{p.nombre} · {p.sku}</option>)}</select></label>
                  {lookup(v,'product')?.variantes?.length>0&&<label className="co-field co-wide">Variante <select aria-label="Variante de la orden" style={lookup(v,'styles')} value={lookup(v,'varianteId')} onChange={lookup(v,'field')('varianteId')}><option value="">Selecciona variante</option>{lookup(v,'product').variantes.map(x=><option key={x.id} value={x.id}>{Object.values(x.atributos).join(' · ')}</option>)}</select></label>}
                  <label className="co-field">Cantidad <input aria-label="Cantidad a comprar" type="number" min="0.001" step="0.001" placeholder="0" style={lookup(v,'styles')} value={lookup(v,'cantidad')} onChange={lookup(v,'field')('cantidad')}/></label>
                  <label className="co-field">Costo unitario sin IGV (S/) <input aria-label="Costo de compra sin IGV" type="number" min="0" step="0.0001" placeholder="0.00" style={lookup(v,'styles')} value={lookup(v,'costo')} onChange={lookup(v,'field')('costo')}/></label>
                </div>
                <button type="button" className="co-add" onClick={lookup(v,'addLine')}>+ Agregar producto</button>
                {lookup(v,'lineas').map((l,i)=><div key={i} className="co-line"><span>{l.nombre} · {l.cantidad} × S/ {l.costoUnitario}</span><button type="button" onClick={()=>lookup(v,'removeLine')(i)}>Quitar</button></div>)}
                <div className="co-fields"><label className="co-field">Llegada estimada <input aria-label="Fecha estimada" type="date" style={lookup(v,'styles')} value={lookup(v,'fecha')} onChange={lookup(v,'field')('fecha')}/></label><label className="co-field">Condición de pago <input aria-label="Condición de pago" placeholder="Ej.: Contado" style={lookup(v,'styles')} value={lookup(v,'condicion')} onChange={lookup(v,'field')('condicion')}/></label></div>
                <div className="co-form-actions"><button type="button" className="co-primary" disabled={lookup(v,'busy')} onClick={lookup(v,'saveOrder')}>Guardar borrador</button><button type="button" className="co-secondary" onClick={lookup(v,'hideDraft')}>Cerrar</button></div>
              </section>}

              {vista==='proveedores' && <div style={{flex:'1.4 1 420px',minWidth:0,borderRadius:30,background:'#F4F4F2',padding:22,display:'flex',flexDirection:'column',gap:12}}><div className="co-provider-head"><div><strong>Proveedores</strong><p>Consulta y administra los proveedores de tus compras.</p></div><button type="button" className="co-primary co-provider-add" onClick={lookup(v,'openProveedor')}>+ Crear proveedor</button></div><label className="co-field">Buscar proveedor<input type="search" aria-label="Buscar proveedor" placeholder="Nombre o documento" value={lookup(v,'proveedorBusqueda')} onChange={lookup(v,'setProveedorBusqueda')} style={lookup(v,'styles')}/></label>{!lookup(v,'proveedores').length&&<span style={{fontSize:13,color:'#777'}}>Aún no hay proveedores.</span>}{lookup(v,'proveedores').length>0&&!lookup(v,'proveedoresFiltrados').length&&<span style={{fontSize:13,color:'#777'}}>No hay proveedores que coincidan con la búsqueda.</span>}{lookup(v,'proveedoresFiltrados').map(p=><div key={p.id} style={{display:'flex',gap:10,alignItems:'center',flexWrap:'wrap',padding:12,borderRadius:20,background:'#fff'}}><span style={{flex:'1 1 160px'}}><strong>{p.nombre}</strong><br/><small>{p.numeroDocumento||'Sin documento'} · {p.activo?'Activo':'Inactivo'}</small></span><button onClick={()=>lookup(v,'editProveedor')(p)} style={{border:0,borderRadius:999,padding:'10px 14px'}}>Editar</button><button disabled={lookup(v,'busy')} onClick={()=>lookup(v,'toggleProveedor')(p)} style={{border:0,borderRadius:999,padding:'10px 14px'}}>{p.activo?'Desactivar':'Activar'}</button></div>)}</div>}

              {(vista==='ordenes'||vista==='detalle') && <div style={{ "display": "flex", "flexWrap": "wrap", "gap": "14px", "alignItems": "stretch" }}>
                {vista==='ordenes' && <div style={{ "flex": "3 1 640px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "16px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "center", "gap": "10px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "18px", "fontWeight": "700" }}>
                        {"Órdenes de compra"}
                      </span>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Toca una orden para ver su detalle y recibir la mercadería."}
                      </span>
                    </span>
                    <div style={{ "display": "flex", "gap": "6px", "flexWrap": "wrap" }}>
                      {(lookup(v, "filters") || []).map((f, index6) => (
                        <Fragment key={index6}>
                          <button onClick={lookup(f, "pick")} aria-pressed={lookup(f, "pressed")} style={{ "height": "34px", "padding": "0 12px", "borderRadius": "999px", "border": "1px solid " + String(lookup(f, "border") ?? ""), "background": lookup(f, "bg"), "color": lookup(f, "fg"), "cursor": "pointer", "fontFamily": "Manrope, sans-serif", "fontSize": "12px", "fontWeight": "700" }}>
                            {lookup(f, "name")}
                            {" · "}
                            {lookup(f, "n")}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className={"noscroll"} style={{ "overflowX": "auto" }}>
                    <div style={{ "minWidth": "760px", "background": "#FFFFFF", "borderRadius": "24px", "padding": "6px 10px" }}>
                      <div style={{ "display": "grid", "gridTemplateColumns": "44px 1.5fr 1fr 0.9fr 1.2fr 0.9fr 1fr", "gap": "12px", "alignItems": "center", "padding": "10px 8px", "fontSize": "11px", "fontWeight": "700", "color": "#8C8C8C", "textTransform": "uppercase", "letterSpacing": "0.04em", "borderBottom": "1px solid #F1F1EE" }}>
                        <span></span>
                        <span>
                          {"Orden · proveedor"}
                        </span>
                        <span>
                          {"Categoría"}
                        </span>
                        <span>
                          {"Llegada"}
                        </span>
                        <span>
                          {"Recibido"}
                        </span>
                        <span style={{ "textAlign": "right" }}>
                          {"Total"}
                        </span>
                        <span>
                          {"Estado"}
                        </span>
                      </div>
                      {(lookup(v, "orders") || []).map((o, index7) => (
                        <Fragment key={index7}>
                          <button onClick={lookup(o, "select")} aria-pressed={lookup(o, "pressed")} style={{ "width": "100%", "display": "grid", "gridTemplateColumns": "44px 1.5fr 1fr 0.9fr 1.2fr 0.9fr 1fr", "gap": "12px", "alignItems": "center", "padding": "12px 8px", "margin": "4px 0", "border": "1px solid " + String(lookup(o, "border") ?? ""), "borderRadius": "18px", "background": lookup(o, "bg"), "cursor": "pointer", "textAlign": "left", "fontFamily": "Manrope, sans-serif", "color": "#111111" }}>
                            <span style={{ "width": "40px", "height": "40px", "borderRadius": "14px", "background": lookup(o, "sbg"), "display": "flex", "alignItems": "center", "justifyContent": "center" }}>
                              <svg width={"18"} height={"18"} viewBox={"0 0 24 24"} fill={"none"} stroke={lookup(o, "sfg")} strokeWidth={"1.9"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(o, "icon")}></path>
                              </svg>
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "minWidth": "0" }}>
                              <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                                {lookup(o, "id")}
                              </span>
                              <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                                {lookup(o, "prov")}
                                {" · creada "}
                                {lookup(o, "created")}
                              </span>
                            </span>
                            <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                              {lookup(o, "cat")}
                            </span>
                            <span style={{ "fontSize": "13px", "fontWeight": "600" }}>
                              {lookup(o, "eta")}
                            </span>
                            <span style={{ "display": "flex", "flexDirection": "column", "gap": "5px" }}>
                              <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                                {lookup(o, "recText")}
                              </span>
                              <span style={{ "height": "6px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                                <span style={{ "display": "block", "width": lookup(o, "pct"), "height": "100%", "borderRadius": "999px", "background": "#E8701F" }}></span>
                              </span>
                            </span>
                            <span style={{ "fontSize": "14px", "fontWeight": "800", "textAlign": "right" }}>
                              {lookup(o, "total")}
                            </span>
                            <span style={{ "justifySelf": "start", "display": "inline-flex", "alignItems": "center", "gap": "6px", "padding": "5px 10px", "borderRadius": "999px", "background": lookup(o, "sbg"), "color": lookup(o, "sfg"), "fontSize": "11px", "fontWeight": "800" }}>
                              <svg width={"11"} height={"11"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.4"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                                <path d={lookup(o, "icon")}></path>
                              </svg>
                              {lookup(o, "state")}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                      {lookup(v,'cargando') && <div role="status" style={{padding:24,fontSize:13}}>Cargando compras…</div>}
                      {Boolean(lookup(v, "noOrders")) && (
                        <Fragment>
                          <div style={{ "padding": "24px", "textAlign": "center", "fontSize": "13px", "color": "#8C8C8C" }}>
                            {"No hay órdenes en este estado."}
                          </div>
                        </Fragment>
                      )}
                    </div>
                  </div>
                </div>}
                {vista==='detalle' && !lookup(v,'selected') && <div role="status" className="co-empty-detail">{lookup(v,'cargando')?'Cargando orden…':'No se encontró esta orden.'} <DesignLink href="/compras">Volver a órdenes</DesignLink></div>}
                {vista==='detalle' && lookup(v,'selected') && <div style={{ "flex": "2 1 420px", "minWidth": "0", "borderRadius": "30px", "background": "#F4F4F2", "padding": "22px", "display": "flex", "flexDirection": "column", "gap": "14px" }}>
                  <div style={{ "display": "flex", "justifyContent": "space-between", "alignItems": "flex-start", "gap": "12px", "flexWrap": "wrap" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "4px" }}>
                      <span style={{ "fontSize": "12px", "color": "#6B6B6B" }}>
                        {"Orden seleccionada · "}
                        {lookup(v, "sel.cat")}
                      </span>
                      <span style={{ "fontSize": "26px", "fontWeight": "800" }}>
                        {lookup(v, "sel.id")}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "600" }}>
                        {lookup(v, "sel.prov")}
                      </span>
                    </span>
                    <span style={{ "display": "inline-flex", "alignItems": "center", "gap": "8px", "height": "36px", "padding": "0 14px", "borderRadius": "999px", "background": lookup(v, "sel.sbg"), "color": lookup(v, "sel.sfg"), "fontSize": "12px", "fontWeight": "800" }}>
                      <svg width={"13"} height={"13"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={lookup(v, "sel.icon")}></path>
                      </svg>
                      {lookup(v, "sel.state")}
                    </span>
                  </div>
                  <div style={{ "display": "grid", "gridTemplateColumns": "repeat(3, minmax(0, 1fr))", "gap": "8px" }}>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px 12px", "borderRadius": "16px", "background": "#FFFFFF" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"Creada"}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                        {lookup(v, "sel.created")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px 12px", "borderRadius": "16px", "background": "#FFFFFF" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"Llegada estimada"}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                        {lookup(v, "sel.eta")}
                      </span>
                    </span>
                    <span style={{ "display": "flex", "flexDirection": "column", "gap": "2px", "padding": "10px 12px", "borderRadius": "16px", "background": "#FFFFFF" }}>
                      <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                        {"Pago"}
                      </span>
                      <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                        {lookup(v, "sel.pay")}
                      </span>
                    </span>
                  </div>
                  <div style={{ "background": "#FFFFFF", "borderRadius": "24px", "padding": "6px 16px" }}>
                    {(lookup(v, "selLines") || []).map((l, index8) => (
                      <Fragment key={index8}>
                        <div style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "12px 0", "borderBottom": "1px solid #F1F1EE", "flexWrap": "wrap" }}>
                          <span style={{ "flex": "1 1 180px", "display": "flex", "flexDirection": "column", "gap": "6px", "minWidth": "0" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "700" }}>
                              {lookup(l, "name")}
                            </span>
                            <span style={{ "display": "flex", "alignItems": "center", "gap": "8px" }}>
                              <span style={{ "flex": "1", "height": "6px", "borderRadius": "999px", "background": "#F1F1EE" }}>
                                <span style={{ "display": "block", "width": lookup(l, "pct"), "height": "100%", "borderRadius": "999px", "background": lookup(l, "barC") }}></span>
                              </span>
                              <span style={{ "fontSize": "11px", "fontWeight": "700", "color": "#6B6B6B", "whiteSpace": "nowrap" }}>
                                {lookup(l, "rec")}
                                {" de "}
                                {lookup(l, "qty")}
                                {" recibidos"}
                              </span>
                            </span>
                          </span>
                          <span style={{ "display": "flex", "flexDirection": "column", "alignItems": "flex-end", "minWidth": "90px" }}>
                            <span style={{ "fontSize": "14px", "fontWeight": "800" }}>
                              {lookup(l, "sub")}
                            </span>
                            <span style={{ "fontSize": "11px", "color": "#6B6B6B" }}>
                              {lookup(l, "unit")}
                              {" c/u"}
                            </span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <div style={{ "display": "flex", "flexDirection": "column", "gap": "6px", "padding": "12px 0 10px", "fontSize": "13px" }}>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "color": "#444444" }}>
                        <span>
                          {"Subtotal"}
                        </span>
                        <span>
                          {lookup(v, "sel.subtotal")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "color": "#444444" }}>
                        <span>
                          {"IGV"}
                        </span>
                        <span>
                          {lookup(v, "sel.igv")}
                        </span>
                      </span>
                      <span style={{ "display": "flex", "justifyContent": "space-between", "fontSize": "16px", "fontWeight": "800" }}>
                        <span>
                          {"Total"}
                        </span>
                        <span>
                          {lookup(v, "sel.total")}
                        </span>
                      </span>
                    </div>
                  </div>
                  <DesignLink href={"/inventario"} style={{ "display": "flex", "alignItems": "center", "gap": "12px", "padding": "14px 16px", "borderRadius": "20px", "background": "#FFF1E6", "color": "#8A3B0A", "textDecoration": "none" }}>
                    <span style={{ "width": "36px", "height": "36px", "borderRadius": "12px", "background": "#FFFFFF", "display": "flex", "alignItems": "center", "justifyContent": "center", "flex": "none" }}>
                      <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"#8A3B0A"} strokeWidth={"2"} strokeLinecap={"round"} strokeLinejoin={"round"} aria-hidden={"true"}>
                        <path d={"M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10"}></path>
                      </svg>
                    </span>
                    <span style={{ "flex": "1", "display": "flex", "flexDirection": "column" }}>
                      <span style={{ "fontSize": "13px", "fontWeight": "800" }}>
                        {lookup(v, "sel.lotText")}
                      </span>
                      <span style={{ "fontSize": "12px" }}>
                        {"Ubicación: "}
                        {lookup(v, "sel.loc")}
                        {" · ver en Inventario y lotes"}
                      </span>
                    </span>
                    <svg width={"16"} height={"16"} viewBox={"0 0 24 24"} fill={"none"} stroke={"currentColor"} strokeWidth={"2.2"} aria-hidden={"true"}>
                      <path d={"M5 12h14M13 6l6 6-6 6"}></path>
                    </svg>
                  </DesignLink>
                  <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>{lookup(v,'puedeEnviar') && <button disabled={lookup(v,'busy')} onClick={lookup(v,'enviar')} style={{height:42,padding:'0 18px',border:0,borderRadius:999,background:'#111',color:'#fff',fontWeight:700}}>Marcar como enviada</button>}{lookup(v,'puedeCancelar') && <button disabled={lookup(v,'busy')} onClick={lookup(v,'cancelar')} style={{height:42,padding:'0 18px',border:0,borderRadius:999,background:'#fff',fontWeight:700}}>Cancelar orden</button>}</div>
                </div>}
              </div>}
              {vista==='detalle' && lookup(v,'selected') && <div style={{display:'flex',flexWrap:'wrap',gap:14,alignItems:'stretch'}}>
                <div style={{flex:'1 1 340px',minWidth:0,borderRadius:30,background:'#111',color:'#fff',padding:22,display:'flex',flexDirection:'column',gap:12}}><strong>Recibir mercadería · {lookup(v,'sel.id')}</strong>
                  {lookup(v,'canReceive')?<><span style={{fontSize:12,color:'#BDBDBD'}}>Indica lo que llegó y la ubicación. Los lotes se crean automáticamente con el proveedor, la variante y el costo de esta orden. Puedes registrar recepciones parciales.</span><label>Ubicación<select aria-label="Ubicación de la recepción" value={lookup(v,'almacenId')} onChange={lookup(v,'setAlmacen')} style={{...lookup(v,'styles'),display:'block',width:'100%',marginTop:6}}><option value="">Selecciona ubicación</option>{lookup(v,'almacenes').map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}</select></label>{lookup(v,'receiveLines').map(l=><label key={l.id} style={{padding:12,borderRadius:18,background:'#1C1C1C',display:'flex',gap:12,alignItems:'center',flexWrap:'wrap'}}><span style={{flex:1}}>{l.name}<br/><small>{l.pendiente} pendientes</small></span><input aria-label={'Cantidad recibida de '+l.name} type="number" min="0.001" max={l.pendiente} step="0.001" value={l.value} onChange={l.change} style={{...lookup(v,'styles'),width:100}}/></label>)}<label style={{fontSize:13}}><input type="checkbox" checked={lookup(v,'revisar')} onChange={lookup(v,'setRevisar')}/> Revisar calidad antes de vender</label><button disabled={lookup(v,'busy')} onClick={lookup(v,'recibir')} style={{height:46,border:0,borderRadius:999,background:'#FF914C',fontWeight:800}}>Registrar recepción</button></>:<span style={{color:'#BDBDBD',fontSize:13}}>{lookup(v,'recvNote')}</span>}
                  {lookup(v,'error')&&<span role="alert" style={{color:'#FFB8AD',fontSize:12}}>{lookup(v,'error')}</span>}{lookup(v,'aviso')&&<span role="status" style={{color:'#BFE6C5',fontSize:12}}>{lookup(v,'aviso')}</span>}
                  {(lookup(v,'selected')?.recepciones||[]).map(r=><div key={r.id} style={{padding:12,borderRadius:16,background:'#222',fontSize:12}}><strong>{r.numero}</strong> · {new Date(r.recibidaEn).toLocaleString('es-PE')}{r.detalles.map(d=><div key={d.id}>Lote {d.codigoLote} · {d.cantidad} · {d.almacen.nombre}</div>)}</div>)}
                  {lookup(v,'detalles').length>0&&<div style={{marginTop:12,paddingTop:16,borderTop:'1px solid #444',display:'flex',flexDirection:'column',gap:10}}><strong>Devolver al proveedor</strong><span style={{fontSize:12,color:'#BDBDBD'}}>Registra solo la mercadería que se entrega al proveedor. El inventario se descontará al confirmar.</span><label>Recepción y lote<select aria-label="Recepción y lote para devolver" style={{...lookup(v,'styles'),display:'block',width:'100%',marginTop:6}} value={lookup(v,'devDetalle')} onChange={lookup(v,'setDevDetalle')}><option value="">Selecciona un lote recibido</option>{lookup(v,'detalles').filter(d=>d.lote&&d.pendiente>0).map(d=><option key={d.id} value={d.id}>{d.recepcionNumero} · {d.lineaOrdenCompra.producto.nombre}{d.lineaOrdenCompra.variante?' · '+Object.values(d.lineaOrdenCompra.variante.atributos).join(' / '):''} · {d.codigoLote} · {d.pendiente} no devueltas</option>)}</select></label>{lookup(v,'detalleDev')&&<><label>Ubicación<select aria-label="Ubicación de devolución" style={{...lookup(v,'styles'),display:'block',width:'100%',marginTop:6}} value={lookup(v,'devAlmacen')} onChange={lookup(v,'field')('devAlmacen')}><option value="">Selecciona ubicación</option>{lookup(v,'ubicacionesDev').map(x=><option key={x.almacen.id} value={x.almacen.id}>{x.almacen.nombre} · disponible {Number(x.cantidadFisica)-Number(x.cantidadReservada)}</option>)}</select></label><label>Cantidad<input aria-label="Cantidad a devolver" type="number" min="0.001" step="0.001" style={{...lookup(v,'styles'),display:'block',width:'100%',boxSizing:'border-box',marginTop:6}} value={lookup(v,'devCantidad')} onChange={lookup(v,'field')('devCantidad')}/></label><label>Motivo<input aria-label="Motivo de devolución" maxLength={250} style={{...lookup(v,'styles'),display:'block',width:'100%',boxSizing:'border-box',marginTop:6}} value={lookup(v,'devMotivo')} onChange={lookup(v,'field')('devMotivo')}/></label><button disabled={lookup(v,'busy')} onClick={lookup(v,'devolver')} style={{height:46,border:0,borderRadius:999,background:'#FF914C',fontWeight:800}}>Registrar devolución</button></>}{lookup(v,'error')&&<span role="alert" style={{color:'#FFB8AD',fontSize:12}}>{lookup(v,'error')}</span>}{lookup(v,'aviso')&&<span role="status" style={{color:'#BFE6C5',fontSize:12}}>{lookup(v,'aviso')}</span>}</div>}
                  {lookup(v,'detalles').flatMap(d=>(d.devolucionesProveedor||[]).map(x=><div key={x.id} style={{padding:12,borderRadius:16,background:'#222',fontSize:12}}><strong>{x.numero} · devolución</strong><br/>{d.codigoLote} · {x.cantidad} · {x.almacen.nombre}<br/>{x.motivo} · {new Date(x.creadoEn).toLocaleString('es-PE')}</div>))}
                </div>

              </div>}

            </div>
          </div>
        </div>
        {Boolean(lookup(v, "menuOpen")) && (
          <Fragment>
            <div style={{ "position": "absolute", "inset": "0", "zIndex": "20", "background": "rgba(17,17,17,0.3)", "padding": "96px 24px 24px", "boxSizing": "border-box" }}>
              <div style={{ "maxWidth": "1100px" }}>
                <DesignImport name={"MenuPanel"} mode={"pop"} active={"Compras"} onPin={lookup(v, "togglePin")} onClose={lookup(v, "closeMenu")} />
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </div>
    </Fragment>
  )} />;
}
