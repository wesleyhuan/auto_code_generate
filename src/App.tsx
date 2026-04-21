/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  Upload, 
  FileCode, 
  Cpu, 
  Layers, 
  Settings, 
  Activity, 
  Variable, 
  Table, 
  Zap, 
  Download, 
  Plus, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, PinConfig, DPSConfig, LevelConfig, CycleTableEntry } from './types';

const DEFAULT_SOCKET: PinConfig[] = [
  { id: 1, name: 'DVDD', type: 'PWR_PIN', na: 'DPS', value: 'VCC1' },
  { id: 2, name: 'PRD', type: 'INPUT_PIN', na: 'NA', value: '24' },
  { id: 3, name: 'PPROG', type: 'INPUT_PIN', na: 'NA', value: '23' },
  { id: 4, name: 'PWE', type: 'INPUT_PIN', na: 'NA', value: '25' },
  { id: 5, name: 'REF_IN', type: 'IO_PIN', na: 'NA', value: '22' },
  { id: 6, name: 'PTM1', type: 'INPUT_PIN', na: 'NA', value: '26' },
  { id: 7, name: 'PTM0', type: 'INPUT_PIN', na: 'NA', value: '21' },
  { id: 8, name: 'PCLK', type: 'INPUT_PIN', na: 'NA', value: '27' },
  { id: 9, name: 'QPCLK', type: 'INPUT_PIN', na: 'NA', value: '20' },
  { id: 10, name: 'VPP', type: 'PWR_PIN', na: 'DPS', value: 'VPP0' },
  { id: 11, name: 'VSS', type: 'GND_PIN' },
  { id: 12, name: 'VDD', type: 'PWR_PIN', na: 'DPS', value: 'VCC0' },
  { id: 13, name: 'ENQLATCH', type: 'INPUT_PIN', na: 'NA', value: '18' },
  { id: 14, name: 'POEQ', type: 'INPUT_PIN', na: 'NA', value: '30' },
  { id: 15, name: 'PSCA', type: 'INPUT_PIN', na: 'NA', value: '17' },
  { id: 16, name: 'PA8', type: 'ADDR_PIN', na: 'X5', value: '31' },
  { id: 17, name: 'PA7', type: 'ADDR_PIN', na: 'X4', value: '16' },
  { id: 18, name: 'PA6', type: 'ADDR_PIN', na: 'X3', value: '32' },
  { id: 19, name: 'PSCE', type: 'INPUT_PIN', na: 'NA', value: '15' },
  { id: 20, name: 'BIAS_OUT', type: 'IO_PIN', na: 'NA', value: '33' },
  { id: 21, name: 'VPP_TK', type: 'INPUT_PIN', na: 'NA', value: '14' },
  { id: 22, name: 'VDD_TK', type: 'INPUT_PIN', na: 'NA', value: '34' },
  { id: 23, name: 'Q_monitor', type: 'INPUT_PIN', na: 'NA', value: '13' },
  { id: 24, name: 'PA5', type: 'ADDR_PIN', na: 'X2', value: '35' },
  { id: 25, name: 'PA4', type: 'ADDR_PIN', na: 'X1', value: '11' },
  { id: 26, name: 'PA3', type: 'ADDR_PIN', na: 'X0', value: '37' },
  { id: 27, name: 'PA2', type: 'ADDR_PIN', na: 'Y2', value: '10' },
  { id: 28, name: 'PA1', type: 'ADDR_PIN', na: 'Y1', value: '38' },
  { id: 29, name: 'PA0', type: 'ADDR_PIN', na: 'Y0', value: '9' },
  { id: 30, name: 'PDQ0', type: 'IO_PIN', na: 'IO0', value: '39' },
  { id: 31, name: 'RE_OUT', type: 'IO_PIN', na: 'NA', value: '8' },
  { id: 32, name: 'PDQ1', type: 'IO_PIN', na: 'IO1', value: '40' },
  { id: 33, name: 'CBIAS_VT', type: 'IO_PIN', na: 'NA', value: '7' },
  { id: 34, name: 'PDQ2', type: 'IO_PIN', na: 'IO2', value: '41' },
  { id: 35, name: 'CBIASMGN_VT', type: 'IO_PIN', na: 'NA', value: '6' },
  { id: 36, name: 'PDQ3', type: 'IO_PIN', na: 'IO3', value: '42' },
  { id: 37, name: 'COL_VT', type: 'IO_PIN', na: 'NA', value: '5' },
  { id: 38, name: 'PDQ4', type: 'IO_PIN', na: 'IO4', value: '43' },
  { id: 39, name: 'PRESET', type: 'INPUT_PIN', na: 'NA', value: '4' },
  { id: 40, name: 'PDQ5', type: 'IO_PIN', na: 'IO5', value: '44' },
  { id: 41, name: 'REF_OUT', type: 'IO_PIN', na: 'NA', value: '3' },
  { id: 42, name: 'PDQ6', type: 'IO_PIN', na: 'IO6', value: '45' },
  { id: 43, name: 'ROW_VT', type: 'IO_PIN', na: 'NA', value: '2' },
  { id: 44, name: 'PDQ7', type: 'IO_PIN', na: 'IO7', value: '46' },
  { id: 45, name: 'PREFVT', type: 'INPUT_PIN', na: 'NA', value: '1' },
  { id: 46, name: 'POE', type: 'INPUT_PIN', na: 'NA', value: '47' },
  { id: 47, name: 'PTM2', type: 'INPUT_PIN', na: 'NA', value: '0' },
  { id: 48, name: 'VSSTOP', type: 'GND_PIN' }
];

const DEFAULT_STATE: AppState = {
  socket: DEFAULT_SOCKET,
  pinGroups: [
    { name: 'ADDRESS', pins: DEFAULT_SOCKET.filter(p => p.name.toUpperCase().includes('PA')).map(p => p.name) },
    { name: 'DOUT', pins: DEFAULT_SOCKET.filter(p => p.name.toUpperCase().includes('PDOUT') || p.name.toUpperCase().includes('PDQ')).map(p => p.name) },
    { name: 'CTL_PIN', pins: DEFAULT_SOCKET.filter(p => {
      const name = p.name.toUpperCase();
      const pwrPins = ['VDD', 'DVDD', 'VDD2', 'DVDD2', 'VPP'];
      const gndPins = ['VSS', 'VSS2', 'VSSTOP'];
      return !name.includes('PA') && !name.includes('PDOUT') && !name.includes('PDQ') && !name.includes('NC') && !pwrPins.includes(name) && !gndPins.some(g => name.startsWith(g));
    }).map(p => p.name) },
    { name: 'CTL_PIN1', pins: DEFAULT_SOCKET.filter(p => {
      const name = p.name.toUpperCase();
      const pwrPins = ['VDD', 'DVDD', 'VDD2', 'DVDD2', 'VPP'];
      const gndPins = ['VSS', 'VSS2', 'VSSTOP'];
      return !name.includes('PA') && !name.includes('PDOUT') && !name.includes('PDQ') && !name.includes('NC') && !pwrPins.includes(name) && !gndPins.some(g => name.startsWith(g)) && !name.includes('PTM');
    }).map(p => p.name) },
    { name: 'NC_PIN', pins: DEFAULT_SOCKET.filter(p => p.name.toUpperCase().includes('NC')).map(p => p.name) },
    { name: 'INPUTS', pins: ['ADDRESS', 'CTL_PIN'] },
    { name: 'INPUTS1', pins: ['ADDRESS', 'CTL_PIN1'] },
    { name: 'ALL_IO', pins: ['DOUT'] },
    { name: 'ALL_OS', pins: ['ALL_IO', 'INPUTS'] },
    { name: 'ALL_PIN', pins: ['ALL_OS', 'NC_PIN'] }
  ],
  tsets: [{ name: 'TSET1', value: '100ns' }],
  psets: [{ name: 'PSET1', value: '1' }],
  fsets: [{ name: 'FSET1', value: '1' }],
  variables: [{ name: 'TIMEOUT', value: '1000' }],
  cycleTable: [{ tset: 'TSET1', pset: 'PSET1', fset: 'FSET1' }],
  tests: [
    { 
      name: 'readff_chip_vmin_test', 
      type: 'read', 
      data: `TEST readff_chip_vmin_test ={
    TESTNO = 5510;
    DESC = "Read chip";
    SEQUENCE={
        read_vccmin_dps,
        read_vmin_lev,
        vcc_seq,
        cycle_table_read,
        ECR_CLR(PG2,ALL),
        Q_set_pat,
        PG_RUN,
        PG_STOP,
        readff_all_pat,
        PG_RUN,
        PG_STOP,
        reconnect_io_seq
    };
ON_FAIL={reconnect_io_seq};
};`
    },
    { 
      name: 'readff_chip_vtyp_test', 
      type: 'read', 
      data: `TEST readff_chip_vtyp_test ={
    TESTNO = 5520;
    DESC = "Read chip";
    SEQUENCE={
        read_vcctyp_dps,
        read_vtyp_lev,
        vcc_seq,
        cycle_table_read,
        ECR_CLR(PG2,ALL),
        Q_set_pat,
        PG_RUN,
        PG_STOP,
        readff_all_pat,
        PG_RUN,
        PG_STOP,
        reconnect_io_seq
    };
ON_FAIL={reconnect_io_seq};
};`
    },
    { 
      name: 'readff_chip_vmax_test', 
      type: 'read', 
      data: `TEST readff_chip_vmax_test ={
    TESTNO = 5530;
    DESC = "Read chip";
    SEQUENCE={
        read_vccmax_dps,
        read_vmax_lev,
        vcc_seq,
        cycle_table_read,
        ECR_CLR(PG2,ALL),
        Q_set_pat,
        PG_RUN,
        PG_STOP,
        readff_all_pat,
        PG_RUN,
        PG_STOP,
        reconnect_io_seq
    };
ON_FAIL={reconnect_io_seq};
};`
    }
  ],
  flows: [
    {
      name: 'DC_flow',
      entries: [
        { testName: 'vcc_open_short_test', passBranch: 'continuit_test', failBranch: 'Bin5' },
        { testName: 'continuit_test', passBranch: 'InputLeakageHigh', failBranch: 'Bin6' },
        { testName: 'InputLeakageHigh', passBranch: 'InputLeakageLow', failBranch: 'Bin7' },
        { testName: 'InputLeakageLow', passBranch: 'OutputLeakageHigh', failBranch: 'Bin8' },
        { testName: 'OutputLeakageHigh', passBranch: 'OutputLeakageLow', failBranch: 'Bin9' },
        { testName: 'OutputLeakageLow', passBranch: 'readff_chip_vmin_test', failBranch: 'Bin10' },
        { testName: 'readff_chip_vmin_test', passBranch: 'readff_chip_vtyp_test', failBranch: 'Bin20' },
        { testName: 'readff_chip_vtyp_test', passBranch: 'readff_chip_vmax_test', failBranch: 'Bin30' },
        { testName: 'readff_chip_vmax_test', passBranch: 'Bin1', failBranch: 'Bin51' }
      ]
    }
  ],
  power: {
    read: {
      vdd: { min: 2.0, typ: 5.0, max: 5.5 },
      vpp: { min: 2.0, typ: 5.0, max: 5.5 },
      vih: { min: 2.0, typ: 5.0, max: 5.5 }
    },
    pgm: {
      vdd: { min: 2.0, typ: 5.0, max: 5.5 },
      vpp: { min: 7.25, typ: 7.5, max: 7.75 },
      vih: { min: 2.0, typ: 5.0, max: 5.5 }
    },
    mgnRead: {
      vdd: { min: 4.75, typ: 5.0, max: 5.25 },
      vpp: { min: 4.75, typ: 5.0, max: 5.25 },
      vih: { min: 4.75, typ: 5.0, max: 5.25 }
    },
    vt: {
      vcc0: 2.5,
      vcc1: 2.5,
      vpp0: 2.5,
      vih: 2.5
    }
  },
  addressMapping: {
    x: { msb: 'PA8', lsb: 'PA3' },
    y: { msb: 'PA2', lsb: 'PA0' }
  },
  qData: Array(16).fill(0).map((_, i) => ({ name: `Qdata${i}`, value: '00' })),
  powerUpSequence: ['DVDD', 'VDD', 'VPP'],
  readModeParams: {
    taa: 200,
    period: 5000,
    pinStatuses: [
      { pin: 'PRD', status: 'H/L' },
      { pin: 'PCLK', status: 'H/L' },
      { pin: 'POETOP', status: 'H/L' },
      { pin: 'CBIAS_VT', status: 'H' },
      { pin: 'CBIASMGN_VT', status: 'H' },
    ]
  },
  mgnReadData: [],
  periods: [20, 50, 70, 80, 100, 113, 150, 200, 213, 220, 250, 300, 400, 413, 450, 500, 1000, 1013, 2000, 3000, 4000, 5000, 6000, 10000, 50000]
};

