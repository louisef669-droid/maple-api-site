"use client";

import { formatNumber } from "../../lib/format";

type Tab = "dashboard" | "stat" | "boss" | "equip" | "union" | "artifact" | "hexa";

type CharacterHeaderProps = {
  basic: any;
  saveFavorite: () => void;
  tabButton: (target: Tab, label: string) => React.ReactNode;
};

export default function CharacterHeader({
  basic,
  saveFavorite,
  tabButton,
}: CharacterHeaderProps) {
  return (
    <>
      <img
        src={basic.character_image}
        width={230}
        style={{
          display: "block",
          margin: "0 auto 2px",
          imageRendering: "auto",
          filter:
            "contrast(1.12) saturate(1.12) drop-shadow(0 0 18px rgba(255,255,255,.18))",
        }}
      />

      <h2
        style={{
          fontSize: 38,
          marginBottom: 8,
          marginTop: 0,
          fontWeight: 900,
        }}
      >
        {basic.character_name}
      </h2>

      <button
        onClick={saveFavorite}
        style={{
          background: "#d14d00",
          color: "white",
          border: "none",
          padding: "8px 16px",
          borderRadius: 10,
          cursor: "pointer",
          marginBottom: 8,
          fontWeight: "bold",
        }}
      >
        ⭐ 즐겨찾기 추가
      </button>

      <p
        style={{
          margin: "6px 0 14px",
          color: "#d8d8d8",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        Lv.{formatNumber(basic.character_level)} / {basic.character_class} /{" "}
        {basic.world_name}
      </p>

      <div
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
        {tabButton("boss", "주간 보스")}
        {tabButton("stat", "스탯")}
        {tabButton("equip", "장비")}
        {tabButton("union", "유니온")}
        {tabButton("artifact", "아티팩트")}
        {tabButton("hexa", "헥사")}
      </div>
    </>
  );
}