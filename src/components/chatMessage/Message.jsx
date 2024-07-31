import React, { useState } from 'react';
import ProfileImage from './ProfileImage';
import styled from 'styled-components';
import { fromatDate, isToday } from '../../utils/time';
import { Box, Button, Modal } from '@mui/material';
import { useRecoilState } from 'recoil';
import { userauthState } from '../../utils/atom';
import EditModal from './modal/EditModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};

function Message({ data, repeat, self }) {
  const [auth] = useRecoilState(userauthState);

  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    if (auth.userId !== Number(data.user.id)) return;
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const messageTime = () => {
    let date = fromatDate(new Date(data.createdAt));

    // 오늘이면 시간만 추출
    if (isToday(new Date(data.createdAt))) {
      date = date.split(' ')[1];
    }

    return date;
  };

  const requestHospital = async () => {
    alert('API 연결 전');
    // try {
    //   await axiosInstance.get('');
    // } catch (err) {
    //   alert(err);
    // }
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
      >
        <Box sx={{ ...style, width: '60%' }}>
          <h2 id='parent-modal-title'>메시지 옵션</h2>
          <EditModal msgId={data.id} msg={data.content} />
        </Box>
      </Modal>
      <Container self={self}>
        {self || (
          <TopContainer repeat={repeat} self={self}>
            {repeat || (
              <ProfileImage url={data.user.image} insert={false} self={self} size={'3rem'} />
            )}
            {repeat || <Author self={self}>{data.user.name}</Author>}
          </TopContainer>
        )}
        <BottomContainer self={self}>
          <Content self={self} onDoubleClick={handleOpen}>
            {data.content.startsWith('dpt: ') ? (
              <>
                <p>진료과 추천 정보가 제공되었습니다</p>
                <Button variant='contained' onClick={requestHospital}>
                  {' '}
                  {data.content.split(' ')[1]}
                </Button>
              </>
            ) : (
              data.content.split('\\n').map(e => (
                <span>
                  {e}
                  <br />
                </span>
              ))
            )}
          </Content>
          <Time self={self}>{messageTime()}</Time>
        </BottomContainer>
      </Container>
    </>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: 'center';
  margin-bottom: 5px;
`;

const TopContainer = styled.div`
  display: flex;
  justify-content: ${({ self }) => (self ? 'flex-end' : 'flex-start')};
  max-width: 100%;
  margin-left: ${({ repeat }) => (repeat ? '3.6rem' : '0.5rem')};
  margin-bottom: 10px;
`;

const BottomContainer = styled.div`
  display: flex;
  justify-content: ${({ self }) => (self ? 'flex-end' : 'flex-start')};
  align-items: flex-end;
  height: 100%;
  margin-right: ${({ self }) => (self ? '0px' : '3rem')};
  margin-left: ${({ self }) => (self ? '0px' : '3rem')};
`;

const Author = styled.p`
  /* margin-top: 0.6rem; */
  margin-right: ${({ self }) => (self ? '10px' : '0px')};
  margin-left: ${({ self }) => (self ? '0px' : '10px')};
  order: ${({ self }) => (self ? 1 : 2)};
`;

const Content = styled.div`
  background-color: ${({ self }) => (self ? '#3399ff' : '#99ddff')};
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
  margin-right: ${({ self }) => (self ? '10px' : '0px')};
  order: ${({ self }) => (self ? 2 : 1)};
  white-space: pre-line;
  max-width: 70%;
  height: auto;
  overflow: hidden;
`;

const Time = styled.p`
  order: ${({ self }) => (self ? 1 : 2)};
  margin-top: 0px;
  margin-bottom: 0px;
  margin-right: ${({ self }) => (self ? '10px' : '0px')};
  margin-left: ${({ self }) => (self ? '0px' : '10px')};
`;

export default Message;
