import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CreatePostForm from '../../components/board/CreatePostForm';
import MainContainer from '../../components/global/MainContainer';
import { Button, CircularProgress } from '@mui/material';

function CreatePostPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:8080/posts`, { ...data, boardId });
      navigate(`/boards/${boardId}`);
    } catch (error) {
      console.error('포스트 생성 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      {loading ? <CircularProgress /> : <CreatePostForm onSubmit={handleSubmit} />}
    <br />
    </MainContainer>
  );
}

export default CreatePostPage;
