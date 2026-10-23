import { host, getToken } from "../_moncash.js";

// MonCash voye kliyan an isit apre peman an (mete URL sa a nan MonCash Business > Return URL).
export default async function handler(req, res) {
  try {
    const transactionId = req.query?.transactionId;
    if (!transactionId) return res.redirect(302, "/?failed=1");
    const token = await getToken();
    const r = await fetch(`https://${host()}/Api/v1/RetrieveTransactionPayment`, {
      method: "POST",
      headers: { Authorization: "Bearer " + token, Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId }),
    });
    const p = (await r.json())?.payment;
    // orderId = OP-<opsyon>-<kantite>-<montan>-<tan>: montan an te kalkile pa sèvè a lè peman an te kreye
    const [, , , amount] = String(p?.reference || "").split("-");
    const expected = Number(amount) || 0;
    const ok = p && String(p.message).toLowerCase() === "successful" && expected > 0 && Number(p.cost) >= expected;
    if (!ok) return res.redirect(302, "/?failed=1");
    res.redirect(302, `/?paid=${encodeURIComponent(p.reference)}&tx=${encodeURIComponent(transactionId)}`);
  } catch (e) {
    res.redirect(302, "/?failed=1");
  }
}
