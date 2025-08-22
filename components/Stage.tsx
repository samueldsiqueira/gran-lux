'use client';
import React, { useState, useEffect, useRef } from "react";
import {
  Stage as KonvaStage,
  Layer,
  Rect,
  Text,
  Line,
  Image,
  Arc,
  Transformer,
  Group,
} from "react-konva";
import { ICONS } from "../app/fixtures";
import useImage from "use-image";

const GRID_SIZE = 50;
const FRONT_OF_STAGE_MARGIN = 50; // Fixed margin in pixels

const FixtureImage = ({
  item,
  onDragEnd,
  onSelectItem,
  isSelected,
  onTransformEnd,
  shapeRef,
}) => {
  const iconSource = ICONS[item.icon];
  const imageUrl = iconSource.startsWith('<svg')
    ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSource)}`
    : iconSource; // If it's not an SVG string, assume it's a path

  const [image] = useImage(imageUrl);

  const handleDragEnd = (e) => {
    onDragEnd(item.uid, e.target.x(), e.target.y());
  };

  return (
    <Group
      ref={shapeRef}
      id={item.uid}
      x={item.x}
      y={item.y}
      draggable
      onDragEnd={handleDragEnd}
      onMouseDown={(e) => {
        e.cancelBubble = true;
        onSelectItem(item.uid);
      }}
      onTransformEnd={() => onTransformEnd(shapeRef.current)}
      rotation={item.rotation}
      scaleX={item.scaleX || 1}
      scaleY={item.scaleY || 1}
      offsetX={13}
      offsetY={13}
    >
      <Image
        image={image}
        width={26}
        height={26}
        stroke={isSelected ? "#0ea5e9" : null}
        strokeWidth={isSelected ? 2 : 0}
      />
    </Group>
  );
};

const Truss = ({
  item,
  onDragEnd,
  onSelectItem,
  isSelected,
  onTransformEnd,
  shapeRef,
}) => {
  const handleDragEnd = (e) => {
    onDragEnd(item.uid, e.target.x(), e.target.y());
  };

  const width = 300; // Fixed width
  const height = 10;

  return (
    <Rect
      ref={shapeRef}
      id={item.uid}
      x={item.x}
      y={item.y}
      width={width}
      height={height}
      fill="black"
      draggable
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
}) => {
  if (item.id === "truss") {
    return (
      <Truss
        item={item}
        onDragEnd={onDragEnd}
        onSelectItem={onSelectItem}
        isSelected={isSelected}
        onTransformEnd={onTransformEnd}
        shapeRef={shapeRef}
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
    />
  );
};

const Stage = React.forwardRef(
  (
    { items, onDragEnd, onSelectItem, selectedItem, onUpdateItem, onDrop },
    ref,
  ) => {
    const containerRef = useRef(null);
    const [size, setSize] = useState({ width: 0, height: 0 });
    const trRef = React.useRef();
    const shapeRefs = React.useRef({});

    useEffect(() => {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        setSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      });
      if (containerRef.current) {
        observer.observe(containerRef.current);
      }
      return () => {
        if (containerRef.current) {
          observer.unobserve(containerRef.current);
        }
      };
    }, []);

    const grid = [];
    for (let i = 0; i < size.width / GRID_SIZE; i++) {
      grid.push(
        <Line
          key={`v-${i}`}
          points={[i * GRID_SIZE, 0, i * GRID_SIZE, size.height]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />,
      );
    }
    for (let i = 0; i < size.height / GRID_SIZE; i++) {
      grid.push(
        <Line
          key={`h-${i}`}
          points={[0, i * GRID_SIZE, size.width, i * GRID_SIZE]}
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
      const fixture = JSON.parse(e.dataTransfer.getData("application/json"));
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDrop(fixture, { x, y });
    };

    const stageWidth = 515; // Fixed width
    const stageHeight = 315; // Fixed height
    const stageX = (size.width - stageWidth) / 2;
    const stageY = (size.height - stageHeight) / 2 - 50;

    const frontOfStageY = stageY + stageHeight + FRONT_OF_STAGE_MARGIN;
    const frontOfStageHeight = 80;

    return (
      <div
        className="card pad"
        ref={containerRef}
        style={{ width: "100%", height: "100%" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <KonvaStage ref={ref} width={size.width} height={size.height}>
          <Layer>
            <Rect
              x={0}
              y={0}
              width={size.width}
              height={size.height}
              fill="#f1f5f9"
              onMouseDown={() => onSelectItem(null)}
            />

            {/* Grid */}
            {grid}

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
              height={frontOfStageHeight}
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

            {/* Items */}
            {items.map((item) => {
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
                />
              );
            })}
            <Transformer ref={trRef} />
          </Layer>
        </KonvaStage>
      </div>
    );
  },
);

export default Stage;
