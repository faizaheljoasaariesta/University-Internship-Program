import { Plane, StarsCanvas, LionAir, Citilink } from "../canvas";
import { SparklesIcon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'
import { styles } from '../../style'

const HeroContent = ({ selectedPlaneId, setSelectedPlaneId, dataPlane }) => {
  const handleSelectPlane = (id) => {
    setSelectedPlaneId(id);
  };

  const selectedPlane = dataPlane.find(plane => plane.Id === selectedPlaneId);

  const renderPlaneImage = () => {
    if (!selectedPlane) {
      return <Plane />;
    }

    switch (selectedPlane.Op) {
      case 'Lion Air':
        return <LionAir />;
      case 'Citilink':
        return <Citilink />;
      default:
        return <Plane />;
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className={`${styles.paddingX} flex flex-row items-center justify-center w-full mt-32 z-[20]`}
    >
      <StarsCanvas />
      <div className="h-[80vh] w-full flex flex-col gap-6 justify-center m-auto text-start">
        <div className="welcome-box py-[10px] px-[12px] border border-[#7042f88b] opacity-[0.9]">
          <SparklesIcon className="text-[#b49bff] mr-[50px] h-8 w-8" />
          <h1 className="welcome-text text-[24px] sm:text-[24px] flex">
            <span className="hidden sm:block">{selectedPlane?.Op ?? 'N/A'} {selectedPlane?.Reg ?? 'N/A'} - &nbsp;</span> 
          </h1>
          <h1 className="bg-blue-950 px-8 rounded-xl">{selectedPlane?.Icao ?? 'N/A'}</h1>
        </div>
        {renderPlaneImage()}
      </div>

      <div className="w-full h-full hidden sm:flex justify-center items-center">
        <div className='flex-[0.75] p-8 bg-black-100 rounded-2xl'>
          <p className={styles.sectionSubText}>ADS-B Flight and Test Center </p>
          <h3 className={styles.sectionHeadText}>List Plane.</h3>
          <div className="plane-list h-[60vh] overflow-y-scroll">
            {dataPlane.map((plane) => (
              <div key={plane.Id} className="plane-item flex justify-between items-center my-2 p-2 border-b border-gray-600">
                <div className="plane-info">
                  <p>{`${plane.Op} ${plane.Reg} -`} <span className='bg-blue-950 px-6 rounded-xl'>{plane.Icao}</span></p>
                </div>
                <button
                  className="bg-[#2E236C] py-3 px-8 rounded-xl outline-none w-fit text-white font-bold shadow-md shadow-primary"
                  onClick={() => handleSelectPlane(plane.Id)}
                >
                  Select
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default HeroContent
