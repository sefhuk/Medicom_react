import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatePostForm from '../../components/board/CreatePostForm';
import MainContainer from '../../components/global/MainContainer';

function CreatePostPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await axios.post(`http://localhost:8080/posts`, { ...data, boardId }); // boardId와 함께 포스트 생성 요청
      navigate(`/boards/${boardId}`);
    } catch (error) {
      console.error('포스트 생성 오류:', error);
    }
  };

  return (
    <MainContainer>
      <CreatePostForm onSubmit={handleSubmit} />
    </MainContainer>
  );
}

export default CreatePostPage;