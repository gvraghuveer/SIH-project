import React, { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Three.js Interactive Cyber Hologram for Chakravyuh's 4 Tracing Steps:
 * - Step 0 (Ingestion): Central suspect core + incoming particle telemetry spiral
 * - Step 1 (Traversal): 3D branched hop-by-hop transaction tree with animated pulse packets
 * - Step 2 (Attribution): Holographic VASP cluster polyhedron with target tracking rings
 * - Step 3 (Statutory): Cryptographic Section 91 seal diamond & verification hash matrix
 */
export default function HowItWorks3DVisualizer({ step = 0, className = "" }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const currentStepRef = useRef(step);
  const groupsRef = useRef([]);

  currentStepRef.current = step;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 320;
    const height = mount.clientHeight || 280;

    // 1. Scene & Camera setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 8.5);

    // 2. Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xe5b83b, 3.5, 20);
    goldLight.position.set(4, 4, 4);
    scene.add(goldLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3.5, 20);
    emeraldLight.position.set(-4, -4, 4);
    scene.add(emeraldLight);

    // 4. Background Cyber Ambient Dust
    const particleCount = 90;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 14;
      particlePositions[i + 1] = (Math.random() - 0.5) * 10;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xe5b83b,
      size: 0.045,
      transparent: true,
      opacity: 0.45,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // ─── STEP 0: INGESTION (Suspect Core & Inbound Stream) ─────────────────────
    const g0 = new THREE.Group();
    const coreGeo = new THREE.SphereGeometry(0.85, 24, 24);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x07281c,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0xe5b83b,
      emissiveIntensity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    g0.add(coreMesh);

    // Wireframe Cage
    const cageGeo = new THREE.IcosahedronGeometry(1.3, 1);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xffe28a,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    g0.add(cageMesh);

    // Orbiting Ingestion Rings
    const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.6,
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    g0.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat);
    ring2.rotation.y = Math.PI / 3;
    g0.add(ring2);

    // Inward Stream Points
    const streamCount = 40;
    const streamGeo = new THREE.BufferGeometry();
    const streamPos = new Float32Array(streamCount * 3);
    for (let i = 0; i < streamCount; i++) {
      const theta = (i / streamCount) * Math.PI * 4;
      const radius = 1.6 + (i / streamCount) * 1.5;
      streamPos[i * 3] = Math.cos(theta) * radius;
      streamPos[i * 3 + 1] = ((i / streamCount) - 0.5) * 2;
      streamPos[i * 3 + 2] = Math.sin(theta) * radius;
    }
    streamGeo.setAttribute("position", new THREE.BufferAttribute(streamPos, 3));
    const streamPoints = new THREE.Points(
      streamGeo,
      new THREE.PointsMaterial({ color: 0xffe28a, size: 0.08, transparent: true, opacity: 0.85 })
    );
    g0.add(streamPoints);

    // ─── STEP 1: TRAVERSAL (Hop Tree & Neural Fan-out) ───────────────────────
    const g1 = new THREE.Group();
    const treeNodes = [
      { pos: new THREE.Vector3(-2.2, 0, 0), color: 0xffe28a, size: 0.3 }, // Root
      { pos: new THREE.Vector3(-0.8, 1.2, 0.5), color: 0x10b981, size: 0.22 }, // Hop 1A
      { pos: new THREE.Vector3(-0.7, -1.1, -0.4), color: 0x10b981, size: 0.22 }, // Hop 1B
      { pos: new THREE.Vector3(0.9, 1.7, 0.8), color: 0x34d399, size: 0.18 }, // Hop 2A
      { pos: new THREE.Vector3(1.1, 0.6, 0.2), color: 0x34d399, size: 0.18 }, // Hop 2B
      { pos: new THREE.Vector3(1.0, -0.8, -0.7), color: 0x34d399, size: 0.18 }, // Hop 2C
      { pos: new THREE.Vector3(1.2, -1.8, -0.2), color: 0x34d399, size: 0.18 }, // Hop 2D
      { pos: new THREE.Vector3(2.4, 1.2, 0.6), color: 0xffe28a, size: 0.26 }, // Endpoint 1
      { pos: new THREE.Vector3(2.5, -1.2, -0.5), color: 0xffe28a, size: 0.26 }, // Endpoint 2
    ];

    treeNodes.forEach((node) => {
      const nMesh = new THREE.Mesh(
        new THREE.SphereGeometry(node.size, 16, 16),
        new THREE.MeshStandardMaterial({
          color: node.color,
          emissive: node.color,
          emissiveIntensity: 0.65,
          roughness: 0.2,
        })
      );
      nMesh.position.copy(node.pos);
      g1.add(nMesh);
    });

    // Connecting Lines
    const connections = [
      [0, 1], [0, 2],
      [1, 3], [1, 4],
      [2, 5], [2, 6],
      [3, 7], [4, 7],
      [5, 8], [6, 8]
    ];
    const lineMat = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.55 });
    connections.forEach(([from, to]) => {
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        treeNodes[from].pos,
        treeNodes[to].pos,
      ]);
      const line = new THREE.Line(lineGeo, lineMat);
      g1.add(line);
    });

    // ─── STEP 2: ATTRIBUTION (VASP Cluster Target Hologram) ──────────────────
    const g2 = new THREE.Group();
    // VASP Hexagonal Prism Core
    const vaspGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.45, 6);
    const vaspMat = new THREE.MeshStandardMaterial({
      color: 0x052e16,
      emissive: 0x10b981,
      emissiveIntensity: 0.45,
      metalness: 0.85,
      roughness: 0.25,
    });
    const vaspMesh = new THREE.Mesh(vaspGeo, vaspMat);
    vaspMesh.rotation.x = Math.PI / 4;
    g2.add(vaspMesh);

    // Target Reticle Ring
    const reticleGeo = new THREE.RingGeometry(1.8, 1.86, 32);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xffe28a,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const reticle = new THREE.Mesh(reticleGeo, reticleMat);
    g2.add(reticle);

    // Orbiting Satellite Tags
    const satGroup = new THREE.Group();
    for (let i = 0; i < 3; i++) {
      const angle = (i / 3) * Math.PI * 2;
      const sat = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.35),
        new THREE.MeshStandardMaterial({
          color: 0xffe28a,
          emissive: 0xe5b83b,
          emissiveIntensity: 0.6,
        })
      );
      sat.position.set(Math.cos(angle) * 2.3, Math.sin(angle) * 2.3, 0);
      satGroup.add(sat);
    }
    g2.add(satGroup);

    // ─── STEP 3: STATUTORY (Cryptographic Proof Diamond Seal) ────────────────
    const g3 = new THREE.Group();
    // Cryptographic Diamond Octahedron
    const octGeo = new THREE.OctahedronGeometry(1.35, 0);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x0d2818,
      emissive: 0xffe28a,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.15,
      wireframe: false,
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    g3.add(octMesh);

    // Outer Wireframe Crystal Lattice
    const latticeGeo = new THREE.OctahedronGeometry(1.7, 1);
    const latticeMat = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const latticeMesh = new THREE.Mesh(latticeGeo, latticeMat);
    g3.add(latticeMesh);

    // Verification Coordinate Cross Ring
    const certRingGeo = new THREE.TorusGeometry(2.1, 0.025, 16, 48);
    const certRingMat = new THREE.MeshBasicMaterial({
      color: 0xffe28a,
      transparent: true,
      opacity: 0.75,
    });
    const certRing = new THREE.Mesh(certRingGeo, certRingMat);
    certRing.rotation.x = Math.PI / 2.5;
    g3.add(certRing);

    // Add all 4 step groups to scene
    const groups = [g0, g1, g2, g3];
    groupsRef.current = groups;
    groups.forEach((g) => scene.add(g));

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.2;
      targetY = y * 0.8;
    };

    mount.addEventListener("mousemove", onMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!mount || !rendererRef.current) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    // Animation Loop with Smooth Interpolation
    let frameId;
    let clock = new THREE.Clock();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const activeIdx = currentStepRef.current;

      // Mouse Parallax Smoothing
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      // Smooth Group Transitions (Fade / Scale In & Out)
      groups.forEach((g, i) => {
        const isSelected = i === activeIdx;
        const targetScale = isSelected ? 1 : 0.001;
        const targetOpacity = isSelected ? 1 : 0;

        g.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.08);
        g.visible = g.scale.x > 0.01;
      });

      // Ambient Particles Slow Float
      particleSystem.rotation.y = elapsed * 0.03;
      particleSystem.rotation.x = elapsed * 0.02;

      // Active Step Specific 3D Rotations & Dynamics
      if (activeIdx === 0) {
        cageMesh.rotation.y = elapsed * 0.45;
        cageMesh.rotation.x = elapsed * 0.25;
        ring1.rotation.z = elapsed * 0.35;
        ring2.rotation.z = -elapsed * 0.4;
        streamPoints.rotation.y = -elapsed * 0.6;
        g0.rotation.y = mouseX * 0.6;
        g0.rotation.x = mouseY * 0.6;
      } else if (activeIdx === 1) {
        g1.rotation.y = Math.sin(elapsed * 0.4) * 0.3 + mouseX * 0.8;
        g1.rotation.x = Math.cos(elapsed * 0.3) * 0.2 + mouseY * 0.6;
      } else if (activeIdx === 2) {
        vaspMesh.rotation.y = elapsed * 0.5;
        vaspMesh.rotation.z = elapsed * 0.3;
        reticle.rotation.z = -elapsed * 0.4;
        satGroup.rotation.z = elapsed * 0.65;
        g2.rotation.y = mouseX * 0.7;
        g2.rotation.x = mouseY * 0.7;
      } else if (activeIdx === 3) {
        octMesh.rotation.y = elapsed * 0.6;
        octMesh.rotation.x = elapsed * 0.35;
        latticeMesh.rotation.y = -elapsed * 0.4;
        certRing.rotation.z = elapsed * 0.5;
        g3.rotation.y = mouseX * 0.65;
        g3.rotation.x = mouseY * 0.65;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeEventListener("mousemove", onMouseMove);
      if (renderer.domElement && mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      // Dispose Geometries & Materials
      [coreGeo, cageGeo, ringGeo, streamGeo, vaspGeo, reticleGeo, octGeo, latticeGeo, certRingGeo, particleGeometry].forEach(
        (g) => g.dispose()
      );
      [coreMat, cageMat, ringMat, vaspMat, reticleMat, octMat, latticeMat, certRingMat, particleMaterial].forEach(
        (m) => m.dispose()
      );
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none pointer-events-auto ${className}`}
      style={{ minHeight: "260px" }}
      aria-hidden="true"
    />
  );
}
