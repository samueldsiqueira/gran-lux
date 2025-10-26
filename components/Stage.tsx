import PropTypes from 'prop-types';
"use client";
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom/client";
import {
  Stage as KonvaStage,
  Layer,
  Rect,
  Text,
  Line,
  Image,
  Circle,
  Transformer,
  Group,
} from "react-konva";
import { ICONS } from "../app/fixtures";
import useImage from "use-image";
import { Item as ItemType } from "../app/types";
import Konva from 'konva';

const GRID_SIZE = 25; // denser grid
const FRONT_OF_STAGE_MARGIN = 1.2;

interface StageProps {
  items: ItemType[];
  title: string;
  onDragEnd: (uid: string, x: number, y: number) => void;
  onSelectItem: (uid: string | null) => void;
  selectedItem: ItemType | null;
  onUpdateItem: (uid: string, properties: Partial<ItemType>) => void;
  onDrop: (fixture: ItemType, position: { x: number; y: number }, target: Konva.Node | null) => void;
  width: number;
  height: number;
  onDragMove: (uid: string, x: number, y: number) => void;
  scale?: number;
}

const KonvaReactIcon = ({ IconComponent, width, height, stroke, strokeWidth, isSelected }: {
  IconComponent: React.ComponentType<{ size: number }>;
  width: number;
  height: number;
  stroke: string;
  strokeWidth: number;
  isSelected: boolean;
}) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.left = "-9999px";
    document.body.appendChild(container);
    containerRef.current = container;

    const root = ReactDOM.createRoot(container);
    root.render(React.createElement(IconComponent, { size: width }));

    const svgElement = container.querySelector("svg");
    if (svgElement) {
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const imageUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

      const img = new window.Image();
      img.src = imageUrl;
      img.onload = () => {
        setImage(img);
      };
    }

    return () => {
      root.unmount();
      if (containerRef.current) {
        document.body.removeChild(containerRef.current);
      }
    };
  }, [IconComponent, width]);

  return (
    <Image
      image={image || undefined}
      width={width}
      height={height}
      stroke={isSelected ? stroke : undefined}
      strokeWidth={isSelected ? strokeWidth : 0}
    />
  );
};

KonvaReactIcon.propTypes = {
  IconComponent: PropTypes.elementType.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  stroke: PropTypes.string,
  strokeWidth: PropTypes.number,
  isSelected: PropTypes.bool,
};

