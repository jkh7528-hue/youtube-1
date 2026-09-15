import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/lib/env";
import { runRefreshJob } from "@/lib/refresh";

// Data fetching + DB writes only, no static parts to prerender.
export const dynamic = "force-dynamic";
// Full-catalog backfills can take a while; only Vercel Pro+ actually honors
// values above 60s, but the field is harmless on other hosts/runtimes.
export const maxDuration = 300;

// How long one invocation may work before it stops and leaves the rest to the
// next scheduled run. Must stay under the host's hard function timeout — Vercel
// Hobby kills the request at 60s, and a killed request returns a 504 with no
// progress reported, which is what made the hourly cron look permanently broken.
// Raise CRON_BUDGET_SECONDS on a plan with a longer limit.
const BUDGET_SECONDS = Number(process.env.CRON_BUDGET_SECONDS ?? 50);

function isAuthorized(request: NextRequest): boolean {
  const secret = env.cronSecret;
  if (!secret) return false; // refuse to run unprotected
  const header = request.headers.get("authorization");
  if (header === `Bearer ${secret}`) return true;
  const query = request.nextUrl.searchParams.get("secret");
  return query === secret;
}

async function handle(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const summary = await runRefreshJob({ budgetMs: BUDGET_SECONDS * 1000 });
    return NextResponse.json({ ok: true, ...summary });
  } catch (e) {
    console.error("[cron/refresh] failed:", e);
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}

// Vercel Cron sends GET; a manually-configured scheduler (GitHub Actions,
// cron-job.org, ...) can use either.
export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
