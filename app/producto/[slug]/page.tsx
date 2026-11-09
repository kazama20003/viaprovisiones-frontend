import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import ProductoPublico from '../../design-views/ProductoPublico';
import { idDeRutaProducto, rutaProducto } from '../../producto-url.mjs';
import { leerProductoPublico, origenPublico } from '../../producto-servidor';

type Props = { params: Promise<{slug:string}> };
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {slug} = await params; const id = idDeRutaProducto(slug); if (!id) return {robots:{index:false,follow:false}};
  const p = await leerProductoPublico(id); if (!p) return {title:'Producto no disponible | VIA Provisiones',robots:{index:false,follow:false}};
  const origin=origenPublico(),canonical=origin ? origin+rutaProducto(p.nombre,p.id) : undefined;
  return {title:`${p.nombre} | VIA Provisiones`,description:p.descripcion?.slice(0,160) || `${p.nombre} en VIA Provisiones.`,...(canonical ? {alternates:{canonical}} : {})};
}
async function Ficha({params}:Props) {
  const {slug} = await params; const id = idDeRutaProducto(slug); if (!id) notFound();
  const p = await leerProductoPublico(id); if (!p) notFound();
  const ruta = rutaProducto(p.nombre,p.id); if (`/producto/${slug}` !== ruta) permanentRedirect(ruta);
  return <ProductoPublico producto={p} estado="success" error={null} reintentar={undefined}/>;
}
export default function ProductoPage(props:Props) {return <Suspense fallback={<main aria-busy="true">Cargando producto…</main>}><Ficha {...props}/></Suspense>}
