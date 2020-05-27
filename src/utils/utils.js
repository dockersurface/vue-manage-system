export const saveUserInfo = (token) => {
  localStorage.setItem('ms_username', 'admin');
  localStorage.setItem('token', token);
}
export const removeUserInfo = () => {
  localStorage.removeItem('ms_username');
  localStorage.removeItem('token');
}

export const imgHost = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8360' : 'https://www.lunaflower.club'
