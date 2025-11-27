import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Monitor, Server, Cpu, Database, Cloud } from 'lucide-react';
import { memo, type ElementType } from 'react';

const icons = {
  monitor: Monitor,
  server: Server,
  cpu: Cpu,
  database: Database,
  cloud: Cloud
};

const CustomNode = ({ data, selected }: NodeProps) => {
  const Icon = (icons[data.icon as keyof typeof icons] || Server) as ElementType;
  const isActive = !!data.isActive;

  return (
    <div className={`relative min-w-[140px] px-4 py-3 rounded-lg bg-white transition-all duration-300
      ${isActive
        ? 'border-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)] ring-1 ring-indigo-600 scale-105'
        : 'border border-zinc-200 hover:border-zinc-300 shadow-sm'
      }
      ${selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
    `}>
      <Handle type="target" position={Position.Left} className={`w-2 h-2 !bg-white !border-2 transition-colors ${isActive ? '!border-indigo-600' : '!border-zinc-400'}`} />

      <div className="flex flex-col items-center gap-3">
        <div className={`p-2 rounded-md transition-colors duration-300 ${isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-zinc-400'}`}>
           <Icon
             size={20}
             strokeWidth={isActive ? 2 : 1.5}
           />
        </div>
        <span className={`text-xs font-semibold tracking-tight transition-colors duration-300 ${isActive ? 'text-indigo-900' : 'text-zinc-500'}`}>
          {data.label as string}
        </span>
      </div>

      <Handle type="source" position={Position.Right} className={`w-2 h-2 !bg-white !border-2 transition-colors ${isActive ? '!border-indigo-600' : '!border-zinc-400'}`} />
    </div>
  );
};

export default memo(CustomNode);
