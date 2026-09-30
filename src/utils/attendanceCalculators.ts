import { SubjectAttendanceStat } from '../types';

export interface ShortagePrediction {
  currentPercentage: number;
  threshold: number;
  classesNeededToReachThreshold: number;
  canBunkClasses: number;
  status: 'critical' | 'warning' | 'safe';
  recommendation: string;
}

/**
 * Calculates how many consecutive classes must be attended to reach target percentage:
 * (attended + x) / (total + x) >= target / 100
 * attended + x >= (target / 100) * total + (target / 100) * x
 * x * (1 - target / 100) >= (target / 100) * total - attended
 * x >= (target * total - 100 * attended) / (100 - target)
 */
export function calculateAttendancePrediction(
  attended: number,
  total: number,
  threshold: number = 75
): ShortagePrediction {
  if (total === 0) {
    return {
      currentPercentage: 100,
      threshold,
      classesNeededToReachThreshold: 0,
      canBunkClasses: 0,
      status: 'safe',
      recommendation: 'No classes held yet for this subject.',
    };
  }

  const currentPercentage = Math.round((attended / total) * 1000) / 10;

  if (currentPercentage < threshold) {
    // Needs to attend X more classes without missing any
    const numerator = (threshold * total) - (100 * attended);
    const denominator = 100 - threshold;
    const classesNeeded = Math.ceil(numerator / denominator);

    const isCritical = currentPercentage < 65;

    return {
      currentPercentage,
      threshold,
      classesNeededToReachThreshold: Math.max(1, classesNeeded),
      canBunkClasses: 0,
      status: isCritical ? 'critical' : 'warning',
      recommendation: `You must attend the next ${classesNeeded} consecutive class${classesNeeded > 1 ? 'es' : ''} to recover above the mandatory ${threshold}% threshold!`,
    };
  } else {
    // Can miss Y classes: (attended) / (total + Y) >= threshold / 100
    // attended * 100 / threshold >= total + Y
    // Y <= (attended * 100 / threshold) - total
    const maxTotalAllowed = (attended * 100) / threshold;
    const canBunk = Math.floor(maxTotalAllowed - total);

    return {
      currentPercentage,
      threshold,
      classesNeededToReachThreshold: 0,
      canBunkClasses: Math.max(0, canBunk),
      status: 'safe',
      recommendation: canBunk > 0
        ? `You can safely miss up to ${canBunk} class${canBunk > 1 ? 'es' : ''} and still maintain the ≥ ${threshold}% academic requirement.`
        : `You are exactly at safe standing. Avoid missing the next lecture to prevent falling into shortage!`,
    };
  }
}

/**
 * Calculates combined overall attendance from an array of subject stats
 */
export function calculateOverallAttendance(stats: SubjectAttendanceStat[]): {
  overallPercentage: number;
  totalPeriods: number;
  attendedPeriods: number;
  shortageCount: number;
} {
  if (!stats || stats.length === 0) {
    return { overallPercentage: 0, totalPeriods: 0, attendedPeriods: 0, shortageCount: 0 };
  }

  let total = 0;
  let attended = 0;
  let shortage = 0;

  stats.forEach((s) => {
    total += s.totalPeriods;
    attended += s.attendedPeriods;
    if (s.percentage < 75) {
      shortage++;
    }
  });

  const overall = total > 0 ? Math.round((attended / total) * 1000) / 10 : 0;
  return {
    overallPercentage: overall,
    totalPeriods: total,
    attendedPeriods: attended,
    shortageCount: shortage,
  };
}
