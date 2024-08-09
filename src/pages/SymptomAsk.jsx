import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import MainContainer from '../components/global/MainContainer';
import { Box, Grid, Container, Typography, TextField, Button } from '@mui/material';
import axios from 'axios';
import { Loading } from '../components/Loading'; 

function SymptomAsk() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleNext = async () => {
    setLoading(true); 
    try {
      const response = await axios.post('http://localhost:8080/gemini', {
        message: textFieldValue,
      });

      // 서버 응답 데이터를 상태로 저장
      navigate('diagnosis', { state: { 
        message: response.data.message,
        departments: response.data.departments
      } });
    } catch (error) {
      console.error('Error submitting the symptom description:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainContainer>
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sx={{ marginTop: '30%' }}>
              {/* Stepper */}
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h1'>01</Typography>
              <Typography variant='h5'>증상에 대해 자유롭게 설명해주세요.</Typography>
              <Typography variant='h8' sx={{ color: 'grey' }}>예시: 배가 아프고 식은땀이 나</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-multiline-flexible"
                label="자세히 설명할수록 좋아요."
                multiline
                maxRows={4}
                variant="standard"
                sx={{ width: '100%' }}
                value={textFieldValue}
                onChange={(e) => setTextFieldValue(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleNext} 
                sx={{ marginTop: 2 }}
              >
                제출하기
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Loading open={loading} /> {/* 로딩 상태에 따라 Loading 컴포넌트 표시 */}
    </MainContainer>
  );
}

export default SymptomAsk;
