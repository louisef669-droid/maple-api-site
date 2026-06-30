import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

export type BackupData = {
  version: 1;
  presets: string[];
  activePreset: string;
  favoritesByPreset: Record<string, string[]>;
  disabledCharactersByPreset: Record<string, string[]>;
  bossesByPresetAndCharacter: Record<string, string[]>;
  bossPartyByPresetAndCharacter: Record<string, Record<string, number>>;
};

const BACKUP_PREFIX = "MCM-v3-";
const V2_BACKUP_PREFIX = "MCM-v2-";
const V1_BACKUP_PREFIX = "MCM-v1-";

type CompactBackupDataV2 = {
  v: 2;
  p: string[];
  a: string;
  f: Record<string, string[]>;
  d: Record<string, string[]>;
  b: Record<string, string[]>;
  bp: Record<string, Record<string, number>>;
};

type CompactBackupDataV3 = {
  v: 3;
  s: string[];
  p: number[];
  a: number;
  f: Record<string, number[]>;
  d: Record<string, number[]>;
  b: Record<string, number[]>;
  bp: Record<string, Record<string, number>>;
};

export function createBackupCode(data: BackupData) {
  const strings: string[] = [];
  const stringMap = new Map<string, number>();

  function id(value: string) {
    const existing = stringMap.get(value);
    if (existing !== undefined) return existing;

    const next = strings.length;
    strings.push(value);
    stringMap.set(value, next);
    return next;
  }

  function encodeStringArray(values: string[]) {
    return values.map((value) => id(value));
  }

  function encodeRecordArray(record: Record<string, string[]>) {
    const result: Record<string, number[]> = {};

    Object.entries(record).forEach(([key, values]) => {
      result[String(id(key))] = encodeStringArray(values);
    });

    return result;
  }

  function encodePartyRecord(record: Record<string, Record<string, number>>) {
    const result: Record<string, Record<string, number>> = {};

    Object.entries(record).forEach(([outerKey, innerRecord]) => {
      const encodedInner: Record<string, number> = {};

      Object.entries(innerRecord).forEach(([bossName, partyCount]) => {
        encodedInner[String(id(bossName))] = partyCount;
      });

      result[String(id(outerKey))] = encodedInner;
    });

    return result;
  }

  const compactData: CompactBackupDataV3 = {
    v: 3,
    s: strings,
    p: encodeStringArray(data.presets),
    a: id(data.activePreset),
    f: encodeRecordArray(data.favoritesByPreset),
    d: encodeRecordArray(data.disabledCharactersByPreset),
    b: encodeRecordArray(data.bossesByPresetAndCharacter),
    bp: encodePartyRecord(data.bossPartyByPresetAndCharacter),
  };

  const json = JSON.stringify(compactData);
  const compressed = compressToEncodedURIComponent(json);

  return `${BACKUP_PREFIX}${compressed}`;
}

export function parseBackupCode(code: string): BackupData {
  const trimmed = code.trim();

  if (trimmed.startsWith(BACKUP_PREFIX)) {
    const compressed = trimmed.slice(BACKUP_PREFIX.length);
    const json = decompressFromEncodedURIComponent(compressed);

    if (!json) {
      throw new Error("INVALID_BACKUP");
    }

    const data = JSON.parse(json) as CompactBackupDataV3;

    if (data.v !== 3) {
      throw new Error("INVALID_VERSION");
    }

    function text(index: number) {
      return data.s[index] ?? "";
    }

    function decodeStringArray(values: number[] | undefined) {
      return (values ?? []).map((value) => text(value)).filter(Boolean);
    }

    function decodeRecordArray(record: Record<string, number[]> | undefined) {
      const result: Record<string, string[]> = {};

      Object.entries(record ?? {}).forEach(([key, values]) => {
        const decodedKey = text(Number(key));
        if (!decodedKey) return;

        result[decodedKey] = decodeStringArray(values);
      });

      return result;
    }

    function decodePartyRecord(
      record: Record<string, Record<string, number>> | undefined
    ) {
      const result: Record<string, Record<string, number>> = {};

      Object.entries(record ?? {}).forEach(([outerKey, innerRecord]) => {
        const decodedOuterKey = text(Number(outerKey));
        if (!decodedOuterKey) return;

        const decodedInner: Record<string, number> = {};

        Object.entries(innerRecord ?? {}).forEach(([bossKey, partyCount]) => {
          const decodedBossName = text(Number(bossKey));
          if (!decodedBossName) return;

          decodedInner[decodedBossName] = partyCount;
        });

        result[decodedOuterKey] = decodedInner;
      });

      return result;
    }

    return {
      version: 1,
      presets: decodeStringArray(data.p),
      activePreset: text(data.a) || "기본",
      favoritesByPreset: decodeRecordArray(data.f),
      disabledCharactersByPreset: decodeRecordArray(data.d),
      bossesByPresetAndCharacter: decodeRecordArray(data.b),
      bossPartyByPresetAndCharacter: decodePartyRecord(data.bp),
    };
  }

  if (trimmed.startsWith(V2_BACKUP_PREFIX)) {
    const compressed = trimmed.slice(V2_BACKUP_PREFIX.length);
    const json = decompressFromEncodedURIComponent(compressed);

    if (!json) {
      throw new Error("INVALID_BACKUP");
    }

    const data = JSON.parse(json) as CompactBackupDataV2;

    if (data.v !== 2) {
      throw new Error("INVALID_VERSION");
    }

    return {
      version: 1,
      presets: data.p ?? [],
      activePreset: data.a ?? "기본",
      favoritesByPreset: data.f ?? {},
      disabledCharactersByPreset: data.d ?? {},
      bossesByPresetAndCharacter: data.b ?? {},
      bossPartyByPresetAndCharacter: data.bp ?? {},
    };
  }

  if (trimmed.startsWith(V1_BACKUP_PREFIX)) {
    const encoded = trimmed.slice(V1_BACKUP_PREFIX.length);
    const json = decodeURIComponent(escape(atob(encoded)));
    const data = JSON.parse(json) as BackupData;

    if (data.version !== 1) {
      throw new Error("INVALID_VERSION");
    }

    return data;
  }

  throw new Error("INVALID_PREFIX");
}