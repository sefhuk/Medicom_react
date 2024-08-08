import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { Box, Button, TextField, Typography } from '@mui/material';
import { LocationContext } from '../LocationContext';
import MainContainer from '../components/global/MainContainer';

function OtherLocationPage() {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { setLatitude, setLongitude, setAddress: setContextAddress } = useContext(LocationContext);
  const navigate = useNavigate();

  const handleSearch = async () => {
    const response = await fetch(`http://localhost:8080/api/geocode/address-to-coords?address=${encodeURIComponent(address)}`);
    const data = await response.json();
    if (data && data.addresses) {
      setResults(data.addresses);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleSubmit = () => {
    if (selectedAddress) {
      const lat = selectedAddress.y;
      const lng = selectedAddress.x;
      const addr = selectedAddress.roadAddress;

      // LocationContext에 위도, 경도, 주소를 저장
      setLatitude(lat);
      setLongitude(lng);
      setContextAddress(addr);

      // 위치 갱신
      navigate('/location'); 
    }
  };

  return (
    <MainContainer>
      <Box sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>도로명 주소로 검색하세요.</Typography>
        <Typography variant="h7" gutterBottom>예시 : 위례성대로 2</Typography>
        <TextField
          variant="outlined"
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
              <Typography>{result.roadAddress}</Typography>
            </Box>
          ))}
        </Box>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ marginTop: 2 }}>
          이 위치로 이동
        </Button>
      </Box>
    </MainContainer>
  );
}

export default OtherLocationPage;
