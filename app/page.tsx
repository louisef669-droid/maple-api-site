"use client";

import { useEffect, useState } from "react";
import bossList from "../data/bossPrice.json";
import BossRequirementTab from "./components/BossRequirementTab";
import BossTab from "./components/BossTab";
import StatTab from "./components/StatTab";
import Dashboard from "./components/Dashboard";
import CharacterHeader from "./components/CharacterHeader";
import EquipTab from "./components/EquipTab";
import UnionTab from "./components/UnionTab";
import ArtifactTab from "./components/ArtifactTab";
import HexaTab from "./components/HexaTab";
import AccountTab from "./components/AccountTab";
import PresetBar from "./components/PresetBar";
import {
  DEFAULT_PRESETS,
  loadPresets,
  savePresets,
  loadActivePreset,
  saveActivePreset,
  loadFavoritesByPreset,
  saveFavoritesByPreset,
  deletePresetStorage,
} from "../lib/presetStorage";

type Tab =
  | "dashboard"
  | "account"
  | "boss"
  | "boss-requirement"
  | "stat"
  | "equip"
  | "union"
  | "artifact"
  | "hexa";

export default function Home() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [refreshProgress, setRefreshProgress] = useState("");
  const [checkedBosses, setCheckedBosses] = useState<string[]>([]);
  const [bossPartySize, setBossPartySize] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [presets, setPresets] = useState<string[]>(DEFAULT_PRESETS);
  const [activePreset, setActivePreset] = useState(DEFAULT_PRESETS[0]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>("dashboard");

  const basic = result?.basic;
  const stats = result?.stat?.final_stat ?? [];
  const equips = result?.equip?.item_equipment ?? [];
  const union = result?.union;
  const artifact = result?.artifact;
  const hexa = result?.hexa;
  const hexaCores = hexa?.character_hexa_core_equipment ?? [];

  function bossKey(characterName: string, presetName = activePreset) {
    return `boss-${presetName}-${characterName}`;
  }

  function bossPartyKey(characterName: string, presetName = activePreset) {
    return `boss-party-${presetName}-${characterName}`;
  }

  function recentKey(presetName = activePreset) {
    return `recent-searches-${presetName}`;
  }

  function lastNameKey(presetName = activePreset) {
    return `last-character-name-${presetName}`;
  }

  useEffect(() => {
    const loadedPresets = loadPresets();
    const loadedActivePreset = loadActivePreset(loadedPresets);

    setPresets(loadedPresets);
    setActivePreset(loadedActivePreset);

    const savedFavorites = loadFavoritesByPreset(loadedActivePreset);
    setFavorites(savedFavorites);

    const savedRecent = localStorage.getItem(recentKey(loadedActivePreset));
    setRecentSearches(savedRecent ? JSON.parse(savedRecent) : []);

    const lastName = localStorage.getItem(lastNameKey(loadedActivePreset));
    if (lastName) {
      search(lastName, loadedActivePreset);
    }
  }, []);

  useEffect(() => {
    saveActivePreset(activePreset);

    setFavorites(loadFavoritesByPreset(activePreset));

    const savedRecent = localStorage.getItem(recentKey(activePreset));
    setRecentSearches(savedRecent ? JSON.parse(savedRecent) : []);

    const lastName = localStorage.getItem(lastNameKey(activePreset));
    if (lastName) {
      search(lastName, activePreset);
    } else {
      goHome(false);
    }
  }, [activePreset]);

  useEffect(() => {
    if (!basic?.character_name) return;

    localStorage.setItem(
      bossKey(basic.character_name),
      JSON.stringify(checkedBosses)
    );

    localStorage.setItem(
      bossPartyKey(basic.character_name),
      JSON.stringify(bossPartySize)
    );
  }, [checkedBosses, bossPartySize, basic?.character_name, activePreset]);

  async function search(targetName?: string, presetName = activePreset) {
    const searchName = targetName ?? name;
    if (!searchName) return;

    setLoading(true);
    setResult(null);
    setTab("dashboard");

    try {
      const res = await fetch(
        `/api/character?name=${encodeURIComponent(searchName)}`
      );
      const data = await res.json();

      setName(searchName);
      setResult(data);

      localStorage.setItem(lastNameKey(presetName), searchName);

      const savedRecent = localStorage.getItem(recentKey(presetName));
      const prevRecent = savedRecent ? JSON.parse(savedRecent) : [];

      const updatedRecent = [
        searchName,
        ...prevRecent.filter((x: string) => x !== searchName),
      ].slice(0, 10);

      setRecentSearches(updatedRecent);
      localStorage.setItem(recentKey(presetName), JSON.stringify(updatedRecent));

      const savedBosses = localStorage.getItem(bossKey(searchName, presetName));
      setCheckedBosses(savedBosses ? JSON.parse(savedBosses) : []);

      const savedParty = localStorage.getItem(bossPartyKey(searchName, presetName));
      setBossPartySize(savedParty ? JSON.parse(savedParty) : {});
    } catch {
      alert("조회 실패");
    }

    setLoading(false);
  }

  function getStat(statName: string) {
    return stats.find((s: any) => s.stat_name === statName)?.stat_value ?? "-";
  }

  function getCharacterBossTotal(characterName: string) {
    const saved = localStorage.getItem(bossKey(characterName));
    const bosses = saved ? JSON.parse(saved) : [];

    const savedParty = localStorage.getItem(bossPartyKey(characterName));
    const partyData = savedParty ? JSON.parse(savedParty) : {};

    return bosses.reduce((sum: number, bossName: string) => {
      const boss = bossList.find((b) => b.name === bossName);
      if (!boss) return sum;

      const party = partyData[bossName] ?? 1;
      return sum + Math.floor(boss.price / party);
    }, 0);
  }

  function getCharacterBossTotalByPreset(characterName: string, presetName: string) {
  const saved = localStorage.getItem(`boss-${presetName}-${characterName}`);
  const bosses = saved ? JSON.parse(saved) : [];

  const savedParty = localStorage.getItem(`boss-party-${presetName}-${characterName}`);
  const partyData = savedParty ? JSON.parse(savedParty) : {};

  return bosses.reduce((sum: number, bossName: string) => {
    const boss = bossList.find((b) => b.name === bossName);
    if (!boss) return sum;

    const party = partyData[bossName] ?? 1;
    return sum + Math.floor(boss.price / party);
  }, 0);
}

  function getCharacterBossCount(characterName: string) {
    const saved = localStorage.getItem(bossKey(characterName));
    const bosses = saved ? JSON.parse(saved) : [];

    return bosses.length;
  }

  const currentBossTotal = checkedBosses.reduce((sum, bossName) => {
    const boss = bossList.find((b) => b.name === bossName);
    if (!boss) return sum;

    const party = bossPartySize[bossName] ?? 1;
    return sum + Math.floor(boss.price / party);
  }, 0);

  const allFavoriteBossTotal = favorites.reduce(
    (sum, characterName) => sum + getCharacterBossTotal(characterName),
    0
  );
  
const presetSummaries = presets.map((presetName) => {
  const presetFavorites = loadFavoritesByPreset(presetName);

  const total = presetFavorites.reduce(
    (sum: number, characterName: string) =>
      sum + getCharacterBossTotalByPreset(characterName, presetName),
    0
  );

  const count = presetFavorites.reduce((sum: number, characterName: string) => {
    const saved = localStorage.getItem(`boss-${presetName}-${characterName}`);
    const bosses = saved ? JSON.parse(saved) : [];
    return sum + bosses.length;
  }, 0);

  return {
    name: presetName,
    total,
    count,
    characterCount: presetFavorites.length,
  };
});

const allPresetBossTotal = presetSummaries.reduce(
  (sum, preset) => sum + preset.total,
  0
);

  function toggleBoss(bossName: string) {
    setCheckedBosses((prev) =>
      prev.includes(bossName)
        ? prev.filter((b) => b !== bossName)
        : [...prev, bossName]
    );
  }

  function toggleBossGroup(groupBosses: string[]) {
    setCheckedBosses((prev) => {
      const allChecked = groupBosses.every((boss) => prev.includes(boss));

      if (allChecked) {
        return prev.filter((boss) => !groupBosses.includes(boss));
      }

      return Array.from(new Set([...prev, ...groupBosses]));
    });
  }

  function resetBosses() {
    if (!confirm("초기화 ㄱ?")) return;
    setCheckedBosses([]);
  }

  function saveFavorite() {
    if (!basic?.character_name) return;

    const updated = [
      basic.character_name,
      ...favorites.filter((x) => x !== basic.character_name),
    ].slice(0, 36);

    setFavorites(updated);
    saveFavoritesByPreset(activePreset, updated);
  }

  function removeFavorite(characterName: string) {
    if (!confirm(`${characterName} 캐릭터를 즐겨찾기에서 삭제할까?`)) return;

    const updated = favorites.filter((x) => x !== characterName);

    setFavorites(updated);
    saveFavoritesByPreset(activePreset, updated);
  }

  function moveFavorite(characterName: string, direction: "up" | "down") {
    const index = favorites.indexOf(characterName);
    if (index === -1) return;

    const nextIndex = direction === "up" ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= favorites.length) return;

    const updated = [...favorites];
    [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];

    setFavorites(updated);
    saveFavoritesByPreset(activePreset, updated);
  }

  function goHome(removeLastName = true) {
    setName("");
    setResult(null);
    setLoading(false);
    setCheckedBosses([]);
    setBossPartySize({});
    setTab("dashboard");

    if (removeLastName) {
      localStorage.removeItem(lastNameKey(activePreset));
    }
  }

  function addPreset() {
    const input = prompt("프리셋 이름을 입력해줘");
    if (!input?.trim()) return;

    const presetName = input.trim();

    if (presets.includes(presetName)) {
      alert("이미 있는 프리셋이야.");
      return;
    }

    const updated = [...presets, presetName];

    setPresets(updated);
    savePresets(updated);
    setActivePreset(presetName);
  }

  function removePreset(presetName: string) {
    if (presets.length <= 1) {
      alert("프리셋은 최소 1개 있어야 해.");
      return;
    }

    if (
      !confirm(
        `${presetName} 프리셋을 삭제할까?\n즐겨찾기 목록도 같이 사라져.`
      )
    ) {
      return;
    }

    const updated = presets.filter((x) => x !== presetName);
    const nextActive = activePreset === presetName ? updated[0] : activePreset;

    setPresets(updated);
    savePresets(updated);
    deletePresetStorage(presetName);
    setActivePreset(nextActive);
  }

