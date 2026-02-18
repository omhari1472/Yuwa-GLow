interface ComingSoonProps {
  category?: string;
  message?: string;
}

export default function ComingSoon({ category, message }: ComingSoonProps) {
  const title = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'This Section';
  const defaultMsg =
    category === 'salon'
      ? 'A professional-grade collection of salon tools is being designed for precision and elegance.'
      : `We are passionately crafting our new line of ${title} products. Get ready for something truly special.`;

  return (
    <div className="flex flex-col items-center justify-center py-24 px-4 text-center">
      <span
        className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-4"
        style={{ color: '#C38636' }}
      >
        Launching Soon
      </span>
      <h2 className="font-serif text-4xl font-light mb-4" style={{ color: '#2c2c2c' }}>
        The {title} Collection
      </h2>
      <p className="text-sm leading-relaxed max-w-sm" style={{ color: '#888' }}>
        {message || defaultMsg}
      </p>
    </div>
  );
}
