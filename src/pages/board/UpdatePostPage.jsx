// UpdatePostPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import UpdatePostForm from '../../components/board/UpdatePostForm';
import MainContainer from '../../components/global/MainContainer';

function UpdatePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('포스트 가져오기 오류:', error));
  }, [id]);

  const handleUpdatePost = async (updatedPost) => {
    try {
      await axios.put(`http://localhost:8080/posts/${id}`, updatedPost);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('포스트 업데이트 오류:', error);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <MainContainer>
      <h1>Update Post</h1>
      <UpdatePostForm post={post} onUpdate={handleUpdatePost} />
    </MainContainer>
  );
}

export default UpdatePostPage;