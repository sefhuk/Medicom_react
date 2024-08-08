import { Button } from '@mui/material';
import React from 'react';
import { axiosInstance } from '../../../../utils/axios';
import { useNavigate, useParams } from 'react-router';
import { useRecoilState } from 'recoil';
import { stompState, userauthState } from '../../../../utils/atom';

function ExitChatRoom() {
  const params = useParams();

  const [auth] = useRecoilState(userauthState);
  const [stomp] = useRecoilState(stompState);

  const navigate = useNavigate();

  const exit = async () => {
    try {
      await axiosInstance.delete(`/chatrooms/${params.chatRoomId}/users/${auth.userId}`);
      stomp.sendMessage(params.chatRoomId, null, false, true);
      navigate('/chatlist');
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleClick = () => {
    const isConfirmed = window.confirm('해당 채팅방에서 나가시겠습니까?');
    if (!isConfirmed) return;

    exit();
  };

  return (
    <>
      <Button onClick={handleClick}>채팅방 나가기</Button>
    </>
  );
}

export default ExitChatRoom;
