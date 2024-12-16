import { intervalToDuration } from "date-fns";

export function getTimeDuration(start?: Date | null, end?: Date | null) {
  if (!start || !end) return null;
  const diff = end.getTime() - start.getTime();
  if (diff < 1000) return `${diff}ms`;
  const duration = intervalToDuration({
    start: 0,
    end: diff
  });

  return `${duration.minutes || 0}m ${duration.seconds || 0}s`;
}