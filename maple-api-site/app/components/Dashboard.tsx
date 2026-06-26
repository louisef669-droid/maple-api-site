"use client";

import { formatNumber } from "../../lib/format";

type DashboardProps = {
  characterName: string;
  currentBossTotal: number;
  favorites: string[];
  allFavoriteBossTotal: number;
  getCharacterBossTotal: (characterName: string) => number;
  getCharacterBossCount: (characterName: string) => number;
  search: (targetName: string) => void;
};

export default function Dashboard({
  characterName,
  currentBossTotal,
  favorites,
  allFavoriteBossTotal,
  getCharacterBossTotal,
  getCharacterBossCount,
  search,
}: DashboardProps) {
  const weeklyCrystalLimit = 90;

  const soldCrystalCount = favorites.reduce(
    (sum, characterName) => sum + getCharacterBossCount(characterName),
    0
  );

  const remainingCrystalCount = Math.max(weeklyCrystalLimit - soldCrystalCount, 0);

  const crystalPercent = Math.min(
    Math.round((soldCrystalCount / weeklyCrystalLimit) * 100),
    100
  );

  const progressColor =
    crystalPercent >= 90 ? "#ff5c5c" : crystalPercent >= 60 ? "#ffd166" : "#3ee7a8";

  const averageIncome =
    favorites.length > 0 ? Math.floor(allFavoriteBossTotal / favorites.length) : 0;

  const topCharacter =
    favorites.length > 0
      ? [...favorites].sort(
          (a, b) => getCharacterBossTotal(b) - getCharacterBossTotal(a)
        )[0]
      : null;

  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 20 }}>계정 대시보드</h3>

      <div
        style={{
          background: "linear-gradient(135deg, #10141c, #182232)",
          border: "1px solid #2a3140",
          borderRadius: 18,
          padding: 20,
          marginBottom: 18,
          textAlign: "center",
        }}
      >
        <div style={{ color: "#aaa", marginBottom: 6 }}>💎 이번 주 결정석 판매</div>

        <div
          style={{
            fontSize: 38,
            fontWeight: "bold",
            color: progressColor,
            marginBottom: 8,
          }}
        >
          {crystalPercent}%
        </div>

        <div
          style={{
            height: 14,
            background: "#252d3a",
            borderRadius: 999,
            overflow: "hidden",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              width: `${crystalPercent}%`,
              height: "100%",
              background: progressColor,
              borderRadius: 999,
              transition: "width 0.25s ease",
            }}
          />
        </div>

        <div style={{ color: "#ddd", fontSize: 15, fontWeight: "bold" }}>
          {soldCrystalCount} / {weeklyCrystalLimit}개 판매
        </div>

        <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>
          남은 판매 가능: {remainingCrystalCount}개
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 14,
          textAlign: "left",
        }}
      >
        <Card title="현재 캐릭터" value={characterName} />
        <Card
          title="현재 캐릭터 주간 수익"
          value={`${formatNumber(currentBossTotal)} 메소`}
          green
        />
        <Card title="등록 캐릭터 수" value={`${favorites.length}명`} />
        <Card
          title="등록 캐릭터 총 수익"
          value={`${formatNumber(allFavoriteBossTotal)} 메소`}
          blue
        />
        <Card
          title="캐릭터 평균 수익"
          value={`${formatNumber(averageIncome)} 메소`}
          yellow
        />
        <Card
          title="최고 수익 캐릭터"
          value={topCharacter ? topCharacter : "-"}
          purple
        />
      </div>

      {favorites.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <h4 style={{ fontSize: 18, marginBottom: 12 }}>즐겨찾기 캐릭터 현황</h4>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              textAlign: "left",
            }}
          >
            {favorites.map((fav) => {
              const total = getCharacterBossTotal(fav);
              const count = getCharacterBossCount(fav);
              const percent = Math.min(Math.round((count / 12) * 100), 100);

              const color =
                percent >= 100 ? "#3ee7a8" : percent >= 60 ? "#ffd166" : "#ff8c42";

              return (
                <div
                  key={fav}
                  onClick={() => search(fav)}
                  style={{
                    background:
                      fav === characterName
                        ? "linear-gradient(135deg, #173f32, #10141c)"
                        : "#10141c",
                    border:
                      fav === characterName
                        ? "1px solid #3ee7a8"
                        : "1px solid #2a3140",
                    borderRadius: 14,
                    padding: 14,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <div style={{ fontSize: 16, fontWeight: "bold" }}>
                      🍁 {fav}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color,
                        fontWeight: "bold",
                      }}
                    >
                      {count}/12
                    </div>
                  </div>

                  <div
                    style={{
                      height: 8,
                      background: "#252d3a",
                      borderRadius: 999,
                      overflow: "hidden",
                      marginBottom: 10,
                    }}
                  >
                    <div
                      style={{
                        width: `${percent}%`,
                        height: "100%",
                        background: color,
                        borderRadius: 999,
                      }}
                    />
                  </div>

                  <div
                    style={{
                      color: "#3ee7a8",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    {formatNumber(total)} 메소
                  </div>

                  <div style={{ marginTop: 4, color: "#aaa", fontSize: 12 }}>
                    클릭하면 이 캐릭터 조회
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {favorites.length === 0 && (
        <div
          style={{
            marginTop: 24,
            background: "#10141c",
            border: "1px dashed #3a4252",
            borderRadius: 14,
            padding: 24,
            color: "#aaa",
          }}
        >
          아직 즐겨찾기 캐릭터가 없어. 캐릭터 조회 후 ⭐ 저장을 누르면 여기에 표시돼.
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
  yellow,
  purple,
}: {
  title: string;
  value: string;
  green?: boolean;
  blue?: boolean;
  yellow?: boolean;
  purple?: boolean;
}) {
  const color = green
    ? "#3ee7a8"
    : blue
    ? "#66aaff"
    : yellow
    ? "#ffd166"
    : purple
    ? "#b388ff"
    : "white";

  return (
    <div
      style={{
        background: "#10141c",
        border: "1px solid #2a3140",
        borderRadius: 14,
        padding: 18,
        minHeight: 86,
      }}
    >
      <div style={{ color: "#aaa", fontSize: 13 }}>{title}</div>
      <div
        style={{
          fontSize: 21,
          fontWeight: "bold",
          marginTop: 8,
          color,
          wordBreak: "break-all",
        }}
      >
        {value}
      </div>
    </div>
  );
}