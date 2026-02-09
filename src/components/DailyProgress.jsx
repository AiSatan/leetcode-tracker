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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 transition-colors">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                10-Day Forecast
            </h2>

            {/* Grid Container */}
            <div className="flex gap-2 w-full overflow-x-auto pb-2">
                {forecast.map((day, dayIdx) => (
                    <div key={day.date} className="flex flex-col gap-1 min-w-[2.5rem] flex-1">
                        {/* Header: Day Number */}
                        <div className="text-center font-bold text-lg text-gray-700 dark:text-gray-300 mb-1">
                            {day.label === "0" ? "-" : day.label}
                        </div>
                        
                        <div className="flex flex-col gap-1 h-32"> {/* Fixed height to align rows */}
                            {Array.from({ length: maxTasksPerDay }).map((_, slotIdx) => {
                                const task = day.tasks[slotIdx];
                                const color = task ? getPerformanceColor(task.performance) : 'transparent';

                                return (
                                    <div
                                        key={slotIdx}
                                        className={`
                      w-full h-1/5 rounded-sm transition-all
                      ${!task ? 'bg-gray-100 dark:bg-gray-700/50' : ''}
                    `}
                                        style={{
                                            backgroundColor: task ? color : undefined,
                                            border: task ? `1px solid ${color}` : undefined
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
