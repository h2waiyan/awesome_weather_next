import React from 'react'

const WeatherComp = (weatherData) => {
    const weather = weatherData.weatherData;
    console.log(weather['main']['temp']);
    return (
        <div className='flex flex-col justify-center items-center'>

            <h1 className='text-white font-bold text-2xl'>{weather['name']}</h1>

            <h1 className='text-white font-bold text-2xl'>{weather['weather'][0]['description']}</h1>

            <h1 className='text-white font-bold text-2xl'>{weather['main']['temp']} °C</h1>
        </div >
    )
}

export default WeatherComp