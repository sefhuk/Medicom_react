import React, { useEffect } from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css';
import { NavermapsProvider } from 'react-naver-maps';
import { LocationProvider } from './LocationContext';
import { useSetRecoilState } from 'recoil';
import { userauthState } from './utils/atom';
import { axiosInstance } from './utils/axios';

const App = () => {
  const setAuth = useSetRecoilState(userauthState);

  useEffect(() => {
    if (!!localStorage.getItem('token')) {
      setAuth(a => ({
        ...a,
        userId: Number(localStorage.getItem('userId')),
        role: localStorage.getItem('userRole')
      }));
      axiosInstance.defaults.headers.common['Authorization'] = localStorage.getItem('token');
    }
  }, []);

  return (
    <NavermapsProvider ncpClientId='327ksyij3n'>
      <LocationProvider>
        <div>
          {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/hospitals">Hospitals</Link>
            </li>
            <li>
              <Link to="/hospitals/maps">Maps</Link>
            </li>
          </ul>
        </nav> */}
          <Outlet />
        </div>
      </LocationProvider>
    </NavermapsProvider>
  );
};

export default App;
