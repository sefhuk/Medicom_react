import React, { useEffect, useState, useContext } from 'react';
import MainContainer from '../../components/global/MainContainer';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import { LocationContext } from '../../LocationContext';
import { Btn, TextF } from '../../components/global/CustomComponents';

const MapComponent = () => {
  const { latitude, longitude } = useContext(LocationContext);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate();
  const routeLocation = useLocation();
  const { state } = routeLocation;
  const { departments = [] } = state || {};

  useEffect(() => {
    const fetchHospitalsData = async () => {
      try {
        const response = await axiosInstance.get('/api/hospitals/all');
        setHospitals(response.data);
        console.log('병원 데이터를 가져왔습니다:', response.data);
        handleDepartmentSearch();
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
        const R = 6371;
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

        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (selectedHospital && selectedHospital.id === item.id) {
            setSelectedHospital(null);
            setShowDetails(false);
          } else {
            setSelectedHospital(item);
            setShowDetails(true);
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
    if (departments.length === 0) {
      setError('부서명이 입력되지 않았습니다.');
      return;
    }

    const departmentsArray = departments.map(dep => dep.trim());

    const filteredByDepartment = filteredHospitals.filter(hospital =>
      hospital.departments.some(department => departmentsArray.includes(department.name))
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

        window.naver.maps.Event.addListener(marker, 'click', () => {
          if (selectedHospital && selectedHospital.id === item.id) {
            setSelectedHospital(null);
            setShowDetails(false);
          } else {
            setSelectedHospital(item);
            setShowDetails(true);
          }
        });

        return marker;
      });

      setMarkers(newMarkers);
    }
  };

  useEffect(() => {
    handleDepartmentSearch();
  }, [departments]);

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
      <Container>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
            </Grid>
            <Grid item xs={12}>
              <Typography variant='h3' sx={{ color: '#4A885D', fontWeight: 'bold' }}>3</Typography>
              <Typography variant='h5' sx={{ fontWeight: 'bold'}}>가까운 진료과 추천</Typography>  
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2 }}>
              <Box sx={{ bgcolor: '#F3F4F0', padding: 2, borderRadius: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant='body1'>
                    현재 위치 5km 이내
                  </Typography>
                  <Typography variant='body1' sx={{ fontWeight: 'bold' }}>
                    {departments.join(', ')}
                  </Typography>
                </Box>
                <Btn onClick={handleDepartmentSearch}>
                  병원 찾기
                </Btn>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2}}>
              <Box sx = {{ bgcolor: '#F3F4F0', padding: 2, display: 'flex', borderRadius: '30px', justifyContent: 'space-between' }}>
                <Typography variant='body1'>
                  검색 결과 : {filteredHospitals.length}건
                </Typography>
                <Typography sx={{ fontSize: '12px', color: 'gray', ml: 'auto' }}>
                  *병원 찾기 버튼을 눌러주세요
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sx={{ marginTop: 2}}>
              <Box
                id="map"
                sx={{
                  width: '100%', // 지도 박스의 너비를 95%로 설정
                  height: '400px',
                  mb: 2,
                }}
              >
                {/* 지도 컴포넌트 */}
              </Box>

              {error && <Box sx={{ color: 'red', mb: 2 }}>{error}</Box>}

              {selectedHospital && (
                <Box
                  sx={{
                    width: '100%',
                    backgroundColor: 'white',
                    boxSizing: 'border-box',
                    padding: 2,
                    textAlign: 'left',
                    border: '1px solid gray',
                    borderRadius: '5px',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedHospital.name}
                  </Typography>
                  <Typography>
                    <strong>주소:</strong> {selectedHospital.address}
                  </Typography>
                  <Typography>
                    <strong>진료과목:</strong>
                  </Typography>
                  <ul
                    style={{
                      listStyleType: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      justifyContent: 'flex-start',
                      flexWrap: 'wrap',
                    }}
                  >
                    {selectedHospital.departments.map((department) => (
                      <li
                        key={department.id}
                        style={{
                          marginRight: '20px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        #{department.name}
                      </li>
                    ))}
                  </ul>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}> {/* 버튼을 오른쪽으로 정렬 */}
                    <Btn onClick={handleReservation} sx={{ marginTop: '10px' }}>
                      병원 예약
                    </Btn>
                  </Box>
                </Box>
          )}
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>                    
              <Btn onClick={handleViewAll}>
                  리스트로 보기
              </Btn>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </MainContainer>

  );
};

export default MapComponent;
