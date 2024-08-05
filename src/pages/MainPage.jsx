import React, { useState } from 'react';
import styled from 'styled-components';
import MainContainer from '../components/global/MainContainer';
import { useNavigate } from 'react-router';
import { Container, Typography, Box } from '@mui/material';
import MyLocationOutlinedIcon from '@mui/icons-material/MyLocationOutlined';
import LocationModal from './LocationModal';

function MainPage() {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState('위치를 설정하세요'); // 기본 텍스트

  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);
  const handleLocationSet = ({ lat, lng }) => {
    // 위도와 경도를 주소로 변환하는 API 호출 필요
    // 여기서는 단순히 '위도, 경도' 형태로 표시
    setLocation(`위도: ${lat}, 경도: ${lng}`);
  };

  const CustomBox = (props) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        my: 2,
        ...props.sx,
      }}
      {...props}
    />
  );

  return (
    <MainContainer>
      <Container>
        {/* 최상단 */}
        <CustomBox onClick={handleOpenModal}>
          <MyLocationOutlinedIcon sx={{ marginRight: 2 }} />
          <Typography variant="h6">{location}</Typography>
        </CustomBox>
        
        {/* 배너 */}
        <CustomBox>
          <Box sx={{ width: '100%', height: '20vh', bgcolor: 'lightgrey' }}>
            <Typography>배너</Typography>
          </Box>
        </CustomBox>

        {/* 진단 */}
        <CustomBox>
          <Box sx={{ flex: 1, height: '15vh', bgcolor: 'lightgrey', marginRight: 1 }}>
            <Typography>내용 1</Typography>
          </Box>
          <Box sx={{ flex: 1, height: '15vh', bgcolor: 'lightgrey', marginLeft: 1 }}>
            <Typography>내용 2</Typography>
          </Box>
        </CustomBox>

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
