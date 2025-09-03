export const ICONS = {
  parled:
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><circle cx="13" cy="13" r="11" fill="#0b0b0bff"/><circle cx="9" cy="13" r="3" fill="#22c55e"/><circle cx="17" cy="13" r="3" fill="#ef4444"/><circle cx="13" cy="9" r="3" fill="#eab308"/><circle cx="13" cy="17" r="3" fill="#06b6d4"/></svg>',
  spot: '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="8" width="18" height="10" rx="5" fill="#111"/><circle cx="19" cy="13" r="5" fill="#5a5b5dff"/><rect x="2" y="11" width="6" height="4" rx="2" fill="#374151"/></svg>',
  wash: '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="9" width="20" height="8" rx="4" fill="#7c3aed"/><circle cx="8" cy="13" r="2.2" fill="#fff"/><circle cx="13" cy="13" r="2.2" fill="#fff"/><circle cx="18" cy="13" r="2.2" fill="#fff"/></svg>',
  strobe:
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="9" width="20" height="8" rx="2" fill="#000"/><rect x="5" y="11" width="16" height="4" fill="#f1f5f9"/></svg>',
  fresnel:
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="9" width="14" height="8" rx="2" fill="#334155"/><circle cx="12" cy="13" r="3.5" fill="#5a5b5dff"/><rect x="18" y="10" width="4" height="6" fill="#111"/></svg>',
  truss:
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="20" height="4" rx="2" fill="#111"/><path d="M5 11 L9 15 M9 11 L13 15 M13 11 L17 15 M17 11 L21 15" stroke="#64748b" stroke-width="2"/></svg>',
  ledbar:
    '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="11" width="20" height="4" rx="2" fill="#111"/><g><rect x="5" y="12" width="2" height="2" fill="#22c55e"/><rect x="8" y="12" width="2" height="2" fill="#3b82f6"/><rect x="11" y="12" width="2" height="2" fill="#f59e0b"/><rect x="14" y="12" width="2" height="2" fill="#ef4444"/><rect x="17" y="12" width="2" height="2" fill="#06b6d4"/><rect x="20" y="12" width="2" height="2" fill="#a78bfa"/></g></svg>',
  fog: '<svg width="26" height="26" viewBox="0 0 26 26" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="10" width="18" height="12" rx="2" fill="#4a5568"/><rect x="6" y="12" width="14" height="8" rx="2" fill="#2d3748"/><path d="M8 8 Q10 4 12 8 T16 8 T20 8" stroke="#a0aec0" stroke-width="2" fill="none"/></svg>',
  // New icons from public folder
  elipsoidal_icon: "/elipsoidal.svg",
  fresnel_icon: "/fresnel.svg",
  led_bar_icon: "/led_bar.svg",
  par_64_icon: "/par_64.svg",
  par_led_icon: "/par_led.svg",
  set_light_icon: "/set_light.svg",
  smoke_machine_icon: "/smoke_machine.svg",
};

export const FIXTURES = [
  {
    id: "foco_recortado_mascaras",
    name: 'Foco Recortado "Mascaras" (Elipsoidal)',
    powerW: 750,
    icon: "fresnel",
    modes: ["1ch"],
    defaultMode: "1ch",
  },

  {
    id: "luz_generica",
    name: "generico",
    powerW: 250,
    icon: "spot",
    modes: ["1ch"],
    defaultMode: "1ch",
  },
  {
    id: "par_led",
    name: "PAR LED",
    powerW: 180,
    icon: "parled",
    modes: ["3ch", "7ch"],
    defaultMode: "7ch",
  },
  {
    id: "fumaca_fog",
    name: "Fumaça (Fog)",
    powerW: 1000,
    icon: "fog",
    modes: ["1ch"],
    defaultMode: "1ch",
  },
  {
    id: "truss",
    name: "Vara de luz (Truss - estrutura)",
    powerW: 0,
    icon: "truss",
    modes: [],
    defaultMode: "",
  },
  // New fixtures from public folder images
  {
    id: "elipsoidal_light",
    name: "Luz Elipsoidal",
    powerW: 750,
    icon: "elipsoidal_icon",
    modes: ["1ch"],
    defaultMode: "1ch",
  },
  {
    id: "fresnel_light",
    name: "Luz Fresnel",
    powerW: 650,
    icon: "fresnel_icon",
    modes: ["1ch"],
    defaultMode: "1ch",
  },
  {
    id: "led_bar_fixture",
    name: "Barra LED",
    powerW: 150,
    icon: "led_bar_icon",
    modes: ["3ch", "6ch", "12ch"],
    defaultMode: "12ch",
  },
  {
    id: "par_64_fixture",
    name: "PAR 64",
    powerW: 1000,
    icon: "par_64_icon",
    modes: ["1ch"],
    defaultMode: "1ch",
  },
  {
    id: "par_led_file_fixture",
    name: "PAR LED (Arquivo)",
    powerW: 180,
    icon: "par_led_icon",
    modes: ["3ch", "7ch"],
    defaultMode: "7ch",
  },
  {
    id: "set_light_fixture",
    name: "Luz de Set",
    powerW: 300,
    icon: "set_light_icon",
    modes: ["1ch"],
    defaultMode: "1ch",
  },
  {
    id: "smoke_machine_file_fixture",
    name: "Máquina de Fumaça )",
    powerW: 1500,
    icon: "smoke_machine_icon",
    modes: ["1ch"],
    defaultMode: "1ch",
  },
];
