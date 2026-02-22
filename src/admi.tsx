import { useState, useEffect } from "react";
import { supabase } from "./lib/supabase";

interface Location {
  id: number;
  created_at: string;
  latitude: number;
  longitude: number;
  source: string;
  gmaps_link: string;
}

export default function AdminAduhai() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLocations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("locations")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setLocations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const filtered = locations.filter((l) =>
    [l.source, l.latitude?.toString(), l.longitude?.toString(), l.gmaps_link]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (str: string) => {
    const d = new Date(str);
    return d.toLocaleString("id-ID", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  };
 //tes
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0a",
      color: "#e0e0e0",
      fontFamily: "monospace",
      padding: "24px 16px",
    }}>
      {/* Header */}
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 4, color: "#666", textTransform: "uppercase", marginBottom: 4 }}>
              Admin Panel
            </div>
            <h1 style={{ margin: 0, fontSize: 24, color: "#D4AF37", fontFamily: "'Courier New', monospace" }}>
              📍 Location Tracker
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{
              background: "#111",
              border: "1px solid #333",
              borderRadius: 8,
              padding: "8px 14px",
              fontSize: 13,
              color: "#888",
            }}>
              Total: <span style={{ color: "#D4AF37", fontWeight: 700 }}>{locations.length}</span>
            </div>
            <button
              onClick={fetchLocations}
              style={{
                background: "#D4AF37",
                color: "#000",
                border: "none",
                borderRadius: 8,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "monospace",
              }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Cari latitude, longitude, source..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            background: "#111",
            border: "1px solid #333",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 13,
            color: "#e0e0e0",
            fontFamily: "monospace",
            marginBottom: 16,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: "center", color: "#555", padding: 60, fontSize: 14 }}>
            Loading...
          </div>
        ) : (
          <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #222" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#111", borderBottom: "1px solid #2a2a2a" }}>
                  {["#", "Waktu", "Latitude", "Longitude", "Source", "Google Maps"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 14px",
                      textAlign: "left",
                      color: "#D4AF37",
                      fontWeight: 700,
                      letterSpacing: 1,
                      fontSize: 11,
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#444" }}>
                      Tidak ada data
                    </td>
                  </tr>
                ) : filtered.map((loc, i) => (
                  <tr key={loc.id} style={{
                    borderBottom: "1px solid #1a1a1a",
                    background: i % 2 === 0 ? "#0d0d0d" : "#0a0a0a",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#161610")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "#0d0d0d" : "#0a0a0a")}
                  >
                    <td style={{ padding: "11px 14px", color: "#444", fontSize: 11 }}>
                      {loc.id}
                    </td>
                    <td style={{ padding: "11px 14px", color: "#888", whiteSpace: "nowrap" }}>
                      {formatDate(loc.created_at)}
                    </td>
                    <td style={{ padding: "11px 14px", color: "#ccc", fontFamily: "'Courier New', monospace" }}>
                      {loc.latitude?.toFixed(6)}
                    </td>
                    <td style={{ padding: "11px 14px", color: "#ccc", fontFamily: "'Courier New', monospace" }}>
                      {loc.longitude?.toFixed(6)}
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      <span style={{
                        background: loc.source === "gps" ? "rgba(76,175,80,0.15)" : "rgba(212,175,55,0.12)",
                        border: `1px solid ${loc.source === "gps" ? "#4caf5055" : "#D4AF3755"}`,
                        borderRadius: 20,
                        padding: "3px 10px",
                        fontSize: 11,
                        color: loc.source === "gps" ? "#4caf50" : "#D4AF37",
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}>
                        {loc.source || "-"}
                      </span>
                    </td>
                    <td style={{ padding: "11px 14px" }}>
                      {loc.gmaps_link ? (
                        <a
                          href={loc.gmaps_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#4a9eff",
                            textDecoration: "none",
                            fontSize: 12,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          🗺️ Buka Maps
                        </a>
                      ) : (
                        <span style={{ color: "#333" }}>—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div style={{ marginTop: 16, fontSize: 11, color: "#333", textAlign: "right" }}>
          Menampilkan {filtered.length} dari {locations.length} data
        </div>
      </div>

      <style>{`
        input::placeholder { color: #444; }
        input:focus { border-color: #D4AF37 !important; }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  );
}