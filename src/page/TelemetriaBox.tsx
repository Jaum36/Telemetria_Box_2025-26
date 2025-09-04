import { useState, useEffect } from "react";
import Velocimetro from "../components/Velocimetro";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Termometro from "../components/Termometro";
import TanqueCombustivel from "../components/TanqueCombustivel";

export default function TelemetriaBox() {
  const [velocidade, setVelocidade] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [temperatura, setTemperatura] = useState(72);
  const [combustivel, setCombustivel] = useState(45);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [dadosHistorico, setDadosHistorico] = useState<{tempo: number, velocidade: number, rpm: number}[]>([]);
  const [contadorTempo, setContadorTempo] = useState(0);
  
  const [dadosCombustivel] = useState([
    { tempo: 1, combustivel: 10 },
    { tempo: 2, combustivel: 11 },
    { tempo: 3, combustivel: 7 },
    { tempo: 4, combustivel: 9 },
    { tempo: 5, combustivel: 10 },
    { tempo: 6, combustivel: 15 },
    { tempo: 7, combustivel: 17 },
    { tempo: 8, combustivel: 17 },
    { tempo: 9, combustivel: 11 },
    { tempo: 10, combustivel: 11 }
  ]);

  const startAcceleration = () => {
    setIsAccelerating(true);
  };

  const stopAcceleration = () => {
    setIsAccelerating(false);
  };

  useEffect(() => {
    let intervalId: number;

    if (isAccelerating) {
      intervalId = window.setInterval(() => {
        setVelocidade(prev => Math.min(prev + 1, 120)); 
        setRpm(prev => Math.min(prev + 0.08, 10));
        setTemperatura(prev => Math.min(prev + 0.5, 150));
        setCombustivel(prev => Math.max(prev - 0.1, 0));
      }, 150);
    } else {
      intervalId = window.setInterval(() => {
        setVelocidade(prev => Math.max(prev - 1, 0));
        setRpm(prev => Math.max(prev - 0.08, 0));
        setTemperatura(prev => Math.max(prev - 0.2, 65));
      }, 150);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [isAccelerating]);

  useEffect(() => {
    if (contadorTempo > 0) {
      setDadosHistorico(prev => {
        const novoDado = { tempo: contadorTempo, velocidade, rpm };
        const novoHistorico = [...prev, novoDado];
        return novoHistorico.slice(-10);
      });
    }
  }, [contadorTempo, velocidade, rpm]);

  return (
    <div className="font-['Baron_Neue'] bg-black min-h-screen w-full">  
      <div className="flex flex-row justify-center items-center gap-3">
        <div className="flex items-center pt-3">
          <h1 className="text-[#ffbb00] text-4xl font-bold tracking-wider mb-1">BAJA uEA</h1>
        </div>

        <div>
          <img className="w-[2.8vw] mt-6" src="src/assets/Baja_Logo.png"/>
        </div>
      </div>
      
      <div className="flex justify-center mt-1">
        <button
          onMouseDown={startAcceleration}
          onMouseUp={stopAcceleration}
          onMouseLeave={stopAcceleration}
          onTouchStart={startAcceleration}
          onTouchEnd={stopAcceleration}
          className={`px-8 py-4 text-xl font-bold tracking-wider transition-all duration-200 rounded-lg ${
            isAccelerating 
              ? 'bg-[#ffbb00] text-black' 
              : 'bg-gray-800 text-[#ffbb00] hover:bg-gray-700'
          }`}
        >
          {isAccelerating ? 'ACELERANDo' : 'ACELERAR'}
        </button>
      </div>

      <div className="mt-3">
        <hr className="text-[#ffbb00] border-6"></hr>
      </div>
      
      <div className="flex flex-row w-full items-center justify-center mt-2">
        
        <div className="flex flex-row items-center gap-6"> 
          <div className="flex flex-col items-center gap-1">
            <Velocimetro 
              value={velocidade} 
              width={400} 
              height={400}
              primaryColor="#ffbb00"
              secondaryColor="#ffffff"
              className="h-[14vw]"
              textColor="#ffffff"
              label="KM/H"
            />
            <p className="text-white text-lg tracking-wide">velocidade</p>
          </div>

          <div className="flex flex-col items-center gap-1">
            <Velocimetro
              value={rpm}
              max={5} 
              width={400} 
              height={400}
              primaryColor="#ffbb00"
              secondaryColor="#ffffff"
              className="h-[14vw]"
              textColor="#ffffff"
              label="x 1000"
            />
            <p className="text-white text-lg tracking-wide">rpM</p>
          </div>
        </div> 

        <div className="flex flex-row gap-6">
          
          <div className="bg-black flex flex-col rounded-lg items-center justify-center">
            <h3 className="text-[#ffbb00] text-xl font-bold mb-4 text-center">TEMPERATuRA</h3>
            <Termometro
              temperatura={temperatura}
              minTemp={60}
              maxTemp={150}
              width={100}
              height={280}
            />
          </div>

          <div className="bg-black flex flex-col rounded-lg items-center justify-center">
            <h3 className="text-[#ffbb00] text-xl font-bold mb-4 text-center">CoMBuSTÍvEL</h3>
            <TanqueCombustivel
              nivel={combustivel}
              capacidade={50}
              width={120}
              height={280}
            />
          </div>
        </div>
      </div>  
    </div>
  );
}