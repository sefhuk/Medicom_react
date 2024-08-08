import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { axiosInstance } from '../../utils/axios';

const BoardSearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
            // 검색어가 비어 있으면 전체 게시물 검색
            const params = { page: 0, size: 6, name: searchTerm || '' };
            const response = await axiosInstance.get('/boards/search', { params });

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
                label="Search Boards"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mr: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
        </Box>
    );
};

export default BoardSearchBar;
