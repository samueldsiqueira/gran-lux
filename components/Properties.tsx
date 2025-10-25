"use client";
import React, { useState, useEffect } from 'react';

import { ICONS } from "../app/fixtures";
import { Item } from "../app/types";

const PPU = 100;

interface PropertiesProps {
  selectedItem: Item | null;
  onUpdateItem: (uid: string, properties: Partial<Item>) => void;
  onSendToBack: () => void;
  groups: { id: string; name: string }[];
  onApplyMarkerToGroup: () => void;
}

export default function Properties({ selectedItem, onUpdateItem, onSendToBack, groups, onApplyMarkerToGroup }: PropertiesProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!selectedItem) {
    if (isMobile) {
      return (
        <div className="card">
          <div className="properties-mobile-header">
            <div className="title">⚙️ Propriedades</div>
          </div>
          <div className="properties-empty">
            <div className="properties-empty-icon">👆</div>
            <div style={{fontSize: '14px', fontWeight: 500}}>Nenhum item selecionado</div>
            <div style={{fontSize: '12px', marginTop: '8px'}}>Toque em um item no palco para ver suas propriedades</div>
          </div>
        </div>
      );
    }
    return (
      <div className="card pad">
        <div className="title">Propriedades</div>
        <div className="muted">Selecione um item no palco.</div>
      </div>
    );
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateItem(selectedItem.uid, { name: e.target.value });
  };

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateItem(selectedItem.uid, { rotation: parseInt(e.target.value) });
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const originalWidth = selectedItem.id === "vara" ? 7.72 * PPU : 50;
    const originalHeight = selectedItem.id === "vara" ? 10 : 50;

    if (name === "width") {
      const newScaleX = parseFloat(value) / originalWidth;
      onUpdateItem(selectedItem.uid, { scaleX: newScaleX });
    } else if (name === "height") {
      const newScaleY = parseFloat(value) / originalHeight;
      onUpdateItem(selectedItem.uid, { scaleY: newScaleY });
    }
  };

  const width =
    (selectedItem.id === "vara" ? 7.72 * PPU : 50) * (selectedItem.scaleX || 1);
  const height =
    (selectedItem.id === "vara" ? 10 : 50) * (selectedItem.scaleY || 1);

  // Mobile version
  if (isMobile) {
    return (
      <div className="card">
        <div className="properties-mobile-header">
          <div className="title">⚙️ Propriedades</div>
        </div>

        {/* Basic Info */}
        <div className="property-group">
          <div className="property-group-title">Informações Básicas</div>
          <div className="property-row">
            <label className="property-label">Nome</label>
            <input
              type="text"
              value={selectedItem.name || ""}
              onChange={handleNameChange}
            />
          </div>
          <div className="property-row">
            <label className="property-label">Grupo</label>
            <select
              value={selectedItem.groupId || ''}
              onChange={(e) =>
                onUpdateItem(selectedItem.uid, { groupId: e.target.value })
              }
            >
              <option value="">Nenhum</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transform */}
        <div className="property-group">
          <div className="property-group-title">Transformação</div>
          <div className="property-row">
            <label className="property-label">Rotação: {selectedItem.rotation || 0}°</label>
            <input
              type="range"
              min="-180"
              max="180"
              value={selectedItem.rotation || 0}
              onChange={handleRotationChange}
              style={{width: '100%'}}
            />
          </div>
          <div className="property-grid-2">
            <div className="property-row">
              <label className="property-label">Largura</label>
              <input
                type="number"
                name="width"
                value={width.toFixed(0)}
                onChange={handleSizeChange}
              />
            </div>
            <div className="property-row">
              <label className="property-label">Altura</label>
              <input
                type="number"
                name="height"
                value={height.toFixed(0)}
                onChange={handleSizeChange}
              />
            </div>
          </div>
        </div>

        {/* Fixture Properties (not for vara) */}
        {selectedItem.id !== "vara" && (
          <>
            <div className="property-group">
              <div className="property-group-title">Equipamento</div>
              <div className="property-grid-2">
                <div className="property-row">
                  <label className="property-label">Potência (W)</label>
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
                <div className="property-row">
                  <label className="property-label">Nº Marcador</label>
                  <input
                    type="number"
                    value={selectedItem.markerNumber ?? ""}
                    placeholder="opcional"
                    onChange={(e) =>
                      onUpdateItem(selectedItem.uid, {
                        markerNumber: e.target.value === "" ? undefined : parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
              <div className="property-row">
                <label className="property-label">Cor do Marcador</label>
                <input
                  type="color"
                  value={selectedItem.color || "#111111"}
                  onChange={(e) =>
                    onUpdateItem(selectedItem.uid, { color: e.target.value })
                  }
                />
              </div>
              <div className="property-row">
                <label className="property-label">Ícone</label>
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
              <div className="property-row">
                <label className="property-label">Modos (separados por vírgula)</label>
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
              <div className="property-row">
                <label className="property-label">Modo Padrão</label>
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
            </div>
          </>
        )}

        {/* Actions */}
        <div className="property-actions">
          {selectedItem.groupId && selectedItem.id !== "vara" && (
            <button className="btn" onClick={onApplyMarkerToGroup}>
              🏷️ Aplicar Marcador ao Grupo
            </button>
          )}
          <button className="btn" onClick={onSendToBack}>
            📤 Enviar para Trás
          </button>
        </div>
      </div>
    );
  }

  // Desktop version
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
        <label>Grupo</label>
        <select
          value={selectedItem.groupId || ''}
          onChange={(e) =>
            onUpdateItem(selectedItem.uid, { groupId: e.target.value })
          }
        >
          <option value="">Nenhum</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
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
            <label>Número do marcador</label>
            <input
              type="number"
              value={selectedItem.markerNumber ?? ""}
              placeholder="opcional"
              onChange={(e) =>
                onUpdateItem(selectedItem.uid, {
                  markerNumber: e.target.value === "" ? undefined : parseInt(e.target.value) || 0,
                })
              }
            />
          </div>
          <div>
            <label>Cor do marcador</label>
            <input
              type="color"
              value={selectedItem.color || "#111111"}
              onChange={(e) =>
                onUpdateItem(selectedItem.uid, { color: e.target.value })
              }
            />
          </div>
          {selectedItem.groupId && (
            <div>
              <button className="btn" onClick={onApplyMarkerToGroup}>
                Aplicar marcador/cor ao grupo
              </button>
            </div>
          )}
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
