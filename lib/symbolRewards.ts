import type { SymbolItem } from "./characterTypes";

export const ARCANE_WEEKLY_REWARD = 240;

export function getDailySymbolReward(symbol: SymbolItem) {
  if (symbol.symbol_name.includes("아케인심볼")) return 20;
  if (symbol.symbol_name.includes("세르니움")) return 20;
  return 10;
}
