import React from 'react';

interface TermometroProps {
  temperatura: number;
  minTemp?: number;
  maxTemp?: number;
  width?: number;
  height?: number;
  className?: string;
}

const Termometro: React.FC<TermometroProps> = ({
  temperatura,
  minTemp = 0,
  maxTemp = 120,
  width = 80,
  height = 300,
  className = ""
}) => {
  const bulbRadius = width * 0.4;
  const tubeWidth = width * 0.25;
  const tubeHeight = height * 0.7;
  const bulbY = height - bulbRadius;
  const tubeX = (width - tubeWidth) / 2;
  
  const normalizedTemp = Math.max(0, Math.min(1, (temperatura - minTemp) / (maxTemp - minTemp)));
  const mercuryHeight = normalizedTemp * tubeHeight;
  
  const getMercuryColor = (temp: number) => {
    if (temp < 30) return "#0066cc";
    if (temp < 60) return "#00cc66";
    if (temp < 80) return "#ffcc00";
    return "#ff3300";
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
          <linearGradient id="mercuryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={getMercuryColor(temperatura)} />
            <stop offset="50%" stopColor={getMercuryColor(temperatura)} opacity="0.8" />
            <stop offset="100%" stopColor={getMercuryColor(temperatura)} />
          </linearGradient>
        </defs>
        
        <rect
          x={tubeX}
          y={20}
          width={tubeWidth}
          height={tubeHeight}
          fill="rgba(200,200,200,0.2)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          rx="4"
        />
        
        <circle
          cx={width/2}
          cy={bulbY}
          r={bulbRadius}
          fill="rgba(200,200,200,0.2)"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
        />
        
        <rect
          x={tubeX + 2}
          y={20 + tubeHeight - mercuryHeight}
          width={tubeWidth - 4}
          height={mercuryHeight}
          fill="url(#mercuryGradient)"
          rx="2"
        />
        
        <circle
          cx={width/2}
          cy={bulbY}
          r={bulbRadius - 4}
          fill="url(#mercuryGradient)"
        />
        
        <rect
          x={tubeX}
          y={20}
          width={tubeWidth}
          height={tubeHeight}
          fill="url(#glassGradient)"
          rx="4"
        />
        
        <circle
          cx={width/2}
          cy={bulbY}
          r={bulbRadius}
          fill="url(#glassGradient)"
        />
        
        {[0, 25, 50, 75, 100].map((mark) => {
          const markY = 20 + tubeHeight - (mark / 100) * tubeHeight;
          const markValue = minTemp + (mark / 100) * (maxTemp - minTemp);
          return (
            <g key={mark}>
              <line
                x1={tubeX + tubeWidth}
                y1={markY}
                x2={tubeX + tubeWidth + 8}
                y2={markY}
                stroke="rgba(255,255,255,0.7)"
                strokeWidth="1"
              />
              <text
                x={tubeX + tubeWidth + 12}
                y={markY + 4}
                fill="white"
                fontSize="10"
                fontFamily="Arial"
              >
                {Math.round(markValue)}°
              </text>
            </g>
          );
        })}
      </svg>
      
      <div className="mt-2 text-center">
        <div className="text-2xl font-bold text-white">
          {Math.round(temperatura)}°C
        </div>
        <div className="text-sm text-gray-300">
          Temperatura
        </div>
      </div>
    </div>
  );
};

export default Termometro;