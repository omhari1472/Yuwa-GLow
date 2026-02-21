'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Option { value: string; label: string; }

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (val: string) => void;
    placeholder?: string;
    label?: string;
}

export default function CustomSelect({ options, value, onChange, placeholder, label }: CustomSelectProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const selected = options.find(o => o.value === value);

    useEffect(() => {
        const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <div ref={ref} className="relative">
            {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-2">{label}</label>}
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`w-full flex items-center justify-between bg-gray-50/80 border rounded-xl px-5 py-3.5 text-sm text-left transition-all ${open ? 'border-[#C38636] ring-2 ring-[#C38636]/20' : 'border-gray-200 hover:border-gray-300'}`}
            >
                <span className={selected ? 'text-gray-900' : 'text-gray-400'}>{selected?.label || placeholder || 'Select...'}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="max-h-60 overflow-y-auto py-1">
                        {options.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => { onChange(opt.value); setOpen(false); }}
                                className={`w-full text-left px-5 py-3 text-sm transition-colors ${opt.value === value ? 'bg-[#C38636]/10 text-[#C38636] font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <span>{opt.label}</span>
                                    {opt.value === value && <div className="w-2 h-2 rounded-full bg-[#C38636]" />}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
