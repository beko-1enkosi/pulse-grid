import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";
import type * as LType from "leaflet";
import { Hospital } from "@/lib/mockData";
import { RouteEvent } from "@/hooks/useLiveGrid";

// Center strictly on Johannesburg
const JHB: [number, number] = [-26.2041, 28.0473];

// Lucide-style hospital (medical building with cross)
const HOSPITAL_SVG_PUBLIC = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0050D8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/>
  <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2"/>
  <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>
</svg>`;

const HOSPITAL_SVG_PRIVATE = `
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 6v4"/><path d="M14 14h-4"/><path d="M14 18h-4"/><path d="M14 8h-4"/>
  <path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h2"/>
  <path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"/>
</svg>`;

// Lucide ambulance
const AMBULANCE_SVG = `
<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E11D48" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M10 10H6"/><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
  <path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"/>
  <path d="M8 8v4"/><path d="M9 18h6"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>
</svg>`;

export function LeafletMap({
  hospitals,
  routes,
}: {
  hospitals: Hospital[];
  routes: RouteEvent[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LType.Map | null>(null);
  const LRef = useRef<typeof LType | null>(null);
  const hospitalLayer = useRef<LType.LayerGroup | null>(null);
  const routeLayer = useRef<LType.LayerGroup | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current || mapRef.current) return;
      LRef.current = L;
      const map = L.map(containerRef.current, {
        center: JHB,
        zoom: 11,
        minZoom: 10,
        maxZoom: 16,
        zoomControl: false,
        attributionControl: false,
      });
      L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", { maxZoom: 19 }).addTo(map);
      L.control.zoom({ position: "bottomright" }).addTo(map);
      hospitalLayer.current = L.layerGroup().addTo(map);
      routeLayer.current = L.layerGroup().addTo(map);
      mapRef.current = map;
      setTimeout(() => map.invalidateSize(), 120);
      paintHospitals();
      paintRoutes();
    })();
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paintHospitals = () => {
    const L = LRef.current;
    if (!L || !hospitalLayer.current) return;
    hospitalLayer.current.clearLayers();
    hospitals.forEach((h) => {
      const isPrivate = h.kind === "private";
      const ring = isPrivate ? "rgba(124,58,237,0.22)" : "rgba(0,80,216,0.22)";
      const border = isPrivate ? "rgba(124,58,237,0.35)" : "rgba(0,80,216,0.3)";
      const tag = isPrivate ? "Private" : "Public";
      const tagBg = isPrivate ? "#F3EAFE" : "#E6F0FF";
      const tagFg = isPrivate ? "#6D28D9" : "#0050D8";
      const icon = L.divIcon({
        className: "pulsegrid-hospital",
        html: `
          <div style="position:relative;width:42px;height:42px;">
            <span style="position:absolute;inset:0;border-radius:50%;background:${ring};animation:pgPing 2.6s ease-out infinite;"></span>
            <div style="position:relative;display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:#fff;box-shadow:0 8px 22px -10px rgba(0,26,64,0.45);border:1px solid ${border};">
              ${isPrivate ? HOSPITAL_SVG_PRIVATE : HOSPITAL_SVG_PUBLIC}
            </div>
          </div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21],
      });
      const marker = L.marker([h.lat, h.lng], { icon });
      marker.bindTooltip(
        `<div style="font-family:Inter,sans-serif;min-width:170px;">
           <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
             <span style="font-size:9px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:2px 6px;border-radius:999px;background:${tagBg};color:${tagFg};">${tag}</span>
           </div>
           <div style="font-size:12px;font-weight:600;color:#001A40;line-height:1.25;">${h.name}</div>
           <div style="font-size:11px;font-weight:500;color:#475569;margin-top:3px;">${h.queue.length}/${h.capacity} beds</div>
         </div>`,
        { direction: "top", offset: [0, -18], opacity: 1 }
      );
      hospitalLayer.current!.addLayer(marker);
    });
  };

  const paintRoutes = () => {
    const L = LRef.current;
    if (!L || !routeLayer.current) return;
    routeLayer.current.clearLayers();
    routes.forEach((r) => {
      const h = hospitals.find((x) => x.id === r.hospitalId);
      if (!h) return;
      const line = L.polyline(
        [[r.fromLat, r.fromLng], [h.lat, h.lng]],
        { color: "#0050D8", weight: 2.5, opacity: 0.85, dashArray: "6 8", className: "pg-route-line" }
      );
      routeLayer.current!.addLayer(line);
      const ambulanceIcon = L.divIcon({
        className: "pulsegrid-ambulance",
        html: `
          <div style="position:relative;width:30px;height:30px;">
            <span style="position:absolute;inset:0;border-radius:50%;background:rgba(225,29,72,0.18);animation:pgPing 1.6s ease-out infinite;"></span>
            <div style="position:relative;display:grid;place-items:center;width:30px;height:30px;border-radius:9px;background:#fff;border:1px solid rgba(225,29,72,0.35);box-shadow:0 6px 14px -6px rgba(225,29,72,0.55);">
              ${AMBULANCE_SVG}
            </div>
          </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
      });
      routeLayer.current!.addLayer(L.marker([r.fromLat, r.fromLng], { icon: ambulanceIcon }));
    });
  };

  useEffect(() => { paintHospitals(); /* eslint-disable-next-line */ }, [hospitals]);
  useEffect(() => { paintRoutes(); /* eslint-disable-next-line */ }, [routes, hospitals]);

  return (
    <>
      <style>{`
        @keyframes pgPing { 0%{transform:scale(1);opacity:.7} 80%{transform:scale(2.4);opacity:0} 100%{transform:scale(2.4);opacity:0} }
        .pg-route-line { animation: pgDash 1s linear infinite; }
        @keyframes pgDash { to { stroke-dashoffset: -28; } }
        .leaflet-container { background: #EAF2FB; font-family: Inter, sans-serif; }
        .leaflet-tooltip { background: rgba(255,255,255,0.96); border:1px solid rgba(0,80,216,0.18); box-shadow: 0 8px 20px -10px rgba(0,26,64,0.3); border-radius: 10px; padding: 8px 10px; }
        .leaflet-tooltip-top:before { display:none; }
      `}</style>
      <div ref={containerRef} className="absolute inset-0" />
    </>
  );
}
