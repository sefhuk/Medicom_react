import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import MainContainer from '../../components/global/MainContainer';
import BoardList from '../../components/board/BoardList';
import Pagination from '../../components/board/Pagination';
import SearchBar from '../../components/board/SearchBar';

function BoardListPage() {
  const [boards, setBoards] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBoards = useCallback((page, query) => {
    axios.get(`http://localhost:8080/boards`, {
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
      .catch(error => console.error('Error fetching boards:', error));
  }, []);

  useEffect(() => {
    fetchBoards(currentPage, searchQuery);
  }, [currentPage, searchQuery, fetchBoards]);

  const handleSearch = (data) => {
    if (data.content.length === 0) {
      alert("No results found");
    } else {
      setBoards(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(0); // Reset to first page on new search
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <MainContainer>
      <SearchBar onSearch={handleSearch} searchType="boards" />
      <BoardList boards={boards} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </MainContainer>
  );
}

export default BoardListPage;