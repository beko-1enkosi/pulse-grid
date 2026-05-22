import { useEffect, useRef, useState } from "react";
import { HOSPITALS, Hospital, Patient, randomJhbCoord, randomPatient, shuffleQueue } from "@/lib/mockData";

type ConnState = "connecting" | "live" | "mock";

export interface RouteEvent {
  id: string;
  fromLat: number;
  fromLng: number;
  hospitalId: string;
  createdAt: number;
}

export function useLiveGrid() {
  const [patients, setPatients] = useState<Patient[]>(() =>
    Array.from({ length: 4 }, () => randomPatient())
  );
  const [hospitals, setHospitals] = useState<Hospital[]>(HOSPITALS);
  const [routes, setRoutes] = useState<RouteEvent[]>([]);
  const [conn, setConn] = useState<ConnState>("connecting");
  const wsRef = useRef<WebSocket | null>(null);

  const pushPatient = (p: Patient) => {
    setPatients((cur) => [p, ...cur].slice(0, 30));
    const h = HOSPITALS[Math.floor(Math.random() * HOSPITALS.length)];
    const c = randomJhbCoord();
    setRoutes((r) =>
      [
        ...r,
        {
          id: crypto.randomUUID(),
          fromLat: c.lat,
          fromLng: c.lng,
          hospitalId: h.id,
          createdAt: Date.now(),
        },
      ].slice(-6)
    );
  };

  const reshuffle = () => {
    setHospitals((hs) =>
      hs.map((h) => ({
        ...h,
        queue: shuffleQueue(
          Math.random() > 0.7
            ? [...h.queue, { id: crypto.randomUUID(), name: "New Intake", score: Math.round(Math.random() * 100) }]
            : h.queue
        ).slice(0, h.capacity),
      }))
    );
  };

  useEffect(() => {
    let cancelled = false;
    let timeout: ReturnType<typeof setTimeout>;

    try {
      const ws = new WebSocket("ws://127.0.0.1:8000/ws/dashboard");
      wsRef.current = ws;
      timeout = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN && !cancelled) {
          setConn("mock");
          ws.close();
        }
      }, 1500);

      ws.onopen = () => { if (!cancelled) setConn("live"); };
      ws.onmessage = (ev) => {
        try {
          const msg = JSON.parse(ev.data);
          if (msg.event === "NEW_PATIENT" && msg.data) pushPatient(msg.data);
          if (msg.event === "NETWORK_UPDATE") reshuffle();
        } catch {}
      };
      ws.onerror = () => { if (!cancelled) setConn("mock"); };
      ws.onclose = () => { if (!cancelled) setConn(() => "mock"); };
    } catch {
      setConn("mock");
    }

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    if (conn === "live") return;
    const a = setInterval(() => pushPatient(randomPatient()), 3500);
    const b = setInterval(() => reshuffle(), 4200);
    return () => { clearInterval(a); clearInterval(b); };
  }, [conn]);

  useEffect(() => {
    const t = setInterval(() => {
      setRoutes((r) => r.filter((x) => Date.now() - x.createdAt < 6000));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return { patients, hospitals, routes, conn };
}
