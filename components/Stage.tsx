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
  Arc,
  Transformer,
  Group,
} from "react-konva";
import { ICONS } from "../app/fixtures";
import useImage from "use-image";

const GRID_SIZE = 25; // denser grid
const FRONT_OF_STAGE_MARGIN = 1.2;
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 4;

const KonvaReactIcon = ({
  IconComponent,
  width,
  height,
  stroke,
  strokeWidth,
  isSelected,
}) => {
  const [image, setImage] = useState(null);
  const containerRef = useRef(null);

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
      image={image}
      width={width}
      height={height}
      stroke={isSelected ? stroke : null}
      strokeWidth={isSelected ? strokeWidth : 0}
    />
  );
};

const FixtureImage = ({
  item,
  onDragEnd,
  onSelectItem,
  isSelected,
  onTransformEnd,
  shapeRef,
  onDragMove,
}) => {
  const handleDragEnd = (e) => {
    onDragEnd(item.uid, e.target.x(), e.target.y());
  };

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
        onDragEnd={handleDragEnd}
        onDragMove={onDragMove}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelectItem(item.uid);
        }}
        onTransformEnd={() => onTransformEnd(shapeRef.current)}
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

    const iconSource = ICONS[item.icon];
    const imageUrl = iconSource.startsWith("<svg")
      ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSource)}`
      : iconSource;

    const [image, status] = useImage(imageUrl);
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
      if (status === "loaded") {
        setImageLoaded(true);
      } else if (status === "loading" || status === "failed") {
        setImageLoaded(false);
      }
    }, [status]);

    return (
      <Group
        ref={shapeRef}
        id={item.uid}
        name={item.id}
        x={item.x}
        y={item.y}
        draggable
        onDragEnd={handleDragEnd}
        onDragMove={onDragMove}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          onSelectItem(item.uid);
        }}
        onTransformEnd={() => onTransformEnd(shapeRef.current)}
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
            stroke={isSelected ? "#0ea5e9" : null}
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

const Vara = ({
  item,
  onDragEnd,
  onSelectItem,
  isSelected,
  onTransformEnd,
  shapeRef,
  ppu,
  onDragMove,
}) => {
  const handleDragEnd = (e) => {
    onDragEnd(item.uid, e.target.x(), e.target.y());
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
      onDragMove={onDragMove}
      onDragEnd={handleDragEnd}
      onMouseDown={(e) => {
        e.cancelBubble = true;
        onSelectItem(item.uid);
      }}
      onTransformEnd={() => onTransformEnd(shapeRef.current)}
      stroke={isSelected ? "#0ea5e9" : null}
      strokeWidth={isSelected ? 5 : 0}
      rotation={item.rotation}
      scaleX={item.scaleX || 1}
      scaleY={item.scaleY || 1}
      offsetX={width / 2}
      offsetY={height / 2}
    />
  );
};

const Item = ({
  item,
  onDragEnd,
  onSelectItem,
  isSelected,
  onTransformEnd,
  shapeRef,
  ppu,
  onDragMove,
  items,
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
      items={items}
    />
  );
};

const Stage = React.forwardRef(
  (
    {
      items,
      title,
      groups,
      onDragEnd,
      onSelectItem,
      selectedItem,
      onUpdateItem,
      onDrop,
      width,
      height,
      onDragMove,
      scale = 1,
      onScaleChange,
    },
    ref,
  ) => {
    const containerRef = useRef(null);
    const trRef = React.useRef();
    const shapeRefs = React.useRef({});
    const layerRef = React.useRef(null);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
    const isPanningRef = React.useRef(false);
    const isSpacePressedRef = React.useRef(false);
    const lastClientRef = React.useRef<{x:number;y:number}|null>(null);

    React.useEffect(() => {
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') isSpacePressedRef.current = true;
      };
      const onKeyUp = (e: KeyboardEvent) => {
        if (e.code === 'Space') isSpacePressedRef.current = false;
      };
      window.addEventListener('keydown', onKeyDown);
      window.addEventListener('keyup', onKeyUp);
      return () => {
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('keyup', onKeyUp);
      };
    }, []);

    const ppu = width / 12;

    const grid = [];
    for (let i = 0; i <= Math.ceil(width / GRID_SIZE); i++) {
      const x = i * GRID_SIZE;
      grid.push(
        <Line
          key={`v-${i}`}
          points={[x, 0, x, height]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />,
      );
    }
    for (let i = 0; i <= Math.ceil(height / GRID_SIZE); i++) {
      const y = i * GRID_SIZE;
      grid.push(
        <Line
          key={`h-${i}`}
          points={[0, y, width, y]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />,
      );
    }

    React.useEffect(() => {
      if (selectedItem && trRef.current) {
        const selectedNode = shapeRefs.current[selectedItem.uid]?.current;
        if (selectedNode) {
          trRef.current.nodes([selectedNode]);
          trRef.current.getLayer().batchDraw();
        }
      } else if (trRef.current) {
        trRef.current.nodes([]);
        trRef.current.getLayer().batchDraw();
      }
    }, [selectedItem]);

    const handleTransformEnd = (node) => {
      onUpdateItem(node.id(), {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      });
    };

    const handleDragOver = (e) => {
      e.preventDefault();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      const data = e.dataTransfer.getData("application/json");
      if (!data) return;
      const fixture = JSON.parse(data);
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
    const stageY = (height - stageHeight) / 2 - (1.5 * ppu) / 2;

    const frontOfStageY = stageY + stageHeight + FRONT_OF_STAGE_MARGIN * ppu;

    const fixtures = items.filter(item => item.id !== 'vara');
    const varas = items.filter(item => item.id === 'vara');

    return (
      <div
        className="card pad"
        ref={containerRef}
        style={{ width: width, height: height, margin: "auto" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onContextMenu={(e) => e.preventDefault()}
        onMouseDown={(e) => {
          // Right or middle button always pans; Space+Left also pans
          if (e.button === 1 || e.button === 2 || (e.button === 0 && isSpacePressedRef.current)) {
            isPanningRef.current = true;
            lastClientRef.current = { x: e.clientX, y: e.clientY };
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
        onWheel={(e) => {
          e.preventDefault();
          const intensity = e.ctrlKey || e.metaKey ? 1.15 : 1.07;
          const factor = e.deltaY > 0 ? 1 / intensity : intensity;
          const rect = containerRef.current?.getBoundingClientRect();
          if (!rect) return;
          const sx = e.clientX - rect.left;
          const sy = e.clientY - rect.top;
          const wx = (sx - offset.x) / scale;
          const wy = (sy - offset.y) / scale;
          let next = scale * factor;
          next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
          // keep world point under cursor fixed
          const nx = sx - wx * next;
          const ny = sy - wy * next;
          setOffset({ x: nx, y: ny });
          if (onScaleChange) onScaleChange(next);
        }}
      >
        <KonvaStage ref={ref} width={width} height={height}>
          <Layer ref={layerRef}>
            <Group x={offset.x} y={offset.y} scaleX={scale} scaleY={scale}>
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="#f1f5f9"
                onMouseDown={() => onSelectItem(null)}
              />

            {/* Grid */}
            {grid}

            {/* Title */}
            <Text
              text={title}
              x={10}
              y={10}
              fontSize={24}
              fontStyle="bold"
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
                  onDragMove={(e) => onDragMove(item.uid, e.target.x(), e.target.y())}
                  items={items}
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
                  onDragMove={(e) => onDragMove(item.uid, e.target.x(), e.target.y())}
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

            <Transformer ref={trRef} />
            </Group>
          </Layer>
        </KonvaStage>
      </div>
    );
  },
);

export default Stage;
