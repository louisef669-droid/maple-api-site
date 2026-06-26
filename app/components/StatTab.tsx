"use client";

import { formatNumber } from "../../lib/format";

type StatTabProps = {
  getStat: (statName: string) => any;
};

function safeNumber(value: any) {
  if (value === undefined || value === null || value === "-") return "-";
  return formatNumber(value);
}

export default function StatTab({ getStat }: StatTabProps) {
  const statItems = [
    ["전투력", safeNumber(getStat("전투력"))],
    ["STR", safeNumber(getStat("STR"))],
    ["DEX", safeNumber(getStat("DEX"))],
    ["INT", safeNumber(getStat("INT"))],
    ["LUK", safeNumber(getStat("LUK"))],
    ["보공", `${safeNumber(getStat("보스 몬스터 데미지"))}%`],
    ["방무", `${safeNumber(getStat("몬스터 방어율 무시"))}%`],
    ["크확", `${safeNumber(getStat("크리티컬 확률"))}%`],
    ["크뎀", `${safeNumber(getStat("크리티컬 데미지"))}%`],
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