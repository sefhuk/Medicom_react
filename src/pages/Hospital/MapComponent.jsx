import React, { useEffect, useState, useContext } from 'react';
import MainContainer from '../../components/global/MainContainer';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import { LocationContext } from '../../LocationContext';

const MapComponent = () => {
  const { latitude, longitude } = useContext(LocationContext);
  const { state } = location;
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [departmentInput, setDepartmentInput] = useState('');
  const [map, setMap] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const departments = state?.departments || [];
  

  useEffect(() => {
    const fetchHospitalsData = async () => {
      try {
        const response = await axiosInstance.get('http://localhost:8080/api/hospitals/all');
        setHospitals(response.data);
        console.log('병원 데이터를 가져왔습니다:', response.data);
      } catch (error) {
        setError(error.message);
        console.error('병원 데이터 가져오기 오류:', error);
      }
    };

    fetchHospitalsData();
  }, []);

  useEffect(() => {
    if (latitude && longitude && hospitals.length > 0) {
      const distance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;  // 지구의 반경 (킬로미터 단위)
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLng = (lng2 - lng1) * (Math.PI / 180);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const filtered = hospitals.filter(hospital => {
        const hospitalLat = hospital.latitude;
        const hospitalLng = hospital.longitude;
        return distance(latitude, longitude, hospitalLat, hospitalLng) <= 5;
      });

      setFilteredHospitals(filtered);
    }
  }, [latitude, longitude, hospitals]);

  useEffect(() => {
    if (mapLoaded && latitude && longitude) {
      const mapDiv = document.getElementById('map');
      if (window.naver && window.naver.maps && mapDiv) {
        const mapInstance = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(latitude, longitude),
          zoom: 16
        });

        setMap(mapInstance);
      }
    }
  }, [mapLoaded, latitude, longitude]);

  useEffect(() => {
    if (map && filteredHospitals.length > 0) {
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = filteredHospitals.map(item => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.latitude, item.longitude),
          map: map,
          title: item.name
        });

        window.naver.maps.Event.addListener(marker, 'click', function() {
          if (selectedHospital && selectedHospital.id === item.id) {
            setSelectedHospital(null);
          } else {
            setSelectedHospital(item);
          }
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  }, [map, filteredHospitals, selectedHospital]);

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

  const handleDepartmentSearch = () => {
    if (departmentInput.trim() === '') {
      setError('부서명을 입력해주세요.');
      return;
    }

    const filteredByDepartment = filteredHospitals.filter(hospital =>
      hospital.departments.some(department => department.name === departmentInput)
    );

    setFilteredHospitals(filteredByDepartment);

    if (map) {
      markers.forEach(marker => marker.setMap(null));

      const newMarkers = filteredByDepartment.map(item => {
        const marker = new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(item.latitude, item.longitude),
          map: map,
          title: item.name
        });

        window.naver.maps.Event.addListener(marker, 'click', function() {
          if (selectedHospital && selectedHospital.id === item.id) {
            setSelectedHospital(null);
          } else {
            setSelectedHospital(item);
          }
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  };

  const handleReservation = () => {
    if (selectedHospital) {
      navigate(`${selectedHospital.id}/reservation`);
    } else {
      setError('예약할 병원을 선택해주세요.');
    }
  };

  const handleViewAll = () => {
    navigate('/hospitals/list');
  };

  return (
    <MainContainer>
      <Box sx={{ mb: 1, textAlign: 'center', mt: 2 }}>
        {"OO님의 추천 진료과는 다음과 같습니다."}
      </Box>
      <Box
        height="50px"
        width="95%"
        my={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={4}
        p={2}
        sx={{ border: '2px solid grey' }}
      >
        <input
          type="text"
          value={departmentInput}
          onChange={(e) => setDepartmentInput(e.target.value)}
          placeholder="부서명을 입력하세요"
          style={{ margin: '10px' }}
        />
        <button onClick={handleDepartmentSearch}>
          검색
        </button>
      </Box>
      <Box sx={{ mb: 2, textAlign: 'center' }}>
        {"OO님의 현재 위치에 따른 병원 검색 결과"}
      </Box>
      <Button variant="contained" color="primary" onClick={handleViewAll}>
        전체 리스트 보기
      </Button>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width: '95%',
        height: '50%',
        mx: 'auto',
      }}>
        <Box id="map" sx={{ width: '100%', height: '100%' }}></Box>
        {error && <Box sx={{ color: 'red' }}>{error}</Box>}
        {selectedHospital && (
          <Box sx={{
            position: 'absolute',
            top: '110%',
            width: '90%',
            height: 'auto',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0px -4px 8px rgba(0,0,0,0.2)',
            borderTop: '2px solid #007BFF',
            zIndex: 1,
            textAlign: 'left',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{selectedHospital.name}</Typography>
            <Typography><strong>주소:</strong> {selectedHospital.address}</Typography>
            <Typography><strong>진료과목:</strong></Typography>
            <ul style={{
              listStyleType: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              justifyContent: 'flex-start',
              flexWrap: 'wrap'
            }}>
              {selectedHospital.departments.map(department => (
                <li key={department.id} style={{
                  marginRight: '20px',
                  whiteSpace: 'nowrap'
                }}>
                  #{department.name}
                </li>
              ))}
            </ul>
            <button onClick={handleReservation} style={{
              backgroundColor: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 15px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '10px'
            }}>
              병원 예약
            </button>
          </Box>
        )}
      </Box>
    </MainContainer>

  );
};

export default MapComponent;

