import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#E9E9E9',
  color: '#000',
  width: '130px',
  height: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '30px',
  '&:hover': {
    backgroundColor: '#E2E2E2',
  },
}));

const Btn = (props) => {
  return <StyledButton {...props}>{props.children}</StyledButton>;
};

export default Btn;
