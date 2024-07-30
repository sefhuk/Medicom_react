//import React from 'react';
//import ReactDOM from 'react-dom/client';
//import './index.css';
//import App from './App';
//import { createBrowserRouter, RouterProvider } from 'react-router-dom';
//import MainPage from './pages/MainPage';
//
//const router = createBrowserRouter([
//  {
//    path: '/',
//    element: <App />,
//    children: [
//      {
//        path: '',
//        element: <MainPage />
//      }
//    ]
//  }
//]);
//
//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<RouterProvider router={router} />);

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import MainPage from './pages/MainPage';
import BoardListPage from './pages/BoardListPage';
import CreateBoardPage from './pages/CreateBoardPage';
import BoardDetailPage from './pages/BoardDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import PostDetailPage from './pages/PostDetailPage';
import UpdateBoardPage from './pages/UpdateBoardPage';
import UpdatePostPage from './pages/UpdatePostPage';

// 라우터 설정
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: '', element: <MainPage /> },
      { path: 'boards', element: <BoardListPage /> },
      { path: 'boards/create', element: <CreateBoardPage /> },
      { path: 'boards/:id', element: <BoardDetailPage /> },
      { path: 'posts/create/:boardId', element: <CreatePostPage /> },
      { path: 'posts/:id', element: <PostDetailPage /> },
      { path: 'boards/update/:id', element: <UpdateBoardPage /> },
      { path: 'posts/update/:id', element: <UpdatePostPage /> }
    ]
  }
]);

// React 애플리케이션 렌더링
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
