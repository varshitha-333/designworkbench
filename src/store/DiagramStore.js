import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';

const vanillaStore = createStore((set) => ({
  nodes: [],
  edges: [],
  activeMode: 'system_design', // system_design | oop | ai_agents
  layoutMode: 'smart',         // smart | horizontal | vertical
  selectedNodeId: null,
  contextMenu: null,
  canvasContextMenu: null,
  previewFix: null,
  activeLibraryTab: 'generic', // generic | system_design | ai_agents | oop
  currentExerciseId: null,
  tutorPhaseIndex: 0
}));

class DiagramStoreWrapper {
  getState() {
    return vanillaStore.getState();
  }

  setState(nextState) {
    vanillaStore.setState(nextState);
  }

  subscribe(listener) {
    return vanillaStore.subscribe(listener);
  }

  addNode(node) {
    const { nodes } = this.getState();
    const exists = nodes.some(n => n.id === node.id);
    if (exists) return;
    this.setState({ nodes: [...nodes, node] });
  }

  updateNode(id, updates) {
    const { nodes } = this.getState();
    const newNodes = nodes.map(n => 
      n.id === id ? { ...n, ...updates } : n
    );
    this.setState({ nodes: newNodes });
  }

  removeNode(id) {
    const { nodes, edges } = this.getState();
    const newNodes = nodes.filter(n => n.id !== id);
    const newEdges = edges.filter(e => e.source !== id && e.target !== id);
    this.setState({ 
      nodes: newNodes, 
      edges: newEdges,
      selectedNodeId: this.getState().selectedNodeId === id ? null : this.getState().selectedNodeId
    });
  }

  addEdge(edge) {
    const { edges } = this.getState();
    const exists = edges.some(e => 
      e.source === edge.source && 
      e.target === edge.target && 
      e.sourceHandle === edge.sourceHandle && 
      e.targetHandle === edge.targetHandle
    );
    if (exists) return;
    this.setState({ edges: [...edges, edge] });
  }

  removeEdge(id) {
    const { edges } = this.getState();
    this.setState({ edges: edges.filter(e => e.id !== id) });
  }

  clear() {
    this.setState({
      nodes: [],
      edges: [],
      selectedNodeId: null,
      contextMenu: null,
      canvasContextMenu: null,
      previewFix: null,
      currentExerciseId: null,
      tutorPhaseIndex: 0
    });
  }

  setMode(mode) {
    this.setState({
      activeMode: mode,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      contextMenu: null,
      canvasContextMenu: null,
      previewFix: null,
      activeLibraryTab: mode, // system_design, oop, ai_agents correspond to their activeMode key names
      currentExerciseId: null,
      tutorPhaseIndex: 0
    });
  }
}

export const DiagramStore = new DiagramStoreWrapper();

export function useDiagramStore() {
  const state = useStore(vanillaStore);
  return [state, DiagramStore];
}

