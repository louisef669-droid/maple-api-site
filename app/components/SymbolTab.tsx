"use client";

import Image from "next/image";
import { formatNumber } from "../../lib/format";
import type { SymbolItem } from "../../lib/characterTypes";
import {
  getSymbolProgressPercent,
  getSymbolRemainingToMax,
  isSymbolMaxLevel,
} from "../../lib/symbolProgress";
import {
  ARCANE_WEEKLY_REWARD,
  getDailySymbolReward,
} from "../../lib/symbolRewards";

type SymbolTabProps = {
  symbols: SymbolItem[];
};

function CompletionEstimate({
  symbol,
  remaining,
}: {
  symbol: SymbolItem;
  remaining: number;
}) {
  const dailyReward = getDailySymbolReward(symbol);
  const dailyDays = Math.ceil(remaining / dailyReward);
  const arcane = symbol.symbol_name.includes("아케인심볼");

  return (
    <div
      style={{
        marginTop: 10,
        paddingTop: 10,
        borderTop: "1px solid #2a3140",
        display: "grid",
        gap: 4,
        color: "#aaa",
        fontSize: 12,
      }}
    >
      <div>
        일간만: 하루 {dailyReward}개 · 약 {formatNumber(dailyDays)}일
      </div>

      {arcane && (
        <>
          <div>
            주간만: 주 {ARCANE_WEEKLY_REWARD}개 · 약{" "}
            {formatNumber(Math.ceil(remaining / ARCANE_WEEKLY_REWARD))}주
          </div>
          <div style={{ color: "#66aaff", fontWeight: "bold" }}>
            일간+주간: 약{" "}
            {formatNumber(
              Math.ceil(
                remaining / (dailyReward * 7 + ARCANE_WEEKLY_REWARD)
              )
            )}주
          </div>
        </>
      )}

      <div style={{ color: "#777" }}>기본 보상 기준 · 이벤트 추가 보상 제외</div>
    </div>
  );
}

export default function SymbolTab({ symbols }: SymbolTabProps) {
  const arcaneSymbols = symbols.filter((symbol) =>
    symbol.symbol_name.includes("아케인심볼")
  );
  const authenticSymbols = symbols.filter((symbol) =>
    symbol.symbol_name.includes("어센틱심볼")
  );

  return (
    <div>
      <h3 style={{ fontSize: 22, marginBottom: 18 }}>심볼 현황</h3>

      <div style={{ display: "grid", gap: 18 }}>
        {[
          ["아케인심볼", arcaneSymbols],
          ["어센틱심볼", authenticSymbols],
        ].map(([title, items]) => (
          <section key={title as string}>
            <h4 style={{ textAlign: "left", marginBottom: 10 }}>
              {title as string}
            </h4>
            <div className="mcm-grid" style={{ textAlign: "left" }}>
              {(items as SymbolItem[]).map((symbol) => {
                const maxed = isSymbolMaxLevel(symbol);
                const remaining = getSymbolRemainingToMax(symbol);
                const percent = getSymbolProgressPercent(symbol);

                return (
                  <div
                    key={symbol.symbol_name}
                    className="mcm-card"
                    style={{ padding: 14 }}
                  >
                    <div
                      style={{ display: "flex", gap: 10, alignItems: "center" }}
                    >
                      <Image
                        src={symbol.symbol_icon}
                        alt=""
                        width={42}
                        height={42}
                        unoptimized
                      />
                      <div>
                        <div style={{ fontWeight: "bold" }}>
                          {symbol.symbol_name}
                        </div>
                        <div style={{ color: "#66aaff", marginTop: 3 }}>
                          Lv.{symbol.symbol_level} · 포스 {symbol.symbol_force}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 12, color: "#bbb", fontSize: 13 }}>
                      {maxed
                        ? "최대 레벨"
                        : `현재 성장치 ${formatNumber(
                            symbol.symbol_growth_count
                          )}개 · 만렙까지 ${formatNumber(remaining)}개 남음`}
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: "#252d3a",
                        borderRadius: 999,
                        overflow: "hidden",
                        marginTop: 7,
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: maxed ? "#3ee7a8" : "#66aaff",
                        }}
                      />
                    </div>

                    {!maxed && (
                      <CompletionEstimate symbol={symbol} remaining={remaining} />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
