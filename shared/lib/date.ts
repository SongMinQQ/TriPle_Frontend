const parseDateParts = (
  value: string
): { year: string; month: string; day: string } | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
  if (!match) {
    return null;
  }

  return {
    year: match[1],
    month: match[2],
    day: match[3],
  };
};

export const formatIsoDateToDot = (value: string): string => {
  const dateParts = parseDateParts(value);
  if (!dateParts) {
    return value;
  }

  return `${dateParts.year}.${dateParts.month}.${dateParts.day}`;
};

export const formatIsoDateToShort = (value: string): string => {
  const dateParts = parseDateParts(value);
  if (!dateParts) {
    return value;
  }

  return `${dateParts.year.slice(2)}.${dateParts.month}.${dateParts.day}`;
};

export const calculateInclusiveDayCountFromIsoDates = (
  startAt: string,
  endAt: string
): number => {
  const startParts = parseDateParts(startAt);
  const endParts = parseDateParts(endAt);

  if (!startParts || !endParts) {
    return 1;
  }

  const startUtc = Date.UTC(
    Number(startParts.year),
    Number(startParts.month) - 1,
    Number(startParts.day)
  );
  const endUtc = Date.UTC(
    Number(endParts.year),
    Number(endParts.month) - 1,
    Number(endParts.day)
  );

  const diffDays = Math.floor((endUtc - startUtc) / (1000 * 60 * 60 * 24)) + 1;
  return Number.isFinite(diffDays) ? Math.max(1, diffDays) : 1;
};
