"use client"

import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const SQRT_5000 = Math.sqrt(5000);

const testimonials = [
    {
        tempId: 0,
        testimonial: "YuvaGlow formulations have completely transformed my treatment services. My clients keep coming back for that signature shine.",
        by: "Priya Sharma, Hair Stylist",
        imgSrc: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        tempId: 1,
        testimonial: "The botanical ingredients actually work — hair has never felt so nourished and healthy.",
        by: "Anika Reddy, Beauty Influencer",
        imgSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        tempId: 2,
        testimonial: "As a professional, I need products that deliver consistent results. YuvaGlow delivers every single time.",
        by: "Sunita Patel, Studio Owner",
        imgSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        tempId: 3,
        testimonial: "Finally, a brand that aligns with holistic wellness. Cruelty-free, nature-inspired, and actually effective.",
        by: "Meera Iyer, Wellness Coach",
        imgSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        tempId: 4,
        testimonial: "I've been searching for a professional-grade solution for years. So glad I finally found YuvaGlow!",
        by: "Kavya Nair, Lead Esthetician",
        imgSrc: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        tempId: 5,
        testimonial: "The efficiency and ease of these formulations makes our work 5x better.",
        by: "Rohit Menon, Senior Colorist",
        imgSrc: "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        tempId: 6,
        testimonial: "Took some convincing, but now that we use YuvaGlow exclusively, we're never going back.",
        by: "Deepa Kapoor, Spa Director",
        imgSrc: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150&h=150"
    },
    {
        tempId: 7,
        testimonial: "Our clients noticed the difference immediately. The ROI on our treatments is easily 100X.",
        by: "Arjun Verma, Clinic Manager",
        imgSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150&h=150"
    }
];

interface TestimonialCardProps {
    position: number;
    testimonial: typeof testimonials[0];
    handleMove: (steps: number) => void;
    cardSize: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
    position,
    testimonial,
    handleMove,
    cardSize
}) => {
    const isCenter = position === 0;

    return (
        <div
            onClick={() => handleMove(position)}
            className={cn(
                "absolute left-1/2 top-1/2 cursor-pointer border p-8 transition-all duration-500 ease-in-out",
                isCenter
                    ? "z-10 bg-[#1a0f06] text-[#faf8f4] border-[#0a0804]"
                    : "z-0 bg-white text-[#2c2c2c] border-[rgba(195,134,54,0.2)] hover:border-[#C38636]/50 shadow-sm"
            )}
            style={{
                width: cardSize,
                height: cardSize,
                clipPath: `polygon(50px 0%, calc(100% - 50px) 0%, 100% 50px, 100% 100%, calc(100% - 50px) 100%, 50px 100%, 0 100%, 0 0)`,
                transform: `
          translate(-50%, -50%) 
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -65 : position % 2 ? 15 : -15}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
                boxShadow: isCenter ? "0px 8px 30px rgba(0,0,0,0.15), 0px 8px 0px 0px #0a0804, 0px 8px 0px 4px rgba(195,134,54,0.3)" : "0px 4px 20px rgba(0,0,0,0.05)"
            }}
        >
            <span
                className="absolute block origin-top-right rotate-45"
                style={{
                    right: -2,
                    top: 48,
                    width: SQRT_5000,
                    height: 1,
                    background: isCenter ? '#0a0804' : 'rgba(195,134,54,0.2)'
                }}
            />
            <img
                src={testimonial.imgSrc}
                alt={testimonial.by.split(',')[0]}
                className="mb-6 h-14 w-14 object-cover object-top rounded-full"
                style={{
                    boxShadow: "3px 3px 0px rgba(195,134,54,0.5)"
                }}
            />
            <h3 className={cn(
                "text-base sm:text-xl font-serif font-medium leading-relaxed italic transition-colors duration-500",
                isCenter ? "text-white" : "text-[#2c2c2c]/80"
            )}>
                "{testimonial.testimonial}"
            </h3>
            <p className={cn(
                "absolute bottom-8 left-8 right-8 mt-2 text-[9px] tracking-[0.2em] uppercase font-sans transition-colors duration-500",
                isCenter ? "text-[#C38636]" : "text-[#C38636]/70"
            )}>
                — {testimonial.by}
            </p>
        </div>
    );
};

export const StaggerTestimonials: React.FC = () => {
    const [cardSize, setCardSize] = useState(365);
    const [testimonialsList, setTestimonialsList] = useState(testimonials);

    const handleMove = (steps: number) => {
        const newList = [...testimonialsList];
        if (steps > 0) {
            for (let i = steps; i > 0; i--) {
                const item = newList.shift();
                if (!item) return;
                newList.push({ ...item, tempId: Math.random() });
            }
        } else {
            for (let i = steps; i < 0; i++) {
                const item = newList.pop();
                if (!item) return;
                newList.unshift({ ...item, tempId: Math.random() });
            }
        }
        setTestimonialsList(newList);
    };

    useEffect(() => {
        const updateSize = () => {
            const { matches } = window.matchMedia("(min-width: 640px)");
            setCardSize(matches ? 365 : 290);
        };

        updateSize();
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div
            className="relative w-full overflow-hidden"
            style={{ height: 600 }}
        >
            {testimonialsList.map((testimonial, index) => {
                const position = testimonialsList.length % 2
                    ? index - (testimonialsList.length + 1) / 2
                    : index - testimonialsList.length / 2;
                return (
                    <TestimonialCard
                        key={testimonial.tempId}
                        testimonial={testimonial}
                        handleMove={handleMove}
                        position={position}
                        cardSize={cardSize}
                    />
                );
            })}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-4">
                <button
                    onClick={() => handleMove(-1)}
                    className={cn(
                        "flex h-12 w-12 items-center justify-center text-2xl transition-all duration-300",
                        "bg-transparent border border-[#C38636]/40 text-[#C38636] hover:bg-[#C38636]/10 hover:border-[#C38636]",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C38636]"
                    )}
                    aria-label="Previous testimonial"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={() => handleMove(1)}
                    className={cn(
                        "flex h-12 w-12 items-center justify-center text-2xl transition-all duration-300",
                        "bg-transparent border border-[#C38636]/40 text-[#C38636] hover:bg-[#C38636]/10 hover:border-[#C38636]",
                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C38636]"
                    )}
                    aria-label="Next testimonial"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};
