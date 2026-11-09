export function resumenCosto(lotes, hoy) {
  const validos = (lotes || []).filter(l => l.estado === 'disponible' && (!l.fechaVencimiento || l.fechaVencimiento.slice(0, 10) >= hoy)).map(l => ({ cantidad: (l.existencias || []).reduce((n, e) => n + Math.max(0, Number(e.cantidadFisica) - Number(e.cantidadReservada)), 0), costo: Number(l.costoUnitario) })).filter(l => l.cantidad > 0);
  const unidades = validos.reduce((n, l) => n + l.cantidad, 0);
  if (!unidades) return { unidades: 0, costo: null, razon: 'sin_stock' };
  if (validos.some(l => !Number.isFinite(l.costo) || l.costo <= 0)) return { unidades, costo: null, razon: 'costo_pendiente' };
  return { unidades, costo: validos.reduce((n, l) => n + l.cantidad * l.costo, 0) / unidades, razon: null };
}
export function calcularMargen(precio, costo, tasa, incluyeIgv) {
  if (!Number.isFinite(costo) || costo <= 0 || !Number.isFinite(tasa) || tasa < 0 || typeof incluyeIgv !== 'boolean') return null;
  const bruto = Number(precio);
  if (!Number.isFinite(bruto) || bruto <= 0) return null;
  const neto = incluyeIgv ? bruto / (1 + tasa) : bruto;
  return (neto - costo) / neto;
}
export function precioEquilibrio(costo, tasa, incluyeIgv) {
  if (!Number.isFinite(costo) || costo <= 0 || !Number.isFinite(tasa) || tasa < 0 || typeof incluyeIgv !== 'boolean') return null;
  return Math.ceil((costo * (incluyeIgv ? 1 + tasa : 1) - 1e-10) * 100) / 100;
}
