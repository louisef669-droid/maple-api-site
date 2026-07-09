export type CharacterCacheItem = {
  data: any;
  updatedAt: number;
};

export function getCharacterCacheKey(presetName: string, characterName: string) {
  return `character-cache-${presetName}-${characterName}`;
}

export function saveCharacterCache(
  presetName: string,
  characterName: string,
  data: any
) {
  localStorage.setItem(
    getCharacterCacheKey(presetName, characterName),
    JSON.stringify({
      data,
      updatedAt: Date.now(),
    })
  );
}

export function loadCharacterCache(
  presetName: string,
  characterName: string
): CharacterCacheItem | null {
  const saved = localStorage.getItem(
    getCharacterCacheKey(presetName, characterName)
  );

  return saved ? JSON.parse(saved) : null;
}

export async function fetchCharacterData(characterName: string) {
  const res = await fetch(
    `/api/character?name=${encodeURIComponent(characterName)}`
  );

  const data = await res.json();

  if (!res.ok || data?.error || !data?.basic) {
    throw new Error(
      JSON.stringify({
        status: res.status,
        characterName,
        data,
      })
    );
  }

  return data;
}