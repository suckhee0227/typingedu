import { useEffect, useRef } from "react";
import WebGLFluid from "webgl-fluid";

/**
 * 마우스를 움직이면 실제 물이 번지고 흐르는 듯한 유체 시뮬레이션 배경.
 * 검증된 webgl-fluid (Pavel Dobryakov WebGL Fluid Simulation, MIT) 위에 동작.
 * 캔버스가 포인터 이벤트를 받아야 반응하므로, 위에 얹는 텍스트는 pointer-events-none 처리.
 */
export default function FluidCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    WebGLFluid(canvas, {
      SIM_RESOLUTION: 128,
      DYE_RESOLUTION: 1024,
      DENSITY_DISSIPATION: 1.4, // 물 자국이 서서히 사라지는 속도
      VELOCITY_DISSIPATION: 0.9,
      PRESSURE: 0.8,
      CURL: 28, // 소용돌이 강도
      SPLAT_RADIUS: 0.22,
      SPLAT_FORCE: 6500,
      SHADING: true,
      COLORFUL: true,
      COLOR_UPDATE_SPEED: 7,
      BACK_COLOR: { r: 10, g: 16, b: 48 }, // 짙은 네이비 배경 → 컬러가 도드라짐
      TRANSPARENT: false,
      BLOOM: true,
      BLOOM_INTENSITY: 0.7,
      SUNRAYS: true,
      SUNRAYS_WEIGHT: 0.8,
    });
  }, []);

  return <canvas ref={ref} className="absolute inset-0 h-full w-full" />;
}
