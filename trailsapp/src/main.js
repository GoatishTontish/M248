import React, { useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { fetchRoutePolyline, getStaticMapUrl } from './api/mapboxApi.js';

// Mapbox-Zugangstoken festlegen
mapboxgl.accessToken = 'pk.eyJ1Ijoic2xpbWU5MSIsImEiOiJjbHhkbnJvMGgwNnEzMmxzaXk0ZHh4YWxtIn0.4MkZmmG8ODN40vZmPDuBJg';

function Main() {
  // Zustandshooks für Trail-Daten und Map-Bild-URLs
  const [trailData, setTrailData] = useState(() => JSON.parse(localStorage.getItem('trailData')) || []);
  const [mapImageUrl, setMapImageUrl] = useState({});

  // useEffect-Hook für Initialisierung der Karte
  useEffect(() => {
    // Karte initialisieren
    const mapContainer = document.getElementById('map');
    const initializeMap = new mapboxgl.Map({
      container: mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [10, 50],
      zoom: 3
    });

    // Karte nach Laden der Karte anpassen
    initializeMap.on('load', () => {
      initializeMap.resize();
    });

    // Klick-Ereignis auf der Karte behandeln
    initializeMap.on('click', (e) => {
      const coordinates = [e.lngLat.lng, e.lngLat.lat];
      const trailName = prompt("Enter the trail name:");
      const trailDate = prompt("Enter the trail date (YYYY-MM-DD):");
      if (trailName && trailDate) {
        const dateObj = new Date(trailDate);
        if (dateObj.toString() !== "Invalid Date") {
          addTrail(trailName, dateObj.toISOString().slice(0, 10), coordinates);
        } else {
          alert("Invalid format of prompted date, request retry. The format must be (YYYY-MM-DD).");
        }
      }
    });

    // Karte beim Aufräumen entfernen
    return () => initializeMap.remove();
  }, []);

  // Funktion zum Hinzufügen eines Trails
  const addTrail = (name, date, coordinates) => {
    const newTrail = {
      id: Date.now(),
      name,
      date,
      coordinates,
      mapUrl: '' // Platzhalter für die URL des Kartenbildes
    };
    const updatedTrails = [...trailData, newTrail];
    setTrailData(updatedTrails);
    localStorage.setItem('trailData', JSON.stringify(updatedTrails));
    generateMap(coordinates, newTrail.id);
  };

  // Funktion zum Generieren der Kartenbild-URL
  const generateMap = async (coordinates, trailId) => {
    try {
      const polyline = await fetchRoutePolyline(coordinates[0], coordinates[1], coordinates[0], coordinates[1]);
      const mapUrl = getStaticMapUrl(coordinates[0], coordinates[1], polyline);
      setMapImageUrl(prev => ({ ...prev, [trailId]: mapUrl }));
    } catch (error) {
      console.error('Error while generating the map:', error);
    }
  };

  // Funktion zum Entfernen eines Trails
  const removeTrail = (trailId) => {
    const updatedTrails = trailData.filter(trail => trail.id !== trailId);
    setTrailData(updatedTrails);
    localStorage.setItem('trailData', JSON.stringify(updatedTrails));
    const updatedMapImages = {...mapImageUrl};
    delete updatedMapImages[trailId];
    setMapImageUrl(updatedMapImages);
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'stretch' }}>
      <div id="map" style={{ flex: 3, height: '100%' }}></div>
      <div style={{ width: '400px', overflowY: 'auto', padding: '20px', background: '#f9f9f9' }}>
        {trailData.map(trail => (
          <div key={trail.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px', borderRadius: '10px', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
            <img src={mapImageUrl[trail.id] || 'loading.jpg'} alt="Trail Map" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
            <h4>{trail.name} - {trail.date}</h4>
            {new Date(trail.date) < new Date() ? <span style={{ color: 'red', fontWeight: 'bold' }}>Expired   </span> : null}
            <button onClick={() => removeTrail(trail.id)} style={{ backgroundColor: '#f44336', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer', marginTop: '10px' }}>
              Remove Trail
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Main;
