// import React from 'react';
// import { Outlet, Link } from 'react-router-dom';
// import './App.css';
// import { NavermapsProvider } from 'react-naver-maps';
//
//
// //import React, { useState } from 'react';
//
//
//
// const App = () => {
//
//   return (
//
//     <NavermapsProvider ncpClientId='327ksyij3n'>
//       <div>
//         {/* <nav>
//           <ul>
//             <li>
//               <Link to="/">Home</Link>
//             </li>
//             <li>
//               <Link to="/hospitals">Hospitals</Link>
//             </li>
//             <li>
//               <Link to="/hospitals/maps">Maps</Link>
//             </li>
//           </ul>
//         </nav> */}
//         <Outlet />
//       </div>
//     </NavermapsProvider>
//
//
//
//
//   );
// };
//
// export default App;

import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';

function App() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default App;
