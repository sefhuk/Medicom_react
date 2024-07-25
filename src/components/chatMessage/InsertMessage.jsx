import { Button } from '@mui/material';
import React from 'react';
import ProfileImage from './ProfileImage';
import { axiosInstance } from '../../utils/axios';
import { useRecoilState } from 'recoil';
import { authState } from '../../utils/atom';
import { useNavigate } from 'react-router-dom';

const createChatRoom = async (userId, chatRoomType, navigate) => {
  try {
    await axiosInstance.post(`/chatrooms`, {
      userId: userId,
      chatRoomType: chatRoomType
    });
    navigate(`/chatlist`);
  } catch (err) {
    alert(err.response.message);
  }
};

function InsertMessage() {
  const [auth] = useRecoilState(authState);

  const navigate = useNavigate();

  const handleButtonClick = e => {
    createChatRoom(auth.userId, e.target.getAttribute('type'), navigate);
  };

  return (
    <div className='flex container p-[20px]'>
      <ProfileImage insert={true} self={true} />
      <div className='flex flex-col border-black border-2 mt-2 p-2 w-[60%] rounded-xl order-2'>
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
      </div>
    </div>
  );
}

export default InsertMessage;
