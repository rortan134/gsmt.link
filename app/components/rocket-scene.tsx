"use client";

import { ROCKET_FIRE_FRAGMENT_SHADER } from "@lib/rocket-fire-glsl";
import { Bounds, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";

const GLTF_PATH = "/models/rocket-fire.gltf";

const fireLeadingLinear = new THREE.Color("#406EFF");
const fireTrailingLinear = new THREE.Color("#FE5F1E");

interface FireEntry {
    cameraLocal: THREE.Vector3;
    material: THREE.RawShaderMaterial;
    mesh: THREE.Mesh;
}

interface RocketSceneSetup {
    disposableMaterials: THREE.Material[];
    fireEntries: FireEntry[];
    root: THREE.Object3D;
}

const FIRE_DEFAULTS = {
    brightnessExponential: 1,
    brightnessMultiplier: 7,
    coneOffset: 2.27,
    cones: 3.059_999_942_779_541,
    leadingColor: [
        fireLeadingLinear.r,
        fireLeadingLinear.g,
        fireLeadingLinear.b,
        1,
    ],
    throttle: 1,
    trailingColor: [
        fireTrailingLinear.r,
        fireTrailingLinear.g,
        fireTrailingLinear.b,
        1,
    ],
    turbulenceFactor: 0.899_999_976_158_142_1,
} as const;

const FIRE_VERTEX_SHADER = /* glsl */ `
precision highp float;

uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

attribute vec3 position;
varying vec3 vLocalPosition;

void main() {
	vLocalPosition = position;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

function jetAxisFromBounds(
    min: THREE.Vector3,
    max: THREE.Vector3,
): THREE.Vector3 {
    const sx = max.x - min.x;
    const sy = max.y - min.y;
    const sz = max.z - min.z;
    if (sx >= sy && sx >= sz) {
        return new THREE.Vector3(1, 0, 0);
    }
    if (sy >= sz) {
        return new THREE.Vector3(0, 1, 0);
    }
    return new THREE.Vector3(0, 0, 1);
}

function createFireMaterial(bounds: THREE.Box3): THREE.RawShaderMaterial {
    const boundsMax = bounds.max.clone();
    const boundsMin = bounds.min.clone();

    return new THREE.RawShaderMaterial({
        blending: THREE.NormalBlending,
        depthTest: true,
        depthWrite: false,
        fragmentShader: ROCKET_FIRE_FRAGMENT_SHADER,
        premultipliedAlpha: false,
        side: THREE.DoubleSide,
        toneMapped: false,
        transparent: true,
        uniforms: {
            uBoundsMax: { value: boundsMax },
            uBoundsMin: { value: boundsMin },
            uBrightnessExponential: {
                value: FIRE_DEFAULTS.brightnessExponential,
            },
            uBrightnessMultiplier: {
                value: FIRE_DEFAULTS.brightnessMultiplier,
            },
            uCameraLocal: { value: new THREE.Vector3() },
            uConeOffset: { value: FIRE_DEFAULTS.coneOffset },
            uCones: { value: FIRE_DEFAULTS.cones },
            uJetAxis: { value: jetAxisFromBounds(boundsMin, boundsMax) },
            uLeadingColor: {
                value: new THREE.Vector4(...FIRE_DEFAULTS.leadingColor),
            },
            uThrottle: { value: FIRE_DEFAULTS.throttle },
            uTime: { value: 0 },
            uTrailingColor: {
                value: new THREE.Vector4(...FIRE_DEFAULTS.trailingColor),
            },
            uTurbulenceFactor: {
                value: FIRE_DEFAULTS.turbulenceFactor,
            },
        },
        vertexShader: FIRE_VERTEX_SHADER,
    });
}

function isRocketFireMaterial(material: THREE.Material): boolean {
    const n = (material.name ?? "").toLowerCase();
    return (
        n === "rocket fire shader" ||
        (n.includes("rocket") && n.includes("fire"))
    );
}

function cloneMeshMaterials(root: THREE.Object3D): THREE.Material[] {
    const disposableMaterials: THREE.Material[] = [];

    root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) {
            return;
        }

        const nextMaterials = (
            Array.isArray(child.material) ? child.material : [child.material]
        ).map((material) => {
            const clonedMaterial = material.clone();
            disposableMaterials.push(clonedMaterial);
            return clonedMaterial;
        });

        child.material = Array.isArray(child.material)
            ? nextMaterials
            : nextMaterials[0];
    });

    return disposableMaterials;
}

function tuneRocketMaterials(root: THREE.Object3D) {
    root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) {
            return;
        }

        const materials = Array.isArray(child.material)
            ? child.material
            : [child.material];

        for (const material of materials) {
            if (
                isRocketFireMaterial(material) ||
                !(
                    material instanceof THREE.MeshStandardMaterial ||
                    material instanceof THREE.MeshPhysicalMaterial
                )
            ) {
                continue;
            }

            material.color.multiplyScalar(1.04);
            material.envMapIntensity = 2.4;
            material.metalness = Math.max(material.metalness, 0.96);
            material.roughness = THREE.MathUtils.clamp(
                material.roughness * 0.62,
                0.12,
                0.24,
            );
            material.needsUpdate = true;
        }
    });
}

function removeDisposableMaterial(
    disposableMaterials: THREE.Material[],
    material: THREE.Material,
): void {
    const index = disposableMaterials.indexOf(material);
    if (index !== -1) {
        disposableMaterials.splice(index, 1);
    }
}

function prepareFireEntries(
    root: THREE.Object3D,
    disposableMaterials: THREE.Material[],
): FireEntry[] {
    const entries: FireEntry[] = [];

    root.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) {
            return;
        }

        const prev = child.material;
        const list = Array.isArray(prev) ? prev : [prev];
        if (!list.some(isRocketFireMaterial)) {
            return;
        }

        child.geometry.computeBoundingBox();
        const bounds = child.geometry.boundingBox?.clone();
        if (!bounds) {
            return;
        }

        for (const material of list) {
            material.dispose();
            removeDisposableMaterial(disposableMaterials, material);
        }

        const nextMaterial = createFireMaterial(bounds);
        const cameraLocal = nextMaterial.uniforms.uCameraLocal?.value;
        if (!(cameraLocal instanceof THREE.Vector3)) {
            throw new Error("Rocket fire material missing uCameraLocal vec3");
        }
        child.material = nextMaterial;
        child.renderOrder = 2;
        entries.push({
            cameraLocal,
            material: nextMaterial,
            mesh: child,
        });
    });

    return entries;
}

function Model() {
    const gltf = useGLTF(GLTF_PATH);

    const { disposableMaterials, fireEntries, root } =
        React.useMemo<RocketSceneSetup>(() => {
            const cloned = gltf.scene.clone(true);
            const materials = cloneMeshMaterials(cloned);
            tuneRocketMaterials(cloned);

            return {
                disposableMaterials: materials,
                fireEntries: prepareFireEntries(cloned, materials),
                root: cloned,
            };
        }, [gltf]);

    useFrame(({ camera, clock }) => {
        const t = clock.elapsedTime;
        for (const entry of fireEntries) {
            entry.cameraLocal.copy(camera.position);
            entry.mesh.worldToLocal(entry.cameraLocal);
            entry.material.uniforms.uTime.value = t;
        }
    });

    React.useEffect(() => {
        return () => {
            for (const material of disposableMaterials) {
                material.dispose();
            }
            for (const entry of fireEntries) {
                entry.material.dispose();
            }
        };
    }, [disposableMaterials, fireEntries]);

    return <primitive object={root} />;
}

useGLTF.preload(GLTF_PATH);

export function Scene() {
    return (
        <div className="h-full min-h-dvh w-full">
            <Canvas
                camera={{
                    far: 100,
                    fov: 45,
                    near: 0.1,
                    position: [1, 1, 1],
                }}
                dpr={[1, 2]}
                frameloop="always"
                gl={{
                    antialias: false,
                    outputColorSpace: THREE.SRGBColorSpace,
                    toneMapping: THREE.NoToneMapping,
                }}
            >
                <directionalLight
                    color="#ffffff"
                    intensity={2.4}
                    position={[5.5, 4.5, 6]}
                />
                <directionalLight
                    color="#93c5fd"
                    intensity={1.25}
                    position={[-5, 1.5, -4]}
                />
                <directionalLight
                    color="#fde68a"
                    intensity={0.8}
                    position={[0, 7, 2]}
                />
                <React.Suspense fallback={null}>
                    <Bounds clip fit observe>
                        <Model />
                    </Bounds>
                </React.Suspense>
                <OrbitControls
                    enableDamping={false}
                    makeDefault
                    maxDistance={5}
                    maxPolarAngle={Math.PI * 0.92}
                    minDistance={0.4}
                />
            </Canvas>
        </div>
    );
}
