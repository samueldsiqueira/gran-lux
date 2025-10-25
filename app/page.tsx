'use client';

import React from 'react';
import TopBar from '../components/TopBar';
import { Library } from '../components/Library';
import Properties from '../components/Properties';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ICONS } from '../app/fixtures';
import { Item } from '../app/types';
import Konva from 'konva';

const Stage = dynamic(() => import('../components/Stage'), { ssr: false });

function channelsFrom(mode: string | undefined) {
  const m = /([0-9]+)\s*ch/i.exec(mode || '');
  return m ? parseInt(m[1], 10) : (mode || '').includes('dimmer') ? 1 : 1;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [clipboard, setClipboard] = useState<Item | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [stageScale, setStageScale] = useState(1);
  const baseStageWidthRef = useRef<number | null>(null);
  const [title, setTitle] = useState('Meu Espetáculo');
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Snap/geometry constants
  const ICON_SIZE = 26;
  const HALF_ICON = ICON_SIZE / 2;
  const SNAP_MARGIN = 2;
  const SNAP_SPACING = 50; // pixels between attachment points along the vara
  const VARA_LENGTH_M = 7.72; // meters represented horizontally
  const VARA_HEIGHT = 10; // px height of vara rectangle

  useEffect(() => {
    // Set stage size based on screen width
    const isMobile = window.innerWidth <= 768;
    const w = isMobile ? 800 : 1200; // Smaller on mobile
    const h = w / (16 / 9);
    setStageSize({ width: w, height: h });
    baseStageWidthRef.current = w;
    
    // Also set initial scale for mobile
    if (isMobile) {
      setStageScale(0.8); // Start with smaller scale on mobile
    }

    // Listen for touch drag events from Library component
    const handleFixtureDropped = (e: any) => {
      console.log('fixtureDropped event received!', e.detail);
      const { fixture, x, y } = e.detail;
      
      console.log('Fixture:', fixture.name, 'Position:', x, y);
      
      // Get stage element and calculate relative position
      const stage = stageRef.current;
      console.log('Stage ref:', stage);
      
      if (stage) {
        const stageContainer = stage.container();
        const rect = stageContainer.getBoundingClientRect();
        
        // Get the Layer to access the Group offset
        const layer = stage.getLayers()[0];
        const group = layer?.children?.[0]; // First Group in Layer
        
        console.log('Stage rect:', rect);
        console.log('Stage scale:', stageScale);
        console.log('Group offset:', group ? { x: group.x(), y: group.y() } : 'No group');
        
        // Calculate relative position considering both scale and group offset
        const offsetX = group ? group.x() : 0;
        const offsetY = group ? group.y() : 0;
        const scaleX = group ? group.scaleX() : stageScale;
        const scaleY = group ? group.scaleY() : stageScale;
        
        // Convert screen coordinates to stage coordinates
        const relativeX = (x - rect.left - offsetX) / scaleX;
        const relativeY = (y - rect.top - offsetY) / scaleY;
        
        console.log('Calculated position:', relativeX, relativeY);
        console.log('Will add item at coordinates:', { x: relativeX, y: relativeY });
        
        // Add fixture at touch position
        const newItem: Item = {
          id: fixture.id,
          name: fixture.name,
          powerW: fixture.powerW,
          icon: fixture.icon,
          defaultMode: fixture.defaultMode,
          modes: fixture.modes,
          x: relativeX,
          y: relativeY,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
          uid: Math.random().toString(36).substr(2, 9),
          universe: 1,
          address: 1,
          channels: channelsFrom(fixture.defaultMode),
          number: fixture.id === 'vara' ? null : getNextFixtureNumber(),
          groupId: selectedGroup,
        };
        
        console.log('Adding new item:', newItem);
        setItems([...items, newItem]);
        
        // Close sidebar after adding
        setLeftSidebarOpen(false);
        console.log('Item added, sidebar closed');
      } else {
        console.error('Stage ref is null!');
      }
    };

    console.log('Adding fixtureDropped event listener');
    window.addEventListener('fixtureDropped', handleFixtureDropped);
    
    // Handle window resize
    const handleResize = () => {
      const isMobileNow = window.innerWidth <= 768;
      const newW = isMobileNow ? 800 : 1200;
      const newH = newW / (16 / 9);
      
      // Only update if size actually changed
      if (newW !== stageSize.width) {
        setStageSize({ width: newW, height: newH });
        baseStageWidthRef.current = newW;
        
        // Adjust scale for mobile
        if (isMobileNow && stageScale > 0.8) {
          setStageScale(0.8);
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      console.log('Removing fixtureDropped event listener');
      window.removeEventListener('fixtureDropped', handleFixtureDropped);
      window.removeEventListener('resize', handleResize);
    };
  }, [items, selectedGroup, stageScale, stageSize.width]);

  const handleSizeChange = (newWidth: number) => {
    const base = baseStageWidthRef.current || stageSize.width || 1200;
    const newScale = newWidth / base;
    setStageScale(newScale);
    // Keep stage pixel size constante para não criar scroll
    const newHeight = base / (16 / 9);
    setStageSize({ width: base, height: newHeight });
  };

  const getNextFixtureNumber = useCallback(() => {
    const numbers = items.filter(item => item.number).map(item => item.number as number);
    return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  }, [items]);

  // Helpers for snapping to a vara (supports rotation)
  const getPPU = () => (stageSize.width || 1200) / 12;

  const varaDims = (ppu: number) => ({ width: VARA_LENGTH_M * ppu, height: VARA_HEIGHT });

  const toLocal = (vara: Item, point: { x: number; y: number }) => {
    const angle = ((vara.rotation || 0) * Math.PI) / 180;
    const dx = point.x - vara.x;
    const dy = point.y - vara.y;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    // rotate by -angle
    return { x: cos * dx + sin * dy, y: -sin * dx + cos * dy };
  };

  const toWorld = (vara: Item, local: { x: number; y: number }) => {
    const angle = ((vara.rotation || 0) * Math.PI) / 180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x: vara.x + cos * local.x - sin * local.y,
      y: vara.y + sin * local.x + cos * local.y,
    };
  };

  const snapOnVara = (vara: Item, point: { x: number; y: number }) => {
    const ppu = getPPU();
    const { width, height } = varaDims(ppu);
    const local = toLocal(vara, point);
    // Snap X to spacing and clamp to bar
    let lx = Math.round(local.x / SNAP_SPACING) * SNAP_SPACING;
    const minX = -width / 2 + HALF_ICON;
    const maxX = width / 2 - HALF_ICON;
    lx = Math.max(minX, Math.min(maxX, lx));

    // Choose side (above if local.y < 0)
    const above = local.y < 0;
    const ly = (above ? -1 : 1) * (height / 2 + HALF_ICON + SNAP_MARGIN);

    return toWorld(vara, { x: lx, y: ly });
  };

  const isNearVara = (vara: Item, point: { x: number; y: number }) => {
    const ppu = getPPU();
    const { width, height } = varaDims(ppu);
    const local = toLocal(vara, point);
    const nearY = Math.abs(local.y) <= height / 2 + HALF_ICON + 40; // 40px tolerance
    const withinX = local.x >= -width / 2 - 20 && local.x <= width / 2 + 20; // 20px tolerance at ends
    return withinX && nearY;
  };

  const renumberFixtures = (currentItems: Item[]) => {
    const fixtures = currentItems.filter(item => item.id !== 'vara').sort((a, b) => (a.number || 0) - (b.number || 0));
    const fixtureMap = new Map<string, number>();
    fixtures.forEach((fixture, index) => {
      fixtureMap.set(fixture.uid, index + 1);
    });

    return currentItems.map(item => {
      if (fixtureMap.has(item.uid)) {
        return { ...item, number: fixtureMap.get(item.uid) || null };
      }
      return item;
    });
  };
  const handleCopy = useCallback(() => {
    if (selectedItem) {
      setClipboard(selectedItem);
    }
  }, [selectedItem]);

  const handlePaste = useCallback(() => {
    if (clipboard) {
      const newItem: Item = {
        ...clipboard,
        x: clipboard.x + 20,
        y: clipboard.y + 20,
        uid: Math.random().toString(36).substr(2, 9),
        number: clipboard.id === 'vara' ? null : getNextFixtureNumber(),
      };
      setItems([...items, newItem]);
    }
  }, [clipboard, items, getNextFixtureNumber]);

  const handleCut = useCallback(() => {
    if (selectedItem) {
      setClipboard(selectedItem);
      const newItems = items.filter((item) => item.uid !== selectedItem.uid);
      const renumberedItems = renumberFixtures(newItems);
      setItems(renumberedItems);
      setSelectedItem(null);
    }
  }, [selectedItem, items]);

  const handleRemoveSelected = useCallback(() => {
    if (!selectedItem) return;
    const newItems = items.filter((item) => item.uid !== selectedItem.uid);
    const renumberedItems = renumberFixtures(newItems);
    setItems(renumberedItems);
    setSelectedItem(null);
  }, [selectedItem, items]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'c':
            handleCopy();
            break;
          case 'v':
            handlePaste();
            break;
          case 'x':
            handleCut();
            break;
          default:
            break;
        }
      } else if (e.key === 'Delete') {
        handleRemoveSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedItem, clipboard, items, handleCopy, handleCut, handlePaste, handleRemoveSelected]);

  const handleAddGroup = (name: string) => {
    const newGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name,
    };
    setGroups([...groups, newGroup]);
  };

  const handleAddItem = (fixture: { id: string; name: string; powerW: number; icon: string; modes: string[]; defaultMode: string }, groupId: string | null) => {
    const newItem: Item = {
      id: fixture.id,
      name: fixture.name,
      powerW: fixture.powerW,
      icon: fixture.icon,
      defaultMode: fixture.defaultMode,
      modes: fixture.modes,
      x: 100,
      y: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      uid: Math.random().toString(36).substr(2, 9),
      universe: 1,
      address: 1,
      channels: channelsFrom(fixture.defaultMode),
      number: fixture.id === 'vara' ? null : getNextFixtureNumber(),
      groupId,
    };
    setItems([...items, newItem]);
  };

  const handleDrop = (fixture: Item, position: { x: number; y: number }, target: Konva.Node | null) => {
    let connectedTo: string | null = null;
    // Descobre se drop foi sobre uma vara
    let node: Konva.Node | null = target;
    try {
      while (node && (!node.attrs || !node.attrs.name) && node.getParent) {
        node = node.getParent();
      }
    } catch {
      // ignore errors
    }
    if (node && node.attrs && node.attrs.name === 'vara') {
      connectedTo = node.attrs.id; // uid da vara
    }

    // Define posição final, ajustando para encostar na vara sem atravessar
    let x = position.x;
    let y = position.y;
    if (connectedTo) {
      const vara = items.find((i) => i.uid === connectedTo);
      if (vara) {
        const snapped = snapOnVara(vara, position);
        x = snapped.x;
        y = snapped.y;
      }
    }

    const newItem: Item = {
      ...fixture,
      x,
      y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      uid: Math.random().toString(36).substr(2, 9),
      universe: 1,
      address: 1,
      channels: channelsFrom(fixture.defaultMode),
      number: fixture.id === 'vara' ? null : getNextFixtureNumber(),
      connectedTo,
      groupId: null,
    };
    setItems([...items, newItem]);
  };

  const handleDragMove = (uid: string, x: number, y: number) => {
    const newItems = [...items];
    const itemIndex = newItems.findIndex((i) => i.uid === uid);
    if (itemIndex === -1) return;
    const item = newItems[itemIndex];

    // If dragging a vara, move all connected items in real-time
    if (item.id === 'vara') {
      const dx = x - item.x;
      const dy = y - item.y;
      newItems[itemIndex] = { ...item, x, y };
      if (dx !== 0 || dy !== 0) {
        for (let i = 0; i < newItems.length; i++) {
          if (newItems[i].connectedTo === uid) {
            newItems[i] = { ...newItems[i], x: newItems[i].x + dx, y: newItems[i].y + dy };
          }
        }
      }
      setItems(newItems);
      return;
    }

    // Otherwise, dragging a fixture: update position and snap/connect to nearest vara
    newItems[itemIndex] = { ...item, x, y };

    const varas = newItems.filter(i => i.id === 'vara');
    let snapped = false;
    for (const vara of varas) {
      if (isNearVara(vara, { x, y })) {
        const snappedPt = snapOnVara(vara, { x, y });
        newItems[itemIndex] = { ...newItems[itemIndex], x: snappedPt.x, y: snappedPt.y, connectedTo: vara.uid };
        snapped = true;
        break;
      }
    }

    if (!snapped) {
      newItems[itemIndex] = { ...newItems[itemIndex], connectedTo: null };
    }

    setItems(newItems);
  };

  const handleDragEnd = (uid: string, x: number, y: number) => {
    const newItems = [...items];
    const item = newItems.find((i) => i.uid === uid);
    if (!item) return;
    const itemIndex = newItems.findIndex((i) => i.uid === uid);
    const oldX = item.x;
    const oldY = item.y;

    newItems[itemIndex] = { ...item, x, y };

    if (item.id === 'vara') {
      const connectedFixtures = newItems.filter(i => i.connectedTo === uid);
      connectedFixtures.forEach(fixture => {
        const fixtureIndex = newItems.findIndex(i => i.uid === fixture.uid);
        if (fixtureIndex !== -1) {
          newItems[fixtureIndex] = {
            ...newItems[fixtureIndex],
            x: newItems[fixtureIndex].x + (x - oldX),
            y: newItems[fixtureIndex].y + (y - oldY),
          };
        }
      });
    }

    setItems(newItems);
  };

  const handleSelectItem = (uid: string | null) => {
    if (!uid) {
      setSelectedItem(null);
      return;
    }
    const item = items.find((item) => item.uid === uid);
    setSelectedItem(item || null);
    
    // On mobile, auto-open properties panel when item is selected
    if (typeof window !== 'undefined' && window.innerWidth <= 768 && item) {
      setRightSidebarOpen(true);
      setLeftSidebarOpen(false);
    }
  };

  const handleUpdateItem = (uid: string, properties: Partial<Item>) => {
    // Detect rotation change on a vara to re-snap connected fixtures
    const current = items.find((i) => i.uid === uid);
    const rotationChanged = current && current.id === 'vara' && properties.rotation !== undefined && properties.rotation !== current.rotation;

    let updated = items.map((item) => (item.uid === uid ? { ...item, ...properties } : item));

    if (rotationChanged) {
      const vara = updated.find((i) => i.uid === uid);
      if (vara) {
        updated = updated.map((i) => {
          if (i.connectedTo === uid) {
            const snapped = snapOnVara(vara, { x: i.x, y: i.y });
            return { ...i, x: snapped.x, y: snapped.y };
          }
          return i;
        });
      }
    }

    setItems(updated);
    if (selectedItem?.uid === uid) {
      setSelectedItem({ ...selectedItem, ...properties });
    }
  };

  const handleApplyMarkerToGroup = () => {
    if (!selectedItem || !selectedItem.groupId) return;
    const { groupId, markerNumber, color } = selectedItem;
    const updated = items.map((i) => {
      if (i.groupId === groupId && i.id !== 'vara') {
        return { ...i, markerNumber, color };
      }
      return i;
    });
    setItems(updated);
  };

  const handleSendToBack = () => {
    if (!selectedItem) return;
    const newItems = items.filter((item) => item.uid !== selectedItem.uid);
    newItems.unshift(selectedItem);
    setItems(newItems);
  };

  const handleAutoPatch = () => {
    const nextAddr = new Map<number, number>();
    const newItems = items.map((item) => {
      if (item.id === 'vara') return item;

      const u = item.universe || 1;
      if (!nextAddr.has(u)) nextAddr.set(u, 1);

      let addr = nextAddr.get(u);
      if (!addr) addr = 1;
      const need = Math.max(1, item.channels || 1);

      if (addr + need - 1 > 512) {
        const nu = u + 1;
        if (!nextAddr.has(nu)) nextAddr.set(nu, 1);
        addr = nextAddr.get(nu);
        if (addr) {
          item.universe = nu;
        }
      }

      if (addr) {
        item.address = addr;
      }
      nextAddr.set(item.universe, (addr || 0) + need);
      return item;
    });
    setItems(newItems);
  };

  const handleExportJSON = () => {
    const data = { items, title, groups };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'LumiRider-Pro.json';
    a.click();
  };

  const handleImportJSON = (data: { items: Item[], title: string, groups: { id: string, name: string }[] }) => {
    setItems(data.items || []);
    setTitle(data.title || 'Meu Espetáculo');
    setGroups(data.groups || []);
  };

  const handleExportCSV = () => {
    const header = ['Nº', 'ID', 'Tipo', 'Modo', 'Universe', 'Endereço', 'Canais', 'Potência(W)', 'X', 'Y', 'Rot'];
    const rows = items
      .filter((i) => i.id !== 'vara')
      .map((i) =>
        [
          i.markerNumber ?? i.number,
          i.uid,
          i.name,
          i.defaultMode,
          i.universe,
          i.address,
          i.channels,
          i.powerW,
          Math.round(i.x),
          Math.round(i.y),
          i.rotation,
        ].join(';')
      );
    const BOM = String.fromCharCode(65279);
    const csv = BOM + [header.join(';')].concat(rows).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    a.download = 'patch-dmx.csv';
    a.click();
  };

    const exportImage = (mimeType: string, extension: string, output = 'download') => {
    return new Promise<string>((resolve, reject) => {
      const stage = stageRef.current as Konva.Stage;
      const pixelRatio = 3;
      const stageDataURL = stage.toDataURL({ pixelRatio });

      const fixtures = items.filter(item => item.id !== 'vara');
      const itemsPerColumn = 10;
      const columnWidth = 300; // Adjust as needed
      const numRows = Math.min(fixtures.length, itemsPerColumn);
      const legendHeight = numRows * 30 + 40;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return;

      const stageImage = new window.Image();
      stageImage.onload = () => {
        const stageWidth = stage.width() * pixelRatio;
        const stageHeight = stage.height() * pixelRatio;
        tempCanvas.width = stageWidth;
        tempCanvas.height = stageHeight + legendHeight * pixelRatio;

        tempCtx.fillStyle = '#f1f5f9';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        tempCtx.drawImage(stageImage, 0, 0);

        tempCtx.fillStyle = 'black';
        tempCtx.font = (16 * pixelRatio) + 'px sans-serif';
        tempCtx.fillText(title, 10 * pixelRatio, 25 * pixelRatio);
        tempCtx.fillText('Legenda', 10 * pixelRatio, stageHeight + 25 * pixelRatio);

        if (fixtures.length === 0) {
          if (output === 'download') {
            const a = document.createElement('a');
            a.href = tempCanvas.toDataURL(mimeType);
            a.download = `mapa.${extension}`;
            a.click();
          } else {
            resolve(tempCanvas.toDataURL(mimeType));
          }
          return;
        }

        const iconPromises = fixtures.map(fixture => {
          return new Promise<{ iconImage: HTMLImageElement, fixture: Item }>((resolve, reject) => {
            const iconImage = new window.Image();
            iconImage.onload = () => resolve({ iconImage, fixture });
            iconImage.onerror = reject;
            const iconUrl = ICONS[fixture.icon as keyof typeof ICONS];
            if (iconUrl.startsWith('<')) {
              iconImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconUrl)}`;
            } else {
              iconImage.src = iconUrl;
            }
          });
        });

        Promise.all(iconPromises).then((loadedIcons: { iconImage: HTMLImageElement, fixture: Item }[]) => {
          loadedIcons.forEach(({ iconImage, fixture }: { iconImage: HTMLImageElement, fixture: Item }, index: number) => {
            const columnIndex = Math.floor(index / itemsPerColumn);
            const rowIndex = index % itemsPerColumn;
            const xPos = (10 + columnIndex * columnWidth) * pixelRatio;
            const yPos = stageHeight + (40 + rowIndex * 30) * pixelRatio;

            // Badge circle with number and color
            const cx = xPos + 12 * pixelRatio;
            const cy = yPos + 13 * pixelRatio;
            const r = 10 * pixelRatio;
            tempCtx.beginPath();
            tempCtx.arc(cx, cy, r, 0, Math.PI * 2);
            tempCtx.fillStyle = '#fff';
            tempCtx.fill();
            tempCtx.lineWidth = 2 * pixelRatio;
            tempCtx.strokeStyle = fixture.color || '#111';
            tempCtx.stroke();

            tempCtx.fillStyle = '#111';
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.font = (12 * pixelRatio) + 'px sans-serif';
            tempCtx.fillText(`${fixture.markerNumber ?? fixture.number}`, cx, cy);

            // Icon and name
            tempCtx.drawImage(iconImage, xPos + 30 * pixelRatio, yPos, 26 * pixelRatio, 26 * pixelRatio);
            tempCtx.textAlign = 'left';
            tempCtx.textBaseline = 'alphabetic';
            tempCtx.font = (12 * pixelRatio) + 'px sans-serif';
            tempCtx.fillText(fixture.name, xPos + 65 * pixelRatio, yPos + 15 * pixelRatio);
          });

          if (output === 'download') {
            const a = document.createElement('a');
            a.href = tempCanvas.toDataURL(mimeType);
            a.download = `mapa.${extension}`;
            a.click();
          } else {
            resolve(tempCanvas.toDataURL(mimeType));
          }
        }).catch(error => {
          console.error("Error loading icons:", error);
          reject(error);
        });
      };
      stageImage.src = stageDataURL;
    });
  };

  const handleExportPNG = () => {
    exportImage('image/png', 'png');
  };

  const handleExportJPEG = () => {
    exportImage('image/jpeg', 'jpeg');
  };

  const handlePrintRider = async () => {
    const mapDataURL = await exportImage('image/png', 'png', 'dataURL');

    const win = window.open('', '_blank');
    if (!win) return;
    const eq = equipmentSummary();
    const patch = [...items.filter((i) => i.id !== 'vara')].sort((a, b) => (a.number || 0) - (b.number || 0));
    const style = '<style>body{font-family:system-ui;padding:24px;color:#111} h1{font-size:22px;margin:0 0 8px} h2{font-size:18px;margin:16px 0 8px} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:6px 8px;font-size:12px} th{background:#f3f4f6;text-align:left} img{max-width:100%}</style>';
    const eqRows = eq.map((e) => `<tr><td>${e.name}</td><td>${e.qty}</td><td>${e.power} W</td></tr>`).join('');
    const patchRows = patch
      .map(
        (p) =>
          `<tr><td>${p.number}</td><td>${p.uid}</td><td>${p.name}</td><td>${p.defaultMode}</td><td>${p.universe}</td><td>${p.address}</td><td>${p.channels}</td><td>${p.powerW}</td></tr>`
      )
      .join('');
    const trussCount = items.filter((i) => i.id === 'vara').length;
    
    let html = style;
    html += `<h1>Rider Técnico – ${title}</h1>`;
    html += '<h2>Equipamentos</h2><table><thead><tr><th>Tipo</th><th>Qtd.</th><th>Potência</th></tr></thead><tbody>';
    html += eqRows;
    html += '</tbody></table><p>Truss/Barras: <b>';
    html += trussCount;
    html += '</b> • Potência total: <b>';
    html += (totalPower() / 1000).toFixed(2);
    html += ' kW</b> • Universos DMX: ';
    html += (universosList() || '—');
    html += '</p><h2>Patch DMX</h2><table><thead><tr><th>Nº</th><th>ID</th><th>Tipo</th><th>Modo</th><th>Universe</th><th>Endereço</th><th>Canais</th><th>W</th></tr></thead><tbody>';
    html += patchRows;
    html += '</tbody></table>';
    html += '<h2>Mapa de Palco</h2>';
    html += `<img src="${mapDataURL}" />`;

    win.document.write(html);
    win.document.close();
  };

  const equipmentSummary = () => {
    const m = new Map<string, { qty: number; power: number }>();
    for (const i of items) {
      if (i.id === 'vara') continue;
      if (!m.has(i.name)) m.set(i.name, { qty: 0, power: 0 });
      const t = m.get(i.name);
      if (t) {
        t.qty++;
        t.power += i.powerW || 0;
      }
    }
    return Array.from(m, ([name, v]) => ({ name, qty: v.qty, power: v.power })).sort((a, b) => a.name.localeCompare(b.name));
  };

  const totalPower = () => items.filter((i) => i.id !== 'vara').reduce((s, i) => s + (i.powerW || 0), 0);

  const universosList = () =>
    Array.from(new Set(items.filter((i) => i.id !== 'vara').map((i) => i.universe)))
      .sort((a, b) => a - b)
      .join(', ');

  return (
    <>
      <TopBar
        title={title}
        onTitleChange={setTitle}
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onExportCSV={handleExportCSV}
        onExportPNG={handleExportPNG}
        onExportJPEG={handleExportJPEG}
        onPrintRider={handlePrintRider}
      />
      
      {/* Mobile menu buttons */}
      <div style={{ display: 'flex', gap: '8px', padding: '8px', borderTop: '1px solid var(--line)', background: '#fff' }} className="mobile-menu-controls">
        <button className="mobile-menu-btn" onClick={() => {setLeftSidebarOpen(!leftSidebarOpen); setRightSidebarOpen(false);}}>
          📚 Biblioteca
        </button>
        <button className="mobile-menu-btn" onClick={() => {setRightSidebarOpen(!rightSidebarOpen); setLeftSidebarOpen(false);}}>
          ⚙️ Propriedades
        </button>
      </div>

      {/* Mobile backdrop */}
      <div 
        className={`mobile-backdrop ${(leftSidebarOpen || rightSidebarOpen) ? 'show' : ''}`}
        onClick={() => {setLeftSidebarOpen(false); setRightSidebarOpen(false);}}
      />

      <div className="wrap">
        <div className={`sidebar sidebar-left ${leftSidebarOpen ? 'open' : ''}`}>
          <Library
            onAddItem={handleAddItem}
            onRemoveSelected={handleRemoveSelected}
            onAutoPatch={handleAutoPatch}
            onSizeChange={handleSizeChange}
            onAddGroup={handleAddGroup}
            groups={groups}
            selectedGroup={selectedGroup}
            setSelectedGroup={setSelectedGroup}
          />
        </div>
        <Stage
          ref={stageRef}
          items={items}
          title={title}
          scale={stageScale}
          onScaleChange={setStageScale}
          onDragEnd={handleDragEnd}
          onSelectItem={handleSelectItem}
          onDrop={handleDrop}
          selectedItem={selectedItem}
          onUpdateItem={handleUpdateItem}
          width={stageSize.width}
          height={stageSize.height}
          onDragMove={handleDragMove}
        />
        <div className={`sidebar sidebar-right ${rightSidebarOpen ? 'open' : ''}`}>
          <Properties
            selectedItem={selectedItem}
            onUpdateItem={handleUpdateItem}
            onSendToBack={handleSendToBack}
            groups={groups}
            onApplyMarkerToGroup={handleApplyMarkerToGroup}
          />
        </div>
      </div>
    </>
  );
}
