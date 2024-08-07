import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css';
import { NavermapsProvider } from 'react-naver-maps';
import { LocationProvider } from './LocationContext';
import LocationPage from './pages/LocationPage';
import OtherLocationPage from './pages/OtherLocationPage';



//import React, { useState } from 'react';



const App = () => {

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
