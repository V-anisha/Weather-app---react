import React, { useState, useEffect } from 'react';
import './index.css';

// This will manage and update URL
function useSearchParams() {
    const [searchParams, setSearchParams] = useState(new URLSearchParams(window.location.search));

    const updateSearchParams = (params) => {
        const newSearchParams = new URLSearchParams(params);
        setSearchParams(newSearchParams);
        window.history.pushState({}, '', '?' + newSearchParams.toString());
    };

    return [searchParams, updateSearchParams];
}

const Second = () => {
    // Initializing the values
    const [location, setLocation] = useState('');
    const [temperature, setTemperature] = useState(null);
    const [error, setError] = useState(null);

    // Using the custom hook to manage URL search params
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const loc = searchParams.get('location');
        if (loc) {
            setLocation(loc);
            fetchWeatherData(loc);
        }
    }, []); // Run once on component mount

    const handleInputChange = (event) => {
        setLocation(event.target.value);
    };

    const fetchWeatherData = async (location) => {
        try {
            // const apiKey = process.env.Key;
            const apiKey = '481b3a5fd2ad423ba1a220051242106';
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`);
            if (!response.ok) {
                throw new Error('Location not found'); // ERROR MESSAGE BASED ON API RESPONSE
            }
            const data = await response.json();
            setTemperature(data.current.temp_c); // Display the temperature in deg C
            setError(null);
        } catch (err) {
            setError(err.message);
            setTemperature(null);
        } // Display error message if there is an error like wrong input
    };

    const handleCityNameChange = (e) => {
        setLocation(e.target.value);
        setSearchParams({ location: e.target.value });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        fetchWeatherData(location);
    };

    return (
        <div>
            <center><h1>Second Page</h1></center>
            <h2>Enter location to check the temperature</h2>
            <h3>Location : {searchParams.get('location')}</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" value={location} onChange={handleCityNameChange} placeholder="Enter location" />
                <button type="submit">Check Temperature</button>
            </form>
            {temperature !== null && (
                <div>
                    <h3>Current Temperature: {temperature}°C</h3>
                </div>
            )}
            {error && (
                <div>
                    <h3>Error: {error}</h3>
                </div>
            )}
        </div>
    );
};

export default Second;