export default function App() {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<keyof AppState | 'preview' | 'sequences' | 'flows' | 'setQPreview'>('socket');
  const [activeTableSet, setActiveTableSet] = useState<'read' | 'normal'>('read');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getBitRange = (msb: string, lsb: string) => {
    const m = parseInt(msb.match(/\d+/)?.[0] || '0');
    const l = parseInt(lsb.match(/\d+/)?.[0] || '0');
    const bits = Math.abs(m - l) + 1;
    return `0x${((1 << bits) - 1).toString(16)}`;
  };

  const getPsetName = (period: number) => {
    if (period % 1000 === 0) {
      const us = period / 1000;
      return `p${us}us_pset`;
    }
    return `p${period}ns_pset`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toNum = (v: any) => {
      if (v === null || v === undefined || v === '') return undefined;
      const n = typeof v === 'number' ? v : parseFloat(String(v));
      return Number.isFinite(n) ? n : undefined;
    };

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      
      let newSocket = [...state.socket];
      let newPower = JSON.parse(JSON.stringify(state.power));
      let newMapping = { ...state.addressMapping };
      let newQData = [...state.qData];
      let newReadModeParams = { ...state.readModeParams };
      let newPowerUpSequence = [...state.powerUpSequence];
      let newTests = [...state.tests];
      let newVariables = [...state.variables];
      let newMgnReadData = [...state.mgnReadData];
      let newPeriods = [...state.periods];

      // Process Power Up Sheet
      const powerUpWs = wb.Sheets['power up'];
      if (powerUpWs) {
        const raw = XLSX.utils.sheet_to_json(powerUpWs, { header: 1 }) as any[][];
        // Look for row with 1, 2, 3... and the row below it
        for (let r = 0; r < raw.length; r++) {
          const row = raw[r] || [];
          if (row.some(c => String(c) === '1')) {
            const seqRow = raw[r + 1] || [];
            const seq: string[] = [];
            for (let c = 0; c < seqRow.length; c++) {
              const val = String(seqRow[c] || '').trim().toUpperCase();
              if (val) seq.push(val);
            }
            if (seq.length > 0) newPowerUpSequence = seq;
            break;
          }
        }
      }

      // Process Read Mode Sheet
      const readModeWs = wb.Sheets['read mode'];
      if (readModeWs) {
        const raw = XLSX.utils.sheet_to_json(readModeWs, { header: 1 }) as any[][];
        let taa = 200;
        let period = 5000;
        let pinStatuses: { pin: string; status: string }[] = [];

        for (let r = 0; r < raw.length; r++) {
          const row = raw[r] || [];
          for (let c = 0; c < row.length; c++) {
            const cell = String(row[c] || '').trim();
            if (cell.toUpperCase() === 'TAA') {
              const val = row[c+1];
              taa = parseInt(String(val)) || 200;
            }
            if (cell.toUpperCase() === 'PERIOD') {
              const val = String(row[c+1] || '').trim();
              period = parseInt(val.replace(/ns/i, '')) || 5000;
            }
            if (cell === 'H/L' || cell === 'H' || cell === 'L') {
              const pin = String(row[c+1] || '').trim();
              if (pin) pinStatuses.push({ pin, status: cell });
            }
          }
        }
        if (pinStatuses.length > 0) {
          newReadModeParams = { taa, period, pinStatuses };
        } else {
          newReadModeParams.taa = taa;
          newReadModeParams.period = period;
        }
      }

      // Process mgn read Sheet
      const mgnReadWs = wb.Sheets['mgn read'];
      if (mgnReadWs) {
        const raw = XLSX.utils.sheet_to_json(mgnReadWs, { header: 1 }) as any[][];
        const modes: any[] = [];
        
        // Find mode blocks (OFFMGN, MGN1, MGN2)
        for (let r = 0; r < raw.length; r++) {
          const row = raw[r] || [];
          for (let c = 0; c < row.length; c++) {
            const cell = String(row[c] || '').trim().toUpperCase();
            if (cell === 'OFFMGN' || cell === 'MGN1' || cell === 'MGN2') {
              const modeName = cell;
              let ptm = 0, tas = 0, tah = 0, taa = 0, period = 5000;
              const pinStatuses: { pin: string; status: string }[] = [];

              // Look for PTM, Tas, Tah, Taa, Period below the name
              for (let i = 1; i <= 6; i++) {
                const nextRow = raw[r + i] || [];
                const label = String(nextRow[c] || '').trim().toUpperCase();
                const val = nextRow[c + 1];
                if (label === 'PTM') ptm = parseInt(String(val)) || 0;
                if (label === 'TAS') tas = parseInt(String(val)) || 0;
                if (label === 'TAH') tah = parseInt(String(val)) || 0;
                if (label === 'TAA') taa = parseInt(String(val)) || 0;
                if (label === 'PERIOD') {
                  const pVal = String(val || '').trim();
                  period = parseInt(pVal.replace(/ns/i, '')) || 5000;
                }
              }

              // Look for Pin Status tables next to the block
              // The image shows Status/Pin table at c+3 and c+4
              // And another at c+7 and c+8
              for (let i = 0; i < 10; i++) {
                const checkRow = raw[r + i] || [];
                // Table 1
                const status1 = String(checkRow[c + 3] || '').trim();
                const pin1 = String(checkRow[c + 4] || '').trim();
                if ((status1 === 'H/L' || status1 === 'H' || status1 === 'L') && pin1 && pin1 !== 'Pin') {
                  pinStatuses.push({ pin: pin1, status: status1 });
                }
                // Table 2
                const status2 = String(checkRow[c + 7] || '').trim();
                const pin2 = String(checkRow[c + 8] || '').trim();
                if ((status2 === 'H/L' || status2 === 'H' || status2 === 'L') && pin2 && pin2 !== 'Pin') {
                  pinStatuses.push({ pin: pin2, status: status2 });
                }
              }

              modes.push({ name: modeName, ptm, tas, tah, taa, period, pinStatuses });
            }
          }
        }
        if (modes.length > 0) newMgnReadData = modes;
      }

      // Process period Sheet
      const periodWs = wb.Sheets['period'];
      if (periodWs) {
        const raw = XLSX.utils.sheet_to_json(periodWs, { header: 1 }) as any[][];
        const extractedPeriods: number[] = [];
        for (let r = 0; r < raw.length; r++) {
          const row = raw[r] || [];
          const val = toNum(row[0]);
          if (val !== undefined && !isNaN(val)) {
            extractedPeriods.push(val);
          }
        }
        if (extractedPeriods.length > 0) {
          newPeriods = Array.from(new Set(extractedPeriods)).sort((a, b) => a - b);
        }
      }

      // Process Q option Sheet
      const qWs = wb.Sheets['Q option'];
      if (qWs) {
        const qDataRaw = XLSX.utils.sheet_to_json(qWs, { header: 1 }) as any[][];
        const extractedQData: { name: string; value: string }[] = [];
        
        let currentVarName = '';
        let currentByteVal = 0;
        let bitInByteCount = 0;

        for (let r = 0; r < qDataRaw.length; r++) {
          const row = qDataRaw[r] || [];
          const varNameCell = String(row[0] || '').trim();
          const bitNameCell = String(row[1] || '').trim();
          const valueCell = String(row[2] || '').trim().toUpperCase();

          if (varNameCell) {
            // If we have a previous variable that wasn't finished (e.g. fewer than 8 bits)
            if (currentVarName && bitInByteCount > 0) {
              extractedQData.push({
                name: currentVarName,
                value: currentByteVal.toString(16).padStart(2, '0').toUpperCase()
              });
            }
            currentVarName = varNameCell;
            currentByteVal = 0;
            bitInByteCount = 0;
          }

          if (bitNameCell.match(/Q<\d+>/i)) {
            const bit = valueCell === 'VDD' ? 1 : 0;
            // The first bit in the group is MSB (bit 7)
            currentByteVal = (currentByteVal << 1) | bit;
            bitInByteCount++;
            
            if (bitInByteCount === 8) {
              extractedQData.push({
                name: currentVarName,
                value: currentByteVal.toString(16).padStart(2, '0').toUpperCase()
              });
              bitInByteCount = 0;
              currentVarName = ''; // Reset so we don't push it again if next row has a varName
            }
          }
        }
        
        // Push last one if loop ended and we have data
        if (currentVarName && bitInByteCount > 0) {
          extractedQData.push({
            name: currentVarName,
            value: currentByteVal.toString(16).padStart(2, '0').toUpperCase()
          });
        }

        if (extractedQData.length > 0) {
          newQData = extractedQData;
        }
      }

      // Process Socket Sheet
      const socketWs = wb.Sheets['socket'] || wb.Sheets[wb.SheetNames[0]];
      if (socketWs) {
        const socketData = XLSX.utils.sheet_to_json(socketWs, { header: 1 }) as any[][];
        
        // Find X/Y mapping and Pin Names
        socketData.forEach((row, rowIndex) => {
          if (!row || row.length === 0) return;

          const firstCell = row[0]?.toString().trim().toUpperCase();
          
          // X/Y Mapping detection
          if (firstCell === 'X') {
            newMapping.x = { msb: row[1]?.toString() || 'PA8', lsb: row[2]?.toString() || 'PA3' };
          } else if (firstCell === 'Y') {
            newMapping.y = { msb: row[1]?.toString() || 'PA2', lsb: row[2]?.toString() || 'PA0' };
          }

          // Pin Name Layout detection (Heuristic based on provided snippet)
          // Look for rows that look like pin name lists (many strings, some with < >)
          const isPinRow = row.filter(cell => cell && typeof cell === 'string' && (cell.includes('<') || cell.length > 2)).length > 10;
          
          if (isPinRow) {
            // Check if previous or next row contains DP numbers to identify which range this is
            const prevRow = socketData[rowIndex - 1];
            const nextRow = socketData[rowIndex + 1];
            
            const findDPNumbers = (r: any[]) => r?.filter(c => typeof c === 'number' || (!isNaN(parseInt(c)) && parseInt(c) > 0));
            const dpNumsPrev = findDPNumbers(prevRow);
            const dpNumsNext = findDPNumbers(nextRow);

            if (dpNumsPrev && dpNumsPrev.length > 10) {
              // This row corresponds to DP numbers in prevRow
              dpNumsPrev.forEach((dp, colIndex) => {
                const dpNum = parseInt(dp.toString());
                if (dpNum >= 1 && dpNum <= 48) {
                  const pinNameRaw = row[colIndex]?.toString().replace(/<|>/g, '') || '';
                  const pinName = pinNameRaw.toUpperCase() === 'RESET' ? 'PRESET' : pinNameRaw;
                  if (pinName) newSocket[dpNum - 1] = { ...newSocket[dpNum - 1], name: pinName };
                }
              });
            } else if (dpNumsNext && dpNumsNext.length > 10) {
              // This row corresponds to DP numbers in nextRow
              dpNumsNext.forEach((dp, colIndex) => {
                const dpNum = parseInt(dp.toString());
                if (dpNum >= 1 && dpNum <= 48) {
                  const pinNameRaw = row[colIndex]?.toString().replace(/<|>/g, '') || '';
                  const pinName = pinNameRaw.toUpperCase() === 'RESET' ? 'PRESET' : pinNameRaw;
                  if (pinName) newSocket[dpNum - 1] = { ...newSocket[dpNum - 1], name: pinName };
                }
              });
            }
          }
        });
      }

      // Process Power Sheet
      const powerWs = wb.Sheets['power'];
      const normalize = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');

      if (powerWs) {
        const raw = XLSX.utils.sheet_to_json(powerWs, { header: 1 }) as any[][];
        const topHeaderIdx = raw.findIndex(row => row.some(c => {
          const s = String(c ?? '').toLowerCase();
          return s.includes('read') || s.includes('program') || s.includes('mgn read');
        }));

        if (topHeaderIdx >= 0) {
          const subHeaderIdx = topHeaderIdx + 1;
          const top = raw[topHeaderIdx].map(c => String(c ?? ''));
          const sub = raw[subHeaderIdx].map(c => String(c ?? ''));

          let currentTop = '';
          const filledTop = top.map(t => {
            if (t.trim()) currentTop = normalize(t);
            return currentTop;
          });

          const cols: { idx: number; group: string; leaf: string }[] = [];
          for (let i = 0; i < Math.max(filledTop.length, sub.length); i++) {
            const g = filledTop[i] || '';
            const l = normalize(sub[i] || '');
            if (l === 'pin') {
              cols.push({ idx: i, group: '', leaf: 'pin' });
            } else if (['read', 'program', 'mgn read', 'vt'].includes(g)) {
              if (['min', 'typ', 'max', '0'].includes(l)) {
                cols.push({ idx: i, group: g, leaf: l });
              }
            }
          }

          for (let r = subHeaderIdx + 1; r < raw.length; r++) {
            const row = raw[r] || [];
            const pinCol = cols.find(c => c.leaf === 'pin');
            const pin = String(pinCol ? row[pinCol.idx] : '').toUpperCase().trim();
            if (!pin) continue;

            for (const c of cols) {
              const val = toNum(row[c.idx]);
              if (val === undefined) continue;

              const mode = c.group === 'read' ? 'read' :
                           c.group === 'program' ? 'pgm' :
                           c.group === 'mgn read' ? 'mgnRead' :
                           c.group === 'vt' ? 'vt' : null;

              if (!mode) continue;

              if (mode === 'vt') {
                if (pin === 'VCC0') newPower.vt.vcc0 = val;
                if (pin === 'VCC1') newPower.vt.vcc1 = val;
                if (pin === 'VPP0') newPower.vt.vpp0 = val;
                if (pin === 'VIH') newPower.vt.vih = val;
              } else {
                const targetMode = newPower[mode as 'read' | 'pgm' | 'mgnRead'];
                const leaf = c.leaf as 'min' | 'typ' | 'max';
                if (pin === 'VCC0' || pin === 'VCC1') targetMode.vdd[leaf] = val;
                if (pin === 'VPP0') targetMode.vpp[leaf] = val;
                if (pin === 'VIH') targetMode.vih[leaf] = val;
              }
            }
          }
        }
      }

      // Apply Mapping Rules to Socket
      newSocket = newSocket.map(pin => {
        let type = pin.type;
        let na = pin.na;
        const name = pin.name.toUpperCase();

        if (['DVDD', 'VDD', 'VPP', 'VDD2', 'DVDD2', 'VCC0', 'VCC1'].includes(name)) {
          type = 'PWR_PIN';
        } else if (name.includes('PDQ')) {
          type = 'IO_PIN';
        } else if (name.includes('PA')) {
          type = 'ADDR_PIN';
          
          const pinNumMatch = pin.name.match(/\d+/);
          if (pinNumMatch) {
            const pinNum = parseInt(pinNumMatch[0]);
            const xLsbNum = parseInt(newMapping.x.lsb.match(/\d+/)?.[0] || '3');
            const xMsbNum = parseInt(newMapping.x.msb.match(/\d+/)?.[0] || '8');
            const yLsbNum = parseInt(newMapping.y.lsb.match(/\d+/)?.[0] || '0');
            const yMsbNum = parseInt(newMapping.y.msb.match(/\d+/)?.[0] || '2');

            if (pinNum >= xLsbNum && pinNum <= xMsbNum) {
              na = `X${pinNum - xLsbNum}`;
            } else if (pinNum >= yLsbNum && pinNum <= yMsbNum) {
              na = `Y${pinNum - yLsbNum}`;
            }
          }
        } else if (name.includes('VSS') || name.includes('GND')) {
          type = 'GND_PIN';
          na = 'NA';
          pin.value = '0';
        }
        return { ...pin, type, na };
      });

      // Regenerate standard pin groups based on new socket
      const addressPins = newSocket.filter(p => p.name.toUpperCase().includes('PA')).map(p => p.name);
      const doutPins = newSocket.filter(p => p.name.toUpperCase().includes('PDOUT') || p.name.toUpperCase().includes('PDQ')).map(p => p.name);
      const ncPins = newSocket.filter(p => p.name.toUpperCase().includes('NC')).map(p => p.name);
      const pwrPins = ['VDD', 'DVDD', 'VDD2', 'DVDD2', 'VPP'];
      const gndPins = ['VSS', 'VSS2', 'VSSTOP'];
      const ctlPins = newSocket.filter(p => {
        const name = p.name.toUpperCase();
        if (!name) return false;
        const isAddress = name.includes('PA');
        const isDout = name.includes('PDOUT') || name.includes('PDQ');
        const isNc = name.includes('NC');
        const isPwr = pwrPins.some(pwr => name === pwr);
        const isGnd = gndPins.some(gnd => name === gnd || name.startsWith(gnd));
        return !isAddress && !isDout && !isNc && !isPwr && !isGnd;
      }).map(p => p.name);

      const ctlPins1 = ctlPins.filter(p => !p.toUpperCase().includes('PTM'));

      const standardGroups = [
        { name: 'ADDRESS', pins: addressPins },
        { name: 'DOUT', pins: doutPins },
        { name: 'CTL_PIN', pins: ctlPins },
        { name: 'CTL_PIN1', pins: ctlPins1 },
        { name: 'NC_PIN', pins: ncPins },
        { name: 'INPUTS', pins: ['ADDRESS', 'CTL_PIN'] },
        { name: 'INPUTS1', pins: ['ADDRESS', 'CTL_PIN1'] },
        { name: 'ALL_IO', pins: ['DOUT'] },
        { name: 'ALL_OS', pins: ['ALL_IO', 'INPUTS'] },
        { name: 'ALL_PIN', pins: ['ALL_OS', 'NC_PIN'] },
      ];

      // Regenerate tests based on new power data
      const genFullTest = (name: string, testNo: number, dps: string, lev: string) => `TEST ${name} ={
    TESTNO = ${testNo};
    DESC = "Read chip";
    SEQUENCE={
        ${dps},
        ${lev},
        vcc_seq,
        cycle_table_read,
        ECR_CLR(PG2,ALL),
        Q_set_pat,
        PG_RUN,
        PG_STOP,
        readff_all_pat,
        PG_RUN,
        PG_STOP,
        reconnect_io_seq
    };
ON_FAIL={reconnect_io_seq};
};`;

      newTests = [
        { name: 'readff_chip_vmin_test', type: 'read', data: genFullTest('readff_chip_vmin_test', 5510, 'read_vccmin_dps', 'read_vmin_lev') },
        { name: 'readff_chip_vtyp_test', type: 'read', data: genFullTest('readff_chip_vtyp_test', 5520, 'read_vcctyp_dps', 'read_vtyp_lev') },
        { name: 'readff_chip_vmax_test', type: 'read', data: genFullTest('readff_chip_vmax_test', 5530, 'read_vccmax_dps', 'read_vmax_lev') },
      ];

      // Reset variables to default or update them
      newVariables = [
        { name: 'VCC_MIN', value: `${newPower.read.vdd.min}V` },
        { name: 'VCC_TYP', value: `${newPower.read.vdd.typ}V` },
        { name: 'VCC_MAX', value: `${newPower.read.vdd.max}V` },
      ];

      setState(prev => ({ 
        ...prev, 
        socket: newSocket, 
        pinGroups: standardGroups, 
        power: newPower, 
        addressMapping: newMapping,
        qData: newQData,
        powerUpSequence: newPowerUpSequence,
        readModeParams: newReadModeParams,
        mgnReadData: newMgnReadData,
        periods: newPeriods,
        tests: newTests,
        variables: newVariables
      }));
      // Clear file input to allow re-upload of same file
      if (e.target) e.target.value = '';
    };
    reader.readAsBinaryString(file);
  };

  const generateCode = () => {
    let code = '/* Generated Test Program */\n\n';

    // generate Socket
    // Socket
    code += '#ifdef Wafer\n';
    code += 'SOCKET single = {\n';
    state.socket.forEach(pin => {
      let line = `\t\tDP${pin.id} =	${pin.name},\t\t${pin.type}`;
      if (pin.type !== 'GND_PIN') {
        line += `,\t\t${pin.na || 'NA'},\t\t${pin.value || '0'}`;
      }
      code += `${line}${pin.id === 48 ? ';' : ';'}\n`;
    });
    code += '};\n';
    code += '#endif Wafer\n\n';

    const genSocket = (label: string, values: (string | number | undefined)[]) => {
      let s = `#ifdef ${label}\n`;
      s += 'SOCKET single = {\n';
      state.socket.forEach((pin, idx) => {
        let line = `\t\tDP${pin.id} =	${pin.name},\t\t${pin.type}`;
        if (pin.type !== 'GND_PIN') {
          const val = values[idx] !== undefined ? values[idx] : (pin.value || '0');
          line += `,\t\t${pin.na || 'NA'},\t\t${val}`;
        }
        s += `${line};\n`;
      });
      s += '};\n';
      s += `#endif ${label}\n\n`;
      return s;
    };

    const pk2Values = ['VCC1', '12', '9', '8', '7', '6', '3', '2', '5', 'VPP0', undefined, 'VCC0', '42', '43', '46', '47', '44', '45', '40', '41', '38', '39', '36', '37', '34', '35', '32', '33', '30', '31', '26', '27', '28', '29', '24', '25', '19', '18', '23', '22', '21', '20', '17', '16', '15', '14', '11', undefined];
    const pk1Values = ['VCC1', '37', '38', '39', '40', '41', '42', '43', '44', 'VPP0', undefined, 'VCC0', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', undefined];

    code += genSocket('PK2', pk2Values);
    code += genSocket('PK1', pk1Values);
    code += genSocket('QFP', pk2Values);
    
    // generate Variables
    // Variables
    const maxX = getBitRange(state.addressMapping.x.msb, state.addressMapping.x.lsb);
    const maxY = getBitRange(state.addressMapping.y.msb, state.addressMapping.y.lsb);

    code += `VARIABLE MAX_X = ${maxX};\n`;
    code += `VARIABLE MAX_Y = ${maxY};\n`;
    code += `VARIABLE FIX_X = 0x0;\n`;
    code += `VARIABLE FIX_Y = 0x0;\n\n`;
    code += `VARIABLE ADDR_X = 0x00;\n`;
    code += `VARIABLE ADDR_Y = 0x00;\n\n`;

    const powerModes = [
      { key: 'read', suffix: 'READ' },
      { key: 'pgm', suffix: 'PGM' },
      { key: 'mgnRead', suffix: 'MGNREAD' }
    ] as const;

    // DPSSET Generation Helper
    const genDPSSET = (modePrefix: string, suffix: string, vddVar: string, vppVar: string) => {
      let dps = `DPSSET ${modePrefix}_vcc${suffix}_dps = {\n`;
      dps += `	VCC0 = {MAIN = ${vddVar} ;\n`;
      dps += '		ULIMIT= 200mA;\n';
      dps += '		LLIMIT= IGNORE;\n';
      dps += '		BYPASS = OFF;\n';
      dps += '		CLAMP  = 500mA;};\n';
      dps += `	VCC1 = {MAIN = ${vddVar} ;\n`;
      dps += '		ULIMIT= 200mA;\n';
      dps += '		LLIMIT= IGNORE;\n';
      dps += '		BYPASS = OFF;\n';
      dps += '		CLAMP  = 500mA;};\n';
      dps += `	VPP0 = {MAIN = ${vppVar} ;\n`;
      dps += `		ALT  = ${vppVar} ;\n`;
      dps += '		ULIMIT= 10mA;\n';
      dps += '		LLIMIT= IGNORE;\n';
      dps += '		BYPASS = OFF;\n';
      dps += '		CLAMP  = 50mA;};\n';
      dps += '};\n\n';
      return dps;
    };

    // LEVELS Generation Helper
    const genLEVELS = (modePrefix: string, suffix: string, vihVar: string) => {
      let lev = `LEVELS ${modePrefix}_v${suffix}_lev={\n`;
      lev += '	ALL_PIN = {\n';
      lev += `		VIH = ${vihVar} ;\n`;
      lev += '		VIL = 0.0V;\n';
      lev += `		VOH = ${vihVar} /2+0.1;\n`;
      lev += `		VOL = ${vihVar} /2-0.1;\n`;
      lev += `		VTH = ${vihVar} /2;\n`;
      lev += '		IOH=-10uA;\n';
      lev += '		IOL=10uA;\n';
      lev += '		};\n';
      lev += '	};\n\n';
      return lev;
    };

    powerModes.forEach(m => {
      const data = state.power[m.key];
      code += `VARIABLE VDDMIN_${m.suffix} = ${data.vdd.min}V;\n`;
      code += `VARIABLE VDDTYP_${m.suffix} = ${data.vdd.typ}V;\n`;
      code += `VARIABLE VDDMAX_${m.suffix} = ${data.vdd.max}V;\n`;
      code += `VARIABLE VPPMIN_${m.suffix} = ${data.vpp.min}V;\n`;
      code += `VARIABLE VPPTYP_${m.suffix} = ${data.vpp.typ}V;\n`;
      code += `VARIABLE VPPMAX_${m.suffix} = ${data.vpp.max}V;\n\n`;
    });

    powerModes.forEach(m => {
      const data = state.power[m.key];
      code += `VARIABLE VIHMIN_${m.suffix} = ${data.vih.min}V;\n`;
      code += `VARIABLE VIHTYP_${m.suffix} = ${data.vih.typ}V;\n`;
      code += `VARIABLE VIHMAX_${m.suffix} = ${data.vih.max}V;\n`;
    });
    code += '\n';

    state.qData.forEach((entry) => {
      code += `VARIABLE ${entry.name} = 0x${entry.value};\n`;
    });
    code += '\n';

    state.variables.forEach(v => {
      if (v.name && v.value) {
        code += `VARIABLE ${v.name} = ${v.value};\n`;
      }
    });
    code += '\n';

    // generate Pin Groups
    // Pin Groups
    state.pinGroups.forEach(group => {
      if (group.name === 'NC_PIN' && group.pins.length === 0) return;
      code += `PINGROUP ${group.name} = {${group.pins.join(',')}};\n`;
    });
    code += '\n';
    
    // generate DPS
    // 0V DPS and zero_lev
    const gen0VDPS = (dps: string) => {
      let dpsCode = `DPSSET ${dps.toLowerCase()}_0v_dps = {\n`;
      dpsCode += `	${dps} = {MAIN = 0.0V ;\n`;
      dpsCode += '		ULIMIT= 200mA;\n';
      dpsCode += '		LLIMIT= IGNORE;\n';
      dpsCode += '		BYPASS = OFF;\n';
      dpsCode += '		CLAMP  = 500mA;};\n';
      dpsCode += '};\n\n';
      return dpsCode;
    };

    const dpsList = ['VCC0', 'VCC1', 'VPP0', 'VPP1'];
    dpsList.forEach(dps => {
      if (state.socket.some(p => p.value === dps)) {
        code += gen0VDPS(dps);
      }
    });

    powerModes.forEach(m => {
      const prefix = m.key.toLowerCase();
      code += genDPSSET(prefix, 'min', `VDDMIN_${m.suffix}`, `VPPMIN_${m.suffix}`);
      code += genDPSSET(prefix, 'typ', `VDDTYP_${m.suffix}`, `VPPTYP_${m.suffix}`);
      code += genDPSSET(prefix, 'max', `VDDMAX_${m.suffix}`, `VPPMAX_${m.suffix}`);
    });

    powerModes.forEach(m => {
      const prefix = m.key.toLowerCase();
      code += genLEVELS(prefix, 'min', `VIHMIN_${m.suffix}`);
      code += genLEVELS(prefix, 'typ', `VIHTYP_${m.suffix}`);
      code += genLEVELS(prefix, 'max', `VIHMAX_${m.suffix}`);
    });

    code += `DPSSET vcc_0v_dps = {
       VCC0 = {MAIN = 0.0V;
               ULIMIT = 10.0mA;
               LLIMIT= -10.0mA;
               CLAMP  = 100mA;
               };
       VCC1 = {MAIN = 0.0V;
               ULIMIT = 10.0mA;
               CLAMP  = 100mA;
               };
       VPP0 = {MAIN = 0.0V;
               ULIMIT = 10.0mA;
               CLAMP  = 10mA;
               };
               };\n\n`;

    code += `LEVELS continuity_lev={
        ALL_PIN ={
		 VIH = 0.0V;  
                 VIL = 0.0V;
		 VTH = 0.0V;
                 IOH=-10uA;
                 IOL=10uA;
                };       
                };\n\n`;

    // generate LEVELS
    // LEVELS zero_lev
    code += 'LEVELS zero_lev={\n	ALL_PIN = {\n		VIH = 0.0V ;\n		VIL = 0.0V;\n		VOH = 0.0V;\n		VOL = 0.0V;\n		VTH = 0.0V;\n		IOH=-10uA;\n		IOL=10uA;\n		};\n	};\n\n';

    // TSET, PSET, FSET, CYCLE_TABLE
    const allDefinedPins = new Set(state.socket.map(p => p.name.toUpperCase()));
    const allDefinedGroups = new Set([
      'ADDRESS', 'DOUT', 'CTL_PIN', 'NC_PIN', 'INPUTS', 'ALL_IO', 'ALL_OS', 'ALL_PIN',
      ...state.pinGroups.map(g => g.name.toUpperCase())
    ]);
    const isDefined = (name: string) => allDefinedPins.has(name.toUpperCase()) || allDefinedGroups.has(name.toUpperCase());

    const checkPin = (p: string) => {
      if (!isDefined(p)) return `            // ERROR: ${p} not defined in SOCKET or PINGROUP\n`;
      return '';
    };

    // generate TSET
    // TSET
    code += 'TSET_TABLE time_table_read = {\n';
    
    code += '    TSET read_init_Q_tset =   {\n';
    code += '        DESC=   "read_init_tset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'DOUT', 'PRESET', 'ENQLATCH', 'QPCLK'].forEach(p => {
      code += checkPin(p);
      code += `            ${p}	= {T1=10ns;T2=1900ns;};\n`;
    });
    code += '            };\n';

    code += '    TSET read_Qx_tset =   {\n';
    code += '        DESC=   "read_init_tset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'DOUT', 'PRESET', 'ENQLATCH'].forEach(p => {
      code += checkPin(p);
      code += `            ${p}	= {T1=10ns;T2=2900ns;};\n`;
    });
    code += checkPin('QPCLK');
    code += '            QPCLK	= {T1=1010ns;T2=2010ns;};\n';
    code += '            };\n';

    code += '    TSET read_end_Q_tset =   {\n';
    code += '        DESC=   "read_init_tset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'PRESET', 'ENQLATCH', 'QPCLK', 'DOUT'].forEach(p => code += checkPin(p));
    code += '            ALL_PIN	= {T1=10ns;T2=1900ns;};\n';
    code += '            ADDRESS	= {T1=10ns;T2=1900ns;};\n';
    code += '            CBIAS_PIN	= {T1=10ns;T2=1900ns;};\n';
    code += '            PRESET     	= {T1=10ns;T2=1900ns;};\n';
    code += '            ENQLATCH   	= {T1=10ns;T2=1700ns;};\n';
    code += '            QPCLK     	= {T1=10ns;T2=1900ns;};\n';
    code += '            DOUT	= {T1=10ns;T2=1900ns;};\n';
    code += '	   };\n';

    code += '    TSET read_init_tset =   {\n';
    code += '        DESC=   "read_init_tset";\n';
    ['ALL_PIN', 'ADDRESS', 'DOUT', 'PRD', 'PCLK', 'POE', 'PRESET'].forEach(p => {
      code += checkPin(p);
      code += `            ${p}		= {T1=0ns;T2=200ns;};\n`;
    });
    code += '	   };\n';

    const taa = state.readModeParams.taa;
    const prdT2 = 100 + taa;
    const pclkT1 = prdT2 + 100;
    const pclkT2 = pclkT1 + 200;

    code += '    TSET read_tset=   {\n';
    code += '        DESC=   "read_tset";\n';
    ['ALL_PIN', 'ADDRESS', 'DOUT', 'PRD', 'PCLK', 'POE', 'PRESET'].forEach(p => code += checkPin(p));
    code += '            ALL_PIN	= {T1=0ns;T2=200ns;};\n';
    code += '            ADDRESS	= {T1=0ns;T2=200ns;};\n';
    code += '            DOUT	= {T1=1700ns;T2=4700ns;};\n';
    code += `            PRD      	= {T1=100ns;T2=${prdT2}ns;};\n`;
    code += `            PCLK      	= {T1=${pclkT1}ns;T2=${pclkT2}ns;};\n`;
    code += '            POE     	= {T1=2500ns;T2=4900ns;};\n';
    code += '            PRESET     	= {T1=0ns;T2=200ns;};\n';
    code += '            };\n';

    code += '    TSET read_end_tset =   {\n';
    code += '        DESC=   "end_tset";\n';
    code += checkPin('ALL_PIN');
    code += '            ALL_PIN	= {T1=0ns;T2=90ns;};\n';
    code += '    };\n';
    code += '};\n\n';

    // generate MGN tables and tests
    if (state.mgnReadData.length > 0) {
      const decodePTM = (ptm: number) => {
        const binary = ptm.toString(2).padStart(3, '0');
        return {
          ptm2: binary[0] === '1' ? 'G2H' : 'G2L',
          ptm1: binary[1] === '1' ? 'G2H' : 'G2L',
          ptm0: binary[2] === '1' ? 'G2H' : 'G2L'
        };
      };

      // TSET_TABLE time_table_read_MGN
      code += 'TSET_TABLE time_table_read_MGN= {\n';
      
      // read_init_Q_tset
      code += '    TSET read_init_Q_tset =   {\n';
      code += '        DESC=   "read_init_tset";\n';
      ['ALL_PIN', 'ADDRESS', 'CBIAS_VT', 'CBIASMGN_VT', 'DOUT', 'PRESET', 'ENQLATCH', 'QPCLK'].forEach(p => {
        code += checkPin(p);
        code += `            ${p}	= {T1=10ns;T2=1900ns;};\n`;
      });
      code += '            };\n';

      // read_Qx_tset
      code += '    TSET read_Qx_tset =   {\n';
      code += '        DESC=   "read_init_tset";\n';
      ['ALL_PIN', 'ADDRESS', 'CBIAS_VT', 'CBIASMGN_VT', 'DOUT', 'PRESET', 'ENQLATCH'].forEach(p => {
        code += checkPin(p);
        code += `            ${p}	= {T1=10ns;T2=2900ns;};\n`;
      });
      code += checkPin('QPCLK');
      code += '            QPCLK	= {T1=1010ns;T2=2010ns;};\n';
      code += '            };\n';

      // read_end_Q_tset
      code += '    TSET read_end_Q_tset =   {\n';
      code += '        DESC=   "read_init_tset";\n';
      ['ALL_PIN', 'ADDRESS', 'CBIAS_VT', 'CBIASMGN_VT', 'PRESET', 'ENQLATCH', 'QPCLK', 'DOUT'].forEach(p => code += checkPin(p));
      code += '            ALL_PIN	= {T1=10ns;T2=1900ns;};\n';
      code += '            ADDRESS	= {T1=10ns;T2=1900ns;};\n';
      code += '            CBIAS_VT	= {T1=10ns;T2=1900ns;};\n';
      code += '            CBIASMGN_VT	= {T1=10ns;T2=1900ns;};\n';
      code += '            PRESET     	= {T1=10ns;T2=1900ns;};\n';
      code += '            ENQLATCH   	= {T1=10ns;T2=1700ns;};\n';
      code += '            QPCLK     	= {T1=10ns;T2=1900ns;};\n';
      code += '            DOUT	= {T1=10ns;T2=1900ns;};\n';
      code += '	   };\n';

      // read_init_tset
      code += '    TSET read_init_tset =   {\n';
      code += '        DESC=   "read_init_tset";\n';
      ['ALL_PIN', 'ADDRESS', 'DOUT', 'PRD', 'PCLK', 'POE', 'PRESET'].forEach(p => {
        code += checkPin(p);
        code += `            ${p}		= {T1=0ns;T2=200ns;};\n`;
      });
      code += '	   };\n';

      // read_tset (using TAA from first MGN mode as default if needed, but sample shows 500)
      const mgnTaa = state.mgnReadData[0].taa || 500;
      const mgnPrdT2 = 100 + mgnTaa;
      const mgnPclkT1 = mgnPrdT2 + 100;
      const mgnPclkT2 = mgnPclkT1 + 200;

      code += '    TSET read_tset=   {\n';
      code += '        DESC=   "read_tset";\n';
      ['ALL_PIN', 'ADDRESS', 'DOUT', 'PRD', 'PCLK', 'POE', 'PRESET'].forEach(p => code += checkPin(p));
      code += '            ALL_PIN	= {T1=0ns;T2=200ns;};\n';
      code += '            ADDRESS	= {T1=0ns;T2=200ns;};\n';
      code += '            DOUT	= {T1=1700ns;T2=4700ns;};\n';
      code += `            PRD      	= {T1=100ns;T2=${mgnPrdT2}ns;};\n`;
      code += `            PCLK      	= {T1=${mgnPclkT1}ns;T2=${mgnPclkT2}ns;};\n`;
      code += '            POE     	= {T1=2500ns;T2=4900ns;};\n';
      code += '            PRESET     	= {T1=0ns;T2=200ns;};\n';
      code += '            };\n';

      // read_end_tset
      code += '    TSET read_end_tset =   {\n';
      code += '        DESC=   "end_tset";\n';
      code += checkPin('ALL_PIN');
      code += '            ALL_PIN	= {T1=0ns;T2=90ns;};\n';
      code += '    };\n';
      code += '};\n\n';
    }

    code += 'TSET_TABLE time_table_normal = {\n';
    code += '//===================set Q=================\n';
    code += 'TSET read_init_Q_tset =   {\n';
    code += '        DESC=   "read_init_tset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'DOUT', 'PRESET', 'ENQLATCH', 'QPCLK'].forEach(p => {
      code += checkPin(p);
      code += `	${p}	= {T1=10ns;T2=1900ns;};\n`;
    });
    code += '};\n';
    code += 'TSET read_Qx_tset =   {\n';
    code += '        DESC=   "read_init_tset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'DOUT', 'PRESET', 'ENQLATCH'].forEach(p => {
      code += checkPin(p);
      code += `	${p}	= {T1=10ns;T2=2900ns;};\n`;
    });
    code += checkPin('QPCLK');
    code += '	QPCLK	= {T1=1010ns;T2=2010ns;};\n';
    code += '};\n';
    code += 'TSET read_end_Q_tset = {\n';
    code += '	DESC=   "read_init_tset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'PRESET', 'QPCLK', 'DOUT'].forEach(p => {
      code += checkPin(p);
      code += `	${p}	= {T1=10ns;T2=1900ns;};\n`;
    });
    code += checkPin('ENQLATCH');
    code += '	ENQLATCH   	= {T1=10ns;T2=1700ns;};\n';
    code += '};\n';
    code += '//===================pgm=================\n';
    ['pgm_init_tset', 'pgm_tset', 'pgm_end_tset'].forEach(tsetName => {
      code += `TSET ${tsetName} =   {\n`;
      code += `        DESC=   "${tsetName}";\n`;
      ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'DOUT', 'PRESET', 'ENQLATCH', 'QPCLK', 'PRD', 'PTM2', 'PTM1', 'PTM0', 'PPROG', 'PWE', 'PTM_PIN'].forEach(p => {
        code += checkPin(p);
        code += `	${p}	= {T1=10ns;T2=1900ns;};\n`;
      });
      code += '};\n';
    });
    code += '};\n\n';

    // generate FSET
    // FSET
    code += 'FSET_TABLE format_table_read = {\n';
    
    code += '    FSET read_init_Q_fset =   {\n';
    code += '            DESC=	"read_init_fset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'CBIASMGN_VT', 'PRESET', 'ENQLATCH', 'QPCLK'].forEach(p => {
      code += checkPin(p);
      let f1 = 'G2L', f2 = 'G2L';
      if (p === 'CBIAS_PIN' || p === 'CBIASMGN_VT') { f1 = 'G2H'; f2 = 'G2H'; }
      if (p === 'ENQLATCH') { f1 = 'G2L'; f2 = 'G2H'; }
      code += `            ${p}		= {F1=${f1};F2=${f2};};\n`;
    });
    code += '        };\n';

    code += '    FSET read_set_Q_fset =   {\n';
    code += '            DESC= "read_init_fset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'CBIASMGN_VT', 'PRESET', 'ENQLATCH', 'QPCLK', 'DOUT'].forEach(p => {
      code += checkPin(p);
      let f1 = 'G2L', f2 = 'G2L';
      if (p === 'CBIAS_PIN' || p === 'CBIASMGN_VT' || p === 'ENQLATCH') { f1 = 'G2H'; f2 = 'G2H'; }
      if (p === 'QPCLK') { f1 = 'G2H'; f2 = 'G2L'; }
      if (p === 'DOUT') { f1 = 'G2D'; f2 = 'G2D'; }
      code += `            ${p}	= {F1=${f1};F2=${f2};};\n`;
    });
    code += '        };\n';

    code += '    FSET read_end_Q_fset =   {\n';
    code += '           DESC= "read_init_fset";\n';
    ['ALL_PIN', 'ADDRESS', 'CBIAS_PIN', 'CBIASMGN_VT', 'PRESET', 'ENQLATCH'].forEach(p => {
      code += checkPin(p);
      let f1 = 'G2L', f2 = 'G2L';
      if (p === 'CBIAS_PIN' || p === 'CBIASMGN_VT') { f1 = 'G2H'; f2 = 'G2H'; }
      if (p === 'PRESET') { f1 = 'G2L'; f2 = 'G2H'; }
      if (p === 'ENQLATCH') { f1 = 'G2H'; f2 = 'G2L'; }
      code += `            ${p}	= {F1=${f1};F2=${f2};};\n`;
    });
    code += '       };\n';

    code += '   FSET read_init_fset =   {\n';
    code += '        DESC= "read_set_fset";\n';
    ['ALL_PIN', 'ADDRESS', 'PTM2', 'PTM1', 'PTM0', 'PRD', 'PCLK', 'POE', 'DOUT', 'PRESET', 'CBIAS_VT', 'CBIASMGN_VT'].forEach(p => {
      code += checkPin(p);
      let f1 = 'G2L', f2 = 'G2L';
      if (p === 'DOUT') { f1 = 'G2Z'; f2 = 'G2Z'; }
      if (p === 'PRESET' || p === 'CBIAS_VT' || p === 'CBIASMGN_VT') { f1 = 'G2H'; f2 = 'G2H'; }
      code += `            ${p}		= {F1=${f1};F2=${f2};};\n`;
    });
    code += '        };\n';

    code += '    FSET read_fset =   {\n';
    code += '        DESC= "read_fset";\n';
    code += '            ALL_PIN	= {F1=G2L;F2=G2L;};\n';
    code += '            ADDRESS	= {F1=G2D;F2=G2D;};\n';
    ['PTM2', 'PTM1', 'PTM0'].forEach(p => {
      code += checkPin(p);
      code += `            ${p}	= {F1=G2L;F2=G2L;};\n`;
    });
    
    state.readModeParams.pinStatuses.forEach(ps => {
      code += checkPin(ps.pin);
      let f1 = 'G2L', f2 = 'G2L';
      if (ps.status === 'H/L') { f1 = 'G2H'; f2 = 'G2L'; }
      else if (ps.status === 'H') { f1 = 'G2H'; f2 = 'G2H'; }
      else if (ps.status === 'L') { f1 = 'G2L'; f2 = 'G2L'; }
      code += `            ${ps.pin}	= {F1=${f1};F2=${f2};};\n`;
    });
    
    if (!state.readModeParams.pinStatuses.some(ps => ps.pin === 'DOUT')) {
        code += checkPin('DOUT');
        code += '            DOUT	= {F1=DC;F2=ED;};\n';
    }
    ['PRESET', 'CBIAS_VT', 'CBIASMGN_VT'].forEach(p => {
        if (!state.readModeParams.pinStatuses.some(ps => ps.pin === p)) {
            code += checkPin(p);
            code += `            ${p}     	= {F1=G2H;F2=G2H;};\n`;
        }
    });
    code += '        };\n';

    code += '    FSET read_end_fset =   {\n';
    code += '        DESC=   "read_fset";\n';
    code += '            ALL_PIN	= {F1=G2L;F2=G2L;};\n';
    code += checkPin('PRESET');
    code += '            PRESET	= {F1=G2H;F2=G2H;};\n';
    code += '        };\n';
    code += '};\n\n';

    // generate MGN tables and tests
    if (state.mgnReadData.length > 0) {
      const decodePTM = (ptm: number) => {
        const binary = ptm.toString(2).padStart(3, '0');
        return {
          ptm2: binary[0] === '1' ? 'G2H' : 'G2L',
          ptm1: binary[1] === '1' ? 'G2H' : 'G2L',
          ptm0: binary[2] === '1' ? 'G2H' : 'G2L'
        };
      };

      // FSET and CYCLE_TABLE for each MGN mode
      state.mgnReadData.forEach(mgn => {
        const ptmDecoded = decodePTM(mgn.ptm);
        const fsetName = `format_table_read_${mgn.name}`;
        const cycleName = `cycle_table_read_${mgn.name.toLowerCase()}`;

        code += `FSET_TABLE ${fsetName} = {\n`;
        
        // read_init_Q_fset
        code += '    FSET read_init_Q_fset =   {\n';
        code += '            DESC=	"read_init_fset";\n';
        ['ALL_PIN', 'ADDRESS', 'CBIAS_VT', 'CBIASMGN_VT', 'PRESET', 'ENQLATCH', 'QPCLK'].forEach(p => {
          code += checkPin(p);
          let f1 = 'G2L', f2 = 'G2L';
          if (p === 'CBIAS_VT' || p === 'CBIASMGN_VT') { f1 = 'G2H'; f2 = 'G2H'; }
          if (p === 'ENQLATCH') { f1 = 'G2L'; f2 = 'G2H'; }
          code += `            ${p}		= {F1=${f1};F2=${f2};};\n`;
        });
        code += '        };\n';

        // read_set_Q_fset
        code += '    FSET read_set_Q_fset =   {\n';
        code += '            DESC= "read_init_fset";\n';
        ['ALL_PIN', 'ADDRESS', 'CBIAS_VT', 'CBIASMGN_VT', 'PRESET', 'ENQLATCH', 'QPCLK', 'DOUT'].forEach(p => {
          code += checkPin(p);
          let f1 = 'G2L', f2 = 'G2L';
          if (p === 'CBIAS_VT' || p === 'CBIASMGN_VT' || p === 'ENQLATCH') { f1 = 'G2H'; f2 = 'G2H'; }
          if (p === 'QPCLK') { f1 = 'G2H'; f2 = 'G2L'; }
          if (p === 'DOUT') { f1 = 'G2D'; f2 = 'G2D'; }
          code += `            ${p}	= {F1=${f1};F2=${f2};};\n`;
        });
        code += '        };\n';

        // read_end_Q_fset
        code += '    FSET read_end_Q_fset =   {\n';
        code += '           DESC= "read_init_fset";\n';
        ['ALL_PIN', 'ADDRESS', 'CBIAS_VT', 'CBIASMGN_VT', 'PRESET', 'ENQLATCH'].forEach(p => {
          code += checkPin(p);
          let f1 = 'G2L', f2 = 'G2L';
          if (p === 'CBIAS_VT' || p === 'CBIASMGN_VT') { f1 = 'G2H'; f2 = 'G2H'; }
          if (p === 'PRESET') { f1 = 'G2L'; f2 = 'G2H'; }
          if (p === 'ENQLATCH') { f1 = 'G2H'; f2 = 'G2L'; }
          code += `            ${p}	= {F1=${f1};F2=${f2};};\n`;
        });
        code += '       };\n';

        // read_init_fset
        code += '   FSET read_init_fset =   {\n';
        code += '        DESC= "read_set_fset";\n';
        ['ALL_PIN', 'ADDRESS', 'PTM2', 'PTM1', 'PTM0', 'PRD', 'PCLK', 'POE', 'DOUT', 'PRESET', 'CBIAS_VT', 'CBIASMGN_VT'].forEach(p => {
          code += checkPin(p);
          let f1 = 'G2L', f2 = 'G2L';
          if (p === 'PTM2') { f1 = ptmDecoded.ptm2; f2 = ptmDecoded.ptm2; }
          if (p === 'PTM1') { f1 = ptmDecoded.ptm1; f2 = ptmDecoded.ptm1; }
          if (p === 'PTM0') { f1 = ptmDecoded.ptm0; f2 = ptmDecoded.ptm0; }
          if (p === 'DOUT') { f1 = 'G2Z'; f2 = 'G2Z'; }
          if (p === 'PRESET' || p === 'CBIAS_VT' || p === 'CBIASMGN_VT') { f1 = 'G2H'; f2 = 'G2H'; }
          code += `            ${p}		= {F1=${f1};F2=${f2};};\n`;
        });
        code += '        };\n';

        // read_fset
        code += '    FSET read_fset =   {\n';
        code += '        DESC= "read_fset";\n';
        code += '            ALL_PIN	= {F1=G2L;F2=G2L;};\n';
        code += '            ADDRESS	= {F1=G2D;F2=G2D;};\n';
        ['PTM2', 'PTM1', 'PTM0'].forEach(p => {
          code += checkPin(p);
          let f1 = 'G2L', f2 = 'G2L';
          if (p === 'PTM2') { f1 = ptmDecoded.ptm2; f2 = ptmDecoded.ptm2; }
          if (p === 'PTM1') { f1 = ptmDecoded.ptm1; f2 = ptmDecoded.ptm1; }
          if (p === 'PTM0') { f1 = ptmDecoded.ptm0; f2 = ptmDecoded.ptm0; }
          code += `            ${p}	= {F1=${f1};F2=${f2};};\n`;
        });
        
        mgn.pinStatuses.forEach(ps => {
          code += checkPin(ps.pin);
          let f1 = 'G2L', f2 = 'G2L';
          if (ps.status === 'H/L') { f1 = 'G2H'; f2 = 'G2L'; }
          else if (ps.status === 'H') { f1 = 'G2H'; f2 = 'G2H'; }
          else if (ps.status === 'L') { f1 = 'G2L'; f2 = 'G2L'; }
          code += `            ${ps.pin}	= {F1=${f1};F2=${f2};};\n`;
        });
        
        if (!mgn.pinStatuses.some(ps => ps.pin === 'DOUT')) {
            code += checkPin('DOUT');
            code += '            DOUT	= {F1=DC;F2=ED;};\n';
        }
        ['PRESET', 'CBIAS_VT', 'CBIASMGN_VT'].forEach(p => {
            if (!mgn.pinStatuses.some(ps => ps.pin === p)) {
                code += checkPin(p);
                code += `            ${p}     	= {F1=G2H;F2=G2H;};\n`;
            }
        });
        code += '        };\n';

        // read_end_fset
        code += '    FSET read_end_fset =   {\n';
        code += '        DESC=   "read_fset";\n';
        code += '            ALL_PIN	= {F1=G2L;F2=G2L;};\n';
        code += checkPin('PRESET');
        code += '            PRESET	= {F1=G2H;F2=G2H;};\n';
        code += '        };\n';
        code += '};\n\n';
      });
    }

    code += 'FSET_TABLE format_table_normal = {\n';
    code += '//===================set Q=================\n';
    code += 'FSET read_init_Q_fset =   {\n';
    code += '        DESC=	"read_init_fset";\n';
    ['ALL_PIN', 'ADDRESS', 'PRESET', 'QPCLK'].forEach(p => {
      code += checkPin(p);
      code += `	${p}		= {F1=G2L;F2=G2L;};\n`;
    });
    code += checkPin('CBIAS_PIN');
    code += '	CBIAS_PIN	= {F1=G2H;F2=G2H;};\n';
    code += checkPin('ENQLATCH');
    code += '	ENQLATCH	= {F1=G2L;F2=G2H;};\n';
    code += '};\n';
    code += 'FSET read_set_Q_fset =   {\n';
    code += '        DESC= "read_init_fset";\n';
    ['ALL_PIN', 'ADDRESS', 'PRESET'].forEach(p => {
      code += checkPin(p);
      code += `	${p}     	= {F1=G2L;F2=G2L;};\n`;
    });
    ['CBIAS_PIN', 'ENQLATCH'].forEach(p => {
      code += checkPin(p);
      code += `	${p}   	= {F1=G2H;F2=G2H;};\n`;
    });
    code += checkPin('QPCLK');
    code += '	QPCLK     	= {F1=G2H;F2=G2L;};\n';
    code += checkPin('DOUT');
    code += '	DOUT	= {F1=G2D;F2=G2D;};\n';
    code += '};\n';
    code += 'FSET read_end_Q_fset =   {\n';
    code += '        DESC= "read_init_fset";\n';
    ['ALL_PIN', 'ADDRESS'].forEach(p => {
      code += checkPin(p);
      code += `	${p}	= {F1=G2L;F2=G2L;};\n`;
    });
    code += checkPin('CBIAS_PIN');
    code += '	CBIAS_PIN	= {F1=G2H;F2=G2H;};\n';
    code += checkPin('PRESET');
    code += '	PRESET     	= {F1=G2L;F2=G2H;};\n';
    code += checkPin('ENQLATCH');
    code += '	ENQLATCH   	= {F1=G2H;F2=G2L;};\n';
    code += '};\n';
    code += '//===================pgm=================\n';
    code += 'FSET pgm_init_fset =   {\n';
    code += '        DESC= "pgm_init_fset";\n';
    ['ALL_PIN', 'ADDRESS', 'PTM2', 'PTM1', 'PTM0', 'PRD', 'PPROG', 'PWE'].forEach(p => {
      code += checkPin(p);
      code += `	${p}		= {F1=G2L;F2=G2L;};\n`;
    });
    code += checkPin('DOUT');
    code += '	DOUT		= {F1=G2Z;F2=G2Z;};\n';
    ['PRESET', 'CBIAS_VT', 'CBIASMGN_VT'].forEach(p => {
      code += checkPin(p);
      code += `	${p}		= {F1=G2H;F2=G2H;};\n`;
    });
    code += '};\n';
    code += 'FSET pgm_fset =   {\n';
    code += '        DESC= "pgm_fset";\n';
    ['ALL_PIN', 'PTM2', 'PTM1', 'PTM0', 'PRD', 'PPROG', 'PWE'].forEach(p => {
      code += checkPin(p);
      code += `	${p}		= {F1=G2L;F2=G2L;};\n`;
    });
    ['ADDRESS', 'DOUT'].forEach(p => {
      code += checkPin(p);
      code += `	${p}		= {F1=G2D;F2=G2D;};\n`;
    });
    ['PRESET', 'CBIAS_VT', 'CBIASMGN_VT'].forEach(p => {
      code += checkPin(p);
      code += `	${p}		= {F1=G2H;F2=G2H;};\n`;
    });
    code += '};\n';
    code += 'FSET pgm_end_fset =   {\n';
    code += '        DESC= "pgm_end_fset";\n';
    code += checkPin('ALL_PIN');
    code += '	ALL_PIN		= {F1=G2L;F2=G2L;};\n';
    code += checkPin('PRESET');
    code += '	PRESET		= {F1=G2H;F2=G2H;};\n';
    code += '};\n';
    code += '};\n\n';
    
    // generate PSET
    // PSET
    const definedPeriods = new Set(state.periods);
    const checkPset = (period: number) => {
      const name = getPsetName(period);
      if (!definedPeriods.has(period)) {
        return `/* ERROR: PSET ${name} (${period}ns) NOT DEFINED in period sheet */ `;
      }
      return '';
    };

    code += 'PSET_TABLE period_table_normal =   {\n';
    state.periods.forEach(p => {
      const name = getPsetName(p);
      const valStr = p % 1000 === 0 ? `${p/1000}us` : `${p}ns`;
      code += `    PSET ${name} =   {\n`;
      code += `    DESC=   "${name}";\n`;
      code += `    MAIN    =   ${valStr};\n`;
      code += `    ALT     =   ${valStr};\n`;
      code += '    };\n';
    });
    code += '};\n\n';

    // generate CYCLE_TABLE
    // CYCLE_TABLE
    const readPeriod = state.readModeParams.period || 5000;
    const readPeriodPset = getPsetName(readPeriod);
    code += 'CYCLE_TABLE cycle_table_read  =   {\n';
    code += '    TSET_TABLE  	=   time_table_read;\n';
    code += '    FSET_TABLE  	=   format_table_read;\n';
    code += '    PSET_TABLE  	=   period_table_normal;\n';
    code += '    //=============set q=======\n';
    code += `    read_init_Q_cyc =   {TSET=read_init_Q_tset; FSET=read_init_Q_fset;  PSET=${checkPset(2000)}p2us_pset;};\n`;
    code += `    read_set_Q_cyc  =   {TSET=read_Qx_tset;     FSET=read_set_Q_fset;   PSET=${checkPset(3000)}p3us_pset;};\n`;
    code += `    read_end_Q_cyc  =   {TSET=read_end_Q_tset;  FSET=read_end_Q_fset;   PSET=${checkPset(2000)}p2us_pset;};\n`;
    code += '    //===========normal read==============\n';
    code += `    read_init_cyc	=	{TSET=read_init_tset;	FSET=read_init_fset;	PSET=${checkPset(1000)}p1us_pset;};\n`;
    code += `    read_cyc		=	{TSET=read_tset;		FSET=read_fset;			PSET=${checkPset(readPeriod)}${readPeriodPset};};\n`;
    code += `    read_end_cyc	=	{TSET=read_end_tset;	FSET=read_end_fset;		PSET=${checkPset(1000)}p1us_pset;};\n`;
    code += '};\n\n';
    
    // generate MGN tables and tests
    if (state.mgnReadData.length > 0) {
      const decodePTM = (ptm: number) => {
        const binary = ptm.toString(2).padStart(3, '0');
        return {
          ptm2: binary[0] === '1' ? 'G2H' : 'G2L',
          ptm1: binary[1] === '1' ? 'G2H' : 'G2L',
          ptm0: binary[2] === '1' ? 'G2H' : 'G2L'
        };
      };

      // FSET and CYCLE_TABLE for each MGN mode
      state.mgnReadData.forEach(mgn => {
        const ptmDecoded = decodePTM(mgn.ptm);
        const fsetName = `format_table_read_${mgn.name}`;
        const cycleName = `cycle_table_read_${mgn.name.toLowerCase()}`;
        const mgnPeriod = mgn.period || 5000;
        const mgnPeriodPset = getPsetName(mgnPeriod);

        // CYCLE_TABLE
        code += `CYCLE_TABLE ${cycleName}  =   {\n`;
        code += '    TSET_TABLE  	=   time_table_read_MGN;\n';
        code += `    FSET_TABLE  	=   ${fsetName};\n`;
        code += '    PSET_TABLE  	=   period_table_normal;\n';
        code += '    //=============set q=======\n';
        code += `    read_init_Q_cyc =   {TSET=read_init_Q_tset; FSET=read_init_Q_fset;  PSET=${checkPset(2000)}p2us_pset;};\n`;
        code += `    read_set_Q_cyc  =   {TSET=read_Qx_tset;     FSET=read_set_Q_fset;   PSET=${checkPset(3000)}p3us_pset;};\n`;
        code += `    read_end_Q_cyc  =   {TSET=read_end_Q_tset;  FSET=read_end_Q_fset;   PSET=${checkPset(2000)}p2us_pset;};\n`;
        code += '    //===========normal read==============\n';
        code += `    read_init_cyc	=	{TSET=read_init_tset;	FSET=read_init_fset;	PSET=${checkPset(1000)}p1us_pset;};\n`;
        code += `    read_cyc		=	{TSET=read_tset;		FSET=read_fset;			PSET=${checkPset(mgnPeriod)}${mgnPeriodPset};};\n`;
        code += `    read_end_cyc	=	{TSET=read_end_tset;	FSET=read_end_fset;		PSET=${checkPset(1000)}p1us_pset;};\n`;
        code += '};\n\n';
      });
    }

    code += 'CYCLE_TABLE cycle_table_normal = {\n';
    code += '    TSET_TABLE  	=   time_table_normal;\n';
    code += '    FSET_TABLE  	=   format_table_normal;\n';
    code += '    PSET_TABLE  	=   period_table_normal;\n';
    code += '    //=============set q=======\n';
    code += `    read_init_Q_cyc =   {TSET=read_init_Q_tset; FSET=read_init_Q_fset;  PSET=${checkPset(2000)}p2us_pset;};\n`;
    code += `    read_set_Q_cyc  =   {TSET=read_Qx_tset;     FSET=read_set_Q_fset;   PSET=${checkPset(3000)}p3us_pset;};\n`;
    code += `    read_end_Q_cyc  =   {TSET=read_end_Q_tset;  FSET=read_end_Q_fset;   PSET=${checkPset(2000)}p2us_pset;};\n`;
    code += '    //===========pgm==============\n';
    code += `    pgm_init_cyc	=	{TSET=pgm_init_tset;	FSET=pgm_init_fset;	PSET=${checkPset(2000)}p2us_pset;};\n`;
    code += `    pgm_cyc		=	{TSET=pgm_tset;		FSET=pgm_fset;		PSET=${checkPset(2000)}p2us_pset;};\n`;
    code += `    pgm_end_cyc		=	{TSET=pgm_end_tset;	FSET=pgm_end_fset;	PSET=${checkPset(2000)}p2us_pset;};\n`;
    code += '};\n\n';

    // generate Shmoo Axis and Shmoo Test
    code += `AXIS axis_iptaa_200 = {
    DESC = "Iptaa";
    STEPS = 100; 
    METE_START = 0ns;
    METE_DELTA = 2.0ns;
    PARAM = {UNIT= T1; CYCLE_NAME = read_cyc; PINS= PCLK; START = 100ns; DELTA = 2.0ns;};
    PARAM = {UNIT= T2; CYCLE_NAME = read_cyc; PINS= PCLK; START = 300ns; DELTA = 2.0ns;};
    PARAM = {UNIT= T1; CYCLE_NAME = read_cyc; PINS= PRD; START = 100ns; DELTA = 0.0ns;};
    PARAM = {UNIT= T2; CYCLE_NAME = read_cyc; PINS= PRD; START = 300ns ; DELTA = 0.0ns;};
};\n\n`;

    code += `AXIS axis_iptaa_1000 = {
    DESC = "Iptaa";
    STEPS = 100; 
    METE_START = 0ns;
    METE_DELTA = 11.0ns;
    PARAM = {UNIT= T1; CYCLE_NAME = read_cyc; PINS= PCLK; START = 100ns; DELTA = 11.0ns;};
    PARAM = {UNIT= T2; CYCLE_NAME = read_cyc; PINS= PCLK; START = 300ns; DELTA = 11.0ns;};
    PARAM = {UNIT= T1; CYCLE_NAME = read_cyc; PINS= PRD; START = 100ns; DELTA = 0.0ns;};
    PARAM = {UNIT= T2; CYCLE_NAME = read_cyc; PINS= PRD; START = 1100ns ; DELTA = 0.0ns;};
};\n\n`;

    code += `AXIS axis_vcc = {
  DESC = " Voltage level";
  STEPS = 55;
  PARAM = { UNIT = VCC0_MAIN;START = 6.0V;DELTA = -0.1V; };
  PARAM = { UNIT = VCC1_MAIN;START = 6.0V;DELTA = -0.1V; };
  PARAM = { UNIT = VPP0_MAIN;START = 6.0V;DELTA = -0.1V; }; 
  PARAM = { UNIT = VIH; PINS = ALL_PIN;START = 6.0V;DELTA = -0.1V; };
  PARAM = { UNIT = VIL; PINS = ALL_PIN;START = 0.0V;DELTA = -0.0V; }; 
  PARAM = { UNIT =VOH; PINS = ALL_PIN;START =3.1V;DELTA = -0.05V;};
  PARAM = { UNIT =VOL; PINS = ALL_PIN;START=2.9V;DELTA = -0.05V;};
  PARAM = { UNIT =VT;  PINS = ALL_PIN;START =3.0V;DELTA = -0.05V;};
};\n\n`;

    code += `AXIS axis_vcc_0V = {
  DESC = " Voltage level";
  STEPS = 55;
  PARAM = { UNIT = VCC0_MAIN;START = 6.0V;DELTA = -0.1V; };
  PARAM = { UNIT = VCC1_MAIN;START = 6.0V;DELTA = -0.1V; };
  PARAM = { UNIT = VPP0_MAIN;START = 0.0V;DELTA = -0.0V; }; 
  PARAM = { UNIT = VIH; PINS = ALL_PIN;START = 6.0V;DELTA = -0.1V; };
  PARAM = { UNIT = VIL; PINS = ALL_PIN;START = 0.0V;DELTA = -0.0V; }; 
  PARAM = { UNIT =VOH; PINS = ALL_PIN;START =3.1V;DELTA = -0.05V;};
  PARAM = { UNIT =VOL; PINS = ALL_PIN;START=2.9V;DELTA = -0.05V;};
  PARAM = { UNIT =VT;  PINS = ALL_PIN;START =3.0V;DELTA = -0.05V;};
};\n\n`;

    code += `SHMOO shmoo_iptaa_vcc = { PSKIP = 1; TYPE  = 2D_NORMAL; XAXIS = axis_iptaa_200; YAXIS = axis_vcc;};\n`;
    code += `SHMOO shmoo_iptaa_0v = { PSKIP = 1; TYPE  = 2D_NORMAL; XAXIS = axis_iptaa_200; YAXIS = axis_vcc_0V;};\n`;
    code += `SHMOO shmoo_iptaa_vcc_1000 = { PSKIP = 1; TYPE  = 2D_NORMAL; XAXIS = axis_iptaa_1000; YAXIS = axis_vcc;};\n`;
    code += `SHMOO shmoo_iptaa_0v_1000 = { PSKIP = 1; TYPE  = 2D_NORMAL; XAXIS = axis_iptaa_1000; YAXIS = axis_vcc_0V;};\n\n`;

    // generate PATTERN
    // PATTERN definitions
    code += 'PATTERN Q_set_pat = {FILE="Q_set";START=0;TIMEOUT=0.0;FAILMODE=CONTINUE_ON_FAIL;};\n';
    code += 'PATTERN readff_all_pat = {FILE="readff_all";START=0;TIMEOUT=0.0;FAILMODE=CONTINUE_ON_FAIL;};\n';
    code += 'PATTERN read00_all_pat = {FILE="read00_all";START=0;TIMEOUT=0.0;FAILMODE=CONTINUE_ON_FAIL;};\n';
    code += 'PATTERN read_dbm_chip_pat = {FILE="read_dbm_chip";START=0;TIMEOUT=0.0;FAILMODE=CONTINUE_ON_FAIL;};\n';
    code += 'PATTERN pgm00_vpp_pat = {FILE="pgm00_vpp";START=0;TIMEOUT=0.0;FAILMODE=CONTINUE_ON_FAIL;};\n\n';

    // generate Sequences
    // Sequences
    const getDpsFromPin = (pinName: string) => {
      const name = pinName.toUpperCase();
      const hasVdd2 = state.socket.some(p => p.name.toUpperCase() === 'VDD2');
      if (hasVdd2) {
        if (name === 'VDD2') return 'VPP1';
        if (name === 'DVDD2') return 'VCC1';
        if (name === 'VDD') return 'VCC0';
        if (name === 'DVDD') return 'DVDD';
        if (name === 'VPP') return 'VPP0';
      } else {
        if (name === 'VDD') return 'VCC0';
        if (name === 'DVDD') return 'VCC1';
        if (name === 'VPP') return 'VPP0';
      }
      return name;
    };

    const powerUpDps = state.powerUpSequence.map(p => getDpsFromPin(p));
    const powerDownDps = [...powerUpDps].reverse();

    const powerUpLines = (delay: string) => powerUpDps.map(dps => `\tSET(${dps},MAIN),\n\tDELAY(${delay})`).join('\n');
    const powerDownLines = (delay: string) => powerDownDps.map(dps => `\t${dps.toLowerCase()}_0v_dps,\n\tSET(${dps},MAIN),\n\tDELAY(${delay})`).join('\n');

    code += `SEQUENCE vcc_short_seq = {\n\tSET(ALL_PIN,VIL),\n\tDELAY(10ms),\n${powerUpLines('10ms')}\n};\n\n`;
    
    // PMUTEST
    const powerPins = state.socket.filter(p => p.type === 'PWR_PIN').map(p => ({
      name: p.name,
      dps: getDpsFromPin(p.name)
    }));

    powerPins.forEach(p => {
      const isVpp = p.dps.startsWith('VPP');
      const openUlimit = isVpp ? '-2mA' : '-245uA';
      const openRange = isVpp ? 'R2.5MA' : 'R250UA';
      code += `PMUTEST ${p.dps.toLowerCase()}_open_pmu ={PINS= ${p.dps};FORCE=-0.8V;ULIMIT= ${openUlimit} ;LLIMIT =IGNORE;RANGE = ${openRange};DELAY = 10ms;SAMPLES=256;};\n`;
    });
    powerPins.forEach(p => {
      code += `PMUTEST ${p.dps.toLowerCase()}_short_pmu={PINS=${p.dps};FORCE = 0.3V;ULIMIT= 100uA ;LLIMIT =IGNORE;RANGE = R250UA  ;DELAY = 10ms;SAMPLES=256;};\n`;
    });
    code += `PMUTEST continuity_pmu ={PINS=ALL_PIN;FORCE=-100uA ;ULIMIT =-0.25V;LLIMIT =-1.0V;RANGE = R250UA;DELAY = 1ms;SAMPLES=256;PINMODE = SEQ;};\n`;
    code += `PMUTEST inputleakage_hi_pmu ={PINS = INPUTS1; FORCE = VDDMAX_READ; ULIMIT = 1.0uA; LLIMIT =-1.0uA;RANGE = R2.5UA;DELAY = 1ms;SAMPLES=256; PINMODE = SEQ;};\n`;
    code += `PMUTEST inputleakage_lo_pmu ={PINS = INPUTS1; FORCE = 0.0V; ULIMIT = 1.0uA; LLIMIT =-1.0uA;RANGE = R2.5UA  ;DELAY = 1ms;SAMPLES=256;   PINMODE = SEQ;};\n`;
    code += `PMUTEST outputleakage_hi_pmu ={PINS = ALL_IO;FORCE = VDDMAX_READ;ULIMIT = 1.0uA ;LLIMIT =-1.0uA;RANGE = R2.5UA  ;DELAY = 1ms;SAMPLES=256;   PINMODE = SEQ;};\n`;
    code += `PMUTEST outputleakage_lo_pmu ={PINS = ALL_IO;FORCE = 0.0V;ULIMIT = 1.0uA ;LLIMIT =-1.0uA;RANGE = R2.5UA  ;DELAY = 1ms;SAMPLES=256;   PINMODE = SEQ;};\n`;
    code += '\n';

    code += `SEQUENCE continuity_seq = {\n\tSET(ALL_PIN,VIL),\n\tDELAY(10ms),\n${powerUpLines('10ms')}\n\tDELAY(5ms)\n};\n\n`;
    code += `SEQUENCE inputleakage_lo_seq = {\n\tSET(ALL_PIN,VIL),\n\tDELAY(10ms),\n${powerUpLines('10ms')}\n\tSET(INPUTS1,VIH),\n\tSET(TESTIO,OPEN),\n\tSET(DOUT,OPEN),\n\tDELAY(1ms)\n};\n\n`;
    code += `SEQUENCE inputleakage_hi_seq = {\n\tSET(ALL_PIN,VIL),\n\tDELAY(10ms),\n${powerUpLines('10ms')}\n\tSET(INPUTS1,VIL),\n\tSET(TESTIO,OPEN),\n\tSET(DOUT,OPEN),\n\tDELAY(1ms)\n};\n\n`;
    code += `SEQUENCE outputleakage_lo_seq = {\n\tSET(ALL_PIN,VIL),\n\tDELAY(10ms),\n${powerUpLines('10ms')}\n\tSET(TESTIO,OPEN),\n\tSET(DOUT,VIH),\n\tDELAY(1ms)\n};\n\n`;
    code += `SEQUENCE outputleakage_hi_seq = {\n\tSET(ALL_PIN,VIL),\n\tDELAY(10ms),\n${powerUpLines('10ms')}\n\tSET(TESTIO,OPEN),\n\tSET(DOUT,VIL),\n\tDELAY(1ms)\n};\n\n`;
    code += `SEQUENCE vcc_seq = {\n\tSET(ALL_PIN,VIL),\n\tDELAY(1ms),\n${powerUpLines('10ms')}\n\tSET(CBIAS_PIN,VIH),\n\tSET(TESTIO,HIZ),\n\tSET(DOUT,HIZ),\n\tDELAY(2ms)\n};\n\n`;
    code += `SEQUENCE reconnect_io_seq = {\n\tPG_STOP,\n\tDELAY(1ms),\n\tzero_lev,\n\tSET(ALL_PIN,VIL),\n\tDELAY(10ms),\n${powerDownLines('10ms')}\n\tDELAY(10ms)\n};\n\n`;


    code += `SEQUENCE shmoo_iptaa_seq ={\n`;
    code += `    shmoo_iptaa_vcc,\n`;
    code += `    shmoo_iptaa_0v,\n`;
    code += `    shmoo_iptaa_vcc_1000,\n`;
    code += `    shmoo_iptaa_0v_1000,\n`;
    code += `    DELAY(3ms)\n`;
    code += `};\n\n`;


    // generate TEST
    // Tests
    code += `TEST vcc_open_short_test={\n\tTESTNO=1000;\n\tDESC="vcc_short_test";\n\tSEQUENCE={\n\t\tvcc_0v_dps,\n\t\tcontinuity_lev,\n\t\tvcc_short_seq,\n\t\tDELAY(100ms),\n`;
    powerPins.forEach(p => {
      code += `\t\t${p.dps.toLowerCase()}_open_pmu,\n\t\tDELAY(10ms),\n\t\tMEAS(PMU),\n\t\tDELAY(10ms),\n`;
    });
    powerPins.forEach(p => {
      code += `\t\t${p.dps.toLowerCase()}_short_pmu,\n\t\tDELAY(10ms),\n\t\tMEAS(PMU),\n\t\tDELAY(10ms),\n`;
    });
    code += `\t\treconnect_io_seq\n\t};\n\tON_FAIL={reconnect_io_seq};\n};\n\n`;

    code += `TEST continuit_test={\n\tTESTNO = 1100;\n\tDESC = "continuity_test";\n\tSEQUENCE = {\n\t\tvcc_0v_dps,\n\t\tcontinuity_lev,\n\t\tcontinuity_seq,\n\t\tcontinuity_pmu,\n\t\tMEAS(PMU),\n\t\treconnect_io_seq\n\t};\n\tON_FAIL={reconnect_io_seq};\n};\n\n`;

    code += `TEST InputLeakageHigh = {\n\tTESTNO = 1220;\n\tDESC = "Input leakage";\n\tSEQUENCE = {\n\t\tread_vccmax_dps,\n\t\tread_vmax_lev,\n\t\tinputleakage_hi_seq,\n\t\tinputleakage_hi_pmu,\n\t\tMEAS(PMU),\n\t\treconnect_io_seq\n\t};\n\tON_FAIL={reconnect_io_seq};\n};\n\n`;
    code += `TEST InputLeakageLow = {\n\tTESTNO = 1210;\n\tDESC = "Input leakage";\n\tSEQUENCE = {\n\t\tread_vccmax_dps,\n\t\tread_vmax_lev,\n\t\tinputleakage_lo_seq,\n\t\tinputleakage_lo_pmu,\n\t\tMEAS(PMU),\n\t\treconnect_io_seq\n\t};\n\tON_FAIL={reconnect_io_seq};\n};\n\n`;
    code += `TEST OutputLeakageHigh = {\n\tTESTNO = 1320;\n\tDESC = "Output leakage";\n\tSEQUENCE = {\n\t\tread_vccmax_dps,\n\t\tread_vmax_lev,\n\t\toutputleakage_hi_seq,\n\t\toutputleakage_hi_pmu,\n\t\tMEAS(PMU),\n\t\treconnect_io_seq\n\t};\n\tON_FAIL={reconnect_io_seq};\n};\n\n`;
    code += `TEST OutputLeakageLow = {\n\tTESTNO = 1310;\n\tDESC = "Output leakage";\n\tSEQUENCE = {\n\t\tread_vccmax_dps,\n\t\tread_vmax_lev,\n\t\toutputleakage_lo_seq,\n\t\toutputleakage_lo_pmu,\n\t\tMEAS(PMU),\n\t\treconnect_io_seq\n\t};\n\tON_FAIL={reconnect_io_seq};\n};\n\n`;

    state.tests.forEach(t => {
      code += t.data + '\n\n';
    });

    // generate MGN tables and tests
    if (state.mgnReadData.length > 0) {
      const decodePTM = (ptm: number) => {
        const binary = ptm.toString(2).padStart(3, '0');
        return {
          ptm2: binary[0] === '1' ? 'G2H' : 'G2L',
          ptm1: binary[1] === '1' ? 'G2H' : 'G2L',
          ptm0: binary[2] === '1' ? 'G2H' : 'G2L'
        };
      };

      // FSET and CYCLE_TABLE for each MGN mode
      state.mgnReadData.forEach(mgn => {
        const ptmDecoded = decodePTM(mgn.ptm);
        const fsetName = `format_table_read_${mgn.name}`;
        const cycleName = `cycle_table_read_${mgn.name.toLowerCase()}`;

        // TEST
        const testName = `readff_chip_${mgn.name.toLowerCase()}_test`;
        const patName = mgn.name === 'OFFMGN' ? 'readff_all_pat' : 'read00_all_pat';
        
        code += `TEST ${testName} ={\n`;
        code += '    TESTNO = 5520;\n';
        code += '    DESC = "Read chip";\n';
        code += '    SEQUENCE={\n';
        code += '        read_vcctyp_dps,\n';
        code += '        read_vtyp_lev,\n';
        code += '        vcc_seq,\n';
        code += `        ${cycleName},\n`;
        code += '        ECR_CLR(PG2,ALL),\n';
        code += '        Q_set_pat,\n';
        code += '        PG_RUN,\n';
        code += '        PG_STOP,\n';
        code += `        ${patName},\n`;
        code += '        PG_RUN,\n';
        code += '        PG_STOP,\n';
        code += '        reconnect_io_seq\n';
        code += '    };\n';
        code += 'ON_FAIL={reconnect_io_seq};\n';
        code += '};\n\n';
      });
    }
    
    code += `TEST read_dbm_chip_vtyp_test ={\n`;
    code += `    TESTNO = 5510;\n`;
    code += `    DESC = "Read chip";\n`;
    code += `    SEQUENCE={\n`;
    code += `        read_vcctyp_dps,\n`;
    code += `        read_vtyp_lev,\n`;
    code += `        vcc_seq,\n`;
    code += `        cycle_table_read,\n`;
    code += `        ECR_CLR(PG2,ALL),\n`;
    code += `        Q_set_pat,\n`;
    code += `        PG_RUN,\n`;
    code += `        PG_STOP,\n`;
    code += `        read_dbm_chip_pat,\n`;
    code += `        PG_RUN,\n`;
    code += `        ON(FK1,shmoo_iptaa_seq),\n`;
    code += `        PG_STOP,\n`;
    code += `        reconnect_io_seq\n`;
    code += `    };\n`;
    code += `    ON_FAIL={reconnect_io_seq};\n`;
    code += `};\n\n`;


    const pgmTests = [
      { name: 'pgm00_vpp_max_test', testNo: 1000, dps: 'pgm_vccmax_dps', lev: 'pgm_vmax_lev' },
      { name: 'pgm00_vpp_min_test', testNo: 1001, dps: 'pgm_vccmin_dps', lev: 'pgm_vmin_lev' },
      { name: 'pgm00_vpp_typ_test', testNo: 1002, dps: 'pgm_vcctyp_dps', lev: 'pgm_vtyp_lev' }
    ];

    pgmTests.forEach(t => {
      code += `TEST ${t.name} ={\n`;
      code += `    TESTNO = ${t.testNo};\n`;
      code += `    DESC = "${t.name}";\n`;
      code += `    SEQUENCE={\n`;
      code += `        ${t.dps},\n`;
      code += `        ${t.lev},\n`;
      code += `        vcc_seq,\n`;
      code += `        cycle_table_normal,\n`;
      code += `        ECR_CLR(PG2,ALL),\n`;
      code += `        Q_set_pat,\n`;
      code += `        PG_RUN,\n`;
      code += `        PG_STOP,\n`;
      code += `        pgm00_vpp_pat,\n`;
      code += `        PG_RUN,\n`;
      code += `        PG_STOP,\n`;
      code += `        reconnect_io_seq\n`;
      code += `    };\n`;
      code += `    ON_FAIL={reconnect_io_seq};\n`;
      code += `};\n\n`;
    });
    
    // generate FLOW
    state.flows.forEach(flow => {
      code += `FLOW ${flow.name} =	{\n`;
      code += '//	test_name,			pass_branch,			fail_branch;\n';
      flow.entries.forEach(entry => {
        code += `	${entry.testName.padEnd(25)},	${entry.passBranch.padEnd(25)},	${entry.failBranch};\n`;
      });
      code += '};\n\n';
    });
    
    return code;
  };

  const generateSetQCode = () => {
    let code = `import otp_shrink.ktl\nimport dgsets.kpl\n\n`;
    code += `PG_STATIC {\n     PG(2);\n     pmode(ECR);\n     steering(y_link_to_x, by8);\n};\n\n`;
    code += `PG_PATTERN readff_chip_pat {\n`;
    code += `    INIT: ( \n`;
    code += `        cga(x)=0x00,\n`;
    code += `        cga(y)=0x00,\n`;
    code += `        cga(z)=0x00,\n\n`;
    code += `        cga_cmp(x)=MAX_X,\n`;
    code += `        cga_cmp(y)=MAX_Y,\n`;
    code += `        cga_cmp(z)=0x00,\n\n`;
    code += `        cga_mask(x)=MAX_X,\n`;
    code += `        cga_mask(y)=MAX_Y,\n`;
    code += `        cga_mask(z)=0x00\n`;
    code += `     );\n\n`;
    code += `default:(driveAG=cga,driveDG=cga);\n`;
    code += `      Q_init_cyc();\n`;
    
    state.qData.forEach((entry, idx) => {
      const n = state.qData.length;
      const startBit = (n - idx) * 8 - 1;
      const endBit = startBit - 7;
      code += `      Q_set_cyc(data=${entry.name});   //Q<${startBit}:${endBit}>\n`;
    });
    
    code += `      Q_end_cyc()stop;\n};\n`;


    return code;
  };

    
  const renderPinGroups = () => {
    const allPins = state.socket.map(p => p.name);
    const allGroups = state.pinGroups.map(g => g.name);
    const availableItems = [...allPins, ...allGroups];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Pin Group Configuration</h2>
          <button 
            onClick={() => setState({ ...state, pinGroups: [...state.pinGroups, { name: 'NEW_GROUP', pins: [] }] })}
            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-md text-sm hover:bg-zinc-800 transition-colors"
          >
            <Plus size={16} /> Add Group
          </button>
        </div>
        <div className="grid gap-6">
          {state.pinGroups.map((group, idx) => (
            <div key={idx} className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <input 
                  className="text-lg font-bold bg-transparent border-none focus:ring-0 outline-none"
                  value={group.name}
                  onChange={(e) => {
                    const newList = [...state.pinGroups];
                    newList[idx].name = e.target.value;
                    setState({ ...state, pinGroups: newList });
                  }}
                />
                <button 
                  onClick={() => setState({ ...state, pinGroups: state.pinGroups.filter((_, i) => i !== idx) })}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">Selected Pins/Groups</p>
                <div className="flex flex-wrap gap-2 p-3 bg-zinc-50 rounded-lg border border-zinc-100 min-h-[50px]">
                  {group.pins.map((pin, pIdx) => (
                    <span key={pIdx} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-bold bg-zinc-900 text-white">
                      {pin}
                      <button 
                        onClick={() => {
                          const newList = [...state.pinGroups];
                          newList[idx].pins = newList[idx].pins.filter((_, i) => i !== pIdx);
                          setState({ ...state, pinGroups: newList });
                        }}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase">Available Pins/Groups</p>
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-2 border border-zinc-100 rounded">
                  {availableItems.filter(item => !group.pins.includes(item) && item !== group.name).map((item, iIdx) => (
                    <button
                      key={iIdx}
                      onClick={() => {
                        const newList = [...state.pinGroups];
                        newList[idx].pins = [...newList[idx].pins, item];
                        setState({ ...state, pinGroups: newList });
                      }}
                      className="px-2 py-1 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTSET_PSET_FSET = () => {
    const tsetNames = activeTableSet === 'read' 
      ? ['read_init_tset', 'read_tset', 'read_end_tset']
      : ['read_init_Q_tset', 'read_Qx_tset', 'read_end_Q_tset', 'pgm_init_tset', 'pgm_tset', 'pgm_end_tset'];
    
    const fsetNames = activeTableSet === 'read'
      ? ['read_init_fset', 'read_fset', 'read_end_fset']
      : ['read_init_Q_fset', 'read_set_Q_fset', 'read_end_Q_fset', 'pgm_init_fset', 'pgm_fset', 'pgm_end_fset'];

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-zinc-200 w-fit">
          <button 
            onClick={() => setActiveTableSet('read')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTableSet === 'read' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            READ MODE
          </button>
          <button 
            onClick={() => setActiveTableSet('normal')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTableSet === 'normal' ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            NORMAL / PGM
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">TSET_TABLE</h3>
              <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded">
                {activeTableSet === 'read' ? 'time_table_read' : 'time_table_normal'}
              </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {tsetNames.map(name => (
                <div key={name} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                  <p className="text-xs font-bold text-zinc-900">{name}</p>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    {name === 'read_tset' ? `PRD T2=${100 + state.readModeParams.taa}ns` : 'Standard timing'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">FSET_TABLE</h3>
              <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded">
                {activeTableSet === 'read' ? 'format_table_read' : 'format_table_normal'}
              </span>
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {fsetNames.map(name => (
                <div key={name} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg">
                  <p className="text-xs font-bold text-zinc-900">{name}</p>
                  {name === 'read_fset' && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {state.readModeParams.pinStatuses.map((ps, idx) => (
                        <span key={idx} className="text-[8px] bg-white border border-zinc-200 px-1 rounded">
                          {ps.pin}: {ps.status === 'H/L' ? 'G2H/L' : ps.status}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">PSET_TABLE</h3>
              <span className="text-[10px] font-mono bg-zinc-100 px-2 py-0.5 rounded">period_table_normal</span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2">
              {state.periods.map(p => (
                <div key={p} className="p-2 bg-zinc-50 border border-zinc-100 rounded text-[10px] font-mono">
                  {getPsetName(p)}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderVariables = () => {
    const maxX = getBitRange(state.addressMapping.x.msb, state.addressMapping.x.lsb);
    const maxY = getBitRange(state.addressMapping.y.msb, state.addressMapping.y.lsb);

    return (
      <div className="space-y-8 pb-20">
        {/* Address Mapping Variables */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Address Mapping Variables</h3>
            <span className="text-[10px] text-zinc-400 italic">Derived from Socket X/Y mapping</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-1">
              <label className="text-[10px] uppercase text-zinc-400 font-bold">MAX_X</label>
              <div className="text-sm font-mono font-bold text-zinc-900">{maxX}</div>
            </div>
            <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-1">
              <label className="text-[10px] uppercase text-zinc-400 font-bold">MAX_Y</label>
              <div className="text-sm font-mono font-bold text-zinc-900">{maxY}</div>
            </div>
            <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-1">
              <label className="text-[10px] uppercase text-zinc-400 font-bold">FIX_X</label>
              <div className="text-sm font-mono font-bold text-zinc-900">0x0</div>
            </div>
            <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-1">
              <label className="text-[10px] uppercase text-zinc-400 font-bold">FIX_Y</label>
              <div className="text-sm font-mono font-bold text-zinc-900">0x0</div>
            </div>
          </div>
        </section>

        {/* Q Option Variables */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Q Option Data</h3>
            <span className="text-[10px] text-zinc-400 italic">Parsed from "Q option" Excel sheet</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {state.qData.map((entry, idx) => (
              <div key={idx} className="p-3 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-1">
                <label className="text-[8px] uppercase text-zinc-400 font-bold">{entry.name}</label>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-zinc-400 font-mono">0x</span>
                  <input 
                    className="w-full bg-transparent border-none p-0 text-xs font-mono focus:ring-0 outline-none"
                    value={entry.value}
                    maxLength={2}
                    onChange={(e) => {
                      const newList = [...state.qData];
                      newList[idx] = { ...newList[idx], value: e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '') };
                      setState({ ...state, qData: newList });
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Power Variables */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Power Variables</h3>
            <span className="text-[10px] text-zinc-400 italic">Parsed from "power" Excel sheet</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'VDDMIN_READ', value: state.power.read.vdd.min, mode: 'read', group: 'vdd', subKey: 'min' },
              { label: 'VDDTYP_READ', value: state.power.read.vdd.typ, mode: 'read', group: 'vdd', subKey: 'typ' },
              { label: 'VDDMAX_READ', value: state.power.read.vdd.max, mode: 'read', group: 'vdd', subKey: 'max' },
              { label: 'VPPMIN_READ', value: state.power.read.vpp.min, mode: 'read', group: 'vpp', subKey: 'min' },
              { label: 'VPPTYP_READ', value: state.power.read.vpp.typ, mode: 'read', group: 'vpp', subKey: 'typ' },
              { label: 'VPPMAX_READ', value: state.power.read.vpp.max, mode: 'read', group: 'vpp', subKey: 'max' },
            ].map((v, idx) => (
              <div key={idx} className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-1">
                <label className="text-[10px] uppercase text-zinc-400 font-bold">{v.label}</label>
                <div className="flex items-center gap-1">
                  <input 
                    type="number"
                    step="0.01"
                    className="w-full bg-transparent border-none p-0 text-sm font-mono font-bold focus:ring-0 outline-none"
                    value={v.value}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const newPower = JSON.parse(JSON.stringify(state.power));
                      newPower[v.mode][v.group][v.subKey] = val;
                      setState({ ...state, power: newPower });
                    }}
                  />
                  <span className="text-xs text-zinc-400">V</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Custom Variables */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Custom Variables</h3>
            <button 
              onClick={() => setState({ ...state, variables: [...state.variables, { name: 'NEW_VAR', value: '0' }] })}
              className="flex items-center gap-1 px-2 py-1 bg-zinc-900 text-white rounded text-[10px] hover:bg-zinc-800 transition-colors"
            >
              <Plus size={12} /> Add
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.variables.map((v, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white p-3 rounded-xl border border-zinc-200 shadow-sm">
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-mono font-bold"
                  value={v.name}
                  onChange={(e) => {
                    const newList = [...state.variables];
                    newList[idx].name = e.target.value;
                    setState({ ...state, variables: newList });
                  }}
                  placeholder="NAME"
                />
                <div className="w-px h-4 bg-zinc-200" />
                <input 
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs text-zinc-500"
                  value={v.value}
                  onChange={(e) => {
                    const newList = [...state.variables];
                    newList[idx].value = e.target.value;
                    setState({ ...state, variables: newList });
                  }}
                  placeholder="VALUE"
                />
                <button 
                  onClick={() => setState({ ...state, variables: state.variables.filter((_, i) => i !== idx) })}
                  className="text-zinc-300 hover:text-red-500 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
  };
  const renderFlows = () => {
    const allTests = [
      'vcc_open_short_test',
      'continuit_test',
      'InputLeakageHigh',
      'InputLeakageLow',
      'OutputLeakageHigh',
      'OutputLeakageLow',
      ...state.tests.map(t => t.name)
    ];

    const allBranches = [
      ...allTests,
      ...Array.from({ length: 100 }, (_, i) => `Bin${i + 1}`)
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-black tracking-tight text-zinc-900">TEST FLOW CONFIGURATION</h2>
          <button 
            onClick={() => {
              const newFlow = {
                name: `New_Flow_${state.flows.length + 1}`,
                entries: [{ testName: allTests[0], passBranch: allTests[1] || 'Bin1', failBranch: 'Bin5' }]
              };
              setState({ ...state, flows: [...state.flows, newFlow] });
            }}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-xs font-bold hover:bg-zinc-800 transition-all shadow-lg"
          >
            <Plus size={16} /> Add Flow
          </button>
        </div>

        <div className="grid gap-8">
          {state.flows.map((flow, fIdx) => (
            <div key={fIdx} className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-zinc-100 rounded-lg">
                    <Activity size={20} className="text-zinc-900" />
                  </div>
                  <input 
                    className="text-lg font-bold bg-transparent border-none focus:ring-0 outline-none"
                    value={flow.name}
                    onChange={(e) => {
                      const newFlows = [...state.flows];
                      newFlows[fIdx].name = e.target.value;
                      setState({ ...state, flows: newFlows });
                    }}
                  />
                </div>
                <button 
                  onClick={() => setState({ ...state, flows: state.flows.filter((_, i) => i !== fIdx) })}
                  className="text-zinc-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="overflow-hidden border border-zinc-100 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-100">
                      <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Test Name</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Pass Branch (Test or Bin)</th>
                      <th className="px-4 py-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Fail Branch (Test or Bin)</th>
                      <th className="px-4 py-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {flow.entries.map((entry, eIdx) => (
                      <tr key={eIdx} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="px-4 py-2">
                          <select 
                            className="w-full bg-transparent border-none text-xs font-mono focus:ring-0"
                            value={entry.testName}
                            onChange={(e) => {
                              const newFlows = [...state.flows];
                              newFlows[fIdx].entries[eIdx].testName = e.target.value;
                              setState({ ...state, flows: newFlows });
                            }}
                          >
                            {allTests.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <select 
                            className="w-full bg-transparent border-none text-xs font-mono focus:ring-0"
                            value={entry.passBranch}
                            onChange={(e) => {
                              const newFlows = [...state.flows];
                              newFlows[fIdx].entries[eIdx].passBranch = e.target.value;
                              setState({ ...state, flows: newFlows });
                            }}
                          >
                            {allBranches.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <select 
                            className="w-full bg-transparent border-none text-xs font-mono focus:ring-0"
                            value={entry.failBranch}
                            onChange={(e) => {
                              const newFlows = [...state.flows];
                              newFlows[fIdx].entries[eIdx].failBranch = e.target.value;
                              setState({ ...state, flows: newFlows });
                            }}
                          >
                            {allBranches.map(b => <option key={b} value={b}>{b}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <button 
                            onClick={() => {
                              const newFlows = [...state.flows];
                              newFlows[fIdx].entries = newFlows[fIdx].entries.filter((_, i) => i !== eIdx);
                              setState({ ...state, flows: newFlows });
                            }}
                            className="text-zinc-300 hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <button 
                  onClick={() => {
                    const newFlows = [...state.flows];
                    const lastEntry = newFlows[fIdx].entries[newFlows[fIdx].entries.length - 1];
                    newFlows[fIdx].entries.push({
                      testName: lastEntry?.passBranch || allTests[0],
                      passBranch: allTests[allTests.indexOf(lastEntry?.passBranch) + 1] || 'Bin1',
                      failBranch: 'Bin5'
                    });
                    setState({ ...state, flows: newFlows });
                  }}
                  className="w-full py-3 text-[10px] font-bold text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all border-t border-zinc-100 uppercase tracking-widest"
                >
                  + Add Entry
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSocket = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {state.socket.map((pin, idx) => (
        <div key={pin.id} className="p-4 bg-white border border-zinc-200 rounded-lg shadow-sm hover:border-zinc-400 transition-colors">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400">DP{pin.id}</span>
            <input 
              className="text-sm font-semibold bg-transparent border-none focus:ring-0 text-right w-24"
              value={pin.name}
              onChange={(e) => {
                const newSocket = [...state.socket];
                newSocket[idx].name = e.target.value;
                setState({ ...state, socket: newSocket });
              }}
            />
          </div>
          <select 
            className="w-full text-xs bg-zinc-50 border-zinc-200 rounded p-1"
            value={pin.type}
            onChange={(e) => {
              const newSocket = [...state.socket];
              newSocket[idx].type = e.target.value;
              setState({ ...state, socket: newSocket });
            }}
          >
            <option value="POWER_PIN">POWER_PIN</option>
            <option value="INPUT_PIN">INPUT_PIN</option>
            <option value="IO_PIN">IO_PIN</option>
            <option value="OUTPUT_PIN">OUTPUT_PIN</option>
          </select>
        </div>
      ))}
    </div>
  );

  const renderCycleTable = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Cycle Table Configuration</h2>
        <span className="text-[10px] font-mono bg-zinc-900 text-white px-3 py-1 rounded-full shadow-lg shadow-zinc-900/20">cycle_table_read</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">TSET_TABLE</p>
          <p className="text-sm font-mono font-bold">time_table_read</p>
        </div>
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">FSET_TABLE</p>
          <p className="text-sm font-mono font-bold">format_table_read</p>
        </div>
        <div className="p-4 bg-white border border-zinc-200 rounded-xl shadow-sm">
          <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">PSET_TABLE</p>
          <p className="text-sm font-mono font-bold">period_table_normal</p>
        </div>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">Cycle Name</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">TSET</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">FSET</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-wider">PSET</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: 'read_init_Q_cyc', tset: 'read_init_Q_tset', fset: 'read_init_Q_fset', pset: 'p2us_pset' },
              { name: 'read_set_Q_cyc', tset: 'read_Qx_tset', fset: 'read_set_Q_fset', pset: 'p3us_pset' },
              { name: 'read_end_Q_cyc', tset: 'read_end_Q_tset', fset: 'read_end_Q_fset', pset: 'p2us_pset' },
              { name: 'read_init_cyc', tset: 'read_init_tset', fset: 'read_init_fset', pset: 'p1us_pset' },
              { name: 'read_cyc', tset: 'read_tset', fset: 'read_fset', pset: 'p5us_pset' },
              { name: 'read_end_cyc', tset: 'read_end_tset', fset: 'read_end_fset', pset: 'p1us_pset' },
            ].map((entry, idx) => (
              <tr key={idx} className="border-t border-zinc-100 hover:bg-zinc-50 transition-colors">
                <td className="p-4 text-xs font-bold text-zinc-900">{entry.name}</td>
                <td className="p-4 text-xs font-mono text-zinc-500">{entry.tset}</td>
                <td className="p-4 text-xs font-mono text-zinc-500">{entry.fset}</td>
                <td className="p-4 text-xs font-mono text-zinc-500">{entry.pset}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTests = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Test Configuration</h2>
        <button 
          onClick={() => setState({ ...state, tests: [...state.tests, { name: 'new_test', type: 'read', data: '' }] })}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900 text-white rounded-md text-sm hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} /> Add Test
        </button>
      </div>
      <div className="grid gap-6">
        {state.tests.map((test, idx) => (
          <div key={idx} className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <input 
                  className="text-lg font-bold bg-transparent border-none focus:ring-0 outline-none w-64"
                  value={test.name}
                  onChange={(e) => {
                    const newList = [...state.tests];
                    newList[idx].name = e.target.value;
                    setState({ ...state, tests: newList });
                  }}
                />
              </div>
              <button 
                onClick={() => setState({ ...state, tests: state.tests.filter((_, i) => i !== idx) })}
                className="text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {test.name.toLowerCase().includes('read') && (
              <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-zinc-400">Read Mode Parameters</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold text-zinc-400">TAA:</label>
                      <input 
                        type="number"
                        className="w-16 p-1 bg-white border border-zinc-200 rounded text-xs"
                        value={state.readModeParams.taa}
                        onChange={(e) => setState({
                          ...state,
                          readModeParams: { ...state.readModeParams, taa: parseInt(e.target.value) || 0 }
                        })}
                      />
                      <span className="text-[10px] text-zinc-400">ns</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-[10px] font-bold text-zinc-400">Period:</label>
                      <input 
                        type="number"
                        className="w-16 p-1 bg-white border border-zinc-200 rounded text-xs"
                        value={state.readModeParams.period}
                        onChange={(e) => setState({
                          ...state,
                          readModeParams: { ...state.readModeParams, period: parseInt(e.target.value) || 0 }
                        })}
                      />
                      <span className="text-[10px] text-zinc-400">ns</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {state.readModeParams.pinStatuses.map((ps, sIdx) => (
                    <div key={sIdx} className="flex items-center gap-2 bg-white p-2 rounded border border-zinc-200 shadow-sm">
                      <input 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-[10px] font-bold"
                        value={ps.pin}
                        onChange={(e) => {
                          const newList = [...state.readModeParams.pinStatuses];
                          newList[sIdx].pin = e.target.value;
                          setState({ ...state, readModeParams: { ...state.readModeParams, pinStatuses: newList } });
                        }}
                      />
                      <select 
                        className="bg-zinc-50 border border-zinc-100 rounded text-[10px] p-0.5"
                        value={ps.status}
                        onChange={(e) => {
                          const newList = [...state.readModeParams.pinStatuses];
                          newList[sIdx].status = e.target.value;
                          setState({ ...state, readModeParams: { ...state.readModeParams, pinStatuses: newList } });
                        }}
                      >
                        <option value="H/L">H/L</option>
                        <option value="H">H</option>
                        <option value="L">L</option>
                      </select>
                      <button 
                        onClick={() => {
                          const newList = state.readModeParams.pinStatuses.filter((_, i) => i !== sIdx);
                          setState({ ...state, readModeParams: { ...state.readModeParams, pinStatuses: newList } });
                        }}
                        className="text-zinc-300 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                  <button 
                    onClick={() => setState({
                      ...state,
                      readModeParams: { ...state.readModeParams, pinStatuses: [...state.readModeParams.pinStatuses, { pin: '', status: 'H/L' }] }
                    })}
                    className="flex items-center justify-center gap-1 p-2 border border-dashed border-zinc-300 rounded text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <Plus size={12} /> <span className="text-[10px] font-bold">Add Pin</span>
                  </button>
                </div>
              </div>
            )}

            <textarea 
              className="w-full h-48 p-4 bg-zinc-900 text-zinc-100 font-mono text-xs rounded-lg focus:ring-2 focus:ring-zinc-500 outline-none"
              value={test.data}
              onChange={(e) => {
                const newList = [...state.tests];
                newList[idx].data = e.target.value;
                setState({ ...state, tests: newList });
              }}
              placeholder="Enter test logic here..."
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderSequences = () => {
    const getDpsFromPin = (pinName: string) => {
      const name = pinName.toUpperCase();
      const hasVdd2 = state.socket.some(p => p.name.toUpperCase() === 'VDD2');
      if (hasVdd2) {
        if (name === 'VDD2') return 'VPP1';
        if (name === 'DVDD2') return 'VCC1';
        if (name === 'VDD') return 'VCC0';
        if (name === 'DVDD') return 'DVDD';
        if (name === 'VPP') return 'VPP0';
      } else {
        if (name === 'VDD') return 'VCC0';
        if (name === 'DVDD') return 'VCC1';
        if (name === 'VPP') return 'VPP0';
      }
      return name;
    };

    const powerUpDps = state.powerUpSequence.map(p => getDpsFromPin(p));
    const powerDownDps = [...powerUpDps].reverse();

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Power Up Sequence</h3>
            <div className="space-y-3">
              {powerUpDps.map((dps, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 p-3 bg-zinc-50 border border-zinc-100 rounded-lg font-mono text-sm font-bold">
                    SET({dps}, MAIN)
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Power Down Sequence</h3>
            <div className="space-y-3">
              {powerDownDps.map((dps, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-6 h-6 bg-zinc-400 text-white rounded-full flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 p-3 bg-zinc-50 border border-zinc-100 rounded-lg font-mono text-sm font-bold">
                    {dps.toLowerCase()}_0v_dps, SET({dps}, MAIN)
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPreview = () => (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Generated Code Preview</h2>
        <button 
          onClick={() => {
            const blob = new Blob([generateCode()], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'test_program.txt';
            a.click();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
        >
          <Download size={18} /> Download Code
        </button>
      </div>
      <div className="flex-1 bg-zinc-900 rounded-xl p-6 overflow-auto border border-zinc-800 shadow-2xl">
        <pre className="text-zinc-300 font-mono text-sm leading-relaxed">
          {generateCode()}
        </pre>
      </div>
    </div>
  );

  const renderSetQPreview = () => (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Set Q Preview</h2>
        <button 
          onClick={() => {
            const blob = new Blob([generateSetQCode()], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Q_set.ktl';
            a.click();
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Download size={18} /> Download Q Set Code
        </button>
      </div>
      <div className="flex-1 bg-zinc-900 rounded-xl p-6 overflow-auto border border-zinc-800 shadow-2xl">
        <pre className="text-zinc-300 font-mono text-sm leading-relaxed">
          {generateSetQCode()}
        </pre>
      </div>
    </div>
  );

  const tabs = [
    { id: 'socket', label: 'Socket', icon: <Cpu size={18} /> },
    { id: 'pinGroups', label: 'Pin Group', icon: <Layers size={18} /> },
    { id: 'power', label: 'Power', icon: <Zap size={18} /> },
    { id: 'tsets_psets_fsets', label: 'T/P/F SET', icon: <Settings size={18} /> },
    { id: 'cycleTable', label: 'Cycle Table', icon: <Table size={18} /> },
    { id: 'sequences', label: 'SEQUENCE', icon: <Zap size={18} /> },
    { id: 'tests', label: 'TEST', icon: <Zap size={18} /> },
    { id: 'flows', label: 'FLOW', icon: <Activity size={18} /> },
    { id: 'variables', label: 'VARIABLE', icon: <Variable size={18} /> },
    { id: 'mgnReadData', label: 'MGN Read', icon: <Table size={18} /> },
    { id: 'preview', label: 'Preview', icon: <FileCode size={18} /> },
    { id: 'setQPreview', label: 'Set Q Preview', icon: <FileCode size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-zinc-900 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-zinc-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Zap size={24} fill="white" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight">AUTO GEN</h1>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">v1.0.0</p>
            </div>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-all group"
          >
            <Upload size={18} className="text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            <span>Upload Excel</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx, .xls" 
            onChange={handleFileUpload} 
          />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                activeTab === tab.id 
                  ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-900/20' 
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                {tab.icon}
                <span className="text-sm font-medium">{tab.label}</span>
              </div>
              {activeTab === tab.id && <ChevronRight size={16} />}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-zinc-100">
          <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200">
            <p className="text-[10px] font-bold text-zinc-400 uppercase mb-2">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium">Ready to generate</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">Configuration</p>
            <h2 className="text-3xl font-bold tracking-tight">
              {tabs.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          <div className="flex gap-3">
            <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="min-h-[600px]"
          >
            {activeTab === 'socket' && renderSocket()}
            {activeTab === 'pinGroups' && renderPinGroups()}
            {activeTab === 'power' as any && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2"><Zap size={20} className="text-amber-500" /> VCC0 Voltages</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['min', 'typ', 'max'].map(v => (
                        <div key={v} className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">{v}</label>
                          <input 
                            type="number" step="0.01"
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                            value={state.power.read.vdd[v as keyof typeof state.power.read.vdd]}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const newPower = JSON.parse(JSON.stringify(state.power));
                              newPower.read.vdd[v] = val;
                              setState({ ...state, power: newPower });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
                    <h3 className="text-lg font-bold flex items-center gap-2"><Zap size={20} className="text-amber-500" /> VPP Voltages</h3>
                    <div className="grid grid-cols-3 gap-4">
                      {['min', 'typ', 'max'].map(v => (
                        <div key={v} className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">{v}</label>
                          <input 
                            type="number" step="0.01"
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                            value={state.power.read.vpp[v as keyof typeof state.power.read.vpp]}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const newPower = JSON.parse(JSON.stringify(state.power));
                              newPower.read.vpp[v] = val;
                              setState({ ...state, power: newPower });
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white border border-zinc-200 rounded-xl shadow-sm space-y-4">
                  <h3 className="text-lg font-bold flex items-center gap-2"><Layers size={20} className="text-blue-500" /> Address Mapping (X/Y)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-zinc-400 uppercase">X Range</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">LSB Pin</label>
                          <input 
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                            value={state.addressMapping.x.lsb}
                            onChange={(e) => setState({
                              ...state,
                              addressMapping: { ...state.addressMapping, x: { ...state.addressMapping.x, lsb: e.target.value } }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">MSB Pin</label>
                          <input 
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                            value={state.addressMapping.x.msb}
                            onChange={(e) => setState({
                              ...state,
                              addressMapping: { ...state.addressMapping, x: { ...state.addressMapping.x, msb: e.target.value } }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-zinc-400 uppercase">Y Range</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">LSB Pin</label>
                          <input 
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                            value={state.addressMapping.y.lsb}
                            onChange={(e) => setState({
                              ...state,
                              addressMapping: { ...state.addressMapping, y: { ...state.addressMapping.y, lsb: e.target.value } }
                            })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-zinc-400">MSB Pin</label>
                          <input 
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded text-sm"
                            value={state.addressMapping.y.msb}
                            onChange={(e) => setState({
                              ...state,
                              addressMapping: { ...state.addressMapping, y: { ...state.addressMapping.y, msb: e.target.value } }
                            })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === 'tsets_psets_fsets' && renderTSET_PSET_FSET()}
            {activeTab === 'cycleTable' && renderCycleTable()}
            {activeTab === 'tests' && renderTests()}
            {activeTab === 'flows' && renderFlows()}
            {activeTab === 'sequences' && renderSequences()}
            {activeTab === 'preview' && renderPreview()}
            {activeTab === 'setQPreview' && renderSetQPreview()}
            {activeTab === 'variables' && renderVariables()}
            {activeTab === 'mgnReadData' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">MGN Read Data</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                      {state.mgnReadData.length} Modes Found
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                  {state.mgnReadData.map((mode, idx) => (
                    <div key={idx} className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
                      <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                            {idx + 1}
                          </div>
                          <h3 className="text-lg font-bold tracking-tight">{mode.name}</h3>
                        </div>
                        <div className="flex gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">PTM Value</p>
                            <p className="text-sm font-mono font-bold text-indigo-600">{mode.ptm}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">Period (ns)</p>
                            <p className="text-sm font-mono font-bold text-blue-600">{mode.period}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase">TAA (ns)</p>
                            <p className="text-sm font-mono font-bold text-emerald-600">{mode.taa}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                            <Settings size={14} className="text-zinc-400" /> Timing Params
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">TAS</p>
                              <p className="text-sm font-mono">{mode.tas}ns</p>
                            </div>
                            <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-100">
                              <p className="text-[10px] font-bold text-zinc-400 uppercase mb-1">TAH</p>
                              <p className="text-sm font-mono">{mode.tah}ns</p>
                            </div>
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                          <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                            <Layers size={14} className="text-zinc-400" /> Pin Status Table
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {mode.pinStatuses.map((ps, pIdx) => (
                              <div key={pIdx} className="flex items-center justify-between p-3 bg-white border border-zinc-100 rounded-xl shadow-sm hover:border-zinc-300 transition-colors">
                                <span className="text-xs font-bold text-zinc-600">{ps.pin}</span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                                  ps.status === 'H' ? 'bg-emerald-100 text-emerald-700' :
                                  ps.status === 'L' ? 'bg-rose-100 text-rose-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {ps.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {state.mgnReadData.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-zinc-300 rounded-3xl">
                    <Table size={48} className="text-zinc-200 mb-4" />
                    <p className="text-zinc-500 font-medium">No MGN Read data found. Please upload an Excel file with an "mgn read" sheet.</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
