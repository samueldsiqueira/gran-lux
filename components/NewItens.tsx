// LumiRider Icons – React (Next.js) v1
// ------------------------------------
// Cole este arquivo em:  src/components/lumirider-icons.tsx
// Uso rápido:
//   import { FresnelIcon, ElipsoidalIcon, ParLedIcon } from "@/components/lumirider-icons";
//   <FresnelIcon size={72} className="text-zinc-700" />
//
// Filosofia:
// - SVG 128x128 com densidade maior (shapes + gradientes + detalhes)
// - CSS Variables para cores/metal/vidro (override via classe pai)
// - Props consistentes: size, strokeWidth, className, rotate, mirrored
// - Componentes memorizados para economizar render
// - Sem dependências externas (funciona em Next.js/React puro)
//
// Variáveis CSS padrão:
//   --lr-stroke: cor do traço
//   --lr-metal-light / --lr-metal-mid / --lr-metal-dark
//   --lr-lens-outer / --lr-lens-inner (vidro)
//   --lr-smoke / --lr-led-red / --lr-led-green / --lr-led-blue
//
// Sugestão de tema (global.css):
// :root {
//   --lr-stroke: #2b2f33;
//   --lr-metal-light: #dfe4ea; --lr-metal-mid: #aab2bd; --lr-metal-dark: #6b7280;
//   --lr-lens-outer: #7dd3fc; --lr-lens-inner: #38bdf8;
//   --lr-smoke: #cbd5e1;
//   --lr-led-red: #ef4444; --lr-led-green: #22c55e; --lr-led-blue: #3b82f6;
// }
// .dark :root {
//   --lr-stroke: #e5e7eb; --lr-metal-light: #9aa3af; --lr-metal-mid: #6b7280; --lr-metal-dark: #374151;
//   --lr-lens-outer: #60a5fa; --lr-lens-inner: #93c5fd; --lr-smoke: #94a3b8;
// }

import * as React from "react";

export type IconProps = {
  size?: number | string;
  className?: string;
  strokeWidth?: number;
  rotate?: number; // graus
  mirrored?: boolean; // espelha no eixo X
  title?: string;
};

const withMemo = <P extends object>(Comp: React.FC<P>) => React.memo(Comp);

function Frame({
  id,
  size = 128,
  className,
  strokeWidth = 1.75,
  rotate = 0,
  mirrored = false,
  title,
  children,
}: IconProps & { id: string; children: React.ReactNode }) {
  const transform = `${mirrored ? "scaleX(-1) " : ""}rotate(${rotate})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 128 128"
      role="img"
      aria-label={title}
      className={className}
      style={{ color: "currentColor" }}
    >
      <defs>
        {/* Gradientes genéricos (metal) */}
        <linearGradient id={`${id}-metal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--lr-metal-light, #e6e9ef)" />
          <stop offset="50%" stopColor="var(--lr-metal-mid, #b0b7c1)" />
          <stop offset="100%" stopColor="var(--lr-metal-dark, #6b7280)" />
        </linearGradient>
        <radialGradient id={`${id}-lens`} cx="50%" cy="50%" r="60%">
          <stop
            offset="0%"
            stopColor="var(--lr-lens-inner, #38bdf8)"
            stopOpacity="0.95"
          />
          <stop
            offset="70%"
            stopColor="var(--lr-lens-outer, #7dd3fc)"
            stopOpacity="0.85"
          />
          <stop offset="100%" stopColor="transparent" stopOpacity="0.2" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="0.6" result="b" />
          <feOffset dy="0.4" result="o" />
          <feComposite in="o" in2="b" operator="arithmetic" k2="-1" k3="1" />
          <feBlend in="SourceGraphic" />
        </filter>
      </defs>
      <g
        stroke="var(--lr-stroke, #2b2f33)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={transform}
        filter={`url(#${id}-soft)`}
      >
        {children}
      </g>
    </svg>
  );
}

// =============== ÍCONES ===============

