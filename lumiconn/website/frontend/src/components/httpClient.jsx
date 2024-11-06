import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaSatellite, FaMapMarkedAlt, FaArrowUp, FaClock, FaCompass, FaCalendarAlt, FaRulerCombined, FaMapPin, FaMusic } from 'react-icons/fa';

function App() {
  const [gpsData, setGpsData] = useState({
    lat: null,
    lng: null,
    altitude: null,
    speed: null,
    course: null,
    date: null,
    satellites: null,
    hdop: null,
  });
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());
  const [markers, setMarkers] = useState([]);
  const [selectedAudio, setSelectedAudio] = useState("");
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const audioRefs = useRef({});

  const availableAudios = [
    { id: 1, name: 'Bernadya Full Album', file: '/audios/bernadya.mp3' },
    { id: 2, name: 'Audio 2', file: '/audio/audio2.mp3' },
    { id: 3, name: 'Audio 3', file: '/audio/audio3.mp3' },
  ];

  useEffect(() => {
    const fetchGpsData = async () => {
      try {
        const response = await axios.get('http://192.168.145.222:3000/api/gps');
        setGpsData(response.data);
      } catch (error) {
        console.error('Error fetching GPS data:', error);
      }
    };

    const intervalGps = setInterval(fetchGpsData, 5000);
    const intervalTime = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(intervalGps);
      clearInterval(intervalTime);
    };
  }, []);

  useEffect(() => {
    markers.forEach((marker) => {
      const distance = calculateDistance(
        gpsData.lat,
        gpsData.lng,
        marker.lat,
        marker.lng
      );
      
      if (distance <= 50 && audioRefs.current[marker.audio]) {
        audioRefs.current[marker.audio].play();
      }
    });
  }, [gpsData, markers]);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;
    return R * 2 * Math.asin(Math.sqrt(a)) * 1000;
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        if (isAddingMarker && selectedAudio) {
          setMarkers((prevMarkers) => [
            ...prevMarkers,
            {
              lat: e.latlng.lat,
              lng: e.latlng.lng,
              audio: selectedAudio,
            },
          ]);
          setIsAddingMarker(false);
          setSelectedAudio('');
        }
      },
    });
    return null;
  };

  const handleAddMarkerClick = () => {
    setIsAddingMarker(true);
  };

  const removeMarker = (index) => {
    setMarkers((prevMarkers) => prevMarkers.filter((_, i) => i !== index));
  };

  const isGpsDataLoaded = gpsData.lat !== null && gpsData.lng !== null;

  const audioIcon = new L.Icon({
    iconUrl: '/images/sound.png',
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });

  return (
    <div className="w-full h-screen flex bg-gray-900 text-white">
      <div className="bg-gray-800 text-gray-200 rounded-lg shadow-lg p-6 w-1/3 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-4">GPS Monitoring</h1>

        {isGpsDataLoaded ? (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaMapPin className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">Latitude:</span>
              <span>{gpsData.lat}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaMapPin className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">Longitude:</span>
              <span>{gpsData.lng}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaArrowUp className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">Altitude:</span>
              <span>{gpsData.altitude ?? 'undefined'} m</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaClock className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">Local Time:</span>
              <span>{localTime}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaMapMarkedAlt className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">Speed:</span>
              <span>{gpsData.speed ?? 'undefined'} km/h</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaSatellite className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">Satellites:</span>
              <span>{gpsData.satellites ?? 'undefined'}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaCompass className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">Course:</span>
              <span>{gpsData.course ?? 'undefined'}°</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaCalendarAlt className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">Date:</span>
              <span>{gpsData.date ?? 'undefined'}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-700 rounded-lg p-4">
              <FaRulerCombined className="text-4xl text-blue-400 mb-2" />
              <span className="font-semibold">HDOP:</span>
              <span>{gpsData.hdop ?? 'undefined'}</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center mt-4">
            <p className="text-lg animate-pulse text-blue-300">Loading GPS data...</p>
          </div>
        )}

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2 flex items-center">
            <FaMusic className="text-2xl text-blue-400 mr-2" /> Pilih Audio untuk Lokasi
          </h2>
          <select
            className="w-full p-2 mb-4 bg-gray-700 text-gray-200 rounded-lg"
            value={selectedAudio}
            onChange={(e) => setSelectedAudio(e.target.value)}
          >
            <option value="">Pilih Audio</option>
            {availableAudios.map((audio) => (
              <option key={audio.id} value={audio.name}>
                {audio.name}
              </option>
            ))}
          </select>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleAddMarkerClick}
            disabled={!selectedAudio}
          >
            Tambah Marking Lokasi
          </button>
        </div>
      </div>

      {isGpsDataLoaded ? (
        <div className="w-2/3 rounded-lg overflow-hidden shadow-lg">
          <MapContainer
            center={[gpsData.lat || 0, gpsData.lng || 0]}
            zoom={17}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <MapClickHandler />

            <Marker position={[gpsData.lat, gpsData.lng]}>
              <Popup>GPS Location</Popup>
            </Marker>
            
            {markers.map((marker, index) => {
              const audioFile = availableAudios.find((a) => a.name === marker.audio)?.file;
              return (
                <Marker key={index} position={[marker.lat, marker.lng]} icon={audioIcon}>
                  <Popup>
                    <div>
                      <p>Audio: {marker.audio || 'Tidak ada audio'}</p>
                      <button
                        className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                        onClick={() => removeMarker(index)}
                      >
                        Hapus Marker
                      </button>
                    </div>
                  </Popup>
                  <Circle center={[marker.lat, marker.lng]} radius={50} color="blue" />
                  {audioFile && (
                      <audio ref={(el) => (audioRefs.current[marker.audio] = el)} src={audioFile} />
                    )}
                </Marker>
              );
            })}
          </MapContainer>
        </div>
      ) : (
        <div className="w-2/3 flex items-center justify-center">
          <p className="text-lg">Loading GPS data...</p>
        </div>
      )}
    </div>
  );
}

export default App;
