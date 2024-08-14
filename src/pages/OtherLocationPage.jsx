import React, { useState, useContext } from 'react';
import { axiosInstance } from '../utils/axios';
import { useNavigate } from 'react-router';
import { Box, Button, TextField, Typography } from '@mui/material';
import { LocationContext } from '../LocationContext';
import MainContainer from '../components/global/MainContainer';
import { CustomScrollBox } from '../components/CustomScrollBox';

function OtherLocationPage() {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지를 관리
  const [totalCount, setTotalCount] = useState(0); // 전체 결과 수를 관리

  const { setLatitude, setLongitude, setAddress: setContextAddress } = useContext(LocationContext);
  const navigate = useNavigate();

  // 주소 유효성 검사
  const validateAddress = (input) => {
    if (input.length > 0) {
      const specialCharPattern = /[%=><]/;
      if (specialCharPattern.test(input)) {
        alert("특수문자를 입력할 수 없습니다.");
        return false;
      }

      const sqlKeywords = [
        "OR", "SELECT", "INSERT", "DELETE", "UPDATE", "CREATE", "DROP", "EXEC",
        "UNION", "FETCH", "DECLARE", "TRUNCATE"
      ];

      for (let keyword of sqlKeywords) {
        const regex = new RegExp(`\\b${keyword}\\b`, "gi");
        if (regex.test(input)) {
          alert(`"${keyword}"와 같은 특정문자는 검색할 수 없습니다.`);
          return false;
        }
      }
    }
    return true;
  };

  // 페이지 변경 함수
  const goToPage = (pageNum) => {
    setCurrentPage(pageNum);
    handleSearch(pageNum);
  };

  const handleSearch = async (page = 1) => {
    if (!validateAddress(address)) {
      return;
    }

    try {
      const response = await axiosInstance.get(`/api/geocode/search-address?address=${address}&currentPage=${page}`);
      const data = response.data;

      if (data.results && data.results.juso) {
        setResults(data.results.juso);
        setTotalCount(parseInt(data.results.common.totalCount, 10));
      } else {
        setResults([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error('주소 데이터를 가져오는 중 오류가 발생했습니다:', error);
      setResults([]);
      setTotalCount(0);
    }
  };

  const handleSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleSubmit = async () => {
    if (selectedAddress) {
      try {
        const encodedAddress = encodeURIComponent(selectedAddress.jibunAddr);
        const response = await axiosInstance.get(`/api/geocode/address-to-coords?address=${encodedAddress}`);
        const data = response.data;

        console.log('Geocode API response:', data);

        if (data && data.addresses && data.addresses.length > 0) {
          const { x, y } = data.addresses[0];

          setLatitude(y);
          setLongitude(x);
          setContextAddress(selectedAddress.roadAddr);

          navigate('/location');
        } else {
          console.error('Invalid geocode data: ', data);
        }
      } catch (error) {
        console.error('Error handling selected address:', error);
      }
    }
  };


  const renderPagination = () => {
    const totalPages = Math.ceil(totalCount / 10); // 10개씩 페이지네이션
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <Button key={i} onClick={() => goToPage(i)} variant={currentPage === i ? 'contained' : 'outlined'}>
          {i}
        </Button>
      );
    }

    return pages;
  };

  return (
    <MainContainer>
      <CustomScrollBox>
        <Box sx={{ padding: 2 }}>
          <Typography variant="h5" gutterBottom>도로명 주소로 검색하세요.</Typography>
          <Typography variant="h7" gutterBottom>예시 : 위례성대로 2</Typography>
          <TextField
            variant="standard"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Button onClick={() => handleSearch(1)} variant="contained" color="primary" sx={{ marginTop: 2 }}>
            검색
          </Button>
          <Box sx={{ marginTop: 2 }}>
            {results.map((result, index) => (
              <Box key={index} onClick={() => handleSelect(result)} sx={{ padding: 1, cursor: 'pointer', border: '1px solid #ccc', marginBottom: 1 }}>
                <Typography>{result.roadAddr}</Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
            {renderPagination()}
          </Box>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ marginTop: 2 }}>
            이 위치로 이동
          </Button>
        </Box>
      </CustomScrollBox>
    </MainContainer>
  );
}

export default OtherLocationPage;
