import React, { useState, useEffect, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { fetchRoutePolyline, getStaticMapUrl } from './api/mapboxApi.js';
import './CSS/main.css'; // Import die CSS-Datei

// Mapbox-Zugangstoken festlegen
mapboxgl.accessToken = 'pk.eyJ1Ijoic2xpbWU5MSIsImEiOiJjbHhkbnJvMGgwNnEzMmxzaXk0ZHh4YWxtIn0.4MkZmmG8ODN40vZmPDuBJg';

function Main() {
  // Zustandshooks für Trail-Daten und Map-Bild-URLs
  const [trailData, setTrailData] = useState(() => JSON.parse(localStorage.getItem('trailData')) || []);
  const [mapImageUrl, setMapImageUrl] = useState({});

  // Memoized Funktion zum Hinzufügen eines Trails
  const addTrail = useCallback((name, date, coordinates) => {
    const newTrail = {
      id: Date.now(),
      name,
      date,
      coordinates,
      mapUrl: '' // Platzhalter für die URL des Kartenbildes
    };

    // Lokale Speicherung und Zustand aktualisieren
    setTrailData(prevTrailData => {
      const updatedTrails = [...prevTrailData, newTrail];
      localStorage.setItem('trailData', JSON.stringify(updatedTrails));
      return updatedTrails;
    });

    // Karte generieren
    generateMap(coordinates, newTrail.id);
  }, []);

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
      e.preventDefault();
    });

    // Karte beim Aufräumen entfernen
    return () => initializeMap.remove();
  }, [addTrail]);

  // Funktion zum Entfernen eines Trails
  const removeTrail = (trailId) => {
    const confirmed = window.confirm("Are you sure you want to delete this trail?");
    if (confirmed) {
      setTrailData(prevTrailData => {
        const updatedTrails = prevTrailData.filter(trail => trail.id !== trailId);
        localStorage.setItem('trailData', JSON.stringify(updatedTrails));
        return updatedTrails;
      });

      setMapImageUrl(prevMapImageUrl => {
        const updatedMapImages = { ...prevMapImageUrl };
        delete updatedMapImages[trailId];
        return updatedMapImages;
      });
    }
  };

  // Sortiere die Trails nach Datum (älteste zuerst) und dann nach Name
  const sortedTrails = [...trailData].sort((a, b) => {
    const dateComparison = new Date(b.date) - new Date(a.date); // Sortiere nach Datum, neuestes zuerst
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return a.name.localeCompare(b.name); // Sortiere nach Name, wenn Datum gleich
  });

  return (
    <div className="container">
      <header>
        <h1>Turkye Trailsapp</h1>
      </header>
      <div className="main-content">
        <div id="map"></div>
        <div className="trail-list-container">
          <div className="trail-list">
            {sortedTrails.map(trail => (
              <div key={trail.id} className="trail-item">
                <img src={mapImageUrl[trail.id] || 'loading.jpg'} alt="Trail Map" />
                <h4>{trail.name} - {trail.date}</h4>
                {new Date(trail.date) < new Date() ? <span className="expired">Expired</span> : null}
                <button type="button" className="remove-button" onClick={() => removeTrail(trail.id)}>
                  Remove Trail
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="info-box">
        <p>Click on the map to add a new trail.</p>
      </div>
      <footer>
        <p>© 2024 Definitely not turkish spyware GmbH</p>
      </footer>
    </div>
  );
}

export default Main;