function renamePreset(oldName: string) {
  const input = prompt("새 프리셋 이름을 입력해줘", oldName);
  if (!input?.trim()) return;

  const newName = input.trim();

  if (newName === oldName) return;

  if (presets.includes(newName)) {
    alert("이미 있는 프리셋 이름이야.");
    return;
  }

  const updated = presets.map((x) => (x === oldName ? newName : x));

  const oldFavorites = loadFavoritesByPreset(oldName);

  setPresets(updated);
  savePresets(updated);

  saveFavoritesByPreset(newName, oldFavorites);
  deletePresetStorage(oldName);

  if (activePreset === oldName) {
    setActivePreset(newName);
  }
}

  function clearRecentSearches() {
    setRecentSearches([]);
    localStorage.removeItem(recentKey(activePreset));
  }

  function tabButton(target: Tab, label: string) {
    const active = tab === target;

    return (
      <button
        onClick={() => setTab(target)}
        style={{
          background: active ? "#ff6b00" : "#10141c",
          color: "white",
          border: active ? "1px solid #ff9b4a" : "1px solid #2a3140",
          borderRadius: 10,
          padding: "10px 18px",
          cursor: "pointer",
          fontWeight: active ? "bold" : "normal",
        }}
      >
        {label}
      </button>
    );
  }

  return (
    <main
      style={{
        background:
          "radial-gradient(circle at top, #26324a 0%, #171d2a 38%, #0d111a 100%)",
        minHeight: "100vh",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 35,
        paddingBottom: 80,
      }}
    >
      <div
        onClick={() => goHome()}
        style={{
          textAlign: "center",
          marginBottom: 22,
          cursor: "pointer",
          userSelect: "none",
        }}
      >
        <div
  className="mcm-logo-title"
  style={{
    fontSize: 38,
            fontWeight: 900,
            color: "#ffb347",
            letterSpacing: "-1px",
            textShadow: "0 0 18px rgba(255,180,71,.25)",
          }}
        >
          🍁 Maple Crystal Manager
        </div>

        <div
          style={{
            marginTop: 6,
            color: "#9ea7b8",
            fontSize: 15,
            letterSpacing: "1px",
          }}
        >
          Weekly Boss & Crystal Dashboard
        </div>
      </div>

      <PresetBar
        presets={presets}
        activePreset={activePreset}
        setActivePreset={setActivePreset}
        addPreset={addPreset}
        removePreset={removePreset}
        renamePreset={renamePreset}
      />

      <div className="mcm-search-row"
    style={{ display: "flex",
    gap: 10,
    width: "100%",
    maxWidth: 520,
    flexWrap: "wrap",
    justifyContent: "center",
  }}
>
        <input
  className="mcm-search-input"
  value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search();
          }}
          placeholder="캐릭터명 입력"
          style={{
            width: "100%",
            maxWidth: 420,
            padding: 14,
            background: "#1d2330",
            color: "white",
            border: "1px solid #555",
            borderRadius: 10,
            fontSize: 18,
          }}
        />

        <button
          onClick={() => search()}
          style={{
            background: "#ff6b00",
            color: "white",
            border: "none",
            borderRadius: 10,
            padding: "14px 22px",
            fontSize: 16,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          검색
        </button>
      </div>

      {recentSearches.length > 0 && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: 720,
          }}
        >
          <span style={{ color: "#aaa", fontSize: 13, alignSelf: "center" }}>
            최근조회
          </span>

          {recentSearches.map((recent) => (
            <button
              key={recent}
              onClick={() => search(recent)}
              style={{
                background: "#10141c",
                color: "white",
                border: "1px solid #2a3140",
                borderRadius: 999,
                padding: "6px 12px",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              🍁 {recent}
            </button>
          ))}

          <button
            onClick={clearRecentSearches}
            style={{
              background: "transparent",
              color: "#888",
              border: "1px solid #333",
              borderRadius: 999,
              padding: "6px 10px",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            전체삭제
          </button>
        </div>
      )}

      {loading && <p style={{ marginTop: 30 }}>조회중...</p>}

      {basic && (
        <div
  className="mcm-page-panel"
  style={{
    marginTop: 20,
    background: "#181d26",
    padding: 20,
    borderRadius: 20,
    width: 840,
    textAlign: "center",
  }}
>
        
      
          <CharacterHeader
            basic={basic}
            saveFavorite={saveFavorite}
            tabButton={tabButton}
          />

          {tab === "dashboard" && (
<Dashboard
  characterName={basic.character_name}
  currentBossTotal={currentBossTotal}
  favorites={favorites}
  allFavoriteBossTotal={allFavoriteBossTotal}
  allPresetBossTotal={allPresetBossTotal}
  presetSummaries={presetSummaries}
  getCharacterBossTotal={getCharacterBossTotal}
  getCharacterBossCount={getCharacterBossCount}
  search={search}
/>          )}

{tab === "account" && (
  <AccountTab
    favorites={favorites}
    currentCharacter={basic.character_name}
    getCharacterBossTotal={getCharacterBossTotal}
    getCharacterBossCount={getCharacterBossCount}
    search={search}
    removeFavorite={removeFavorite}
    moveFavorite={moveFavorite}
    presetSummaries={presetSummaries}
    activePreset={activePreset}
    setActivePreset={setActivePreset}
    allPresetBossTotal={allPresetBossTotal}
  />
)}

{tab === "boss-requirement" && (
  <BossRequirementTab
    level={basic.character_level}
    getStat={getStat}
  />
)}

          {tab === "stat" && <StatTab getStat={getStat} />}

          {tab === "boss" && (
            <BossTab
              checkedBosses={checkedBosses}
              setCheckedBosses={setCheckedBosses}
              bossPartySize={bossPartySize}
              setBossPartySize={setBossPartySize}
              currentBossTotal={currentBossTotal}
              toggleBoss={toggleBoss}
              toggleBossGroup={toggleBossGroup}
              resetBosses={resetBosses}
            />
          )}

          {tab === "union" && <UnionTab union={union} />}

          {tab === "artifact" && <ArtifactTab artifact={artifact} />}

          {tab === "hexa" && <HexaTab hexaCores={hexaCores} />}

          {tab === "equip" && <EquipTab equips={equips} />}
        </div>
      )}
    </main>
  );
}