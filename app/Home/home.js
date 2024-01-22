"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './home.css';
import WeatherComp from '../WeatherComp/weather';
import SearchHistory from '../SearchHistory/SearchHistory';
import { AiOutlineDown } from "react-icons/ai";
import { AiOutlineUp } from "react-icons/ai";


const Home = () => {

    const [city, setCity] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [showHistory, setShowHistory] = useState(false);
    const [searchList, setSearchList] = useState([]);

    const [hottestDestination, setHottestDestination] = useState(null);
    const [coldestDestination, setColdestDestination] = useState(null);

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

    useEffect(() => {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&appid=32ad84d2a41f15df8af1a765bb38c530&units=metric`)
                        .then((res) => {
                            setWeatherData(res.data);
                            setError(null);
                        })
                        .catch((err) => {
                            setError(err.message);
                        }).finally(() => {
                            setLoading(false);
                        })
                },
                (error) => {
                    setError("Something went wrong.");
                    setTimeout(() => {
                        setError(null);
                    }, 2000);
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
                if (err.response.status == '404') {
                    setError("City Not Found");
                    setTimeout(() => {
                        setError(null);
                    }, 2000);
                } else {
                    setError("Something went wrong.");
                    setTimeout(() => {
                        setError(null);
                    }, 2000);
                }
            }).finally(() => {
                setLoading(false);
                setCity("")
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
            <div className='flex flex-col justify-center items-center pt-5'>
                <div className='w-full sm:w-1/2 md:w-1/2'>                    {
                    hottestDestination && coldestDestination && hottestDestination != coldestDestination &&
                    <div className='flex flex-col sm:flex-row md:flex-row items-center sm:justify-between md:justify-between mb-3'>
                        <div className='text-xs sm:text-base md:text-md lg:text-lg drop-shadow-md text-white font-bold'>🏖️ Hottest destination: {hottestDestination.city} {hottestDestination.temp} °C</div>

                        <div className='text-xs sm:text-base md:text-md lg:text-lg drop-shadow-md text-white font-bold'>⛄️ Coldest destination: {coldestDestination.city} {coldestDestination.temp} °C</div>

                    </div>
                }

                </div>

                <div className='flex justify-center mb-5 w-full'>
                    <input
                        className='w-1/2 me-3 input text-white bg-transparent border-b-2 border-white focus:outline-none focus:border-blue-500'
                        type="text"
                        placeholder='Enter your city'
                        value={city}
                        onChange={handleInputChange}
                    />

                    <div className='flex justify-center me-2'>
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                            {showHistory ? <AiOutlineUp /> : <AiOutlineDown />}
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

            {
                showHistory && <div className='flex justify-center'>
                    {searchList.length > 0 && <SearchHistory searchList={searchList} />}
                </div>
            }

            <div className='h-3/5 flex justify-center'>
                {weatherData && <WeatherComp weatherData={weatherData} />}
            </div>
        </div >
    )
}

export default Home