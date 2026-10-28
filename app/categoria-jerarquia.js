export function rutaCategoria(categorias, id) {
  const mapa = new Map(categorias.map(c => [c.id, c]));
  const ruta = [];
  const vistos = new Set();
  while (id && !vistos.has(id)) {
    vistos.add(id);
    const categoria = mapa.get(id);
    if (!categoria) break;
    ruta.unshift(categoria.nombre);
    id = categoria.categoriaPadreId;
  }
  return ruta.join(' › ');
}

export function opcionesCategoria(categorias) {
  return [...categorias].sort((a, b) => rutaCategoria(categorias, a.id).localeCompare(rutaCategoria(categorias, b.id), 'es'));
}

export function nivelCategoria(categorias, id) {
  const mapa = new Map(categorias.map(c => [c.id, c]));
  const vistos = new Set();
  let nivel = 0;
  let padre = mapa.get(id)?.categoriaPadreId;
  while (padre && mapa.has(padre) && !vistos.has(padre)) {
    vistos.add(padre);
    nivel++;
    padre = mapa.get(padre)?.categoriaPadreId;
  }
  return nivel;
}
