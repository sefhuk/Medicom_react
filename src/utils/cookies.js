export const deleteCookie = (name) => {
  document.cookie = name + '=; Max-Age=0; path=/';
};