import Velocimetro from "../components/Velocimetro";

export default function TelemetriaBox() {
  return (
    <div className="font-['Baron_Neue'] bg-black min-h-screen w-full">  
      {/* Título centralizado */}
      <div className="flex justify-center pt-8 mb-8" >
        <h1 className="text-[#ffbb00] text-4xl font-bold tracking-wider">BAJA uEA</h1>
      </div> 
      
      <div className="flex flex-col items-start gap-12">
        <div className="flex flex-col items-center gap-1"> 
          <Velocimetro 
            value={50} 
            width={280} 
            height={280}
            primaryColor="#ffbb00"
            secondaryColor="#f1d106"
            textColor="#ffffff"
            label="KM/H"
          />
          <p className="text-white text-lg font-semibold tracking-wide ">velocidade</p>
        </div> 

        <div className="flex flex-col items-center">
          <Velocimetro
            value={35} 
            width={280} 
            height={280}
            primaryColor="#ffbb00"
            secondaryColor="#f1d106"
            textColor="#ffffff"
            label="x 1000"
          />
          <p className="text-white text-lg font-semibold tracking-wide ">rpM</p>
        </div>  
      </div>  
    </div>
  );
}