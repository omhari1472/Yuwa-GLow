'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MessageCircle, X, ChevronLeft } from 'lucide-react';
import { CHATBOT_TREE, type ChatNode } from '@/lib/constants';

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
      {/* Bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-105"
        style={{ background: 'linear-gradient(135deg, #C38636, #DCB264)' }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} color="white" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={22} color="white" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

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
            className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl overflow-hidden shadow-2xl"
            style={{ background: '#fff', border: '1px solid #e8ddd0' }}
          >
            {/* Header */}
            <div
              className="px-5 py-4 flex items-center gap-3"
              style={{ background: 'linear-gradient(135deg, #C38636, #DCB264)' }}
            >
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle size={16} color="white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">YuvaGlow Assistant</p>
                <p className="text-white/70 text-[10px]">Ask us anything</p>
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
                          className="w-full text-left text-[12px] font-medium px-4 py-2.5 rounded-lg border transition-all duration-150 hover:border-[#C38636] hover:text-[#C38636]"
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
