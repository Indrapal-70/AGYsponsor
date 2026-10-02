import React from 'react';
import TechnicalEyebrow from './TechnicalEyebrow';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const alignClass = align === 'center' ? 'text-center items-center mx-auto' : 'text-left items-start';

  return (
    <div className={`max-w-3xl flex flex-col ${alignClass} mb-12 md:mb-16 ${className}`}>
      {eyebrow && (
        <div className="mb-4">
          <TechnicalEyebrow>{eyebrow}</TechnicalEyebrow>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.12]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}
