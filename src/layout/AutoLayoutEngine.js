import ELK from 'elkjs/lib/elk.bundled.js';
import { DiagramStore } from '../store/DiagramStore';
import { ShapeRegistry } from '../canvas/ShapeRegistry';
import { getNodeDimensions } from '../canvas/CustomNodes';

const elk = new ELK();

const getModeTier = (mode, semanticType) => {
  if (mode === 'system_design') {
    switch (semanticType) {
      case 'user':
      case 'actor':
        return 0; // Users / Clients
      case 'cdn':
      case 'cloud':
        return 1; // CDN / Ingress Cloud
      case 'gateway':
      case 'api':
        return 2; // API Gateway / API Endpoint
      case 'lb':
      case 'decision':
        return 3; // Load Balancer / Branching Decision
      case 'server':
      case 'microservice':
      case 'container':
      case 'process':
      case 'square':
      case 'rectangle':
        return 4; // Application Layer
      case 'cache':
      case 'hexagon':
      case 'circle':
        return 5; // Cache
      case 'queue':
        return 6; // Queue
      case 'worker':
        return 7; // Workers
      case 'database':
      case 'storage':
      case 'datastore':
      case 'cylinder':
      case 'document':
        return 8; // Database / Storage / Document Datastore
      default:
        return 4; // default app layer
    }
  } else if (mode === 'ai_agents') {
    switch (semanticType) {
      case 'user':
      case 'actor':
        return 0; // User Input
      case 'agent':
      case 'square':
      case 'rectangle':
        return 1; // Agent Coordinator
      case 'planner':
      case 'router':
      case 'llm':
      case 'cloud':
      case 'decision':
        return 2; // Agents / LLM / Router Planner
      case 'tool':
      case 'process':
      case 'api':
        return 3; // Execution Tools / APIs
      case 'memory':
      case 'kb':
      case 'datastore':
      case 'cylinder':
      case 'document':
      case 'hexagon':
      case 'circle':
        return 4; // Memory / Knowledge Base
      default:
        return 2; // default Agent layer
    }
  } else if (mode === 'oop') {
    switch (semanticType) {
      case 'interface':
        return 0; // Interface
      case 'abstract':
        return 1; // Abstract
      case 'class':
      case 'package':
      case 'square':
      case 'rectangle':
        return 2; // Class
      case 'object':
      case 'actor':
      case 'circle':
      case 'cylinder':
        return 3; // Object Instance
      default:
        return 2; // default Class layer
    }
  }
  return 2;
};

