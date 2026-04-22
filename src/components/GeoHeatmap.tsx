import { useEffect, useRef, useMemo } from 'react';
import { MapContainer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';
import { useAppSelector } from '../store/hooks';

const WIKI_COORDINATES: Record<string, [number, number]> = {
  'en.wikipedia.org': [37.09, -95.71],
  'de.wikipedia.org': [51.16, 10.45],
  'fr.wikipedia.org': [46.23, 2.21],
  'ja.wikipedia.org': [36.20, 138.25],
  'es.wikipedia.org': [40.46, -3.74],
  'ru.wikipedia.org': [61.52, 105.31],
  'pt.wikipedia.org': [-14.23, -51.92],
  'zh.wikipedia.org': [35.86, 104.19],
  'it.wikipedia.org': [41.87, 12.56],
  'ar.wikipedia.org': [26.82, 30.80],
  'pl.wikipedia.org': [51.91, 19.14],
  'nl.wikipedia.org': [52.13, 5.29],
  'fa.wikipedia.org': [32.42, 53.68],
  'uk.wikipedia.org': [48.37, 31.16],
  'sv.wikipedia.org': [60.12, 18.64],
  'ko.wikipedia.org': [35.90, 127.76],
  'tr.wikipedia.org': [38.96, 35.24],
  'vi.wikipedia.org': [14.05, 108.27],
  'id.wikipedia.org': [-0.78, 113.92],
  'he.wikipedia.org': [31.04, 34.85],
  'cs.wikipedia.org': [49.81, 15.47],
  'fi.wikipedia.org': [61.92, 25.74],
  'hu.wikipedia.org': [47.16, 19.50],
  'ca.wikipedia.org': [41.59, 1.52],
  'no.wikipedia.org': [60.47, 8.46],
  'ro.wikipedia.org': [45.94, 24.96],
  'da.wikipedia.org': [56.26, 9.50],
  'sr.wikipedia.org': [44.01, 21.00],
  'bg.wikipedia.org': [42.73, 25.48],
  'ms.wikipedia.org': [4.21, 108.00],

  'commons.wikimedia.org': [50.11, 8.68],
  'www.wikidata.org': [52.52, 13.40],
  'meta.wikimedia.org': [37.78, -122.42],
};

function resolveCoordinates(wikiName: string): [number, number] | null {

  if (WIKI_COORDINATES[wikiName]) {
    return WIKI_COORDINATES[wikiName];
  }

  const withOrg = wikiName.endsWith('.org') ? wikiName : wikiName + '.org';
  if (WIKI_COORDINATES[withOrg]) {
    return WIKI_COORDINATES[withOrg];
  }

  const parts = wikiName.split('.');
  if (parts.length >= 1) {
    const langKey = `${parts[0]}.wikipedia.org`;
    if (WIKI_COORDINATES[langKey]) {
      return WIKI_COORDINATES[langKey];
    }
  }

  return null;
}


function HeatmapLayer() {
  const topWikis = useAppSelector((state) => state.analytics.topWikis);
  const heatLayerRef = useRef<any>(null);
  const map = useMap();

  const heatPoints = useMemo(() => {
    if (topWikis.length === 0) return [];

    const maxEdits = Math.max(...topWikis.map((w) => w.edits), 1);

    const points: [number, number, number][] = [];
    topWikis.forEach((wiki) => {
      const coords = resolveCoordinates(wiki.wiki);
      if (coords) {

        const intensity = Math.max(0.3, wiki.edits / maxEdits);
        points.push([coords[0], coords[1], intensity]);
        points.push([coords[0], coords[1] - 360, intensity]);
        points.push([coords[0], coords[1] + 360, intensity]);
      }
    });

    return points;
  }, [topWikis]);

  // Initialize state on component mount
  useEffect(() => {

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (heatPoints.length > 0) {

      const heat = (L as any).heatLayer(heatPoints, {
        radius: 40,
        blur: 25,
        maxZoom: 10,
        max: 1.0,
        minOpacity: 0.4,
        gradient: {
          0.0: '#3366cc', // Wikipedia Blue
          0.4: '#109618', // Green
          0.7: '#ff9900', // Orange
          1.0: '#dc3912', // Red
        },
      });

      heat.addTo(map);
      heatLayerRef.current = heat;
    }

    return () => {
      if (heatLayerRef.current) {
        map.removeLayer(heatLayerRef.current);
        heatLayerRef.current = null;
      }
    };
  }, [heatPoints, map]);

  return null;
}


function WikiMarkers() {
  const topWikis = useAppSelector((state) => state.analytics.topWikis);

  const markers = useMemo(() => {
    if (topWikis.length === 0) return [];

    const maxEdits = Math.max(...topWikis.map((w) => w.edits), 1);

    const allMarkers: Array<{
      id: string;
      wiki: string;
      edits: number;
      percentage: number;
      coords: [number, number];
      radius: number;
    }> = [];

    topWikis.forEach((wiki) => {
      const coords = resolveCoordinates(wiki.wiki);
      if (!coords) return;

      const radius = 5 + (wiki.edits / maxEdits) * 15;
      
      const baseProps = {
        wiki: wiki.wiki,
        edits: wiki.edits,
        percentage: wiki.percentage,
        radius,
      };

      allMarkers.push({ ...baseProps, id: `${wiki.wiki}-main`, coords });
      allMarkers.push({ ...baseProps, id: `${wiki.wiki}-left`, coords: [coords[0], coords[1] - 360] });
      allMarkers.push({ ...baseProps, id: `${wiki.wiki}-right`, coords: [coords[0], coords[1] + 360] });
    });

    return allMarkers;
  }, [topWikis]);

  return (
    <>
      {markers.map((marker) => (
        <CircleMarker
          key={marker.id}
          center={marker.coords}
          radius={marker.radius}
          pathOptions={{
            color: '#3366cc',
            fillColor: '#7397f8',
            fillOpacity: 0.5,
            weight: 2,
          }}
        >
          <Tooltip>
            <div className="text-sm font-sans">
              <div className="font-semibold">{marker.wiki}</div>
              <div>{marker.edits.toLocaleString()} edits ({marker.percentage.toFixed(1)}%)</div>
            </div>
          </Tooltip>
        </CircleMarker>
      ))}
    </>
  );
}


function ThemeTileLayer({ isDark }: { isDark: boolean }) {
  const map = useMap();
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize state on component mount
  useEffect(() => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const url = isDark
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

    const newTileLayer = L.tileLayer(url, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    });

    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;

    return () => {
      if (tileLayerRef.current) {
        map.removeLayer(tileLayerRef.current);
      }
    };
  }, [isDark, map]);

  return null;
}

// Main component renderer
export default function GeoHeatmap() {
  const topWikis = useAppSelector((state) => state.analytics.topWikis);
  const isDark = useAppSelector((state) => state.theme.mode === 'dark');

  const matchedCount = useMemo(() => {
    return topWikis.filter((w) => resolveCoordinates(w.wiki) !== null).length;
  }, [topWikis]);

  return (
    <div className="card" id="geo-heatmap">
      <div className="card-header">
        <svg className="w-4 h-4 text-primary-500 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Global Edit Activity
        <span className="ml-auto text-xs text-surface-400 dark:text-surface-500 normal-case tracking-normal">
          {topWikis.length > 0
            ? `${matchedCount}/${topWikis.length} wikis mapped`
            : 'Waiting for data...'}
        </span>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ height: '350px' }}>
        <MapContainer
          center={[30, 10]}
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          worldCopyJump={true}
        >
          <ThemeTileLayer isDark={isDark} />
          <HeatmapLayer />
          <WikiMarkers />
        </MapContainer>
      </div>
    </div>
  );
}
