"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

export default function InfiniteGridCanvas({
  className = "absolute inset-0 w-full h-full", // <-- default: ocupa toda a área do pai
  background = "#f7f7f9",
  minorColor = "#e5e7eb",
  majorColor = "#d1d5db",
  axisColor = "#9ca3af",
  originColor = "#6b7280",
  gridSize = 40,
  majorEvery = 5,
  minZoom = 0.25,
  maxZoom = 4,
  showOrigin = true,
}: {
  className?: string;
  background?: string;
  minorColor?: string;
  majorColor?: string;
  axisColor?: string;
  originColor?: string;
  gridSize?: number;
  majorEvery?: number;
  minZoom?: number;
  maxZoom?: number;
  showOrigin?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [cam, setCam] = useState({ x: 0, y: 0, z: 1 });
  const camRef = useRef(cam);
  useEffect(() => {
    camRef.current = cam;
  }, [cam]);

  const rafRef = useRef<number | null>(null);
  const isPanningRef = useRef(false);
  const lastPosRef = useRef<{ x: number; y: number } | null>(null);

  const getLocalPoint = useCallback((clientX: number, clientY: number) => {
    const rect = containerRef.current!.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  }, []);

  const screenToWorld = useCallback((sx: number, sy: number) => {
    const { x, y, z } = camRef.current;
    return { wx: (sx - x) / z, wy: (sy - y) / z };
  }, []);

  const worldToScreen = useCallback((wx: number, wy: number) => {
    const { x, y, z } = camRef.current;
    return { sx: wx * z + x, sy: wy * z + y };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const { clientWidth, clientHeight } = container;
    const targetW = Math.floor(clientWidth * dpr);
    const targetH = Math.floor(clientHeight * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = `${clientWidth}px`;
      canvas.style.height = `${clientHeight}px`;
    }
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    resizeCanvas();

    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const w = container.clientWidth;
    const h = container.clientHeight;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, w, h);

    const { x, y, z } = camRef.current;

    const scaledGridSize = gridSize * z;
    const majorGridSize = scaledGridSize * majorEvery;

    const xOffset = x % scaledGridSize;
    const yOffset = y % scaledGridSize;
    const majorXOffset = x % majorGridSize;
    const majorYOffset = y % majorGridSize;

    ctx.lineWidth = 1;

    // minor
    ctx.strokeStyle = minorColor;
    for (let i = 0; i * scaledGridSize + xOffset < w; i++) {
      const lineX = i * scaledGridSize + xOffset;
      ctx.beginPath();
      ctx.moveTo(lineX + 0.5, 0);
      ctx.lineTo(lineX + 0.5, h);
      ctx.stroke();
    }
    for (let i = 0; i * scaledGridSize + yOffset < h; i++) {
      const lineY = i * scaledGridSize + yOffset;
      ctx.beginPath();
      ctx.moveTo(0, lineY + 0.5);
      ctx.lineTo(w, lineY + 0.5);
      ctx.stroke();
    }

    // major
    ctx.strokeStyle = majorColor;
    for (let i = 0; i * majorGridSize + majorXOffset < w; i++) {
      const lineX = i * majorGridSize + majorXOffset;
      ctx.beginPath();
      ctx.moveTo(lineX + 0.5, 0);
      ctx.lineTo(lineX + 0.5, h);
      ctx.stroke();
    }
    for (let i = 0; i * majorGridSize + majorYOffset < h; i++) {
      const lineY = i * majorGridSize + majorYOffset;
      ctx.beginPath();
      ctx.moveTo(0, lineY + 0.5);
      ctx.lineTo(w, lineY + 0.5);
      ctx.stroke();
    }

    // eixos
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    if (x > 0 && x < w) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
      ctx.stroke();
    }
    if (y > 0 && y < h) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
      ctx.stroke();
    }

    if (showOrigin) {
      ctx.fillStyle = originColor;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, [
    resizeCanvas,
    background,
    minorColor,
    majorColor,
    axisColor,
    originColor,
    gridSize,
    majorEvery,
    showOrigin,
  ]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      resizeCanvas();
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(draw);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [resizeCanvas, draw]);

  const handlePanStart = (e: React.MouseEvent | React.TouchEvent) => {
    isPanningRef.current = true;
    const pos = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const p = getLocalPoint(pos.clientX, pos.clientY);
    lastPosRef.current = { x: p.x, y: p.y };
  };
  const handlePanMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isPanningRef.current || !lastPosRef.current) return;
    const pos = "touches" in e ? e.touches[0] : (e as React.MouseEvent);
    const p = getLocalPoint(pos.clientX, pos.clientY);
    const dx = p.x - lastPosRef.current.x;
    const dy = p.y - lastPosRef.current.y;
    lastPosRef.current = { x: p.x, y: p.y };
    setCam((c) => ({ ...c, x: c.x + dx, y: c.y + dy }));
  };
  const handlePanEnd = () => {
    isPanningRef.current = false;
  };

  const handleZoom = (e: React.WheelEvent) => {
    e.preventDefault();
    const { clientX, clientY, deltaY, ctrlKey, metaKey } = e;
    const local = getLocalPoint(clientX, clientY);
    const intensity = ctrlKey || metaKey ? 1.15 : 1.07;
    const factor = deltaY > 0 ? 1 / intensity : intensity;

    setCam((c) => {
      let z = c.z * factor;
      z = Math.max(minZoom, Math.min(maxZoom, z));
      const { wx, wy } = screenToWorld(local.x, local.y);
      const x = local.x - wx * z;
      const y = local.y - wy * z;
      return { x, y, z };
    });
  };

  return (
    <div
      ref={containerRef}
      className={`${className} select-none touch-none`} // <-- sem "absolute inset-0" forçado
      onMouseDown={handlePanStart}
      onMouseMove={handlePanMove}
      onMouseUp={handlePanEnd}
      onMouseLeave={handlePanEnd}
      onTouchStart={handlePanStart}
      onTouchMove={handlePanMove}
      onTouchEnd={handlePanEnd}
      onWheel={handleZoom}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}
