import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainContainer from '../components/global/MainContainer';
import BoardList from '../components/board/BoardList';
import Pagination from '../components/board/Pagination';

function BoardListPage() {
  const [boards, setBoards] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    axios.get(`http://localhost:8080/boards?page=${currentPage}&size=6`)
      .then(response => {
        setBoards(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch(error => console.error('Error fetching boards:', error));
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <MainContainer>
      <BoardList boards={boards} />
      <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
    </MainContainer>
  );
}

export default BoardListPage;
