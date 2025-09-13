import { useState, useEffect } from "react";
import Velocimetro from "../components/Velocimetro";
import Termometro from "../components/Termometro";
import TanqueCombustivel from "../components/TanqueCombustivel";

export default function TelemetriaBox() {
  const [velocidade, setVelocidade] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [temperatura, setTemperatura] = useState(0);
  const [combustivel, setCombustivel] = useState(45);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [, setDadosHistorico] = useState<{tempo: number, velocidade: number, rpm: number}[]>([]);
  const [contadorTempo] = useState(0);
  // Estado para controle de erro de conexão
  const [statusConexao, setStatusConexao] = useState<'conectado' | 'erro' | 'carregando'>('carregando');

  const startAcceleration = () => {
    setIsAccelerating(true);
  };

  const stopAcceleration = () => {
    setIsAccelerating(false);
  };

  useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch("http://10.56.243.40/dados"); // IP do ESP32
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Dados recebidos:", data);
      
      if (data.velocidade !== undefined) {
        setVelocidade(data.velocidade);
      }
      if (data.tempObjeto !== undefined) {
        setTemperatura(data.tempObjeto);
      }

      setStatusConexao("conectado");
    } catch (err) {
      console.error("Erro ao buscar dados:", err);
      setStatusConexao("erro");
    }
  }, 1000);

  return () => clearInterval(interval);
}, []);

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
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-[#ffbb00] text-xl font-bold text-center">TEMPERATuRA</h3>
              {/* Indicador de status de conexão */}
              <div className={`w-3 h-3 rounded-full ${
                statusConexao === 'conectado' ? 'bg-green-500' :
                statusConexao === 'erro' ? 'bg-red-500' : 'bg-yellow-500'
              }`}></div>
            </div>
            <Termometro
              temperatura={temperatura}
              minTemp={0}
              maxTemp={150}
              width={100}
              height={280}
            />
            {/* Exibe o status da conexão */}
            <div className="text-xs text-gray-400 mt-2">
              {statusConexao === 'conectado' && 'online'}
              {statusConexao === 'erro' && 'Sem conexão'}
              {statusConexao === 'carregando' && 'Conectando...'}
            </div>
          </div>

          <div className="bg-black flex flex-col rounded-lg items-center justify-center">
            <h3 className="text-[#ffbb00] text-xl font-bold mb-4 text-center">CoMBuSTÃvEL</h3>
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