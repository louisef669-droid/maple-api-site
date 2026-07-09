"use client";

import { formatNumber } from "../../lib/format";

type PresetSummary = {
  name: string;
  total: number;
  count: number;
  characterCount: number;
};

type AccountTabProps = {
  favorites: string[];
  currentCharacter: string;
  getCharacterBossTotal: (name: string) => number;
  getCharacterBossCount: (name: string) => number;
  search: (name: string) => void;
  removeFavorite: (name: string) => void;
  moveFavorite: (name: string, direction: "up" | "down") => void;
  presetSummaries: PresetSummary[];
  activePreset: string;
  setActivePreset: (name: string) => void;
  allPresetBossTotal: number;
  characterClasses?: Record<string, string>;
};

export default function AccountTab({
  favorites,
  currentCharacter,
  getCharacterBossTotal,
  getCharacterBossCount,
  search,
  removeFavorite,
  moveFavorite,
  presetSummaries = [],
  activePreset,
  setActivePreset,
  characterClasses = {},
  allPresetBossTotal,
}: AccountTabProps) {
  const totalIncome = favorites.reduce(
    (sum, name) => sum + getCharacterBossTotal(name),
    0
  );

  const totalCrystalCount = presetSummaries.reduce(
    (sum, preset) => sum + preset.count,
    0
  );

  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 18 }}>계정 관리</h3>

      <div
        style={{
          background: "linear-gradient(135deg, #10141c, #182232)",
          border: "1px solid #2a3140",
          borderRadius: 16,
          padding: 18,
          marginBottom: 18,
        }}
      >
        <div style={{ color: "#aaa", marginBottom: 8 }}>🌐 전체 프리셋 요약</div>

        <div style={{ fontSize: 30, fontWeight: "bold", color: "#ffd166" }}>
          {formatNumber(allPresetBossTotal)} 메소
        </div>

        <div style={{ marginTop: 6, color: "#aaa", fontSize: 13 }}>
          전체 결정석 {totalCrystalCount}개
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginBottom: 22,
          textAlign: "left",
        }}
      >
        {presetSummaries.map((preset) => (
          <div
            key={preset.name}
            onClick={() => setActivePreset(preset.name)}
            style={{
              background:
                activePreset === preset.name
                  ? "linear-gradient(135deg, #173f32, #10141c)"
                  : "#10141c",
              border:
                activePreset === preset.name
                  ? "1px solid #3ee7a8"
                  : "1px solid #2a3140",
              borderRadius: 14,
              padding: 14,
              cursor: "pointer",
            }}
          >
            <div style={{ fontWeight: "bold", marginBottom: 8 }}>
              🍁 {preset.name}
            </div>

            <div style={{ color: "#ffd166", fontWeight: "bold" }}>
              {formatNumber(preset.total)} 메소
            </div>

            <div style={{ color: "#aaa", fontSize: 13, marginTop: 6 }}>
              {preset.characterCount}명 · {preset.count}/90개
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "#10141c",
          border: "1px solid #2a3140",
          borderRadius: 14,
          padding: 18,
          marginBottom: 18,
        }}
      >
        <div style={{ color: "#aaa" }}>현재 프리셋</div>

        <div style={{ fontSize: 28, fontWeight: "bold", color: "#3ee7a8" }}>
          {activePreset}
        </div>

        <div style={{ marginTop: 10, color: "#ffd166", fontWeight: "bold" }}>
          총 주간 수익 : {formatNumber(totalIncome)} 메소
        </div>
      </div>

      <div
        style={{
          background: "#10141c",
          border: "1px solid #2a3140",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
<div
  style={{
    display: "grid",
    gridTemplateColumns: "70px 2.8fr 1fr 1.6fr 170px",
    background: "#1d2330",
    color: "#aaa",
    fontWeight: 900,
    padding: "12px 14px",
    alignItems: "center",
  }}
>
  <div style={{ textAlign: "center" }}>순서</div>

  <div
    style={{
      paddingLeft: 12,
    }}
  >
    캐릭터
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    결정석
  </div>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      paddingLeft: 8,
    }}
  >
    주간 수익
  </div>

  <div
    style={{
      display: "flex",
      justifyContent: "center",
    }}
  >
    관리
  </div>
</div>
        {favorites.map((name, index) => (
          <div
            key={name}
            style={{
              display: "grid",
              gridTemplateColumns: "70px 2.8fr 1fr 1.6fr 170px",
              padding: "14px 14px",
              alignItems: "center",
              borderTop: "1px solid #2a3140",
              background: name === currentCharacter ? "#173f32" : "transparent",
            }}
          >
            <div style={{ textAlign: "center", fontWeight: 900 }}>
              {index + 1}
            </div>

            <div>
              <div
  style={{
    paddingLeft: 12,
  }}
>
  <div
    style={{
      fontWeight: 900,
      fontSize: 17,
      lineHeight: 1.1,
    }}
  >
    🍁 {name}
  </div>

  <div
    style={{
      color: "#8fb4ff",
      fontSize: 12,
      fontWeight: 700,
      marginTop: 2,
    }}
  >
    {characterClasses[name]
      ? `(${characterClasses[name]})`
      : "(직업 정보 없음)"}
  </div>
</div>
            </div>

            <div
  style={{
    display: "flex",
    justifyContent: "center",
    transform: "translateX(-6px)",
    fontWeight: 900,
  }}
>
  {getCharacterBossCount(name)} / 12
</div>

            <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingLeft: 8,
    whiteSpace: "nowrap",
    fontWeight: 900,
    fontSize: 17,
  }}
>
              {formatNumber(getCharacterBossTotal(name))}
            </div>

            <div
  style={{
    display: "flex",
    gap: 6,
    justifyContent: "flex-end",
    paddingRight: 6,
    alignItems: "center",
    flexWrap: "nowrap",
  }}
>
              <button
                onClick={() => moveFavorite(name, "up")}
                disabled={index === 0}
                style={buttonStyle(index === 0)}
              >
                ↑
              </button>

              <button
                onClick={() => moveFavorite(name, "down")}
                disabled={index === favorites.length - 1}
                style={buttonStyle(index === favorites.length - 1)}
              >
                ↓
              </button>

              <button onClick={() => search(name)} style={orangeButton}>
                조회
              </button>

              <button
  onClick={() => removeFavorite(name)}
  style={{
    ...grayButton,
    width: 36,
    height: 36,
    padding: 0,
    fontSize: 18,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
  title="삭제"
>
  🗑
</button>
            </div>
          </div>
        ))}
      </div>
      {favorites.length === 0 && (
        <div style={{ marginTop: 18, color: "#aaa" }}>
          현재 프리셋에 등록된 캐릭터가 없어.
        </div>
      )}
    </div>
  );
}

function buttonStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 36,
    height: 36,
    padding: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: disabled ? "#1a1f29" : "#232b39",
    color: disabled ? "#555" : "#ffffff",
    border: disabled
      ? "1px solid #2b3240"
      : "1px solid #3b465b",
    borderRadius: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: 18,
    fontWeight: 900,
    transition: "all .15s ease",
  };
}
const orangeButton: React.CSSProperties = {
  background: "#ff7a00",
  color: "white",
  border: "none",
  borderRadius: 10,
  height: 36,
  padding: "0 12px",
  cursor: "pointer",
  fontWeight: 800,
  fontSize: 13,
};

const grayButton: React.CSSProperties = {
  background: "#303848",
  color: "white",
  border: "1px solid #555",
  borderRadius: 8,
  padding: "6px 10px",
  cursor: "pointer",
  fontWeight: "bold",
};