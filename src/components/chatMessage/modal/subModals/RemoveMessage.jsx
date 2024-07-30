import { Button } from '@mui/material';
import React from 'react';
import { axiosInstance } from '../../../../utils/axios';
import { useNavigate } from 'react-router';
import { useRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../../../utils/atom';

function RemoveMessage({ msgId }) {
  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

  const remove = async () => {
    try {
      await axiosInstance.delete(`/chatmessages/${msgId}`);
      setChatRoom(m => ({ ...m, messages: m.messages.filter(e => e.id !== Number(msgId)) }));
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleClick = () => {
    const isConfirmed = window.confirm('선택한 메시지를 삭제하시겠습니까?');
    if (!isConfirmed) return;

    remove();
  };

  return (
    <>
      <Button onClick={handleClick}>메시지 삭제</Button>
    </>
  );
}

export default RemoveMessage;
