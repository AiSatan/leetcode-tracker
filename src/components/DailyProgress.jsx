import React, { useMemo } from 'react';
import { getDailyForecast } from '../utils/scheduler';
import { getPerformanceColor } from '../utils/theme';

const DailyProgress = ({ progress }) => {
    const days = 11;
    const maxTasksPerDay = 5;

    const forecast = useMemo(() => {
        return getDailyForecast(progress, days);
    }, [progress]);

    return (
        <div className="bg-background-surface rounded-lg shadow-lg p-6 mb-6 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-text-main">
                10-Day Forecast
            </h2>

            {/* Grid Container */}
            <div className="flex gap-2 w-full overflow-x-auto pb-2">
                {forecast.map((day, dayIdx) => (
                    <div key={day.date} className="flex flex-col gap-1 min-w-[2.5rem] flex-1">
                        {/* Header: Day Number */}
                        <div className="text-center font-bold text-lg text-text-muted mb-1">
                            {day.label === "0" ? "-" : day.label}
                        </div>

                        <div className="flex flex-col gap-1 h-32"> {/* Fixed height to align rows */}
                            {Array.from({ length: maxTasksPerDay }).map((_, slotIdx) => {
                                const task = day.tasks[slotIdx];
                                const color = task ? getPerformanceColor(task.performance) : 'transparent';
                                const hasTasks = day.tasks.length > 0;
                                const isToday = day.label === "0";

                                // Dashed/Striped if: Not today, Day has tasks, and this slot is empty
                                const showStriped = !task && hasTasks && !isToday;

                                return (
                                    <div
                                        key={slotIdx}
                                        className={`
                                            w-full h-1/5 rounded-sm transition-all
                                            ${!task && !showStriped ? 'bg-background-subtle' : ''}
                                            ${showStriped ? 'bg-striped opacity-30' : ''}
                                        `}
                                        style={{
                                            backgroundColor: task ? color : undefined,
                                            boxShadow: task ? `0 0 10px color-mix(in srgb, ${color}, transparent 75%)` : undefined // Glow effect
                                        }}
                                        title={task ? `Task Solved. Score: ${task.performance}` : 'Empty Slot'}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DailyProgress;
