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

const CustomNode = ({ data, id, selected }: NodeProps) => {
  const Icon = (icons[data.icon as keyof typeof icons] || Server) as ElementType;
  const isActive = !!data.isActive;

  return (
    <div className={`relative min-w-[160px] bg-white transition-all duration-200
      ${isActive
        ? 'border-2 border-[var(--color-accent)] shadow-md'
        : 'border border-[var(--color-border-strong)] shadow-sm hover:border-slate-500'
      }
      ${selected ? 'ring-2 ring-slate-400 ring-offset-2' : ''}
      rounded-md
    `}>
      {/* Header/Icon Area */}
      <div className={`px-3 py-2 border-b rounded-t-[4px] flex items-center justify-between ${isActive ? 'bg-blue-50/50 border-blue-100' : 'bg-slate-50 border-slate-200'}`}>
        <Icon size={16} className={isActive ? 'text-[var(--color-accent)]' : 'text-slate-500'} />
        {isActive && <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />}
      </div>

      {/* Content Area */}
      <div className="px-3 py-3">
        <div className={`text-sm font-bold leading-tight ${
          isActive ? 'text-[var(--color-primary)]' : 'text-slate-700'
        }`}>
          {data.label as string}
        </div>
        <div className="text-[10px] text-slate-400 font-mono mt-2 uppercase tracking-wider">
           ID: {id}
        </div>
      </div>

      <Handle type="target" position={Position.Left} className="w-2.5 h-2.5 !bg-white !border-2 !border-slate-400 !rounded-sm" />
      <Handle type="source" position={Position.Right} className="w-2.5 h-2.5 !bg-white !border-2 !border-slate-400 !rounded-sm" />
    </div>
  );
};

export default memo(CustomNode);
