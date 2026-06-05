export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const GAS_URL = "https://script.google.com/macros/s/AKfycbydr5BTiYDLR0qLYpupTjQdNVonpidEqx1_AcgzVNXWhcHD2Gux1dGOYPtHJ8wXXnbHcQ/exec";

  try {
    if (req.method === "GET") {
      const action = req.query.action || "read";
      const response = await fetch(`${GAS_URL}?action=${action}`);
      const text = await response.text();
      const data = JSON.parse(text);
      res.status(200).json(data);
    } else if (req.method === "POST") {
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      res.status(200).json(data);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
