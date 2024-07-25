import { atom } from 'recoil';

//토큰이 로컬 스토리지에 있으면 true 없으면 false
export const authState = atom({
  key: 'authState',
  default: {
    isLoggedIn: !!localStorage.getItem('token'),
    userId: null
  },
});
