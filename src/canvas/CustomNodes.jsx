import React from 'react';
import * as Icons from 'lucide-react';
import { useDiagramStore, DiagramStore } from '../store/DiagramStore';
import NodeHandles from './NodeHandles';

const IconMap = {
  // Generic Shapes
  square: Icons.Square,
  rectangle: Icons.Square, // Use square with custom dimensions
  circle: Icons.Circle,
  diamond: Icons.Activity, // decision representation
  cylinder: Icons.Database,
  hexagon: Icons.Hexagon,
  cloud: Icons.Cloud,
  document: Icons.FileText,
  triangle: Icons.Triangle,
  pentagon: Icons.Hexagon, // fallback
  octagon: Icons.Octagon,
  container: Icons.Box,
  group: Icons.FolderOpen,
  swimlane: Icons.Columns,
  actor: Icons.User,
  process: Icons.Play,
  decision: Icons.GitFork,
  datastore: Icons.Folder,
  api: Icons.Link,

  // System Design Shapes
  user: Icons.Users,
  cdn: Icons.Globe,
  lb: Icons.Sliders,
  gateway: Icons.Radio,
  server: Icons.Server,
  microservice: Icons.Network,
  cache: Icons.Cpu,
  queue: Icons.Layers,
  database: Icons.Database,
  storage: Icons.HardDrive,
  
  // AI Agents Shapes
  agent: Icons.Bot,
  planner: Icons.Compass,
  tool: Icons.Wrench,
  memory: Icons.Brain,
  llm: Icons.Sparkles,
  kb: Icons.BookOpen,
  router: Icons.Route,
  
  // OOP Shapes
  class: Icons.Boxes,
  interface: Icons.FileCode,
  abstract: Icons.Binary,
  object: Icons.Box,
  package: Icons.Package,
  
  // DSA Fallbacks
  array: Icons.Grid,
  linked_list: Icons.GitCommit,
  stack: Icons.Coins,
  queue_dsa: Icons.ArrowRightLeft,
  tree_node: Icons.Network,
  graph_node: Icons.Share2
};

export const mapTypeToShape = (type) => {
  const t = type.toLowerCase();
  // Generic
  if (t === 'square') return 'square';
  if (t === 'rectangle' || t === 'document' || t === 'process') return 'rectangle';
  if (t === 'circle' || t === 'user' || t === 'actor' || t === 'api' || t === 'memory') return 'circle';
  if (t === 'diamond' || t === 'decision' || t === 'planner' || t === 'router') return 'diamond';
  if (t === 'cylinder' || t === 'database' || t === 'datastore' || t === 'storage' || t === 'kb') return 'cylinder';
  if (t === 'hexagon' || t === 'lb' || t === 'tool' || t === 'cache') return 'hexagon';
  if (t === 'cloud' || t === 'cdn' || t === 'gateway') return 'cloud';
  if (t === 'triangle') return 'triangle';
  if (t === 'pentagon') return 'pentagon';
  if (t === 'octagon') return 'octagon';
  if (t === 'container' || t === 'package' || t === 'group' || t === 'swimlane' || t === 'server' || t === 'microservice' || t === 'class' || t === 'interface' || t === 'abstract' || t === 'object' || t === 'llm' || t === 'agent') return 'container';
  return 'rectangle';
};

export const getNodeDimensions = (type) => {
  const shape = mapTypeToShape(type);
  switch (shape) {
    case 'square':
      return { width: 96, height: 96 };
    case 'circle':
      return { width: 96, height: 96 };
    case 'diamond':
    case 'triangle':
    case 'hexagon':
    case 'pentagon':
    case 'octagon':
      return { width: 104, height: 104 };
    case 'cloud':
      return { width: 112, height: 80 };
    case 'cylinder':
      return { width: 88, height: 104 };
    case 'container':
      return { width: 144, height: 72 };
    case 'rectangle':
    default:
      return { width: 144, height: 80 };
  }
};

