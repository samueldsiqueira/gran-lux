'use client';

import React from 'react';
import TopBar from '../components/TopBar';
import { Library } from '../components/Library';
import Properties from '../components/Properties';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect } from 'react';
import { ICONS } from '../app/fixtures';

const Stage = dynamic(() => import('../components/Stage'), { ssr: false });

function channelsFrom(mode) {
  const m = /([0-9]+)\s*ch/i.exec(mode || '');
  return m ? parseInt(m[1], 10) : mode.includes('dimmer') ? 1 : 1;
}

export default function Home() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [clipboard, setClipboard] = useState(null);
  const stageRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const [title, setTitle] = useState('Meu Espetáculo');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);

  useEffect(() => {
    setStageSize({ width: 1200, height: 1200 / (16 / 9) });
  }, []);

  const handleSizeChange = (newWidth) => {
    const newHeight = newWidth / (16 / 9);
    setStageSize({ width: newWidth, height: newHeight });
  };

  const getNextFixtureNumber = () => {
    const numbers = items.filter(item => item.number).map(item => item.number);
    return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  };

  const renumberFixtures = (currentItems) => {
    const fixtures = currentItems.filter(item => item.id !== 'truss').sort((a, b) => a.number - b.number);
    const fixtureMap = new Map();
    fixtures.forEach((fixture, index) => {
      fixtureMap.set(fixture.uid, index + 1);
    });

    return currentItems.map(item => {
      if (fixtureMap.has(item.uid)) {
        return { ...item, number: fixtureMap.get(item.uid) };
      }
      return item;
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
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
  }, [selectedItem, clipboard, items]);

  const handleCopy = () => {
    if (selectedItem) {
      setClipboard(selectedItem);
    }
  };

  const handlePaste = () => {
    if (clipboard) {
      const newItem = {
        ...clipboard,
        x: clipboard.x + 20,
        y: clipboard.y + 20,
        uid: Math.random().toString(36).substr(2, 9),
        number: clipboard.id === 'truss' ? null : getNextFixtureNumber(),
      };
      setItems([...items, newItem]);
    }
  };

  const handleCut = () => {
    if (selectedItem) {
      setClipboard(selectedItem);
      const newItems = items.filter((item) => item.uid !== selectedItem.uid);
      const renumberedItems = renumberFixtures(newItems);
      setItems(renumberedItems);
      setSelectedItem(null);
    }
  };

  const handleAddGroup = (name) => {
    const newGroup = {
      id: Math.random().toString(36).substr(2, 9),
      name,
    };
    setGroups([...groups, newGroup]);
  };

  const handleAddItem = (fixture, groupId) => {
    const newItem = {
      ...fixture,
      x: 100,
      y: 100,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      uid: Math.random().toString(36).substr(2, 9),
      universe: 1,
      address: 1,
      channels: channelsFrom(fixture.defaultMode),
      number: fixture.id === 'truss' ? null : getNextFixtureNumber(),
      groupId,
    };
    setItems([...items, newItem]);
  };

  const handleDrop = (fixture, position, groupId) => {
    const newItem = {
      ...fixture,
      x: position.x,
      y: position.y,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      uid: Math.random().toString(36).substr(2, 9),
      universe: 1,
      address: 1,
      channels: channelsFrom(fixture.defaultMode),
      number: fixture.id === 'truss' ? null : getNextFixtureNumber(),
      groupId,
    };
    setItems([...items, newItem]);
  };

  const handleDragEnd = (uid, x, y) => {
    const newItems = items.map((item) => {
      if (item.uid === uid) {
        return { ...item, x, y };
      }
      return item;
    });
    setItems(newItems);
  };

  const handleSelectItem = (uid) => {
    if (!uid) {
      setSelectedItem(null);
      return;
    }
    const item = items.find((item) => item.uid === uid);
    setSelectedItem(item);
  };

  const handleUpdateItem = (uid, properties) => {
    const newItems = items.map((item) => {
      if (item.uid === uid) {
        return { ...item, ...properties };
      }
      return item;
    });
    setItems(newItems);
    if (selectedItem?.uid === uid) {
      setSelectedItem({ ...selectedItem, ...properties });
    }
  };

  const handleRemoveSelected = () => {
    if (!selectedItem) return;
    const newItems = items.filter((item) => item.uid !== selectedItem.uid);
    const renumberedItems = renumberFixtures(newItems);
    setItems(renumberedItems);
    setSelectedItem(null);
  };

  const handleSendToBack = () => {
    if (!selectedItem) return;
    const newItems = items.filter((item) => item.uid !== selectedItem.uid);
    newItems.unshift(selectedItem);
    setItems(newItems);
  };

  const handleAutoPatch = () => {
    const nextAddr = new Map();
    const newItems = items.map((item) => {
      if (item.id === 'truss') return item;

      const u = item.universe || 1;
      if (!nextAddr.has(u)) nextAddr.set(u, 1);

      let addr = nextAddr.get(u);
      const need = Math.max(1, item.channels || 1);

      if (addr + need - 1 > 512) {
        let nu = u + 1;
        if (!nextAddr.has(nu)) nextAddr.set(nu, 1);
        addr = nextAddr.get(nu);
        item.universe = nu;
      }

      item.address = addr;
      nextAddr.set(item.universe, addr + need);
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

  const handleImportJSON = (data) => {
    setItems(data.items || []);
    setTitle(data.title || 'Meu Espetáculo');
    setGroups(data.groups || []);
  };

  const handleExportCSV = () => {
    const header = ['Nº', 'ID', 'Tipo', 'Modo', 'Universe', 'Endereço', 'Canais', 'Potência(W)', 'X', 'Y', 'Rot'];
    const rows = items
      .filter((i) => i.id !== 'truss')
      .map((i) =>
        [
          i.number,
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

    const exportImage = (mimeType, extension, output = 'download') => {
    return new Promise((resolve, reject) => {
      const stage = stageRef.current;
      const pixelRatio = 3;
      const stageDataURL = stage.toDataURL({ pixelRatio });

      const fixtures = items.filter(item => item.id !== 'truss');
      const itemsPerColumn = 10;
      const columnWidth = 300; // Adjust as needed
      const numRows = Math.min(fixtures.length, itemsPerColumn);
      const legendHeight = numRows * 30 + 40;

      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');

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
          return new Promise((resolve, reject) => {
            const iconImage = new window.Image();
            iconImage.onload = () => resolve({ iconImage, fixture });
            iconImage.onerror = reject;
            const iconUrl = ICONS[fixture.icon];
            if (iconUrl.startsWith('<')) {
              iconImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconUrl)}`;
            } else {
              iconImage.src = iconUrl;
            }
          });
        });

        Promise.all(iconPromises).then(loadedIcons => {
          loadedIcons.forEach(({ iconImage, fixture }, index) => {
            const columnIndex = Math.floor(index / itemsPerColumn);
            const rowIndex = index % itemsPerColumn;
            const xPos = (10 + columnIndex * columnWidth) * pixelRatio;
            const yPos = stageHeight + (40 + rowIndex * 30) * pixelRatio;

            tempCtx.font = (14 * pixelRatio) + 'px sans-serif';
            tempCtx.fillText(`${fixture.number}.`, xPos, yPos + 15 * pixelRatio);
            tempCtx.drawImage(iconImage, xPos + 30 * pixelRatio, yPos, 26 * pixelRatio, 26 * pixelRatio);
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
    const eq = equipmentSummary();
    const patch = [...items.filter((i) => i.id !== 'truss')].sort((a, b) => a.number - b.number);
    const style = '<style>body{font-family:system-ui;padding:24px;color:#111} h1{font-size:22px;margin:0 0 8px} h2{font-size:18px;margin:16px 0 8px} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:6px 8px;font-size:12px} th{background:#f3f4f6;text-align:left} img{max-width:100%}</style>';
    const eqRows = eq.map((e) => `<tr><td>${e.name}</td><td>${e.qty}</td><td>${e.power} W</td></tr>`).join('');
    const patchRows = patch
      .map(
        (p) =>
          `<tr><td>${p.number}</td><td>${p.uid}</td><td>${p.name}</td><td>${p.defaultMode}</td><td>${p.universe}</td><td>${p.address}</td><td>${p.channels}</td><td>${p.powerW}</td></tr>`
      )
      .join('');
    const trussCount = items.filter((i) => i.id === 'truss').length;
    
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
    const m = new Map();
    for (const i of items) {
      if (i.id === 'truss') continue;
      if (!m.has(i.name)) m.set(i.name, { qty: 0, power: 0 });
      const t = m.get(i.name);
      t.qty++;
      t.power += i.powerW || 0;
    }
    return Array.from(m, ([name, v]) => ({ name, qty: v.qty, power: v.power })).sort((a, b) => a.name.localeCompare(b.name));
  };

  const totalPower = () => items.filter((i) => i.id !== 'truss').reduce((s, i) => s + (i.powerW || 0), 0);

  const universosList = () =>
    Array.from(new Set(items.filter((i) => i.id !== 'truss').map((i) => i.universe)))
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
      <div className="wrap">
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
        <Stage
          ref={stageRef}
          items={items}
          title={title}
          groups={groups}
          onDragEnd={handleDragEnd}
          onSelectItem={handleSelectItem}
          onDrop={handleDrop}
          selectedItem={selectedItem}
          onUpdateItem={handleUpdateItem}
          width={stageSize.width}
          height={stageSize.height}
        />
        <Properties
          selectedItem={selectedItem}
          onUpdateItem={handleUpdateItem}
          onSendToBack={handleSendToBack}
          groups={groups}
        />
      </div>
    </>
  );
}
