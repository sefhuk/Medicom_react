import styled from 'styled-components';
import { Box } from '@mui/material';

export const CustomScrollBox = styled(Box)(({ theme }) => ({
  overflowY: 'auto',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '5px',
    opacity: 0,
    transition: 'opacity 0.3s'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent'
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 0 8px rgba(0, 0, 0, 0.3)',
    transition: 'background-color 0.3s'
  },
  '&:hover::-webkit-scrollbar-thumb': {
    backgroundColor: '#f1f1f1'
  },
  '&:hover::-webkit-scrollbar': {
    opacity: 1
  }
}));
