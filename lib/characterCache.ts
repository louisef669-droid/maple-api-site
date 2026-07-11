import type { CharacterData } from "./characterTypes";

export type CharacterCacheItem = {
  data: CharacterData;
  updatedAt: number;
};

export function getCharacterCacheKey(presetName: string, characterName: string) {
  return `character-cache-${presetName}-${characterName}`;
}

export function saveCharacterCache(
  presetName: string,
  characterName: string,
  data: CharacterData
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

export async function fetchCharacterData(
  characterName: string
): Promise<CharacterData> {
  const res = await fetch(
    `/api/character?name=${encodeURIComponent(characterName)}`
  );

  const responseText = await res.text();

  if (!responseText.trim()) {
    throw new Error(
      "서버 응답이 없습니다. 로컬 서버가 실행 중인지 확인해 주세요."
    );
  }

  let data: Partial<CharacterData> & { error?: string };

  try {
    data = JSON.parse(responseText) as Partial<CharacterData> & {
      error?: string;
    };
  } catch {
    throw new Error(
      "서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해 주세요."
    );
  }

  if (!res.ok || data?.error || !data?.basic) {
    throw new Error(
      JSON.stringify({
        status: res.status,
        characterName,
        data,
      })
    );
  }

  return data as CharacterData;
}
