import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'; // Add axios for HTTP requests

function Main() {
  const [trailName, setTrailName] = useState(() =>
    JSON.parse(localStorage.getItem('trailName')) || ['Herisau']
  );
  const [trailDate, setTrailDate] = useState(() =>
    JSON.parse(localStorage.getItem('trailDate')) || ['2022-02-22']
  );
  const [weatherData, setWeatherData] = useState({}); // Store weather data

  const apiKey = 'ZCgsxieFrvxmiHCSL2jd5iUJQ4US86Dn';

  useEffect(() => {
    localStorage.setItem('trailName', JSON.stringify(trailName));
    localStorage.setItem('trailDate', JSON.stringify(trailDate));
  }, [trailName, trailDate]);

  useEffect(() => {
    const storedTrailName = localStorage.getItem('trailName');
    const storedTrailDate = localStorage.getItem('trailDate');

    if (storedTrailName && storedTrailDate) {
      try {
        setTrailName(JSON.parse(storedTrailName));
        setTrailDate(JSON.parse(storedTrailDate));
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      setTrailName(JSON.parse(localStorage.getItem('trailName')) || []);
      setTrailDate(JSON.parse(localStorage.getItem('trailDate')) || []);
    };
    window.addEventListener('storage', handleStorageChange);

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleRemoveTrail = (index) => {
    const newTrailName = [...trailName];
    const newTrailDate = [...trailDate];
    newTrailName.splice(index, 1);
    newTrailDate.splice(index, 1);
    setTrailName(newTrailName);
    setTrailDate(newTrailDate);
  };

  const [showRemoveButton, setShowRemoveButton] = useState(false);

  const fetchWeatherData = async (city) => {
    try {
      // Fetch weather data from proxy server
      const response = await axios.get(`http://localhost:4000/weather/${city}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  };
  
  

  useEffect(() => {
    const getWeatherForTrails = async () => {
      const weatherPromises = trailName.map((name, index) => fetchWeatherData(name, trailDate[index]));
      const weatherResults = await Promise.all(weatherPromises);
      const weatherMap = {};
      trailName.forEach((name, index) => {
        weatherMap[index] = weatherResults[index];
      });
      setWeatherData(weatherMap);
    };
    getWeatherForTrails();
  }, [trailName, trailDate]);

  const confirmRemove = (index) => {
    if (window.confirm(trailName[index] + " löschen?")) {
      handleRemoveTrail(index);
    }
  };

  const location = useLocation();
  const newTrailFromConfigure = location.state?.newTrail;

  useEffect(() => {
    if (newTrailFromConfigure) {
      setTrailName([...trailName, newTrailFromConfigure.name]);
      setTrailDate([...trailDate, newTrailFromConfigure.date]);
    }
    // eslint-disable-next-line
  }, []);

  // Combine, sort by date and then by name, and keep index for removal
  const combinedData = trailName.map((name, index) => ({
    name,
    date: trailDate[index],
    weather: weatherData[index],
    originalIndex: index
  }));

  // Sort by date (oldest first), then by name
  combinedData.sort((a, b) => {
    const dateComparison = new Date(a.date) - new Date(b.date);
    if (dateComparison !== 0) {
      return dateComparison;
    }
    return a.name.localeCompare(b.name);
  });

  const listItems = combinedData.map((item, index) => {
    const isPastDate = new Date(item.date) < new Date();
    return (
      <div key={index} className="flex items-center mb-4">
        <div
          className={`flex justify-between items-center p-4 w-full border border-slate-900 rounded shadow ${
            isPastDate ? 'bg-red-500 text-white' : 'bg-white'
          }`}
        >
          <div className="flex flex-col">
            <span className="font-bold">{item.name}</span>
            <span>{item.date}</span>
            {item.weather && (
              <div className="flex items-center">
                <img src={`https://www.accuweather.com/images/weathericons/${item.weather.DailyForecasts[0].Day.Icon}.svg`} alt="weather icon" />
                <span>{item.weather.DailyForecasts[0].Day.IconPhrase}</span>
              </div>
            )}
          </div>
          <button
            className={`ml-4 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition-opacity duration-300 ${
              showRemoveButton ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={() => confirmRemove(item.originalIndex)}
          >
            X
          </button>
        </div>
      </div>
    );
  });

  return (
    <div>
      <header>
        <div className="grid grid-cols-1 justify-items-center">
          <label className="font-bold text-5xl mt-10">Trails</label>
        </div>
      </header>
      <main>
        <div className="ml-12 mt-10">
          <div className="flex flex-col gap-4 w-11/12 ml-12">
            <div className="flex items-center mb-8">
              <div className="border border-slate-900 py-4 font-bold text-center rounded w-full bg-lime-300 shadow">
                Trails List
              </div>
            </div>
            {listItems}
          </div>
        </div>
      </main>
      <footer>
        <div className="fixed bottom-2 right-5">
          <Link to="/configure">
            <button className="border rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 mr-3">
              Hinzufügen
            </button>
          </Link>

          <button
            className="border rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-blue-600"
            onClick={() => setShowRemoveButton(!showRemoveButton)}
          >
            Löschen
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Main;
