export default async function handler(req, res) {
  const targetUrl = req.query.url;

  if (!targetUrl) {
    return res.status(400).send("Missing 'url' query parameter");
  }

  try {
    const response = await fetch(targetUrl);
    let html = await response.text();

    // Supprimer les headers de sécurité qui bloquent WebView / iframe
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    res.setHeader("X-Content-Type-Options", "nosniff");

    // Supprime les balises meta X-Frame ou CSP côté HTML si présent
    html = html
      .replace(/<meta[^>]+http-equiv=["']X-Frame-Options["'][^>]*>/gi, "")
      .replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi, "");

    res.send(html);
  } catch (error) {
    res.status(500).send("Error fetching page: " + error.message);
  }
}
