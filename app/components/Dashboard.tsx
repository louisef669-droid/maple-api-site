"use client";

import { formatNumber } from "../../lib/format";

type DashboardProps = {
  characterName: string;
  currentBossTotal: number;
  favorites: string[];
  allFavoriteBossTotal: number;
  getCharacterBossTotal: (characterName: string) => number;
  search: (targetName: string) => void;
};

export default function Dashboard({
  characterName,
  currentBossTotal,
  favorites,
  allFavoriteBossTotal,
  getCharacterBossTotal,
  search,
}: DashboardProps) {
  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 20 }}>대시보드</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          textAlign: "left",
        }}
      >
        <Card title="현재 캐릭터" value={characterName} />
        <Card title="현재 캐릭터 주간 수익" value={`${formatNumber(currentBossTotal)} 메소`} green />
        <Card title="등록 캐릭터 수" value={`${favorites.length}명`} />
        <Card title="등록 캐릭터 총 주간 수익" value={`${formatNumber(allFavoriteBossTotal)} 메소`} blue />
      </div>

      {favorites.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h4 style={{ fontSize: 18, marginBottom: 12 }}>
            즐겨찾기 캐릭터
          </h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              textAlign: "left",
            }}
          >
            {favorites.map((fav) => (
              <div
                key={fav}
                style={{
                  background: "#10141c",
                  border: "1px solid #2a3140",
                  borderRadius: 12,
                  padding: 8,
                }}
              >
                <div style={{ fontSize: 15, fontWeight: "bold" }}>
                  🍁 {fav}
                </div>
<button
  onClick={() => search(fav)}
  style={{
    marginTop: 10,
    background: "#ff7a00",
    color: "white",
    border: "none",
    borderRadius: 8,
    padding: "6px 12px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  조회
</button>
                <div
                  style={{
                    marginTop: 4,
                    color: "#3ee7a8",
                    fontWeight: "bold",
                  }}
                >
                  주간 수익 : {formatNumber(getCharacterBossTotal(fav))} 메소
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Card({
  title,
  value,
  green,
  blue,
}: {
  title: string;
  value: string;
  green?: boolean;
  blue?: boolean;
}) {
  return (
    <div
      style={{
        background: "#10141c",
        border: "1px solid #2a3140",
        borderRadius: 14,
        padding: 18,
      }}
    >
      <div style={{ color: "#aaa", fontSize: 13 }}>{title}</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginTop: 6,
          color: green ? "#3ee7a8" : blue ? "#0099ff" : "white",
        }}
      >
        {value}
      </div>
    </div>
  );
}