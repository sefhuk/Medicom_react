import React, { useRef, useEffect, useState } from 'react';
import MainContainer from '../components/global/MainContainer';
import { Box, Snackbar, Alert, Typography } from '@mui/material';

function LocationPage() {
  const mapRef = useRef(null);
  const [center, setCenter] = useState(null);
  const [address, setAddress] = useState('');

  const handleSaveLocation = () => {

  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setCenter({ lat: 37.3595704, lng: 127.105399 }); // Default location (Seoul)
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setCenter({ lat: 37.3595704, lng: 127.105399 }); // Default location (Seoul)
    }
  }, []);

  useEffect(() => {
    if (window.naver && mapRef.current && center) {
      const map = new window.naver.maps.Map(mapRef.current, {
        center: new window.naver.maps.LatLng(center.lat, center.lng),
        zoom: 15
      });

      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(center.lat, center.lng),
        map: map
      });

      // 페이지 로드 시 자동으로 주소 정보 가져오기
      const lat = center.lat;
      const lng = center.lng;
      const url = `http://localhost:8080/api/geocode?lat=${lat}&lng=${lng}`;

      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .then(response => response.json())
      .then(data => {
        // 결과값에서 지역만 추출
        if (data && data.results && data.results.length > 0) {
          const result = data.results[0].region;
          const addressParts = [
            result.area1?.name || '',
            result.area2?.name || '',
            result.area3?.name || '',
            result.area4?.name || ''
          ];
          const address = addressParts.join(' ');

          setAddress(`${address.trim()}`);
        } else {
          setAddress('주소를 찾을 수 없습니다.');
        }
      })
      .catch(error => {
        console.error('Geocoding API error:', error);
        setAddress('주소를 가져오지 못했습니다.');
      });
      
      // 마커에 정보창 설정
      const infowindow = new window.naver.maps.InfoWindow({
        content: `
          <div style="
            font-size: 14px;
            padding: 10px;
            border: 1px solid #ccc;
            background-color: #fff;
            border-radius: 4px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
          ">
            <strong style="font-size: 16px; color: #333;">현재 위치</strong>
            <div style="margin-top: 5px; color: #666;">${address.trim() || '주소를 찾을 수 없습니다.'}</div>
          </div>`
      });

      // 페이지 로드 시 자동으로 정보 창 열기
      infowindow.open(map, marker);
    }
  }, [center, address]);

  return (
    <MainContainer>
      <Box
        ref={mapRef}
        sx={{
          width: '100%',
          height: '80%',
        }}
      />
      <Box onClick={handleSaveLocation} sx = {{ justifyContent: center, 
        alignContent: center,
         bgcolor: '#A2CA71',
         height: '5%',
         bordeRadius: '30px' }}>
        <Typography>현재 위치로 할게요</Typography>
      </Box>
      <Box onClick={handleSaveLocation} sx = {{ justifyContent: center, 
        alignContent: center,
         bgcolor: '#A2CA71',
         height: '5%',
         bordeRadius: '30px' }}>
        <Typography>다른 위치 검색하기</Typography>
      </Box>
    </MainContainer>
  );
}

export default LocationPage;
