import { Button } from '@mui/material';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';

function ChatInput({ sendMessage, status }) {
  const [input, setInput] = useState(status === '진행' ? '' : '입력할 수 없습니다');

  const button = useRef(null);

  const handleInput = e => {
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
    if (/^\s*$/.test(input)) {
      alert('공백 메시지는 전송이 불가능합니다');
      setInput('');
      return;
    }

    sendMessage(input);
    setInput('');
  };

  return (
    <Container>
      <Input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleInput}
        readOnly={status !== '진행'}
      />
      <Button variant='contained' ref={button} onClick={handleClick}>
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
  max-width: 700px;
  width: 100%;
  height: 8dvh;
`;

const Input = styled.textarea`
  outline: 1px solid;
  width: 80%;
  border-radius: 10px;
  background-color: #e8e0e0;
  padding: 0.6rem 15px;
  font-size: 1.2rem;
  line-height: 5dvh;
  resize: none;
  white-space: pre-line;
`;

export default ChatInput;
