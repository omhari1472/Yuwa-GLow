'use client';

const INGREDIENTS = [
  'Argan Oil', 'Biotin', 'Keratin Complex', 'Hydrolyzed Protein',
  'Panthenol', 'Vitamin E', 'Jojoba Oil', 'Shea Butter',
  'Aloe Vera', 'Bhringraj', 'Amla Extract', 'Coconut Milk',
  'Rosemary Oil', 'Castor Oil', 'Silk Amino Acids', 'Neem Leaf',
];

const INGREDIENTS_2 = [
  'Hyaluronic Acid', 'Retinol Complex', 'Bakuchiol', 'Turmeric Extract',
  'Saffron Oil', 'Liquorice Root', 'Green Tea', 'Collagen Peptides',
  'Vitamin C', 'Niacinamide', 'Centella Asiatica', 'Rose Hip',
  'Sea Buckthorn', 'Moringa Oil', 'Black Sesame', 'Fenugreek',
];

const SEP = (
  <span
    className="mx-5 flex-shrink-0"
    aria-hidden
    style={{ color: 'rgba(195,134,54,0.45)', fontSize: 8 }}
  >
    ·
  </span>
);

export default function IngredientMarquee() {
  const track1 = [...INGREDIENTS, ...INGREDIENTS];
  const track2 = [...INGREDIENTS_2, ...INGREDIENTS_2];

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0a0804 0%, #1a0c00 50%, #0a0804 100%)',
        borderTop: '1px solid rgba(195,134,54,0.1)',
        borderBottom: '1px solid rgba(195,134,54,0.1)',
        paddingTop: 18,
        paddingBottom: 18,
      }}
    >
      {/* Track 1 — forward */}
      <div className="marquee-track flex items-center whitespace-nowrap mb-3">
        {track1.map((name, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span style={{
              color: 'rgba(220,178,100,0.75)',
              fontSize: 11,
              letterSpacing: '0.24em',
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontWeight: 400,
              textTransform: 'uppercase',
            }}>
              {name}
            </span>
            {SEP}
          </span>
        ))}
      </div>

      {/* Track 2 — reverse */}
      <div className="marquee-track-reverse flex items-center whitespace-nowrap">
        {track2.map((name, i) => (
          <span key={i} className="inline-flex items-center flex-shrink-0">
            <span style={{
              color: 'rgba(195,134,54,0.45)',
              fontSize: 11,
              letterSpacing: '0.24em',
              fontFamily: "'DM Sans', Arial, sans-serif",
              fontWeight: 400,
              textTransform: 'uppercase',
            }}>
              {name}
            </span>
            {SEP}
          </span>
        ))}
      </div>
    </div>
  );
}
