import { useEffect, useRef } from "react";
import { OlaMaps, defaultStyleJson } from "olamaps-web-sdk";

type PropertyLocationMapProps = {
  latitude: number;
  longitude: number;
  onLocationChange: (latitude: number, longitude: number) => void;
};


export function PropertyLocationMap({
  latitude,
  longitude,
  onLocationChange,
}: PropertyLocationMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<{ remove: () => void } | null>(null);
  const markerRef = useRef<{ getLngLat: () => { lat: number; lng: number }; setLngLat: (lngLat: [number, number]) => unknown; remove: () => void } | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);
  onLocationChangeRef.current = onLocationChange;

  useEffect(() => {
    const apiKey = import.meta.env.VITE_OLA_MAP_TOKEN_API as string | undefined;
    const container = containerRef.current;
    if (!apiKey?.trim() || !container) return;

    let cancelled = false;

    const run = async () => {
      const sdk = new OlaMaps({ apiKey });
      const map = await sdk.init({
        container,
        style: defaultStyleJson,
        center: [longitude, latitude],
        zoom: 15,
      });
      if (cancelled) {
        map.remove();
        return;
      }

      mapRef.current = map;
      const marker = sdk
        .addMarker({ draggable: true })
        .setLngLat([longitude, latitude])
        .addTo(map);
      markerRef.current = marker;

      marker.on("dragend", () => {
        const ll = marker.getLngLat();
        onLocationChangeRef.current(ll.lat, ll.lng);
      });

      map.on("click", (e: { lngLat: { lat: number; lng: number } }) => {
        marker.setLngLat([e.lngLat.lng, e.lngLat.lat]);
        onLocationChangeRef.current(e.lngLat.lat, e.lngLat.lng);
      });
    };

    void run().catch((err: unknown) => {
      console.error("Ola Maps failed to load:", err);
    });

    return () => {
      cancelled = true;
      markerRef.current?.remove();
      markerRef.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Intentionally run once per mount; parent supplies initial lat/lng below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const current = marker.getLngLat();
    const same =
      Math.abs(current.lat - latitude) < 1e-7 &&
      Math.abs(current.lng - longitude) < 1e-7;
    if (same) return;
    marker.setLngLat([longitude, latitude]);
  }, [latitude, longitude]);

  const apiKey = import.meta.env.VITE_OLA_MAP_TOKEN_API as string | undefined;
  if (!apiKey?.trim()) {
    return (
      <div className="h-72 rounded-3xl border-2 border-gray-100 bg-gray-50 flex items-center justify-center px-4 text-center text-sm text-gray-500">
        Add <code className="mx-1">VITE_OLA_MAP_TOKEN_API</code> to Client{" "}
        <code className="mx-1">.env</code> and restart the dev server.
      </div>
    );
  }

  return (
    <div className="relative h-72 rounded-3xl overflow-hidden border-2 border-gray-100">
      <div ref={containerRef} className="h-full w-full" />
      <p className="pointer-events-none absolute top-3 left-3 rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-gray-600 shadow-md backdrop-blur-sm">
        Click map or drag pin to set location
      </p>
    </div>
  );
}
