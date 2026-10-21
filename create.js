import { PRICES, host, getToken } from "../_moncash.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST sèlman" });
  try {
    const opt = Number(req.body?.opt), qty = Number(req.body?.qty);
    if (!Number.isInteger(opt) || !PRICES[opt] || !Number.isInteger(qty) || qty < 1 || qty > 50)
      return res.status(400).json({ error: "Done pa valab" });
    const amount = PRICES[opt] * qty; // montan an kalkile isit, pa nan navigatè a
    const orderId = `OP-${opt}-${qty}-${Date.now()}`;
    const token = await getToken();
    const r = await fetch(`https://${host()}/Api/v1/CreatePayment`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ amount, orderId }),
    });
    const d = await r.json();
    const pt = d?.payment_token?.token;
    if (!pt) return res.status(502).json({ error: "MonCash pa reponn" });
    res.status(200).json({ url: `https://${host()}/Moncash-middleware/Payment/Redirect?token=${pt}`, orderId });
  } catch (e) {
    res.status(500).json({ error: "Erè sèvè" });
  }
}
