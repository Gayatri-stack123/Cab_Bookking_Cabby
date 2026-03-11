import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix broken default marker icons in webpack/CRA
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
});

const pickupIcon = new L.Icon({
    iconUrl: markerIcon,
    iconRetinaUrl: markerIcon2x,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const dropIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const FitBounds = ({ pickupCoords, dropCoords }) => {
    const map = useMap();
    useEffect(() => {
        if (pickupCoords && dropCoords) {
            map.fitBounds(
                [
                    [pickupCoords.lat, pickupCoords.lng],
                    [dropCoords.lat, dropCoords.lng],
                ],
                { padding: [60, 60] }
            );
        } else if (pickupCoords) {
            map.setView([pickupCoords.lat, pickupCoords.lng], 13);
        }
    }, [pickupCoords, dropCoords, map]);
    return null;
};

const MapView = ({ pickupCoords, dropCoords, route }) => {
    const defaultCenter = [20.5937, 78.9629];
    const defaultZoom = 5;

    return (
        <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            style={{ height: '420px', width: '100%' }}
            className="z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pickupCoords && (
                <Marker position={[pickupCoords.lat, pickupCoords.lng]} icon={pickupIcon}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}
            {dropCoords && (
                <Marker position={[dropCoords.lat, dropCoords.lng]} icon={dropIcon}>
                    <Popup>Drop Location</Popup>
                </Marker>
            )}
            {route && route.length > 0 && (
                <Polyline positions={route} color="#276ef1" weight={5} opacity={0.8} />
            )}
            <FitBounds pickupCoords={pickupCoords} dropCoords={dropCoords} />
        </MapContainer>
    );
};

export default MapView;