export const detectSemanticType = (name = '', nodeType = '') => {
  const label = name.toLowerCase();
  
  // System Design semantic types
  if (label.includes('user') || label.includes('client') || label.includes('passenger') || label.includes('customer') || label.includes('actor') || nodeType === 'user' || nodeType === 'actor') {
    return 'user';
  }
  if (label.includes('cdn') || label.includes('edge') || nodeType === 'cdn') {
    return 'cdn';
  }
  if (label.includes('load balancer') || label.includes('lb') || label.includes('balancer') || nodeType === 'lb') {
    return 'lb';
  }
  if (label.includes('gateway') || label.includes('api gateway') || label.includes('proxy') || nodeType === 'gateway') {
    return 'gateway';
  }
  if (label.includes('cache') || label.includes('redis') || label.includes('memcached') || nodeType === 'cache') {
    return 'cache';
  }
  if (label.includes('queue') || label.includes('kafka') || label.includes('buffer') || label.includes('rabbitmq') || nodeType === 'queue') {
    return 'queue';
  }
  if (label.includes('database') || label.includes('db') || label.includes('postgres') || label.includes('sql') || label.includes('cassandra') || nodeType === 'database') {
    return 'database';
  }
  if (label.includes('storage') || label.includes('s3') || nodeType === 'storage') {
    return 'storage';
  }
  if (label.includes('worker') || label.includes('daemon') || nodeType === 'worker') {
    return 'worker';
  }
  if (label.includes('server') || label.includes('service') || label.includes('api') || label.includes('handler') || nodeType === 'server' || nodeType === 'microservice') {
    return 'server';
  }
  
  // AI Agents semantic types
  if (label.includes('coordinator') || label.includes('supervisor') || nodeType === 'agent') {
    return 'agent';
  }
  if (label.includes('planner') || label.includes('task') || nodeType === 'planner') {
    return 'planner';
  }
  if (label.includes('tool') || label.includes('web search') || label.includes('calculator') || nodeType === 'tool') {
    return 'tool';
  }
  if (label.includes('memory') || label.includes('state') || nodeType === 'memory') {
    return 'memory';
  }
  if (label.includes('llm') || label.includes('gpt') || label.includes('claude') || nodeType === 'llm') {
    return 'llm';
  }
  if (label.includes('knowledge') || label.includes('vector') || label.includes('kb') || label.includes('pinecone') || nodeType === 'kb') {
    return 'kb';
  }
  
  // OOP semantic types
  if (label.includes('interface') || nodeType === 'interface') {
    return 'interface';
  }
  if (label.includes('abstract') || nodeType === 'abstract') {
    return 'abstract';
  }
  if (label.includes('class') || nodeType === 'class') {
    return 'class';
  }
  if (label.includes('object') || label.includes('instance') || nodeType === 'object') {
    return 'object';
  }

  // Generic shapes matching
  if (label.includes('rectangle') || nodeType === 'rectangle') return 'rectangle';
  if (label.includes('square') || nodeType === 'square') return 'square';
  if (label.includes('circle') || nodeType === 'circle') return 'circle';
  if (label.includes('diamond') || nodeType === 'diamond') return 'diamond';
  if (label.includes('cylinder') || nodeType === 'cylinder') return 'cylinder';
  if (label.includes('hexagon') || nodeType === 'hexagon') return 'hexagon';
  if (label.includes('cloud') || nodeType === 'cloud') return 'cloud';
  if (label.includes('document') || nodeType === 'document') return 'document';
  if (label.includes('triangle') || nodeType === 'triangle') return 'triangle';
  if (label.includes('pentagon') || nodeType === 'pentagon') return 'pentagon';
  if (label.includes('octagon') || nodeType === 'octagon') return 'octagon';
  if (label.includes('container') || nodeType === 'container') return 'container';
  if (label.includes('group') || nodeType === 'group') return 'group';
  if (label.includes('swimlane') || nodeType === 'swimlane') return 'swimlane';
  if (label.includes('actor') || nodeType === 'actor') return 'actor';
  if (label.includes('process') || nodeType === 'process') return 'process';
  if (label.includes('decision') || nodeType === 'decision') return 'decision';
  if (label.includes('datastore') || nodeType === 'datastore') return 'datastore';
  if (label.includes('api') || nodeType === 'api') return 'api';

  // Fallback
  return nodeType;
};

const computeTopologicalLayers = (nodes, edges, activeMode = 'system_design') => {
  const levels = {};

  // 1. Initialize levels to semantic base ranks
  nodes.forEach(n => {
    const semanticType = detectSemanticType(n.name, n.type);
    levels[n.id] = getModeTier(activeMode, semanticType);
  });

  // 2. Filter edges to keep only forward directed edges (strict DAG based on ranks)
  const filteredEdges = edges.filter(e => {
    const srcNode = nodes.find(n => n.id === e.source);
    const tgtNode = nodes.find(n => n.id === e.target);
    if (!srcNode || !tgtNode) return false;

    const srcRank = getModeTier(activeMode, detectSemanticType(srcNode.name, srcNode.type));
    const tgtRank = getModeTier(activeMode, detectSemanticType(tgtNode.name, tgtNode.type));

    if (srcRank < tgtRank) return true;
    if (srcRank > tgtRank) return false; // break cycle/back-edge

    // Same rank: break cycles alphabetically by ID to guarantee a DAG
    return srcNode.id.localeCompare(tgtNode.id) < 0;
  });

  // 3. Relax edges on the DAG to compute longest path levels
  for (let i = 0; i < nodes.length; i++) {
    let changed = false;
    filteredEdges.forEach(e => {
      if (levels[e.target] < levels[e.source] + 1) {
        levels[e.target] = levels[e.source] + 1;
        changed = true;
      }
    });
    if (!changed) break;
  }

  return levels;
};

const getOptimalPortId = (node, side, handleType, allEdges, currentEdgeId) => {
  let shapeConfig = null;
  for (const lib in ShapeRegistry) {
    if (ShapeRegistry[lib]?.[node.type]) {
      shapeConfig = ShapeRegistry[lib][node.type];
      break;
    }
  }
  const portsCount = shapeConfig?.portsCount || 4;

  const sameSideEdges = allEdges.filter(e => {
    const isTarget = e.target === node.id && handleType === 'target';
    const isSource = e.source === node.id && handleType === 'source';
    return isTarget || isSource;
  });

  sameSideEdges.sort((a, b) => a.id.localeCompare(b.id));
  const index = sameSideEdges.findIndex(e => e.id === currentEdgeId);
  const rank = index >= 0 ? index : 0;

  const suffix = handleType === 'source' ? '-source' : '-target';

  if (portsCount === 6) {
    if (side === 'left') {
      return `${rank % 2 === 0 ? 'left-1' : 'left-2'}${suffix}`;
    }
    if (side === 'right') {
      return `${rank % 2 === 0 ? 'right-1' : 'right-2'}${suffix}`;
    }
  } else if (portsCount === 8) {
    if (side === 'top') {
      const ports = ['top', 'top-left', 'top-right'];
      return `${ports[rank % 3]}${suffix}`;
    }
    if (side === 'bottom') {
      const ports = ['bottom', 'bottom-left', 'bottom-right'];
      return `${ports[rank % 3]}${suffix}`;
    }
  }

  return `${side}${suffix}`;
};

