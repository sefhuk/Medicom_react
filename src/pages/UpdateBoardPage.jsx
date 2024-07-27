import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import BoardForm from '../components/board/BoardForm';
import MainContainer from '../components/global/MainContainer';

function UpdateBoardPage() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/boards/${boardId}`)
      .then(response => setBoard(response.data))
      .catch(error => console.error('Error fetching board:', error));
  }, [boardId]);

  const handleUpdateBoard = (boardData) => {
    axios.put(`http://localhost:8080/boards/${boardId}`, boardData)
      .then(() => navigate('/boards'))
      .catch(error => console.error('Error updating board:', error));
  };

  if (!board) return <p>Loading...</p>;

  return (
    <MainContainer>
      <BoardForm initialValues={board} onSubmit={handleUpdateBoard} />
    </MainContainer>
  );
}

export default UpdateBoardPage;
