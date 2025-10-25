"use client";
import React, { useState, useEffect } from 'react';
import { FIXTURES, ICONS } from "../app/fixtures";
import Image from "next/image";

interface Fixture {
  id: string;
  name: string;
  powerW: number;
  icon: string;
  modes: string[];
  defaultMode: string;
}

interface LibraryProps {
  onSizeChange: (size: number) => void;
  onAddItem: (fixture: Fixture, groupId: string | null) => void;
  onRemoveSelected: () => void;
  onAutoPatch: () => void;
  onAddGroup: (name: string) => void;
  groups: { id: string; name: string }[];
  selectedGroup: string | null;
  setSelectedGroup: (id: string | null) => void;
}

export function Library({
  onSizeChange,
  onAddItem,
  onRemoveSelected,
  onAutoPatch,
  onAddGroup,
  groups,
  selectedGroup,
  setSelectedGroup,
}: LibraryProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [groupsOpen, setGroupsOpen] = useState(true);
  const [itemsOpen, setItemsOpen] = useState(true);
  const [actionsOpen, setActionsOpen] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const handleDragStart = (e: React.DragEvent, fixture: Fixture) => {
    e.dataTransfer.setData("application/json", JSON.stringify(fixture));

    const img = new window.Image();
    const iconSource = ICONS[fixture.icon as keyof typeof ICONS];
    if (iconSource.startsWith("<svg")) {
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSource)}`;
    } else {
      img.src = iconSource; // Use the image path directly
    }
    img.width = 50;
    img.height = 50;
    e.dataTransfer.setDragImage(img, 13, 13);
  };

  // Mobile version
  if (isMobile) {
    return (
      <div className="card">
        <div className="library-mobile-header">
          <div className="title">📚 Biblioteca</div>
        </div>

        {/* Groups Section */}
        <div className="collapsible-section">
          <div className="collapsible-header" onClick={() => setGroupsOpen(!groupsOpen)}>
            <span className="library-section-title">🏷️ Grupos ({groups.length})</span>
            <span className={`chevron ${groupsOpen ? 'open' : ''}`}>▼</span>
          </div>
          <div className={`collapsible-content ${groupsOpen ? 'open' : ''}`}>
            <div className="library-section">
              <button className="btn" onClick={() => onAddGroup(`Vara ${groups.length + 1}`)} style={{width: '100%', marginBottom: '12px'}}>
                ➕ Nova Vara
              </button>
              <div className="list">
                {groups.map((group) => (
                  <div
                    key={group.id}
                    className={`item ${selectedGroup === group.id ? "selected" : ""}`}
                    onClick={() => setSelectedGroup(group.id)}
                  >
                    <span style={{fontSize: '20px'}}>📁</span>
                    <div className="fixture-info">
                      <div className="fixture-name">{group.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Fixtures Section */}
        <div className="collapsible-section">
          <div className="collapsible-header" onClick={() => setItemsOpen(!itemsOpen)}>
            <span className="library-section-title">💡 Equipamentos ({FIXTURES.length})</span>
            <span className={`chevron ${itemsOpen ? 'open' : ''}`}>▼</span>
          </div>
          <div className={`collapsible-content ${itemsOpen ? 'open' : ''}`}>
            <div className="library-section">
              <div className="list">
                {FIXTURES.map((fixture) => (
                  <div
                    key={fixture.id}
                    className="item"
                    onClick={() => onAddItem(fixture, selectedGroup)}
                  >
                    {(() => {
                      const iconSource = ICONS[fixture.icon as keyof typeof ICONS];
                      if (iconSource.startsWith("<svg")) {
                        return <div dangerouslySetInnerHTML={{ __html: iconSource }} />;
                      } else {
                        return (
                          <Image
                            src={iconSource}
                            width="32"
                            height="32"
                            alt={fixture.name}
                          />
                        );
                      }
                    })()}
                    <div className="fixture-info">
                      <div className="fixture-name">{fixture.name}</div>
                      <div className="fixture-meta">
                        {fixture.id === "vara"
                          ? "estrutura para pendurar"
                          : `${fixture.defaultMode} • ${fixture.powerW || 0}W`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Actions Section */}
        <div className="collapsible-section">
          <div className="collapsible-header" onClick={() => setActionsOpen(!actionsOpen)}>
            <span className="library-section-title">⚡ Ações</span>
            <span className={`chevron ${actionsOpen ? 'open' : ''}`}>▼</span>
          </div>
          <div className={`collapsible-content ${actionsOpen ? 'open' : ''}`}>
            <div className="library-section">
              <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <button className="btn" onClick={onAutoPatch} style={{width: '100%'}}>
                  🔧 Auto-patch DMX
                </button>
                <button className="btn danger" onClick={onRemoveSelected} style={{width: '100%'}}>
                  🗑️ Remover Selecionado
                </button>
                <div style={{marginTop: '8px', marginBottom: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--mut)'}}>
                  Tamanho do Palco
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px'}}>
                  <button className="btn" onClick={() => onSizeChange(800)}>800px</button>
                  <button className="btn" onClick={() => onSizeChange(1400)}>1200px</button>
                  <button className="btn" onClick={() => onSizeChange(2000)}>2400px</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="card pad">
      <div className="title">Biblioteca de Itens</div>
      <div className="tools">
        <span className="pill muted">Clique ou arraste</span>
        <button className="btn" onClick={onAutoPatch}>
          Auto‑patch DMX
        </button>
        <button className="btn danger" onClick={onRemoveSelected}>
          Remover selecionado
        </button>
        <div className="sep"></div> {/* Separator */}
        <span className="pill muted">Tamanho do Palco</span>
        <button className="btn" onClick={() => onSizeChange(800)}>
          800px
        </button>
        <button className="btn" onClick={() => onSizeChange(1400)}>
          1200px
        </button>
        <button className="btn" onClick={() => onSizeChange(2000)}>
          2400px
        </button>
      </div>
      <div className="title">Grupos</div>
      <div className="tools">
        <button className="btn" onClick={() => onAddGroup(`Vara ${groups.length + 1}`)}>
          Nova Vara
        </button>
      </div>
      <div className="list">
        {groups.map((group) => (
          <div
            key={group.id}
            className={`item ${selectedGroup === group.id ? "selected" : ""}`}
            onClick={() => setSelectedGroup(group.id)}
          >
            {group.name}
          </div>
        ))}
      </div>
      <div className="title">Itens</div>
      <div className="list">
        {FIXTURES.map((fixture) => (
          <div
            key={fixture.id}
            className="item"
            onClick={() => onAddItem(fixture, selectedGroup)}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, fixture)}
          >
            {(() => {
              const iconSource = ICONS[fixture.icon as keyof typeof ICONS];
              if (iconSource.startsWith("<svg")) {
                return <div dangerouslySetInnerHTML={{ __html: iconSource }} />;
              } else {
                return (
                  <Image
                    src={iconSource}
                    width="26"
                    height="26"
                    alt={fixture.name}
                  />
                );
              }
            })()}
            <div>
              <div style={{ fontWeight: 600, fontSize: "12px" }}>
                {fixture.name}
              </div>
              <div className="muted" style={{ fontSize: "11px" }}>
                {fixture.id === "vara"
                  ? "estrutura para pendurar"
                  : `${fixture.defaultMode} • ${fixture.powerW || 0}W`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
