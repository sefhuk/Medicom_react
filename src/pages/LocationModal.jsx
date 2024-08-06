import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';



function LocationModal({ open, onClose, onLocationSet }) {
  const [latLng, setLatLng] = useState({ lat: '', lng: '' });

  useEffect(() => {
    if (open) {
      loadNaverMapsScript();
    }
  }, [open]);

  const loadNaverMapsScript = () => {
    if (document.getElementById('naver-maps-script')) return;

    const script = document.createElement('script');
    script.id = 'naver-maps-script';
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=327ksyij3n`;
    script.async = true;
    script.onload = initializeMap;
    document.head.appendChild(script);
  };

  const initializeMap = () => {
    if (!window.naver) return;

    const mapOptions = {
      center: new window.naver.maps.LatLng(37.5665, 126.978), // 서울 시청을 기본 중심으로 설정
      zoom: 10,
    };

    const mapInstance = new window.naver.maps.Map('map', mapOptions);

    // 지도 클릭 시 위도, 경도 설정
    window.naver.maps.Event.addListener(mapInstance, 'click', function (event) {
      const lat = event.coord.lat();
      const lng = event.coord.lng();
      setLatLng({ lat, lng });

      // 지도에 클릭된 위치에 마커 추가
      new window.naver.maps.Marker({
        position: event.coord,
        map: mapInstance,
      });
    });
  };

  const handleSetLocation = () => {
    if (latLng.lat && latLng.lng) {
      onLocationSet(latLng);
      onClose();
    } else {
      alert('위도를 클릭하여 위치를 선택해 주세요.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>위치 설정</DialogTitle>
      <DialogContent>
        <Typography>현재 위치로 설정</Typography>
      </DialogContent>
      <DialogContent>
        <div id="map" style={{ width: '100%', height: '400px' }}></div>
        <Typography variant="subtitle1" gutterBottom>
          선택한 위치: 위도 {latLng.lat}, 경도 {latLng.lng}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSetLocation} color="primary">
          위치 설정
        </Button>
        <Button onClick={onClose} color="secondary">
          취소
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default LocationModal;
