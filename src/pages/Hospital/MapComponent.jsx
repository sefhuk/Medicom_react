import React, { useEffect, useState } from 'react';
import MainContainer from '../../components/global/MainContainer';

//페이지 경로 : http://localhost:3000/hospitals/maps

const MapComponent = () => {
  const [mapLoaded, setMapLoaded] = useState(false);

  // 임의로 데이터 추가
  const hospitalData = [
    {
      id: 1,
      name: "병원 A",
      latitude: 37.5665,
      longitude: 126.9780,
      address: "서울특별시 종로구"
    },
    {
      id: 2,
      name: "병원 B",
      latitude: 37.5651,
      longitude: 126.9895,
      address: "서울특별시 중구"
    },

  ];

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
      const script = document.querySelector(`script[src="https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=327ksyij3n"]`);
      if (script) {
        script.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapLoaded) {
      const mapDiv = document.getElementById('map');
      if (window.naver && window.naver.maps && mapDiv) {
        const map = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(37.5665, 126.9780),
          zoom: 15
        });

        //마커 추가하기
        hospitalData.forEach(hospital => {
          const marker = new window.naver.maps.Marker({
            position: new window.naver.maps.LatLng(hospital.latitude, hospital.longitude),
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
        });
      }
    }
  }, [mapLoaded]);

  return (
    <MainContainer>
      <div style={{ width: '80%', height: '50%' }}>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
    </MainContainer>
  );
};

export default MapComponent;