import styled from 'styled-components';
import { Box } from '@mui/material';

export const CustomScrollBox = styled(Box)(({ theme }) => ({
  maxHeight: '80vh',
  overflowY: 'auto',
  position: 'relative',
  '&::-webkit-scrollbar': {
    width: '10px',
    opacity: 1
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
    backgroundColor: '#f1f1f1' // hover 시 색상
  }
}));
