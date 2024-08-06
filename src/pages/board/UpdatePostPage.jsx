import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import UpdatePostForm from '../../components/board/UpdatePostForm';
import MainContainer from '../../components/global/MainContainer';
import { CircularProgress, Box, Typography } from '@mui/material';

function UpdatePostPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:8080/posts/${id}`)
      .then(response => setPost(response.data))
      .catch(error => console.error('Failed to fetch post.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdatePost = async (updatedPost) => {
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/posts/${id}`, updatedPost);
      navigate(`/posts/${id}`);
    } catch (error) {
      console.error('Failed to update post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <CircularProgress />
    </Box>
  );
  if (!post) return <Typography variant="h6">Loading post...</Typography>;

  return (
    <MainContainer>
      <UpdatePostForm post={post} onUpdate={handleUpdatePost} />
    </MainContainer>
  );
}

export default UpdatePostPage;
