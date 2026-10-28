import data from '../../data/history.json';

export interface HistoryPoint { d: string; p: number }
const hist = data as Record<string, HistoryPoint[]>;

/** Prijsverloop van een set bij bol (een punt per wijziging), oud naar nieuw. */
export const priceHistory = (set: string): HistoryPoint[] => hist[set] ?? [];
