"use client";

type EquipTabProps = {
  equips: any[];
};

function gradeColor(grade: string) {
  if (grade === "레전드리") return "#3ee7a8";
  if (grade === "유니크") return "#ffd166";
  if (grade === "에픽") return "#b388ff";
  if (grade === "레어") return "#66aaff";
  return "#cccccc";
}

function potentialLines(item: any) {
  return [
    item.potential_option_1,
    item.potential_option_2,
    item.potential_option_3,
  ].filter(Boolean);
}

function additionalLines(item: any) {
  return [
    item.additional_potential_option_1,
    item.additional_potential_option_2,
    item.additional_potential_option_3,
  ].filter(Boolean);
}

export default function EquipTab({ equips }: EquipTabProps) {
  return (
    <div>
      <h3 style={{ fontSize: 22 }}>장비</h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 14,
          marginTop: 20,
          textAlign: "left",
        }}
      >
        {equips.map((item: any) => {
          const potentials = potentialLines(item);
          const addPotentials = additionalLines(item);

          return (
            <div
              key={item.item_equipment_slot}
              style={{
                background: "#10141c",
                padding: 8,
                borderRadius: 14,
                border: "1px solid #2a3140",
                minHeight: 170,
              }}
            >
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                {item.item_icon && (
                  <img
                    src={item.item_icon}
                    alt={item.item_name}
                    width={50}
                    height={50}
                    style={{
                      background: "#222",
                      borderRadius: 8,
                      padding: 4,
                    }}
                  />
                )}

                <div>
                  <div
                    style={{
                      color: "#ffb86b",
                      fontSize: 13,
                      marginBottom: 4,
                    }}
                  >
                    {item.item_equipment_slot}
                  </div>

                  <div style={{ fontWeight: "bold", fontSize: 15 }}>
                    {item.item_name}
                  </div>

                  {item.starforce && (
                    <div
                      style={{
                        marginTop: 4,
                        color: "#ffd166",
                        fontSize: 13,
                      }}
                    >
                      ★ {item.starforce}성
                    </div>
                  )}
                </div>
              </div>

              {item.potential_option_grade && (
                <div
                  style={{
                    marginTop: 12,
                    padding: 10,
                    background: "#151b25",
                    borderRadius: 10,
                    borderLeft: `5px solid ${gradeColor(
                      item.potential_option_grade
                    )}`,
                  }}
                >
                  <div
                    style={{
                      color: gradeColor(item.potential_option_grade),
                      fontSize: 13,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    잠재 : {item.potential_option_grade}
                  </div>

                  {potentials.map((line: string, index: number) => (
                    <div key={index} style={{ fontSize: 13 }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}

              {item.additional_potential_option_grade && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 10,
                    background: "#151b25",
                    borderRadius: 10,
                    borderLeft: `5px solid ${gradeColor(
                      item.additional_potential_option_grade
                    )}`,
                  }}
                >
                  <div
                    style={{
                      color: gradeColor(item.additional_potential_option_grade),
                      fontSize: 13,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    에디 : {item.additional_potential_option_grade}
                  </div>

                  {addPotentials.map((line: string, index: number) => (
                    <div key={index} style={{ fontSize: 13 }}>
                      {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}