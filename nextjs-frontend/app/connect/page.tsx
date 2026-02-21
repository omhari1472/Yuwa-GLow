'use client';

import { BRAND } from '@/lib/constants';
import { motion } from 'framer-motion';
import Image from 'next/image';

const LINKS = [
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/seesilkprofessional?igsh=Y2lrNmIyaTR2bmNh',
        gradient: 'linear-gradient(135deg, #833AB4, #E1306C, #F77737)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3Z" />
            </svg>
        ),
    },
    {
        name: 'Facebook',
        href: 'https://www.facebook.com/seesilkprofessional',
        gradient: 'linear-gradient(135deg, #1877F2, #42A5F5)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7h-2.54v-2.9h2.54v-2.21c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z" />
            </svg>
        ),
    },
    {
        name: 'YouTube',
        href: 'https://www.youtube.com/channel/UC4ei5Ba7XN5gqfhPgf8ve4Q',
        gradient: 'linear-gradient(135deg, #FF0000, #FF4444)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="m10 15 5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73Z" />
            </svg>
        ),
    },
    {
        name: 'WhatsApp',
        href: BRAND.whatsapp,
        gradient: 'linear-gradient(135deg, #25D366, #128C7E)',
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
        ),
    },
];

const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] } },
};

export default function ConnectPage() {
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #0a0804 0%, #1a0c00 40%, #0d0906 100%)' }}
        >
            {/* Ambient glow orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div
                    className="absolute w-[500px] h-[500px] rounded-full"
                    style={{
                        left: '20%', top: '-15%',
                        background: 'radial-gradient(circle, rgba(195,134,54,0.15), transparent 70%)',
                        filter: 'blur(2px)',
                    }}
                />
                <div
                    className="absolute w-[400px] h-[400px] rounded-full"
                    style={{
                        right: '-5%', bottom: '10%',
                        background: 'radial-gradient(circle, rgba(195,134,54,0.1), transparent 70%)',
                        filter: 'blur(2px)',
                    }}
                />
                <div
                    className="absolute w-[300px] h-[300px] rounded-full"
                    style={{
                        left: '-10%', bottom: '-10%',
                        background: 'radial-gradient(circle, rgba(220,178,100,0.06), transparent 70%)',
                    }}
                />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-sm"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* ── Glass Card ── */}
                <div
                    className="rounded-3xl px-8 py-10 text-center"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        boxShadow:
                            '0 32px 80px rgba(0,0,0,0.5), ' +
                            'inset 0 1px 0 rgba(255,255,255,0.08), ' +
                            '0 0 120px rgba(195,134,54,0.04)',
                    }}
                >
                    {/* Logo */}
                    <motion.div variants={item} className="mb-2">
                        <Image
                            src="/logo.svg"
                            alt="YuvaGlow Professional Co."
                            width={160}
                            height={40}
                            className="mx-auto"
                            style={{ filter: 'brightness(1.2)' }}
                        />
                    </motion.div>

                    {/* Tagline */}
                    <motion.p
                        variants={item}
                        className="text-[10px] tracking-[0.3em] uppercase mb-8"
                        style={{ color: 'rgba(195,134,54,0.5)' }}
                    >
                        Premium Beauty • Made in India
                    </motion.p>

                    {/* Decorative line */}
                    <motion.div variants={item} className="flex items-center justify-center gap-3 mb-8">
                        <div className="h-[1px] w-12" style={{ background: 'linear-gradient(to right, transparent, rgba(195,134,54,0.3))' }} />
                        <span style={{ color: '#C38636', fontSize: 10 }}>✦</span>
                        <div className="h-[1px] w-12" style={{ background: 'linear-gradient(to left, transparent, rgba(195,134,54,0.3))' }} />
                    </motion.div>

                    {/* Social Links */}
                    <div className="space-y-3 mb-8">
                        {LINKS.map((link) => (
                            <motion.a
                                key={link.name}
                                href={link.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                variants={item}
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center gap-4 w-full py-3.5 px-5 rounded-xl text-sm font-medium"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    color: 'rgba(255,255,255,0.85)',
                                    transition: 'all 0.25s ease',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(195,134,54,0.3)';
                                    e.currentTarget.style.background = 'rgba(195,134,54,0.06)';
                                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(195,134,54,0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                <div
                                    className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ background: link.gradient, color: '#fff' }}
                                >
                                    {link.icon}
                                </div>
                                <span className="tracking-wide">{link.name}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="ml-auto opacity-30">
                                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                                </svg>
                            </motion.a>
                        ))}
                    </div>

                    {/* Call CTA */}
                    <motion.a
                        href={BRAND.tel}
                        variants={item}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold tracking-wide mb-6"
                        style={{
                            background: 'linear-gradient(135deg, #C38636, #DCB264)',
                            color: '#fff',
                            boxShadow: '0 4px 24px rgba(195,134,54,0.3)',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.6 19.79 19.79 0 0 1 1.61 5.1 2 2 0 0 1 3.58 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.6a16 16 0 0 0 6 6l.92-1.9a2 2 0 0 1 2.11-.45c.908.34 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        {BRAND.phone}
                    </motion.a>

                    {/* Visit Website */}
                    <motion.a
                        href="/"
                        variants={item}
                        whileHover={{ scale: 1.02 }}
                        className="inline-flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase transition-colors duration-200"
                        style={{ color: 'rgba(195,134,54,0.45)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#DCB264'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(195,134,54,0.45)'; }}
                    >
                        Visit Website →
                    </motion.a>
                </div>

                {/* Footer outside card */}
                <motion.p
                    variants={item}
                    className="mt-6 text-center text-[10px] tracking-[0.15em]"
                    style={{ color: 'rgba(255,255,255,0.12)' }}
                >
                    © 2026 YUVA GLOW PROFESSIONAL CO.
                </motion.p>
            </motion.div>
        </div>
    );
}
