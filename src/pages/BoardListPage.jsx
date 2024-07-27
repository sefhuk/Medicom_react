import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainContainer from '../components/global/MainContainer';
import BoardList from '../components/board/BoardList';

function BoardListPage() {
  const [boards, setBoards] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/boards')
      .then(response => setBoards(response.data))
      .catch(error => console.error('Error fetching boards:', error));
  }, []);

  return (
    <MainContainer>
      <BoardList boards={boards} />
    </MainContainer>
  );
}

export default BoardListPage;
