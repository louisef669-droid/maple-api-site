"use client";

import { formatNumber } from "../../lib/format";

type StatTabProps = {
  getStat: (statName: string) => any;
};

export default function StatTab({ getStat }: StatTabProps) {
  const statItems = [
    ["전투력", formatNumber(getStat("전투력"))],
    ["STR", formatNumber(getStat("STR"))],
    ["DEX", formatNumber(getStat("DEX"))],
    ["INT", formatNumber(getStat("INT"))],
    ["LUK", formatNumber(getStat("LUK"))],
    ["보공", `${formatNumber(getStat("보스 몬스터 데미지"))}%`],
    ["방무", `${formatNumber(getStat("몬스터 방어율 무시"))}%`],
    ["크확", `${formatNumber(getStat("크리티컬 확률"))}%`],
    ["크뎀", `${formatNumber(getStat("크리티컬 데미지"))}%`],
  ];

  return (
    <div>
      <h3 style={{ fontSize: 22 }}>스탯</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 20,
          textAlign: "left",
        }}
      >
        {statItems.map(([label, value]) => (
          <div
            key={label}
            style={{
              background: "#10141c",
              border: "1px solid #2a3140",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ color: "#aaa", fontSize: 13 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: "bold" }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}