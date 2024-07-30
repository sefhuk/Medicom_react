import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BoardForm from '../components/board/BoardForm';
import MainContainer from '../components/global/MainContainer';

function CreateBoardPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await axios.post('http://localhost:8080/boards', data);
      navigate('/boards');
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  return (
    <MainContainer>
      <BoardForm onSubmit={handleSubmit} />
    </MainContainer>
  );
}

export default CreateBoardPage;
