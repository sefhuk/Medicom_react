import React, { useState, useEffect } from "react";
import MainContainer from "../../components/global/MainContainer";
import { Paper, Typography, Box, Button, IconButton } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { axiosInstance } from "../../utils/axios";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router";


function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function StringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

const UserList = () =>{

  const [userList, setUserList] = useState(null);
  const [pageSelect, setPageSelect] = useState(0);

  const navigate = useNavigate();

  useEffect(()=>{
    const GetUserList = async () =>{
      try{
        const response = await axiosInstance.get('/admin/users');
        setUserList(response.data);
      } catch (exception){
        console.log(exception);
      }
    };
    GetUserList();
  }, []);

  const GetUserRoleString = (role) => {
    if(role === 'USER'){
      return '일반 회원';
    } else if(role === 'DOCTOR'){
      return '의사';
    } else return '관리자';
  }

  const UserListComponent = (list) =>{
    return list.map(user => (
      <Box fullWidth sx={{height: '45px', padding: '10px', margin: '15px 0 auto', border: '1px solid #BCBDBC', }}>
        <Avatar sx={{float: 'left'}}></Avatar>
        <Typography variant="body1" sx={{display: 'inline-block', margin: '10px 0px 0px 15px'}}>{user.name}</Typography>
        <IconButton sx={{float: 'right', padding: '4px'}} onClick={(e) => OnClickUserDetail(e, user.id)}>
          <ArrowRightIcon fontSize="large"></ArrowRightIcon>
        </IconButton>
        <Typography variant="body1" sx={{display: 'inline-block', margin: '10px 0px 0px 15px', float: 'right'}}>{GetUserRoleString(user.role)}</Typography>
      </Box>      
    ));
  }

  const AllUserList = () => {
    return UserListComponent(userList);
  }

  const NormalUserList = () => {
    let list = userList.filter(user => user.role === 'USER');
    return UserListComponent(list);
  }

  const DoctorUserList = () => {
    let list = userList.filter(user => user.role === 'DOCTOR');
    return UserListComponent(list);
  }

  const AdminUserList = () => {
    let list = userList.filter(user => user.role === 'ADMIN');
    return UserListComponent(list);
  }

  const OnClickUserDetail = (e, id) => {
    e.preventDefault();
    let user = userList.filter(user => user.id === id);
    navigate('/admin-page/user-list/user-detail', {state: {userDetail: user}});
  }

  return(
    <MainContainer>
      <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>
        <Typography variant='h5' sx={{display: 'inline', color: '#6E6E6E'}}>
          관리자 페이지
        </Typography>
        <Box sx={{margin: '40px 0px 15px 0px', border: '1px solid grey' }}></Box>
        
        {(pageSelect === 0 ) ? <Button startIcon={<CheckIcon/>} sx={{color: '#858584', fontWeight: 'bolder'}}>전체</Button> :
          <Button onClick={(e)=>{setPageSelect(0)}} sx={{color: '#858584'}}>전체</Button>}
        {(pageSelect === 1 ) ? <Button startIcon={<CheckIcon/>} sx={{color: '#858584', fontWeight: 'bolder'}}>일반 회원</Button> :
          <Button onClick={(e)=>{setPageSelect(1)}} sx={{color: '#858584'}}>일반 회원</Button>}
        {(pageSelect === 2 ) ? <Button startIcon={<CheckIcon/>} sx={{color: '#858584', fontWeight: 'bolder'}}>의사</Button> :
          <Button onClick={(e)=>{setPageSelect(2)}} sx={{color: '#858584'}}>의사</Button>}
         {(pageSelect === 3 ) ? <Button startIcon={<CheckIcon/>} sx={{color: '#858584', fontWeight: 'bolder'}}>관리자</Button> :
          <Button onClick={(e)=>{setPageSelect(3)}} sx={{color: '#858584'}}>관리자</Button>}

        {(pageSelect === 0 && userList) ? <AllUserList /> : (pageSelect === 1 && userList) ? <NormalUserList /> : 
          (pageSelect === 2 && userList) ? <DoctorUserList /> : (pageSelect === 3 && userList) ? <AdminUserList /> : 
          <Typography variant='body1'>Loading..</Typography>}
      </Paper>
    </MainContainer>
  );
}

export default UserList;