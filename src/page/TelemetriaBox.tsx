import { useState, useEffect } from "react";
import Velocimetro from "../components/Velocimetro";

export default function TelemetriaBox() {
  const [velocidade, setVelocidade] = useState(0);
  const [rpm, setRpm] = useState(0);
  const [isAccelerating, setIsAccelerating] = useState(false);

  const startAcceleration = () => {
    setIsAccelerating(true);
  };

  const stopAcceleration = () => {
    setIsAccelerating(false);
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isAccelerating) {
      intervalId = setInterval(() => {
        setVelocidade(prev => Math.min(prev + 1, 120)); 
        setRpm(prev => Math.min(prev + 0.5, 80)); 
      }, 100);
    } else {
      intervalId = setInterval(() => {
        setVelocidade(prev => Math.max(prev - 1, 0));
        setRpm(prev => Math.max(prev - 0.5, 0));
      }, 150);
    }

    return () => clearInterval(intervalId);
  }, [isAccelerating]);

  return (
    <div className="font-['Baron_Neue'] bg-black min-h-screen w-full">  
      <div className="flex justify-center pt-3" >
        <h1 className="text-[#ffbb00] text-4xl font-bold tracking-wider">BAJA uEA</h1>
      </div> 
      
      {/* Botão de Aceleração */}
      <div className="flex justify-center mt-1 mb-1">
        <button
          onMouseDown={startAcceleration}
          onMouseUp={stopAcceleration}
          onMouseLeave={stopAcceleration}
          onTouchStart={startAcceleration}
          onTouchEnd={stopAcceleration}
          className={`px-8 py-4 text-xl font-bold tracking-wider transition-all duration-200 rounded-lg border-2`}
        >
          {isAccelerating ? 'ACELERANDo' : 'ACELERAR'}
        </button>
      </div>
      
      <div className="flex flex-row w-[45vw] items-center gap-0">
        <div className="flex flex-col mb-10 items-center gap-16"> 
          <div className="flex flex-col items-center gap-1" >
            <Velocimetro 
              value={velocidade} 
              width={450} 
              height={450}
              primaryColor="#ffbb00"
              secondaryColor="#ffffff"
              className=" h-[16vw] "
              textColor="#ffffff"
              label="KM/H"
            />
            <p className="text-white text-lg tracking-wide ">velocidade</p>
          </div>

          <div className=" w-[8vw] h-full text-[20px] text-center" >
            <p className="text-[#ffbb00]" >João victor</p>
            <p className="text-[#ffbb00]" >Benayon</p>
            <p className="text-[#ffbb00]" >Fernandes</p>
            <p className="text-[#ffbb00]" >Luquinhas</p>
            <p className="text-[#ffbb00]" >Edy</p>
          </div>
        </div> 

        <div className="flex flex-col justify-betwee mt-[4vw] gap-5 items-center h-full w-full" > 
          <div className="mr-1 h-full">
            <img className="w-[26vw]" src="src\assets\Baja_logo.svg"/>
          </div>     
          <div className="flex flex-col items-center">
            <Velocimetro
              value={rpm} 
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
      </div>  
    </div>
  );
}