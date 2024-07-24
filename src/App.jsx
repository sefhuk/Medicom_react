import './App.css';
import { Outlet } from 'react-router-dom';
//import React, { useState } from 'react';



const App = () => {
  //const [isLoggedIn, setIsLoggedIn] = useState(false);

  /*const handleLogin = (userData) => {
    setIsLoggedIn(true);

  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
  };
*/
  return (
    <>
      <Outlet /> {}
    </>

  );
};

export default App;
