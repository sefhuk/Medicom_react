import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostForm from '../components/board/PostForm';
import MainContainer from '../components/global/MainContainer';

function CreatePostPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      await axios.post(`http://localhost:8080/posts`, { ...data, boardId });
      navigate(`/boards/${boardId}`);
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  return (
    <MainContainer>
      <PostForm onSubmit={handleSubmit} />
    </MainContainer>
  );
}

export default CreatePostPage;
