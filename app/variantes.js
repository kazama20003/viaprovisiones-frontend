export const claveVariante = atributos => JSON.stringify(Object.entries(atributos).sort(([a], [b]) => a.localeCompare(b)));
export const nombreVariante = atributos => Object.entries(atributos || {}).map(([nombre, valor]) => `${nombre}: ${valor}`).join(' · ');
export function atributosIniciales(detalles = {}) {
  if (Array.isArray(detalles.atributosVariantes)) return detalles.atributosVariantes.map(a => ({ nombre:a.nombre, texto:a.valores.join(', ') }));
  return [['Color', detalles.colores], ['Capacidad', detalles.capacidades]].filter(([, valores]) => valores?.length).map(([nombre, valores]) => ({ nombre, texto:valores.join(', ') }));
}
export function prepararVariantes(grupos) {
  if (grupos.length > 3) throw new Error('Usa hasta 3 atributos.');
  const nombres = new Set();
  let combinaciones = [{}];
  const atributos = grupos.map(g => {
    const nombre = g.nombre.trim();
    const valores = g.texto.split(',').map(v => v.trim()).filter(Boolean);
    const key = nombre.toLocaleLowerCase('es');
    if (!nombre || nombre.length > 50 || !valores.length || valores.length > 20 || valores.some(v => v.length > 50)) throw new Error('Cada atributo necesita nombre y de 1 a 20 valores de hasta 50 caracteres.');
    if (nombres.has(key) || new Set(valores.map(v => v.toLocaleLowerCase('es'))).size !== valores.length) throw new Error('No repitas nombres de atributos ni valores.');
    nombres.add(key);
    combinaciones = combinaciones.flatMap(a => valores.map(v => ({ ...a, [key]:v })));
    if (combinaciones.length > 100) throw new Error('El producto admite hasta 100 variantes.');
    return { nombre, valores };
  });
  return { atributos, combinaciones: grupos.length ? combinaciones : [] };
}
