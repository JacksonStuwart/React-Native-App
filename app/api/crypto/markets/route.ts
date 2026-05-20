import { NextResponse } from "next/server";

export const revalidate = 60;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const vs = url.searchParams.get("vs") ?? "usd";
  const perPage = url.searchParams.get("per_page") ?? "50";
  const ids = url.searchParams.get("ids");

  const params = new URLSearchParams({
    vs_currency: vs,
    order: "market_cap_desc",
    per_page: perPage,
    page: "1",
    sparkline: "true",
    price_change_percentage: "24h",
  });
  if (ids) params.set("ids", ids);

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?${params.toString()}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Fetch failed" },
      { status: 502 }
    );
  }
}
