const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 4000;
const apiKey = '5HZGWSCekwOIiszG3m5z9BlN8A1clFUS';

// Use Cors
app.use(cors());

app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  try {
    // Fetch location key by city name
    const locationResponse = await axios.get(
      `https://dataservice.accuweather.com/locations/v1/cities/search`,
      {
        params: {
          apikey: apiKey,
          q: city
        }
      }
    );
    const locationKey = locationResponse.data[0]?.Key;

    if (!locationKey) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // Fetch weather forecast
    const weatherResponse = await axios.get(
      `https://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}`,
      {
        params: {
          apikey: apiKey,
          details: true
        }
      }
    );

    res.json(weatherResponse.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(error.response?.status || 500).send(error.message);
  }
});

app.listen(port, () => {
  console.log(`Proxy server running at http://localhost:${port}`);
});
