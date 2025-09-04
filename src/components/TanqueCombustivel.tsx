import React from 'react';

interface TanqueCombustivelProps {
  nivel: number;
  capacidade?: number;
  width?: number;
  height?: number;
  className?: string;
}

const TanqueCombustivel: React.FC<TanqueCombustivelProps> = ({
  nivel,
  capacidade = 50,
  width = 120,
  height = 280,
  className = ""
}) => {
  const porcentagem = Math.max(0, Math.min(1, nivel / capacidade));
  const alturaLiquido = porcentagem * (height - 40);
  
  const getCorCombustivel = (percent: number) => {
    if (percent > 0.6) return "#00cc44";
    if (percent > 0.3) return "#ffcc00";
    return "#ff3300";
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
          <linearGradient id="fuelGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getCorCombustivel(porcentagem)} />
            <stop offset="50%" stopColor={getCorCombustivel(porcentagem)} opacity="0.8" />
            <stop offset="100%" stopColor={getCorCombustivel(porcentagem)} />
          </linearGradient>
          <pattern id="wavePattern" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
            <path d="M0,5 Q5,0 10,5 T20,5" stroke={getCorCombustivel(porcentagem)} strokeWidth="1" fill="none" opacity="0.5"/>
          </pattern>
        </defs>
        
        <rect
          x="10"
          y="20"
          width={width - 20}
          height={height - 40}
          fill="rgba(100,100,100,0.2)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          rx="8"
        />
        
        {alturaLiquido > 0 && (
          <>
            <rect
              x="12"
              y={20 + (height - 40) - alturaLiquido}
              width={width - 24}
              height={alturaLiquido}
              fill="url(#fuelGradient)"
              rx="6"
            />
            
            <rect
              x="12"
              y={20 + (height - 40) - alturaLiquido}
              width={width - 24}
              height="4"
              fill="url(#wavePattern)"
            />
          </>
        )}
        
        <rect
          x="10"
          y="20"
          width={width - 20}
          height={height - 40}
          fill="url(#tankGradient)"
          rx="8"
        />
        
        {[0.25, 0.5, 0.75, 1].map((mark) => {
          const markY = 20 + (height - 40) - (mark * (height - 40));
          const markValue = mark * capacidade;
          return (
            <g key={mark}>
              <line
                x1={width - 10}
                y1={markY}
                x2={width - 2}
                y2={markY}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1"
              />
              <text
                x={width + 2}
                y={markY + 4}
                fill="white"
                fontSize="10"
                fontFamily="Arial"
              >
                {Math.round(markValue)}L
              </text>
            </g>
          );
        })}
        
        <rect
          x="5"
          y="15"
          width={width - 10}
          height="10"
          fill="rgba(100,100,100,0.5)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1"
          rx="2"
        />
        
        <circle
          cx={width/2}
          cy="20"
          r="3"
          fill="rgba(150,150,150,0.8)"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1"
        />
      </svg>
      
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold text-white">
          {Math.round(nivel)}L
        </div>
        <div className="text-sm text-gray-300">
          {Math.round(porcentagem * 100)}%
        </div>
        <div className="text-sm text-gray-400">
          Combustível
        </div>
      </div>
    </div>
  );
};

export default TanqueCombustivel;