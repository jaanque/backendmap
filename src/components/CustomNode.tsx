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
    <div className={`px-4 py-3 min-w-[140px] rounded-lg border-2 transition-all duration-300 bg-white
      ${isActive
        ? 'border-[var(--color-primary)] shadow-md ring-2 ring-blue-100'
        : 'border-slate-200 hover:border-slate-300 shadow-sm'
      }
      ${selected ? 'ring-2 ring-slate-400' : ''}
    `}>
      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-slate-400 !border-2 !border-white" />

      <div className="flex flex-col items-center gap-2">
        <div className={`p-2 rounded-md ${
          isActive
            ? 'text-[var(--color-primary)] bg-blue-50'
            : 'text-slate-600 bg-slate-100'
        }`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        <div className={`text-sm font-bold ${
          isActive ? 'text-[var(--color-primary)]' : 'text-slate-700'
        }`}>
          {data.label as string}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-slate-400 !border-2 !border-white" />
    </div>
  );
};

export default memo(CustomNode);
