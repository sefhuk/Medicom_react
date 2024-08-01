import React , { useEffect, useState }from "react";
import MainContainer from "../../components/global/MainContainer";
import { Paper, Typography, Box, Tab, Tabs } from "@mui/material";
import { axiosInstance } from "../../utils/axios";
import { TabContext, TabList, TabPanel } from "@mui/lab";

const AdminChatList = () => {

  const [chatList, setChatList] = useState(null);
  const [tabValue, setTabValue] = useState('1');

  const handleChange = (e, value) => {
    setTabValue(value);
  };

  useEffect(()=>{
    const GetChatList = async () =>{
      try{
        const response = await axiosInstance.get('/admin/chatrooms');
        setChatList(response.data);
      } catch (exception){
        console.log(exception);
      }
    };
    GetChatList();
  }, []);

  const ChatRoomListComponent = (list) => {
    return list.map(room => (
      <Box fullWidth sx={{height: '45px', padding: '10px', margin: '15px 0 auto', border: '1px solid #BCBDBC', }}>
        <Typography variant='body1'>{room.user1.name}님의
          {room.type.type ==='의사 상담' ? ' 상담' : ' 문의'}
        </Typography>
        <Typography variant='body1'>{room.status.status === '수락 대기' ? '매칭 대기 중' :
          room.status.status === '진행' ? '대화 중' : '대화 종료'}</Typography>
      </Box>
    ));
  }
  const ChatRoomListAll = () => {
    return ChatRoomListComponent(chatList);
  }

  const ChatRoomFilter = (props) => {
    const list = chatList.filter(room =>
      room.type.type === props.type
    );
    return ChatRoomListComponent(list);
  }

  return(
    <MainContainer>
      <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>
      <Typography variant='h5' sx={{display: 'inline', color: '#6E6E6E'}}>
        채팅 리스트
      </Typography>
      <TabContext value={tabValue}>
        <TabList onChange={handleChange} sx={{margin: '20px 0 auto'}}>
            <Tab label='전체' value='1'/>
            <Tab label='상담' value='2'/>
            <Tab label='문의' value='3'/>
          </TabList>
        <Box sx={{border: '1px solid grey' }}></Box>
        <TabPanel value='1' sx={{padding: '0'}}>
          {chatList ? <ChatRoomListAll /> : <Typography variant='body1'>Loading..</Typography>}
        </TabPanel>
        <TabPanel value='2'>
        {chatList ? <ChatRoomFilter type='의사 상담'/> : <Typography variant='body1'>Loading..</Typography>}
        </TabPanel>    
        <TabPanel value='3'>
        {chatList ? <ChatRoomFilter type='서비스센터 상담'/> : <Typography variant='body1'>Loading..</Typography>}
        </TabPanel>      
      </TabContext>
      </Paper>
    </MainContainer>
  );
}


export default AdminChatList;