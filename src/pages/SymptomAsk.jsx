import React from 'react';
import MainContainer from '../components/global/MainContainer';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

//공통 속성 지정
const DemoPaper = styled(Paper)(({ theme }) => ({
    width: 120,
    height: 120,
    padding: theme.spacing(2),
    ...theme.typography.body2,
    textAlign: 'center',
  }));


//<DemoPaper variant="elevation">default variant</DemoPaper>
//처럼 각각 인라인 디자인

function SymptomAsk() {
  return (
    <MainContainer>
        <Paper>증상에 대하여 답해주세요.</Paper>
        <Paper>
            질문
        </Paper>
    </MainContainer>
  );
}

export default SymptomAsk;