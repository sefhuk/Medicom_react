import React from 'react';
import ProfileImage from './ProfileImage';
import styled from 'styled-components';
import { fromatDate, isToday } from '../../utils/time';

function Message({ data, repeat, self }) {
  const messageTime = () => {
    let date = fromatDate(new Date(data.createdAt));

    // 오늘이면 시간만 추출
    if (isToday(new Date(data.createdAt))) {
      date = date.split(' ')[1];
    }

    return date;
  };

  return (
    <Container self={self}>
      {self || (
        <TopContainer repeat={repeat} self={self}>
          {repeat || <ProfileImage url={data.user.image} insert={false} self={self} />}
          {repeat || <Author self={self}>{data.user.userName}</Author>}
        </TopContainer>
      )}
      <BottomContainer self={self}>
        <Content self={self}>
          {data.content.split('\\n').map(e => (
            <span>
              {e}
              <br />
            </span>
          ))}
        </Content>
        <Time self={self}>{messageTime()}</Time>
      </BottomContainer>
    </Container>
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
  margin-left: ${({ repeat }) => (repeat ? '3.6rem' : '0px')};
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
  margin-top: 0.6rem;
  margin-right: ${({ self }) => (self ? '10px' : '0px')};
  margin-left: ${({ self }) => (self ? '0px' : '10px')};
  order: ${({ self }) => (self ? 1 : 2)};
`;

const Content = styled.div`
  background-color: skyblue;
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
  order: ${({ self }) => (self ? 2 : 1)};
  white-space: pre-line;
  max-width: 70%;
  height: auto;
  overflow: hidden;
`;

const Time = styled.p`
  order: ${({ self }) => (self ? 1 : 2)};
  margin-right: ${({ self }) => (self ? '10px' : '0px')};
  margin-left: ${({ self }) => (self ? '0px' : '10px')};
`;

export default Message;
