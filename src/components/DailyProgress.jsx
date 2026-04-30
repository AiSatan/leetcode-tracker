import { useMemo } from 'react';
import { getDailyForecast } from '../utils/scheduler';
import { getPerformanceColor } from '../utils/theme';

const DailyProgress = ({ progress }) => {
    const days = 11;
    const slots = 5;

    const forecast = useMemo(() => getDailyForecast(progress, days), [progress]);

    return (
        <div className="flex flex-col">
            <div className="flex items-baseline justify-between mb-4">
                <h3 className="smallcaps text-text-muted">Ten days</h3>
                <span className="text-[10px] text-text-muted/70 display italic">十日</span>
            </div>

            <div
                className="inline-grid gap-y-1 gap-x-1.5"
                style={{ gridTemplateColumns: `repeat(${days}, 1.5rem)` }}
            >
                {forecast.map(day => {
                    const isToday = day.dayIndex === 0;
                    return (
                        <div
                            key={`h-${day.date}`}
                            className="flex flex-col items-center pb-1"
                        >
                            <span
                                className="display tabular text-[12px] leading-none"
                                style={{
                                    color: isToday
                                        ? "var(--color-primary-main)"
                                        : "var(--color-text-muted)",
                                    fontWeight: isToday ? 600 : 400
                                }}
                            >
                                {day.label}
                            </span>
                            <span
                                className="block w-3 h-px mt-1.5"
                                style={{
                                    backgroundColor: isToday
                                        ? "var(--color-primary-main)"
                                        : "transparent"
                                }}
                            />
                        </div>
                    );
                })}

                {/* Slot rows */}
                {Array.from({ length: slots }).map((_, slotIdx) => (
                    forecast.map(day => {
                        const task = day.tasks[slotIdx];
                        const color = task ? getPerformanceColor(task.performance) : 'transparent';
                        const hasTasks = day.tasks.length > 0;
                        const isToday = day.dayIndex === 0;
                        const showStriped = !task && hasTasks && !isToday;

                        return (
                            <div
                                key={`${day.date}-${slotIdx}`}
                                className={`
                                    w-6 h-6
                                    ${!task && !showStriped ? 'bg-background-subtle' : ''}
                                    ${showStriped ? 'bg-striped opacity-40' : ''}
                                `}
                                style={{
                                    backgroundColor: task ? color : undefined,
                                    border: task ? '0.5px solid rgba(0,0,0,0.06)' : undefined,
                                }}
                                title={task
                                    ? `Score: ${task.performance}${task.performance === 5 ? ' · mastered' : ''}`
                                    : 'Empty slot'}
                            />
                        );
                    })
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-3 mt-4 text-[10px] text-text-muted">
                <span className="smallcaps">Score</span>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(n => (
                        <span
                            key={n}
                            className="w-2.5 h-2.5"
                            style={{ backgroundColor: getPerformanceColor(n) }}
                        />
                    ))}
                </div>
                <span className="text-text-muted/60 tabular">1—5</span>
            </div>
        </div>
    );
};

export default DailyProgress;
