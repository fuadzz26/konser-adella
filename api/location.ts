export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "";

  // Provider 1: ip-api.com (tidak butuh API key, sangat reliable dari server)
  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=lat,lon,city,country,status`,
      { headers: { "User-Agent": "Mozilla/5.0" } }
    );
    const data = await res.json();
    if (data.status === "success" && data.lat && data.lon) {
      return Response.json({ latitude: data.lat, longitude: data.lon, city: data.city, country: data.country, source: "ip-api" });
    }
  } catch (e) {
    console.error("ip-api.com failed:", e);
  }

  // Provider 2: ipapi.co dengan IP spesifik
  try {
    const url = ip ? `https://ipapi.co/${ip}/json/` : `https://ipapi.co/json/`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
    });
    const data = await res.json();
    if (data.latitude && data.longitude) {
      return Response.json({ latitude: data.latitude, longitude: data.longitude, city: data.city, country: data.country_name, source: "ipapi.co" });
    }
  } catch (e) {
    console.error("ipapi.co failed:", e);
  }

  // Provider 3: abstractapi (tidak perlu API key untuk basic)
  try {
    const res = await fetch(`https://ipgeolocation.abstractapi.com/v1/?api_key=free&ip_address=${ip}`);
    const data = await res.json();
    if (data.latitude && data.longitude) {
      return Response.json({ latitude: data.latitude, longitude: data.longitude, city: data.city, country: data.country, source: "abstractapi" });
    }
  } catch (e) {
    console.error("abstractapi failed:", e);
  }

  return Response.json({ error: "All providers failed", ip }, { status: 500 });
}