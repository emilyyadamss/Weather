"use client";

import { useState } from "react";
import { getWeather } from "@/lib/weatherService";
import { supabase } from "@/lib/supabase";

export default function WeatherWidget() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSearch() {
    setLoading(true);
    setError("");

    try {
      const data = await getWeather(city);
      setWeather(data);
    } catch (err) {
      setError("Could not fetch weather");
    } finally {
      setLoading(false);
    }
  }
  async function saveFavorite() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      alert("Please log in to save favorites");
      return;
    }

    const { error } = await supabase.from("favorite_locations").insert({
      user_id: user.id,
      city: city,          // use your current city state
      country: null,    // if you have it
      label: null,
    });
  
    if (error) {
      console.error(error);
      alert("Could not save");
    } else {
      alert("Saved!");
    }
  }

  return (
    <div>
      <input
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {weather && (
        <div>
          <p>Temperature: {weather.temp}</p>
          <p>Condition: {weather.condition}</p>
        </div>
      )}
      <button onClick={saveFavorite}>
        ⭐ Save
      </button>
    </div>
  );
}
