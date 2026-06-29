import Image from "next/image";

type CardProps = {
  title: string;
  value: string;
  green?: boolean;
  blue?: boolean;
  yellow?: boolean;
  purple?: boolean;
};

export default function Card({
  title,
  value,
  green,
  blue,
  yellow,
  purple,
}: CardProps) {
  const color = green
    ? "#3ee7a8"
    : blue
    ? "#66aaff"
    : yellow
    ? "#ffd166"
    : purple
    ? "#b388ff"
    : "white";

  return (
    <div
      className="mcm-card"
      style={{
        padding: 18,
        minHeight: 86,
      }}
    >
      <div
        className="maple-text"
        style={{
          color: "#aaa",
          fontSize: 16,
        }}
      >
        {title}
      </div>

      <div
  className="maple-title"
  style={{
    color,
    fontSize: 24,
    position: "relative",
    whiteSpace: "nowrap",
    minHeight: 34,
  }}
>
  {value.endsWith(" 메소") ? (
    <>
      <Image
        src="/icons/meso.png"
        alt=""
        width={34}
        height={34}
        draggable={false}
        style={{
          position: "absolute",
          left: 0,
          top: "50%",
          transform: "translateY(-50%)",
        }}
      />

      <div
        style={{
          textAlign: "right",
          paddingLeft: 34,
          lineHeight: "34px",
        }}
      >
        {value.replace(" 메소", "")}
      </div>
    </>
  ) : (
    <div
      style={{
        textAlign: "center",
        lineHeight: "34px",
      }}
    >
      {value}
    </div>
  )}
</div>
    </div>
  );
}