import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
    data: any; // Astrology data containing lat/lon and astrocartography hints
}

const PowerPlaceMap: React.FC<MapProps> = ({ data }) => {
    const { latitude, longitude } = data; // Primary birth location
    const center: [number, number] = [parseFloat(latitude) || 0, parseFloat(longitude) || 0];

    return (
        <div className="w-full h-full absolute inset-0 grayscale border border-white/10 rounded-[2.5rem] overflow-hidden group">
            <div className="absolute inset-0 z-[400] pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-grid opacity-20"></div>
                {/* Horizontal Scanning Line */}
                <div className="absolute w-full h-[2px] bg-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.8)] animate-[scan_4s_linear_infinite] z-[500] top-[-10%]"></div>
                {/* Vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-void opacity-60"></div>
            </div>

            <MapContainer center={center} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                {/* Birth Location */}
                <Marker position={center}>
                    <Popup>
                        <div className="font-mono text-[10px] bg-void-dark text-white p-2 rounded border border-amber-500/30 uppercase tracking-widest">
                            <strong className="text-amber-400 block mb-1">ORIGIN_POINT</strong>
                            LAT: {latitude}<br />
                            LON: {longitude}
                        </div>
                    </Popup>
                </Marker>

                {/* Power Vortex 1: Solar Line */}
                <Circle
                    center={[center[0] + 15, center[1] - 45]}
                    pathOptions={{ color: '#FACC15', fillColor: '#FACC15', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
                    radius={600000}
                />

                {/* Power Vortex 2: Lunar Line */}
                <Circle
                    center={[center[0] - 25, center[1] + 65]}
                    pathOptions={{ color: '#22D3EE', fillColor: '#22D3EE', fillOpacity: 0.1, weight: 1, dashArray: '5, 5' }}
                    radius={900000}
                />
            </MapContainer>

            {/* Map UI Overlay */}
            <div className="absolute bottom-6 left-6 z-[1000] p-4 glass-panel-dark border border-white/10 rounded-2xl font-mono text-[10px] text-amber-500/60 uppercase tracking-[0.3em] pointer-events-none backdrop-blur-md">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                    GEO_RESONANCE_SCAN // v2.4
                </div>
                <div className="mt-1 text-white/20">LOC: {latitude.toFixed(2)}, {longitude.toFixed(2)}</div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan {
                    from { top: -10%; }
                    to { top: 110%; }
                }
                .leaflet-container { background: #0a0a0c !important; }
                .leaflet-vignette { pointer-events: none; }
            `}} />
        </div>
    );
};

export default PowerPlaceMap;
