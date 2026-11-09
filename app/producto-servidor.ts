import { cache } from 'react';
import type { DetalleTienda } from './backend-api';
import { idProductoValido } from './producto-url.mjs';
export const leerProductoPublico = cache(async (id: string): Promise<DetalleTienda | null> => {
  if (!idProductoValido(id)) return null;
  const api = (process.env.API_INTERNA_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api/v1').replace(/\/$/, '');
  const respuesta = await fetch(`${api}/tienda/productos/${encodeURIComponent(id)}`, { cache:'no-store' });
  if (respuesta.status === 404) return null;
  if (!respuesta.ok) throw new Error('No se pudo cargar el producto.');
  const json = await respuesta.json();
  return json.datos;
});
export function origenPublico(): string | null {
  try { const url = new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL || ''); return ['http:','https:'].includes(url.protocol) ? url.origin : null; } catch { return null; }
}
