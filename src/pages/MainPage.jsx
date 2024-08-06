import React, { useState } from 'react';
import MainContainer from '../components/global/MainContainer';
import { useNavigate } from 'react-router';
import { Container, Grid, Typography, Box } from '@mui/material';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import LocationModal from './LocationModal';
import { borders } from '@mui/system';
import { BorderColor, BorderColorOutlined } from '@mui/icons-material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

function MainPage() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('내 위치 설정'); // 기본 텍스트
  const navigate = useNavigate();
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const handleLocationSet = ({ lat, lng }) => {
    // 위도와 경도를 주소로 변환하는 API 호출 필요
    // 여기서는 단순히 '위도, 경도' 형태로 표시
    setLocation(`위도: ${lat}, 경도: ${lng}`);
  };

  const handleChatPage = () => {
    navigate('/'); //의사와 채팅으로 이동
  };

  const handleAIPage = () => {
    navigate('/'); //AI 진단페이지 이동
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
        <CustomBoxTypo onClick={handleOpenModal} sx={{ bgcolor: 'black', py: 2, cursor: 'pointer' }}>
          <MyLocationOutlinedIcon sx={{ marginLeft: 3, marginRight: 2, color: 'white' }} />
          <Typography variant="h6" sx = {{ color: 'white' }}>{location}</Typography>
        </CustomBoxTypo>
      </Grid>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {/* 상단 */}
            <Grid item xs={12} sx={{ marginTop : 2 }}>
              <CustomBox>
                  <Typography>배너</Typography>
              </CustomBox>
            </Grid>
          <Button onClick={() => navigate('/boards')} variant="contained" color="primary" sx={{ mb: 2 }}>
            게시판 목록
          </Button>


            <Grid item xs={12}>
              <CustomBoxTypo>
                <Typography variant="h6">병원 어디로 가지?</Typography>
              </CustomBoxTypo>
            </Grid>

            <Grid item xs={6}>
              <CustomBox onClick={handleChatPage} sx = {{ bgcolor: '#A2CA71', flexDirection: 'column', alignItems: 'left'}}>
                <CustomMiniBox sx={{ marginLeft: 3}}>
                    {/* 아이콘 */}
                </CustomMiniBox>
                <Typography sx= {{ marginRight: 3, marginLeft: 'auto', marginTop: 3}}>의사와 실시간 상담</Typography>
              </CustomBox>
            </Grid>
            <Grid item xs={6}>
              <CustomBox onClick={handleAIPage} sx={{ bgcolor: '#BEDC74', flexDirection: 'column', alignItems: 'left' }}>
                <CustomMiniBox sx={{ marginLeft: 3}}>
                  {/* 아이콘 */}
                </CustomMiniBox>
                <Typography sx= {{ marginRight: 3, marginLeft: 'auto', marginTop: 3}}>증상 입력으로 AI 진단</Typography>
              </CustomBox>
            </Grid>
              

            
            <Grid item xs={12}>
              <CustomBoxTypo>
                <Typography variant="h6">내 주변 진료과 찾기</Typography>
              </CustomBoxTypo>
            </Grid>

            <Grid item xs={12}>
              <CustomBox sx ={{ height: '10vh', border: 3, borderColor: 'lightgrey', bgcolor: 'white' }}>
              <Box sx={{ flex: 1, marginLeft: 3 }}>
                <Typography variant='h6'>진료과 기반 검색</Typography>
                <Typography sx={{ color: 'gray' }}>진료과 별로 찾을 수 있어요.</Typography>
              </Box>
              <LocalHospitalIcon fontSize="large" sx = {{ marginLeft: 'auto', marginRight: 3, height: '100%' }}/>
              </CustomBox>
            </Grid>

            <Grid item xs={12}>
              <CustomBox sx ={{ height: '10vh', border: 3, borderColor: 'lightgrey', bgcolor: 'white' }}>
              <Box sx={{ flex: 1, marginLeft: 3 }}>
                <Typography variant='h6'>일반 검색</Typography>
                <Typography sx={{ color: 'gray' }}>모든 병원을 찾을 수 있어요.</Typography>
              </Box>
              <SearchIcon fontSize="large" sx = {{ marginLeft: 'auto', marginRight: 3, height: '100%' }}/>
              </CustomBox>
            </Grid>
          </Grid>
        </Box>

      </Container>

      {/* 모달 */}
      <LocationModal
        open={open}
        onClose={handleCloseModal}
        onLocationSet={handleLocationSet}
      />
    </MainContainer>
  );
}

export default MainPage;
