import { useMemo } from 'react';
import { getDailyForecast } from '../utils/scheduler';
import { getPerformanceColor } from '../utils/theme';

/**
 * 5-day forecast rendered as a pentagonal wax-seal.
 * Each sector = one upcoming day. Concentric bands fill from center outward
 * according to that day's average performance score (1-5).
 */
const ForecastRadar = ({ progress }) => {
    const data = useMemo(() => {
        const forecast = getDailyForecast(progress, 6).slice(1);
        return forecast.map(day => {
            const total = day.tasks.reduce((s, t) => s + (t.performance || 0), 0);
            const count = day.tasks.length;
            const avg = count > 0 ? total / count : 0;
            return { label: day.date.split('-')[2], avg, count };
        });
    }, [progress]);

    const size = 188;
    const center = size / 2;
    const radius = (size / 2) - 28;
    const levels = 5;
    const sides = 5;

    const polar = (r, a) => ({ x: center + r * Math.cos(a), y: center + r * Math.sin(a) });

    const sectors = data.map((d, i) => {
        const a0 = (Math.PI * 2 * i) / sides - Math.PI / 2;
        const a1 = (Math.PI * 2 * (i + 1)) / sides - Math.PI / 2;
        const fill = Math.floor(d.avg);

        const blocks = [];
        for (let l = 1; l <= levels; l++) {
            const ri = ((l - 1) / levels) * radius;
            const ro = (l / levels) * radius;
            const p1 = polar(ri, a0);
            const p2 = polar(ro, a0);
            const p3 = polar(ro, a1);
            const p4 = polar(ri, a1);
            blocks.push({
                points: `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`,
                filled: l <= fill,
                color: getPerformanceColor(l),
            });
        }

        const aMid = (a0 + a1) / 2;
        const labelPos = polar(radius + 14, aMid);
        return { ...d, blocks, labelPos };
    });

    // Outer pentagonal hairline
    const outerVertices = Array.from({ length: sides }, (_, i) => {
        const a = (Math.PI * 2 * i) / sides - Math.PI / 2;
        return polar(radius, a);
    });
    const outline = outerVertices.map(v => `${v.x},${v.y}`).join(' ');

    return (
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
                <h3 className="smallcaps text-text-muted">5-day forecast</h3>
                <span className="text-[10px] text-text-muted/70 display italic">予報</span>
            </div>

            <div className="flex justify-center -mt-1">
                <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
                    {sectors.map((sector, i) => (
                        <g key={i}>
                            {sector.blocks.map((b, j) => (
                                <polygon
                                    key={j}
                                    points={b.points}
                                    fill={b.filled ? b.color : "var(--color-background-subtle)"}
                                    stroke="var(--color-background-page)"
                                    strokeWidth="1.25"
                                    opacity={b.filled ? 0.92 : 0.55}
                                />
                            ))}
                            <text
                                x={sector.labelPos.x}
                                y={sector.labelPos.y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="11"
                                className="display tabular"
                                fill="var(--color-text-muted)"
                            >
                                {sector.label}
                            </text>
                        </g>
                    ))}
                    {/* Outer pentagonal hairline */}
                    <polygon
                        points={outline}
                        fill="none"
                        stroke="var(--color-border-default)"
                        strokeWidth="0.75"
                        opacity="0.7"
                    />
                </svg>
            </div>
        </div>
    );
};

export default ForecastRadar;