const NodeShapeRenderer = ({ type, color, name, selected }) => {
  const shape = mapTypeToShape(type);
  const strokeColor = selected ? '#8b5cf6' : color;
  const strokeWidth = selected ? '3' : '2';
  const glowClass = selected ? 'drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : '';

  if (shape === 'square') {
    return (
      <div className="w-full h-full relative flex items-center justify-center select-none">
        <svg viewBox="0 0 100 100" className={`w-full h-full ${glowClass}`}>
          <rect x="6" y="6" width="88" height="88" rx="8" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
        <span className="absolute px-2.5 text-[10px] font-black text-center break-words text-slate-100 max-w-[80px] leading-tight select-none">
          {name}
        </span>
      </div>
    );
  }

  if (shape === 'circle') {
    return (
      <div className="w-full h-full relative flex items-center justify-center select-none">
        <svg viewBox="0 0 100 100" className={`w-full h-full ${glowClass}`}>
          <circle cx="50" cy="50" r="44" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
        <span className="absolute px-2.5 text-[10px] font-black text-center break-words text-slate-100 max-w-[80px] leading-tight select-none">
          {name}
        </span>
      </div>
    );
  }

  if (shape === 'diamond') {
    return (
      <div className="w-full h-full relative flex items-center justify-center select-none">
        <svg viewBox="0 0 100 100" className={`w-full h-full ${glowClass}`}>
          <polygon points="50,6 94,50 50,94 6,50" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
        <span className="absolute px-3 text-[9.5px] font-black text-center break-words text-slate-100 max-w-[76px] leading-tight select-none">
          {name}
        </span>
      </div>
    );
  }

  if (shape === 'triangle') {
    return (
      <div className="w-full h-full relative flex items-center justify-center select-none">
        <svg viewBox="0 0 100 100" className={`w-full h-full ${glowClass}`}>
          <polygon points="50,10 90,88 10,88" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
        <span className="absolute px-2 pt-5 text-[9.5px] font-black text-center break-words text-slate-100 max-w-[76px] leading-tight select-none">
          {name}
        </span>
      </div>
    );
  }

  if (shape === 'hexagon' || shape === 'pentagon' || shape === 'octagon') {
    let points = "50,6 90,26 90,74 50,94 10,74 10,26"; // hexagon default
    if (shape === 'pentagon') {
      points = "50,6 94,38 77,91 23,91 6,38";
    } else if (shape === 'octagon') {
      points = "31,6 69,6 94,31 94,69 69,94 31,94 6,69 6,31";
    }
    return (
      <div className="w-full h-full relative flex items-center justify-center select-none">
        <svg viewBox="0 0 100 100" className={`w-full h-full ${glowClass}`}>
          <polygon points={points} fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
        <span className="absolute px-3 text-[10px] font-black text-center break-words text-slate-100 max-w-[80px] leading-tight select-none">
          {name}
        </span>
      </div>
    );
  }

  if (shape === 'cloud') {
    return (
      <div className="w-full h-full relative flex items-center justify-center select-none">
        <svg viewBox="0 0 100 65" className={`w-full h-full ${glowClass}`}>
          <path d="M 18,45 C 10,45 6,35 14,28 C 12,15 28,10 38,16 C 46,6 64,8 70,18 C 82,14 88,26 84,36 C 92,42 86,52 78,51 C 70,52 24,52 18,45 Z" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
        <span className="absolute px-3 text-[9.5px] font-black text-center break-words text-slate-100 max-w-[82px] leading-tight select-none pt-2.5">
          {name}
        </span>
      </div>
    );
  }

  if (shape === 'cylinder') {
    return (
      <div className="w-full h-full relative flex items-center justify-center select-none">
        <svg viewBox="0 0 80 100" className={`w-full h-full ${glowClass}`}>
          <path d="M 6,18 A 34,14 0 0,0 74,18 L 74,82 A 34,14 0 0,1 6,82 Z M 6,18 L 6,82 A 34,14 0 0,0 74,82 L 74,18 A 34,14 0 0,0 6,18" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
          <ellipse cx="40" cy="18" rx="34" ry="14" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
        </svg>
        <span className="absolute px-2.5 text-[9.5px] font-black text-center break-words text-slate-100 max-w-[70px] leading-tight select-none pt-4">
          {name}
        </span>
      </div>
    );
  }

  if (shape === 'container') {
    return (
      <div className="w-full h-full relative flex items-center justify-center select-none">
        <svg viewBox="0 0 120 60" className={`w-full h-full ${glowClass}`}>
          <rect x="4" y="4" width="112" height="52" rx="8" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
          <rect x="8" y="8" width="104" height="44" rx="6" fill="none" stroke={strokeColor} strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
        </svg>
        <span className="absolute px-3 text-[10px] font-black text-center break-words text-slate-100 max-w-[110px] leading-tight select-none">
          {name}
        </span>
      </div>
    );
  }

  // Rectangle shape default
  return (
    <div className="w-full h-full relative flex items-center justify-center select-none">
      <svg viewBox="0 0 150 80" className={`w-full h-full ${glowClass}`}>
        <rect x="6" y="6" width="138" height="68" rx="8" fill="#0b101d" stroke={strokeColor} strokeWidth={strokeWidth} />
      </svg>
      <span className="absolute px-3 text-[10px] font-black text-center break-words text-slate-100 max-w-[130px] leading-tight select-none">
        {name}
      </span>
    </div>
  );
};

export const CustomNodeCard = ({ id, data, selected }) => {
  const { name, type, color = '#3b82f6' } = data;
  const [storeState] = useDiagramStore();

  return (
    <div 
      data-architecture-node="true"
      data-node-id={id}
      className="w-full h-full relative flex items-center justify-center cursor-pointer select-none group"
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
        DiagramStore.setState({
          contextMenu: {
            x: e.clientX,
            y: e.clientY,
            nodeId: id
          }
        });
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        DiagramStore.setState({ selectedNodeId: id });
      }}
      onClick={(e) => {
        e.stopPropagation();
        DiagramStore.setState({ selectedNodeId: id });
      }}
    >
      <NodeHandles nodeId={id} type={type} edges={storeState.edges} />
      <NodeShapeRenderer type={type} color={color} name={name} selected={selected} />
    </div>
  );
};

export const customNodeTypes = {
  customNode: CustomNodeCard
};
