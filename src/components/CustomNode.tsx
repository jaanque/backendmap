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
    <div className={`relative min-w-[140px] px-4 py-3 rounded-lg bg-white transition-all duration-200
      ${isActive
        ? 'border border-black shadow-[0_0_0_1px_rgba(0,0,0,1)]'
        : 'border border-zinc-200 hover:border-zinc-300 shadow-sm'
      }
      ${selected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
    `}>
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-white !border-2 !border-black" />

      <div className="flex flex-col items-center gap-3">
        <div className={`p-2 rounded-md ${isActive ? 'bg-zinc-100 text-black' : 'bg-white text-zinc-400'}`}>
           <Icon
             size={20}
             strokeWidth={isActive ? 2 : 1.5}
           />
        </div>
        <span className={`text-xs font-semibold tracking-tight ${isActive ? 'text-black' : 'text-zinc-500'}`}>
          {data.label as string}
        </span>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-white !border-2 !border-black" />
    </div>
  );
};

export default memo(CustomNode);
