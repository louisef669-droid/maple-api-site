"use client";

import Image from "next/image";
import MapleLeaf from "./MapleLeaf";

type PresetBarProps = {
  presets: string[];
  activePreset: string;
  setActivePreset: (name: string) => void;
  addPreset: () => void;
  removePreset: (name: string) => void;
  renamePreset: (name: string) => void;
};

export default function PresetBar({
  presets,
  activePreset,
  setActivePreset,
  addPreset,
  removePreset,
  renamePreset,
}: PresetBarProps) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
      {presets.map((preset) => {
        const active = activePreset === preset;

        return (
          <div
            key={preset}
            style={{
              display: "flex",
              alignItems: "center",
              background: active
  ? "linear-gradient(135deg, #000000, #d86400)"
  : "#10141c",
              border: active ? "1px solid #ff863f" : "1px solid #2a3140",
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setActivePreset(preset)}
              onDoubleClick={() => renamePreset(preset)}
              title="더블클릭하면 이름 변경"
              style={{
                background: "transparent",
                color: "white",
                border: "none",
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: 20,
                fontWeight: active ? 900 : 800,
                textShadow: "0 0 6px rgba(0,0,0,0.35)",
              }}
            >
              <span
  style={{
    display: "flex",
    alignItems: "center",
    gap: 6,
  }}
>
  <>
  <Image
    src="/icons/maple-leaf2.png"
    alt=""
    width={48}
    height={36}
    draggable={false}
    style={{
  transform: "rotate(8deg)",
}}
  />
  {preset}
</>
</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                removePreset(preset);
              }}
              title="프리셋 삭제"
              style={{
                background: "rgba(0,0,0,.18)",
                color: "#ffdddd",
                border: "none",
                borderLeft: "1px solid rgba(255,255,255,.12)",
                padding: "8px 10px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              ✕
            </button>
          </div>
        );
      })}

      <button
        onClick={addPreset}
        style={{
          background: "#202635",
          color: "white",
          border: "1px solid #444",
          borderRadius: 999,
          padding: "8px 14px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        + 프리셋
      </button>
    </div>
  );
}