export const FresnelIcon = withMemo((props: IconProps) => (
  <Frame id="fresnel" title={props.title ?? "Luz Fresnel"} {...props}>
    {/* Corpo */}
    <rect
      x={26}
      y={38}
      width={44}
      height={40}
      rx={6}
      fill={`url(#fresnel-metal)`}
    />
    {/* Lente + anéis */}
    <circle cx={84} cy={58} r={19} fill={`url(#fresnel-lens)`} />
    <circle cx={84} cy={58} r={14} fill="none" />
    <circle cx={84} cy={58} r={10} fill="none" />
    <circle cx={84} cy={58} r={6} fill="none" />
    {/* Yoke */}
    <path d="M26 36 q-6 8 0 16 M70 36 q6 8 0 16" fill="none" />
    {/* Trava/pegador */}
    <rect
      x={60}
      y={32}
      width={8}
      height={6}
      rx={2}
      fill={`url(#fresnel-metal)`}
    />
  </Frame>
));

export const ElipsoidalIcon = withMemo((props: IconProps) => (
  <Frame
    id="elip"
    title={props.title ?? "Foco Recortado (Elipsoidal)"}
    {...props}
  >
    {/* Tubo */}
    <rect
      x={18}
      y={48}
      width={36}
      height={24}
      rx={4}
      fill={`url(#elip-metal)`}
    />
    {/* Canhão */}
    <path d="M54 60 l28 -10 v20 l-28 -10 z" fill={`url(#elip-metal)`} />
    {/* Shutters */}
    <rect
      x={12}
      y={46}
      width={8}
      height={10}
      rx={2}
      fill={`url(#elip-metal)`}
    />
    <rect
      x={12}
      y={66}
      width={8}
      height={10}
      rx={2}
      fill={`url(#elip-metal)`}
    />
    {/* Yoke */}
    <path d="M44 42 l-10 -12 M44 78 l-10 12" />
    {/* Lente frontal suave */}
    <circle cx={84} cy={58} r={8} fill={`url(#elip-lens)`} />
  </Frame>
));

export const ParLedIcon = withMemo((props: IconProps) => (
  <Frame id="parled" title={props.title ?? "PAR LED"} {...props}>
    <rect
      x={24}
      y={40}
      width={40}
      height={36}
      rx={6}
      fill={`url(#parled-metal)`}
    />
    <circle cx={76} cy={58} r={17} fill={`url(#parled-metal)`} />
    {/* LEDs coloridos */}
    <g>
      {Array.from({ length: 16 }).map((_, i) => {
        const r = Math.floor(i / 4),
          c = i % 4;
        const cx = 66 + c * 6,
          cy = 48 + r * 6;
        const color = [
          "var(--lr-led-red,#ef4444)",
          "var(--lr-led-green,#22c55e)",
          "var(--lr-led-blue,#3b82f6)",
        ][(i + r) % 3];
        return (
          <circle key={i} cx={cx} cy={cy} r={1.8} fill={color} stroke="none" />
        );
      })}
    </g>
    {/* Yoke */}
    <path d="M24 38 q-6 8 0 16 M64 38 q6 8 0 16" />
  </Frame>
));

export const Par64Icon = withMemo((props: IconProps) => (
  <Frame id="par64" title={props.title ?? "PAR 64"} {...props}>
    <rect
      x={26}
      y={42}
      width={42}
      height={32}
      rx={6}
      fill={`url(#par64-metal)`}
    />
    <circle cx={79} cy={58} r={18} fill={`url(#par64-lens)`} />
    <path d="M22 40 l8 12 M22 74 l8 -12" />
  </Frame>
));

export const SetLightIcon = withMemo((props: IconProps) => (
  <Frame id="set" title={props.title ?? "Luz de Set (Open Face)"} {...props}>
    <rect
      x={22}
      y={44}
      width={64}
      height={30}
      rx={4}
      fill={`url(#set-metal)`}
    />
    <path d="M22 54 h64 M22 64 h64" />
    <path d="M34 44 v30 M48 44 v30 M62 44 v30 M76 44 v30" />
    <path d="M18 42 l8 10 M18 76 l8 -10" />
  </Frame>
));

