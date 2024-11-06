/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Plane = ({ isMobile }) => {
  const autonomus = useGLTF("./airbus/scene.gltf");

  return (
    <mesh>
      <hemisphereLight 
        intensity={4}
        groundColor="black"
      />
      <pointLight intensity={4} />
      <primitive 
        object={autonomus.scene}
        scale={1.75}
        position={isMobile ? [0, 0, 0] : [0, -40, 0]}
      />
    </mesh>
  );
};

const PlaneCanvas = () => {
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

  return (
    <Canvas
      frameloop="demand"
      shadows
      camera={{ position: [500, 1, 5], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Plane isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default PlaneCanvas;