"use client";

import { useEffect, useState } from "react";
import bossList from "../data/bossPrice.json";
import { formatNumber } from "../lib/format";
import BossTab from "./components/BossTab";
import StatTab from "./components/StatTab";
import Dashboard from "./components/Dashboard";
import CharacterHeader from "./components/CharacterHeader";
import EquipTab from "./components/EquipTab";
import UnionTab from "./components/UnionTab";
import ArtifactTab from "./components/ArtifactTab";
import HexaTab from "./components/HexaTab";
import AccountTab from "./components/AccountTab";

type Tab =
  | "dashboard"
  | "account"
  | "stat"
  | "boss"
  | "equip"
  | "union"
  | "artifact"
  | "hexa";

export default function Home() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkedBosses, setCheckedBosses] = useState<string[]>([]);
  const [bossPartySize, setBossPartySize] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>("dashboard");

  const basic = result?.basic;
  const stats = result?.stat?.final_stat ?? [];
  const equips = result?.equip?.item_equipment ?? [];
  const union = result?.union;
  const artifact = result?.artifact;
  const hexa = result?.hexa;
  const hexaCores = hexa?.character_hexa_core_equipment ?? [];

useEffect(() => {
  const savedFavorites = localStorage.getItem("favorite-characters");
  if (savedFavorites) {
    setFavorites(JSON.parse(savedFavorites));
  }

  const savedRecent = localStorage.getItem("recent-searches");
  if (savedRecent) {
    setRecentSearches(JSON.parse(savedRecent));
  }

  const lastName = localStorage.getItem("last-character-name");
  if (lastName) {
    search(lastName);
  }
}, []);

  useEffect(() => {
    if (!basic?.character_name) return;

    localStorage.setItem(
      `boss-${basic.character_name}`,
      JSON.stringify(checkedBosses)
    );

    localStorage.setItem(
      `boss-party-${basic.character_name}`,
      JSON.stringify(bossPartySize)
    );
  }, [checkedBosses, bossPartySize, basic?.character_name]);

  async function search(targetName?: string) {
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
localStorage.setItem("last-character-name", searchName);

const updatedRecent = [
  searchName,
  ...recentSearches.filter((x) => x !== searchName),
].slice(0, 10);

setRecentSearches(updatedRecent);
localStorage.setItem("recent-searches", JSON.stringify(updatedRecent));

setResult(data);

      const saved = localStorage.getItem(`boss-${searchName}`);
      setCheckedBosses(saved ? JSON.parse(saved) : []);

      const savedParty = localStorage.getItem(`boss-party-${searchName}`);
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
    const saved = localStorage.getItem(`boss-${characterName}`);
    const bosses = saved ? JSON.parse(saved) : [];

    const savedParty = localStorage.getItem(`boss-party-${characterName}`);
    const partyData = savedParty ? JSON.parse(savedParty) : {};

    return bosses.reduce((sum: number, bossName: string) => {
      const boss = bossList.find((b) => b.name === bossName);
      if (!boss) return sum;

      const party = partyData[bossName] ?? 1;
      return sum + Math.floor(boss.price / party);
    }, 0);
  }

  function getCharacterBossCount(characterName: string) {
    const saved = localStorage.getItem(`boss-${characterName}`);
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
    if (!confirm("이번 주 보스 체크를 초기화할까?")) return;
    setCheckedBosses([]);
  }

function saveFavorite() {
  if (!basic?.character_name) return;

  const updated = [
    basic.character_name,
    ...favorites.filter((x) => x !== basic.character_name),
  ].slice(0, 36);

  setFavorites(updated);
  localStorage.setItem("favorite-characters", JSON.stringify(updated));
}

function removeFavorite(characterName: string) {
  if (!confirm(`${characterName} 캐릭터를 즐겨찾기에서 삭제할까?`)) return;

  const updated = favorites.filter((x) => x !== characterName);

  setFavorites(updated);
  localStorage.setItem("favorite-characters", JSON.stringify(updated));
}

function moveFavorite(characterName: string, direction: "up" | "down") {
  const index = favorites.indexOf(characterName);
  if (index === -1) return;

  const nextIndex = direction === "up" ? index - 1 : index + 1;
  if (nextIndex < 0 || nextIndex >= favorites.length) return;

  const updated = [...favorites];
  [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];

  setFavorites(updated);
  localStorage.setItem("favorite-characters", JSON.stringify(updated));
}

function goHome() {
  setName("");
  setResult(null);
  setLoading(false);
  setTab("dashboard");

  localStorage.removeItem("last-character-name");
}

function gradeColor(grade: string) {
    if (grade === "레전드리") return "#3ee7a8";
    if (grade === "유니크") return "#ffd166";
    if (grade === "에픽") return "#b388ff";
    if (grade === "레어") return "#66aaff";
    return "#cccccc";
  }

  function potentialLines(item: any) {
    return [
      item.potential_option_1,
      item.potential_option_2,
      item.potential_option_3,
    ].filter(Boolean);
  }

  function additionalLines(item: any) {
    return [
      item.additional_potential_option_1,
      item.additional_potential_option_2,
      item.additional_potential_option_3,
    ].filter(Boolean);
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
  onClick={goHome}
  style={{
    textAlign: "center",
    marginBottom: 28,
    cursor: "pointer",
    userSelect: "none",
  }}
>
  <div
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

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search();
          }}
          placeholder="캐릭터명 입력"
          style={{
            width: 420,
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
      onClick={() => {
        setRecentSearches([]);
        localStorage.removeItem("recent-searches");
      }}
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
              getCharacterBossTotal={getCharacterBossTotal}
              getCharacterBossCount={getCharacterBossCount}
              search={search}
            />
          )}

{tab === "account" && (
  <AccountTab
  favorites={favorites}
  currentCharacter={basic.character_name}
  getCharacterBossTotal={getCharacterBossTotal}
  getCharacterBossCount={getCharacterBossCount}
  search={search}
  removeFavorite={removeFavorite}
  moveFavorite={moveFavorite}
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

{tab === "artifact" && (
  <ArtifactTab artifact={artifact} />
)}

{tab === "hexa" && <HexaTab hexaCores={hexaCores} />}

{tab === "equip" && <EquipTab equips={equips} />}
        </div>
      )}
    </main>
  );
}