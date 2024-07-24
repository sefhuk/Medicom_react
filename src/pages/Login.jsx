import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../utils/axios';
import { TextField, Button, Typography, Paper } from '@mui/material';
import MainContainer from '../components/global/MainContainer';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await userLogin(email, password);
      setMessage('로그인 성공');
      navigate('/');
    } catch (error) {
      let errorMessage = '로그인 실패';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setMessage(errorMessage);
    }
  };

  return (
    <MainContainer>
      <Paper elevation={6} sx={{ padding: 3, borderRadius: '12px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          로그인
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="이메일" type="email" value={email} onChange={(e) => setEmail(e.target.value)} fullWidth required margin="normal" />
          <TextField label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} fullWidth required margin="normal" />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ borderRadius: '20px', padding: '10px 0' }}>로그인</Button>
        </form>
        {message && <Typography color="error" align="center">{message}</Typography>}
      </Paper>

    </MainContainer>
  )
}
export default Login;