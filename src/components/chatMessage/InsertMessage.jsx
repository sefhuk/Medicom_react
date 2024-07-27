import { Button } from '@mui/material';
import React from 'react';
import ProfileImage from './ProfileImage';
import { axiosInstance } from '../../utils/axios';
import { useRecoilState } from 'recoil';
import { authState } from '../../utils/atom';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

function InsertMessage() {
  const [auth] = useRecoilState(authState);

  const navigate = useNavigate();

  const createChatRoom = async (chatRoomType, navigate) => {
    try {
      await axiosInstance.post(`/chatrooms`, {
        userId: Number(auth.userId) || 0,
        chatRoomType: chatRoomType
      });
      navigate(`/chatlist`);
    } catch (err) {
      alert(err.response.data.message);
      navigate('/');
    }
  };

  const handleButtonClick = e => {
    createChatRoom(e.target.getAttribute('type'), navigate);
  };

  return (
    <Container>
      <ProfileImage insert={true} self={true} />
      <ButtonWrapper className='flex flex-col border-black border-2 mt-2 p-2 w-[60%] rounded-xl order-2'>
        <p className='mb-2'>채팅을 선택해주세요!</p>
        <Button
          type='DOCTOR'
          variant='contained'
          style={{ marginBottom: '4px' }}
          onClick={handleButtonClick}
        >
          증상 간편 상담 (의사)
        </Button>
        <Button
          type='SERVICE'
          variant='contained'
          style={{ marginBottom: '4px' }}
          onClick={handleButtonClick}
        >
          고객 센터
        </Button>
        <Button
          type='AI'
          variant='contained'
          style={{ marginBottom: '4px' }}
          onClick={handleButtonClick}
        >
          AI 상담
        </Button>
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  padding: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 2px solid black;
  margin-top: 2px;
  padding: 2px;
  width: 60%;
  border-radius: 10px;
  order: 2;
`;

export default InsertMessage;
