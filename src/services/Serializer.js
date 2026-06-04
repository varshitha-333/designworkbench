import { DiagramStore } from '../store/DiagramStore';

export const Serializer = {
  serializeStoreToJSON(state) {
    return JSON.stringify({
      nodes: state.nodes.map(n => ({
        id: n.id,
        type: n.type,
        name: n.name,
        position: n.position || { x: n.x, y: n.y },
        properties: n.properties || {},
        color: n.color,
        metadata: n.metadata || { createdAt: Date.now(), mode: state.activeMode }
      })),
      edges: state.edges.map(e => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle
      })),
      metadata: {
        mode: state.activeMode,
        timestamp: Date.now()
      }
    }, null, 2);
  },

  deserializeJSONToStore(jsonString) {
    try {
      const data = typeof jsonString === 'string' ? JSON.parse(jsonString) : jsonString;
      if (data && Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        const adaptedNodes = data.nodes.map(n => {
          const x = n.position?.x ?? n.x ?? 100;
          const y = n.position?.y ?? n.y ?? 100;
          return {
            id: n.id,
            type: n.type,
            name: n.name,
            position: { x, y },
            x,
            y,
            w: n.w ?? 180,
            h: n.h ?? 96,
            properties: n.properties || {},
            color: n.color || '#3b82f6',
            metadata: n.metadata || { createdAt: Date.now(), mode: data.metadata?.mode || 'system_design' }
          };
        });

        DiagramStore.setState({
          nodes: adaptedNodes,
          edges: data.edges.map(e => ({
            id: e.id || `edge_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            source: e.source,
            target: e.target,
            sourceHandle: e.sourceHandle || 'right-source',
            targetHandle: e.targetHandle || 'left-target'
          })),
          activeMode: data.metadata?.mode || 'system_design'
        });
        return true;
      }
    } catch (e) {
      console.error("Failed to deserialize diagram JSON:", e);
    }
    return false;
  }
};
