'use client';

const INGREDIENTS = [
  'Argan Oil', 'Biotin', 'Keratin Complex', 'Hydrolyzed Protein',
  'Panthenol', 'Vitamin E', 'Jojoba Oil', 'Shea Butter',
  'Aloe Vera', 'Bhringraj', 'Amla Extract', 'Coconut Milk',
  'Rosemary Oil', 'Castor Oil', 'Silk Amino Acids', 'Neem Leaf',
];

const DOT = (
  <span
    className="mx-6 text-[8px] flex-shrink-0"
    style={{ color: '#C38636', opacity: 0.7 }}
    aria-hidden
  >
    ◆
  </span>
);

export default function IngredientMarquee() {
  const items = [...INGREDIENTS, ...INGREDIENTS]; // double for seamless loop

  return (
    <div
      className="w-full overflow-hidden py-5 border-y"
      style={{
        background: 'linear-gradient(135deg, #1a1000, #2c1a00)',
        borderColor: 'rgba(195,134,54,0.2)',
      }}
    >
      <div className="marquee-track flex items-center whitespace-nowrap">
        {items.map((name, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span
              style={{
                color: 'rgba(220,178,100,0.85)',
                fontSize: 11,
                letterSpacing: '0.22em',
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                fontWeight: 500,
                textTransform: 'uppercase',
              }}
            >
              {name}
            </span>
            {DOT}
          </span>
        ))}
      </div>
    </div>
  );
}
