/**
 * Fair Review Scheduler (FRS)
 * Based on user performance and problem difficulty.
 */

const DAILY_LIMIT = 5;

const DIFFICULTY_MAP = {
    "Easy": 1,
    "Medium": 2,
    "Hard": 3
};

/** Returns local date string YYYY-MM-DD (not UTC) */
const toLocalDateStr = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/** Returns a new Date set to local midnight for a YYYY-MM-DD string */
const parseLocalDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d);
};

/**
 * Calculates review updates.
 * Returns an object map of problemId -> newProgress.
 * 
 * @param {object} problem - The problem object.
 * @param {object} _currentProgress - Current progress for this problem.
 * @param {number} performance - User rating (1-5).
 * @param {object} allProgress - Global progress object.
 * @param {string} currentListName - The name of the list this problem belongs to.
 * @returns {object} Map of updates: { [listName]: { [probId]: progress, ... } }
 */
export const scheduleReview = (problem, _currentProgress, performance, allProgress, currentListName) => {
    const currentProgress = _currentProgress || { reviews: 0, interval: 0, vruntime: 0 };

    // 1. Calculate Weight
    const difficultyScore = DIFFICULTY_MAP[problem.difficulty] || 2;
    const weight = difficultyScore * (6 - performance);

    // 2. Calculate Next Interval
    let newInterval;
    const previousInterval = currentProgress.interval || 1;

    if (performance >= 4) {
        newInterval = Math.ceil(previousInterval * 2.5);
    } else if (performance === 3) {
        newInterval = Math.ceil(previousInterval * 1.5);
    } else {
        // Performance <= 2 (High Priority reset)
        newInterval = 1;
    }

    // 3. Find Target Day (using local midnight, not UTC)
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const targetDatePromise = new Date(todayLocal);
    targetDatePromise.setDate(todayLocal.getDate() + newInterval);
    const targetDateStr = toLocalDateStr(targetDatePromise);

    // 4. Load Balancing & Priority Bumping
    const updates = {};

    // Attempt to schedule on target date
    const { finalDate, bumpedUpdates } = resolveScheduling(targetDateStr, performance, allProgress);

    // Prepare current problem update
    const addedVRuntime = newInterval / weight;
    const newProgress = {
        ...currentProgress,
        solved: true,
        lastReviewed: toLocalDateStr(today),
        nextReview: finalDate,
        interval: newInterval,
        performance: performance,
        vruntime: (currentProgress.vruntime || 0) + addedVRuntime,
        reviews: (currentProgress.reviews || 0) + 1
    };

    // Construct return object
    updates[currentListName] = {
        [problem.id]: newProgress
    };

    // Merge bumped updates
    if (bumpedUpdates) {
        Object.keys(bumpedUpdates).forEach(list => {
            if (!updates[list]) updates[list] = {};
            Object.assign(updates[list], bumpedUpdates[list]);
        });
    }

    return updates;
};

