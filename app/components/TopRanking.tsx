"use client";

import Image from "next/image";

type Character = {
  name: string;
  total: number;
};

type TopRankingProps = {
  topRanking: Character[];
  search: (name: string) => void;
  formatNumber: (value: number) => string;
};

export default function TopRanking({
  topRanking,
  search,
  formatNumber,
}: TopRankingProps) {
  if (topRanking.length === 0) return null;

  return (
    <div
      className="mcm-card"
      style={{
        marginTop: 22,
        padding: 18,
        textAlign: "left",
      }}
    >
      <h4 className="maple-title" style={{ fontSize: 30,
        margin: "0 0 14px" }}>
        🏆 현재 계정 수익 TOP
      </h4>

      <div style={{ display: "grid", gap: 10 }}>
        {topRanking.map((character, index) => (
          <div
            key={character.name}
            onClick={() => search(character.name)}
            style={{
  display: "grid",
  gridTemplateColumns: "48px minmax(0,1fr) auto",
  gap: window.innerWidth < 768 ? 10 : 36,
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
    minWidth: 0,
  }}
>
              <Image
                src="/icons/maple-leaf2.png"
                alt=""
                width={44}
                height={33}
                draggable={false}
                style={{
  transform: "rotate(8deg)",
}}
              />

              <span
  className="maple-title"
  style={{
    fontSize: window.innerWidth < 768 ? 20 : 30,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
>
                {character.name}
              </span>
            </div>

            <div
  className="maple-title"
  style={{
    color: "#3ee7a8",
    fontSize: window.innerWidth < 768 ? 20 : 30,
    whiteSpace: "nowrap",
    flexShrink: 0,
  }}
>
              {formatNumber(character.total)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
