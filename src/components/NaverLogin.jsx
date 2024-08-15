import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box} from '@mui/material';

const NaverLoginButton = () => {
  const navigate = useNavigate();

  const handleNaverLogin = async () => {
    try {
      console.log("네이버 로그인 시작");
      window.location.href = "/oauth2/authorization/naver";
    } catch (error) {
      console.error('네이버 로그인 실패', error);
    }
  };

  return (
    <Box onClick={handleNaverLogin} sx={{ mx:2, cursor: 'pointer' }}>
      <img
        src="/images/naverlogin.png"
        alt="네이버 로그인"
        style={{ width: '175px', height: '45px' }}
      />
    </Box>
  );
};

export default NaverLoginButton;