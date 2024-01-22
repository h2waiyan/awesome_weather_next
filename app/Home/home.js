"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css';
import WeatherComp from '../WeatherComp/weather';
import SearchHistory from '../SearchHistory/SearchHistory';

const Home = () => {

    const [city, setCity] = useState('');
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showHistory, setShowHistory] = useState(false);

    const [searchList, setSearchList] = useState([]);

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // On success, set the latitude and longitude in the state
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });

                    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=32ad84d2a41f15df8af1a765bb38c530&units=metric`)
                        .then((res) => {
                            setWeatherData(res.data);
                        })
                        .catch((err) => {
                            setError(err.message);
                        }).finally(() => {
                            setLoading(false);
                        })
                },
                (error) => {
                    alert('Error getting location:', error.message);
                }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    }, [])

    const handleInputChange = (event) => {
        setCity(event.target.value);
    };

    const searchCity = () => {
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=32ad84d2a41f15df8af1a765bb38c530&units=metric`)
            .then((res) => {
                setWeatherData(res.data);
                setError(null);
                setSearchList([...searchList, { city, temp: res.data.main.temp }]);
            })
            .catch((err) => {
                setError(err.message);
            }).finally(() => {
                setLoading(false);
            })
    }

    const getBackgroundClass = (temp) => {
        if (temp < 10) {
            return 'snowy';
        } else if (10 < temp < 20) {
            return 'cloudy';
        } else if (20 < temp < 30) {
            return 'sunny';
        }
        else {
            return 'rainy';
        }
    }

    return (
        <div className={weatherData ? `bg ${getBackgroundClass(weatherData.main.temp)}` : 'bg'} >
            <div className='flex flex-col justify-center items-center p-5'>
                <div className='flex justify-center mb-5 w-full'>
                    <input
                        className='w-1/2 me-3 input text-white  bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500'
                        type="text"
                        placeholder='Enter your city'
                        value={city}
                        onChange={handleInputChange}
                    />

                    <div className='flex justify-center me-2'>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            {showHistory ? 'Hide History' : 'Show History'}
                        </button>
                    </div>

                    <button
                        onClick={searchCity}
                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                        Search
                    </button>


                </div>

                <div className='flex items-center'>
                    {loading && <div>Loading...</div>}
                </div>
                <div className='flex items-center'>
                    {error && <div>{error}</div>}
                </div>
            </div>

            {showHistory && <div className='flex justify-center'>
                {searchList.length > 0 && <SearchHistory searchList={searchList} />}
            </div>}

            {weatherData && <WeatherComp weatherData={weatherData} />}
        </div>
    )
}

export default Home