export function estadoLote(estado, cantidadFisica, cantidadReservada) {
  const fisico = Number(cantidadFisica) || 0;
  const reservado = Number(cantidadReservada) || 0;
  if (fisico <= 0) return 'Agotado';
  if (estado === 'en_revision') return 'En revisión';
  if (estado === 'bloqueado') return 'Bloqueado';
  if (estado === 'agotado') return 'Agotado';
  if (estado === 'disponible' && fisico - reservado <= 0) return 'Reservado';
  return estado === 'disponible' ? 'Activo' : 'Bloqueado';
}
