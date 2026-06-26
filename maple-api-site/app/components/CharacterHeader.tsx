"use client";

import type { ReactNode } from "react";
import { formatNumber } from "../../lib/format";

type Tab =
  | "dashboard"
  | "account"
  | "stat"
  | "boss"
  | "equip"
  | "union"
  | "artifact"
  | "hexa";

type CharacterHeaderProps = {
  basic: any;
  saveFavorite: () => void;
  tabButton: (target: Tab, label: string) => ReactNode;
};

export default function CharacterHeader({
  basic,
  saveFavorite,
  tabButton,
}: CharacterHeaderProps) {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 26,
          marginBottom: 18,
          padding: "20px 24px",
          background:
            "linear-gradient(135deg, rgba(16,20,28,.98), rgba(31,39,56,.9))",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 20,
          boxShadow: "0 14px 35px rgba(0,0,0,.35)",
        }}
      >
        <div
          style={{
            width: 180,
            height: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            background:
              "radial-gradient(circle, rgba(255,255,255,.12), rgba(0,0,0,0) 66%)",
            overflow: "hidden",
          }}
        >
          {basic.character_image ? (
            <img
              src={basic.character_image}
              alt={basic.character_name}
              width={210}
              style={{
                imageRendering: "auto",
                filter:
                  "contrast(1.12) saturate(1.12) drop-shadow(0 0 18px rgba(255,255,255,.22))",
              }}
            />
          ) : (
            <div style={{ color: "#777" }}>이미지 없음</div>
          )}
        </div>

        <div style={{ textAlign: "left", minWidth: 360 }}>
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
              padding: "10px 16px",
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
        {tabButton("stat", "스탯")}
        {tabButton("equip", "장비")}
        {tabButton("union", "유니온")}
        {tabButton("artifact", "아티팩트")}
        {tabButton("hexa", "헥사")}
      </div>
    </div>
  );
}