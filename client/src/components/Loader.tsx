import React from 'react';

interface CircleLoaderProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  duration?: number;
}

const CircleLoader: React.FC<CircleLoaderProps> = ({ 
  size = 40, 
  color = '#3b82f6',
  strokeWidth = 4,
  duration = 1.5
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="animate-spin"
        style={{ 
          animationDuration: `${duration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite'
        }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeOpacity={0.2}
          fill="none"
        />
        {/* Animated circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
        />
      </svg>
    </div>
  );
};

export default CircleLoader;