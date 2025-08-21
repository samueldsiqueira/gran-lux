export const ICONS = {
  parled: '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="11" fill="#1d4ed8"/><circle cx="9" cy="13" r="3" fill="#22c55e"/><circle cx="17" cy="13" r="3" fill="#ef4444"/><circle cx="13" cy="9" r="3" fill="#eab308"/><circle cx="13" cy="17" r="3" fill="#06b6d4"/></svg>',
  spot:   '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="18" height="10" rx="5" fill="#111"/><circle cx="19" cy="13" r="5" fill="#3b82f6"/><rect x="2" y="11" width="6" height="4" rx="2" fill="#374151"/></svg>',
  wash:   '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="9" width="20" height="8" rx="4" fill="#7c3aed"/><circle cx="8" cy="13" r="2.2" fill="#fff"/><circle cx="13" cy="13" r="2.2" fill="#fff"/><circle cx="18" cy="13" r="2.2" fill="#fff"/></svg>',
  strobe: '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="9" width="20" height="8" rx="2" fill="#000"/><rect x="5" y="11" width="16" height="4" fill="#f1f5f9"/></svg>',
  fresnel:'<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="9" width="14" height="8" rx="2" fill="#334155"/><circle cx="12" cy="13" r="3.5" fill="#fde68a"/><rect x="18" y="10" width="4" height="6" fill="#111"/></svg>',
  truss:  '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="20" height="4" rx="2" fill="#111"/><path d="M5 11 L9 15 M9 11 L13 15 M13 11 L17 15 M17 11 L21 15" stroke="#64748b" stroke-width="2"/></svg>',
  ledbar: '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="20" height="4" rx="2" fill="#111"/><g><rect x="5" y="12" width="2" height="2" fill="#22c55e"/><rect x="8" y="12" width="2" height="2" fill="#3b82f6"/><rect x="11" y="12" width="2" height="2" fill="#f59e0b"/><rect x="14" y="12" width="2" height="2" fill="#ef4444"/><rect x="17" y="12" width="2" height="2" fill="#06b6d4"/><rect x="20" y="12" width="2" height="2" fill="#a78bfa"/></g></svg>',
  fog:    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="10" width="18" height="12" rx="2" fill="#4a5568"/><rect x="6" y="12" width="14" height="8" rx="2" fill="#2d3748"/><path d="M8 8 Q10 4 12 8 T16 8 T20 8" stroke="#a0aec0" stroke-width="2" fill="none"/></svg>'
};

export const FIXTURES = [
  { id: 'foco_central_geral', name: 'Foco Central (Geral)', powerW: 500, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_esquerdo_geral', name: 'Foco Esquerdo (Geral)', powerW: 500, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_direito_geral', name: 'Foco Direito (Geral)', powerW: 500, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_direcional_esquerdo', name: 'Foco Direcional Esquerdo', powerW: 500, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_direcional_direito', name: 'Foco Direcional Direito', powerW: 500, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_direcional_central', name: 'Foco Direcional Central', powerW: 500, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_recortado_mascaras', name: 'Foco Recortado "Mascaras" (Elipsoidal)', powerW: 750, icon: 'fresnel', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_pino_central_fundo', name: 'Foco Pino Central Fundo', powerW: 250, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_pino_central_proscenio', name: 'Foco Pino Central Proscenio', powerW: 250, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_pino_direito_fundo', name: 'Foco Pino Direito Fundo', powerW: 250, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_pino_direito_proscenio', name: 'Foco Pino Direito Proscenio', powerW: 250, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_pino_esquerdo_fundo', name: 'Foco Pino Esquerdo Fundo', powerW: 250, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'foco_pino_esquerdo_proscenio', name: 'Foco Pino Esquerdo Proscenio', powerW: 250, icon: 'spot', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'fumaca_fog', name: 'Fumaça (Fog)', powerW: 1000, icon: 'fog', modes: ['1ch'], defaultMode: '1ch' },
  { id: 'truss', name: 'Barra de luz (Truss - estrutura)', powerW: 0, icon: 'truss', modes: [], defaultMode: '' }
];