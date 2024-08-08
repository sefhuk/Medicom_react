import React from 'react';
import MainContainer from '../components/global/MainContainer';
import { styled } from '@mui/material/styles';
import { Box, Grid, Container, Typography } from '@mui/material';



//<DemoPaper variant="elevation">default variant</DemoPaper>
//처럼 각각 인라인 디자인

function SymptomAsk() {
  return (
    <MainContainer>
      <Container>
        <Box sx={{  flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Grid container spacing={2} sx={{ flexGrow: 1 }}>
            <Grid item xs={12}>

            </Grid>
            <Grid item xs={12}>
              <Typography>증상에 대해 설명해주세요.</Typography>
            </Grid>
            <Grid item xs={12}>

            </Grid>
            <Grid item xs={12}>

            </Grid>
            </Grid> 
        </Box>
      </Container> 
    </MainContainer>
  );
}

export default SymptomAsk;