export const saveUserInfo = (token) => {
  localStorage.setItem('ms_username', 'admin');
  localStorage.setItem('token', token);
}
export const removeUserInfo = () => {
  localStorage.removeItem('ms_username');
  localStorage.removeItem('token');
}
