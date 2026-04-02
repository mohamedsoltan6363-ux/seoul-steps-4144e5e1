import React from 'react';

interface WaveDividerProps {
  flip?: boolean;
  color?: string;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ flip = false, color = 'hsl(var(--background))' }) => {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? 'rotate-180' : ''}`} style={{ marginTop: -2, marginBottom: -2 }}>
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="w-full h-[60px] sm:h-[80px]"
      >
        <path
          d="M0,40 C150,80 350,0 600,40 C850,80 1050,0 1200,40 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.5"
        />
        <path
          d="M0,60 C200,20 400,80 600,50 C800,20 1000,70 1200,50 L1200,120 L0,120 Z"
          fill={color}
          opacity="0.8"
        />
        <path
          d="M0,80 C150,60 350,100 600,70 C850,40 1050,90 1200,60 L1200,120 L0,120 Z"
          fill={color}
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
