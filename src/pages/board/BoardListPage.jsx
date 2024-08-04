import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MainContainer from '../../components/global/MainContainer';
import BoardList from '../../components/board/BoardList';
import Pagination from '../../components/board/Pagination';
import SearchBar from '../../components/board/SearchBar';
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
    axios.get('http://localhost:8080/boards', {
      params: {
        name: query,
        page: page,
        size: 6
      }
    })
      .then(response => {
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => setError('게시판 목록을 가져오는 데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchBoards(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchBoards]);

  const handleSearch = (data) => {
    if (data.content.length === 0) {
      alert("검색 결과가 없습니다.");
    } else {
      setBoards(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(0); // 페이지 리셋
    }
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
        <SearchBar onSearch={handleSearch} searchType="boards" />
      </div>
      <BoardList boards={boards} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </MainContainer>
  );
}

export default BoardListPage;
