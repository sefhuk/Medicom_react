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
  const { setLatitude, setLongitude, setAddress: setContextAddress } = useContext(LocationContext);
  const navigate = useNavigate();

    // 주소 유효성 검사
    const validateAddress = (input) => {
      if (input.length > 0) {
        // 특수문자 검사
        const specialCharPattern = /[%=><]/;
        if (specialCharPattern.test(input)) {
          alert("특수문자를 입력할 수 없습니다.");
          return false;
        }
  
        // SQL 예약어 검사
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
    
    // //도로명 주소 검색(클라이언트)
    // const handleSearch = async () => {
    //   if (!validateAddress(address)) {
    //     return; // 유효하지 않은 경우 검색하지 않음
    //   }
  
    //   try {
    //     const response = await (`https://www.juso.go.kr/addrlink/addrLinkApi.do?confmKey=devU01TX0FVVEgyMDI0MDgwODIwMDI0MTExNDk5ODk=&currentPage=1&countPerPage=10&keyword=${encodeURIComponent(address)}&resultType=json`);
    //     const data = await response.json();
    //     if (data.results && data.results.juso) {
    //       setResults(data.results.juso);
    //     } else {
    //       setResults([]);
    //     }
    //   } catch (error) {
    //     console.error('주소 데이터를 가져오는 중 오류가 발생했습니다:', error);
    //     setResults([]);
    //   }
    // };


    const handleSearch = async () => {
      if (!validateAddress(address)) {
        return; // 유효하지 않은 경우 검색하지 않음
      }
  
      try {
        const response = await axiosInstance.get(`api/geocode/search-address?address=${address}`);
        const data = await response.json();
        if (data.results && data.results.juso) {
          setResults(data.results.juso);
        } else {
          setResults([]);
        }
      } catch (error) {
        console.error('주소 데이터를 가져오는 중 오류가 발생했습니다:', error);
        setResults([]);
      }
    };


  // 검색된 주소 선택
  const handleSelect = (address) => {
    setSelectedAddress(address);
  };



  // 선택된 주소로 위도, 경도 조회 후 Context에 저장 
  const handleSubmit = async () => {
    if (selectedAddress) {
      
      try {
        const encodedAddress = encodeURIComponent(selectedAddress.jibunAddr);
        const response = await axiosInstance.get(`/api/geocode/address-to-coords?address=${encodedAddress}`);
        const data = response.data;
        
        console.log('Geocode API response:', data); // 응답 데이터 확인
  
        if (data && data.addresses && data.addresses.length > 0) {
          const { roadAddress, x, y } = data.addresses[0];
  
          setLatitude(y);
          setLongitude(x);
          setContextAddress(roadAddress);
  
          navigate('/location');
        } else {
          console.error('Invalid geocode data: ', data);
        }
      } catch (error) {
        console.error('Error handling selected address:', error);
      }
    }
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
        <Button onClick={handleSearch} variant="contained" color="primary" sx={{ marginTop: 2 }}>
          검색
        </Button>
        <Box sx={{ marginTop: 2 }}>
          {results.map((result, index) => (
            <Box key={index} onClick={() => handleSelect(result)} sx={{ padding: 1, cursor: 'pointer', border: '1px solid #ccc', marginBottom: 1 }}>
              <Typography>{result.roadAddr}</Typography>
            </Box>
          ))}
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
