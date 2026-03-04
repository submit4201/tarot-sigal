import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useSpring, a } from '@react-spring/three';
import { TextureLoader } from 'three';

// Simple holographic shader material
const HologramMaterial = ({ texture, isShadowUrl }: { texture: any, isShadowUrl?: boolean }) => {
    const materialRef = useRef<any>(null);

    useFrame(({ clock }) => {
        if (materialRef.current) {
            materialRef.current.uTime = clock.getElapsedTime();
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            transparent={true}
            args={[{
                uniforms: {
                    tDiffuse: { value: texture },
                    uTime: { value: 0 },
                    uIsShadow: { value: isShadowUrl ? 1.0 : 0.0 }
                },
                vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
                fragmentShader: `
          uniform sampler2D tDiffuse;
          uniform float uTime;
          uniform float uIsShadow;
          
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          // Noise function for foil effect
          float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
          }
          
          void main() {
            vec4 texColor = texture2D(tDiffuse, vUv);
            
            // View direction
            vec3 viewDir = normalize(-vPosition);
            
            // Fresnel effect for holographic edge
            float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
            
            // Iridescent color shift based on angle and time
            vec3 iridescence = 0.5 + 0.5 * cos(uTime * 0.5 + vUv.xyx * 5.0 + vec3(0, 2, 4));
            
            // Holographic foil pattern
            float foil = noise(vUv * 20.0 + uTime * 0.1) * 0.2;
            
            // Mix original color with holographic effects
            vec3 finalColor = texColor.rgb;
            
            if (uIsShadow > 0.5) {
                // Shadow mode: invert and add eerie glow
                finalColor = vec3(1.0) - finalColor;
                finalColor *= vec3(0.8, 0.2, 0.4) * (1.0 + foil * 2.0);
                finalColor += iridescence * fresnel * 0.5;
            } else {
                // Normal mode: subtle holographic sheen
                finalColor += iridescence * fresnel * 0.8;
                finalColor += vec3(foil) * (1.0 - fresnel);
            }
            
            // Discard transparent pixels
            if (texColor.a < 0.1) discard;
            
            gl_FragColor = vec4(finalColor, texColor.a);
          }
        `
            }]}
        />
    );
};

const CardMesh = ({ frontTextureUrl, isReversed, isFlipped, onPointerOver, onPointerOut, onClick }: any) => {
    const [frontTexture, setFrontTexture] = useState<any>(null);
    const [backTexture, setBackTexture] = useState<any>(null);

    useEffect(() => {
        const loader = new TextureLoader();
        loader.load('/tarot/card_back.png', setBackTexture);

        if (frontTextureUrl) {
            loader.load(
                frontTextureUrl,
                setFrontTexture,
                undefined,
                () => {
                    // On error, try placeholder or card back
                    loader.load('/tarot/card_back.png', setFrontTexture);
                }
            );
        } else {
            loader.load('/tarot/card_back.png', setFrontTexture);
        }
    }, [frontTextureUrl]);

    // React-spring for smooth 3D flipping
    const { rotation } = useSpring({
        rotation: [
            isReversed ? Math.PI : 0, // Z-rotation for reversed
            isFlipped ? Math.PI : 0,  // Y-rotation for flip
            0                         // X-rotation
        ],
        config: { mass: 1, tension: 170, friction: 26 }
    });

    // Hover bobbing effect
    const groupRef = useRef<any>(null);
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        }
    });

    if (!frontTexture || !backTexture) return null;

    return (
        <a.group
            ref={groupRef}
            rotation={rotation as any}
            onPointerOver={onPointerOver}
            onPointerOut={onPointerOut}
            onClick={onClick}
        >
            {/* Front of card */}
            <mesh position={[0, 0, 0.01]}>
                <planeGeometry args={[3, 5, 32, 32]} />
                <HologramMaterial texture={frontTexture} isShadowUrl={isFlipped} />
            </mesh>

            {/* Back of card */}
            <mesh position={[0, 0, -0.01]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[3, 5]} />
                <meshBasicMaterial map={backTexture} />
            </mesh>
        </a.group>
    );
};

interface HoloCardProps {
    imageUrl: string;
    isReversed: boolean;
    isShadowRevealed: boolean;
    onClick: () => void;
}

const HoloCard: React.FC<HoloCardProps> = ({ imageUrl, isReversed, isShadowRevealed, onClick }) => {
    const [hovered, setHovered] = useState(false);

    return (
        <div className="w-full h-full cursor-pointer relative" style={{ perspective: '1000px' }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <React.Suspense fallback={null}>
                    <CardMesh
                        frontTextureUrl={imageUrl}
                        isReversed={isReversed}
                        isFlipped={isShadowRevealed}
                        onPointerOver={() => setHovered(true)}
                        onPointerOut={() => setHovered(false)}
                        onClick={onClick}
                    />
                </React.Suspense>
            </Canvas>
            {hovered && !isShadowRevealed && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-mono text-purple-400 tracking-widest uppercase animate-pulse">
                    Click to Reveal Shadow
                </div>
            )}
        </div>
    );
};

export default HoloCard;
