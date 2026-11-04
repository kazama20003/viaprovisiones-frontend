"use client";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { obtenerSesion, listarAlmacenes, obtenerUbicacionTrabajo, seleccionarUbicacionTrabajo } from './backend-api';

export function useUbicacionTrabajo() {
  const qc=useQueryClient();
  const sesion=useQuery({queryKey:['sesion','actual'],queryFn:({signal})=>obtenerSesion(signal),staleTime:30000});
  const usuario=sesion.data?.datos;
  const permitido=!!usuario?.permisos?.includes('catalogo.productos.leer');
  const key=['ubicacion-trabajo',usuario?.id];
  const actual=useQuery({queryKey:key,queryFn:({signal})=>obtenerUbicacionTrabajo(signal),enabled:permitido,staleTime:30000});
  const almacenes=useQuery({queryKey:['inventario','almacenes'],queryFn:({signal})=>listarAlmacenes(signal),enabled:permitido});
  const cambiar=useMutation({mutationFn:seleccionarUbicacionTrabajo,onSuccess:res=>qc.setQueryData(key,res)});
  return {permitido,actual:actual.data?.datos||null,almacenes:(almacenes.data?.datos||[]).filter(a=>a.activo),pendiente:actual.isPending||almacenes.isPending,guardando:cambiar.isPending,error:cambiar.error?.message||actual.error?.message||almacenes.error?.message||'',cambiar:(id)=>cambiar.mutateAsync(id)};
}

export default function SelectorUbicacion({compacto=false}) {
  const u=useUbicacionTrabajo();
  if(!u.permitido)return null;
  return <div className={'via-work-location'+(compacto?' is-compact':'')}>
    <label><span>Ubicación de trabajo</span><select aria-label="Ubicación de trabajo" value={u.actual?.id||''} disabled={u.pendiente||u.guardando} onChange={e=>u.cambiar(e.target.value||null).catch(()=>{})}>
      <option value="">Seleccionar ubicación</option>{u.almacenes.map(a=><option key={a.id} value={a.id}>{a.sucursal?.nombre ? a.sucursal.nombre+' · ' : ''}{a.nombre}</option>)}
    </select></label>
    {u.error&&<span role="alert">{u.error}</span>}
  </div>;
}
