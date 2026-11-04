import { test } from 'node:test';
import assert from 'node:assert/strict';
import { estadoLote } from '../app/inventario-lotes.mjs';
test('distingue existencias agotadas, reservadas y disponibles', () => {
  assert.equal(estadoLote('disponible', 0, 0), 'Agotado');
  assert.equal(estadoLote('en_revision', 0, 0), 'Agotado');
  assert.equal(estadoLote('disponible', 10, 10), 'Reservado');
  assert.equal(estadoLote('disponible', 10, 3), 'Activo');
  assert.equal(estadoLote('en_revision', 10, 0), 'En revisión');
  assert.equal(estadoLote('bloqueado', 10, 0), 'Bloqueado');
});
