import React from 'react';

interface CurrentTrack {
  name: string;
  artist: string;
  album: string;
  albumCover: string;
  isPlaying: boolean;
  progress: number;
  duration: number;
}

interface SpotifyNowPlayingProps {
  currentTrack: CurrentTrack | null;
  isLoading: boolean;
  error: string | null;
  onLogin: () => void;
  onLogout: () => void;
  isAuthenticated: boolean;
}

const SpotifyNowPlaying: React.FC<SpotifyNowPlayingProps> = ({
  currentTrack,
  isLoading,
  error,
  onLogin,
  onLogout,
  isAuthenticated
}) => {
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentTrack 
    ? (currentTrack.progress / currentTrack.duration) * 100 
    : 0;

  if (!isAuthenticated) {
    return (
      <div className="bg-black border border-[#ffbb00] rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
        <h3 className="text-[#ffbb00] text-xl font-bold mb-4 text-center">SPOTIFY</h3>
        <button 
          onClick={onLogin}
          className="bg-[#1DB954] text-white px-4 py-2 rounded-full font-bold hover:bg-[#1ed760] transition-colors"
        >
          Conectar com Spotify
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black border border-[#ffbb00] rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
        <h3 className="text-[#ffbb00] text-xl font-bold mb-4 text-center">SPoTIFY</h3>
        <div className="text-red-400 text-center text-sm">{error}</div>
        <button 
          onClick={onLogin}
          className="bg-[#1DB954] text-white px-3 py-1 rounded text-sm mt-2 hover:bg-[#1ed760] transition-colors"
        >
          Reconectar
        </button>
      </div>
    );
  }

  if (!currentTrack) {
    return (
      <div className="bg-black border border-[#ffbb00] rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px]">
        <h3 className="text-[#ffbb00] text-xl font-bold mb-4 text-center">SPOTIFY</h3>
        <div className="text-gray-400 text-center">Nenhuma música tocando</div>
      </div>
    );
  }

  return (
    <div className="bg-black border border-[#ffbb00] rounded-lg p-4 flex flex-col min-h-[200px] max-w-[300px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#ffbb00] text-xl font-bold">SPOTIFY</h3>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${currentTrack?.isPlaying ? 'bg-green-500' : 'bg-gray-500'}`}></div>
          <button 
            onClick={onLogout}
            className="text-xs text-gray-400 hover:text-white transition-colors"
            title="Desconectar"
          >
            ✕
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center">
        {currentTrack.albumCover && (
          <img 
            src={currentTrack.albumCover} 
            alt={`Capa do álbum ${currentTrack.album}`}
            className="w-24 h-24 rounded-lg mb-3 shadow-lg"
          />
        )}
        
        <div className="text-center mb-3">
          <h4 className="text-white text-lg font-bold leading-tight mb-1 line-clamp-2">
            {currentTrack.name}
          </h4>
          <p className="text-gray-300 text-sm leading-tight line-clamp-1">
            {currentTrack.artist}
          </p>
          <p className="text-gray-500 text-xs leading-tight line-clamp-1">
            {currentTrack.album}
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="w-full">
          <div className="bg-gray-700 rounded-full h-1 mb-1">
            <div 
              className="bg-[#1DB954] h-1 rounded-full transition-all duration-1000"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTrack.progress)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotifyNowPlaying;