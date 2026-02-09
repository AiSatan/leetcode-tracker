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

    // 3. Find Target Day
    const today = new Date();
    const targetDatePromise = new Date(today);
    targetDatePromise.setDate(today.getDate() + newInterval);
    const targetDateStr = targetDatePromise.toISOString().split('T')[0];

    // 4. Load Balancing & Priority Bumping
    const updates = {};

    // Attempt to schedule on target date
    const { finalDate, bumpedUpdates } = resolveScheduling(targetDateStr, performance, allProgress);

    // Prepare current problem update
    const addedVRuntime = newInterval / weight;
    const newProgress = {
        ...currentProgress,
        solved: true,
        lastReviewed: today.toISOString().split('T')[0],
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
            const victimDateObj = new Date(targetDateStr);
            victimDateObj.setDate(victimDateObj.getDate() + 1);
            const nextDayStr = victimDateObj.toISOString().split('T')[0];

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

    // 3. No bumping possible (we are low priority, or day filled with high priority). Standard find next slot.
    const targetDateObj = new Date(targetDateStr);
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
        const dateStrPos = checkDatePos.toISOString().split('T')[0];

        if ((dailyCounts[dateStrPos] || 0) < DAILY_LIMIT) {
            bestDate = checkDatePos;
            found = true;
            break;
        }

        if (offset !== 0) {
            const checkDateNeg = new Date(targetDate);
            checkDateNeg.setDate(targetDate.getDate() - offset);
            const todayStr = new Date().toISOString().split('T')[0];
            const dateStrNeg = checkDateNeg.toISOString().split('T')[0];

            if (dateStrNeg > todayStr && (dailyCounts[dateStrNeg] || 0) < DAILY_LIMIT) {
                bestDate = checkDateNeg;
                found = true;
                break;
            }
        }
        offset++;
    }
    return bestDate.toISOString().split('T')[0];
};


export const getReviewStatus = (problemId, progress) => {
    const prob = progress[problemId];
    if (!prob || !prob.solved) return 'unsolved';

    const today = new Date().toISOString().split('T')[0];
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
                const todayStr = today.toISOString().split('T')[0];
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
        const dateStr = dateObj.toISOString().split('T')[0];

        const dayLabel = i === 0 ? "0" : `${i}`;

        forecast.push({
            dayIndex: i,
            date: dateStr,
            label: dayLabel,
            tasks: reviewsByDate[dateStr] || []
        });
    }

    return forecast;
};
