"use client";

import { ROCKET_FIRE_FRAGMENT_SHADER } from "@lib/rocket-fire-glsl";
import { Bounds, OrbitControls, useBounds, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as React from "react";
import * as THREE from "three";
import { Pane } from "tweakpane";

const GLTF_PATH = "/models/rocket-fire.gltf";
const leadingLinear = new THREE.Color("#406EFF");
const trailingLinear = new THREE.Color("#FE5F1E");
const throttleDefault: number = 1;

interface Entry {
    cameraLocal: THREE.Vector3;
    material: THREE.RawShaderMaterial;
    mesh: THREE.Mesh;
}

interface SceneSetup {
    disposableMaterials: THREE.Material[];
    entries: Entry[];
    root: THREE.Object3D;
}

const DEFAULTS = {
    brightnessExponential: 1,
    brightnessMultiplier: 7,
    coneOffset: 2.27,
    cones: 3.059_999_942_779_541,
    conesMax: 12,
    conesMin: 0.25,
    conesStep: 0.01,
    leadingColor: [leadingLinear.r, leadingLinear.g, leadingLinear.b, 1],
    throttle: throttleDefault,
    throttleMax: 1,
    throttleMin: 0,
    throttleStep: 0.01,
    trailingColor: [trailingLinear.r, trailingLinear.g, trailingLinear.b, 1],
    turbulenceFactor: 0.899_999_976_158_142_1,
} as const;

interface RGB {
    b: number;
    g: number;
    r: number;
}

interface DebugState {
    cones: number;
    leadingColor: RGB;
    throttle: number;
    trailingColor: RGB;
}

function createInitialDebugOptions(): DebugState {
    return {
        cones: DEFAULTS.cones,
        leadingColor: {
            b: DEFAULTS.leadingColor[2],
            g: DEFAULTS.leadingColor[1],
            r: DEFAULTS.leadingColor[0],
        },
        throttle: DEFAULTS.throttle,
        trailingColor: {
            b: DEFAULTS.trailingColor[2],
            g: DEFAULTS.trailingColor[1],
            r: DEFAULTS.trailingColor[0],
        },
    };
}

function cloneDebugOptions(state: DebugState): DebugState {
    return {
        cones: state.cones,
        leadingColor: {
            b: state.leadingColor.b,
            g: state.leadingColor.g,
            r: state.leadingColor.r,
        },
        throttle: state.throttle,
        trailingColor: {
            b: state.trailingColor.b,
            g: state.trailingColor.g,
            r: state.trailingColor.r,
        },
    };
}

const VERTEX_SHADER = /* glsl */ `
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

function perpendicularCameraOffset(
    boxSize: THREE.Vector3,
    distance: number,
): THREE.Vector3 {
    const sx = boxSize.x;
    const sy = boxSize.y;
    const sz = boxSize.z;
    if (sx >= sy && sx >= sz) {
        return new THREE.Vector3(0, 0, distance);
    }
    if (sy >= sz) {
        return new THREE.Vector3(0, 0, distance);
    }
    return new THREE.Vector3(distance, 0, 0);
}

function BoundsPerpendicularCamera() {
    const bounds = useBounds();
    const invalidate = useThree((s) => s.invalidate);

    React.useLayoutEffect(() => {
        if (!bounds) {
            return;
        }
        bounds.refresh();
        const { center, distance, size: boxSize } = bounds.getSize();
        if (
            boxSize.x <= Number.EPSILON &&
            boxSize.y <= Number.EPSILON &&
            boxSize.z <= Number.EPSILON
        ) {
            return;
        }
        const offset = perpendicularCameraOffset(boxSize, distance);
        bounds.moveTo(center.clone().add(offset)).lookAt({ target: center });
        bounds.clip();
        invalidate();
    }, [bounds, invalidate]);

    return null;
}

function createMaterial(bounds: THREE.Box3): THREE.RawShaderMaterial {
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
                value: DEFAULTS.brightnessExponential,
            },
            uBrightnessMultiplier: {
                value: DEFAULTS.brightnessMultiplier,
            },
            uCameraLocal: { value: new THREE.Vector3() },
            uConeOffset: { value: DEFAULTS.coneOffset },
            uCones: { value: DEFAULTS.cones },
            uJetAxis: { value: jetAxisFromBounds(boundsMin, boundsMax) },
            uLeadingColor: {
                value: new THREE.Vector4(...DEFAULTS.leadingColor),
            },
            uThrottle: { value: DEFAULTS.throttle },
            uTime: { value: 0 },
            uTrailingColor: {
                value: new THREE.Vector4(...DEFAULTS.trailingColor),
            },
            uTurbulenceFactor: {
                value: DEFAULTS.turbulenceFactor,
            },
        },
        vertexShader: VERTEX_SHADER,
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

function tuneMaterials(root: THREE.Object3D) {
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

function prepareEntries(
    root: THREE.Object3D,
    disposableMaterials: THREE.Material[],
): Entry[] {
    const entries: Entry[] = [];

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

        const nextMaterial = createMaterial(bounds);
        const cameraLocal = nextMaterial.uniforms.uCameraLocal?.value;
        if (!(cameraLocal instanceof THREE.Vector3)) {
            throw new Error("Material missing uCameraLocal vec3");
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

function DebugPanel(props: {
    debug: DebugState;
    onDebugChange: (next: DebugState) => void;
}) {
    const { debug, onDebugChange } = props;
    const rootRef = React.useRef<HTMLDivElement>(null);
    const paneRef = React.useRef<Pane | null>(null);
    const paramsRef = React.useRef<DebugState>(createInitialDebugOptions());

    const emitChange = React.useCallback(() => {
        onDebugChange(cloneDebugOptions(paramsRef.current));
    }, [onDebugChange]);

    React.useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return;
        }
        const pane = new Pane({
            container: root,
            title: "Scene",
        });
        paneRef.current = pane;
        const p = paramsRef.current;
        const colorOpts = { color: { type: "float" as const } };

        pane.addBinding(p, "throttle", {
            label: "Throttle",
            max: DEFAULTS.throttleMax,
            min: DEFAULTS.throttleMin,
            step: DEFAULTS.throttleStep,
        }).on("change", emitChange);

        pane.addBinding(p, "leadingColor", {
            ...colorOpts,
            label: "Leading color",
        }).on("change", emitChange);

        pane.addBinding(p, "trailingColor", {
            ...colorOpts,
            label: "Trailing color",
        }).on("change", emitChange);

        pane.addBinding(p, "cones", {
            label: "Cones",
            max: DEFAULTS.conesMax,
            min: DEFAULTS.conesMin,
            step: DEFAULTS.conesStep,
        }).on("change", emitChange);

        return () => {
            pane.dispose();
            paneRef.current = null;
        };
    }, [emitChange]);

    React.useEffect(() => {
        const p = paramsRef.current;
        p.throttle = debug.throttle;
        p.cones = debug.cones;
        p.leadingColor.r = debug.leadingColor.r;
        p.leadingColor.g = debug.leadingColor.g;
        p.leadingColor.b = debug.leadingColor.b;
        p.trailingColor.r = debug.trailingColor.r;
        p.trailingColor.g = debug.trailingColor.g;
        p.trailingColor.b = debug.trailingColor.b;
        paneRef.current?.refresh();
    }, [debug]);

    return (
        <div
            className="pointer-events-auto fixed top-3 right-3 z-1000 w-[min(18rem,calc(100vw-1.5rem))]"
            ref={rootRef}
        />
    );
}

function Model(props: { debug: DebugState }) {
    const { debug } = props;
    const gltf = useGLTF(GLTF_PATH);

    const { disposableMaterials, entries, root } =
        React.useMemo<SceneSetup>(() => {
            const cloned = gltf.scene.clone(true);
            const materials = cloneMeshMaterials(cloned);
            tuneMaterials(cloned);

            return {
                disposableMaterials: materials,
                entries: prepareEntries(cloned, materials),
                root: cloned,
            };
        }, [gltf]);

    React.useLayoutEffect(() => {
        for (const entry of entries) {
            const u = entry.material.uniforms;
            u.uThrottle.value = debug.throttle;
            u.uCones.value = debug.cones;
            const lead = u.uLeadingColor.value;
            const trail = u.uTrailingColor.value;
            if (lead instanceof THREE.Vector4) {
                lead.set(
                    debug.leadingColor.r,
                    debug.leadingColor.g,
                    debug.leadingColor.b,
                    1,
                );
            }
            if (trail instanceof THREE.Vector4) {
                trail.set(
                    debug.trailingColor.r,
                    debug.trailingColor.g,
                    debug.trailingColor.b,
                    1,
                );
            }
        }
    }, [entries, debug]);

    useFrame(({ camera, clock }) => {
        const t = clock.elapsedTime;
        for (const entry of entries) {
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
            for (const entry of entries) {
                entry.material.dispose();
            }
        };
    }, [disposableMaterials, entries]);

    return <primitive object={root} />;
}

useGLTF.preload(GLTF_PATH);

export function Scene() {
    const [debug, setDebug] = React.useState<DebugState>(() =>
        createInitialDebugOptions(),
    );
    const onDebugChange = React.useCallback((next: DebugState) => {
        setDebug(next);
    }, []);

    return (
        <div className="h-full min-h-dvh w-full">
            <DebugPanel debug={debug} onDebugChange={onDebugChange} />
            <Canvas
                camera={{
                    far: 100,
                    fov: 45,
                    near: 0.1,
                    position: [0, 0, 2],
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
                    <Bounds clip observe>
                        <Model debug={debug} />
                        <BoundsPerpendicularCamera />
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
