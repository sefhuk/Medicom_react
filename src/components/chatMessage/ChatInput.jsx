import { Button } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AdvancedModal from '../chatRoom/modal/AdvancedModal';
import { useRecoilValue } from 'recoil';
import { chatRoomState, stompState, userauthState } from '../../utils/atom';
import { useParams } from 'react-router';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  maxWidth: '50dvh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function ChatInput({ sendMessage, enable }) {
  const params = useParams();

  const stomp = useRecoilValue(stompState);
  const chatRoom = useRecoilValue(chatRoomState);
  const auth = useRecoilValue(userauthState);

  const [input, setInput] = useState(enable ? '' : '입력할 수 없습니다');

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    const room = chatRoom.rooms[`ch_${params.chatRoomId}`];

    if (auth.userId === room.user1.id || auth.userId === room.user2.id) {
      setOpen(true);
    }
  };

  const handleClose = () => setOpen(false);

  const button = useRef(null);

  const handleInput = e => {
    if (!enable) return;

    if (!e.nativeEvent.isComposing)
      if (e.key === 'Enter') {
        if (e.shiftKey) {
          return;
        }
        e.preventDefault();
        button.current.click();
      }
  };

  const handleClick = () => {
    if (!enable) return;

    if (/^\s*$/.test(input)) {
      alert('공백 메시지는 전송이 불가능합니다');
      setInput('');
      return;
    }

    stomp.sendMessage(null, input);
    setInput('');
  };

  useEffect(() => {
    setInput(enable ? '' : '입력할 수 없습니다');
  }, [enable]);

  return (
    <Container>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={style}>
          <h2 id='parent-modal-title'>추가 기능</h2>
          <AdvancedModal sendMessage={sendMessage} setOpens={setOpen} />
        </Box>
      </Modal>
      <Button
        variant='contained'
        sx={{
          width: '10%',
          backgroundColor: 'var(--paper-common)',
          fontSize: '2rem',
          color: 'black',
          '&:hover': {
            backgroundColor: 'var(--paper-deep)'
          }
        }}
        onClick={handleOpen}
      >
        +
      </Button>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleInput}
        readOnly={!enable}
      />
      <Button
        variant='contained'
        ref={button}
        onClick={handleClick}
        sx={{
          width: '10%',
          color: 'black',
          backgroundColor: 'var(--main-common)',
          '&:hover': {
            backgroundColor: 'var(--main-deep)'
          }
        }}
      >
        전송
      </Button>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-around;
  position: fixed;
  bottom: 8dvh;
  box-sizing: border-box;
  padding: 4px;
  max-width: 60dvh;
  width: 100%;
  height: 7dvh;
  padding: 5px;
  background-color: #cac9c9;
`;

const Input = styled.textarea`
  outline: 1px solid;
  width: 65%;
  border-radius: 10px;
  background-color: var(--paper-common);
  padding: 1.8dvh 15px 0;
  font-size: 1.2rem;
  resize: none;
  white-space: pre-line;
  @media (max-width: 500px) {
    font-size: 1rem;
    width: 55%;
  }
`;

export default ChatInput;
