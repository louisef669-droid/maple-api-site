"use client";

type HexaTabProps = {
  hexaCores: any[];
};

export default function HexaTab({ hexaCores }: HexaTabProps) {
  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 20 }}>헥사</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          textAlign: "left",
        }}
      >
        {hexaCores.length === 0 && (
          <div
            style={{
              background: "#10141c",
              border: "1px solid #2a3140",
              borderRadius: 12,
              padding: 18,
              gridColumn: "1 / 3",
              textAlign: "center",
              color: "#aaa",
            }}
          >
            헥사 코어 정보가 없거나 6차 전직 전 캐릭터야.
          </div>
        )}

        {hexaCores.map((core: any, index: number) => (
          <div
            key={index}
            style={{
              background: "#10141c",
              border: "1px solid #2a3140",
              borderRadius: 12,
              padding: 14,
            }}
          >
            <div style={{ color: "#ffb86b", fontSize: 13 }}>
              {core.hexa_core_type}
            </div>

            <div
              style={{
                fontSize: 17,
                fontWeight: "bold",
                marginTop: 6,
              }}
            >
              {core.hexa_core_name}
            </div>

            <div
              style={{
                color: "#3ee7a8",
                marginTop: 8,
                fontWeight: "bold",
              }}
            >
              Lv.{core.hexa_core_level}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}