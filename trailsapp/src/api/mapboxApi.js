import axios from 'axios';

const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1Ijoic2xpbWU5MSIsImEiOiJjbHhkbnJvMGgwNnEzMmxzaXk0ZHh4YWxtIn0.4MkZmmG8ODN40vZmPDuBJg';

// Funktion zum Abrufen des Routenpolylinien vom Mapbox Directions API
export const fetchRoutePolyline = async (startLng, startLat, endLng, endLat) => {
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLng},${startLat};${endLng},${endLat}?geometries=polyline&access_token=${MAPBOX_ACCESS_TOKEN}`;
  const response = await axios.get(url);
  const polyline = response.data.routes[0].geometry;
  return polyline;
};

// Funktion zum Erstellen der statischen Karten-URL vom Mapbox Static Image API
export const getStaticMapUrl = (longitude, latitude, polyline) => {
  const zoom = 14;
  const width = 300;
  const height = 200;
  const mapStyle = 'mapbox/streets-v11';
  const encodedPolyline = encodeURIComponent(polyline);
  return `https://api.mapbox.com/styles/v1/mapbox/${mapStyle}/static/path-5+f44-0.5(${encodedPolyline})/${longitude},${latitude},${zoom}/${width}x${height}?access_token=${MAPBOX_ACCESS_TOKEN}`;
};