const resolveScheduling = (targetDateStr, performance, allProgress) => {
    // 1. Check daily count
    const itemsOnDate = [];
    Object.keys(allProgress).forEach(listName => {
        Object.keys(allProgress[listName]).forEach(id => {
            const p = allProgress[listName][id];
            if (p.nextReview === targetDateStr) {
                itemsOnDate.push({ list: listName, id: id, performance: p.performance || 3 });
            }
        });
    });

    if (itemsOnDate.length < DAILY_LIMIT) {
        return { finalDate: targetDateStr, bumpedUpdates: null };
    }

    // 2. Day is full. Check for priority bumping.
    // Condition: Current is High Priority (1-3) AND there is a Low Priority (5 or 4) item on this date.
    if (performance <= 3) {
        // Find a victim. Prefer 5, then 4.
        // Sort by performance desc: 5, then 4, then 3...
        // We only bump 5 or 4.
        const candidates = itemsOnDate.filter(item => item.performance >= 4)
            .sort((a, b) => b.performance - a.performance);

        const victim = candidates[0]; // Best candidate (Score 5 first)

        if (victim) {
            // Bump victim to next available slot (Recursive bumping)
            const victimDateObj = parseLocalDate(targetDateStr);
            victimDateObj.setDate(victimDateObj.getDate() + 1);
            const nextDayStr = toLocalDateStr(victimDateObj);

            // Victim logic:
            // If victim was 5 -> stays 5.
            // If victim was 4 -> becomes 3 (forced drop to prevent endless bumping).
            let newVictimPerformance = victim.performance;
            if (newVictimPerformance === 4) {
                newVictimPerformance = 3;
            }

            // Recursive call for victim
            // We need to pass the *original* allProgress because that's our world state.
            // However, we must pretend the victim is NOT on the current date anymore to avoid count issues?
            // Actually, resolveScheduling just checks counts.
            // If we are placing victim on D+1, we check D+1's load.
            const { finalDate: victimFinalDate, bumpedUpdates: cascadingUpdates } = resolveScheduling(
                nextDayStr,
                newVictimPerformance,
                allProgress
            );

            // Fetch original victim progress to update
            const originalVictimProgress = allProgress[victim.list][victim.id];

            const updatedVictim = {
                ...originalVictimProgress,
                nextReview: victimFinalDate,
                performance: newVictimPerformance // Update score if changed (4->3)
            };

            // Collect updates
            const bumpedUpdates = {
                [victim.list]: {
                    [victim.id]: updatedVictim
                }
            };

            // Merge cascading updates (if victim bumped someone else)
            if (cascadingUpdates) {
                Object.keys(cascadingUpdates).forEach(list => {
                    if (!bumpedUpdates[list]) bumpedUpdates[list] = {};
                    Object.assign(bumpedUpdates[list], cascadingUpdates[list]);
                });
            }

            return {
                finalDate: targetDateStr, // We take the spot
                bumpedUpdates: bumpedUpdates
            };
        }
    }

    // 3. No victims on target date. If we're high priority, search nearby dates for bumpable victims.
    if (performance <= 3) {
        const targetDateObj = parseLocalDate(targetDateStr);
        const todayStr = toLocalDateStr(new Date());

        // Search forward from target date for a day with a score 4+ victim
        for (let scanOffset = 1; scanOffset <= 30; scanOffset++) {
            const scanDate = new Date(targetDateObj);
            scanDate.setDate(targetDateObj.getDate() + scanOffset);
            const scanDateStr = toLocalDateStr(scanDate);

            // Don't scan past dates
            if (scanDateStr <= todayStr) continue;

            // Find bumpable victims on this date
            const itemsOnScanDate = [];
            Object.keys(allProgress).forEach(listName => {
                Object.keys(allProgress[listName]).forEach(id => {
                    const p = allProgress[listName][id];
                    if (p.nextReview === scanDateStr) {
                        itemsOnScanDate.push({ list: listName, id: id, performance: p.performance || 3 });
                    }
                });
            });

            const bumpCandidates = itemsOnScanDate.filter(item => item.performance >= 4)
                .sort((a, b) => b.performance - a.performance);

            const victim = bumpCandidates[0];
            if (victim) {
                // Found a victim on a nearby date - bump them and take their spot
                const victimDateObj = new Date(scanDate);
                victimDateObj.setDate(scanDate.getDate() + 1);
                const nextDayStr = toLocalDateStr(victimDateObj);

                let newVictimPerformance = victim.performance;
                if (newVictimPerformance === 4) {
                    newVictimPerformance = 3;
                }

                const { finalDate: victimFinalDate, bumpedUpdates: cascadingUpdates } = resolveScheduling(
                    nextDayStr,
                    newVictimPerformance,
                    allProgress
                );

                const originalVictimProgress = allProgress[victim.list][victim.id];
                const updatedVictim = {
                    ...originalVictimProgress,
                    nextReview: victimFinalDate,
                    performance: newVictimPerformance
                };

                const bumpedUpdates = {
                    [victim.list]: {
                        [victim.id]: updatedVictim
                    }
                };

                if (cascadingUpdates) {
                    Object.keys(cascadingUpdates).forEach(list => {
                        if (!bumpedUpdates[list]) bumpedUpdates[list] = {};
                        Object.assign(bumpedUpdates[list], cascadingUpdates[list]);
                    });
                }

                return {
                    finalDate: scanDateStr, // Take the victim's spot on the nearby date
                    bumpedUpdates: bumpedUpdates
                };
            }
        }
    }

    // 4. No bumping possible at all. Standard find next slot.
    const targetDateObj = parseLocalDate(targetDateStr);
    const bestDate = performLoadBalancing(targetDateObj, allProgress);
    return { finalDate: bestDate, bumpedUpdates: null };
};


