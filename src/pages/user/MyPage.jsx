import MainContainer from "../../components/global/MainContainer";
import React, { useState} from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Typography, TextField, Button, IconButton, Box, Avatar } from '@mui/material';
import { Paper }  from '@mui/material';
import Footer from "../../components/Footer";
import { createTheme, ThemeProvider } from '@mui/material/styles';

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


const MyPage = () => {
  
  const [name, setName] = useState('NA');

  return (
    <MainContainer>
      <Paper elevation={6} sx={{margin: '10px', padding: 3, borderRadius: '10px' }}>                
        <ThemeProvider theme={theme}>
          <Typography variant='h5' color="black" sx={{display: 'inline', color: '#6E6E6E'}}>
            마이페이지
          </Typography>
          <Button variant="contained" color="black" sx={{float: 'right'}}>나의 활동내역</Button>
          <Box sx={{margin: '40px 0 auto', border: '1px solid grey' }}></Box>
          <Box sx={{margin: '20px 0 auto'}}>
            <Avatar sx={{width: '40px', height: '40px', float: 'left'}}>{name}</Avatar>
            <Typography variant="body1" color="black" sx={{float: 'left'}}>일반 회원</Typography>
          </Box>
        </ThemeProvider>               
      </Paper>
    </MainContainer>
    );
};


export default MyPage;