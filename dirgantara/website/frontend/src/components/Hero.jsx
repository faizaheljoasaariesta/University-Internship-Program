import { blackHole } from "../assets"
import HeroContent from "./sub/HeroContent"
import DataPlane from "./sub/DataPlane"
import { useEffect, useState } from "react";
import { data } from "../constants";
import CustomMap from "./sub/CustomMap";
import Controlling from "./sub/Controlling";

const fetchData = async () => {
  try {
    const response = await fetch('http://192.168.133.222:3000/data');
    
    if (!response.ok) {
      throw new Error('Data tidak tersedia');
    }

    const data = await response.json();
    const filter = data.acList[0];

    return filter

  } catch (error) {
    console.error('Terjadi kesalahan:', error.message);
    return [];
  }
}

const Hero = () => {
  const [showMap, setShowMap] = useState(false)
  const [dataPlane, setDataPlane] = useState(data)
  const [selectedPlaneId, setSelectedPlaneId] = useState(dataPlane[0]?.Id);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData().then(fetchedData => setDataPlane(fetchedData));
    }, 500);

    return () => clearInterval(interval);
  }, []);  

  // useEffect(() => {
  //   if (dataPlane.length > 0) {
  //     setSelectedPlaneId(dataPlane[0].Id);
  //   }
  // }, [dataPlane]);

  return (
    <div className="relative flex flex-col w-full h-screen mx-auto">
      <video
        autoPlay
        muted
        loop
        className="rotate-180 absolute top-[-300px] sm:top-[-490px] left-0 z-[0] w-full h-full object-cover"
      >
        <source src={blackHole} type="video/webm"/>
      </video>

      <HeroContent selectedPlaneId={selectedPlaneId} setSelectedPlaneId={setSelectedPlaneId} dataPlane={dataPlane}/>
      <DataPlane dataPlane={dataPlane} selectedPlaneId={selectedPlaneId} showMap={showMap} setShowMap={setShowMap} />
      {showMap && (
        <div className="mt-0">
          <CustomMap dataPlane={dataPlane} selectedPlaneId={selectedPlaneId} />
        </div>
      )}
      <Controlling selectedPlaneId={selectedPlaneId} dataPlane={dataPlane} />
    </div>
  )
}

export default Hero