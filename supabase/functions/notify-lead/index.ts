// Deploy via Supabase Dashboard: Edge Functions -> Create function -> name "notify-lead" -> paste this -> Deploy.
// Then set secrets (Edge Functions -> notify-lead -> Secrets): RESEND_API_KEY, NOTIFY_TO.
// Then wire a Database Webhook: Database -> Webhooks -> New -> table "leads", event INSERT,
// type "Supabase Edge Functions" -> select notify-lead.

import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const NOTIFY_TO = Deno.env.get("NOTIFY_TO")!; // e.g. LUXPROGROUP@GMAIL.COM
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") || "LUXPRO GROUP <onboarding@resend.dev>";

serve(async (req) => {
  try {
    const payload = await req.json();
    const lead = payload.record;

    const html = `
      <h2>Lead nou — LUXPRO GROUP</h2>
      <p><b>Nume:</b> ${lead.name}</p>
      <p><b>Telefon:</b> ${lead.phone}</p>
      <p><b>Email:</b> ${lead.email || "-"}</p>
      <p><b>Tip proiect:</b> ${lead.project_type || "-"}</p>
      <p><b>Mesaj:</b> ${lead.message || "-"}</p>
      <p style="color:#888;font-size:12px">Primit: ${new Date(lead.created_at).toLocaleString("ro-RO")}</p>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: NOTIFY_FROM,
        to: NOTIFY_TO,
        subject: `Lead nou: ${lead.name}`,
        html,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(err, { status: 500 });
    }

    return new Response("ok", { status: 200 });
  } catch (e) {
    return new Response(String(e), { status: 500 });
  }
});
