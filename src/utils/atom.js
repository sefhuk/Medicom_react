import { atom } from 'recoil';


export const chatRoomState = atom({
  key: 'chatRoomState',
  default: { rooms: {} }
});

//오류나서 추가한 코드
export const authState = atom({
  key: 'authState',
  default: { isAuthenticated: false, user: null }
});

//토큰이 로컬 스토리지에 있으면 true 없으면 false
export const userauthState = atom({
  key: 'userauthState',
  default: {
    isLoggedIn: !!localStorage.getItem('token'),
    userId: null,
    role: null
  },
});

