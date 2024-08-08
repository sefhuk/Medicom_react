import React from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import BoardForm from '../../components/board/BoardForm';
import MainContainer from '../../components/global/MainContainer';
import { Button, CircularProgress } from '@mui/material';

function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `${token}`
  };
}

function CreateBoardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post('/boards', data, {
        headers: getAuthHeaders()
      });
      navigate('/boards');
    } catch (error) {
      console.error('게시판 생성 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      {loading ? <CircularProgress /> : <BoardForm onSubmit={handleSubmit} />}
    </MainContainer>
  );
}

export default CreateBoardPage;
