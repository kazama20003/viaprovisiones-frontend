export function slugProducto(nombre) {
  const limpio=String(nombre||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,80).replace(/-+$/,'');
  return limpio || 'producto';
}
export function skuPublicoValido(sku) { return typeof sku === 'string' && /^VIA-\d{6,12}$/.test(sku); }
export function rutaProducto(nombre,id,sku) { return skuPublicoValido(sku) ? `/producto/${slugProducto(nombre)}-${sku.toLowerCase()}` : `/producto/${slugProducto(nombre)}--${String(id).toLowerCase()}`; }
export function skuDeRutaProducto(segmento) {
  const match=String(segmento||'').match(/^([a-z0-9]+(?:-[a-z0-9]+)*)-(via-\d{6,12})$/i);
  return match ? match[2].toUpperCase() : null;
}
export function idDeRutaProducto(segmento) {
  const match=String(segmento||'').match(/^([a-z0-9]+(?:-[a-z0-9]+)*)--([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})$/i);
  return match ? match[2].toLowerCase() : null;
}
export function idProductoValido(valor) { return typeof valor==='string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor); }
