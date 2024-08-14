import React from 'react';
import { TextField } from '@mui/material';

function TextF({ value, onChange, onKeyDown }) {
  return (
    <TextField
      variant="outlined"
      fullWidth
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      sx={{ 
        '& .MuiOutlinedInput-root': {
          borderRadius: '40px',
          bgcolor: '#E9E9E9', // 입력 필드 배경색 설정
          '& fieldset': {
            borderColor: '#E9E9E9', // 기본 테두리 색상
            borderWidth: '2px', // 테두리 두께
          },
          '&:hover fieldset': {
            borderColor: 'black', // hover 상태에서 테두리 색상 변경
          },
          '&.Mui-focused fieldset': {
            borderColor: 'black', // 포커스 상태에서 테두리 색상 변경
          },
        },
        '& input': {
          color: 'black', // 텍스트 색상 설정
        }
      }}
    />
  );
}

export default TextF;
