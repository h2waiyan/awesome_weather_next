import React, { useEffect, useState } from 'react'

const SearchHistory = (searchHistory) => {

    const searchList = searchHistory.searchList;

    const [hottestDestination, setHottestDestination] = useState(null);
    const [coldestDestination, setColdestDestination] = useState(null);

    useEffect(() => {
        if (searchList.length > 0) {
            console.log('searchList:', searchList);
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
            console.log('hottest:', hottest);
            console.log('coldest:', coldest);
            setHottestDestination(hottest);
            setColdestDestination(coldest);
        }
    }, [searchList])

    return (
        <div className='flex flex-col items-center'>
            {
                searchList.length > 0 && <div className='flex flex-col justify-center items-center'>
                    <div className='text-white font-bold'>Search History</div>
                    <table className='border-collapse'>
                        <thead>
                            <tr>
                                <th className='text-white'>City</th>
                                <th className='text-white'>Temperature</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchList.map((item, index) => (
                                <tr key={index}>
                                    <td className='text-white'>{item.city}</td>
                                    <td className='text-white'>{item.temp}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div>
                        {
                            hottestDestination && coldestDestination && <div>
                                <div>
                                    <div className='text-white font-bold'>🏖️ Hottest destination: {hottestDestination.city} {hottestDestination.temp} °C</div>
                                </div>
                                <div>
                                    <div className='text-white font-bold'>⛄️ Coldest destination: {coldestDestination.city} {coldestDestination.temp} °C</div>
                                </div>
                            </div>
                        }
                    </div>


                </div>
            }
        </div>
    )
}

export default SearchHistory