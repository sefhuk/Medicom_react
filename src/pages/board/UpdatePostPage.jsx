import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import UpdatePostForm from '../../components/board/UpdatePostForm';
import MainContainer from '../../components/global/MainContainer';
import { CircularProgress, Typography } from '@mui/material';

function UpdatePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('포스트를 가져오는 데 실패했습니다.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdatePost = async (updatedPost) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/posts/${id}`, updatedPost);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('포스트 업데이트 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <CircularProgress />;
  if (!post) return <Typography variant="h6">포스트를 불러오는 중입니다...</Typography>;

  return (
    <MainContainer>
      <UpdatePostForm post={post} onUpdate={handleUpdatePost} />
    </MainContainer>
  );
}

export default UpdatePostPage;
