export const DEFAULT_PRESETS = ["본계정", "부계정1", "부계정2"];

export function getFavoriteKey(presetName: string) {
  return `favorite-characters-${presetName}`;
}

export function loadPresets() {
  if (typeof window === "undefined") return DEFAULT_PRESETS;

  const saved = localStorage.getItem("mcm-presets");
  return saved ? JSON.parse(saved) : DEFAULT_PRESETS;
}

export function savePresets(presets: string[]) {
  localStorage.setItem("mcm-presets", JSON.stringify(presets));
}

export function loadActivePreset(presets: string[]) {
  if (typeof window === "undefined") return presets[0];

  const saved = localStorage.getItem("mcm-active-preset");
  return saved && presets.includes(saved) ? saved : presets[0];
}

export function saveActivePreset(presetName: string) {
  localStorage.setItem("mcm-active-preset", presetName);
}

export function loadFavoritesByPreset(presetName: string) {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(getFavoriteKey(presetName));
  return saved ? JSON.parse(saved) : [];
}

export function saveFavoritesByPreset(presetName: string, favorites: string[]) {
  localStorage.setItem(getFavoriteKey(presetName), JSON.stringify(favorites));
}

export function deletePresetStorage(presetName: string) {
  localStorage.removeItem(getFavoriteKey(presetName));
}