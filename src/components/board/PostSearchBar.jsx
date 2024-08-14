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
                    response = await axiosInstance.get('/posts/searchByTitle', { params });
                } else if (searchType === 'userName') {
                    params.userName = searchTerm;
                    response = await axiosInstance.get('/posts/searchByUserName', { params });
                }
            } else {
                // 검색어가 없을 경우 전체 포스트를 가져옴
                response = await axiosInstance.get('/posts', { params });
            }

            if (response.data.content.length === 0) {
                alert("검색 결과가 없습니다.");
            } else {
                onSearch(response.data);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                const { codeName } = error.response.data;
                if (codeName === "USER_NOT_FOUND") {
                    alert("존재하지 않는 사용자입니다.");
                } else {
                    console.error("Error fetching search results:", error);
                    alert("검색 중 오류가 발생했습니다.");
                }
            } else {
                console.error("Error fetching search results:", error);
                alert("예기치 못한 오류가 발생했습니다.");
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
                <MenuItem value="title">제목</MenuItem>
                <MenuItem value="userName">사용자 이름</MenuItem>
            </Select>
            <TextField
                variant="outlined"
                label={`${
                    searchType === 'title' ? '제목으로 검색' : '사용자 이름으로 검색'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mr: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleSearch}>
                검색
            </Button>
        </Box>
    );
};

export default PostSearchBar;