export const AutoLayoutEngine = {
  async layout(nodes, edges, options = {}) {
    if (nodes.length === 0) return { nodes: [], edges: [] };
    
    const { activeMode = 'system_design', layoutDirection = 'RIGHT' } = options;

    const nodePortsMap = {};
    const topoLayers = edges.length > 0 ? computeTopologicalLayers(nodes, edges, activeMode) : {};

    // Build elk node definitions
    const elkNodes = nodes.map(n => {
      const labelText = n.name || '';
      const estimatedHeight = Math.max(80, Math.ceil(labelText.length / 20) * 16 + 20);

      // Determine ELK layout tier using topological levels or semantic fallback
      const semanticType = detectSemanticType(n.name, n.type);
      const tierIndex = edges.length > 0 ? (topoLayers[n.id] || 0) : getModeTier(activeMode, semanticType);

      // Lookup portsCount
      let shapeConfig = null;
      for (const lib in ShapeRegistry) {
        if (ShapeRegistry[lib]?.[n.type]) {
          shapeConfig = ShapeRegistry[lib][n.type];
          break;
        }
      }
      const portsCount = shapeConfig?.portsCount || 4;

      // Define ports list for ELK. ELK will map edges to these ports.
      const ports = [];
      
      // Standard 4 handles
      ports.push(
        { id: `${n.id}-left`, layoutOptions: { "elk.port.side": "WEST" } },
        { id: `${n.id}-right`, layoutOptions: { "elk.port.side": "EAST" } },
        { id: `${n.id}-top`, layoutOptions: { "elk.port.side": "NORTH" } },
        { id: `${n.id}-bottom`, layoutOptions: { "elk.port.side": "SOUTH" } }
      );

      if (portsCount === 8) {
        // Corners
        ports.push(
          { id: `${n.id}-top-left`, layoutOptions: { "elk.port.side": "NORTH" } },
          { id: `${n.id}-top-right`, layoutOptions: { "elk.port.side": "NORTH" } },
          { id: `${n.id}-bottom-left`, layoutOptions: { "elk.port.side": "SOUTH" } },
          { id: `${n.id}-bottom-right`, layoutOptions: { "elk.port.side": "SOUTH" } }
        );
      } else if (portsCount === 6) {
        // Queue specific (adds left-1, left-2, right-1, right-2)
        ports.push(
          { id: `${n.id}-left-1`, layoutOptions: { "elk.port.side": "WEST" } },
          { id: `${n.id}-left-2`, layoutOptions: { "elk.port.side": "WEST" } },
          { id: `${n.id}-right-1`, layoutOptions: { "elk.port.side": "EAST" } },
          { id: `${n.id}-right-2`, layoutOptions: { "elk.port.side": "EAST" } }
        );
      }

      nodePortsMap[n.id] = ports.map(p => p.id);

      const dims = getNodeDimensions(n.type);
      const targetWidth = dims.width;
      const targetHeight = n.h || dims.height;

      return {
        id: n.id,
        width: targetWidth,
        height: targetHeight,
        ports,
        layoutOptions: {
          "elk.layer": String(tierIndex)
        }
      };
    });

    const cleanPortId = (handleId) => {
      if (!handleId) return '';
      return handleId.replace('-source', '').replace('-target', '');
    };

    const elkEdges = edges.map(e => {
      const cleanSourceHandle = cleanPortId(e.sourceHandle || 'right');
      const cleanTargetHandle = cleanPortId(e.targetHandle || 'left');
      
      let sourcePort = `${e.source}-${cleanSourceHandle}`;
      let targetPort = `${e.target}-${cleanTargetHandle}`;
      
      // Validate source port
      const validSourcePorts = nodePortsMap[e.source] || [];
      if (!validSourcePorts.includes(sourcePort)) {
        const fallback = validSourcePorts.find(p => p.endsWith('-right') || p.endsWith('-right-1') || p.endsWith('-right-2'));
        sourcePort = fallback || validSourcePorts[0] || `${e.source}-right`;
      }
      
      // Validate target port
      const validTargetPorts = nodePortsMap[e.target] || [];
      if (!validTargetPorts.includes(targetPort)) {
        const fallback = validTargetPorts.find(p => p.endsWith('-left') || p.endsWith('-left-1') || p.endsWith('-left-2'));
        targetPort = fallback || validTargetPorts[0] || `${e.target}-left`;
      }

      return {
        id: e.id,
        sources: [sourcePort],
        targets: [targetPort]
      };
    });

    const graph = {
      id: "root",
      layoutOptions: {
        "elk.algorithm": "layered",
        "elk.direction": layoutDirection,
        "elk.edgeRouting": "ORTHOGONAL",
        "elk.portConstraints": "FIXED_SIDE",
        "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
        "elk.layered.nodePlacement.bk.fixedAlignment": "BALANCED",
        "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
        "elk.layered.layering.strategy": "USER_DEFINED",
        "elk.separateConnectedComponents": "true",
        "elk.spacing.nodeNode": "140",
        "elk.layered.spacing.nodeNodeBetweenLayers": "160",
        "elk.spacing.portPort": "24",
        "elk.spacing.edgeEdge": "20",
        "elk.spacing.edgeNode": "40",
        "elk.layered.spacing.edgeNodeBetweenLayers": "40"
      },
      children: elkNodes,
      edges: elkEdges
    };

    try {
      const result = await elk.layout(graph);
      
      const layoutedNodes = nodes.map(node => {
        const elkNode = result.children.find(c => c.id === node.id);
        if (elkNode) {
          const x = Math.round(elkNode.x);
          const y = Math.round(elkNode.y);
          return {
            ...node,
            position: { x, y },
            x,
            y,
            h: elkNode.height
          };
        }
        return node;
      });

      // Distribute ports and directions based on calculated positions to prevent overlaps
      const layoutedEdges = edges.map(edge => {
        const sourceNode = layoutedNodes.find(n => n.id === edge.source);
        const targetNode = layoutedNodes.find(n => n.id === edge.target);
        if (!sourceNode || !targetNode) return edge;

        const sDims = getNodeDimensions(sourceNode.type);
        const tDims = getNodeDimensions(targetNode.type);

        const sWidth = sDims.width;
        const sHeight = sourceNode.h || sDims.height;
        const tWidth = tDims.width;
        const tHeight = targetNode.h || tDims.height;

        const sCenterX = sourceNode.x + sWidth / 2;
        const sCenterY = sourceNode.y + sHeight / 2;
        const tCenterX = targetNode.x + tWidth / 2;
        const tCenterY = targetNode.y + tHeight / 2;

        const dx = tCenterX - sCenterX;
        const dy = tCenterY - sCenterY;

        let sourceSide = 'right';
        let targetSide = 'left';

        if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0) {
            sourceSide = 'right';
            targetSide = 'left';
          } else {
            sourceSide = 'left';
            targetSide = 'right';
          }
        } else {
          if (dy > 0) {
            sourceSide = 'bottom';
            targetSide = 'top';
          } else {
            sourceSide = 'top';
            targetSide = 'bottom';
          }
        }

        const sourceHandle = getOptimalPortId(sourceNode, sourceSide, 'source', edges, edge.id);
        const targetHandle = getOptimalPortId(targetNode, targetSide, 'target', edges, edge.id);

        return {
          ...edge,
          sourceHandle,
          targetHandle
        };
      });

      return { nodes: layoutedNodes, edges: layoutedEdges };
    } catch (err) {
      console.error("ELK Layout Engine crash fallback: ", err);
      return { nodes, edges };
    }
  },

  async triggerAutoLayout() {
    const state = DiagramStore.getState();
    const mode = state.layoutMode || 'smart';
    const activeMode = state.activeMode;

    let layoutDirection = 'RIGHT'; // default: Horizontal (LR)
    if (mode === 'vertical') {
      layoutDirection = 'DOWN';
    } else if (mode === 'horizontal') {
      layoutDirection = 'RIGHT';
    } else {
      // smart mode-aware layouts direction
      layoutDirection = activeMode === 'system_design' ? 'RIGHT' : 'DOWN';
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = await this.layout(state.nodes, state.edges, { activeMode, layoutDirection });
    DiagramStore.setState({ nodes: layoutedNodes, edges: layoutedEdges });
  }
};
