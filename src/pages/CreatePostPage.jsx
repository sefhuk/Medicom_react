import React from 'react';
import axios from 'axios';
import PostForm from '../components/board/PostForm';
import { useParams } from 'react-router-dom';
import MainContainer from '../components/global/MainContainer';

function CreatePostPage() {
  const { boardId } = useParams();

  const handleCreatePost = (postData) => {
    axios.post(`http://localhost:8080/posts`, { ...postData, boardId })
      .then(response => console.log('Post created:', response.data))
      .catch(error => console.error('Error creating post:', error));
  };

  return(
  <MainContainer>
  <PostForm onSubmit={handleCreatePost} />;
  </MainContainer>
  );
}

export default CreatePostPage;
