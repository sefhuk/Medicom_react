import React from 'react';
import MainContainer from '../../components/global/MainContainer';
import { axiosInstance } from '../../utils/axios';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import ChatRoomDetail from '../../components/chatRoom/ChatRoomDetail';
import { useRecoilState } from 'recoil';
import { authState, chatRoomState } from '../../utils/atom';

const fetchData = async (id, setChatRoom) => {
  try {
    const response = await axiosInstance.get(`/chatrooms`, {
      params: {
        userId: id
      }
    });
    const chatRooms = {};
    response.data.map(e => (chatRooms[`ch_${e.id}`] = e.status.status));
    setChatRoom({ rooms: chatRooms });
    return response.data;
  } catch (err) {
    throw new Error(err.response.data.message);
  }
};

function ChatListPage() {
  const [auth] = useRecoilState(authState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

  const { data, error, isLoading } = useQuery({
    queryKey: [process.env.REACT_APP_QUERY_KEY],
    queryFn: () => fetchData(Number(auth.userId), setChatRoom),
    retry: 2
  });

  return (
    <MainContainer>
      <Head>
        <span>상담 요청 목록</span>
      </Head>
      {error && <Notice>{error.message}</Notice>}
      {isLoading && <Notice>로딩 중 입니다..</Notice>}
      {data && data.map(e => <ChatRoomDetail key={e.id} data={e} />)}
    </MainContainer>
  );
}

const Head = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 95%;
  height: 4dvh;
  border: 1px solid black;
  text-align: center;
  margin: 10px auto;
  padding: 10px;
`;

const Notice = styled.div`
  text-align: center;
  font-size: 3rem;
  height: 50dvh;
  line-height: 50dvh;
`;
export default ChatListPage;
