import { OrbitControls, Preload, useGLTF } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import CanvasLoader from "../Loader";

const Antenna = ({ isMobile, rotation }) => {
  const autonomus = useGLTF("./antenna/scene.gltf");

  return (
    <mesh rotation={[0, rotation, 0]}>
      <hemisphereLight 
        intensity={5}
        groundColor="black"
      />
      <pointLight intensity={5} />
      <primitive 
        object={autonomus.scene}
        scale={1.2}
        position={isMobile ? [0, -10, 0] : [0, -15, 0]}
      />
    </mesh>
  );
};

const AntennaCanvas = ({ bearing }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 500px)');

    setIsMobile(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches)
    }

    mediaQuery.addEventListener('change', handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    }

  }, [])

  const bearingInRadians = bearing * (Math.PI / 180) + Math.PI;
  const reversedBearingInRadians = (Math.PI / 180) - bearingInRadians;

  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [60, 1, 5], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <Antenna isMobile={isMobile} rotation={reversedBearingInRadians}/>
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default AntennaCanvas;