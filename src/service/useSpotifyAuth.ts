import { useState, useEffect } from 'react';

export const useSpotifyAuth = (clientId: string) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar token salvo
    const token = localStorage.getItem('spotify_token');
    const expiry = localStorage.getItem('spotify_token_expiry');
    
    if (token && expiry && Date.now() < parseInt(expiry)) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }

    // Verificar se voltou do callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code && !token) {
      exchangeCodeForToken(code);
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch('http://127.0.0.1:3001/api/spotify/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();
      
      if (data.access_token) {
        const expiryTime = Date.now() + (data.expires_in * 1000);
        
        setAccessToken(data.access_token);
        setIsAuthenticated(true);
        
        localStorage.setItem('spotify_token', data.access_token);
        localStorage.setItem('spotify_token_expiry', expiryTime.toString());
        
        // Limpar URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    } catch (error) {
      console.error('Erro ao obter token:', error);
    }
  };

  const login = () => {
    const scopes = 'user-read-currently-playing user-read-playback-state';
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `client_id=${clientId}&` +
      `response_type=code&` +
      `redirect_uri=${encodeURIComponent('http://127.0.0.1:3000/callback')}&` +
      `scope=${encodeURIComponent(scopes)}`;
    
    window.location.href = authUrl;
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('spotify_token');
    localStorage.removeItem('spotify_token_expiry');
  };

  return { accessToken, isAuthenticated, login, logout };
};