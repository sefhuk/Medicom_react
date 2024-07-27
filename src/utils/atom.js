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