"use client";

import { formatNumber } from "../../lib/format";

type UnionTabProps = {
  union: any;
};

export default function UnionTab({ union }: UnionTabProps) {
  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 20 }}>유니온</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
        }}
      >
        <Card
          title="유니온 레벨"
          value={formatNumber(union?.union_level ?? "-")}
          color="#3ee7a8"
        />

        <Card
          title="유니온 등급"
          value={union?.union_grade ?? "-"}
          color="#ffd166"
        />
      </div>
    </div>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#10141c",
        border: "1px solid #2a3140",
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div style={{ color: "#aaa", fontSize: 13 }}>
        {title}
      </div>

      <div
        style={{
          fontSize: 34,
          fontWeight: "bold",
          marginTop: 8,
          color,
        }}
      >
        {value}
      </div>
    </div>
  );
}