const FixtureImage = ({ 
  item, 
  onDragEnd, 
  onSelectItem, 
  isSelected, 
  onTransformEnd, 
  shapeRef, 
  onDragMove,
  isDraggingItemRef
}: {
  item: ItemType;
  onDragEnd: (uid: string, x: number, y: number) => void;
  onSelectItem: (uid: string | null) => void;
  isSelected: boolean;
  onTransformEnd: (uid: string, updates: { x: number; y: number; rotation: number; scaleX: number; scaleY: number }) => void;
  shapeRef: React.RefObject<any>;
  onDragMove: (uid: string, x: number, y: number) => void;
  isDraggingItemRef: React.MutableRefObject<boolean>;
}) => {
  const handleDragStart = () => {
    isDraggingItemRef.current = true;
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    isDraggingItemRef.current = false;
    onDragEnd(item.uid, e.target.x(), e.target.y());
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragMove(item.uid, e.target.x(), e.target.y());
  };

  const handleTransformEnd = () => {
    if (shapeRef.current) {
      onTransformEnd(item.uid, {
        x: shapeRef.current.x(),
        y: shapeRef.current.y(),
        rotation: shapeRef.current.rotation(),
        scaleX: shapeRef.current.scaleX(),
        scaleY: shapeRef.current.scaleY(),
      });
    }
  };

  const iconSource = item.icon ? ICONS[item.icon as keyof typeof ICONS] : null;
  const imageUrl = iconSource?.startsWith("<svg")
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSource)}`
    : iconSource;

  const [image, status] = useImage(imageUrl || '');
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (status === "loaded") {
      setImageLoaded(true);
    } else if (status === "loading" || status === "failed") {
      setImageLoaded(false);
    }
  }, [status]);

  if (item.componentIcon) {
    if (
      typeof item.componentIcon !== "function" &&
      typeof item.componentIcon !== "object" &&
      item.componentIcon !== null
    ) {
      return null;
    }
    return (
      <Group
        ref={shapeRef}
        id={item.uid}
        name={item.id}
        x={item.x}
        y={item.y}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelectItem(item.uid);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelectItem(item.uid);
        }}
        onTransformEnd={handleTransformEnd}
        rotation={item.rotation}
        scaleX={item.scaleX || 1}
        scaleY={item.scaleY || 1}
        offsetX={50 / 2}
        offsetY={50 / 2}
      >
        <KonvaReactIcon
          IconComponent={item.componentIcon}
          width={50}
          height={50}
          stroke="#0ea5e9"
          strokeWidth={2}
          isSelected={isSelected}
        />
        
      </Group>
    );
  } else {
    if (!item.icon) {
      return null;
    }

    return (
      <Group
        ref={shapeRef}
        id={item.uid}
        name={item.id}
        x={item.x}
        y={item.y}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragMove={handleDragMove}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelectItem(item.uid);
        }}
        onTap={(e) => {
          e.cancelBubble = true;
          onSelectItem(item.uid);
        }}
        onTransformEnd={handleTransformEnd}
        rotation={item.rotation}
        scaleX={item.scaleX || 1}
        scaleY={item.scaleY || 1}
        offsetX={50 / 2}
        offsetY={50 / 2}
      >
        {imageLoaded ? (
          <Image
            key={imageUrl} // Add key to force re-render if imageUrl changes
            image={image}
            width={50}
            height={50}
            stroke={isSelected ? "#0ea5e9" : undefined}
            strokeWidth={2}
          />
        ) : (
          <Rect
            width={50}
            height={50}
            fill="red"
            stroke="black"
            strokeWidth={1}
          />
        )}
        {!imageLoaded && (
          <Text
            text="Error"
            fontSize={10}
            fill="white"
            x={50 / 2 - 15}
            y={50 / 2 - 5}
          />
        )}
        
      </Group>
    );
  }
};

FixtureImage.propTypes = {
  item: PropTypes.object.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onTransformEnd: PropTypes.func.isRequired,
  shapeRef: PropTypes.object.isRequired,
  onDragMove: PropTypes.func.isRequired,
};

const Vara = ({ item, onDragEnd, onSelectItem, isSelected, onTransformEnd, shapeRef, ppu, onDragMove, isDraggingItemRef }: {
  item: ItemType;
  onDragEnd: (uid: string, x: number, y: number) => void;
  onSelectItem: (uid: string | null) => void;
  isSelected: boolean;
  onTransformEnd: any;
  shapeRef: React.RefObject<any>;
  ppu: number;
  onDragMove: (uid: string, x: number, y: number) => void;
  isDraggingItemRef: React.MutableRefObject<boolean>;
}) => {
  const handleDragStart = () => {
    isDraggingItemRef.current = true;
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    isDraggingItemRef.current = false;
    onDragEnd(item.uid, e.target.x(), e.target.y());
  };

  const handleDragMove = (e: Konva.KonvaEventObject<DragEvent>) => {
    onDragMove(item.uid, e.target.x(), e.target.y());
  };

  const handleTransformEnd = () => {
    if (shapeRef.current) {
      onTransformEnd(item.uid, {
        x: shapeRef.current.x(),
        y: shapeRef.current.y(),
        rotation: shapeRef.current.rotation(),
        scaleX: shapeRef.current.scaleX(),
        scaleY: shapeRef.current.scaleY(),
      });
    }
  };

  const width = 7.72 * ppu;
  const height = 10;

  return (
    <Rect
      ref={shapeRef}
      id={item.uid}
      name={item.id}
      x={item.x}
      y={item.y}
      width={width}
      height={height}
      fill="black"
      draggable
      onDragStart={handleDragStart}
      onDragMove={handleDragMove}
      onDragEnd={handleDragEnd}
      onMouseDown={(e) => {
        e.cancelBubble = true;
        onSelectItem(item.uid);
      }}
      onTap={(e) => {
        e.cancelBubble = true;
        onSelectItem(item.uid);
      }}
      onTransformEnd={handleTransformEnd}
      stroke={isSelected ? "#0ea5e9" : undefined}
      strokeWidth={isSelected ? 5 : 0}
      rotation={item.rotation}
      scaleX={item.scaleX || 1}
      scaleY={item.scaleY || 1}
      offsetX={width / 2}
      offsetY={height / 2}
    />
  );
};

Vara.propTypes = {
  item: PropTypes.object.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onTransformEnd: PropTypes.func.isRequired,
  shapeRef: PropTypes.object.isRequired,
  ppu: PropTypes.number.isRequired,
  onDragMove: PropTypes.func.isRequired,
};

const Item = ({ item, onDragEnd, onSelectItem, isSelected, onTransformEnd, shapeRef, ppu, onDragMove, isDraggingItemRef }: {
  item: ItemType;
  onDragEnd: (uid: string, x: number, y: number) => void;
  onSelectItem: (uid: string | null) => void;
  isSelected: boolean;
  onTransformEnd: any;
  shapeRef: React.RefObject<any>;
  ppu: number;
  onDragMove: (uid: string, x: number, y: number) => void;
  isDraggingItemRef: React.MutableRefObject<boolean>;
}) => {
  if (item.id === "vara") {
    return (
      <Vara
        item={item}
        onDragEnd={onDragEnd}
        onSelectItem={onSelectItem}
        isSelected={isSelected}
        onTransformEnd={onTransformEnd}
        shapeRef={shapeRef}
        ppu={ppu}
        onDragMove={onDragMove}
        isDraggingItemRef={isDraggingItemRef}
      />
    );
  }
  return (
    <FixtureImage
      item={item}
      onDragEnd={onDragEnd}
      onSelectItem={onSelectItem}
      isSelected={isSelected}
      onTransformEnd={onTransformEnd}
      shapeRef={shapeRef}
      onDragMove={onDragMove}
      isDraggingItemRef={isDraggingItemRef}
    />
  );
};

Item.propTypes = {
  item: PropTypes.object.isRequired,
  onDragEnd: PropTypes.func.isRequired,
  onSelectItem: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onTransformEnd: PropTypes.func.isRequired,
  shapeRef: PropTypes.object.isRequired,
  ppu: PropTypes.number,
  onDragMove: PropTypes.func.isRequired,
  items: PropTypes.array.isRequired,
};

const Stage = React.forwardRef<Konva.Stage, StageProps>(
  (
    {
      items,
      title,
      onDragEnd,
      onSelectItem,
      selectedItem,
      onUpdateItem,
      onDrop,
      width,
      height,
      onDragMove,
      scale = 1,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const trRef = React.useRef<Konva.Transformer | null>(null);
    const shapeRefs = React.useRef<Record<string, any>>({});
    const layerRef = React.useRef<Konva.Layer | null>(null);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
    const isPanningRef = React.useRef(false);
    const isSpacePressedRef = React.useRef(false);
    const isDraggingItemRef = React.useRef(false);
    const isTransformingRef = React.useRef(false);
    const lastClientRef = React.useRef<{x:number;y:number}|null>(null);

    React.useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          isSpacePressedRef.current = true;
          e.preventDefault();
        }
      };
      const onKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          isSpacePressedRef.current = false;
        }
      };
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      };
    }, []);

    // Center the stage on mount and when size changes
    React.useEffect(() => {
      // Calculate stage dimensions
      const ppu = width / 12;
      const stageWidth = 7.72 * ppu;
      const stageHeight = 4.72 * ppu;
      const frontHeight = 1.5 * ppu;
      
      // Calculate position to center the stage in the canvas
      const stageX = (width - stageWidth) / 2;
      const stageY = (height - stageHeight) / 2 - (frontHeight) / 2 + 40;
      const frontOfStageY = stageY + stageHeight + FRONT_OF_STAGE_MARGIN * ppu;
      
      // Calculate the bounding box of all elements (stage + front)
      const totalTop = stageY - 40; // Include title
      const totalBottom = frontOfStageY + frontHeight;
      const totalHeight = totalBottom - totalTop;
      
      // Calculate the center of all content
      const contentCenterX = stageX + stageWidth / 2;
      const contentCenterY = totalTop + totalHeight / 2;
      
      const canvasCenterX = width / 2;
      const canvasCenterY = height / 2;
      
      // Calculate offset to center all content
      const offsetX = canvasCenterX - contentCenterX * scale;
      const offsetY = canvasCenterY - contentCenterY * scale;
      
      setOffset({ x: offsetX, y: offsetY });
    }, [width, height, scale]);

    const ppu = width / 12;

    React.useEffect(() => {
      if (selectedItem && trRef.current) {
        const selectedNode = shapeRefs.current[selectedItem.uid]?.current;
        if (selectedNode) {
          trRef.current.nodes([selectedNode]);
          trRef.current.getLayer()?.batchDraw();
        }
      } else if (trRef.current) {
        trRef.current.nodes([]);
        trRef.current.getLayer()?.batchDraw();
      }
    }, [selectedItem]);

    const handleTransformEnd = (uid: string, updates: { x: number; y: number; rotation: number; scaleX: number; scaleY: number }) => {
      onUpdateItem(uid, updates);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      const fixture = JSON.parse(data);
      if (!ref || typeof ref === 'function') return;
      const stage = ref.current;
      if (!stage) return;
      const rect = stage.container().getBoundingClientRect();
      const pointerPosition = {
        x: (e.clientX - rect.left - offset.x) / scale,
        y: (e.clientY - rect.top - offset.y) / scale,
      };
      const target = stage.getIntersection(pointerPosition) || null;
      onDrop(fixture, pointerPosition, target);
    };

    const stageWidth = 7.72 * ppu;
    const stageHeight = 4.72 * ppu;
    const stageX = (width - stageWidth) / 2;
    // Add more space at top for title (moved down by 40px)
    const stageY = (height - stageHeight) / 2 - (1.5 * ppu) / 2 + 40;

    const frontOfStageY = stageY + stageHeight + FRONT_OF_STAGE_MARGIN * ppu;

    const fixtures = items.filter(item => item.id !== 'vara');
    const varas = items.filter(item => item.id === 'vara');

    return (
      <div
        className="card"
        ref={containerRef}
        style={{ 
          cursor: isPanningRef.current ? 'grabbing' : (isSpacePressedRef.current ? 'grab' : 'default'),
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => {
          // Space+Left click or Right/Middle button to pan
          if ((e.button === 0 && isSpacePressedRef.current) || e.button === 1 || e.button === 2) {
            isPanningRef.current = true;
            lastClientRef.current = { x: e.clientX, y: e.clientY };
            e.preventDefault();
          }
        }}
        onMouseMove={(e) => {
          if (!isPanningRef.current || !lastClientRef.current) return;
          const dx = e.clientX - lastClientRef.current.x;
          const dy = e.clientY - lastClientRef.current.y;
          lastClientRef.current = { x: e.clientX, y: e.clientY };
          setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        }}
        onMouseUp={() => { isPanningRef.current = false; lastClientRef.current = null; }}
        onMouseLeave={() => { isPanningRef.current = false; lastClientRef.current = null; }}
        onTouchStart={(e) => {
          // Don't pan if we're dragging an item or transforming
          if (isDraggingItemRef.current || isTransformingRef.current) return;
          
          // Check if touch is on stage (Konva element)
          // If user touches a transformer anchor or selected item, don't pan
          if (ref && typeof ref !== 'function' && ref.current) {
            const stage = ref.current;
            const touch = e.touches[0];
            const rect = stage.container().getBoundingClientRect();
            const x = (touch.clientX - rect.left - offset.x) / scale;
            const y = (touch.clientY - rect.top - offset.y) / scale;
            const shape = stage.getIntersection({ x, y });
            
            // If we touched a shape (item, transformer anchor, etc), don't pan
            if (shape) {
              return;
            }
          }
          
          // Only pan with 1 finger on background (not on items)
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            isPanningRef.current = true;
            lastClientRef.current = { x: touch.clientX, y: touch.clientY };
          }
        }}
        onTouchMove={(e) => {
          // Don't pan if we're dragging an item or transforming
          if (isDraggingItemRef.current || isTransformingRef.current) return;
          
          if (!isPanningRef.current || !lastClientRef.current) return;
          if (e.touches.length !== 1) return; // Only single touch pan
          
          const touch = e.touches[0];
          const dx = touch.clientX - lastClientRef.current.x;
          const dy = touch.clientY - lastClientRef.current.y;
          lastClientRef.current = { x: touch.clientX, y: touch.clientY };
          setOffset((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        }}
        onTouchEnd={() => { 
          isPanningRef.current = false; 
          lastClientRef.current = null; 
        }}
      >
        <KonvaStage ref={ref} width={width} height={height}>
          <Layer ref={layerRef}>
            {/* Background - outside Group so it fills entire canvas */}
            <Rect
              x={0}
              y={0}
              width={width}
              height={height}
              fill="#f1f5f9"
              listening={false}
            />
            
            {/* Grid background - single grid that covers entire canvas */}
            {(() => {
              const gridBg = [];
              for (let i = 0; i <= Math.ceil(width / GRID_SIZE); i++) {
                const x = i * GRID_SIZE;
                gridBg.push(
                  <Line
                    key={`bg-v-${i}`}
                    points={[x, 0, x, height]}
                    stroke="#e5e7eb"
                    strokeWidth={0.5}
                    listening={false}
                  />
                );
              }
              for (let i = 0; i <= Math.ceil(height / GRID_SIZE); i++) {
                const y = i * GRID_SIZE;
                gridBg.push(
                  <Line
                    key={`bg-h-${i}`}
                    points={[0, y, width, y]}
                    stroke="#e5e7eb"
                    strokeWidth={0.5}
                    listening={false}
                  />
                );
              }
              return gridBg;
            })()}
            
            <Group x={offset.x} y={offset.y} scaleX={scale} scaleY={scale}>
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="transparent"
                onMouseDown={() => onSelectItem(null)}
                onTap={() => onSelectItem(null)}
              />

            {/* Title - centered above the stage */}
            <Text
              text={title}
              x={0}
              y={stageY - 40}
              width={width}
              fontSize={24}
              fontStyle="bold"
              fill="#0f172a"
              align="center"
            />

            {/* Stage Plan */}
            <Rect
              x={stageX}
              y={stageY}
              width={stageWidth}
              height={stageHeight}
              stroke="black"
              strokeWidth={2}
              onMouseDown={() => onSelectItem(null)}
              onTap={() => onSelectItem(null)}
            />
            <Text
              text="PALCO"
              x={stageX + stageWidth / 2 - 30}
              y={stageY + stageHeight / 2}
              fontSize={24}
              listening={false}
            />

            {/* Front of Stage */}
            <Rect
              x={stageX}
              y={frontOfStageY}
              width={stageWidth}
              height={1.5 * ppu}
              stroke="black"
              strokeWidth={1}
              strokeDash={[10, 5]}
              onMouseDown={() => onSelectItem(null)}
              onTap={() => onSelectItem(null)}
            />
            <Text
              text="FRENTE DO PALCO"
              x={stageX + stageWidth / 2 - 60}
              y={frontOfStageY + 20}
              fontSize={18}
              listening={false}
            />

            {/* Fixtures */}
            {fixtures.map((item) => {
              shapeRefs.current[item.uid] =
                shapeRefs.current[item.uid] || React.createRef();
              return (
                <Item
                  key={item.uid}
                  item={item}
                  onDragEnd={onDragEnd}
                  onSelectItem={onSelectItem}
                  isSelected={selectedItem?.uid === item.uid}
                  onTransformEnd={handleTransformEnd}
                  shapeRef={shapeRefs.current[item.uid]}
                  ppu={ppu}
                  onDragMove={onDragMove}
                  isDraggingItemRef={isDraggingItemRef}
                />
              );
            })}

            {/* Varas */}
            {varas.map((item) => {
              shapeRefs.current[item.uid] =
                shapeRefs.current[item.uid] || React.createRef();
              return (
                <Item
                  key={item.uid}
                  item={item}
                  onDragEnd={onDragEnd}
                  onSelectItem={onSelectItem}
                  isSelected={selectedItem?.uid === item.uid}
                  onTransformEnd={handleTransformEnd}
                  shapeRef={shapeRefs.current[item.uid]}
                  ppu={ppu}
                  onDragMove={onDragMove}
                  isDraggingItemRef={isDraggingItemRef}
                />
              );
            })}

            {/* Labels overlay (not rotated with item) */}
            {fixtures.map((item) => {
              const labelNum = (item.markerNumber ?? item.number);
              if (!labelNum) return null;
              const len = labelNum.toString().length;
              const textX = item.x + (len === 1 ? 21 : len === 2 ? 18 : 15);
              const textY = item.y - 29;
              return (
                <Group key={`label-${item.uid}`} listening={false}>
                  <Circle x={item.x + 25} y={item.y - 25} radius={12} fill="#fff" stroke={item.color || "#111"} strokeWidth={2} />
                  <Text text={`${labelNum}`} fontSize={11} fill="#111" x={textX} y={textY} listening={false} />
                </Group>
              );
            })}

            <Transformer 
              ref={trRef}
              onTransformStart={() => {
                isTransformingRef.current = true;
              }}
              onTransformEnd={() => {
                isTransformingRef.current = false;
              }}
            />
            </Group>
          </Layer>
        </KonvaStage>
      </div>
    );
  },
);

Stage.displayName = 'Stage';

export default Stage;
