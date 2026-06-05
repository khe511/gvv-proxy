export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const GAS_URL = "https://script.google.com/macros/s/AKfycbydr5BTiYDLR0qLYpupTjQdNVonpidEqx1_AcgzVNXWhcHD2Gux1dGOYPtHJ8wXXnbHcQ/exec";

  try {
    if (req.method === "POST" && req.query.action === "claude") {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body,
      });
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === "GET") {
      const action = req.query.action || "read";
      const response = await fetch(`${GAS_URL}?action=${action}`);
      const text = await response.text();
      return res.status(200).json(JSON.parse(text));
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
      const response = await fetch(GAS_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body,
      });
      const data = await response.json();
      return res.status(200).json(data);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
