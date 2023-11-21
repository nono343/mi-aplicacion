import { useState, useEffect } from 'react';

function useToken() {
  function getToken() {
    const userToken = localStorage.getItem('token');
    return userToken && userToken;
  }

  const [token, setToken] = useState(getToken());

  function saveToken(userToken) {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  }

  function removeToken() {
    localStorage.removeItem('token');
    setToken(null);
    // Redirige a la página de inicio ("/") después de remover el token
    window.location.href = '/';
  }

  useEffect(() => {
    const expirationTime = 60 * 60 * 1000; // 1 hora en milisegundos
    const timeoutId = setTimeout(() => {
      removeToken();
    }, expirationTime);

    return () => clearTimeout(timeoutId);
  }, [token]);

  return {
    setToken: saveToken,
    token,
    removeToken,
  };
}

export default useToken;
