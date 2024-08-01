import React , { useEffect, useState }from "react";
import MainContainer from "../../components/global/MainContainer";
import { Paper, Typography, Box } from "@mui/material";
import { axiosInstance } from "../../utils/axios";


const AdminChatList = () => {

  const [chatList, setChatList] = useState(null);


  useEffect(()=>{
    const GetUserList = async () =>{
      try{
        const response = await axiosInstance.get('/admin/chatrooms');
        setChatList(response.data);
      } catch (exception){
        console.log(exception);
      }
    };
    GetUserList();
  }, []);

  const ChatListComponent = (list) => {
    return list.map(room => (
      <Box fullWidth sx={{height: '45px', padding: '10px', margin: '15px 0 auto', border: '1px solid #BCBDBC', }}>
        <Typography variant='body1'>{room.user1.name}님의 
          {room.type.type ==='의사 상담' ? '상담' : '문의'}
        </Typography>
        <Typography variant='body1'>{room.status.status === '수락 대기' ? '매칭 대기 중' :
          room.status.status === '진행' ? '대화 중' : '대화 종료'}</Typography>
      </Box>
    ));
  }

  return(
    <MainContainer>
      <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>
      <Typography variant='h5' sx={{display: 'inline', color: '#6E6E6E'}}>
        채팅 리스트
      </Typography>
      <Box sx={{margin: '40px 0 auto', border: '1px solid grey' }}></Box>
      </Paper>
    </MainContainer>
  );
}


export default AdminChatList;