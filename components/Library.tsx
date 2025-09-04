"use client";
import { FIXTURES, ICONS } from "../app/fixtures";

interface LibraryProps {
  onSizeChange: (size: number) => void;
  onAddItem: (fixture: any) => void;
  onRemoveSelected: () => void;
  onAutoPatch: () => void;
}

export function Library({
  onSizeChange,
  onAddItem,
  onRemoveSelected,
  onAutoPatch,
}: LibraryProps) {
  const handleDragStart = (e, fixture) => {
    e.dataTransfer.setData("application/json", JSON.stringify(fixture));

    const img = new Image();
    const iconSource = ICONS[fixture.icon];
    if (iconSource.startsWith("<svg")) {
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(iconSource)}`;
    } else {
      img.src = iconSource; // Use the image path directly
    }
    img.width = 26;
    img.height = 26;
    e.dataTransfer.setDragImage(img, 13, 13);
  };

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
      <div className="list">
        {FIXTURES.map((fixture) => (
          <div
            key={fixture.id}
            className="item"
            onClick={() => onAddItem(fixture)}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, fixture)}
          >
            {(() => {
              const iconSource = ICONS[fixture.icon];
              if (iconSource.startsWith("<svg")) {
                return <div dangerouslySetInnerHTML={{ __html: iconSource }} />;
              } else {
                return (
                  <img
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
