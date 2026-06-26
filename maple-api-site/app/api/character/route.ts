import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "캐릭터명 없음" });
  }

  const headers = {
    "x-nxopen-api-key": process.env.NEXON_API_KEY!,
  };

  const ocidRes = await fetch(
    `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(name)}`,
    { headers }
  );

  const ocidData = await ocidRes.json();

  if (!ocidData.ocid) {
    return NextResponse.json({ error: "캐릭터 없음" });
  }

  const ocid = ocidData.ocid;

  const [basicRes, statRes, equipRes, unionRes, artifactRes, hexaRes] =
    await Promise.all([
      fetch(
        `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`,
        { headers }
      ),
      fetch(
        `https://open.api.nexon.com/maplestory/v1/character/stat?ocid=${ocid}`,
        { headers }
      ),
      fetch(
        `https://open.api.nexon.com/maplestory/v1/character/item-equipment?ocid=${ocid}`,
        { headers }
      ),
      fetch(
        `https://open.api.nexon.com/maplestory/v1/user/union?ocid=${ocid}`,
        { headers }
      ),
      fetch(
        `https://open.api.nexon.com/maplestory/v1/user/union-artifact?ocid=${ocid}`,
        { headers }
      ),
      fetch(
        `https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid=${ocid}`,
        { headers }
      ),
    ]);

  return NextResponse.json({
    basic: await basicRes.json(),
    stat: await statRes.json(),
    equip: await equipRes.json(),
    union: await unionRes.json(),
    artifact: await artifactRes.json(),
    hexa: await hexaRes.json(),
  });
}