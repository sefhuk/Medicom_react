import React, { useState } from 'react';
import { Box, Select, MenuItem } from '@mui/material';
import { axiosInstance } from '../../utils/axios';
import { Btn, TextF } from '../../components/global/CustomComponents';

const PostSearchBar = ({ onSearch, boardId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('title');

    const handleSearch = async () => {
        if (!boardId) {
            alert("게시판 ID가 설정되지 않았습니다.");
            return;
        }

        try {
            const params = {
                page: 0,
                size: 6,
                [searchType]: searchTerm,
            };

            const endpoint = `/posts/board/${boardId}/search`;

            const response = await axiosInstance.get(endpoint, { params });

            if (response.data.content.length === 0) {
                alert("검색 결과가 없습니다.");
            } else {
                onSearch(response.data);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            alert("검색 중 오류가 발생했습니다.");
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
            <TextF
                label={searchType === 'title' ? '제목으로 검색' : '사용자 이름으로 검색'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ mr: 1 }}
                fullWidth
            />
            <Btn onClick={handleSearch}>
                검색
            </Btn>
        </Box>
    );
};

export default PostSearchBar;
