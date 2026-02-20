'use client';

import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AnnouncementBar() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        // Only show if not dismissed in this session
        const dismissed = sessionStorage.getItem('yg-announce-dismissed');
        if (!dismissed) setVisible(true);
    }, []);

    const dismiss = () => {
        sessionStorage.setItem('yg-announce-dismissed', '1');
        setVisible(false);
    };

    if (!visible) return null;

    return (
        <div
            className="fixed top-0 inset-x-0 z-[60] flex items-center justify-center gap-3 px-4"
            style={{
                background: 'linear-gradient(90deg, #0a0804 0%, #1a0c00 50%, #0a0804 100%)',
                height: 36,
                borderBottom: '1px solid rgba(195,134,54,0.15)',
            }}
        >
            <span
                style={{
                    width: 4,
                    height: 4,
                    background: '#C38636',
                    transform: 'rotate(45deg)',
                    flexShrink: 0,
                    display: 'inline-block',
                }}
            />
            <p
                style={{
                    color: 'rgba(220,178,100,0.9)',
                    fontSize: 10,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    fontFamily: "'DM Sans', Arial, sans-serif",
                    fontWeight: 500,
                }}
            >
                Premium Beauty Manufacturer — Formulating Excellence for 10,000+ Professionals
            </p>
            <span
                style={{
                    width: 4,
                    height: 4,
                    background: '#C38636',
                    transform: 'rotate(45deg)',
                    flexShrink: 0,
                    display: 'inline-block',
                }}
            />
            <button
                onClick={dismiss}
                aria-label="Dismiss announcement"
                className="absolute right-3 flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: '#DCB264' }}
            >
                <X size={13} />
            </button>
        </div>
    );
}
