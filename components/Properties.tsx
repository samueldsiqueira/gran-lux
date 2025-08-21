'use client';

const PPU = 100;

export default function Properties({ selectedItem, onUpdateItem }) {
  if (!selectedItem) {
    return (
      <div className="card pad">
        <div className="title">Propriedades</div>
        <div className="muted">Selecione um item no palco.</div>
      </div>
    );
  }

  const handleRotationChange = (e) => {
    onUpdateItem(selectedItem.uid, { rotation: parseInt(e.target.value) });
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    const originalWidth = selectedItem.id === 'truss' ? 7.72 * PPU : 26;
    const originalHeight = selectedItem.id === 'truss' ? 10 : 26;

    if (name === 'width') {
      const newScaleX = parseFloat(value) / originalWidth;
      onUpdateItem(selectedItem.uid, { scaleX: newScaleX });
    } else if (name === 'height') {
      const newScaleY = parseFloat(value) / originalHeight;
      onUpdateItem(selectedItem.uid, { scaleY: newScaleY });
    }
  };

  const width = (selectedItem.id === 'truss' ? 7.72 * PPU : 26) * (selectedItem.scaleX || 1);
  const height = (selectedItem.id === 'truss' ? 10 : 26) * (selectedItem.scaleY || 1);

  return (
    <div className="card pad">
      <div className="title">Propriedades</div>
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
    </div>
  );
}