"use client";
import { Item } from '../app/types';

import React from 'react';

interface TopBarProps {
  title: string;
  onTitleChange: (title: string) => void;
  onExportJSON: () => void;
  onImportJSON: (data: { items: Item[], title: string, groups: { id: string, name: string }[] }) => void;
  onExportCSV: () => void;
  onExportPNG: () => void;
  onExportJPEG: () => void;
  onPrintRider: () => void;
}

export default function TopBar({
  title,
  onTitleChange,
  onExportJSON,
  onImportJSON,
  onExportCSV,
  onExportPNG,
  onExportJPEG,
  onPrintRider,
}: TopBarProps) {
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: ProgressEvent<FileReader>) => {
      try {
        if (ev.target?.result) {
          const data = JSON.parse(ev.target.result as string);
          onImportJSON(data);
        }
      } catch {
        alert("Arquivo inválido");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="top">
      <span className="brand">LumiRider Pro</span>
      <input
        type="text"
        className="title-input"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Nome do Espetáculo"
      />

      <span style={{ marginLeft: "auto" }}></span>
      <button className="btn" onClick={onExportJSON}>
        Salvar JSON
      </button>
      <label className="btn">
        Abrir JSON
        <input
          id="openJson"
          type="file"
          accept=".json"
          style={{ display: "none" }}
          onChange={handleImport}
        />
      </label>
      <button className="btn" onClick={onExportCSV}>
        CSV Patch
      </button>
      <button className="btn" onClick={onExportPNG}>
        PNG do mapa
      </button>
      <button className="btn" onClick={onExportJPEG}>
        JPEG do mapa
      </button>
      <button className="btn" onClick={onPrintRider}>
        Imprimir Rider
      </button>
    </div>
  );
}