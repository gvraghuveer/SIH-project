import { useEffect, useRef } from "react";
const EMERALD = "#10B981";
const GOLD = "#D8B84D";

function rotatePoint(point, yAngle, zAngle) {
  const cosY = Math.cos(yAngle);
  const sinY = Math.sin(yAngle);
  const cosZ = Math.cos(zAngle);
  const sinZ = Math.sin(zAngle);
  const x = point.x * cosY + point.z * sinY;
  const z = -point.x * sinY + point.z * cosY;

  return {
    x: x * cosZ - point.y * sinZ,
    y: x * sinZ + point.y * cosZ,
    z,
  };
}

export function ChakravyuhLogo({ showMeta = true, subtitle = "NATIONAL ATTRIBUTION" }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    if (!context) return undefined;

    let frameId;
    let rotation = 0;

    const resize = () => {
      const scale = window.devicePixelRatio || 1;
      const size = 42;
      canvas.width = size * scale;
      canvas.height = size * scale;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const drawRing = (points, yAngle, zAngle, size) => {
      const projected = points.map((point) => {
        const rotated = rotatePoint(point, yAngle, zAngle);
        const perspective = 1 + rotated.z * 0.16;
        return {
          x: size / 2 + (rotated.x * size * 0.38) / perspective,
          y: size / 2 + (rotated.y * size * 0.38) / perspective,
          z: rotated.z,
        };
      });

      projected.forEach((point, index) => {
        const next = projected[(index + 1) % projected.length];
        const depth = (point.z + next.z) / 2;
        context.globalAlpha = 0.35 + (depth + 1) * 0.3;
        context.beginPath();
        context.moveTo(point.x, point.y);
        context.lineTo(next.x, next.y);
        context.stroke();
      });
    };

    const animate = () => {
      const size = 42;
      const points = Array.from({ length: 80 }, (_, index) => {
        const angle = (index / 80) * Math.PI * 2;
        return {
          x: Math.cos(angle),
          y: Math.sin(angle),
          z: 0,
        };
      });

      context.clearRect(0, 0, size, size);
      context.strokeStyle = EMERALD;
      context.lineWidth = 1.1;
      context.lineCap = "round";
      context.shadowBlur = 8;
      context.shadowColor = EMERALD;

      drawRing(points, rotation, rotation * 0.35, size);
      drawRing(points.map(({ x, y }) => ({ x, y: 0, z: y })), rotation, rotation * 0.35, size);
      drawRing(points.map(({ x, y }) => ({ x: 0, y, z: x })), rotation, rotation * 0.35, size);

      context.shadowBlur = 5;
      context.shadowColor = GOLD;
      context.fillStyle = GOLD;
      context.globalAlpha = 0.85;
      context.beginPath();
      context.arc(size / 2, size / 2, 2, 0, Math.PI * 2);
      context.fill();
      context.globalAlpha = 1;
      rotation += 0.012;
      frameId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    frameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <div className="cv-brand flex min-w-0 items-center gap-2.5 sm:gap-3" aria-label="Chakravyuh">
      <canvas
        ref={canvasRef}
        className="h-[38px] w-[38px] sm:h-[42px] sm:w-[42px] shrink-0"
        aria-hidden="true"
      />
      <div className="flex flex-col justify-center min-w-0 text-left">
        <span className="cv-brand-word font-extrabold uppercase text-white text-[13px] sm:text-[15px] tracking-[0.18em] leading-tight select-none">
          CHAKRAVYUH
        </span>
        {showMeta && (
          <div className="cv-brand-meta-lockup flex items-center gap-1.5 mt-0.5 select-none">
            <span className="cv-i4c-badge inline-flex items-center justify-center px-1.5 py-0.5 rounded-[4px] border border-[#E5B83B]/50 bg-[#E5B83B]/15 text-[#FFE28A] text-[8px] sm:text-[8.5px] font-mono font-extrabold leading-none tracking-wider shadow-sm">
              I4C
            </span>
            <span className="cv-meta-title text-[7.5px] sm:text-[8.5px] font-mono font-semibold tracking-[0.14em] text-[#8eaaa0] leading-none whitespace-nowrap">
              {subtitle}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChakravyuhLogo;
