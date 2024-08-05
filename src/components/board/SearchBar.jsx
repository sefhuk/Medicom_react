import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
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
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextField
                variant="outlined"
                label={`Search ${searchType}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mr: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
        </Box>
    );
};

export default SearchBar;
