import { PRICES, host, getToken } from "../_moncash.js";

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
    // orderId = OP-<opsyon>-<kantite>-<tan>: nou rekalkile pri ki dwe peye a
    const [, opt, qty] = String(p?.reference || "").split("-");
    const expected = (PRICES[Number(opt)] || 0) * Number(qty);
    const ok = p && String(p.message).toLowerCase() === "successful" && expected > 0 && Number(p.cost) >= expected;
    if (!ok) return res.redirect(302, "/?failed=1");
    res.redirect(302, `/?paid=${encodeURIComponent(p.reference)}&tx=${encodeURIComponent(transactionId)}`);
  } catch (e) {
    res.redirect(302, "/?failed=1");
  }
}
