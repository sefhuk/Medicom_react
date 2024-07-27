import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SymptomAsk from './pages/SymptomAsk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import ChatPage from './pages/chat/ChatPage';
import ChatListPage from './pages/chat/ChatListPage';
import NewChatPage from './pages/chat/NewChatPage';
import HospitalList from './pages/Hospital/HospitalList';
import MapComponent from './pages/Hospital/MapComponent';
import Login from './pages/Login';
import Register from './pages/user/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import SocialLoginSuccess from './pages/SocialLoginSuccess';
import MyPage from './pages/user/MyPage';



const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <MainPage />
      },

      { path: 'chat/:chatRoomId/messages', element: <ChatPage /> },
      { path: 'chat/new', element: <NewChatPage /> },
      { path: 'chatlist', element: <ChatListPage /> },
      {path: 'hospitals', element: <HospitalList />},
      {path: 'hospitals/maps', element: <MapComponent />},
      
      //hospitalpage
      {path: '/symptoms', element: <SymptomAsk />},

      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {

        path: 'social-login-success',
        element: <SocialLoginSuccess />
      },
      {
        path: "my-page",
        element: <MyPage />

      }

    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </QueryClientProvider>
);
