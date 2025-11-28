import { MousePointer2, Move, ZoomIn } from 'lucide-react';

export default function MapLegend() {
  return (
    <div className="absolute bottom-6 right-6 z-10 bg-white/80 backdrop-blur-sm border border-zinc-200 p-3 rounded-lg shadow-sm text-xs text-zinc-500 flex flex-col gap-2 max-w-[200px]">
      <div className="flex items-center gap-2">
        <MousePointer2 size={12} className="text-zinc-400" />
        <span>Drag nodes to rearrange</span>
      </div>
      <div className="flex items-center gap-2">
        <Move size={12} className="text-zinc-400" />
        <span>Pan to move view</span>
      </div>
      <div className="flex items-center gap-2">
        <ZoomIn size={12} className="text-zinc-400" />
        <span>Scroll to zoom</span>
      </div>
    </div>
  );
}
