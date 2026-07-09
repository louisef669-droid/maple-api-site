import { NextResponse } from "next/server";

async function safeJson(url: string, headers: Record<string, string>) {
  try {
    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!res.ok) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "캐릭터명 없음" },
      { status: 400 }
    );
  }

  const headers = {
    "x-nxopen-api-key": process.env.NEXON_API_KEY!,
  };

  const ocidRes = await fetch(
    `https://open.api.nexon.com/maplestory/v1/id?character_name=${encodeURIComponent(
      name
    )}`,
    { headers }
  );

  const ocidData = await ocidRes.json();

  if (!ocidRes.ok || !ocidData.ocid) {
    return NextResponse.json(
      { error: "캐릭터 없음" },
      { status: 404 }
    );
  }

  const ocid = ocidData.ocid;

  const basic = await safeJson(
    `https://open.api.nexon.com/maplestory/v1/character/basic?ocid=${ocid}`,
    headers
  );

  if (!basic) {
    return NextResponse.json(
      { error: "기본 정보 조회 실패" },
      { status: 500 }
    );
  }

  const [stat, equip, union, artifact, hexa] = await Promise.all([
    safeJson(
      `https://open.api.nexon.com/maplestory/v1/character/stat?ocid=${ocid}`,
      headers
    ),
    safeJson(
      `https://open.api.nexon.com/maplestory/v1/character/item-equipment?ocid=${ocid}`,
      headers
    ),
    safeJson(
      `https://open.api.nexon.com/maplestory/v1/user/union?ocid=${ocid}`,
      headers
    ),
    safeJson(
      `https://open.api.nexon.com/maplestory/v1/user/union-artifact?ocid=${ocid}`,
      headers
    ),
    safeJson(
      `https://open.api.nexon.com/maplestory/v1/character/hexamatrix?ocid=${ocid}`,
      headers
    ),
  ]);

  return NextResponse.json({
    basic,
    stat,
    equip,
    union,
    artifact,
    hexa,
  });
}