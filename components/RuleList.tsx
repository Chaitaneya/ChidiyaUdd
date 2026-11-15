import React from 'react';

/**
 * Numbered rules with a hanging indent: wrapped lines line up with the text,
 * not with the number. Used by the Help popup and Leader Mode.
 */
const RuleList: React.FC<{ items: React.ReactNode[]; className?: string }> = ({ items, className = '' }) => (
  <ol className={`space-y-3 font-retro leading-relaxed text-slate-200 ${className}`}>
    {items.map((item, i) => (
      <li key={i} className="flex gap-2">
        <span className="text-green-400 shrink-0">{i + 1}.</span>
        <span>{item}</span>
      </li>
    ))}
  </ol>
);

export default RuleList;
