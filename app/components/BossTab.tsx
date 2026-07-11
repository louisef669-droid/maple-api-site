"use client";

import { useMemo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import bossList from "../../data/bossPrice.json";
import { formatNumber } from "../../lib/format";

type BossItem = {
  name: string;
  price: number;
  difficulty?: string;
  group?: string;
  weekly?: boolean;
};

type BossCard = {
  baseName: string;
  variants: BossItem[];
};

const bosses = bossList as BossItem[];

const bossOrder = [
  "자쿰", "매그너스", "블러디퀸", "피에르", "반반", "벨룸",
  "파풀라투스", "스우", "데미안", "루시드", "가엔슬", "윌",
  "더스크", "듄켈", "진힐라", "검은 마법사", "세렌",
  "칼로스", "카링", "쌀숭", "흉성", "림보",
];

type BossGroup = {
  name: string;
  bosses: string[];
};

const defaultBossGroups: BossGroup[] = [
  { name: "카룻", bosses: ["카오스 반반", "카오스 피에르", "카오스 블러디퀸", "카오스 벨룸"] },
  { name: "스데루슬더", bosses: ["노말 스우", "노말 데미안", "이지 루시드", "노말 가엔슬", "노말 더스크"] },
  { name: "노진힐라인", bosses: ["하드 스우", "하드 데미안", "노말 가엔슬", "노말 루시드", "노말 윌", "노말 더스크", "노말 듄켈", "노말 진힐라"] },
  { name: "하드 검밑솔", bosses: ["카오스 가엔슬", "하드 스우", "하드 루시드", "하드 윌", "하드 데미안", "카오스 더스크", "하드 듄켈", "하드 진힐라"] },
  { name: "익스우~이카", bosses: ["익스우", "하드 세렌", "노말 칼로스", "노말 쌀숭", "이지 카링"] },
];

function getBossBaseName(name: string) {
  if (name === "익스우" || name.includes("스우")) return "스우";
  if (name.includes("데미안")) return "데미안";
  if (name.includes("루시드")) return "루시드";
  if (name.includes("가엔슬")) return "가엔슬";
  if (name.includes("윌")) return "윌";
  if (name.includes("더스크")) return "더스크";
  if (name.includes("듄켈")) return "듄켈";
  if (name.includes("진힐라")) return "진힐라";
  if (name.includes("검은 마법사")) return "검은 마법사";
  if (name.includes("세렌")) return "세렌";
  if (name.includes("칼로스")) return "칼로스";
  if (name.includes("카링")) return "카링";
  if (name.includes("쌀숭")) return "쌀숭";
  if (name.includes("흉성")) return "흉성";
  if (name.includes("림보")) return "림보";
  if (name.includes("자쿰")) return "자쿰";
  if (name.includes("매그너스")) return "매그너스";
  if (name.includes("블러디퀸")) return "블러디퀸";
  if (name.includes("피에르")) return "피에르";
  if (name.includes("반반")) return "반반";
  if (name.includes("벨룸")) return "벨룸";
  if (name.includes("파풀라투스")) return "파풀라투스";
  return name;
}

function difficultyColor(name?: string) {
  const text = name ?? "";
  if (text.includes("익스") || text.includes("익스트림")) return "#ff4d4d";
  if (text.includes("하드")) return "#ff8c42";
  if (text.includes("카오스")) return "#b388ff";
  if (text.includes("노말")) return "#66aaff";
  if (text.includes("이지")) return "#3ee7a8";
  return "#ffb86b";
}

type BossTabProps = {
  activePreset: string;
  checkedBosses: string[];
  setCheckedBosses: Dispatch<SetStateAction<string[]>>;
  bossPartySize: Record<string, number>;
  setBossPartySize: Dispatch<SetStateAction<Record<string, number>>>;
  currentBossTotal: number;
  currentMonthlyBossTotal: number;
  toggleBoss: (bossName: string) => void;
  toggleBossGroup: (groupBosses: string[]) => void;
  resetBosses: () => void;
};

export default function BossTab({
  activePreset,
  checkedBosses,
  setCheckedBosses,
  bossPartySize,
  setBossPartySize,
  currentBossTotal,
  currentMonthlyBossTotal,
  toggleBoss,
  toggleBossGroup,
  resetBosses,
}: BossTabProps) {
  const [selectedBossByBase, setSelectedBossByBase] = useState<Record<string, string>>({});
  const [bossGroups, setBossGroups] = useState<BossGroup[]>(() => {
    if (typeof window === "undefined") return defaultBossGroups;

    const saved = localStorage.getItem(`boss-groups-${activePreset}`);
    return saved ? JSON.parse(saved) : defaultBossGroups;
  });
  const [editingGroups, setEditingGroups] = useState(false);
  const [editingGroupIndex, setEditingGroupIndex] = useState<number | null>(null);

  function saveBossGroups(nextGroups: BossGroup[]) {
    setBossGroups(nextGroups);
    localStorage.setItem(
      `boss-groups-${activePreset}`,
      JSON.stringify(nextGroups)
    );
  }

  function addBossGroup() {
    const nextGroups = [...bossGroups, { name: "새 프리셋", bosses: [] }];
    saveBossGroups(nextGroups);
    setEditingGroupIndex(nextGroups.length - 1);
    setEditingGroups(true);
  }

  function updateEditingGroup(update: Partial<BossGroup>) {
    if (editingGroupIndex === null) return;

    const nextGroups = bossGroups.map((group, index) =>
      index === editingGroupIndex ? { ...group, ...update } : group
    );
    saveBossGroups(nextGroups);
  }

  function toggleGroupBoss(bossName: string) {
    if (editingGroupIndex === null) return;

    const group = bossGroups[editingGroupIndex];
    const nextBosses = group.bosses.includes(bossName)
      ? group.bosses.filter((name) => name !== bossName)
      : [...group.bosses, bossName];

    updateEditingGroup({ bosses: nextBosses });
  }

  function removeEditingGroup() {
    if (editingGroupIndex === null) return;

    const nextGroups = bossGroups.filter((_, index) => index !== editingGroupIndex);
    saveBossGroups(nextGroups);
    setEditingGroupIndex(null);
  }

  const bossCards = useMemo<BossCard[]>(() => {
    const map = new Map<string, BossItem[]>();

    bosses.forEach((boss) => {
      const baseName = getBossBaseName(boss.name);
      const list = map.get(baseName) ?? [];
      list.push(boss);
      map.set(baseName, list);
    });

    return Array.from(map.entries())
      .map(([baseName, variants]) => ({ baseName, variants }))
      .sort((a, b) => {
        const aIndex = bossOrder.indexOf(a.baseName);
        const bIndex = bossOrder.indexOf(b.baseName);

        if (aIndex === -1 && bIndex === -1) return a.baseName.localeCompare(b.baseName);
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;
        return aIndex - bIndex;
      });
  }, []);

  const maxBossCount = 12;

  const weeklyBossCards = bossCards.filter((card) =>
    card.variants.some((boss) => boss.weekly !== false)
  );
  const monthlyBossCards = bossCards.filter((card) =>
    card.variants.every((boss) => boss.weekly === false)
  );
  const displayedBossCards = [...weeklyBossCards, ...monthlyBossCards];

  const checkedCardCount = weeklyBossCards.filter((card) =>
    card.variants.some((boss) => checkedBosses.includes(boss.name))
  ).length;

  const progress = Math.min(100, Math.round((checkedCardCount / maxBossCount) * 100));

  function changeDifficulty(card: BossCard, nextBossName: string) {
    const variantNames = card.variants.map((boss) => boss.name);

    setSelectedBossByBase((prev) => ({
      ...prev,
      [card.baseName]: nextBossName,
    }));

    setCheckedBosses((prev) => {
      const wasChecked = prev.some((name) => variantNames.includes(name));
      if (!wasChecked) return prev;

      return [...prev.filter((name) => !variantNames.includes(name)), nextBossName];
    });
  }

  function changeParty(bossName: string, nextParty: number) {
    if (nextParty < 1 || nextParty > 6) return;

    setBossPartySize((prev) => ({
      ...prev,
      [bossName]: nextParty,
    }));
  }

  return (
    <div>
      <h3 className="mcm-crystal-title" style={{ fontSize: 24, marginTop: 0 }}>
        주간 보스 체크
      </h3>

      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            color: "#b8c0d4",
            marginBottom: 8,
            fontSize: 14,
          }}
        >
          <span>진행률</span>
          <span>
            {checkedCardCount} / {maxBossCount} · {progress}%
          </span>
        </div>

        <div
          style={{
            height: 14,
            background: "#0b0f16",
            borderRadius: 999,
            overflow: "hidden",
            border: "1px solid #252d3a",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #3ee7a8, #ffb347)",
              transition: "width 0.25s ease",
            }}
          />
        </div>
      </div>

      <div className="mcm-card" style={{ padding: 16, marginBottom: 18 }}>
        <div style={{ color: "#b8c0d4", marginBottom: 6, fontSize: 14 }}>
          현재 캐릭터 예상 결정석 수익
        </div>
        <div style={{ fontSize: 28, fontWeight: "bold", color: "#3ee7a8" }}>
          {formatNumber(currentBossTotal)} 메소
        </div>
        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid #2a3140",
          }}
        >
          <div style={{ color: "#b8c0d4", marginBottom: 6, fontSize: 14 }}>
            현재 캐릭터 월간 보스 수익
          </div>
          <div style={{ fontSize: 24, fontWeight: "bold", color: "#66aaff" }}>
            {formatNumber(currentMonthlyBossTotal)} 메소
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => {
            setEditingGroups((prev) => !prev);
            setEditingGroupIndex(null);
          }}
          style={{
            background: editingGroups ? "#663c00" : "#202635",
            color: editingGroups ? "#ffd166" : "#ddd",
            border: "1px solid #555",
            borderRadius: 999,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {editingGroups ? "편집 완료" : "프리셋 편집"}
        </button>

        {editingGroups && (
          <button
            type="button"
            onClick={addBossGroup}
            style={{
              background: "#173f32",
              color: "#3ee7a8",
              border: "1px solid #3ee7a8",
              borderRadius: 999,
              padding: "8px 14px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            + 새 프리셋
          </button>
        )}
      </div>

      <div
        translate="no"
        className="notranslate mcm-chip-row"
        style={{ marginBottom: 18 }}
      >
        {bossGroups.map((group, groupIndex) => {
          const allChecked = group.bosses.every((boss) => checkedBosses.includes(boss));
          const editing = editingGroups && editingGroupIndex === groupIndex;

          return (
            <button
              key={group.name}
              type="button"
              translate="no"
              className="notranslate"
              onClick={() =>
                editingGroups
                  ? setEditingGroupIndex(groupIndex)
                  : toggleBossGroup(group.bosses)
              }
              style={{
                background: editing
                  ? "#663c00"
                  : allChecked
                    ? "#1f8f5f"
                    : "#202635",
                color: "white",
                border: editing
                  ? "1px solid #ffd166"
                  : allChecked
                    ? "1px solid #3ee7a8"
                    : "1px solid #444",
                borderRadius: 999,
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: allChecked ? "bold" : "normal",
              }}
            >
              <span translate="no" className="notranslate">
                {editingGroups ? "✎ " : allChecked ? "✅ " : "➕ "}
                {group.name}
              </span>
            </button>
          );
        })}
      </div>

      {editingGroups && editingGroupIndex !== null && bossGroups[editingGroupIndex] && (
        <div
          className="mcm-card"
          style={{ padding: 16, marginBottom: 18, textAlign: "left" }}
        >
          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              marginBottom: 14,
              flexWrap: "wrap",
            }}
          >
            <input
              value={bossGroups[editingGroupIndex].name}
              onChange={(event) => updateEditingGroup({ name: event.target.value })}
              aria-label="보스 프리셋 이름"
              style={{
                flex: 1,
                minWidth: 180,
                background: "#10141c",
                color: "white",
                border: "1px solid #555",
                borderRadius: 10,
                padding: "9px 11px",
                fontSize: 15,
                fontWeight: "bold",
              }}
            />

            <button
              type="button"
              onClick={removeEditingGroup}
              style={{
                background: "#3a1f1f",
                color: "#ff8c8c",
                border: "1px solid #ff8c8c",
                borderRadius: 10,
                padding: "9px 12px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              프리셋 삭제
            </button>
          </div>

          <div style={{ color: "#aaa", fontSize: 13, marginBottom: 10 }}>
            이 프리셋으로 한 번에 체크할 보스를 선택하세요.
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: 8,
            }}
          >
            {bosses.map((boss) => {
              const selected = bossGroups[editingGroupIndex].bosses.includes(boss.name);

              return (
                <button
                  key={boss.name}
                  type="button"
                  onClick={() => toggleGroupBoss(boss.name)}
                  style={{
                    background: selected ? "#173f32" : "#10141c",
                    color: selected ? "#3ee7a8" : "#bbb",
                    border: selected ? "1px solid #3ee7a8" : "1px solid #333",
                    borderRadius: 10,
                    padding: "8px 10px",
                    cursor: "pointer",
                    textAlign: "left",
                    fontWeight: selected ? "bold" : "normal",
                  }}
                >
                  {selected ? "☑" : "☐"} {boss.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={resetBosses}
        style={{
          marginBottom: 18,
          background: "#303848",
          color: "white",
          border: "1px solid #555",
          borderRadius: 10,
          padding: "9px 14px",
          cursor: "pointer",
        }}
      >
        이번 주 초기화
      </button>

      <div className="mcm-grid" style={{ textAlign: "left" }}>
        {displayedBossCards.map((card) => {
          const checkedBoss = card.variants.find((boss) => checkedBosses.includes(boss.name));
          const selectedBossName =
            checkedBoss?.name ?? selectedBossByBase[card.baseName] ?? card.variants[0].name;

          const selectedBoss =
            card.variants.find((boss) => boss.name === selectedBossName) ?? card.variants[0];

          const checked = checkedBosses.includes(selectedBoss.name);
          const party = bossPartySize[selectedBoss.name] ?? 1;
          const dividedPrice = Math.floor(selectedBoss.price / party);
          const diffColor = difficultyColor(selectedBoss.difficulty ?? selectedBoss.name);
          const isMonthly = selectedBoss.weekly === false;

          return (
            <div
              key={card.baseName}
              translate="no"
              className={`notranslate mcm-card ${checked ? "mcm-card-checked" : ""}`}
              style={{
                padding: 14,
                color: "white",
              }}
            >
              <button
                type="button"
                translate="no"
                className="notranslate"
                onClick={() => toggleBoss(selectedBoss.name)}
                style={{
                  width: "100%",
                  background: "transparent",
                  color: "white",
                  border: "none",
                  padding: 0,
                  margin: 0,
                  textAlign: "left",
                  cursor: "pointer",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: "bold" }}>
                  <span translate="no" className="notranslate">
                    {checked ? "✅ " : "⬜ "}
                    {card.baseName}
                  </span>
                </div>
                {isMonthly && (
                  <div
                    style={{
                      marginTop: 6,
                      color: "#66aaff",
                      fontSize: 12,
                      fontWeight: "bold",
                    }}
                  >
                    월간 보스 · 주간 합계 제외
                  </div>
                )}
              </button>

              {card.variants.length > 1 ? (
                <select
                  value={selectedBoss.name}
                  translate="no"
                  className="notranslate"
                  onChange={(e) => changeDifficulty(card, e.target.value)}
                  style={{
                    marginTop: 10,
                    width: "100%",
                    background: "#202635",
                    color: diffColor,
                    border: `1px solid ${diffColor}`,
                    borderRadius: 10,
                    padding: "7px 9px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {card.variants.map((boss) => (
                    <option
                      key={boss.name}
                      value={boss.name}
                      translate="no"
                      className="notranslate"
                    >
                      {boss.difficulty ?? boss.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div
                  translate="no"
                  className="notranslate"
                  style={{
                    marginTop: 10,
                    color: diffColor,
                    fontSize: 13,
                    fontWeight: "bold",
                  }}
                >
                  {selectedBoss.difficulty ?? selectedBoss.name}
                </div>
              )}

              <div
                translate="no"
                className="notranslate"
                style={{
                  marginTop: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#0b0f16",
                  border: "1px solid #252d3a",
                  borderRadius: 12,
                  padding: "8px 10px",
                }}
              >
                <button
                  type="button"
                  translate="no"
                  className="notranslate"
                  onClick={() => changeParty(selectedBoss.name, party - 1)}
                  disabled={party <= 1}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    border: "none",
                    background: party <= 1 ? "#222" : "#2d3645",
                    color: "white",
                    cursor: party <= 1 ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ◀
                </button>

                <div
                  translate="no"
                  className="notranslate"
                  style={{
                    color: "#ffb86b",
                    fontSize: 15,
                    fontWeight: "bold",
                    minWidth: 58,
                    textAlign: "center",
                  }}
                >
                  👥 {party}P
                </div>

                <button
                  type="button"
                  translate="no"
                  className="notranslate"
                  onClick={() => changeParty(selectedBoss.name, party + 1)}
                  disabled={party >= 6}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    border: "none",
                    background: party >= 6 ? "#222" : "#1f8f5f",
                    color: "white",
                    cursor: party >= 6 ? "not-allowed" : "pointer",
                    fontWeight: "bold",
                  }}
                >
                  ▶
                </button>
              </div>

              <div
                style={{
                  marginTop: 10,
                  color: checked ? "#ffd166" : "#8e98ad",
                  fontSize: 14,
                  fontWeight: "bold",
                }}
              >
                💰 {formatNumber(dividedPrice)} 메소
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
