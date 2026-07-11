"use client";

import Image from "next/image";
import { formatNumber } from "../../lib/format";
import type { CharacterBasic } from "../../lib/characterTypes";

type Tab =
  | "dashboard"
  | "account"
  | "stat"
  | "boss"
  | "boss-requirement"
  | "equip"
  | "union"
  | "artifact"
  | "hexa"
  | "symbol";

type CharacterHeaderProps = {
  basic: CharacterBasic;
  saveFavorite: () => void;
  tabButton: (target: Tab, label: string) => React.ReactNode;
};

export default function CharacterHeader({
  basic,
  saveFavorite,
  tabButton,
}: CharacterHeaderProps) {
  return (
    <div>
      <div
        className="character-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          marginBottom: 18,
          padding: "18px 22px",
          background:
            "linear-gradient(135deg, rgba(16,20,28,.95), rgba(28,35,50,.85))",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 18,
          boxShadow: "0 14px 35px rgba(0,0,0,.35)",
        }}
      >
        <div
  className="character-image-box"
  style={{
    width: 260,
    height: 260,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 18,
    background:
      "radial-gradient(circle, rgba(255,255,255,.10), rgba(0,0,0,0) 65%)",
    overflow: "visible",
    flexShrink: 0,
  }}
>
 <Image
  src={basic.character_image}
  alt={`${basic.character_name} 캐릭터 이미지`}
  width={300}
  height={300}
  unoptimized
  style={{
    transform: "scale(1.8)",
    pointerEvents: "none",
    imageRendering: "auto",
    filter:
      "contrast(1.12) saturate(1.12) drop-shadow(0 0 18px rgba(255,255,255,.2))",
  }}
/>
</div>

        <div className="character-info" style={{ textAlign: "left", minWidth: 360 }}>
          <div style={{ color: "#ffb86b", fontSize: 14, fontWeight: "bold" }}>
            🍁 CHARACTER PROFILE
          </div>

          <h2
            style={{
              fontSize: 38,
              margin: "6px 0 6px",
              fontWeight: 900,
              letterSpacing: "-1px",
            }}
          >
            {basic.character_name}
          </h2>

          <div
            style={{
              color: "#d8d8d8",
              fontSize: 18,
              fontWeight: 700,
              marginBottom: 14,
            }}
          >
            Lv.{formatNumber(basic.character_level)} / {basic.character_class} /{" "}
            {basic.world_name}
          </div>

          <button
            onClick={saveFavorite}
            style={{
              background: "linear-gradient(135deg, #ff7a00, #d14d00)",
              color: "white",
              border: "1px solid rgba(255,255,255,.12)",
              padding: "9px 16px",
              borderRadius: 10,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 8px 18px rgba(255,106,0,.25)",
            }}
          >
            ⭐ 즐겨찾기 저장
          </button>
        </div>
      </div>

      <div
        className="character-tabs"
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 10,
          marginTop: 8,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
{tabButton("dashboard", "대시보드")}
{tabButton("account", "계정관리")}
{tabButton("boss", "주간 보스")}
{tabButton("boss-requirement", "보스 스펙")}
{tabButton("equip", "장비")}
{tabButton("union", "유니온")}
{tabButton("artifact", "아티팩트")}
{tabButton("symbol", "심볼")}
{tabButton("hexa", "헥사")}
{tabButton("stat", "스탯")}
      </div>
    </div>
  );
}
