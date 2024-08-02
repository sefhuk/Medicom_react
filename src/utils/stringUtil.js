export const GetUserRoleString = (role) => {
  if(role === 'USER'){
    return '일반 회원';
  } else if(role === 'DOCTOR'){
    return '의사';
  } else return '관리자';
}