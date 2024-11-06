import React from 'react';
import L from 'leaflet';
import { plane, tower } from '../../assets';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CustomMap = ({ selectedPlaneId, dataPlane }) => {
  const selectedPlane = dataPlane.find(plane => plane.Id === selectedPlaneId);

  const towerLat = -6.8961484062892975;
  const towerLong = 107.57571995302902;

  let planeIcon;
  let planeMarker;
  let polylinePositions;

  if (selectedPlane && selectedPlane.Lat && selectedPlane.Long && selectedPlane.Trak) {
    planeIcon = L.divIcon({
      html: `<div style="transform: rotate(${selectedPlane.Trak}deg);">
               <img src="${plane}" style="width: 64px; height: 64px;" />
             </div>`,
      iconSize: [64, 64],
      className: 'plane-icon'
    });

    planeMarker = (
      <Marker position={[selectedPlane.Lat, selectedPlane.Long]} icon={planeIcon}>
        <Popup>
          {selectedPlane?.Op ?? 'N/A'} {selectedPlane?.Reg ?? 'N/A'} - {selectedPlane?.Icao ?? 'N/A'} <br /> Latitude: {selectedPlane?.Lat ?? 'N/A'} <br /> Longitude: {selectedPlane?.Long ?? 'N/A'} <br /> Heading: {selectedPlane?.Trak ?? 'N/A'}
        </Popup>
      </Marker>
    );

    polylinePositions = [
      [selectedPlane.Lat, selectedPlane.Long],
      [towerLat, towerLong]
    ];
  }

  const towerMarker = new L.Icon({
    iconUrl: tower,
    iconSize: [80, 80],
    iconAnchor: [40, 40],
    popupAnchor: [0, -16],
  });

  return (
    <MapContainer center={[towerLat, towerLong]} zoom={8} style={{ height: "800px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {planeMarker}
      <Marker position={[towerLat, towerLong]} icon={towerMarker}>
        <Popup>
           Menara Pusat Pengendalian Uji Terbang <br /> Latitude: {towerLat} <br /> Longitude: {towerLong}
        </Popup>
      </Marker>
      {polylinePositions && (
        <Polyline positions={polylinePositions} color="blue">
          <Popup>
             Distance: {selectedPlane?.Dst ?? 'N/A'} NM
          </Popup>
        </Polyline>
      )}
      <style jsx>{`
        .leaflet-container {
          background-color: black;
        }
      `}</style>
    </MapContainer>
  );
}

export default CustomMap;