/**
 * Finds the best date for scheduling, avoiding overloaded days.
 * Used as fallback for low priority or when no victims found.
 */
const performLoadBalancing = (targetDate, allProgress) => {
    const dailyCounts = {};
    Object.values(allProgress).forEach(list => {
        Object.values(list).forEach(p => {
            if (p.nextReview) {
                dailyCounts[p.nextReview] = (dailyCounts[p.nextReview] || 0) + 1;
            }
        });
    });

    let bestDate = new Date(targetDate);
    let offset = 0;
    let found = false;

    while (!found && offset < 365) {
        const checkDatePos = new Date(targetDate);
        checkDatePos.setDate(targetDate.getDate() + offset);
        const dateStrPos = toLocalDateStr(checkDatePos);

        if ((dailyCounts[dateStrPos] || 0) < DAILY_LIMIT) {
            bestDate = checkDatePos;
            found = true;
            break;
        }

        if (offset !== 0) {
            const checkDateNeg = new Date(targetDate);
            checkDateNeg.setDate(targetDate.getDate() - offset);
            const todayStr = toLocalDateStr(new Date());
            const dateStrNeg = toLocalDateStr(checkDateNeg);

            if (dateStrNeg > todayStr && (dailyCounts[dateStrNeg] || 0) < DAILY_LIMIT) {
                bestDate = checkDateNeg;
                found = true;
                break;
            }
        }
        offset++;
    }
    return toLocalDateStr(bestDate);
};


export const getReviewStatus = (problemId, progress) => {
    const prob = progress[problemId];
    if (!prob || !prob.solved) return 'unsolved';

    const today = toLocalDateStr(new Date());
    if (!prob.nextReview || prob.nextReview <= today) return 'due';

    return 'future';
};

/**
 * Generates a forecast of tasks for the next days.
 * @param {object} allProgress - The global progress object { listName: { problemId: { ... } } }
 * @param {number} days - Number of days to forecast (default 11: today + 10 days)
 * @returns {Array} Array of day objects: { date: 'YYYY-MM-DD', label: '0'...'10', tasks: [] }
 */
export const getDailyForecast = (allProgress, days = 11) => {
    const forecast = [];
    const today = new Date();

    // 1. Collect all scheduled reviews
    const reviewsByDate = {};

    // Helper to add task to date bucket
    const addToDate = (dateStr, task) => {
        if (!reviewsByDate[dateStr]) {
            reviewsByDate[dateStr] = [];
        }
        reviewsByDate[dateStr].push(task);
    };

    // Iterate through all lists and problems
    Object.keys(allProgress).forEach(listName => {
        Object.keys(allProgress[listName]).forEach(problemId => {
            const prob = allProgress[listName][problemId];

            // Only care about solved problems with a nextReview date
            if (prob.solved && prob.nextReview) {
                // Determine if it's "Due Today" (or overdue) or "Future"
                const todayStr = toLocalDateStr(today);
                let targetDate = prob.nextReview;

                // If due in the past, group it with today
                if (targetDate < todayStr) {
                    targetDate = todayStr;
                }

                addToDate(targetDate, {
                    id: problemId,
                    list: listName,
                    performance: prob.performance || 0, // Default to 0 (no color) if undefined
                    difficulty: prob.difficulty
                });
            }
        });
    });

    // 2. Build the forecast array
    for (let i = 0; i < days; i++) {
        const dateObj = new Date(today);
        dateObj.setDate(today.getDate() + i);
        const dateStr = toLocalDateStr(dateObj);

        const dayLabel = dateObj.getDate();

        forecast.push({
            dayIndex: i,
            date: dateStr,
            label: dayLabel,
            tasks: reviewsByDate[dateStr] || []
        });
    }

    return forecast;
};
