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
          fontSize: 26,
          gap: 6,
          marginTop: 8,
          color,
          wordBreak: "break-all",
        }}
      >
        {value}
      </div>
    </div>
  );
}