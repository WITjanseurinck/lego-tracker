import type { Vertical } from '../types.js';
import { lego } from './lego.js';

// Een nieuwe vertical (bv. parfum) is een nieuw bestand hier plus een regel in deze lijst.
const all: Record<string, Vertical> = { lego };

export function currentVertical(): Vertical {
  const id = process.env.VERTICAL ?? 'lego';
  const v = all[id];
  if (!v) throw new Error(`Onbekende vertical: ${id}. Beschikbaar: ${Object.keys(all).join(', ')}`);
  const override = process.env.COUNTRIES?.split(',').map((c) => c.trim().toUpperCase()).filter(Boolean);
  return override?.length ? { ...v, countries: override } : v;
}
