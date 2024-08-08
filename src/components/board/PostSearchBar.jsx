import React, { useState } from 'react';
import { TextField, Button, Box, Select, MenuItem } from '@mui/material';
import { axiosInstance } from '../../utils/axios';

const PostSearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('title');

    const handleSearch = async () => {
        try {
            const params = { page: 0, size: 6 };
            let response;

            if (searchTerm) {
                if (searchType === 'title') {
                    params.title = searchTerm;
                    response = await axiosInstance.get('/posts/search', { params });
                } else {
                    params.userName = searchTerm;
                    response = await axiosInstance.get('/posts/searchByUserName', { params });
                }
            } else {
                // 검색어가 없을 때 모든 게시물 가져오기
                response = await axiosInstance.get('/posts', { params });
            }

            if (response.data.content.length === 0) {
                alert("No results found");
            } else {
                onSearch(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const { codeName, message } = error.response.data;
                if (codeName === "USER_NOT_FOUND") {
                    alert(`Error: ${message}`);
                } else {
                    console.error("Error fetching search results:", error);
                    alert("An error occurred while fetching search results.");
                }
            } else {
                console.error("Error fetching search results:", error);
                alert("An unexpected error occurred.");
            }
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                sx={{ mr: 1 }}
            >
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="userName">User Name</MenuItem>
            </Select>
            <TextField
                variant="outlined"
                label={`Search by ${searchType === 'title' ? 'Title' : 'User Name'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mr: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>Search</Button>
        </Box>
    );
};

export default PostSearchBar;
