import { useState } from "react";

// Function to generate random price chart data
const generateChartData = (points = 20, trend: 'up' | 'down' | 'neutral' = 'neutral') => {
  const data = [];
  let value = 50 + Math.random() * 20;
  
  // Set trend bias
  const bias = trend === 'up' ? 0.6 : trend === 'down' ? 0.4 : 0.5;
  
  for (let i = 0; i < points; i++) {
    // Random walk with trend bias
    const change = (Math.random() > bias ? 1 : -1) * (Math.random() * 5);
    value = Math.max(10, Math.min(90, value + change));
    data.push(value);
  }
  
  return data;
};

// Component for mini price chart
export const MiniChart = ({ trend = 'neutral' }: { trend?: 'up' | 'down' | 'neutral' }) => {
  const [chartData] = useState(() => generateChartData(20, trend));
  // Only use green or red colors (no purple)
  const color = trend === 'up' || trend === 'neutral' ? '#10b981' : '#ef4444';
  const fillColor = trend === 'up' || trend === 'neutral' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  
  // Calculate path for SVG
  const width = 80;
  const height = 24; // Reduced height for more compact display
  const maxVal = Math.max(...chartData);
  const minVal = Math.min(...chartData);
  const range = maxVal - minVal || 1;
  
  const points = chartData.map((val, i) => {
    const x = (i / (chartData.length - 1)) * width;
    const y = height - ((val - minVal) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  
  // Create area path (line + bottom border + back to start)
  const areaPath = `
    M 0,${height - ((chartData[0] - minVal) / range) * height}
    ${points.split(' ').map(point => `L ${point}`).join(' ')}
    L ${width},${height}
    L 0,${height}
    Z
  `;
  
  return (
    <svg width={width} height={height} className="ml-2">
      <path
        d={areaPath}
        fill={fillColor}
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
      />
    </svg>
  );
}; 