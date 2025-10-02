"use client";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet-control-geocoder";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
// });

const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  iconRetinaUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function SearchControl({ onLocationSelect }) {
  const map = useMap();
  useEffect(() => {
    const geocoder = L.Control.geocoder({ defaultMarkGeocode: false })
      .on("markgeocode", function (e) {
        const center = e.geocode.center;
        const address = e.geocode.name;
        const locationData = {
          formatted: address,
          latitude: center.lat,
          longitude: center.lng,
        };
        onLocationSelect(locationData);
        map.setView(center, 15);
      })
      .addTo(map);

    return () => geocoder.remove();
  }, [map, onLocationSelect]);
  return null;
}

function MapClickHandler({ onLocationSelect }) {
  const map = useMap();
  useEffect(() => {
    const handleClick = async (e) => {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`
      );
      const data = await res.json();
      const address = data.display_name || "Unknown location";
      const locationData = {
        formatted: address,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      };
      onLocationSelect(locationData);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, onLocationSelect]);
  return null;
}

export default function AddressPicker({ onLocationSelect }) {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [address, setAddress] = useState("");
  const [lastSavedLocation, setLastSavedLocation] = useState(null);
  const [defaultLocation, setDefaultLocation] = useState([13.3618, 103.8606]);

  const handleSelect = (locationData) => {
    setSelectedPosition({
      lat: locationData.latitude,
      lng: locationData.longitude,
    });
    setAddress(locationData.formatted);
    setLastSavedLocation(locationData);
    localStorage.setItem("checkout_address", JSON.stringify(locationData));
    onLocationSelect(locationData);
  };

  useEffect(() => {
    const stored = localStorage.getItem("checkout_address");
    if (stored) {
      const parsed = JSON.parse(stored);
      handleSelect(parsed);
      setDefaultLocation([parsed.latitude, parsed.longitude]);
    }
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <MapContainer
        center={defaultLocation}
        zoom={15}
        style={{ height: "400px", width: "100%", borderRadius: "8px" }}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
          maxZoom={20}
        />
        <SearchControl onLocationSelect={handleSelect} />
        <MapClickHandler onLocationSelect={handleSelect} />

        {selectedPosition && (
          <Marker position={selectedPosition} icon={redIcon}>
            <Popup>
              <b>{address}</b>
              <br />
              Lat: {selectedPosition.lat.toFixed(6)}, Lng:{" "}
              {selectedPosition.lng.toFixed(6)}
              <br />
              <small>ទីតាំងត្រូវបានរក្សាទុកដោយស្វ័យប្រវត្តិ</small>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {lastSavedLocation && (
        <div
          style={{
            marginTop: "15px",
            padding: "10px",
            backgroundColor: "#f8f9fa",
            border: "1px solid #dee2e6",
            borderRadius: "6px",
            fontSize: "12px",
            color: "#666",
          }}
        >
          <strong>ទីតាំងដែលបានរក្សាទុក:</strong>
          <br />
          {lastSavedLocation.formatted}
          <br />
          រយៈទទឹង: {lastSavedLocation.latitude.toFixed(6)}, រយៈបណ្តោយ:{" "}
          {lastSavedLocation.longitude.toFixed(6)}
        </div>
      )}
    </div>
  );
}
