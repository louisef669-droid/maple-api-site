export type BackupData = {
  version: 1;
  presets: string[];
  activePreset: string;
  favoritesByPreset: Record<string, string[]>;
  disabledCharactersByPreset: Record<string, string[]>;
  bossesByPresetAndCharacter: Record<string, string[]>;
  bossPartyByPresetAndCharacter: Record<string, Record<string, number>>;
};

const BACKUP_PREFIX = "MCM-v1-";

export function createBackupCode(data: BackupData) {
  const json = JSON.stringify(data);
  const encoded = btoa(unescape(encodeURIComponent(json)));

  return `${BACKUP_PREFIX}${encoded}`;
}

export function parseBackupCode(code: string): BackupData {
  const trimmed = code.trim();

  if (!trimmed.startsWith(BACKUP_PREFIX)) {
    throw new Error("INVALID_PREFIX");
  }

  const encoded = trimmed.slice(BACKUP_PREFIX.length);
  const json = decodeURIComponent(escape(atob(encoded)));
  const data = JSON.parse(json);

  if (data.version !== 1) {
    throw new Error("INVALID_VERSION");
  }

  if (!Array.isArray(data.presets)) {
    throw new Error("INVALID_DATA");
  }

  return data;
}