"use client";

import { formatNumber } from "../../lib/format";
import Image from "next/image";
import Card from "./Card";


type PresetSummary = {
  name: string;
  total: number;
  count: number;
  characterCount: number;
};

type DashboardProps = {
  characterName: string;
  currentBossTotal: number;
  favorites: string[];
  allFavoriteBossTotal: number;
  allPresetBossTotal: number;
  presetSummaries: PresetSummary[];
  getCharacterBossTotal: (characterName: string) => number;
  getCharacterBossCount: (characterName: string) => number;
  search: (targetName: string) => void;
  disabledCharacters: string[];
  toggleCharacterEnabled: (characterName: string) => void;
};

export default function Dashboard({
  characterName,
  currentBossTotal,
  favorites,
  allFavoriteBossTotal,
  allPresetBossTotal,
  presetSummaries = [],
  getCharacterBossTotal,
  getCharacterBossCount,
  search,
  disabledCharacters = [],
  toggleCharacterEnabled,
}: DashboardProps) {
  const weeklyCrystalLimit = 90;

const enabledFavorites = favorites.filter(
  (characterName) => !disabledCharacters.includes(characterName)
);


  const soldCrystalCount = enabledFavorites.reduce(
    (sum, characterName) => sum + getCharacterBossCount(characterName),
    0
  );


  const remainingCrystalCount = Math.max(
    weeklyCrystalLimit - soldCrystalCount,
    0
  );

  const crystalPercent = Math.min(
    Math.round((soldCrystalCount / weeklyCrystalLimit) * 100),
    100
  );

  const progressColor =
    crystalPercent >= 90
      ? "#ff5c5c"
      : crystalPercent >= 60
      ? "#ffd166"
      : "#3ee7a8";

  const averageIncome =
    favorites.length > 0
      ? Math.floor(allFavoriteBossTotal / favorites.length)
      : 0;

  const topCharacter =
  enabledFavorites.length > 0
    ? [...enabledFavorites].sort(
        (a, b) => getCharacterBossTotal(b) - getCharacterBossTotal(a)
      )[0]
    : null;

      const topRanking = [...enabledFavorites]
  .map((name) => ({
    name,
    total: getCharacterBossTotal(name),
  }))
  .sort((a, b) => b.total - a.total)
  .slice(0, 3);

  const allPresetCrystalCount = presetSummaries.reduce(
    (sum, preset) => sum + preset.count,
    0
  );

  const allPresetLimit = presetSummaries.length * weeklyCrystalLimit;

  const totalPresetIncome = presetSummaries.reduce(
  (sum, preset) => sum + preset.total,
  0
);

  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 20 }}>계정 대시보드</h3>

      <div className="dashboard-grid-2" style={{ marginBottom: 18 }}>
        <SummaryPanel
          title="💎 현재 프리셋 결정석 💎"
          main={`${crystalPercent}%`}
          sub={`${soldCrystalCount} / ${weeklyCrystalLimit}개 판매`}
          desc={`남은 판매 가능: ${remainingCrystalCount}개`}
          color={progressColor}
          progress={crystalPercent}
        />

        <div
          className="mcm-card"
          style={{
            background: "linear-gradient(135deg, #20170b, #10141c)",
            border: "1px solid #3d3020",
            padding: 20,
            textAlign: "center",
          }}
        >
          <div style={{ color: "#aaa", marginBottom: 8 }}>
            💎 본 부계정 총합 💎
          </div>

          <div
            style={{
              fontSize: 34,
              fontWeight: "bold",
              color: "#ffd166",
              wordBreak: "break-all",
            }}
          >
            {formatNumber(allFavoriteBossTotal)} 메소
          </div>

          <div style={{ color: "#aaa", fontSize: 13, marginTop: 6 }}>
            결정석 {allPresetCrystalCount} / {allPresetLimit}개
          </div>

          <div
            style={{
              marginTop: 14,
              paddingTop: 12,
              borderTop: "1px solid rgba(255,255,255,.08)",
              display: "grid",
              gap: 8,
              textAlign: "left",
            }}
          >
{presetSummaries.map((preset) => {
  const percent =
  totalPresetIncome === 0
    ? 0
    : Math.round((preset.total / totalPresetIncome) * 100);

  return (
    <div
      key={preset.name}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 6,
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              color: "#fff",
              fontWeight: "bold",
            }}
          >
            🍁 {preset.name}
          </div>

          <div
            style={{
              color: "#888",
              fontSize: 12,
            }}
          >
            {preset.characterCount}명 · {preset.count}/90개
          </div>
        </div>

        <div
          style={{
            color: "#ffd166",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          {formatNumber(preset.total)}
        </div>
      </div>

      <div
        style={{
          height: 8,
          background: "#2a3140",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background:
              "linear-gradient(90deg,#3ee7a8,#63e6ff,#ffd166)",
            borderRadius: 999,
            transition: ".3s",
          }}
        />
      </div>
    </div>
  );
})}
          </div>
        </div>
      </div>

      <div className="dashboard-grid-3" style={{ textAlign: "left" }}>
        <Card title="현재 캐릭터" value={characterName} />
        <Card
          title="현재 캐릭터 주간 수익"
          value={`${formatNumber(currentBossTotal)} 메소`}
          green
        />
        <Card title="현재 계정 캐릭터 수" value={`${enabledFavorites.length} / ${favorites.length}명`} />
        <Card
          title="현재 프리셋 총 수익"
          value={`${formatNumber(allFavoriteBossTotal)} 메소`}
          blue
        />
  <Card
  title="최고 수익 캐릭터"
  value={topCharacter ? topCharacter : "-"}
  yellow
