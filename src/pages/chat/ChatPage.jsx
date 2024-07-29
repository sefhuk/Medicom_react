import React, { useEffect, useRef, useState } from 'react';
import { axiosInstance } from '../../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import MainContainer from '../../components/global/MainContainer';
import Message from '../../components/chatMessage/Message';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import ChatInput from '../../components/chatMessage/ChatInput';
import { useRecoilState } from 'recoil';
import { authState, chatRoomState } from '../../utils/atom';

const fetchData = async (id, setMessages, setError) => {
  try {
    const response = await axiosInstance.get(`/chatmessages`, {
      params: {
        chatRoomId: id
      }
    });
    setMessages(response.data);
  } catch (err) {
    setError(err.response.message);
    alert('잘못된 접근입니다');
  }
};

function ChatPage() {
  const params = useParams();

  const [auth] = useRecoilState(authState);
  const [chatRoom] = useRecoilState(chatRoomState);

  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  const navigate = useNavigate();

  const tmp = useRef(null);

  const sendMessage = input => {
    const body = JSON.stringify({
      userId: Number(auth.userId),
      chatRoomId: Number(params.chatRoomId),
      content: input.replace(/\n/g, '\\n')
    });
    stompClient.publish({ destination: `/app/chat/${Number(params.chatRoomId)}`, body });
  };

  useEffect(() => {
    try {
      fetchData(params.chatRoomId, setMessages, setError);
    } catch (err) {
      alert('잘못된 접근입니다');
    }

    const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`);

    const stomp = Stomp.over(socket);

    stomp.connect({}, () => {
      stomp.subscribe(`/queue/${Number(params.chatRoomId)}`, msg => {
        const data = JSON.parse(msg.body);
        data.content = data.content.replace(/\\n/g, '\n');
        setMessages(m => [...m, data]);
      });
    });

    stomp.activate();
    setStompClient(stomp);

    return () => stomp.deactivate();
  }, []);

  useEffect(() => {
    if (tmp != null) tmp.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <MainContainer isChat={true} sendMessage={sendMessage}>
      <button onClick={() => navigate('/chatlist')}>리스트로 이동</button>
      {error && <div>{error}</div>}
      {chatRoom.rooms[`ch_${params.chatRoomId}`] === '수락 대기' && (
        <div
          style={{
            height: '50dvh',
            fontWeight: 'bold',
            fontSize: '2.5rem',
            lineHeight: '50dvh',
            textAlign: 'center'
          }}
        >
          매칭을 기다리고 있습니다
        </div>
      )}
      {messages.length !== 0 &&
        messages.map((e, idx) => {
          return e.user.id === Number(auth.userId) ? (
            <Message
              key={e.id}
              self={true}
              data={e}
              repeat={e.user.id === (messages[idx - 1] ? messages[idx - 1].user.id : '0')}
            />
          ) : (
            <Message
              key={e.id}
              self={false}
              data={e}
              repeat={e.user.id === (messages[idx - 1] ? messages[idx - 1].user.id : '0')}
            />
          );
        })}
      <div ref={tmp} />
      <ChatInput sendMessage={sendMessage} status={chatRoom.rooms[`ch_${params.chatRoomId}`]} />
    </MainContainer>
  );
}

export default ChatPage;
