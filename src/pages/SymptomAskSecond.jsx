import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import MainContainer from '../components/global/MainContainer';
import { Box, Grid, Container, Typography, Button } from '@mui/material';

function SymptomAskSecond() {
  const location = useLocation(); //useLocation 사용으로 이전 페이지 응답 받아오기
  const { state } = location; 
  const message = state?.message || '';
  const departments = state?.departments || [];
  const navigate = useNavigate();

  const handleResultPage = () => {
    navigate('/hospitals/maps');
  };

  return (
    <MainContainer>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx = {{ marginTop: '30%'}}>
              <Typography variant='h1' sx = {{ textAlign: 'center' }}>02</Typography>
              <Typography variant='h4'>진단 결과</Typography>
              <Typography variant='body1' sx={{ marginTop: 2 }}>
                {message} 
                {/* 응답값 */}
              </Typography>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Typography variant='h6'>추천 진료 과목:</Typography>
              <Typography variant='body1'>
                {departments.join(', ')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleResultPage} 
                sx={{ marginTop: 2 }}
              >
                주변 병원 바로 보기
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainContainer>

  );
}

export default SymptomAskSecond;
