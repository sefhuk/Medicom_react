import React from 'react';
import axios from 'axios';
import BoardForm from '../components/board/BoardForm';
import MainContainer from '../components/global/MainContainer';

function CreateBoardPage() {
  const handleCreateBoard = (boardData) => {
    axios.post('http://localhost:8080/boards', boardData)
      .then(response => console.log('Board created:', response.data))
      .catch(error => console.error('Error creating board:', error));
  };

  return(
  <MainContainer>
  <BoardForm onSubmit={handleCreateBoard} />;
  </MainContainer>
  );
}

export default CreateBoardPage;
