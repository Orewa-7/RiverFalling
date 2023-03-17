import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function Test(){
    const cube = useRef();

    useFrame((state, delta)=>{
        cube.current.rotation.y += delta;
    })
    return <>
        <mesh ref={cube}>
                <boxGeometry args={[1, 1, 1]} />
            </mesh>
    </>
}