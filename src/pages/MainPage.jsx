import React, { useContext } from 'react';
import MainContainer from '../components/global/MainContainer';
import { LocationContext } from '../LocationContext'; // import 수정
import { useNavigate } from 'react-router';
import { Container, Grid, Typography, Box } from '@mui/material';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

function MainPage() {
  const { address } = useContext(LocationContext); // 수정
  const navigate = useNavigate();

  const handleChatPage = () => {
    navigate('/'); // 의사와 채팅 페이지로 이동
  };

  const handleAIPage = () => {
    navigate('/'); // AI 진단 페이지로 이동
  };

  const handleSearchPage = () => {
    navigate('/hospitals'); // 병원 검색 페이지로 이동
  };

  const handleLocationPage = () => {
    navigate('/location'); // 위치 설정 페이지로 이동
  };

  const CustomBox = ({ sx = {}, ...props }) => (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        height: '20vh',
        borderRadius: '40px',
        bgcolor: 'lightgray',
        cursor: 'pointer',
        ...sx, // sx는 props.sx로부터 전달된 스타일을 병합
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
        ...sx,
      }}
      {...props}
    />
  );  

  const CustomMiniBox = ({ sx = {}, ...props }) => (
    <Box
      sx={{
        width: '10vh', 
        aspectRatio: '1 / 1',
        bgcolor: 'white', 
        borderRadius: '20px',
        ...sx,
      }}
      {...props}
    />
  ); 

  return (
    <MainContainer>
      <Grid item xs={12}>
        <CustomBoxTypo onClick={handleLocationPage} sx={{ bgcolor: 'black', py: 2, cursor: 'pointer' }}>
          <MyLocationOutlinedIcon sx={{ marginLeft: 3, marginRight: 2, color: 'white' }} />
          <Typography variant="h6" sx={{ color: 'white' }}>{address}</Typography> {/* 수정 */}
        </CustomBoxTypo>
      </Grid>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {/* 상단 */}
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <CustomBox>
                <Typography>배너</Typography>
              </CustomBox>
            </Grid>

            <Grid item xs={12}>
              <CustomBoxTypo>
                <Typography variant="h6">병원 어디로 가지?</Typography>
              </CustomBoxTypo>
            </Grid>

            <Grid item xs={6}>
              <CustomBox onClick={handleChatPage} sx={{ bgcolor: '#A2CA71', flexDirection: 'column', alignItems: 'left'}}>
                <CustomMiniBox sx={{ marginLeft: 3 }}>
                  {/* 아이콘 */}
                </CustomMiniBox>
                <Typography sx={{ marginRight: 3, marginLeft: 'auto', marginTop: 3 }}>의사와 실시간 상담</Typography>
              </CustomBox>
            </Grid>
            <Grid item xs={6}>
              <CustomBox onClick={handleAIPage} sx={{ bgcolor: '#BEDC74', flexDirection: 'column', alignItems: 'left' }}>
                <CustomMiniBox sx={{ marginLeft: 3 }}>
                  {/* 아이콘 */}
                </CustomMiniBox>
                <Typography sx={{ marginRight: 3, marginLeft: 'auto', marginTop: 3 }}>증상 입력으로 AI 진단</Typography>
              </CustomBox>
            </Grid>

            <Grid item xs={12}>
              <CustomBoxTypo>
                <Typography variant="h6">내 주변 진료과 찾기</Typography>
              </CustomBoxTypo>
            </Grid>

            <Grid item xs={12}>
              <CustomBox sx={{ height: '10vh', border: 3, borderColor: 'lightgrey', bgcolor: 'white' }}>
                <Box sx={{ flex: 1, marginLeft: 3 }}>
                  <Typography variant='h6'>진료과 기반 검색</Typography>
                  <Typography sx={{ color: 'gray' }}>진료과 별로 찾을 수 있어요.</Typography>
                </Box>
                <LocalHospitalIcon fontSize="large" sx={{ marginLeft: 'auto', marginRight: 3, height: '100%' }} />
              </CustomBox>
            </Grid>

            <Grid item xs={12}>
              <CustomBox sx={{ height: '10vh', border: 3, borderColor: 'lightgrey', bgcolor: 'white' }}>
                <Box sx={{ flex: 1, marginLeft: 3 }}>
                  <Typography variant='h6'>일반 검색</Typography>
                  <Typography sx={{ color: 'gray' }}>모든 병원을 찾을 수 있어요.</Typography>
                </Box>
                <SearchIcon fontSize="large" sx={{ marginLeft: 'auto', marginRight: 3, height: '100%' }} />
              </CustomBox>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainContainer>
  );
}

export default MainPage;
