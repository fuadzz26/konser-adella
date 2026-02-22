import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Ambil IP asli user dari header Vercel
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "";

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json",
      },
    });

    const data = await response.json();

    if (data.latitude && data.longitude) {
      return res.status(200).json({
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_name,
      });
    }

    return res.status(400).json({ error: "Location not found" });
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch location" });
  }
}