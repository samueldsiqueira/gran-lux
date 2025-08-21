'use client';

import React from 'react';
import TopBar from '../components/TopBar';
import Library from '../components/Library';
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

  const handleAddItem = (fixture) => {
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
    };
    setItems([...items, newItem]);
  };

  const handleDrop = (fixture, position) => {
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
    const data = { items };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'LumiRider-Pro.json';
    a.click();
  };

  const handleImportJSON = (data) => {
    setItems(data.items || []);
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

  const exportImage = (mimeType, extension) => {
    const stage = stageRef.current;
    const stageDataURL = stage.toDataURL();

    const fixtures = items.filter(item => item.id !== 'truss');
    const legendHeight = fixtures.length * 30 + 40;

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const stageImage = new window.Image();
    stageImage.onload = () => {
      tempCanvas.width = stage.width();
      tempCanvas.height = stage.height() + legendHeight;

      tempCtx.fillStyle = '#f1f5f9';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

      tempCtx.drawImage(stageImage, 0, 0);

      tempCtx.fillStyle = 'black';
      tempCtx.font = '16px sans-serif';
      tempCtx.fillText('Legenda', 10, stage.height() + 25);

      let loadedIcons = 0;
      if (fixtures.length === 0) {
        const a = document.createElement('a');
        a.href = tempCanvas.toDataURL(mimeType);
        a.download = `mapa.${extension}`;
        a.click();
        return;
      }
      fixtures.forEach((fixture, index) => {
        const iconImage = new window.Image();
        iconImage.onload = () => {
          tempCtx.font = '14px sans-serif';
          tempCtx.fillText(`${fixture.number}.`, 10, stage.height() + 55 + index * 30);
          tempCtx.drawImage(iconImage, 40, stage.height() + 40 + index * 30, 26, 26);
          tempCtx.font = '12px sans-serif';
          tempCtx.fillText(fixture.name, 75, stage.height() + 55 + index * 30);
          loadedIcons++;
          if (loadedIcons === fixtures.length) {
            const a = document.createElement('a');
            a.href = tempCanvas.toDataURL(mimeType);
            a.download = `mapa.${extension}`;
            a.click();
          }
        };
        iconImage.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(ICONS[fixture.icon])}`;
      });
    };
    stageImage.src = stageDataURL;
  };

  const handleExportPNG = () => {
    exportImage('image/png', 'png');
  };

  const handleExportJPEG = () => {
    exportImage('image/jpeg', 'jpeg');
  };

  const handlePrintRider = () => {
    const win = window.open('', '_blank');
    const eq = equipmentSummary();
    const patch = [...items.filter((i) => i.id !== 'truss')].sort((a, b) => a.number - b.number);
    const style = '<style>body{font-family:system-ui;padding:24px;color:#111} h1{font-size:22px;margin:0 0 8px} h2{font-size:18px;margin:16px 0 8px} table{border-collapse:collapse;width:100%} th,td{border:1px solid #ddd;padding:6px 8px;font-size:12px} th{background:#f3f4f6;text-align:left}</style>';
    const eqRows = eq.map((e) => `<tr><td>${e.name}</td><td>${e.qty}</td><td>${e.power} W</td></tr>`).join('');
    const patchRows = patch
      .map(
        (p) =>
          `<tr><td>${p.number}</td><td>${p.uid}</td><td>${p.name}</td><td>${p.defaultMode}</td><td>${p.universe}</td><td>${p.address}</td><td>${p.channels}</td><td>${p.powerW}</td></tr>`
      )
      .join('');
    const trussCount = items.filter((i) => i.id === 'truss').length;
    win.document.write(
      style +
        '<h1>Rider Técnico – Iluminação</h1>'
        +
        '<h2>Equipamentos</h2><table><thead><tr><th>Tipo</th><th>Qtd.</th><th>Potência</th></tr></thead><tbody>'
        + eqRows +
        '</tbody></table><p>Truss/Barras: <b>'
        + trussCount +
        '</b> • Potência total: <b>' +
        (totalPower() / 1000).toFixed(2) +
        ' kW</b> • Universos DMX: '
        + 
        (universosList() || '—') + 
        '</p><h2>Patch DMX</h2><table><thead><tr><th>Nº</th><th>ID</th><th>Tipo</th><th>Modo</th><th>Universe</th><th>Endereço</th><th>Canais</th><th>W</th></tr></thead><tbody>' + 
        patchRows +
        '</tbody></table>'
    );
    win.document.close();
    win.print();
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
        onExportJSON={handleExportJSON}
        onImportJSON={handleImportJSON}
        onExportCSV={handleExportCSV}
        onExportPNG={handleExportPNG}
        onExportJPEG={handleExportJPEG}
        onPrintRider={handlePrintRider}
      />
      <div className="wrap">
        <Library onAddItem={handleAddItem} onRemoveSelected={handleRemoveSelected} onAutoPatch={handleAutoPatch} />
        <Stage
          ref={stageRef}
          items={items}
          onDragEnd={handleDragEnd}
          onSelectItem={handleSelectItem}
          onDrop={handleDrop}
          selectedItem={selectedItem}
          onUpdateItem={handleUpdateItem}
        />
        <Properties selectedItem={selectedItem} onUpdateItem={handleUpdateItem} />
      </div>
    </>
  );
}
