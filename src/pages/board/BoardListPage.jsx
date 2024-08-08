import React, { useState, useEffect, useCallback } from 'react';
import { axiosInstance } from '../../utils/axios';
import MainContainer from '../../components/global/MainContainer';
import BoardList from '../../components/board/BoardList';
import Pagination from '../../components/board/Pagination';
import BoardSearchBar from '../../components/board/BoardSearchBar';
import { CircularProgress, Alert } from '@mui/material';

function BoardListPage() {
    const [boards, setBoards] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBoards = useCallback((page, query) => {
        setLoading(true);
        axiosInstance.get('/boards/search', {
            params: {
                name: query || '', // 검색어가 없으면 빈 문자열로 전체 게시물 검색
                page: page,
                size: 6
            }
        })
        .then(response => {
            setBoards(response.data.content);
            setTotalPages(response.data.totalPages);
        })
        .catch(() => setError('게시판 목록을 가져오는 데 실패했습니다.'))
        .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        fetchBoards(currentPage, searchQuery);
    }, [currentPage, searchQuery, fetchBoards]);

    const handleSearch = (data) => {
        setBoards(data.content);
        setTotalPages(data.totalPages);
        setCurrentPage(0); // 페이지 리셋
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <MainContainer>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                <BoardSearchBar onSearch={handleSearch} />
            </div>
            <BoardList boards={boards} />
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </MainContainer>
    );
}

export default BoardListPage;
