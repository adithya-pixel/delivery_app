// components/DeliveryZoneMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Circle } from 'react-leaflet';
import L from 'leaflet';

const storeIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
  iconSize: [32, 32],
});

const userIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149059.png',
  iconSize: [32, 32],
});

const DeliveryZoneMap = ({ storeLat, storeLng, radius, userLat, userLng }) => {
  return (
    <MapContainer
      center={[storeLat, storeLng]}
      zoom={13}
      style={{ height: '300px', marginTop: '1rem', borderRadius: '12px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[storeLat, storeLng]} icon={storeIcon}></Marker>
      {userLat && userLng && <Marker position={[userLat, userLng]} icon={userIcon}></Marker>}
      <Circle center={[storeLat, storeLng]} radius={radius * 1000} color="blue" />
    </MapContainer>
  );
};

export default DeliveryZoneMap;
