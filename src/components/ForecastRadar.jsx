import React, { useMemo } from 'react';
import { getDailyForecast } from '../utils/scheduler';
import { getPerformanceColor } from '../utils/theme';

const ForecastRadar = ({ progress, compact = false }) => {
    // 1. Get Forecast Data (Next 5 Days)
    const data = useMemo(() => {
        // Fetch 6 days, skip the first one (Today) to get "Next 5 days"
        const forecast = getDailyForecast(progress, 6).slice(1);

        return forecast.map(day => {
            const totalPerf = day.tasks.reduce((sum, task) => sum + (task.performance || 0), 0);
            const count = day.tasks.length;
            const avg = count > 0 ? totalPerf / count : 0;
            return {
                label: day.date.split('-')[2], // "25" only
                value: avg
            };
        });
    }, [progress]);

    // 2. Chart Config
    const size = 220; // Slightly larger for labels
    const center = size / 2;
    const radius = (size / 2) - 30;
    const levels = 5;
    const sides = 5;

    // Helper: Polar to Cartesian
    // Rotated so vertices start at -90deg (Top).
    // Sector 0 will be the edge between Vertex 0 (-90) and Vertex 1 (-18).
    const getCoordinates = (radiusPixels, angleRadians) => {
        const x = center + radiusPixels * Math.cos(angleRadians);
        const y = center + radiusPixels * Math.sin(angleRadians);
        return { x, y };
    };

    // Generate Blocks
    // We want 5 sectors (Edges).
    // Edge i is between Vertex i and Vertex i+1.
    const sectors = data.map((d, i) => {
        const angleStart = (Math.PI * 2 * i) / sides - (Math.PI / 2);
        const angleEnd = (Math.PI * 2 * (i + 1)) / sides - (Math.PI / 2);

        // Determine how many blocks to fill
        // Determine how many blocks to fill
        const fillLevel = Math.floor(d.value);
        // Use the score corresponding to the fill level, or default to 3 if 0
        // Ensure we pass an integer to getPerformanceColor
        const color = getPerformanceColor(Math.max(1, Math.round(d.value)) || 3);

        const blocks = [];
        for (let l = 1; l <= levels; l++) {
            const innerR = ((l - 1) / levels) * radius;
            const outerR = (l / levels) * radius;

            const p1 = getCoordinates(innerR, angleStart);
            const p2 = getCoordinates(outerR, angleStart);
            const p3 = getCoordinates(outerR, angleEnd);
            const p4 = getCoordinates(innerR, angleEnd);

            // If filled, use color based on the LEVEL (loop), not the total score
            const isFilled = l <= fillLevel;
            const levelColor = getPerformanceColor(l);

            blocks.push({
                level: l,
                path: `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`,
                filled: isFilled,
                fillColor: levelColor
            });
        }

        // Label Position (Center of the edge at max radius)
        const angleMid = (angleStart + angleEnd) / 2;
        // Move labels closer to the edge
        const labelPos = getCoordinates(radius + 8, angleMid);

        return {
            ...d,
            blocks,
            labelPos
        };
    });

    return (
        <div className={compact ? '' : 'bg-background-surface rounded-lg shadow-lg p-6 mb-6 transition-colors'}>
            <div className={`flex items-center justify-center ${compact ? 'mb-0' : 'mb-4'}`}>
                <h2 className={`font-semibold text-text-main ${compact ? 'text-sm' : 'text-xl'}`}>
                    Forecast
                </h2>
            </div>

            <div className="flex justify-center items-center relative -mt-4">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                    {/* Render Segments */}
                    {sectors.map((sector, i) => (
                        <g key={i}>
                            {/* Blocks */}
                            {sector.blocks.map((block, j) => (
                                <polygon
                                    key={j}
                                    points={block.path}
                                    fill={block.filled ? block.fillColor : "var(--color-background-subtle)"}
                                    stroke="var(--color-background-surface)" /* Gap color */
                                    strokeWidth="2"
                                    opacity={block.filled ? 0.9 : 0.3}
                                />
                            ))}

                            {/* Label */}
                            <text
                                x={sector.labelPos.x}
                                y={sector.labelPos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="11"
                                fontWeight="600"
                                fill="var(--color-text-muted)"
                            >
                                {sector.label}
                            </text>
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default ForecastRadar;
