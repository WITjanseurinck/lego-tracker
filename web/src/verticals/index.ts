import type { VerticalConfig } from './types';
import { lego } from './lego';

// Een nieuwe vertical (bv. parfum) is een nieuw bestand hier plus een regel in deze lijst.
const all: Record<string, VerticalConfig> = { lego };

const id = process.env.VERTICAL ?? 'lego';
export const VERTICAL: VerticalConfig = all[id] ?? lego;
