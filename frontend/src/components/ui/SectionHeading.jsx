import RevealOnScroll from './RevealOnScroll';

export default function SectionHeading({ eyebrow, title, subtitle }) {
  return (
    <RevealOnScroll className="text-center mb-16">
      {eyebrow && (
        <span className="inline-block text-primary-500 font-mono text-sm tracking-widest uppercase mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display text-4xl md:text-5xl font-bold text-dark-title mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className="text-dark-text max-w-xl mx-auto text-lg">{subtitle}</p>
      )}
    </RevealOnScroll>
  );
}
