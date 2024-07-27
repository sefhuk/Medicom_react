import React from 'react';
import MainContainer from '../components/global/MainContainer';
import { useSetRecoilState } from 'recoil';


function SymptomResult() {
  return (
    <MainContainer>
      <Paper>
        OO님의 추천 진료과는 XX입니다.
      </Paper>
      <Paper>
        지도
      </Paper>
    </MainContainer>
  );
}

export default SymptomResult;