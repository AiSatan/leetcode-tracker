import React, { useMemo } from 'react';
import { getDailyForecast } from '../utils/scheduler';
import { getPerformanceColor } from '../utils/theme';

const DailyProgress = ({ progress, compact }) => {
    const days = 11;
    const maxTasksPerDay = 5;

    const forecast = useMemo(() => {
        return getDailyForecast(progress, days);
    }, [progress]);

    const cellSize = compact ? 'w-6 h-6' : 'w-7 h-7';

    return (
        <div className={compact ? '' : 'bg-background-surface rounded-lg shadow-lg p-6 mb-6 transition-colors'}>
            <h2 className={`font-semibold mb-3 text-text-main ${compact ? 'text-sm' : 'text-xl mb-4'}`}>
                10-Day Forecast
            </h2>

            {/* Grid: columns = days, rows = slots */}
            <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${days}, auto)` }}>
                {/* Header Row */}
                {forecast.map((day) => (
                    <div key={`h-${day.date}`} className="text-center font-bold text-text-muted text-xs">
                        {day.label === "0" ? "-" : day.label}
                    </div>
                ))}

                {/* Cell Rows */}
                {Array.from({ length: maxTasksPerDay }).map((_, slotIdx) => (
                    forecast.map((day) => {
                        const task = day.tasks[slotIdx];
                        const color = task ? getPerformanceColor(task.performance) : 'transparent';
                        const hasTasks = day.tasks.length > 0;
                        const isToday = day.label === "0";
                        const showStriped = !task && hasTasks && !isToday;

                        return (
                            <div
                                key={`${day.date}-${slotIdx}`}
                                className={`
                                    ${cellSize} rounded-sm transition-all
                                    ${!task && !showStriped ? 'bg-background-subtle' : ''}
                                    ${showStriped ? 'bg-striped opacity-40' : ''}
                                `}
                                style={{
                                    backgroundColor: task ? color : undefined,
                                    boxShadow: task ? `0 0 6px color-mix(in srgb, ${color}, transparent 80%)` : undefined
                                }}
                                title={task ? `Task Solved. Score: ${task.performance}` : 'Empty Slot'}
                            />
                        );
                    })
                ))}
            </div>
        </div>
    );
};

export default DailyProgress;
