/**
 * Liveness probe. Confirms the app process is serving requests — nothing more.
 *
 * It must NOT call Supabase, read the database, or return environment values,
 * dependency versions, or any secret (S1 spec §20).
 */
export function GET() {
  return Response.json({ status: "ok" });
}

// Never cache a health check.
export const dynamic = "force-dynamic";
