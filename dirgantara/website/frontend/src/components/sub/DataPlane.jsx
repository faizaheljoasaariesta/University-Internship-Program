import { slideIn } from "../../utils/motion";
import { motion } from "framer-motion";
import { styles } from '../../style'

const DataPlane = ({ selectedPlaneId, showMap, setShowMap, dataPlane }) => {
  const selectedPlane = dataPlane.find(plane => plane.Id === selectedPlaneId);

  // if (!selectedPlane) return null;

  const toggleShowMap = () => {
    setShowMap(prevState => !prevState);
  };

  return (
    <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className='flex-[0.75] p-12 bg-black-100 rounded-2xl mt-16'
      >
        <p className={styles.sectionSubText}>View More About Data Plane</p>
        <h3 className={styles.sectionHeadText}>Data Plane - {selectedPlane?.Op ?? 'N/A'} {selectedPlane?.Reg ?? 'N/A'} - <span className="bg-blue-950 px-10 rounded-3xl">{selectedPlane?.Icao  ?? 'N/A'}</span></h3>

        <div className="w-full flex justify-between items-center mt-4">
          <div className="plane-detail w-1/4">
            <div className="flex justify-between items-center border-b border-gray-600 py-2">
              <span className="text-gray-400">Operator:</span>
              <span>{selectedPlane?.Op ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-600 py-2">
              <span className="text-gray-400">Registration:</span>
              <span>{selectedPlane?.Reg ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-600 py-2">
              <span className="text-gray-400">ICAO:</span>
              <span>{selectedPlane?.Icao ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-600 py-2">
              <span className="text-gray-400">Type:</span>
              <span>{selectedPlane?.Type ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-600 py-2">
              <span className="text-gray-400">Model:</span>
              <span>{selectedPlane?.Mdl ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-600 py-2">
              <span className="text-gray-400">Manufacturer:</span>
              <span>{selectedPlane?.Man ?? 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center border-b border-gray-600 py-2">
              <span className="text-gray-400">Country:</span>
              <span>{selectedPlane?.Cou ?? 'N/A'}</span>
            </div>
          </div>

          <div className="flex-[0.95] bg-[#261c5d] p-8 rounded-2xl w-3/4">
            <div className="flex flex-row gap-8 mt-2">
              <div className="w-1/3 flex flex-col">
                <h1 className="font-bold bg-white text-black rounded-xl text-center text-2xl my-2">Destination</h1>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">From:</span>
                  <span className="text-xs">{selectedPlane?.From ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">To:</span>
                  <span className="text-xs">{selectedPlane?.To ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">Call:</span>
                  <span>{selectedPlane?.Call ?? 'N/A'}</span>
                </div>
              </div>
              <div className="w-1/3 flex flex-col">
                <h1 className="font-bold bg-white text-black rounded-xl text-center text-2xl my-2">Condition</h1>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">Speed:</span>
                  <span>{selectedPlane?.Spd ?? 'N/A'} Kts</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">Altitude:</span>
                  <span>{selectedPlane?.GAlt ?? 'N/A'} Ft</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">Distance:</span>
                  <span>{selectedPlane?.Dst ?? 'N/A'} NM</span>
                </div>
              </div>
              <div className="w-1/3 flex flex-col">
                <h1 className="font-bold bg-white text-black rounded-xl text-center text-2xl my-2">Location</h1>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">Latitude:</span>
                  <span>{selectedPlane?.Lat ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">Longitude:</span>
                  <span>{selectedPlane?.Long ?? 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-600 py-2">
                  <span className="text-gray-400">Bering:</span>
                  <span>{selectedPlane?.Brng !== undefined ? `${selectedPlane.Brng}°` : 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={toggleShowMap}
              className={`py-2 mt-6 px-8 rounded-xl outline-none w-full text-white font-bold hover:bg-green-900 ${showMap ? 'bg-red-800 hover:bg-red-900' : 'bg-green-800 hover:bg-green-900'}`}
            >
              {showMap ? "Close Map" : "Open Map"}
            </button>
          </div>
        </div>
      </motion.div>
  )
}

export default DataPlane;