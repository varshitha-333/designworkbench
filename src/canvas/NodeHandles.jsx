import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { ShapeRegistry } from './ShapeRegistry';

export default function NodeHandles({ nodeId, type, edges = [] }) {
  // Look up portsCount from ShapeRegistry
  let shapeConfig = null;
  for (const libraryKey in ShapeRegistry) {
    if (ShapeRegistry[libraryKey]?.[type]) {
      shapeConfig = ShapeRegistry[libraryKey][type];
      break;
    }
  }
  const portsCount = shapeConfig?.portsCount || 4;

  const isHandleConnected = (handleId) => {
    return edges.some(e => 
      (e.source === nodeId && e.sourceHandle === handleId) ||
      (e.target === nodeId && e.targetHandle === handleId)
    );
  };

  const getHandles = () => {
    const list = [];
    if (portsCount === 8) {
      // 8 ports: top, bottom, left, right + top-left, top-right, bottom-left, bottom-right
      list.push(
        { id: 'left', side: Position.Left, style: { left: -5, top: '50%', transform: 'translateY(-50%)' } },
        { id: 'right', side: Position.Right, style: { right: -5, top: '50%', transform: 'translateY(-50%)' } },
        { id: 'top', side: Position.Top, style: { top: -5, left: '50%', transform: 'translateX(-50%)' } },
        { id: 'bottom', side: Position.Bottom, style: { bottom: -5, left: '50%', transform: 'translateX(-50%)' } },
        
        { id: 'top-left', side: Position.Top, style: { left: '15%', top: -5, transform: 'translateX(-50%)' } },
        { id: 'top-right', side: Position.Top, style: { left: '85%', top: -5, transform: 'translateX(-50%)' } },
        { id: 'bottom-left', side: Position.Bottom, style: { left: '15%', bottom: -5, transform: 'translateX(-50%)' } },
        { id: 'bottom-right', side: Position.Bottom, style: { left: '85%', bottom: -5, transform: 'translateX(-50%)' } }
      );
    } else if (portsCount === 6) {
      // 6 ports (message queue): left-1, left-2, right-1, right-2, top, bottom
      list.push(
        { id: 'left-1', side: Position.Left, style: { top: '33%', left: -5 } },
        { id: 'left-2', side: Position.Left, style: { top: '66%', left: -5 } },
        { id: 'right-1', side: Position.Right, style: { top: '33%', right: -5 } },
        { id: 'right-2', side: Position.Right, style: { top: '66%', right: -5 } },
        { id: 'top', side: Position.Top, style: { left: '50%', top: -5, transform: 'translateX(-50%)' } },
        { id: 'bottom', side: Position.Bottom, style: { left: '50%', bottom: -5, transform: 'translateX(-50%)' } }
      );
    } else {
      // 4 ports default: top, bottom, left, right
      list.push(
        { id: 'left', side: Position.Left, style: { left: -5, top: '50%', transform: 'translateY(-50%)' } },
        { id: 'right', side: Position.Right, style: { right: -5, top: '50%', transform: 'translateY(-50%)' } },
        { id: 'top', side: Position.Top, style: { top: -5, left: '50%', transform: 'translateX(-50%)' } },
        { id: 'bottom', side: Position.Bottom, style: { bottom: -5, left: '50%', transform: 'translateX(-50%)' } }
      );
    }
    return list;
  };

  const handles = getHandles();

  return (
    <>
      {handles.map(({ id, side, style }) => {
        const targetId = `${id}-target`;
        const sourceId = `${id}-source`;
        const connected = isHandleConnected(targetId) || isHandleConnected(sourceId);

        const handleClass = `
          w-2.5 h-2.5 rounded-full border transition-all duration-150 cursor-crosshair
          ${connected 
            ? 'bg-emerald-500 border-white shadow shadow-emerald-500/50 opacity-100 scale-105' 
            : 'bg-slate-650 border-slate-550 opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 hover:bg-violet-500 hover:border-white'
          }
        `;

        return (
          <React.Fragment key={id}>
            <Handle
              type="target"
              position={side}
              id={targetId}
              className={handleClass}
              style={{ ...style, zIndex: 10 }}
            />
            <Handle
              type="source"
              position={side}
              id={sourceId}
              className={handleClass}
              style={{ ...style, zIndex: 11 }}
            />
          </React.Fragment>
        );
      })}
    </>
  );
}
