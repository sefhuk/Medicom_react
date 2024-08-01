import React, { useState, useEffect } from "react";
import MainContainer from "../../components/global/MainContainer";
import { Paper, Typography, Box, Button, IconButton, Tab } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import { axiosInstance } from "../../utils/axios";
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import CheckIcon from '@mui/icons-material/Check';
import { useNavigate } from "react-router";
import { GetUserRoleString } from "../../utils/stringUtil";
import { TabContext, TabList, TabPanel } from "@mui/lab";


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
  const [tabValue, setTabValue] = useState('0');

  
  const handleChange = (e, value) => {
    setTabValue(value);
  };


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

  const FilterUserList = (props) => {
    let list = userList.filter(user => user.role === props.role);
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
        <TabContext value={tabValue}>
          <TabList onChange={handleChange} sx={{margin: '20px 0 auto'}}>
            <Tab label='전체' value='0' sx={{minWidth: '40px'}}/>
            <Tab label='일반 회원' value='1' sx={{minWidth: '40px'}}/>
            <Tab label='의사' value='2' sx={{minWidth: '40px'}}/>
            <Tab label='관리자' value='3' sx={{minWidth: '40px'}}/>
          </TabList>
          <Box sx={{border: '1px solid grey' }}></Box>
            <TabPanel value='0' sx={{padding: '0'}}>
            {userList ? <AllUserList /> : <Typography variant='body1'>Loading..</Typography>}
            </TabPanel>
            <TabPanel value='1' sx={{padding: '0'}}>
            {userList ? <FilterUserList role='USER' /> : <Typography variant='body1'>Loading..</Typography>}
            </TabPanel>    
            <TabPanel value='2' sx={{padding: '0'}}>
            {userList ? <FilterUserList role='DOCTOR' /> : <Typography variant='body1'>Loading..</Typography>}
            </TabPanel>      
            <TabPanel value='3' sx={{padding: '0'}}>
            {userList ? <FilterUserList role='ADMIN' /> : <Typography variant='body1'>Loading..</Typography>}
            </TabPanel>  
        </TabContext>
      </Paper>
    </MainContainer>
  );
}

export default UserList;