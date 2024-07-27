import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { authState } from '../utils/atom';

const SocialLoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuthState = useSetRecoilState(authState);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');
    if (token) {
      localStorage.setItem('token', token);
      setAuthState({ isLoggedIn: true });
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [location, navigate, setAuthState]);

  return <div>소셜 처리 중</div>;
};

export default SocialLoginSuccess;