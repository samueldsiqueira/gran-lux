"use client";

import { ICONS } from "../app/fixtures";

const PPU = 100;

export default function Properties({ selectedItem, onUpdateItem, onSendToBack }) {
  if (!selectedItem) {
    return (
      <div className="card pad">
        <div className="title">Propriedades</div>
        <div className="muted">Selecione um item no palco.</div>
      </div>
    );
  }

  const handleNameChange = (e) => {
    onUpdateItem(selectedItem.uid, { name: e.target.value });
  };

  const handleRotationChange = (e) => {
    onUpdateItem(selectedItem.uid, { rotation: parseInt(e.target.value) });
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    const originalWidth = selectedItem.id === "vara" ? 7.72 * PPU : 26;
    const originalHeight = selectedItem.id === "vara" ? 10 : 26;

    if (name === "width") {
      const newScaleX = parseFloat(value) / originalWidth;
      onUpdateItem(selectedItem.uid, { scaleX: newScaleX });
    } else if (name === "height") {
      const newScaleY = parseFloat(value) / originalHeight;
      onUpdateItem(selectedItem.uid, { scaleY: newScaleY });
    }
  };

  const width =
    (selectedItem.id === "vara" ? 7.72 * PPU : 26) * (selectedItem.scaleX || 1);
  const height =
    (selectedItem.id === "vara" ? 10 : 26) * (selectedItem.scaleY || 1);

  return (
    <div className="card pad">
      <div className="title">Propriedades</div>
      <div>
        <label>Nome</label>
        <input
          type="text"
          value={selectedItem.name || ""}
          onChange={handleNameChange}
        />
      </div>
      <div>
        <label>Rotação</label>
        <input
          type="range"
          min="-180"
          max="180"
          value={selectedItem.rotation || 0}
          onChange={handleRotationChange}
        />
        <span>{selectedItem.rotation || 0}°</span>
      </div>

      {selectedItem.id !== "vara" && (
        <>
          <div>
            <label>Potência (W)</label>
            <input
              type="number"
              value={selectedItem.powerW || 0}
              onChange={(e) =>
                onUpdateItem(selectedItem.uid, {
                  powerW: parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label>Ícone</label>
            <select
              value={selectedItem.icon}
              onChange={(e) =>
                onUpdateItem(selectedItem.uid, { icon: e.target.value })
              }
            >
              {Object.keys(ICONS).map((iconKey) => (
                <option key={iconKey} value={iconKey}>
                  {iconKey}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Modos (separados por vírgula)</label>
            <input
              type="text"
              value={selectedItem.modes?.join(", ") || ""}
              onChange={(e) =>
                onUpdateItem(selectedItem.uid, {
                  modes: e.target.value.split(",").map((s) => s.trim()),
                })
              }
            />
          </div>
          <div>
            <label>Modo Padrão</label>
            <select
              value={selectedItem.defaultMode}
              onChange={(e) =>
                onUpdateItem(selectedItem.uid, { defaultMode: e.target.value })
              }
            >
              {selectedItem.modes?.map((mode) => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <div>
        <label>Largura (px)</label>
        <input
          type="number"
          name="width"
          value={width.toFixed(2)}
          onChange={handleSizeChange}
        />
      </div>
      <div>
        <label>Altura (px)</label>
        <input
          type="number"
          name="height"
          value={height.toFixed(2)}
          onChange={handleSizeChange}
        />
      </div>
      <div>
        <button onClick={onSendToBack}>Enviar para Trás</button>
      </div>
    </div>
  );
}