import React, { useEffect, useState } from 'react';
import MainContainer from '../../components/global/MainContainer'; // MainContainer 컴포넌트 import
import axios from 'axios';

const MapComponent = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hospitals, setHospitals] = useState([]);
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationInput, setLocationInput] = useState('');
  const [map, setMap] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [error, setError] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [showHospitalList, setShowHospitalList] = useState(false);
  const [reservationData, setReservationData] = useState({ name: '', contact: '' });

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          error => {
            setError('사용자의 위치를 가져올 수 없습니다.');
            console.error('위치 가져오기 오류:', error);
          }
        );
      } else {
        setError('이 브라우저는 지오로케이션을 지원하지 않습니다.');
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    const fetchHospitalsData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/hospitals/all');
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
    if (userLocation && hospitals.length > 0) {
      const { latitude: userLat, longitude: userLng } = userLocation;

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
        return distance(userLat, userLng, hospitalLat, hospitalLng) <= 5;
      });

      setFilteredHospitals(filtered);
    }
  }, [userLocation, hospitals]);

  useEffect(() => {
    if (mapLoaded && userLocation) {
      const mapDiv = document.getElementById('map');
      if (window.naver && window.naver.maps && mapDiv) {
        const mapInstance = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(userLocation.latitude, userLocation.longitude),
          zoom: 16
        });

        setMap(mapInstance);
      }
    }
  }, [mapLoaded, userLocation]);

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

  const handleLocationInput = async (input) => {
    if (input.trim() === '') {
      setError('유효한 위치를 입력해주세요.');
      return;
    }

    try {
      const response = await axios.get('https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode', {
        params: { query: input },
        headers: {
          'X-NCP-APIGW-API-KEY-ID': '327ksyij3n',
          'X-NCP-APIGW-API-KEY': 'mjPyVNMNM2qLIJAhu20VHtfcAc6lY05NAt66r5Mh'
        }
      });

      if (response.data && response.data.addresses.length > 0) {
        const { x: lng, y: lat } = response.data.addresses[0];
        setUserLocation({ latitude: parseFloat(lat), longitude: parseFloat(lng) });
        setError(null);

        if (map) {
          map.setCenter(new window.naver.maps.LatLng(parseFloat(lat), parseFloat(lng)));
        }
      } else {
        setError('주소를 찾을 수 없습니다.');
      }
    } catch (error) {
      setError('위치를 가져오는 중 오류가 발생했습니다.');
      console.error('지오코드 데이터 가져오기 오류:', error.response ? error.response.data : error.message);
    }
  };

  const handleReservation = () => {
    if (selectedHospital) {
      setShowReservationForm(true);
    } else {
      setError('예약할 병원을 선택해주세요.');
    }
  };

  return (
    <MainContainer>
      <div style={{ position: 'relative', width: '100%', height: '50%' }}>
        <div>
          <label htmlFor="locationInput">위치를 입력하세요:</label>
          <input 
            type="text" 
            id="locationInput" 
            placeholder="주소 또는 좌표 입력" 
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleLocationInput(e.target.value);
              }
            }}
          />
          <button onClick={() => handleLocationInput(locationInput)}>
            검색
          </button>
          <button onClick={() => setShowHospitalList(!showHospitalList)}>
            {showHospitalList ? '병원 리스트 숨기기' : '병원 리스트 보기'}
          </button>
        </div>
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        {selectedHospital && (
          <div style={{
            position: 'absolute',
            top: '35vw',
            width: '80%',
            backgroundColor: 'white',
            padding: '20px',
            boxShadow: '0px -4px 8px rgba(0,0,0,0.2)',
            borderTop: '2px solid #007BFF',
            zIndex: 1
          }}>
            <h3>병원 정보</h3>
            <p><strong>이름:</strong> {selectedHospital.name}</p>
            <p><strong>주소:</strong> {selectedHospital.address}</p>
            <p><strong>부서:</strong></p>
            <ul>
              {selectedHospital.departments.map(department => (
                <li key={department.id}>{department.name}</li>
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
          </div>
        )}
        {showHospitalList && (
          <div style={{ marginTop: '20px' }}>
            <h3>병원 리스트</h3>
            <ul>
              {hospitals.map(hospital => (
                <li key={hospital.id}>
                  {hospital.name} - {hospital.departments.map(department => department.name).join(', ')} - {hospital.address}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </MainContainer>
  );
};

export default MapComponent;
