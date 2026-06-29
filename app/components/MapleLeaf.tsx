import Image from "next/image";

type MapleLeafProps = {
  neon?: boolean;
  size?: number;
  rotate?: number;
};

export default function MapleLeaf({
  neon = false,
  size = 34,
  rotate = 0,
}: MapleLeafProps) {
  return (
    <Image
      src={neon ? "/icons/maple-leaf2.png" : "/icons/maple-leaf.png"}
      alt=""
      width={size}
      height={size}
      draggable={false}
      style={{
        transform: `rotate(${rotate}deg)`,
        filter: neon
          ? "drop-shadow(0 0 8px rgba(255,120,0,.8))"
          : undefined,
        transition: "all .2s ease",
      }}
    />
  );
}