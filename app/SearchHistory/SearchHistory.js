import React, { useEffect, useState } from 'react'
import './SearchHistory.css';
const SearchHistory = (searchHistory) => {

    const searchList = searchHistory.searchList;

    return (
        <div className='flex flex-col items-center h-20 w-full overflow-auto scrollbar-hide'>
            {
                searchList.length > 0 && <div>

                    <table className='border-collapse'>

                        <tbody>
                            {searchList.map((item, index) => (
                                <tr key={index}>
                                    <td className='text-white w-64'>{item.city}</td>
                                    <td className='text-white'>{item.temp} °C</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    )
}

export default SearchHistory