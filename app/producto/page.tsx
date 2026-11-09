import { Suspense } from 'react';
import { permanentRedirect } from 'next/navigation';
import NativeView from '../native-view';
import { idProductoValido, rutaProducto } from '../producto-url.mjs';
import { leerProductoPublico } from '../producto-servidor';
async function ProductoAnterior({searchParams}:{searchParams:Promise<{id?:string|string[]}>}) {
  const {id}=await searchParams;
  if (idProductoValido(id)) { const p=await leerProductoPublico(id as string); if(p) permanentRedirect(rutaProducto(p.nombre,p.id,p.sku)); }
  return <NativeView name="Producto"/>;
}
export default function ProductoPage(props:{searchParams:Promise<{id?:string|string[]}>}){return <Suspense fallback={<main className="design-frame-shell" aria-busy="true"/>}><ProductoAnterior {...props}/></Suspense>}
