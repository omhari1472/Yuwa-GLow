'use client';

import { CHATBOT_TREE, type ChatNode } from '@/lib/constants';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [nodeId, setNodeId] = useState('root');
  const [history, setHistory] = useState<string[]>([]);
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  const node: ChatNode = CHATBOT_TREE[nodeId] || CHATBOT_TREE.root;

  // Handle action nodes automatically
  useEffect(() => {
    if (!node.action) return;

    const timer = setTimeout(() => {
      switch (node.action) {
        case 'navigate':
          if (node.actionValue) router.push(node.actionValue);
          setOpen(false);
          setNodeId('root');
          setHistory([]);
          break;
        case 'phone':
          window.open(node.actionValue, '_self');
          setNodeId('root');
          setHistory([]);
          break;
        case 'whatsapp':
        case 'email':
          if (node.actionValue) window.open(node.actionValue, '_blank');
          setNodeId('root');
          setHistory([]);
          break;
        case 'reset':
          setNodeId('root');
          setHistory([]);
          break;
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [node, router]);

  const handleOption = (next: string) => {
    setHistory((h) => [...h, nodeId]);
    setNodeId(next);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setNodeId(prev);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat assistant"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #C38636 0%, #DCB264 55%, #E8C87A 100%)',
          boxShadow: open
            ? '0 4px 20px rgba(195,134,54,0.4), 0 0 0 3px rgba(195,134,54,0.15)'
            : '0 6px 24px rgba(195,134,54,0.35), 0 2px 8px rgba(0,0,0,0.1)',
          border: '2px solid rgba(255,255,255,0.15)',
          cursor: 'pointer',
          transition: 'box-shadow 0.3s ease',
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={22} color="white" strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              {/* Custom premium chat icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 2C6.477 2 2 5.813 2 10.5c0 2.51 1.328 4.758 3.414 6.29C5.129 18.38 4.342 20.182 3 21.5c2.05-.263 3.933-1.099 5.385-2.322.53.053 1.067.082 1.615.082 5.523 0 10-3.813 10-8.76C20 5.813 17.523 2 12 2z"
                  fill="white"
                  fillOpacity="0.95"
                />
                <circle cx="8.5" cy="10.5" r="1.2" fill="#C38636" />
                <circle cx="12" cy="10.5" r="1.2" fill="#C38636" />
                <circle cx="15.5" cy="10.5" r="1.2" fill="#C38636" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!open && (
          <motion.span
            className="absolute inset-0 rounded-full"
            style={{
              border: '2px solid rgba(195,134,54,0.4)',
            }}
            animate={{
              scale: [1, 1.35],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.4, 0.25, 1] }}
            className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden"
            style={{
              background: '#fff',
              border: '1px solid #e8ddd0',
              boxShadow: '0 16px 48px rgba(0,0,0,0.12), 0 4px 16px rgba(195,134,54,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #1a0f06, #2c1a00)' }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C38636, #DCB264)' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2C6.477 2 2 5.813 2 10.5c0 2.51 1.328 4.758 3.414 6.29C5.129 18.38 4.342 20.182 3 21.5c2.05-.263 3.933-1.099 5.385-2.322.53.053 1.067.082 1.615.082 5.523 0 10-3.813 10-8.76C20 5.813 17.523 2 12 2z"
                    fill="white"
                  />
                </svg>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">YuvaGlow Assistant</p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: '#4ade80' }}
                  />
                  <p className="text-white/60 text-[10px]">Online • Ask us anything</p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4">
              {/* Back button */}
              {history.length > 0 && !node.action && (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-gray-600 mb-3 transition-colors"
                >
                  <ChevronLeft size={14} />
                  Back
                </button>
              )}

              {/* Bot message */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={nodeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="text-sm leading-relaxed rounded-xl px-4 py-3 mb-4"
                    style={{ background: '#f5f2ed', color: '#2c2c2c' }}
                  >
                    {node.text}
                    {node.action && (
                      <span className="block mt-1 text-[11px] text-gray-400">Redirecting…</span>
                    )}
                  </div>

                  {/* Options */}
                  {!node.action && node.options && (
                    <div className="flex flex-col gap-2">
                      {node.options.map((opt) => (
                        <button
                          key={opt.next}
                          onClick={() => handleOption(opt.next)}
                          className="w-full text-left text-[12px] font-medium px-4 py-2.5 rounded-lg border transition-all duration-150 hover:border-[#C38636] hover:text-[#C38636] hover:bg-[#faf8f4]"
                          style={{ border: '1px solid #e5e0d8', color: '#444' }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div
              className="px-4 py-2.5 text-center border-t"
              style={{ borderColor: '#f0e8dd' }}
            >
              <a
                href="tel:+917300045513"
                className="text-[11px] font-semibold tracking-wide"
                style={{ color: '#C38636' }}
              >
                Call Us: +91 73000 45513
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
