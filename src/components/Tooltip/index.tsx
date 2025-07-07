import React, { ReactNode, useState } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
      tabIndex={0}
    >
      {children}
      {visible && (
        <span className="absolute z-50 left-1/2 -translate-x-1/2 -top-2 mb-2 px-3 py-1 rounded bg-black text-white text-xs whitespace-nowrap shadow-lg opacity-90 animate-fade-in pointer-events-none select-none">
          {text}
        </span>
      )}
    </span>
  );
};

export { Tooltip };

// Add this to your global CSS or Tailwind config:
// .animate-fade-in { animation: fadeIn 0.2s cubic-bezier(0.4,0,0.2,1) both; }
// @keyframes fadeIn { from { opacity: 0; transform: translateY(8px);} to { opacity: 1; transform: none; } } 