import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BoardForm from '../components/board/BoardForm';
import MainContainer from '../components/global/MainContainer';

function UpdateBoardPage() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/boards/${id}`)
      .then(response => setBoard(response.data))
      .catch(error => console.error('Error fetching board:', error));
  }, [id]);

  const handleSubmit = async (data) => {
    try {
      await axios.put(`http://localhost:8080/boards/${id}`, data);
      navigate(`/boards/${id}`);
    } catch (error) {
      console.error('Error updating board:', error);
    }
  };

  if (!board) return <p>Loading...</p>;

  return (
    <MainContainer>
      <BoardForm onSubmit={handleSubmit} initialValues={board} />
    </MainContainer>
  );
}

export default UpdateBoardPage;
