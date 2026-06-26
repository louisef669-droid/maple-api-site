"use client";

import { formatNumber } from "../../lib/format";

type AccountTabProps = {
  favorites: string[];
  currentCharacter: string;
  getCharacterBossTotal: (name: string) => number;
  getCharacterBossCount: (name: string) => number;
  search: (name: string) => void;
  removeFavorite: (name: string) => void;
  moveFavorite: (name: string, direction: "up" | "down") => void;
};

export default function AccountTab({
  favorites,
  currentCharacter,
  getCharacterBossTotal,
  getCharacterBossCount,
  search,
  removeFavorite,
  moveFavorite,
}: AccountTabProps) {
  const totalIncome = favorites.reduce(
    (sum, name) => sum + getCharacterBossTotal(name),
    0
  );

  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 18 }}>계정 관리</h3>

      <div
        style={{
          background: "#10141c",
          border: "1px solid #2a3140",
          borderRadius: 14,
          padding: 18,
          marginBottom: 18,
        }}
      >
        <div style={{ color: "#aaa" }}>등록 캐릭터</div>

        <div style={{ fontSize: 32, fontWeight: "bold", color: "#3ee7a8" }}>
          {favorites.length}명
        </div>

        <div style={{ marginTop: 10, color: "#ffd166", fontWeight: "bold" }}>
          총 주간 수익 : {formatNumber(totalIncome)} 메소
        </div>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#10141c",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ background: "#1d2330" }}>
            <th style={th}>순서</th>
            <th style={th}>캐릭터</th>
            <th style={th}>결정석</th>
            <th style={th}>주간 수익</th>
            <th style={th}>관리</th>
          </tr>
        </thead>

        <tbody>
          {favorites.map((name, index) => (
            <tr
              key={name}
              style={{
                background: name === currentCharacter ? "#173f32" : "transparent",
              }}
            >
              <td style={td}>{index + 1}</td>
              <td style={td}>🍁 {name}</td>
              <td style={td}>{getCharacterBossCount(name)} / 12</td>
              <td style={td}>{formatNumber(getCharacterBossTotal(name))}</td>

              <td style={td}>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <button
                    onClick={() => moveFavorite(name, "up")}
                    disabled={index === 0}
                    style={buttonStyle(index === 0)}
                  >
                    ▲
                  </button>

                  <button
                    onClick={() => moveFavorite(name, "down")}
                    disabled={index === favorites.length - 1}
                    style={buttonStyle(index === favorites.length - 1)}
                  >
                    ▼
                  </button>

                  <button
                    onClick={() => search(name)}
                    style={{
                      background: "#ff7a00",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    조회
                  </button>

                  <button
                    onClick={() => removeFavorite(name)}
                    style={{
                      background: "#303848",
                      color: "white",
                      border: "1px solid #555",
                      borderRadius: 8,
                      padding: "6px 10px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    삭제
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: 12,
  color: "#aaa",
  textAlign: "left",
};

const td: React.CSSProperties = {
  padding: 12,
  borderTop: "1px solid #2a3140",
};

function buttonStyle(disabled: boolean): React.CSSProperties {
  return {
    background: disabled ? "#222" : "#202635",
    color: disabled ? "#777" : "white",
    border: "1px solid #444",
    borderRadius: 8,
    padding: "6px 9px",
    cursor: disabled ? "not-allowed" : "pointer",
    fontWeight: "bold",
  };
}