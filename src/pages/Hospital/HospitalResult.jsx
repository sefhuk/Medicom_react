import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';
import MainContainer from '../../components/global/MainContainer';

// 거리 계산 함수 (위도와 경도를 이용해 두 지점 간의 거리를 계산)
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => value * Math.PI / 180;
  const R = 6371; // 지구의 반경 (킬로미터)
  
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const HospitalList = () => {
  const location = useLocation();
  const departmentsFromState = location.state?.departments || [];
  
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [departmentInput, setDepartmentInput] = useState('');
  const [departments, setDepartments] = useState(departmentsFromState);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchParams, setSearchParams] = useState({
    departmentNames: departmentsFromState,
    page: 0,
    size: 10,
  });

  const pageSize = 10;

  // departments 상태가 변경될 때 departmentInput을 업데이트합니다.
  useEffect(() => {
    if (departments.length > 0) {
      const departmentNames = departments.join(', '); // 배열을 문자열로 변환
      setDepartmentInput(departmentNames);
      console.log('Departments from state:', departments); // 콘솔에 departments 출력
    }
  }, [departments]);

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
    if (mapLoaded && selectedHospital) {
      const { latitude, longitude } = selectedHospital;
      const mapDiv = document.getElementById(`map-${selectedHospital.id}`);
      if (mapDiv && window.naver && window.naver.maps) {
        const map = new window.naver.maps.Map(mapDiv, {
          center: new window.naver.maps.LatLng(latitude, longitude),
          zoom: 15,
        });

        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(latitude, longitude),
          map: map,
          title: selectedHospital.name,
        });
      }
    }
  }, [mapLoaded, selectedHospital]);

  // 현재 위치를 가져와서 상태에 저장
  useEffect(() => {
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`현재 위치 - 위도: ${latitude}, 경도: ${longitude}`);
            setCurrentLocation({ latitude, longitude });
          },
          (error) => {
            console.error('현재 위치를 가져오는 데 실패했습니다:', error);
          }
        );
      } else {
        console.error('현재 위치를 가져오는 데 실패했습니다.');
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!currentLocation) return;
      
      setLoading(true);
      try {
        const departmentNamesString = searchParams.departmentNames.join(', ');
  
        const response = await axiosInstance.get('/api/search', {
          params: {
            ...searchParams,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            departmentNames: departmentNamesString, // 문자열로 변환된 부서명 전달
          },
        });
      
        console.log('API 응답 데이터:', response.data);
      
        setHospitals(response.data.content);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        setError(error);
        console.error('fetching hospitals 에러:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchHospitals();
  }, [searchParams, currentPage, currentLocation]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleSearch = () => {
    const departmentNames = departmentInput.split(',').map(name => name.trim()).filter(name => name);
  
    setSearchParams(prev => ({
      ...prev,
      departmentNames, // 배열로 변환된 부서명 전달
      page: 0,
      size: pageSize,
    }));
  };

  const handleDepartmentInputChange = (e) => {
    setDepartmentInput(e.target.value); // 부서 입력 값 업데이트
  };

  const handleMapClick = (hospital) => {
    setSelectedHospital(hospital.id === selectedHospital?.id ? null : hospital);
  };

  const renderMap = () => {
    if (selectedHospital) {
      return (
        <div id={`map-${selectedHospital.id}`} style={{ width: '100%', height: '400px', marginTop: '20px' }}></div>
      );
    }
    return null;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 10;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div>
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handlePageClick(number)}
            disabled={number === currentPage}
          >
            {number + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <MainContainer>
      <div className="container">
        <h1>병원 검색하기</h1>
        <h2>검색</h2>
        <input
          type="text"
          value={departmentInput}
          onChange={handleDepartmentInputChange}
          placeholder="부서 입력"
        />
        <button onClick={handleSearch}>검색</button>

        {/* 병원 목록 렌더링 */}
        <ul>
          {hospitals.length > 0 ? (
            hospitals.map(hospital => (
              <li key={hospital.id}>
                <strong>{hospital.name}</strong> - {hospital.district} {hospital.subDistrict} - {hospital.telephoneNumber} - 
                {currentLocation && hospital.latitude !== null && hospital.longitude !== null
                  ? `${getDistance(currentLocation.latitude, currentLocation.longitude, hospital.latitude, hospital.longitude).toFixed(2)} km`
                  : '위치 정보 없음'}
                <button onClick={() => handleMapClick(hospital)}>
                  {selectedHospital?.id === hospital.id ? '지도 닫기' : '지도 보기'}
                </button>
                {renderMap()}
              </li>
            ))
          ) : (
            <p>No hospitals found</p>
          )}
        </ul>
        <div className="page-buttons">
          {totalPages > 1 && renderPageNumbers()}
        </div>
      </div>
    </MainContainer>
  );
};

export default HospitalList;
