// Fonksyon pataje pou MonCash. Kle yo pa janm nan frontend: yo nan Vercel (Environment Variables).
export const PRICES = [1750, 2250, 3000, 3500, 4250, 4750, 6500, 7000, 8500]; // HTG, menm lòd ak fòma yo nan app la
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
