import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";


export default function ThreeDLogo() {
    const mountRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<THREE.Group>(null);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        // renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(300, 300); // fixed size — won't scale with scroll
        container.appendChild(renderer.domElement);

        // scene
        const scene = new THREE.Scene();

        // camera (fixed FOV, fixed position so scroll won't zoom)
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 5);

        // lighting
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        const dir = new THREE.DirectionalLight(0xffffff, 1);
        dir.position.set(5, 5, 5);
        scene.add(ambient, dir);

        // Load your GLTF model
        const loader = new GLTFLoader();
        loader.load('/models/scene.gltf',
            function (gltf) {
                const logo = gltf.scene;
                scene.add(logo);
                logoRef.current = logo;
            },
            function (xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function (error) {
                console.log('An error happened');
                console.log(error);
            }
        );

        // prevent scroll zoom (if OrbitControls used)
        const onWheel = (e: WheelEvent) => e.preventDefault();
        container?.addEventListener("wheel", onWheel, { passive: false });

        // animation loop
        const animate = () => {
            if (logoRef.current) {
                logoRef.current.rotation.x += 0.01;
                logoRef.current.rotation.y += 0.01;
            }
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();

        // cleanup
        return () => {
            container?.removeEventListener("wheel", onWheel);
            container?.removeChild(renderer.domElement);
            renderer.dispose();
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                width: "300px",
                height: "250px",
                cursor: "default",
                overflow: "hidden",
            }}
        />
    );
}

