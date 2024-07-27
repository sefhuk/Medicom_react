import React, { useEffect, useState } from 'react';
import MainContainer from '../../components/global/MainContainer';
import axios from 'axios';

// 페이지 경로: http://localhost:3000/hospitals/maps

const MapComponent = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hospital, setHospital] = useState(null); // hospital 데이터 상태

  useEffect(() => {
    // 특정 ID의 병원 데이터 불러오기 (ID 1인 병원만)
    const fetchHospitalData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/hospitals/1'); // 특정 ID의 병원 정보 가져오기
        setHospital(response.data); // 'hospital' 데이터로 설정
        console.log('Fetched hospital data:', response.data); // 콘솔에 데이터 출력
      } catch (error) {
        console.error('Error fetching hospital data:', error);
      }
    };

    fetchHospitalData();
  }, []);

  useEffect(() => {
    const loadMapScript = () => {
      if (!window.naver || !window.naver.maps) {
        const script = document.createElement('script');
        script.src = 'https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=327ksyij3n';
        script.async = true;
        script.onload = () => setMapLoaded(true);
        document.head.appendChild(script);
      } else {
        setMapLoaded(true);
      }
    };

    loadMapScript();

    return () => {
      const script = document.querySelector('script[src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=327ksyij3n"]');
      if (script) {
        script.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && hospital) {
      const mapDiv = document.getElementById('map');
      if (window.naver && window.naver.maps && mapDiv) {
        const map = new window.naver.maps.Map(mapDiv, {
          //db에 위도, 경도 값 서로바뀌어있음
          center: new window.naver.maps.LatLng(hospital.longitude, hospital.latitude),
          zoom: 15
        });

        // 마커 추가하기
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(hospital.longitude, hospital.latitude),
          map: map,
          title: hospital.name
        });

        const infoWindow = new window.naver.maps.InfoWindow({
          content: `<div style="width:150px;text-align:center;padding:10px;">${hospital.name}<br/>${hospital.address}</div>`
        });

        window.naver.maps.Event.addListener(marker, 'click', function() {
          if (infoWindow.getMap()) {
            infoWindow.close();
          } else {
            infoWindow.open(map, marker);
          }
        });

        console.log('Marker added:', marker); // 마커 추가 여부 확인
      }
    }
  }, [mapLoaded, hospital]);

  return (
    <MainContainer>
      <div style={{ width: '80%', height: '50%' }}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
    </MainContainer>
  );
};

export default MapComponent;