/>
<Card
  title="최고 캐릭터 수익"
  value={
    topCharacter
      ? `${formatNumber(getCharacterBossTotal(topCharacter))} 메소`
      : "-"
  }
  purple
/>
      </div>
{topRanking.length > 0 && (
  <div
    className="mcm-card"
    style={{
      marginTop: 22,
      padding: 18,
      textAlign: "left",
    }}
  >
    <h4 style={{ fontSize: 18, margin: "0 0 14px" }}>
      🏆 현재 프리셋 수익 TOP
    </h4>

    <div style={{ display: "grid", gap: 10 }}>
      {topRanking.map((character, index) => (
        <div
          key={character.name}
          onClick={() => search(character.name)}
          style={{
            display: "grid",
            gridTemplateColumns: "48px 1fr auto",
            gap: 36,
            alignItems: "center",
            background: "#0b0f16",
            border: "1px solid #252d3a",
            borderRadius: 12,
            padding: "10px 12px",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color:
                index === 0
                  ? "#ffd166"
                  : index === 1
                  ? "#cfd8e3"
                  : index === 2
                  ? "#ff9f68"
                  : "#aaa",
            }}
          >
            {index + 1}위
          </div>

          <div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: "bold",
  }}
>
  <Image
    src="/icons/maple-leaf2.png"
    alt=""
    width={44}
    height={33}
    draggable={false}
  />

  <span
  className="maple-title"
  style={{
    fontSize: 30,
  }}
>
  {character.name}
</span>
</div>

          <div
  style={{
    color: "#3ee7a8",
    fontWeight: "bold",
    fontSize: 30
  }}
>
  {formatNumber(character.total)}
</div>
        </div>
      ))}
    </div>
  </div>
)}
      {favorites.length > 0 && (
        <div style={{ marginTop: 26 }}>
          <h4 style={{ fontSize: 18, marginBottom: 12 }}>
            즐겨찾기 캐릭터 현황
          </h4>

<div style={{ color: "#888", fontSize: 12, marginBottom: 12 }}>
  ☑ 체크된 캐릭터만 현재 프리셋 통계에 포함됩니다.
</div>

          <div className="favorite-grid" style={{ textAlign: "left" }}>
            {favorites.map((fav) => {
              const total = getCharacterBossTotal(fav);
              const count = getCharacterBossCount(fav);
              const percent = Math.min(Math.round((count / 12) * 100), 100);

              const color =
                percent >= 100
                  ? "#3ee7a8"
                  : percent >= 60
                  ? "#ffd166"
                  : "#ff8c42";
const enabled = !disabledCharacters.includes(fav);
              return (
                <div
                  key={fav}
                  onClick={() => search(fav)}
                  className="mcm-card"
                  style={{
  background:
    fav === characterName
      ? "linear-gradient(135deg, #173f32, #10141c)"
      : "#10141c",

  border:
    fav === characterName
      ? "1px solid #3ee7a8"
      : "1px solid #2a3140",

  opacity: enabled ? 1 : 0.55,

  padding: 14,
  cursor: "pointer",
}}
                >
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  }}
>
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      toggleCharacterEnabled(fav);
    }}
    title={enabled ? "통계 포함됨" : "통계 제외됨"}
    style={{
  width: 46,
  height: 46,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  padding: 0,
  flexShrink: 0,

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  filter: enabled
    ? "drop-shadow(0 0 8px rgba(255,140,66,.9))"
    : "grayscale(1) opacity(.55)",

  transition: "all .2s ease",
}}
  >
    <Image
  src={
    enabled
      ? "/icons/maple-check.png"
      : "/icons/maple-uncheck.png"
  }
  alt=""
  width={120}
  height={90}
  draggable={false}
  style={{
  marginTop: 2,
  objectFit: "contain",
}}
/>
  </button>

  <div
    style={{
      fontSize: 16,
      fontWeight: "bold",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      minWidth: 0,
    }}
  >
    {fav}
  </div>
</div>
<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    color: "#888",
    fontSize: 12,
    marginTop: 2,
  }}
>
  <span>기여도</span>
  <span>{percent}%</span>
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
                      fontSize: 20
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
          className="mcm-card"
          style={{
            marginTop: 24,
            border: "1px dashed #3a4252",
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

function SummaryPanel({
  title,
  main,
  sub,
  desc,
  color,
  progress,
}: {
  title: string;
  main: string;
  sub: string;
  desc: string;
  color: string;
  progress: number;
}) {
  return (
    <div
      className="mcm-card"
      style={{
        background: "linear-gradient(135deg, #10141c, #182232)",
        padding: 20,
        textAlign: "center",
      }}
    >
      <div style={{ color: "#aaa", marginBottom: 6 }}>{title}</div>

      <div style={{ fontSize: 38, fontWeight: "bold", color, marginBottom: 8 }}>
        {main}
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
            width: `${progress}%`,
            height: "100%",
            background: color,
            borderRadius: 999,
            transition: "width 0.25s ease",
          }}
        />
      </div>

      <div style={{ color: "#ddd", fontSize: 15, fontWeight: "bold" }}>
        {sub}
      </div>

      <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>{desc}</div>
    </div>
  );
}
