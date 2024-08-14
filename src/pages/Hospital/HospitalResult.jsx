import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';  // useLocation을 import
import { axiosInstance } from '../../utils/axios';
import MainContainer from '../../components/global/MainContainer';
import { LocationContext } from '../../LocationContext';

// Haversine formula to calculate distance between two lat/lng points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const HospitalResult = () => {
  const location = useLocation(); // useLocation 훅 사용
  const departmentsFromState = location.state?.departments || []; // 전달된 departments를 가져옴

  const { latitude, longitude } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [departmentInput, setDepartmentInput] = useState('');
  const [departments, setDepartments] = useState(departmentsFromState); // 초기 상태로 설정
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchParams, setSearchParams] = useState({
    departmentNames: departmentsFromState,
    page: 0,
    size: 10,
  });

  const pageSize = 10;

  useEffect(() => {
    console.log('Received departments from navigate:', departmentsFromState); // 콘솔에 departments 값 출력
  }, [departmentsFromState]);

  useEffect(() => {
    if (departments.length > 0) {
      const departmentNames = departments.join(', ');
      console.log('Initialized departmentNames:', departmentNames); // 콘솔 출력
      setDepartmentInput(departmentNames);
    }
  }, [departments]); // departments가 변경될 때만 실행

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
    const fetchHospitals = async () => {
      if (!latitude || !longitude) return;

      setLoading(true);
      try {
        const departmentNamesString = searchParams.departmentNames.join(', ');

        const response = await axiosInstance.get('/api/search', {
          params: {
            ...searchParams,
            latitude,
            longitude,
            departmentNames: departmentNamesString,
          },
        });

        console.log('API 응답 데이터:', response.data);

        let hospitalsData = response.data.content;

        hospitalsData.sort((a, b) => a.distance - b.distance);

        setHospitals(hospitalsData);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        setError(error);
        console.error('fetching hospitals 에러:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [searchParams, currentPage, latitude, longitude]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleSearch = () => {
    const departmentNames = departmentInput.split(',').map(name => name.trim()).filter(name => name);

    setSearchParams(prev => ({
      ...prev,
      departmentNames,
      page: 0,
      size: pageSize,
    }));
  };

  const handleDepartmentInputChange = (e) => {
    setDepartmentInput(e.target.value);
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
                {latitude && longitude && hospital.latitude !== null && hospital.longitude !== null
                  ? `${getDistance(latitude, longitude, hospital.latitude, hospital.longitude).toFixed(2)} km`
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

export default HospitalResult;
