import React, { useCallback, useRef, useEffect, useState } from 'react';
import { 
  ReactFlow, 
  ReactFlowProvider, 
  Background, 
  MiniMap, 
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useDiagramStore, DiagramStore } from '../store/DiagramStore';
import { ShapeRegistry } from './ShapeRegistry';
import { customNodeTypes, getNodeDimensions } from './CustomNodes';
import { customEdgeTypes } from './CustomEdges';
import { AutoLayoutEngine } from '../layout/AutoLayoutEngine';
import { Plus, Minus, Maximize2 } from 'lucide-react';

function CanvasInner() {
  const [storeState] = useDiagramStore();
  const reactFlowInstance = useReactFlow();
  const containerRef = useRef(null);

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const rfNodesRef = useRef([]);
  const rfEdgesRef = useRef([]);

  // Map DiagramStore nodes/edges format to React Flow format, preserving references
  const syncStoreToRF = useCallback((storeNodes, currentSelectedId) => {
    const prevRFNodes = rfNodesRef.current || [];
    
    const nextRFNodes = storeNodes.map(sn => {
      const existingRFNode = prevRFNodes.find(n => n.id === sn.id);
      
      const nextPosition = sn.position || { x: sn.x, y: sn.y };
      const nextSelected = currentSelectedId === sn.id;
      
      const dims = getNodeDimensions(sn.type);
      const targetWidth = dims.width;
      const targetHeight = sn.h || dims.height;
      
      if (existingRFNode) {
        // If the node is currently dragging, ignore position changes from the store
        const positionChanged = 
          !existingRFNode.dragging && (
            existingRFNode.position?.x !== nextPosition?.x ||
            existingRFNode.position?.y !== nextPosition?.y
          );
          
        const dataChanged = 
          existingRFNode.data.name !== sn.name ||
          existingRFNode.data.type !== sn.type ||
          existingRFNode.data.color !== sn.color ||
          existingRFNode.data.properties !== sn.properties;
          
        const selectedChanged = existingRFNode.selected !== nextSelected;
        const heightChanged = existingRFNode.style.height !== targetHeight || existingRFNode.style.width !== targetWidth;
        
        if (dataChanged || positionChanged || selectedChanged || heightChanged) {
          return {
            ...existingRFNode,
            position: positionChanged ? nextPosition : existingRFNode.position,
            selected: nextSelected,
            data: {
              name: sn.name,
              type: sn.type,
              color: sn.color,
              properties: sn.properties
            },
            style: { width: targetWidth, height: targetHeight }
          };
        }
        
        return existingRFNode;
      }
      
      return {
        id: sn.id,
        type: 'customNode',
        position: nextPosition,
        data: {
          name: sn.name,
          type: sn.type,
          color: sn.color,
          properties: sn.properties
        },
        style: { width: targetWidth, height: targetHeight },
        selected: nextSelected
      };
    });
    
    rfNodesRef.current = nextRFNodes;
    return nextRFNodes;
  }, []);

  const syncEdgesStoreToRF = useCallback((storeEdges) => {
    const prevRFEdges = rfEdgesRef.current || [];
    
    const nextRFEdges = storeEdges.map(se => {
      const existingRFEdge = prevRFEdges.find(e => e.id === se.id);
      
      if (existingRFEdge) {
        const changed = 
          existingRFEdge.source !== se.source ||
          existingRFEdge.target !== se.target ||
          existingRFEdge.sourceHandle !== se.sourceHandle ||
          existingRFEdge.targetHandle !== se.targetHandle;
          
        if (changed) {
          return {
            ...existingRFEdge,
            source: se.source,
            target: se.target,
            sourceHandle: se.sourceHandle,
            targetHandle: se.targetHandle
          };
        }
        return existingRFEdge;
      }
      
      return {
        id: se.id,
        source: se.source,
        target: se.target,
        sourceHandle: se.sourceHandle,
        targetHandle: se.targetHandle,
        type: 'customEdge'
      };
    });
    
    rfEdgesRef.current = nextRFEdges;
    return nextRFEdges;
  }, []);

  // Sync from DiagramStore to local state
  useEffect(() => {
    setNodes((currentLocalNodes) => {
      rfNodesRef.current = currentLocalNodes;
      return syncStoreToRF(storeState.nodes, storeState.selectedNodeId);
    });
  }, [storeState.nodes, storeState.selectedNodeId, syncStoreToRF]);

  useEffect(() => {
    setEdges((currentLocalEdges) => {
      rfEdgesRef.current = currentLocalEdges;
      return syncEdgesStoreToRF(storeState.edges);
    });
  }, [storeState.edges, syncEdgesStoreToRF]);

  // Handle local node drags/selections and batch updates safely outside render loop
  const onNodesChange = useCallback((changes) => {
    let updatedNodes;
    setNodes((nds) => {
      updatedNodes = applyNodeChanges(changes, nds);
      return updatedNodes;
    });

    // Defer DiagramStore updates to avoid rendering phase conflicts
    Promise.resolve().then(() => {
      if (!updatedNodes) return;
      
      const storeNodes = DiagramStore.getState().nodes;
      let storeNodesChanged = false;
      const nextStoreNodes = storeNodes.map(sn => {
        const ln = updatedNodes.find(n => n.id === sn.id);
        const snPos = sn.position || { x: sn.x || 0, y: sn.y || 0 };
        if (ln && ln.position && (ln.position.x !== snPos.x || ln.position.y !== snPos.y)) {
          storeNodesChanged = true;
          return {
            ...sn,
            position: ln.position,
            x: ln.position.x,
            y: ln.position.y
          };
        }
        return sn;
      });

      if (storeNodesChanged) {
        DiagramStore.setState({ nodes: nextStoreNodes });
      }

      // Sync selection to DiagramStore
      const selectChange = changes.find(c => c.type === 'select');
      if (selectChange) {
        const currentSelected = DiagramStore.getState().selectedNodeId;
        const targetSelected = selectChange.selected ? selectChange.id : null;
        if (targetSelected && currentSelected !== targetSelected) {
          DiagramStore.setState({ selectedNodeId: targetSelected });
        } else if (!selectChange.selected && currentSelected === selectChange.id) {
          DiagramStore.setState({ selectedNodeId: null });
        }
      }

      // Handle removals
      const removeChange = changes.find(c => c.type === 'remove');
      if (removeChange) {
        DiagramStore.removeNode(removeChange.id);
      }
    });
  }, []);

  // Handle local edge changes and batch removals safely outside render loop
  const onEdgesChange = useCallback((changes) => {
    setEdges((eds) => applyEdgeChanges(changes, eds));
    
    Promise.resolve().then(() => {
      changes.forEach(change => {
        if (change.type === 'remove') {
          DiagramStore.removeEdge(change.id);
        }
      });
    });
  }, []);

  // Handle port handle drag connections
  const onConnect = useCallback((connection) => {
    const edgeId = `edge_${Date.now().toString().slice(-4)}_${Math.random().toString(36).slice(2, 6)}`;
    DiagramStore.addEdge({
      id: edgeId,
      source: connection.source,
      target: connection.target,
      sourceHandle: connection.sourceHandle,
      targetHandle: connection.targetHandle
    });
  }, []);

  const onNodeDragStop = useCallback(() => {
    // Left empty to allow the user to drag and arrange nodes freely without snapping back.
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shapeKey = e.dataTransfer.getData('application/tldraw-shape');
    if (!shapeKey) return;

    const flowPosition = reactFlowInstance.screenToFlowPosition({
      x: e.clientX,
      y: e.clientY
    });

    const mode = storeState.activeMode;
    let shapeConfig = null;
    for (const lib in ShapeRegistry) {
      if (ShapeRegistry[lib]?.[shapeKey]) {
        shapeConfig = ShapeRegistry[lib][shapeKey];
        break;
      }
    }
    shapeConfig = shapeConfig || {};

    const count = storeState.nodes.filter(n => n.type === shapeKey).length + 1;
    const labelText = `${shapeConfig.label || shapeKey} ${count}`;
    
    const newId = `node_${shapeKey}_${Date.now().toString().slice(-4)}`;
    const newNode = {
      id: newId,
      type: shapeKey,
      name: labelText,
      position: flowPosition,
      x: flowPosition.x,
      y: flowPosition.y,
      color: shapeConfig.color || '#3b82f6',
      properties: { ...shapeConfig.properties } || {},
      metadata: {
        createdAt: Date.now(),
        mode
      }
    };
    
    DiagramStore.addNode(newNode);
  };

  const onContextMenu = (e) => {
    e.preventDefault();
    const target = e.target;
    if (target.closest('.react-flow__pane')) {
      const flowPosition = reactFlowInstance.screenToFlowPosition({
        x: e.clientX,
        y: e.clientY
      });
      
      DiagramStore.setState({
        canvasContextMenu: {
          x: e.clientX,
          y: e.clientY,
          pageX: flowPosition.x,
          pageY: flowPosition.y
        }
      });
    }
  };

  const loadTemplate = (templateType) => {
    let mode = 'system_design';
    if (templateType === 'parking_lot') {
      mode = 'oop';
    } else if (templateType === 'chatgpt_agent') {
      mode = 'ai_agents';
    } else if (templateType === 'ecommerce') {
      mode = 'system_design';
    }

    DiagramStore.setState({
      activeMode: mode,
      activeLibraryTab: mode === 'oop' ? 'oop' : mode === 'ai_agents' ? 'ai_agents' : 'system_design',
      nodes: [],
      edges: [],
      selectedNodeId: null,
      currentExerciseId: templateType,
      tutorPhaseIndex: 0
    });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full relative react-flow-canvas-wrapper" 
      style={{ minHeight: '400px' }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onContextMenu={onContextMenu}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={customNodeTypes}
        edgeTypes={customEdgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        snapToGrid={true}
        snapGrid={[8, 8]}
        fitView
        zoomOnScroll={true}
      >
        <Background color="#334155" gap={16} size={1} variant="dots" />
      </ReactFlow>

      {/* Floating Zoom & Fit Canvas Controls */}
      <div className="absolute bottom-4 left-4 z-10 flex items-center space-x-1.5 bg-[#070b13]/85 border border-slate-800/80 p-1 rounded-xl shadow-xl backdrop-blur-md">
        <button
          onClick={() => reactFlowInstance.zoomIn()}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 transition-all cursor-pointer font-bold border-0 bg-transparent"
          title="Zoom In"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => reactFlowInstance.zoomOut()}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 transition-all cursor-pointer font-bold border-0 bg-transparent"
          title="Zoom Out"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => reactFlowInstance.fitView({ padding: 0.2 })}
          className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-900/60 transition-all cursor-pointer font-bold border-0 bg-transparent"
          title="Zoom to Fit"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>
      </div>


    </div>
  );
}

export default function ArchitectureCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
export { ArchitectureCanvas };
