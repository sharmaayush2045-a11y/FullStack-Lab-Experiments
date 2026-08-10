// src/utils/jwtHelper.js
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'jwt_auth_token';

export const generateMockJWT = (userData) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      ...userData,
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000),
    })
  );
  const signature = btoa("mock_secret_signature");
  return `${header}.${payload}.${signature}`;
};

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    return null;
  }
};