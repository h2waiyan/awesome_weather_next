"use client";

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './home.css';
import WeatherComp from '../WeatherComp/weather';

const Home = () => {

    const isFirstRender = useRef(true);
    const [hottestDestination, setHottestDestination] = useState(null);
    const [coldestDestination, setColdestDestination] = useState(null);
    const [city, setCity] = useState('');
    const [location, setLocation] = useState({ lat: null, lon: null });
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    useEffect(() => {
        if (searchList.length > 0) {
            let hottest = searchList[0];
            let coldest = searchList[0];
            searchList.forEach((item) => {
                if (item.temp > hottest.temp) {
                    hottest = item;
                }
                if (item.temp < coldest.temp) {
                    coldest = item;
                }
            })
            setHottestDestination(hottest);
            setColdestDestination(coldest);
        }
    }, [searchList])

    return (
        <div className={weatherData ? `bg ${getBackgroundClass(weatherData.main.temp)}` : 'bg'} >
            <div className='flex justify-center p-5'>
                <input
                    className='me-3 input text-white w-1/2 bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500'
                    type="text"
                    placeholder='Enter your city'
                    value={city}
                    onChange={handleInputChange}
                />
                <button
                    onClick={searchCity}
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                    Search
                </button>
            </div>

            {
                searchList.length > 0 && <div className='flex justify-center'>
                    <div className='text-white font-bold'>Search History</div>
                    <div className='text-white font-bold'>City</div>
                    <div className='text-white font-bold'>Temperature</div>

                    <li>
                        {searchList.map((item) => (
                            <div className='flex justify-center'>
                                <div className='text-white font-bold'>{item.city}</div>
                                <div className='text-white font-bold'>{item.temp}</div>
                            </div>
                        ))}


                    </li>
                    <div className='text-white font-bold'>🏖️ Hottest destination: {hottestDestination}</div>
                    <div className='text-white font-bold'>⛄️ Coldest destination: {coldestDestination}</div>
                </div>
            }

            <div className='flex items-center'>
                {loading && <div>Loading...</div>}
            </div>
            <div className='flex items-center'>
                {error && <div>{error}</div>}
            </div>
            {weatherData && <WeatherComp weatherData={weatherData} />}
        </div>
    )
}

export default Home