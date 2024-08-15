import React, { useEffect, useState, useContext } from 'react';
import MainContainer from '../../components/global/MainContainer';
import HospitalReviewCard from '../../components/HospitalReviewCard';
import { axiosInstance } from '../../utils/axios';
import { Box, Typography, Button, TextField, Select, MenuItem, List, ListItem, FormControl, InputLabel, Grid, IconButton } from '@mui/material';
import { LocationContext } from '../../LocationContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import RemoveIcon from '@mui/icons-material/Remove';
import { Loading } from "../../components/Loading";
import { Btn, Btntwo, SmallBtn, TextF } from '../../components/global/CustomComponents';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const HospitalList = (hospital) => {
  const { latitude, longitude } = useContext(LocationContext);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [setDepartmentInput] = useState('');
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();
  const [showReviews, setShowReviews] = useState(false);
  const [searchParams, setSearchParams] = useState({
    name: '',
    departmentName: '',
    address: '',
    page: 0,
    size: 5,
  });

  // 리뷰 관련 상태 추가
  const [hospitalReviews, setHospitalReviews] = useState({});
  const [reviewsLoading, setReviewsLoading] = useState({});
  const [reviewsPage, setReviewsPage] = useState({});
  const [reviewsLoaded, setReviewsLoaded] = useState({});
  const [hasMoreReviews, setHasMoreReviews] = useState({});

  // 북마크 상태
  const [bookmarks, setBookmarks] = useState([]);
  const [bookmarksLoading, setBookmarksLoading] = useState(false);

  const pageSize = 5;
  const reviewPageSize = 4;

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/api/departments');
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
    const fetchHospitals = async () => {
      if (!latitude || !longitude) return;
  
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/search', {
          params: {
            ...searchParams,
            latitude,
            longitude,
          },
        });
  
        console.log('API 응답 데이터:', response.data);
  
        // 서버에서 가져온 데이터
        let hospitalsData = response.data.content;
  
        // 거리 기준으로 오름차순 정렬
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

  useEffect(() => {
    const fetchBookmarks = async () => {
      setBookmarksLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axiosInstance.get('/bookmark', {
          headers: {
            Authorization: `${token}`
          }
        });
        setBookmarks(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setBookmarksLoading(false);
      }
    };

    fetchBookmarks(); // 컴포넌트가 마운트될 때 북마크 데이터를 로드함
  }, []);

  const fetchReviews = async (hospitalId, page = 0) => {
    setReviewsLoading(prev => ({ ...prev, [hospitalId]: true }));
    try {
      const response = await axiosInstance.get(`/review/${hospitalId}/Page`, {
        params: { page, size: reviewPageSize },
      });

      const totalPages = response.data.totalPages;
      const currentPage = response.data.number;

      const reviewsWithUsernames = await Promise.all(
        response.data.content.map(async review => {
          try {
            const userResponse = await axiosInstance.get(`/review/findUser/${review.userId}`);
            return {
              ...review,
              userName: userResponse.data,
            };
          } catch (error) {
            console.error(error);
            return {
              ...review,
              userName: '탈퇴한 유저'
            };
          }
        })
      );

      setHospitalReviews(prev => ({
        ...prev,
        [hospitalId]: (prev[hospitalId] || []).concat(reviewsWithUsernames),
      }));
      setReviewsPage(prev => ({ ...prev, [hospitalId]: page }));
      setReviewsLoaded((prev) => ({ ...prev, [hospitalId]: true }));
      setHasMoreReviews((prev) => ({
        ...prev,
        [hospitalId]: currentPage < totalPages - 1,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setReviewsLoading(prev => ({ ...prev, [hospitalId]: false }));
    }
  };

  const handleLoadMoreReviews = (hospitalId) => {
    const nextPage = reviewsPage[hospitalId] !== undefined ? reviewsPage[hospitalId] + 1 : 0;
    fetchReviews(hospitalId, nextPage);
  };

  const handleCloseReviews = (hospitalId) => {
    setHospitalReviews(prev => ({
      ...prev,
      [hospitalId]: [],
    }));
    setReviewsPage(prev => ({
      ...prev,
      [hospitalId]: -1,
    }));
    setReviewsLoaded(prev => ({
      ...prev,
      [hospitalId]: false,
    }));
  };

  const handleAddBookmark = async (hospitalId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      const bookmarkDTO = {
        userId: userId,
        hospitalId: hospitalId,
      };
      await axiosInstance.post('/bookmark', bookmarkDTO, {
        headers: {
          Authorization: `${token}`
        }
      });
      setBookmarks([...bookmarks, { hospitalId }]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRemoveBookmark = async (hospitalId) => {
    try {
      const token = localStorage.getItem('token');

      await axiosInstance.delete(`/bookmark/${hospitalId}`, {
        headers: {
          Authorization: `${token}`
        }
      });
      setBookmarks(bookmarks.filter(bookmark => bookmark.hospitalId !== hospitalId));
    } catch (error) {
      console.error(error);
    }
  };

  const isBookmarked = (hospitalId) => {
    return bookmarks.some(bookmark => bookmark.hospitalId === hospitalId);
  };

  const commonButtonStyles = (loading, color) => ({
    borderColor: loading ? 'grey.500' : `${color}.main`,
    color: loading ? 'grey.500' : `${color}.main`,
    '&:hover': {
      borderColor: loading ? 'grey.500' : `${color}.dark`,
      color: loading ? 'grey.500' : 'black',
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    },
    padding: '6px 14px',
    fontSize: '14px',
    borderRadius: '6px',
    margin: '3px',
    transition: 'all 0.3s ease', // 부드러운 전환
  });
  
  const renderReviews = (hospitalId) => {
    const reviews = hospitalReviews[hospitalId] || [];
    const loading = reviewsLoading[hospitalId];
    const loaded = reviewsLoaded[hospitalId]; // 리뷰 로드 여부
    const moreReviews = hasMoreReviews[hospitalId];
  
    if (!loaded) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Btn
            onClick={() => handleLoadMoreReviews(hospitalId)}
            disabled={loading}
          >
            {loading ? '로딩 중...' : '리뷰 더보기'}
          </Btn>
        </Box>
      );
    }
  
    return (
      <>
        {reviews.length > 0 ? (
          <ul>
            {reviews.map((review, index) => (
              <li key={index}>
                <HospitalReviewCard review={review} />
              </li>
            ))}
          </ul>
        ) : (
          <p>리뷰가 없습니다.</p>
        )}
        {moreReviews && (
          <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <Btn
              onClick={() => handleLoadMoreReviews(hospitalId)}
              disabled={loading}
              sx={commonButtonStyles(loading, 'primary')}
            >
              {loading ? '로딩 중...' : '리뷰 더보기'}
            </Btn>
          </Box>
        )}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
          <Btn
            onClick={() => handleCloseReviews(hospitalId)}
          >
            리뷰 닫기
          </Btn>
        </Box>
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
  const handlePageChange = (event, value) => {
    setCurrentPage(value - 1); // MUI Pagination 컴포넌트는 1부터 시작하므로 0부터 시작하는 값으로 변환
  };

  const handleDepartmentChange = (e) => {
    setDepartmentInput(e.target.value);
  };


  const handleFilter = (departmentName) => {
    setSelectedDepartment(departmentName);
  };

  const handleMapClick = (hospital) => {
    // 선택된 병원이 현재 선택된 병원과 같은지 비교하여 상태를 업데이트
    const newSelectedHospital = hospital.id === selectedHospital?.id ? null : hospital;
    setSelectedHospital(newSelectedHospital);
    setShowReviews(true); // 지도를 보여주고 리뷰도 보이게 설정
  };

  // 현재 선택된 병원과 동일한 병원인지 체크하여 아이콘 결정
  const isHospitalSelected = selectedHospital?.id === hospital.id;

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
    const maxPagesToShow = 5;
    let startPage = Math.max(0, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow);

    if (endPage - startPage < maxPagesToShow) {
      startPage = Math.max(0, endPage - maxPagesToShow);
    }

    for (let i = startPage; i < endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={i === currentPage}
           sx={{
            color: i === currentPage ? 'black' : '#0a7729', // 글자색 설정
            borderRadius: '20px',
            border: '1px solid gray',
            margin: '0 4px',
            padding: '6px 12px',
            '&:hover': {
              backgroundColor: '#f3f4f0',
            },
          }}
        >
          {i + 1}
        </Button>
      );
    }
    return pageNumbers;
  };



  //예약 관련 코드
  const handleReservation = (hospital) => {
    if (hospital) {
      console.log(hospital.id);
      navigate(`/hospitals/maps/${hospital.id}/reservation`, {
      state: { hospital }
    });
    } else {
      setError('예약할 병원을 선택해주세요.');
    }
  };


  useEffect(() => {
    const fetchHospitals = async () => {
      if (!latitude || !longitude) return;

      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/search', {
          params: {
            ...searchParams,
            latitude,
            longitude,
          },
        });

        let hospitalsData = response.data.content;

        const hospitalsWithAvgRating = await Promise.all(
          hospitalsData.map(async (hospital) => {
            const avgRatingAndReviewCount = await fetchAvgRatingAndReviewCount(hospital.id);
            return {
              ...hospital,
              avgRating: avgRatingAndReviewCount ? avgRatingAndReviewCount.avgRating : 0.0,
              reviewCount: avgRatingAndReviewCount ? avgRatingAndReviewCount.reviewCount : 0,
            };
          })
        );

        hospitalsWithAvgRating.sort((a, b) => a.distance - b.distance);

        setHospitals(hospitalsWithAvgRating);
        setTotalPages(response.data.totalPages || 0);
      } catch (error) {
        setError(error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [searchParams, currentPage, latitude, longitude]);

  const fetchAvgRatingAndReviewCount = async (hospitalId) => {
    try {
      const response = await axiosInstance.get(`/review/avg/${hospitalId}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };


  if (loading) return <Loading open={true} />;
  if (error) return <p>Error fetching data: {error.message}</p>;

  return (
    <MainContainer>
      <Box className="container" sx={{ padding: 2, marginLeft: 2, marginRight: 2 }}>
        <Typography variant="h5" sx={ {fontWeight:'bold'}}>병원 검색하기</Typography>

        <Grid container spacing={2} sx={{ marginTop: 2, flexWrap: 'nowrap' }}>
        <Grid item xs={2} sm={2} md={2}>
    <FormControl fullWidth variant="outlined">
      <InputLabel id="department-select-label" sx={{ textAlign: 'center' }}>부서</InputLabel>
      <Select
        labelId="department-select-label"
        value={selectedDepartment}
        onChange={e => handleFilter(e.target.value)}
        sx={{
          borderRadius: '30px',
          textAlign: 'center',
        }}
        label="부서"
      >
        <MenuItem value="">
          <em>부서</em>
        </MenuItem>
        {departments.map(department => (
          <MenuItem key={department.id} value={department.name}>
            {department.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>

  <Grid item xs={7} sm={7} md={7}>
    <TextF
      fullWidth
      type="text"
      value={searchInput}
      onChange={handleInputChange}
      placeholder="병원 이름 또는 주소를 입력"
      variant="outlined"
      sx={{ marginBottom: { xs: '10px', sm: 0 } }} // 작은 화면에서 margin 조정
    />
  </Grid>

  <Grid item xs={3} sm={3} md={3}>
    <Btntwo
      onClick={handleSearch}
      sx={{ width: '100%' }} // 버튼을 전체 너비로 설정
    >
      SEARCH
    </Btntwo>
  </Grid>
</Grid>


        <List sx={{ border: '1px solid #ddd', borderRadius: '20px', padding: '0', marginTop: '20px' }}>
          {hospitals.length > 0 ? (
            hospitals.map((hospital, index) => (
              <ListItem
                key={hospital.id}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  borderBottom: index === hospitals.length - 1 ? 'none' : '1px solid #ddd',
                  padding: '20px'
                }}
              >
                <Box sx={{ width: '100%', marginBottom: '10px' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <IconButton
                      onClick={() => isBookmarked(hospital.id) ? handleRemoveBookmark(hospital.id) : handleAddBookmark(hospital.id)}
                      sx={{color: '#4a885d', marginLeft:'-7px' }}
                    >
                      {isBookmarked(hospital.id) ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <Typography variant="h6" component="strong">
                      {hospital.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', marginBottom: '10px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <LocationOnIcon sx={{ marginRight: '8px', color: '#4a885d' }} />
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                        {hospital.address}
                      </Typography>
                      <Typography variant="body2" sx={{ marginLeft: 'auto' }}>
                        {latitude && longitude && hospital.distance !== null
                          ? `${Math.abs(hospital.distance).toFixed(2)} km`
                          : '거리 정보를 가져올 수 없습니다.'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <StarIcon sx={{ color: 'gold', marginRight: '6px', marginLeft:'1px' }} />
                    <Typography variant="body2">
                      평균 평점: {hospital.avgRating !== undefined ? hospital.avgRating.toFixed(1) : "평점 없음"} ({hospital.reviewCount || 0} 리뷰)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <Typography variant="body2">진료과목:</Typography>
                    {hospital.departments && hospital.departments.length > 0 ? (
                      hospital.departments.map(department => (
                        <Box key={department.id} sx={{ padding: '5px', border: '1px solid #ccc', borderRadius: '5px', whiteSpace: 'nowrap' }}>
                          <Typography variant="body2">{department.name}</Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body2">부서 정보가 없습니다.</Typography>
                    )}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <Typography variant="body2">
                    전화번호 :
                    <a href={`tel:${hospital.telephoneNumber}`} style={{ textDecoration: 'none', color: 'inherit', marginLeft: '8px' }}>
                      {hospital.telephoneNumber}
                    </a>
                  </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SmallBtn

                        onClick={() => handleReservation(hospital)}
                      >
                        예약
                      </SmallBtn>
                      <IconButton
                        onClick={() => handleMapClick(hospital)}
                        sx={{ color: '#4a885d' }}
                      >
                        {isHospitalSelected ? <AddIcon /> : <RemoveIcon />}
                      </IconButton>
                    </Box>
                  </Box>
                </Box>
                {selectedHospital?.id === hospital.id && (
                  <Box sx={{ width: '100%' }}>
                    {renderMap()}
                    {renderReviews(hospital.id)}
                  </Box>
                )}
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" sx={{ padding: '10px' }}>병원이 없습니다</Typography>
          )}
        </List>
        
        {/* 페이지네이션 */}
        <Stack spacing={2} sx={{ alignItems: 'center', marginTop: '20px' }}>
          <Pagination
            count={totalPages}                // 총 페이지 수
            page={currentPage}                // 현재 페이지
            size="small"                      // 사이즈 설정
            onChange={handlePageChange}       // 페이지 변경 시 호출되는 함수
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '20px',
                border: '1px solid gray',
                margin: '0 4px',
                padding: '6px 12px',
                color: '#0a7729',
                '&.Mui-selected': {
                  color: 'black',
                  backgroundColor: '#f3f4f0',
                },
                '&:hover': {
                  backgroundColor: '#f3f4f0',
                },
              },
            }}
          />
        </Stack>
      
      </Box>
    </MainContainer>

  );
};

export default HospitalList;
