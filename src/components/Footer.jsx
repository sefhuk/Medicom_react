import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Box, BottomNavigation, BottomNavigationAction } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import HomeIcon from '@mui/icons-material/Home';
import TextSnippetOutlinedIcon from '@mui/icons-material/TextSnippetOutlined';
import SmsOutlinedIcon from '@mui/icons-material/SmsOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';


function Footer() {
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  
  //각 아이콘 누를 때 각 page로 navigate
  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 'home':
        navigate('/');
        break;
      case 'community':
        navigate('/boards');
        break;
      case 'chat':
        navigate('/chatlist');
        break;
      case 'my':
        navigate('/my-page');
        break;
      default:
        navigate('/home');
    }
  };


  return (
        <StyledFooterBar value={value} onChange={handleChange}>
          <BottomNavigationAction
          label="Home"
          value="home"
          icon={<HomeIcon sx = {{ height:'20px', width:'20px' }}/>}
          />
          <BottomNavigationAction
            label="Community"
            value="community"
            icon={<TextSnippetOutlinedIcon sx = {{ height:'20px', width:'20px' }}/>}
          />
          <BottomNavigationAction
            label="Chat"
            value="chat"
            icon={<SmsOutlinedIcon sx = {{ height:'20px', width:'20px' }}/>}
          />
          <BottomNavigationAction 
            label="My" 
            value="my" 
            icon={<PersonOutlineOutlinedIcon sx = {{ height:'20px', width:'20px' }}/>} />
        </StyledFooterBar>
  );
};

const StyledFooterBar = styled(BottomNavigation)`
  height: 8dvh;
  text-align: center;
  background-color: skyblue;
  border-top: 1px solid #e9e9e9;
`;

export default Footer;
