import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useState } from "react";
import { Model } from "./Model";

export default function App() {

    const cameraPosition = [0, 0, 10]

    return <>
        <Canvas
            camera={{
                fov: 75,
                near: 0.1,
                far: 200,
                position: cameraPosition
            }}
        >
            <OrbitControls/>
            <directionalLight position={[0, 0, 1]}  intensity={0.3}/>
            <directionalLight position={[0, 0, -1]} intensity={0.3} />
            
            <Model />
        </Canvas>
    </>
}