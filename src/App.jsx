// import './App.css';
// import { Outlet } from 'react-router-dom';
// import Footer from './components/Footer';
// import SearchBar from './components/board/SearchBar';
// import {useEffect, useState} from "react";
// import axios from "axios";
//
// function App() {
//   return (
//     <div>
//       <SearchBar />
//       <Outlet />
//       <Footer />
//     </div>
//   );
// }
//
// export default App;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';
import SearchBar from './components/board/SearchBar';

function App() {
  return (
    <div>
      <SearchBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default App;
