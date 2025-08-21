'use client';
import { FIXTURES, ICONS } from '../app/fixtures';

export default function Library({ onAddItem, onRemoveSelected, onAutoPatch }) {
  const handleDragStart = (e, fixture) => {
    e.dataTransfer.setData('application/json', JSON.stringify(fixture));

    const img = new Image();
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
      ICONS[fixture.icon]
    )}`;
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
            <div dangerouslySetInnerHTML={{ __html: ICONS[fixture.icon] }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: '12px' }}>
                {fixture.name}
              </div>
              <div className="muted" style={{ fontSize: '11px' }}>
                {fixture.id === 'truss'
                  ? 'estrutura para pendurar'
                  : `${fixture.defaultMode} • ${
                      fixture.powerW || 0
                    }W`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}