export const FogMachineIcon = withMemo((props: IconProps) => (
  <Frame id="fog" title={props.title ?? "Máquina de Fumaça"} {...props}>
    <rect
      x={24}
      y={58}
      width={46}
      height={24}
      rx={4}
      fill={`url(#fog-metal)`}
    />
    <path d="M70 64 h16 v8" />
    {/* Nuvem */}
    <g fill="var(--lr-smoke,#cbd5e1)" stroke="none">
      <path d="M86 70 q10 -8 18 0 q-8 10 -18 0" />
      <path d="M92 76 q8 -6 14 0" />
    </g>
    {/* alça */}
    <path d="M30 58 v-6 h14" />
  </Frame>
));

export const DimmerPackIcon = withMemo((props: IconProps) => (
  <Frame id="dimmer" title={props.title ?? "Dimmer Pack"} {...props}>
    <rect
      x={34}
      y={26}
      width={60}
      height={74}
      rx={6}
      fill={`url(#dimmer-metal)`}
    />
    <path d="M42 42 v46 M58 42 v46 M74 42 v46 M90 42 v46" />
    <rect
      x={38}
      y={32}
      width={12}
      height={6}
      rx={2}
      fill={`url(#dimmer-metal)`}
    />
    <rect
      x={54}
      y={32}
      width={12}
      height={6}
      rx={2}
      fill={`url(#dimmer-metal)`}
    />
    <rect
      x={70}
      y={32}
      width={12}
      height={6}
      rx={2}
      fill={`url(#dimmer-metal)`}
    />
    <rect
      x={86}
      y={32}
      width={12}
      height={6}
      rx={2}
      fill={`url(#dimmer-metal)`}
    />
  </Frame>
));

export const LightingConsoleIcon = withMemo((props: IconProps) => (
  <Frame id="console" title={props.title ?? "Mesa de Luz (Console)"} {...props}>
    <path d="M24 54 h80 l-8 30 h-64 z" fill={`url(#console-metal)`} />
    {Array.from({ length: 5 }).map((_, i) => (
      <g key={i}>
        <path d={`M${44 + i * 12} 52 v44`} />
        <rect
          x={44 + i * 12 - 2}
          y={66}
          width={4}
          height={10}
          rx={1}
          fill={`url(#console-metal)`}
        />
      </g>
    ))}
    {Array.from({ length: 4 }).map((_, i) => (
      <path key={i} d={`M42 ${60 + i * 10} h52`} />
    ))}
    <circle cx={36} cy={58} r={3} />
    <circle cx={88} cy={58} r={3} />
  </Frame>
));

export const varaIcon = withMemo((props: IconProps) => (
  <Frame id="vara" title={props.title ?? "Espinha / vara"} {...props}>
    <rect
      x={18}
      y={46}
      width={92}
      height={24}
      rx={4}
      fill={`url(#vara-metal)`}
    />
    <path d="M22 50 l84 16 M22 70 l84 -16 M46 46 v24 M82 46 v24" />
  </Frame>
));

export const TBarIcon = withMemo((props: IconProps) => (
  <Frame id="tbar" title={props.title ?? "Arara (T-Bar)"} {...props}>
    <path d="M64 28 v64" />
    <path d="M34 28 h60" />
    <path d="M64 92 l-22 16 M64 92 l22 16" />
  </Frame>
));

export const TripodLowIcon = withMemo((props: IconProps) => (
  <Frame
    id="tripod-low"
    title={props.title ?? "Pé de Galinha (baixo)"}
    {...props}
  >
    <circle cx={64} cy={44} r={4} fill={`url(#tripod-low-metal)`} />
    <path d="M64 72 v-24" />
    <path d="M64 72 l-22 12 M64 72 l22 12 M64 72 v18" />
  </Frame>
));

