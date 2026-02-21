import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-sm font-bold text-zinc-400 uppercase tracking-wider text-[11px] group-focus-within:text-orange-400 transition-colors">
        {label} <span className="text-orange-500">*</span>
      </label>
      <input
        className={`bg-zinc-900/40 border ${error ? 'border-red-500/50' : 'border-white/5 focus:border-orange-500/50'} 
        rounded-xl p-4 text-white placeholder-zinc-600 outline-none transition-all duration-300 
        focus:bg-zinc-900/60 focus:ring-2 focus:ring-orange-500/20 hover:border-white/10 hover:bg-zinc-900/50 backdrop-blur-md shadow-inner ${className}`}
        {...props}
      />
      {error && <span className="text-red-400 text-xs font-medium animate-pulse flex items-center gap-1">
        <span className="w-1 h-1 bg-red-400 rounded-full"></span> {error}
      </span>}
    </div>
  );
};