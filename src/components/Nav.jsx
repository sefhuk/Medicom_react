import React from 'react';
import { AppBar, Toolbar, Typography, Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { authState } from '../utils/atom';
import { deleteCookie } from '../utils/cookies';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import IconButton from '@mui/material/IconButton';


const Nav = () => {
  const navigate = useNavigate();
  const auth = useRecoilValue(authState);
  const setAuthState = useSetRecoilState(authState);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    setAuthState({ isLoggedIn: false });
    localStorage.removeItem('token');
    deleteCookie('refreshToken');
    navigate('/');
  };

  const LoginIcon = () => {
    return(
      <>
      <IconButton size='large'>
        <AccountCircleIcon/>
      </IconButton>
      <Button color="inherit" onClick={handleLogoutClick}>Logout</Button>
    </>    
    );
  }

  const OnClicMyPage = () => {
    navigate('my-page');
  }


  return (
    //아톰에 있는 상태정보 라이브러리 써서 로그인 여부 판단해서 돼있으면 로그아웃, 안돼있으면 로그인 버튼 뜨게 일단 해놨습니다(auth.isLoggedIn ? <- 부분)
    <StyledAppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          네비게이션바
        </Typography>
        {auth.isLoggedIn ? (
          <LoginIcon/>
        ) : (
          <Button color="inherit" onClick={handleLoginClick}>Login</Button>
        )}
      </Toolbar>
    </StyledAppBar>
  );
};

const StyledAppBar = styled(AppBar)`
  height: 8dvh;
  text-align: center;
  background-color: skyblue;
`;

export default Nav;