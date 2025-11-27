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
    <div className={`px-4 py-3 shadow-md rounded-md bg-slate-900 border-2 transition-all duration-300 min-w-[150px]
      ${isActive ? 'border-[var(--color-primary)] shadow-[0_0_15px_rgba(34,211,238,0.5)]' : 'border-slate-700'}
      ${selected ? 'border-white' : ''}
    `}>
      <Handle type="target" position={Position.Left} className="w-3 h-3 !bg-slate-500" />

      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full mb-2 ${isActive ? 'bg-[var(--color-primary)] text-black' : 'bg-slate-800 text-slate-400'}`}>
          <Icon size={20} />
        </div>
        <div className="text-sm font-bold text-slate-200">{data.label as string}</div>
      </div>

      <Handle type="source" position={Position.Right} className="w-3 h-3 !bg-slate-500" />
    </div>
  );
};

export default memo(CustomNode);
