import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userLogin, axiosInstance } from '../utils/axios';
import { TextField, Button, Typography, Paper, Container, Box, Grid } from '@mui/material';
import MainContainer from '../components/global/MainContainer';
import { useSetRecoilState } from 'recoil';
import { userauthState } from '../utils/atom';
import NaverLoginButton from '../components/NaverLogin';
import { Btntwo, TextF, Btn } from '../components/global/CustomComponents';

const CustomButton = ({ text, onClick }) => {
  return (
    <Button
      type="button"
      sx={{
        flex: '1 1 auto',
        color: 'black',
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '&:focus': {
          backgroundColor: 'transparent',
        },
      }}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

const Login = () => {
  const [loginState, setLoginState] = useState({
    email: '',
    password: '',
    message: ''
  });
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(userauthState);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { userId, role } = await userLogin(loginState.email, loginState.password);
      setLoginState((prevState) => ({
        ...prevState,
        message: '로그인 성공'
      }));
      setAuthState({ isLoggedIn: true, userId, role });
      localStorage.setItem('userRole', role);
      navigate('/');
    } catch (error) {
      let errorMessage = '비밀번호가 일치하지 않습니다';
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
      setLoginState((prevState) => ({
        ...prevState,
        message: errorMessage
      }));
    }
  };

  const navigateRegister = () => {
    navigate('/register');
  };
  const navigateVerified = () => {
    navigate('/email-verified');
  };
  const handelFindEmail = () => {
    navigate('/find-email');
  }
  const handleGoogleLogin = async () => {
    try {
      console.log('구글 로그인 시작');
      window.location.href = '/oauth2/authorization/google';
      navigate('/');
    } catch (error) {
      navigate('/');
    }
  };

  return (
    <MainContainer>
      <Container
      sx={{
        display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center',
        height: '80dvh',
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2, 
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 5 }}>
          Login
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextF
            label="이메일"
            name="email"
            type="email"
            value={loginState.email}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <TextF
            label="비밀번호"
            name="password"
            type="password"
            value={loginState.password}
            onChange={handleInputChange}
            fullWidth
            required
            margin="normal"
          />
          <Btntwo type="submit" sx={{ width: '100%', marginTop: 2 }}>
            Login
          </Btntwo>
        </form>
        {loginState.message && <Typography color="error" align="center">{loginState.message}</Typography>}
          <Grid sx = {{ marginTop: 2 }}>
            <CustomButton text="아이디 찾기" onClick={handelFindEmail} />
            <CustomButton text="비밀번호 찾기" onClick={navigateVerified} />
            <CustomButton text="회원 가입" onClick={navigateRegister} />
          </Grid>
          <Grid sx = {{ display: 'flex', marginTop: 2 }}>
          <Box sx={{ mx: 2, cursor: 'pointer' }} onClick={handleGoogleLogin}>
            <img src='/images/googlelogin.png' alt="구글 로그인" style={{width: '175px', height: '45px'}} />
          </Box>
            <NaverLoginButton />
          </Grid>
        </Box>
      </Container>
    </MainContainer>




  );
};

export default Login;
