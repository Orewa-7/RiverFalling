
import { useGLTF, useCursor, Center, shaderMaterial } from '@react-three/drei'
import { useState, useEffect, useRef } from 'react'
import { extend, useFrame } from '@react-three/fiber'

import * as THREE from 'three'


// define your fragment shader code
const vertexShader = `
uniform float uTime;
uniform float uScroll;


varying vec2 vUv;
varying float vElevation;
  void main(){
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vUv = uv;
  }
`

// define your vertex shader code
const fragmentShader = `
float rand(vec2 co) {
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
  }
vec4 permute(vec4 x)
{
    return mod(((x*34.0)+1.0)*x, 289.0);
}

//	Classic Perlin 2D Noise
//	by Stefan Gustavson
//
vec2 fade(vec2 t)
{
    return t*t*t*(t*(t*6.0-15.0)+10.0);
}

float cnoise(vec2 P)
{
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x,gy.x);
    vec2 g10 = vec2(gx.y,gy.y);
    vec2 g01 = vec2(gx.z,gy.z);
    vec2 g11 = vec2(gx.w,gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 * vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

uniform float u_time;
varying vec2 vUv;

void main() {
    // vec2 st = gl_FragCoord.xy/u_resolution.xy;
    // st.x *= u_resolution.x/u_resolution.y;

    vec2 st = vUv;

    vec3 color = vec3(0.);
    color = vec3(st.x,st.y,abs(sin(u_time)));
    
    
    float TAU = 6.28318530718;
	float offset = cos(st.x * TAU * 1.128) *0.090;
    float t = cos( (st.y + offset + u_time * 0.098) * TAU * 1.160) * 1.364 + -1.588;
    t *=  st.y; // pour dire aller en haut
    vec3 gradient = vec3(1.);
    vec3 colorisation = mix(vec3(0.1137, 0.635, 0.847), gradient, t);
    gl_FragColor = vec4 (colorisation, 1.);

    //gl_FragColor = vec4(color,1.0);
}
`
// create a new shader material
class MyShaderMaterial extends THREE.ShaderMaterial {
    constructor() {
        super({
            uniforms: {
                u_time: 0,
            },
            vertexShader,
            fragmentShader,
        })
    }
}

const RiverMaterial = shaderMaterial(
    {
        u_time: 0,
    },
    vertexShader,
    fragmentShader,
)

// extend the shaderMaterial to your Plane mesh
extend({ RiverMaterial })

export function Model({ color }) {
    const model = useGLTF('Final.glb')

    const riverMaterial = useRef();

    const planeMesh = model.scene.children.find((child) => child.name === 'Plane')
    const planeMesh1 = model.scene.children.find((child) => child.name === 'Plane001')
    const planeMesh2 = model.scene.children.find((child) => child.name === 'Plane002')
    useEffect(()=>{
        planeMesh.material = riverMaterial.current
        planeMesh1.material = riverMaterial.current
        planeMesh2.material = riverMaterial.current

    }, [])

    useFrame((state, delta) => {
        // planeMesh.material.uniforms.u_time += elapsed;
        // console.log(material.uniforms.u_time)

        riverMaterial.current.u_time -= delta * 1.5
    })



    useEffect(() => {
        // get the Plane mesh from the model

        // apply the shaderMaterial to the Plane mesh

    }, [model])


    return <>

        <directionalLight />

        <mesh>
            <planeGeometry args={[1, 1]} ></planeGeometry>
            <riverMaterial ref={riverMaterial} />
        </mesh>

        <color args={['#000000']} attach="background" />
        <Center>

            <primitive
                object={model.scene}
                // position={ [0, -3.25, 0]}
                scale={10}
            />
        </Center>

    </>
}

useGLTF.preload("/Final.glb");