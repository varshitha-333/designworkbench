import ELK from 'elkjs/lib/elk.bundled.js';
import { DiagramStore } from '../store/DiagramStore';
import { ShapeRegistry } from '../canvas/ShapeRegistry';
import { getNodeDimensions } from '../canvas/CustomNodes';

const elk = new ELK();

const getModeTier = (mode, semanticType) => {
  if (mode === 'system_design') {
    switch (semanticType) {
      case 'user':
        return 0; // Ingress
      case 'cdn':
      case 'lb':
      case 'gateway':
        return 1; // Gateway
      case 'server':
        return 2; // Service
      case 'cache':
      case 'queue':
      case 'database':
      case 'storage':
        return 3; // Storage
      default:
        return 2;
    }
  } else if (mode === 'ai_agents') {
    switch (semanticType) {
      case 'user':
        return 0; // User
      case 'agent':
        return 1; // Coordinator
      case 'planner':
      case 'router':
      case 'llm':
        return 2; // Agents
      case 'tool':
        return 3; // Tools
      case 'memory':
      case 'kb':
        return 4; // Memory
      default:
        return 2;
    }
  } else if (mode === 'oop') {
    switch (semanticType) {
      case 'interface':
        return 0; // Interface
      case 'abstract':
        return 1; // Abstract
      case 'class':
      case 'package':
        return 2; // Class
      case 'object':
        return 3; // Object
      default:
        return 2;
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

  // Fallback
  return nodeType;
};

export const AutoLayoutEngine = {
  async layout(nodes, edges, options = {}) {
    if (nodes.length === 0) return [];
    
    const { activeMode = 'system_design', layoutDirection = 'RIGHT' } = options;

    // Build elk node definitions
    const elkNodes = nodes.map(n => {
      const labelText = n.name || '';
      const estimatedHeight = Math.max(80, Math.ceil(labelText.length / 20) * 16 + 20);

      // Determine ELK layout tier using activeMode and semanticType
      const semanticType = detectSemanticType(n.name, n.type);
      const tierIndex = getModeTier(activeMode, semanticType);

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
        { id: `${n.id}-left-target`, layoutOptions: { "elk.port.side": "WEST" } },
        { id: `${n.id}-left-source`, layoutOptions: { "elk.port.side": "WEST" } },
        { id: `${n.id}-right-target`, layoutOptions: { "elk.port.side": "EAST" } },
        { id: `${n.id}-right-source`, layoutOptions: { "elk.port.side": "EAST" } },
        { id: `${n.id}-top-target`, layoutOptions: { "elk.port.side": "NORTH" } },
        { id: `${n.id}-top-source`, layoutOptions: { "elk.port.side": "NORTH" } },
        { id: `${n.id}-bottom-target`, layoutOptions: { "elk.port.side": "SOUTH" } },
        { id: `${n.id}-bottom-source`, layoutOptions: { "elk.port.side": "SOUTH" } }
      );

      if (portsCount === 8) {
        // Corners
        ports.push(
          { id: `${n.id}-top-left-target`, layoutOptions: { "elk.port.side": "NORTH" } },
          { id: `${n.id}-top-left-source`, layoutOptions: { "elk.port.side": "NORTH" } },
          { id: `${n.id}-top-right-target`, layoutOptions: { "elk.port.side": "NORTH" } },
          { id: `${n.id}-top-right-source`, layoutOptions: { "elk.port.side": "NORTH" } },
          { id: `${n.id}-bottom-left-target`, layoutOptions: { "elk.port.side": "SOUTH" } },
          { id: `${n.id}-bottom-left-source`, layoutOptions: { "elk.port.side": "SOUTH" } },
          { id: `${n.id}-bottom-right-target`, layoutOptions: { "elk.port.side": "SOUTH" } },
          { id: `${n.id}-bottom-right-source`, layoutOptions: { "elk.port.side": "SOUTH" } }
        );
      } else if (portsCount === 6) {
        // Queue specific (adds left-1, left-2, right-1, right-2)
        ports.push(
          { id: `${n.id}-left-1-target`, layoutOptions: { "elk.port.side": "WEST" } },
          { id: `${n.id}-left-1-source`, layoutOptions: { "elk.port.side": "WEST" } },
          { id: `${n.id}-left-2-target`, layoutOptions: { "elk.port.side": "WEST" } },
          { id: `${n.id}-left-2-source`, layoutOptions: { "elk.port.side": "WEST" } },
          { id: `${n.id}-right-1-target`, layoutOptions: { "elk.port.side": "EAST" } },
          { id: `${n.id}-right-1-source`, layoutOptions: { "elk.port.side": "EAST" } },
          { id: `${n.id}-right-2-target`, layoutOptions: { "elk.port.side": "EAST" } },
          { id: `${n.id}-right-2-source`, layoutOptions: { "elk.port.side": "EAST" } }
        );
      }

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

    const elkEdges = edges.map(e => {
      const sourcePort = e.sourceHandle ? `${e.source}-${e.sourceHandle}` : `${e.source}-right-source`;
      const targetPort = e.targetHandle ? `${e.target}-${e.targetHandle}` : `${e.target}-left-target`;
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
        "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
        "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
        "elk.layered.layering.strategy": "USER_DEFINED",
        "elk.separateConnectedComponents": "true",
        "elk.spacing.nodeNode": "100",
        "elk.layered.spacing.nodeNodeBetweenLayers": "140",
        "elk.spacing.portPort": "16",
        "elk.spacing.edgeEdge": "12"
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

      return layoutedNodes;
    } catch (err) {
      console.error("ELK Layout Engine crash fallback: ", err);
      return nodes;
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

    const layoutedNodes = await this.layout(state.nodes, state.edges, { activeMode, layoutDirection });
    DiagramStore.setState({ nodes: layoutedNodes });
  }
};
