import { useState, useEffect } from "react";
import Velocimetro from "../components/Velocimetro";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TelemetriaBox() {
  const [velocidade, setVelocidade] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);
  const [dadosHistorico, setDadosHistorico] = useState<{tempo: number, velocidade: number, rpm: number}[]>([]);
  const [contadorTempo, setContadorTempo] = useState(0);
  
  const [dadosTemperatura] = useState([
    { tempo: 1, temperatura: 72 },
    { tempo: 2, temperatura: 68 },
    { tempo: 3, temperatura: 75 },
    { tempo: 4, temperatura: 80 },
    { tempo: 5, temperatura: 78 },
    { tempo: 6, temperatura: 82 },
    { tempo: 7, temperatura: 85 },
    { tempo: 8, temperatura: 79 },
    { tempo: 9, temperatura: 76 },
    { tempo: 10, temperatura: 81 }
  ]);

  const startAcceleration = () => {
    setIsAccelerating(true);
  };

  const stopAcceleration = () => {
    setIsAccelerating(false);
  };

  useEffect(() => {
    let intervalId: number;
    let tempoIntervalId: number;

    // Atualizar o tempo a cada segundo
    /*tempoIntervalId = window.setInterval(() => {
      setContadorTempo(prev => prev + 1);
    }, 1000);*/

    if (isAccelerating) {
      intervalId = window.setInterval(() => {
        setVelocidade(prev => Math.min(prev + 1, 120)); 
        setRpm(prev => Math.min(prev + 0.08, 10)); 
      }, 100);
    } else {
      intervalId = window.setInterval(() => {
        setVelocidade(prev => Math.max(prev - 1, 0));
        setRpm(prev => Math.max(prev - 0.08, 0));
      }, 150);
    }

    return () => {
      clearInterval(intervalId);
      //clearInterval(tempoIntervalId);
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
      <div className="flex justify-center pt-3" >
        <h1 className="text-[#ffbb00] text-4xl font-bold tracking-wider">BAJA uEA</h1>
      </div> 
      
      {/* Botão de Aceleração */}
      <div className="flex justify-center mt-1 ">
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
          {isAccelerating ? 'ACELERANDO' : 'ACELERAR'}
        </button>
      </div>
      
      <div className="flex flex-row w-full items-center gap-0 px-8">
        <div className="flex flex-col mb-10 items-center gap-16 w-1/3"> 
          <div className="flex flex-col items-center gap-1" >
            <Velocimetro 
              value={velocidade} 
              width={450} 
              height={450}
              primaryColor="#ffbb00"
              secondaryColor="#ffffff"
              className="h-[16vw]"
              textColor="#ffffff"
              label="KM/H"
            />
            <p className="text-white text-lg tracking-wide ">velocidade</p>
          </div>

          <div className="w-[14vw] h-full text-[20px] text-center" >
            <p className="text-[#ffbb00]" >João victor</p>
            <p className="text-[#ffbb00]" >Gabriel Benayon</p>
            <p className="text-[#ffbb00]" >Leonardo Fernandes</p>
            <p className="text-[#ffbb00]" >Lucas vinícius</p>
            <p className="text-[#ffbb00]" >Edy Macedo</p>
          </div>
        </div> 

        <div className="flex flex-col justify-between mt-[4vw] gap-5 items-center h-full w-1/3" > 
          <div className="mr-1 h-full">
            <img className="w-[26vw]" src="src/assets/Baja_logo.svg"/>
          </div>     
          <div className="flex flex-col items-center">
            <Velocimetro
              value={rpm}
              max={10} 
              width={450} 
              height={450}
              primaryColor="#ffbb00"
              secondaryColor="#ffffff"
              className="h-[16vw]"
              textColor="#ffffff"
              label="x 1000"
            />
            <p className="text-white text-lg tracking-wide ">rpM</p>
          </div> 
        </div> 

        {/* Gráfico de Linha com Recharts - Dados FIXOS de temperatura */}
        <div className="w-1/3 flex flex-col items-center justify-center">
          <div className="bg-black flex flex-col p-4 rounded-lg w-full">
            <h3 className="text-[#ffbb00] text-xl font-bold mb-4 text-center">TEMPERATuRA x TEMPo</h3>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="50%">
                <LineChart
                  data={dadosTemperatura}
                  margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="tempo" 
                    label={{ value: 'Tempo (s)', position: 'insideBottom', offset: -12, fill: 'white' }}
                    tick={{ fill: 'white' }}
                    domain={[1, 10]}
                    tickCount={10}
                  />
                  <YAxis
                    label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft', offset: 10, fill: 'white' }}
                    tick={{ fill: 'white' }}
                    domain={[60, 90]}
                    tickCount={7}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#333', 
                      border: '1px solid #ffbb00',
                      color: 'white',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#ffbb00' }}
                    labelStyle={{ color: 'white', fontWeight: 'bold' }}
                    formatter={(value) => [`${value} °C`, 'Temperatura']}
                    labelFormatter={(label) => `Tempo: ${label}s`}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperatura"
                    stroke="#ffbb00"
                    strokeWidth={3}
                    dot={false}
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="w-1/3 flex flex-col items-center justify-center">
          <div className="bg-black flex flex-col p-4 rounded-lg w-full">
            <h3 className="text-[#ffbb00] text-xl font-bold mb-4 text-center">Combustível Esperado</h3>
            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="50%" className=''>
                <LineChart
                  data={dadosTemperatura}
                  margin={{ top: 25, right: 30, left: 20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                  <XAxis 
                    dataKey="tempo" 
                    label={{ value: 'Tempo (s)', position: 'insideBottom', offset: -12, fill: 'white', style: { marginTop: '10px' } }}
                    tick={{ fill: 'white' }}
                    domain={[1, 10]}
                    tickCount={10}
                  />
                  <YAxis
                    label={{ value: 'Temperatura (°C)', angle: -90, position: 'insideLeft', offset: 10, fill: 'white' }}
                    tick={{ fill: 'white' }}
                    domain={[60, 90]}
                    tickCount={7}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#333', 
                      border: '1px solid #ffbb00',
                      color: 'white',
                      borderRadius: '8px'
                    }}
                    itemStyle={{ color: '#ffbb00' }}
                    labelStyle={{ color: 'white', fontWeight: 'bold' }}
                    formatter={(value) => [`${value} °C`, 'Temperatura']}
                    labelFormatter={(label) => `Tempo: ${label}s`}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperatura"
                    stroke="#ffbb00"
                    strokeWidth={3}
                    dot={false}
                    activeDot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}