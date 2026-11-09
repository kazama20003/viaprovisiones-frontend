import { NextRequest, NextResponse } from 'next/server';
import { idDeRutaProducto, idProductoValido, skuDeRutaProducto, skuPublicoValido, rutaProducto } from './app/producto-url.mjs';
export async function proxy(request:NextRequest) {
  const path=request.nextUrl.pathname;
  const id=path==='/producto' ? request.nextUrl.searchParams.get('id') : path.startsWith('/producto/') && !path.slice(10).includes('/') ? idDeRutaProducto(path.slice(10)) || skuDeRutaProducto(path.slice(10)) : null;
  if (path.startsWith('/producto/') && !path.slice(10).includes('/') && path !== '/producto/editar' && !id) return new NextResponse('Producto no encontrado.',{status:404,headers:{'X-Robots-Tag':'noindex'}});
  if (!idProductoValido(id) && !skuPublicoValido(id)) return NextResponse.next();
  try {
    const api=(process.env.API_INTERNA_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1').replace(/\/$/,'');
    const response=await fetch(`${api}/tienda/productos/${skuPublicoValido(id) ? 'codigo/' : ''}${encodeURIComponent(id as string)}`,{cache:'no-store',signal:AbortSignal.timeout(5000)});
    if(response.status === 404) return new NextResponse('Producto no encontrado.',{status:404,headers:{'X-Robots-Tag':'noindex'}});
    if(!response.ok) return NextResponse.next();
    const p=(await response.json()).datos;
    if(!p || (skuPublicoValido(id) ? p.sku !== id : p.id?.toLowerCase() !== (id as string).toLowerCase()) || typeof p.nombre !== 'string') return NextResponse.next();
    const actual=rutaProducto(p.nombre,p.id,p.sku);
    if(path===actual) return NextResponse.next();
    const destino=request.nextUrl.clone(); destino.pathname=actual; destino.searchParams.delete('id');
    return NextResponse.redirect(destino,308);
  } catch { return NextResponse.next(); }
}
export const config = { matcher: ['/producto', '/producto/:path*'] };
