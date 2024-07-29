import React, { useEffect, useState } from 'react';
import MainContainer from '../../components/global/MainContainer';
import { axiosInstance } from '../../utils/axios';
import styled from 'styled-components';
import ChatRoomDetail from '../../components/chatRoom/ChatRoomDetail';
import { useRecoilState } from 'recoil';
import { chatRoomState, userauthState } from '../../utils/atom';

function ChatListPage() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [auth] = useRecoilState(userauthState);
  const [chatRoom, setChatRoom] = useRecoilState(chatRoomState);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get(`/chatrooms`, {
        params: {
          userId: auth.userId || 0
        }
      });
      const chatRooms = {};
      response.data.map(e => (chatRooms[`ch_${e.id}`] = e.status.status));
      setChatRoom({ rooms: chatRooms });
      setData(response.data);
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <MainContainer>
      <Head>
        <span>상담 요청 목록</span>
      </Head>
      {error && <Notice>{error}</Notice>}
      {isLoading && <Notice>로딩 중 입니다..</Notice>}
      {data && data.map(e => <ChatRoomDetail key={e.id} data={e} />)}
    </MainContainer>
  );
}

const Head = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 700px;
  width: 90%;
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
