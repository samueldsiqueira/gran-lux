export interface Item {
  id: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  uid: string;
  universe: number;
  address: number;
  channels: number;
  number: number | null;
  groupId: string | null;
  connectedTo?: string | null;
  markerNumber?: number;
  color?: string;
  icon?: string;
  defaultMode?: string;
  powerW?: number;
  modes?: string[];
  componentIcon?: React.ComponentType<any> | null;
}
