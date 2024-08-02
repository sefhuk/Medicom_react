import React, { useState } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearch, searchType }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
            const params = { page: 0, size: 6 };
            params[searchType === 'posts' ? 'title' : 'name'] = searchTerm;

            const response = await axios.get(`http://localhost:8080/${searchType}/search`, { params });

            if (response.data.content.length === 0) {
                alert("No results found");
            } else {
                onSearch(response.data);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search ${searchType}`}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
};

export default SearchBar;