import React, { useContext } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import MainContainer from '../components/global/MainContainer';
import { LocationContext } from '../LocationContext'; 
import { chatRoomState, userauthState } from '../utils/atom';
import { useNavigate } from 'react-router';
import { Container, Grid, Typography, Box } from '@mui/material';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import { createChatRoom } from '../utils/axios';
import Banner from './Banner';
import '../index.css';
import { Margin } from '@mui/icons-material';

function MainPage() {
  const { address } = useContext(LocationContext);
  const auth = useRecoilValue(userauthState);
  const setChatRoom = useSetRecoilState(chatRoomState);
  const navigate = useNavigate();

  const handleChatPage = () => {
    createChatRoom('DOCTOR', navigate, setChatRoom);
  };

  const handleAIPage = () => {
    navigate('/symptoms');
  };

  const handleSearchPage = () => {
    navigate('/hospitals');
  };

  const handleLocationPage = () => {
    navigate('/location');
  };

  const CustomBox = ({ sx = {}, ...props }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        height: '20vh',
        borderRadius: '20px',
        bgcolor: 'lightgray',
        cursor: 'pointer',
        ...sx,
      }}
      {...props}
    />
  );

  const CustomBoxTypo = ({ sx = {}, ...props }) => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', 
        boxSizing: 'border-box', //총 요소 너비에 padding을 추가
        // bgcolor:'#F3F4F0'
        ...sx,
      }}
      {...props}
    />
  );  

  const CustomMiniBox = ({ sx = {}, ...props }) => (
    <Box
      sx={{
        bgcolor:'#F3F4F0',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '40vh',
        overflow: 'hidden',
        ...sx,
      }}
      {...props}
    />
  ); 

  return (
    <MainContainer>
      <Grid item xs={12}>
        <CustomBoxTypo onClick={handleLocationPage} sx={{ bgcolor:'#F3F4F0', padding: 2, cursor: 'pointer', borderRadius: '30px' }}>
          <MyLocationOutlinedIcon sx={{  color: 'black', marginRight: 1 }} />
          <Typography variant="h8" sx={{ color: 'black' }}>
            {auth.isLoggedIn ? address || '위치 설정 중...' : '위치 설정'} 
            {/* 비로그인 상태에서 위치 안보임  */}
          </Typography>
        </CustomBoxTypo>
      </Grid>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {/* 상단 배너 부분 */}
            <Grid item xs={12} sx={{ marginTop: 4 }}>

              <Banner /> {/* 배너 컴포넌트 사용 */}
            </Grid>

            <Grid item xs={12}>
              <CustomBoxTypo>
                <Typography variant="h5" sx = {{fontWeight: 'bold'}}>병원 어디로 가지?</Typography>
              </CustomBoxTypo>
            </Grid>

            <Grid item xs={6}>
              <CustomBox onClick={handleChatPage} sx={{ bgcolor: '#4A885D', flexDirection:'column', height: '31vh' }}>
                <CustomMiniBox>
                  <img src='/images/doctortwo.svg' alt="Doctor" style={{ marginTop: '1vh', width: '100%', height: '100%'}} />
                </CustomMiniBox>
                <Typography variant="h6" sx={{ marginTop: 2, color: 'white', fontWeight: 'bold' }}>의사 실시간 상담</Typography>
              <Typography variant="h8" sx={{ marginBottom: 2, mx: 3, color: 'white' }}>전문의와 상담할 수 있어요.</Typography>
              </CustomBox>
            </Grid>
            <Grid item xs={6}>
              <CustomBox onClick={handleAIPage} sx={{ bgcolor: '#4A885D', flexDirection:'column', height: '31vh' }}>
                <CustomMiniBox>
                  <img src='/images/AItwo.svg' alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'fill' }} />
                </CustomMiniBox>
                <Typography variant="h6" sx={{ marginTop: 2, color: 'white', fontWeight: 'bold' }}>AI로 증상 진단</Typography>
                <Typography variant="h9" sx={{ marginBottom: 2, mx: 3, color: 'white' }}>AI가 바로 답변해줄거에요.</Typography>
              </CustomBox>
            </Grid>

            <Grid item xs={12}>
              <CustomBoxTypo>
                <Typography variant="h5" sx = {{fontWeight: 'bold'}}>내 주변 진료과 찾기</Typography>
              </CustomBoxTypo>
            </Grid>

            <Grid item xs={12}>
              <CustomBox onClick={handleSearchPage} sx={{ height: '10vh', bgcolor:'#F3F4F0' }}>
                <Box sx={{ flex: 1, marginLeft: 3 }}>
                  <Typography variant='h6'>진료과 기반 검색</Typography>
                  <Typography sx={{ color: 'gray' }}>진료과 별로 찾을 수 있어요.</Typography>
                </Box>
                <LocalHospitalIcon fontSize="large" sx={{ marginLeft: 'auto', marginRight: 3, height: '100%' }} />
              </CustomBox>
            </Grid>

            <Grid item xs={12}>
              <CustomBox sx={{ height: '10vh', px: 2, textAlign: 'left', bgcolor:'#F3F4F0' }}>
                <Box>
                  <Typography variant='h6'>일반 검색</Typography>
                  <Typography sx={{ color: 'gray' }}>모든 병원을 찾을 수 있어요.</Typography>
                </Box>
                <SearchIcon fontSize="large" sx={{ marginLeft: 'auto', height: '100%' }} />
              </CustomBox>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainContainer>
  );
}

export default MainPage;