export const TripodHighIcon = withMemo((props: IconProps) => (
  <Frame
    id="tripod-high"
    title={props.title ?? "Pé de Galinha (alto)"}
    {...props}
  >
    <circle cx={64} cy={22} r={4} fill={`url(#tripod-high-metal)`} />
    <path d="M64 26 v60" />
    <path d="M64 86 l-24 16 M64 86 l24 16 M64 86 v18" />
  </Frame>
));

export const RibaltaIcon = withMemo((props: IconProps) => (
  <Frame id="ribalta" title={props.title ?? "Ribalta"} {...props}>
    <rect
      x={18}
      y={60}
      width={92}
      height={20}
      rx={4}
      fill={`url(#ribalta-metal)`}
    />
    {Array.from({ length: 8 }).map((_, i) => (
      <circle
        key={i}
        cx={22 + i * 12}
        cy={70}
        r={3}
        fill={`url(#ribalta-lens)`}
      />
    ))}
    <path d="M24 60 v-10 M48 60 v-10 M72 60 v-10 M96 60 v-10" />
  </Frame>
));

// =============== DEMOS RÁPIDOS ===============
// Exemplo de grid showcase (opcional)
export const LumiRiderIconShowcase: React.FC<{ size?: number | string }> = ({
  size = 64,
}) => {
  const items = [
    [FresnelIcon, "Fresnel"],
    [ElipsoidalIcon, "Elipsoidal"],
    [ParLedIcon, "PAR LED"],
    [Par64Icon, "PAR 64"],
    [SetLightIcon, "Set Light"],
    [FogMachineIcon, "Fog"],
    [LightingConsoleIcon, "Mesa"],
    [DimmerPackIcon, "Dimmer"],
    [varaIcon, "vara"],
    [TBarIcon, "T-Bar"],
    [TripodLowIcon, "Tripé Baixo"],
    [TripodHighIcon, "Tripé Alto"],
    [RibaltaIcon, "Ribalta"],
  ] as const;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {items.map(([C, label]) => (
        <div
          key={label}
          className="flex flex-col items-center rounded-2xl border border-zinc-200/70 dark:border-zinc-700/40 p-3"
        >
          <C size={size} className="text-zinc-700 dark:text-zinc-200" />
          <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

// =============== NOTAS ===============
// • Para otimizar ainda mais, converta para <symbol> e use via <use> se precisar de centenas de instâncias.
// • Para mapear canal/DMX no seu sistema, basta compor com um label/tooltip ao redor do ícone.
// • Se quiser versões "cheias" (filled), aplique fill="currentColor" em grupos específicos.
// • Para rotação/espelhamento use as props rotate/mirrored.

// usam SVG 128×128 com gradientes (metal + lente), soft shadow e detalhes sólidos;

// expõem props padrão (size, strokeWidth, rotate, mirrored, className);

// herdam cor via currentColor e aceitam CSS Variables para metal/vidro/LED/smoke (você estiliza no seu tema);

// são memoizados para render leve.

// Como usar no Next.js:

// import { FresnelIcon, ParLedIcon } from "@/components/lumirider-icons";

// export default function Toolbox() {
//   return (
//     <div className="flex gap-6 text-zinc-800">
//       <FresnelIcon size={72} />
//       <ParLedIcon size={72} className="text-slate-700" />
//     </div>
//   );
// }

// CSS (override de materiais):

// :root{
//   --lr-stroke:#2b2f33;
//   --lr-metal-light:#e6e9ef; --lr-metal-mid:#aab2bd; --lr-metal-dark:#6b7280;
//   --lr-lens-inner:#38bdf8; --lr-lens-outer:#7dd3fc;
//   --lr-smoke:#cbd5e1;
//   --lr-led-red:#ef4444; --lr-led-green:#22c55e; --lr-led-blue:#3b82f6;
// }

// Quer que eu avance com o restante da lista (PC, Bandôr/Refletor, Gelatinas, Ciclorama, Vara frontal/fixa/mecanizada, Série/Paralelo/Prolonga etc.) no mesmo padrão? Se sim, digo sim e eu já complemento no mesmo arquivo com +15–20 componentes e versões “filled” (mais sólidas) para quando você precisar de miniaturas bem legíveis.
