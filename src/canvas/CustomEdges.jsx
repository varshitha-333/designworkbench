import React, { useState } from 'react';
import { getSmoothStepPath, BaseEdge, EdgeLabelRenderer } from '@xyflow/react';
import { DiagramStore } from '../store/DiagramStore';

export default function CustomBezierEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
    offset: 16
  });

  const [hovered, setHovered] = useState(false);

  return (
    <>
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={15}
        className="react-flow__edge-interaction cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          stroke: hovered ? '#ec4899' : '#8b5cf6', 
          strokeWidth: 3,
          transition: 'stroke 0.15s ease' 
        }} 
      />
      
      {hovered && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
              zIndex: 1000,
            }}
            className="nodrag nopan"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                DiagramStore.removeEdge(id);
              }}
              className="w-4 h-4 rounded-full bg-red-500 hover:bg-red-650 text-white flex items-center justify-center border-none cursor-pointer shadow shadow-red-500/30 transition-transform hover:scale-110 active:scale-95"
              style={{ padding: 0 }}
              title="Delete Connection"
            >
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                <path d="M1 1L7 7M7 1L1 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const customEdgeTypes = {
  customEdge: CustomBezierEdge
};
