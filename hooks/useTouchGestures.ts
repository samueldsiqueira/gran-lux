'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

interface TouchGestureOptions {
  onRotate?: (rotation: number) => void;
  onPinch?: (scale: number) => void;
  onDrag?: (x: number, y: number) => void;
  onTap?: () => void;
  onLongPress?: () => void;
}

export function useTouchGestures(options: TouchGestureOptions) {
  const [isTouching, setIsTouching] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const initialTouchesRef = useRef<React.Touch[]>([]);
  const initialRotationRef = useRef(0);
  const initialDistanceRef = useRef(0);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsTouching(true);
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };

    // Store initial touches for multi-touch gestures
    initialTouchesRef.current = Array.from(e.touches);

    // Long press detection
    if (options.onLongPress) {
      longPressTimerRef.current = setTimeout(() => {
        options.onLongPress?.();
      }, 500);
    }

    // Two finger gestures
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      
      // Initial rotation
      const angle = Math.atan2(
        touch2.clientY - touch1.clientY,
        touch2.clientX - touch1.clientX
      );
      initialRotationRef.current = angle * (180 / Math.PI);

      // Initial distance for pinch
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) +
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      initialDistanceRef.current = distance;
    }
  }, [options]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    // Cancel long press if finger moves
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Single touch - drag
    if (e.touches.length === 1 && touchStartRef.current && options.onDrag) {
      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartRef.current.x;
      const deltaY = touch.clientY - touchStartRef.current.y;
      options.onDrag(deltaX, deltaY);
    }

    // Two finger gestures
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];

      // Rotation
      if (options.onRotate) {
        const angle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );
        const currentRotation = angle * (180 / Math.PI);
        const rotationDelta = currentRotation - initialRotationRef.current;
        options.onRotate(rotationDelta);
      }

      // Pinch to scale
      if (options.onPinch) {
        const distance = Math.sqrt(
          Math.pow(touch2.clientX - touch1.clientX, 2) +
          Math.pow(touch2.clientY - touch1.clientY, 2)
        );
        const scale = distance / initialDistanceRef.current;
        options.onPinch(scale);
      }
    }
  }, [options]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    setIsTouching(false);

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }

    // Detect tap (quick touch)
    if (touchStartRef.current && options.onTap) {
      const timeDiff = Date.now() - touchStartRef.current.time;
      const touch = e.changedTouches[0];
      const distX = Math.abs(touch.clientX - touchStartRef.current.x);
      const distY = Math.abs(touch.clientY - touchStartRef.current.y);
      
      // If it was a quick touch with minimal movement, it's a tap
      if (timeDiff < 300 && distX < 10 && distY < 10) {
        options.onTap();
      }
    }

    touchStartRef.current = null;
    initialTouchesRef.current = [];
  }, [options]);

  return {
    isTouching,
    touchHandlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
}
