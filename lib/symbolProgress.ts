import type { SymbolItem } from "./characterTypes";

const ARCANE_REQUIREMENTS = [
  12, 15, 20, 27, 36, 47, 60, 75, 92, 111, 132, 155, 180, 207, 236,
  267, 300, 335, 372,
];
const AUTHENTIC_REQUIREMENTS = [
  29, 76, 141, 224, 325, 444, 581, 736, 909, 1100,
];

function getRequirements(symbol: SymbolItem) {
  return symbol.symbol_name.includes("아케인심볼")
    ? ARCANE_REQUIREMENTS
    : AUTHENTIC_REQUIREMENTS;
}

export function isSymbolMaxLevel(symbol: SymbolItem) {
  const maxLevel = getRequirements(symbol).length + 1;

  return symbol.symbol_level >= maxLevel;
}

export function getSymbolRemainingToMax(symbol: SymbolItem) {
  if (isSymbolMaxLevel(symbol)) return 0;

  const remainingRequirements = getRequirements(symbol)
    .slice(symbol.symbol_level - 1)
    .reduce((sum, requirement) => sum + requirement, 0);

  return Math.max(remainingRequirements - symbol.symbol_growth_count, 0);
}

export function getSymbolProgressPercent(symbol: SymbolItem) {
  if (isSymbolMaxLevel(symbol)) return 100;

  const requirements = getRequirements(symbol);
  const total = requirements.reduce((sum, requirement) => sum + requirement, 0);
  const completedBeforeCurrentLevel = requirements
    .slice(0, symbol.symbol_level - 1)
    .reduce((sum, requirement) => sum + requirement, 0);

  return Math.min(
    Math.round(
      ((completedBeforeCurrentLevel + symbol.symbol_growth_count) / total) * 100
    ),
    100
  );
}
