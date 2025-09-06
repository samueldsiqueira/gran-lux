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
  Arc,
  Transformer,
  Group,
} from "react-konva";
import { ICONS } from "../app/fixtures";
import useImage from "use-image";

const GRID_SIZE = 50;
const FRONT_OF_STAGE_MARGIN = 1.2;

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
        offsetX={26 / 2}
        offsetY={26 / 2}
      >
        <KonvaReactIcon
          IconComponent={item.componentIcon}
          width={26}
          height={26}
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
        offsetX={26 / 2}
        offsetY={26 / 2}
      >
        {imageLoaded ? (
          <Image
            key={imageUrl} // Add key to force re-render if imageUrl changes
            image={image}
            width={26}
            height={26}
            stroke={isSelected ? "#0ea5e9" : null}
            strokeWidth={2}
          />
        ) : (
          <Rect
            width={26}
            height={26}
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
            x={26 / 2 - 15}
            y={26 / 2 - 5}
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
  ppu,
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
    },
    ref,
  ) => {
    const containerRef = useRef(null);
    const trRef = React.useRef();
    const shapeRefs = React.useRef({});
    const layerRef = React.useRef(null);

    const ppu = width / 12;

    const grid = [];
    for (let i = 0; i < width / GRID_SIZE; i++) {
      grid.push(
        <Line
          key={`v-${i}`}
          points={[i * GRID_SIZE, 0, i * GRID_SIZE, height]}
          stroke="#e5e7eb"
          strokeWidth={1}
        />,
      );
    }
    for (let i = 0; i < height / GRID_SIZE; i++) {
      grid.push(
        <Line
          key={`h-${i}`}
          points={[0, i * GRID_SIZE, width, i * GRID_SIZE]}
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
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      onDrop(fixture, { x, y });
    };

    const stageWidth = 7.72 * ppu;
    const stageHeight = 4.72 * ppu;
    const stageX = (width - stageWidth) / 2;
    const stageY = (height - stageHeight) / 2 - (1.5 * ppu) / 2;

    const frontOfStageY = stageY + stageHeight + FRONT_OF_STAGE_MARGIN * ppu;

    const fixtures = items.filter(item => item.id !== 'vara');
    const varas = items.filter(item => item.id === 'vara');

    const itemsByGroup = (itemsToGroup) => itemsToGroup.reduce((acc, item) => {
      const groupId = item.groupId || 'ungrouped';
      if (!acc[groupId]) {
        acc[groupId] = [];
      }
      acc[groupId].push(item);
      return acc;
    }, {});

    const fixtureGroups = itemsByGroup(fixtures);

    return (
      <div
        className="card pad"
        ref={containerRef}
        style={{ width: width, height: height, margin: "auto" }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <KonvaStage ref={ref} width={width} height={height}>
          <Layer ref={layerRef}>
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

            {/* Fixture Groups */}
            {Object.entries(fixtureGroups).map(([groupId, groupItems]) => {
              const group = groups.find(g => g.id === groupId);
              return (
                <Group key={groupId}>
                  {group && (
                    <Text
                      text={group.name}
                      x={groupItems[0]?.x - 10}
                      y={groupItems[0]?.y - 30}
                      fontSize={18}
                      fontStyle="bold"
                    />
                  )}
                  {groupItems.map((item) => {
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
                      />
                    );
                  })}
                </Group>
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