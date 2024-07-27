import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import PostForm from '../components/board/PostForm';
import MainContainer from '../components/global/MainContainer';

function UpdatePostPage() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${postId}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('Error fetching post:', error));
  }, [postId]);

  const handleUpdatePost = (postData) => {
    axios.put(`http://localhost:8080/posts/${postId}`, postData)
      .then(() => navigate(`/posts/${postId}`))
      .catch(error => console.error('Error updating post:', error));
  };

  if (!post) return <p>Loading...</p>;

  return (
    <MainContainer>
      <PostForm initialValues={post} onSubmit={handleUpdatePost} />
    </MainContainer>
  );
}

export default UpdatePostPage;
