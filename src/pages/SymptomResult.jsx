import React from 'react';
import MainContainer from '../components/global/MainContainer';
import { useSetRecoilState } from 'recoil';

const setCurrentMyLocation = useSetRecoilState(currentMyLocationAtom);
useEffect(() => {
  // 내 현재 위치 값 번환 성공 시 실행 함수 -> 내 현재 위치 값을 currentMyLocationAtom에 저장
  const success = (location: { coords: { latitude: number; longitude: number } }) => {
    setCurrentMyLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };
  // 내 현재 위치 값 반환 실패 시 실행 함수 -> 지도 중심을 서울시청 위치로 설정
  const error = () => {
    setCurrentMyLocation({ lat: 37.5666103, lng: 126.9783882 });
  };
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(success, error);
  }
}, [setCurrentMyLocation]);

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