export const omitId = <T extends { [key: string]: string }>(
  obj: T,
): Omit<T, 'id'> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, ...rest } = obj;
  return rest;
};

export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const past = new Date(timestamp);

  const diffMs = now.getTime() - past.getTime();
  const seconds = Math.floor(diffMs / 1000);

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days}d ago`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 52) {
    return `${weeks}w ago`;
  }

  const years = Math.floor(days / 365);
  return `${years}y ago`;
};

export const formatDateAndTimeString = (timestamp: string) => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) {
    return '';
  }

  const formatted = new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: '2-digit',
    year: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
    .format(date)
    .replace(',', ' //');
  return formatted;
};

export const timeDuration = (
  createdTimestamp: string,
  completedTimestamp?: string,
) => {
  if (!completedTimestamp) {
    return 'Not Finished';
  }
  const t1 = new Date(createdTimestamp);
  const t2 = new Date(completedTimestamp);

  if (isNaN(t1.getTime()) || isNaN(t2.getTime())) {
    return 'N/A';
  }

  const diffMs = t2.getTime() - t1.getTime();

  const totalSeconds = Math.floor(diffMs / 1000);

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formatted = `${minutes}m ${seconds}s`;
  return formatted;
};

export const formatAverage = (value: number) => {
  const rounded = Math.round(value * 10) / 10;

  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
};
