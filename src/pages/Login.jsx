import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, axiosInstance} from '../utils/axios';
import { TextField, Button, Typography, Paper, Container, Box } from '@mui/material';
import MainContainer from '../components/global/MainContainer';
import { useSetRecoilState } from 'recoil';
import { userauthState } from '../utils/atom';
import NaverLoginButton from '../components/NaverLogin';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(userauthState);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { userId } = await userLogin(email, password);
      setMessage('로그인 성공');
      setAuthState({ isLoggedIn: true, userId });
      navigate('/');
    } catch (error) {
      let errorMessage = '로그인 실패';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setMessage(errorMessage);
    }
  };

  const navigateRegister = () =>{
    navigate('/register');
  };

  const handleGoogleLogin = async () => {
    try {
      console.log("구글 로그인 시작")
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };


  return (
    <MainContainer>
      <Paper elevation={6} sx={{ padding: 3, borderRadius: '10px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          로그인
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required margin="normal" />
          <TextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required margin="normal" />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ borderRadius: '10px', padding: '10px 0' }}>로그인</Button>
        </form>
        {message && <Typography color="error" align="center">{message}</Typography>}
      </Paper>

      <Container fixed fullWidth sx={{margin: '15px 0', display: 'flex', flexDirection: 'row'}}>
        <Button type="button" sx={{flex: '1 1 auto'}}>아이디 찾기</Button>
        <Button type="button" sx={{flex: '1 1 auto'}}>비밀번호 찾기</Button>
        <Button type="button" sx={{flex: '1 1 auto'}} onClick={navigateRegister}>회원 가입</Button>
      </Container>
      <Button onClick={handleGoogleLogin}>구글 로그인</Button>
      <NaverLoginButton />
    </MainContainer>

  )
}
export default Login;