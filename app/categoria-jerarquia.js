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
