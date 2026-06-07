import {
  severidadTone,
  estadoTone,
  sentimientoTone,
  cumplimientoTone,
  responsabilidadTone,
  formatLong,
  formatRelative,
} from './format';

describe('tone helpers', () => {
  it('severidadTone maps keywords (accent-insensitive)', () => {
    expect(severidadTone('Crítica')).toBe('alert');
    expect(severidadTone('alta')).toBe('alert');
    expect(severidadTone('Media')).toBe('warn');
    expect(severidadTone('baja')).toBe('ok');
    expect(severidadTone(undefined)).toBe('neutral');
    expect(severidadTone('xyz')).toBe('neutral');
  });

  it('estadoTone maps resolution states', () => {
    expect(estadoTone('Resuelto')).toBe('ok');
    expect(estadoTone('Escalado a orden de trabajo')).toBe('accent');
    expect(estadoTone('Pendiente')).toBe('warn');
  });

  it('sentimientoTone maps sentiment', () => {
    expect(sentimientoTone('Cliente satisfecho')).toBe('ok');
    expect(sentimientoTone('Molesto y frustrado')).toBe('alert');
    expect(sentimientoTone('neutral')).toBe('neutral');
  });

  it('cumplimientoTone maps compliance', () => {
    expect(cumplimientoTone('No cumple')).toBe('alert');
    expect(cumplimientoTone('Parcial')).toBe('warn');
    expect(cumplimientoTone('Cumple')).toBe('ok');
  });

  it('responsabilidadTone maps responsibility', () => {
    expect(responsabilidadTone('Empresa')).toBe('accent');
    expect(responsabilidadTone('Cliente')).toBe('warn');
  });
});

describe('date formatting', () => {
  it('formatLong returns empty for missing/invalid', () => {
    expect(formatLong(undefined)).toBe('');
    expect(formatLong('not-a-date')).toBe('');
  });

  it('formatLong formats a valid ISO date', () => {
    expect(formatLong('2026-06-04T22:00:00Z')).not.toBe('');
  });

  it('formatRelative returns "ahora" for just now', () => {
    expect(formatRelative(new Date().toISOString())).toBe('ahora');
  });

  it('formatRelative returns empty for invalid', () => {
    expect(formatRelative('nope')).toBe('');
  });
});
