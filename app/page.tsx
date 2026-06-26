"use client";

import { useEffect, useState } from "react";
import bossList from "../data/bossPrice.json";
import { formatNumber } from "../lib/format";
import BossTab from "./components/BossTab";
import StatTab from "./components/StatTab";
import Dashboard from "./components/Dashboard";
import CharacterHeader from "./components/CharacterHeader";

type Tab = "dashboard" | "stat" | "boss" | "equip" | "union" | "artifact" | "hexa";

export default function Home() {
  const [name, setName] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [checkedBosses, setCheckedBosses] = useState<string[]>([]);
  const [bossPartySize, setBossPartySize] = useState<Record<string, number>>({});
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tab, setTab] = useState<Tab>("dashboard");

  const basic = result?.basic;
  const stats = result?.stat?.final_stat ?? [];
  const equips = result?.equip?.item_equipment ?? [];
  const union = result?.union;
  const artifact = result?.artifact;
  const hexa = result?.hexa;
  const hexaCores = hexa?.character_hexa_core_equipment ?? [];

  useEffect(() => {
    const saved = localStorage.getItem("favorite-characters");
    if (saved) setFavorites(JSON.parse(saved));
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

  function getBossTotal(bossNames: string[]) {
    return bossList
      .filter((boss) => bossNames.includes(boss.name))
      .reduce((sum, boss) => sum + boss.price, 0);
  }

function getCharacterBossTotal(characterName: string) {
  const saved = localStorage.getItem(`boss-${characterName}`);
  const bosses = saved ? JSON.parse(saved) : [];

  const savedParty = localStorage.getItem(
    `boss-party-${characterName}`
  );

  const partyData = savedParty
    ? JSON.parse(savedParty)
    : {};

  return bosses.reduce((sum: number, bossName: string) => {
    const boss = bossList.find(
      (b) => b.name === bossName
    );

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

  function removeFavorite(target: string) {
    const updated = favorites.filter((x) => x !== target);
    setFavorites(updated);
    localStorage.setItem("favorite-characters", JSON.stringify(updated));
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
          padding: "12px 20px",
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
        paddingTop: 70,
        paddingBottom: 80,
      }}
    >
      <h1 style={{ fontSize: 34, marginBottom: 28 }}>
        🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁 🍁
      </h1>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") search();
          }}
          placeholder="캐릭터명 입력"
          style={{
            width: 280,
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
          }}
        >
          검색
        </button>
      </div>

      {favorites.length > 0 && (
        <div
          style={{
            marginTop: 12,
            background: "#181d26",
            border: "1px solid #2a3140",
            borderRadius: 16,
            padding: 18,
            width: 900,
            textAlign: "center",
          }}
        >
          <div style={{ color: "#aaa", marginBottom: 8 }}>주간 보스 총합</div>

          <div
            style={{
              color: "#0099ff",
              fontSize: 32,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            {formatNumber(allFavoriteBossTotal)} 메소
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {favorites.map((fav) => (
              <div key={fav} style={{ display: "flex", gap: 4 }}>
                <button
                  onClick={() => search(fav)}
                  style={{
                    background: "#202635",
                    color: "white",
                    border: "1px solid #444",
                    padding: "8px 12px",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  ⭐ {fav} / {formatNumber(getCharacterBossTotal(fav))} 메소
                </button>

                <button
                  onClick={() => removeFavorite(fav)}
                  style={{
                    background: "#441d1d",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 10px",
                    cursor: "pointer",
                  }}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
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

{tab === "stat" && (
  <StatTab
    getStat={getStat}
  />
)}

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

          {tab === "union" && (
            <div>
              <h3 style={{ fontSize: 22, marginBottom: 20 }}>유니온</h3>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
                <div style={{ background: "#10141c", padding: 20, borderRadius: 14, border: "1px solid #2a3140" }}>
                  <div style={{ color: "#aaa", fontSize: 13 }}>유니온 레벨</div>
                  <div style={{ fontSize: 34, fontWeight: "bold", marginTop: 8, color: "#3ee7a8" }}>
                    {formatNumber(union?.union_level ?? "-")}
                  </div>
                </div>

                <div style={{ background: "#10141c", padding: 20, borderRadius: 14, border: "1px solid #2a3140" }}>
                  <div style={{ color: "#aaa", fontSize: 13 }}>유니온 등급</div>
                  <div style={{ fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
                    {union?.union_grade ?? "-"}
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === "artifact" && (
            <div>
              <h3 style={{ fontSize: 22, marginBottom: 20 }}>아티팩트</h3>

              <div
                style={{
                  background: "#10141c",
                  padding: 20,
                  borderRadius: 14,
                  border: "1px solid #2a3140",
                  marginBottom: 20,
                }}
              >
                <div style={{ color: "#aaa", fontSize: 13 }}>남은 AP</div>
                <div style={{ fontSize: 34, fontWeight: "bold", marginTop: 8, color: "#ffb347" }}>
                  {artifact?.union_artifact_remain_ap ?? "-"}
                </div>
              </div>

              <h4 style={{ fontSize: 18, marginBottom: 12 }}>아티팩트 효과</h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "left" }}>
                {(artifact?.union_artifact_effect ?? []).map((effect: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: "#10141c",
                      border: "1px solid #2a3140",
                      borderRadius: 12,
                      padding: 14,
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{effect.name}</div>
                    <div style={{ color: "#3ee7a8", marginTop: 4 }}>
                      Lv.{effect.level}
                    </div>
                  </div>
                ))}
              </div>

              <h4 style={{ fontSize: 18, marginTop: 24, marginBottom: 12 }}>크리스탈</h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, textAlign: "left" }}>
                {(artifact?.union_artifact_crystal ?? []).map((crystal: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: "#10141c",
                      border: "1px solid #2a3140",
                      borderRadius: 12,
                      padding: 14,
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{crystal.name}</div>
                    <div style={{ color: "#ffb347", marginTop: 4 }}>
                      Lv.{crystal.level}
                    </div>
                    <div style={{ marginTop: 8, color: "#ccc", fontSize: 13 }}>
                      {crystal.crystal_option_name_1 && <div>{crystal.crystal_option_name_1}</div>}
                      {crystal.crystal_option_name_2 && <div>{crystal.crystal_option_name_2}</div>}
                      {crystal.crystal_option_name_3 && <div>{crystal.crystal_option_name_3}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "hexa" && (
            <div>
              <h3 style={{ fontSize: 22, marginBottom: 20 }}>헥사</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  textAlign: "left",
                }}
              >
                {hexaCores.length === 0 && (
                  <div
                    style={{
                      background: "#10141c",
                      border: "1px solid #2a3140",
                      borderRadius: 12,
                      padding: 18,
                      gridColumn: "1 / 3",
                      textAlign: "center",
                      color: "#aaa",
                    }}
                  >
                    헥사 코어 정보가 없거나 6차 전직 전 캐릭터야.
                  </div>
                )}

                {hexaCores.map((core: any, index: number) => (
                  <div
                    key={index}
                    style={{
                      background: "#10141c",
                      border: "1px solid #2a3140",
                      borderRadius: 12,
                      padding: 14,
                    }}
                  >
                    <div style={{ color: "#ffb86b", fontSize: 13 }}>
                      {core.hexa_core_type}
                    </div>

                    <div
                      style={{
                        fontSize: 17,
                        fontWeight: "bold",
                        marginTop: 6,
                      }}
                    >
                      {core.hexa_core_name}
                    </div>

                    <div
                      style={{
                        color: "#3ee7a8",
                        marginTop: 8,
                        fontWeight: "bold",
                      }}
                    >
                      Lv.{core.hexa_core_level}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "equip" && (
            <div>
              <h3 style={{ fontSize: 22 }}>장비</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                  marginTop: 20,
                  textAlign: "left",
                }}
              >
                {equips.map((item: any) => {
                  const potentials = potentialLines(item);
                  const addPotentials = additionalLines(item);

                  return (
                    <div
                      key={item.item_equipment_slot}
                      style={{
                        background: "#10141c",
                        padding: 8,
                        borderRadius: 14,
                        border: "1px solid #2a3140",
                        minHeight: 170,
                      }}
                    >
                      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                        {item.item_icon && (
                          <img
                            src={item.item_icon}
                            width={50}
                            height={50}
                            style={{
                              background: "#222",
                              borderRadius: 8,
                              padding: 4,
                            }}
                          />
                        )}

                        <div>
                          <div style={{ color: "#ffb86b", fontSize: 13, marginBottom: 4 }}>
                            {item.item_equipment_slot}
                          </div>

                          <div style={{ fontWeight: "bold", fontSize: 15 }}>
                            {item.item_name}
                          </div>

                          {item.starforce && (
                            <div style={{ marginTop: 4, color: "#ffd166", fontSize: 13 }}>
                              ★ {item.starforce}성
                            </div>
                          )}
                        </div>
                      </div>

                      {item.potential_option_grade && (
                        <div
                          style={{
                            marginTop: 12,
                            padding: 10,
                            background: "#151b25",
                            borderRadius: 10,
                            borderLeft: `5px solid ${gradeColor(item.potential_option_grade)}`,
                          }}
                        >
                          <div
                            style={{
                              color: gradeColor(item.potential_option_grade),
                              fontSize: 13,
                              fontWeight: "bold",
                              marginBottom: 5,
                            }}
                          >
                            잠재 : {item.potential_option_grade}
                          </div>

                          {potentials.map((line: string, index: number) => (
                            <div key={index} style={{ fontSize: 13 }}>
                              {line}
                            </div>
                          ))}
                        </div>
                      )}

                      {item.additional_potential_option_grade && (
                        <div
                          style={{
                            marginTop: 8,
                            padding: 10,
                            background: "#151b25",
                            borderRadius: 10,
                            borderLeft: `5px solid ${gradeColor(item.additional_potential_option_grade)}`,
                          }}
                        >
                          <div
                            style={{
                              color: gradeColor(item.additional_potential_option_grade),
                              fontSize: 13,
                              fontWeight: "bold",
                              marginBottom: 5,
                            }}
                          >
                            에디 : {item.additional_potential_option_grade}
                          </div>

                          {addPotentials.map((line: string, index: number) => (
                            <div key={index} style={{ fontSize: 13 }}>
                              {line}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}