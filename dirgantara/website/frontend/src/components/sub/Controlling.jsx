import { arrowLeft, arrowRight } from "../../assets";
import { useState, useEffect } from "react";
import { slideIn } from "../../utils/motion";
import { Antenna } from "../canvas";
import { styles } from '../../style'
import { motion } from "framer-motion";
import { data } from '../../constants';
import CustomMap from "./CustomMap";

const Controlling = ({ selectedPlaneId, dataPlane }) => {
  const selectedPlane = dataPlane.find(plane => plane.Id === selectedPlaneId);
  const bearingAuto = selectedPlane?.Brng ?? 0;

  const [actived, setActived] = useState('off');
  const [mode, setMode] = useState(null);
  const [bearing, setBearing] = useState(0);

  const sendControlling = () => {
    if (mode === 'auto') {
      setBearing(bearingAuto)
    }
    
    let dataControl = [actived, mode, bearing];

    fetch("http://10.110.180.102:3000/control", {
      method: "POST",
      body: JSON.stringify({ data: dataControl }),
      headers: { "Content-Type": "application/json" }
    })
  }

  useEffect(() => {
    const interval = setInterval(sendControlling, 500);
    return () => clearInterval(interval);
  }, [actived, mode, bearing, bearingAuto]);

  const handleActiveToggle = (selectedActive) => {
    setActived(selectedActive);
    if (selectedActive === 'off') {
      setMode(null);
      setBearing(0);
    }
  };

  const handleModeToggle = (selectedMode) => {
    if (actived === 'on') {
      setMode(selectedMode);
    }
  };

  const changeBearing = (direction) => {
    if (mode === 'manual') {
      setBearing((prevBearing) => {
        let newBearing = direction === 'increase' ? prevBearing + 1 : prevBearing - 1;
        if (newBearing > 360) newBearing = 0;
        if (newBearing < 0) newBearing = 360;
        return newBearing;
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      changeBearing('decrease');
    } else if (event.key === 'ArrowRight') {
      changeBearing('increase');
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mode]);

  return (
    <motion.div
      variants={slideIn("right", "tween", 0.2, 1)}
      className='flex-[0.75] p-12 bg-black-100 rounded-2xl'
    >
      <p className={styles.sectionSubText}>Proccess Tracking Antenna Tower</p>
      <h3 className={styles.sectionHeadText}>Controlling Antenna Flight and Test</h3>

      <div className="flex flex-col bg-blue-950 p-8 rounded-2xl w-full mt-4">
        <div className="flex w-full items-center justify-around">
          <div className="flex w-1/2 items-center justify-start gap-8">
            <div className={`w-28 h-28 rounded-full flex justify-center items-center ${actived === 'off' ? 'bg-red-600' : 'bg-gray-500'}`}>
              <h1 className="text-white font-bold">OFF</h1>
            </div>
            <div className={`w-28 h-28 rounded-full flex justify-center items-center ${actived === 'on' ? 'bg-green-600' : 'bg-gray-500'}`}>
              <h1>ON</h1>
            </div>
            <h1 className="text-4xl py-2 px-6 font-bold bg-white text-black rounded-xl">ACTIVED INDICATOR</h1>
          </div>

          <div className="flex w-1/2 items-center justify-end gap-8">
            <h1 className="text-4xl py-2 px-6 font-bold bg-white text-black rounded-xl">TRACKING ANTENNA</h1>
            <div className={`w-28 h-28 rounded-full flex justify-center items-center shadow-md ${mode === 'manual' ? 'bg-green-600' : 'bg-gray-500'}`}>
              <h1>MANUAL</h1>
            </div>
            <div className={`w-28 h-28 rounded-full flex justify-center items-center shadow-md ${mode === 'auto' ? 'bg-green-600' : 'bg-gray-500'}`}>
              <h1 className="text-white font-bold">AUTO</h1>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-between mt-12 gap-28">
          <div className="w-1/2 p-6 bg-[#134B70] rounded-xl">
            <h1 className="text-center">ACTIVED SYSTEM</h1>
            <div className="w-full flex justify-between items-center gap-4 mt-4">
              <button
                onClick={() => handleActiveToggle('off')}
                className={`py-8 rounded-xl outline-none w-full text-white font-bold bg-tertiary hover:bg-[#17153B] hover:shadow-sm hover:shadow-black`}
              >
                Turn OFF
              </button>
              <button
                onClick={() => handleActiveToggle('on')}
                className={`py-8 rounded-xl outline-none w-full text-white font-bold bg-tertiary hover:bg-[#17153B] hover:shadow-sm hover:shadow-black`}
              >
                Turn ON
              </button>
            </div>
          </div>
          <div className="w-1/2 p-6 bg-[#134B70] rounded-xl">
            <h1 className="text-center">TRACKING MODE</h1>
            <div className="w-full flex justify-between items-center gap-4 mt-4">
              <button
                onClick={() => handleModeToggle('manual')}
                className={`py-8 rounded-xl outline-none w-full text-white font-bold ${actived === 'on' ? 'bg-tertiary hover:bg-[#17153B] hover:shadow-sm hover:shadow-black' : 'bg-gray-500'}`}
                disabled={actived !== 'on'}
              >
                Manual
              </button>
              <button
                onClick={() => handleModeToggle('auto')}
                className={`py-8 rounded-xl outline-none w-full text-white font-bold ${actived === 'on' ? 'bg-tertiary hover:bg-[#17153B] hover:shadow-sm hover:shadow-black' : 'bg-gray-500'}`}
                disabled={actived !== 'on'}
              >
                Auto
              </button>
            </div>
          </div>
        </div>
        <div
          className={`my-20 flex xl:flex-row flex-col gap-10 overflow-hidden`}
        >
          <motion.div
            variants={slideIn("left", "tween", 0.2, 1)}
            className='xl:flex-1 xl:h-[800px] md:h-[550px] h-[350px]'
          >
            <CustomMap dataPlane={dataPlane} selectedPlaneId={selectedPlaneId} />
          </motion.div>

          <motion.div
            variants={slideIn("right", "tween", 0.2, 1)}
            className='flex-[0.6] p-8 bg-black-100 rounded-2xl'
          >
            <p className={styles.sectionSubText}>Manual Tracking Antenna Mode</p>
            <h3 className={styles.sectionHeadText}>Manual Control</h3>

            <div className="w-full flex flex-col">
              <div className='xl:h-[400px] md:h-[275px] h-[175px]'>
                <Antenna bearing={bearing}/>
              </div>

              <div className="w-full bg-white py-3 flex justify-around rounded-xl">
                <h1 className="text-black font-semibold text-xl">Tower to Plane (Bering) :</h1>
                <h1 className="text-black font-semibold text-xl">{bearing}°</h1>
              </div>

              <div className="w-full flex justify-between items-center gap-12 mt-12">
                <button
                  onClick={() => changeBearing('decrease')}
                  className={`py-8 rounded-xl outline-none w-full text-white font-bold ${mode === 'manual' ? 'bg-[#1679AB] hover:bg-[#0F67B1]' : 'bg-gray-500'}`}
                  disabled={mode !== 'manual'}
                >
                  <img 
                    src={arrowLeft}
                    alt="arrowLeft" 
                    className="flex w-full h-12 object-contain justify-center items-center" 
                  />
                </button>
                <button
                  onClick={() => changeBearing('increase')}
                  className={`py-8 rounded-xl outline-none w-full text-white font-bold ${mode === 'manual' ? 'bg-[#1679AB] hover:bg-[#0F67B1]' : 'bg-gray-500'}`}
                  disabled={mode !== 'manual'}
                >
                  <img 
                    src={arrowRight}
                    alt="arrowRight" 
                    className="flex w-full h-12 object-contain justify-center items-center" 
                  />
                </button>
              </div>
              {/* <p className="text-center mt-28">"Pengembangan sistem <span className="font-bold">otomatisasi tracking antenna</span> pusat pengendalian uji terbang menggunakan <span className="font-bold">data ADS-B</span> yang telah dimigrasikan ke dalam <span className="font-bold">data ADS-B</span> dengan kontrol website dan penerapan <span className="font-bold">logika fuzzy</span> pada mikrokontroler <span className="font-bold">ESP32 W-ROOM</span>."</p> */}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default Controlling;
