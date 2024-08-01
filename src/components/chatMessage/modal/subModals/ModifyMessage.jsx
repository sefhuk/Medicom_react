import { Box, Button, Modal, TextField } from '@mui/material';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../../../utils/atom';
import { axiosInstance } from '../../../../utils/axios';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3
};

function ModifyMessage({ msgId, msg }) {
  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

  const [message, setMessage] = useState(msg);

  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleClick = () => {
    setOpen(true);
  };

  const modify = async e => {
    try {
      const response = await axiosInstance.patch(`/chatmessages/${msgId}`, {
        userId: Number(auth.userId),
        content: message
      });

      setChatRoom(e => ({
        ...e,
        messages: e.messages.map(m => {
          if (m.id === Number(msgId)) {
            return { ...m, content: response.data.content };
          }

          return m;
        })
      }));
    } catch (err) {
      alert(err);
      console.log(err);
      setOpen(false);
    } finally {
      setOpen(false);
    }
  };

  const handleModifyClick = () => {
    if (message === msg) {
      alert('변경사항이 없습니다');
      return;
    }

    if (!message) {
      alert('공백 메시지는 불가능합니다');
      return;
    }

    const isConfirmed = window.confirm('수정 하시겠습니까?');
    if (!isConfirmed) {
      return;
    }

    modify();
  };

  return (
    <>
      <Button onClick={handleClick}>메시지 수정</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='child-modal-title'
        aria-describedby='child-modal-description'
      >
        <Box sx={{ ...style, width: '70%' }}>
          <div>
            <TextField
              required
              id='outlined-required'
              label='Required'
              defaultValue={msg}
              onChange={e => setMessage(e.target.value)}
            />
          </div>
          <Button variant='contained' sx={{ marginTop: '15px' }} onClick={handleModifyClick}>
            수정하기
          </Button>
        </Box>
      </Modal>
    </>
  );
}

export default ModifyMessage;
