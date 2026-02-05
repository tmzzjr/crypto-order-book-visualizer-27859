// Backend function: mexc-proxy
// Purpose: Fetch MEXC order book from server-side to avoid browser CORS issues.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

async function hmacSha256Hex(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const bytes = new Uint8Array(signature);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  // CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => null);
    const symbol = typeof body?.symbol === "string" ? body.symbol : null;
    const limit = typeof body?.limit === "number" ? body.limit : 1000;
    const apiKey = typeof body?.apiKey === "string" ? body.apiKey : null;
    const apiSecret = typeof body?.apiSecret === "string" ? body.apiSecret : null;

    if (!symbol) {
      return new Response(JSON.stringify({ error: "Missing symbol" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!apiKey || !apiSecret) {
      return new Response(JSON.stringify({ error: "Missing apiKey/apiSecret" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // MEXC signed query
    const timestamp = Date.now().toString();
    const safeLimit = Math.max(5, Math.min(1000, Math.floor(limit)));
    const queryParams = `symbol=${encodeURIComponent(symbol)}&limit=${safeLimit}&timestamp=${timestamp}`;
    const signature = await hmacSha256Hex(queryParams, apiSecret);

    const url = `https://api.mexc.com/api/v3/depth?${queryParams}&signature=${signature}`;

    const resp = await fetch(url, {
      headers: {
        "X-MEXC-APIKEY": apiKey,
      },
    });

    const text = await resp.text();
    if (!resp.ok) {
      return new Response(
        JSON.stringify({
          error: `MEXC request failed [${resp.status}]`,
          details: text,
        }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // MEXC returns JSON; keep passthrough
    const data = JSON.parse(text);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("mexc-proxy error:", err);
    return new Response(JSON.stringify({ error: "Proxy error", details: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
