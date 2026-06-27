"use client";

type PresetBarProps = {
  presets: string[];
  activePreset: string;
  setActivePreset: (name: string) => void;
  addPreset: () => void;
  removePreset: (name: string) => void;
};

export default function PresetBar({
  presets,
  activePreset,
  setActivePreset,
  addPreset,
  removePreset,
}: PresetBarProps) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
      {presets.map((preset) => (
        <button
          key={preset}
          onClick={() => setActivePreset(preset)}
          onDoubleClick={() => removePreset(preset)}
          style={{
            background: activePreset === preset ? "#ff6b00" : "#10141c",
            color: "white",
            border:
              activePreset === preset
                ? "1px solid #ffb347"
                : "1px solid #2a3140",
            borderRadius: 999,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: activePreset === preset ? "bold" : "normal",
          }}
        >
          {activePreset === preset ? "✅ " : ""}
          {preset}
        </button>
      ))}

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