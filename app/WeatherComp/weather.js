import React from 'react'

const WeatherComp = (weatherData) => {
    const weather = weatherData.weatherData;
    console.log(weather['main']['temp']);
    return (
        <div className='flex flex-col justify-center items-center content-center'>

            <h1 className='text-white font-bold text-xl drop-shadow-lg'>{weather['name']}</h1>

            <img src={`http://openweathermap.org/img/w/${weather['weather'][0]['icon']}.png`} alt="wthr img" />

            <h1 className='text-white font-bold text-3xl drop-shadow-lg'>{`${weather['weather'][0]['description'].charAt(0).toUpperCase()}${weather['weather'][0]['description'].slice(1)}`}</h1>

            <h1 className='text-white font-bold text-6xl drop-shadow-lg'>{weather['main']['temp']} °C</h1>
            <h1 className='text-white font-bold text-xl drop-shadow-lg'>Humidity : {weather['main']['humidity']} </h1>
        </div >
    )
}

export default WeatherComp