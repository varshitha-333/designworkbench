import dagre from 'dagre';
import { DiagramStore } from '../store/DiagramStore';

export const AutoLayout = {
  layout(nodes, edges, direction = 'TB') {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    
    dagreGraph.setGraph({ rankdir: direction, nodesep: 100, ranksep: 120 });
    
    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: 180, height: 48 }); // compact node height
    });
    
    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });
    
    dagre.layout(dagreGraph);
    
    const layoutedNodes = nodes.map((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      
      const x = Math.round(nodeWithPosition.x - 90);
      const y = Math.round(nodeWithPosition.y - 24);
      
      return {
        ...node,
        position: { x, y },
        x,
        y
      };
    });
    
    return layoutedNodes;
  },

  layoutSmart(nodes, edges, activeMode) {
    const startY = 60;
    const rowHeight = 130;
    const canvasWidth = 600;
    const nodeWidth = 180;
    let tiers = [];

    if (activeMode === 'system_design') {
      const ingress = [];    // user
      const gateways = [];   // lb, gateway, cdn
      const application = [];// server
      const midTier = [];    // cache, queue
      const storage = [];    // database, storage

      nodes.forEach(n => {
        const type = (n.type || '').toLowerCase();
        if (type === 'user') ingress.push(n);
        else if (type === 'lb' || type === 'gateway' || type === 'cdn') gateways.push(n);
        else if (type === 'server') application.push(n);
        else if (type === 'cache' || type === 'queue') midTier.push(n);
        else if (type === 'database' || type === 'storage') storage.push(n);
        else application.push(n);
      });

      tiers = [ingress, gateways, application, midTier, storage];
    } else if (activeMode === 'ai_agents') {
      const userTier = [];       // user
      const orchestrator = [];   // agent
      const plannerTier = [];    // planner
      const supportTier = [];    // tool, memory
      const coreEngine = [];     // llm, kb

      nodes.forEach(n => {
        const type = (n.type || '').toLowerCase();
        if (type === 'user') userTier.push(n);
        else if (type === 'agent') orchestrator.push(n);
        else if (type === 'planner') plannerTier.push(n);
        else if (type === 'tool' || type === 'memory') supportTier.push(n);
        else if (type === 'llm' || type === 'kb') coreEngine.push(n);
        else orchestrator.push(n);
      });

      tiers = [userTier, orchestrator, plannerTier, supportTier, coreEngine];
    } else if (activeMode === 'oop') {
      const contract = [];       // interface
      const definitions = [];    // class, abstract
      const instances = [];      // object
      const scope = [];          // package

      nodes.forEach(n => {
        const type = (n.type || '').toLowerCase();
        if (type === 'interface') contract.push(n);
        else if (type === 'class' || type === 'abstract') definitions.push(n);
        else if (type === 'object') instances.push(n);
        else if (type === 'package') scope.push(n);
        else definitions.push(n);
      });

      tiers = [contract, definitions, instances, scope];
    } else {
      tiers = [nodes];
    }

    const activeTiers = tiers.filter(t => t.length > 0);
    const alignedNodes = [];

    activeTiers.forEach((tier, tierIdx) => {
      const y = startY + tierIdx * rowHeight;
      const count = tier.length;

      tier.forEach((node, nodeIdx) => {
        const x = (canvasWidth / (count + 1)) * (nodeIdx + 1) - nodeWidth / 2;
        const computedX = Math.round(x);
        const computedY = Math.round(y);
        alignedNodes.push({
          ...node,
          position: { x: computedX, y: computedY },
          x: computedX,
          y: computedY
        });
      });
    });

    return alignedNodes;
  },

  triggerAutoLayout() {
    const state = DiagramStore.getState();
    const mode = state.layoutMode || 'smart';
    let alignedNodes;

    if (mode === 'smart') {
      alignedNodes = this.layoutSmart(state.nodes, state.edges, state.activeMode);
    } else if (mode === 'horizontal') {
      alignedNodes = this.layout(state.nodes, state.edges, 'LR');
    } else {
      alignedNodes = this.layout(state.nodes, state.edges, 'TB');
    }

    DiagramStore.setState({ nodes: alignedNodes });
  }
};
