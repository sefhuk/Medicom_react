import React from 'react';
import MainContainer from '../components/global/MainContainer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';

function MainPage() {
  return (<MainContainer>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MUI 테스트(툴바 테스트)
        </Typography>
      </Toolbar>
    </AppBar>
    <Container>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
         글자 테스트
        </Typography>
        <Button variant="contained" color="primary" sx={{ mb: 2 }}>
          버튼 테스트
        </Button>
        <Stack spacing={2} sx={{ width: 300 }}>
          <Autocomplete
            id="combobox"
            options={['1번 선택', '2번 선택', '3번 선택']}
            renderInput={(params) => <TextField {...params} label="콤보박스" />}
          />
        </Stack>
      </Box>
    </Container>

  </MainContainer>);
}

export default MainPage;
