// Fonksyon pataje pou MonCash. Kle yo pa janm nan frontend: yo nan Vercel (Environment Variables).
const SB = "https://midjclffirllibagxffh.supabase.co";
const KEY = "sb_publishable_3uvXUcum8dXzfhpg5Sz56g_ryQhUMXE"; // kle piblik, pa sekrè

// Pri yo soti nan tab "prices" nan Supabase (ou chanje yo nan Dashboard)
export async function getPrices() {
  const r = await fetch(`${SB}/rest/v1/prices?select=option,price&order=sort`, { headers: { apikey: KEY } });
  if (!r.ok) throw new Error("Pa ka li pri yo");
  return r.json();
}
export const host = () =>
  process.env.MONCASH_MODE === "live" ? "moncashbutton.digicelgroup.com" : "sandbox.moncashbutton.digicelgroup.com";

export async function getToken() {
  const auth = Buffer.from(`${process.env.MONCASH_CLIENT_ID}:${process.env.MONCASH_CLIENT_SECRET}`).toString("base64");
  const r = await fetch(`https://${host()}/Api/oauth/token`, {
    method: "POST",
    headers: { Authorization: "Basic " + auth, Accept: "application/json", "Content-Type": "application/x-www-form-urlencoded" },
    body: "scope=read,write&grant_type=client_credentials",
  });
  const d = await r.json();
  if (!d.access_token) throw new Error("Pa ka jwenn token MonCash");
  return d.access_token;
}
