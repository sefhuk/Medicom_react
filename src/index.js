import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './pages/MainPage';
import Login from './pages/Login';
import Register from './pages/user/Register';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import ChatPage from './pages/chat/ChatPage';
import ChatListPage from './pages/chat/ChatListPage';
import NewChatPage from './pages/chat/NewChatPage';
import HospitalList from './pages/Hospital/HospitalList';
import MapComponent from './pages/Hospital/MapComponent';
import SocialLoginSuccess from './pages/SocialLoginSuccess';
import MyPage from './pages/user/MyPage';
import AdminPage from './pages/admin/AdminPage';
import SymptomAsk from './pages/SymptomAsk'
import HospitalReservation from './pages/Hospital/HospitalReservation.jsx';
import UserList from './pages/admin/UserList';
import AdminUserListDetail from './pages/admin/AdminUserListDetail';
import AdminChatList from './pages/admin/AdminChatList';
import MyActivity from './pages/user/MyActivity';
import BoardListPage from './pages/board/BoardListPage';
import CreateBoardPage from './pages/board/CreateBoardPage';
import BoardDetailPage from './pages/board/BoardDetailPage';
import CreatePostPage from './pages/board/CreatePostPage';
import PostDetailPage from './pages/board/PostDetailPage';
import UpdateBoardPage from './pages/board/UpdateBoardPage';
import UpdatePostPage from './pages/board/UpdatePostPage';
import MyReviews from './pages/user/MyReivews';
import { AdminCreateDoctorProfile } from './pages/admin/AdminCreateDoctorProfile';
import LocationPage from './pages/LocationPage.jsx';
import { LocationProvider } from './LocationContext.jsx';


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
      {path: 'location', element: <LocationPage />},
      {path: '/symptoms', element: <SymptomAsk />},
      {path: 'hospitals/maps/:hospitalid/reservation', element: <HospitalReservation />},
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: 'admin-page',
        element: <AdminPage />,
      },
      {
        path: 'admin-page/chat-list',
        element: <AdminChatList />
      },
      {
        path: 'admin-page/user-list',
        element: <UserList />
      },
      {
        path: 'admin-page/user-list/user-detail',
        element: <AdminUserListDetail />
      },
      {
        path: 'admin-page/user-list/user-detail/doctor-profile',
        element: <AdminCreateDoctorProfile />
      },
      {

        path: 'social-login-success',
        element: <SocialLoginSuccess />
      },
      {
        path: "my-page",
        element: <MyPage />

      },

      {
        path: "my-activity",
        element: <MyActivity />
      },

      //board
      { path: 'boards', element: <BoardListPage /> },
      { path: 'boards/create', element: <CreateBoardPage /> },
      { path: 'boards/:id', element: <BoardDetailPage /> },
      { path: 'posts/create/:boardId', element: <CreatePostPage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'boards/update/:id', element: <UpdateBoardPage /> },
      { path: 'posts/update/:id', element: <UpdatePostPage /> },

      {
        path: 'my-reviews', // 새로운 경로 추가
        element: <MyReviews />
      },

    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <RecoilRoot>
      <LocationProvider> {/* 추가 */}
        <RouterProvider router={router} />
      </LocationProvider> {/* 추가 */}
    </RecoilRoot>
  </QueryClientProvider>
);
