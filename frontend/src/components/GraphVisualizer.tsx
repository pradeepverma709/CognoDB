import React, { useRef, useEffect, useState } from 'react';
import { GraphData, GraphNode } from '../types';
import { ZoomIn, ZoomOut, RefreshCw, Info, X } from 'lucide-react';

interface GraphVisualizerProps {
  data: GraphData;
}

const TYPE_COLORS: Record<string, string> = {
  User: '#8b5cf6',      // Purple
  Movie: '#06b6d4',     // Cyan
  Actor: '#f59e0b',     // Amber
  Director: '#10b981',  // Emerald
  Genre: '#ec4899'      // Pink
};

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const nodesRef = useRef<(GraphNode & { x: number; y: number; vx: number; vy: number })[]>([]);
  const isDraggingRef = useRef(false);
  const dragNodeRef = useRef<GraphNode | null>(null);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initialize node layout positions with force simulation simulation step
  useEffect(() => {
    if (!data || !data.nodes) return;
    const width = 800;
    const height = 500;

    nodesRef.current = data.nodes.map((node, i) => {
      const angle = (i / data.nodes.length) * 2 * Math.PI;
      const radius = 180 + (i % 3) * 60;
      return {
        ...node,
        x: width / 2 + Math.cos(angle) * radius + (Math.random() * 20 - 10),
        y: height / 2 + Math.sin(angle) * radius + (Math.random() * 20 - 10),
        vx: 0,
        vy: 0
      };
    });
  }, [data]);

  // Main canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Filter nodes
      const activeNodes = nodesRef.current.filter(
        (n) => filterType === 'ALL' || n.type === filterType
      );
      const activeNodeIds = new Set(activeNodes.map((n) => n.id));

      // Draw Edges
      data.edges.forEach((edge) => {
        if (!activeNodeIds.has(edge.source) || !activeNodeIds.has(edge.target)) return;
        const sourceNode = nodesRef.current.find((n) => n.id === edge.source);
        const targetNode = nodesRef.current.find((n) => n.id === edge.target);
        if (!sourceNode || !targetNode) return;

        ctx.beginPath();
        ctx.moveTo(sourceNode.x, sourceNode.y);
        ctx.lineTo(targetNode.x, targetNode.y);
        ctx.strokeStyle = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target)
          ? '#a855f7'
          : 'rgba(71, 85, 105, 0.4)';
        ctx.lineWidth = selectedNode && (selectedNode.id === edge.source || selectedNode.id === edge.target) ? 2 : 1;
        ctx.setLineDash(edge.label === 'SIMILAR_TO' ? [4, 4] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // Draw Nodes
      activeNodes.forEach((node) => {
        const radius = node.type === 'Movie' ? 14 : 11;
        const color = TYPE_COLORS[node.type] || '#94a3b8';
        const isSelected = selectedNode?.id === node.id;

        // Outer Glow
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + 6, 0, 2 * Math.PI);
          ctx.fillStyle = `${color}44`;
          ctx.fill();
        }

        // Node Circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = isSelected ? '#ffffff' : '#0f172a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.font = isSelected ? 'bold 11px Inter, sans-serif' : '10px Inter, sans-serif';
        ctx.fillStyle = isSelected ? '#ffffff' : '#cbd5e1';
        ctx.textAlign = 'center';
        ctx.fillText(node.name.length > 14 ? node.name.slice(0, 12) + '..' : node.name, node.x, node.y + radius + 14);
      });

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [data, zoom, pan, selectedNode, filterType]);

  // Canvas Mouse Interactions (Drag & Select)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left - pan.x) / zoom;
    const mouseY = (e.clientY - rect.top - pan.y) / zoom;

    const clicked = nodesRef.current.find((n) => {
      const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
      return dist <= 16;
    });

    if (clicked) {
      dragNodeRef.current = clicked;
      setSelectedNode(clicked);
    } else {
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    if (dragNodeRef.current) {
      const mouseX = (e.clientX - rect.left - pan.x) / zoom;
      const mouseY = (e.clientY - rect.top - pan.y) / zoom;
      dragNodeRef.current.x = mouseX;
      dragNodeRef.current.y = mouseY;
    } else if (isDraggingRef.current) {
      const dx = e.clientX - lastMousePosRef.current.x;
      const dy = e.clientY - lastMousePosRef.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    }
  };

  const handleMouseUp = () => {
    dragNodeRef.current = null;
    isDraggingRef.current = false;
  };

  return (
    <div className="relative glass-panel rounded-3xl overflow-hidden border border-slate-800">
      {/* Top Control Bar */}
      <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        {/* Node Type Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 mr-1">Filter Nodes:</span>
          {['ALL', 'User', 'Movie', 'Actor', 'Director', 'Genre'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                filterType === type
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type !== 'ALL' && (
                <span
                  className="inline-block w-2 h-2 rounded-full mr-1.5"
                  style={{ backgroundColor: TYPE_COLORS[type] }}
                />
              )}
              {type}
            </button>
          ))}
        </div>

        {/* Canvas Zoom Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.5))}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.4))}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
            className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            title="Reset View"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas */}
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-[500px] cursor-grab active:cursor-grabbing bg-[#090d16]"
      />

      {/* Selected Node Details Drawer Overlay */}
      {selectedNode && (
        <div className="absolute top-16 right-4 w-72 glass-panel p-4 rounded-2xl border border-purple-500/30 shadow-2xl z-30 animate-in fade-in slide-in-from-right-4 duration-200">
          <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: TYPE_COLORS[selectedNode.type] }}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                {selectedNode.type} Node
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-bold text-slate-100 text-base mb-1">{selectedNode.name}</h4>
          <p className="text-xs text-slate-400 mb-3">ID: {selectedNode.id}</p>

          <div className="space-y-1.5 text-xs border-t border-slate-800 pt-2">
            {Object.entries(selectedNode.properties || {}).map(([k, v]) => {
              if (typeof v === 'object') return null;
              return (
                <div key={k} className="flex justify-between gap-2 text-slate-300">
                  <span className="text-slate-500 capitalize">{k}:</span>
                  <span className="font-medium truncate max-w-[140px]">{String(v)}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend Footer */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-purple-400" />
            <span>Click node to inspect • Drag node to reposition • Drag canvas to pan</span>
          </div>
        </div>
      </div>
    </div>
  );
};
