
export interface PinConfig {
  id: number;
  name: string;
  type: string;
  na?: string;
  value?: string;
}

export interface VoltageConfig {
  vlow: number;
  vmin: number;
  vtyp: number;
  vmax: number;
  vhi: number;
}

export interface DPSConfig extends VoltageConfig {
  name: string;
}

export interface LevelConfig extends VoltageConfig {
  name: string;
}

export interface CycleTableEntry {
  tset: string;
  pset: string;
  fset: string;
}

export interface Triple {
  min: number;
  typ: number;
  max: number;
}

export interface PowerModeData {
  vdd: Triple;
  vpp: Triple;
  vih: Triple;
}

export interface MgnModeData {
  name: string;
  ptm: number;
  tas: number;
  tah: number;
  taa: number;
  period?: number;
  pinStatuses: { pin: string; status: string }[];
}

export interface FlowEntry {
  testName: string;
  passBranch: string;
  failBranch: string;
}

export interface FlowConfig {
  name: string;
  entries: FlowEntry[];
}

export interface AppState {
  socket: PinConfig[];
  pinGroups: { name: string; pins: string[] }[];
  tsets: { name: string; value: string }[];
  psets: { name: string; value: string }[];
  fsets: { name: string; value: string }[];
  variables: { name: string; value: string }[];
  cycleTable: CycleTableEntry[];
  tests: { name: string; type: 'read' | 'pgm'; data: string }[];
  flows: FlowConfig[];
  power: {
    read: PowerModeData;
    pgm: PowerModeData;
    mgnRead: PowerModeData;
    vt: {
      vcc0: number;
      vcc1: number;
      vpp0: number;
      vih: number;
    };
  };
  addressMapping: {
    x: { msb: string; lsb: string };
    y: { msb: string; lsb: string };
  };
  qData: { name: string; value: string }[];
  powerUpSequence: string[];
  readModeParams: {
    taa: number;
    period?: number;
    pinStatuses: { pin: string; status: string }[];
  };
  mgnReadData: MgnModeData[];
  periods: number[];
}
