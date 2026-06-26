"use client";

type ArtifactTabProps = {
  artifact: any;
};

export default function ArtifactTab({ artifact }: ArtifactTabProps) {
  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 20 }}>아티팩트</h3>

      <div
        style={{
          background: "#10141c",
          padding: 20,
          borderRadius: 14,
          border: "1px solid #2a3140",
          marginBottom: 20,
        }}
      >
        <div style={{ color: "#aaa", fontSize: 13 }}>남은 AP</div>

        <div
          style={{
            fontSize: 34,
            fontWeight: "bold",
            marginTop: 8,
            color: "#ffb347",
          }}
        >
          {artifact?.union_artifact_remain_ap ?? "-"}
        </div>
      </div>

      <h4 style={{ fontSize: 18, marginBottom: 12 }}>아티팩트 효과</h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          textAlign: "left",
        }}
      >
        {(artifact?.union_artifact_effect ?? []).map(
          (effect: any, index: number) => (
            <div
              key={index}
              style={{
                background: "#10141c",
                border: "1px solid #2a3140",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ fontWeight: "bold" }}>{effect.name}</div>

              <div
                style={{
                  color: "#3ee7a8",
                  marginTop: 4,
                }}
              >
                Lv.{effect.level}
              </div>
            </div>
          )
        )}
      </div>

      <h4
        style={{
          fontSize: 18,
          marginTop: 24,
          marginBottom: 12,
        }}
      >
        크리스탈
      </h4>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          textAlign: "left",
        }}
      >
        {(artifact?.union_artifact_crystal ?? []).map(
          (crystal: any, index: number) => (
            <div
              key={index}
              style={{
                background: "#10141c",
                border: "1px solid #2a3140",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div style={{ fontWeight: "bold" }}>{crystal.name}</div>

              <div
                style={{
                  color: "#ffb347",
                  marginTop: 4,
                }}
              >
                Lv.{crystal.level}
              </div>

              <div
                style={{
                  marginTop: 8,
                  color: "#ccc",
                  fontSize: 13,
                }}
              >
                {crystal.crystal_option_name_1 && (
                  <div>{crystal.crystal_option_name_1}</div>
                )}

                {crystal.crystal_option_name_2 && (
                  <div>{crystal.crystal_option_name_2}</div>
                )}

                {crystal.crystal_option_name_3 && (
                  <div>{crystal.crystal_option_name_3}</div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}