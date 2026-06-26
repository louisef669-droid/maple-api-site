"use client";

import { useState } from "react";
import bossList from "../../data/bossPrice.json";
import { formatNumber } from "../../lib/format";

const bossGroups = [
  {
    name: "카룻",
    bosses: ["카오스 반반", "카오스 피에르", "카오스 블러디퀸", "카오스 벨룸"],
  },
  {
    name: "스데루슬더",
    bosses: ["노말 스우", "노말 데미안", "이지 루시드", "노말 가엔슬", "노말 더스크"],
  },
  {
    name: "노진힐라인",
    bosses: ["하드 스우", "하드 데미안", "노말 가엔슬", "노말 루시드", "노말 더스크", "노말 윌", "노말 듄켈", "노말 진힐라"],
  },
  {
    name: "하드 검밑솔",
    bosses: ["카오스 가엔슬", "하드 스우", "하드 루시드", "하드 윌", "하드 데미안", "카오스 더스크", "하드 듄켈", "하드 진힐라"],
  },
  {
    name: "익스우~이카",
    bosses: ["익스우", "하드 세렌", "노말 칼로스", "노말 쌀숭", "이지 카링"],
  },
];

type BossTabProps = {
  checkedBosses: string[];
  currentBossTotal: number;
  toggleBoss: (bossName: string) => void;
  toggleBossGroup: (groupBosses: string[]) => void;
  resetBosses: () => void;
};

export default function BossTab({
  checkedBosses,
  currentBossTotal,
  toggleBoss,
  toggleBossGroup,
  resetBosses,
}: BossTabProps) {
  const [partySize, setPartySize] = useState(1);

  return (
    <div>
      <h3 style={{ fontSize: 22 }}>주간 보스 체크</h3>

      <p style={{ color: "#aaa" }}>
        체크됨 : {checkedBosses.length} / {bossList.length}
      </p>

      <div
        style={{
          background: "#10141c",
          border: "1px solid #2a3140",
          borderRadius: 14,
          padding: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ color: "#aaa", marginBottom: 6 }}>
          현재 캐릭터 예상 결정석 수익
        </div>

        <div style={{ fontSize: 28, fontWeight: "bold", color: "#3ee7a8" }}>
          {formatNumber(Math.floor(currentBossTotal / partySize))} 메소
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        {bossGroups.map((group) => {
          const allChecked = group.bosses.every((boss) =>
            checkedBosses.includes(boss)
          );

          return (
            <button
              key={group.name}
              onClick={() => toggleBossGroup(group.bosses)}
              style={{
                background: allChecked ? "#1f8f5f" : "#202635",
                color: "white",
                border: allChecked ? "1px solid #3ee7a8" : "1px solid #444",
                borderRadius: 999,
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: allChecked ? "bold" : "normal",
              }}
            >
              {allChecked ? "✅ " : "➕ "}
              {group.name}
            </button>
          );
        })}
      </div>
<div
  style={{
    display: "flex",
    gap: 8,
    marginBottom: 12,
  }}
>
  {[1, 2, 3, 4, 5, 6].map((n) => (
    <button
      key={n}
      onClick={() => setPartySize(n)}
      style={{
        background: partySize === n ? "#1f8f5f" : "#202635",
        color: "white",
        border: "1px solid #444",
        borderRadius: 8,
        padding: "6px 10px",
        cursor: "pointer",
      }}
    >
      {n}인
    </button>
  ))}
</div>
      <button
        onClick={resetBosses}
        style={{
          marginBottom: 18,
          background: "#303848",
          color: "white",
          border: "1px solid #555",
          borderRadius: 8,
          padding: "8px 14px",
          cursor: "pointer",
        }}
      >
        이번 주 초기화
      </button>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          textAlign: "left",
        }}
      >
        {bossList.map((boss) => {
          const checked = checkedBosses.includes(boss.name);

          return (
            <button
              key={boss.name}
              onClick={() => toggleBoss(boss.name)}
              style={{
                background: checked ? "#1f8f5f" : "#10141c",
                color: "white",
                border: checked ? "1px solid #3ee7a8" : "1px solid #2a3140",
                borderRadius: 10,
                padding: 12,
                textAlign: "left",
                cursor: "pointer",
              }}
            >
              <div>
                {checked ? "✅ " : "⬜ "}
                {boss.name}
              </div>
              <div
                style={{
                  color: checked ? "#d7ffe9" : "#888",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {formatNumber(boss.price)} 메소
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}