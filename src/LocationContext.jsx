// LocationContext.js
import React, { createContext, useState, useEffect } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  // 초기값은 로컬 스토리지에서 가져온 값 또는 기본값
  const [latitude, setLatitude] = useState(localStorage.getItem('latitude') || '');
  const [longitude, setLongitude] = useState(localStorage.getItem('longitude') || '');
  const [address, setAddress] = useState(localStorage.getItem('address') || '내 위치 설정');

  useEffect(() => {
    // 위치가 변경될 때마다 로컬 스토리지에 저장
    localStorage.setItem('latitude', latitude);
    localStorage.setItem('longitude', longitude);
    localStorage.setItem('address', address);
  }, [latitude, longitude, address]);

  return (
    <LocationContext.Provider value={{ latitude, longitude, address, setLatitude, setLongitude, setAddress }}>
      {children}
    </LocationContext.Provider>
  );
};
