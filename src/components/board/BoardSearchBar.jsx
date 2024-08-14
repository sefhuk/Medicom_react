import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { axiosInstance } from '../../utils/axios';
import { Btntwo, TextF } from '../../components/global/CustomComponents';

const BoardSearchBar = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async () => {
        try {
            const params = { page: 0, size: 6, name: searchTerm || '' };
            const response = await axiosInstance.get('/boards/search', { params });

            if (response.data && response.data.content && response.data.content.length === 0) {
                alert("해당 게시판을 찾을 수 없습니다.");
            } else if (response.data && response.data.content) {
                onSearch(response.data);
            } else {
                alert("검색 결과를 불러올 수 없습니다.");
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
            alert("검색 중 오류가 발생했습니다.");
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <TextF
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                sx={{ marginRight: 2 }}
            />
            <Btntwo
                onClick={handleSearch}
            >
                Search
            </Btntwo>
        </Box>
    );
};

export default BoardSearchBar;
