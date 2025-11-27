import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Monitor, Server, Cpu, Database, Cloud } from 'lucide-react';
import { memo } from 'react';

const icons = {
  monitor: Monitor,
  server: Server,
  cpu: Cpu,
  database: Database,
  cloud: Cloud
};

const CustomNode = ({ data, selected }: NodeProps) => {
  const Icon = (icons[data.icon as keyof typeof icons] || Server) as React.ElementType;
  const isActive = data.isActive;

  return (
    <div className={`relative px-5 py-4 min-w-[160px] rounded-2xl transition-all duration-500
      ${isActive
        ? 'bg-[var(--color-primary)]/10 border border-[var(--color-primary)] shadow-[0_0_30px_-5px_rgba(34,211,238,0.3)]'
        : 'bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 backdrop-blur-md'
      }
      ${selected ? 'ring-2 ring-white/20' : ''}
    `}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-zinc-600 !border-none" />

      <div className="flex flex-col items-center gap-3">
        <div className={`p-3 rounded-xl transition-colors duration-500 ${
          isActive
            ? 'bg-[var(--color-primary)] text-black shadow-lg shadow-[var(--color-primary)]/20'
            : 'bg-zinc-800/50 text-zinc-400'
        }`}>
          <Icon size={24} strokeWidth={1.5} />
        </div>
        <div className={`text-sm font-semibold tracking-wide transition-colors duration-300 ${
          isActive ? 'text-[var(--color-primary)]' : 'text-zinc-300'
        }`}>
          {data.label as string}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-zinc-600 !border-none" />
    </div>
  );
};

export default memo(CustomNode);
