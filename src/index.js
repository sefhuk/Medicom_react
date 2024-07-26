import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainPage from './pages/MainPage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RecoilRoot } from 'recoil';
import ChatPage from './pages/chat/ChatPage';
import ChatListPage from './pages/chat/ChatListPage';
import NewChatPage from './pages/chat/NewChatPage';

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
      { path: 'chatlist', element: <ChatListPage /> }
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
