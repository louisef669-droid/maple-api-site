"use client";

import bossRequirements from "../../data/bossRequirement.json";

type BossRequirementTabProps = {
  level: number;
  getStat: (statName: string) => any;
};

type BossReq = {
  name: string;
  level: number;
  arcane: number;
  authentic: number;
  maxForce?: number;
};

export default function BossRequirementTab({
  level,
  getStat,
}: BossRequirementTabProps) {
  const arcaneForce = Number(getStat("아케인포스")) || 0;
  const authenticForce = Number(getStat("어센틱포스")) || 0;

  function levelEffect(bossLevel: number) {
    const diff = level - bossLevel;

    if (diff >= 5) return 120;
    if (diff >= 0) return 110 + diff * 2;

    return Math.max(50, 100 + diff * 2);
  }

  function forceEffect(
    required: number,
    current: number,
    type: "arcane" | "authentic"
  ) {
    if (required === 0) return 100;

    const ratio = current / required;

    if (type === "arcane") {
      return Math.min(Math.floor(ratio * 100), 150);
    }

    return Math.min(Math.floor(ratio * 100), 125);
  }

  function getStatus(req: BossReq) {
    const levelOk = level >= req.level;
    const arcaneOk = req.arcane === 0 || arcaneForce >= req.arcane;
    const authenticOk = req.authentic === 0 || authenticForce >= req.authentic;

    if (levelOk && arcaneOk && authenticOk) {
      return {
        label: "가능",
        icon: "✅",
        color: "#3ee7a8",
      };
    }

    if (!levelOk && (!arcaneOk || !authenticOk)) {
      return {
        label: "레벨/포스 부족",
        icon: "🔴",
        color: "#ff5c5c",
      };
    }

    if (!levelOk) {
      return {
        label: "레벨 부족",
        icon: "🟡",
        color: "#ffd166",
      };
    }

    return {
      label: "포스 부족",
      icon: "🟠",
      color: "#ff8c42",
    };
  }

  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 18 }}>보스 스펙 체크</h3>

      <div className="mcm-card" style={{ padding: 18, marginBottom: 18 }}>
        <div style={{ color: "#aaa", marginBottom: 8 }}>현재 캐릭터 기준</div>

        <div style={{ fontWeight: "bold", color: "#3ee7a8" }}>
          Lv.{level} / 아케인포스 {arcaneForce} / 어센틱포스 {authenticForce}
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
            <th style={th}>보스</th>
            <th style={th}>요구 Lv</th>
            <th style={th}>요구 포스</th>
            <th style={th}>레벨 효과</th>
            <th style={th}>포스 효과</th>
            <th style={th}>상태</th>
          </tr>
        </thead>

        <tbody>
          {(bossRequirements as BossReq[]).map((boss) => {
            const usingAuthentic = boss.authentic > 0;
            const requiredForce = usingAuthentic ? boss.authentic : boss.arcane;
            const currentForce = usingAuthentic ? authenticForce : arcaneForce;

            const levelPercent = levelEffect(boss.level);
            const maxLevel = boss.level + 5;
            const levelDiff = level - boss.level;
            const forcePercent = forceEffect(
              requiredForce,
              currentForce,
              usingAuthentic ? "authentic" : "arcane"
            );
            const maxForce =
  (boss as any).maxForce ??
  (usingAuthentic
    ? Math.ceil(requiredForce * 1.25)
    : Math.ceil(requiredForce * 1.5));

const maxForceLabel = usingAuthentic ? "125%" : "150%";
            const status = getStatus(boss);

            return (
              <tr key={boss.name}>
                <td style={td}>
                  <strong>{boss.name}</strong>
                </td>

                <td style={td}>Lv.{boss.level}</td>

                <td style={td}>
                  {usingAuthentic
                    ? `어센틱 ${boss.authentic}`
                    : boss.arcane > 0
                    ? `아케인 ${boss.arcane}`
                    : "-"}
                </td>

<td
  style={{
    ...td,
    color: levelPercent >= 120 ? "#3ee7a8" : "#ffd166",
    fontWeight: "bold",
  }}
>
  {levelPercent}%
<div
  style={{
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  }}
>
  (120%:
  <span
    style={{
      color: "#ffd166",
      fontWeight: "bold",
    }}
  >
    {" "}Lv.{maxLevel}
  </span>
  )
</div>
  <div
    style={{
      fontSize: 11,
      color: "#888",
      marginTop: 2,
    }}
  >
    ({levelDiff >= 0 ? "+" : ""}
    {levelDiff})
  </div>
</td>

                <td
                  style={{
                    ...td,
                    color:
                      forcePercent >= (usingAuthentic ? 125 : 150)
                        ? "#3ee7a8"
                        : "#ffd166",
                    fontWeight: "bold",
                  }}
                >
                  {forcePercent}%
<div
  style={{
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  }}
>
  ({maxForceLabel}:
  <span
    style={{
      color: "#ffd166",
      fontWeight: "bold",
    }}
  >
    {" "}{maxForce}
  </span>
  )
</div>
                </td>

                <td
                  style={{
                    ...td,
                    color: status.color,
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {status.icon} {status.label}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const th: React.CSSProperties = {
  padding: 12,
  color: "#aaa",
  textAlign: "left",
  borderBottom: "1px solid #2a3140",
  whiteSpace: "nowrap",
};

const td: React.CSSProperties = {
  padding: 10,
  borderBottom: "1px solid #252d3a",
  whiteSpace: "nowrap",
};