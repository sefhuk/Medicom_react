import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import './App.css';
import { NavermapsProvider } from 'react-naver-maps';

function App() {
  return (
    <NavermapsProvider ncpClientId='327ksyij3n'>
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
    </NavermapsProvider>
  );
}

export default App;