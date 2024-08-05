import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
  return Math.abs(R * c); // 절댓값 적용
};

const HospitalList = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [departmentInput, setDepartmentInput] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [searchParams, setSearchParams] = useState({
    name: '',
    departmentName: '',
    address: '',
    page: 0,
    size: 10,
  });

  // 리뷰 관련 상태 추가
  const [hospitalReviews, setHospitalReviews] = useState({});
  const [reviewsLoading, setReviewsLoading] = useState({});
  const [reviewsPage, setReviewsPage] = useState({});

  const pageSize = 10;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/departments');
        setDepartments(response.data || []);
      } catch (error) {
        console.error('fetching departments 에러:', error);
      }
    };

    fetchDepartments();
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

  // useEffect(() => {
  //   const getCurrentLocation = () => {
  //     // 임의의 위치 설정
  //     const latitude = 37.5665;
  //     const longitude = 126.9780;
  //     console.log(`임의의 위치 - 위도: ${latitude}, 경도: ${longitude}`);
  //     setCurrentLocation({ latitude, longitude });
  //   };

  //   getCurrentLocation();
  // }, []);

  useEffect(() => {
    const fetchHospitals = async () => {
      if (!currentLocation) return;

      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/search', {
          params: {
            ...searchParams,
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          },
        });

        console.log('API 응답 데이터:', response.data);

        // 거리 계산 후 정렬
        const hospitalsWithDistance = response.data.content.map(hospital => ({
          ...hospital,
          distance: getDistance(currentLocation.latitude, currentLocation.longitude, hospital.latitude, hospital.longitude),
        }));

        const sortedHospitals = hospitalsWithDistance.sort((a, b) => a.distance - b.distance);

        setHospitals(sortedHospitals);
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

  const fetchReviews = async (hospitalId, page) => {
    setReviewsLoading(prev => ({ ...prev, [hospitalId]: true }));
    try {
      const response = await axios.get(`http://localhost:8080/api/hospitals/${hospitalId}/reviews`, {
        params: { page, size: pageSize },
      });
      
      setHospitalReviews(prev => ({
        ...prev,
        [hospitalId]: (prev[hospitalId] || []).concat(response.data.content),
      }));
      setReviewsPage(prev => ({ ...prev, [hospitalId]: page }));
    } catch (error) {
      console.error('Fetching reviews error:', error);
    } finally {
      setReviewsLoading(prev => ({ ...prev, [hospitalId]: false }));
    }
  };

  const handleLoadMoreReviews = (hospitalId) => {
    const nextPage = (reviewsPage[hospitalId] || 0) + 1;
    fetchReviews(hospitalId, nextPage);
  };

  const renderReviews = (hospitalId) => {
    const reviews = hospitalReviews[hospitalId] || [];
    const loading = reviewsLoading[hospitalId];
    const hasMoreReviews = reviews.length % pageSize === 0;

    return (
      <>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>{review.content}</li>
            ))}
          </ul>
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
        {hasMoreReviews && (
          <button onClick={() => handleLoadMoreReviews(hospitalId)} disabled={loading}>
            {loading ? '로딩 중...' : '리뷰 더보기'}
          </button>
        )}
      </>
    );
  };

  const handlePageClick = (page) => {
    setCurrentPage(page);
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handleSearch = () => {
    const [name, address] = searchInput.split(',').map(part => part.trim());
    setSearchParams({
      name: name || '',
      departmentName: selectedDepartment,
      address: address || '',
      page: 0,
      size: pageSize,
    });
  };

  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setDepartmentInput(e.target.value);
  };

  const handleFilter = (departmentName) => {
    setSelectedDepartment(departmentName);
    setDepartmentInput(departmentName);
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
    let endPage = Math.min(totalPages, startPage + maxPagesToShow);

    if (endPage - startPage < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow);
    }

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === currentPage}
        >
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading) return <p>로딩 중 ...</p>;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <MainContainer>
      <div className="container">
        <h1>병원 검색하기</h1>
        <h2>검색</h2>
        <input
          type="text"
          value={searchInput}
          onChange={handleInputChange}
          placeholder="병원 이름, 주소를 입력하세요 (예: '강남병원, 서울시 강남구')"
        />
        <button onClick={handleSearch}>검색</button>
        
        <h2>부서 필터링</h2>
        <select
          value={selectedDepartment}
          onChange={e => handleFilter(e.target.value)}
        >
          <option value="">모든 부서</option>
          {departments.map(department => (
            <option key={department.id} value={department.name}>
              {department.name}
            </option>
          ))}
        </select>

        <ul>
          {hospitals.length > 0 ? (
            hospitals.map(hospital => (
              <li key={hospital.id}>
                <strong>{hospital.name}</strong><br />{hospital.district} {hospital.subDistrict} - {hospital.telephoneNumber} &nbsp;
                {currentLocation && hospital.distance !== null
                  ? `${Math.abs(hospital.distance).toFixed(2)} km`
                  : '거리 정보를 가져올 수 없습니다.'}
                <ul>
                  {hospital.departments && hospital.departments.length > 0 ? (
                    hospital.departments.map(department => (
                      <li key={department.id}>
                        {department.name}
                      </li>
                    ))
                  ) : (
                    <li>부서 정보가 없습니다.</li>
                  )}
                </ul>
                <button onClick={() => handleMapClick(hospital)}>지도 보기</button>
                {selectedHospital?.id === hospital.id && renderMap()}
                {renderReviews(hospital.id)}
              </li>
            ))
          ) : (
            <p>병원이 없습니다</p>
          )}
        </ul>
        <div className="page-buttons">
          {renderPageNumbers()}
        </div>
      </div>
    </MainContainer>
  );
};

export default HospitalList;
