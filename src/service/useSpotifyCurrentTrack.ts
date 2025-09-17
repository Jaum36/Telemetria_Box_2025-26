import { useState, useEffect } from 'react';
import axios from 'axios';

interface CurrentTrack {
  name: string;
  artist: string;
  album: string;
  albumCover: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
}

interface SpotifyCurrentTrackHook {
  currentTrack: CurrentTrack | null;
  isLoading: boolean;
  error: string | null;
}

export const useSpotifyCurrentTrack = (accessToken: string | null): SpotifyCurrentTrackHook => {
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setCurrentTrack(null);
      return;
    }

    const fetchCurrentTrack = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (response.status === 200 && response.data) {
          const track = response.data;
          
          setCurrentTrack({
            name: track.item.name,
            artist: track.item.artists.map((artist: any) => artist.name).join(', '),
            album: track.item.album.name,
            albumCover: track.item.album.images[0]?.url || '',
            isPlaying: track.is_playing,
            progress: track.progress_ms,
            duration: track.item.duration_ms
          });
        } else if (response.status === 204) {
          // Nenhuma música tocando
          setCurrentTrack(null);
        }
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('Token expirado. Faça login novamente.');
        } else if (err.response?.status === 204) {
          setCurrentTrack(null);
        } else {
          setError('Erro ao buscar música atual');
          console.error('Erro ao buscar música atual:', err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Buscar imediatamente
    fetchCurrentTrack();

    // Atualizar a cada 5 segundos
    const interval = setInterval(fetchCurrentTrack, 5000);

    return () => clearInterval(interval);
  }, [accessToken]);

  return {
    currentTrack,
    isLoading,
    error
  };
};