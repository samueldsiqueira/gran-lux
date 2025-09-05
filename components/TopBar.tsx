"use client";

export default function TopBar({
  title,
  onTitleChange,
  onExportJSON,
  onImportJSON,
  onExportCSV,
  onExportPNG,
  onExportJPEG,
  onPrintRider,
}) {
  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        onImportJSON(data);
      } catch (err) {
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