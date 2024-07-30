import React from "react";
import MainContainer from '../../components/global/MainContainer';
import { Paper, Button, Box, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from "react-router";


const theme = createTheme({
  palette: {
    black: {
    main: '#2E2F2F',
    light: '#6E6E6E',
    drak: '#151515',
    contrastText: '#E7E7E6',
    },
  },
});

const AdminPage = () => {

  const navigate = useNavigate();

  const OnClickUserList = () => {
    navigate('/admin-page/user-list');
  };

  return(
    <MainContainer>
      <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}> 
      <ThemeProvider theme={theme}>
          <Typography variant='h5' sx={{display: 'inline', color: '#6E6E6E'}}>
            관리자 페이지
          </Typography>
          <Box sx={{margin: '40px 0 auto', border: '1px solid grey' }}></Box>
          <Box>
            <Button variant="contained" color="black" size='large' fullWidth sx={{margin: '15px 0 auto', height: '50px', fontSize: '16px'}}>고객 문의 채팅</Button>
            <Box sx={{margin: '15px 0 auto', border: '1px solid grey' }}></Box>
            <Button variant="contained" color="black" size='large' fullWidth sx={{margin: '15px 0 auto', height: '50px', fontSize: '16px'}}>게시판 관리</Button>
            <Box sx={{margin: '15px 0 auto', border: '1px solid grey' }}></Box>
            <Button variant="contained" color="black" size='large' fullWidth sx={{margin: '15px 0 auto', height: '50px', fontSize: '16px'}}>내가 쓴 게시글</Button>
            <Box sx={{margin: '15px 0 auto', border: '1px solid grey' }}></Box>
            <Button variant="contained" color="black" size='large' fullWidth sx={{margin: '15px 0 auto', height: '50px', fontSize: '16px'}}>상담 채팅 목록</Button>
            <Box sx={{margin: '15px 0 auto', border: '1px solid grey' }}></Box>
            <Button variant="contained" color="black" size='large' fullWidth sx={{margin: '15px 0 auto', height: '50px', fontSize: '18px'}} onClick={OnClickUserList}>회원 목록</Button>
            <Box sx={{margin: '15px 0 auto', border: '1px solid grey' }}></Box>
          </Box>
        </ThemeProvider>               
      </Paper>
    </MainContainer>
  );
}

export default AdminPage;